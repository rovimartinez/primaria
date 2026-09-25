# Skill: Git Version Control & Project Memory Protocol

## 1. Skill Metadata
- **Identifier:** `skill-git-workflow`
- **Purpose:** Mantener un historial de Git limpio, semántico y atómico, asegurando la actualización simultánea de los archivos de memoria y seguimiento de tareas (`docs/MEMORY.md` y `docs/TASKS.md`).
- **Triggers:** Finalización de una funcionalidad, corrección de bugs, creación de componentes o cierre de sesión de desarrollo.

---

## 2. Semantic Commit Standard

Los mensajes de commit deben seguir la convención **Conventional Commits**:
`<type>(<scope>): <short description>`

### Tipos permitidos:
- **`feat:`** Nueva funcionalidad visible para el usuario.
- **`fix:`** Corrección de un bug o comportamiento inesperado.
- **`docs:`** Cambios exclusivamente en archivos de documentación (`docs/`, `README.md`).
- **`style:`** Formateo, punto y coma faltantes, sin cambios de lógica.
- **`refactor:`** Reestructuración de código sin alterar funcionalidad externa ni añadir features.
- **`test:`** Adición o corrección de pruebas unitarias o E2E.
- **`chore:`** Actualización de paquetes npm, configs de build o linters.

### Ejemplos válidos:
- `feat(tasks): implement create task modal with zod validation`
- `fix(auth): handle expired refresh token in nextjs middleware`
- `docs(memory): update completed tasks for phase 1 setup`
- `refactor(ui): extract cva variants for button component`

---

## 3. Step-by-Step Task Completion Protocol

Al terminar una tarea del plan de desarrollo:

### Paso 1: Actualizar `docs/TASKS.md`
1. Cambiar el estado de la tarea completada de `Not Started` / `In Progress` a `Completed`.
2. Actualizar el bloque de métricas al inicio del archivo (recalcular porcentajes de avance).

### Paso 2: Actualizar `docs/MEMORY.md`
1. Mover la tarea de la sección `In Progress` a la tabla `Completed Tasks` con fecha y notas clave.
2. Actualizar la fecha de `Last Updated` y el estado del proyecto.
3. Definir claramente los `Next Steps` para la siguiente sesión del asistente/desarrollador.

### Paso 3: Ejecutar Verificación de Calidad
```bash
# Validar tipado y linting antes de confirmar
npm run lint
npx tsc --noEmit
```

### Paso 4: Preparar y Realizar el Commit
```bash
git add .
git commit -m "feat(<scope>): <descripcion clara del cambio>"
```

---

## 4. Verification Checklist
- [ ] ¿El commit contiene únicamente archivos relacionados con la tarea actual?
- [ ] ¿Se actualizaron `docs/TASKS.md` y `docs/MEMORY.md` con los avances?
- [ ] ¿El proyecto compila sin errores de TypeScript (`tsc --noEmit`)?
- [ ] ¿El mensaje sigue el estándar de Conventional Commits?
