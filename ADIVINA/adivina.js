

export function adivina(contenedor, secciones) {
    if (document.querySelector('.css')) {
        document.querySelector('.css').remove();
    }
    const css = document.createElement('link');
    css.rel = 'stylesheet';
    css.className = 'css';
    css.type = 'text/css';
    css.href = './PLUGINS/ADIVINA/adivina.css';
    document.head.appendChild(css);

    let intentos = 0;
    const maxIntentos = 3;
    let seccionActual = 0;
    let puntaje = 0;

    // Función para generar contenido dinámico
    function iniciarActividad() {
        if (!contenedor) {
            console.error('Elemento con ID #si408 no encontrado.');
            return;
        }

        contenedor.innerHTML = `
        <div id="actividad_adivina">
            <div id="intentos">${'<svg class="svg-intentos" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg"><path d="M 58,17 C 52,7 42,0 30,0 C 13,0 0,13 0,30 C 0,63 18,68 58,106 C 98,68 116,63 116,30 C 116,13 103,0 86,0 C 74,0 64,7 58,17 z" fill="var(--corazones)" stroke="var(--borde-corazones)" stroke-width="4"></path></svg>'.repeat(maxIntentos)}</div>
            <span class="pista-titulo">Pista</span><p id="pista"> ${secciones[seccionActual].pistas[0]}</p>
            <div id="progreso">${generarInputs()}</div>
            <button id="verificar">Intentar</button>
            <p id="mensaje"></p>
            <div id="siguiente-container"></div>
        </div>
    `;

        document.querySelector('#verificar').addEventListener('click', verificarRespuesta);
    }

    // Función para generar los inputs para cada carácter
    function generarInputs() {
        const palabra = secciones[seccionActual].palabra;
        const letrasMostradas = secciones[seccionActual].letrasMostradas;
        let inputIndex = 0; // Índice separado para los inputs reales

        return palabra
            .split('')
            .map((letra) => {
                // Si es un espacio, solo retorna el span
                if (letra === ' ') {
                    return '<span style="width: 10px; display: inline-block;"></span><br><br>';
                }

                // Para caracteres no espacios, incrementa el índice y genera el input
                inputIndex++;
                const isVisible = letrasMostradas.includes(letra);
                return `<input type="text" maxlength="1" class="input-char" data-index="${inputIndex}" value="${isVisible ? letra : ''}" ${isVisible ? 'disabled' : ''}>`;
            })
            .join('');
    }

    function insertarImg() {
        const div = document.getElementById('actividad_adivina');
        if (secciones[seccionActual].imagen) {
            const imagen = document.createElement('img');
            div.style.maxWidth = '100%';
            div.style.width = '50%';
            imagen.src = secciones[seccionActual].imagen;
            imagen.id = "imagen-adivina";
            contenedor.style.display = 'flex';
            contenedor.style.justifyContent = 'space-between';
            contenedor.style.maxWidth = '80%';
            contenedor.style.margin = '0 auto';
            contenedor.appendChild(imagen);
        }
    }

    // Función para verificar la respuesta del usuario
    function verificarRespuesta() {
        const inputs = document.querySelectorAll('.input-char');
        const mensaje = document.querySelector('#mensaje');
        const pistaElemento = document.querySelector('#pista');
        const progresoElemento = document.querySelector('#progreso');
        const intentosElemento = document.querySelector('#intentos');

        let respuestaUsuario = '';
        inputs.forEach(input => {
            respuestaUsuario += input.value.toLowerCase() || '_';
        });

        respuestaUsuario = respuestaUsuario.replace(/_/g, '').replace(/ /g, '');
        const palabraCorrecta = secciones[seccionActual].palabra.toLowerCase().replace(/ /g, '');
        let i = 0;
        if (respuestaUsuario === palabraCorrecta) {
            mensaje.textContent = '¡Correcto! Has adivinado la palabra.';
            mensaje.style.color = 'green';
            puntaje++;
            desactivarInput();
            mostrarBotonSiguiente();
        } else {
            intentos++;
            if (intentos < maxIntentos) {
                secciones[seccionActual].letrasMostradas.push(secciones[seccionActual].palabra[intentos]);
                progresoElemento.innerHTML = generarInputs();
                pistaElemento.textContent = `${secciones[seccionActual].pistas[intentos]}`;
                intentosElemento.removeChild(intentosElemento.lastChild); /*METER ANIMACION*/
                mensaje.textContent = `Incorrecto. Te quedan ${maxIntentos - intentos} intentos.`;
                mensaje.style.color = 'red';
                agregarListenersInputs();
                console.log(i);
                i++;
                console.log(i);
            } else {
                completarPalabra();
                mensaje.textContent = `Has fallado. La palabra era: ${secciones[seccionActual].palabra}.`;
                mensaje.style.color = 'red';
                intentosElemento.innerHTML = '';
                desactivarInput();
                mostrarBotonSiguiente();
            }
        }
    }

    // Función para completar la palabra con letras faltantes en rojo
    function completarPalabra() {
        const palabra = secciones[seccionActual].palabra;
        const inputs = document.querySelectorAll('.input-char');
        let inputIndex = 0;
        
        palabra.split('').forEach((letra) => {
            // Si es un espacio, saltamos este caracter
            if (letra === ' ') {
                return;
            }
            
            // Si el input está vacío, rellenamos con la letra correspondiente
            if (!inputs[inputIndex] || !inputs[inputIndex].value) {
                if (inputs[inputIndex]) {
                    inputs[inputIndex].value = letra;
                    inputs[inputIndex].classList.add('letra-roja');
                }
            }
            inputIndex++;
        });
    }

    // Función para desactivar el input y botón al finalizar la actividad
    function desactivarInput() {
        const inputs = document.querySelectorAll('.input-char');
        inputs.forEach(input => input.disabled = true);
        document.querySelector('#verificar').disabled = true;
    }

    // Función para agregar evento que pase al siguiente input automáticamente
    function agregarListenersInputs() {
        const inputs = document.querySelectorAll('.input-char');
        inputs.forEach((input, index) => {
            input.addEventListener('input', () => {
                if (input.value && index < inputs.length - 1) {
                    let nextInput = inputs[index + 1];
                    // Busca el siguiente input habilitado
                    while (nextInput && nextInput.disabled) {
                        nextInput = inputs[++index];
                    }
                    if (nextInput) {
                        nextInput.focus();
                    }
                }
            });
        });
    }

    // Función para mostrar el botón "Siguiente"
    function mostrarBotonSiguiente() {
        const siguienteContainer = document.querySelector('#siguiente-container');
        siguienteContainer.innerHTML = '<button id="siguiente">Siguiente</button>';
        document.querySelector('#siguiente').addEventListener('click', pasarSiguienteSeccion);
    }

    // Función para pasar a la siguiente sección
    function pasarSiguienteSeccion() {
        if (seccionActual < secciones.length - 1) {
            seccionActual++;
            intentos = 0;
            iniciarActividad();
            agregarListenersInputs();
            insertarImg();

        } else {
            mostrarRetroalimentacion();
        }
    }

    // Función para mostrar retroalimentación final
    // Función para mostrar retroalimentación final en un popup
    function mostrarRetroalimentacion() {
        const actividad = document.querySelector('#actividad_adivina');
        const popup = document.createElement('div');
        popup.id = 'popup-retroalimentacion';
        popup.innerHTML = `
        <div id="popup-content">
            <h2>¡Actividad finalizada!</h2>
            <p>Has acertado ${puntaje} palabras de ${secciones.length}</p>
            <button id="cerrar-popup">Cerrar</button>
        </div>
    `;

        actividad.appendChild(popup);

        document.querySelector('#popup-retroalimentacion').addEventListener('click', () => {
            popup.remove();
        });
        document.querySelector('#cerrar-popup').addEventListener('click', () => {
            popup.remove();
        });
    }

    // Inicia la actividad al cargar el script
    iniciarActividad();
    agregarListenersInputs();
    insertarImg();
}
