-- ============================================================
-- POLÍTICAS RLS - Aula Plus Exámenes
-- Ejecutar en: Supabase > SQL Editor > New Query
-- ============================================================

-- 1. Activar RLS en las tres tablas
alter table sesiones_examen    enable row level security;
alter table lobby_estudiantes  enable row level security;
alter table intentos_examen    enable row level security;

-- ============================================================
-- sesiones_examen
-- El docente crea y actualiza sesiones. Los estudiantes solo leen.
-- ============================================================
drop policy if exists "anon_select_sesiones"  on sesiones_examen;
drop policy if exists "anon_insert_sesiones"  on sesiones_examen;
drop policy if exists "anon_update_sesiones"  on sesiones_examen;

create policy "anon_select_sesiones"
  on sesiones_examen for select
  to anon, authenticated
  using (true);

create policy "anon_insert_sesiones"
  on sesiones_examen for insert
  to anon, authenticated
  with check (true);

create policy "anon_update_sesiones"
  on sesiones_examen for update
  to anon, authenticated
  using (true)
  with check (true);

-- ============================================================
-- lobby_estudiantes
-- Los estudiantes se registran, el docente puede ver y eliminar.
-- ============================================================
drop policy if exists "anon_select_lobby"  on lobby_estudiantes;
drop policy if exists "anon_insert_lobby"  on lobby_estudiantes;
drop policy if exists "anon_update_lobby"  on lobby_estudiantes;
drop policy if exists "anon_delete_lobby"  on lobby_estudiantes;

create policy "anon_select_lobby"
  on lobby_estudiantes for select
  to anon, authenticated
  using (true);

create policy "anon_insert_lobby"
  on lobby_estudiantes for insert
  to anon, authenticated
  with check (true);

create policy "anon_update_lobby"
  on lobby_estudiantes for update
  to anon, authenticated
  using (true)
  with check (true);

create policy "anon_delete_lobby"
  on lobby_estudiantes for delete
  to anon, authenticated
  using (true);

-- ============================================================
-- intentos_examen
-- Los estudiantes insertan y actualizan su propio intento.
-- El docente y reportes solo leen.
-- ============================================================
drop policy if exists "anon_select_intentos"  on intentos_examen;
drop policy if exists "anon_insert_intentos"  on intentos_examen;
drop policy if exists "anon_update_intentos"  on intentos_examen;

create policy "anon_select_intentos"
  on intentos_examen for select
  to anon, authenticated
  using (true);

create policy "anon_insert_intentos"
  on intentos_examen for insert
  to anon, authenticated
  with check (true);

create policy "anon_update_intentos"
  on intentos_examen for update
  to anon, authenticated
  using (true)
  with check (true);
