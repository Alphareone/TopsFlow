import React from 'react';
import { translations } from '../services/i18n';

export default function HeaderEnterprise({ activeTab, setActiveTab, lang, bgImage }) {
  const t = translations[lang] || translations.es;

  const recentTabs = [
    { id: 'horario', label: t.navHorario },
    { id: 'kanban', label: t.navKanban },
    { id: 'proyectos', label: t.navProyectos },
    { id: 'dashboard', label: t.navDashboard },
    { id: 'cicd', label: t.navCicd },
  ];

  return (
    <header style={{
      background: bgImage ? 'rgba(15, 23, 42, 0.8)' : '#0f172a',
      backdropFilter: bgImage ? 'blur(10px)' : 'none',
      borderBottom: '1px solid rgba(255,255,255,0.1)',
      padding: '8px 20px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      color: '#fff'
    }}>
      <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
        <span style={{ fontSize: 11, color: '#94a3b8', marginRight: 10, fontWeight: 600 }}>Entornos TI:</span>
        {recentTabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            style={{
              padding: '5px 12px',
              borderRadius: 6,
              border: 'none',
              background: activeTab === tab.id ? '#2563eb' : 'rgba(255,255,255,0.05)',
              color: activeTab === tab.id ? '#ffffff' : '#94a3b8',
              fontSize: 11,
              cursor: 'pointer',
              fontWeight: activeTab === tab.id ? 600 : 400
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 15 }}>
        <span style={{ background: '#dcfce7', color: '#166534', padding: '3px 10px', borderRadius: 12, fontSize: 11, fontWeight: 600 }}>
          {t.verifiedSession}
        </span>
      </div>
    </header>
  );
}
