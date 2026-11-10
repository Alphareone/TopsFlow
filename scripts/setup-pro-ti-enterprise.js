const fs = require('fs');
const path = require('path');

// 1. Crear directorios para los nuevos módulos TI
const tiDirs = [
  'apps/frontend/src/features/architecture',
  'apps/frontend/src/features/cicd',
  'apps/frontend/src/features/portal'
];

tiDirs.forEach(dir => {
  const fullPath = path.join(__dirname, dir);
  if (!fs.existsSync(fullPath)) {
    fs.mkdirSync(fullPath, { recursive: true });
  }
});

// 2. Diccionario de Idiomas TI Expandido (i18n.js)
const i18nContent = `export const translations = {
  es: {
    title: 'T.o.p.s Flow',
    subtitle: 'Enterprise Engineering Suite',
    navHorario: '1. Planificación Horario',
    navKanban: '2. Tablero Ágil (Sprint)',
    navCalendario: '3. Roadmap & Hitos',
    navProyectos: '4. Gestión de Proyectos',
    navDashboard: '5. Dashboard de Alcances & KPIs',
    navArch: '6. Arquitectura & Stack',
    navCicd: '7. Pipeline CI/CD & QA',
    navPortal: '8. Portal Developer & Guías',
    logout: 'Cerrar Sesión',
    themeLabel: '🎨 Tema',
    langLabel: '🌐 Idioma',
    bgCustomLabel: '🖼️ Fondo Personalizado',
    bgUrlPlaceholder: 'URL de imagen de fondo...',
    applyBg: 'Aplicar Fondo',
    removeBg: 'Quitar Fondo',
    verifiedSession: '🔒 Entorno de Ingeniería Verificado (2FA)',
  },
  en: {
    title: 'T.o.p.s Flow',
    subtitle: 'Enterprise Engineering Suite',
    navHorario: '1. Schedule Planner',
    navKanban: '2. Agile Sprint Board',
    navCalendario: '3. Roadmap & Milestones',
    navProyectos: '4. Project Management',
    navDashboard: '5. Scope KPIs & Metrics',
    navArch: '6. Stack & Architecture',
    navCicd: '7. CI/CD & QA Pipelines',
    navPortal: '8. Developer Portal & Docs',
    logout: 'Log Out',
    themeLabel: '🎨 Theme',
    langLabel: '🌐 Language',
    bgCustomLabel: '🖼️ Custom Background',
    bgUrlPlaceholder: 'Background Image URL...',
    applyBg: 'Apply Background',
    removeBg: 'Remove Background',
    verifiedSession: '🔒 2FA Secured Environment',
  }
};
`;
fs.writeFileSync(path.join(__dirname, 'apps/frontend/src/services/i18n.js'), i18nContent, 'utf8');

// 3. Icon.jsx Expandido con Íconos de Ingeniería TI
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
    arch: (
      <svg className={\`svg-icon \${className}\`} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="2" width="8" height="8" rx="1" /><rect x="14" y="2" width="8" height="8" rx="1" /><rect x="8" y="14" width="8" height="8" rx="1" /><line x1="6" y1="10" x2="6" y2="18" /><line x1="6" y1="18" x2="8" y2="18" /><line x1="18" y1="10" x2="18" y2="18" /><line x1="18" y1="18" x2="16" y2="18" />
      </svg>
    ),
    cicd: (
      <svg className={\`svg-icon \${className}\`} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="16 18 22 12 16 6" /><polyline points="8 6 2 12 8 18" />
      </svg>
    ),
    portal: (
      <svg className={\`svg-icon \${className}\`} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" /><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
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

// 4. Módulo CI/CD Pipeline & Quality Assurance (CicdView.jsx)
const cicdContent = `import React from 'react';

export default function CicdView({ bgImage }) {
  const pipelines = [
    { name: 'Build & Unit Tests', status: 'Passed', duration: '1m 42s', coverage: '94%', env: 'Dev' },
    { name: 'Prisma DB Migration Check', status: 'Passed', duration: '45s', coverage: 'N/A', env: 'Staging' },
    { name: 'Docker Security Scan', status: 'Passed', duration: '2m 10s', coverage: '100%', env: 'Staging' },
    { name: 'Production E2E Tests', status: 'Running', duration: '3m 05s', coverage: '88%', env: 'Prod' }
  ];

  const cardStyle = {
    background: bgImage ? 'rgba(15, 23, 42, 0.75)' : '#ffffff',
    color: bgImage ? '#ffffff' : '#1e293b',
    backdropFilter: bgImage ? 'blur(12px)' : 'none',
    border: \`1px solid \${bgImage ? 'rgba(255,255,255,0.15)' : '#e2e8f0'}\`,
    borderRadius: 12,
    padding: 20,
    marginBottom: 20
  };

  return (
    <div>
      <div style={{ marginBottom: 20 }}>
        <h3 style={{ margin: 0, fontSize: 20, color: bgImage ? '#fff' : '#0f172a' }}>🧪 Pipeline CI/CD & Calidad de Código</h3>
        <span style={{ fontSize: 12, color: bgImage ? '#cbd5e1' : '#64748b' }}>Supervisión de despliegues automatizados y métricas de QA.</span>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 15, marginBottom: 20 }}>
        <div style={cardStyle}>
          <span style={{ fontSize: 11, color: '#3b82f6', fontWeight: 700 }}>COBERTURA GLOBAL</span>
          <div style={{ fontSize: 26, fontWeight: 700, marginTop: 4 }}>92.4%</div>
        </div>
        <div style={cardStyle}>
          <span style={{ fontSize: 11, color: '#10b981', fontWeight: 700 }}>ESTADO DE DESPLIEGUE</span>
          <div style={{ fontSize: 26, fontWeight: 700, marginTop: 4 }}>🟢 Estándar OK</div>
        </div>
        <div style={cardStyle}>
          <span style={{ fontSize: 11, color: '#f59e0b', fontWeight: 700 }}>DEUDA TÉCNICA</span>
          <div style={{ fontSize: 26, fontWeight: 700, marginTop: 4 }}>1.2 hrs</div>
        </div>
      </div>

      <div style={cardStyle}>
        <h4 style={{ margin: '0 0 15px 0' }}>⚙️ Pipelines Recientes</h4>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {pipelines.map((pipe, idx) => (
            <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: 12, background: bgImage ? 'rgba(255,255,255,0.05)' : '#f8fafc', borderRadius: 8 }}>
              <div>
                <strong style={{ fontSize: 13, display: 'block' }}>{pipe.name}</strong>
                <span style={{ fontSize: 11, opacity: 0.7 }}>Entorno: {pipe.env} • Cobertura: {pipe.coverage}</span>
              </div>
              <div style={{ textAlign: 'right' }}>
                <span style={{ 
                  background: pipe.status === 'Passed' ? '#dcfce7' : '#dbeafe', 
                  color: pipe.status === 'Passed' ? '#166534' : '#1e40af', 
                  padding: '3px 10px', borderRadius: 12, fontSize: 10, fontWeight: 700 
                }}>
                  {pipe.status}
                </span>
                <span style={{ fontSize: 11, display: 'block', marginTop: 4, opacity: 0.7 }}>{pipe.duration}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
`;
fs.writeFileSync(path.join(__dirname, 'apps/frontend/src/features/cicd/CicdView.jsx'), cicdContent, 'utf8');

// 5. Sidebar Enterprise Reestructurado (SidebarEnterprise.jsx)
const sidebarContent = `import React, { useState } from 'react';
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
`;
fs.writeFileSync(path.join(__dirname, 'apps/frontend/src/components/SidebarEnterprise.jsx'), sidebarContent, 'utf8');

// 6. Header Enterprise Actualizado (HeaderEnterprise.jsx)
const headerContent = `import React from 'react';
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
`;
fs.writeFileSync(path.join(__dirname, 'apps/frontend/src/components/HeaderEnterprise.jsx'), headerContent, 'utf8');

// 7. App.jsx Router Integrador con CI/CD
const appJsxContent = `import React, { useState } from 'react';
import LoginForm from './features/auth/LoginForm';
import SidebarEnterprise from './components/SidebarEnterprise';
import HeaderEnterprise from './components/HeaderEnterprise';
import InspectorDrawer from './components/InspectorDrawer';
import ScheduleView from './features/schedule/ScheduleView';
import KanbanView from './features/kanban/KanbanView';
import CalendarView from './features/calendar/CalendarView';
import ProjectsView from './features/projects/ProjectsView';
import DashboardView from './features/dashboard/DashboardView';
import CicdView from './features/cicd/CicdView';

export default function App() {
  const [authToken, setAuthToken] = useState(localStorage.getItem('token') || '');
  const [activeTab, setActiveTab] = useState('proyectos');
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
        flexDirection: 'column',
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
        <SidebarEnterprise 
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

        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
          <HeaderEnterprise activeTab={activeTab} setActiveTab={setActiveTab} lang={lang} bgImage={bgImage} />
          
          <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
            <main style={{ flex: 1, padding: 20, overflowY: 'auto' }}>
              {activeTab === 'horario' && <ScheduleView lang={lang} bgImage={bgImage} />}
              {activeTab === 'kanban' && <KanbanView lang={lang} bgImage={bgImage} />}
              {activeTab === 'calendario' && <CalendarView lang={lang} bgImage={bgImage} />}
              {activeTab === 'proyectos' && <ProjectsView lang={lang} bgImage={bgImage} />}
              {activeTab === 'dashboard' && <DashboardView lang={lang} bgImage={bgImage} />}
              {activeTab === 'cicd' && <CicdView lang={lang} bgImage={bgImage} />}
            </main>

            <InspectorDrawer bgImage={bgImage} />
          </div>
        </div>
      </div>
    </div>
  );
}
`;
fs.writeFileSync(path.join(__dirname, 'apps/frontend/src/App.jsx'), appJsxContent, 'utf8');

console.log('✅ Entorno TI Enterprise (CI/CD Pipeline, QA y Suite de Proyectos) configurado con éxito.');