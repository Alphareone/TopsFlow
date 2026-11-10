const fs = require('fs');
const path = require('path');

// 1. Feature: ScheduleView.jsx con persistencia local
const scheduleContent = `import React, { useState, useEffect } from 'react';

const INITIAL_EVENTS = [
  { id: 1, name: 'Pega Lopa', day: 'Lunes', start: '09:00', end: '11:00', color: '#2563eb' },
  { id: 2, name: 'Proyecto Capstone', day: 'Miércoles', start: '14:00', end: '16:00', color: '#8b5cf6' }
];

export default function ScheduleView() {
  const [activityName, setActivityName] = useState('');
  const [activityDay, setActivityDay] = useState('Lunes');
  const [startTime, setStartTime] = useState('08:00');
  const [endTime, setEndTime] = useState('10:00');
  const [activityColor, setActivityColor] = useState('#2563eb');
  
  const [scheduleEvents, setScheduleEvents] = useState(() => {
    const saved = localStorage.getItem('topsflow_schedule');
    return saved ? JSON.parse(saved) : INITIAL_EVENTS;
  });

  useEffect(() => {
    localStorage.setItem('topsflow_schedule', JSON.stringify(scheduleEvents));
  }, [scheduleEvents]);

  const timeSlots = [
    '08:00 - 09:00', '09:00 - 10:00', '10:00 - 11:00', '11:00 - 12:00',
    '12:00 - 13:00', '13:00 - 14:00', '14:00 - 15:00', '15:00 - 16:00',
    '16:00 - 17:00', '17:00 - 18:00', '18:00 - 19:00', '19:00 - 20:00'
  ];

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

  const clearAll = () => {
    if (window.confirm('¿Seguro que deseas limpiar todo el horario?')) {
      setScheduleEvents([]);
    }
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 15 }}>
        <div>
          <h3 style={{ margin: 0, fontSize: 18 }}>📅 Planificación Semestral Inteligente</h3>
          <span style={{ fontSize: 12, color: '#64748b' }}>Trabajos • Estudios • Prácticas</span>
        </div>
        <button onClick={clearAll} style={{ background: 'transparent', border: '1px solid #cbd5e1', padding: '8px 14px', borderRadius: 6, fontSize: 12, cursor: 'pointer' }}>
          🗑️ Limpiar Todo
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 15, marginBottom: 20 }}>
        <div style={{ background: '#fff', padding: 15, borderRadius: 8, border: '1px solid #e2e8f0', borderLeft: '4px solid #2563eb' }}>
          <span style={{ fontSize: 11, color: '#64748b', fontWeight: 600 }}>TOTAL BLOQUES</span>
          <div style={{ fontSize: 22, fontWeight: 700, marginTop: 4 }}>{scheduleEvents.length}</div>
        </div>
        <div style={{ background: '#fff', padding: 15, borderRadius: 8, border: '1px solid #e2e8f0', borderLeft: '4px solid #2563eb' }}>
          <span style={{ fontSize: 11, color: '#64748b', fontWeight: 600 }}>HORAS SEMANALES TOTALES</span>
          <div style={{ fontSize: 22, fontWeight: 700, marginTop: 4 }}>{scheduleEvents.length * 2} hrs</div>
        </div>
        <div style={{ background: '#fff', padding: 15, borderRadius: 8, border: '1px solid #e2e8f0', borderLeft: '4px solid #2563eb' }}>
          <span style={{ fontSize: 11, color: '#64748b', fontWeight: 600 }}>CATEGORÍAS REGISTRADAS</span>
          <div style={{ fontSize: 22, fontWeight: 700, marginTop: 4 }}>{new Set(scheduleEvents.map(e => e.name)).size}</div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '280px 1fr', gap: 20 }}>
        <div style={{ background: '#fff', padding: 20, borderRadius: 10, border: '1px solid #e2e8f0' }}>
          <h4 style={{ marginTop: 0, fontSize: 14 }}>➕ Registrar Actividad</h4>
          <label style={{ fontSize: 11, color: '#64748b', display: 'block', marginBottom: 4 }}>NOMBRE DE LA ACTIVIDAD</label>
          <input value={activityName} onChange={e => setActivityName(e.target.value)} placeholder="Ej: Pega Lopa, Capstone" style={{ width: '90%', padding: 8, marginBottom: 12, borderRadius: 6, border: '1px solid #cbd5e1' }} />

          <label style={{ fontSize: 11, color: '#64748b', display: 'block', marginBottom: 4 }}>DÍA DE LA SEMANA</label>
          <select value={activityDay} onChange={e => setActivityDay(e.target.value)} style={{ width: '97%', padding: 8, marginBottom: 12, borderRadius: 6, border: '1px solid #cbd5e1' }}>
            {['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'].map(d => <option key={d} value={d}>{d}</option>)}
          </select>

          <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
            <div style={{ flex: 1 }}>
              <label style={{ fontSize: 11, color: '#64748b' }}>HORA INICIO</label>
              <select value={startTime} onChange={e => setStartTime(e.target.value)} style={{ width: '100%', padding: 6, borderRadius: 6, border: '1px solid #cbd5e1' }}>
                {timeSlots.map(t => <option key={t} value={t.split(' - ')[0]}>{t.split(' - ')[0]}</option>)}
              </select>
            </div>
            <div style={{ flex: 1 }}>
              <label style={{ fontSize: 11, color: '#64748b' }}>HORA FIN</label>
              <select value={endTime} onChange={e => setEndTime(e.target.value)} style={{ width: '100%', padding: 6, borderRadius: 6, border: '1px solid #cbd5e1' }}>
                {timeSlots.map(t => <option key={t} value={t.split(' - ')[1]}>{t.split(' - ')[1]}</option>)}
              </select>
            </div>
          </div>

          <label style={{ fontSize: 11, color: '#64748b', display: 'block', marginBottom: 6 }}>COLOR IDENTIFICADOR</label>
          <div style={{ display: 'flex', gap: 8, marginBottom: 15 }}>
            {['#2563eb', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'].map(c => (
              <div key={c} onClick={() => setActivityColor(c)} style={{ width: 22, height: 22, borderRadius: '50%', background: c, cursor: 'pointer', border: activityColor === c ? '2px solid #fff' : 'none' }} />
            ))}
          </div>

          <button onClick={addScheduleEvent} style={{ width: '100%', padding: 10, background: '#2563eb', color: '#fff', border: 'none', borderRadius: 6, fontWeight: 600, cursor: 'pointer', fontSize: 13 }}>
            + Asignar al Horario
          </button>
        </div>

        <div style={{ background: '#fff', padding: 15, borderRadius: 10, border: '1px solid #e2e8f0', maxHeight: '70vh', overflowY: 'auto' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '90px repeat(6, 1fr)', gap: 6, textAlign: 'center', fontWeight: 'bold', fontSize: 11, position: 'sticky', top: 0, background: '#fff', zIndex: 10, paddingBottom: 6 }}>
            <div style={{ background: '#2563eb', color: '#fff', padding: 8, borderRadius: 4 }}>🕒</div>
            {['LUN', 'MAR', 'MIÉ', 'JUE', 'VIE', 'SÁB'].map(day => (
              <div key={day} style={{ background: '#2563eb', color: '#fff', padding: 8, borderRadius: 4 }}>{day}</div>
            ))}
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginTop: 6 }}>
            {timeSlots.map(slot => (
              <div key={slot} style={{ display: 'grid', gridTemplateColumns: '90px repeat(6, 1fr)', gap: 6, height: 42 }}>
                <div style={{ fontSize: 10, color: '#64748b', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f1f5f9', borderRadius: 4 }}>{slot}</div>
                {['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'].map(day => {
                  const ev = scheduleEvents.find(e => e.day === day && timeToMinutes(slot.split(' - ')[0]) >= timeToMinutes(e.start) && timeToMinutes(slot.split(' - ')[0]) < timeToMinutes(e.end));
                  return (
                    <div key={day} style={{ background: ev ? ev.color : '#f1f5f9', color: '#fff', borderRadius: 4, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 8px', fontSize: 11, fontWeight: 600 }}>
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
  );
}
`;

// 2. Feature: KanbanView.jsx con persistencia local
const kanbanContent = `import React, { useState, useEffect } from 'react';

const INITIAL_TASKS = [
  { id: '1', title: 'Diseñar interfaz responsiva', desc: 'Crear maquetación base para móviles y escritorio.', priority: 'ALTA', pts: '5 pts', status: 'todo' },
  { id: '2', title: 'Modularizar JS y CSS', desc: 'Desglosar el proyecto en arquitectura de módulos.', priority: 'URGENTE', pts: '3 pts', status: 'in_progress' },
  { id: '3', title: 'Definir paletas de colores', desc: 'Añadir soporte para 5 temas dinámicos.', priority: 'MEDIA', pts: '2 pts', status: 'done' },
];

export default function KanbanView() {
  const [kanbanTasks, setKanbanTasks] = useState(() => {
    const saved = localStorage.getItem('topsflow_kanban');
    return saved ? JSON.parse(saved) : INITIAL_TASKS;
  });

  useEffect(() => {
    localStorage.setItem('topsflow_kanban', JSON.stringify(kanbanTasks));
  }, [kanbanTasks]);

  const [showTaskModal, setShowTaskModal] = useState(false);
  const [newKanbanTitle, setNewKanbanTitle] = useState('');
  const [newKanbanDesc, setNewKanbanDesc] = useState('');

  const addKanbanTask = () => {
    if (!newKanbanTitle) return;
    setKanbanTasks([...kanbanTasks, {
      id: Date.now().toString(),
      title: newKanbanTitle,
      desc: newKanbanDesc || 'Sin descripción',
      priority: 'MEDIA',
      pts: '3 pts',
      status: 'todo'
    }]);
    setNewKanbanTitle(''); setNewKanbanDesc(''); setShowTaskModal(false);
  };

  const moveKanbanTask = (id, newStatus) => {
    setKanbanTasks(kanbanTasks.map(t => t.id === id ? { ...t, status: newStatus } : t));
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <div>
          <h3 style={{ margin: 0, fontSize: 18 }}>📊 Gestión Ágil (Kanban)</h3>
          <span style={{ fontSize: 12, color: '#64748b' }}>Organiza tus tareas en etapas y mide los puntos de esfuerzo.</span>
        </div>
        <button onClick={() => setShowTaskModal(true)} style={{ background: '#2563eb', color: '#fff', border: 'none', padding: '8px 16px', borderRadius: 6, fontWeight: 600, fontSize: 13, cursor: 'pointer' }}>
          + Nueva Tarjeta
        </button>
      </div>

      {showTaskModal && (
        <div style={{ background: 'rgba(0,0,0,0.5)', position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100 }}>
          <div style={{ background: '#fff', padding: 25, borderRadius: 10, width: 380, border: '1px solid #cbd5e1' }}>
            <h3 style={{ marginTop: 0 }}>Crear Nueva Tarjeta</h3>
            <input placeholder="Título de la tarea" value={newKanbanTitle} onChange={e => setNewKanbanTitle(e.target.value)} style={{ width: '92%', padding: 8, marginBottom: 10, borderRadius: 6, border: '1px solid #cbd5e1' }} />
            <textarea placeholder="Descripción" value={newKanbanDesc} onChange={e => setNewKanbanDesc(e.target.value)} style={{ width: '92%', padding: 8, marginBottom: 15, borderRadius: 6, border: '1px solid #cbd5e1' }} />
            <div style={{ display: 'flex', gap: 10 }}>
              <button onClick={addKanbanTask} style={{ flex: 1, padding: 10, background: '#2563eb', color: '#fff', border: 'none', borderRadius: 6, cursor: 'pointer' }}>Guardar</button>
              <button onClick={() => setShowTaskModal(false)} style={{ flex: 1, padding: 10, background: 'transparent', border: '1px solid #cbd5e1', borderRadius: 6, cursor: 'pointer' }}>Cancelar</button>
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
          <div key={col.key} style={{ background: '#fff', padding: 15, borderRadius: 10, border: '1px solid #e2e8f0' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 15 }}>
              <strong style={{ fontSize: 13 }}>{col.title}</strong>
              <span style={{ background: '#f1f5f9', padding: '2px 8px', borderRadius: 10, fontSize: 11, fontWeight: 600 }}>{col.count}</span>
            </div>
            {kanbanTasks.filter(t => t.status === col.key).map(task => (
              <div key={task.id} style={{ background: '#f8fafc', padding: 14, borderRadius: 8, border: '1px solid #e2e8f0', marginBottom: 12 }}>
                <span style={{ fontSize: 9, fontWeight: 700, padding: '2px 6px', borderRadius: 4, background: '#fee2e2', color: '#991b1b' }}>{task.priority}</span>
                <h4 style={{ margin: '8px 0 4px 0', fontSize: 13 }}>{task.title}</h4>
                <p style={{ margin: 0, fontSize: 11, color: '#64748b' }}>{task.desc}</p>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 12 }}>
                  <div style={{ display: 'flex', gap: 4 }}>
                    {col.key !== 'todo' && <button onClick={() => moveKanbanTask(task.id, 'todo')} style={{ fontSize: 9, padding: '2px 6px', cursor: 'pointer' }}>⬅</button>}
                    {col.key !== 'in_progress' && <button onClick={() => moveKanbanTask(task.id, 'in_progress')} style={{ fontSize: 9, padding: '2px 6px', cursor: 'pointer' }}>⚙️</button>}
                    {col.key !== 'done' && <button onClick={() => moveKanbanTask(task.id, 'done')} style={{ fontSize: 9, padding: '2px 6px', cursor: 'pointer' }}>➔</button>}
                  </div>
                  <span style={{ fontSize: 10, color: '#64748b' }}>⚡ {task.pts}</span>
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
`;

// 3. Feature: ProjectsView.jsx con persistencia local
const projectsContent = `import React, { useState, useEffect } from 'react';

const INITIAL_PROJECTS = [
  { id: '1', name: 'Proyecto de Titulación (Capstone)', phase: '2. En Desarrollo', status: 'in_progress', desc: 'Desarrollo del software base e informe final.', progress: 65 },
  { id: '2', name: 'Rediseño T.o.p.s Flow', phase: '3. Pruebas & Ajustes', status: 'in_progress', desc: 'Implementación del sistema modular.', progress: 85 },
  { id: '3', name: 'Módulo 2FA Enterprise', phase: '4. Completado', status: 'done', desc: 'Integración de TOTP con PostgreSQL.', progress: 100 },
];

export default function ProjectsView() {
  const [projects, setProjects] = useState(() => {
    const saved = localStorage.getItem('topsflow_projects');
    return saved ? JSON.parse(saved) : INITIAL_PROJECTS;
  });

  useEffect(() => {
    localStorage.setItem('topsflow_projects', JSON.stringify(projects));
  }, [projects]);

  const updateProjectStatus = (id, status, progress, phase) => {
    setProjects(projects.map(p => p.id === id ? { ...p, status, progress, phase } : p));
  };

  return (
    <div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 15, marginBottom: 20 }}>
        <div style={{ background: '#fff', padding: 15, borderRadius: 8, border: '1px solid #e2e8f0', borderLeft: '4px solid #f59e0b' }}>
          <span style={{ fontSize: 11, color: '#64748b' }}>EN ESPERA</span>
          <div style={{ fontSize: 20, fontWeight: 700, marginTop: 4 }}>{projects.filter(p => p.status === 'pending').length}</div>
        </div>
        <div style={{ background: '#fff', padding: 15, borderRadius: 8, border: '1px solid #e2e8f0', borderLeft: '4px solid #2563eb' }}>
          <span style={{ fontSize: 11, color: '#64748b' }}>EN PROCESO</span>
          <div style={{ fontSize: 20, fontWeight: 700, marginTop: 4 }}>{projects.filter(p => p.status === 'in_progress').length}</div>
        </div>
        <div style={{ background: '#fff', padding: 15, borderRadius: 8, border: '1px solid #e2e8f0', borderLeft: '4px solid #10b981' }}>
          <span style={{ fontSize: 11, color: '#64748b' }}>FINALIZADOS</span>
          <div style={{ fontSize: 20, fontWeight: 700, marginTop: 4 }}>{projects.filter(p => p.status === 'done').length}</div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 20 }}>
        {projects.map(p => (
          <div key={p.id} style={{ background: '#fff', padding: 20, borderRadius: 10, border: '1px solid #e2e8f0' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <h3 style={{ margin: 0, fontSize: 15 }}>{p.name}</h3>
              <span style={{ background: p.status === 'done' ? '#dcfce7' : '#dbeafe', color: p.status === 'done' ? '#166534' : '#1e40af', padding: '2px 8px', borderRadius: 4, fontSize: 10, fontWeight: 600 }}>{p.phase}</span>
            </div>
            <p style={{ fontSize: 12, color: '#64748b', marginTop: 8 }}>{p.desc}</p>
            <div style={{ marginTop: 15 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, marginBottom: 4 }}>
                <span>Progreso</span>
                <span>{p.progress}%</span>
              </div>
              <div style={{ background: '#f1f5f9', height: 8, borderRadius: 4, overflow: 'hidden' }}>
                <div style={{ background: p.status === 'done' ? '#10b981' : '#2563eb', width: \`\${p.progress}%\`, height: '100%' }} />
              </div>
            </div>
            <div style={{ display: 'flex', gap: 6, marginTop: 15 }}>
              <button onClick={() => updateProjectStatus(p.id, 'pending', 0, '1. En Espera')} style={{ fontSize: 10, padding: 4, cursor: 'pointer' }}>En Espera</button>
              <button onClick={() => updateProjectStatus(p.id, 'in_progress', 50, '2. En Desarrollo')} style={{ fontSize: 10, padding: 4, cursor: 'pointer' }}>En Proceso</button>
              <button onClick={() => updateProjectStatus(p.id, 'done', 100, '4. Finalizado')} style={{ fontSize: 10, padding: 4, cursor: 'pointer' }}>Finalizar</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
`;

fs.writeFileSync(path.join(__dirname, 'apps/frontend/src/features/schedule/ScheduleView.jsx'), scheduleContent, 'utf8');
fs.writeFileSync(path.join(__dirname, 'apps/frontend/src/features/kanban/KanbanView.jsx'), kanbanContent, 'utf8');
fs.writeFileSync(path.join(__dirname, 'apps/frontend/src/features/projects/ProjectsView.jsx'), projectsContent, 'utf8');

console.log('✅ Persistencia reactiva habilitada en Horario, Kanban y Proyectos.');