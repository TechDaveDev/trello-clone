# Clone de Trello Full-Stack 🚀

![Trello Clone Demo](./public/demo.gif)

> Clon funcional de Trello desarrollado con Next.js, Tailwind CSS y Supabase. Este proyecto permite a los usuarios registrarse, iniciar sesión y gestionar sus propias listas de tareas en tableros privados, con una interfaz interactiva que incluye funcionalidad de 'arrastrar y soltar' (drag and drop).

**Ver el proyecto en vivo:** [**https://trello-clone-livid-eta.vercel.app/**](https://trello-clone-livid-eta.vercel.app/)

---

## ✨ Características Principales

* **🔐 Autenticación de Usuarios:** Sistema completo de registro e inicio de sesión con Supabase Auth.
* **🔒 Sesiones y Rutas Protegidas:** Los usuarios solo pueden acceder a los tableros si han iniciado sesión.
* **📓 Datos privados:** Cada usuario tiene sus propios tableros y tareas, invisibles para otros usuarios, gracias a la Seguridad a Nivel de Fila (RLS) de Supabase.
* **↔️ Funcionalidad Drag and Drop:** Reordena tareas y muévelas entre columnas de forma fluida con `react-beautiful-dnd`.
* **💾 Persistencia de Datos:** Todos los cambios se guardan en tiempo real en la base de datos PostgreSQL de Supabase.
* **📱 Diseño Responsivo:** Interfaz adaptable a dispositivos móviles y de escritorio.

---

## 🛠️ Stack Tecnológico

![Next.js](https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=nextdotjs&logoColor=white)
![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![Supabase](https://img.shields.io/badge/Supabase-3FCF8E?style=for-the-badge&logo=supabase&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)

---

## 🚀 Instalación y Uso Local

Para clonar y correr este proyecto en tu máquina local, sigue estos pasos:

1.  **Clona el repositorio:**
    ```bash
    git clone [https://github.com/TechDaveDev/trello-clone.git](https://github.com/TechDaveDev/trello-clone.git)
    cd trello-clone
    ```

2.  **Instala las dependencias:**
    ```bash
    npm install
    ```

3.  **Configura las variables de entorno:**
    * Crea un archivo `.env.local` en la raíz del proyecto.
    * Añade tus claves de Supabase (puedes encontrarlas en el panel de tu proyecto en Supabase > Project Settings > API):
    ```
    NEXT_PUBLIC_SUPABASE_URL=TU_URL_DE_SUPABASE
    NEXT_PUBLIC_SUPABASE_ANON_KEY=TU_ANON_KEY_DE_SUPABASE
    ```

4.  **Inicia el servidor de desarrollo:**
    ```bash
    npm run dev
    ```

Abre [http://localhost:3000](http://localhost:3000) en tu navegador para ver la aplicación.