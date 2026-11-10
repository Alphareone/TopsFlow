const fs = require('fs');
const path = require('path');

console.log('🚀 Optimizando estructura y preparando despliegue para GitHub Pages...');

// 1. Asegurar la estructura completa de carpetas frontend y scripts
const dirsToEnsure = [
  'apps/frontend/src/components',
  'apps/frontend/src/features/architecture',
  'apps/frontend/src/features/auth',
  'apps/frontend/src/features/calendar',
  'apps/frontend/src/features/cicd',
  'apps/frontend/src/features/dashboard',
  'apps/frontend/src/features/kanban',
  'apps/frontend/src/features/projects',
  'apps/frontend/src/features/schedule',
  'apps/frontend/src/services',
  'apps/frontend/src/styles',
  'scripts'
];

dirsToEnsure.forEach(dir => {
  const fullPath = path.join(__dirname, dir);
  if (!fs.existsSync(fullPath)) {
    fs.mkdirSync(fullPath, { recursive: true });
  }
});

// 2. Actualizar vite.config.js con base: '/TopsFlow/' y puerto local 3000
const viteConfigContent = `import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  base: '/TopsFlow/',
  server: { 
    port: 3000 
  }
});
`;
fs.writeFileSync(path.join(__dirname, 'apps/frontend/vite.config.js'), viteConfigContent, 'utf8');

// 3. Actualizar package.json raíz con los scripts de build y deploy
const rootPackageJsonPath = path.join(__dirname, 'package.json');
if (fs.existsSync(rootPackageJsonPath)) {
  const pkg = JSON.parse(fs.readFileSync(rootPackageJsonPath, 'utf8'));
  
  pkg.scripts = pkg.scripts || {};
  pkg.scripts["build:frontend"] = "npm run build --workspace=apps/frontend";
  pkg.scripts["predeploy"] = "npm run build:frontend";
  pkg.scripts["deploy"] = "gh-pages -d apps/frontend/dist";

  pkg.devDependencies = pkg.devDependencies || {};
  if (!pkg.devDependencies["gh-pages"]) {
    pkg.devDependencies["gh-pages"] = "^6.1.1";
  }

  fs.writeFileSync(rootPackageJsonPath, JSON.stringify(pkg, null, 2), 'utf8');
}

// 4. Mover cualquier script de setup/fix a /scripts
const rootFiles = fs.readdirSync(__dirname);
let movedCount = 0;

rootFiles.forEach(file => {
  if ((file.startsWith('fix-') || file.startsWith('setup-')) && file.endsWith('.js') && file !== 'setup-deploy-ready.js') {
    const oldPath = path.join(__dirname, file);
    const newPath = path.join(__dirname, 'scripts', file);
    try {
      fs.renameSync(oldPath, newPath);
      movedCount++;
    } catch (e) {
      // Ignorar si ya existe en scripts
    }
  }
});

console.log(`📁 Archivos estructurados. Se movieron ${movedCount} scripts a /scripts.`);
console.log('✅ vite.config.js actualizado con base: "/TopsFlow/".');
console.log('✅ package.json actualizado con "npm run deploy".');