# AI Skills Registry & Orchestration Protocol

## 1. Overview
El **Skills Registry** es el centro de mando que define las capacidades operativas modulares disponibles para los agentes de IA (Cursor, Claude Code, GitHub Copilot Workspace, etc.) en este proyecto. Cada habilidad (*skill*) establece un protocolo determinista, seguro y reproducible con entradas, pasos de ejecución y criterios de aceptación verificables.

---

## 2. Skills Catalog

| Skill Name | Reference File | Activation Trigger | Dependencies / Pre-requisites |
| :--- | :--- | :--- | :--- |
| **Database Migration** | [`skill-database-migration.md`](./skill-database-migration.md) | Creación, modificación de tablas SQL, relaciones, índices, triggers o políticas de seguridad RLS en Supabase. | `docs/ARCHITECTURE.md`, Supabase CLI / Dashboard |
| **Component Creation** | [`skill-component-creation.md`](./skill-component-creation.md) | Creación o refactorización de componentes UI atómicos o módulos visuales en `src/components/` y `src/features/`. | `docs/DESIGN.md`, `clsx`, `tailwind-merge`, `lucide-react` |
| **API & Backend Integration** | [`skill-api-integration.md`](./skill-api-integration.md) | Creación de Server Actions, Route Handlers, mutaciones de datos o integración con servicios externos. | `docs/ARCHITECTURE.md`, `zod`, Supabase Server Client |
| **Git Workflow & Memory** | [`skill-git-workflow.md`](./skill-git-workflow.md) | Conclusión de una tarea, refactorización significativa o preparación de un pull request / commit semántico. | `docs/TASKS.md`, `docs/MEMORY.md`, Git CLI |

---

## 3. General Execution Rules for AI Agents

### 🧠 Pre-Flight Checklist (Obligatorio antes de escribir código):
1. **Consultar Memoria:** Leer `docs/MEMORY.md` para entender la fase actual y tareas pendientes.
2. **Consultar Reglas y Arquitectura:** Validar que el cambio no viole `docs/RULES.md` ni rompa la estructura de `docs/ARCHITECTURE.md`.
3. **Identificar Habilidad:** Localizar la habilidad aplicable en esta tabla y seguir su protocolo estricto paso a paso.

### 🔗 Encadenamiento de Habilidades (Chaining Flow):
Cuando una funcionalidad compleja involucra múltiples capas, el agente **debe** encadenar las habilidades en este orden secuencial:

```
[ Database Migration Skill ]  ──►  [ API & Backend Integration Skill ]  ──►  [ Component Creation Skill ]  ──►  [ Git Workflow & Memory Skill ]
 (Tablas, RLS y Tipos TS)           (Validación Zod y Server Actions)          (Interfaz accesible en React)        (Commit semántico y actualización docs)
```

### 📢 Reporte de Progreso para el Usuario:
Al finalizar cada habilidad, el agente debe reportar en la respuesta:
- ✅ **Acción completada:** Resumen conciso del cambio técnico.
- 📁 **Archivos afectados:** Rutas exactas modificadas o creadas.
- 🧪 **Verificación ejecutada:** Comando o prueba que garantiza cero errores de compilación o tipado.
- ⏭️ **Siguiente paso sugerido:** Siguiente tarea según `docs/TASKS.md`.
