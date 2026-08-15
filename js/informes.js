(function initInformesModule() {
  let documents = JSON.parse(localStorage.getItem('user_drive_docs')) || [
    {
      id: 'doc-1',
      name: 'Informe Avance Capstone V1',
      url: 'https://drive.google.com',
      category: 'Informe Académico',
      date: '2026-08-12'
    },
    {
      id: 'doc-2',
      name: 'Minuta de Reunión con Cliente (Pega Lopa)',
      url: 'https://drive.google.com',
      category: 'Minuta de Reunión',
      date: '2026-08-14'
    }
  ];

  function renderDocuments() {
    const container = document.getElementById('docs-container');
    if (!container) return;

    container.innerHTML = '';

    if (documents.length === 0) {
      container.innerHTML = `
        <div class="card-placeholder" style="grid-column: 1 / -1; text-align: center;">
          <p>No tienes documentos ni informes vinculados. Haz clic en "Vincular de Drive" para agregar uno.</p>
        </div>
      `;
    } else {
      documents.forEach(doc => {
        const card = createDocCard(doc);
        container.appendChild(card);
      });
    }

    updateStats();
    saveToStorage();
    if (window.lucide) lucide.createIcons();
  }

  function createDocCard(doc) {
    const div = document.createElement('div');
    div.className = 'doc-card';

    // Determinar icono según categoría
    let iconName = 'file-text';
    if (doc.category.includes('Minuta')) iconName = 'clipboard-list';
    if (doc.category.includes('Presentación')) iconName = 'presentation';
    if (doc.category.includes('Trabajo')) iconName = 'briefcase';

    div.innerHTML = `
      <div class="doc-card-header">
        <div class="doc-type-icon">
          <i data-lucide="${iconName}"></i>
        </div>
        <div class="doc-card-info">
          <h4 class="doc-card-title">${doc.name}</h4>
          <span class="doc-category-badge">${doc.category}</span>
        </div>
      </div>

      <div class="doc-card-footer">
        <span><i data-lucide="calendar" style="width: 12px; height: 12px; display: inline; vertical-align: middle;"></i> ${doc.date}</span>
        <div class="doc-actions">
          <button class="btn-sm-icon" title="Editar Registro" onclick="openDriveModal('${doc.id}')">
            <i data-lucide="edit-3" style="width: 14px; height: 14px;"></i>
          </button>
          <a href="${doc.url}" target="_blank" rel="noopener noreferrer" class="btn-sm-icon" title="Abrir en Google Drive">
            <i data-lucide="external-link" style="width: 14px; height: 14px;"></i>
          </a>
        </div>
      </div>
    `;

    return div;
  }

  function updateStats() {
    const totalEl = document.getElementById('doc-stat-total');
    const reportsEl = document.getElementById('doc-stat-reports');
    const othersEl = document.getElementById('doc-stat-others');

    if (!totalEl) return;

    const total = documents.length;
    const reports = documents.filter(d => d.category.includes('Informe')).length;
    const others = total - reports;

    totalEl.textContent = total;
    reportsEl.textContent = reports;
    othersEl.textContent = others;
  }

  window.openDriveModal = function(id = null) {
    const modal = document.getElementById('drive-modal');
    const form = document.getElementById('drive-form');
    const titleEl = document.getElementById('modal-doc-title');
    const btnDelete = document.getElementById('btn-delete-doc');

    form.reset();

    if (id) {
      const doc = documents.find(d => d.id === id);
      if (!doc) return;

      document.getElementById('doc-id').value = doc.id;
      document.getElementById('doc-name').value = doc.name;
      document.getElementById('doc-url').value = doc.url;
      document.getElementById('doc-category').value = doc.category;
      document.getElementById('doc-date').value = doc.date;

      titleEl.innerHTML = `<i data-lucide="edit-3"></i> Editar Registro Documento`;
      btnDelete.style.display = 'inline-flex';
    } else {
      document.getElementById('doc-id').value = '';
      titleEl.innerHTML = `<i data-lucide="file-plus-2"></i> Vincular Archivo de Google Drive`;
      btnDelete.style.display = 'none';

      const today = new Date().toISOString().split('T')[0];
      document.getElementById('doc-date').value = today;
    }

    modal.classList.add('active');
    if (window.lucide) lucide.createIcons();
  };

  window.closeDriveModal = function() {
    document.getElementById('drive-modal').classList.remove('active');
  };

  window.handleSaveDoc = function(e) {
    e.preventDefault();
    const id = document.getElementById('doc-id').value;
    const name = document.getElementById('doc-name').value.trim();
    const url = document.getElementById('doc-url').value.trim();
    const category = document.getElementById('doc-category').value;
    const date = document.getElementById('doc-date').value;

    if (id) {
      const doc = documents.find(d => d.id === id);
      if (doc) {
        Object.assign(doc, { name, url, category, date });
      }
    } else {
      documents.push({
        id: `doc-${Date.now()}`,
        name,
        url,
        category,
        date
      });
    }

    renderDocuments();
    closeDriveModal();
  };

  window.handleDeleteDoc = function() {
    const id = document.getElementById('doc-id').value;
    if (id && confirm("¿Seguro que deseas desvincular este documento?")) {
      documents = documents.filter(d => d.id !== id);
      renderDocuments();
      closeDriveModal();
    }
  };

  function saveToStorage() {
    localStorage.setItem('user_drive_docs', JSON.stringify(documents));
  }

  // Inicializar
  renderDocuments();
})();