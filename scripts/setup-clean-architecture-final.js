const fs = require('fs');
const path = require('path');

console.log('⚡ Iniciando optimización y limpieza de la arquitectura TopsFlow Enterprise...');

// 1. Asegurar la creación de todos los directorios de la Clean Architecture
const targetDirs = [
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

targetDirs.forEach(dir => {
  const fullPath = path.join(__dirname, dir);
  if (!fs.existsSync(fullPath)) {
    fs.mkdirSync(fullPath, { recursive: true });
  }
});

// 2. Mover automáticamente cualquier script efímero suelto a /scripts
const rootFiles = fs.readdirSync(__dirname);
let movedCount = 0;

rootFiles.forEach(file => {
  if ((file.startsWith('fix-') || file.startsWith('setup-')) && file.endsWith('.js') && file !== 'setup-clean-architecture-final.js') {
    const oldPath = path.join(__dirname, file);
    const newPath = path.join(__dirname, 'scripts', file);
    try {
      fs.renameSync(oldPath, newPath);
      movedCount++;
    } catch (e) {
      // Si el archivo ya existía en scripts, se omite
    }
  }
});

console.log(`📁 ${movedCount} scripts temporales fueron movidos a /scripts para mantener la raíz limpia.`);

// 3. Crear archivo .gitignore profesional para el monorepo
const gitignoreContent = `# Dependencias de Node
node_modules/
.pnpm-store/

# Compilación y builds
dist/
build/
.vite/

# Base de datos y entorno local
.env
.env.local
*.log
docker-data/

# Sistema operativo
.DS_Store
Thumbs.db
`;

fs.writeFileSync(path.join(__dirname, '.gitignore'), gitignoreContent, 'utf8');

console.log('✅ .gitignore configurado correctamente.');
console.log('🎉 Clean Architecture completada con éxito. El proyecto está listo para subir a GitHub.');