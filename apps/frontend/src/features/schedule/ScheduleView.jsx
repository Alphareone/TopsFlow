import React, { useState, useEffect } from 'react';

const INITIAL_EVENTS = [
  { id: 1, name: 'Pega Lopa', day: 'Lunes', start: '09:00', end: '11:00', color: '#2563eb' },
  { id: 2, name: 'Proyecto Capstone', day: 'Miércoles', start: '14:00', end: '16:00', color: '#8b5cf6' }
];

export default function ScheduleView() {
  const [activityName, setActivityName] = useState('');
  const [activityDay, setActivityDay] = useState('Lunes');
  const [startTime, setStartTime] = useState('08:00');
  const [endTime, setEndTime] = useState('10:00');
  const [activityColor, setActivityColor] = useState('#2563eb');
  
  const [scheduleEvents, setScheduleEvents] = useState(() => {
    const saved = localStorage.getItem('topsflow_schedule');
    return saved ? JSON.parse(saved) : INITIAL_EVENTS;
  });

  useEffect(() => {
    localStorage.setItem('topsflow_schedule', JSON.stringify(scheduleEvents));
  }, [scheduleEvents]);

  const timeSlots = [
    '08:00 - 09:00', '09:00 - 10:00', '10:00 - 11:00', '11:00 - 12:00',
    '12:00 - 13:00', '13:00 - 14:00', '14:00 - 15:00', '15:00 - 16:00',
    '16:00 - 17:00', '17:00 - 18:00', '18:00 - 19:00', '19:00 - 20:00'
  ];

  const timeToMinutes = (timeStr) => {
    const [h, m] = timeStr.split(':').map(Number);
    return h * 60 + m;
  };

  const addScheduleEvent = () => {
    if (!activityName) {
      alert('Por favor ingresa un nombre para la actividad.');
      return;
    }

    const startMin = timeToMinutes(startTime);
    const endMin = timeToMinutes(endTime);

    if (startMin >= endMin) {
      alert('La hora de fin debe ser posterior a la hora de inicio.');
      return;
    }

    const conflict = scheduleEvents.some(ev => {
      if (ev.day !== activityDay) return false;
      const evStart = timeToMinutes(ev.start);
      const evEnd = timeToMinutes(ev.end);
      return (startMin < evEnd && endMin > evStart);
    });

    if (conflict) {
      alert(`⚠️ Choque de Horario: Ya existe una actividad registrada en ${activityDay} dentro del rango ${startTime} - ${endTime}.`);
      return;
    }

    setScheduleEvents([...scheduleEvents, { id: Date.now(), name: activityName, day: activityDay, start: startTime, end: endTime, color: activityColor }]);
    setActivityName('');
  };

  const removeScheduleEvent = (id) => {
    setScheduleEvents(scheduleEvents.filter(e => e.id !== id));
  };

  const clearAll = () => {
    if (window.confirm('¿Seguro que deseas limpiar todo el horario?')) {
      setScheduleEvents([]);
    }
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 15 }}>
        <div>
          <h3 style={{ margin: 0, fontSize: 18 }}>📅 Planificación Semestral Inteligente</h3>
          <span style={{ fontSize: 12, color: '#64748b' }}>Trabajos • Estudios • Prácticas</span>
        </div>
        <button onClick={clearAll} style={{ background: 'transparent', border: '1px solid #cbd5e1', padding: '8px 14px', borderRadius: 6, fontSize: 12, cursor: 'pointer' }}>
          🗑️ Limpiar Todo
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 15, marginBottom: 20 }}>
        <div style={{ background: '#fff', padding: 15, borderRadius: 8, border: '1px solid #e2e8f0', borderLeft: '4px solid #2563eb' }}>
          <span style={{ fontSize: 11, color: '#64748b', fontWeight: 600 }}>TOTAL BLOQUES</span>
          <div style={{ fontSize: 22, fontWeight: 700, marginTop: 4 }}>{scheduleEvents.length}</div>
        </div>
        <div style={{ background: '#fff', padding: 15, borderRadius: 8, border: '1px solid #e2e8f0', borderLeft: '4px solid #2563eb' }}>
          <span style={{ fontSize: 11, color: '#64748b', fontWeight: 600 }}>HORAS SEMANALES TOTALES</span>
          <div style={{ fontSize: 22, fontWeight: 700, marginTop: 4 }}>{scheduleEvents.length * 2} hrs</div>
        </div>
        <div style={{ background: '#fff', padding: 15, borderRadius: 8, border: '1px solid #e2e8f0', borderLeft: '4px solid #2563eb' }}>
          <span style={{ fontSize: 11, color: '#64748b', fontWeight: 600 }}>CATEGORÍAS REGISTRADAS</span>
          <div style={{ fontSize: 22, fontWeight: 700, marginTop: 4 }}>{new Set(scheduleEvents.map(e => e.name)).size}</div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '280px 1fr', gap: 20 }}>
        <div style={{ background: '#fff', padding: 20, borderRadius: 10, border: '1px solid #e2e8f0' }}>
          <h4 style={{ marginTop: 0, fontSize: 14 }}>➕ Registrar Actividad</h4>
          <label style={{ fontSize: 11, color: '#64748b', display: 'block', marginBottom: 4 }}>NOMBRE DE LA ACTIVIDAD</label>
          <input value={activityName} onChange={e => setActivityName(e.target.value)} placeholder="Ej: Pega Lopa, Capstone" style={{ width: '90%', padding: 8, marginBottom: 12, borderRadius: 6, border: '1px solid #cbd5e1' }} />

          <label style={{ fontSize: 11, color: '#64748b', display: 'block', marginBottom: 4 }}>DÍA DE LA SEMANA</label>
          <select value={activityDay} onChange={e => setActivityDay(e.target.value)} style={{ width: '97%', padding: 8, marginBottom: 12, borderRadius: 6, border: '1px solid #cbd5e1' }}>
            {['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'].map(d => <option key={d} value={d}>{d}</option>)}
          </select>

          <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
            <div style={{ flex: 1 }}>
              <label style={{ fontSize: 11, color: '#64748b' }}>HORA INICIO</label>
              <select value={startTime} onChange={e => setStartTime(e.target.value)} style={{ width: '100%', padding: 6, borderRadius: 6, border: '1px solid #cbd5e1' }}>
                {timeSlots.map(t => <option key={t} value={t.split(' - ')[0]}>{t.split(' - ')[0]}</option>)}
              </select>
            </div>
            <div style={{ flex: 1 }}>
              <label style={{ fontSize: 11, color: '#64748b' }}>HORA FIN</label>
              <select value={endTime} onChange={e => setEndTime(e.target.value)} style={{ width: '100%', padding: 6, borderRadius: 6, border: '1px solid #cbd5e1' }}>
                {timeSlots.map(t => <option key={t} value={t.split(' - ')[1]}>{t.split(' - ')[1]}</option>)}
              </select>
            </div>
          </div>

          <label style={{ fontSize: 11, color: '#64748b', display: 'block', marginBottom: 6 }}>COLOR IDENTIFICADOR</label>
          <div style={{ display: 'flex', gap: 8, marginBottom: 15 }}>
            {['#2563eb', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'].map(c => (
              <div key={c} onClick={() => setActivityColor(c)} style={{ width: 22, height: 22, borderRadius: '50%', background: c, cursor: 'pointer', border: activityColor === c ? '2px solid #fff' : 'none' }} />
            ))}
          </div>

          <button onClick={addScheduleEvent} style={{ width: '100%', padding: 10, background: '#2563eb', color: '#fff', border: 'none', borderRadius: 6, fontWeight: 600, cursor: 'pointer', fontSize: 13 }}>
            + Asignar al Horario
          </button>
        </div>

        <div style={{ background: '#fff', padding: 15, borderRadius: 10, border: '1px solid #e2e8f0', maxHeight: '70vh', overflowY: 'auto' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '90px repeat(6, 1fr)', gap: 6, textAlign: 'center', fontWeight: 'bold', fontSize: 11, position: 'sticky', top: 0, background: '#fff', zIndex: 10, paddingBottom: 6 }}>
            <div style={{ background: '#2563eb', color: '#fff', padding: 8, borderRadius: 4 }}>🕒</div>
            {['LUN', 'MAR', 'MIÉ', 'JUE', 'VIE', 'SÁB'].map(day => (
              <div key={day} style={{ background: '#2563eb', color: '#fff', padding: 8, borderRadius: 4 }}>{day}</div>
            ))}
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginTop: 6 }}>
            {timeSlots.map(slot => (
              <div key={slot} style={{ display: 'grid', gridTemplateColumns: '90px repeat(6, 1fr)', gap: 6, height: 42 }}>
                <div style={{ fontSize: 10, color: '#64748b', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f1f5f9', borderRadius: 4 }}>{slot}</div>
                {['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'].map(day => {
                  const ev = scheduleEvents.find(e => e.day === day && timeToMinutes(slot.split(' - ')[0]) >= timeToMinutes(e.start) && timeToMinutes(slot.split(' - ')[0]) < timeToMinutes(e.end));
                  return (
                    <div key={day} style={{ background: ev ? ev.color : '#f1f5f9', color: '#fff', borderRadius: 4, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 8px', fontSize: 11, fontWeight: 600 }}>
                      {ev ? (
                        <>
                          <span>{ev.name}</span>
                          <span onClick={() => removeScheduleEvent(ev.id)} style={{ cursor: 'pointer', opacity: 0.8 }}>✕</span>
                        </>
                      ) : ''}
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
