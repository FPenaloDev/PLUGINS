import { cargarConfeti,mostrarConfetiFinal } from '../ANIMACIONES/CONFETTI/confetti.js';

export function sopaLetras(contenedor, secciones) {
    // Verificar si el contenedor existe
    if (!contenedor) return;


    // Limpiar el contenedor y su estado previo
    contenedor.innerHTML = '';
    // Asegurar que el CSS se carga solo una vez
    if (!document.querySelector('link[href="PLUGINS/SOPALETRAS/sopa_de_letras.css"]')) {
        const css = document.createElement('link');
        css.rel = 'stylesheet';
        css.type = 'text/css';
        css.href = 'PLUGINS/SOPALETRAS/sopa_de_letras.css';
        document.head.appendChild(css);
    }
    // Reinicializar todas las variables globales
    let cuadricula = Array.from({ length: 15 }, () => Array(15).fill(''));
    let ubicacionPalabras = {};
    let seleccionando = false;
    let juegoTerminado = false;
    const tamanoCuadricula = 15;

    // Estructura HTML
    contenedor.innerHTML = `
        <div id="sopaLetras">
            <div class="contenedor-boton-solucion">
                <button id="boton-pistas">Mostrar Pistas</button>
                <button id="boton-soluciones">Mostrar Soluciones</button>
            </div>
            <div class="contenedor-sopa-palabras">
                <div class="pistas">
                <div class="contenedor-titulo-pistas">
                    <div class="contador"><p><span class="aciertos"></span><span class="totales"></span></p></div>
                    <h2 class="pistas-titulo">PISTAS</h2>
                </div>
                <div id="lista-palabras">
                        <ul id="lista-palabras-ul">
                        <!-- Las palabras se generarán dinámicamente aquí -->
                        </ul>
                    </div>
                </div>
                <div class="contenedor-sopa">
                <table id="tabla-sopa">
                    <!-- Sopa de letras generada aquí -->
                </table>
                </div>
            </div>
            <div id="mensajeFinal"></div>
        </div>`;

    // Función para verificar espacio
    function verificarEspacio(palabra, fila, columna, direccion) {
        for (let i = 0; i < palabra.length; i++) {
            let nuevaFila = fila;
            let nuevaColumna = columna;

            if (direccion === 0) { // Horizontal
                nuevaColumna += i;
            } else if (direccion === 1) { // Vertical
                nuevaFila += i;
            }

            if (
                nuevaFila < 0 || nuevaFila >= tamanoCuadricula ||
                nuevaColumna < 0 || nuevaColumna >= tamanoCuadricula ||
                (cuadricula[nuevaFila][nuevaColumna] && cuadricula[nuevaFila][nuevaColumna] !== palabra[i])
            ) {
                return false;
            }
        }
        return true;
    }

    function cerrarPopup() {
        const overlay = document.getElementById('overlayPopup');
        overlay.style.display = 'none';
    }

    function mostrarPopupFinal() {
        const overlay = document.createElement('div');
        overlay.id = 'overlayPopup';
        overlay.innerHTML = `
            <div id="popupContent">
                <h2>¡Felicidades!</h2>
                <p>Has completado todas las rondas. ¡Excelente trabajo!</p>
                <button id="btnCerrarPopup">Cerrar</button>
            </div>
        `;
        document.querySelector('#sopaLetras').appendChild(overlay);

        overlay.style.display = 'flex';

        document.getElementById('btnCerrarPopup','overlayPopup').addEventListener('click', () => {
            cerrarPopup();
        });
        document.getElementById('overlayPopup').addEventListener('click', () => {
            cerrarPopup();
        });
    }

    // Función para colocar palabra
    function colocarEnCuadricula(palabra, fila, columna, direccion) {
        ubicacionPalabras[palabra] = [];
        for (let i = 0; i < palabra.length; i++) {
            let nuevaFila = fila;
            let nuevaColumna = columna;

            if (direccion === 0) {
                nuevaColumna += i;
            } else if (direccion === 1) {
                nuevaFila += i;
            }

            cuadricula[nuevaFila][nuevaColumna] = palabra[i].toUpperCase();
            ubicacionPalabras[palabra].push([nuevaFila, nuevaColumna]);
        }
    }

    // Función para colocar palabras
    function colocarPalabras() {
        secciones.forEach(item => {
            const palabra = item.palabra;
            let colocada = false;
            let intentos = 0;
            const maxIntentos = 100;

            while (!colocada && intentos < maxIntentos) {
                const direccion = Math.floor(Math.random() * 2);
                const filaInicio = Math.floor(Math.random() * tamanoCuadricula);
                const columnaInicio = Math.floor(Math.random() * tamanoCuadricula);

                if (verificarEspacio(palabra, filaInicio, columnaInicio, direccion)) {
                    colocarEnCuadricula(palabra, filaInicio, columnaInicio, direccion);
                    colocada = true;
                }
                intentos++;
            }

            if (!colocada) {
                console.error(`No se pudo colocar la palabra: ${palabra}`);
            }
        });
    }

    // Función para llenar espacios vacíos
    function llenarCuadricula() {
        for (let i = 0; i < tamanoCuadricula; i++) {
            for (let j = 0; j < tamanoCuadricula; j++) {
                if (!cuadricula[i][j]) {
                    cuadricula[i][j] = String.fromCharCode(65 + Math.floor(Math.random() * 26));
                }
            }
        }
    }

    // Función para generar la tabla
    function generarTabla() {
        const tablaSopa = document.getElementById('tabla-sopa');
        tablaSopa.innerHTML = '';

        for (let i = 0; i < tamanoCuadricula; i++) {
            const fila = document.createElement('tr');
            for (let j = 0; j < tamanoCuadricula; j++) {
                const celda = document.createElement('td');
                celda.classList.add('celda');
                celda.textContent = cuadricula[i][j];
                celda.dataset.fila = i;
                celda.dataset.columna = j;
                fila.appendChild(celda);
            }
            tablaSopa.appendChild(fila);
        }
    }

    // Función para resaltar palabra
    function resaltarPalabra(palabra, esSolucion = false) {
        const ubicaciones = ubicacionPalabras[palabra];
        if (ubicaciones) {
            ubicaciones.forEach(([fila, columna], index) => {
                const celda = document.querySelector(`.celda[data-fila="${fila}"][data-columna="${columna}"]`);
                if (celda) {
                    if (esSolucion) {
                        celda.classList.add('no-encontrada');
                    } else {
                        celda.style.border = '2px solid var(--borde-letra-encontrada)';
                        celda.style.background = 'var(--background-letra-encontrada)';
                        celda.style.color = 'var(--color-letra-encontrada)';
                    }

                    if (index === 0) {
                        if (ubicaciones[1] && ubicaciones[1][0] === fila) {
                            celda.style.borderTopLeftRadius = '15px';
                            celda.style.borderBottomLeftRadius = '15px';
                        } else {
                            celda.style.borderTopLeftRadius = '15px';
                            celda.style.borderTopRightRadius = '15px';
                        }
                    } else if (index === ubicaciones.length - 1) {
                        if (ubicaciones[1] && ubicaciones[1][0] === fila) {
                            celda.style.borderTopRightRadius = '15px';
                            celda.style.borderBottomRightRadius = '15px';
                        } else {
                            celda.style.borderBottomLeftRadius = '15px';
                            celda.style.borderBottomRightRadius = '15px';
                        }
                    } else {
                        celda.style.borderRadius = '0';
                    }

                    celda.style.fontWeight = 'bold';
                }
            });
        }
    }

    function playAudio(audioFile) {
        if (!audioFile) {
            console.error("No se proporcionó un archivo de audio.");
            return;
        }

        const audio = new Audio(audioFile);
        audio.play();
    }

    // Función para verificar selección
    function verificarSeleccion(seleccion) {
        const seleccionOrdenada = seleccion
            .map(c => `${c[0]}-${c[1]}`)
            .sort();

        for (const [palabra, ubicaciones] of Object.entries(ubicacionPalabras)) {
            const ubicacionesOrdenadas = ubicaciones
                .map(c => `${c[0]}-${c[1]}`)
                .sort();

            if (seleccionOrdenada.join(',') === ubicacionesOrdenadas.join(',')) {
                resaltarPalabra(palabra);

                document.querySelectorAll('.celda').forEach(celda => {
                    const clave = `${celda.dataset.fila}-${celda.dataset.columna}`;
                    if (ubicacionesOrdenadas.includes(clave)) {
                        celda.classList.add('encontrada');
                    }
                });

                const liPalabra = document.querySelector(`[data-palabra="${palabra}"]`);

                if (liPalabra) {
                    liPalabra.style.background = 'var(--background-pista-palabra-encontrada)';
                    liPalabra.style.border = '3px solid var(--borde-pista-encontrada)';
                    liPalabra.style.color = 'var(--color-pista-encontrada)';
                    liPalabra.style.fontWeight = 'bold';
                    liPalabra.innerHTML += `<svg class="icono-correcto" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><g fill="none"><path fill-rule="evenodd" clip-rule="evenodd" d="M5 1a4 4 0 0 0-4 4v14a4 4 0 0 0 4 4h14a4 4 0 0 0 4-4V5a4 4 0 0 0-4-4H5zm14.707 6.707a1 1 0 0 0-1.414-1.414L9 15.586l-3.293-3.293a1 1 0 0 0-1.414 1.414l4 4a1 1 0 0 0 1.414 0l10-10z" fill="var(--acierto)"/></g></svg>`;
                    puntuar(true);
                    /* liPalabra.querySelector('.espacio').innerHTML = `${palabra}`; */
                }
                document.querySelector(`[data-palabra="${palabra}"]`).classList.add('encontrada');
                verificarJuegoTerminado();
                break;
            }
        }
    }

    //Puntuar
    function puntuar(acierto) {
        let aciertos = document.querySelector('.aciertos');
        let totales = document.querySelector('.totales');
        const totalPalabras = secciones.length;
        aciertos.textContent = '0';
        totales.textContent = `/${totalPalabras}`;
        let contador = document.querySelectorAll('li.encontrada').length;
        if (acierto) {
            playAudio('./PLUGINS/AUDIOS/acierto.mp3');
            contador++;
        }
        aciertos.textContent = contador;
    }
    puntuar();

    function deshabilitarCeldas() {
        const celdas = document.querySelectorAll('.celda');
        celdas.forEach(celda => {
            celda.style.pointerEvents = 'none';
        });
    }

    // Función para verificar si el juego terminó
    function verificarJuegoTerminado() {
        const todasEncontradas = Object.keys(ubicacionPalabras).every(palabra =>
            document.querySelector(`[data-palabra="${palabra}"]`).classList.contains('encontrada')
        );
        if (todasEncontradas) {
            juegoTerminado = true;
            deshabilitarCeldas();
            playAudio('./PLUGINS/AUDIOS/win.mp3');
            const botonMostrar = document.getElementById('boton-soluciones');
            botonMostrar.disabled = true;
            mostrarConfetiFinal();
            document.getElementById('mensajeFinal').textContent = "¡Felicidades! Has completado todas las fases.";
            setTimeout(() => {
                document.getElementById('mensajeFinal').textContent = "¡Excelente trabajo! Has completado todas las fases.";
                mostrarPopupFinal();
            }, 2000);
        }
    }

    // Función para mostrar soluciones
    function mostrarSoluciones() {
        playAudio('./PLUGINS/AUDIOS/lose.mp3');
        for (const [palabra, ubicaciones] of Object.entries(ubicacionPalabras)) {
            const li = document.querySelector(`[data-palabra="${palabra}"]`);
            const parrafo = li.querySelector('p');
            if (li && !li.classList.contains('encontrada')) {
                resaltarPalabra(palabra, true);
                li.classList.add('li-solucion');
                li.style.background = 'var(--background-pista-palabra-no-encontrada)';
                li.style.border = '3px solid var(--borde-pista-no-encontrada)';
                parrafo.style.color = 'var(--color-pista-no-encontrada)';
                parrafo.style.fontWeight = 'bold';
                li.innerHTML += `<svg class="icono-incorrecto" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path fill="var(--error)" d="M19 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2m-3.4 14L12 13.4L8.4 17L7 15.6l3.6-3.6L7 8.4L8.4 7l3.6 3.6L15.6 7L17 8.4L13.4 12l3.6 3.6z"/></svg>`;
                /*                 const espacio = li.querySelector('.espacio');
                                espacio.innerHTML = `${palabra}`; */
            }
        }
        deshabilitarCeldas();
        juegoTerminado = true;
        const botonMostrar = document.getElementById('boton-soluciones');
        botonMostrar.disabled = true;
    }

    // Función para manejar selección
    function manejarSeleccion() {
        const celdas = document.querySelectorAll('.celda');
        let seleccion = [];

        celdas.forEach(celda => {
            celda.addEventListener('mousedown', () => {
                if (juegoTerminado) return;
                seleccionando = true;
                seleccion = [[parseInt(celda.dataset.fila), parseInt(celda.dataset.columna)]];
                celda.classList.add('seleccionada');
            });

            celda.addEventListener('mouseover', () => {
                if (seleccionando && !juegoTerminado) {
                    seleccion.push([parseInt(celda.dataset.fila), parseInt(celda.dataset.columna)]);
                    celda.classList.add('seleccionada');
                }
            });

            celda.addEventListener('mouseup', () => {
                if (seleccionando && !juegoTerminado) {
                    verificarSeleccion(seleccion);
                    seleccionando = false;
                    document.querySelectorAll('.celda.seleccionada').forEach(c => c.classList.remove('seleccionada'));
                }
            });
        });

        document.body.addEventListener('mouseup', () => {
            seleccionando = false;
            document.querySelectorAll('.celda.seleccionada').forEach(c => c.classList.remove('seleccionada'));
        });
    }

    // Función para manejar animación de lista
    function manejarAnimacionLista() {
        const botonPistas = document.getElementById('boton-pistas');
        const pistas = document.querySelector('.pistas');

        botonPistas.addEventListener('click', () => {
            if (pistas.style.display === 'none' || pistas.style.display === '') {
                pistas.style.display = 'block';
                pistas.classList.remove('ocultar');
                pistas.classList.add('mostrar');
                botonPistas.textContent = 'Ocultar Pistas';
            } else {
                pistas.classList.remove('mostrar');
                pistas.classList.add('ocultar');
                pistas.addEventListener('animationend', () => {
                    pistas.style.display = 'none';
                }, { once: true });
                botonPistas.textContent = 'Mostrar Pistas';
            }
        });
    }

    // Generar lista de palabras
    const listaPalabrasUL = document.getElementById('lista-palabras-ul');
    secciones.forEach((item, index) => {
        const li = document.createElement('li');
        li.dataset.palabra = item.palabra;
        li.innerHTML = `<p>${index + 1} - ${item.definicion}<span class="espacio"></span></p>`;
        listaPalabrasUL.appendChild(li);
    });

    // Configurar botón de soluciones
    document.getElementById('boton-soluciones').addEventListener('click', mostrarSoluciones);

    // Inicializar el juego
    colocarPalabras();
    llenarCuadricula();
    generarTabla();
    manejarSeleccion();
    manejarAnimacionLista();
    cargarConfeti();
}