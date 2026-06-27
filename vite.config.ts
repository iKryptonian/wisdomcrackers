import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    allowedHosts: ['.ngrok-free.app', '.ngrok-free.app.'],
    host: true,
    port: 5173, 
  },
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
});
