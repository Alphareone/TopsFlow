(function initInformesModule() {
  let documents = JSON.parse(localStorage.getItem('user_drive_docs')) || [];
  let currentFileBase64 = null;
  let currentFileName = null;

  function renderDocuments() {
    const container = document.getElementById('docs-container');
    if (!container) return;

    container.innerHTML = '';

    if (documents.length === 0) {
      container.innerHTML = `
        <div class="card-placeholder" style="grid-column: 1 / -1; text-align: center;">
          <p>No tienes documentos ni informes guardados. Haz clic en "Agregar Documento" para subir uno.</p>
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

    let iconName = 'file-text';
    if (doc.category.includes('Minuta')) iconName = 'clipboard-list';
    if (doc.category.includes('Presentación')) iconName = 'presentation';
    if (doc.category.includes('Trabajo')) iconName = 'briefcase';

    const isLocal = doc.sourceType === 'local';

    div.innerHTML = `
      <div class="doc-card-header">
        <div class="doc-type-icon">
          <i data-lucide="${iconName}"></i>
        </div>
        <div class="doc-card-info">
          <h4 class="doc-card-title">${doc.name}</h4>
          <div class="doc-badges-row">
            <span class="doc-category-badge">${doc.category}</span>
            <span class="doc-source-badge">${isLocal ? 'Archivo Local' : 'Google Drive'}</span>
          </div>
        </div>
      </div>

      <div class="doc-card-footer">
        <span><i data-lucide="calendar" style="width: 12px; height: 12px; display: inline; vertical-align: middle;"></i> ${doc.date}</span>
        <div class="doc-actions">
          <button class="btn-sm-icon" title="Editar Registro" onclick="openDriveModal('${doc.id}')">
            <i data-lucide="edit-3" style="width: 14px; height: 14px;"></i>
          </button>
          
          ${isLocal ? `
            <a href="${doc.fileData}" download="${doc.fileName || doc.name}" class="btn-sm-icon" title="Descargar Archivo">
              <i data-lucide="download" style="width: 14px; height: 14px;"></i>
            </a>
          ` : `
            <a href="${doc.url}" target="_blank" rel="noopener noreferrer" class="btn-sm-icon" title="Abrir en Drive">
              <i data-lucide="external-link" style="width: 14px; height: 14px;"></i>
            </a>
          `}
        </div>
      </div>
    `;

    return div;
  }

  function updateStats() {
    const totalEl = document.getElementById('doc-stat-total');
    const localEl = document.getElementById('doc-stat-local');
    const driveEl = document.getElementById('doc-stat-drive');

    if (!totalEl) return;

    const total = documents.length;
    const local = documents.filter(d => d.sourceType === 'local').length;
    const drive = total - local;

    totalEl.textContent = total;
    localEl.textContent = local;
    driveEl.textContent = drive;
  }

  // LEER ARCHIVO SUBIDO Y CONVERTIR A BASE64
  window.handleFileSelect = function(event) {
    const file = event.target.files[0];
    if (!file) return;

    // Límite de seguridad sugerido para localStorage (3MB)
    if (file.size > 3 * 1024 * 1024) {
      alert("Para optimizar el rendimiento de la aplicación, el tamaño máximo de archivo local sugerido es de 3MB. Para archivos más pesados, utiliza la opción de Google Drive.");
    }

    const reader = new FileReader();
    reader.onload = function(e) {
      currentFileBase64 = e.target.result;
      currentFileName = file.name;
      
      // Auto-completar el nombre del documento si está vacío
      const nameInput = document.getElementById('doc-name');
      if (!nameInput.value) {
        nameInput.value = file.name;
      }
    };
    reader.readAsDataURL(file);
  };

  window.toggleSourceType = function(type) {
    const groupFile = document.getElementById('group-file-upload');
    const groupDrive = document.getElementById('group-drive-url');
    const inputUrl = document.getElementById('doc-url');
    const inputFile = document.getElementById('doc-file');

    if (type === 'local') {
      groupFile.style.display = 'block';
      groupDrive.style.display = 'none';
      inputUrl.removeAttribute('required');
    } else {
      groupFile.style.display = 'none';
      groupDrive.style.display = 'block';
      inputUrl.setAttribute('required', 'true');
      inputFile.value = '';
      currentFileBase64 = null;
    }
  };

  window.openDriveModal = function(id = null) {
    const modal = document.getElementById('drive-modal');
    const form = document.getElementById('drive-form');
    const titleEl = document.getElementById('modal-doc-title');
    const btnDelete = document.getElementById('btn-delete-doc');

    form.reset();
    currentFileBase64 = null;
    currentFileName = null;

    if (id) {
      const doc = documents.find(d => d.id === id);
      if (!doc) return;

      document.getElementById('doc-id').value = doc.id;
      document.getElementById('doc-name').value = doc.name;
      document.getElementById('doc-category').value = doc.category;
      document.getElementById('doc-date').value = doc.date;

      const isLocal = doc.sourceType === 'local';
      document.querySelector(`input[name="docSource"][value="${isLocal ? 'local' : 'drive'}"]`).checked = true;
      toggleSourceType(isLocal ? 'local' : 'drive');

      if (!isLocal) {
        document.getElementById('doc-url').value = doc.url || '';
      } else {
        currentFileBase64 = doc.fileData;
        currentFileName = doc.fileName;
      }

      titleEl.innerHTML = `<i data-lucide="edit-3"></i> Editar Documento`;
      btnDelete.style.display = 'inline-flex';
    } else {
      document.getElementById('doc-id').value = '';
      document.querySelector('input[name="docSource"][value="local"]').checked = true;
      toggleSourceType('local');

      titleEl.innerHTML = `<i data-lucide="file-plus-2"></i> Registrar Documento`;
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
    const category = document.getElementById('doc-category').value;
    const date = document.getElementById('doc-date').value;
    const sourceType = document.querySelector('input[name="docSource"]:checked').value;

    if (sourceType === 'local' && !currentFileBase64 && !id) {
      alert("Por favor selecciona un archivo de tu equipo.");
      return;
    }

    const docData = {
      name,
      category,
      date,
      sourceType,
      url: sourceType === 'drive' ? document.getElementById('doc-url').value.trim() : null,
      fileData: sourceType === 'local' ? currentFileBase64 : null,
      fileName: sourceType === 'local' ? currentFileName : null
    };

    if (id) {
      const doc = documents.find(d => d.id === id);
      if (doc) {
        // Mantener archivo previo si no se seleccionó uno nuevo al editar
        if (sourceType === 'local' && !currentFileBase64) {
          docData.fileData = doc.fileData;
          docData.fileName = doc.fileName;
        }
        Object.assign(doc, docData);
      }
    } else {
      documents.push({
        id: `doc-${Date.now()}`,
        ...docData
      });
    }

    renderDocuments();
    closeDriveModal();
  };

  window.handleDeleteDoc = function() {
    const id = document.getElementById('doc-id').value;
    if (id && confirm("¿Seguro que deseas eliminar este documento?")) {
      documents = documents.filter(d => d.id !== id);
      renderDocuments();
      closeDriveModal();
    }
  };

  function saveToStorage() {
    try {
      localStorage.setItem('user_drive_docs', JSON.stringify(documents));
    } catch (e) {
      alert("El almacenamiento local está lleno. Intenta eliminar algunos archivos o utiliza enlaces de Google Drive.");
    }
  }

  // Inicializar
  renderDocuments();
})();