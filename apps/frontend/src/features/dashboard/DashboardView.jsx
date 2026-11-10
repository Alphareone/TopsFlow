import React, { useState, useEffect } from 'react';

const INITIAL_KPIS = [
  { id: '1', title: 'Cobertura de Código (Tests)', projectType: 'Software', current: 85, target: 100, unit: '%' },
  { id: '2', title: 'Hitos Cumplidos del Capstone', projectType: 'Investigación / Capstone', current: 3, target: 4, unit: 'Hitos' },
  { id: '3', title: 'Presupuesto de Infraestructura AWS', projectType: 'Operaciones', current: 450, target: 500, unit: 'USD' }
];

export default function DashboardView({ lang, bgImage }) {
  const [kpis, setKpis] = useState(() => {
    const saved = localStorage.getItem('topsflow_kpis');
    return saved ? JSON.parse(saved) : INITIAL_KPIS;
  });

  const [showModal, setShowModal] = useState(false);
  const [title, setTitle] = useState('');
  const [projectType, setProjectType] = useState('Software');
  const [currentVal, setCurrentVal] = useState('');
  const [targetVal, setTargetVal] = useState('');
  const [unit, setUnit] = useState('%');

  useEffect(() => {
    localStorage.setItem('topsflow_kpis', JSON.stringify(kpis));
  }, [kpis]);

  const addKpi = (e) => {
    e.preventDefault();
    if (!title || !currentVal || !targetVal) return;
    setKpis([...kpis, {
      id: Date.now().toString(),
      title,
      projectType,
      current: Number(currentVal),
      target: Number(targetVal),
      unit
    }]);
    setTitle(''); setCurrentVal(''); setTargetVal(''); setShowModal(false);
  };

  const updateKpiVal = (id, delta) => {
    setKpis(kpis.map(k => k.id === id ? { ...k, current: Math.max(0, k.current + delta) } : k));
  };

  const deleteKpi = (id) => {
    setKpis(kpis.filter(k => k.id !== id));
  };

  const cardStyle = {
    background: bgImage ? 'rgba(15, 23, 42, 0.75)' : '#ffffff',
    color: bgImage ? '#ffffff' : '#1e293b',
    backdropFilter: bgImage ? 'blur(12px)' : 'none',
    border: `1px solid ${bgImage ? 'rgba(255,255,255,0.15)' : '#e2e8f0'}`,
    borderRadius: 12,
    padding: 20,
    boxShadow: '0 4px 20px rgba(0,0,0,0.05)'
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <div>
          <h3 style={{ margin: 0, fontSize: 20, color: bgImage ? '#fff' : '#0f172a' }}>📊 Dashboard de Alcances & KPIs</h3>
          <span style={{ fontSize: 12, color: bgImage ? '#cbd5e1' : '#64748b' }}>Métricas de rendimiento por tipo de proyecto.</span>
        </div>
        <button onClick={() => setShowModal(true)} style={{ background: '#2563eb', color: '#fff', border: 'none', padding: '10px 18px', borderRadius: 8, fontWeight: 600, fontSize: 13, cursor: 'pointer', boxShadow: '0 4px 12px rgba(37,99,235,0.3)' }}>
          + Agregar Nuevo KPI
        </button>
      </div>

      {showModal && (
        <div style={{ background: 'rgba(0,0,0,0.6)', position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100 }}>
          <div style={{ background: '#1e293b', color: '#fff', padding: 25, borderRadius: 12, width: 400, border: '1px solid #334155' }}>
            <h3 style={{ marginTop: 0 }}>Crear Indicador (KPI)</h3>
            <form onSubmit={addKpi}>
              <label style={{ fontSize: 11, color: '#94a3b8' }}>Nombre del KPI</label>
              <input value={title} onChange={e => setTitle(e.target.value)} placeholder="Ej: Cobertura de Pruebas" style={{ width: '92%', padding: 8, marginBottom: 10, borderRadius: 6, border: '1px solid #475569', background: '#0f172a', color: '#fff' }} />

              <label style={{ fontSize: 11, color: '#94a3b8' }}>Tipo de Proyecto</label>
              <select value={projectType} onChange={e => setProjectType(e.target.value)} style={{ width: '98%', padding: 8, marginBottom: 10, borderRadius: 6, border: '1px solid #475569', background: '#0f172a', color: '#fff' }}>
                <option value="Software">Software & TI</option>
                <option value="Investigación / Capstone">Investigación / Capstone</option>
                <option value="Operaciones">Operaciones / Infraestructura</option>
                <option value="Marketing">Marketing / Ventas</option>
              </select>

              <div style={{ display: 'flex', gap: 10, marginBottom: 10 }}>
                <div style={{ flex: 1 }}>
                  <label style={{ fontSize: 11, color: '#94a3b8' }}>Valor Actual</label>
                  <input type="number" value={currentVal} onChange={e => setCurrentVal(e.target.value)} placeholder="0" style={{ width: '85%', padding: 8, borderRadius: 6, border: '1px solid #475569', background: '#0f172a', color: '#fff' }} />
                </div>
                <div style={{ flex: 1 }}>
                  <label style={{ fontSize: 11, color: '#94a3b8' }}>Meta (Target)</label>
                  <input type="number" value={targetVal} onChange={e => setTargetVal(e.target.value)} placeholder="100" style={{ width: '85%', padding: 8, borderRadius: 6, border: '1px solid #475569', background: '#0f172a', color: '#fff' }} />
                </div>
              </div>

              <label style={{ fontSize: 11, color: '#94a3b8' }}>Unidad de Medida</label>
              <input value={unit} onChange={e => setUnit(e.target.value)} placeholder="%, USD, Hitos, etc." style={{ width: '92%', padding: 8, marginBottom: 15, borderRadius: 6, border: '1px solid #475569', background: '#0f172a', color: '#fff' }} />

              <div style={{ display: 'flex', gap: 10 }}>
                <button type="submit" style={{ flex: 1, padding: 10, background: '#2563eb', color: '#fff', border: 'none', borderRadius: 6, cursor: 'pointer', fontWeight: 600 }}>Guardar KPI</button>
                <button type="button" onClick={() => setShowModal(false)} style={{ flex: 1, padding: 10, background: 'transparent', border: '1px solid #475569', color: '#fff', borderRadius: 6, cursor: 'pointer' }}>Cancelar</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 20 }}>
        {kpis.map(k => {
          const pct = Math.min(100, Math.round((k.current / k.target) * 100)) || 0;
          return (
            <div key={k.id} style={cardStyle}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <span style={{ fontSize: 10, fontWeight: 700, padding: '3px 8px', borderRadius: 12, background: 'rgba(37,99,235,0.2)', color: '#3b82f6' }}>
                  {k.projectType}
                </span>
                <button onClick={() => deleteKpi(k.id)} style={{ background: 'transparent', border: 'none', color: '#ef4444', cursor: 'pointer', fontSize: 14 }}>✕</button>
              </div>

              <h4 style={{ margin: '12px 0 6px 0', fontSize: 15 }}>{k.title}</h4>
              <div style={{ fontSize: 24, fontWeight: 700, marginBottom: 10 }}>
                {k.current} <span style={{ fontSize: 13, fontWeight: 400, opacity: 0.7 }}>/ {k.target} {k.unit}</span>
              </div>

              <div style={{ background: bgImage ? 'rgba(255,255,255,0.1)' : '#f1f5f9', height: 10, borderRadius: 5, overflow: 'hidden', marginBottom: 10 }}>
                <div style={{ background: pct >= 100 ? '#10b981' : pct >= 50 ? '#3b82f6' : '#f59e0b', width: `${pct}%`, height: '100%', transition: 'width 0.3s' }} />
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: 12, fontWeight: 600 }}>{pct}% Alcance</span>
                <div style={{ display: 'flex', gap: 6 }}>
                  <button onClick={() => updateKpiVal(k.id, -1)} style={{ padding: '2px 8px', borderRadius: 4, border: '1px solid #cbd5e1', cursor: 'pointer' }}>-</button>
                  <button onClick={() => updateKpiVal(k.id, 1)} style={{ padding: '2px 8px', borderRadius: 4, border: '1px solid #cbd5e1', cursor: 'pointer' }}>+</button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
