import { cargarConfeti, mostrarConfetiFinal } from '../ANIMACIONES/CONFETTI/confetti.js';
export function rellenarHuecos(contenedor, secciones) {
    if (document.querySelector('.css')) {
        document.querySelector('.css').remove();
    }
    const css = document.createElement('link');
    css.rel = 'stylesheet';
    css.className = 'css';
    css.type = 'text/css';
    css.href = 'PLUGINS/RELLENARHUECOS_ESCRIBIR/rellenarHuecos_escribir.css';
    document.head.appendChild(css);
    // Inyeccion HTML
    contenedor.innerHTML = `
    <div class="contenedor-cuestionario">
      <div class="barra-lateral animate__animated animate__slideInLeft">
        <div>
          <div class="contenedor-progreso">
            <div class="barra-progreso">
            <div class="progreso" id="progreso"></div>
            </div>
            </div>
        </div>
        </div>
        
        <div class="contenido-principal">
        <div class="resultado" id="resultado"></div>
        <div id="formulario-cuestionario"></div>
        </div>
        <div class="contenedor-boton">
          <button id="enviar-btn">Comprobar Respuestas</button>
          <button id="reiniciar-btn"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><g fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="3"><path d="M12 3a9 9 0 1 1-5.657 2"/><path d="M3 4.5h4v4"/></g></svg><span class="texto-boton">Reiniciar</span></button>
          <button id="mostrar-soluciones-btn">Mostrar Soluciones</button>
        </div>
    </div>
    `;

    // Variables
    const formularioQuiz = document.getElementById('formulario-cuestionario');
    const botonEnviar = document.getElementById('enviar-btn');
    const botonMostrarSoluciones = document.getElementById('mostrar-soluciones-btn');
    const botonReiniciar = document.getElementById('reiniciar-btn');
    const divResultado = document.getElementById('resultado');
    const barraProgreso = document.getElementById('progreso');

    let respuestas = secciones.map(() => []);
    // Función para manejar la entrada del usuario
    function manejarInput(indice, subIndice, valor) {
        if (!respuestas[indice]) respuestas[indice] = [];
        respuestas[indice][subIndice] = valor.toLowerCase().trim();
    }
    //Funcion para reproducir audios
    function playAudio(audioFile) {
        if (!audioFile) {
            console.error("No se proporcionó un archivo de audio.");
            return;
        }

        const audio = new Audio(audioFile);
        audio.play();
    }
    // Función para actualizar la barra de progreso
    function actualizarProgreso(aciertos, totalPreguntas) {
        const progreso = (aciertos / totalPreguntas) * 100;
        barraProgreso.style.width = `${progreso}%`;

        // Cambiar color según el porcentaje
        if (progreso <= 34) {
            barraProgreso.style.backgroundColor = '#ca2d2d';
        } else if (progreso <= 67) {
            barraProgreso.style.backgroundColor = '#018fea';
        } else if (progreso <= 99) {
            barraProgreso.style.backgroundColor = '#06c906';
        } else if (progreso === 100) {
            barraProgreso.style.backgroundColor = '#06c906';
            mostrarConfetiFinal();
            playAudio('PLUGINS/audios/win.mp3');
            divResultado.innerHTML += `<br>¡Enhorabuena por haber completado la actividad, Continúa asi!`;
            botonEnviar.disabled = true;

        }
    }
    // Función para mostrar las soluciones
    function mostrarSoluciones() {
        secciones.forEach(({ respuesta }, indice) => {
            respuesta.forEach((respuestaCorrecta, subIndice) => {
                const input = document.getElementById(`answer-${indice}-${subIndice}`);
                if (input) {
                    const respuestaUsuario = respuestas[indice][subIndice];
                    if (!respuestaUsuario || respuestaUsuario !== respuestaCorrecta.toLowerCase()) {
                        input.value = respuestaCorrecta;
                        input.classList.add('incorrecto');
                        input.disabled = true;

                        // Ajustar el tamaño del input tras establecer el valor
                        ajustarTamañoInput(input);
                        mostrarResultados();
                        playAudio('./PLUGINS/AUDIOS/lose.mp3');

                    }
                } else {
                    console.warn(`No se encontró el input con ID answer-${indice}-${subIndice}`);
                }
            });
        });
    }
    // Funcion para ajustar el tamaño del input
    function ajustarTamañoInput(input) {
        const tempSpan = document.createElement('span');
        tempSpan.style.visibility = 'hidden';
        tempSpan.style.whiteSpace = 'nowrap';
        tempSpan.style.font = getComputedStyle(input).font; // Usar el mismo estilo de fuente que el input
        document.body.appendChild(tempSpan);

        tempSpan.textContent = input.value;

        // Ajustar el ancho del input al ancho del contenido más 30px
        const anchoTexto = tempSpan.offsetWidth;
        input.style.width = `${anchoTexto + 50}px`; // Sumar 15px a cada lado

        document.body.removeChild(tempSpan);
    }
    // Función para verificar respuestas
    function verificarRespuestas() {
        let puntaje = 0;
        let totalPreguntas = 0;
        let totalRespuestas = 0;

        // Calcular el total de preguntas sumando todas las respuestas esperadas
        secciones.forEach(({ respuesta }) => {
            totalPreguntas += respuesta.length;
        });

        secciones.forEach(({ respuesta }, indice) => {
            respuesta.forEach((respuestaCorrecta, subIndice) => {
                const input = document.getElementById(`answer-${indice}-${subIndice}`);
                const respuestaUsuario = respuestas[indice][subIndice];
                if (respuestaUsuario && respuestaUsuario === respuestaCorrecta.toLowerCase()) {
                    input.classList.add('correcto');
                    input.disabled = true;
                    totalRespuestas++;
                } else {
                    input.classList.add('incorrecto');
                }
            });

            if (respuestas[indice].length === respuesta.length &&
                respuestas[indice].every((resp, idx) => resp === respuesta[idx].toLowerCase())) {
                puntaje++;
            }
        });

        return { puntaje, totalRespuestas, totalPreguntas };
    }

    // Función para reiniciar la actividad
    function reiniciarActividad() {
        document.getElementById('formulario-cuestionario').innerHTML = '';
        document.getElementById('resultado').style.display = 'none';
        document.getElementById('progreso').style.width = '0%';
        document.getElementById('progreso').style.backgroundColor = '#ca2d2d';
        document.getElementById('enviar-btn').disabled = false;
        document.getElementById('mostrar-soluciones-btn').disabled = false;
    
        respuestas = secciones.map(() => []);
        iniciar();
    }    
    // Función para mostrar los resultados
    function mostrarResultados() {
        const { totalRespuestas, totalPreguntas } = verificarRespuestas();
        const porcentaje = (totalRespuestas / totalPreguntas) * 100;
        divResultado.style.display = 'block';
        divResultado.textContent = `¡Has acertado ${totalRespuestas} de ${totalPreguntas}! (${porcentaje.toFixed(2)}%)`;
        // Actualizar la barra de progreso después de enviar respuestas
        actualizarProgreso(totalRespuestas, totalPreguntas);
        
    }
    // Crear actividad
    function crearActividad() {
        secciones.forEach(({ frase }, indice) => {
            const contenedorPregunta = document.createElement('div');
            contenedorPregunta.className = 'contenedor-pregunta';
            contenedorPregunta.innerHTML = frase;

            // Actualizar el evento oninput de los inputs existentes
            const inputs = contenedorPregunta.getElementsByTagName('input');
            Array.from(inputs).forEach((input, subIndice) => {
                input.oninput = function () {
                    manejarInput(indice, subIndice, this.value);
                };
            });

            formularioQuiz.appendChild(contenedorPregunta);
        });
    }
    // Evento para el botón "Enviar Respuestas"
    botonEnviar.addEventListener('click', () => {
        mostrarResultados();
        document.querySelectorAll('input').forEach(input => {
            ajustarTamañoInput(input);
            input.style.textAlign = 'center';
        });


    });
    // Agregar evento al botón "Mostrar Soluciones"
    botonMostrarSoluciones.addEventListener('click', () => {
        mostrarSoluciones();
        botonMostrarSoluciones.disabled = true;
        document.querySelectorAll('input').forEach(input => input.style.textAlign = 'center');

    });
    // Evento para reiniciar
    botonReiniciar.addEventListener('click', () => {
        reiniciarActividad();
    })

    function iniciar() {
        crearActividad();
        cargarConfeti();
    }
    iniciar();
}

