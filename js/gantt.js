(function initProjectsModule() {
  let projects = JSON.parse(localStorage.getItem('user_projects_data')) || [
    {
      id: 'proj-1',
      name: 'Proyecto de Titulación (Capstone)',
      description: 'Desarrollo del software base, documentación de arquitectura e informe final.',
      phase: '2. En Desarrollo / Ejecución',
      progress: 45,
      startDate: '2026-08-01',
      deadline: '2026-11-30'
    },
    {
      id: 'proj-2',
      name: 'Rediseño T.o.p.s Flow',
      description: 'Implementación del sistema modular y motor de temas personalizados.',
      phase: '3. Pruebas & Ajustes',
      progress: 85,
      startDate: '2026-08-10',
      deadline: '2026-08-25'
    }
  ];

  function renderProjects() {
    const container = document.getElementById('projects-container');
    if (!container) return;

    container.innerHTML = '';

    if (projects.length === 0) {
      container.innerHTML = `
        <div class="card-placeholder" style="grid-column: 1 / -1; text-align: center;">
          <p>No tienes proyectos registrados. ¡Haz clic en "Nuevo Proyecto" para comenzar!</p>
        </div>
      `;
    } else {
      projects.forEach(proj => {
        const card = createProjectCard(proj);
        container.appendChild(card);
      });
    }

    updateGlobalStats();
    saveToStorage();
    if (window.lucide) lucide.createIcons();
  }

  function createProjectCard(proj) {
    const div = document.createElement('div');
    div.className = 'project-card';
    div.onclick = () => openProjectModal(proj.id);

    div.innerHTML = `
      <div>
        <div class="project-card-header">
          <h3 class="project-card-title">${proj.name}</h3>
          <span class="phase-badge">${proj.phase}</span>
        </div>
        <p class="project-desc-text" style="margin-top: 8px;">${proj.description || 'Sin descripción.'}</p>
      </div>

      <div class="progress-container">
        <div class="progress-header">
          <span>Progreso de Fase</span>
          <span>${proj.progress}%</span>
        </div>
        <div class="progress-track">
          <div class="progress-fill" style="width: ${proj.progress}%;"></div>
        </div>
      </div>

      <div class="project-card-footer">
        <div class="date-indicator">
          <i data-lucide="calendar"></i>
          <span>Entrega: ${proj.deadline}</span>
        </div>
        <i data-lucide="chevron-right"></i>
      </div>
    `;

    return div;
  }

  function updateGlobalStats() {
    const activeEl = document.getElementById('proj-stat-active');
    const progressEl = document.getElementById('proj-stat-progress');
    const doneEl = document.getElementById('proj-stat-done');

    if (!activeEl) return;

    const total = projects.length;
    const completed = projects.filter(p => p.progress === 100 || p.phase.includes('Finalizado')).length;
    const avgProgress = total > 0 ? Math.round(projects.reduce((acc, p) => acc + Number(p.progress), 0) / total) : 0;

    activeEl.textContent = total - completed;
    progressEl.textContent = `${avgProgress}%`;
    doneEl.textContent = completed;
  }

  window.openProjectModal = function(id = null) {
    const modal = document.getElementById('project-modal');
    const form = document.getElementById('project-form');
    const titleEl = document.getElementById('modal-project-title');
    const btnDelete = document.getElementById('btn-delete-project');

    form.reset();

    if (id) {
      const proj = projects.find(p => p.id === id);
      if (!proj) return;

      document.getElementById('project-id').value = proj.id;
      document.getElementById('project-name').value = proj.name;
      document.getElementById('project-desc').value = proj.description || '';
      document.getElementById('project-phase').value = proj.phase;
      document.getElementById('project-progress').value = proj.progress;
      document.getElementById('project-start').value = proj.startDate;
      document.getElementById('project-deadline').value = proj.deadline;

      titleEl.innerHTML = `<i data-lucide="edit-3"></i> Editar Proyecto`;
      btnDelete.style.display = 'inline-flex';
    } else {
      document.getElementById('project-id').value = '';
      titleEl.innerHTML = `<i data-lucide="folder-plus"></i> Nuevo Proyecto`;
      btnDelete.style.display = 'none';
      
      // Fecha sugerida por defecto
      const today = new Date().toISOString().split('T')[0];
      document.getElementById('project-start').value = today;
      document.getElementById('project-deadline').value = today;
    }

    modal.classList.add('active');
    if (window.lucide) lucide.createIcons();
  };

  window.closeProjectModal = function() {
    document.getElementById('project-modal').classList.remove('active');
  };

  window.handleSaveProject = function(e) {
    e.preventDefault();
    const id = document.getElementById('project-id').value;
    const name = document.getElementById('project-name').value.trim();
    const description = document.getElementById('project-desc').value.trim();
    const phase = document.getElementById('project-phase').value;
    const progress = Math.min(100, Math.max(0, parseInt(document.getElementById('project-progress').value) || 0));
    const startDate = document.getElementById('project-start').value;
    const deadline = document.getElementById('project-deadline').value;

    if (id) {
      const proj = projects.find(p => p.id === id);
      if (proj) {
        Object.assign(proj, { name, description, phase, progress, startDate, deadline });
      }
    } else {
      projects.push({
        id: `proj-${Date.now()}`,
        name,
        description,
        phase,
        progress,
        startDate,
        deadline
      });
    }

    renderProjects();
    closeProjectModal();
  };

  window.handleDeleteProject = function() {
    const id = document.getElementById('project-id').value;
    if (id && confirm("¿Seguro que deseas eliminar este proyecto?")) {
      projects = projects.filter(p => p.id !== id);
      renderProjects();
      closeProjectModal();
    }
  };

  function saveToStorage() {
    localStorage.setItem('user_projects_data', JSON.stringify(projects));
  }

  // Inicializar
  renderProjects();
})();