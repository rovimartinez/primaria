# Roadmap de Pendientes - Aula Plus Examenes

Esta lista resume lo definido hasta ahora para el modulo de evaluaciones, con foco en:
- nueva base de datos en Supabase,
- recuperacion tras apagones,
- reportes por examen,
- accesibilidad e inclusion,
- supervision del examen a futuro.

---

## 1. Base de Datos y Documentacion
- [x] Redefinir la estructura de base de datos para examenes.
- [x] Conservar `usuarios_autorizados`.
- [x] Reemplazar el modelo viejo por:
  - `sesiones_examen`
  - `lobby_estudiantes`
  - `intentos_examen`
- [x] Documentar la nueva estructura en `SUPABASE_GUIA.md`.
- [ ] Verificar en Supabase que el SQL nuevo ya fue ejecutado correctamente.
- [ ] Revisar y ajustar politicas RLS para las tablas nuevas.

## 2. Migracion del Codigo a la Nueva BD
- [x] Dejar de usar `sesiones_activas` en la fase inicial (`lobby_docente.html`, `engine.html`, `01.html`).
- [x] Dejar de usar `resultados_examenes` en la fase inicial (`01.html`).
- [ ] Migrar el proyecto para usar:
  - `sesiones_examen`
  - `lobby_estudiantes`
  - `intentos_examen`

## 3. Flujo Docente
- [x] Adaptar `lobby_docente.html` para crear y actualizar sesiones en `sesiones_examen`.
- [ ] Mantener una sola sesion activa por grado.
- [ ] Guardar `titulo`, `codigo_acceso`, `session_id`, `esta_activo` y `examen_comenzado`.
- [ ] Asegurar que al cerrar examen se limpie el lobby y se desactive la sesion.

## 4. Flujo de Ingreso del Estudiante
- [x] Adaptar `engine.html` a la nueva BD.
- [ ] Buscar la sesion activa del grado desde la nube.
- [ ] Pedir nombre solo si no existe identidad guardada o restaurable.
- [x] Si ya hay nombre guardado y la sesion esta activa, entrar directo.
- [ ] Mantener guardado dual:
  - Supabase como fuente principal
  - `localStorage` como respaldo adicional

## 5. Recuperacion y Persistencia
- [ ] Restaurar el intento desde Supabase si el PC se apaga, recarga o pierde sesion.
- [ ] Comparar nube y `localStorage` por `actualizado_en` si hiciera falta reconciliar.
- [x] Guardar progreso parcial durante el examen, no solo al finalizar.
- [ ] Guardar:
  - pregunta actual
  - respuestas
  - puntaje parcial
  - intento actual
  - estado de finalizacion

## 6. Examenes del Estudiante
- [x] Adaptar primero `Periodo 1/examenesP1/01.html` a `intentos_examen`.
- [ ] Probar ciclo completo con `01.html`.
- [x] Luego replicar la migracion en:
  - `02.html`
  - `03.html`
- [ ] Mantener visible en el estudiante:
  - titulo del examen
  - grado
  - numero de oportunidad

## 7. Otra Oportunidad
- [ ] Hacer que "Otra Oportunidad" cree o active un nuevo `session_id`.
- [ ] Crear una nueva fila de intento por estudiante al cambiar de oportunidad.
- [ ] Asegurar que el estudiante detecte el nuevo `session_id` y reinicie correctamente.
- [ ] Asegurar que el monitor reinicie el conteo y progreso solo para la sesion activa.

## 8. Monitor Docente
- [x] Adaptar `monitor_docente.html` para leer desde `intentos_examen`.
- [x] Mostrar solo resultados de la `session_id` activa.
- [ ] Mantener monitoreo en tiempo real de:
  - progreso
  - finalizacion
  - puntajes
  - oportunidad actual
- [ ] Mejorar la lectura visual del estado de cada estudiante.

## 9. Reportes por Examen
- [x] Rehacer `reportes.html` para agrupar por examen, no por filas sueltas.
- [x] Agrupar por:
  - `grado`
  - `session_id`
  - `titulo`
- [x] Mostrar por examen:
  - estudiantes unicos
  - intentos totales
  - promedio
  - mejor resultado
  - fecha
- [x] Mostrar dentro de cada examen, por estudiante:
  - numero de intentos
  - mejor nota
  - ultimo intento
  - historial de intentos

## 10. Analitica Pedagogica
- [ ] Registrar tiempos de respuesta por pregunta.
- [ ] Registrar tiempo total del intento.
- [ ] Registrar cambios de respuesta.
- [ ] Registrar patrones utiles para analisis:
  - respuestas muy rapidas
  - respuestas muy lentas
  - abandono de preguntas
  - mejora entre intentos
- [ ] Preparar los datos para reportes pedagogicos mas ricos.

## 11. Inclusion y Accesibilidad
- [ ] Diseñar soporte para estudiantes neurodivergentes y neurotipicos.
- [ ] Crear una base para perfiles de apoyo sin etiquetas estigmatizantes.
- [ ] Evaluar configuraciones como:
  - modo baja distraccion
  - apoyo visual
  - lectura guiada
  - tiempo extendido
  - menos opciones por pregunta
- [ ] Mejorar la experiencia visual para reducir sobrecarga cognitiva.
- [ ] Preparar compatibilidad futura con audio y apoyos visuales.

## 12. Seguridad y Supervision del Examen
- [ ] Diseñar un sistema de supervision, no solo de bloqueo.
- [ ] Registrar eventos como:
  - salida de pantalla completa
  - cambio de pestaña
  - perdida de foco
  - copiar/pegar
  - clic derecho
- [ ] Mostrar esos eventos al docente en el monitor.
- [ ] Crear perfiles de supervision:
  - normal
  - supervisado
  - estricto
  - adaptado
- [ ] Evitar castigos automaticos agresivos en la primera version.

## 13. Secundaria
- [ ] Decidir si los examenes de 6 a 11 se construyen ahora o se mantienen ocultos.

## 14. Produccion y Limpieza
- [ ] Actualizar URLs reales de produccion para login y redirects.
- [ ] Revisar limpieza de identidad al terminar una jornada en un mismo equipo.
- [ ] Validar edge cases al cerrar examen con estudiantes activos.
- [ ] Probar el flujo completo de extremo a extremo.

## 15. Checklist de Pruebas Funcionales
- [ ] Crear una sesion nueva desde `lobby_docente.html`.
- [ ] Verificar que se genere `codigo_acceso` en `sesiones_examen`.
- [ ] Verificar que se genere `session_id` nuevo en `sesiones_examen`.
- [ ] Entrar desde estudiante con codigo valido.
- [ ] Confirmar que el estudiante quede registrado en `lobby_estudiantes`.
- [ ] Confirmar que el lobby docente muestre al estudiante en tiempo real.
- [ ] Iniciar el examen desde el docente.
- [ ] Confirmar que el estudiante pase del lobby al examen correcto.
- [ ] Verificar que se cree un intento en `intentos_examen` al empezar.
- [ ] Responder al menos 2 preguntas y confirmar guardado parcial en Supabase.
- [ ] Recargar el examen y comprobar restauracion del progreso.
- [ ] Finalizar el examen y confirmar `finalizado = true`.
- [ ] Verificar que el monitor docente muestre progreso y nota correctos.
- [ ] Dar "Otra Oportunidad" desde el monitor.
- [ ] Confirmar que cambie `session_id` en `sesiones_examen`.
- [ ] Confirmar que el progreso del monitor se reinicie para la nueva oportunidad.
- [ ] Confirmar que el estudiante reinicie como nuevo intento.
- [ ] Verificar que se cree un segundo intento en `intentos_examen`.
- [ ] Revisar `reportes.html` y confirmar agrupacion por examen.
- [ ] Revisar en reportes que cada estudiante muestre cantidad de intentos, mejor nota y ultimo intento.
- [ ] Cerrar la sala y confirmar que el estudiante sea expulsado correctamente.
- [ ] Confirmar limpieza del lobby al finalizar la sesion.

---

## Orden recomendado de implementacion
1. Base de datos y permisos
2. Migracion del codigo a tablas nuevas
3. Lobby docente y sesion activa
4. Entrada del estudiante y restauracion
5. Examen `01.html`
6. Replicacion en `02.html` y `03.html`
7. Monitor docente
8. Reportes por examen
9. Analitica pedagogica
10. Inclusion y accesibilidad
11. Supervision anti-trampa
12. Pruebas finales
