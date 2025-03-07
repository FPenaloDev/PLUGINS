export function listening(contenedor, audio_ruta) {
    if (document.querySelector('.css')) {
        document.querySelector('.css').remove();
    }
    const css = document.createElement('link');
    css.rel = 'stylesheet';
    css.className = 'css';
    css.type = 'text/css';
    css.href = 'PLUGINS/LISTENING/listening.css';
    document.head.appendChild(css);

    const espectroCss = document.createElement('link');
    espectroCss.rel = 'stylesheet';
    espectroCss.type = 'text/css';
    espectroCss.href = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css';
    document.head.appendChild(espectroCss);

    // HTML
    contenedor.innerHTML = `
        <div class="contenedor_reproductor">
            <div class="espectro_audio" id="espectro">
                ${'<div></div>'.repeat(40)} <!-- Generar 40 barras -->
            </div>
            <div class="div_botones">
                <div class="botones">
                    <i class="fa fa-play" id="play"></i>
                    <i class="fa fa-stop" id="stop"></i>
                </div>
                <div class="volumen">
                    <i class="fa fa-volume-up"></i>
                    <input type="range" id="volumen" min="0" max="1" step="0.1" value="1">
                </div>
            </div>
            <div class="controles">
                <div class="barra_tiempo">
                    <input type="range" id="barra_tiempo" min="0" max="100" value="0">
                </div>
            </div>
        </div>
    `;

    // Crear audio dinámicamente
    const crearAudio = document.createElement('audio');
    crearAudio.id = 'audio';
    crearAudio.src = audio_ruta;
    contenedor.appendChild(crearAudio);

    // Variables
    const botonReproducir = document.getElementById('play');
    const botonDetener = document.getElementById('stop');
    const controlVolumen = document.getElementById('volumen');
    const barraTiempo = document.getElementById('barra_tiempo');
    const espectroAudio = document.getElementById('espectro');
    const barrasEspectro = espectroAudio.querySelectorAll('div');

    // Inicializar colores de las barras del espectro
    const totalBarras = barrasEspectro.length;
    const cantidadAzul = Math.floor(totalBarras * 0.7);  // 70% azul
    const cantidadRoja = totalBarras - cantidadAzul;    // 30% roja

    // Crear y mezclar un array de colores
    const colores = new Array(cantidadAzul).fill('#163d73') // Azul
        .concat(new Array(cantidadRoja).fill('#bf4e638c')); // Rojo

    for (let i = colores.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [colores[i], colores[j]] = [colores[j], colores[i]]; // Mezclar colores
    }

    // Asignar colores a las barras
    barrasEspectro.forEach((barra, index) => {
        barra.style.backgroundColor = colores[index];
    });

    // AudioContext
    const contextoAudio = new (window.AudioContext || window.webkitAudioContext)();
    const analizador = contextoAudio.createAnalyser();
    const fuente = contextoAudio.createMediaElementSource(crearAudio);
    fuente.connect(analizador);
    analizador.connect(contextoAudio.destination);

    analizador.fftSize = 256;
    const datosFrec = new Uint8Array(analizador.frequencyBinCount);
    let estaReproduciendo = false;

    // Reproducir/Pausar
    botonReproducir.addEventListener('click', () => {
        if (estaReproduciendo) {
            crearAudio.pause();
            botonReproducir.classList.replace('fa-pause', 'fa-play');
            estaReproduciendo = false;
        } else {
            contextoAudio.resume();
            crearAudio.play();
            botonReproducir.classList.replace('fa-play', 'fa-pause');
            estaReproduciendo = true;
            animarEspectro();
        }
    });

    // Detener
    botonDetener.addEventListener('click', () => {
        crearAudio.pause();
        crearAudio.currentTime = 0;
        botonReproducir.classList.replace('fa-pause', 'fa-play');
        estaReproduciendo = false;
    });

    // Volumen
    controlVolumen.addEventListener('input', (e) => {
        crearAudio.volume = e.target.value;
    });

    // Barra de tiempo
    crearAudio.addEventListener('timeupdate', () => {
        barraTiempo.value = (crearAudio.currentTime / crearAudio.duration) * 100;
    });

    barraTiempo.addEventListener('input', (e) => {
        crearAudio.currentTime = (e.target.value / 100) * crearAudio.duration;
    });

    // Animar espectro
    function animarEspectro() {
        if (!estaReproduciendo) return;

        analizador.getByteFrequencyData(datosFrec);

        barrasEspectro.forEach((barra, indice) => {
            const valor = datosFrec[indice];
            const altura = (valor / 255) * 100; // Escalar a porcentaje
            barra.style.height = `${altura}%`;
        });

        requestAnimationFrame(animarEspectro);
    }

    // Función para actualizar el gradiente del progreso dinámicamente
    function actualizarProgreso(input) {
        const min = input.min || 0; // Valor mínimo del input
        const max = input.max || 100; // Valor máximo del input
        const val = input.value; // Valor actual del input

        // Calcula el porcentaje del progreso
        const porcentaje = ((val - min) / (max - min)) * 100;

        // Aplica el gradiente dinámico al fondo
        input.style.background = `linear-gradient(to right, #163d73 0%, #163d73 ${porcentaje}%, #ccc ${porcentaje}%, #ccc 100%)`;
    }

    // Aplica los cambios iniciales y en cada evento de cambio
    [controlVolumen, barraTiempo].forEach((input) => {
        actualizarProgreso(input); // Configuración inicial
        input.addEventListener('input', () => actualizarProgreso(input)); // Actualización en tiempo real
    });
    actualizarProgreso(barraTiempo); // Configuración inicial
    barraTiempo.addEventListener('input', () => actualizarProgreso(barraTiempo)); // Actualización en tiempo real

    // Vincular a la reproducción del audio (opcional)
    crearAudio.addEventListener('timeupdate', () => {
        barraTiempo.value = (crearAudio.currentTime / crearAudio.duration) * 100;
        actualizarProgreso(barraTiempo); // Actualiza el gradiente en tiempo real
    });


}
