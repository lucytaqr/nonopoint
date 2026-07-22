# Project Setup: Next.js with Supabase and Zustand

## Objective
Create a new Next.js project in the current directory (`./`) using the App Router, and configure the necessary dependencies and basic structure for a web application utilizing Supabase for backend services, Zustand for state management, and Tailwind CSS for styling.

## Required Stack
- **Framework:** Next.js (App Router)
- **Styling:** Tailwind CSS
- **Backend/BaaS:** Supabase Client (`@supabase/supabase-js`)
- **State Management:** Zustand

## Implementation Steps (High-Level)

1.  **Initialize Next.js Project**
    *   Initialize a new Next.js project in the current directory (`./`).
    *   Ensure App Router is enabled.
    *   Ensure Tailwind CSS is enabled during initialization.
    *   *Note: Use the appropriate command for Next.js initialization to create the project in the current folder.*

2.  **Install Dependencies**
    *   Install the required Supabase client library: `@supabase/supabase-js`.
    *   Install the state management library: `zustand`.

3.  **Basic Configuration**
    *   **Supabase Setup:** Create a utility file (e.g., `lib/supabase.ts` or `utils/supabase/client.ts`) to initialize and export the Supabase client instance. It should be set up to read environment variables for the URL and Anon Key.
    *   **Zustand Setup:** Create a basic store file (e.g., `store/useStore.ts`) with a simple example state to establish the pattern.

4.  **Basic Boilerplate**
    *   Update `app/page.tsx` (or equivalent main page) to include some basic Tailwind classes to verify it's working.
    *   Ensure the project structure is clean and ready for further development.

## Constraints
- Do not create complex UI or advanced Supabase auth flows. The goal is just to set up the foundation and boilerplate.
- The instructions should be executed from the root of the project directory.
