import { useState, useEffect, useCallback } from 'react';
import { useRealtimeSocket } from './useRealtimeSocket';
import { generateWordSearch, WORD_THEMES } from '@/utils/wordSearchGenerator';

// --- INTERFACES: Estructura de datos del juego ---
interface Position { row: number; col: number; }

interface WordPosition {
  word: string;
  positions: Position[];
  direction: string;
}

interface GameState {
  grid: string[][];
  words: string[];
  wordPositions: WordPosition[];
  theme: string;
  player1FoundWords: string[];
  player2FoundWords: string[];
  currentTurn: 'player1' | 'player2';
  turnStartedAt: number;
  winner: string | null;
  gameStarted: boolean;
  blurEnabled: boolean;
}

export const useMultiplayerGame = (
  roomCode: string, 
  blurEnabled: boolean = false, 
  modoFacil: boolean = false,
  isHost: boolean = false
) => {
  // Identidad Única del Jugador
  const getPlayerId = useCallback(() => {
    let id = localStorage.getItem('playerId');
    if (!id) {
      id = Math.random().toString(36).substring(7);
      localStorage.setItem('playerId', id);
    }
    return id;
  }, []);

  const playerId = getPlayerId();
  const { emit, on, onlinePlayers } = useRealtimeSocket(roomCode, playerId);

  // Estados Locales
  const [gameState, setGameState] = useState<GameState | null>(null);
  const [timeRemaining, setTimeRemaining] = useState<number>(30);
  const [localTurnStart, setLocalTurnStart] = useState<number | null>(null);
  const [myPlayerNumber, setMyPlayerNumber] = useState<number | null>(null);

  // Lógica para generar el tablero (Solo la ejecuta el Líder/Host)
  const initializeGame = useCallback(() => {
    const themeKeys = Object.keys(WORD_THEMES);
    const theme = themeKeys[Math.floor(Math.random() * themeKeys.length)];
    const gameData = generateWordSearch(WORD_THEMES[theme as keyof typeof WORD_THEMES], 10, modoFacil);
    
    return {
      grid: gameData.grid,
      words: gameData.words,
      wordPositions: gameData.wordPositions,
      theme,
      player1FoundWords: [],
      player2FoundWords: [],
      currentTurn: 'player1',
      turnStartedAt: Date.now(),
      winner: null,
      gameStarted: true,
      blurEnabled,
    } as GameState;
  }, [blurEnabled, modoFacil]);

  // 2. ASIGNACIÓN FIJA: Si es Host es Player 1 (Azul), si no, Player 2 (Rojo)
  useEffect(() => {
    if (onlinePlayers.length === 2 && myPlayerNumber === null) {
      const asignado = isHost ? 1 : 2;
      setMyPlayerNumber(asignado);
      console.log(`%c ROL ASIGNADO: Jugador ${asignado}`, "color: yellow; font-weight: bold;");
    }
  }, [onlinePlayers.length, isHost, myPlayerNumber]);

  // Escuchadores del Socket
  useEffect(() => {
    on('game:init', (payload) => {
      setGameState(payload);
      setLocalTurnStart(Date.now());
    });

    on('word:found', (payload) => {
      setGameState((prev) => {
        if (!prev) return prev;
        const { word, player } = payload;
        if (prev.player1FoundWords.includes(word) || prev.player2FoundWords.includes(word)) return prev;

        const updatedState = {
          ...prev,
          player1FoundWords: player === 'player1' ? [...prev.player1FoundWords, word] : prev.player1FoundWords,
          player2FoundWords: player === 'player2' ? [...prev.player2FoundWords, word] : prev.player2FoundWords,
        };

        const p1Score = updatedState.player1FoundWords.length;
        const p2Score = updatedState.player2FoundWords.length;
        const totalFound = p1Score + p2Score;
        const remainingWords = prev.words.length - totalFound;

        if (totalFound === prev.words.length || p1Score > p2Score + remainingWords || p2Score > p1Score + remainingWords) {
          updatedState.winner = p1Score > p2Score ? 'player1' : p2Score > p1Score ? 'player2' : 'empate';
        }
        return updatedState;
      });
    });

    on('turn:switch', (payload) => {
      setLocalTurnStart(Date.now());
      setGameState(prev => prev ? { ...prev, currentTurn: payload.currentTurn } : null);
    });
  }, [on]);

  // Lógica de ARRANQUE (Solo el Jugador 1 envía el tablero)
  useEffect(() => {
    if (onlinePlayers.length === 2 && !gameState?.gameStarted && myPlayerNumber === 1) {
      const timer = setTimeout(() => {
        emit('game:init', initializeGame());
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [onlinePlayers.length, gameState?.gameStarted, myPlayerNumber, emit, initializeGame]);

  // Temporizador
  useEffect(() => {
    if (!gameState || gameState.winner || !localTurnStart) return;
    const interval = setInterval(() => {
      const elapsed = Math.floor((Date.now() - localTurnStart) / 1000);
      const remaining = Math.max(0, 30 - elapsed);
      setTimeRemaining(remaining);
      if (remaining === 0 && myPlayerNumber === 1) {
        const nextTurn = gameState.currentTurn === 'player1' ? 'player2' : 'player1';
        emit('turn:switch', { currentTurn: nextTurn, turnStartedAt: Date.now() });
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [gameState, localTurnStart, emit, myPlayerNumber]);

  const handleWordFound = (word: string) => {
    if (!gameState || !myPlayerNumber) return;
    const playerKey = `player${myPlayerNumber}` as 'player1' | 'player2';
    if (gameState.currentTurn === playerKey) {
      emit('word:found', { word, player: playerKey });
    }
  };

  return {
    gameState,
    playerState: myPlayerNumber ? { playerNumber: myPlayerNumber as 1 | 2 } : null,
    players: onlinePlayers,
    timeRemaining,
    handleWordFound,
    isMyTurn: gameState?.currentTurn === `player${myPlayerNumber}`,
    shouldBlur: gameState?.blurEnabled && gameState.currentTurn !== `player${myPlayerNumber}` && !gameState?.winner
  };
};