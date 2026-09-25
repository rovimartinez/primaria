# Product Requirements Document (PRD)

| Metadata | Details |
| :--- | :--- |
| **Project Name** | **StudentHub** |
| **Version** | v1.0.0 (MVP) |
| **Date** | 2026-09-24 |
| **Author** | Lead Software Architect & Tech Lead |
| **Status** | Approved / Ready for Implementation |
| **Target Release** | MVP v1.0 Launch |

---

## 1. Product Overview
**StudentHub** es una plataforma web progresiva todo-en-uno diseñada para centralizar la vida académica y productiva de los estudiantes modernos. Integra gestión inteligente de asignaturas, seguimiento en tiempo real de tareas y calificaciones, repositorio seguro de archivos y notas en la nube, y un sistema proactivo de recordatorios y calendario académico.

---

## 2. Problem Statement
Los estudiantes universitarios y escolares enfrentan una fragmentación excesiva de herramientas:
- **Dispersión de información:** Utilizan simultáneamente hojas de cálculo, notas adhesivas, aplicaciones de mensajería y carpetas locales desordenadas.
- **Pérdida de entregas críticas:** Olvido de plazos de entrega debido a la falta de un sistema unificado de alertas y priorización.
- **Cálculo manual y opaco de promedios:** Dificultad para proyectar notas mínimas requeridas para aprobar asignaturas.
- **Acceso limitado a recursos:** Dificultad para acceder rápidamente a documentos de estudio desde múltiples dispositivos.

---

## 3. Goals
- **G-1 (Productividad):** Reducir en un 60% el tiempo que un estudiante gasta organizando sus entregas semanales.
- **G-2 (UX & Performance):** Lograr una puntuación de Google Lighthouse ≥ 95 en rendimiento, accesibilidad y SEO con tiempos de carga iniciales inferiores a 1.2 segundos.
- **G-3 (Retención):** Fomentar una tasa de retención semanal del 70% mediante dashboards intuitivos y resúmenes diarios accionables.
- **G-4 (Zero Friction):** Proceso de Onboarding y registro completado en menos de 45 segundos.

---

## 4. Target Users
- **Perfil Primario:** Estudiantes universitarios y de educación secundaria superior (16 - 26 años).
- **Comportamiento Técnico:** Nativos digitales, uso intensivo de dispositivos móviles (65%) y laptops (35%), alta expectativa de interfaces limpias, modo oscuro y respuesta instantánea sin recargas de página.
- **Necesidades clave:** Rapidez de captura de datos, vistas de calendario claras y sincronización multi-dispositivo sin fricción.

---

## 5. Core Features (MVP Scope)

| ID | Feature | Description | Priority |
| :--- | :--- | :--- | :--- |
| **FEAT-01** | **Authentication & Onboarding** | Registro e inicio de sesión con Email/Password y OAuth (Google/GitHub) vía Supabase Auth. Recuperación de contraseña y perfiles de usuario. | **P0 (Critical)** |
| **FEAT-02** | **Subject & Course Management** | Creación y administración de asignaturas (nombre, profesor, créditos, color de identificación, ponderación de cortes). | **P0 (Critical)** |
| **FEAT-03** | **Task & Assignment Tracker** | Tablero Kanban y vista de lista para tareas con estados (`Pendiente`, `En Progreso`, `Completada`), fechas límite y asignación de prioridad. | **P0 (Critical)** |
| **FEAT-04** | **Grade Calculator & Insights** | Registro de calificaciones con cálculo automático del promedio ponderado acumulado (GPA) y estimador de nota aprobatoria. | **P1 (High)** |
| **FEAT-05** | **Academic Calendar & Deadlines** | Vista mensual y semanal interactiva de exámenes y entregas con filtros por materia. | **P1 (High)** |
| **FEAT-06** | **Cloud Attachment Vault** | Subida y visualización de apuntes y PDFs asociados a materias utilizando Supabase Storage (límite 10MB/archivo en MVP). | **P2 (Medium)** |
| **FEAT-07** | **Global Dashboard** | Resumen ejecutivo con métricas clave: tareas próximas a vencer (próximas 48h), promedio general y gráfica de progreso. | **P0 (Critical)** |
