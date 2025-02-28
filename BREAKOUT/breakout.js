// Estilos
const estilo = document.createElement('link');
estilo.rel = 'stylesheet';
estilo.type = 'text/css';
estilo.href = 'PLUGINS/BREAKOUT/breakout.css'
document.head.appendChild(estilo);
export function breakout(contenedor, preguntas) {

    // Variables del juego
    let vidas = 3;
    let nivel = 1;
    let juegoTerminado = false;
    let preguntaActual = 0;
    let respuestaSeleccionada = null;
    let intentos = 0;
    let marcianos = [
        { id: 1, x: -2, y: 15, eliminado: false },
        { id: 2, x: 20, y: 15, eliminado: false },
        { id: 3, x: 40, y: 15, eliminado: false },
        { id: 4, x: 60, y: 15, eliminado: false },
        { id: 5, x: 80, y: 15, eliminado: false }
    ];


    // Crear elementos del juego
    const contenedorJuego = document.createElement('div');
    contenedorJuego.className = 'contenedor-juego';

    // Inyectar en el div si408
    const divObjetivo = contenedor;
    divObjetivo.appendChild(contenedorJuego);

    //Lienzo
    const lienzo = document.createElement('canvas');
    lienzo.style.width = '90%';
    lienzo.style.height = '90%';
    contenedorJuego.appendChild(lienzo);


    const seccionPreguntas = document.createElement('div');
    seccionPreguntas.className = 'seccion-preguntas';
    contenedorJuego.appendChild(seccionPreguntas);


    // Funciones del juego
    const ctx = lienzo.getContext('2d');

    // Ajustar la nave en función de la pantalla
    function dibujarNave(x, y, tamano) {
        // Eliminar nave anterior si existe
        divObjetivo.querySelector('.contenedor-nave')?.remove();

        const contenedorNave = document.createElement('div');
        contenedorNave.className = 'contenedor-nave';

        const imagenNave = new Image();
        imagenNave.src = 'https://i.postimg.cc/cJcTj8yr/pixel-art-nave-espacial-extraterrestre-ovni-juego-8-bits-sobre-fondo-blanco-360488-926-1.png';
        imagenNave.style.width = `${tamano}%`;
        imagenNave.style.height = `${tamano}%`;
        seccionPreguntas.appendChild(contenedorNave);
        seccionPreguntas.prepend(contenedorNave);
        contenedorNave.appendChild(imagenNave);

        // Cambio aquí: Posicionar la nave justo a la izquierda del texto de la pregunta
        contenedorNave.style.left = `-10%`;
        contenedorNave.style.bottom = `65%`;
    }

    let id_marciano = 1;
    function dibujarMarciano(x, y, tamano) {
        // Verificar si el marciano ya ha sido eliminado antes de dibujarlo
        const marcianoEliminado = marcianos.find(m => m.x === x && m.y === y && m.eliminado);
        if (marcianoEliminado) return; // No dibujar si el marciano ha sido eliminado

        // En su lugar, crear o actualizar elemento de marciano si no existe
        const contenedorMarcianos = document.querySelector('.contenedor-marcianos') || crearContenedorMarcianos();

        let marciano = contenedorMarcianos.querySelector(`#marciano-${x}-${y}`);
        if (!marciano) {
            marciano = document.createElement('img');
            marciano.src = 'PLUGINS/BREAKOUT/recursos/marciano.gif';
            marciano.id = `marciano-${id_marciano}`;
            id_marciano++;
            marciano.style.position = 'absolute';
            marciano.style.left = `${x}vw`;
            marciano.style.top = `${y}vh`;
            marciano.style.width = `${tamano}%`;
            marciano.style.height = `auto`;
            contenedorMarcianos.appendChild(marciano);
        }
    }

    async function dispararAMarciano(marciano) {
        return new Promise((resolve) => {
            const canvas = document.querySelector('canvas');
            const ctx = canvas.getContext('2d');
            const naveElemento = document.querySelector('.contenedor-nave');

            if (!naveElemento) {
                console.error('Nave no encontrada');
                resolve();
                return;
            }

            // Crear elemento de bala
            const bala = document.createElement('div');
            const proyectil = document.createElement('img');
            proyectil.src = 'PLUGINS/BREAKOUT/recursos/proyectil.png';
            bala.appendChild(proyectil);
            bala.style.position = 'absolute';
            proyectil.style.position = 'absolute';
            bala.style.width = '25px';
            proyectil.style.width = '25px';
            bala.style.height = '50px';
            proyectil.style.height = '50px';
            bala.style.zIndex = '6';
            proyectil.style.zIndex = '6';
            bala.style.borderRadius = '50%';
            contenedor.appendChild(bala);

            // Obtener las posiciones absolutas de la nave y el marciano dentro del canvas
            const rectNave = naveElemento.getBoundingClientRect();
            const rectMarciano = document.querySelector(`#marciano-${marciano.id}`).getBoundingClientRect();
            const rectCanvas = canvas.getBoundingClientRect();

            // Calcular posiciones iniciales y finales relativas al canvas
            const inicioX = (rectNave.left + rectNave.width / 2) - rectCanvas.left;
            const inicioY = (rectNave.top + rectNave.height / 2) - rectCanvas.top;

            const destinoX = (rectMarciano.left + rectMarciano.width / 2) - rectCanvas.left;
            const destinoY = (rectMarciano.top + rectMarciano.height / 2) - rectCanvas.top;

            // Configurar posición inicial de la bala
            bala.style.left = `${inicioX + rectCanvas.left}px`;
            bala.style.top = `${inicioY + rectCanvas.top}px`;

            // Animación de disparo
            let tiempo = 0;
            function animarDisparo() {
                tiempo += 0.05;

                // Interpolación lineal para el movimiento de la bala
                const currentX = inicioX + (destinoX - inicioX) * tiempo;
                const currentY = inicioY + (destinoY - inicioY) * tiempo;

                bala.style.left = `${currentX + rectCanvas.left}px`;
                bala.style.top = `${currentY + rectCanvas.top}px`;

                // Dibujar rastro de la bala en el canvas
                ctx.beginPath();
                ctx.moveTo(inicioX, inicioY);
                ctx.lineTo(currentX, currentY);
                ctx.strokeStyle = 'rgba(255, 0, 0, 0.5)';
                ctx.lineWidth = 2;
                ctx.stroke();

                if (tiempo < 1) {
                    requestAnimationFrame(animarDisparo);
                } else {
                    // Eliminar bala y preparar eliminación del marciano
                    bala.remove();
                    animarEliminacionMarciano(marciano);
                    setTimeout(resolve, 500);
                }
            }

            animarDisparo();
        });
    }

    function crearCorazones() {
        const contenedorCorazones = document.createElement('div');
        contenedorCorazones.className = 'corazones';
        contenedorCorazones.style.position = 'absolute';
        contenedorCorazones.style.top = '10px';
        contenedorCorazones.style.left = '5%';
        contenedorCorazones.style.zIndex = '3';
        contenedorCorazones.style.display = 'flex';
        contenedorCorazones.style.gap = '5px';
        contenedorCorazones.style.fontSize = '2em';

        for (let i = 0; i < 3; i++) {
            const corazon = document.createElement('span');
            corazon.id = `corazon-${i + 1}`;  // Añadir ID único
            corazon.textContent = '♥';
            corazon.style.color = '#ff69b4';
            contenedorCorazones.appendChild(corazon);
        }

        contenedorJuego.appendChild(contenedorCorazones);
    }

    function crearContenedorMarcianos() {
        const contenedor = document.createElement('div');
        contenedor.className = 'contenedor-marcianos';
        contenedor.style.position = 'absolute';
        contenedor.style.top = '0';
        contenedor.style.borderRadius = '8px';
        contenedor.style.left = '0';
        contenedor.style.width = '50%';
        contenedor.style.height = '109%';
        contenedor.style.pointerEvents = 'none'; // Para no interferir con interacciones
        contenedor.style.backgroundImage = "url('PLUGINS/BREAKOUT/recursos/fondo_espacio.gif')";
        contenedor.style.backgroundRepeat = 'no-repeat';
        contenedor.style.backgroundSize = 'cover';
        contenedor.style.zIndex = '1';

        // Insertar justo después del canvas
        const lienzo = document.querySelector('canvas');
        lienzo.parentNode.insertBefore(contenedor, lienzo.nextSibling);

        return contenedor;
    }

    function bucleJuego() {
        if (juegoTerminado) return; // Si el juego está terminado, salir.

        // Limpiar el lienzo en cada ciclo
        ctx.fillStyle = '#0a0a0a';
        ctx.fillRect(0, 0, lienzo.width, lienzo.height);

        // Línea divisoria
        ctx.strokeStyle = '#33ff33';
        ctx.beginPath();
        ctx.moveTo(lienzo.width / 2, 0);
        ctx.lineTo(lienzo.width / 2, lienzo.height);
        ctx.stroke();

        // Dibujar la nave del jugador
        dibujarNave(jugadorX, jugadorY, tamanoJugador);
        const contenedorNave = document.querySelector('.contenedor-nave');
        const pregunta = document.querySelector('div.pregunta');
        pregunta.appendChild(contenedorNave);
        pregunta.prepend(contenedorNave);
        pregunta.style.display = 'flex';
        pregunta.style.alignItems = 'center';
        // Redibujar los marcianos en cada ciclo para asegurarse de que se animen
        marcianos.forEach((marciano) => {
            if (!marciano.eliminado) {
                dibujarMarciano(marciano.x, marciano.y, 20);
            }
        });

        // Dibujar los corazones, considerando los intentos
        for (let i = 0; i < 3; i++) {
            const x = 30 + i * 30;
            const y = 30;
            const tamano = 20;

            if (intentos > i) {
                // Si el número de intentos es mayor que el índice del corazón, dibuja sin relleno
                dibujarCorazonSinRelleno(x, y, tamano);
            } else {
                // Si el número de intentos es menor o igual al índice, dibuja el corazón relleno
                dibujarCorazon(x, y, tamano);
            }
        }

        if (teclas['ArrowLeft'] && jugadorX > 0) {
            jugadorX -= velocidadJugador;
        }
        if (teclas['ArrowRight'] && jugadorX < lienzo.width / 2 - tamanoJugador) {
            jugadorX += velocidadJugador;
        }

        requestAnimationFrame(bucleJuego);
    }

    async function verificarRespuesta() {
        if (respuestaSeleccionada === preguntas[preguntaActual].respuestaCorrecta) {
            const marcianoEliminado = marcianos.find(m => !m.eliminado);
            if (marcianoEliminado) {
                await dispararAMarciano(marcianoEliminado);
                marcianoEliminado.eliminado = true;
            }

            nivel++; // Incrementar nivel
            if (preguntaActual < preguntas.length - 1) {
                preguntaActual++;
                actualizarPregunta();
            } else {
                finalizarJuego(true);
            }
            intentos = 0;
        } else {
            intentos++;
            vidas--; // Resta una vida directamente al fallar
            actualizarCorazones();
            if (vidas <= 0) {
                finalizarJuego(false);
                return;
            }
        }

        respuestaSeleccionada = null;
        actualizarInterfaz();
    }

    function animarEliminacionMarciano(marciano) {
        const marcianoElemento = document.querySelector(`#marciano-${marciano.id}`);
        if (marcianoElemento) {
            let escala = 1;
            let opacidad = 1;

            function animar() {
                if (escala > 0) {
                    escala -= 0.05;
                    opacidad -= 0.05;

                    marcianoElemento.style.transform = `scale(${escala})`;
                    marcianoElemento.style.opacity = opacidad;

                    if (escala > 0) {
                        requestAnimationFrame(animar);
                    } else {
                        marcianoElemento.remove();
                    }
                }
            }
            animar();
        }
    }

    function actualizarPregunta() {
        const preguntaElement = document.querySelector('.pregunta');
        preguntaElement.textContent = preguntas[preguntaActual].pregunta;
        const respuestasElements = document.querySelectorAll('.respuesta');
        respuestasElements.forEach((el, index) => {
            el.textContent = preguntas[preguntaActual].respuestas[index];
            el.classList.remove('seleccionada');
        });

        document.querySelector('.verificar').disabled = true;
        dibujarNave(jugadorX, jugadorY, tamanoJugador);
        const nave = document.querySelector('.contenedor-nave');
        const pregunta = document.querySelector('.pregunta');
        pregunta.appendChild(nave);
        pregunta.prepend(nave);

    }

    function actualizarInterfaz() {
        document.querySelectorAll('.respuesta').forEach((el, index) => {
            el.classList.toggle('seleccionada', index === respuestaSeleccionada);
        });

        document.querySelector('.verificar').disabled = respuestaSeleccionada === null;
        document.querySelector('.intentos').textContent = `Intentos restantes: ${3 - intentos}`;
    }

    function finalizarJuego(victoria) {
        juegoTerminado = true;
        const mensajeFinJuego = document.createElement('div');
        mensajeFinJuego.className = 'fin-juego';
        mensajeFinJuego.innerHTML = `
        <div class="retroalimentacion">
      <div class="mensaje-fin-juego">
        <h2>${victoria ? '¡Felicidades! Has ganado' : 'Juego terminado'}</h2>
<button class="jugar-de-nuevo">Jugar de nuevo</button>
      </div>
      </div>
    `;
        contenedorJuego.appendChild(mensajeFinJuego);

        document.querySelector('.jugar-de-nuevo').addEventListener('click', reiniciarJuego);
    }

    function actualizarCorazones() {
        const corazon = document.getElementById(`corazon-${vidas}`);
        if (corazon) {
            corazon.innerHTML = '♡';
            corazon.style.color = 'transparent';
            corazon.style.textShadow = '0 0 0 #ff69b4';
        }
    }

    function reiniciarJuego() {
        // Restablecer variables
        id_marciano = 1;
        vidas = 3;
        nivel = 1;
        juegoTerminado = false;
        preguntaActual = 0;
        respuestaSeleccionada = null;
        intentos = 0;

        // Restablecer marcianos
        marcianos = marcianos.map(m => ({ ...m, eliminado: false }));

        // Eliminar elementos DOM antiguos
        document.querySelector('.fin-juego')?.remove();
        document.querySelector('.contenedor-marcianos')?.remove();
        document.querySelector('.contenedor-nave')?.remove();

        // Reiniciar corazones a su estado original
        for (let i = 1; i <= 3; i++) {
            const corazon = document.getElementById(`corazon-${i}`);
            if (corazon) {
                corazon.textContent = '♥';
                corazon.style.color = '#ff69b4';
                corazon.style.textShadow = 'none';
            }
        }

        // Recrear elementos
        crearContenedorMarcianos();
        dibujarNave(jugadorX, jugadorY, tamanoJugador);
        actualizarPregunta();
        actualizarInterfaz();
        bucleJuego();
    }

    // Inicialización del juego
    let jugadorX = lienzo.width / 5;
    let jugadorY = lienzo.height - 120;
    const velocidadJugador = 10;
    const tamanoJugador = '100%';
    let teclas = {};
    crearCorazones();
    window.addEventListener('keydown', (e) => {
        teclas[e.key] = true;
    });

    window.addEventListener('keyup', (e) => {
        teclas[e.key] = false;
    });

    // Crear interfaz de preguntas
    function crearInterfazPreguntas() {
        const preguntaElement = document.createElement('div');
        preguntaElement.className = 'pregunta';
        preguntaElement.innerHTML = `<p>${preguntas[preguntaActual].pregunta}</p>`;
        seccionPreguntas.appendChild(preguntaElement);

        preguntas[preguntaActual].respuestas.forEach((respuesta, index) => {
            const divPregunta = document.createElement('div');
            divPregunta.style.border = '3px solid #000';
            const botonRespuesta = document.createElement('button');
            botonRespuesta.className = 'respuesta';
            botonRespuesta.textContent = respuesta;
            botonRespuesta.addEventListener('click', () => {
                respuestaSeleccionada = index;
                actualizarInterfaz();
            });
            seccionPreguntas.appendChild(botonRespuesta);
        });

        const divIntentos = document.createElement('div');
        divIntentos.className = 'div-intentos';
        seccionPreguntas.appendChild(divIntentos);

        const botonVerificar = document.createElement('button');
        botonVerificar.className = 'verificar';
        botonVerificar.innerHTML += 'Verificar Respuesta';
        botonVerificar.disabled = true;
        botonVerificar.addEventListener('click', verificarRespuesta);
        divIntentos.appendChild(botonVerificar);

        const intentosElement = document.createElement('div');
        intentosElement.className = 'intentos';
        intentosElement.textContent = 'Intentos restantes: 3';
        divIntentos.appendChild(intentosElement);
    }


    crearInterfazPreguntas();
    actualizarInterfaz();
    bucleJuego();
}