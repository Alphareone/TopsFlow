const fs = require('fs');
const path = require('path');

// 1. Diccionario de Idiomas Actualizado con el Módulo Dashboard (i18n.js)
const i18nContent = `export const translations = {
  es: {
    title: 'T.o.p.s Flow',
    subtitle: 'Organiza & Optimiza',
    navHorario: '1. Gestión Horario',
    navKanban: '2. Gestión Ágil (Kanban)',
    navCalendario: '3. Calendario',
    navProyectos: '4. Proyectos',
    navDashboard: '5. Dashboard & KPIs',
    logout: 'Cerrar Sesión',
    themeLabel: '🎨 Tema',
    langLabel: '🌐 Idioma',
    bgCustomLabel: '🖼️ Fondo Personalizado',
    bgUrlPlaceholder: 'URL de imagen de fondo...',
    applyBg: 'Aplicar Fondo',
    removeBg: 'Quitar Fondo',
    verifiedSession: '🟢 Sesión 2FA Verificada',
    dashboardTitle: '📊 Dashboard de Métricas & KPIs de Alcance',
    dashboardSub: 'Configuración personalizada de indicadores clave por tipo de proyecto.',
  },
  en: {
    title: 'T.o.p.s Flow',
    subtitle: 'Organize & Optimize',
    navHorario: '1. Schedule Management',
    navKanban: '2. Agile Kanban',
    navCalendario: '3. Calendar',
    navProyectos: '4. Projects',
    navDashboard: '5. Dashboard & KPIs',
    logout: 'Log Out',
    themeLabel: '🎨 Theme',
    langLabel: '🌐 Language',
    bgCustomLabel: '🖼️ Custom Background',
    bgUrlPlaceholder: 'Background Image URL...',
    applyBg: 'Apply Background',
    removeBg: 'Remove Background',
    verifiedSession: '🟢 2FA Session Verified',
    dashboardTitle: '📊 Dashboard & Scope KPIs',
    dashboardSub: 'Custom key performance indicators tailored by project type.',
  }
};
`;
fs.writeFileSync(path.join(__dirname, 'apps/frontend/src/services/i18n.js'), i18nContent, 'utf8');

// 2. Icon.jsx Actualizado con Ícono de Dashboard
const iconContent = `import React from 'react';

export default function Icon({ name, className = '', size = 18 }) {
  const icons = {
    horario: (
      <svg className={\`svg-icon \${className}\`} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
      </svg>
    ),
    kanban: (
      <svg className={\`svg-icon \${className}\`} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="18" height="18" rx="2" /><path d="M8 7v10M12 7v6M16 7v9" />
      </svg>
    ),
    calendario: (
      <svg className={\`svg-icon \${className}\`} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="4" width="18" height="18" rx="2" ry="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" />
      </svg>
    ),
    proyectos: (
      <svg className={\`svg-icon \${className}\`} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
      </svg>
    ),
    dashboard: (
      <svg className={\`svg-icon \${className}\`} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="18" y1="20" x2="18" y2="10" /><line x1="12" y1="20" x2="12" y2="4" /><line x1="6" y1="20" x2="6" y2="14" />
      </svg>
    ),
    bolt: (
      <svg className={\`svg-icon \${className}\`} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
      </svg>
    ),
    logout: (
      <svg className={\`svg-icon \${className}\`} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" /><polyline points="16 17 21 12 16 7" /><line x1="21" y1="12" x2="9" y2="12" />
      </svg>
    )
  };
  return icons[name] || null;
}
`;
fs.writeFileSync(path.join(__dirname, 'apps/frontend/src/components/Icon.jsx'), iconContent, 'utf8');

// 3. Nuevo Componente: DashboardView.jsx (Gestor de Métricas y KPIs)
const dashboardViewContent = `import React, { useState, useEffect } from 'react';

const INITIAL_KPIS = [
  { id: '1', title: 'Cobertura de Cobertura de Código (Tests)', projectType: 'Software', current: 85, target: 100, unit: '%' },
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
    border: \`1px solid \${bgImage ? 'rgba(255,255,255,0.15)' : '#e2e8f0'}\`,
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

      {/* Modal Crear KPI */}
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

      {/* Grilla de Métricas */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 20 }}>
        {kpis.map(k => {
          const pct = Math.min(100, Math.round((k.current / k.target) * 100)) || 0;
          return (
            <div key={k.id} style={cardStyle} className="interactive-card">
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

              {/* Barra de Alcance */}
              <div style={{ background: bgImage ? 'rgba(255,255,255,0.1)' : '#f1f5f9', height: 10, borderRadius: 5, overflow: 'hidden', marginBottom: 10 }}>
                <div style={{ background: pct >= 100 ? '#10b981' : pct >= 50 ? '#3b82f6' : '#f59e0b', width: \`\${pct}%\`, height: '100%', transition: 'width 0.3s' }} />
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
`;
fs.writeFileSync(path.join(__dirname, 'apps/frontend/src/features/dashboard/DashboardView.jsx'), dashboardViewContent, 'utf8');

// 4. Sidebar.jsx con Navegación al Nuevo Módulo
const sidebarContent = `import React, { useState } from 'react';
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
      justifyContent: 'space-between', 
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
            { id: 'dashboard', label: t.navDashboard, icon: 'dashboard' },
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
fs.writeFileSync(path.join(__dirname, 'apps/frontend/src/components/Sidebar.jsx'), sidebarContent, 'utf8');

// 5. Header.jsx Adaptable a Fondo Transparente
const headerContent = `import React from 'react';
import { translations } from '../services/i18n';

export default function Header({ activeTab, lang, bgImage }) {
  const t = translations[lang] || translations.es;
  const titles = {
    horario: t.scheduleTitle,
    kanban: t.kanbanTitle,
    calendario: t.calendarTitle,
    proyectos: t.projectsTitle,
    dashboard: t.dashboardTitle,
  };

  return (
    <header style={{ 
      padding: '15px 30px', 
      background: bgImage ? 'rgba(15, 23, 42, 0.65)' : '#ffffff', 
      backdropFilter: bgImage ? 'blur(10px)' : 'none',
      borderBottom: \`1px solid \${bgImage ? 'rgba(255,255,255,0.1)' : '#e2e8f0'}\`, 
      display: 'flex', 
      justifyContent: 'space-between', 
      alignItems: 'center' 
    }}>
      <h2 style={{ margin: 0, fontSize: 18, fontWeight: 700, color: bgImage ? '#ffffff' : '#0f172a' }}>
        {titles[activeTab] || t.title}
      </h2>
      <span style={{ background: '#dcfce7', color: '#166534', padding: '4px 12px', borderRadius: 20, fontSize: 12, fontWeight: 600 }}>
        {t.verifiedSession}
      </span>
    </header>
  );
}
`;
fs.writeFileSync(path.join(__dirname, 'apps/frontend/src/components/Header.jsx'), headerContent, 'utf8');

// 6. App.jsx Router Actualizado
const appJsxContent = `import React, { useState } from 'react';
import LoginForm from './features/auth/LoginForm';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import ScheduleView from './features/schedule/ScheduleView';
import KanbanView from './features/kanban/KanbanView';
import CalendarView from './features/calendar/CalendarView';
import ProjectsView from './features/projects/ProjectsView';
import DashboardView from './features/dashboard/DashboardView';

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
            {activeTab === 'dashboard' && <DashboardView lang={lang} bgImage={bgImage} />}
          </div>
        </main>
      </div>
    </div>
  );
}
`;
fs.writeFileSync(path.join(__dirname, 'apps/frontend/src/App.jsx'), appJsxContent, 'utf8');

console.log('✅ Interfaz Glassmorphic global y Módulo de Dashboard & KPIs integrados con éxito.');