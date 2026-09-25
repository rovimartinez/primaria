# Skill: Supabase Database Migration & Schema Protocol

## 1. Skill Metadata
- **Identifier:** `skill-database-migration`
- **Purpose:** Crear y evolucionar esquemas de base de datos relacionales en PostgreSQL (Supabase) con seguridad a nivel de fila (RLS), triggers y sincronización de tipos TypeScript.
- **Triggers:** Solicitud de nueva entidad, cambio de columnas, configuración de relaciones o nuevas políticas de seguridad.

---

## 2. Step-by-Step Protocol

### Paso 1: Diseño de la Migración SQL
Crear un archivo de migración versionado en `supabase/migrations/<TIMESTAMP>_<migration_name>.sql` o preparar el bloque SQL para ejecución directa:
- Utilizar `UUID` como clave primaria con `gen_random_uuid()`.
- Agregar campos de auditoría obligatorios: `created_at TIMESTAMPTZ DEFAULT now() NOT NULL` y `updated_at TIMESTAMPTZ DEFAULT now() NOT NULL`.
- Vincular la propiedad del registro al usuario autenticado mediante clave foránea a `auth.users(id)` con `ON DELETE CASCADE`.

### Paso 2: Configuración Obligatoria de RLS (Row Level Security)
Toda tabla creada **debe** habilitar RLS inmediatamente para evitar fugas de datos:
1. `ALTER TABLE <table_name> ENABLE ROW LEVEL SECURITY;`
2. Crear políticas granulares para `SELECT`, `INSERT`, `UPDATE` y `DELETE` basadas en `auth.uid()`.

### Paso 3: Generación / Actualización de Tipos TypeScript
Ejecutar la generación de tipos estáticos para que el frontend y backend mantengan integridad de tipos:
```bash
npx supabase gen types typescript --project-id <PROJECT_ID> > src/types/database.types.ts
```
O actualizar manualmente las interfaces en `src/types/models.ts` con tipos derivados de la base de datos.

---

## 3. Reference Implementation Example

```sql
-- 1. Crear extensión si no existe
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. Crear Tabla de Tareas (tasks)
CREATE TABLE IF NOT EXISTS public.tasks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    subject_id UUID REFERENCES public.subjects(id) ON DELETE SET NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'completed')),
    priority VARCHAR(20) DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
    due_date TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. Índices para acelerar búsquedas
CREATE INDEX IF NOT EXISTS idx_tasks_user_id ON public.tasks(user_id);
CREATE INDEX IF NOT EXISTS idx_tasks_due_date ON public.tasks(due_date);

-- 4. Habilitar RLS
ALTER TABLE public.tasks ENABLE ROW LEVEL SECURITY;

-- 5. Políticas RLS estrictas
CREATE POLICY "Users can view their own tasks"
    ON public.tasks FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own tasks"
    ON public.tasks FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own tasks"
    ON public.tasks FOR UPDATE
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own tasks"
    ON public.tasks FOR DELETE
    USING (auth.uid() = user_id);

-- 6. Trigger para actualizar updated_at automáticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER tr_tasks_updated_at
    BEFORE UPDATE ON public.tasks
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
```

---

## 4. Pre-Deployment Verification Checklist
- [ ] ¿La tabla tiene `ENABLE ROW LEVEL SECURITY`?
- [ ] ¿Se crearon las 4 políticas RLS básicas (`SELECT`, `INSERT`, `UPDATE`, `DELETE`)?
- [ ] ¿Las claves foráneas (`user_id`) incluyen `ON DELETE CASCADE` o acción controlada?
- [ ] ¿Se crearon índices en columnas consultadas con frecuencia (`user_id`, `created_at`, `status`)?
- [ ] ¿Se actualizaron los tipos en `src/types/database.types.ts`?
