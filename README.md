# T.o.p.s Flow • Planificación Inteligente

> T.o.p.s Flow es un ecosistema dinámico de gestión de tiempo y productividad diseñado como una solución modular, rápida e intuitiva para estudiantes y jóvenes profesionales que necesitan equilibrar estudios, trabajos, proyectos y actividades personales.

---

## Tabla de Contenidos
1. [¿Qué es T.o.p.s Flow?](#qué-es-tops-flow)
2. [¿Cómo nace el proyecto?](#cómo-nace-el-proyecto)
3. [¿Para qué sirve? (Objetivo Principal)](#para-qué-sirve-objetivo-principal)
4. [Módulos del Sistema](#módulos-del-sistema)
5. [Características Clave](#características-clave)
6. [Arquitectura del Proyecto](#arquitectura-del-proyecto)
7. [Instalación y Uso](#instalación-y-uso)

---

## ¿Qué es T.o.p.s Flow?

T.o.p.s Flow es una aplicación web responsiva enfocada en la productividad moderna. Ofrece una interfaz limpia, visual e intuitiva diseñada para adaptarse al ritmo acelerado de estudiantes universitarios, practicantes y jóvenes trabajadores. 

A diferencia de las herramientas tradicionales saturadas de opciones complejas, T.o.p.s Flow simplifica la organización centralizando tu carga horaria, tareas ágiles, calendario integrado y ciclo de vida de proyectos en un solo lugar.

---

## ¿Cómo nace el proyecto?

El proyecto surge de una problemática común en la vida académica y profesional joven: la fragmentación del tiempo y el sobreesfuerzo. 

Al intentar balancear múltiples compromisos —como ramos universitarios, proyectos de titulación (Capstone), trabajos a tiempo parcial o remoto ("pegas/Lopas") y la vida personal—, las herramientas existentes solían ser demasiado rígidas o complejas.

T.o.p.s Flow nace para romper los monolitos de software y ofrecer un sistema modular, liviano y personalizable, donde cada usuario pueda visualizar rápidamente su carga semanal, ejecutar proyectos por fases y adaptar la plataforma a sus gustos estéticos mediante motores de temas.

---

## ¿Para qué sirve?

T.o.p.s Flow está diseñado para optimizar, planificar y gestionar eficientemente tus tiempos. Te ayuda a:

* **Visualizar tu rutina semanal:** Calcula automáticamente las horas semanales dedicadas a estudios, trabajo y actividades con códigos de colores personalizables.
* **Gestionar tareas con agilidad:** Organiza entregables en sprints visuales usando un tablero Kanban interactivo con puntos de esfuerzo y estados.
* **Navegar en un Calendario Unificado:** Visualiza tus actividades y tareas registradas en vistas Mensual, Diaria y Anual.
* **Acompañar proyectos de principio a fin:** Controla el ciclo de vida de tus proyectos (Inicio, Desarrollo, Pruebas y Entrega) con barras de progreso y fechas límite.
* **Reducir la fatiga visual:** Personaliza la interfaz en tiempo real mediante múltiples temas visuales (Claro, Oscuro, Vintage, etc.).
* **Exportar tus informes:** Genera reportes en PDF perfectamente optimizados en formato A4 Horizontal.

---

## Módulos del Sistema

| Módulo | Descripción | Estado |
| :--- | :--- | :---: |
| **1. Horario Semestral** | Matriz semanal interactiva con suma automática de horas por categoría, código de colores y persistencia de datos. | Completado |
| **2. Gestión Ágil (Kanban)** | Tablero visual dividido por etapas (*Por Hacer*, *En Desarrollo*, *Completado*) con tarjetas modificables y puntos de esfuerzo. | Completado |
| **3. Calendario Integrado** | Navegación entre vistas Mensual, Diaria y Anual que sincroniza eventos del horario y tareas de la base de datos local. | Completado |
| **4. Gestión de Proyectos** | Administrador del ciclo de vida de proyectos (Planificación, Ejecución, Pruebas, Entrega) con métricas de progreso global. | Completado |
| **5. Archivero de Informes** | Módulo de vinculación y gestión de documentos, minutas y entregables integrados con Google Drive. | En Desarrollo |

---

## Características Clave

* **Carga Modular Dinámica:** Inyecta vistas HTML/CSS/JS bajo demanda, garantizando un rendimiento fluido sin recargas de página completas.
* **Persistencia Local (`localStorage`):** Guarda tus horarios, tarjetas Kanban, eventos y proyectos directamente en tu navegador de forma privada.
* **Motor de Temas Dinámico:** Permite alternar entre diferentes paletas estéticas adaptando bordes, fondos y colores de acento.
* **Exportación PDF:** Estilos CSS dedicados mediante `@media print` para exportar el horario semestral en formato A4 Horizontal listo para imprimir.

---

## Arquitectura del Proyecto

```text
tops-flow/
├── index.html              # Shell principal (Sidebar, Header y Contenedor)
├── styles.css              # Variables de color (Temas) y componentes globales
├── app.js                  # Router dinámico y Motor de Temas
├── modules/                # Componentes HTML cargados dinámicamente
│   ├── horario.html
│   ├── kanban.html
│   ├── calendario.html
│   ├── gantt.html          # Vista de Gestión de Proyectos
│   └── informes.html       # Vista de Archivero (En Desarrollo)
├── css/                    # Hojas de estilo modularizadas
│   ├── horario.css
│   ├── kanban.css
│   ├── calendario.css
│   ├── gantt.css
│   └── informes.css
└── js/                     # Lógica de negocio por módulo
    ├── horario.js
    ├── kanban.js
    ├── calendario.js
    ├── gantt.js
    └── informes.js
