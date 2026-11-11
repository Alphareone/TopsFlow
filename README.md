# ⚡ TopsFlow Enterprise v2.0.0

Plataforma de ingeniería de software y gestión integral de proyectos diseñada bajo los principios de **Clean Architecture** y arquitectura **Monorepo**. Proporciona una suite de herramientas avanzadas orientada tanto a desarrolladores *Junior* (planificación y aprendizaje guiado) como a *Senior / Lead Architects* (métricas de alto impacto, pipelines CI/CD y trazabilidad de KPIs).

---

## 🎨 Características Principales

* **🔒 Autenticación Criptográfica 2FA:** Inicio de sesión seguro basado en TOTP y generación de tokens JWT.
* **🖥️ Layout ERP / CRM Enterprise:** Interfaz de alta densidad de datos con **Icon-Rail**, barra superior de pestañas recientes y **Inspector Drawer** lateral.
* **🖼️ Motor de Personalización & Glassmorphism:** Soporte para imágenes de fondo personalizadas con filtrado adaptativo de contraste (*backdrop blur*) y temas dinámicos.
* **🌐 Soporte Multilingüe (i18n):** Cambio de idioma en tiempo real (Español / Inglés) con persistencia local.
* **📅 Planificación Adaptativa (8:00 - 20:00 h):** Gestión de bloques de tiempo con validación inteligente contra traslapes de horario.
* **📊 Gestión Ágil (Kanban) y Roadmap:** Tablero de sprints con estimación de puntos de esfuerzo y seguimiento por fases de desarrollo.
* **📈 Dashboard de Alcances & KPIs:** Indicadores clave personalizables según el tipo de proyecto (*Software, Investigación/Capstone, Operaciones, Marketing*).
* **🧪 Monitor de CI/CD & Calidad (QA):** Supervisión en tiempo real de pipelines de compilación, cobertura de pruebas unitarias y nivel de deuda técnica.

---

## 🏗️ Arquitectura del Monorepo

```text
TopsFlow-mvp/
├── apps/
│   ├── backend/                     # API REST (Node.js + Express)
│   │   ├── src/
│   │   │   ├── app.js               # Entry point de Express y middlewares
│   │   │   ├── core/engine.js       # Motor de ejecución de flujos
│   │   │   └── utils/auth.js        # Utilidades de seguridad (JWT, TOTP 2FA)
│   │   └── package.json
│   │
│   └── frontend/                    # Single Page Application (React + Vite)
│       ├── src/
│       │   ├── components/          # Componentes UI globales (Sidebar, Header, Drawer, Icon)
│       │   ├── features/            # Módulos de dominio desacoplados
│       │   │   ├── architecture/    # Diseñador de arquitectura & Stack
│       │   │   ├── auth/            # Autenticación y 2FA TOTP
│       │   │   ├── calendar/        # Calendario dinámico
│       │   │   ├── cicd/            # Pipeline CI/CD & QA Metrics
│       │   │   ├── dashboard/       # Dashboard de Alcances & KPIs
│       │   │   ├── kanban/          # Tablero Ágil de Sprints
│       │   │   ├── projects/        # Ciclo de Vida de Proyectos
│       │   │   └── schedule/        # Horario adaptativo anti-choque
│       │   ├── services/            # Cliente HTTP e i18n
│       │   ├── styles/              # Estilos globales y Glassmorphism
│       │   ├── App.jsx              # Enrutador principal de la app
│       │   └── main.jsx             # Punto de entrada Vite
│       └── package.json
│
├── packages/
│   └── database/                    # Capa de datos (Prisma ORM + PostgreSQL)
│       └── prisma/
│           └── schema.prisma
│
├── scripts/                         # Utilidades internas de compilación y parches
├── docker-compose.yml               # Orquestación de base de datos PostgreSQL
├── vite.config.js                   # Configuración del frontend para entorno y GitHub Pages
└── package.json                     # Root Workspaces
🚀 Requisitos Previos
Asegúrate de contar con el siguiente software instalado en tu equipo antes de comenzar:

Node.js (v18.0.0 o superior)

npm (v9.0.0 o superior)

Git

(Opcional) Docker & Docker Compose (para ejecutar la base de datos PostgreSQL en contenedor)
```
## 🛠️ Instrucciones de Levantamiento Local

### 1. Clonar el Repositorio

```bash
git clone https://github.com/Alphareone/TopsFlow.git
cd Tops-Flow-mvp
```

### 2. Instalar Dependencias

Dado que el proyecto utiliza Workspaces de npm, la instalación en la raíz instalará automáticamente las dependencias del frontend, backend y paquetes compartidos:

```bash
npm install
```

### 3. Configurar Variables de Entorno

Crea un archivo `.env` en la raíz del proyecto (o dentro de `apps/backend/` y `packages/database/`) tomando como base el siguiente modelo:

```env
# Servidor Backend
PORT=5000
JWT_SECRET=tu_secreto_super_seguro_jwt

# Base de Datos PostgreSQL
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/topsflow_db?schema=public"
```

### 4. Inicializar la Base de Datos (Opcional)

Si utilizas PostgreSQL vía Docker:

```bash
# Iniciar contenedor de PostgreSQL
docker-compose up -d

# Generar cliente de Prisma y ejecutar migraciones
npm run prisma:generate --workspace=packages/database
npm run prisma:migrate --workspace=packages/database
```

> **Nota:** La aplicación frontend cuenta con un fallback activo a `localStorage`, permitiendo probar la interfaz completa y todas las funcionalidades interactivas sin requerir una conexión obligatoria a PostgreSQL.

### 5. Iniciar la Aplicación en Modo Desarrollo

Ejecuta la suite de desarrollo en paralelo desde la raíz:

```bash
# Iniciar Frontend (Vite)
npm run dev --workspace=apps/frontend
```

O si deseas levantar la aplicación compilándola y ejecutándola directamente:

```bash
npm run dev
```

El frontend estará disponible de inmediato en tu navegador en:
👉 http://localhost:3000/ (o http://localhost:5173/ según puerto libre disponible).

---

## 📦 Despliegue en GitHub Pages

El proyecto incluye la configuración para desplegar la SPA de React directamente a GitHub Pages:

```bash
# 1. Ejecutar script de preparación de arquitectura
node setup-deploy-ready.js

# 2. Compilar y publicar en la rama gh-pages
npm run deploy
```

La aplicación en producción quedará publicada en:
👉 https://Alphareone.github.io/TopsFlow/

---

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Consulta el archivo `LICENSE` para más detalles.
