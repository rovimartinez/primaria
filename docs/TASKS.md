# Task Breakdown & Development Plan

## Metrics Summary
- **Total Tasks:** 20
- **Completed:** 0 (0%)
- **In Progress:** 0 (0%)
- **Not Started:** 20 (100%)

---

## Phase 1: Project Setup & Foundations
*Objetivo: Inicializar el repositorio con tooling de calidad, tipado estricto y configuración del diseño base.*

| # | Task | Priority | Status |
| :---: | :--- | :---: | :---: |
| **1.1** | Inicializar proyecto con Next.js 14+ (App Router), TypeScript y Tailwind CSS. | `P0` | `Not Started` |
| **1.2** | Configurar ESLint, Prettier y reglas estrictas de TypeScript (`noImplicitAny: true`). | `P0` | `Not Started` |
| **1.3** | Configurar tokens del Design System en `tailwind.config.ts` y estilos globales en `globals.css`. | `P1` | `Not Started` |
| **1.4** | Implementar componentes UI base en `src/components/ui/` (`Button`, `Input`, `Card`, `Badge`, `Modal`). | `P1` | `Not Started` |
| **1.5** | Configurar clientes de Supabase (`client.ts`, `server.ts`, `middleware.ts`) en `src/lib/supabase/`. | `P0` | `Not Started` |

---

## Phase 2: Authentication & User Profiles
*Objetivo: Permitir registro, login seguro, recuperación de credenciales y protección de rutas con middleware.*

| # | Task | Priority | Status |
| :---: | :--- | :---: | :---: |
| **2.1** | Configurar tabla `profiles` en PostgreSQL con trigger automático tras `auth.users.insert`. | `P0` | `Not Started` |
| **2.2** | Diseñar e implementar páginas públicas de Login y Registro (`/login`, `/register`). | `P0` | `Not Started` |
| **2.3** | Implementar Server Actions para Auth (`signUp`, `signInWithPassword`, `signOut`, `signInWithOAuth`). | `P0` | `Not Started` |
| **2.4** | Implementar Middleware de Next.js para protección de rutas `/dashboard/*` y redirecciones de sesión. | `P0` | `Not Started` |
| **2.5** | Crear vista de edición de perfil de usuario y configuración de preferencias. | `P2` | `Not Started` |

---

## Phase 3: Core Academic Management (Subjects & Tasks)
*Objetivo: Construir el núcleo operativo para gestión de asignaturas y seguimiento de tareas.*

| # | Task | Priority | Status |
| :---: | :--- | :---: | :---: |
| **3.1** | Crear tablas SQL en Supabase: `subjects`, `tasks`, `grades` con RLS habilitado. | `P0` | `Not Started` |
| **3.2** | Implementar `subjects.service.ts` y módulo CRUD de asignaturas (`/subjects`). | `P0` | `Not Started` |
| **3.3** | Implementar `tasks.service.ts` y componentes de Tablero Kanban y Lista de tareas (`/tasks`). | `P0` | `Not Started` |
| **3.4** | Implementar modal interactivo para creación/edición rápida de tareas con validación Zod. | `P1` | `Not Started` |
| **3.5** | Desarrollar vista principal del Dashboard (`/dashboard`) con widgets de métricas y tareas urgentes. | `P0` | `Not Started` |

---

## Phase 4: Grades, Calendar & Vault
*Objetivo: Incorporar cálculo de promedios, agenda interactiva y almacenamiento de documentos.*

| # | Task | Priority | Status |
| :---: | :--- | :---: | :---: |
| **4.1** | Implementar `grades.service.ts` con algoritmo de promedio ponderado y vista `/grades`. | `P1` | `Not Started` |
| **4.2** | Desarrollar vista de Calendario Académico (`/calendar`) con filtrado por asignaturas. | `P1` | `Not Started` |
| **4.3** | Configurar bucket en Supabase Storage e implementar subida de adjuntos (PDFs) en materias/tareas. | `P2` | `Not Started` |

---

## Phase 5: Testing, Optimization & Deployment
*Objetivo: Asegurar calidad, accesibilidad y despliegue continuo en producción.*

| # | Task | Priority | Status |
| :---: | :--- | :---: | :---: |
| **5.1** | Pruebas end-to-end (E2E) de flujos críticos de usuario (Auth -> Crear Materia -> Crear Tarea). | `P1` | `Not Started` |
| **5.2** | Auditoría Lighthouse (Performance ≥ 95, Accesibilidad AA, SEO). | `P1` | `Not Started` |
| **5.3** | Despliegue en Vercel con variables de entorno de producción y verificación de RLS en Supabase. | `P0` | `Not Started` |
