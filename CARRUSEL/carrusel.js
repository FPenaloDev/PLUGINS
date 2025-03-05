export function carrusel(contenedor, secciones) {
  if(document.getElementById('css')){
    document.getElementById('css').remove();
  }
  const css = document.createElement('link');
  css.rel = 'stylesheet';
  css.id = 'css';
  css.type = 'text/css';
  css.href = './PLUGINS/CARRUSEL/carrusel.css';

  document.head.appendChild(css);

  contenedor.innerHTML =
    `<div class="div-botones">
          <button class="anterior" id="anterior">&#9664;</button>
          <button class="siguiente" id="siguiente">&#9654;</button>
        </div>
      <div class="div-carrusel">
        <div class="div-diapositivas" id="carrusel"></div>
      </div>
      <div class="paginacion" id="paginacion"></div>`;

  function ajustarPosicionBotones() {
    const carrusel = document.querySelector('.activa');
    const divBotones = document.querySelector('.div-botones');

    // Actualizar estilos para posicionar los botones
    divBotones.style.position = 'relative';
    divBotones.style.left = '50%';
    divBotones.style.transform = 'translateX(-50%)';
    divBotones.style.zIndex = '1000'; // Asegurarse de que esté por encima de otros elementos
    if(carrusel){
      divBotones.style.top = `${carrusel.offsetHeight / 1.4}px`;
    }

  }

  function ajustarPaginacion() {
    const paginacion = document.getElementById('paginacion');
    const divDiapositivas = document.querySelector('.div-diapositivas');
    const activeIndex = Math.abs(parseInt(divDiapositivas.style.transform?.split('(')[1]) || 0) / 100 || 0;
    const activeContainer = document.querySelectorAll('.diapositiva')[activeIndex]?.querySelector('.pagina');

    if (activeContainer) {
      const containerRect = activeContainer.getBoundingClientRect();
      const divCarrusel = document.querySelector('.div-carrusel');

      // Calculate the relative position from the top of the carousel container
      const topPosition = containerRect.height; // 40px for spacing

      // Update pagination styles
      paginacion.style.position = 'relative';
      paginacion.style.top = `-50px`;
      paginacion.style.left = '50%';
      paginacion.style.transform = 'translateX(-50%)';
      paginacion.style.width = 'fit-content';
      paginacion.style.zIndex = '1000';

      // Update carousel container height to accommodate paginacion
      divCarrusel.style.marginBottom = `${paginacion.offsetHeight + 20}px`;
    }
  }

  function generarCarrusel() {
    const carrusel = document.getElementById('carrusel');
    let numeroPaginas = 0;
    secciones.forEach((item) => {
      numeroPaginas++;
      const div = document.createElement('div');
      div.className = `diapositiva`;
      div.id = `diapositiva${numeroPaginas}`;

      const pagina = document.createElement('div');
      pagina.className = 'pagina';

      const titulo = document.createElement('h2');
      titulo.className = 'titulo';
      titulo.innerHTML = item.titulo;
      pagina.appendChild(titulo);

      if (item.elementos && Array.isArray(item.elementos)) {
        const elementosOrdenados = [...item.elementos].sort((a, b) => a.orden - b.orden);

        elementosOrdenados.forEach((elemento) => {
          if (elemento.tipo === 'parrafo') {
            const p = document.createElement('p');
            p.innerHTML = elemento.contenido;
            p.style.margin = '0 0 0 4%';
            pagina.appendChild(p);
          }
          else if (elemento.tipo === 'lista') {
            const lista = document.createElement(elemento.estilo);
            elemento.items.forEach((item) => {
              const li = document.createElement('li');
              li.innerHTML = item;


              if (elemento.clase) li.classList.add(elemento.clase);

              lista.appendChild(li);
            });
            pagina.appendChild(lista);
          }
          else if (elemento.tipo === 'texto_imagen') {
            const container = document.createElement('div');
            container.className = 'text-image-container';

            const imageDiv = document.createElement('div');
            imageDiv.className = 'image-content';

            // Detectar el tipo de medio por la extensión del archivo
            const fileExtension = elemento.imagen.split('.').pop().toLowerCase();
            let mediaElement;

            if (['mp4', 'webm', 'ogg'].includes(fileExtension)) {
              // Si es un video
              mediaElement = document.createElement('video');
              mediaElement.controls = true;
              mediaElement.autoplay = false;
              mediaElement.muted = true;
              mediaElement.loop = true;
              mediaElement.style.width = '100%';
              mediaElement.style.height = 'auto';
              mediaElement.style.maxHeight = '400px';
              mediaElement.style.borderRadius = '10px';

              // Crear source para el video
              const source = document.createElement('source');
              source.src = elemento.imagen;
              source.type = `video/${fileExtension}`;
              mediaElement.appendChild(source);

              // Mensaje de fallback
              mediaElement.innerHTML += 'Tu navegador no soporta el tag de video.';

            } else if (['gif'].includes(fileExtension)) {
              // Si es un GIF
              mediaElement = document.createElement('img');
              mediaElement.style.width = '100%';
              mediaElement.style.height = 'auto';
              mediaElement.style.maxHeight = '400px';
              mediaElement.style.borderRadius = '10px';
              mediaElement.style.objectFit = 'contain';
              mediaElement.src = elemento.imagen;
            } else {
              // Si es una imagen estática
              mediaElement = document.createElement('img');
              mediaElement.style.width = '100%';
              mediaElement.style.height = 'auto';
              mediaElement.style.maxHeight = '400px';
              mediaElement.style.borderRadius = '10px';
              mediaElement.style.objectFit = 'contain';
              mediaElement.src = elemento.imagen;
            }

            mediaElement.alt = 'Contenido multimedia';

            // Manejar errores de carga
            mediaElement.onerror = function () {
              console.error('Error al cargar el medio:', elemento.imagen);
              mediaElement.style.display = 'none';

              // Crear mensaje de error
              const errorMsg = document.createElement('div');
              errorMsg.textContent = 'IMAGEN,VIDEO o GIF AQUI';
              errorMsg.style.color = 'red';
              errorMsg.style.padding = '20px';
              errorMsg.style.textAlign = 'center';
              imageDiv.appendChild(errorMsg);
            };

            // Manejar carga exitosa
            mediaElement.onload = function () {
              console.log('Medio cargado exitosamente:', elemento.imagen);
            };
            if (elemento.tipo === 'texto_imagen' && elemento.texto) {
              const textDiv = document.createElement('div');
              textDiv.className = 'text-content';
              if (elemento.texto && Array.isArray(elemento.texto)) {
                elemento.texto.forEach(subElemento => {
                  if (subElemento.tipo === 'parrafo') {
                    const p = document.createElement('p');
                    p.innerHTML = subElemento.contenido;
                    textDiv.appendChild(p);
                  }
                  else if (subElemento.tipo === 'lista') {
                    const lista = document.createElement(subElemento.estilo);
                    subElemento.items.forEach((item) => {
                      const li = document.createElement('li');
                      li.innerHTML = item;

                      if (elemento.clase) li.classList.add(elemento.clase);

                      lista.appendChild(li);
                    });
                    textDiv.appendChild(lista);
                  }
                });
              }
              imageDiv.appendChild(mediaElement);
              container.appendChild(imageDiv);
              container.appendChild(textDiv);
              pagina.appendChild(container);
            } else {
              imageDiv.appendChild(mediaElement);
              imageDiv.style.minWidth = '100%';
              container.appendChild(imageDiv);
              pagina.appendChild(container);
            }

          }
          else if (elemento.tipo === 'youtube') {
            const youtubeContainer = document.createElement('div');
            youtubeContainer.className = 'youtube-container';

            const iframe = document.createElement('iframe');
            iframe.src = `${elemento.url}`;
            iframe.width = '40%';
            iframe.height = '315';
            iframe.style.border = 'none';
            iframe.style.margin = '0 5%';
            iframe.style.borderRadius = '20px';
            iframe.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture';
            iframe.allowFullscreen = true;

            youtubeContainer.appendChild(iframe);
            pagina.appendChild(youtubeContainer);

            const textDiv = document.createElement('div');
            textDiv.className = 'text-content';

            if (elemento.texto && Array.isArray(elemento.texto)) {
              elemento.texto.forEach(subElemento => {
                if (subElemento.tipo === 'parrafo') {
                  const p = document.createElement('p');
                  p.innerHTML = subElemento.contenido;
                  textDiv.appendChild(p);
                }
                else if (subElemento.tipo === 'lista') {
                  const lista = document.createElement(subElemento.estilo);
                  subElemento.items.forEach((item) => {
                    const li = document.createElement('li');
                    li.innerHTML = item;

                    if (elemento.clase) li.classList.add(elemento.clase);

                    lista.appendChild(li);
                  });
                  textDiv.appendChild(lista);
                }
              });
            }


            youtubeContainer.appendChild(textDiv);/*
            pagina.appendChild(container); */
          }

        });
      }

      div.appendChild(pagina);
      carrusel.appendChild(div);
    });
  }

  generarCarrusel();
  const carrusel = document.getElementById('carrusel');
  const paginas = carrusel.children;
  const totalPaginas = paginas.length;
  let currentIndex = 0;


  function actualizarCarrusel() {
    // Mover el carrusel a la diapositiva activa
    carrusel.style.transform = `translateX(-${currentIndex * 100}%)`;

    // Actualizar la clase activa en los puntos de paginación
    document.querySelectorAll('#paginacion span').forEach((dot, index) => {
      dot.classList.toggle('active', index === currentIndex);
    });

    // Ajustar otros elementos relacionados
    ajustarPaginacion();
    ajustarPosicionBotones();
    ajustarCarrusel();
    quitarBotones();
  }

  function ajustarCarrusel() {
    // Obtener la altura de la diapositiva activa
    const diapositivaActiva = document.querySelector(`#diapositiva${currentIndex + 1} .pagina`);
    const activa = document.querySelector('.activa');
    if (activa) {
      activa.classList.remove('activa');
    }
    diapositivaActiva.classList.add('activa');
    if (diapositivaActiva) {
      let alturaDiapositiva = 0;
      alturaDiapositiva = diapositivaActiva.offsetHeight;

      // Ajustar la altura del contenedor
      const contenedorCarrusel = document.querySelector('#carrusel');
      if (contenedorCarrusel) {
        contenedorCarrusel.style.height = `${alturaDiapositiva + 90}px`;
      }
    }
  }

  function quitarBotones() {
    const anterior = document.getElementById('anterior');
    const siguiente = document.getElementById('siguiente');

    if (currentIndex === 0) {
      anterior.style.opacity = 0;  // Cambia la opacidad para indicar que está deshabilitado
      anterior.style.cursor = 'auto';
      anterior.disabled = true;  // Deshabilitar el botón
    } else {
      anterior.style.cursor = 'pointer';
      anterior.style.opacity = 1;
      anterior.disabled = false;  // Habilitar el botón
    }

    if (currentIndex === totalPaginas - 1) {
      siguiente.style.cursor = 'auto';
      siguiente.style.opacity = 0;
      siguiente.disabled = true;  // Deshabilitar el botón
    } else {
      siguiente.style.cursor = 'pointer';
      siguiente.style.opacity = 1;
      siguiente.disabled = false;  // Habilitar el botón
    }
  }

  // Llamar a la función inicialmente y cada vez que cambie el slide
  carrusel.addEventListener('transitionend', ajustarPaginacion);

  // Añadir la llamada a la función en los event listeners existentes
  document.getElementById('anterior').addEventListener('click', () => {
    if (currentIndex > 0) {
      currentIndex--;
      actualizarCarrusel();
      ajustarPaginacion();
      ajustarPosicionBotones();
    }
  });
  document.getElementById('siguiente').addEventListener('click', () => {
    if (currentIndex < totalPaginas - 1) {
      currentIndex++;
      actualizarCarrusel();
      ajustarPaginacion();
      ajustarPosicionBotones();
    }
  });
  function crearPaginacion() {
    const paginacionEl = document.getElementById('paginacion');
    for (let i = 0; i < totalPaginas; i++) {
      const span = document.createElement('span');
      span.addEventListener('click', () => {
        currentIndex = i;
        actualizarCarrusel();
      });
      paginacionEl.appendChild(span);
    }
  }

  crearPaginacion();
  /* CARGA Y REAJUSTE */
  window.addEventListener('transitionend', ajustarPaginacion);
  window.addEventListener('transitionend', ajustarPosicionBotones);
  window.addEventListener('transitionend', ajustarCarrusel);
  window.addEventListener('resize', ajustarPaginacion);
  window.addEventListener('resize', ajustarPosicionBotones);
  window.addEventListener('resize', ajustarCarrusel);
  window.addEventListener('load', ajustarPaginacion);
  window.addEventListener('load', ajustarPosicionBotones);
  window.addEventListener('load', ajustarCarrusel);
  actualizarCarrusel();
}
