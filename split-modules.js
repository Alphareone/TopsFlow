const fs = require('fs');
const path = require('path');

// 1. Sidebar Component
const sidebarContent = `import React from 'react';

export default function Sidebar({ activeTab, setActiveTab, onLogout, theme, setTheme }) {
  const getThemeStyles = () => {
    switch (theme) {
      case 'Oscuro': return { sidebarBg: '#0f172a', border: '#334155', text: '#f8fafc', accent: '#2563eb', textMuted: '#94a3b8' };
      case 'Vintage': return { sidebarBg: '#e3d7cc', border: '#d3c5b7', text: '#4a3e3d', accent: '#8c6d58', textMuted: '#786458' };
      case 'Pastel': return { sidebarBg: '#f7ede2', border: '#f3e8e2', text: '#4a4e69', accent: '#f72585', textMuted: '#8d99ae' };
      case 'Ocean': return { sidebarBg: '#f0f9ff', border: '#bae6fd', text: '#0369a1', accent: '#0284c7', textMuted: '#0284c7' };
      default: return { sidebarBg: '#ffffff', border: '#e2e8f0', text: '#1e293b', accent: '#2563eb', textMuted: '#64748b' };
    }
  };

  const styles = getThemeStyles();

  return (
    <aside style={{ width: 250, background: styles.sidebarBg, borderRight: \`1px solid \${styles.border}\`, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', padding: '20px 15px' }}>
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 25, paddingLeft: 5 }}>
          <div style={{ background: styles.accent, color: '#fff', width: 28, height: 28, borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: 16 }}>⚡</div>
          <div>
            <h3 style={{ margin: 0, fontSize: 15, fontWeight: 700, color: styles.text }}>T.o.p.s Flow</h3>
            <span style={{ fontSize: 10, color: styles.textMuted }}>Organiza & Optimiza</span>
          </div>
        </div>

        <nav style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          {[
            { id: 'horario', label: '1. Gestión Horario', icon: '🕒' },
            { id: 'kanban', label: '2. Gestión Ágil (Kanban)', icon: '📊' },
            { id: 'calendario', label: '3. Calendario', icon: '📅' },
            { id: 'proyectos', label: '4. Proyectos', icon: '📐' },
          ].map(item => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              style={{
                display: 'flex', alignItems: 'center', gap: 10, padding: '10px 12px', borderRadius: 8, border: 'none',
                background: activeTab === item.id ? styles.accent : 'transparent',
                color: activeTab === item.id ? '#ffffff' : styles.text,
                fontWeight: activeTab === item.id ? 600 : 400, cursor: 'pointer', textAlign: 'left', fontSize: 13
              }}
            >
              <span>{item.icon}</span> {item.label}
            </button>
          ))}
        </nav>
      </div>

      <div>
        <button onClick={onLogout} style={{ width: '100%', padding: '8px 12px', background: '#ef4444', color: '#fff', border: 'none', borderRadius: 6, cursor: 'pointer', marginBottom: 15, fontWeight: 600, fontSize: 12 }}>
          🚪 Cerrar Sesión
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontSize: 11, color: styles.textMuted }}>🎨 Tema</span>
          <select value={theme} onChange={e => setTheme(e.target.value)} style={{ flex: 1, padding: 6, borderRadius: 6, border: \`1px solid \${styles.border}\`, background: '#fff', color: '#000', fontSize: 11 }}>
            <option value="Claro (Base)">Claro (Base)</option>
            <option value="Oscuro">Oscuro</option>
            <option value="Vintage">Vintage</option>
            <option value="Pastel">Pastel</option>
            <option value="Ocean">Ocean</option>
          </select>
        </div>
      </div>
    </aside>
  );
}
`;

// 2. Header Component
const headerContent = `import React from 'react';

export default function Header({ activeTab }) {
  const titles = {
    horario: '📅 Planificación Semestral Inteligente',
    kanban: '📊 Gestión Ágil (Kanban)',
    calendario: '📆 Calendario Integrado',
    proyectos: '📐 Gestión Integral de Proyectos',
  };

  return (
    <header style={{ padding: '15px 30px', borderBottom: '1px solid #e2e8f0', background: '#ffffff', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <h2 style={{ margin: 0, fontSize: 18, fontWeight: 700, color: '#0f172a' }}>{titles[activeTab] || 'T.o.p.s Flow'}</h2>
      <span style={{ background: '#dcfce7', color: '#166534', padding: '4px 12px', borderRadius: 20, fontSize: 12, fontWeight: 600 }}>
        🟢 Sesión 2FA Verificada
      </span>
    </header>
  );
}
`;

// 3. Login Feature
const loginContent = `import React, { useState } from 'react';
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
`;

// Escribir archivos en la estructura modular
fs.writeFileSync(path.join(__dirname, 'apps/frontend/src/components/Sidebar.jsx'), sidebarContent, 'utf8');
fs.writeFileSync(path.join(__dirname, 'apps/frontend/src/components/Header.jsx'), headerContent, 'utf8');
fs.writeFileSync(path.join(__dirname, 'apps/frontend/src/features/auth/LoginForm.jsx'), loginContent, 'utf8');

console.log('✅ Componentes principales extraídos y modularizados en apps/frontend/src/');