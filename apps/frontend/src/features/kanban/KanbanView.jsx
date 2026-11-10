import React, { useState, useEffect } from 'react';

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
