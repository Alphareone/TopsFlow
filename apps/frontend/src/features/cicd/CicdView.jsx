import React from 'react';

export default function CicdView({ bgImage }) {
  const pipelines = [
    { name: 'Build & Unit Tests', status: 'Passed', duration: '1m 42s', coverage: '94%', env: 'Dev' },
    { name: 'Prisma DB Migration Check', status: 'Passed', duration: '45s', coverage: 'N/A', env: 'Staging' },
    { name: 'Docker Security Scan', status: 'Passed', duration: '2m 10s', coverage: '100%', env: 'Staging' },
    { name: 'Production E2E Tests', status: 'Running', duration: '3m 05s', coverage: '88%', env: 'Prod' }
  ];

  const cardStyle = {
    background: bgImage ? 'rgba(15, 23, 42, 0.75)' : '#ffffff',
    color: bgImage ? '#ffffff' : '#1e293b',
    backdropFilter: bgImage ? 'blur(12px)' : 'none',
    border: `1px solid ${bgImage ? 'rgba(255,255,255,0.15)' : '#e2e8f0'}`,
    borderRadius: 12,
    padding: 20,
    marginBottom: 20
  };

  return (
    <div>
      <div style={{ marginBottom: 20 }}>
        <h3 style={{ margin: 0, fontSize: 20, color: bgImage ? '#fff' : '#0f172a' }}>🧪 Pipeline CI/CD & Calidad de Código</h3>
        <span style={{ fontSize: 12, color: bgImage ? '#cbd5e1' : '#64748b' }}>Supervisión de despliegues automatizados y métricas de QA.</span>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 15, marginBottom: 20 }}>
        <div style={cardStyle}>
          <span style={{ fontSize: 11, color: '#3b82f6', fontWeight: 700 }}>COBERTURA GLOBAL</span>
          <div style={{ fontSize: 26, fontWeight: 700, marginTop: 4 }}>92.4%</div>
        </div>
        <div style={cardStyle}>
          <span style={{ fontSize: 11, color: '#10b981', fontWeight: 700 }}>ESTADO DE DESPLIEGUE</span>
          <div style={{ fontSize: 26, fontWeight: 700, marginTop: 4 }}>🟢 Estándar OK</div>
        </div>
        <div style={cardStyle}>
          <span style={{ fontSize: 11, color: '#f59e0b', fontWeight: 700 }}>DEUDA TÉCNICA</span>
          <div style={{ fontSize: 26, fontWeight: 700, marginTop: 4 }}>1.2 hrs</div>
        </div>
      </div>

      <div style={cardStyle}>
        <h4 style={{ margin: '0 0 15px 0' }}>⚙️ Pipelines Recientes</h4>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {pipelines.map((pipe, idx) => (
            <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: 12, background: bgImage ? 'rgba(255,255,255,0.05)' : '#f8fafc', borderRadius: 8 }}>
              <div>
                <strong style={{ fontSize: 13, display: 'block' }}>{pipe.name}</strong>
                <span style={{ fontSize: 11, opacity: 0.7 }}>Entorno: {pipe.env} • Cobertura: {pipe.coverage}</span>
              </div>
              <div style={{ textAlign: 'right' }}>
                <span style={{ 
                  background: pipe.status === 'Passed' ? '#dcfce7' : '#dbeafe', 
                  color: pipe.status === 'Passed' ? '#166534' : '#1e40af', 
                  padding: '3px 10px', borderRadius: 12, fontSize: 10, fontWeight: 700 
                }}>
                  {pipe.status}
                </span>
                <span style={{ fontSize: 11, display: 'block', marginTop: 4, opacity: 0.7 }}>{pipe.duration}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
