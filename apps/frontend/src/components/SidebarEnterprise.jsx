import React, { useState } from 'react';
import Icon from './Icon';
import { translations } from '../services/i18n';

export default function SidebarEnterprise({ activeTab, setActiveTab, onLogout, theme, setTheme, lang, setLang, bgImage, setBgImage }) {
  const [activeRail, setActiveRail] = useState('proyectos');
  const [inputUrl, setInputUrl] = useState('');
  const t = translations[lang] || translations.es;

  const railItems = [
    { id: 'dashboard', icon: 'dashboard', label: 'Dashboard' },
    { id: 'horario', icon: 'horario', label: 'Horario' },
    { id: 'kanban', icon: 'kanban', label: 'Kanban' },
    { id: 'calendario', icon: 'calendario', label: 'Calendario' },
    { id: 'proyectos', icon: 'proyectos', label: 'Proyectos' },
    { id: 'cicd', icon: 'cicd', label: 'CI/CD & QA' },
  ];

  const handleApplyBg = () => {
    if (!inputUrl) return;
    setBgImage(inputUrl);
    localStorage.setItem('topsflow_bg_image', inputUrl);
    setInputUrl('');
  };

  return (
    <aside style={{ display: 'flex', height: '100vh', zIndex: 20 }}>
      <div style={{
        width: 64,
        background: '#090d16',
        borderRight: '1px solid rgba(255,255,255,0.1)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: '15px 0',
        justify: 'space-between'
      }}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 15 }}>
          <div style={{ background: '#2563eb', color: '#fff', width: 38, height: 38, borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>
            <Icon name="bolt" size={22} />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 10 }}>
            {railItems.map(item => (
              <button
                key={item.id}
                onClick={() => { setActiveRail(item.id); setActiveTab(item.id); }}
                title={item.label}
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: 10,
                  border: 'none',
                  background: activeTab === item.id ? '#2563eb' : 'transparent',
                  color: activeTab === item.id ? '#fff' : '#94a3b8',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'all 0.2s'
                }}
              >
                <Icon name={item.icon} size={20} />
              </button>
            ))}
          </div>
        </div>

        <button onClick={onLogout} title={t.logout} style={{ width: 40, height: 40, borderRadius: 10, border: 'none', background: 'rgba(239, 68, 68, 0.2)', color: '#ef4444', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Icon name="logout" size={18} />
        </button>
      </div>

      <div style={{
        width: 220,
        background: bgImage ? 'rgba(15, 23, 42, 0.85)' : '#0f172a',
        backdropFilter: bgImage ? 'blur(12px)' : 'none',
        borderRight: '1px solid rgba(255,255,255,0.1)',
        padding: 20,
        display: 'flex',
        flexDirection: 'column',
        justify: 'space-between',
        color: '#fff'
      }}>
        <div>
          <h3 style={{ margin: '0 0 15px 0', fontSize: 14, fontWeight: 700, color: '#60a5fa' }}>
            SUITE TI & DEV
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            {[
              { id: 'horario', label: t.navHorario },
              { id: 'kanban', label: t.navKanban },
              { id: 'calendario', label: t.navCalendario },
              { id: 'proyectos', label: t.navProyectos },
              { id: 'dashboard', label: t.navDashboard },
              { id: 'cicd', label: t.navCicd },
            ].map(sub => (
              <button
                key={sub.id}
                onClick={() => setActiveTab(sub.id)}
                style={{
                  padding: '8px 12px',
                  borderRadius: 6,
                  border: 'none',
                  background: activeTab === sub.id ? 'rgba(37,99,235,0.25)' : 'transparent',
                  color: activeTab === sub.id ? '#ffffff' : '#cbd5e1',
                  textAlign: 'left',
                  cursor: 'pointer',
                  fontSize: 12,
                  fontWeight: activeTab === sub.id ? 600 : 400
                }}
              >
                {sub.label}
              </button>
            ))}
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, paddingTop: 15, borderTop: '1px solid rgba(255,255,255,0.1)' }}>
          <div>
            <label style={{ fontSize: 10, color: '#94a3b8' }}>{t.langLabel}</label>
            <select value={lang} onChange={e => { setLang(e.target.value); localStorage.setItem('topsflow_lang', e.target.value); }} style={{ width: '100%', padding: 4, background: '#1e293b', color: '#fff', border: '1px solid #334155', borderRadius: 4, fontSize: 11 }}>
              <option value="es">Español</option>
              <option value="en">English</option>
            </select>
          </div>

          <div>
            <span style={{ fontSize: 10, color: '#94a3b8' }}>{t.bgCustomLabel}</span>
            <input placeholder="URL..." value={inputUrl} onChange={e => setInputUrl(e.target.value)} style={{ width: '90%', padding: 4, background: '#1e293b', color: '#fff', border: '1px solid #334155', borderRadius: 4, fontSize: 10, marginBottom: 4 }} />
            <button onClick={handleApplyBg} style={{ width: '100%', padding: 4, background: '#2563eb', color: '#fff', border: 'none', borderRadius: 4, fontSize: 10, cursor: 'pointer' }}>{t.applyBg}</button>
          </div>
        </div>
      </div>
    </aside>
  );
}
