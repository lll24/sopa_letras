import * as React from "react";

// El punto de corte: 768px es el estándar para tablets/móviles
const MOBILE_BREAKPOINT = 768;

export function useIsMobile() {
  // Estado para guardar si es móvil o no. 
  // Empieza como 'undefined' para evitar errores de renderizado en el servidor.
  const [isMobile, setIsMobile] = React.useState<boolean | undefined>(undefined);

  React.useEffect(() => {
    // Creamos una consulta de medios (Media Query)
    const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`);

    // Función que se ejecuta cada vez que la pantalla cambia de tamaño
    const onChange = () => {
      // Comprobamos si el ancho actual es menor al breakpoint
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
    };

    // Escuchamos los cambios en el tamaño de la ventana
    mql.addEventListener("change", onChange);

    // Ejecutamos la comprobación inicial apenas se carga el componente
    setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);

    // Limpieza: dejamos de escuchar cuando el componente se destruye
    return () => mql.removeEventListener("change", onChange);
  }, []);

  // Retorna un booleano puro (true o false)
  // El !! convierte el 'undefined' inicial en 'false' rápidamente
  return !!isMobile;
}