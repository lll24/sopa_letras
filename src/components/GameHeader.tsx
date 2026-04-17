import { Button } from "@/components/ui/button";
import { RotateCcw, Trophy } from "lucide-react";

// Definición de las propiedades (props) que recibe el componente
interface GameHeaderProps {
  onReset: () => void;     // Función para reiniciar el juego
  foundWords: number;      // Cantidad de palabras encontradas actualmente
  totalWords: number;      // Total de palabras en la sopa
  currentTheme?: string;   // Tema actual (opcional, ej: "Animales")
}

export const GameHeader = ({ onReset, foundWords, totalWords, currentTheme }: GameHeaderProps) => {
  // Lógica: Si las encontradas igualan al total, el juego terminó
  const isComplete = foundWords === totalWords;

  return (
    <div className="bg-card rounded-2xl shadow-lg p-3 sm:p-4">
      {/* Sección Superior: Título y Botón de Reinicio */}
      <div className="flex items-center justify-between mb-2 sm:mb-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Sopa de Letras
          </h1>
          {/* Muestra el tema solo si existe */}
          {currentTheme && (
            <p className="text-xs text-muted-foreground mt-0.5">
              Tema: <span className="font-medium capitalize">{currentTheme}</span>
            </p>
          )}
        </div>
        
        {/* Botón con efecto de rotación al pasar el mouse */}
        <Button
          onClick={onReset}
          size="icon"
          className="rounded-full bg-primary hover:bg-primary/90 transition-all hover:rotate-180 duration-300 h-8 w-8 sm:h-10 sm:w-10"
        >
          <RotateCcw className="h-4 w-4 sm:h-5 sm:w-5" />
        </Button>
      </div>

      {/* Sección Inferior: Contador y Mensaje de Victoria */}
      <div className="flex items-center justify-between">
        <div className="text-sm sm:text-base font-medium">
          {foundWords}/{totalWords} palabras
        </div>

        {/* Badge de "Felicidades" que aparece solo al ganar */}
        {isComplete && (
          <div className="bg-gradient-to-r from-success/20 to-accent/20 rounded-xl p-2 sm:p-3 animate-bounce-in flex items-center gap-2">
            <Trophy className="h-5 w-5 sm:h-6 sm:w-6 text-success" />
            <div>
              <div className="font-bold text-success text-sm sm:text-base">¡Felicidades!</div>
              <div className="text-xs text-foreground/70 hidden sm:block">
                Encontraste todas las palabras
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};