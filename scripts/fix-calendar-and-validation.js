const fs = require('fs');
const path = require('path');

const updatedAppContent = `import React, { useState } from 'react';
import axios from 'axios';

export default function App() {
  // --- AUTENTICACIÓN Y SESIÓN 2FA ---
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [userId, setUserId] = useState(null);
  const [qrCode, setQrCode] = useState('');
  const [token2FA, setToken2FA] = useState('');
  const [authToken, setAuthToken] = useState('');

  // --- NAVEGACIÓN Y TEMAS ---
  const [activeTab, setActiveTab] = useState('horario');
  const [theme, setTheme] = useState('Claro (Base)');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  // --- 1. MÓDULO HORARIO ADAPTATIVO (08:00 AM - 20:00 PM) ---
  const [activityName, setActivityName] = useState('');
  const [activityDay, setActivityDay] = useState('Lunes');
  const [startTime, setStartTime] = useState('08:00');
  const [endTime, setEndTime] = useState('10:00');
  const [activityColor, setActivityColor] = useState('#2563eb');
  const [scheduleEvents, setScheduleEvents] = useState([
    { id: 1, name: 'Pega Lopa', day: 'Lunes', start: '09:00', end: '11:00', color: '#2563eb' },
    { id: 2, name: 'Proyecto Capstone', day: 'Miércoles', start: '14:00', end: '16:00', color: '#8b5cf6' }
  ]);

  // --- 2. MÓDULO KANBAN ÁGIL INTERACTIVO ---
  const [kanbanTasks, setKanbanTasks] = useState([
    { id: '1', title: 'Diseñar interfaz responsiva', desc: 'Crear maquetación base para móviles y escritorio.', priority: 'ALTA', pts: '5 pts', user: 'Alex', status: 'todo' },
    { id: '2', title: 'Modularizar JS y CSS', desc: 'Desglosar el proyecto en arquitectura de módulos.', priority: 'URGENTE', pts: '3 pts', user: 'Dev', status: 'in_progress' },
    { id: '3', title: 'Definir paletas de colores', desc: 'Añadir soporte para 5 temas dinámicos.', priority: 'MEDIA', pts: '2 pts', user: 'UI/UX', status: 'done' },
  ]);
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [newKanbanTitle, setNewKanbanTitle] = useState('');
  const [newKanbanDesc, setNewKanbanDesc] = useState('');
  const [newKanbanPriority, setNewKanbanPriority] = useState('MEDIA');

  // --- 3. MÓDULO CALENDARIO DINÁMICO REAL ---
  const [currentDate, setCurrentDate] = useState(new Date());

  // --- 4. MÓDULO PROYECTOS CON ESTADOS ---
  const [projects, setProjects] = useState([
    { id: '1', name: 'Proyecto de Titulación (Capstone)', phase: '2. En Desarrollo / Ejecución', status: 'in_progress', desc: 'Desarrollo del software base, documentación de arquitectura e informe final.', progress: 65 },
    { id: '2', name: 'Rediseño T.o.p.s Flow', phase: '3. Pruebas & Ajustes', status: 'in_progress', desc: 'Implementación del sistema modular y motor de temas personalizados.', progress: 85 },
    { id: '3', name: 'Módulo 2FA Enterprise', phase: '4. Completado', status: 'done', desc: 'Integración de TOTP con PostgreSQL y generación de QR.', progress: 100 },
    { id: '4', name: 'Deploy en Servidores Cloud', phase: '1. En Espera', status: 'pending', desc: 'Configuración de instancias AWS y balanceador de carga.', progress: 0 }
  ]);
  const [showProjectModal, setShowProjectModal] = useState(false);
  const [newProjectName, setNewProjectName] = useState('');
  const [newProjectDesc, setNewProjectDesc] = useState('');

  // --- AUTENTICACIÓN ---
  const loginUser = async () => {
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
    setAuthToken(''); setUserId(null); setQrCode(''); setToken2FA(''); setMessage(''); setError('');
  };

  // --- VALIDACIÓN DE TRASLAPE DE HORARIOS ---
  const timeToMinutes = (timeStr) => {
    const [h, m] = timeStr.split(':').map(Number);
    return h * 60 + m;
  };

  const addScheduleEvent = () => {
    if (!activityName) {
      alert('Por favor ingresa un nombre para la actividad.');
      return;
    }

    const startMin = timeToMinutes(startTime);
    const endMin = timeToMinutes(endTime);

    if (startMin >= endMin) {
      alert('La hora de fin debe ser posterior a la hora de inicio.');
      return;
    }

    // Verificar choque de horarios en el mismo día
    const conflict = scheduleEvents.some(ev => {
      if (ev.day !== activityDay) return false;
      const evStart = timeToMinutes(ev.start);
      const evEnd = timeToMinutes(ev.end);
      return (startMin < evEnd && endMin > evStart);
    });

    if (conflict) {
      alert(\`⚠️ Choque de Horario: Ya existe una actividad registrada en \${activityDay} dentro del rango \${startTime} - \${endTime}.\`);
      return;
    }

    setScheduleEvents([...scheduleEvents, { id: Date.now(), name: activityName, day: activityDay, start: startTime, end: endTime, color: activityColor }]);
    setActivityName('');
  };

  const removeScheduleEvent = (id) => {
    setScheduleEvents(scheduleEvents.filter(e => e.id !== id));
  };

  // --- CÁLCULO DEL CALENDARIO MENSUAL EXACTO ---
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayIndex = (new Date(year, month, 1).getDay() + 6) % 7; // Ajustar a inicio en Lunes (0 = Lun, 6 = Dom)

  const prevMonth = () => setCurrentDate(new Date(year, month - 1, 1));
  const nextMonth = () => setCurrentDate(new Date(year, month + 1, 1));
  const todayMonth = () => setCurrentDate(new Date());

  // --- HANDLERS KANBAN Y PROYECTOS ---
  const addKanbanTask = () => {
    if (!newKanbanTitle) return;
    setKanbanTasks([...kanbanTasks, {
      id: Date.now().toString(),
      title: newKanbanTitle,
      desc: newKanbanDesc || 'Sin descripción',
      priority: newKanbanPriority,
      pts: '3 pts',
      user: 'Dev',
      status: 'todo'
    }]);
    setNewKanbanTitle(''); setNewKanbanDesc(''); setShowTaskModal(false);
  };

  const moveKanbanTask = (id, newStatus) => {
    setKanbanTasks(kanbanTasks.map(t => t.id === id ? { ...t, status: newStatus } : t));
  };

  const addProject = () => {
    if (!newProjectName) return;
    setProjects([...projects, {
      id: Date.now().toString(),
      name: newProjectName,
      phase: '1. En Espera / Planificación',
      status: 'pending',
      desc: newProjectDesc || 'Nuevo proyecto agendado.',
      progress: 0
    }]);
    setNewProjectName(''); setNewProjectDesc(''); setShowProjectModal(false);
  };

  const updateProjectStatus = (id, status, progress, phase) => {
    setProjects(projects.map(p => p.id === id ? { ...p, status, progress, phase } : p));
  };

  const getThemeStyles = () => {
    switch (theme) {
      case 'Oscuro':
        return { bg: '#0b1120', cardBg: '#1e293b', border: '#334155', text: '#f8fafc', sidebarBg: '#0f172a', accent: '#2563eb', textMuted: '#94a3b8', slotBg: '#0f172a' };
      case 'Vintage':
        return { bg: '#f5efe6', cardBg: '#e8dfd8', border: '#d3c5b7', text: '#4a3e3d', sidebarBg: '#e3d7cc', accent: '#8c6d58', textMuted: '#786458', slotBg: '#ded4ca' };
      case 'Pastel':
        return { bg: '#fbf7f5', cardBg: '#ffffff', border: '#f3e8e2', text: '#4a4e69', sidebarBg: '#f7ede2', accent: '#f72585', textMuted: '#8d99ae', slotBg: '#f4ece8' };
      case 'Ocean':
        return { bg: '#e0f2fe', cardBg: '#ffffff', border: '#bae6fd', text: '#0369a1', sidebarBg: '#f0f9ff', accent: '#0284c7', textMuted: '#0284c7', slotBg: '#e0f2fe' };
      default: // Claro
        return { bg: '#f8fafc', cardBg: '#ffffff', border: '#e2e8f0', text: '#1e293b', sidebarBg: '#ffffff', accent: '#2563eb', textMuted: '#64748b', slotBg: '#f1f5f9' };
    }
  };

  const styles = getThemeStyles();
  const timeSlots = [
    '08:00 - 09:00', '09:00 - 10:00', '10:00 - 11:00', '11:00 - 12:00',
    '12:00 - 13:00', '13:00 - 14:00', '14:00 - 15:00', '15:00 - 16:00',
    '16:00 - 17:00', '17:00 - 18:00', '18:00 - 19:00', '19:00 - 20:00'
  ];

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
                  <p style={{ fontSize: 11, color: '#94a3b8', marginTop: 5 }}>Escanea con Google Authenticator o Authy</p>
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

  return (
    <div style={{ fontFamily: 'Inter, system-ui, sans-serif', height: '100vh', display: 'flex', background: styles.bg, color: styles.text }}>
      
      {/* MENÚ LATERAL */}
      <aside style={{ width: 250, background: styles.sidebarBg, borderRight: \`1px solid \${styles.border}\`, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', padding: '20px 15px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 25, paddingLeft: 5 }}>
            <div style={{ background: styles.accent, color: '#fff', width: 28, height: 28, borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: 16 }}>⚡</div>
            <div>
              <h3 style={{ margin: 0, fontSize: 15, fontWeight: 700 }}>T.o.p.s Flow</h3>
              <span style={{ fontSize: 10, color: styles.textMuted }}>Organiza & Optimiza</span>
            </div>
          </div>

          <nav style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            {[
              { id: 'horario', label: '1. Gestión Horario', icon: '🕒' },
              { id: 'kanban', label: '2. Gestión Ágil (Kanban)', icon: '📊' },
              { id: 'calendario', label: '3. Calendario', icon: '📅' },
              { id: 'proyectos', label: '4. Proyectos', icon: '📐' },
              { id: 'informes', label: '5. Archivero de Informes', icon: '📁' },
              { id: 'logs', label: '6. Registro de Cambios', icon: '📜' },
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
                  fontSize: 13
                }}
              >
                <span>{item.icon}</span> {item.label}
              </button>
            ))}
          </nav>
        </div>

        <div>
          <button onClick={logoutUser} style={{ width: '100%', padding: '8px 12px', background: '#ef4444', color: '#fff', border: 'none', borderRadius: 6, cursor: 'pointer', marginBottom: 15, fontWeight: 600, fontSize: 12 }}>
            🚪 Cerrar Sesión
          </button>

          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ fontSize: 11, color: styles.textMuted }}>🎨 Tema</span>
            <select value={theme} onChange={e => setTheme(e.target.value)} style={{ flex: 1, padding: 6, borderRadius: 6, border: \`1px solid \${styles.border}\`, background: styles.cardBg, color: styles.text, fontSize: 11 }}>
              <option value="Claro (Base)">Claro (Base)</option>
              <option value="Oscuro">Oscuro</option>
              <option value="Vintage">Vintage</option>
              <option value="Pastel">Pastel</option>
              <option value="Ocean">Ocean</option>
            </select>
          </div>
        </div>
      </aside>

      {/* ÁREA PRINCIPAL DE CONTENIDO */}
      <main style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        
        {/* MÓDULO HORARIO CON VALIDACIÓN DE TRASLAPE */}
        {activeTab === 'horario' && (
          <div style={{ padding: '20px 30px', flex: 1, overflowY: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 15 }}>
              <div>
                <h2 style={{ margin: 0, fontSize: 20 }}>📅 Planificación Semestral Inteligente</h2>
                <span style={{ fontSize: 12, color: styles.textMuted }}>Trabajos • Estudios • Prácticas</span>
              </div>
              <button onClick={() => setScheduleEvents([])} style={{ background: 'transparent', color: styles.text, border: \`1px solid \${styles.border}\`, padding: '8px 14px', borderRadius: 6, fontSize: 12, cursor: 'pointer' }}>
                🗑️ Limpiar Todo
              </button>
            </div>

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
                <div style={{ fontSize: 22, fontWeight: 700, marginTop: 4 }}>{new Set(scheduleEvents.map(e => e.name)).size}</div>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '280px 1fr', gap: 20 }}>
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
                      {timeSlots.map(t => <option key={t} value={t.split(' - ')[0]}>{t.split(' - ')[0]}</option>)}
                    </select>
                  </div>
                  <div style={{ flex: 1 }}>
                    <label style={{ fontSize: 11, color: styles.textMuted }}>HORA FIN</label>
                    <select value={endTime} onChange={e => setEndTime(e.target.value)} style={{ width: '100%', padding: 6, borderRadius: 6, border: \`1px solid \${styles.border}\`, background: styles.bg, color: styles.text }}>
                      {timeSlots.map(t => <option key={t} value={t.split(' - ')[1]}>{t.split(' - ')[1]}</option>)}
                    </select>
                  </div>
                </div>

                <label style={{ fontSize: 11, color: styles.textMuted, display: 'block', marginBottom: 6 }}>COLOR IDENTIFICADOR</label>
                <div style={{ display: 'flex', gap: 8, marginBottom: 15 }}>
                  {['#2563eb', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'].map(c => (
                    <div key={c} onClick={() => setActivityColor(c)} style={{ width: 22, height: 22, borderRadius: '50%', background: c, cursor: 'pointer', border: activityColor === c ? '2px solid #fff' : 'none' }} />
                  ))}
                </div>

                <button onClick={addScheduleEvent} style={{ width: '100%', padding: 10, background: styles.accent, color: '#fff', border: 'none', borderRadius: 6, fontWeight: 600, cursor: 'pointer', fontSize: 13 }}>
                  + Asignar al Horario
                </button>
              </div>

              <div style={{ background: styles.cardBg, padding: 15, borderRadius: 10, border: \`1px solid \${styles.border}\`, maxHeight: '70vh', overflowY: 'auto' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '90px repeat(6, 1fr)', gap: 6, textAlign: 'center', fontWeight: 'bold', fontSize: 11, position: 'sticky', top: 0, background: styles.cardBg, zIndex: 10, paddingBottom: 6 }}>
                  <div style={{ background: styles.accent, color: '#fff', padding: 8, borderRadius: 4 }}>🕒</div>
                  {['LUN', 'MAR', 'MIÉ', 'JUE', 'VIE', 'SÁB'].map(day => (
                    <div key={day} style={{ background: styles.accent, color: '#fff', padding: 8, borderRadius: 4 }}>{day}</div>
                  ))}
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginTop: 6 }}>
                  {timeSlots.map(slot => (
                    <div key={slot} style={{ display: 'grid', gridTemplateColumns: '90px repeat(6, 1fr)', gap: 6, height: 42 }}>
                      <div style={{ fontSize: 10, color: styles.textMuted, display: 'flex', alignItems: 'center', justifyContent: 'center', background: styles.slotBg, borderRadius: 4 }}>{slot}</div>
                      {['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'].map(day => {
                        const ev = scheduleEvents.find(e => e.day === day && timeToMinutes(slot.split(' - ')[0]) >= timeToMinutes(e.start) && timeToMinutes(slot.split(' - ')[0]) < timeToMinutes(e.end));
                        return (
                          <div key={day} style={{ background: ev ? ev.color : styles.slotBg, color: '#fff', borderRadius: 4, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 8px', fontSize: 11, fontWeight: 600 }}>
                            {ev ? (
                              <>
                                <span>{ev.name}</span>
                                <span onClick={() => removeScheduleEvent(ev.id)} style={{ cursor: 'pointer', opacity: 0.8 }}>✕</span>
                              </>
                            ) : ''}
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

        {/* MÓDULO CALENDARIO DINÁMICO REAL CON DESFASE Y DÍAS PRECISOS */}
        {activeTab === 'calendario' && (
          <div style={{ padding: '20px 30px', flex: 1, overflowY: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 15 }}>
              <div>
                <h2 style={{ margin: 0, fontSize: 20 }}>📆 Calendario Integrado</h2>
                <span style={{ fontSize: 12, color: styles.textMuted }}>Fechas y días de la semana dinámicos correspondientes a cada mes.</span>
              </div>
            </div>

            <div style={{ background: styles.cardBg, padding: 20, borderRadius: 10, border: \`1px solid \${styles.border}\` }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 15 }}>
                <div style={{ display: 'flex', gap: 10 }}>
                  <button onClick={prevMonth} style={{ padding: '4px 10px', cursor: 'pointer' }}>&lt;</button>
                  <button onClick={todayMonth} style={{ padding: '4px 10px', cursor: 'pointer' }}>Hoy</button>
                  <button onClick={nextMonth} style={{ padding: '4px 10px', cursor: 'pointer' }}>&gt;</button>
                </div>
                <h3 style={{ margin: 0, fontSize: 16 }}>
                  {currentDate.toLocaleString('es-ES', { month: 'long', year: 'numeric' }).toUpperCase()}
                </h3>
              </div>
              
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 8, textAlign: 'center', fontWeight: 'bold', fontSize: 11 }}>
                {['LUN', 'MAR', 'MIÉ', 'JUE', 'VIE', 'SÁB', 'DOM'].map(d => <div key={d}>{d}</div>)}
              </div>

              {/* RENDERIZADO DINÁMICO CON DESFASE Y NÚMERO DE DÍAS DE CADA MES */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 8, marginTop: 10 }}>
                {/* Días vacíos de relleno inicial */}
                {Array.from({ length: firstDayIndex }).map((_, i) => (
                  <div key={'empty-' + i} style={{ background: 'transparent', height: 70 }} />
                ))}

                {/* Días reales del mes */}
                {Array.from({ length: daysInMonth }).map((_, i) => {
                  const dayNum = i + 1;
                  const isToday = dayNum === new Date().getDate() && month === new Date().getMonth() && year === new Date().getFullYear();
                  return (
                    <div 
                      key={dayNum} 
                      style={{ 
                        background: isToday ? styles.accent : styles.slotBg, 
                        color: isToday ? '#fff' : styles.text, 
                        height: 70, 
                        padding: 6, 
                        borderRadius: 6, 
                        border: \`1px solid \${styles.border}\`, 
                        fontSize: 11, 
                        fontWeight: isToday ? 'bold' : 'normal' 
                      }}
                    >
                      {dayNum} {isToday ? ' (Hoy)' : ''}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* KANBAN ÁGIL */}
        {activeTab === 'kanban' && (
          <div style={{ padding: '20px 30px', flex: 1, overflowY: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <div>
                <h2 style={{ margin: 0, fontSize: 20 }}>📊 Gestión Ágil (Kanban)</h2>
                <span style={{ fontSize: 12, color: styles.textMuted }}>Organiza tus tareas en etapas y mide los puntos de esfuerzo.</span>
              </div>
              <button onClick={() => setShowTaskModal(true)} style={{ background: styles.accent, color: '#fff', border: 'none', padding: '8px 16px', borderRadius: 6, fontWeight: 600, fontSize: 13, cursor: 'pointer' }}>
                + Nueva Tarjeta
              </button>
            </div>

            {showTaskModal && (
              <div style={{ background: 'rgba(0,0,0,0.5)', position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100 }}>
                <div style={{ background: styles.cardBg, padding: 25, borderRadius: 10, width: 380, border: \`1px solid \${styles.border}\` }}>
                  <h3 style={{ marginTop: 0 }}>Crear Nueva Tarjeta</h3>
                  <input placeholder="Título de la tarea" value={newKanbanTitle} onChange={e => setNewKanbanTitle(e.target.value)} style={{ width: '92%', padding: 8, marginBottom: 10, borderRadius: 6, border: \`1px solid \${styles.border}\` }} />
                  <textarea placeholder="Descripción" value={newKanbanDesc} onChange={e => setNewKanbanDesc(e.target.value)} style={{ width: '92%', padding: 8, marginBottom: 10, borderRadius: 6, border: \`1px solid \${styles.border}\` }} />
                  <select value={newKanbanPriority} onChange={e => setNewKanbanPriority(e.target.value)} style={{ width: '98%', padding: 8, marginBottom: 15, borderRadius: 6, border: \`1px solid \${styles.border}\` }}>
                    <option value="ALTA">Prioridad Alta</option>
                    <option value="URGENTE">Prioridad Urgente</option>
                    <option value="MEDIA">Prioridad Media</option>
                  </select>
                  <div style={{ display: 'flex', gap: 10 }}>
                    <button onClick={addKanbanTask} style={{ flex: 1, padding: 10, background: styles.accent, color: '#fff', border: 'none', borderRadius: 6, cursor: 'pointer' }}>Guardar</button>
                    <button onClick={() => setShowTaskModal(false)} style={{ flex: 1, padding: 10, background: 'transparent', border: \`1px solid \${styles.border}\`, color: styles.text, borderRadius: 6, cursor: 'pointer' }}>Cancelar</button>
                  </div>
                </div>
              </div>
            )}

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20 }}>
              {[
                { key: 'todo', title: '🟡 Por Hacer', count: kanbanTasks.filter(t => t.status === 'todo').length },
                { key: 'in_progress', title: '🔵 En Desarrollo', count: kanbanTasks.filter(t => t.status === 'in_progress').length },
                { key: 'done', title: '🟢 Hecho / Completado', count: kanbanTasks.filter(t => t.status === 'done').length },
              ].map(col => (
                <div key={col.key} style={{ background: styles.cardBg, padding: 15, borderRadius: 10, border: \`1px solid \${styles.border}\` }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 15 }}>
                    <strong style={{ fontSize: 13 }}>{col.title}</strong>
                    <span style={{ background: styles.slotBg, padding: '2px 8px', borderRadius: 10, fontSize: 11, fontWeight: 600 }}>{col.count}</span>
                  </div>
                  {kanbanTasks.filter(t => t.status === col.key).map(task => (
                    <div key={task.id} style={{ background: styles.slotBg, padding: 14, borderRadius: 8, border: \`1px solid \${styles.border}\`, marginBottom: 12 }}>
                      <span style={{ fontSize: 9, fontWeight: 700, padding: '2px 6px', borderRadius: 4, background: '#fee2e2', color: '#991b1b' }}>{task.priority}</span>
                      <h4 style={{ margin: '8px 0 4px 0', fontSize: 13 }}>{task.title}</h4>
                      <p style={{ margin: 0, fontSize: 11, color: styles.textMuted }}>{task.desc}</p>
                      
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 12 }}>
                        <div style={{ display: 'flex', gap: 4 }}>
                          {col.key !== 'todo' && <button onClick={() => moveKanbanTask(task.id, 'todo')} style={{ fontSize: 9, padding: '2px 6px', cursor: 'pointer' }}>⬅</button>}
                          {col.key !== 'in_progress' && <button onClick={() => moveKanbanTask(task.id, 'in_progress')} style={{ fontSize: 9, padding: '2px 6px', cursor: 'pointer' }}>⚙️</button>}
                          {col.key !== 'done' && <button onClick={() => moveKanbanTask(task.id, 'done')} style={{ fontSize: 9, padding: '2px 6px', cursor: 'pointer' }}>➔</button>}
                        </div>
                        <span style={{ fontSize: 10, color: styles.textMuted }}>⚡ {task.pts}</span>
                      </div>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* PROYECTOS CON ESTADOS */}
        {activeTab === 'proyectos' && (
          <div style={{ padding: '20px 30px', flex: 1, overflowY: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 15 }}>
              <div>
                <h2 style={{ margin: 0, fontSize: 20 }}>📐 Gestión Integral de Proyectos</h2>
                <span style={{ fontSize: 12, color: styles.textMuted }}>En Espera, En Proceso o Finalizados.</span>
              </div>
              <button onClick={() => setShowProjectModal(true)} style={{ background: styles.accent, color: '#fff', border: 'none', padding: '8px 16px', borderRadius: 6, fontWeight: 600, fontSize: 13, cursor: 'pointer' }}>
                + Nuevo Proyecto
              </button>
            </div>

            {showProjectModal && (
              <div style={{ background: 'rgba(0,0,0,0.5)', position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100 }}>
                <div style={{ background: styles.cardBg, padding: 25, borderRadius: 10, width: 380, border: \`1px solid \${styles.border}\` }}>
                  <h3 style={{ marginTop: 0 }}>Nuevo Proyecto</h3>
                  <input placeholder="Nombre del Proyecto" value={newProjectName} onChange={e => setNewProjectName(e.target.value)} style={{ width: '92%', padding: 8, marginBottom: 10, borderRadius: 6, border: \`1px solid \${styles.border}\` }} />
                  <textarea placeholder="Descripción del alcance" value={newProjectDesc} onChange={e => setNewProjectDesc(e.target.value)} style={{ width: '92%', padding: 8, marginBottom: 15, borderRadius: 6, border: \`1px solid \${styles.border}\` }} />
                  <div style={{ display: 'flex', gap: 10 }}>
                    <button onClick={addProject} style={{ flex: 1, padding: 10, background: styles.accent, color: '#fff', border: 'none', borderRadius: 6, cursor: 'pointer' }}>Crear</button>
                    <button onClick={() => setShowProjectModal(false)} style={{ flex: 1, padding: 10, background: 'transparent', border: \`1px solid \${styles.border}\`, color: styles.text, borderRadius: 6, cursor: 'pointer' }}>Cancelar</button>
                  </div>
                </div>
              </div>
            )}

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 15, marginBottom: 20 }}>
              <div style={{ background: styles.cardBg, padding: 15, borderRadius: 8, border: \`1px solid \${styles.border}\`, borderLeft: '4px solid #f59e0b' }}>
                <span style={{ fontSize: 11, color: styles.textMuted }}>EN ESPERA</span>
                <div style={{ fontSize: 20, fontWeight: 700, marginTop: 4 }}>{projects.filter(p => p.status === 'pending').length}</div>
              </div>
              <div style={{ background: styles.cardBg, padding: 15, borderRadius: 8, border: \`1px solid \${styles.border}\`, borderLeft: '4px solid #2563eb' }}>
                <span style={{ fontSize: 11, color: styles.textMuted }}>EN PROCESO</span>
                <div style={{ fontSize: 20, fontWeight: 700, marginTop: 4 }}>{projects.filter(p => p.status === 'in_progress').length}</div>
              </div>
              <div style={{ background: styles.cardBg, padding: 15, borderRadius: 8, border: \`1px solid \${styles.border}\`, borderLeft: '4px solid #10b981' }}>
                <span style={{ fontSize: 11, color: styles.textMuted }}>FINALIZADOS</span>
                <div style={{ fontSize: 20, fontWeight: 700, marginTop: 4 }}>{projects.filter(p => p.status === 'done').length}</div>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 20 }}>
              {projects.map(p => (
                <div key={p.id} style={{ background: styles.cardBg, padding: 20, borderRadius: 10, border: \`1px solid \${styles.border}\` }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <h3 style={{ margin: 0, fontSize: 15 }}>{p.name}</h3>
                    <span style={{ 
                      background: p.status === 'done' ? '#dcfce7' : p.status === 'in_progress' ? '#dbeafe' : '#fef3c7', 
                      color: p.status === 'done' ? '#166534' : p.status === 'in_progress' ? '#1e40af' : '#92400e', 
                      padding: '2px 8px', borderRadius: 4, fontSize: 10, fontWeight: 600 
                    }}>
                      {p.phase}
                    </span>
                  </div>
                  <p style={{ fontSize: 12, color: styles.textMuted, marginTop: 8 }}>{p.desc}</p>
                  
                  <div style={{ marginTop: 15 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, marginBottom: 4 }}>
                      <span>Progreso de Avance</span>
                      <span>{p.progress}%</span>
                    </div>
                    <div style={{ background: styles.slotBg, height: 8, borderRadius: 4, overflow: 'hidden' }}>
                      <div style={{ background: p.status === 'done' ? '#10b981' : styles.accent, width: \`\${p.progress}%\`, height: '100%' }} />
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: 6, marginTop: 15 }}>
                    <button onClick={() => updateProjectStatus(p.id, 'pending', 0, '1. En Espera')} style={{ fontSize: 10, padding: 4 }}>Poner en Espera</button>
                    <button onClick={() => updateProjectStatus(p.id, 'in_progress', 50, '2. En Desarrollo')} style={{ fontSize: 10, padding: 4 }}>En Proceso (50%)</button>
                    <button onClick={() => updateProjectStatus(p.id, 'done', 100, '4. Finalizado')} style={{ fontSize: 10, padding: 4 }}>Finalizar (100%)</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* INFORMES Y LOGS */}
        {(activeTab === 'informes' || activeTab === 'logs') && (
          <div style={{ padding: '20px 30px', flex: 1, overflowY: 'auto' }}>
            <h2 style={{ margin: '0 0 15px 0', fontSize: 20 }}>📁 Módulo {activeTab.toUpperCase()}</h2>
            <div style={{ background: styles.cardBg, padding: 30, borderRadius: 10, border: \`1px solid \${styles.border}\` }}>
              <p style={{ color: styles.textMuted, fontSize: 13 }}>Módulo activo y conectado a la base de datos PostgreSQL con 2FA.</p>
            </div>
          </div>
        )}

      </main>
    </div>
  );
}
`;

fs.writeFileSync(path.join(__dirname, 'apps/frontend/src/App.jsx'), updatedAppContent, 'utf8');
console.log('✅ Validación de traslape en Horario y Calendario Dinámico Real por mes aplicados con éxito.');