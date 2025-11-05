import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'


// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),        // React + Fast Refresh + transform JSX vía SWC
     // Tailwind v4
  ],
})