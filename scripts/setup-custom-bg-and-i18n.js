const fs = require('fs');
const path = require('path');

// 1. Diccionario de Idiomas y Textos (i18n.js)
const i18nContent = `export const translations = {
  es: {
    title: 'T.o.p.s Flow',
    subtitle: 'Organiza & Optimiza',
    navHorario: '1. Gestión Horario',
    navKanban: '2. Gestión Ágil (Kanban)',
    navCalendario: '3. Calendario',
    navProyectos: '4. Proyectos',
    logout: 'Cerrar Sesión',
    themeLabel: '🎨 Tema',
    langLabel: '🌐 Idioma',
    bgCustomLabel: '🖼️ Fondo Personalizado',
    bgUrlPlaceholder: 'URL de imagen de fondo...',
    applyBg: 'Aplicar Fondo',
    removeBg: 'Quitar Fondo',
    verifiedSession: '🟢 Sesión 2FA Verificada',
    scheduleTitle: '📅 Planificación Semestral Inteligente',
    scheduleSub: 'Trabajos • Estudios • Prácticas',
    kanbanTitle: '📊 Gestión Ágil (Kanban)',
    calendarTitle: '📆 Calendario Integrado',
    projectsTitle: '📐 Gestión Integral de Proyectos',
  },
  en: {
    title: 'T.o.p.s Flow',
    subtitle: 'Organize & Optimize',
    navHorario: '1. Schedule Management',
    navKanban: '2. Agile Kanban',
    navCalendario: '3. Calendar',
    navProyectos: '4. Projects',
    logout: 'Log Out',
    themeLabel: '🎨 Theme',
    langLabel: '🌐 Language',
    bgCustomLabel: '🖼️ Custom Background',
    bgUrlPlaceholder: 'Background Image URL...',
    applyBg: 'Apply Background',
    removeBg: 'Remove Background',
    verifiedSession: '🟢 2FA Session Verified',
    scheduleTitle: '📅 Smart Semester Planning',
    scheduleSub: 'Work • Studies • Internships',
    kanbanTitle: '📊 Agile Management (Kanban)',
    calendarTitle: '📆 Integrated Calendar',
    projectsTitle: '📐 Comprehensive Project Management',
  }
};
`;

fs.writeFileSync(path.join(__dirname, 'apps/frontend/src/services/i18n.js'), i18nContent, 'utf8');

// 2. Sidebar Actualizado con Cambio de Idioma e Imagen de Fondo (Sidebar.jsx)
const sidebarUpdatedContent = `import React, { useState } from 'react';
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
      borderRight: \`1px solid \${styles.border}\`, 
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
              className={\`nav-item-btn \${activeTab === item.id ? 'active' : ''}\`}
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
        <div style={{ background: bgImage ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.03)', padding: 10, borderRadius: 8, border: \`1px solid \${styles.border}\` }}>
          <span style={{ fontSize: 11, color: styles.textMuted, fontWeight: 600, display: 'block', marginBottom: 6 }}>{t.bgCustomLabel}</span>
          <input 
            placeholder={t.bgUrlPlaceholder}
            value={inputUrl}
            onChange={e => setInputUrl(e.target.value)}
            style={{ width: '90%', padding: 5, fontSize: 10, borderRadius: 4, border: \`1px solid \${styles.border}\`, marginBottom: 6 }}
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
            <select value={lang} onChange={e => { setLang(e.target.value); localStorage.setItem('topsflow_lang', e.target.value); }} style={{ width: '100%', padding: 5, borderRadius: 6, border: \`1px solid \${styles.border}\`, fontSize: 11 }}>
              <option value="es">Español</option>
              <option value="en">English</option>
            </select>
          </div>
          <div style={{ flex: 1 }}>
            <label style={{ fontSize: 10, color: styles.textMuted, display: 'block' }}>{t.themeLabel}</label>
            <select value={theme} onChange={e => setTheme(e.target.value)} style={{ width: '100%', padding: 5, borderRadius: 6, border: \`1px solid \${styles.border}\`, fontSize: 11 }}>
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
`;

fs.writeFileSync(path.join(__dirname, 'apps/frontend/src/components/Sidebar.jsx'), sidebarUpdatedContent, 'utf8');

// 3. App.jsx Integrador con Fondo de Imagen Dinámico
const mainAppJsx = `import React, { useState } from 'react';
import LoginForm from './features/auth/LoginForm';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import ScheduleView from './features/schedule/ScheduleView';
import KanbanView from './features/kanban/KanbanView';
import CalendarView from './features/calendar/CalendarView';
import ProjectsView from './features/projects/ProjectsView';

export default function App() {
  const [authToken, setAuthToken] = useState(localStorage.getItem('token') || '');
  const [activeTab, setActiveTab] = useState('horario');
  const [theme, setTheme] = useState('Claro (Base)');
  const [lang, setLang] = useState(localStorage.getItem('topsflow_lang') || 'es');
  const [bgImage, setBgImage] = useState(localStorage.getItem('topsflow_bg_image') || '');

  const logoutUser = () => {
    localStorage.removeItem('token');
    setAuthToken('');
  };

  if (!authToken) {
    return <LoginForm onLoginSuccess={(token) => setAuthToken(token)} />;
  }

  return (
    <div 
      className="app-container" 
      style={{ 
        display: 'flex', 
        height: '100vh', 
        fontFamily: 'Inter, sans-serif',
        backgroundImage: bgImage ? \`url(\${bgImage})\` : 'none',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        position: 'relative'
      }}
    >
      {/* Capa de contraste cuando hay imagen de fondo */}
      {bgImage && <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(15, 23, 42, 0.45)', backdropFilter: 'blur(3px)', zIndex: 1 }} />}
      
      <div style={{ display: 'flex', width: '100%', height: '100vh', zIndex: 2 }}>
        <Sidebar 
          activeTab={activeTab} 
          setActiveTab={setActiveTab} 
          onLogout={logoutUser} 
          theme={theme} 
          setTheme={setTheme} 
          lang={lang} 
          setLang={setLang}
          bgImage={bgImage}
          setBgImage={setBgImage}
        />
        <main style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
          <Header activeTab={activeTab} lang={lang} bgImage={bgImage} />
          <div style={{ flex: 1, padding: 20, overflowY: 'auto' }}>
            {activeTab === 'horario' && <ScheduleView lang={lang} bgImage={bgImage} />}
            {activeTab === 'kanban' && <KanbanView lang={lang} bgImage={bgImage} />}
            {activeTab === 'calendario' && <CalendarView lang={lang} bgImage={bgImage} />}
            {activeTab === 'proyectos' && <ProjectsView lang={lang} bgImage={bgImage} />}
          </div>
        </main>
      </div>
    </div>
  );
}
`;

fs.writeFileSync(path.join(__dirname, 'apps/frontend/src/App.jsx'), mainAppJsx, 'utf8');

console.log('✅ Personalización de Fondos con Imágenes e Internacionalización (Español/Inglés) integradas.');