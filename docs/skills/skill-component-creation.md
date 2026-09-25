# Skill: UI Component Creation & Design System Compliance

## 1. Skill Metadata
- **Identifier:** `skill-component-creation`
- **Purpose:** Crear componentes de interfaz de usuario limpios, altamente reutilizables, tipados con TypeScript, accesibles (ARIA) y alineados con el sistema de diseño en `docs/DESIGN.md`.
- **Triggers:** Creación de nuevos elementos visuales, formularios, modales, tarjetas, vistas o refactorización de layouts.

---

## 2. Step-by-Step Protocol

### Paso 1: Consultar Tokens en `docs/DESIGN.md`
Verificar los colores semánticos (`primary`, `surface`, `error`, etc.), la escala tipográfica y los espaciados antes de aplicar clases ad-hoc.

### Paso 2: Ubicación en la Estructura de Carpetas
- Componentes genéricos sin dependencias de negocio: `src/components/ui/<component-name>.tsx`.
- Componentes específicos de una funcionalidad: `src/features/<feature-name>/components/<component-name>.tsx`.
- Componentes globales de navegación: `src/components/common/<component-name>.tsx`.

### Paso 3: Tipado e Inmutabilidad
- Exportar una interfaz clara con las propiedades (`Props`) del componente.
- Extender de las interfaces estándar de React (e.g. `React.ButtonHTMLAttributes<HTMLButtonElement>`).
- Prohibir terminantemente el uso de `any`.

### Paso 4: Manejo de Variantes con `clsx` y `tailwind-merge` o `cva`
Centralizar las clases mediante la función utilitaria `cn()` definida en `src/lib/utils.ts`.

---

## 3. Reference Implementation Example

```tsx
// src/components/ui/button.tsx
import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';
import { Loader2 } from 'lucide-react';

const buttonVariants = cva(
  'inline-flex items-center justify-center rounded-lg text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 active:scale-[0.98]',
  {
    variants: {
      variant: {
        primary:
          'bg-indigo-600 text-white hover:bg-indigo-700 shadow-sm focus-visible:ring-indigo-500',
        secondary:
          'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-300 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700/80 focus-visible:ring-slate-400',
        destructive:
          'bg-red-600 text-white hover:bg-red-700 shadow-sm focus-visible:ring-red-500',
        ghost:
          'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 focus-visible:ring-slate-400',
      },
      size: {
        sm: 'h-8 px-3 text-xs',
        md: 'h-10 px-4 py-2',
        lg: 'h-12 px-6 text-base',
        icon: 'h-10 w-10 p-0',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'md',
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant,
      size,
      isLoading = false,
      leftIcon,
      rightIcon,
      children,
      disabled,
      ...props
    },
    ref
  ) => {
    return (
      <button
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        disabled={disabled || isLoading}
        aria-disabled={disabled || isLoading}
        {...props}
      >
        {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" aria-hidden="true" />}
        {!isLoading && leftIcon && <span className="mr-2 inline-flex">{leftIcon}</span>}
        {children}
        {!isLoading && rightIcon && <span className="ml-2 inline-flex">{rightIcon}</span>}
      </button>
    );
  }
);

Button.displayName = 'Button';
```

---

## 4. Quality & Accessibility Checklist
- [ ] ¿Se definió `aria-label` o texto accesible para botones basados exclusivamente en íconos?
- [ ] ¿El componente soporta estados `:focus-visible`, `:hover`, `:active` y `:disabled`?
- [ ] ¿Se utilizó el helper `cn()` para fusionar `className` externo sin colisiones de Tailwind?
- [ ] ¿El componente funciona correctamente en Modo Claro y Modo Oscuro?
