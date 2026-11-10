const fs = require('fs');
const path = require('path');

const authenticAppContent = `import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function App() {
  // --- SEGURIDAD & SESIÓN ---
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [userId, setUserId] = useState(null);
  const [qrCode, setQrCode] = useState('');
  const [token2FA, setToken2FA] = useState('');
  const [authToken, setAuthToken] = useState('');

  // --- NAVEGACIÓN Y TEMAS COMPLETOS DE T.O.P.S FLOW ---
  const [activeTab, setActiveTab] = useState('horario'); // 'horario', 'kanban', 'calendario', 'proyectos', 'informes', 'logs'
  const [theme, setTheme] = useState('Claro (Base)');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  // --- MÓDULO 1: GESTIÓN HORARIO ---
  const [activityName, setActivityName] = useState('');
  const [activityDay, setActivityDay] = useState('Lunes');
  const [startTime, setStartTime] = useState('09:00');
  const [endTime, setEndTime] = useState('11:00');
  const [activityColor, setActivityColor] = useState('#2563eb');
  const [scheduleEvents, setScheduleEvents] = useState([]);

  // --- MÓDULO 2: KANBAN ÁGIL ---
  const [kanbanTasks, setKanbanTasks] = useState([
    { id: '1', title: 'Diseñar interfaz responsiva', desc: 'Crear maquetación base para móviles y escritorio.', priority: 'ALTA', pts: '5 pts', user: 'Alex', userBg: '#2563eb', status: 'todo' },
    { id: '2', title: 'Modularizar JS y CSS', desc: 'Desglosar el proyecto en arquitectura de módulos.', priority: 'URGENTE', pts: '3 pts', user: 'Dev', userBg: '#2563eb', status: 'in_progress' },
    { id: '3', title: 'Definir paletas de colores', desc: 'Añadir soporte para 5 temas dinámicos.', priority: 'MEDIA', pts: '2 pts', user: 'UI/UX', userBg: '#2563eb', status: 'done' },
  ]);

  // --- AUTENTICACIÓN Y 2FA ---
  const loginUser = async () => {
    setMessage(''); setError('');
    try {
      const res = await axios.post('http://localhost:4000/api/auth/login', { email, password });
      setUserId(res.data.userId);
      setMessage('Credenciales verificadas. Genera o ingresa tu token 2FA.');
    } catch (err) {
      setError(err.response?.data?.error || 'Error de autenticación.');
    }
  };

  const setup2FA = async () => {
    try {
      const res = await axios.post('http://localhost:4000/api/auth/2fa/setup', { userId });
      setQrCode(res.data.qrCodeUrl);
    } catch (err) {
      setError('Error al obtener el código QR.');
    }
  };

  const verify2FA = async () => {
    setMessage(''); setError('');
    try {
      const res = await axios.post('http://localhost:4000/api/auth/2fa/verify', { userId, token: token2FA });
      setAuthToken(res.data.token);
    } catch (err) {
      setError('Código 2FA incorrecto o expirado.');
    }
  };

  const logoutUser = () => {
    setAuthToken('');
    setUserId(null);
    setQrCode('');
    setToken2FA('');
    setMessage('');
    setError('');
  };

  // --- LÓGICA HORARIO ---
  const addScheduleEvent = () => {
    if (!activityName) return;
    setScheduleEvents([...scheduleEvents, { id: Date.now(), name: activityName, day: activityDay, start: startTime, end: endTime, color: activityColor }]);
    setActivityName('');
  };

  const clearSchedule = () => setScheduleEvents([]);

  // --- ESTILOS DE TEMAS VISTOS EN LA IMAGEN ---
  const getThemeStyles = () => {
    switch (theme) {
      case 'Oscuro':
        return { bg: '#0b1120', cardBg: '#1e293b', border: '#334155', text: '#f8fafc', sidebarBg: '#0f172a', accent: '#2563eb', textMuted: '#94a3b8' };
      case 'Vintage':
        return { bg: '#f5efe6', cardBg: '#e8dfd8', border: '#d3c5b7', text: '#4a3e3d', sidebarBg: '#e3d7cc', accent: '#8c6d58', textMuted: '#786458' };
      case 'Pastel':
        return { bg: '#fbf7f5', cardBg: '#ffffff', border: '#f3e8e2', text: '#4a4e69', sidebarBg: '#f7ede2', accent: '#f72585', textMuted: '#8d99ae' };
      case 'Ocean':
        return { bg: '#e0f2fe', cardBg: '#ffffff', border: '#bae6fd', text: '#0369a1', sidebarBg: '#f0f9ff', accent: '#0284c7', textMuted: '#0284c7' };
      default: // Claro (Base)
        return { bg: '#f8fafc', cardBg: '#ffffff', border: '#e2e8f0', text: '#1e293b', sidebarBg: '#ffffff', accent: '#2563eb', textMuted: '#64748b' };
    }
  };

  const styles = getThemeStyles();

  // =========================================================================
  // BARRERA DE SEGURIDAD STRICTA: SOLO ACCESO TRAS VALIDACIÓN 2FA
  // =========================================================================
  if (!authToken) {
    return (
      <div style={{ fontFamily: 'Inter, system-ui, sans-serif', minHeight: '100vh', background: '#0b1120', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', padding: 20 }}>
        <div style={{ background: '#1e293b', width: '100%', maxWidth: 420, padding: 35, borderRadius: 12, border: '1px solid #334155', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.6)' }}>
          
          <div style={{ textAlign: 'center', marginBottom: 25 }}>
            <div style={{ background: '#2563eb', width: 48, height: 48, borderRadius: 12, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: 24, fontWeight: 'bold', marginBottom: 12 }}>⚡</div>
            <h1 style={{ margin: 0, fontSize: 22, fontWeight: 700 }}>T.o.p.s Flow</h1>
            <p style={{ margin: '6px 0 0 0', fontSize: 13, color: '#94a3b8' }}>Acceso Autenticado y Seguro (2FA)</p>
          </div>

          {message && <div style={{ background: '#064e3b', color: '#34d399', padding: 10, borderRadius: 6, fontSize: 13, marginBottom: 15, border: '1px solid #059669' }}>{message}</div>}
          {error && <div style={{ background: '#7f1d1d', color: '#fca5a5', padding: 10, borderRadius: 6, fontSize: 13, marginBottom: 15, border: '1px solid #dc2626' }}>{error}</div>}

          <div style={{ marginBottom: 12 }}>
            <label style={{ fontSize: 12, color: '#cbd5e1', display: 'block', marginBottom: 4 }}>Correo electrónico</label>
            <input placeholder="usuario@duocuc.cl" value={email} onChange={e => setEmail(e.target.value)} style={{ width: '92%', padding: 10, background: '#0f172a', border: '1px solid #475569', color: '#fff', borderRadius: 6 }} />
          </div>

          <div style={{ marginBottom: 20 }}>
            <label style={{ fontSize: 12, color: '#cbd5e1', display: 'block', marginBottom: 4 }}>Contraseña</label>
            <input placeholder="••••••••" type="password" value={password} onChange={e => setPassword(e.target.value)} style={{ width: '92%', padding: 10, background: '#0f172a', border: '1px solid #475569', color: '#fff', borderRadius: 6 }} />
          </div>

          <button onClick={loginUser} style={{ width: '100%', padding: 12, background: '#2563eb', color: '#fff', border: 'none', borderRadius: 6, fontWeight: 600, cursor: 'pointer', fontSize: 14 }}>
            Ingresar
          </button>

          {userId && (
            <div style={{ marginTop: 20, paddingTop: 20, borderTop: '1px solid #334155' }}>
              <button onClick={setup2FA} style={{ width: '100%', padding: 9, background: '#475569', color: '#fff', border: 'none', borderRadius: 6, marginBottom: 12, cursor: 'pointer', fontSize: 13 }}>
                📷 Generar / Ver QR 2FA
              </button>
              
              {qrCode && (
                <div style={{ textAlign: 'center', marginBottom: 15 }}>
                  <img src={qrCode} alt="QR 2FA" style={{ border: '4px solid #fff', borderRadius: 8, width: 140 }} />
                  <p style={{ fontSize: 11, color: '#94a3b8', marginTop: 5 }}>Escanea el código QR con Google Authenticator o Authy</p>
                </div>
              )}

              <label style={{ fontSize: 12, color: '#cbd5e1', display: 'block', marginBottom: 4 }}>Código 2FA (6 dígitos)</label>
              <input placeholder="Ej: 123456" value={token2FA} onChange={e => setToken2FA(e.target.value)} style={{ width: '92%', padding: 10, background: '#0f172a', border: '1px solid #475569', color: '#fff', borderRadius: 6, marginBottom: 15 }} />
              
              <button onClick={verify2FA} style={{ width: '100%', padding: 12, background: '#16a34a', color: '#fff', border: 'none', borderRadius: 6, fontWeight: 600, cursor: 'pointer', fontSize: 14 }}>
                🔒 Validar 2FA y Entrar
              </button>
            </div>
          )}
        </div>
      </div>
    );
  }

  // =========================================================================
  // PLATAFORMA AUTÉNTICA COMPLETA DE T.O.P.S FLOW
  // =========================================================================
  return (
    <div style={{ fontFamily: 'Inter, system-ui, sans-serif', height: '100vh', display: 'flex', background: styles.bg, color: styles.text }}>
      
      {/* MENÚ LATERAL IZQUIERDO */}
      <aside style={{ width: 250, background: styles.sidebarBg, borderRight: \`1px solid \${styles.border}\`, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', padding: '20px 15px' }}>
        <div>
          {/* Logo T.o.p.s Flow */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 25, paddingLeft: 5 }}>
            <div style={{ background: styles.accent, color: '#fff', width: 28, height: 28, borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: 16 }}>⚡</div>
            <div>
              <h3 style={{ margin: 0, fontSize: 15, fontWeight: 700 }}>T.o.p.s Flow</h3>
              <span style={{ fontSize: 10, color: styles.textMuted }}>Organiza & Optimiza</span>
            </div>
          </div>

          {/* Menú Dinámico */}
          <nav style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            {[
              { id: 'horario', label: '1. Gestión Horario', icon: '🕒' },
              { id: 'kanban', label: '2. Gestión Ágil (Kanban)', icon: '📊' },
              { id: 'calendario', label: '3. Calendario', icon: '📅' },
              { id: 'proyectos', label: '4. Proyectos', icon: '📐' },
              { id: 'informes', label: '5. Archivero de Informes', icon: '📁' },
              { id: 'logs', label: '6. Registro de Cambios', icon: '🕒' },
            ].map(item => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 10,
                  padding: '10px 12px',
                  borderRadius: 8,
                  border: 'none',
                  background: activeTab === item.id ? styles.accent : 'transparent',
                  color: activeTab === item.id ? '#ffffff' : styles.text,
                  fontWeight: activeTab === item.id ? 600 : 400,
                  cursor: 'pointer',
                  textAlign: 'left',
                  fontSize: 13,
                  transition: 'all 0.15s'
                }}
              >
                <span>{item.icon}</span> {item.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Sección Inferior: Cierre de Sesión y Selector de Temas */}
        <div>
          <button 
            onClick={logoutUser} 
            style={{ width: '100%', padding: '8px 12px', background: '#ef4444', color: '#fff', border: 'none', borderRadius: 6, cursor: 'pointer', marginBottom: 15, fontWeight: 600, fontSize: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}
          >
            🚪 Cerrar Sesión
          </button>

          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ fontSize: 11, color: styles.textMuted }}>🎨 Tema</span>
            <select 
              value={theme} 
              onChange={e => setTheme(e.target.value)} 
              style={{ flex: 1, padding: 6, borderRadius: 6, border: \`1px solid \${styles.border}\`, background: styles.cardBg, color: styles.text, fontSize: 11 }}
            >
              <option value="Claro (Base)">Claro (Base)</option>
              <option value="Oscuro">Oscuro</option>
              <option value="Vintage">Vintage</option>
              <option value="Pastel">Pastel</option>
              <option value="Ocean">Ocean</option>
            </select>
          </div>
        </div>
      </aside>

      {/* ÁREA PRINCIPAL / CONTENIDO */}
      <main style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        
        {/* VISTA 1: GESTIÓN HORARIO */}
        {activeTab === 'horario' && (
          <div style={{ padding: '20px 30px', flex: 1, overflowY: 'auto' }}>
            {/* Header del módulo */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 15 }}>
              <div>
                <h2 style={{ margin: 0, fontSize: 20, display: 'flex', alignItems: 'center', gap: 8 }}>📅 Planificación Semestral Inteligente</h2>
                <span style={{ fontSize: 12, color: styles.textMuted }}>Trabajos • Estudios • Prácticas</span>
              </div>
              <div style={{ display: 'flex', gap: 10 }}>
                <button style={{ background: '#10b981', color: '#fff', border: 'none', padding: '8px 14px', borderRadius: 6, fontWeight: 600, fontSize: 12, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6 }}>
                  📥 Exportar PDF
                </button>
                <button onClick={clearSchedule} style={{ background: 'transparent', color: styles.text, border: \`1px solid \${styles.border}\`, padding: '8px 14px', borderRadius: 6, fontSize: 12, cursor: 'pointer' }}>
                  🗑️ Limpiar
                </button>
              </div>
            </div>

            {/* Métrica de Tarjetas Superiores */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 15, marginBottom: 20 }}>
              <div style={{ background: styles.cardBg, padding: 15, borderRadius: 8, border: \`1px solid \${styles.border}\`, borderLeft: \`4px solid \${styles.accent}\` }}>
                <span style={{ fontSize: 11, color: styles.textMuted, fontWeight: 600 }}>TOTAL BLOQUES</span>
                <div style={{ fontSize: 22, fontWeight: 700, marginTop: 4 }}>{scheduleEvents.length}</div>
              </div>
              <div style={{ background: styles.cardBg, padding: 15, borderRadius: 8, border: \`1px solid \${styles.border}\`, borderLeft: \`4px solid \${styles.accent}\` }}>
                <span style={{ fontSize: 11, color: styles.textMuted, fontWeight: 600 }}>HORAS SEMANALES TOTALES</span>
                <div style={{ fontSize: 22, fontWeight: 700, marginTop: 4 }}>{scheduleEvents.length * 2} hrs</div>
              </div>
              <div style={{ background: styles.cardBg, padding: 15, borderRadius: 8, border: \`1px solid \${styles.border}\`, borderLeft: \`4px solid \${styles.accent}\` }}>
                <span style={{ fontSize: 11, color: styles.textMuted, fontWeight: 600 }}>CATEGORÍAS REGISTRADAS</span>
                <div style={{ fontSize: 22, fontWeight: 700, marginTop: 4 }}>{scheduleEvents.length > 0 ? 1 : 0}</div>
              </div>
            </div>

            {/* Sección de Registro y Tabla Semanal */}
            <div style={{ display: 'grid', gridTemplateColumns: '280px 1fr', gap: 20 }}>
              {/* Formulario Lateral */}
              <div style={{ background: styles.cardBg, padding: 20, borderRadius: 10, border: \`1px solid \${styles.border}\` }}>
                <h4 style={{ marginTop: 0, fontSize: 14 }}>➕ Registrar Actividad</h4>
                
                <label style={{ fontSize: 11, color: styles.textMuted, display: 'block', marginBottom: 4 }}>NOMBRE DE LA ACTIVIDAD</label>
                <input value={activityName} onChange={e => setActivityName(e.target.value)} placeholder="Ej: Pega Lopa, Capstone" style={{ width: '90%', padding: 8, marginBottom: 12, borderRadius: 6, border: \`1px solid \${styles.border}\`, background: styles.bg, color: styles.text }} />

                <label style={{ fontSize: 11, color: styles.textMuted, display: 'block', marginBottom: 4 }}>DÍA DE LA SEMANA</label>
                <select value={activityDay} onChange={e => setActivityDay(e.target.value)} style={{ width: '97%', padding: 8, marginBottom: 12, borderRadius: 6, border: \`1px solid \${styles.border}\`, background: styles.bg, color: styles.text }}>
                  {['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'].map(d => <option key={d} value={d}>{d}</option>)}
                </select>

                <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
                  <div style={{ flex: 1 }}>
                    <label style={{ fontSize: 11, color: styles.textMuted }}>HORA INICIO</label>
                    <select value={startTime} onChange={e => setStartTime(e.target.value)} style={{ width: '100%', padding: 6, borderRadius: 6, border: \`1px solid \${styles.border}\`, background: styles.bg, color: styles.text }}>
                      <option value="09:00">09:00</option>
                      <option value="11:00">11:00</option>
                      <option value="14:00">14:00</option>
                    </select>
                  </div>
                  <div style={{ flex: 1 }}>
                    <label style={{ fontSize: 11, color: styles.textMuted }}>HORA FIN</label>
                    <select value={endTime} onChange={e => setEndTime(e.target.value)} style={{ width: '100%', padding: 6, borderRadius: 6, border: \`1px solid \${styles.border}\`, background: styles.bg, color: styles.text }}>
                      <option value="11:00">11:00</option>
                      <option value="13:00">13:00</option>
                      <option value="16:00">16:00</option>
                    </select>
                  </div>
                </div>

                <label style={{ fontSize: 11, color: styles.textMuted, display: 'block', marginBottom: 6 }}>COLOR IDENTIFICADOR</label>
                <div style={{ display: 'flex', gap: 8, marginBottom: 15 }}>
                  {['#2563eb', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'].map(c => (
                    <div key={c} onClick={() => setActivityColor(c)} style={{ width: 20, height: 20, borderRadius: '50%', background: c, cursor: 'pointer', border: activityColor === c ? '2px solid #fff' : 'none' }} />
                  ))}
                </div>

                <button onClick={addScheduleEvent} style={{ width: '100%', padding: 10, background: styles.accent, color: '#fff', border: 'none', borderRadius: 6, fontWeight: 600, cursor: 'pointer', fontSize: 13 }}>
                  + Asignar al Horario
                </button>
              </div>

              {/* Tabla de Horario */}
              <div style={{ background: styles.cardBg, padding: 15, borderRadius: 10, border: \`1px solid \${styles.border}\` }}>
                <div style={{ display: 'grid', gridTemplateColumns: '80px repeat(6, 1fr)', gap: 6, textAlign: 'center', fontWeight: 'bold', fontSize: 11 }}>
                  <div style={{ background: styles.accent, color: '#fff', padding: 8, borderRadius: 4 }}>🕒</div>
                  {['LUN', 'MAR', 'MIÉ', 'JUE', 'VIE', 'SÁB'].map(day => (
                    <div key={day} style={{ background: styles.accent, color: '#fff', padding: 8, borderRadius: 4 }}>{day}</div>
                  ))}
                </div>

                <div style={{ marginTop: 8, display: 'flex', flexDirection: 'column', gap: 6 }}>
                  {['08:00 - 09:00', '09:00 - 10:00', '10:00 - 11:00', '11:00 - 12:00', '12:00 - 13:00', '13:00 - 14:00'].map(slot => (
                    <div key={slot} style={{ display: 'grid', gridTemplateColumns: '80px repeat(6, 1fr)', gap: 6, height: 38 }}>
                      <div style={{ fontSize: 10, color: styles.textMuted, display: 'flex', alignItems: 'center', justifyContent: 'center', background: styles.bg, borderRadius: 4 }}>{slot}</div>
                      {['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'].map(day => {
                        const ev = scheduleEvents.find(e => e.day === day && e.start === slot.split(' - ')[0]);
                        return (
                          <div key={day} style={{ background: ev ? ev.color : styles.bg, color: '#fff', borderRadius: 4, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 600 }}>
                            {ev ? ev.name : ''}
                          </div>
                        );
                      })}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* VISTA 2: GESTIÓN ÁGIL (KANBAN) */}
        {activeTab === 'kanban' && (
          <div style={{ padding: '20px 30px', flex: 1, overflowY: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <div>
                <h2 style={{ margin: 0, fontSize: 20 }}>📊 Gestión Ágil (Kanban)</h2>
                <span style={{ fontSize: 12, color: styles.textMuted }}>Organiza tus tareas en etapas, asigna prioridades y mide los puntos de esfuerzo.</span>
              </div>
              <button style={{ background: styles.accent, color: '#fff', border: 'none', padding: '8px 16px', borderRadius: 6, fontWeight: 600, fontSize: 13, cursor: 'pointer' }}>
                + Nueva Tarjeta
              </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20 }}>
              {[
                { key: 'todo', title: '🟡 Por Hacer', count: kanbanTasks.filter(t => t.status === 'todo').length },
                { key: 'in_progress', title: '🔵 En Desarrollo', count: kanbanTasks.filter(t => t.status === 'in_progress').length },
                { key: 'done', title: '🟢 Hecho / Completado', count: kanbanTasks.filter(t => t.status === 'done').length },
              ].map(col => (
                <div key={col.key} style={{ background: styles.cardBg, padding: 15, borderRadius: 10, border: \`1px solid \${styles.border}\` }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 15 }}>
                    <strong style={{ fontSize: 13 }}>{col.title}</strong>
                    <span style={{ background: styles.bg, padding: '2px 8px', borderRadius: 10, fontSize: 11, fontWeight: 600 }}>{col.count}</span>
                  </div>
                  {kanbanTasks.filter(t => t.status === col.key).map(task => (
                    <div key={task.id} style={{ background: styles.bg, padding: 14, borderRadius: 8, border: \`1px solid \${styles.border}\`, marginBottom: 12 }}>
                      <span style={{ fontSize: 9, fontWeight: 700, padding: '2px 6px', borderRadius: 4, background: '#fee2e2', color: '#991b1b' }}>{task.priority}</span>
                      <h4 style={{ margin: '8px 0 4px 0', fontSize: 13 }}>{task.title}</h4>
                      <p style={{ margin: 0, fontSize: 11, color: styles.textMuted }}>{task.desc}</p>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 12 }}>
                        <span style={{ fontSize: 11, color: styles.textMuted }}>⚡ {task.pts}</span>
                        <div style={{ background: task.userBg, color: '#fff', width: 24, height: 24, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, fontWeight: 'bold' }}>{task.user[0]}</div>
                      </div>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* VISTA 3: CALENDARIO */}
        {activeTab === 'calendario' && (
          <div style={{ padding: '20px 30px', flex: 1, overflowY: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 15 }}>
              <div>
                <h2 style={{ margin: 0, fontSize: 20 }}>📆 Calendario Integrado</h2>
                <span style={{ fontSize: 12, color: styles.textMuted }}>Visualiza y navega por tus actividades y tareas registradas en vistas Mensual, Diaria y Anual.</span>
              </div>
              <div style={{ display: 'flex', gap: 4, background: styles.cardBg, padding: 4, borderRadius: 6, border: \`1px solid \${styles.border}\` }}>
                <button style={{ background: styles.accent, color: '#fff', border: 'none', padding: '4px 10px', borderRadius: 4, fontSize: 11 }}>Mes</button>
                <button style={{ background: 'transparent', color: styles.text, border: 'none', padding: '4px 10px', fontSize: 11 }}>Día</button>
                <button style={{ background: 'transparent', color: styles.text, border: 'none', padding: '4px 10px', fontSize: 11 }}>Año</button>
              </div>
            </div>

            <div style={{ background: styles.cardBg, padding: 20, borderRadius: 10, border: \`1px solid \${styles.border}\` }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 15 }}>
                <div style={{ display: 'flex', gap: 10 }}>
                  <button style={{ padding: '4px 8px' }}>&lt;</button>
                  <button style={{ padding: '4px 8px' }}>Hoy</button>
                  <button style={{ padding: '4px 8px' }}>&gt;</button>
                </div>
                <h3 style={{ margin: 0, fontSize: 16 }}>Noviembre 2026</h3>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 8, textAlign: 'center', fontWeight: 'bold', fontSize: 11 }}>
                {['LUN', 'MAR', 'MIÉ', 'JUE', 'VIE', 'SÁB', 'DOM'].map(d => <div key={d}>{d}</div>)}
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 8, marginTop: 10 }}>
                {Array.from({ length: 30 }).map((_, i) => (
                  <div key={i} style={{ background: i === 8 ? '#dbeafe' : styles.bg, height: 75, padding: 6, borderRadius: 6, border: \`1px solid \${styles.border}\`, fontSize: 11, fontWeight: i === 8 ? 'bold' : 'normal' }}>
                    {i + 1}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* VISTA 4: PROYECTOS */}
        {activeTab === 'proyectos' && (
          <div style={{ padding: '20px 30px', flex: 1, overflowY: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 15 }}>
              <div>
                <h2 style={{ margin: 0, fontSize: 20 }}>📐 Gestión Integral de Proyectos</h2>
                <span style={{ fontSize: 12, color: styles.textMuted }}>Planifica, ejecuta y gestiona tus proyectos desde la idea inicial hasta la entrega final.</span>
              </div>
              <button style={{ background: styles.accent, color: '#fff', border: 'none', padding: '8px 16px', borderRadius: 6, fontWeight: 600, fontSize: 13, cursor: 'pointer' }}>
                + Nuevo Proyecto
              </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 15, marginBottom: 20 }}>
              <div style={{ background: styles.cardBg, padding: 15, borderRadius: 8, border: \`1px solid \${styles.border}\`, borderLeft: \`4px solid \${styles.accent}\` }}>
                <span style={{ fontSize: 11, color: styles.textMuted }}>PROYECTOS ACTIVOS</span>
                <div style={{ fontSize: 20, fontWeight: 700, marginTop: 4 }}>2</div>
              </div>
              <div style={{ background: styles.cardBg, padding: 15, borderRadius: 8, border: \`1px solid \${styles.border}\`, borderLeft: \`4px solid \${styles.accent}\` }}>
                <span style={{ fontSize: 11, color: styles.textMuted }}>PROGRESO PROMEDIO</span>
                <div style={{ fontSize: 20, fontWeight: 700, marginTop: 4 }}>65%</div>
              </div>
              <div style={{ background: styles.cardBg, padding: 15, borderRadius: 8, border: \`1px solid \${styles.border}\`, borderLeft: \`4px solid \${styles.accent}\` }}>
                <span style={{ fontSize: 11, color: styles.textMuted }}>COMPLETADOS</span>
                <div style={{ fontSize: 20, fontWeight: 700, marginTop: 4 }}>0</div>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 20 }}>
              <div style={{ background: styles.cardBg, padding: 20, borderRadius: 10, border: \`1px solid \${styles.border}\` }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <h3 style={{ margin: 0, fontSize: 15 }}>Proyecto de Titulación (Capstone)</h3>
                  <span style={{ background: '#dbeafe', color: '#1e40af', padding: '2px 8px', borderRadius: 4, fontSize: 10, fontWeight: 600 }}>2. En Desarrollo / Ejecución</span>
                </div>
                <p style={{ fontSize: 12, color: styles.textMuted, marginTop: 8 }}>Desarrollo del software base, documentación de arquitectura e informe final.</p>
                <div style={{ marginTop: 15 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, marginBottom: 4 }}>
                    <span>Progreso de Fase</span>
                    <span>45%</span>
                  </div>
                  <div style={{ background: styles.bg, height: 6, borderRadius: 3, overflow: 'hidden' }}>
                    <div style={{ background: styles.accent, width: '45%', height: '100%' }} />
                  </div>
                </div>
              </div>

              <div style={{ background: styles.cardBg, padding: 20, borderRadius: 10, border: \`1px solid \${styles.border}\` }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <h3 style={{ margin: 0, fontSize: 15 }}>Rediseño T.o.p.s Flow</h3>
                  <span style={{ background: '#dbeafe', color: '#1e40af', padding: '2px 8px', borderRadius: 4, fontSize: 10, fontWeight: 600 }}>3. Pruebas & Ajustes</span>
                </div>
                <p style={{ fontSize: 12, color: styles.textMuted, marginTop: 8 }}>Implementación del sistema modular y motor de temas personalizados.</p>
                <div style={{ marginTop: 15 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, marginBottom: 4 }}>
                    <span>Progreso de Fase</span>
                    <span>85%</span>
                  </div>
                  <div style={{ background: styles.bg, height: 6, borderRadius: 3, overflow: 'hidden' }}>
                    <div style={{ background: styles.accent, width: '85%', height: '100%' }} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* VISTA 5: ARCHIVERO DE INFORMES */}
        {activeTab === 'informes' && (
          <div style={{ padding: '20px 30px', flex: 1, overflowY: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 15 }}>
              <div>
                <h2 style={{ margin: 0, fontSize: 20 }}>📁 Archivero de Informes & Documentos</h2>
                <span style={{ fontSize: 12, color: styles.textMuted }}>Sube archivos locales o vincula documentos desde Google Drive para una gestión centralizada.</span>
              </div>
              <button style={{ background: styles.accent, color: '#fff', border: 'none', padding: '8px 16px', borderRadius: 6, fontWeight: 600, fontSize: 13, cursor: 'pointer' }}>
                + Agregar Documento
              </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 15, marginBottom: 20 }}>
              <div style={{ background: styles.cardBg, padding: 15, borderRadius: 8, border: \`1px solid \${styles.border}\`, borderLeft: \`4px solid \${styles.accent}\` }}>
                <span style={{ fontSize: 11, color: styles.textMuted }}>DOCUMENTOS TOTALES</span>
                <div style={{ fontSize: 20, fontWeight: 700, marginTop: 4 }}>0</div>
              </div>
              <div style={{ background: styles.cardBg, padding: 15, borderRadius: 8, border: \`1px solid \${styles.border}\`, borderLeft: \`4px solid \${styles.accent}\` }}>
                <span style={{ fontSize: 11, color: styles.textMuted }}>ARCHIVOS LOCALES</span>
                <div style={{ fontSize: 20, fontWeight: 700, marginTop: 4 }}>0</div>
              </div>
              <div style={{ background: styles.cardBg, padding: 15, borderRadius: 8, border: \`1px solid \${styles.border}\`, borderLeft: \`4px solid \${styles.accent}\` }}>
                <span style={{ fontSize: 11, color: styles.textMuted }}>ENLACES A DRIVE</span>
                <div style={{ fontSize: 20, fontWeight: 700, marginTop: 4 }}>0</div>
              </div>
            </div>

            <div style={{ background: styles.cardBg, padding: 50, borderRadius: 10, textAlign: 'center', border: \`1px solid \${styles.border}\` }}>
              <p style={{ color: styles.textMuted, fontSize: 13 }}>No tienes documentos ni informes guardados. Haz clic en "Agregar Documento" para subir uno.</p>
            </div>
          </div>
        )}

        {/* VISTA 6: REGISTRO DE CAMBIOS */}
        {activeTab === 'logs' && (
          <div style={{ padding: '20px 30px', flex: 1, overflowY: 'auto' }}>
            <h2 style={{ margin: '0 0 15px 0', fontSize: 20 }}>📜 Registro de Cambios (Changelog)</h2>
            <div style={{ background: styles.cardBg, padding: 25, borderRadius: 10, border: \`1px solid \${styles.border}\` }}>
              <p style={{ color: styles.textMuted, fontSize: 13, margin: 0 }}>Historial de auditoría y actualizaciones del sistema activo y verificado en PostgreSQL.</p>
            </div>
          </div>
        )}

      </main>
    </div>
  );
}
`;

fs.writeFileSync(path.join(__dirname, 'apps/frontend/src/App.jsx'), authenticAppContent, 'utf8');
console.log('✅ Interfaz de T.o.p.s Flow reconstruida con estética original y cierre de sesión.');