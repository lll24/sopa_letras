import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Copy, Trophy } from "lucide-react";
import { WordGrid } from "@/components/WordGrid";
import { WordList } from "@/components/WordList";
import { useMultiplayerGame } from "@/hooks/useMultiplayerGame";
import { toast } from "sonner";
import { useEffect } from "react";

const MultiplayerGame = () => {
  const { roomCode } = useParams<{ roomCode: string }>();
  const [searchParams] = useSearchParams();
  
  const blurEnabled = searchParams.get('blur') === 'true';
  const modoFacil = searchParams.get('facil') === 'true'; 
  const isHost = searchParams.get('host') === 'true'; // <--- 1. Detectamos si es Host
  
  const navigate = useNavigate();

  const { gameState, playerState, players, timeRemaining, handleWordFound, isMyTurn, shouldBlur } = useMultiplayerGame(
    roomCode || "",
    blurEnabled,
    modoFacil,
    isHost // <--- 2. Se lo pasamos como 4to parámetro
  );

  

  const copyRoomCode = () => {
    navigator.clipboard.writeText(roomCode || "");
    toast.success("Código copiado al portapapeles");
  };

  useEffect(() => {
    if (gameState?.winner) {
      // Mostrar pantalla de ganador
      setTimeout(() => {
        const winnerMessage =
          gameState.winner === "empate"
            ? "¡Empate! Ambos jugadores encontraron el mismo número de palabras"
            : gameState.winner === `player${playerState?.playerNumber}`
              ? "¡Felicidades! ¡Ganaste el juego! 🏆"
              : `El ${gameState.winner === "player1" ? "Jugador Azul" : "Jugador Rojo"} ganó el juego`;

        toast.success(winnerMessage, {
          duration: 5000,
        });
      }, 500);
    }
  }, [gameState?.winner, playerState?.playerNumber]);

  if (!gameState || !playerState) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-secondary/10 p-4 flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="text-2xl font-bold">Esperando jugadores...</div>
          <div className="bg-card p-6 rounded-xl space-y-4">
            <p className="text-muted-foreground">Código de sala:</p>
            <div className="flex items-center gap-2">
              <div className="text-3xl font-mono font-bold bg-primary/10 px-6 py-3 rounded-lg">{roomCode}</div>
              <Button onClick={copyRoomCode} variant="outline" size="icon">
                <Copy className="w-4 h-4" />
              </Button>
            </div>
            <p className="text-sm text-muted-foreground">Jugadores conectados: {players.length}/2</p>
          </div>
        </div>
      </div>
    );
  }

  const myFoundWords = playerState.playerNumber === 1 ? gameState.player1FoundWords : gameState.player2FoundWords;
  const opponentFoundWords = playerState.playerNumber === 1 ? gameState.player2FoundWords : gameState.player1FoundWords;
  const allFoundWords = new Set([...gameState.player1FoundWords, ...gameState.player2FoundWords]);
  const myColor = playerState.playerNumber === 1 ? "text-blue-500" : "text-red-500";
  const opponentColor = playerState.playerNumber === 1 ? "text-red-500" : "text-blue-500";

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-secondary/10 p-1 sm:p-4 touch-none overscroll-none overflow-x-hidden">
      <div className="max-w-6xl mx-auto space-y-1 sm:space-y-3 py-1 sm:py-4">
        <Button variant="ghost" onClick={() => navigate("/multiplayer")} className="mb-0.5 h-8 text-xs sm:text-sm sm:h-10">
          <ArrowLeft className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
          Salir
        </Button>

        {/* Pantalla de ganador */}
        {gameState.winner && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
            <div className="bg-card p-8 rounded-2xl shadow-2xl max-w-md w-full mx-4 text-center space-y-6">
              <Trophy className="w-20 h-20 mx-auto text-yellow-500" />
              <h2 className="text-3xl font-bold">
                {gameState.winner === "empate"
                  ? "¡Empate!"
                  : gameState.winner === `player${playerState.playerNumber}`
                    ? "¡Felicidades!"
                    : "Fin del Juego"}
              </h2>
              <p className="text-xl">
                {gameState.winner === "empate"
                  ? "Ambos jugadores encontraron el mismo número de palabras"
                  : gameState.winner === `player${playerState.playerNumber}`
                    ? "¡Ganaste el juego! 🏆"
                    : `El ${gameState.winner === "player1" ? "Jugador Azul" : "Jugador Rojo"} ganó`}
              </p>
              <div className="flex gap-4 justify-center text-lg font-semibold">
                <div className="text-blue-500">Azul: {gameState.player1FoundWords.length}</div>
                <div className="text-red-500">Rojo: {gameState.player2FoundWords.length}</div>
              </div>
              <Button onClick={() => navigate("/multiplayer")} className="w-full" size="lg">
                Volver al Menú
              </Button>
            </div>
          </div>
        )}

        {/* Header del juego */}
        <div className="bg-card rounded-xl p-1 sm:p-4 space-y-0.5 sm:space-y-3">
          <div className="flex justify-between items-center">
            <div className="text-[10px] sm:text-sm text-muted-foreground">
              <span className="font-mono font-bold">{roomCode}</span>
            </div>
            <Button onClick={copyRoomCode} variant="outline" size="sm" className="h-6 sm:h-9 text-[10px] sm:text-sm px-2 sm:px-4">
              <Copy className="w-3 h-3 sm:w-4 sm:h-4 mr-0.5 sm:mr-2" />
              <span className="hidden sm:inline">Copiar</span>
            </Button>
          </div>

          <div className="grid grid-cols-2 gap-1 sm:gap-3">
            <div className={`p-0.5 sm:p-3 rounded-lg ${playerState.playerNumber === 1 ? "bg-blue-500/20 border-2 border-blue-500" : "bg-red-500/10"}`}>
              <div className="text-[9px] sm:text-sm font-semibold text-blue-500">
                Azul {playerState.playerNumber === 1 && "(Tú)"}
              </div>
              <div className="text-sm sm:text-2xl font-bold">{gameState.player1FoundWords.length}</div>
            </div>
            <div className={`p-0.5 sm:p-3 rounded-lg ${playerState.playerNumber === 2 ? "bg-red-500/20 border-2 border-red-500" : "bg-blue-500/10"}`}>
              <div className="text-[9px] sm:text-sm font-semibold text-red-500">
                Rojo {playerState.playerNumber === 2 && "(Tú)"}
              </div>
              <div className="text-sm sm:text-2xl font-bold">{gameState.player2FoundWords.length}</div>
            </div>
          </div>

          <div className="w-fit mx-auto flex items-center gap-1.5 sm:gap-2 py-0.5 sm:py-0">
            <span className={`text-[10px] sm:text-sm font-semibold ${gameState.currentTurn === "player1" ? "text-blue-500" : "text-red-500"}`}>
              {gameState.currentTurn === `player${playerState.playerNumber}` ? "Tú" : "Oponente"}
            </span>
            <span className="text-[11px] sm:text-lg font-mono font-bold px-1.5 sm:px-2 py-0.5 rounded-md bg-muted text-foreground">
              {Math.floor(timeRemaining / 60)}:{(timeRemaining % 60).toString().padStart(2, "0")}
            </span>
          </div>
        </div>
        
        <div className="sm:hidden bg-card/50 backdrop-blur-sm rounded-lg p-1 text-center text-[9px]">
          <p className={myColor}>Tus palabras: {myFoundWords.join(", ") || "Ninguna"}</p>
          <p className={opponentColor}>Oponente: {opponentFoundWords.join(", ") || "Ninguna"}</p>
        </div>

        {/* CONTENEDOR PRINCIPAL DEL TABLERO Y LISTA */}
        <div className="grid lg:grid-cols-[1fr_280px] gap-1.5 sm:gap-4">
          
          {/* EL FIX DEL BLUR ESTÁ AQUÍ */}
          <div className="relative rounded-xl overflow-hidden">
            
            {/* 1. Dibujamos la Sopa de Letras primero */}
            <WordGrid
              grid={gameState.grid}
              foundWords={allFoundWords}
              onWordFound={handleWordFound}
              words={gameState.words}
              wordPositions={gameState.wordPositions}
              player1FoundWords={gameState.player1FoundWords}
              player2FoundWords={gameState.player2FoundWords}
            />

            {/* 2. Dibujamos el Blur por encima (z-50) si toca bloquear */}
            {shouldBlur && (
              <div className="absolute inset-0 z-50 flex items-center justify-center bg-background/40 backdrop-blur-md transition-all duration-300 touch-none">
                <div className="bg-card/95 p-6 rounded-2xl shadow-2xl text-center border-2 border-primary/20">
                  <p className="text-3xl mb-2">🛑</p>
                  <p className="text-xl font-black text-foreground">¡Espera!</p>
                  <p className="text-sm text-muted-foreground mt-1">Turno del oponente...</p>
                </div>
              </div>
            )}
            
          </div>

          {/* LISTA DE PALABRAS */}
          <WordList
            words={gameState.words}
            foundWords={allFoundWords}
            player1FoundWords={gameState.player1FoundWords}
            player2FoundWords={gameState.player2FoundWords}
            isMultiplayer={true}
          />
        </div>

        <div className="hidden sm:block bg-card/50 backdrop-blur-sm rounded-xl p-1.5 sm:p-3 text-center text-[10px] sm:text-sm">
          <p className={myColor}>Tus palabras: {myFoundWords.join(", ") || "Ninguna"}</p>
          <p className={opponentColor}>Oponente: {opponentFoundWords.join(", ") || "Ninguna"}</p>
        </div>
      </div>
    </div>
  );
};

export default MultiplayerGame;