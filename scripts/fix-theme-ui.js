const fs = require('fs');
const path = require('path');

const originalStyledAppContent = `import React, { useState, useCallback, useEffect } from 'react';
import axios from 'axios';
import {
  ReactFlow,
  Controls,
  Background,
  applyNodeChanges,
  applyEdgeChanges,
  addEdge,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';

const initialNodes = [
  { id: '1', type: 'input', data: { label: '⚡ Trigger: Inicio Evento' }, position: { x: 100, y: 150 } },
  { id: '2', type: 'output', data: { label: '📧 Action: Enviar Email' }, position: { x: 450, y: 150 } },
];

const initialEdges = [{ id: 'e1-2', source: '1', target: '2', animated: true }];

export default function App() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [userId, setUserId] = useState(null);
  const [qrCode, setQrCode] = useState('');
  const [token2FA, setToken2FA] = useState('');
  const [authToken, setAuthToken] = useState('');

  // Estados de Flujo
  const [workflowTitle, setWorkflowTitle] = useState('Mi Primer Flujo TopsFlow');
  const [currentWorkflowId, setCurrentWorkflowId] = useState(null);
  const [savedWorkflows, setSavedWorkflows] = useState([]);

  // Estados Canvas
  const [nodes, setNodes] = useState(initialNodes);
  const [edges, setEdges] = useState(initialEdges);
  const [executionLog, setExecutionLog] = useState(null);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const onNodesChange = useCallback((changes) => setNodes((nds) => applyNodeChanges(changes, nds)), []);
  const onEdgesChange = useCallback((changes) => setEdges((eds) => applyEdgeChanges(changes, eds)), []);
  const onConnect = useCallback((params) => setEdges((eds) => addEdge({ ...params, animated: true }, eds)), []);

  const loginUser = async () => {
    setMessage(''); setError('');
    try {
      const res = await axios.post('http://localhost:4000/api/auth/login', { email, password });
      setUserId(res.data.userId);
      setMessage('Credenciales correctas. Valida tu token 2FA.');
    } catch (err) {
      setError(err.response?.data?.error || 'Error de autenticación.');
    }
  };

  const setup2FA = async () => {
    try {
      const res = await axios.post('http://localhost:4000/api/auth/2fa/setup', { userId });
      setQrCode(res.data.qrCodeUrl);
    } catch (err) {
      setError('Error al generar QR.');
    }
  };

  const verify2FA = async () => {
    setMessage(''); setError('');
    try {
      const res = await axios.post('http://localhost:4000/api/auth/2fa/verify', { userId, token: token2FA });
      setAuthToken(res.data.token);
      setMessage('¡Sesión 2FA Activada!');
      fetchUserWorkflows(userId);
    } catch (err) {
      setError('Código 2FA inválido.');
    }
  };

  const fetchUserWorkflows = async (uId) => {
    try {
      const res = await axios.get(\`http://localhost:4000/api/workflows/user/\${uId}\`);
      setSavedWorkflows(res.data);
    } catch (err) {
      console.error('Error al obtener flujos guardados');
    }
  };

  const saveWorkflow = async () => {
    try {
      const res = await axios.post('http://localhost:4000/api/workflows/save', {
        userId,
        title: workflowTitle,
        nodes,
        edges,
        workflowId: currentWorkflowId
      });
      setCurrentWorkflowId(res.data.workflow.id);
      setMessage('💾 Flujo guardado en PostgreSQL.');
      fetchUserWorkflows(userId);
    } catch (err) {
      setError('Error al guardar el flujo.');
    }
  };

  const loadWorkflow = (wf) => {
    setCurrentWorkflowId(wf.id);
    setWorkflowTitle(wf.title);
    setNodes(wf.nodesJson || []);
    setEdges(wf.edgesJson || []);
    setMessage(\`📂 Cargado: "\${wf.title}"\`);
  };

  const addNode = (type) => {
    const id = (nodes.length + 1).toString();
    const newNode = {
      id,
      type: type === 'Trigger' ? 'input' : 'output',
      data: { label: \`\${type === 'Trigger' ? '⚡ Trigger' : '⚙️ Action'}: Nodo \${id}\` },
      position: { x: Math.random() * 250 + 100, y: Math.random() * 250 + 100 }
    };
    setNodes((nds) => [...nds, newNode]);
  };

  const executeCurrentWorkflow = async () => {
    try {
      const formattedNodes = nodes.map(n => ({
        id: n.id,
        type: n.type === 'input' ? 'trigger' : 'action',
        data: n.data
      }));
      const res = await axios.post('http://localhost:4000/api/workflows/run', {
        nodes: formattedNodes,
        edges,
        workflowId: currentWorkflowId
      });
      setExecutionLog(res.data);
    } catch (err) {
      setError('Error en la ejecución.');
    }
  };

  return (
    <div style={{ fontFamily: 'Inter, system-ui, sans-serif', height: '100vh', display: 'flex', flexDirection: 'column', background: '#0f172a', color: '#f8fafc' }}>
      
      {/* Navbar Superior al estilo TopsFlow Original */}
      <header style={{ background: '#1e293b', borderBottom: '1px solid #334155', padding: '12px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ background: '#3b82f6', width: 28, height: 28, borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>T</div>
          <h1 style={{ margin: 0, fontSize: 18, fontWeight: 700, letterSpacing: '-0.5px' }}>TopsFlow <span style={{ color: '#3b82f6', fontSize: 12, fontWeight: 400 }}>v2.0 Enterprise</span></h1>
        </div>

        {authToken && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 15 }}>
            <input 
              value={workflowTitle} 
              onChange={e => setWorkflowTitle(e.target.value)} 
              style={{ background: '#0f172a', color: '#f8fafc', border: '1px solid #475569', padding: '6px 12px', borderRadius: 6, fontSize: 14 }} 
            />
            <button onClick={saveWorkflow} style={{ background: '#10b981', color: '#fff', border: 'none', padding: '7px 16px', borderRadius: 6, cursor: 'pointer', fontWeight: 600 }}>
              Guardar Flujo
            </button>
            <span style={{ background: '#064e3b', color: '#34d399', border: '1px solid #059669', padding: '4px 10px', borderRadius: 20, fontSize: 12, fontWeight: 500 }}>
              🛡️ 2FA Verificado
            </span>
          </div>
        )}
      </header>

      {/* Pantalla de Login con Tarjeta Centrada */}
      {!authToken ? (
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
          <div style={{ background: '#1e293b', width: '100%', maxWidth: 420, padding: 30, borderRadius: 12, border: '1px solid #334155', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.5)' }}>
            <h2 style={{ marginTop: 0, marginBottom: 8, fontSize: 22, textAlign: 'center' }}>Iniciar Sesión</h2>
            <p style={{ color: '#94a3b8', fontSize: 13, textAlign: 'center', marginBottom: 20 }}>Ingresa a tu cuenta segura con 2FA en TopsFlow</p>

            {message && <div style={{ background: '#064e3b', color: '#34d399', padding: 10, borderRadius: 6, fontSize: 13, marginBottom: 15 }}>{message}</div>}
            {error && <div style={{ background: '#7f1d1d', color: '#fca5a5', padding: 10, borderRadius: 6, fontSize: 13, marginBottom: 15 }}>{error}</div>}

            <label style={{ fontSize: 12, color: '#cbd5e1' }}>Correo electrónico</label>
            <input placeholder="usuario@dominio.com" value={email} onChange={e => setEmail(e.target.value)} style={{ width: '92%', padding: 10, background: '#0f172a', border: '1px solid #475569', color: '#fff', borderRadius: 6, marginTop: 4, marginBottom: 12 }} />

            <label style={{ fontSize: 12, color: '#cbd5e1' }}>Contraseña</label>
            <input placeholder="••••••••" type="password" value={password} onChange={e => setPassword(e.target.value)} style={{ width: '92%', padding: 10, background: '#0f172a', border: '1px solid #475569', color: '#fff', borderRadius: 6, marginTop: 4, marginBottom: 20 }} />

            <button onClick={loginUser} style={{ width: '100%', padding: 10, background: '#3b82f6', color: '#fff', border: 'none', borderRadius: 6, fontWeight: 600, cursor: 'pointer' }}>Continuar</button>

            {userId && (
              <div style={{ marginTop: 20, paddingTop: 15, borderTop: '1px solid #334155' }}>
                <button onClick={setup2FA} style={{ width: '100%', padding: 8, background: '#475569', color: '#fff', border: 'none', borderRadius: 6, marginBottom: 12, cursor: 'pointer' }}>Escanear QR 2FA</button>
                {qrCode && <img src={qrCode} alt="QR 2FA" style={{ display: 'block', margin: '0 auto 12px auto', border: '4px solid #fff', borderRadius: 6, width: 140 }} />}
                <input placeholder="Código de 6 dígitos" value={token2FA} onChange={e => setToken2FA(e.target.value)} style={{ width: '92%', padding: 10, background: '#0f172a', border: '1px solid #475569', color: '#fff', borderRadius: 6, marginBottom: 12 }} />
                <button onClick={verify2FA} style={{ width: '100%', padding: 10, background: '#10b981', color: '#fff', border: 'none', borderRadius: 6, fontWeight: 600, cursor: 'pointer' }}>Validar 2FA e Iniciar Sesión</button>
              </div>
            )}
          </div>
        </div>
      ) : (
        /* Workspace del Editor de Flujos */
        <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
          
          {/* Panel Izquierdo / Sidebar */}
          <aside style={{ width: 260, background: '#1e293b', borderRight: '1px solid #334155', padding: 20, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div>
              <h3 style={{ fontSize: 13, textTransform: 'uppercase', color: '#64748b', letterSpacing: '0.5px', marginTop: 0 }}>Librería de Nodos</h3>
              <button onClick={() => addNode('Trigger')} style={{ width: '100%', padding: '10px 14px', marginBottom: 10, background: '#0f172a', color: '#60a5fa', border: '1px solid #1e3a8a', borderRadius: 6, cursor: 'pointer', textAlign: 'left', fontWeight: 500 }}>
                ⚡ Agregar Trigger
              </button>
              <button onClick={() => addNode('Action')} style={{ width: '100%', padding: '10px 14px', marginBottom: 10, background: '#0f172a', color: '#fbbf24', border: '1px solid #78350f', borderRadius: 6, cursor: 'pointer', textAlign: 'left', fontWeight: 500 }}>
                ⚙️ Agregar Acción
              </button>

              <hr style={{ borderColor: '#334155', margin: '20px 0' }} />

              <h3 style={{ fontSize: 13, textTransform: 'uppercase', color: '#64748b', letterSpacing: '0.5px' }}>Flujos Guardados</h3>
              <div style={{ maxHeight: 220, overflowY: 'auto' }}>
                {savedWorkflows.map(wf => (
                  <div 
                    key={wf.id} 
                    onClick={() => loadWorkflow(wf)}
                    style={{ 
                      padding: 10, 
                      background: currentWorkflowId === wf.id ? '#334155' : '#0f172a', 
                      border: '1px solid #475569', 
                      borderRadius: 6, 
                      marginBottom: 8, 
                      cursor: 'pointer',
                      fontSize: 13,
                      color: '#f8fafc'
                    }}
                  >
                    📄 {wf.title}
                  </div>
                ))}
              </div>
            </div>

            <button onClick={executeCurrentWorkflow} style={{ width: '100%', padding: 12, background: '#2563eb', color: '#fff', border: 'none', borderRadius: 6, cursor: 'pointer', fontWeight: 600, fontSize: 14 }}>
              ▶ Ejecutar Flujo
            </button>
          </aside>

          {/* Lienzo del Canvas */}
          <main style={{ flex: 1, position: 'relative', background: '#090d16' }}>
            <ReactFlow nodes={nodes} edges={edges} onNodesChange={onNodesChange} onEdgesChange={onEdgesChange} onConnect={onConnect} fitView>
              <Controls style={{ button: { background: '#1e293b', color: '#fff', border: '1px solid #475569' } }} />
              <Background color="#334155" gap={20} size={1} />
            </ReactFlow>
          </main>

          {/* Terminal / Panel de Salida */}
          {executionLog && (
            <aside style={{ width: 320, background: '#020617', borderLeft: '1px solid #1e293b', padding: 15, fontFamily: 'monospace', fontSize: 12, overflowY: 'auto' }}>
              <h4 style={{ color: '#38bdf8', marginTop: 0, borderBottom: '1px solid #1e293b', paddingBottom: 8 }}>Terminal de Consola</h4>
              <pre style={{ color: '#a7f3d0', margin: 0, whiteSpace: 'pre-wrap' }}>{JSON.stringify(executionLog, null, 2)}</pre>
            </aside>
          )}
        </div>
      )}
    </div>
  );
}
`;

fs.writeFileSync(path.join(__dirname, 'apps/frontend/src/App.jsx'), originalStyledAppContent, 'utf8');
console.log('✅ Interfaz actualizada con la estética profesional del proyecto original.');