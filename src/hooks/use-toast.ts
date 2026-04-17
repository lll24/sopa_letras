import * as React from "react";
import type { ToastActionElement, ToastProps } from "@/components/ui/toast";

// CONFIGURACIÓN: Límite de notificaciones visibles y tiempo para eliminarlas de memoria
const TOAST_LIMIT = 1; // Solo se muestra 1 a la vez
const TOAST_REMOVE_DELAY = 1000000; // Tiempo antes de borrar el rastro del toast

type ToasterToast = ToastProps & {
  id: string;
  title?: React.ReactNode;
  description?: React.ReactNode;
  action?: ToastActionElement;
};

// TIPOS DE ACCIÓN: Para el reducer
const actionTypes = {
  ADD_TOAST: "ADD_TOAST",
  UPDATE_TOAST: "UPDATE_TOAST",
  DISMISS_TOAST: "DISMISS_TOAST",
  REMOVE_TOAST: "REMOVE_TOAST",
} as const;

let count = 0;

// Generador de IDs únicos para cada notificación
function genId() {
  count = (count + 1) % Number.MAX_SAFE_INTEGER;
  return count.toString();
}

// ... Interfaces de acciones ...

interface State {
  toasts: ToasterToast[];
}

// Mapa para gestionar los timers de borrado de cada notificación
const toastTimeouts = new Map<string, ReturnType<typeof setTimeout>>();

// Función para programar la eliminación física de un toast después de cerrarse
const addToRemoveQueue = (toastId: string) => {
  if (toastTimeouts.has(toastId)) return;

  const timeout = setTimeout(() => {
    toastTimeouts.delete(toastId);
    dispatch({
      type: "REMOVE_TOAST",
      toastId: toastId,
    });
  }, TOAST_REMOVE_DELAY);

  toastTimeouts.set(toastId, timeout);
};

/**
 * REDUCER: Lógica pura de cómo cambia el estado de las notificaciones
 */
export const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case "ADD_TOAST":
      return {
        ...state,
        toasts: [action.toast, ...state.toasts].slice(0, TOAST_LIMIT),
      };

    case "UPDATE_TOAST":
      return {
        ...state,
        toasts: state.toasts.map((t) => (t.id === action.toast.id ? { ...t, ...action.toast } : t)),
      };

    case "DISMISS_TOAST": {
      const { toastId } = action;

      // Programamos el borrado cuando el usuario cierra la notificación
      if (toastId) {
        addToRemoveQueue(toastId);
      } else {
        state.toasts.forEach((toast) => addToRemoveQueue(toast.id));
      }

      // Cambiamos el estado de 'open' a false para la animación de salida
      return {
        ...state,
        toasts: state.toasts.map((t) =>
          t.id === toastId || toastId === undefined ? { ...t, open: false } : t
        ),
      };
    }
    case "REMOVE_TOAST":
      // Borrado definitivo del array de estado
      if (action.toastId === undefined) return { ...state, toasts: [] };
      return {
        ...state,
        toasts: state.toasts.filter((t) => t.id !== action.toastId),
      };
  }
};

// --- GESTIÓN DE ESTADO GLOBAL (Fuera de React) ---
const listeners: Array<(state: State) => void> = [];
let memoryState: State = { toasts: [] };

function dispatch(action: Action) {
  memoryState = reducer(memoryState, action);
  listeners.forEach((listener) => listener(memoryState));
}

/**
 * Función IMPERATIVA para disparar un toast desde cualquier lado
 */
function toast({ ...props }: Toast) {
  const id = genId();

  const update = (props: ToasterToast) =>
    dispatch({ type: "UPDATE_TOAST", toast: { ...props, id } });
  const dismiss = () => dispatch({ type: "DISMISS_TOAST", toastId: id });

  dispatch({
    type: "ADD_TOAST",
    toast: {
      ...props,
      id,
      open: true,
      onOpenChange: (open) => { if (!open) dismiss(); },
    },
  });

  return { id, dismiss, update };
}

/**
 * HOOK PERSONALIZADO: Para usar en componentes de React
 */
function useToast() {
  const [state, setState] = React.useState<State>(memoryState);

  React.useEffect(() => {
    listeners.push(setState); // Nos suscribimos a los cambios
    return () => {
      const index = listeners.indexOf(setState);
      if (index > -1) listeners.splice(index, 1); // Nos desuscribimos al desmontar
    };
  }, [state]);

  return {
    ...state,
    toast,
    dismiss: (toastId?: string) => dispatch({ type: "DISMISS_TOAST", toastId }),
  };
}

export { useToast, toast };