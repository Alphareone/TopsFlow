const fs = require('fs');
const path = require('path');

const reactFlowAppContent = `import React, { useState, useCallback } from 'react';
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
  { id: '1', type: 'input', data: { label: '⚡ Trigger: Inicio Evento' }, position: { x: 100, y: 100 } },
  { id: '2', type: 'output', data: { label: '📧 Action: Enviar Email' }, position: { x: 400, y: 100 } },
];

const initialEdges = [{ id: 'e1-2', source: '1', target: '2' }];

export default function App() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [userId, setUserId] = useState(null);
  const [qrCode, setQrCode] = useState('');
  const [token2FA, setToken2FA] = useState('');
  const [authToken, setAuthToken] = useState('');

  // Estados de React Flow
  const [nodes, setNodes] = useState(initialNodes);
  const [edges, setEdges] = useState(initialEdges);
  const [executionLog, setExecutionLog] = useState(null);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const onNodesChange = useCallback((changes) => setNodes((nds) => applyNodeChanges(changes, nds)), []);
  const onEdgesChange = useCallback((changes) => setEdges((eds) => applyEdgeChanges(changes, eds)), []);
  const onConnect = useCallback((params) => setEdges((eds) => addEdge(params, eds)), []);

  const loginUser = async () => {
    setMessage(''); setError('');
    try {
      const res = await axios.post('http://localhost:4000/api/auth/login', { email, password });
      setUserId(res.data.userId);
      setMessage('Usuario autenticado. Genera o ingresa tu 2FA.');
    } catch (err) {
      setError(err.response?.data?.error || 'Error al iniciar sesión.');
    }
  };

  const setup2FA = async () => {
    try {
      const res = await axios.post('http://localhost:4000/api/auth/2fa/setup', { userId });
      setQrCode(res.data.qrCodeUrl);
    } catch (err) {
      setError('Error al obtener QR.');
    }
  };

  const verify2FA = async () => {
    setMessage(''); setError('');
    try {
      const res = await axios.post('http://localhost:4000/api/auth/2fa/verify', { userId, token: token2FA });
      setAuthToken(res.data.token);
      setMessage('¡Sesión 2FA Activada!');
    } catch (err) {
      setError('Código 2FA incorrecto.');
    }
  };

  const addNode = (type) => {
    const id = (nodes.length + 1).toString();
    const newNode = {
      id,
      type: type === 'Trigger' ? 'input' : 'output',
      data: { label: \`\${type === 'Trigger' ? '⚡ Trigger' : '⚙️ Action'}: Nodo \${id}\` },
      position: { x: Math.random() * 300 + 50, y: Math.random() * 300 + 50 }
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
      const res = await axios.post('http://localhost:4000/api/workflows/run', { nodes: formattedNodes, edges });
      setExecutionLog(res.data);
    } catch (err) {
      setError('Error al ejecutar el flujo visual.');
    }
  };

  return (
    <div style={{ fontFamily: 'Segoe UI, sans-serif', height: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      <header style={{ background: '#1e293b', color: '#fff', padding: '15px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2 style={{ margin: 0, fontSize: 20 }}>TopsFlow Enterprise Workflow Builder</h2>
        {authToken && <span style={{ background: '#10b981', padding: '4px 12px', borderRadius: 20, fontSize: 13 }}>🟢 Autenticado con 2FA</span>}
      </header>

      {/* Pantalla de Login / 2FA */}
      {!authToken ? (
        <div style={{ maxWidth: 450, margin: '40px auto', padding: 25, border: '1px solid #e2e8f0', borderRadius: 8, boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }}>
          <h3>Iniciar Sesión y Validar 2FA</h3>
          {message && <p style={{ color: '#059669', fontSize: 14 }}>{message}</p>}
          {error && <p style={{ color: '#dc2626', fontSize: 14 }}>{error}</p>}

          <input placeholder="Correo electrónico" value={email} onChange={e => setEmail(e.target.value)} style={{ width: '93%', padding: 10, marginBottom: 10 }} />
          <input placeholder="Contraseña" type="password" value={password} onChange={e => setPassword(e.target.value)} style={{ width: '93%', padding: 10, marginBottom: 10 }} />
          <button onClick={loginUser} style={{ width: '100%', padding: 10, background: '#3b82f6', color: '#fff', border: 'none', borderRadius: 4, cursor: 'pointer' }}>Ingresar</button>

          {userId && (
            <div style={{ marginTop: 15, borderTop: '1px solid #eee', paddingTop: 15 }}>
              <button onClick={setup2FA} style={{ width: '100%', padding: 8, background: '#64748b', color: '#fff', border: 'none', borderRadius: 4, marginBottom: 10 }}>Ver QR 2FA</button>
              {qrCode && <img src={qrCode} alt="QR" style={{ display: 'block', margin: '0 auto 10px auto', width: 150 }} />}
              <input placeholder="Código 2FA de 6 dígitos" value={token2FA} onChange={e => setToken2FA(e.target.value)} style={{ width: '93%', padding: 10, marginBottom: 10 }} />
              <button onClick={verify2FA} style={{ width: '100%', padding: 10, background: '#10b981', color: '#fff', border: 'none', borderRadius: 4, cursor: 'pointer' }}>Validar Acceso</button>
            </div>
          )}
        </div>
      ) : (
        /* Panel del Canvas Visual */
        <div style={{ display: 'flex', flex: 1 }}>
          {/* Barra lateral de herramientas */}
          <div style={{ width: 220, background: '#f8fafc', borderRight: '1px solid #e2e8f0', padding: 15 }}>
            <h4 style={{ marginTop: 0 }}>Paleta de Nodos</h4>
            <button onClick={() => addNode('Trigger')} style={{ width: '100%', padding: 8, marginBottom: 8, background: '#e0e7ff', border: '1px solid #c7d2fe', borderRadius: 4, cursor: 'pointer' }}>+ Agregar Trigger</button>
            <button onClick={() => addNode('Action')} style={{ width: '100%', padding: 8, marginBottom: 8, background: '#fef3c7', border: '1px solid #fde68a', borderRadius: 4, cursor: 'pointer' }}>+ Agregar Acción</button>
            <hr style={{ margin: '15px 0' }} />
            <button onClick={executeCurrentWorkflow} style={{ width: '100%', padding: 10, background: '#2563eb', color: '#fff', border: 'none', borderRadius: 4, cursor: 'pointer', fontWeight: 'bold' }}>▶ Ejecutar Flujo</button>
          </div>

          {/* Lienzo Interactivo */}
          <div style={{ flex: 1, position: 'relative' }}>
            <ReactFlow nodes={nodes} edges={edges} onNodesChange={onNodesChange} onEdgesChange={onEdgesChange} onConnect={onConnect} fitView>
              <Controls />
              <Background color="#ccc" gap={16} />
            </ReactFlow>
          </div>

          {/* Consola de Salida / Logs */}
          {executionLog && (
            <div style={{ width: 300, background: '#0f172a', color: '#38bdf8', padding: 15, fontSize: 12, overflowY: 'auto' }}>
              <h4 style={{ color: '#fff', marginTop: 0 }}>Terminal de Salida</h4>
              <pre>{JSON.stringify(executionLog, null, 2)}</pre>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
`;

fs.writeFileSync(path.join(__dirname, 'apps/frontend/src/App.jsx'), reactFlowAppContent, 'utf8');
console.log('✅ Visual Builder integrado con éxito en App.jsx.');