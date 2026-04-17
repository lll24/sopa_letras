import { useState, useEffect, useCallback, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { RealtimeChannel } from '@supabase/supabase-js';

export const useRealtimeSocket = (roomCode: string, playerId: string) => {
  const [channel, setChannel] = useState<RealtimeChannel | null>(null);
  const [onlinePlayers, setOnlinePlayers] = useState<any[]>([]);
  // Usamos ref para los listeners para evitar que se limpien en cada renderizado
  const listeners = useRef<{ [event: string]: ((payload: any) => void)[] }>({});

  useEffect(() => {
    // 1. Inicializar el Canal (Solo la configuración aquí)
    const roomChannel = supabase.channel(`room:${roomCode}`, {
      config: {
        presence: { key: playerId },
        broadcast: { self: true },
      },
    });

    // 2. Configurar manejadores ANTES de suscribirse
    roomChannel
      .on('presence', { event: 'sync' }, () => {
        const state = roomChannel.presenceState();
        // Convertimos el objeto de presencia en una lista plana de jugadores
        const players = Object.values(state).flat();
        setOnlinePlayers(players);
      })
      .on('broadcast', { event: '*' }, ({ event, payload }) => {
        if (listeners.current[event]) {
          listeners.current[event].forEach((callback) => callback(payload));
        }
      });

    // 3. SUSCRIBIRSE Y TRACKEAR (El paso maestro)
    roomChannel.subscribe(async (status) => {
      if (status === 'SUBSCRIBED') {
        // Esto envía tus datos a los demás y te mete en el 'sync'
        await roomChannel.track({
          playerId: playerId,
          online_at: new Date().toISOString(),
        });
      }
    });

    setChannel(roomChannel);

    // Limpieza al desmontar el componente
    return () => {
      roomChannel.unsubscribe();
    };
  }, [roomCode, playerId]);

  // Método para enviar datos
  const emit = useCallback((event: string, payload: any) => {
    if (channel) {
      channel.send({
        type: 'broadcast',
        event,
        payload,
      });
    }
  }, [channel]);

  // Método para registrar qué hacer cuando llegue un evento
  const on = useCallback((event: string, callback: (payload: any) => void) => {
    // Limpiamos listeners previos del mismo evento para evitar duplicados
    listeners.current[event] = [callback]; 
  }, []);
  return { emit, on, onlinePlayers, channel };
};