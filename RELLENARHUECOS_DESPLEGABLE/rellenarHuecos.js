import {cargarConfeti, mostrarConfetiFinal} from '../ANIMACIONES/CONFETTI/confetti.js';

export function rellenarHuecos(contenedor, secciones) {
    if (document.querySelector('.css')) {
        document.querySelector('.css').remove();
    }
    const css = document.createElement('link');
    css.rel = 'stylesheet';
    css.className = 'css';
    css.type = 'text/css';
    css.href = 'PLUGINS/RELLENARHUECOS_DESPLEGABLE/rellenarHuecos.css';
    document.head.appendChild(css);
    
    // Inyeccion HTML
    contenedor.innerHTML = `
    <div class="contenedor-cuestionario">
    <div class="barra-lateral">
    <div>
    <div class="contenedor-progreso">
    <div class="barra-progreso">
    <div class="progreso" id="progreso"></div>
    </div>
    </div>
    </div>
    </div>
    
    <div class="contenido-principal  animate__fadeIn">
    <div class="resultado" id="resultado"></div>
    <div id="formulario-cuestionario"></div>
    </div>
    <div class="contenedor-boton">
    <button id="enviar-btn">Enviar Respuestas</button>
    <button id="mostrar-soluciones-btn">Mostrar Soluciones</button>
    </div>
    </div>
    `;
    cargarConfeti();
    // Variables
    const formularioQuiz = document.getElementById('formulario-cuestionario');
    const botonEnviar = document.getElementById('enviar-btn');
    const botonMostrarSoluciones = document.getElementById('mostrar-soluciones-btn');
    const divResultado = document.getElementById('resultado');
    const barraProgreso = document.getElementById('progreso');
    
    let respuestas = secciones.map(() => []);
    
    // Función para crear el formulario del cuestionario
    function crearFormularioQuiz() {
        secciones.forEach(({ frase, tipoInput, opciones }, indice) => {
            const contenedorPregunta = document.createElement('div');
            contenedorPregunta.className = 'contenedor-pregunta animate__fadeInUp';
            contenedorPregunta.style.animationDelay = `${indice * 0.1}s`;
            
            // Agregar palabras si están presentes
            if (opciones) {

                contenedorPregunta.classList.add('cortas');
                formularioQuiz.classList.add('corto');
            }
            
            // Reemplazar los inputs en la frase según el tipoInput
            let fraseConInputs = frase.replace(/<input[^>]*>/g, (match) => {
                const inputId = match.match(/id='([^']+)'/)[1];
                const [, seccionIndex, inputIndex] = inputId.match(/answer-(\d+)-(\d+)/);
                
                if (tipoInput === 'desplegable') {
                    const opcionesHTML = opciones.map(opcion => 
                        `<option value="${opcion}">${opcion}</option>`
                    ).join('');
                    
                    return `
                        <select 
                            id="${inputId}" 
                            onchange="handleInput(${seccionIndex}, ${inputIndex}, this.value)"
                            class="input-desplegable"
                        >
                            <option value=""></option>
                            ${opcionesHTML}
                        </select>
                    `;
                } else {
                    // Mantener input de texto por defecto
                    return match;
                }
            });
            
            contenedorPregunta.innerHTML += `<p class="frase">${fraseConInputs}</p>`;
            
            formularioQuiz.appendChild(contenedorPregunta);
        });
    }
    
    // Función para manejar la entrada del usuario
    function manejarInput(indice, subIndice, valor) {
        if (!respuestas[indice]) respuestas[indice] = [];
        respuestas[indice][subIndice] = valor.toLowerCase().trim();
        actualizarProgreso();
    }

    // Función para actualizar la barra de progreso
    function actualizarProgreso() {
        const totalRespuestas = respuestas.reduce((conteo, respuesta) => conteo + respuesta.filter(Boolean).length, 0);
        const totalInputs = secciones.reduce((conteo, item) => conteo + item.respuesta.length, 0);
        const progreso = (totalRespuestas / totalInputs) * 100;
        barraProgreso.style.width = `${progreso}%`;
    }

    // Función para mostrar las soluciones
    function mostrarSoluciones() {
        secciones.forEach(({ respuesta, tipoInput }, indice) => {
            respuesta.forEach((respuestaCorrecta, subIndice) => {
                const elemento = document.getElementById(`answer-${indice}-${subIndice}`);
                if (elemento) {
                    const respuestaUsuario = respuestas[indice][subIndice];
                    if (!respuestaUsuario || respuestaUsuario !== respuestaCorrecta.toLowerCase()) {
                        if (tipoInput === 'desplegable') {
                            elemento.value = respuestaCorrecta;
                            elemento.style.color = 'red';
                            elemento.disabled = true;
                        } else {
                            elemento.value = respuestaCorrecta;
                            elemento.style.color = 'red';
                            elemento.style.fontWeight = 'bold';
                            elemento.disabled = true;
                        }
                        mostrarResultados();
                    }
                } else {
                    console.warn(`No se encontró el elemento con ID answer-${indice}-${subIndice}`);
                }
            });
        });
    }

    // Función para verificar respuestas
    function verificarRespuestas() {
        let puntaje = 0;
        let totalPreguntas = secciones.reduce((total, seccion) => total + (seccion.respuesta ? seccion.respuesta.length : 0), 0);
        let totalRespuestas = 0;
    
        secciones.forEach(({ respuesta, tipoInput }, indice) => {
            if (respuesta) {
                respuesta.forEach((respuestaCorrecta, subIndice) => {
                    const elemento = document.getElementById(`answer-${indice}-${subIndice}`);
                    const respuestaUsuario = respuestas[indice][subIndice];
                    
                    if (respuestaUsuario && respuestaUsuario === respuestaCorrecta.toLowerCase()) {
                        if (tipoInput === 'desplegable') {
                            elemento.style.backgroundColor = 'green';
                            elemento.style.color = 'white';
                            elemento.style.cursor = 'not-allowed';
                        } else {
                            elemento.style.borderColor = 'var(--success-color)';
                            elemento.classList.add('correcto');
                        }
                        elemento.disabled = true;
                        totalRespuestas++;
                    } else {
                        if (tipoInput === 'desplegable') {
                            elemento.style.backgroundColor = 'red';
                            elemento.style.color = 'white';
                        } else {
                            elemento.style.borderColor = 'var(--error-color)';
                        }
                    }
                });
    
                if (respuestas[indice].length === respuesta.length &&
                    respuestas[indice].every((resp, idx) => resp === respuesta[idx].toLowerCase())) {
                    puntaje++;
                }
            }
        });
    
        return { puntaje, totalRespuestas, totalPreguntas };
    }
    
    // Función para mostrar los resultados
    function mostrarResultados() {
        const { totalRespuestas, totalPreguntas } = verificarRespuestas();
        const porcentaje = (totalRespuestas / totalPreguntas) * 100;
        console.log(porcentaje);
        if (porcentaje === 100) {
            mostrarConfetiFinal();
        }
        divResultado.style.display = 'block';
        divResultado.textContent = `¡Has acertado ${totalRespuestas} de ${totalPreguntas}! (${porcentaje.toFixed(2)}%)`;
    }

    // Evento para el botón "Enviar Respuestas"
    botonEnviar.addEventListener('click', mostrarResultados);

    // Agregar evento al botón "Mostrar Soluciones"
    botonMostrarSoluciones.addEventListener('click', mostrarSoluciones);

    // Crear el formulario
    crearFormularioQuiz();

    // Agregar función global para manejar input
    window.handleInput = manejarInput;
}