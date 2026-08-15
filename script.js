const DAYS = ["LUN", "MAR", "MIÉ", "JUE", "VIE", "SÁB"];
const START_HOUR = 8;
const END_HOUR = 20;

// Carga o inicializa actividades
let activities = JSON.parse(localStorage.getItem('user_activities')) || [];

document.addEventListener('DOMContentLoaded', () => {
    initTimeSelectors();
    renderScheduleGrid();
    renderActivities();
    updateStats();
    if (window.lucide) lucide.createIcons();
});

// CALCULA EL CONTRASTE DEL TEXTO SEGÚN EL COLOR DE FONDO
function getContrastColor(hexColor) {
    if (!hexColor) return '#ffffff';
    const hex = hexColor.replace('#', '');
    const r = parseInt(hex.substr(0, 2), 16);
    const g = parseInt(hex.substr(2, 2), 16);
    const b = parseInt(hex.substr(4, 2), 16);
    const yiq = ((r * 299) + (g * 587) + (b * 114)) / 1000;
    return (yiq >= 140) ? '#0f172a' : '#ffffff';
}

function initTimeSelectors() {
    const startSelect = document.getElementById('act-start');
    const endSelect = document.getElementById('act-end');
    
    startSelect.innerHTML = '';
    endSelect.innerHTML = '';

    for (let h = START_HOUR; h < END_HOUR; h++) {
        const timeStr = `${h.toString().padStart(2, '0')}:00`;
        startSelect.innerHTML += `<option value="${h}">${timeStr}</option>`;
    }

    for (let h = START_HOUR + 1; h <= END_HOUR; h++) {
        const timeStr = `${h.toString().padStart(2, '0')}:00`;
        endSelect.innerHTML += `<option value="${h}">${timeStr}</option>`;
    }

    startSelect.value = "9";
    endSelect.value = "11";
}

function renderScheduleGrid() {
    const tbody = document.getElementById('schedule-body');
    tbody.innerHTML = '';

    for (let h = START_HOUR; h < END_HOUR; h++) {
        const tr = document.createElement('tr');
        
        const timeCell = document.createElement('td');
        timeCell.className = 'time-cell';
        timeCell.textContent = `${h.toString().padStart(2, '0')}:00 - ${(h + 1).toString().padStart(2, '0')}:00`;
        tr.appendChild(timeCell);

        DAYS.forEach(day => {
            const td = document.createElement('td');
            td.dataset.day = day;
            td.dataset.hour = h;
            td.ondragover = (e) => e.preventDefault();
            td.ondrop = (e) => handleDrop(e, day, h);
            tr.appendChild(td);
        });

        tbody.appendChild(tr);
    }
}

function renderActivities() {
    document.querySelectorAll('.schedule-table td:not(.time-cell)').forEach(td => td.innerHTML = '');
    
    activities.forEach(act => {
        for (let h = act.startHour; h < act.endHour; h++) {
            const cell = document.querySelector(`td[data-day="${act.day}"][data-hour="${h}"]`);
            if (cell) {
                cell.innerHTML = '';
                
                const block = document.createElement('div');
                block.className = 'block-assigned';
                block.draggable = true;
                
                const textColor = getContrastColor(act.color);
                block.style.setProperty('--block-custom-color', act.color);
                block.style.color = textColor;

                block.innerHTML = `
                    <span>${act.name}</span>
                    <span class="block-hours-label">${act.startHour.toString().padStart(2, '0')}:00 - ${act.endHour.toString().padStart(2, '0')}:00</span>
                `;

                block.onclick = (e) => {
                    e.stopPropagation();
                    openEditModal(act.id);
                };

                block.ondragstart = (e) => {
                    e.dataTransfer.setData('text/plain', act.id);
                };

                cell.appendChild(block);
            }
        }
    });

    saveToStorage();
}

function handleAddActivity(e) {
    e.preventDefault();
    const name = document.getElementById('act-name').value.trim();
    const day = document.getElementById('act-day').value;
    const startHour = parseInt(document.getElementById('act-start').value);
    const endHour = parseInt(document.getElementById('act-end').value);
    const color = document.getElementById('act-color').value;

    if (startHour >= endHour) {
        alert("La hora de inicio debe ser menor a la hora de fin.");
        return;
    }

    const newActivity = {
        id: Date.now().toString(),
        name,
        day,
        startHour,
        endHour,
        color
    };

    activities.push(newActivity);
    renderActivities();
    updateStats();
    document.getElementById('act-name').value = '';
}

function handleDrop(e, day, newStartHour) {
    e.preventDefault();
    const id = e.dataTransfer.getData('text/plain');
    const act = activities.find(a => a.id === id);

    if (act) {
        const duration = act.endHour - act.startHour;
        if (newStartHour + duration <= END_HOUR) {
            act.day = day;
            act.startHour = newStartHour;
            act.endHour = newStartHour + duration;
            renderActivities();
            updateStats();
        } else {
            alert("El bloque excede el rango máximo del horario.");
        }
    }
}

function openEditModal(id) {
    const act = activities.find(a => a.id === id);
    if (!act) return;

    document.getElementById('edit-id').value = act.id;
    document.getElementById('edit-name').value = act.name;
    document.getElementById('edit-color').value = act.color;

    document.getElementById('edit-modal').classList.add('active');
}

function closeEditModal() {
    document.getElementById('edit-modal').classList.remove('active');
}

function handleSaveEdit(e) {
    e.preventDefault();
    const id = document.getElementById('edit-id').value;
    const act = activities.find(a => a.id === id);

    if (act) {
        act.name = document.getElementById('edit-name').value.trim();
        act.color = document.getElementById('edit-color').value;
        renderActivities();
        updateStats();
        closeEditModal();
    }
}

function handleDeleteActivity() {
    const id = document.getElementById('edit-id').value;
    activities = activities.filter(a => a.id !== id);
    renderActivities();
    updateStats();
    closeEditModal();
}

// CÁLCULO DE SUMA Y DESGLOSE DETALLADO DE HORAS
function updateStats() {
    document.getElementById('stat-total-blocks').textContent = activities.length;
    
    const totalHours = activities.reduce((acc, a) => acc + (a.endHour - a.startHour), 0);
    document.getElementById('stat-total-hours').innerHTML = `${totalHours} <small>hrs</small>`;

    const activitySummary = {};
    activities.forEach(a => {
        const duration = a.endHour - a.startHour;
        if (!activitySummary[a.name]) {
            activitySummary[a.name] = { hours: 0, color: a.color };
        }
        activitySummary[a.name].hours += duration;
        activitySummary[a.name].color = a.color;
    });

    const totalCategories = Object.keys(activitySummary).length;
    document.getElementById('stat-activity-count').textContent = totalCategories;

    const breakdownPanel = document.getElementById('breakdown-panel');
    breakdownPanel.innerHTML = '';

    if (totalCategories === 0) {
        breakdownPanel.innerHTML = '<span style="font-size: 0.8rem; opacity: 0.6;">Agrega bloques de "Pega Lopa", "Capstone" o "Práctica" para ver el desglose.</span>';
        return;
    }

    Object.keys(activitySummary).forEach(name => {
        const item = activitySummary[name];
        const chip = document.createElement('div');
        chip.className = 'breakdown-chip';
        chip.innerHTML = `
            <span class="breakdown-color-dot" style="background-color: ${item.color}"></span>
            <span><strong>${name}:</strong> ${item.hours} hrs/sem</span>
        `;
        breakdownPanel.appendChild(chip);
    });
}

function setColor(color) {
    document.getElementById('act-color').value = color;
}

function changeTheme(themeName) {
    document.body.className = '';
    if (themeName !== 'light') {
        document.body.classList.add(`theme-${themeName}`);
    }
}

function saveToStorage() {
    localStorage.setItem('user_activities', JSON.stringify(activities));
}

function resetSchedule() {
    if (confirm("¿Deseas reiniciar toda la planificación semestral?")) {
        activities = [];
        renderActivities();
        updateStats();
    }
}