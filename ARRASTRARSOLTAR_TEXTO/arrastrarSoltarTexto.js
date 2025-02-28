import {playAudio} from '../AUDIOS/audio.js';
import {cargarConfeti, mostrarConfetiFinal} from '../ANIMACIONES/CONFETTI/confetti.js';

const css = document.createElement('link');
css.rel = 'stylesheet';
css.type = 'text/css';
css.href = 'PLUGINS/ARRASTRARSOLTAR_TEXTO/arrastrarSoltarTexto.css';

document.head.appendChild(css);

export function crearActividad(idContenedor, datos) {
    // Mezclar las palabras en un orden aleatorio
    const palabrasAleatorias = [...datos.palabras].sort(() => Math.random() - 0.5);

    // Generar el HTML para las frases con espacios en blanco
    const frasesHtml = datos.frases.map(frase =>
        `<p class="frase"><span>${frase.texto.replace(
            /{([^}]+)}/g, // Modificada para permitir espacios dentro de {}
            (_, palabra) => `<span class="espacio_palabra" data-word="${palabra}"></span>`
        )}</span></p>`
    ).join('');

    // Generar el HTML para las palabras arrastrables
    const palabrasHtml = palabrasAleatorias.map(palabra =>
        `<div class="palabra" draggable="true">${palabra}</div>`
    ).join('');

    // Inyectar el contenido generado en el idContenedor
    idContenedor.innerHTML = `
    <div id="arrastrarSoltarTexto">
        <div class="actividad">
            <div class="palabras">${palabrasHtml}</div>
            <div class="frases">${frasesHtml}</div>
        </div>
        <button id="reiniciarActividad">Reiniciar Actividad</button>
    </div>
    `;

    cargarConfeti();
    // Lógica de arrastrar y soltar
    const palabras = idContenedor.querySelectorAll('.palabra');
    const espaciosBlancos = idContenedor.querySelectorAll('.espacio_palabra');

    palabras.forEach(palabra => {
        palabra.addEventListener('dragstart', function (e) {
            e.dataTransfer.setData('text', e.target.innerText);
        });
    });

    let aciertos = 0;
    let puntuacion = palabras.length;


    espaciosBlancos.forEach(espacio => {
        espacio.addEventListener('dragover', function (e) {
            e.preventDefault();
        });

        espacio.addEventListener('drop', function (e) {
            e.preventDefault();
            const palabra = e.dataTransfer.getData('text');
            const palabraCorrecta = espacio.getAttribute('data-word');

            if (palabra === palabraCorrecta) {
                espacio.innerText = palabra;
                espacio.style.backgroundColor = 'var(--secundario)';
                espacio.style.color = 'var(--blanco)';
                espacio.classList.add('correcto');
                const palabraElemento = Array.from(palabras).find(p => p.innerText === palabra);
                if (palabraElemento) {
                    palabraElemento.style.visibility = 'hidden';
                }
                aciertos++;
                playAudio('./PLUGINS/AUDIOS/acierto.mp3');
                if(aciertos === palabras.length){
                    mostrarConfetiFinal();
                    playAudio('./PLUGINS/AUDIOS/win.mp3');
                }
            } else {
                espacio.innerText = palabra;
                espacio.style.backgroundColor = 'red';
                espacio.style.color = '#fff';
                espacio.classList.add('incorrecto');
                setTimeout(() => {
                    espacio.innerText = '';
                    espacio.classList.remove('incorrecto');
                    espacio.style.backgroundColor = '';
                    espacio.style.color = '';
                }, 1000);
            }
        });
    });

    // Botón para reiniciar la actividad
    const btnReiniciar = idContenedor.querySelector('#reiniciarActividad');
    btnReiniciar.addEventListener('click', () => {
        crearActividad(idContenedor, datos);
    });
}
