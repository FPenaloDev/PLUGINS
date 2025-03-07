
export function carrusel_v2(contenedor, secciones) {
  if (document.querySelector('.css')) {
    document.querySelector('.css').remove();
  }
  const css = document.createElement('link');
  css.rel = 'stylesheet';
  css.className = 'css';
  css.type = 'text/css';
  css.href = 'PLUGINS/CARRUSEL_V2/carrusel_v2.css';
  document.head.appendChild(css);
  contenedor.innerHTML = '';

  // Crear el contenedor del carrusel
  const carruselContainer = document.createElement('div');
  carruselContainer.id = 'carrusel-v2';
  carruselContainer.innerHTML = `
    <div class="contenedor-carrusel">
    <h2 class="titulo_diapositiva">${secciones[0].titulo_diapositiva}</h2>
      <div class="contenedor_diapositiva">
      ${secciones[0].imagen ? `
        <div class="contenedor-imagen">
          <img src="${secciones[0].imagen}" alt="${secciones[0].texto}">
        </div>` : ''}      
        <div class="contenedor-texto-botones">
          <div class="contenedor-texto">
          <h2>${secciones[0].titulo_texto}</h2>
            <p>${secciones[0].texto}</p>
          </div>
          <div class="contenedor-botones">
            <button id="boton-back">
              <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 15 15">
                <path fill="#dc2626" d="M8.293 2.293a1 1 0 0 1 1.414 0l4.5 4.5a1 1 0 0 1 0 1.414l-4.5 4.5a1 1 0 0 1-1.414-1.414L11 8.5H1.5a1 1 0 0 1 0-2H11L8.293 3.707a1 1 0 0 1 0-1.414"/>
              </svg>
            </button>
            <button id="boton-next">
              <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 15 15">
                <path fill="#dc2626" d="M8.293 2.293a1 1 0 0 1 1.414 0l4.5 4.5a1 1 0 0 1 0 1.414l-4.5 4.5a1 1 0 0 1-1.414-1.414L11 8.5H1.5a1 1 0 0 1 0-2H11L8.293 3.707a1 1 0 0 1 0-1.414"/>
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  `;

  // Añadir el carrusel al contenedor proporcionado
  contenedor.appendChild(carruselContainer);

  // Variables para controlar la sección actual
  let seccionActual = 0;
  const imagenElement = carruselContainer.querySelector('.contenedor-imagen img');
  const diapositivaDiv = carruselContainer.querySelector('.contenedor_diapositiva');
  const textoDiv = carruselContainer.querySelector('.contenedor-texto-botones');
  const textoElement = carruselContainer.querySelector('.contenedor-texto p');
  const textoTitulo = carruselContainer.querySelector('.contenedor-texto h2');
  const botonBack = carruselContainer.querySelector('#boton-back');
  const botonNext = carruselContainer.querySelector('#boton-next');

  // Función para actualizar el carrusel
  function actualizarCarrusel() {
    const contenedorImagen = carruselContainer.querySelector('.contenedor-imagen');

    if (secciones[seccionActual].imagen) {
      if (!imagenElement) {

        // Si el contenedor de imagen existe, agregamos la nueva imagen
        if (contenedorImagen) {
          contenedorImagen.appendChild(nuevaImagen);
        }
      } else {
        // Crear la imagen solo si no existe
        const nuevaImagen = document.createElement('img');
        nuevaImagen.src = secciones[seccionActual].imagen;
        nuevaImagen.alt = secciones[seccionActual].texto;
        // Si la imagen ya existe, solo actualizamos src y alt
        imagenElement.src = secciones[seccionActual].imagen;
        imagenElement.alt = secciones[seccionActual].texto;
      }
    } else {
      textoDiv.style.maxWidth = '90%';
      textoDiv.style.width = '100%';
      diapositivaDiv.style.width = '100%';
      textoDiv.style.margin = '0%';
      // Si no hay imagen en la nueva diapositiva, eliminamos la imagen anterior
      if (imagenElement) {
        imagenElement.remove();

      }
    }
    textoElement.innerHTML = `<p>${secciones[seccionActual].texto}</p>`;
    textoTitulo.innerHTML = `<p>${secciones[seccionActual].titulo_texto}</p>`;

    // Desactivar botón "back" si estamos en la primera página
    if (seccionActual === 0) {
      botonBack.disabled = true;
      botonBack.style.opacity = '0.5'; // Opcional: reducir opacidad para indicar desactivación
    } else {
      botonBack.disabled = false;
      botonBack.style.opacity = '1'; // Restaurar opacidad
    }

    // Desactivar botón "next" si estamos en la última página
    if (seccionActual === secciones.length - 1) {
      botonNext.disabled = true;
      botonNext.style.opacity = '0.5'; // Opcional: reducir opacidad para indicar desactivación
    } else {
      botonNext.disabled = false;
      botonNext.style.opacity = '1'; // Restaurar opacidad
    }
  }

  // Eventos para los botones
  botonBack.addEventListener('click', () => {
    if (seccionActual > 0) {
      seccionActual--;
      actualizarCarrusel();
    }
  });

  botonNext.addEventListener('click', () => {
    if (seccionActual < secciones.length - 1) {
      seccionActual++;
      actualizarCarrusel();
    }
  });

  // Inicializar el carrusel
  actualizarCarrusel();
}