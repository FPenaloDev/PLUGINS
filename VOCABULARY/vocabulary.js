import { cargarConfeti, mostrarConfeti, mostrarConfetiFinal } from '../ANIMACIONES/CONFETTI/confetti.js';
import { playAudio } from '../AUDIOS/audio.js';
export function iniciarActividadPronunciacion(contenedor, palabras) {
  const css = document.createElement('link');
  css.rel = `stylesheet`;
  css.type = `text/css`;
  css.href = `PLUGINS/VOCABULARY/vocabulary.css`;
  document.head.appendChild(css);
  cargarConfeti();
  // Limpiar el contenedor
  contenedor.innerHTML = '';
  contenedor.style.fontFamily = 'Arial, sans-serif';
  contenedor.style.padding = '20px';

  // Variables para el manejo de páginas
  const palabrasPorPagina = 10;
  const totalPaginas = Math.ceil(palabras.length / palabrasPorPagina);
  let paginaActual = 0;
  let palabrasCompletadas = new Set();

  // Función para crear una página de la actividad
  function crearPagina(numeroPagina) {
    // Limpiar el contenedor
    contenedor.innerHTML = '';

    // Mostrar número de página si hay más de una
    if (totalPaginas > 1) {
      const indicadorPagina = document.createElement('div');
      indicadorPagina.textContent = `${numeroPagina + 1}/${totalPaginas}`;
      indicadorPagina.className = `indicadorFase`;
      contenedor.appendChild(indicadorPagina);
    }

    // Calcular palabras para esta página
    const inicio = numeroPagina * palabrasPorPagina;
    const fin = Math.min(inicio + palabrasPorPagina, palabras.length);
    const palabrasPagina = palabras.slice(inicio, fin);

    // Contenedor para las columnas de palabras
    const contenedorPalabras = document.createElement('div');
    contenedorPalabras.className = `columnaPalabras`;
    contenedor.appendChild(contenedorPalabras);

    // Determinar si necesitamos dos columnas
    const usarDosColumnas = palabrasPagina.length > 5;

    // Crear columnas
    const columna1 = document.createElement('div');
    columna1.style.flex = usarDosColumnas ? '0 0 48%' : '0 0 100%';
    columna1.style.display = 'flex';
    columna1.style.justifyContent = 'space-between';
    contenedorPalabras.appendChild(columna1);

    let columna2;
    if (usarDosColumnas) {
      columna2 = document.createElement('div');
      columna2.style.flex = '0 0 48%';
      columna2.style.display = 'flex';
      columna2.style.justifyContent = 'space-between';
      contenedorPalabras.appendChild(columna2);
    }

    // Crear la lista de palabras para cada columna
    const listaPalabras1 = document.createElement('ul');
    listaPalabras1.style.listStyle = 'none';
    listaPalabras1.style.padding = '0';
    columna1.appendChild(listaPalabras1);

    let listaPalabras2;
    if (usarDosColumnas) {
      listaPalabras2 = document.createElement('ul');
      listaPalabras2.style.listStyle = 'none';
      listaPalabras2.style.padding = '0';
      columna2.appendChild(listaPalabras2);
    }

    // Añadir cada palabra a la lista correspondiente
    palabrasPagina.forEach((palabra, index) => {
      const divPalabra = document.createElement('div');
      divPalabra.className = `divPalabra`;
      const itemPalabra = document.createElement('li');
      itemPalabra.textContent = palabra.palabra;
      itemPalabra.id = `palabra-${inicio + index}`;
      itemPalabra.className = `palabra`;
      divPalabra.appendChild(itemPalabra);

      if (palabra.imagen) {
        const imagenPalabra = document.createElement('img');
        imagenPalabra.src = `${palabras[inicio + index].imagen}`;
        imagenPalabra.style.width = '100%';
        imagenPalabra.style.borderRadius = '50px';
        imagenPalabra.style.maxWidth = '6em';
        imagenPalabra.style.maxHeight = '6em';
        imagenPalabra.style.objectFit = 'contain';
        divPalabra.appendChild(imagenPalabra);
      }

      // Si la palabra ya fue completada anteriormente
      if (palabrasCompletadas.has(inicio + index)) {
        itemPalabra.style.textDecoration = 'line-through';
        itemPalabra.style.color = '#27ae60';
        divPalabra.style.background = '#e9f7ef';
      }

      // Determinar en qué columna va cada palabra
      if (!usarDosColumnas || index < Math.ceil(palabrasPagina.length / 2)) {
        listaPalabras1.appendChild(divPalabra);
      } else {
        listaPalabras2.appendChild(divPalabra);
      }
    });

    // Contenedor para los controles
    const contenedorControles = document.createElement('div');
    contenedorControles.style.display = 'flex';
    contenedorControles.style.flexDirection = 'column';
    contenedorControles.style.alignItems = 'center';
    contenedorControles.style.marginTop = '20px';
    contenedor.appendChild(contenedorControles);

    // Botón de grabar
    const botonGrabar = document.createElement('button');

    botonGrabar.className = `botonGrabar`;
    botonGrabar.innerHTML = `<svg class="micro" xmlns="http://www.w3.org/2000/svg" 
                viewbox="0 0 512 512">
                <path id="path_1" stroke-linecap="round" stroke-linejoin="round" stroke-width="32"
                  d="M192 448h128m64-240v32c0 70.4-57.6 128-128 128h0c-70.4 0-128-57.6-128-128v-32m128 160v80"></path>
                <path 
                  d="M256 320a78.83 78.83 0 0 1-56.55-24.1A80.9 80.9 0 0 1 176 239V128a79.69 79.69 0 0 1 80-80c44.86 0 80 35.14 80 80v111c0 44.66-35.89 81-80 81">
                </path>
              </svg>`;
    contenedorControles.appendChild(botonGrabar);

    // Elemento para mostrar lo que se reconoce
    const textoReconocido = document.createElement('p');
    textoReconocido.style.fontSize = '18px';
    textoReconocido.style.minHeight = '24px';
    textoReconocido.style.fontStyle = 'italic';
    textoReconocido.style.color = '#7f8c8d';
    contenedorControles.appendChild(textoReconocido);

    // Contenedor para botones de navegación
    const contenedorNavegacion = document.createElement('div');
    contenedorNavegacion.style.display = 'flex';
    contenedorNavegacion.style.justifyContent = 'center';
    contenedorNavegacion.style.gap = '5%';
    contenedorNavegacion.style.width = '100%';
    contenedorNavegacion.style.marginTop = '20px';
    contenedorNavegacion.style.padding = '20px';

    contenedorControles.appendChild(contenedorNavegacion);

    // Botón para página anterior
    if (numeroPagina > 0) {
      const botonAnterior = document.createElement('button');
      botonAnterior.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="1.5em" height="1.5em" style="transform:rotate(180deg)" viewBox="0 0 24 24"><path fill="currentColor" d="M5 7.766c0-1.554 1.696-2.515 3.029-1.715l7.056 4.234c1.295.777 1.295 2.653 0 3.43L8.03 17.949c-1.333.8-3.029-.16-3.029-1.715zM14.056 12L7 7.766v8.468zM18 6a1 1 0 0 1 1 1v10a1 1 0 1 1-2 0V7a1 1 0 0 1 1-1"/></svg>`;
      botonAnterior.className = 'anterior';
      botonAnterior.style.padding = '10px 15px';
      botonAnterior.style.cursor = 'pointer';
      contenedorNavegacion.appendChild(botonAnterior);

      botonAnterior.addEventListener('click', function () {
        paginaActual--;
        crearPagina(paginaActual);
      });
    } else {
      // Espacio en blanco para mantener el layout
      const espacioEnBlanco = document.createElement('div');
      contenedorNavegacion.appendChild(espacioEnBlanco);
    }

    // Botón para reiniciar
    const botonReiniciar = document.createElement('button');
    botonReiniciar.id = 'botonReiniciar';
    botonReiniciar.innerHTML = `
              <svg class="icono-reiniciar" style="transform: rotate(-90deg);" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="4" stroke-linecap="round" stroke-linejoin="round">
            <path d="M23 4v6h-6"></path>
            <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"></path>
        <span class="texto-reiniciar">Reiniciar</span>
        </svg>
      `;
    contenedorNavegacion.appendChild(botonReiniciar);

    // Botón para página siguiente
    if (numeroPagina < totalPaginas - 1) {
      const botonSiguiente = document.createElement('button');
      botonSiguiente.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="1.5em" height="1.5em" viewBox="0 0 24 24"><path fill="currentColor" d="M5 7.766c0-1.554 1.696-2.515 3.029-1.715l7.056 4.234c1.295.777 1.295 2.653 0 3.43L8.03 17.949c-1.333.8-3.029-.16-3.029-1.715zM14.056 12L7 7.766v8.468zM18 6a1 1 0 0 1 1 1v10a1 1 0 1 1-2 0V7a1 1 0 0 1 1-1"/></svg>`;
      botonSiguiente.className = `siguiente`;
      contenedorNavegacion.appendChild(botonSiguiente);

      botonSiguiente.addEventListener('click', function () {
        paginaActual++;
        crearPagina(paginaActual);
      });
    }

    // Estado de grabación
    // Estado de grabación
    let estaGrabando = false;
    let reconocimientoVoz = null;

    // Verificar si el navegador soporta reconocimiento de voz
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      reconocimientoVoz = new SpeechRecognition();
      reconocimientoVoz.lang = 'en-US'; // Configurar para reconocer inglés
      reconocimientoVoz.continuous = true; // Cambiar a true para que no se detenga automáticamente
      reconocimientoVoz.interimResults = false;

      // Manejar los resultados del reconocimiento
      reconocimientoVoz.onresult = function (event) {
        const resultados = event.results;
        for (let i = event.resultIndex; i < resultados.length; i++) {
          const resultado = resultados[i][0].transcript.toLowerCase();
          textoReconocido.textContent = `Palabra reconocida: "${resultado}"`;

          // Dividir las palabras reconocidas
          const palabrasReconocidas = resultado.trim().replace(/\./g, '').split(' ');

          // Verificar si cada palabra reconocida está en nuestra lista
          palabrasReconocidas.forEach((palabraReconocida) => {
            palabrasPagina.forEach((palabra, index) => {
              const indiceGlobal = inicio + index;
              const elementoPalabra = document.getElementById(`palabra-${indiceGlobal}`);

              if (palabraReconocida.toLowerCase() === palabra.palabra.trim().toLowerCase()) {
                // Marcar como completada con un retraso
                elementoPalabra.style.textDecoration = 'line-through';
                elementoPalabra.style.color = '#27ae60';
                elementoPalabra.style.backgroundColor = '#e9f7ef';
                palabrasCompletadas.add(indiceGlobal);
                mostrarConfeti();
                playAudio('./PLUGINS/AUDIOS/acierto.mp3');
              }
            });
          });
        }
      };

      // Cuando termina el reconocimiento
      reconocimientoVoz.onend = function () {
        botonGrabar.innerHTML = `<svg class="micro" xmlns="http://www.w3.org/2000/svg" 
        viewbox="0 0 512 512">
        <path id="path_1" stroke-linecap="round" stroke-linejoin="round" stroke-width="32"
          d="M192 448h128m64-240v32c0 70.4-57.6 128-128 128h0c-70.4 0-128-57.6-128-128v-32m128 160v80"></path>
        <path 
          d="M256 320a78.83 78.83 0 0 1-56.55-24.1A80.9 80.9 0 0 1 176 239V128a79.69 79.69 0 0 1 80-80c44.86 0 80 35.14 80 80v111c0 44.66-35.89 81-80 81">
        </path>
      </svg>`;
        botonGrabar.style.background = 'var(--cuarto)';
        estaGrabando = false;
      };

      // Manejar errores
      reconocimientoVoz.onerror = function (event) {
        textoReconocido.textContent = `Error en el reconocimiento: ${event.error}`;
        botonGrabar.textContent = 'Grabar';
        botonGrabar.style.backgroundColor = '#3498db';
        estaGrabando = false;
      };

      // Funcionalidad del botón de grabar
      botonGrabar.addEventListener('click', function () {
        if (!estaGrabando) {
          reconocimientoVoz.start();
          botonGrabar.innerHTML = `<p style="margin:auto">Grabando...</p>`;
          textoReconocido.textContent = 'Escuchando...';
          estaGrabando = true;
        } else {
          reconocimientoVoz.stop();
          botonGrabar.innerHTML = `<svg class="micro" xmlns="http://www.w3.org/2000/svg" 
            viewbox="0 0 512 512">
            <path id="path_1" stroke-linecap="round" stroke-linejoin="round" stroke-width="32"
              d="M192 448h128m64-240v32c0 70.4-57.6 128-128 128h0c-70.4 0-128-57.6-128-128v-32m128 160v80"></path>
            <path 
              d="M256 320a78.83 78.83 0 0 1-56.55-24.1A80.9 80.9 0 0 1 176 239V128a79.69 79.69 0 0 1 80-80c44.86 0 80 35.14 80 80v111c0 44.66-35.89 81-80 81">
            </path>
          </svg>`;
          botonGrabar.style.backgroundColor = 'var(--cuarto)';
          estaGrabando = false;
        }
      });
    } else {
      // Si el navegador no soporta reconocimiento de voz
      botonGrabar.disabled = true;
      botonGrabar.style.backgroundColor = '#95a5a6';
      textoReconocido.textContent = 'Tu navegador no soporta reconocimiento de voz';
    }

    // Funcionalidad del botón de reiniciar
    botonReiniciar.addEventListener('click', function () {
      palabrasCompletadas.clear();
      paginaActual = 0;
      crearPagina(paginaActual);
    });
  }

  // Iniciar con la primera página
  crearPagina(paginaActual);
}