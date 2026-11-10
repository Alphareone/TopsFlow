import React, { useState } from 'react';
import axios from 'axios';

export default function LoginForm({ onLoginSuccess }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [userId, setUserId] = useState(null);
  const [qrCode, setQrCode] = useState('');
  const [token2FA, setToken2FA] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const loginUser = async (e) => {
    e.preventDefault();
    setMessage(''); setError('');
    try {
      const res = await axios.post('http://localhost:4000/api/auth/login', { email, password });
      setUserId(res.data.userId);
      setMessage('Credenciales verificadas. Procede con el código 2FA.');
    } catch (err) {
      setError(err.response?.data?.error || 'Error de autenticación.');
    }
  };

  const setup2FA = async () => {
    try {
      const res = await axios.post('http://localhost:4000/api/auth/2fa/setup', { userId });
      setQrCode(res.data.qrCodeUrl);
    } catch (err) {
      setError('Error al generar QR.');
    }
  };

  const verify2FA = async (e) => {
    e.preventDefault();
    setMessage(''); setError('');
    try {
      const res = await axios.post('http://localhost:4000/api/auth/2fa/verify', { userId, token: token2FA });
      localStorage.setItem('token', res.data.token);
      onLoginSuccess(res.data.token);
    } catch (err) {
      setError('Código 2FA incorrecto o expirado.');
    }
  };

  return (
    <div style={{ fontFamily: 'Inter, sans-serif', minHeight: '100vh', background: '#0b1120', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', padding: 20 }}>
      <div style={{ background: '#1e293b', width: '100%', maxWidth: 420, padding: 35, borderRadius: 12, border: '1px solid #334155', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.6)' }}>
        <div style={{ textAlign: 'center', marginBottom: 25 }}>
          <div style={{ background: '#2563eb', width: 48, height: 48, borderRadius: 12, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: 24, fontWeight: 'bold', marginBottom: 12 }}>⚡</div>
          <h1 style={{ margin: 0, fontSize: 22, fontWeight: 700 }}>T.o.p.s Flow</h1>
          <p style={{ margin: '6px 0 0 0', fontSize: 13, color: '#94a3b8' }}>Acceso Autenticado y Seguro (2FA)</p>
        </div>

        {message && <div style={{ background: '#064e3b', color: '#34d399', padding: 10, borderRadius: 6, fontSize: 13, marginBottom: 15, border: '1px solid #059669' }}>{message}</div>}
        {error && <div style={{ background: '#7f1d1d', color: '#fca5a5', padding: 10, borderRadius: 6, fontSize: 13, marginBottom: 15, border: '1px solid #dc2626' }}>{error}</div>}

        <form onSubmit={loginUser}>
          <div style={{ marginBottom: 12 }}>
            <label style={{ fontSize: 12, color: '#cbd5e1', display: 'block', marginBottom: 4 }}>Correo electrónico</label>
            <input placeholder="usuario@duocuc.cl" value={email} onChange={e => setEmail(e.target.value)} style={{ width: '92%', padding: 10, background: '#0f172a', border: '1px solid #475569', color: '#fff', borderRadius: 6 }} />
          </div>

          <div style={{ marginBottom: 20 }}>
            <label style={{ fontSize: 12, color: '#cbd5e1', display: 'block', marginBottom: 4 }}>Contraseña</label>
            <input placeholder="••••••••" type="password" value={password} onChange={e => setPassword(e.target.value)} style={{ width: '92%', padding: 10, background: '#0f172a', border: '1px solid #475569', color: '#fff', borderRadius: 6 }} />
          </div>

          <button type="submit" style={{ width: '100%', padding: 12, background: '#2563eb', color: '#fff', border: 'none', borderRadius: 6, fontWeight: 600, cursor: 'pointer', fontSize: 14 }}>
            Ingresar
          </button>
        </form>

        {userId && (
          <div style={{ marginTop: 20, paddingTop: 20, borderTop: '1px solid #334155' }}>
            <button type="button" onClick={setup2FA} style={{ width: '100%', padding: 9, background: '#475569', color: '#fff', border: 'none', borderRadius: 6, marginBottom: 12, cursor: 'pointer', fontSize: 13 }}>
              📷 Generar / Ver QR 2FA
            </button>
            
            {qrCode && (
              <div style={{ textAlign: 'center', marginBottom: 15 }}>
                <img src={qrCode} alt="QR 2FA" style={{ border: '4px solid #fff', borderRadius: 8, width: 140 }} />
              </div>
            )}

            <form onSubmit={verify2FA}>
              <label style={{ fontSize: 12, color: '#cbd5e1', display: 'block', marginBottom: 4 }}>Código 2FA (6 dígitos)</label>
              <input placeholder="Ej: 123456" value={token2FA} onChange={e => setToken2FA(e.target.value)} style={{ width: '92%', padding: 10, background: '#0f172a', border: '1px solid #475569', color: '#fff', borderRadius: 6, marginBottom: 15 }} />
              <button type="submit" style={{ width: '100%', padding: 12, background: '#16a34a', color: '#fff', border: 'none', borderRadius: 6, fontWeight: 600, cursor: 'pointer', fontSize: 14 }}>
                🔒 Validar 2FA y Entrar
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
