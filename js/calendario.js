(function initCalendarModule() {
  let currentDate = new Date();
  let currentView = 'month'; // 'month' | 'day' | 'year'

  // MESES Y DÍAS EN ESPAÑOL
  const MONTH_NAMES = [
    "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
    "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
  ];
  const DAY_NAMES = ["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"];

  // RECUPERAR EVENTOS UNIFICADOS DE LOCALSTORAGE
  function getUnifiedEvents() {
    const activities = JSON.parse(localStorage.getItem('user_activities')) || [];
    const kanbanCards = JSON.parse(localStorage.getItem('user_kanban_cards')) || [];

    const events = [];

    // Mapear Horario Semestral (Recurrente por día de semana)
    const dayMap = { "LUN": 1, "MAR": 2, "MIÉ": 3, "JUE": 4, "VIE": 5, "SÁB": 6, "DOM": 0 };
    activities.forEach(act => {
      events.push({
        type: 'horario',
        title: act.name,
        dayOfWeek: dayMap[act.day],
        startHour: act.startHour,
        endHour: act.endHour,
        color: act.color || '#3b82f6'
      });
    });

    // Mapear Tareas Kanban
    kanbanCards.forEach(card => {
      events.push({
        type: 'kanban',
        title: `[${card.status.toUpperCase()}] ${card.title}`,
        status: card.status,
        assignee: card.assignee,
        points: card.points,
        color: card.status === 'done' ? '#10b981' : (card.status === 'progress' ? '#3b82f6' : '#f59e0b')
      });
    });

    return events;
  }

  // RENDERIZADO PRINCIPAL
  function renderCalendar() {
    const container = document.getElementById('calendar-view-container');
    const label = document.getElementById('calendar-current-label');
    if (!container || !label) return;

    container.innerHTML = '';

    if (currentView === 'month') {
      label.textContent = `${MONTH_NAMES[currentDate.getMonth()]} ${currentDate.getFullYear()}`;
      renderMonthView(container);
    } else if (currentView === 'day') {
      label.textContent = `${currentDate.getDate()} de ${MONTH_NAMES[currentDate.getMonth()]}, ${currentDate.getFullYear()}`;
      renderDayView(container);
    } else if (currentView === 'year') {
      label.textContent = `Año ${currentDate.getFullYear()}`;
      renderYearView(container);
    }

    if (window.lucide) lucide.createIcons();
  }

  /* -------------------------------------------------------------------------- */
  /* VISTA MENSUAL                                                              */
  /* -------------------------------------------------------------------------- */
  function renderMonthView(container) {
    const grid = document.createElement('div');
    grid.className = 'month-grid';

    // Encabezados de días
    DAY_NAMES.forEach(day => {
      const header = document.createElement('div');
      header.className = 'month-day-header';
      header.textContent = day;
      grid.appendChild(header);
    });

    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);

    let startingDay = firstDay.getDay() - 1; // Ajustar a Lunes = 0
    if (startingDay === -1) startingDay = 6;

    const totalDays = lastDay.getDate();
    const events = getUnifiedEvents();

    // Días del mes anterior
    for (let i = 0; i < startingDay; i++) {
      const emptyCell = document.createElement('div');
      emptyCell.className = 'month-day-cell other-month';
      grid.appendChild(emptyCell);
    }

    // Días del mes actual
    const today = new Date();
    for (let day = 1; day <= totalDays; day++) {
      const cell = document.createElement('div');
      cell.className = 'month-day-cell';

      const cellDate = new Date(year, month, day);
      if (cellDate.toDateString() === today.toDateString()) {
        cell.classList.add('today');
      }

      const dayNum = document.createElement('span');
      dayNum.className = 'day-number';
      dayNum.textContent = day;
      cell.appendChild(dayNum);

      // Inyectar eventos recurrentes del Horario (coincidencia de día de semana)
      const dayOfWeek = cellDate.getDay();
      const matchingEvents = events.filter(e => e.type === 'horario' && e.dayOfWeek === dayOfWeek);

      matchingEvents.forEach(evt => {
        const chip = document.createElement('div');
        chip.className = 'event-chip';
        chip.style.backgroundColor = evt.color;
        chip.textContent = `${evt.startHour}:00 - ${evt.title}`;
        chip.onclick = () => openCalendarModal(evt.title, `Actividad del Horario (${evt.startHour}:00 a ${evt.endHour}:00)`);
        cell.appendChild(chip);
      });

      grid.appendChild(cell);
    }

    container.appendChild(grid);
  }

  /* -------------------------------------------------------------------------- */
  /* VISTA DIARIA                                                               */
  /* -------------------------------------------------------------------------- */
  function renderDayView(container) {
    const dayView = document.createElement('div');
    dayView.className = 'day-view-container';

    const events = getUnifiedEvents();
    const dayOfWeek = currentDate.getDay();

    for (let hour = 8; hour <= 20; hour++) {
      const row = document.createElement('div');
      row.className = 'day-time-row';

      const label = document.createElement('span');
      label.className = 'time-label';
      label.textContent = `${hour.toString().padStart(2, '0')}:00`;

      const slot = document.createElement('div');
      slot.className = 'day-events-slot';

      // Eventos programados a esta hora exacta
      const hourlyEvents = events.filter(e => e.type === 'horario' && e.dayOfWeek === dayOfWeek && e.startHour === hour);

      hourlyEvents.forEach(evt => {
        const chip = document.createElement('div');
        chip.className = 'event-chip';
        chip.style.backgroundColor = evt.color;
        chip.textContent = `${evt.title} (${evt.endHour - evt.startHour} hrs)`;
        chip.onclick = () => openCalendarModal(evt.title, `Programado de ${evt.startHour}:00 a ${evt.endHour}:00 hrs.`);
        slot.appendChild(chip);
      });

      row.appendChild(label);
      row.appendChild(slot);
      dayView.appendChild(row);
    }

    container.appendChild(dayView);
  }

  /* -------------------------------------------------------------------------- */
  /* VISTA ANUAL                                                                */
  /* -------------------------------------------------------------------------- */
  function renderYearView(container) {
    const yearGrid = document.createElement('div');
    yearGrid.className = 'year-grid';

    const year = currentDate.getFullYear();
    const events = getUnifiedEvents();

    for (let m = 0; m < 12; m++) {
      const monthCard = document.createElement('div');
      monthCard.className = 'mini-month-card';

      const title = document.createElement('div');
      title.className = 'mini-month-title';
      title.textContent = MONTH_NAMES[m];
      monthCard.appendChild(title);

      const daysGrid = document.createElement('div');
      daysGrid.className = 'mini-month-days';

      const totalDays = new Date(year, m + 1, 0).getDate();

      for (let d = 1; d <= totalDays; d++) {
        const dayEl = document.createElement('span');
        dayEl.className = 'mini-day';
        dayEl.textContent = d;

        const cellDate = new Date(year, m, d);
        const dayOfWeek = cellDate.getDay();
        const hasEvent = events.some(e => e.type === 'horario' && e.dayOfWeek === dayOfWeek);

        if (hasEvent) {
          dayEl.classList.add('has-event');
        }

        daysGrid.appendChild(dayEl);
      }

      monthCard.appendChild(daysGrid);
      yearGrid.appendChild(monthCard);
    }

    container.appendChild(yearGrid);
  }

  /* -------------------------------------------------------------------------- */
  /* FUNCIONES DE NAVEGACIÓN Y CONTROLES                                        */
  /* -------------------------------------------------------------------------- */
  window.switchCalendarView = function(view) {
    currentView = view;
    document.querySelectorAll('.view-switch-group .btn-toggle').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.view === view);
    });
    renderCalendar();
  };

  window.navigateCalendar = function(direction) {
    if (currentView === 'month') {
      currentDate.setMonth(currentDate.getMonth() + direction);
    } else if (currentView === 'day') {
      currentDate.setDate(currentDate.getDate() + direction);
    } else if (currentView === 'year') {
      currentDate.setFullYear(currentDate.getFullYear() + direction);
    }
    renderCalendar();
  };

  window.navigateCalendarToToday = function() {
    currentDate = new Date();
    renderCalendar();
  };

  window.openCalendarModal = function(title, desc) {
    const modal = document.getElementById('calendar-event-modal');
    document.getElementById('cal-modal-title').innerHTML = `<i data-lucide="info"></i> ${title}`;
    document.getElementById('cal-modal-content').innerHTML = `<p>${desc}</p>`;
    modal.classList.add('active');
    if (window.lucide) lucide.createIcons();
  };

  window.closeCalendarModal = function() {
    document.getElementById('calendar-event-modal').classList.remove('active');
  };

  // Inicializar renderizado
  renderCalendar();
})();
