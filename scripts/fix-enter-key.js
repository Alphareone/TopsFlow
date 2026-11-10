const fs = require('fs');
const path = require('path');

const currentAppJsxPath = path.join(__dirname, 'apps/frontend/src/App.jsx');
let content = fs.readFileSync(currentAppJsxPath, 'utf8');

// Reemplazar la estructura del Login por un formulario accesible con Enter
const loginFormSnippet = `
          <form onSubmit={(e) => { e.preventDefault(); loginUser(); }}>
            <div style={{ marginBottom: 12 }}>
              <label style={{ fontSize: 12, color: '#cbd5e1', display: 'block', marginBottom: 4 }}>Correo electrónico</label>
              <input placeholder="usuario@duocuc.cl" value={email} onChange={e => setEmail(e.target.value)} style={{ width: '92%', padding: 10, background: '#0f172a', border: '1px solid #475569', color: '#fff', borderRadius: 6 }} />
            </div>

            <div style={{ marginBottom: 20 }}>
              <label style={{ fontSize: 12, color: '#cbd5e1', display: 'block', marginBottom: 4 }}>Contraseña</label>
              <input placeholder="••••••••" type="password" value={password} onChange={e => setPassword(e.target.value)} style={{ width: '92%', padding: 10, background: '#0f172a', border: '1px solid #475569', color: '#fff', borderRadius: 6 }} />
            </div>

            <button type="submit" style={{ width: '100%', padding: 12, background: '#2563eb', color: '#fff', border: 'none', borderRadius: 6, fontWeight: 600, cursor: 'pointer', fontSize: 14 }}>
              Ingresar
            </button>
          </form>

          {userId && (
            <div style={{ marginTop: 20, paddingTop: 20, borderTop: '1px solid #334155' }}>
              <button type="button" onClick={setup2FA} style={{ width: '100%', padding: 9, background: '#475569', color: '#fff', border: 'none', borderRadius: 6, marginBottom: 12, cursor: 'pointer', fontSize: 13 }}>
                📷 Generar / Ver QR 2FA
              </button>
              
              {qrCode && (
                <div style={{ textAlign: 'center', marginBottom: 15 }}>
                  <img src={qrCode} alt="QR 2FA" style={{ border: '4px solid #fff', borderRadius: 8, width: 140 }} />
                  <p style={{ fontSize: 11, color: '#94a3b8', marginTop: 5 }}>Escanea con Google Authenticator o Authy</p>
                </div>
              )}

              <form onSubmit={(e) => { e.preventDefault(); verify2FA(); }}>
                <label style={{ fontSize: 12, color: '#cbd5e1', display: 'block', marginBottom: 4 }}>Código 2FA (6 dígitos)</label>
                <input placeholder="Ej: 123456" value={token2FA} onChange={e => setToken2FA(e.target.value)} style={{ width: '92%', padding: 10, background: '#0f172a', border: '1px solid #475569', color: '#fff', borderRadius: 6, marginBottom: 15 }} />
                
                <button type="submit" style={{ width: '100%', padding: 12, background: '#16a34a', color: '#fff', border: 'none', borderRadius: 6, fontWeight: 600, cursor: 'pointer', fontSize: 14 }}>
                  🔒 Validar 2FA y Entrar
                </button>
              </form>
            </div>
          )
`;

// Reemplazar la sección de inputs por los formularios con soporte para Enter
content = content.replace(
  /<div style={{ marginBottom: 12 }}>[\s\S]*?<\/div>\s*<\/div>\s*\)/,
  `${loginFormSnippet}\n        </div>\n      </div>\n    );`
);

fs.writeFileSync(currentAppJsxPath, content, 'utf8');
console.log('✅ Soporte para la tecla Enter agregado a los formularios de Login y 2FA.');