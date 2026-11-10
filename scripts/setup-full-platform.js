const fs = require('fs');
const path = require('path');

const fullAppContent = `import React, { useState, useCallback, useEffect } from 'react';
import axios from 'axios';
import { ReactFlow, Controls, Background, applyNodeChanges, applyEdgeChanges, addEdge } from '@xyflow/react';
import '@xyflow/react/dist/style.css';

export default function App() {
  // --- SEGURIDAD Y SESIÓN ---
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [userId, setUserId] = useState(null);
  const [qrCode, setQrCode] = useState('');
  const [token2FA, setToken2FA] = useState('');
  const [authToken, setAuthToken] = useState('');

  // --- NAVEGACIÓN Y VISTAS DE T.O.P.S FLOW ---
  const [activeTab, setActiveTab] = useState('horario'); // 'horario', 'kanban', 'calendario', 'proyectos', 'builder', 'informes', 'logs'
  const [theme, setTheme] = useState('light');

  // --- ESTADOS: GESTIÓN HORARIO ---
  const [activityName, setActivityName] = useState('');
  const [activityDay, setActivityDay] = useState('Lunes');
  const [startTime, setStartTime] = useState('09:00');
  const [endTime, setEndTime] = useState('11:00');
  const [activityColor, setActivityColor] = useState('#2563eb');
  const [scheduleEvents, setScheduleEvents] = useState([]);

  // --- ESTADOS: KANBAN ÁGIL ---
  const [kanbanTasks, setKanbanTasks] = useState([
    { id: '1', title: 'Diseñar Arquitectura Base', status: 'todo' },
    { id: '2', title: 'Implementar Módulo 2FA (TOTP)', status: 'done' },
    { id: '3', title: 'Conectar PostgreSQL & Prisma', status: 'done' },
  ]);
  const [newTaskTitle, setNewTaskTitle] = useState('');

  // --- ESTADOS: WORKFLOW BUILDER (REACT FLOW) ---
  const [workflowTitle, setWorkflowTitle] = useState('Proyecto Ágil Principal');
  const [nodes, setNodes] = useState([
    { id: '1', type: 'input', data: { label: '⚡ Trigger: Push a GitHub' }, position: { x: 100, y: 100 } },
    { id: '2', type: 'output', data: { label: '⚙️ Action: Desplegar MVP' }, position: { x: 450, y: 100 } }
  ]);
  const [edges, setEdges] = useState([{ id: 'e1-2', source: '1', target: '2', animated: true }]);
  const [executionLog, setExecutionLog] = useState(null);

  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  // --- CONTROL DE LOGIN / 2FA ---
  const loginUser = async () => {
    setMessage(''); setError('');
    try {
      const res = await axios.post('http://localhost:4000/api/auth/login', { email, password });
      setUserId(res.data.userId);
      setMessage('Credenciales válidas. Genera o ingresa tu 2FA.');
    } catch (err) {
      setError(err.response?.data?.error || 'Error al iniciar sesión.');
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
      setMessage('¡Sesión 2FA Iniciada!');
    } catch (err) {
      setError('Código 2FA incorrecto.');
    }
  };

  // --- LÓGICA HORARIO ---
  const addScheduleEvent = () => {
    if (!activityName) return;
    setScheduleEvents([...scheduleEvents, { id: Date.now(), name: activityName, day: activityDay, start: startTime, end: endTime, color: activityColor }]);
    setActivityName('');
  };

  // --- LÓGICA KANBAN ---
  const addKanbanTask = () => {
    if (!newTaskTitle) return;
    setKanbanTasks([...kanbanTasks, { id: Date.now().toString(), title: newTaskTitle, status: 'todo' }]);
    setNewTaskTitle('');
  };

  const moveTask = (id, newStatus) => {
    setKanbanTasks(kanbanTasks.map(t => t.id === id ? { ...t, status: newStatus } : t));
  };

  // --- LÓGICA REACT FLOW BUILDER ---
  const onNodesChange = useCallback((changes) => setNodes((nds) => applyNodeChanges(changes, nds)), []);
  const onEdgesChange = useCallback((changes) => setEdges((eds) => applyEdgeChanges(changes, eds)), []);
  const onConnect = useCallback((params) => setEdges((eds) => addEdge({ ...params, animated: true }, eds)), []);

  const addNode = (type) => {
    const id = (nodes.length + 1).toString();
    const newNode = {
      id,
      type: type === 'Trigger' ? 'input' : 'output',
      data: { label: \`\${type === 'Trigger' ? '⚡ Trigger' : '⚙️ Action'}: Nodo \${id}\` },
      position: { x: Math.random() * 300 + 50, y: Math.random() * 300 + 50 }
    };
    setNodes((nds) => [...nds, newNode]);
  };

  const executeCurrentWorkflow = async () => {
    try {
      const formattedNodes = nodes.map(n => ({ id: n.id, type: n.type === 'input' ? 'trigger' : 'action', data: n.data }));
      const res = await axios.post('http://localhost:4000/api/workflows/run', { nodes: formattedNodes, edges });
      setExecutionLog(res.data);
    } catch (err) {
      setError('Error al ejecutar el flujo.');
    }
  };

  const isDark = theme === 'dark';
  const bgColor = isDark ? '#0f172a' : '#f8fafc';
  const cardBg = isDark ? '#1e293b' : '#ffffff';
  const textColor = isDark ? '#f8fafc' : '#1e293b';

  return (
    <div style={{ fontFamily: 'Inter, system-ui, sans-serif', height: '100vh', display: 'flex', background: bgColor, color: textColor }}>
      
      {/* MENÚ LATERAL DINÁMICO DE T.O.P.S FLOW */}
      <aside style={{ width: 260, background: cardBg, borderRight: \`1px solid \${isDark ? '#334155' : '#e2e8f0'}\`, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', padding: 20 }}>
        <div>
          {/* Logo T.o.p.s Flow */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 30 }}>
            <div style={{ background: '#2563eb', color: '#fff', width: 32, height: 32, borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>⚡</div>
            <div>
              <h3 style={{ margin: 0, fontSize: 16, fontWeight: 700 }}>T.o.p.s Flow</h3>
              <span style={{ fontSize: 11, color: '#64748b' }}>Organiza & Optimiza</span>
            </div>
          </div>

          {/* Opciones del Menú */}
          <nav style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            {[
              { id: 'horario', label: '1. Gestión Horario', icon: '🕒' },
              { id: 'kanban', label: '2. Gestión Ágil (Kanban)', icon: '📊' },
              { id: 'calendario', label: '3. Calendario', icon: '📅' },
              { id: 'proyectos', label: '4. Editor de Nodos / Proyectos', icon: '🛠️' },
              { id: 'informes', label: '5. Archivero de Informes', icon: '📁' },
              { id: 'logs', label: '6. Registro de Cambios', icon: '🕒' },
            ].map(item => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 12,
                  padding: '12px 14px',
                  borderRadius: 8,
                  border: 'none',
                  background: activeTab === item.id ? '#2563eb' : 'transparent',
                  color: activeTab === item.id ? '#ffffff' : (isDark ? '#94a3b8' : '#475569'),
                  fontWeight: activeTab === item.id ? 600 : 400,
                  cursor: 'pointer',
                  textAlign: 'left',
                  fontSize: 14,
                  transition: 'all 0.2s'
                }}
              >
                <span>{item.icon}</span> {item.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Toggle de Tema */}
        <div style={{ borderTop: \`1px solid \${isDark ? '#334155' : '#e2e8f0'}\`, paddingTop: 15 }}>
          <label style={{ fontSize: 12, color: '#64748b' }}>Tema Visual:</label>
          <select 
            value={theme} 
            onChange={e => setTheme(e.target.value)} 
            style={{ width: '100%', padding: 8, marginTop: 4, borderRadius: 6, border: '1px solid #cbd5e1', background: cardBg, color: textColor }}
          >
            <option value="light">Claro (Base)</option>
            <option value="dark">Oscuro (Pro)</option>
          </select>
        </div>
      </aside>

      {/* ÁREA PRINCIPAL / PANTALLAS */}
      <main style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        
        {/* Header Superior */}
        <header style={{ background: cardBg, padding: '15px 30px', borderBottom: \`1px solid \${isDark ? '#334155' : '#e2e8f0'}\`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h2 style={{ margin: 0, fontSize: 20 }}>
              {activeTab === 'horario' && '📅 Planificación Semestral Inteligente'}
              {activeTab === 'kanban' && '📊 Tablero Ágil de Desarrollo (Kanban)'}
              {activeTab === 'calendario' && '📆 Calendario de Hitos del Proyecto'}
              {activeTab === 'proyectos' && '⚡ Workflow Builder & Motor Visual de Nodos'}
              {activeTab === 'informes' && '📂 Archivero de Informes y Entregables'}
              {activeTab === 'logs' && '📜 Registro de Cambios y Auditoría'}
            </h2>
            <span style={{ fontSize: 12, color: '#64748b' }}>Entorno de Trabajo Dinámico y Completo para Desenvolverse en Proyectos</span>
          </div>

          {!authToken ? (
            <span style={{ background: '#fef3c7', color: '#92400e', padding: '4px 12px', borderRadius: 20, fontSize: 12, fontWeight: 500 }}>
              ⚠️ Modo Demostración (Requiere 2FA)
            </span>
          ) : (
            <span style={{ background: '#dcfce7', color: '#166534', padding: '4px 12px', borderRadius: 20, fontSize: 12, fontWeight: 600 }}>
              🛡️ Sesión 2FA Autenticada
            </span>
          )}
        </header>

        {/* SI NO ESTÁ AUTENTICADO: FORMULARIO 2FA CENTRADO */}
        {!authToken ? (
          <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
            <div style={{ background: cardBg, width: '100%', maxWidth: 420, padding: 30, borderRadius: 12, border: \`1px solid \${isDark ? '#334155' : '#e2e8f0'}\`, boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}>
              <h3 style={{ marginTop: 0, textAlign: 'center' }}>Acceso Requerido con 2FA</h3>
              {message && <p style={{ color: '#059669', fontSize: 13 }}>{message}</p>}
              {error && <p style={{ color: '#dc2626', fontSize: 13 }}>{error}</p>}

              <input placeholder="Correo electrónico" value={email} onChange={e => setEmail(e.target.value)} style={{ width: '93%', padding: 10, marginBottom: 10, borderRadius: 6, border: '1px solid #cbd5e1' }} />
              <input placeholder="Contraseña" type="password" value={password} onChange={e => setPassword(e.target.value)} style={{ width: '93%', padding: 10, marginBottom: 15, borderRadius: 6, border: '1px solid #cbd5e1' }} />
              <button onClick={loginUser} style={{ width: '100%', padding: 10, background: '#2563eb', color: '#fff', border: 'none', borderRadius: 6, fontWeight: 600, cursor: 'pointer' }}>Ingresar</button>

              {userId && (
                <div style={{ marginTop: 20, paddingTop: 15, borderTop: '1px solid #eee' }}>
                  <button onClick={setup2FA} style={{ width: '100%', padding: 8, background: '#64748b', color: '#fff', border: 'none', borderRadius: 6, marginBottom: 10, cursor: 'pointer' }}>Escanear QR 2FA</button>
                  {qrCode && <img src={qrCode} alt="QR 2FA" style={{ display: 'block', margin: '0 auto 10px auto', width: 140 }} />}
                  <input placeholder="Código de 6 dígitos" value={token2FA} onChange={e => setToken2FA(e.target.value)} style={{ width: '93%', padding: 10, marginBottom: 10, borderRadius: 6, border: '1px solid #cbd5e1' }} />
                  <button onClick={verify2FA} style={{ width: '100%', padding: 10, background: '#16a34a', color: '#fff', border: 'none', borderRadius: 6, fontWeight: 600, cursor: 'pointer' }}>Validar 2FA e Iniciar Sesión</button>
                </div>
              )}
            </div>
          </div>
        ) : (
          /* VISTAS AUTENTICADAS DE T.O.P.S FLOW */
          <div style={{ flex: 1, padding: 25, overflowY: 'auto' }}>
            
            {/* VISTA 1: GESTIÓN HORARIO */}
            {activeTab === 'horario' && (
              <div style={{ display: 'grid', gridTemplateColumns: '300px 1fr', gap: 20 }}>
                <div style={{ background: cardBg, padding: 20, borderRadius: 10, border: \`1px solid \${isDark ? '#334155' : '#e2e8f0'}\` }}>
                  <h4 style={{ marginTop: 0 }}>➕ Registrar Actividad</h4>
                  <label style={{ fontSize: 12 }}>Nombre de la actividad</label>
                  <input value={activityName} onChange={e => setActivityName(e.target.value)} placeholder="Ej: Pega Lopa, Capstone" style={{ width: '90%', padding: 8, marginBottom: 12, borderRadius: 6, border: '1px solid #cbd5e1' }} />
                  
                  <label style={{ fontSize: 12 }}>Día de la Semana</label>
                  <select value={activityDay} onChange={e => setActivityDay(e.target.value)} style={{ width: '97%', padding: 8, marginBottom: 12, borderRadius: 6, border: '1px solid #cbd5e1' }}>
                    {['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'].map(d => <option key={d} value={d}>{d}</option>)}
                  </select>

                  <div style={{ display: 'flex', gap: 10, marginBottom: 15 }}>
                    <div>
                      <label style={{ fontSize: 12 }}>Inicio</label>
                      <input type="time" value={startTime} onChange={e => setStartTime(e.target.value)} style={{ padding: 6, width: '90%' }} />
                    </div>
                    <div>
                      <label style={{ fontSize: 12 }}>Fin</label>
                      <input type="time" value={endTime} onChange={e => setEndTime(e.target.value)} style={{ padding: 6, width: '90%' }} />
                    </div>
                  </div>

                  <button onClick={addScheduleEvent} style={{ width: '100%', padding: 10, background: '#2563eb', color: '#fff', border: 'none', borderRadius: 6, fontWeight: 600, cursor: 'pointer' }}>
                    + Asignar al Horario
                  </button>
                </div>

                {/* Grilla Semanal */}
                <div style={{ background: cardBg, padding: 20, borderRadius: 10, border: \`1px solid \${isDark ? '#334155' : '#e2e8f0'}\` }}>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: 10, textAlign: 'center', fontWeight: 'bold' }}>
                    {['LUN', 'MAR', 'MIÉ', 'JUE', 'VIE', 'SÁB'].map(day => (
                      <div key={day} style={{ background: '#2563eb', color: '#fff', padding: 8, borderRadius: 6 }}>{day}</div>
                    ))}
                  </div>
                  <div style={{ marginTop: 15, display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: 10, minHeight: 300 }}>
                    {['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'].map(day => (
                      <div key={day} style={{ background: isDark ? '#0f172a' : '#f1f5f9', padding: 8, borderRadius: 6, minHeight: 250 }}>
                        {scheduleEvents.filter(e => e.day === day).map(e => (
                          <div key={e.id} style={{ background: '#2563eb', color: '#fff', padding: 8, borderRadius: 6, marginBottom: 8, fontSize: 12 }}>
                            <strong>{e.name}</strong>
                            <div>{e.start} - {e.end}</div>
                          </div>
                        ))}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* VISTA 2: GESTIÓN ÁGIL (KANBAN) */}
            {activeTab === 'kanban' && (
              <div>
                <div style={{ display: 'flex', gap: 10, marginBottom: 20 }}>
                  <input value={newTaskTitle} onChange={e => setNewTaskTitle(e.target.value)} placeholder="Nueva tarea ágil..." style={{ padding: 10, flex: 1, borderRadius: 6, border: '1px solid #cbd5e1' }} />
                  <button onClick={addKanbanTask} style={{ padding: '10px 20px', background: '#2563eb', color: '#fff', border: 'none', borderRadius: 6, cursor: 'pointer' }}>Añadir Tarea</button>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20 }}>
                  {[
                    { key: 'todo', title: '📋 Por Hacer' },
                    { key: 'in_progress', title: '⚙️ En Proceso' },
                    { key: 'done', title: '✅ Completado' },
                  ].map(col => (
                    <div key={col.key} style={{ background: cardBg, padding: 15, borderRadius: 10, border: \`1px solid \${isDark ? '#334155' : '#e2e8f0'}\` }}>
                      <h4 style={{ marginTop: 0 }}>{col.title}</h4>
                      {kanbanTasks.filter(t => t.status === col.key).map(task => (
                        <div key={task.id} style={{ background: isDark ? '#0f172a' : '#f8fafc', padding: 12, borderRadius: 6, border: '1px solid #cbd5e1', marginBottom: 10 }}>
                          <p style={{ margin: '0 0 10px 0', fontSize: 14 }}>{task.title}</p>
                          <div style={{ display: 'flex', gap: 5 }}>
                            {col.key !== 'todo' && <button onClick={() => moveTask(task.id, 'todo')} style={{ fontSize: 10 }}>⬅ Por Hacer</button>}
                            {col.key !== 'in_progress' && <button onClick={() => moveTask(task.id, 'in_progress')} style={{ fontSize: 10 }}>⚙️ En Proceso</button>}
                            {col.key !== 'done' && <button onClick={() => moveTask(task.id, 'done')} style={{ fontSize: 10 }}>✅ Hecho</button>}
                          </div>
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* VISTA 4: WORKFLOW BUILDER (REACT FLOW) */}
            {activeTab === 'proyectos' && (
              <div style={{ height: '75vh', display: 'flex', flexDirection: 'column' }}>
                <div style={{ display: 'flex', gap: 10, marginBottom: 10 }}>
                  <button onClick={() => addNode('Trigger')} style={{ padding: '8px 12px', background: '#e0e7ff', border: '1px solid #c7d2fe', borderRadius: 6, cursor: 'pointer' }}>+ Trigger</button>
                  <button onClick={() => addNode('Action')} style={{ padding: '8px 12px', background: '#fef3c7', border: '1px solid #fde68a', borderRadius: 6, cursor: 'pointer' }}>+ Acción</button>
                  <button onClick={executeCurrentWorkflow} style={{ padding: '8px 16px', background: '#2563eb', color: '#fff', border: 'none', borderRadius: 6, cursor: 'pointer', fontWeight: 'bold' }}>▶ Ejecutar Flujo</button>
                </div>
                <div style={{ flex: 1, background: '#090d16', borderRadius: 10, overflow: 'hidden' }}>
                  <ReactFlow nodes={nodes} edges={edges} onNodesChange={onNodesChange} onEdgesChange={onEdgesChange} onConnect={onConnect} fitView>
                    <Controls />
                    <Background color="#334155" gap={16} />
                  </ReactFlow>
                </div>
                {executionLog && (
                  <pre style={{ background: '#0f172a', color: '#38bdf8', padding: 15, borderRadius: 8, marginTop: 10, fontSize: 12 }}>
                    {JSON.stringify(executionLog, null, 2)}
                  </pre>
                )}
              </div>
            )}

            {/* VISTA DUMMY ARCHIVERO / CALENDARIO */}
            {(activeTab === 'calendario' || activeTab === 'informes' || activeTab === 'logs') && (
              <div style={{ background: cardBg, padding: 40, borderRadius: 10, textAlign: 'center' }}>
                <h3>📁 Módulo {activeTab.toUpperCase()} Activo</h3>
                <p style={{ color: '#64748b' }}>Conectado dinámicamente a PostgreSQL y a la sesión 2FA.</p>
              </div>
            )}

          </div>
        )}
      </main>
    </div>
  );
}
`;

fs.writeFileSync(path.join(__dirname, 'apps/frontend/src/App.jsx'), fullAppContent, 'utf8');
console.log('✅ Plataforma dinámica de T.o.p.s Flow generada en App.jsx.');