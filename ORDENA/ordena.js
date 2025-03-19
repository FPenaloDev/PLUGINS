import { cargarConfeti, mostrarConfetiFinal } from "../ANIMACIONES/CONFETTI/confetti.js";
export function ordena(contenedor, niveles) {
  // Configuración inicial

  // Estado del juego
  let nivel = 1;
  let conceptoSeleccionado = null;
  let conceptoArrastrado = null;

  const elementos = {};
  cargarConfeti();
  function crearEstilos() {
    if (document.querySelector('.css')) {
      document.querySelector('.css').remove();
    }
    const css = document.createElement('link');
    css.rel = 'stylesheet';
    css.className = 'css';
    css.type = 'text/css';
    css.href = 'ORDENA/ordena.css';
    document.head.appendChild(css);
  }

  function crearEstructuraHTML() {
    const nivelActual = niveles[nivel - 1];

    // Crear una copia de los conceptos y desordenarlos
    const conceptosDesordenados = [...nivelActual.conceptos].sort(() => Math.random() - 0.5);

    contenedor.innerHTML = `
      <div id="actividad-ordena">
        <h2>${nivelActual.titulo}</h2>
        <div class="contenedor-ordenar">
          <div class="lista-conceptos">
            ${conceptosDesordenados.map((concepto, index) => {
      // Encontrar el índice original (orden correcto) del concepto
      const ordenOriginal = nivelActual.conceptos.indexOf(concepto) + 1;
      return `
                <div class="concepto" data-orden="${ordenOriginal}" draggable="true">
                  ${concepto}
                </div>
              `;
    }).join('')}
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
        <div class="mensaje-nivel" id="mensajeNivel"></div>
      </div>

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

  function hacerArrastrables() {
    const conceptos = Array.from(elementos.conceptos);

    conceptos.forEach(concepto => {
      // Evento para comenzar a arrastrar
      concepto.addEventListener('dragstart', (e) => {
        conceptoArrastrado = concepto;
        setTimeout(() => {
          concepto.classList.add('arrastrando');
        }, 0);

        // Seleccionar el concepto al comenzar a arrastrarlo
        if (conceptoSeleccionado) {
          conceptoSeleccionado.classList.remove('seleccionado');
        }
        conceptoSeleccionado = concepto;
        concepto.classList.add('seleccionado');
        actualizarBotones();
      });

      // Evento cuando termina el arrastre
      concepto.addEventListener('dragend', () => {
        concepto.classList.remove('arrastrando');
        conceptoArrastrado = null;
      });

      // Permitir que el concepto sea un destino de arrastre
      concepto.addEventListener('dragover', (e) => {
        e.preventDefault();
        if (conceptoArrastrado !== concepto) {
          const rect = concepto.getBoundingClientRect();
          const mitad = rect.y + rect.height / 2;

          // Añadir indicador visual de dónde se colocará
          conceptos.forEach(c => {
            c.classList.remove('drop-arriba', 'drop-abajo');
          });

          if (e.clientY < mitad) {
            concepto.classList.add('drop-arriba');
          } else {
            concepto.classList.add('drop-abajo');
          }
        }
      });

      // Limpiar indicadores visuales cuando el cursor sale
      concepto.addEventListener('dragleave', () => {
        concepto.classList.remove('drop-arriba', 'drop-abajo');
      });

      // Manejar el evento drop
      concepto.addEventListener('drop', async (e) => {
        e.preventDefault();

        if (conceptoArrastrado === concepto) return;

        const rect = concepto.getBoundingClientRect();
        const mitad = rect.y + rect.height / 2;
        const direccion = e.clientY < mitad ? 'arriba' : 'abajo';

        // Quitar indicadores visuales
        concepto.classList.remove('drop-arriba', 'drop-abajo');

        // Animar y realizar el intercambio
        await animarIntercambioArrastrable(conceptoArrastrado, concepto, direccion);

        // Actualizar elementos y botones
        elementos.conceptos = contenedor.querySelectorAll('.concepto');
        actualizarBotones();
      });
    });
  }

  async function animarIntercambioArrastrable(elementoArrastrado, elementoDestino, direccion) {
    const conceptosActualizados = Array.from(contenedor.querySelectorAll('.concepto'));
    const indiceArrastrado = conceptosActualizados.indexOf(elementoArrastrado);
    const indiceDestino = conceptosActualizados.indexOf(elementoDestino);

    // Calculamos las posiciones iniciales de ambos elementos
    const rectArrastrado = elementoArrastrado.getBoundingClientRect();
    const rectDestino = elementoDestino.getBoundingClientRect();

    // Calculamos la distancia vertical a animar
    const distanciaY = rectDestino.y - rectArrastrado.y;

    // Configuramos la animación
    const duracion = 300;

    elementoArrastrado.style.transition = `transform ${duracion}ms ease`;
    elementoDestino.style.transition = `transform ${duracion}ms ease`;

    // Si el elemento se arrastra arriba del destino
    if (direccion === 'arriba') {
      // Movemos el elemento arrastrado hacia arriba
      if (indiceArrastrado > indiceDestino) {
        // El elemento arrastrado va hacia arriba
        elementoArrastrado.style.transform = `translateY(${-Math.abs(distanciaY)}px)`;

        // Los elementos intermedios bajan
        const elementosIntermedios = conceptosActualizados.slice(indiceDestino, indiceArrastrado);
        elementosIntermedios.forEach(elem => {
          if (elem !== elementoArrastrado && elem !== elementoDestino) {
            elem.style.transition = `transform ${duracion}ms ease`;
            elem.style.transform = `translateY(${elementoArrastrado.offsetHeight}px)`;
          }
        });

        await new Promise(resolve => setTimeout(resolve, duracion));

        // Restauramos los estilos y reorganizamos el DOM
        elementoArrastrado.style.transition = '';
        elementoArrastrado.style.transform = '';
        elementosIntermedios.forEach(elem => {
          elem.style.transition = '';
          elem.style.transform = '';
        });

        elementos.listaConceptos.insertBefore(elementoArrastrado, elementoDestino);
      } else {
        // Intercambio cuando el elemento ya está arriba pero queremos insertarlo antes
        elementos.listaConceptos.insertBefore(elementoArrastrado, elementoDestino);
      }
    } else {
      // Si el elemento se arrastra debajo del destino
      if (indiceArrastrado < indiceDestino) {
        // El elemento arrastrado va hacia abajo
        elementoArrastrado.style.transform = `translateY(${Math.abs(distanciaY)}px)`;

        // Los elementos intermedios suben
        const elementosIntermedios = conceptosActualizados.slice(indiceArrastrado + 1, indiceDestino + 1);
        elementosIntermedios.forEach(elem => {
          if (elem !== elementoArrastrado && elem !== elementoDestino) {
            elem.style.transition = `transform ${duracion}ms ease`;
            elem.style.transform = `translateY(${-elementoArrastrado.offsetHeight}px)`;
          }
        });

        await new Promise(resolve => setTimeout(resolve, duracion));

        // Restauramos los estilos y reorganizamos el DOM
        elementoArrastrado.style.transition = '';
        elementoArrastrado.style.transform = '';
        elementosIntermedios.forEach(elem => {
          elem.style.transition = '';
          elem.style.transform = '';
        });

        elementos.listaConceptos.insertBefore(elementoArrastrado, elementoDestino.nextSibling);
      } else {
        // Intercambio cuando el elemento ya está abajo pero queremos insertarlo después
        if (elementoDestino.nextSibling) {
          elementos.listaConceptos.insertBefore(elementoArrastrado, elementoDestino.nextSibling);
        } else {
          elementos.listaConceptos.appendChild(elementoArrastrado);
        }
      }
    }
  }

  function inicializar() {
    if (document.querySelector('#css')) {
      document.querySelector('#css').remove();
    } else {
      console.log('No se encontro el css');
    }
    crearEstilos();
    crearEstructuraHTML();
    inicializarEventos();
    hacerArrastrables(); // Activar funcionalidad de arrastrar y soltar
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
  function mostrarPopupFinal() {
    const overlay = document.createElement('div');
    overlay.id = 'overlayPopup';
    overlay.innerHTML = `
        <div id="popupContent">
            <h2>¡Felicidades!</h2>
            <p>Has completado todas las rondas. ¡Excelente trabajo!</p>
            <button id="btnCerrarPopup" onclick="cerrarPopup()">Cerrar</button>
        </div>
    `;
    document.querySelector('#actividad-ordena').appendChild(overlay);

    overlay.style.display = 'flex';

    document.getElementById('btnCerrarPopup', 'overlayPopup').addEventListener('click', () => {
      cerrarPopup();
    });
    document.getElementById('overlayPopup').addEventListener('click', () => {
      cerrarPopup();
    });
  }

  function cerrarPopup() {
    const overlay = document.getElementById('overlayPopup');
    overlay.remove();
  }
  async function verificarOrden() {
    const conceptosActualizados = Array.from(contenedor.querySelectorAll('.concepto'));
    const ordenActual = conceptosActualizados.map(concepto =>
      parseInt(concepto.getAttribute('data-orden'))
    );

    // Verificar si el orden es correcto (1, 2, 3, 4, 5...)
    const ordenCorrecto = ordenActual.every((valor, indice) => valor === indice + 1);

    // Contar cuántos elementos están en la posición correcta
    const elementosCorrectos = ordenActual.filter((valor, indice) => valor === indice + 1).length;
    const totalElementos = ordenActual.length;
    const porcentajeAcierto = Math.round((elementosCorrectos / totalElementos) * 100);

    await mostrarFeedbackConceptos(ordenActual, conceptosActualizados);

    if (ordenCorrecto) {
      document.getElementById('mensajeNivel').style.background = 'green';
      elementos.botonVerificar.disabled = true;


      if (nivel < niveles.length) {
        mostrarMensajeNivel(`<p>¡Perfecto! ¡Has completado el nivel correctamente!</p>`);
        nivel++;
        inicializar();
      } else {
        await new Promise(resolve => setTimeout(resolve, 0));
        mostrarConfetiFinal();
        setTimeout(() => {
          mostrarPopupFinal();
        }, 2000);
      }
    } else {
      // Retroalimentación mejorada para intentos incorrectos
      let mensaje = '';

      if (porcentajeAcierto >= 80) {
        document.getElementById('mensajeNivel').style.background = 'blue';
        mensaje = `<p>¡Casi lo tienes! ${elementosCorrectos} de ${totalElementos} elementos están en la posición correcta.</p>`;
      } else if (porcentajeAcierto >= 50) {
        document.getElementById('mensajeNivel').style.background = 'blue';
        mensaje = `<p>Vas por buen camino. ${elementosCorrectos} de ${totalElementos} elementos están correctos.</p>`;
      } else {
        document.getElementById('mensajeNivel').style.background = 'red';
        mensaje = `<p>Intenta revisar nuevamente. Solo ${elementosCorrectos} de ${totalElementos} elementos están en la posición correcta.</p>`;
      }

      mostrarMensajeNivel(mensaje);
    }
  }

  async function mostrarFeedbackConceptos(ordenActual, conceptosActualizados) {
    conceptosActualizados.forEach((concepto, indice) => {
      const ordenEsperado = indice + 1;
      const ordenActualConcepto = parseInt(concepto.getAttribute('data-orden'));
      const esCorrecta = ordenActualConcepto === ordenEsperado;

      // Aplicar estilos según si es correcto o incorrecto
      concepto.style.backgroundColor = esCorrecta ? '#bbd9a0' : 'rgb(220, 53, 69,0.5)';
      concepto.classList.remove('correcto', 'incorrecto');
      concepto.classList.add(esCorrecta ? 'correcto' : 'incorrecto');

      // Si está en la posición incorrecta, agregar el indicador de posición
      if (!esCorrecta) {
        let indicadorPosicion = concepto.querySelector('.indicador-posicion');
        if (!indicadorPosicion) {
          indicadorPosicion = document.createElement('span');
          indicadorPosicion.classList.add('indicador-posicion');
          indicadorPosicion.innerHTML = `<p>Posición: ${ordenActualConcepto}</p>`;
          indicadorPosicion.style.position = 'absolute';
          indicadorPosicion.style.right = '10px';
          indicadorPosicion.style.fontSize = '0.8em';
          indicadorPosicion.style.color = '#dc3545';
          concepto.style.position = 'relative';
          concepto.appendChild(indicadorPosicion);
        }
      } else {
        // Si está correcto, eliminar el indicador si existe
        const indicador = concepto.querySelector('.indicador-posicion');
        if (indicador) indicador.remove();
      }
    });
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
    elementos.mensajeNivel.innerHTML = mensaje;
    elementos.mensajeNivel.classList.add('visible');
    setTimeout(() => {
      elementos.mensajeNivel.classList.remove('visible');
    }, 2500); // Aumentado a 2.5 segundos para dar más tiempo para leer
  }

  function reiniciarJuego() {
    nivel = 1;
    inicializar();
  }

  // Inicializar el juego
  inicializar();
}