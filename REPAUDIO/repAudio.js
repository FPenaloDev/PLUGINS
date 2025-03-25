export function repAudio(contenedor, sonido) {
    if(document.querySelector('.css')){
        document.querySelector('.css').remove();
    }
    const css = document.createElement('link');
    css.rel = 'stylesheet';
    css.href = './PLUGINS/REPAUDIO/repAudio.css';
    css.classList.add('css');
    document.head.appendChild(css);
    
    let audio = new Audio(sonido); // Crear una única instancia del audio
    let estaReproduciendo = false; // Variable para saber si el audio está sonando

    // Función para reproducir o pausar el audio
    function alternarAudio() {
        const botonPlay = document.getElementById('icono-play');

        if (estaReproduciendo) {
            audio.pause(); // Pausa el audio
            botonPlay.innerHTML = `
            <svg xmlns="http://www.w3.org/2000/svg"  viewBox="0 0 512 512">
                <path fill="var(--icono)" d="M133 440a35.37 35.37 0 0 1-17.5-4.67c-12-6.8-19.46-20-19.46-34.33V111c0-14.37 7.46-27.53 19.46-34.33a35.13 35.13 0 0 1 35.77.45l247.85 148.36a36 36 0 0 1 0 61l-247.89 148.4A35.5 35.5 0 0 1 133 440"/>
            </svg>
        `; // Cambia el icono a "Play"
        } else {
            audio.play(); // Reproduce el audio
            botonPlay.innerHTML = `
            <svg xmlns="http://www.w3.org/2000/svg"  viewBox="0 0 24 24">
                <path fill="var(--icono)" d="M14 19h4V5h-4M6 19h4V5H6z"/>
            </svg>
        `; // Cambia el icono a "Pausa"
        }
        estaReproduciendo = !estaReproduciendo; // Invierte el estado
    }

    // Evento que detecta cuando el audio termina y reinicia el icono a "Play"
    audio.addEventListener('ended', () => {
        estaReproduciendo = false;
        document.getElementById('icono-play').innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg"  viewBox="0 0 512 512">
            <path fill="var(--icono)" d="M133 440a35.37 35.37 0 0 1-17.5-4.67c-12-6.8-19.46-20-19.46-34.33V111c0-14.37 7.46-27.53 19.46-34.33a35.13 35.13 0 0 1 35.77.45l247.85 148.36a36 36 0 0 1 0 61l-247.89 148.4A35.5 35.5 0 0 1 133 440"/>
        </svg>
    `;
    });

    // Estructura HTML con los botones de Play/Pausa y Stop
    contenedor.innerHTML = `
  <div class="botones">
    <button id="play">
      <span id="icono-play">
        <svg xmlns="http://www.w3.org/2000/svg"  viewBox="0 0 512 512">
            <path fill="var(--icono)" d="M133 440a35.37 35.37 0 0 1-17.5-4.67c-12-6.8-19.46-20-19.46-34.33V111c0-14.37 7.46-27.53 19.46-34.33a35.13 35.13 0 0 1 35.77.45l247.85 148.36a36 36 0 0 1 0 61l-247.89 148.4A35.5 35.5 0 0 1 133 440"/>
        </svg>
      </span>
    </button>
    <button id="stop">
      <svg xmlns="http://www.w3.org/2000/svg"  viewBox="0 0 512 512">
        <path fill="var(--icono)" d="M392 432H120a40 40 0 0 1-40-40V120a40 40 0 0 1 40-40h272a40 40 0 0 1 40 40v272a40 40 0 0 1-40 40"/>
      </svg>
    </button>
  </div>
`;

    // Eventos de los botones
    document.getElementById('play').addEventListener('click', alternarAudio);
    document.getElementById('stop').addEventListener('click', () => {
        audio.pause(); // Pausa el audio
        audio.currentTime = 0; // Reinicia la reproducción al inicio
        estaReproduciendo = false; // Actualiza el estado
        document.getElementById('icono-play').innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg"  viewBox="0 0 512 512">
            <path fill="var(--icono)" d="M133 440a35.37 35.37 0 0 1-17.5-4.67c-12-6.8-19.46-20-19.46-34.33V111c0-14.37 7.46-27.53 19.46-34.33a35.13 35.13 0 0 1 35.77.45l247.85 148.36a36 36 0 0 1 0 61l-247.89 148.4A35.5 35.5 0 0 1 133 440"/>
        </svg>
    `; // Vuelve a mostrar el icono de "Play"
    });
}
