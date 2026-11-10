const fs = require('fs');
const path = require('path');

const files = {
  // 1. Archivo .env global en la raíz del monorepo
  '.env': `DATABASE_URL="postgresql://topsflow:topsflow_password@localhost:5432/topsflow_db?schema=public"\n`,

  // 2. Archivo index.js en packages/database para exportar PrismaClient
  'packages/database/index.js': `const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
module.exports = { prisma, PrismaClient };
`
};

Object.entries(files).forEach(([filePath, content]) => {
  fs.writeFileSync(path.join(__dirname, filePath), content, 'utf8');
  console.log(`[OK] Generado: ${filePath}`);
});
