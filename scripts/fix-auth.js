const fs = require('fs');
const path = require('path');

const appContent = `const express = require('express');
const cors = require('cors');
const QRCode = require('qrcode');
const { prisma } = require('@topsflow/database');
const { hashPassword, comparePassword, generateToken, generate2FASecret, verify2FAToken } = require('./utils/auth');
const { executeWorkflow } = require('./core/engine');

const app = express();

app.use(cors());
app.use(express.json());

// 1. Registro de usuario
app.post('/api/auth/register', async (req, res) => {
  const { email, password } = req.body;
  try {
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ error: 'El correo electrónico ya está registrado.' });
    }

    const passwordHash = await hashPassword(password);
    const user = await prisma.user.create({ data: { email, passwordHash } });
    res.json({ message: 'Usuario registrado con éxito', userId: user.id });
  } catch (e) {
    res.status(500).json({ error: 'Error interno al registrar usuario: ' + e.message });
  }
});

// 2. Configuración y entrega de QR 2FA
app.post('/api/auth/2fa/setup', async (req, res) => {
  const { userId } = req.body;
  try {
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) return res.status(404).json({ error: 'Usuario no encontrado' });

    const { secret, otpauth } = generate2FASecret(user.email);
    await prisma.user.update({
      where: { id: userId },
      data: { twoFactorSecret: secret }
    });

    const qrCodeUrl = await QRCode.toDataURL(otpauth);
    res.json({ qrCodeUrl, secret });
  } catch (e) {
    res.status(500).json({ error: 'Error al generar clave 2FA: ' + e.message });
  }
});

// 3. Verificación de token TOTP (6 dígitos)
app.post('/api/auth/2fa/verify', async (req, res) => {
  const { userId, token } = req.body;
  try {
    const user = await prisma.user.findUnique({ where: { id: userId } });

    if (!user || !user.twoFactorSecret) {
      return res.status(400).json({ error: 'Primero debes generar la clave 2FA' });
    }

    const isValid = verify2FAToken(token, user.twoFactorSecret);
    if (!isValid) {
      return res.status(401).json({ error: 'Código 2FA incorrecto o expirado' });
    }

    await prisma.user.update({
      where: { id: userId },
      data: { twoFactorEnabled: true }
    });

    const jwtToken = generateToken({ id: user.id, email: user.email });
    res.json({ message: 'Autenticación exitosa', token: jwtToken });
  } catch (e) {
    res.status(500).json({ error: 'Error al validar 2FA: ' + e.message });
  }
});

// 4. Ejecución del motor de flujos
app.post('/api/workflows/run', async (req, res) => {
  const { nodes, edges } = req.body;
  try {
    const output = await executeWorkflow(nodes, edges);
    res.json({ status: 'COMPLETED', output });
  } catch (error) {
    res.status(500).json({ status: 'FAILED', error: error.message });
  }
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(\`🚀 Servidor Backend activo en http://localhost:\${PORT}\`);
});
`;

fs.writeFileSync(path.join(__dirname, 'apps/backend/src/app.js'), appContent, 'utf8');
console.log('✅ Servidor backend actualizado con verificación de tokens optimizada.');