import { cargarConfeti, mostrarConfetiFinal } from '../../ANIMACIONES/CONFETTI/confetti.js';



export function memory(contenedor, secciones) {
    if (document.querySelector('.css')) {
        document.querySelector('.css').remove();
    }
    const css = document.createElement('link');
    css.rel = 'stylesheet';
    css.className = 'css';
    css.type = 'text/css';
    css.href = 'PLUGINS/MEMORY/memory.css';
    document.head.appendChild(css);

    contenedor.innerHTML = `
        <div id="memory">
            <h1>Juego de Memoria</h1>
            <div id="tablero"></div>
            <button id="reiniciar">
        <svg class="icono-reiniciar" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="4" stroke-linecap="round" stroke-linejoin="round">
            <path d="M23 4v6h-6"></path>
            <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"></path>
        <span class="texto-reiniciar">Reiniciar</span>
        </svg>
    </button>
        </div>
    `;

    let tarjetasVolteadas = [];
    let movimientos = 0;

    const tablero = document.getElementById('tablero');
    const contadorMovimientos = document.getElementById('movimientos');
    const contadorTiempo = document.getElementById('tiempo');
    const botonReiniciar = document.getElementById('reiniciar');
    function iniciarJuego() {
        cargarConfeti();
        tablero.innerHTML = ''; // Asegurar que el tablero esté vacío

        // Duplicamos cada sección para que cada pareja tenga dos tarjetas
        const tarjetas = secciones
            .flatMap(seccion => [
                { ...seccion, id: `${seccion.pareja}A`, contenido: seccion.elemento1, background: seccion.borde },
                { ...seccion, id: `${seccion.pareja}B`, contenido: seccion.elemento2, background: seccion.borde }
            ])
            .sort(() => Math.random() - 0.5); // Aleatorizamos el orden de las tarjetas

        // Creamos las tarjetas
        tarjetas.forEach(tarjeta => {
            const elementoTarjeta = crearTarjeta(tarjeta);
            tablero.appendChild(elementoTarjeta);
        });
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
        contenedor.appendChild(overlay);


        overlay.style.display = 'flex';

        document.getElementById('btnCerrarPopup','overlayPopup').addEventListener('click', () => {
            cerrarPopup();
        });
        document.getElementById('overlayPopup').addEventListener('click', () => {
            cerrarPopup();
        });
    }

    function crearTarjeta(tarjeta) {
        const elementoTarjeta = document.createElement('div');
        elementoTarjeta.classList.add('tarjeta');
        elementoTarjeta.dataset.id = tarjeta.id;

        const frente = document.createElement('div');
        frente.classList.add('tarjeta-frente');
        frente.style.borderColor = tarjeta.borde; // Establecer el color de fondo
        frente.textContent = tarjeta.contenido; // Mostrar el contenido adecuado

        const dorso = document.createElement('div');
        dorso.classList.add('tarjeta-dorso');
        dorso.textContent = '?';

        elementoTarjeta.appendChild(frente);
        elementoTarjeta.appendChild(dorso);
       
        dorso.addEventListener('click', () => voltearTarjeta(elementoTarjeta));

        return elementoTarjeta;
    }

    function playAudio(audioFile) {
        if (!audioFile) {
            console.error("No se proporcionó un archivo de audio.");
            return;
        }

        const audio = new Audio(audioFile);
        audio.play();
    }

    function voltearTarjeta(tarjeta) {
        if (tarjetasVolteadas.length < 2 && !tarjetasVolteadas.includes(tarjeta) && !tarjeta.classList.contains('coincidencia')) {
            tarjeta.classList.add('volteada');
            tarjetasVolteadas.push(tarjeta);


            if (tarjetasVolteadas.length === 2) {
                setTimeout(comprobarCoincidencia, 1000);
            }
        }
    }

    // Agregamos la lógica de confetti en la función comprobarCoincidencia
    function comprobarCoincidencia() {
        const [tarjeta1, tarjeta2] = tarjetasVolteadas;

        const sonCoincidentes = tarjeta1.querySelector('.tarjeta-frente').style.borderColor === tarjeta2.querySelector('.tarjeta-frente').style.borderColor;

        if (sonCoincidentes) {
            tarjeta1.classList.add('coincidencia');
            tarjeta2.classList.add('coincidencia');
            playAudio('./PLUGINS/AUDIOS/acierto.mp3');
            comprobarVictoria();
        } else {
            tarjeta1.classList.remove('volteada');
            tarjeta2.classList.remove('volteada');
            playAudio('./PLUGINS/AUDIOS/lose.mp3');
        }

        tarjetasVolteadas = [];
    }

    function comprobarVictoria() {
        const todasLasTarjetas = document.querySelectorAll('.tarjeta');
        const todasCoindicen = Array.from(todasLasTarjetas).every(tarjeta => tarjeta.classList.contains('coincidencia'));

        if (todasCoindicen) {
            playAudio('./PLUGINS/AUDIOS/win.mp3');
            mostrarConfetiFinal();
            setTimeout(() => {
                mostrarPopupFinal();
            }, 1500);
        }
    }


    function formatearTiempo(segundos) {
        const minutos = Math.floor(segundos / 60);
        const segundosRestantes = segundos % 60;
        return `${minutos.toString().padStart(2, '0')}:${segundosRestantes.toString().padStart(2, '0')}`;
    }

    function reiniciarJuego() {
        tablero.innerHTML = '';
        tarjetasVolteadas = [];
        iniciarJuego();
    }

    botonReiniciar.addEventListener('click', reiniciarJuego);

    iniciarJuego(); // Iniciar el juego al cargar la librería
}
