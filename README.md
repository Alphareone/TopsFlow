# ⚡ T.o.p.s Flow • Planificación Inteligente

> **T.o.p.s Flow** es un ecosistema dinámico de gestión de tiempo diseñado como una solución modular, rápida e intuitiva para estudiantes y jóvenes profesionales que necesitan equilibrar estudios, trabajo y proyectos personales.

---

## 📌 Tabla de Contenidos
1. [¿Qué es T.o.p.s Flow?](#-qué-es-tops-flow)
2. [¿Cómo nace el proyecto?](#-cómo-nace-el-proyecto)
3. [¿Para qué sirve? (Objetivo Principal)](#-para-qué-sirve-objetivo-principal)
4. [Módulos Principales](#-módulos-principales)
5. [Características Clave](#-características-clave)
6. [Arquitectura del Proyecto](#-arquitectura-del-proyecto)
7. [Instalación y Uso](#-instalación-y-uso)

---

## 🚀 ¿Qué es T.o.p.s Flow?

**T.o.p.s Flow** es una aplicación web responsiva enfocada en la productividad moderna. Ofrece una **interfaz limpia, visual e intuitiva** diseñada para adaptarse al ritmo acelerado de estudiantes universitarios, practicantes y jóvenes trabajadores. 

A diferencia de las herramientas de gestión tradicionales y saturadas de opciones complejas, T.o.p.s Flow simplifica la organización centralizando todas tus responsabilidades en un solo lugar.

---

## 💡 ¿Cómo nace el proyecto?

El proyecto surge de una problemática común en la vida académica y profesional joven: **la fragmentación del tiempo y el sobreesfuerzo**. 

Al intentar balancear múltiples compromisos —como ramos universitarios, proyectos de titulación (Capstone), trabajos a tiempo parcial o remoto ("Trabajos / pegas / chambas") y la vida personal—, las herramientas existentes solían ser o demasiado rígidas o demasiado complejas.

**T.o.p.s Flow** nace con la idea de romper los monolitos de software y crear un sistema **modular, liviano y personalizable**, donde cada persona pueda visualizar rápidamente su carga horaria, gestionar sus tareas en sprints ágiles y adaptar la plataforma a sus gustos estéticos.

---

## 🎯 ¿Para qué sirve?

T.o.p.s Flow está diseñado para **optimizar, planificar y gestionar eficientemente tus tiempos**. Te ayuda a:

* ⏱️ **Visualizar tu rutina semanal:** Calcula automáticamente la carga horaria semanal dedicada a estudios, trabajo y actividades.
* 📋 **Gestionar proyectos y tareas:** Organiza entregables y sprints mediante un tablero Kanban interactivo con puntos de esfuerzo y prioridades.
* 🎨 **Reducir la fatiga visual:** Personaliza la interfaz con múltiples temas (Dark, Light, Vintage, Pastel, Ocean) o mediante un selector de colores personalizado.
* 📄 **Exportar tus informes:** Genera reportes en PDF perfectamente optimizados en formato A4 Horizontal para imprimir o compartir.

---

## 🧩 Módulos del Sistema

| Módulo | Función Principal | Estado |
| :--- | :--- | :---: |
| **1. Horario Semestral** | Matriz semanal interactiva con suma automática de horas por categoría, código de colores y soporte *Drag & Drop*. | 🟢 Listo |
| **2. Gestión Ágil (Kanban)** | Tablero visual dividido por etapas (*Por Hacer*, *En Desarrollo*, *Completado*) con tarjetas modificables, asignación de responsables y puntos de esfuerzo. | 🟢 Listo |
| **3. Calendario** | Vista mensual/semanal para seguimiento de hitos importantes y fechas límite. | 🟡 En plantilla |
| **4. Diagrama Gantt** | Cronograma de líneas de tiempo para proyección de proyectos a mediano y largo plazo. | 🟡 En plantilla |
| **5. Archivero de Informes** | Módulo de gestión y almacenamiento de minutas, documentos y entregables. | 🟡 En plantilla |

---

## ✨ Características Clave

* **Arquitectura Modular Cargable Dinámicamente:** Inyecta código HTML/CSS/JS bajo demanda, garantizando un rendimiento ultra rápido sin recargas de página completas.
* **Persistencia Local (Sin Backend Necesario):** Utiliza `localStorage` para conservar tus tarjetas, horarios y preferencias visuales de manera privada en tu navegador.
* **Manejo Dinámico de Temas:** Incluye 5 paletas de colores preconfiguradas y un selector avanzado de colores para personalización total.
* **Exportación Lista para Imprimir:** Estilos CSS estables mediante `@media print` configurados específicamente para PDF en formato A4 Horizontal.

---

## 🛠️ Arquitectura del Proyecto

```text
tops-flow/
├── index.html              # Shell y Layout principal (Sidebar + Container)
├── styles.css              # Variables de color (Temas) y componentes globales
├── app.js                  # Router dinámico y Motor de Temas
├── modules/                # Componentes HTML dinámicos
│   ├── horario.html
│   └── kanban.html
├── css/                    # Hojas de estilo modularizadas
│   ├── horario.css
│   └── kanban.css
└── js/                     # Lógica de negocio por módulo
    ├── horario.js
    └── kanban.js
