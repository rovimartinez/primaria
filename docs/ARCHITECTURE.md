# System Architecture Document

## 1. High-Level Architecture
StudentHub está concebido como una aplicación web moderna orientada a rendimiento y tipado estricto de extremo a extremo, utilizando una arquitectura Server-First con Next.js App Router y Supabase.

```
[ Cliente Web (Browser) ]
       │
       ▼ (HTTPS / React Server Components & Client Hydration)
[ Next.js Frontend Layer (App Router) ]
       │
       ▼ (Server Actions / Route Handlers)
[ Next.js Backend Layer (Node.js / Edge Runtime) ]
       │
       ▼ (PostgREST / Supabase JS Client / Row-Level Security)
[ Supabase BaaS Infrastructure ]
  ├── Auth Service (GoTrue)
  ├── Database (PostgreSQL with RLS & Realtime)
  └── Storage (S3-compatible Object Storage)
```

### Data Flow Pattern:
1. **Petición del Usuario:** Las solicitudes iniciales son resueltas mediante **React Server Components (RSC)** para streaming y cero impacto en el bundle de JS cliente.
2. **Mutaciones de Datos:** Se ejecutan exclusivamente mediante **Next.js Server Actions**, garantizando validación mediante esquemas Zod en el servidor.
3. **Persistencia & Seguridad:** Comunicación directa entre Server Actions y PostgreSQL con políticas de **Row Level Security (RLS)** activas para asegurar el aislamiento de datos por usuario (`auth.uid() = user_id`).
4. **Almacenamiento de Archivos:** Carga de documentos directa o prefirmada a Supabase Storage con validación de tipo MIME y cuotas por usuario.

---

## 2. Technology Stack

| Layer | Technology | Purpose |
| :--- | :--- | :--- |
| **Frontend Framework** | Next.js 14+ (App Router) | Renderizado híbrido (SSR, RSC, SSG), Server Actions y ruteo optimizado. |
| **Language** | TypeScript 5+ | Tipado estático estricto de punta a punta, contratos e interfaces seguras. |
| **Styling & Design System** | Tailwind CSS + Lucide Icons | Sistema de diseño modular, responsive, utility-first y con soporte Dark/Light mode. |
| **Backend / API** | Next.js Server Actions & Route Handlers | Lógica de negocio en servidor, validación con Zod y endpoints REST cuando se requiera. |
| **Database** | PostgreSQL (Supabase Managed) | Base de datos relacional con integridad referencial, índices y extensiones (UUID, pgcrypto). |
| **Authentication** | Supabase Auth | Manejo de sesiones seguras mediante cookies HTTP-Only, JWTs y proveedores OAuth. |
| **Storage** | Supabase Storage | Almacenamiento seguro de archivos adjuntos (PDFs, imágenes de apuntes). |
| **Deployment & Hosting** | Vercel | Plataforma CI/CD con Edge Network global, preview branches y optimización automática. |
| **Version Control** | Git & GitHub | Control de versiones, ramas protegidas (`main`, `develop`) y automatización con GitHub Actions. |

---

## 3. Modular Folder Structure

```
/
├── docs/                        # Memoria persistente y reglas del proyecto
│   ├── PRD.md                   # Requerimientos de producto
│   ├── ARCHITECTURE.md          # Arquitectura y mapa del sistema
│   ├── RULES.md                 # Reglas estrictas de codificación
│   ├── DESIGN.md                # Sistema de diseño y tokens
│   ├── TASKS.md                 # Roadmap y plan de tareas
│   └── MEMORY.md                # Estado actual y próximos pasos
├── public/                      # Archivos estáticos públicos (logos, favicon, etc.)
└── src/
    ├── app/                     # Next.js App Router
    │   ├── (auth)/              # Rutas públicas de autenticación (login, register)
    │   ├── (dashboard)/         # Rutas protegidas de la aplicación
    │   │   ├── calendar/        # Vista de calendario académico
    │   │   ├── grades/          # Calculadora y lista de calificaciones
    │   │   ├── subjects/        # Gestión de asignaturas
    │   │   ├── tasks/           # Tablero de tareas
    │   │   └── page.tsx         # Dashboard Principal
    │   ├── api/                 # Endpoints REST específicos (Webhooks, etc.)
    │   ├── layout.tsx           # Root Layout con Providers
    │   ├── globals.css          # Variables CSS y directivas Tailwind
    │   └── error.tsx            # Error boundary global
    ├── components/
    │   ├── ui/                  # Componentes atómicos base (Button, Input, Card, Modal)
    │   └── common/              # Navbar, Sidebar, Footer, ThemeToggle
    ├── features/                # Módulos de dominio de negocio encapsulados
    │   ├── auth/                # Componentes y hooks de autenticación
    │   ├── calendar/            # Componentes de calendario y vistas semanales
    │   ├── grades/              # Componentes de cálculo y métricas
    │   ├── subjects/            # Formularios y tarjetas de asignaturas
    │   └── tasks/               # Kanban boards, modal de tareas y filtros
    ├── lib/                     # Configuraciones de clientes y librerías externas
    │   ├── supabase/            # Clientes de Supabase (Client, Server, Middleware)
    │   ├── utils.ts             # Funciones helper (`cn` para classnames, formateo de fechas)
    │   └── validations.ts       # Esquemas de validación Zod reutilizables
    ├── services/                # Capa de acceso a datos y Server Actions
    │   ├── auth.service.ts      # Acciones de autenticación
    │   ├── grades.service.ts    # Operaciones CRUD y queries de calificaciones
    │   ├── subjects.service.ts  # Operaciones CRUD de materias
    │   └── tasks.service.ts     # Operaciones CRUD de tareas
    └── types/                   # Definiciones de tipos TypeScript globales
        ├── database.types.ts    # Tipos generados automáticamente desde Supabase
        ├── models.ts            # Modelos de dominio y DTOs
        └── index.ts             # Exportaciones de tipos globales
```
