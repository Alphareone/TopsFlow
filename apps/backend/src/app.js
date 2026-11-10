const express = require('express');
const cors = require('cors');
const QRCode = require('qrcode');
const { prisma } = require('@topsflow/database');
const { hashPassword, comparePassword, generateToken, generate2FASecret, verify2FAToken } = require('./utils/auth');
const { executeWorkflow } = require('./core/engine');

const app = express();

app.use(cors());
app.use(express.json());

// --- AUTENTICACIÓN ---
app.post('/api/auth/register', async (req, res) => {
  const { email, password } = req.body;
  try {
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) return res.status(400).json({ error: 'El correo electrónico ya está registrado.' });

    const passwordHash = await hashPassword(password);
    const user = await prisma.user.create({ data: { email, passwordHash } });
    res.json({ message: 'Usuario registrado con éxito', userId: user.id });
  } catch (e) {
    res.status(500).json({ error: 'Error al registrar: ' + e.message });
  }
});

app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return res.status(400).json({ error: 'Usuario no encontrado.' });

    const validPassword = await comparePassword(password, user.passwordHash);
    if (!validPassword) return res.status(400).json({ error: 'Contraseña incorrecta.' });

    res.json({ message: 'Login exitoso', userId: user.id, twoFactorEnabled: user.twoFactorEnabled });
  } catch (e) {
    res.status(500).json({ error: 'Error al iniciar sesión: ' + e.message });
  }
});

app.post('/api/auth/2fa/setup', async (req, res) => {
  const { userId } = req.body;
  try {
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) return res.status(404).json({ error: 'Usuario no encontrado' });

    let secret = user.twoFactorSecret;
    if (!secret) {
      const generated = generate2FASecret(user.email);
      secret = generated.secret;
      await prisma.user.update({ where: { id: userId }, data: { twoFactorSecret: secret } });
    }

    const { authenticator } = require('otplib');
    const otpauth = authenticator.keyuri(user.email, 'TopsFlow', secret);
    const qrCodeUrl = await QRCode.toDataURL(otpauth);

    res.json({ qrCodeUrl, secret });
  } catch (e) {
    res.status(500).json({ error: 'Error al generar clave 2FA: ' + e.message });
  }
});

app.post('/api/auth/2fa/verify', async (req, res) => {
  const { userId, token } = req.body;
  try {
    const user = await prisma.user.findUnique({ where: { id: userId } });

    if (!user || !user.twoFactorSecret) return res.status(400).json({ error: 'Genera la clave 2FA primero.' });

    const isValid = verify2FAToken(token, user.twoFactorSecret);
    if (!isValid) return res.status(401).json({ error: 'Código 2FA incorrecto o expirado' });

    await prisma.user.update({ where: { id: userId }, data: { twoFactorEnabled: true } });
    const jwtToken = generateToken({ id: user.id, email: user.email });

    res.json({ message: 'Autenticación exitosa', token: jwtToken });
  } catch (e) {
    res.status(500).json({ error: 'Error al validar 2FA: ' + e.message });
  }
});

// --- PERSISTENCIA DE FLUJOS (PERSISTENCE LAYER) ---

// Guardar o Actualizar Flujo
app.post('/api/workflows/save', async (req, res) => {
  const { userId, title, nodes, edges, workflowId } = req.body;
  try {
    let workflow;
    if (workflowId) {
      workflow = await prisma.workflow.update({
        where: { id: workflowId },
        data: { title, nodesJson: nodes, edgesJson: edges }
      });
    } else {
      workflow = await prisma.workflow.create({
        data: {
          title: title || 'Nuevo Flujo de Trabajo',
          nodesJson: nodes,
          edgesJson: edges,
          userId
        }
      });
    }
    res.json({ message: 'Flujo guardado con éxito', workflow });
  } catch (error) {
    res.status(500).json({ error: 'Error al guardar el flujo: ' + error.message });
  }
});

// Obtener Flujos por Usuario
app.get('/api/workflows/user/:userId', async (req, res) => {
  try {
    const workflows = await prisma.workflow.findMany({
      where: { userId: req.params.userId },
      orderBy: { updatedAt: 'desc' }
    });
    res.json(workflows);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener flujos: ' + error.message });
  }
});

// --- MOTOR DE EJECUCIÓN CON PERSISTENCIA DE AUDITORÍA ---
app.post('/api/workflows/run', async (req, res) => {
  const { nodes, edges, workflowId } = req.body;
  try {
    const output = await executeWorkflow(nodes, edges);

    // Registro histórico en la base de datos (Execution Log)
    if (workflowId) {
      await prisma.execution.create({
        data: {
          workflowId,
          status: 'SUCCESS',
          logs: output
        }
      });
    }

    res.json({ status: 'COMPLETED', output });
  } catch (error) {
    res.status(500).json({ status: 'FAILED', error: error.message });
  }
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`🚀 Servidor Backend activo en http://localhost:${PORT}`);
});
