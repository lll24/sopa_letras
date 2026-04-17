import { NavLink as RouterNavLink, NavLinkProps } from "react-router-dom";
import { forwardRef } from "react";
import { cn } from "@/lib/utils"; // Utilidad común para combinar clases de CSS (Tailwind)

// Definimos las propiedades que aceptará nuestro componente
// Omitimos "className" original para redefinirlo a nuestro gusto
interface NavLinkCompatProps extends Omit<NavLinkProps, "className"> {
  className?: string;        // Clases base del enlace
  activeClassName?: string;  // Clases que se aplicarán SOLO cuando el enlace esté activo
  pendingClassName?: string; // Clases que se aplicarán mientras se carga la ruta
}

// Creamos el componente usando forwardRef para que pueda recibir una referencia (ref)
// como si fuera un elemento HTML <a> normal.
const NavLink = forwardRef<HTMLAnchorElement, NavLinkCompatProps>(
  ({ className, activeClassName, pendingClassName, to, ...props }, ref) => {
    return (
      <RouterNavLink
        ref={ref}
        to={to}
        // En React Router v6, className acepta una función que recibe el estado del enlace
        className={({ isActive, isPending }) =>
          // La función 'cn' mezcla las clases según el estado:
          // 1. Siempre pone la clase base (className)
          // 2. Si isActive es true, añade activeClassName
          // 3. Si isPending es true, añade pendingClassName
          cn(className, isActive && activeClassName, isPending && pendingClassName)
        }
        {...props} // Pasa el resto de las propiedades (id, target, etc.) al NavLink original
      />
    );
  },
);

// Nombre del componente para herramientas de desarrollo (DevTools)
NavLink.displayName = "NavLink";

export { NavLink };