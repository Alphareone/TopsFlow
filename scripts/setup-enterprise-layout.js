const fs = require('fs');
const path = require('path');

// 1. IconRail + Submenu Layout (SidebarEnterprise.jsx)
const sidebarEnterpriseContent = `import React, { useState } from 'react';
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
  ];

  const subMenus = {
    horario: [
      { id: 'horario', label: t.navHorario },
    ],
    kanban: [
      { id: 'kanban', label: t.navKanban },
    ],
    calendario: [
      { id: 'calendario', label: t.navCalendario },
    ],
    proyectos: [
      { id: 'proyectos', label: t.navProyectos },
    ],
    dashboard: [
      { id: 'dashboard', label: t.navDashboard },
    ]
  };

  const handleApplyBg = () => {
    if (!inputUrl) return;
    setBgImage(inputUrl);
    localStorage.setItem('topsflow_bg_image', inputUrl);
    setInputUrl('');
  };

  return (
    <aside style={{ display: 'flex', height: '100vh', zIndex: 20 }}>
      {/* 1. ICON RAIL ULTRACOMPACTO (IZQUIERDA) */}
      <div style={{
        width: 60,
        background: '#090d16',
        borderRight: '1px solid rgba(255,255,255,0.1)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: '15px 0',
        justifyContent: 'space-between'
      }}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 15 }}>
          <div style={{ background: '#2563eb', color: '#fff', width: 36, height: 36, borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>
            <Icon name="bolt" size={22} />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 10 }}>
            {railItems.map(item => (
              <button
                key={item.id}
                onClick={() => { setActiveRail(item.id); setActiveTab(item.id); }}
                title={item.label}
                style={{
                  width: 42,
                  height: 42,
                  borderRadius: 10,
                  border: 'none',
                  background: activeRail === item.id ? '#2563eb' : 'transparent',
                  color: activeRail === item.id ? '#fff' : '#94a3b8',
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

        <button onClick={onLogout} title={t.logout} style={{ width: 38, height: 38, borderRadius: 10, border: 'none', background: 'rgba(239, 68, 68, 0.2)', color: '#ef4444', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Icon name="logout" size={18} />
        </button>
      </div>

      {/* 2. SUBMENÚ CONTEXTUAL EXTENDIDO */}
      <div style={{
        width: 210,
        background: bgImage ? 'rgba(15, 23, 42, 0.85)' : '#0f172a',
        backdropFilter: bgImage ? 'blur(12px)' : 'none',
        borderRight: '1px solid rgba(255,255,255,0.1)',
        padding: 20,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        color: '#fff'
      }}>
        <div>
          <h3 style={{ margin: '0 0 15px 0', fontSize: 15, fontWeight: 700, textTransform: 'capitalize' }}>
            {activeRail}
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            {(subMenus[activeRail] || []).map(sub => (
              <button
                key={sub.id}
                onClick={() => setActiveTab(sub.id)}
                style={{
                  padding: '8px 12px',
                  borderRadius: 6,
                  border: 'none',
                  background: activeTab === sub.id ? 'rgba(37,99,235,0.25)' : 'transparent',
                  color: activeTab === sub.id ? '#60a5fa' : '#cbd5e1',
                  textAlign: 'left',
                  cursor: 'pointer',
                  fontSize: 13,
                  fontWeight: activeTab === sub.id ? 600 : 400
                }}
              >
                {sub.label}
              </button>
            ))}
          </div>
        </div>

        {/* AJUSTES RÁPIDOS */}
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
fs.writeFileSync(path.join(__dirname, 'apps/frontend/src/components/SidebarEnterprise.jsx'), sidebarEnterpriseContent, 'utf8');

// 2. Top Header con Pestañas Recientes (HeaderEnterprise.jsx)
const headerEnterpriseContent = `import React from 'react';
import { translations } from '../services/i18n';

export default function HeaderEnterprise({ activeTab, setActiveTab, lang, bgImage }) {
  const t = translations[lang] || translations.es;

  const recentTabs = [
    { id: 'horario', label: t.navHorario },
    { id: 'kanban', label: t.navKanban },
    { id: 'calendario', label: t.navCalendario },
    { id: 'proyectos', label: t.navProyectos },
    { id: 'dashboard', label: t.navDashboard },
  ];

  return (
    <header style={{
      background: bgImage ? 'rgba(15, 23, 42, 0.8)' : '#0f172a',
      backdropFilter: bgImage ? 'blur(10px)' : 'none',
      borderBottom: '1px solid rgba(255,255,255,0.1)',
      padding: '8px 20px',
      display: 'flex',
      alignItems: 'center',
      justify: 'space-between',
      color: '#fff'
    }}>
      {/* Pestañas estilo Navegador / ERP */}
      <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
        <span style={{ fontSize: 11, color: '#94a3b8', marginRight: 10, fontWeight: 600 }}>Recientes:</span>
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
              fontSize: 12,
              cursor: 'pointer',
              fontWeight: activeTab === tab.id ? 600 : 400,
              transition: 'all 0.2s'
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
fs.writeFileSync(path.join(__dirname, 'apps/frontend/src/components/HeaderEnterprise.jsx'), headerEnterpriseContent, 'utf8');

// 3. Panel Lateral Derecho Inspector / Detail Drawer (InspectorDrawer.jsx)
const drawerContent = `import React from 'react';

export default function InspectorDrawer({ bgImage }) {
  return (
    <aside style={{
      width: 300,
      background: bgImage ? 'rgba(15, 23, 42, 0.75)' : '#ffffff',
      backdropFilter: bgImage ? 'blur(12px)' : 'none',
      color: bgImage ? '#ffffff' : '#1e293b',
      borderLeft: \`1px solid \${bgImage ? 'rgba(255,255,255,0.15)' : '#e2e8f0'}\`,
      padding: 20,
      display: 'flex',
      flexDirection: 'column',
      gap: 20,
      overflowY: 'auto'
    }}>
      <div>
        <h4 style={{ margin: '0 0 10px 0', fontSize: 14 }}>📌 Resumen del Proyecto</h4>
        <div style={{ background: bgImage ? 'rgba(255,255,255,0.05)' : '#f8fafc', padding: 12, borderRadius: 8, border: '1px solid rgba(0,0,0,0.05)' }}>
          <span style={{ fontSize: 10, fontWeight: 700, color: '#3b82f6' }}>COMPROMISO ACTIVO</span>
          <h5 style={{ margin: '4px 0', fontSize: 13 }}>Capstone Enterprise v2.0</h5>
          <p style={{ margin: 0, fontSize: 11, opacity: 0.7 }}>Avance global de entregables al 85%.</p>
        </div>
      </div>

      <div>
        <h4 style={{ margin: '0 0 10px 0', fontSize: 14 }}>⏱️ Horas & Asistencia</h4>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 10, textAlign: 'center' }}>
          <div style={{ background: bgImage ? 'rgba(255,255,255,0.05)' : '#f1f5f9', padding: 10, borderRadius: 6 }}>
            <div style={{ fontSize: 16, fontWeight: 700 }}>24 hrs</div>
            <span style={{ fontSize: 9, opacity: 0.7 }}>Registradas</span>
          </div>
          <div style={{ background: bgImage ? 'rgba(255,255,255,0.05)' : '#f1f5f9', padding: 10, borderRadius: 6 }}>
            <div style={{ fontSize: 16, fontWeight: 700 }}>100%</div>
            <span style={{ fontSize: 9, opacity: 0.7 }}>Cumplimiento</span>
          </div>
        </div>
      </div>

      <div>
        <h4 style={{ margin: '0 0 10px 0', fontSize: 14 }}>👥 Equipo de Trabajo</h4>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {['Alex (Lead Dev)', 'Dev (Backend)', 'UI/UX Designer'].map((user, idx) => (
            <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 12 }}>
              <div style={{ width: 24, height: 24, borderRadius: '50%', background: '#2563eb', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, fontWeight: 'bold' }}>
                {user[0]}
              </div>
              <span>{user}</span>
            </div>
          ))}
        </div>
      </div>
    </aside>
  );
}
`;
fs.writeFileSync(path.join(__dirname, 'apps/frontend/src/components/InspectorDrawer.jsx'), drawerContent, 'utf8');

// 4. Integrar todo en App.jsx
const appJsxEnterprise = `import React, { useState } from 'react';
import LoginForm from './features/auth/LoginForm';
import SidebarEnterprise from './components/SidebarEnterprise';
import HeaderEnterprise from './components/HeaderEnterprise';
import InspectorDrawer from './components/InspectorDrawer';
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
            </main>

            {/* Panel Lateral Inspector (Derecha) estilo ERP */}
            <InspectorDrawer bgImage={bgImage} />
          </div>
        </div>
      </div>
    </div>
  );
}
`;
fs.writeFileSync(path.join(__dirname, 'apps/frontend/src/App.jsx'), appJsxEnterprise, 'utf8');

console.log('✅ Layout ERP Enterprise integrado (Icon Rail + Pestañas Recientes + Inspector Drawer).');