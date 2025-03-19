import { cargarConfeti, mostrarConfetiFinal } from '../ANIMACIONES/CONFETTI/confetti.js';

export function true_false(contenedor, secciones) {
    // Cargar CSS
    const css = document.createElement('link');
    css.rel = 'stylesheet';
    css.type = 'text/css';
    css.href = 'PLUGINS/TRUE_FALSE/true_false.css';
    document.head.appendChild(css);

    // Inyección HTML
    contenedor.innerHTML = `
    <div class="contenedor-cuestionario">
        <div class="barra-lateral animate__animated animate__slideInLeft">
            <div class="contenedor-progreso">
                <div class="barra-progreso">
                    <div class="progreso" id="progreso"></div>
                </div>
            </div>
        </div>
        <div class="contenido-principal">
            <div class="resultado" id="resultado"></div>
            <div id="formulario-cuestionario"></div>
        </div>
        <div class="contenedor-boton">
            <button id="enviar-btn">Reiniciar Juego</button>
        </div>
    </div>`;

    const formularioQuiz = document.getElementById('formulario-cuestionario');
    const botonEnviar = document.getElementById('enviar-btn');
    const divResultado = document.getElementById('resultado');
    const barraProgreso = document.getElementById('progreso');
    let respuestasUsuario = [];
    let preguntasIncorrectas = new Set();

    function playAudio(audioFile) {
        if (!audioFile) return;
        const audio = new Audio(audioFile);
        audio.play();
    }

    function actualizarProgreso() {
        let aciertos = 0;
        preguntasIncorrectas.clear();

        secciones.forEach((section, idx) => {
            if (respuestasUsuario[idx] !== undefined) {
                if (respuestasUsuario[idx] === section.correcta) {
                    aciertos++;
                } else {
                    preguntasIncorrectas.add(idx);
                }
            }
        });

        const progreso = (aciertos / secciones.length) * 100;
        barraProgreso.style.width = `${progreso}%`;
        barraProgreso.style.backgroundColor = progreso >= 100 ? '#06c906' : progreso >= 67 ? '#018fea' : '#ca2d2d';

        if (progreso === 100) {
            divResultado.innerHTML = `<p>¡Has completado el 100% de la actividad! </p>`;
            divResultado.style.display = 'block';
            mostrarConfetiFinal();
            playAudio('../PLUGINS/AUDIOS/win.mp3');
        } else if (respuestasUsuario.length === secciones.length) {
            divResultado.innerHTML = `
                <p>Has acertado ${aciertos} de ${secciones.length} preguntas.</p>
                <p>Puedes modificar las respuestas incorrectas.</p>
            `;
            divResultado.style.display = 'block';
            permitirCorreccion();
        }
    }

    function permitirCorreccion() {
        preguntasIncorrectas.forEach(index => {
            const preguntaBotones = document.querySelectorAll(`.btn-respuesta[data-index="${index}"]`);
            preguntaBotones.forEach(boton => {
                boton.disabled = false;
                boton.style.backgroundColor = ''; // Restaurar color
            });
        });
    }

    function reiniciarJuego() {
        respuestasUsuario = [];
        preguntasIncorrectas.clear();
        divResultado.style.display = 'none';
        barraProgreso.style.width = '0%';
        barraProgreso.style.backgroundColor = '#ca2d2d';
        formularioQuiz.innerHTML = ''; // Limpiar preguntas
        crearActividad(); // Recrear las preguntas
    }

    function crearActividad() {
        secciones.forEach(({ frase }, index) => {
            const contenedorPregunta = document.createElement('div');
            contenedorPregunta.className = 'contenedor-pregunta';
            contenedorPregunta.id = `pregunta-${index}`;
            contenedorPregunta.innerHTML = `
                <p>${frase}</p>
                <div class="contenedor-botones">
                    <button class="btn-respuesta" data-index="${index}" data-valor="true">True</button>
                    <button class="btn-respuesta" data-index="${index}" data-valor="false">False</button>
                </div>
            `;
            formularioQuiz.appendChild(contenedorPregunta);
        });

        document.querySelectorAll('.btn-respuesta').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const index = e.target.getAttribute('data-index');
                const valor = e.target.getAttribute('data-valor') === 'true';

                if (!preguntasIncorrectas.has(Number(index)) && respuestasUsuario[index] !== undefined) {
                    return; // Si la pregunta ya está respondida y no es incorrecta, no permitir cambios
                }

                respuestasUsuario[index] = valor;

                const preguntaBotones = document.querySelectorAll(`.btn-respuesta[data-index="${index}"]`);
                preguntaBotones.forEach(boton => {
                    boton.disabled = true;
                    boton.style.backgroundColor = '';
                });

                e.target.classList.add('seleccionado');
                if (valor === secciones[index].correcta) {
                    e.target.style.backgroundColor = 'green';
                    playAudio('../PLUGINS/AUDIOS/acierto.mp3');
                } else {
                    e.target.style.backgroundColor = 'red';
                    playAudio('../PLUGINS/AUDIOS/lose.mp3');
                }

                actualizarProgreso();
            });
        });
    }

    botonEnviar.addEventListener('click', reiniciarJuego);
    crearActividad();
    cargarConfeti();
}
