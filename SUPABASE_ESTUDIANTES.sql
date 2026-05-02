-- ============================================================
-- POLÍTICAS RLS Y TABLA PARA ESTUDIANTES CON NECESIDADES ESPECIALES
-- Ejecutar en: Supabase > SQL Editor > New Query
-- ============================================================

-- Crear la tabla para estudiantes
create table if not exists estudiantes_especiales (
  id uuid primary key default gen_random_uuid(),
  usuario text not null unique,
  clave text not null,
  nombre text not null,
  grado text,
  creado_en timestamptz not null default now()
);

-- Activar RLS
alter table estudiantes_especiales enable row level security;

-- Política de lectura (permitir leer para verificar credenciales en login manual)
drop policy if exists "anon_select_estudiantes" on estudiantes_especiales;
create policy "anon_select_estudiantes"
  on estudiantes_especiales for select
  to anon, authenticated
  using (true);

-- Insertar un estudiante de prueba
insert into estudiantes_especiales (usuario, clave, nombre, grado)
values ('estudiante1', '1234', 'Juan Pérez', '1A')
on conflict (usuario) do nothing;
