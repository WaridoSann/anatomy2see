import { defineConfig } from 'vite';
import process from 'node:process';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
export default defineConfig({plugins:[react(),tailwindcss()],base:process.env.GITHUB_ACTIONS ? '/anatomy2see/' : '/',build:{chunkSizeWarningLimit:1500}});
