# Skill: API & Backend Server Actions Integration

## 1. Skill Metadata
- **Identifier:** `skill-api-integration`
- **Purpose:** Implementar mutaciones y consultas seguras en el servidor mediante Next.js Server Actions y Route Handlers, con validación Zod, verificación de sesión Supabase y respuestas tipadas predecibles.
- **Triggers:** Creación de endpoints, mutaciones CRUD, procesamiento de formularios y llamadas a APIs de terceros.

---

## 2. Step-by-Step Protocol

### Paso 1: Definir Esquema de Validación con Zod
Crear los esquemas de entrada y salida en `src/lib/validations.ts` o en el archivo de servicio correspondiente.

### Paso 2: Autenticación y Autorización
Toda Server Action que modifique o lea datos privados debe obtener la sesión activa mediante el cliente de Supabase para servidor (`createClient()` de `@supabase/ssr`).

### Paso 3: Estructura Unificada de Respuesta
Toda función del backend debe devolver una tupla discriminada estricta:
```typescript
export type ActionResult<T> = 
  | { success: true; data: T; message?: string }
  | { success: false; error: string; code?: string };
```

### Paso 4: Revalidación de Rutas
Usar `revalidatePath()` o `revalidateTag()` de `next/cache` tras una mutación exitosa para invalidar la caché del navegador y refrescar la vista.

---

## 3. Reference Implementation Example

```typescript
// src/services/tasks.service.ts
'use server';

import { z } from 'zod';
import { revalidatePath } from 'next/cache';
import { createServerClient } from '@/lib/supabase/server';

// 1. Esquema Zod de Validación
export const CreateTaskSchema = z.object({
  title: z.string().min(1, 'El título es obligatorio').max(255),
  description: z.string().optional(),
  subject_id: z.string().uuid('ID de materia inválido').optional().nullable(),
  priority: z.enum(['low', 'medium', 'high', 'urgent']).default('medium'),
  due_date: z.string().datetime().optional().nullable(),
});

export type CreateTaskInput = z.infer<typeof CreateTaskSchema>;

export type ActionResult<T> = 
  | { success: true; data: T; message?: string }
  | { success: false; error: string; code?: string };

// 2. Server Action Segura
export async function createTaskAction(
  rawInput: CreateTaskInput
): Promise<ActionResult<{ taskId: string }>> {
  try {
    // A. Validar entrada con Zod
    const validatedInput = CreateTaskSchema.parse(rawInput);

    // B. Obtener cliente de Supabase y validar sesión
    const supabase = await createServerClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return {
        success: false,
        error: 'No autorizado. Debes iniciar sesión para realizar esta acción.',
        code: 'UNAUTHORIZED',
      };
    }

    // C. Ejecutar inserción en base de datos
    const { data, error: dbError } = await supabase
      .from('tasks')
      .insert({
        user_id: user.id,
        title: validatedInput.title,
        description: validatedInput.description || null,
        subject_id: validatedInput.subject_id || null,
        priority: validatedInput.priority,
        due_date: validatedInput.due_date || null,
        status: 'pending',
      })
      .select('id')
      .single();

    if (dbError) {
      console.error('[DATABASE_ERROR] createTaskAction:', dbError);
      return {
        success: false,
        error: 'Error al persistir la tarea en la base de datos.',
        code: dbError.code,
      };
    }

    // D. Revalidar rutas afectadas
    revalidatePath('/dashboard');
    revalidatePath('/tasks');

    return {
      success: true,
      data: { taskId: data.id },
      message: 'Tarea creada exitosamente.',
    };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        success: false,
        error: error.errors.map(e => e.message).join(', '),
        code: 'VALIDATION_ERROR',
      };
    }

    console.error('[UNEXPECTED_ERROR] createTaskAction:', error);
    return {
      success: false,
      error: 'Ocurrió un error inesperado en el servidor.',
      code: 'INTERNAL_SERVER_ERROR',
    };
  }
}
```

---

## 4. Verification & Security Checklist
- [ ] ¿Los datos de entrada son validados con Zod antes de tocar la base de datos?
- [ ] ¿Se verifica `auth.getUser()` en el servidor y no confiando en el payload del cliente?
- [ ] ¿Los errores se capturan con `try/catch` sin exponer tokens ni stack traces al cliente?
- [ ] ¿Se ejecutó `revalidatePath` o `revalidateTag` tras completar la mutación?
