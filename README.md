#Sopa de Letras Real-Time

Una aplicación moderna de Sopa de Letras interactiva construida con **React** y comunicación en tiempo real mediante **WebSockets**. Este proyecto combina una interfaz de usuario fluida con una lógica de juego sincronizada.

##Características

* **Juego en Tiempo Real:** Sincronización de estados mediante WebSockets para una experiencia dinámica.
* **Interfaz Moderna:** Diseño responsivo y minimalista utilizando Tailwind CSS y componentes de Shadcn/UI.
* **Generación Dinámica:** Algoritmo optimizado para la creación de tableros y ubicación de palabras.
* **Feedback Visual:** Animaciones fluidas al seleccionar palabras y completar niveles.

## 🛠️ Tecnologías Utilizadas

* **Frontend:** [React.js](https://reactjs.org/), [Vite](https://vitejs.dev/)
* **Estilos:** [Tailwind CSS](https://tailwindcss.com/), [Shadcn/UI](https://ui.shadcn.com/)
* **Real-time:** [WebSockets / Socket.io]
* **Backend/Base de Datos:** [Supabase / Node.js] (según lo que estés usando)

## 📦 Instalación y Configuración

1.  **Clonar el repositorio:**

2.  **Instalar dependencias:**
    ```bash
    npm install
    ```

3.  **Configurar variables de entorno:**
    Crea un archivo `.env` en la raíz del proyecto basándote en el archivo `.env.example`:
    ```env
    VITE_SUPABASE_URL=tu_url
    VITE_SUPABASE_ANON_KEY=tu_key
    ```

4.  **Iniciar el servidor de desarrollo:**
    ```bash
    npm run dev
    ```
##Puedes probarlo aqui

https://sopaletras-seven.vercel.app

## Desafíos Técnicos

El mayor reto de este proyecto fue la **implementación de los WebSockets** para manejar el estado del juego de forma concurrente, asegurando que la validación de las palabras se procese correctamente sin latencia perceptible para el usuario.
