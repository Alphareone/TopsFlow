// VALORES POR DEFECTO MODO PERSONALIZADO
const DEFAULT_CUSTOM_COLORS = {
  bgMain: '#111827',
  bgSidebar: '#1f2937',
  accent: '#3b82f6',
  text: '#f3f4f6'
};

let customTheme = JSON.parse(localStorage.getItem('user_custom_colors_v1')) || { ...DEFAULT_CUSTOM_COLORS };

document.addEventListener('DOMContentLoaded', () => {
  initTabNavigation();
  initThemeEngine();
});

/* ==========================================================================
   1. ROUTER Y CARGADOR DINÁMICO DE MÓDULOS
   ========================================================================== */

function initTabNavigation() {
  const tabs = document.querySelectorAll('.nav-tab');

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const moduleName = tab.dataset.module;

      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');

      loadModule(moduleName);
      localStorage.setItem('active_module_v1', moduleName);
    });
  });

  const savedModule = localStorage.getItem('active_module_v1') || 'horario';
  const tabToActivate = document.querySelector(`.nav-tab[data-module="${savedModule}"]`);
  if (tabToActivate) tabToActivate.click();
}

async function loadModule(moduleName) {
  const contentArea = document.getElementById('main-content');
  
  try {
    // 1. Cargar HTML del módulo
    const response = await fetch(`./modules/${moduleName}.html`);
    if (!response.ok) throw new Error(`Módulo ${moduleName} no encontrado`);
    const html = await response.text();
    contentArea.innerHTML = html;

    // 2. Inyectar CSS si aún no existe
    if (!document.getElementById(`css-${moduleName}`)) {
      const link = document.createElement('link');
      link.id = `css-${moduleName}`;
      link.rel = 'stylesheet';
      link.href = `./css/${moduleName}.css`;
      document.head.appendChild(link);
    }

    // 3. Inyectar JS dinámicamente
    const oldScript = document.getElementById(`js-${moduleName}`);
    if (oldScript) oldScript.remove(); // Reemplazar script anterior para reinicializar

    const script = document.createElement('script');
    script.id = `js-${moduleName}`;
    script.src = `./js/${moduleName}.js`;
    document.body.appendChild(script);

    // Re-renderizar iconos de Lucide
    if (window.lucide) lucide.createIcons();

  } catch (error) {
    console.error(`Error al cargar el módulo ${moduleName}:`, error);
    contentArea.innerHTML = `<div class="card-placeholder"><p>Error al cargar el módulo ${moduleName}. Verifique la ruta.</p></div>`;
  }
}

/* ==========================================================================
   2. MOTOR DE TEMAS
   ========================================================================== */

function initThemeEngine() {
  const themeSelect = document.getElementById('theme-selector');
  const savedTheme = localStorage.getItem('user_theme_mode_v1') || 'light';

  themeSelect.value = savedTheme;
  applyTheme(savedTheme);

  themeSelect.addEventListener('change', (e) => applyTheme(e.target.value));
  setupColorPickerModal();
}

function applyTheme(mode) {
  const root = document.documentElement;
  const btnCustomTheme = document.getElementById('btn-custom-theme');

  if (mode !== 'custom') {
    root.style.removeProperty('--bg-main');
    root.style.removeProperty('--bg-sidebar');
    root.style.removeProperty('--bg-card');
    root.style.removeProperty('--accent-primary');
    root.style.removeProperty('--accent-glow');
    root.style.removeProperty('--text-primary');

    root.setAttribute('data-theme', mode);
    if (btnCustomTheme) btnCustomTheme.style.display = 'none';
  } else {
    root.setAttribute('data-theme', 'custom');
    applyCustomColors(customTheme);
    if (btnCustomTheme) btnCustomTheme.style.display = 'flex';
  }

  localStorage.setItem('user_theme_mode_v1', mode);
}

function applyCustomColors(theme) {
  const root = document.documentElement;
  root.style.setProperty('--bg-main', theme.bgMain);
  root.style.setProperty('--bg-sidebar', theme.bgSidebar);
  root.style.setProperty('--bg-card', theme.bgSidebar);
  root.style.setProperty('--accent-primary', theme.accent);
  root.style.setProperty('--accent-glow', `${theme.accent}40`);
  root.style.setProperty('--text-primary', theme.text);

  localStorage.setItem('user_custom_colors_v1', JSON.stringify(theme));
}

function setupColorPickerModal() {
  const modal = document.getElementById('color-modal-overlay');
  const btnOpen = document.getElementById('btn-custom-theme');
  const btnClose = document.getElementById('btn-close-color-modal');
  const btnReset = document.getElementById('btn-reset-colors');

  const pMain = document.getElementById('picker-bg-main');
  const pSidebar = document.getElementById('picker-bg-sidebar');
  const pAccent = document.getElementById('picker-accent');
  const pText = document.getElementById('picker-text');

  const syncPickerValues = () => {
    pMain.value = customTheme.bgMain;
    pSidebar.value = customTheme.bgSidebar;
    pAccent.value = customTheme.accent;
    pText.value = customTheme.text;
  };

  syncPickerValues();

  btnOpen.addEventListener('click', () => {
    syncPickerValues();
    modal.classList.add('active');
  });

  btnClose.addEventListener('click', () => modal.classList.remove('active'));

  const updateRealtime = () => {
    customTheme = {
      bgMain: pMain.value,
      bgSidebar: pSidebar.value,
      accent: pAccent.value,
      text: pText.value
    };
    applyCustomColors(customTheme);
  };

  pMain.addEventListener('input', updateRealtime);
  pSidebar.addEventListener('input', updateRealtime);
  pAccent.addEventListener('input', updateRealtime);
  pText.addEventListener('input', updateRealtime);

  btnReset.addEventListener('click', () => {
    customTheme = { ...DEFAULT_CUSTOM_COLORS };
    syncPickerValues();
    applyCustomColors(customTheme);
  });
}
