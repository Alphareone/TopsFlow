import React, { useState } from 'react';
import Icon from './Icon';
import { translations } from '../services/i18n';

export default function Sidebar({ activeTab, setActiveTab, onLogout, theme, setTheme, lang, setLang, bgImage, setBgImage }) {
  const [inputUrl, setInputUrl] = useState('');
  const t = translations[lang] || translations.es;

  const handleApplyBg = () => {
    if (!inputUrl) return;
    setBgImage(inputUrl);
    localStorage.setItem('topsflow_bg_image', inputUrl);
    setInputUrl('');
  };

  const handleRemoveBg = () => {
    setBgImage('');
    localStorage.removeItem('topsflow_bg_image');
  };

  const getThemeStyles = () => {
    if (bgImage) {
      return { sidebarBg: 'rgba(15, 23, 42, 0.85)', border: 'rgba(255, 255, 255, 0.15)', text: '#ffffff', accent: '#3b82f6', textMuted: '#cbd5e1' };
    }
    switch (theme) {
      case 'Oscuro': return { sidebarBg: '#0f172a', border: '#334155', text: '#f8fafc', accent: '#3b82f6', textMuted: '#94a3b8' };
      case 'Vintage': return { sidebarBg: '#e3d7cc', border: '#d3c5b7', text: '#4a3e3d', accent: '#8c6d58', textMuted: '#786458' };
      case 'Pastel': return { sidebarBg: '#f7ede2', border: '#f3e8e2', text: '#4a4e69', accent: '#f72585', textMuted: '#8d99ae' };
      case 'Ocean': return { sidebarBg: '#f0f9ff', border: '#bae6fd', text: '#0369a1', accent: '#0284c7', textMuted: '#0284c7' };
      default: return { sidebarBg: '#ffffff', border: '#e2e8f0', text: '#1e293b', accent: '#2563eb', textMuted: '#64748b' };
    }
  };

  const styles = getThemeStyles();

  return (
    <aside style={{ 
      width: 270, 
      background: styles.sidebarBg, 
      backdropFilter: bgImage ? 'blur(12px)' : 'none',
      borderRight: `1px solid ${styles.border}`, 
      display: 'flex', 
      flexDirection: 'column', 
      justify: 'space-between', 
      padding: '20px 15px',
      zIndex: 20
    }}>
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 25, paddingLeft: 5 }}>
          <div style={{ background: styles.accent, color: '#fff', width: 32, height: 32, borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 12px rgba(37,99,235,0.3)' }}>
            <Icon name="bolt" size={20} />
          </div>
          <div>
            <h3 style={{ margin: 0, fontSize: 16, fontWeight: 700, color: styles.text }}>{t.title}</h3>
            <span style={{ fontSize: 10, color: styles.textMuted }}>{t.subtitle}</span>
          </div>
        </div>

        <nav style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          {[
            { id: 'horario', label: t.navHorario, icon: 'horario' },
            { id: 'kanban', label: t.navKanban, icon: 'kanban' },
            { id: 'calendario', label: t.navCalendario, icon: 'calendario' },
            { id: 'proyectos', label: t.navProyectos, icon: 'proyectos' },
          ].map(item => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`nav-item-btn ${activeTab === item.id ? 'active' : ''}`}
              style={{ color: activeTab === item.id ? '#ffffff' : styles.text }}
            >
              <Icon name={item.icon} size={18} />
              <span>{item.label}</span>
            </button>
          ))}
        </nav>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {/* Selector de Fondo Personalizado */}
        <div style={{ background: bgImage ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.03)', padding: 10, borderRadius: 8, border: `1px solid ${styles.border}` }}>
          <span style={{ fontSize: 11, color: styles.textMuted, fontWeight: 600, display: 'block', marginBottom: 6 }}>{t.bgCustomLabel}</span>
          <input 
            placeholder={t.bgUrlPlaceholder}
            value={inputUrl}
            onChange={e => setInputUrl(e.target.value)}
            style={{ width: '90%', padding: 5, fontSize: 10, borderRadius: 4, border: `1px solid ${styles.border}`, marginBottom: 6 }}
          />
          <div style={{ display: 'flex', gap: 4 }}>
            <button onClick={handleApplyBg} style={{ flex: 1, padding: '4px 6px', fontSize: 10, background: styles.accent, color: '#fff', border: 'none', borderRadius: 4, cursor: 'pointer' }}>{t.applyBg}</button>
            {bgImage && <button onClick={handleRemoveBg} style={{ flex: 1, padding: '4px 6px', fontSize: 10, background: '#ef4444', color: '#fff', border: 'none', borderRadius: 4, cursor: 'pointer' }}>{t.removeBg}</button>}
          </div>
        </div>

        {/* Controles de Idioma y Tema */}
        <div style={{ display: 'flex', gap: 8 }}>
          <div style={{ flex: 1 }}>
            <label style={{ fontSize: 10, color: styles.textMuted, display: 'block' }}>{t.langLabel}</label>
            <select value={lang} onChange={e => { setLang(e.target.value); localStorage.setItem('topsflow_lang', e.target.value); }} style={{ width: '100%', padding: 5, borderRadius: 6, border: `1px solid ${styles.border}`, fontSize: 11 }}>
              <option value="es">Español</option>
              <option value="en">English</option>
            </select>
          </div>
          <div style={{ flex: 1 }}>
            <label style={{ fontSize: 10, color: styles.textMuted, display: 'block' }}>{t.themeLabel}</label>
            <select value={theme} onChange={e => setTheme(e.target.value)} style={{ width: '100%', padding: 5, borderRadius: 6, border: `1px solid ${styles.border}`, fontSize: 11 }}>
              <option value="Claro (Base)">Claro</option>
              <option value="Oscuro">Oscuro</option>
              <option value="Vintage">Vintage</option>
              <option value="Pastel">Pastel</option>
              <option value="Ocean">Ocean</option>
            </select>
          </div>
        </div>

        <button onClick={onLogout} style={{ width: '100%', padding: '8px 12px', background: '#ef4444', color: '#fff', border: 'none', borderRadius: 8, cursor: 'pointer', fontWeight: 600, fontSize: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
          <Icon name="logout" size={16} />
          <span>{t.logout}</span>
        </button>
      </div>
    </aside>
  );
}
