export function ordena(contenedor,niveles) {
  // Configuración inicial

  // Estado del juego
  let nivel = 1;
  let conceptoSeleccionado = null;


  const elementos = {};

  function crearEstilos() {
    const css = document.createElement('link');
    css.rel = 'stylesheet';
    css.type = 'text/css';
    css.href = 'PLUGINS/ORDENA/ordena.css';
    document.head.appendChild(css);
  }

  function crearEstructuraHTML() {
    const nivelActual = niveles[nivel - 1];
    contenedor.innerHTML = `
      <div class="actividad-ordena">
        <div class="contenedor-ordenar">
          <div class="lista-conceptos">
            ${nivelActual.conceptos.map((concepto, index) => `
              <div class="concepto" data-orden="${index + 1}">
                ${concepto}
              </div>
            `).join('')}
          </div>
          <div class="controles">
            <button class="boton" id="botonArriba" disabled>↑</button>
            <button class="boton" id="botonAbajo" disabled>↓</button>
          </div>
        </div>
        <div class="controles-juego">
          <button class="boton boton-verificar" id="botonVerificar">
            Verificar Orden
          </button>
        </div>
      </div>

      <div class="mensaje-nivel" id="mensajeNivel"></div>
    `;

    // Guardar referencias
    elementos.listaConceptos = contenedor.querySelector('.lista-conceptos');
    elementos.botonArriba = contenedor.querySelector('#botonArriba');
    elementos.botonAbajo = contenedor.querySelector('#botonAbajo');
    elementos.botonVerificar = contenedor.querySelector('#botonVerificar');
    elementos.conceptos = contenedor.querySelectorAll('.concepto');
    elementos.mensajeNivel = contenedor.querySelector('#mensajeNivel');
  }

  function inicializarEventos() {
    elementos.listaConceptos.addEventListener('click', seleccionarConcepto);
    elementos.botonArriba.addEventListener('click', () => moverConcepto('arriba'));
    elementos.botonAbajo.addEventListener('click', () => moverConcepto('abajo'));
    elementos.botonVerificar.addEventListener('click', verificarOrden);
  }

  function inicializar() {
    crearEstilos();
    crearEstructuraHTML();
    inicializarEventos();
  }

  function seleccionarConcepto(evento) {
    const concepto = evento.target;
    if (concepto.classList.contains('concepto')) {
      if (conceptoSeleccionado) {
        conceptoSeleccionado.classList.remove('seleccionado');
      }
      conceptoSeleccionado = concepto;
      concepto.classList.add('seleccionado');
      actualizarBotones();
    }
  }

  async function moverConcepto(direccion) {
    if (!conceptoSeleccionado) return;

    const conceptosActualizados = Array.from(contenedor.querySelectorAll('.concepto'));
    const indiceActual = conceptosActualizados.indexOf(conceptoSeleccionado);
    const indiceNuevo = direccion === 'arriba' ? indiceActual - 1 : indiceActual + 1;

    if (indiceNuevo < 0 || indiceNuevo >= conceptosActualizados.length) return;

    const elementoIntercambio = conceptosActualizados[indiceNuevo];
    await animarIntercambio(conceptoSeleccionado, elementoIntercambio, direccion);

    elementos.conceptos = contenedor.querySelectorAll('.concepto');
    actualizarBotones();
  }

  function actualizarBotones() {
    if (!conceptoSeleccionado) {
      elementos.botonArriba.disabled = true;
      elementos.botonAbajo.disabled = true;
      return;
    }

    const conceptosActualizados = Array.from(contenedor.querySelectorAll('.concepto'));
    const indice = conceptosActualizados.indexOf(conceptoSeleccionado);

    elementos.botonArriba.disabled = indice === 0;
    elementos.botonAbajo.disabled = indice === conceptosActualizados.length - 1;
  }

  async function verificarOrden() {
    const conceptosActualizados = Array.from(contenedor.querySelectorAll('.concepto'));
    const ordenActual = conceptosActualizados.map(concepto =>
      parseInt(concepto.getAttribute('data-orden'))
    );

    const ordenCorrecto = ordenActual.every((valor, indice, array) => {
      if (indice === 0) return true;
      return valor === array[indice - 1] + 1;
    });

    await mostrarFeedbackConceptos(ordenActual, conceptosActualizados);

    if (ordenCorrecto) {
      if (nivel < niveles.length) {
        mostrarMensajeNivel('¡Nivel Completado!');
        await new Promise(resolve => setTimeout(resolve, 1500));
        nivel++;
        inicializar();
      } else {
        mostrarMensajeNivel('¡Juego Completado!');
        await new Promise(resolve => setTimeout(resolve, 2000));
        reiniciarJuego();
      }
    }
  }

  async function mostrarFeedbackConceptos(ordenActual, conceptosActualizados) {
    const esOrdenSecuencial = ordenActual.every((valor, indice, array) => {
      if (indice === 0) return true;
      return valor === array[indice - 1] + 1;
    });

    if (esOrdenSecuencial) {
      const promesas = conceptosActualizados.map(async (concepto) => {
        concepto.classList.add('correcto');
        await new Promise(resolve => setTimeout(resolve, 200));
        concepto.classList.remove('correcto');
      });
      await Promise.all(promesas);
    } else {
      const promesas = conceptosActualizados.map(async (concepto, indice) => {
        const ordenEsperado = indice === 0 ? 1 : ordenActual[indice - 1] + 1;
        const ordenActualConcepto = ordenActual[indice];

        concepto.classList.add(ordenActualConcepto === ordenEsperado ? 'correcto' : 'incorrecto');
        await new Promise(resolve => setTimeout(resolve, 200));
        concepto.classList.remove('correcto', 'incorrecto');
      });
      await Promise.all(promesas);
    }
  }

  async function animarIntercambio(elemento1, elemento2, direccion) {
    const altura = elemento1.offsetHeight;
    const duracion = 300;

    elemento1.style.transition = `transform ${duracion}ms ease`;
    elemento2.style.transition = `transform ${duracion}ms ease`;

    elemento1.style.transform = `translateY(${direccion === 'arriba' ? -altura : altura}px)`;
    elemento2.style.transform = `translateY(${direccion === 'arriba' ? altura : -altura}px)`;

    await new Promise(resolve => setTimeout(resolve, duracion));

    elemento1.style.transition = '';
    elemento2.style.transition = '';
    elemento1.style.transform = '';
    elemento2.style.transform = '';

    if (direccion === 'arriba') {
      elementos.listaConceptos.insertBefore(elemento1, elemento2);
    } else {
      elementos.listaConceptos.insertBefore(elemento1, elemento2.nextSibling);
    }
  }

  function mostrarMensajeNivel(mensaje) {
    elementos.mensajeNivel.textContent = mensaje;
    elementos.mensajeNivel.classList.add('visible');
    setTimeout(() => {
      elementos.mensajeNivel.classList.remove('visible');
    }, 1500);
  }

  function reiniciarJuego() {
    nivel = 1;
    inicializar();
  }

  // Inicializar el juego
  inicializar();
}