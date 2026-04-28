// Preguntas Oficiales - Grado 1° A - Periodo 1
const examData = [
    { 
        q: "¿Cuál de estas partes es el 'Monitor'?", 
        a: ["La que tiene letras", "La pantalla que muestra dibujos", "La caja grande"], 
        c: 1, 
        icon: "🖥️" 
    },
    { 
        q: "¿Para qué usamos el 'Teclado'?", 
        a: ["Para escribir letras y números", "Para mover la flechita", "Para escuchar música"], 
        c: 0, 
        icon: "⌨️" 
    },
    { 
        q: "¿Qué parte es el cerebro de la computadora?", 
        a: ["El Mouse", "Los Parlantes", "El CPU (Torre)"], 
        c: 2, 
        icon: "🧠" 
    },
    { 
        q: "¿Con qué movemos el puntero o la flechita?", 
        a: ["Con el Mouse", "Con el Monitor", "Con el Teclado"], 
        c: 0, 
        icon: "🖱️" 
    },
    { 
        q: "¿Cómo se llama el botón largo del teclado que separa palabras?", 
        a: ["Enter", "Espacio", "Borrar"], 
        c: 1, 
        icon: "📏" 
    }
];

// Hacerlo disponible para el motor
window.currentExamQuestions = examData;
