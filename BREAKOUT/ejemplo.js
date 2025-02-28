import { breakout } from "../../juego.js";

// Preguntas
    const preguntas = [
        {
            pregunta: "¿Cuál es la capital de Francia?",
            respuestas: ["París", "Londres", "Berlín"],
            respuestaCorrecta: 0
        },
        {
            pregunta: "¿Cuántos planetas hay en el sistema solar?",
            respuestas: ["7", "8", "9"],
            respuestaCorrecta: 1
        },
        {
            pregunta: "¿Quién pintó la Mona Lisa?",
            respuestas: ["Van Gogh", "Da Vinci", "Picasso"],
            respuestaCorrecta: 1
        },
        {
            pregunta: "¿Cuál es el río más largo del mundo?",
            respuestas: ["Amazonas", "Nilo", "Misisipi"],
            respuestaCorrecta: 1
        },
        {
            pregunta: "¿En qué año comenzó la Segunda Guerra Mundial?",
            respuestas: ["1939", "1941", "1945"],
            respuestaCorrecta: 0
        }
    ];

    /* const contenedor = document.getElementById('si408'); */
    breakout(preguntas);