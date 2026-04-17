import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { WordGrid } from "@/components/WordGrid";
import { WordList } from "@/components/WordList";
import { GameHeader } from "@/components/GameHeader";
import { generateWordSearch, WORD_THEMES, getRandomThemeKey } from "@/utils/wordSearchGenerator";
import { toast } from "sonner";

const Index = () => {
  const navigate = useNavigate();
  
  // 1. Atrapamos el estado que viene del menú
  const location = useLocation();
  const modoFacil = location.state?.modoFacil || false;

  const [currentTheme, setCurrentTheme] = useState(getRandomThemeKey());
  
  // 2. Le pasamos modoFacil a la generación inicial
  const [gameData, setGameData] = useState(
    generateWordSearch(WORD_THEMES[currentTheme as keyof typeof WORD_THEMES], 10, modoFacil)
  );
  
  const [foundWords, setFoundWords] = useState<Set<string>>(new Set());

  const handleWordFound = (word: string) => {
    setFoundWords((prev) => new Set([...prev, word]));
    toast.success(`¡Encontraste "${word}"!`, {
      icon: "🎉",
      duration: 2000,
    });
  };

  const handleReset = () => {
    const newTheme = getRandomThemeKey();
    setCurrentTheme(newTheme);
    // 3. Le pasamos modoFacil también cuando el jugador reinicia la partida
    setGameData(generateWordSearch(WORD_THEMES[newTheme as keyof typeof WORD_THEMES], 10, modoFacil));
    setFoundWords(new Set());
    toast.info(`¡Nuevo juego iniciado! Tema: ${newTheme}`, {
      icon: "🔄",
    });
  };

  useEffect(() => {
    if (foundWords.size === gameData.words.length && gameData.words.length > 0) {
      setTimeout(() => {
        toast.success("¡Completaste el juego! 🏆", {
          duration: 4000,
        });
      }, 500);
    }
  }, [foundWords.size, gameData.words.length]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-secondary/10 p-3 sm:p-4 touch-none overscroll-none">
      <div className="max-w-4xl mx-auto space-y-2 sm:space-y-3 py-2 sm:py-4">
        <Button variant="ghost" onClick={() => navigate("/")} className="mb-1">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Volver al menú
        </Button>

        <GameHeader
          onReset={handleReset}
          foundWords={foundWords.size}
          totalWords={gameData.words.length}
          currentTheme={currentTheme}
        />

        <div className="grid lg:grid-cols-[1fr_280px] gap-3 sm:gap-4">
          <WordGrid
            grid={gameData.grid}
            foundWords={foundWords}
            onWordFound={handleWordFound}
            words={gameData.words}
            wordPositions={gameData.wordPositions}
          />

          <WordList
            words={gameData.words}
            foundWords={foundWords}
            player1FoundWords={[]}
            player2FoundWords={[]}
            isMultiplayer={false}
          />
        </div>

        <div className="bg-card/50 backdrop-blur-sm rounded-xl p-3 text-center text-xs sm:text-sm text-muted-foreground">
          💡 <span className="font-medium">Tip:</span> Arrastra el dedo o el mouse sobre las letras
        </div>
      </div>
    </div>
  );
};

export default Index;