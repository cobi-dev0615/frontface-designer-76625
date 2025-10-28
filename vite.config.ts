import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [react(), mode === "development" && componentTagger()].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  define: {
    // Define environment variables for production
    'import.meta.env.VITE_API_URL': mode === 'production' 
      ? JSON.stringify('https://duxfit-production.up.railway.app/api')
      : JSON.stringify('http://localhost:5000/api'),
  },
}));
