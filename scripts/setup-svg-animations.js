const fs = require('fs');
const path = require('path');

// 1. Estilos Globales con Animaciones y Variables SVG (styles.css)
const globalStylesContent = `
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');

:root {
  --primary: #3b82f6;
  --primary-glow: rgba(59, 130, 246, 0.35);
  --success: #10b981;
  --warning: #f59e0b;
  --danger: #ef4444;
  --transition-fast: 0.2s cubic-bezier(0.4, 0, 0.2, 1);
}

body {
  margin: 0;
  font-family: 'Inter', system-ui, -apple-system, sans-serif;
  -webkit-font-smoothing: antialiased;
}

/* Efectos de animación para íconos SVG */
.svg-icon {
  width: 18px;
  height: 18px;
  stroke-width: 2;
  stroke: currentColor;
  fill: none;
  stroke-linecap: round;
  stroke-linejoin: round;
  transition: transform var(--transition-fast), stroke var(--transition-fast);
}

/* Animación Hover en la Barra Lateral */
.nav-item-btn {
  display: flex;
  align-items: center;
  gap: 12px;
  width: 100%;
  padding: 10px 14px;
  border-radius: 8px;
  border: 1px solid transparent;
  background: transparent;
  cursor: pointer;
  font-size: 13px;
  font-weight: 500;
  transition: all var(--transition-fast);
}

.nav-item-btn:hover {
  background: rgba(59, 130, 246, 0.08);
  transform: translateX(4px);
}

.nav-item-btn:hover .svg-icon {
  transform: scale(1.15) rotate(-4deg);
  filter: drop-shadow(0 0 6px var(--primary-glow));
}

.nav-item-btn.active {
  background: var(--primary);
  color: #ffffff !important;
  box-shadow: 0 4px 14px var(--primary-glow);
}

.nav-item-btn.active .svg-icon {
  stroke: #ffffff;
}

/* Tarjetas con elevación y micro-interacción */
.interactive-card {
  transition: transform var(--transition-fast), box-shadow var(--transition-fast), border-color var(--transition-fast);
}

.interactive-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.08);
}
`;

fs.writeFileSync(path.join(__dirname, 'apps/frontend/src/styles/global.css'), globalStylesContent, 'utf8');

// 2. Componente de Íconos SVG Vectoriales (Icon.jsx)
const iconComponentContent = `import React from 'react';

export default function Icon({ name, className = '', color = 'currentColor', size = 18 }) {
  const icons = {
    horario: (
      <svg className={\`svg-icon \${className}\`} width={size} height={size} viewBox="0 0 24 24">
        <circle cx="12" cy="12" r="10" />
        <polyline points="12 6 12 12 16 14" />
      </svg>
    ),
    kanban: (
      <svg className={\`svg-icon \${className}\`} width={size} height={size} viewBox="0 0 24 24">
        <rect x="3" y="3" width="18" height="18" rx="2" />
        <path d="M8 7v10M12 7v6M16 7v9" />
      </svg>
    ),
    calendario: (
      <svg className={\`svg-icon \${className}\`} width={size} height={size} viewBox="0 0 24 24">
        <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
        <line x1="16" y1="2" x2="16" y2="6" />
        <line x1="8" y1="2" x2="8" y2="6" />
        <line x1="3" y1="10" x2="21" y2="10" />
      </svg>
    ),
    proyectos: (
      <svg className={\`svg-icon \${className}\`} width={size} height={size} viewBox="0 0 24 24">
        <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
      </svg>
    ),
    bolt: (
      <svg className={\`svg-icon \${className}\`} width={size} height={size} viewBox="0 0 24 24">
        <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
      </svg>
    ),
    logout: (
      <svg className={\`svg-icon \${className}\`} width={size} height={size} viewBox="0 0 24 24">
        <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
        <polyline points="16 17 21 12 16 7" />
        <line x1="21" y1="12" x2="9" y2="12" />
      </svg>
    ),
    theme: (
      <svg className={\`svg-icon \${className}\`} width={size} height={size} viewBox="0 0 24 24">
        <circle cx="12" cy="12" r="5" />
        <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
      </svg>
    ),
    trash: (
      <svg className={\`svg-icon \${className}\`} width={size} height={size} viewBox="0 0 24 24">
        <polyline points="3 6 5 6 21 6" />
        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
      </svg>
    ),
    plus: (
      <svg className={\`svg-icon \${className}\`} width={size} height={size} viewBox="0 0 24 24">
        <line x1="12" y1="5" x2="12" y2="19" />
        <line x1="5" y1="12" x2="19" y2="12" />
      </svg>
    )
  };

  return icons[name] || null;
}
`;

fs.writeFileSync(path.join(__dirname, 'apps/frontend/src/components/Icon.jsx'), iconComponentContent, 'utf8');

// 3. Sidebar con Iconografía SVG Animada (Sidebar.jsx)
const sidebarSVGContent = `import React from 'react';
import Icon from './Icon';

export default function Sidebar({ activeTab, setActiveTab, onLogout, theme, setTheme }) {
  const getThemeStyles = () => {
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
    <aside style={{ width: 250, background: styles.sidebarBg, borderRight: \`1px solid \${styles.border}\`, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', padding: '20px 15px' }}>
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 25, paddingLeft: 5 }}>
          <div style={{ background: styles.accent, color: '#fff', width: 32, height: 32, borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 12px rgba(37,99,235,0.3)' }}>
            <Icon name="bolt" size={20} />
          </div>
          <div>
            <h3 style={{ margin: 0, fontSize: 16, fontWeight: 700, color: styles.text }}>T.o.p.s Flow</h3>
            <span style={{ fontSize: 10, color: styles.textMuted }}>Organiza & Optimiza</span>
          </div>
        </div>

        <nav style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          {[
            { id: 'horario', label: '1. Gestión Horario', icon: 'horario' },
            { id: 'kanban', label: '2. Gestión Ágil (Kanban)', icon: 'kanban' },
            { id: 'calendario', label: '3. Calendario', icon: 'calendario' },
            { id: 'proyectos', label: '4. Proyectos', icon: 'proyectos' },
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

      <div>
        <button onClick={onLogout} style={{ width: '100%', padding: '10px 12px', background: '#ef4444', color: '#fff', border: 'none', borderRadius: 8, cursor: 'pointer', marginBottom: 15, fontWeight: 600, fontSize: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, transition: 'background 0.2s' }}>
          <Icon name="logout" size={16} />
          <span>Cerrar Sesión</span>
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <Icon name="theme" size={16} color={styles.textMuted} />
          <select value={theme} onChange={e => setTheme(e.target.value)} style={{ flex: 1, padding: 6, borderRadius: 6, border: \`1px solid \${styles.border}\`, background: '#fff', color: '#000', fontSize: 11 }}>
            <option value="Claro (Base)">Claro (Base)</option>
            <option value="Oscuro">Oscuro</option>
            <option value="Vintage">Vintage</option>
            <option value="Pastel">Pastel</option>
            <option value="Ocean">Ocean</option>
          </select>
        </div>
      </div>
    </aside>
  );
}
`;

fs.writeFileSync(path.join(__dirname, 'apps/frontend/src/components/Sidebar.jsx'), sidebarSVGContent, 'utf8');

// 4. Actualizar main.jsx para importar los estilos globales
const mainJsxContent = `import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './styles/global.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
`;

fs.writeFileSync(path.join(__dirname, 'apps/frontend/src/main.jsx'), mainJsxContent, 'utf8');

console.log('✅ Sistema actualizado con íconos SVG vectoriales, transiciones CSS y micro-animaciones.');