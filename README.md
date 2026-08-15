Aquí tienes el **`README.md`** completamente actualizado y estructurado con un formato profesional, listo para documentar la arquitectura modular, el nuevo módulo de **Control de Cambios** y las capacidades completas de **T.o.p.s Flow**.

---

```markdown
# ⚡ T.o.p.s Flow • Ecosistema de Planificación Inteligente

> **Organiza, Gestiona & Optimiza.**
> Un ecosistema web modular de alta eficiencia diseñado para la gestión del tiempo académico, proyectos profesionales y coordinación ágil de tareas.

![Versión](https://img.shields.io/badge/Versi%C3%B3n-v1.1.0-blue?style=for-the-badge)
![Estado](https://img.shields.io/badge/Estado-En_Desarrollo_Activo-10b981?style=for-the-badge)
![Licencia](https://img.shields.io/badge/Licencia-MIT-green?style=for-the-badge)

---

## 📌 Visión General

**T.o.p.s Flow** está diseñado bajo una arquitectura SPA (*Single Page Application*) ligera, puramente nativa (**Vanilla JavaScript, HTML5 y CSS3**), sin dependencias ni frameworks pesados. 

El sistema utiliza un **Router Asíncrono Dinámico** que inyecta en tiempo real las vistas, hojas de estilo y scripts controladores de cada módulo según la interacción del usuario, optimizando el rendimiento y manteniendo una separación clara de responsabilidades.

---

## 🧩 Módulos del Sistema

| # | Módulo | Icono | Descripción | Estado |
| :-: | :--- | :-: | :--- | :-: |
| **1** | **Gestión Horario** | 🕒 | Matriz semanal interactiva con cálculo automático de horas por categoría, asignación de colores y exportación a PDF. | **Estable** |
| **2** | **Gestión Ágil (Kanban)** | 📋 | Tablero visual por etapas (Por Hacer, En Desarrollo, Completado) con estimación de puntos de esfuerzo y prioridades. | **Estable** |
| **3** | **Calendario Integrado** | 📅 | Vistas dinámicas (Mensual, Diaria y Anual) con sincronización de eventos y actividades registradas. | **Estable** |
| **4** | **Gestión de Proyectos** | 📊 | Administrador del ciclo de vida de proyectos con indicadores clave y barras de progreso dinámicas. | **Estable** |
| **5** | **Archivero de Informes** | 📁 | Módulo de gestión documental centralizada con almacenamiento local Base64 e integración de enlaces a Google Drive. | **En Desarrollo** |
| **6** | **Control de Cambios** | 📜 | Bitácora cronológica interactiva para dar seguimiento al historial de versiones, parches y características del software. | **Estable** |

---

## 🎨 Motor de Temas Dinámico

T.o.p.s Flow incluye un **Motor de Personalización Visual** completo administrado mediante CSS Variables y persistido en `localStorage`:

* ☀️ **Claro (Base):** Modo optimizado para entornos de alta iluminación.
* 🌙 **Oscuro:** Reduce la fatiga visual en entornos nocturnos.
* 📜 **Vintage:** Tonalidades cálidas y atenuadas.
* 🌸 **Pastel:** Paleta suave y moderna de tonos violetas.
* 🌊 **Ocean:** Inspirado en tonalidades profundas de azul marino.
* 🎨 **Personalizado (Custom):** Modal interactivo con *Color Pickers* para definir colores de fondo, tarjetas, bordes y acentos en tiempo real.

---

## 🛠️ Estructura del Proyecto

```text
tops-flow/
├── index.html              # Estructura principal (Layout, Sidebar & Footer)
├── styles.css              # Estilos globales y variables de temas
├── app.js                  # Router dinámico de módulos y motor de temas
│
├── modules/                # Vistas HTML inyectadas dinámicamente
│   ├── horario.html
│   ├── kanban.html
│   ├── calendario.html
│   ├── gantt.html
│   ├── informes.html
│   └── changelog.html
│
├── css/                    # Hojas de estilo independientes por módulo
│   ├── horario.css
│   ├── kanban.css
│   ├── calendario.css
│   ├── gantt.css
│   ├── informes.css
│   └── changelog.css
│
└── js/                     # Lógica y controladores específicos por módulo
    ├── horario.js
    ├── kanban.js
    ├── calendario.js
    ├── gantt.js
    ├── informes.js
    └── changelog.js

```

---

## 🚀 Instalación y Uso

No requiere compiladores, transpiladores ni instalación de dependencias vía Node/NPM.

1. **Clonar el repositorio:**
```bash
git clone [https://github.com/Alphareone/TopsFlow.git](https://github.com/Alphareone/TopsFlow.git)

```


2. **Navegar al directorio:**
```bash
cd TopsFlow

```


3. **Ejecutar el proyecto:**
Abre el archivo `index.html` en tu navegador de preferencia o utilízalo mediante una extensión de servidor local como *Live Server* en VS Code.

---

## 📜 Historial de Versiones (Changelog Resumido)

### 🚀 **v1.1.0** — *Agosto 2026 (En Desarrollo)*

* **Nuevo Módulo:** Se integró el **Control de Cambios & Bitácora de Versiones** (`changelog`).
* **Nuevo Módulo:** Integración del **Archivero de Informes** (`informes`) con soporte para persistencia local y Google Drive.
* **UI/UX:** Reestructuración del flujo DOM global integrando el `app-footer` dentro del contenedor principal reescalable.

### 🎉 **v1.0.0** — *15 Agosto 2026 (Lanzamiento Estable)*

* Despliegue del núcleo **SPA** con router dinámico de módulos.
* Modulos iniciales: **Horario Semestral**, **Tablero Kanban**, **Calendario** y **Proyectos**.
* Motor de temas con soporte para 5 paletas predefinidas y 1 modo 100% personalizable.

---

## 👥 Desarrollo & Créditos

Diseñado e implementado con pasión por:

* 💻 **Alphareone** — *Arquitectura & Desarrollo Lead*
* ⚡ **Gemini Core Engine** — *Co-piloto de Inteligencia Artificial & Optimización*

---

© 2026 **T.o.p.s Flow Dev Team**. Todos los derechos reservados.

```

```
