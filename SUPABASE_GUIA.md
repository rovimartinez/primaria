# Guia de Configuracion: Supabase x Aula Plus

Esta guia deja la base de datos alineada con el flujo actual de examenes:
- una sesion activa por grado,
- multiples intentos por estudiante,
- recuperacion tras apagones,
- reportes agrupados por examen,
- `usuarios_autorizados` se conserva.

---

## 1. Que vas a borrar

Vas a eliminar y recrear estas tablas:
- `intentos_examen`
- `sesiones_examen`
- `lobby_estudiantes`

Esta tabla se conserva:
- `usuarios_autorizados`

---

## 2. SQL para borrar y crear de nuevo

Ve a **Supabase > SQL Editor > New Query** y ejecuta esto:

```sql
begin;

drop table if exists intentos_examen;
drop table if exists lobby_estudiantes;
drop table if exists sesiones_examen;

create table sesiones_examen (
  id uuid primary key default gen_random_uuid(),
  grado text not null unique,
  titulo text not null,
  codigo_acceso text not null,
  session_id text not null,
  esta_activo boolean not null default true,
  examen_comenzado boolean not null default false,
  creado_en timestamptz not null default now(),
  actualizado_en timestamptz not null default now()
);

create table lobby_estudiantes (
  id uuid primary key default gen_random_uuid(),
  grado text not null,
  session_id text not null,
  nombre_estudiante text not null,
  avatar text,
  presente boolean not null default true,
  creado_en timestamptz not null default now(),
  actualizado_en timestamptz not null default now()
);

create table intentos_examen (
  id uuid primary key default gen_random_uuid(),
  grado text not null,
  session_id text not null,
  titulo text not null,
  nombre_estudiante text not null,
  attempt_number int not null default 1,
  puntaje int not null default 0,
  total_preguntas int not null default 0,
  finalizado boolean not null default false,
  ultima_pregunta int not null default 0,
  respuestas_detalladas jsonb not null default '{}'::jsonb,
  creado_en timestamptz not null default now(),
  actualizado_en timestamptz not null default now()
);

create unique index ux_lobby_estudiantes_grado_nombre
  on lobby_estudiantes (grado, nombre_estudiante);

create unique index ux_intentos_examen_sesion_estudiante_intento
  on intentos_examen (session_id, nombre_estudiante, attempt_number);

create index ix_intentos_examen_grado_sesion
  on intentos_examen (grado, session_id);

create index ix_intentos_examen_estudiante
  on intentos_examen (grado, nombre_estudiante);

create index ix_lobby_estudiantes_grado_sesion
  on lobby_estudiantes (grado, session_id);

create or replace function set_actualizado_en()
returns trigger
language plpgsql
as $$
begin
  new.actualizado_en = now();
  return new;
end;
$$;

drop trigger if exists trg_sesiones_examen_actualizado_en on sesiones_examen;
create trigger trg_sesiones_examen_actualizado_en
before update on sesiones_examen
for each row
execute function set_actualizado_en();

drop trigger if exists trg_lobby_estudiantes_actualizado_en on lobby_estudiantes;
create trigger trg_lobby_estudiantes_actualizado_en
before update on lobby_estudiantes
for each row
execute function set_actualizado_en();

drop trigger if exists trg_intentos_examen_actualizado_en on intentos_examen;
create trigger trg_intentos_examen_actualizado_en
before update on intentos_examen
for each row
execute function set_actualizado_en();

commit;
```

---

## 3. Que guarda cada tabla

### `sesiones_examen`
Una sola fila por grado.

Guarda:
- titulo del examen actual,
- codigo de acceso,
- `session_id` de la oportunidad vigente,
- si la sala sigue activa,
- si el examen ya comenzo.

Ejemplo:
- `1A | Examen de Hardware | session_id=1714221000 | activo`

### `lobby_estudiantes`
Estudiantes presentes en la sala de ese grado.

Guarda:
- nombre,
- avatar,
- grado,
- `session_id`,
- si sigue presente.

Sirve para:
- listar quienes entraron,
- monitorear en tiempo real,
- limpiar la sala al cerrar examen.

### `intentos_examen`
Una fila por estudiante por oportunidad.

Guarda:
- grado,
- `session_id`,
- titulo,
- nombre del estudiante,
- numero de intento,
- puntaje,
- progreso parcial,
- pregunta actual,
- si termino o no,
- respuestas detalladas.

Esta es la tabla principal para:
- restaurar despues de apagones,
- calcular mejor nota,
- contar intentos,
- construir reportes por examen.

---

## 4. Flujo esperado con esta base

### Entrada del estudiante
1. El sistema busca la fila de `sesiones_examen` del grado.
2. Si hay sesion activa, intenta restaurar el estudiante.
3. Si el navegador tiene nombre guardado, entra directo.
4. Si no lo tiene, pide nombre y luego crea o recupera su intento.
5. El progreso se guarda tanto en Supabase como en `localStorage`.

### Otra oportunidad
1. El docente genera una nueva oportunidad.
2. Cambia `session_id` en `sesiones_examen`.
3. El estudiante detecta el nuevo `session_id`.
4. Se crea una nueva fila en `intentos_examen` con otro `attempt_number`.
5. El monitor vuelve a contar desde cero para esa sesion.

### Reportes
Se agrupan por:
- `grado`
- `session_id`
- `titulo`

Dentro de cada examen:
- estudiantes unicos,
- numero de intentos por estudiante,
- mejor nota,
- ultimo intento,
- promedio general.

---

## 5. Politicas RLS minimas

Si usas RLS, como minimo debes permitir:

### `usuarios_autorizados`
- `SELECT` para validar acceso del docente.

### `sesiones_examen`
- `SELECT`
- `INSERT`
- `UPDATE`

### `lobby_estudiantes`
- `SELECT`
- `INSERT`
- `UPDATE`
- `DELETE`

### `intentos_examen`
- `SELECT`
- `INSERT`
- `UPDATE`

Si aun estas en etapa de pruebas, puedes dejar politicas abiertas para usuarios anonimos/autenticados y luego endurecerlas.

---

## 6. Notas importantes

- `session_id` debe cambiar cada vez que el docente da "Otra Oportunidad".
- `attempt_number` debe incrementarse por estudiante dentro del mismo grado.
- `actualizado_en` se actualiza automaticamente con trigger.
- `localStorage` no reemplaza la nube: solo sirve como respaldo adicional.

---

## 7. Resumen corto

La base final queda asi:
- `usuarios_autorizados`: acceso docente
- `sesiones_examen`: examen activo por grado
- `lobby_estudiantes`: sala de espera y presencia
- `intentos_examen`: progreso, intentos y notas por estudiante
