import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, User, X } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Menu = () => {
  const navigate = useNavigate();
  
  // Estados para controlar el modal y las opciones
  const [modalAbierto, setModalAbierto] = useState(false);
  const [rutaSeleccionada, setRutaSeleccionada] = useState<string | null>(null);
  const [modoFacil, setModoFacil] = useState(false);

  // Función para abrir el modal al hacer clic en una tarjeta (ahora solo para Single Player)
  const prepararPartida = (ruta: string) => {
    setRutaSeleccionada(ruta);
    setModoFacil(false); // Reiniciamos el switch por defecto
    setModalAbierto(true);
  };

  // Función para confirmar e ir al juego
  const iniciarPartida = () => {
    if (rutaSeleccionada) {
      // Pasamos el estado de 'modoFacil' a la siguiente pantalla
      navigate(rutaSeleccionada, { state: { modoFacil } });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-secondary/10 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full space-y-8">
        <div className="text-center space-y-2">
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            Sopa de Letras
          </h1>
          <p className="text-muted-foreground text-lg">
            Selecciona un modo de juego para comenzar
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Tarjeta Single Player */}
          <Card 
            className="hover:shadow-lg transition-shadow cursor-pointer group" 
            onClick={() => prepararPartida("/singleplayer")}
          >
            <CardHeader>
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                <User className="w-6 h-6 text-primary" />
              </div>
              <CardTitle>Single Player</CardTitle>
              <CardDescription>
                Juega solo y encuentra todas las palabras a tu ritmo
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button className="w-full" variant="default">
                Jugar Solo
              </Button>
            </CardContent>
          </Card>

          {/* Tarjeta Multiplayer */}
          <Card 
            className="hover:shadow-lg transition-shadow cursor-pointer group" 
            onClick={() => navigate("/multiplayer")} // Navega directo sin abrir modal
          >
            <CardHeader>
              <div className="w-12 h-12 rounded-full bg-secondary/10 flex items-center justify-center mb-4 group-hover:bg-secondary/20 transition-colors">
                <Users className="w-6 h-6 text-secondary" />
              </div>
              <CardTitle>Multiplayer</CardTitle>
              <CardDescription>
                Compite con otros jugadores en tiempo real
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button className="w-full" variant="secondary">
                Jugar Multijugador
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* --- VENTANA MODAL (Solo para Single Player) --- */}
      {modalAbierto && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="bg-background w-full max-w-md rounded-xl shadow-xl overflow-hidden animate-in fade-in zoom-in duration-200">
            
            <div className="flex justify-between items-center p-6 pb-4">
              <h2 className="text-xl font-semibold">Configuración de la Partida</h2>
              <button 
                onClick={() => setModalAbierto(false)}
                className="text-muted-foreground hover:bg-muted p-1 rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="px-6 pb-6 space-y-6">
              <p className="text-sm text-muted-foreground">
                Configura las opciones antes de generar el tablero de juego.
              </p>

              <div className="flex items-center justify-between bg-muted/50 p-4 rounded-lg border border-border/50">
                <div className="space-y-0.5 pr-4">
                  <label className="text-base font-medium text-foreground cursor-pointer" htmlFor="modo-facil">
                    Modo Fácil (Sin relleno)
                  </label>
                  <p className="text-xs text-muted-foreground">
                    El tablero solo mostrará las letras que forman las palabras.
                  </p>
                </div>
                
                <label className="relative inline-flex items-center cursor-pointer flex-shrink-0">
                  <input 
                    id="modo-facil"
                    type="checkbox" 
                    className="sr-only peer" 
                    checked={modoFacil}
                    onChange={(e) => setModoFacil(e.target.checked)}
                  />
                  <div className="w-11 h-6 bg-muted-foreground/30 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                </label>
              </div>

              <div className="flex gap-3 pt-4">
                <Button 
                  variant="outline" 
                  className="w-full" 
                  onClick={() => setModalAbierto(false)}
                >
                  Volver
                </Button>
                <Button 
                  className="w-full" 
                  onClick={iniciarPartida}
                >
                  Crear Partida
                </Button>
              </div>
            </div>

          </div>
        </div>
      )}
    </div>
  );
};

export default Menu;