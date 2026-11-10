const fs = require('fs');
const path = require('path');

const appJsxContent = `import React, { useState } from 'react';
import axios from 'axios';

export default function App() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [userId, setUserId] = useState(null);
  const [qrCode, setQrCode] = useState('');
  const [token2FA, setToken2FA] = useState('');
  const [authToken, setAuthToken] = useState('');
  const [executionLog, setExecutionLog] = useState(null);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const registerUser = async () => {
    setMessage('');
    setError('');
    try {
      const res = await axios.post('http://localhost:4000/api/auth/register', { email, password });
      setUserId(res.data.userId);
      setMessage(res.data.message || 'Usuario registrado con éxito.');
    } catch (err) {
      setError(err.response?.data?.error || 'Error al conectar con el servidor.');
    }
  };

  const loginUser = async () => {
    setMessage('');
    setError('');
    try {
      const res = await axios.post('http://localhost:4000/api/auth/login', { email, password });
      setUserId(res.data.userId);
      setMessage('Usuario encontrado. Procede a configurar o validar tu 2FA.');
    } catch (err) {
      setError(err.response?.data?.error || 'Credenciales inválidas.');
    }
  };

  const setup2FA = async () => {
    setMessage('');
    setError('');
    try {
      const res = await axios.post('http://localhost:4000/api/auth/2fa/setup', { userId });
      setQrCode(res.data.qrCodeUrl);
      setMessage('Código QR generado. Escanéalo con tu app 2FA.');
    } catch (err) {
      setError(err.response?.data?.error || 'Error al configurar 2FA.');
    }
  };

  const verify2FA = async () => {
    setMessage('');
    setError('');
    try {
      const res = await axios.post('http://localhost:4000/api/auth/2fa/verify', { userId, token: token2FA });
      setAuthToken(res.data.token);
      setMessage('¡Autenticación 2FA exitosa!');
    } catch (err) {
      setError(err.response?.data?.error || 'Código 2FA incorrecto.');
    }
  };

  const testWorkflow = async () => {
    try {
      const sampleNodes = [
        { id: '1', type: 'trigger', data: { label: 'Inicio Evento' } },
        { id: '2', type: 'action', data: { label: 'Enviar Email' } }
      ];
      const res = await axios.post('http://localhost:4000/api/workflows/run', { nodes: sampleNodes, edges: [] });
      setExecutionLog(res.data);
    } catch (err) {
      setError('Error al ejecutar el flujo.');
    }
  };

  return (
    <div style={{ padding: 20, fontFamily: 'sans-serif', maxWidth: 600, margin: '0 auto' }}>
      <h1>TopsFlow MVP Control Panel</h1>

      {message && <div style={{ padding: 10, background: '#e6fffa', color: '#234e52', marginBottom: 10, borderRadius: 4 }}>{message}</div>}
      {error && <div style={{ padding: 10, background: '#fff5f5', color: '#9b2c2c', marginBottom: 10, borderRadius: 4 }}>{error}</div>}

      {!authToken ? (
        <div>
          <h2>1. Autenticación y Activación 2FA</h2>
          <div style={{ display: 'flex', gap: 10, marginBottom: 10 }}>
            <input 
              placeholder="Email" 
              value={email} 
              onChange={e => setEmail(e.target.value)} 
              style={{ padding: 8, flex: 1 }}
            />
            <input 
              placeholder="Password" 
              type="password" 
              value={password} 
              onChange={e => setPassword(e.target.value)} 
              style={{ padding: 8, flex: 1 }}
            />
            <button onClick={registerUser} style={{ padding: '8px 12px', cursor: 'pointer' }}>Registrar</button>
            <button onClick={loginUser} style={{ padding: '8px 12px', cursor: 'pointer', background: '#4a5568', color: '#fff', border: 'none', borderRadius: 4 }}>Iniciar Sesión</button>
          </div>

          {userId && (
            <div style={{ marginTop: 15, padding: 15, background: '#f7fafc', border: '1px solid #e2e8f0', borderRadius: 6 }}>
              <p>✅ Usuario activo (ID: {userId})</p>
              <button onClick={setup2FA} style={{ padding: '8px 16px', cursor: 'pointer', background: '#3182ce', color: '#fff', border: 'none', borderRadius: 4 }}>
                Configurar / Ver Código QR 2FA
              </button>
            </div>
          )}

          {qrCode && (
            <div style={{ marginTop: 15, padding: 15, background: '#f7fafc', border: '1px solid #e2e8f0', borderRadius: 6 }}>
              <p>Escanea el código QR con tu app de autenticación (Google Authenticator / Authy):</p>
              <img src={qrCode} alt="QR 2FA" style={{ display: 'block', margin: '10px 0' }} />
              <input 
                placeholder="Código de 6 dígitos" 
                value={token2FA} 
                onChange={e => setToken2FA(e.target.value)} 
                style={{ padding: 8, marginRight: 10 }}
              />
              <button onClick={verify2FA} style={{ padding: '8px 16px', cursor: 'pointer', background: '#38a169', color: '#fff', border: 'none', borderRadius: 4 }}>
                Validar 2FA e Iniciar Sesión
              </button>
            </div>
          )}
        </div>
      ) : (
        <div>
          <h2>2. Motor de Flujos de Trabajo</h2>
          <p style={{ color: 'green', fontWeight: 'bold' }}>✅ Sesión Iniciada y Autenticada con 2FA</p>
          <button onClick={testWorkflow} style={{ padding: '10px 20px', cursor: 'pointer' }}>Ejecutar Flujo de Prueba</button>

          {executionLog && (
            <pre style={{ background: '#1a202c', color: '#63b3ed', padding: 15, marginTop: 15, borderRadius: 6, overflowX: 'auto' }}>
              {JSON.stringify(executionLog, null, 2)}
            </pre>
          )}
        </div>
      )}
    </div>
  );
}
`;

const appBackendContent = `const express = require('express');
const cors = require('cors');
const QRCode = require('qrcode');
const { prisma } = require('@topsflow/database');
const { hashPassword, comparePassword, generateToken, generate2FASecret, verify2FAToken } = require('./utils/auth');
const { executeWorkflow } = require('./core/engine');

const app = express();

app.use(cors());
app.use(express.json());

// 1. Registro
app.post('/api/auth/register', async (req, res) => {
  const { email, password } = req.body;
  try {
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ error: 'El correo electrónico ya está registrado.' });
    }

    const passwordHash = await hashPassword(password);
    const user = await prisma.user.create({ data: { email, passwordHash } });
    res.json({ message: 'Usuario registrado con éxito', userId: user.id });
  } catch (e) {
    res.status(500).json({ error: 'Error interno al registrar usuario: ' + e.message });
  }
});

// 2. Login básico previo a 2FA
app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return res.status(400).json({ error: 'Usuario no encontrado.' });

    const validPassword = await comparePassword(password, user.passwordHash);
    if (!validPassword) return res.status(400).json({ error: 'Contraseña incorrecta.' });

    res.json({ message: 'Login exitoso', userId: user.id, twoFactorEnabled: user.twoFactorEnabled });
  } catch (e) {
    res.status(500).json({ error: 'Error al iniciar sesión: ' + e.message });
  }
});

// 3. Configurar 2FA
app.post('/api/auth/2fa/setup', async (req, res) => {
  const { userId } = req.body;
  try {
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) return res.status(404).json({ error: 'Usuario no encontrado' });

    let secret = user.twoFactorSecret;
    if (!secret) {
      const generated = generate2FASecret(user.email);
      secret = generated.secret;
      await prisma.user.update({
        where: { id: userId },
        data: { twoFactorSecret: secret }
      });
    }

    const { authenticator } = require('otplib');
    const otpauth = authenticator.keyuri(user.email, 'TopsFlow', secret);
    const qrCodeUrl = await QRCode.toDataURL(otpauth);

    res.json({ qrCodeUrl, secret });
  } catch (e) {
    res.status(500).json({ error: 'Error al generar clave 2FA: ' + e.message });
  }
});

// 4. Validar token 2FA
app.post('/api/auth/2fa/verify', async (req, res) => {
  const { userId, token } = req.body;
  try {
    const user = await prisma.user.findUnique({ where: { id: userId } });

    if (!user || !user.twoFactorSecret) {
      return res.status(400).json({ error: 'Primero debes generar la clave 2FA' });
    }

    const isValid = verify2FAToken(token, user.twoFactorSecret);
    if (!isValid) {
      return res.status(401).json({ error: 'Código 2FA incorrecto o expirado' });
    }

    await prisma.user.update({
      where: { id: userId },
      data: { twoFactorEnabled: true }
    });

    const jwtToken = generateToken({ id: user.id, email: user.email });
    res.json({ message: 'Autenticación exitosa', token: jwtToken });
  } catch (e) {
    res.status(500).json({ error: 'Error al validar 2FA: ' + e.message });
  }
});

// 5. Motor de Flujos
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
  console.log(\`🚀 Servidor Backend activo en http://localhost:\${PORT}\`);
});
`;

fs.writeFileSync(path.join(__dirname, 'apps/frontend/src/App.jsx'), appJsxContent, 'utf8');
fs.writeFileSync(path.join(__dirname, 'apps/backend/src/app.js'), appBackendContent, 'utf8');
console.log('✅ Sistema actualizado con endpoint de Login y botón en el frontend.');