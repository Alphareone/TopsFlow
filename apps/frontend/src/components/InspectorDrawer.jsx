import React from 'react';

export default function InspectorDrawer({ bgImage }) {
  return (
    <aside style={{
      width: 300,
      background: bgImage ? 'rgba(15, 23, 42, 0.75)' : '#ffffff',
      backdropFilter: bgImage ? 'blur(12px)' : 'none',
      color: bgImage ? '#ffffff' : '#1e293b',
      borderLeft: `1px solid ${bgImage ? 'rgba(255,255,255,0.15)' : '#e2e8f0'}`,
      padding: 20,
      display: 'flex',
      flexDirection: 'column',
      gap: 20,
      overflowY: 'auto'
    }}>
      <div>
        <h4 style={{ margin: '0 0 10px 0', fontSize: 14 }}>📌 Resumen del Proyecto</h4>
        <div style={{ background: bgImage ? 'rgba(255,255,255,0.05)' : '#f8fafc', padding: 12, borderRadius: 8, border: '1px solid rgba(0,0,0,0.05)' }}>
          <span style={{ fontSize: 10, fontWeight: 700, color: '#3b82f6' }}>COMPROMISO ACTIVO</span>
          <h5 style={{ margin: '4px 0', fontSize: 13 }}>Capstone Enterprise v2.0</h5>
          <p style={{ margin: 0, fontSize: 11, opacity: 0.7 }}>Avance global de entregables al 85%.</p>
        </div>
      </div>

      <div>
        <h4 style={{ margin: '0 0 10px 0', fontSize: 14 }}>⏱️ Horas & Asistencia</h4>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 10, textAlign: 'center' }}>
          <div style={{ background: bgImage ? 'rgba(255,255,255,0.05)' : '#f1f5f9', padding: 10, borderRadius: 6 }}>
            <div style={{ fontSize: 16, fontWeight: 700 }}>24 hrs</div>
            <span style={{ fontSize: 9, opacity: 0.7 }}>Registradas</span>
          </div>
          <div style={{ background: bgImage ? 'rgba(255,255,255,0.05)' : '#f1f5f9', padding: 10, borderRadius: 6 }}>
            <div style={{ fontSize: 16, fontWeight: 700 }}>100%</div>
            <span style={{ fontSize: 9, opacity: 0.7 }}>Cumplimiento</span>
          </div>
        </div>
      </div>

      <div>
        <h4 style={{ margin: '0 0 10px 0', fontSize: 14 }}>👥 Equipo de Trabajo</h4>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {['Alex (Lead Dev)', 'Dev (Backend)', 'UI/UX Designer'].map((user, idx) => (
            <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 12 }}>
              <div style={{ width: 24, height: 24, borderRadius: '50%', background: '#2563eb', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, fontWeight: 'bold' }}>
                {user[0]}
              </div>
              <span>{user}</span>
            </div>
          ))}
        </div>
      </div>
    </aside>
  );
}
