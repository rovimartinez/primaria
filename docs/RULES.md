# Development Rules for AI & Human Collaboration

## 1. General Principles
- **Documentation First:** Antes de escribir o refactorizar cualquier archivo de código, es obligatorio leer y respetar los contratos definidos en `docs/PRD.md`, `docs/ARCHITECTURE.md` y `docs/DESIGN.md`.
- **Atomic & Reversible Changes:** Cada cambio debe tener un propósito único y bien delimitado. Evitar "mega-refactorizaciones" no solicitadas.
- **No Side-Effects:** Está terminantemente prohibido modificar, renombrar o eliminar archivos que no tengan relación directa con la tarea que se está ejecutando.
- **No Blind Assumptions:** Si falta información sobre un modelo de datos o requerimiento de negocio, consultar o documentar la suposición en `docs/MEMORY.md` antes de proceder.

---

## 2. Technology & Coding Standards

### TypeScript Strictness
- Prohibido el uso de `any` bajo cualquier circunstancia. Usar `unknown`, tipos genéricos o discriminación de uniones (`discriminated unions`).
- Todas las funciones y Server Actions deben declarar explícitamente sus tipos de retorno.
- Usar esquemas **Zod** para validar cualquier input recibido del cliente o fuentes externas.

### Next.js & React Standards
- Preferir **React Server Components (RSC)** por defecto para reducir el bundle cliente.
- Agregar la directiva `'use client'` únicamente cuando el componente requiera estado local (`useState`), efectos (`useEffect`), listeners de eventos o APIs del navegador.
- No utilizar llamadas a APIs `fetch` dentro de componentes cliente si se pueden encapsular en **Server Actions** fuertemente tipadas.
- Toda operación asíncrona de base de datos debe incluir manejo estructurado de errores (`try/catch`) y devolver una estructura unificada:
  ```typescript
  type ActionResponse<T> = 
    | { success: true; data: T } 
    | { success: false; error: string; code?: string };
  ```

### Tailwind CSS & Styling
- Utilizar exclusivamente clases de utilidad de Tailwind CSS.
- Centralizar clases condicionales utilizando el helper estándar `cn()` (`clsx` + `tailwind-merge`).
- No utilizar estilos en línea (`style={{...}}`) salvo para valores verdaderamente dinámicos en tiempo de ejecución (e.g., coordenadas CSS personalizadas de un slider).

### Quality & Linters
- El código debe pasar limpiamente `npm run lint` (`next lint`) y `tsc --noEmit` sin warnings ni errores antes de cualquier commit.
- Nombres de archivos de componentes: `kebab-case.tsx` o `PascalCase.tsx` (consistente en todo el proyecto; se establece **`kebab-case.tsx`** para archivos y `PascalCase` para componentes exportados).

---

## 3. Project Structure & Boundary Rules
- **Componentes Base (`src/components/ui`):** Componentes visuales genéricos sin lógica de negocio (e.g., `button.tsx`, `input.tsx`, `card.tsx`).
- **Módulos de Dominio (`src/features/*`):** La lógica de interfaz específica de una funcionalidad debe vivir dentro de su respectiva carpeta en `features/`.
- **Servicios y Base de Datos (`src/services/*`):** Toda interacción con Supabase y PostgreSQL debe residir en `services/` o en Server Actions dedicadas. Ningún componente UI debe importar directamente el cliente SQL de bajo nivel.
- **Regla de Raíz:** No crear carpetas ni archivos en la raíz del proyecto salvo que sean configuraciones estándar de tooling (`next.config.js`, `tailwind.config.ts`, `tsconfig.json`, `.eslintrc.json`, `package.json`).
