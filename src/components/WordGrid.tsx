import { useState, useRef, useEffect, useCallback } from "react";
import { cn } from "@/lib/utils";

// --- INTERFACES: Definición de la estructura de datos ---
interface Position {
  row: number;
  col: number;
}

interface WordPosition {
  word: string;
  positions: Position[];
  direction: string;
}

interface WordGridProps {
  grid: string[][];               // Matriz de letras (la sopa)
  foundWords: Set<string>;        // Palabras ya encontradas
  onWordFound: (word: string) => void; // Función que se dispara al hallar una palabra
  words: string[];                // Lista de todas las palabras a buscar
  wordPositions: WordPosition[];  // Dónde está cada palabra en el grid
  player1FoundWords?: string[];   // Palabras halladas por el Jugador 1 (Azul)
  player2FoundWords?: string[];   // Palabras halladas por el Jugador 2 (Rojo)
}

export const WordGrid = ({ 
  grid, 
  foundWords, 
  onWordFound, 
  words, 
  wordPositions, 
  player1FoundWords = [], 
  player2FoundWords = [] 
}: WordGridProps) => {
  
  // --- ESTADOS ---
  const [selectedCells, setSelectedCells] = useState<Position[]>([]); // Letras que el usuario está pisando ahora
  const [isSelecting, setIsSelecting] = useState(false);              // ¿Está el usuario arrastrando el mouse/dedo?
  const [linePositions, setLinePositions] = useState<{ 
    startX: number; startY: number; endX: number; endY: number; color: string 
  }[]>([]); // Coordenadas para dibujar las líneas SVG
  
  const gridRef = useRef<HTMLDivElement>(null); // Referencia al contenedor para medir distancias

  /**
   * Determina qué líneas hay que dibujar y de qué color según quién encontró la palabra.
   */
  const getFoundWordLines = () => {
    const lines: { positions: Position[]; direction: string; color: string }[] = [];

    wordPositions.forEach(({ word, positions, direction }) => {
      if (foundWords.has(word)) {
        // Lógica de colores: Azul para P1, Rojo para P2, Verde por defecto
        const color = player1FoundWords.includes(word) 
          ? '#3b82f6' 
          : player2FoundWords.includes(word) 
            ? '#ef4444' 
            : '#22c55e';
        lines.push({ positions, direction, color });
      }
    });

    return lines;
  };

  /**
   * Transforma las coordenadas de la matriz (fila/columna) en píxeles reales (X/Y)
   * para que las líneas SVG queden centradas sobre las letras.
   */
  const calculateLinePositions = useCallback(() => {
    if (!gridRef.current) return [];

    const foundWordLines = getFoundWordLines();
    const positions: { startX: number; startY: number; endX: number; endY: number; color: string }[] = [];

    foundWordLines.forEach((line) => {
      if (line.positions.length === 0) return;

      const firstPos = line.positions[0];
      const lastPos = line.positions[line.positions.length - 1];

      // Buscamos los elementos del DOM por sus atributos data-row y data-col
      const firstCell = gridRef.current?.querySelector(
        `[data-row="${firstPos.row}"][data-col="${firstPos.col}"]`,
      ) as HTMLElement;
      const lastCell = gridRef.current?.querySelector(
        `[data-row="${lastPos.row}"][data-col="${lastPos.col}"]`,
      ) as HTMLElement;

      if (firstCell && lastCell) {
        const firstRect = firstCell.getBoundingClientRect();
        const lastRect = lastCell.getBoundingClientRect();
        const gridRect = gridRef.current.getBoundingClientRect();

        // Cálculo matemático para hallar el centro exacto de cada celda
        positions.push({
          startX: firstRect.left + firstRect.width / 2 - gridRect.left,
          startY: firstRect.top + firstRect.height / 2 - gridRect.top,
          endX: lastRect.left + lastRect.width / 2 - gridRect.left,
          endY: lastRect.top + lastRect.height / 2 - gridRect.top,
          color: line.color,
        });
      }
    });

    return positions;
  }, [foundWords, wordPositions, player1FoundWords, player2FoundWords]);

  // Efecto para redibujar las líneas si cambia la ventana de tamaño o las palabras halladas
  useEffect(() => {
    const updateLinePositions = () => {
      const newPositions = calculateLinePositions();
      setLinePositions(newPositions);
    };

    updateLinePositions();
    window.addEventListener("resize", updateLinePositions);
    return () => window.removeEventListener("resize", updateLinePositions);
  }, [calculateLinePositions]);

  // Auxiliar para saber si una celda específica ya fue "tachada"
  const isCellInFoundWord = (row: number, col: number) => {
    return getFoundWordLines().some((line) => 
      line.positions.some((pos) => pos.row === row && pos.col === col)
    );
  };

  /**
   * Comprueba si lo que el usuario seleccionó es una palabra válida.
   */
  const checkWord = (cells: Position[]) => {
    if (cells.length < 2) return;

    const word = cells.map(({ row, col }) => grid[row][col]).join("");
    const reverseWord = word.split("").reverse().join("");

    // Verifica la palabra al derecho y al revés
    if (words.includes(word) && !foundWords.has(word)) {
      onWordFound(word);
    } else if (words.includes(reverseWord) && !foundWords.has(reverseWord)) {
      onWordFound(reverseWord);
    }
  };

  // --- MANEJADORES DE EVENTOS (INTERACCIÓN) ---

  const handleStart = (row: number, col: number) => {
    setIsSelecting(true);
    setSelectedCells([{ row, col }]);
  };

  const handleMove = (row: number, col: number) => {
    if (!isSelecting || selectedCells.length === 0) return;

    const firstCell = selectedCells[0];
    const lastCell = selectedCells[selectedCells.length - 1];

    if (selectedCells.length > 1 && lastCell.row === row && lastCell.col === col) return;

    const rowDiff = row - firstCell.row;
    const colDiff = col - firstCell.col;

    // Lógica para forzar que la selección sea solo H, V o Diagonal perfecta
    const rowDir = rowDiff === 0 ? 0 : rowDiff > 0 ? 1 : -1;
    const colDir = colDiff === 0 ? 0 : colDiff > 0 ? 1 : -1;

    if (rowDir === 0 || colDir === 0 || Math.abs(rowDiff) === Math.abs(colDiff)) {
      const newCells: Position[] = [firstCell];
      let currentRow = firstCell.row;
      let currentCol = firstCell.col;

      while (currentRow !== row || currentCol !== col) {
        currentRow += rowDir;
        currentCol += colDir;
        if (currentRow >= 0 && currentRow < grid.length && currentCol >= 0 && currentCol < grid[0].length) {
          newCells.push({ row: currentRow, col: currentCol });
        }
      }
      setSelectedCells(newCells);
    }
  };

  const handleEnd = () => {
    checkWord(selectedCells);
    setIsSelecting(false);
    setSelectedCells([]);
  };

  const isCellSelected = (row: number, col: number) => {
    return selectedCells.some((cell) => cell.row === row && cell.col === col);
  };

  // Soporte para móviles: Previene que la pantalla se mueva mientras seleccionas letras
  useEffect(() => {
    const handleTouchMove = (e: TouchEvent) => {
      if (!isSelecting || !gridRef.current) return;
      e.preventDefault(); 

      const touch = e.touches[0];
      const element = document.elementFromPoint(touch.clientX, touch.clientY);

      if (element?.hasAttribute("data-row")) {
        const row = parseInt(element.getAttribute("data-row")!);
        const col = parseInt(element.getAttribute("data-col")!);
        handleMove(row, col);
      }
    };

    document.addEventListener("touchmove", handleTouchMove, { passive: false });
    return () => document.removeEventListener("touchmove", handleTouchMove);
  }, [isSelecting, selectedCells]);

  // --- RENDERIZADO ---
  return (
    <div className="relative w-full touch-none">
      {/* Contenedor principal del Grid */}
      <div
        ref={gridRef}
        className="grid gap-0.5 sm:gap-1.5 p-1 sm:p-4 bg-card rounded-2xl shadow-lg select-none w-full relative touch-none overflow-hidden"
        style={{
          gridTemplateColumns: `repeat(${grid[0].length}, minmax(26px, 1fr))`,
        }}
      >
        {grid.map((row, rowIndex) =>
          row.map((letter, colIndex) => {
            const isSelected = isCellSelected(rowIndex, colIndex);
            const isFound = isCellInFoundWord(rowIndex, colIndex);

            return (
              <div
                key={`${rowIndex}-${colIndex}`}
                data-row={rowIndex}
                data-col={colIndex}
                className={cn(
                  "aspect-square flex items-center justify-center rounded-md font-bold text-[11px] sm:text-lg md:text-xl",
                  "bg-background border border-primary/20 cursor-pointer overflow-hidden",
                  "transition-all duration-200 relative min-w-[26px] min-h-[26px]",
                  "active:scale-95 leading-none",
                  isSelected && "bg-primary text-primary-foreground border-primary scale-105 shadow-lg",
                  isFound && "bg-green-100 dark:bg-green-900/30 border-green-300 dark:border-green-600",
                )}
                onMouseDown={() => handleStart(rowIndex, colIndex)}
                onMouseEnter={() => isSelecting && handleMove(rowIndex, colIndex)}
                onMouseUp={handleEnd}
                onTouchStart={() => handleStart(rowIndex, colIndex)}
                onTouchEnd={handleEnd}
              >
                {letter}
              </div>
            );
          }),
        )}
      </div>

      {/* Capa SVG para las líneas de palabras encontradas */}
      {linePositions.length > 0 && (
        <svg
          className="absolute top-0 left-0 w-full h-full pointer-events-none"
          style={{ zIndex: 10 }}
        >
          {linePositions.map((position, index) => (
            <line
              key={index}
              x1={position.startX}
              y1={position.startY}
              x2={position.endX}
              y2={position.endY}
              stroke={position.color}
              strokeWidth="3"
              strokeLinecap="round"
            />
          ))}
        </svg>
      )}
    </div>
  );
};