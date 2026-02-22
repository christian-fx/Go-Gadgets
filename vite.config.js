import { defineConfig } from 'vite';
import tailwindcss from '@tailwindcss/vite';

// Trigger Vite restart to load new .env variables
export default defineConfig({
    plugins: [
        tailwindcss(),
    ],
});
