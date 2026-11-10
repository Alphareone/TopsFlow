const fs = require('fs');
const path = require('path');

// 1. Crear carpetas de arquitectura modular en el Frontend
const frontendDirs = [
  'apps/frontend/src/components',
  'apps/frontend/src/features/auth',
  'apps/frontend/src/features/schedule',
  'apps/frontend/src/features/kanban',
  'apps/frontend/src/features/projects',
  'apps/frontend/src/features/calendar',
  'apps/frontend/src/services',
  'apps/frontend/src/styles',
  'scripts'
];

frontendDirs.forEach(dir => {
  const fullPath = path.join(__dirname, dir);
  if (!fs.existsSync(fullPath)) {
    fs.mkdirSync(fullPath, { recursive: true });
  }
});

// 2. Mover o archivar scripts temporales de parche a scripts/
const filesInRoot = fs.readdirSync(__dirname);
filesInRoot.forEach(file => {
  if ((file.startsWith('fix-') || file.startsWith('setup-')) && file.endsWith('.js')) {
    const oldPath = path.join(__dirname, file);
    const newPath = path.join(__dirname, 'scripts', file);
    fs.renameSync(oldPath, newPath);
  }
});

// 3. Crear Servicio HTTP Centralizado en Frontend
const apiServiceContent = `import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:4000/api',
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = \`Bearer \${token}\`;
  }
  return config;
});

export default api;
`;
fs.writeFileSync(path.join(__dirname, 'apps/frontend/src/services/api.js'), apiServiceContent, 'utf8');

// 4. Crear estructura limpia de App.jsx con imports modulares
const modularAppJsx = `import React, { useState } from 'react';
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

  const logoutUser = () => {
    localStorage.removeItem('token');
    setAuthToken('');
  };

  if (!authToken) {
    return <LoginForm onLoginSuccess={(token) => setAuthToken(token)} />;
  }

  return (
    <div className={\`app-container theme-\${theme.toLowerCase()}\`} style={{ display: 'flex', height: '100vh', fontFamily: 'Inter, sans-serif' }}>
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} onLogout={logoutUser} theme={theme} setTheme={setTheme} />
      <main style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        <Header activeTab={activeTab} />
        <div style={{ flex: 1, padding: 20, overflowY: 'auto' }}>
          {activeTab === 'horario' && <ScheduleView />}
          {activeTab === 'kanban' && <KanbanView />}
          {activeTab === 'calendario' && <CalendarView />}
          {activeTab === 'proyectos' && <ProjectsView />}
        </div>
      </main>
    </div>
  );
}
`;

fs.writeFileSync(path.join(__dirname, 'apps/frontend/src/App.jsx'), modularAppJsx, 'utf8');
console.log('✅ Arquitectura reorganizada: Scripts temporales agrupados en /scripts y Frontend estructurado en módulos.');