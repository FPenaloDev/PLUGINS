import { cargarConfeti, mostrarConfetiFinal } from "../ANIMACIONES/CONFETTI/confetti.js";

export function unir(contenedor, secciones) {
    const css = document.createElement('link');

    css.rel = 'stylesheet';
    css.type = 'text/css';
    css.href = 'PLUGINS/UNIRLINEAS/unirLineas.css'; // Cambié el nombre del archivo CSS
    document.head.appendChild(css);

    contenedor.innerHTML = `
        <div id="actividad_unir">
            <div id="indicadorProgreso">1/${secciones.length}</div>
            <div class="juego">
                <div class="columna" id="columnaIzquierda"></div>
                <div class="columna" id="columnaDerecha"></div>
            </div>
            <div id="mensajeFinal"></div>
        </div>
    `;

    const columnaIzquierda = document.getElementById('columnaIzquierda');
    const columnaDerecha = document.getElementById('columnaDerecha');
    let lineas = [], conceptoSeleccionado = null, faseActual = 0, conexionesCorrectas = 0;
    let conceptosActuales = secciones[faseActual].conceptos;

    function mostrarPopupFinal() {
        const overlay = document.createElement('div');
        overlay.id = 'overlayPopup';
        overlay.innerHTML = `
        <div class="overlay">
            <div class="popupContent">
                <h2>¡Felicidades!</h2>
                <p>Has completado todas las rondas. ¡Excelente trabajo!</p>

                <button id="btnCerrarPopup">Cerrar</button>
            </div>
        </div>
        `;
        contenedor.appendChild(overlay);
        document.querySelector('#actividad_unir').style.filter = 'blur(10px)';
        document.querySelector('#overlayPopup').style.display = 'flex';

        overlay.style.display = 'flex';

        document.querySelector('.overlay, #btnCerrarPopup').addEventListener('click', () => {
            overlay.style.display = 'none';
            document.querySelector('#actividad_unir').style.filter = 'blur(0px)';
            /* overlay.remove(); */
        });
    }
    function playAudio(audioFile) {
        if (!audioFile) {
            console.error("No se proporcionó un archivo de audio.");
            return;
        }

        const audio = new Audio(audioFile);
        audio.play();
    }
    function manejarTransicionDeFase() {
        if (faseActual < secciones.length - 1) {
            mostrarConfeti();
            document.getElementById('indicadorProgreso').textContent = `${faseActual + 2}/${secciones.length}`;
            document.getElementById('mensajeFinal').textContent = "¡Felicidades! Has completado esta fase.";
            setTimeout(() => {
                faseActual++;
                conceptosActuales = secciones[faseActual].conceptos;
                conexionesCorrectas = 0;
                cargarConceptos(conceptosActuales);
            }, 2000);
        } else {
            mostrarConfetiFinal();
            playAudio('./PLUGINS/AUDIOS/win.mp3');
            document.getElementById('mensajeFinal').textContent = "¡Felicidades! Has completado todas las fases.";
            setTimeout(() => {
                document.getElementById('mensajeFinal').textContent = "¡Excelente trabajo! Has completado todas las fases.";
                mostrarPopupFinal();
            }, 2000);
        }
    }

    function cargarConceptos(conceptos) {
        columnaIzquierda.innerHTML = '';
        columnaDerecha.innerHTML = '';
        lineas.forEach(linea => linea.remove());
        lineas = [];

        conceptos.forEach((concepto, idx) => {
            const elementoIzquierda = document.createElement('div');
            elementoIzquierda.classList.add('concepto');
            elementoIzquierda.dataset.index = idx;
            elementoIzquierda.innerHTML = concepto.izquierda;
            elementoIzquierda.addEventListener('click', () => seleccionarConcepto(elementoIzquierda, true));
            columnaIzquierda.appendChild(elementoIzquierda);

            const elementoDerecha = document.createElement('div');
            elementoDerecha.classList.add('concepto');
            elementoDerecha.dataset.index = idx;
            elementoDerecha.innerHTML = concepto.derecha;
            elementoDerecha.addEventListener('click', () => seleccionarConcepto(elementoDerecha, false));
            columnaDerecha.appendChild(elementoDerecha);

            const linea = document.createElement('div');
            linea.classList.add('linea');
            document.getElementById('actividad_unir').appendChild(linea);
            lineas.push(linea);
        });
        mezclarConceptos();
    }

    function mezclarConceptos() {
        // Mezclar los conceptos de la columna izquierda
        const conceptosIzquierda = Array.from(columnaIzquierda.children);
        for (let i = conceptosIzquierda.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            columnaIzquierda.appendChild(conceptosIzquierda[j]);
        }

        // Mezclar los conceptos de la columna derecha
        const conceptosDerecha = Array.from(columnaDerecha.children);
        for (let i = conceptosDerecha.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            columnaDerecha.appendChild(conceptosDerecha[j]);
        }
    }



    function seleccionarConcepto(elemento, esIzquierda) {
        if (conceptoSeleccionado && conceptoSeleccionado.esIzquierda !== esIzquierda) {
            conectarConceptos(conceptoSeleccionado.elemento, elemento);
            conceptoSeleccionado = null;
        } else {
            if (conceptoSeleccionado) conceptoSeleccionado.elemento.style.backgroundColor = '';
            conceptoSeleccionado = { elemento, esIzquierda };
        }
    }

    function conectarConceptos(izquierda, derecha) {
        if (izquierda.dataset.index === derecha.dataset.index) {
            const linea = lineas[izquierda.dataset.index];
            linea.classList.add('correcta', 'activa');
            actualizarPosicionLinea(linea, izquierda, derecha);
            izquierda.style.pointerEvents = derecha.style.pointerEvents = 'none';
            izquierda.classList.add('emparejado');
            derecha.classList.add('emparejado');
            playAudio('./PLUGINS/AUDIOS/acierto.mp3');
            conexionesCorrectas++;

            if (conexionesCorrectas === conceptosActuales.length) {
                manejarTransicionDeFase();
            }
        } else {
            izquierda.classList.add('sacudir');
            derecha.classList.add('sacudir');
            playAudio('./PLUGINS/AUDIOS/lose.mp3');
            setTimeout(() => {
                izquierda.classList.remove('sacudir');
                derecha.classList.remove('sacudir');
            }, 750);
        }
    }

    function actualizarPosicionLinea(linea, izquierda, derecha) {
        if (!izquierda || !derecha) {
            const index = lineas.indexOf(linea);
            // Buscar los elementos emparejados en sus respectivas columnas
            const elementosIzquierda = Array.from(columnaIzquierda.children);
            const elementosDerecha = Array.from(columnaDerecha.children);
            
            // Encontrar los elementos que coinciden con el índice de la línea
            izquierda = elementosIzquierda.find(el => el.dataset.index === index.toString());
            derecha = elementosDerecha.find(el => el.dataset.index === index.toString());
    
            // Verificar si los elementos existen y están emparejados
            if (!izquierda || !derecha || !izquierda.classList.contains('emparejado')) {
                return;
            }
        }
    
        const inicioX = izquierda.offsetLeft + izquierda.offsetWidth;
        const inicioY = izquierda.offsetTop + izquierda.offsetHeight / 2;
        const finX = derecha.offsetLeft;
        const finY = derecha.offsetTop + derecha.offsetHeight / 2;
    
        const dx = finX - inicioX, dy = finY - inicioY;
        const longitud = Math.sqrt(dx * dx + dy * dy);
        const angulo = Math.atan2(dy, dx);
    
        linea.style.width = `${longitud}px`;
        linea.style.transform = `rotate(${angulo}rad)`;
        linea.style.left = `${inicioX}px`;
        linea.style.top = `${inicioY}px`;
    }
    
    function inicializarJuego() {
        cargarConfeti();
        cargarConceptos(conceptosActuales);
        document.addEventListener('mousemove', actualizarLineaActiva);
    
        // Agregar un pequeño retraso al resize para mejor rendimiento
        let resizeTimeout;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(() => {
                lineas.forEach(linea => {
                    if (linea.classList.contains('correcta')) {
                        actualizarPosicionLinea(linea);
                    }
                });
            }, 100);
        });
    }

    function actualizarLineaActiva(e) {
        if (conceptoSeleccionado) {
            const rect = document.getElementById('actividad_unir').getBoundingClientRect();
            const inicioX = conceptoSeleccionado.esIzquierda ? conceptoSeleccionado.elemento.offsetLeft + conceptoSeleccionado.elemento.offsetWidth : e.clientX - rect.left;
            const inicioY = conceptoSeleccionado.esIzquierda ? conceptoSeleccionado.elemento.offsetTop + conceptoSeleccionado.elemento.offsetHeight / 2 : e.clientY - rect.top;
            const finX = conceptoSeleccionado.esIzquierda ? e.clientX - rect.left : conceptoSeleccionado.elemento.offsetLeft;
            const finY = conceptoSeleccionado.esIzquierda ? e.clientY - rect.top : conceptoSeleccionado.elemento.offsetTop + conceptoSeleccionado.elemento.offsetHeight / 2;

            const dx = finX - inicioX, dy = finY - inicioY;
            const longitud = Math.sqrt(dx * dx + dy * dy);
            const angulo = Math.atan2(dy, dx);

            const lineaActiva = lineas.find(linea => !linea.classList.contains('correcta'));
            if (lineaActiva) {
                lineaActiva.style.width = `${longitud}px`;
                lineaActiva.style.transform = `rotate(${angulo}rad)`;
                lineaActiva.style.left = `${inicioX}px`;
                lineaActiva.style.top = `${inicioY}px`;
                lineaActiva.classList.add('activa');
            }
        } else {
            lineas.forEach(linea => linea.classList.remove('activa'));
        }
    }
    inicializarJuego();
}

