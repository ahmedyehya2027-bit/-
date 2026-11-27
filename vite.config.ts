import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import fs from 'fs';
import path from 'path';
import {fileURLToPath} from 'url';
import {defineConfig} from 'vite';

const rootDir = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig(() => {
  return {
    base: './',
    build: {
      target: 'es2020',
      minify: true,
      cssMinify: true,
    },
    plugins: [
      react(),
      tailwindcss(),
      // Copies src/assets into dist/ so root-relative URLs like
      // "/src/assets/images/..." (e.g. generate_image output) still resolve
      // in production builds. Do not remove.
      {
        name: 'copy-unbundled-src-assets',
        apply: 'build',
        closeBundle(error?: Error): void {
          if (error) {
            return;
          }
          const distDir = path.resolve(rootDir, 'dist');
          const srcAssets = path.resolve(rootDir, 'src/assets');
          const distAssets = path.resolve(distDir, 'src/assets');
          if (fs.existsSync(distDir) && fs.existsSync(srcAssets)) {
            fs.cpSync(srcAssets, distAssets, {recursive: true, force: true});
          }
        },
      },
      // Dev-only download endpoints for exporting project archives from AI Studio Preview
      {
        name: 'dev-project-zip-download',
        apply: 'serve',
        configureServer(server) {
          const allowedDownloads: Record<string, { filePath: string; filename: string }> = {
            '/project.zip': {
              filePath: '/tmp/meyar-exports/project.zip',
              filename: 'project.zip',
            },
            '/meyar-project.zip': {
              filePath: '/tmp/meyar-exports/project.zip',
              filename: 'meyar-project.zip',
            },
            '/meyar-dist.zip': {
              filePath: '/tmp/meyar-exports/meyar-dist.zip',
              filename: 'meyar-dist.zip',
            },
          };

          server.middlewares.use((req, res, next) => {
            const urlPath = (req.url || '').split('?')[0];
            const entry = allowedDownloads[urlPath];
            if (!entry || !fs.existsSync(entry.filePath)) {
              next();
              return;
            }
            const stat = fs.statSync(entry.filePath);
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/zip');
            res.setHeader('Content-Disposition', `attachment; filename="${entry.filename}"`);
            res.setHeader('Content-Length', String(stat.size));
            res.setHeader('Cache-Control', 'no-store');
            fs.createReadStream(entry.filePath).pipe(res);
          });
        },
      },
    ],
    resolve: {
      alias: {
        '@': rootDir,
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modify—file watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
      // Disable file watching when DISABLE_HMR is true to save CPU during agent edits.
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
