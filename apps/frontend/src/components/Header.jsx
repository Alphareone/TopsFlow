import React from 'react';

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
