(function initKanbanModule() {
  // DATOS POR DEFECTO O DESDE LOCALSTORAGE
  let kanbanCards = JSON.parse(localStorage.getItem('user_kanban_cards')) || [
    {
      id: 'card-1',
      title: 'Diseñar interfaz responsiva',
      description: 'Crear maquetación base para móviles y escritorio.',
      status: 'todo',
      priority: 'alta',
      assignee: 'Alex',
      points: 5
    },
    {
      id: 'card-2',
      title: 'Modularizar JS y CSS',
      description: 'Desglosar el proyecto en arquitectura de módulos.',
      status: 'progress',
      priority: 'urgente',
      assignee: 'Dev',
      points: 3
    },
    {
      id: 'card-3',
      title: 'Definir paletas de colores',
      description: 'Añadir soporte para 5 temas dinámicos.',
      status: 'done',
      priority: 'media',
      assignee: 'UI/UX',
      points: 2
    }
  ];

  function renderKanbanBoard() {
    const containers = {
      todo: document.getElementById('cards-todo'),
      progress: document.getElementById('cards-progress'),
      done: document.getElementById('cards-done')
    };

    if (!containers.todo) return;

    // Limpiar columnas
    Object.values(containers).forEach(container => container.innerHTML = '');

    // Generar tarjetas por etapa
    kanbanCards.forEach(card => {
      if (containers[card.status]) {
        const cardElement = createCardElement(card);
        containers[card.status].appendChild(cardElement);
      }
    });

    updateCounters();
    setupDragAndDrop();
    saveToStorage();
    if (window.lucide) lucide.createIcons();
  }

  function createCardElement(card) {
    const div = document.createElement('div');
    div.className = `kanban-card`;
    div.draggable = true;
    div.dataset.id = card.id;

    const initial = card.assignee ? card.assignee.charAt(0).toUpperCase() : '?';

    div.innerHTML = `
      <div class="card-header-tags">
        <span class="priority-tag priority-${card.priority}">${card.priority}</span>
      </div>
      <h4 class="card-title">${card.title}</h4>
      ${card.description ? `<p class="card-desc">${card.description}</p>` : ''}
      <div class="card-footer">
        <div class="card-points" title="Puntos de esfuerzo">
          <i data-lucide="zap"></i> ${card.points || 1} pts
        </div>
        <div class="card-assignee" title="Responsable: ${card.assignee || 'Sin Asignar'}">
          <span class="assignee-avatar">${initial}</span>
          <span>${card.assignee || 'S/A'}</span>
        </div>
      </div>
    `;

    // Click para editar tarjeta
    div.addEventListener('click', () => openKanbanModal(card.id));

    // Eventos Drag Start / End
    div.addEventListener('dragstart', (e) => {
      div.classList.add('dragging');
      e.dataTransfer.setData('text/plain', card.id);
    });

    div.addEventListener('dragend', () => {
      div.classList.remove('dragging');
    });

    return div;
  }

  function setupDragAndDrop() {
    const containers = document.querySelectorAll('.kanban-cards-container');

    containers.forEach(container => {
      container.addEventListener('dragover', (e) => {
        e.preventDefault();
        container.classList.add('drag-over');
      });

      container.addEventListener('dragleave', () => {
        container.classList.remove('drag-over');
      });

      container.addEventListener('drop', (e) => {
        e.preventDefault();
        container.classList.remove('drag-over');

        const cardId = e.dataTransfer.getData('text/plain');
        const targetStatus = container.parentElement.dataset.status;

        const card = kanbanCards.find(c => c.id === cardId);
        if (card && card.status !== targetStatus) {
          card.status = targetStatus;
          renderKanbanBoard();
        }
      });
    });
  }

  function updateCounters() {
    const counts = { todo: 0, progress: 0, done: 0 };
    kanbanCards.forEach(c => {
      if (counts[c.status] !== undefined) counts[c.status]++;
    });

    document.getElementById('count-todo').textContent = counts.todo;
    document.getElementById('count-progress').textContent = counts.progress;
    document.getElementById('count-done').textContent = counts.done;
  }

  // FUNCIONES DE MODAL Y GUARDADO EXPORTADAS A WINDOW
  window.openKanbanModal = function(cardId = null) {
    const modal = document.getElementById('kanban-modal');
    const form = document.getElementById('kanban-form');
    const titleEl = document.getElementById('modal-kanban-title');
    const btnDelete = document.getElementById('btn-delete-card');

    form.reset();

    if (cardId) {
      const card = kanbanCards.find(c => c.id === cardId);
      if (!card) return;

      document.getElementById('kanban-card-id').value = card.id;
      document.getElementById('kanban-title').value = card.title;
      document.getElementById('kanban-desc').value = card.description || '';
      document.getElementById('kanban-status').value = card.status;
      document.getElementById('kanban-priority').value = card.priority;
      document.getElementById('kanban-assignee').value = card.assignee || '';
      document.getElementById('kanban-points').value = card.points || 3;

      titleEl.innerHTML = `<i data-lucide="edit-3"></i> Editar Tarjeta`;
      btnDelete.style.display = 'inline-flex';
    } else {
      document.getElementById('kanban-card-id').value = '';
      titleEl.innerHTML = `<i data-lucide="plus-circle"></i> Crear Tarjeta`;
      btnDelete.style.display = 'none';
    }

    modal.classList.add('active');
    if (window.lucide) lucide.createIcons();
  };

  window.closeKanbanModal = function() {
    document.getElementById('kanban-modal').classList.remove('active');
  };

  window.handleSaveKanbanCard = function(e) {
    e.preventDefault();
    const id = document.getElementById('kanban-card-id').value;
    const title = document.getElementById('kanban-title').value.trim();
    const description = document.getElementById('kanban-desc').value.trim();
    const status = document.getElementById('kanban-status').value;
    const priority = document.getElementById('kanban-priority').value;
    const assignee = document.getElementById('kanban-assignee').value.trim();
    const points = parseInt(document.getElementById('kanban-points').value) || 1;

    if (id) {
      // Modificar existente
      const card = kanbanCards.find(c => c.id === id);
      if (card) {
        Object.assign(card, { title, description, status, priority, assignee, points });
      }
    } else {
      // Crear nueva
      kanbanCards.push({
        id: `card-${Date.now()}`,
        title,
        description,
        status,
        priority,
        assignee,
        points
      });
    }

    renderKanbanBoard();
    closeKanbanModal();
  };

  window.handleDeleteKanbanCard = function() {
    const id = document.getElementById('kanban-card-id').value;
    if (id && confirm("¿Seguro que deseas eliminar esta tarjeta del Kanban?")) {
      kanbanCards = kanbanCards.filter(c => c.id !== id);
      renderKanbanBoard();
      closeKanbanModal();
    }
  };

  function saveToStorage() {
    localStorage.setItem('user_kanban_cards', JSON.stringify(kanbanCards));
  }

  // Inicialización
  renderKanbanBoard();
})();