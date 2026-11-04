# Guía Rápida: Creación e Inserción de Exámenes Oficiales

Este documento define la arquitectura estándar, credenciales y procedimiento operativo para agregar o actualizar exámenes oficiales en cualquier grado (`01.html` a `11.html`) de la plataforma **Mundo Jandra**.

---

## 1. Convención de Credenciales y Acceso

| Rol | Clave de Acceso | Requisitos de Entrada | Funcionalidad |
| :--- | :--- | :--- | :--- |
| **Docente** | `Entrar123*` | Apellido y Nombre | Presenta examen o entra directamente al **Panel Docente**. |
| **Estudiante** | `entrar123` | Apellido y Nombre (completo) | Presenta la evaluación; su resultado se envía y bloquea para reintentos. |

> **Nota:** La validación de nombre exige apellidos y nombres completos (al menos 4 caracteres y contener un espacio).

---

## 2. Infraestructura y Sincronización en la Nube

* **Endpoint Cloudflare D1 / Worker**:
  `https://orientacion-vocacional-milagrosa.rovimartinez.workers.dev`
* **Guardar respuestas**: `POST /api/respuestas`
* **Consultar resultados**: `GET /api/resultados`
* **Eliminar para reintento**: `DELETE /api/estudiantes/:codigo`
* **LocalStorage de Respaldo**: `ilm_p3_grado{XX}_official_result`

---

## 3. Estructura de Reactivos en Código

```javascript
const examQuestionsG{GRADO} = [
  // Reactivos 1 a N: Opción múltiple
  {
    tipo: 'multiple',
    tiempoSegundos: 30, // 30s por defecto
    puntos: 1,
    pregunta: "¿Texto de la pregunta?",
    opciones: [
      "Opción A",
      "Opción B",
      "Opción C",
      "Opción D"
    ],
    correcta: 1, // Índice base 0 de la opción correcta
    explicacion: "Justificación pedagógica que se muestra al responder o al expirar tiempo."
  },
  // Reactivo de cierre (si aplica): Autoevaluación
  {
    tipo: 'abierta',
    tiempoSegundos: 180, // 3 minutos
    puntos: 0,
    pregunta: "Escribe tu autoevaluación",
    evaluarConIA: false
  }
];
```

---

## 4. Arquitectura de Vistas en el Archivo del Grado

1. **Switcher de Módulos (`header`):**
   * Botón `🏠 Inicio` (`cambiarModulo('inicio')`)
   * Botón `📝 Examen Oficial` (`cambiarModulo('examen')`)
   * Botones de módulos teóricos/prácticos (`canva`, `recursos-web`, etc.) marcados con `hidden` si el docente pide ocultarlos.
2. **Pantalla de Selección Inicial (`#view-inicio-modulos`):**
   * Si se ocultan los módulos de clase, se muestra únicamente la tarjeta destacada del **Examen Oficial**.
3. **Contenedor Principal del Examen (`#main-examen`):**
   * `#eval{XX}-selection-screen`: portada, reglas, botón de entrada y botón a Panel Docente.
   * `#eval{XX}-runner-container`: temporizador en vivo, barra de progreso, tarjetas de pregunta.
   * `#eval{XX}-question-card`: pregunta múltiple con botones [A, B, C, D] y retroalimentación inmediata.
   * `#eval{XX}-open-question-card`: autoevaluación en textarea y switch IA en OFF.
   * `#eval{XX}-results-screen`: calificación final `/10`, porcentaje y estado de sincronización Cloudflare D1.
4. **Modales de Soporte:**
   * `#modal-official-login{XX}`: formulario de ingreso (Nombre + Clave).
   * `#modal-docente-panel{XX}`: panel con tabla de notas, autoevaluaciones, exportador CSV y borrado para reintento.

---

## 5. Protocolo de Ejecución Rápida para el Agente

Cuando el usuario pida:
> *"Coloca este examen en grado X periodo Y, oculta los otros módulos..."*

1. **Localizar el archivo**: `Periodo {Y}/clasesP3/{XX}.html`.
2. **Ocultar módulos previos**:
   * Ocultar los botones de módulos en la barra de navegación añadiendo `hidden`.
   * En `#view-inicio-modulos`, reemplazar el grid antiguo por la tarjeta de acceso directo al Examen Oficial.
3. **Añadir la vista `#main-examen`** con sus modales de login (`Entrar123*` y `entrar123`) y panel docente.
4. **Configurar el switcher `cambiarModulo(modulo)`** agregando `'examen'` a `MODULOS_VALIDOS` y asegurando que oculte las demás secciones.
5. **Cargar el arreglo de preguntas** con el temporizador (30s para opción múltiple y 3m para autoevaluación) y la URL del Worker.
6. **Verificar sintaxis**: Ejecutar script en Node para asegurar que no haya errores de parseo antes de confirmar.
