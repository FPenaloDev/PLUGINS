import { cargarConfeti, mostrarConfetiFinal } from "../ANIMACIONES/CONFETTI/confetti.js";
import { playAudio } from "../AUDIOS/audio.js";
export function arrastrarYSoltar(contenedor, elementos, categorias) {

    const estilo = document.createElement('link');
    estilo.rel = 'stylesheet';
    estilo.type = 'text/css';
    estilo.href = 'PLUGINS/ARRASTRARSOLTAR/arrastrarSoltar.css';
    document.head.appendChild(estilo);

    // Establece el contenido HTML inicial del contenedor principal
    contenedor.innerHTML = `
    <div id="ArrastrarSoltar"
        <div class="contenedor">
            <div class="area-juego">
                <div id="contenedorCategorias" class="contenedor-categorias"></div>
                <div id="contenedorArrastrables" class="contenedor-arrastrables"></div>
            </div>
            <div class="controles">
                <button id="botonVerificar" style="display:none !important">Verificar Respuestas</button>
                <button id="botonReiniciar">
        <svg class="icono-reiniciar" style="transform: rotate(-90deg);" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="4" stroke-linecap="round" stroke-linejoin="round">
            <path d="M23 4v6h-6"></path>
            <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"></path>
        <span class="texto-reiniciar">Reiniciar</span>
        </svg>
    </button>
            </div>
            <div id="popup" class="modal">
                <div class="contenido-modal">
                    <h2 class="mensajeResultado"></h2>
                    <button class="cerrar-modal">Cerrar</button>

                </div>
            </div>
        </div>
    </div>
    `;

    const contenedorArrastrables = document.getElementById('contenedorArrastrables');
    const contenedorCategorias = document.getElementById('contenedorCategorias');
    const botonReiniciar = document.getElementById('botonReiniciar');
    const modalResultado = document.getElementById('popup');
    const mensajeResultado = document.querySelector('.mensajeResultado');
    const cerrarModal = document.querySelector('.cerrar-modal');



    let elementoArrastrado = null;

    function mezclar(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
    }

    function crearArrastrables() {
        contenedorArrastrables.innerHTML = '';
        mezclar(elementos);  // Baraja los elementos
        elementos.forEach(elemento => {
            const arrastrable = document.createElement('div');
            arrastrable.className = 'arrastrable';
            arrastrable.textContent = elemento.texto;
            arrastrable.draggable = true;
            arrastrable.dataset.categoria = elemento.categoria;

            arrastrable.addEventListener('dragstart', inicioArrastre);
            arrastrable.addEventListener('dragend', finArrastre);
            arrastrable.addEventListener('touchstart', inicioToque, { passive: true });
            arrastrable.addEventListener('touchmove', moverToque, { passive: false });
            arrastrable.addEventListener('touchend', finToque);

            contenedorArrastrables.appendChild(arrastrable);
        });
    }

    function verificarCompletado() {
        let conteoCorrecto = 0;

        categorias.forEach(categoria => {
            const elementoCategoria = document.querySelector(`.categoria[data-categoria="${categoria.id}"]`);
            const items = elementoCategoria.querySelectorAll('.item');

            items.forEach(item => {
                if (item.textContent && item.dataset.categoria === categoria.id) {
                    conteoCorrecto++;
                    playAudio('./PLUGINS/AUDIOS/acierto.mp3');

                }
            });
        });

        if (conteoCorrecto === elementos.length) {
            mostrarResultado(conteoCorrecto, elementos.length);
        }
    }

    function crearCategorias() {
        contenedorCategorias.innerHTML = '';
        categorias.forEach(categoria => {
            const elementoCategoria = document.createElement('div');
            elementoCategoria.className = 'categoria';
            elementoCategoria.innerHTML = `<h3>${categoria.nombre}</h3>`;
            elementoCategoria.dataset.categoria = categoria.id;

            elementoCategoria.addEventListener('dragover', sobreArrastre);
            elementoCategoria.addEventListener('dragleave', salirArrastre);
            elementoCategoria.addEventListener('drop', soltar);

            contenedorCategorias.appendChild(elementoCategoria);
        });
    }

    function inicioArrastre(e) {
        e.target.classList.add('arrastrando');
        elementoArrastrado = e.target;
        e.dataTransfer.setData('text/plain', e.target.dataset.categoria);
    }

    function finArrastre(e) {
        e.target.classList.remove('arrastrando');
    }

    function sobreArrastre(e) {
        e.preventDefault();
        e.currentTarget.classList.add('resaltado');
    }

    function salirArrastre(e) {
        e.currentTarget.classList.remove('resaltado');
    }

    function soltar(e) {
        e.preventDefault();
        const categoriaArrastrada = e.dataTransfer.getData('text');
        const elementoCategoria = e.currentTarget;
        elementoCategoria.classList.remove('resaltado');

        if (elementoCategoria.dataset.categoria === categoriaArrastrada) {
            const item = document.createElement('div');
            item.className = 'item';
            item.textContent = elementoArrastrado.textContent;
            item.dataset.categoria = elementoArrastrado.dataset.categoria;
            elementoCategoria.appendChild(item);

            elementoArrastrado.remove();

            verificarCompletado();
        } else {
            playAudio('./PLUGINS/AUDIOS/lose.mp3');
            elementoCategoria.classList.add('incorrecto');
            setTimeout(() => elementoCategoria.classList.remove('incorrecto'), 1000);
        }
    }

    function inicioToque(e) {
        e.target.classList.add('arrastrando');
    }

    function moverToque(e) {
        e.preventDefault();
        const toque = e.targetTouches[0];
        e.target.style.position = 'absolute';
        e.target.style.left = toque.pageX - 50 + 'px';
        e.target.style.top = toque.pageY - 50 + 'px';
    }

    function finToque(e) {
        e.target.classList.remove('arrastrando');
        e.target.style.position = 'static';
        const elementos = document.elementsFromPoint(e.changedTouches[0].clientX, e.changedTouches[0].clientY);
        const elementoCategoria = elementos.find(el => el.classList.contains('categoria'));

        if (elementoCategoria) {
            if (elementoCategoria.dataset.categoria === e.target.dataset.categoria) {
                const item = document.createElement('div');
                item.className = 'item';
                item.textContent = e.target.textContent;
                elementoCategoria.appendChild(item);
                e.target.remove();
            } else {
                playAudio('./PLUGINS/AUDIOS/lose.mp3');
                elementoCategoria.classList.add('incorrecto');
                setTimeout(() => elementoCategoria.classList.remove('incorrecto'), 1000);
            }
        }
    }

    function mostrarResultado(correctos, total) {
        mostrarConfetiFinal();
        playAudio('./PLUGINS/AUDIOS/win.mp3');
        setTimeout(() => {
            mensajeResultado.textContent = `¡Felicitaciones! Has completado la actividad con ${correctos} de ${total} elementos correctamente colocados.`;
            modalResultado.style.display = 'flex';
        }, 2000);
    }

    function reiniciarActividad() {
        crearArrastrables();
        crearCategorias();
    }

    cerrarModal.addEventListener('click', () => {
        modalResultado.style.display = 'none';
    });

    botonReiniciar.addEventListener('click', reiniciarActividad);

    crearArrastrables();
    crearCategorias();
    cargarConfeti();

}
