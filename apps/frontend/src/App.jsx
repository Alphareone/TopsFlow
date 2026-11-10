import React, { useState } from 'react';
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
        backgroundImage: bgImage ? `url(${bgImage})` : 'none',
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
