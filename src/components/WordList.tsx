import { cn } from "@/lib/utils"; // Utilidad para gestionar clases de Tailwind de forma limpia

// Definición de las props
interface WordListProps {
  words: string[];              // El array con todas las palabras del juego
  foundWords: Set<string>;      // Un Set con las palabras que ya se encontraron (mejor rendimiento que un array)
  player1FoundWords?: string[]; // Palabras que encontró el jugador 1
  player2FoundWords?: string[]; // Palabras que encontró el jugador 2
  isMultiplayer?: boolean;      // ¿Estamos en modo versus?
}

export const WordList = ({
  words,
  foundWords,
  player1FoundWords = [],
  player2FoundWords = [],
  isMultiplayer = false,
}: WordListProps) => {
  return (
    <div className="bg-card rounded-2xl shadow-lg p-1.5 sm:p-4 h-fit">
      {/* TÍTULO Y CONTADOR MÓVIL */}
      <div className="flex items-center justify-between mb-1 sm:mb-3">
        <h2 className="text-[11px] sm:text-lg font-bold text-foreground flex items-center gap-0.5 sm:gap-2">
          <span className="text-sm sm:text-xl">🎯</span>
          Palabras
        </h2>
        {/* Este contador solo se ve en pantallas pequeñas (móviles) */}
        <div className="text-right sm:hidden">
          <div className="text-[10px] font-bold text-primary">
            {foundWords.size}/{words.length}
          </div>
        </div>
      </div>

      {/* CUADRÍCULA DE PALABRAS */}
      <div className="grid grid-cols-2 gap-1 sm:gap-2">
        {words.map((word, index) => {
          // Lógica de estado para cada palabra
          const isFound = foundWords.has(word);
          const foundByPlayer1 = player1FoundWords.includes(word);
          const foundByPlayer2 = player2FoundWords.includes(word);

          return (
            <div
              key={index}
              className={cn(
                // Clases base: centradas, bordes redondeados y transiciones suaves
                "px-1 sm:px-3 py-0.5 sm:py-2 rounded-lg font-medium text-center transition-all duration-300 text-[10px] sm:text-sm",
                
                // SI LA PALABRA SE ENCONTRÓ:
                isFound
                  ? isMultiplayer
                    ? foundByPlayer1
                      ? "bg-blue-500/20 text-blue-500 line-through animate-bounce-in" // Azul (P1)
                      : "bg-red-500/20 text-red-500 line-through animate-bounce-in"  // Rojo (P2)
                    : "bg-green-500/20 text-green-600 line-through animate-bounce-in" // Verde (Solitario)
                  
                // SI NO SE HA ENCONTRADO:
                  : "bg-muted text-muted-foreground",
              )}
            >
              {word}
            </div>
          );
        })}
      </div>

      {/* PROGRESO EN ESCRITORIO */}
      {/* Este bloque se oculta en móviles y se muestra en pantallas 'sm' en adelante */}
      <div className="hidden sm:block mt-3 sm:mt-4 text-center">
        <div className="text-xs text-muted-foreground">Progreso</div>
        <div className="text-xl sm:text-2xl font-bold text-primary mt-0.5">
          {foundWords.size} / {words.length}
        </div>
      </div>
    </div>
  );
};