const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { authenticator } = require('otplib');

const hashPassword = (password) => bcrypt.hash(password, 10);
const comparePassword = (password, hash) => bcrypt.compare(password, hash);

const generateToken = (payload) => {
  return jwt.sign(payload, process.env.JWT_SECRET || 'secret', { expiresIn: '8h' });
};

const generate2FASecret = (userEmail) => {
  const secret = authenticator.generateSecret();
  const otpauth = authenticator.keyuri(userEmail, 'TopsFlow', secret);
  return { secret, otpauth };
};

const verify2FAToken = (token, secret) => {
  return authenticator.verify({ token, secret });
};

module.exports = { hashPassword, comparePassword, generateToken, generate2FASecret, verify2FAToken };
