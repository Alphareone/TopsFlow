const fs = require('fs');
const path = require('path');

// Definición de la estructura de archivos y carpetas
const projectStructure = {
  // CONFIGURACIÓN RAÍZ Y DOCKER
  'package.json': JSON.stringify({
    name: 'topsflow-monorepo',
    private: true,
    workspaces: ['apps/*', 'packages/*'],
    scripts: {
      'dev:backend': 'npm run dev --workspace=apps/backend',
      'dev:frontend': 'npm run dev --workspace=apps/frontend',
      'db:generate': 'npm run db:generate --workspace=packages/database',
      'db:push': 'npm run db:push --workspace=packages/database'
    }
  }, null, 2),

  'docker-compose.yml': `version: '3.8'
services:
  postgres:
    image: postgres:15-alpine
    container_name: topsflow-db
    environment:
      POSTGRES_USER: topsflow
      POSTGRES_PASSWORD: topsflow_password
      POSTGRES_DB: topsflow_db
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data

  redis:
    image: redis:7-alpine
    container_name: topsflow-redis
    ports:
      - "6379:6379"

volumes:
  postgres_data:
`,

  // BASE DE DATOS (PACKAGES/DATABASE)
  'packages/database/package.json': JSON.stringify({
    name: '@topsflow/database',
    version: '1.0.0',
    main: 'index.js',
    scripts: {
      'db:generate': 'prisma generate',
      'db:push': 'prisma db push'
    },
    dependencies: {
      '@prisma/client': '^5.0.0'
    },
    devDependencies: {
      'prisma': '^5.0.0'
    }
  }, null, 2),

  'packages/database/schema.prisma': `datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

generator client {
  provider = "prisma-client-js"
}

model User {
  id               String     @id @default(uuid())
  email            String     @unique
  passwordHash     String
  twoFactorSecret  String?
  twoFactorEnabled Boolean    @default(false)
  createdAt        DateTime   @default(now())
  updatedAt        DateTime   @updatedAt
  workflows        Workflow[]
}

model Workflow {
  id          String      @id @default(uuid())
  title       String
  description String?
  nodesJson   Json
  edgesJson   Json
  userId      String
  user        User        @relation(fields: [userId], references: [id])
  executions  Execution[]
  createdAt   DateTime    @default(now())
  updatedAt   DateTime    @updatedAt
}

model Execution {
  id         String   @id @default(uuid())
  workflowId String
  workflow   Workflow @relation(fields: [workflowId], references: [id])
  status     String   // PENDING, SUCCESS, FAILED
  logs       Json?
  createdAt  DateTime @default(now())
}
`,

  // BACKEND API & WORKFLOW ENGINE (APPS/BACKEND)
  'apps/backend/package.json': JSON.stringify({
    name: '@topsflow/backend',
    version: '1.0.0',
    main: 'src/app.js',
    scripts: {
      'dev': 'nodemon src/app.js'
    },
    dependencies: {
      '@topsflow/database': '*',
      'express': '^4.18.2',
      'cors': '^2.8.5',
      'dotenv': '^16.3.1',
      'bcryptjs': '^2.4.3',
      'jsonwebtoken': '^9.0.1',
      'otplib': '^12.0.1',
      'qrcode': '^1.5.3',
      'bullmq': '^4.12.0',
      'ioredis': '^5.3.2'
    },
    devDependencies: {
      'nodemon': '^3.0.1'
    }
  }, null, 2),

  'apps/backend/.env': `PORT=4000
DATABASE_URL="postgresql://topsflow:topsflow_password@localhost:5432/topsflow_db?schema=public"
JWT_SECRET="super_secret_jwt_key_topsflow"
REDIS_HOST="localhost"
REDIS_PORT=6379
`,

  'apps/backend/src/utils/auth.js': `const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { authenticator } = require('otplib');

const hashPassword = (password) => bcrypt.hash(password, 10);
const comparePassword = (password, hash) => bcrypt.compare(password, hash);

const generateToken = (payload) => {
  return jwt.sign(payload, process.env.JWT_SECRET || 'secret', { expiresIn: '8h' });
};

const generate2FASecret = (userEmail) => {
  const secret = authenticator.generateSecret();
  const otpauth = authenticator.keyuri(userEmail, 'TopsFlow', secret);
  return { secret, otpauth };
};

const verify2FAToken = (token, secret) => {
  return authenticator.verify({ token, secret });
};

module.exports = { hashPassword, comparePassword, generateToken, generate2FASecret, verify2FAToken };
`,

  'apps/backend/src/core/engine.js': `// Motor ligero de ejecución de flujos para el MVP
async function executeWorkflow(nodes, edges) {
  const results = {};
  const executionLogs = [];

  for (const node of nodes) {
    executionLogs.push(\`[INIT] Procesando Nodo \${node.id} (\${node.type})\`);
    try {
      if (node.type === 'trigger') {
        results[node.id] = { status: 'triggered', timestamp: new Date() };
      } else if (node.type === 'action') {
        // Simulación de acción ejecutada por el nodo
        results[node.id] = { status: 'executed', payload: node.data };
      }
      executionLogs.push(\`[SUCCESS] Nodo \${node.id} completado con éxito.\`);
    } catch (err) {
      executionLogs.push(\`[ERROR] Fallo en el Nodo \${node.id}: \${err.message}\`);
      throw new Error(\`Fallo en el nodo \${node.id}\`);
    }
  }

  return { results, logs: executionLogs };
}

module.exports = { executeWorkflow };
`,

  'apps/backend/src/app.js': `const express = require('express');
const cors = require('cors');
const QRCode = require('qrcode');
const { PrismaClient } = require('@topsflow/database');
const { hashPassword, comparePassword, generateToken, generate2FASecret, verify2FAToken } = require('./utils/auth');
const { executeWorkflow } = require('./core/engine');

const app = express();
const prisma = new PrismaClient();

app.use(cors());
app.use(express.json());

// --- AUTENTICACIÓN Y 2FA ---
app.post('/api/auth/register', async (req, res) => {
  const { email, password } = req.body;
  try {
    const passwordHash = await hashPassword(password);
    const user = await prisma.user.create({ data: { email, passwordHash } });
    res.json({ message: 'Usuario creado exitosamente', userId: user.id });
  } catch (e) {
    res.status(400).json({ error: 'El usuario ya existe o hubo un error' });
  }
});

app.post('/api/auth/2fa/setup', async (req, res) => {
  const { userId } = req.body;
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) return res.status(404).json({ error: 'Usuario no encontrado' });

  const { secret, otpauth } = generate2FASecret(user.email);
  await prisma.user.update({ where: { id: userId }, data: { twoFactorSecret: secret } });

  const qrCodeUrl = await QRCode.toDataURL(otpauth);
  res.json({ qrCodeUrl, secret });
});

app.post('/api/auth/2fa/verify', async (req, res) => {
  const { userId, token } = req.body;
  const user = await prisma.user.findUnique({ where: { id: userId } });
  
  if (!user || !user.twoFactorSecret) {
    return res.status(400).json({ error: 'Configuración 2FA no válida' });
  }

  const isValid = verify2FAToken(token, user.twoFactorSecret);
  if (!isValid) return res.status(401).json({ error: 'Código 2FA incorrecto' });

  await prisma.user.update({ where: { id: userId }, data: { twoFactorEnabled: true } });
  const jwtToken = generateToken({ id: user.id, email: user.email });

  res.json({ message: 'Autenticación exitosa', token: jwtToken });
});

// --- MOTOR DE FLUJOS DE TRABAJO ---
app.post('/api/workflows/run', async (req, res) => {
  const { nodes, edges } = req.body;
  try {
    const output = await executeWorkflow(nodes, edges);
    res.json({ status: 'COMPLETED', output });
  } catch (error) {
    res.status(500).json({ status: 'FAILED', error: error.message });
  }
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(\`🚀 Servidor MVP TopsFlow ejecutándose en el puerto \${PORT}\`);
});
`,

  // FRONTEND INTERFAZ (APPS/FRONTEND)
  'apps/frontend/package.json': JSON.stringify({
    name: '@topsflow/frontend',
    version: '1.0.0',
    scripts: {
      'dev': 'vite',
      'build': 'vite build'
    },
    dependencies: {
      'react': '^18.2.0',
      'react-dom': '^18.2.0',
      'axios': '^1.4.0'
    },
    devDependencies: {
      '@vitejs/plugin-react': '^4.0.0',
      'vite': '^4.4.0'
    }
  }, null, 2),

  'apps/frontend/index.html': `<!DOCTYPE html>
<html lang="es">
  <head>
    <meta charset="UTF-8" />
    <title>TopsFlow MVP</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.jsx"></script>
  </body>
</html>
`,

  'apps/frontend/vite.config.js': `import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: { port: 3000 }
});
`,

  'apps/frontend/src/main.jsx': `import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
`,

  'apps/frontend/src/App.jsx': `import React, { useState } from 'react';
import axios from 'axios';

export default function App() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [userId, setUserId] = useState(null);
  const [qrCode, setQrCode] = useState('');
  const [token2FA, setToken2FA] = useState('');
  const [authToken, setAuthToken] = useState('');
  const [executionLog, setExecutionLog] = useState(null);

  const registerUser = async () => {
    const res = await axios.post('http://localhost:4000/api/auth/register', { email, password });
    setUserId(res.data.userId);
  };

  const setup2FA = async () => {
    const res = await axios.post('http://localhost:4000/api/auth/2fa/setup', { userId });
    setQrCode(res.data.qrCodeUrl);
  };

  const verify2FA = async () => {
    const res = await axios.post('http://localhost:4000/api/auth/2fa/verify', { userId, token: token2FA });
    setAuthToken(res.data.token);
  };

  const testWorkflow = async () => {
    const sampleNodes = [
      { id: '1', type: 'trigger', data: { label: 'Inicio Evento' } },
      { id: '2', type: 'action', data: { label: 'Enviar Email' } }
    ];
    const res = await axios.post('http://localhost:4000/api/workflows/run', { nodes: sampleNodes, edges: [] });
    setExecutionLog(res.data);
  };

  return (
    <div style={{ padding: 20, fontFamily: 'sans-serif' }}>
      <h1>TopsFlow MVP Control Panel</h1>

      {!authToken ? (
        <div>
          <h2>1. Autenticación y Activación 2FA</h2>
          <input placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} />
          <input placeholder="Password" type="password" value={password} onChange={e => setPassword(e.target.value)} />
          <button onClick={registerUser}>Registrar</button>

          {userId && (
            <div style={{ marginTop: 10 }}>
              <button onClick={setup2FA}>Configurar 2FA</button>
            </div>
          )}

          {qrCode && (
            <div style={{ marginTop: 10 }}>
              <p>Escanea el código QR con Google Authenticator:</p>
              <img src={qrCode} alt="QR 2FA" />
              <br />
              <input placeholder="Código de 6 dígitos" value={token2FA} onChange={e => setToken2FA(e.target.value)} />
              <button onClick={verify2FA}>Validar 2FA e Iniciar Sesión</button>
            </div>
          )}
        </div>
      ) : (
        <div>
          <h2>2. Motor de Flujos de Trabajo</h2>
          <p style={{ color: 'green' }}>✅ Sesión Iniciada y Autenticada con 2FA</p>
          <button onClick={testWorkflow}>Ejecutar Flujo de Prueba</button>

          {executionLog && (
            <pre style={{ background: '#f4f4f4', padding: 10, marginTop: 10 }}>
              {JSON.stringify(executionLog, null, 2)}
            </pre>
          )}
        </div>
      )}
    </div>
  );
}
`
};

// Función encargada de crear carpetas y escribir los archivos
function createProject() {
  console.log('🚀 Inicializando la creación del MVP para TopsFlow...\n');

  Object.entries(projectStructure).forEach(([filePath, content]) => {
    const absolutePath = path.join(__dirname, filePath);
    const dirPath = path.dirname(absolutePath);

    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath, { recursive: true });
    }

    fs.writeFileSync(absolutePath, content, 'utf8');
    console.log(`  [OK] Archivo creado: ${filePath}`);
  });

  console.log('\n✨ Estrategia de directorios y MVP generados con éxito.');
}

createProject();