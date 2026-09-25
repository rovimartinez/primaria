# Design System & UI Specifications

## 1. Design Principles
- **User-Centered:** Interfaces pensadas para minimizar la carga cognitiva del estudiante; navegación rápida con máximo 2 clics a cualquier función principal.
- **Minimal & Clean:** Espacios en blanco deliberados, jerarquía visual clara y ausencia de elementos ornamentales superfluos.
- **Consistent:** Uso riguroso de tokens de diseño para espaciados, tipografías, bordes redondeados y sombras.
- **Accessible (WCAG 2.1 AA):** Ratios de contraste de texto mínimo de 4.5:1, soporte completo para navegación por teclado y etiquetas ARIA adecuadas.
- **Responsive & Mobile-First:** Adaptabilidad completa desde 360px hasta 4K con transiciones suaves en cambios de viewport.

---

## 2. Color Palette (Semantic Tokens)

### Light Mode & Dark Mode Variables

| Token Name | HEX (Light) | HEX (Dark) | Semantic Purpose |
| :--- | :--- | :--- | :--- |
| **`primary`** | `#4F46E5` (Indigo 600) | `#6366F1` (Indigo 500) | Color de marca, botones principales, enlaces activos y foco. |
| **`primary-hover`** | `#4338CA` (Indigo 700) | `#4F46E5` (Indigo 600) | Estados hover para elementos primarios. |
| **`secondary`** | `#64748B` (Slate 500) | `#94A3B8` (Slate 400) | Botones secundarios, badges neutrales y texto complementario. |
| **`success`** | `#10B981` (Emerald 500) | `#34D399` (Emerald 400) | Tareas completadas, notas aprobadas y alertas positivas. |
| **`warning`** | `#F59E0B` (Amber 500) | `#FBBF24` (Amber 400) | Entregas próximas a vencer (< 48h) y estados intermedios. |
| **`error` / `destructive`** | `#EF4444` (Red 500) | `#F87171` (Red 400) | Entregas vencidas, acciones destructivas y errores de validación. |
| **`background`** | `#F8FAFC` (Slate 50) | `#0F172A` (Slate 900) | Fondo general de la aplicación. |
| **`surface` / `card`** | `#FFFFFF` (Pure White) | `#1E293B` (Slate 800) | Tarjetas, modales, barras laterales y menús desplegables. |
| **`text-primary`** | `#0F172A` (Slate 900) | `#F8FAFC` (Slate 50) | Títulos y texto principal de lectura. |
| **`text-secondary`** | `#64748B` (Slate 500) | `#94A3B8` (Slate 400) | Subtítulos, metadatos, placeholders y fechas. |
| **`border`** | `#E2E8F0` (Slate 200) | `#334155` (Slate 700) | Divisores, bordes de tarjetas y bordes de inputs. |

---

## 3. Typography
- **Primary Font Family:** `'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;`

### Type Scale Hierarchy

| Element | Class / Token | Font Size | Line Height | Font Weight |
| :--- | :--- | :--- | :--- | :--- |
| **Hero Title / H1** | `text-3xl md:text-4xl` | 2.25rem (36px) / 2.5rem (40px) | 1.2 | `font-bold` (700) |
| **Section Title / H2** | `text-2xl` | 1.5rem (24px) | 1.3 | `font-semibold` (600) |
| **Card Header / H3** | `text-lg` | 1.125rem (18px) | 1.4 | `font-semibold` (600) |
| **Body Text** | `text-base` | 1.0rem (16px) | 1.5 | `font-normal` (400) |
| **Small Text / Captions** | `text-sm` | 0.875rem (14px) | 1.4 | `font-medium` (500) |
| **Badges / Micro-copy** | `text-xs` | 0.75rem (12px) | 1.3 | `font-medium` (500) |

---

## 4. UI Components Specification

### Buttons
- **`Primary Button`**: `bg-indigo-600 hover:bg-indigo-700 text-white font-medium px-4 py-2 rounded-lg shadow-sm transition-all focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50`
- **`Secondary Button`**: `bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-300 dark:border-slate-700 font-medium px-4 py-2 rounded-lg transition-all`
- **`Destructive Button`**: `bg-red-600 hover:bg-red-700 text-white font-medium px-4 py-2 rounded-lg transition-all focus:ring-2 focus:ring-red-500`
- **`Ghost / Icon Button`**: `hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 p-2 rounded-lg transition-colors`

### Inputs & Form Controls
- **`Text Input / Select`**: `w-full bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg px-3.5 py-2 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all`
- **`Error State`**: `border-red-500 focus:ring-red-500 text-red-900`

### Cards & Surfaces
- **`Standard Card`**: `bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700/60 rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow`
- **`Badge Token`**: `inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium` (Variantes: `bg-emerald-100 text-emerald-800`, `bg-amber-100 text-amber-800`, `bg-red-100 text-red-800`).
