import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowLeft, Users, UserPlus, LogIn } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

const Multiplayer = () => {
  const navigate = useNavigate();
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showJoinDialog, setShowJoinDialog] = useState(false);
  const [roomCode, setRoomCode] = useState("");
  const [joinCode, setJoinCode] = useState("");
  
  // Estados de configuración de la sala
  const [blurEnabled, setBlurEnabled] = useState(false);
  const [modoFacil, setModoFacil] = useState(false);

  const handleCreateRoom = () => {
    setShowCreateDialog(true);
  };

  const handleJoinRoom = () => {
    setShowJoinDialog(true);
  };

const startGame = (code: string, isCreator: boolean = false) => {
  // Agregamos &host=true para que el navegador sepa quién es el dueño
  const settings = isCreator ? `?blur=${blurEnabled}&facil=${modoFacil}&host=true` : '';
  navigate(`/multiplayer/game/${code}${settings}`); 
};
  const generateRoomCode = () => {
    return Math.random().toString(36).substring(2, 8).toUpperCase();
  };

  const createNewRoom = () => {
    const code = generateRoomCode();
    setRoomCode(code);
    startGame(code, true);
  };

  const joinRoom = () => {
    if (joinCode.trim()) {
      startGame(joinCode.toUpperCase());
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-secondary/10 p-4">
      <div className="max-w-4xl mx-auto space-y-8 py-8">
        <Button variant="ghost" onClick={() => navigate("/")} className="mb-4">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Volver al menú
        </Button>

        <div className="text-center space-y-6">
          <div className="space-y-2">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Modo Multijugador
            </h1>
            <p className="text-muted-foreground text-lg">Juega con amigos en tiempo real</p>
          </div>

          <div className="grid md:grid-cols-2 gap-6 max-w-2xl mx-auto pt-8">
            {/* Tarjeta Crear Sala */}
            <div className="bg-card border-2 border-primary/20 rounded-2xl p-6 hover:border-primary/40 transition-all duration-300 hover:shadow-lg">
              <div className="space-y-4">
                <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto">
                  <Users className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold">Crear Sala</h3>
                <p className="text-muted-foreground text-sm">
                  Crea una nueva sala de juego y comparte el código con tus amigos
                </p>
                <Button onClick={handleCreateRoom} className="w-full bg-primary hover:bg-primary/90" size="lg">
                  <UserPlus className="w-5 h-5 mr-2" />
                  Crear Sala
                </Button>
              </div>
            </div>

            {/* Tarjeta Unirse a Sala */}
            <div className="bg-card border-2 border-secondary/20 rounded-2xl p-6 hover:border-secondary/40 transition-all duration-300 hover:shadow-lg">
              <div className="space-y-4">
                <div className="bg-secondary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto">
                  <LogIn className="w-8 h-8 text-secondary" />
                </div>
                <h3 className="text-xl font-semibold">Unirse a Sala</h3>
                <p className="text-muted-foreground text-sm">
                  Únete a una sala existente usando un código de invitación
                </p>
                <Button onClick={handleJoinRoom} className="w-full bg-secondary hover:bg-secondary/90" size="lg">
                  <LogIn className="w-5 h-5 mr-2" />
                  Unirse a Sala
                </Button>
              </div>
            </div>
          </div>

          {/* Información adicional */}
          <div className="bg-card/50 backdrop-blur-sm rounded-xl p-6 max-w-2xl mx-auto">
            <div className="space-y-3">
              <h4 className="font-semibold text-lg">¿Cómo funciona?</h4>
              <ul className="text-sm text-muted-foreground space-y-2 text-left">
                <li className="flex items-start">
                  <span className="text-primary mr-2">•</span>
                  <span>
                    <strong>Crear sala:</strong> Genera un código único para que otros jugadores se unan
                  </span>
                </li>
                <li className="flex items-start">
                  <span className="text-secondary mr-2">•</span>
                  <span>
                    <strong>Unirse a sala:</strong> Ingresa el código de una sala existente para unirte
                  </span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">•</span>
                  <span>
                    <strong>Competir:</strong> Todos los jugadores resuelven la misma sopa de letras en tiempo real
                  </span>
                </li>
              </ul>
            </div>
          </div>

        </div>

        {/* Dialog para crear sala */}
        <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Configuración de la Partida</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <p className="text-sm text-muted-foreground">
                Se generará un código único que podrás compartir con otro jugador
              </p>
              
              <div className="space-y-3">
                {/* Opción de Blur */}
                <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg border">
                  <div className="space-y-1">
                    <Label htmlFor="blur-mode" className="text-base font-medium">Activar Blur</Label>
                    <p className="text-xs text-muted-foreground">
                      El tablero se desenfoca cuando no es tu turno
                    </p>
                  </div>
                  <Switch 
                    id="blur-mode" 
                    checked={blurEnabled} 
                    onCheckedChange={setBlurEnabled}
                  />
                </div>

                {/* Opción de Modo Fácil */}
                <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg border">
                  <div className="space-y-1">
                    <Label htmlFor="easy-mode" className="text-base font-medium">Modo Fácil (Sin relleno)</Label>
                    <p className="text-xs text-muted-foreground">
                      Solo se mostrarán las letras que forman palabras
                    </p>
                  </div>
                  <Switch 
                    id="easy-mode" 
                    checked={modoFacil} 
                    onCheckedChange={setModoFacil}
                  />
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <Button onClick={() => setShowCreateDialog(false)} variant="outline" className="w-full" size="lg">
                  Volver
                </Button>
                <Button onClick={createNewRoom} className="w-full" size="lg">
                  Crear Partida
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Dialog para unirse a sala */}
        <Dialog open={showJoinDialog} onOpenChange={setShowJoinDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Unirse a Sala</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Código de Sala</label>
                <Input
                  placeholder="Ingresa el código"
                  value={joinCode}
                  onChange={(e) => setJoinCode(e.target.value.toUpperCase())}
                  className="uppercase"
                  maxLength={6}
                />
              </div>
              <Button onClick={joinRoom} className="w-full" size="lg" disabled={joinCode.length < 6}>
                Unirse a la Sala
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default Multiplayer;