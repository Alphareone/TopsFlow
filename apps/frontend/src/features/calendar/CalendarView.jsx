import React, { useState } from 'react';

export default function CalendarView() {
  const [currentDate, setCurrentDate] = useState(new Date());

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayIndex = (new Date(year, month, 1).getDay() + 6) % 7;

  const prevMonth = () => setCurrentDate(new Date(year, month - 1, 1));
  const nextMonth = () => setCurrentDate(new Date(year, month + 1, 1));
  const todayMonth = () => setCurrentDate(new Date());

  return (
    <div>
      <div style={{ background: '#fff', padding: 20, borderRadius: 10, border: '1px solid #e2e8f0' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 15 }}>
          <div style={{ display: 'flex', gap: 10 }}>
            <button onClick={prevMonth} style={{ padding: '4px 10px', cursor: 'pointer' }}>&lt;</button>
            <button onClick={todayMonth} style={{ padding: '4px 10px', cursor: 'pointer' }}>Hoy</button>
            <button onClick={nextMonth} style={{ padding: '4px 10px', cursor: 'pointer' }}>&gt;</button>
          </div>
          <h3 style={{ margin: 0, fontSize: 16 }}>
            {currentDate.toLocaleString('es-ES', { month: 'long', year: 'numeric' }).toUpperCase()}
          </h3>
        </div>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 8, textAlign: 'center', fontWeight: 'bold', fontSize: 11 }}>
          {['LUN', 'MAR', 'MIÉ', 'JUE', 'VIE', 'SÁB', 'DOM'].map(d => <div key={d}>{d}</div>)}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 8, marginTop: 10 }}>
          {Array.from({ length: firstDayIndex }).map((_, i) => (
            <div key={'empty-' + i} style={{ background: 'transparent', height: 70 }} />
          ))}

          {Array.from({ length: daysInMonth }).map((_, i) => {
            const dayNum = i + 1;
            const isToday = dayNum === new Date().getDate() && month === new Date().getMonth() && year === new Date().getFullYear();
            return (
              <div key={dayNum} style={{ background: isToday ? '#2563eb' : '#f8fafc', color: isToday ? '#fff' : '#1e293b', height: 70, padding: 6, borderRadius: 6, border: '1px solid #e2e8f0', fontSize: 11, fontWeight: isToday ? 'bold' : 'normal' }}>
                {dayNum} {isToday ? ' (Hoy)' : ''}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
