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
            <button onClick={registerUser} style={{ padding: '8px 16px', cursor: 'pointer' }}>Registrar</button>
          </div>

          {userId && (
            <div style={{ marginTop: 15, padding: 15, background: '#f7fafc', border: '1px solid #e2e8f0', borderRadius: 6 }}>
              <p>✅ Usuario registrado correctamente (ID: {userId})</p>
              <button onClick={setup2FA} style={{ padding: '8px 16px', cursor: 'pointer', background: '#3182ce', color: '#fff', border: 'none', borderRadius: 4 }}>
                Configurar 2FA
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

fs.writeFileSync(path.join(__dirname, 'apps/frontend/src/App.jsx'), appJsxContent, 'utf8');
console.log('✅ Componente App.jsx actualizado con alertas de estado y errores.');