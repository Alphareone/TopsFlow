import React, { useState, useEffect } from 'react';

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
                <div style={{ background: p.status === 'done' ? '#10b981' : '#2563eb', width: `${p.progress}%`, height: '100%' }} />
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
