export function carruselTarjetas(contenedor, secciones) {

  const css = document.createElement('link');
  css.rel = 'stylesheet';
  css.type = 'text/css';
  css.href = 'PLUGINS/CARRUSELTARJETAS/carruselTarjetas.css';

  document.head.appendChild(css);

  // Estructura HTML base
  contenedor.innerHTML = `
    <div id="carrusel-tarjetas">
      <div class="controles-carrusel">
        <button id="anterior">&#9664;</button>
        <button id="siguiente">&#9654;</button>
      </div>
      <div class="carrusel">
        <div class="pista-carrusel" id="pista-carrusel"></div>
      </div>
    </div>
  `;
  // Renderización dinámica
  const pista = document.getElementById('pista-carrusel');
  let contadorIdTarjeta = 1;


  secciones.forEach((seccion) => {

    const elementoSeccion = document.createElement('div');
    elementoSeccion.classList.add('seccion-carrusel');

    if (seccion.titulo) {

      const tituloCarrusel = document.createElement('div');
      tituloCarrusel.className = 'titulo';
      if (secciones.label === 'h2') {
        const titulo = document.createElement('h2');
        titulo.textContent = `${seccion.titulo}`;
        tituloCarrusel.appendChild(titulo);
        elementoSeccion.insertBefore(tituloCarrusel, elementoSeccion.firstChild);
      }
      else {
        const titulo = document.createElement('p');
        titulo.textContent = `${seccion.titulo}`;
        tituloCarrusel.appendChild(titulo);
        elementoSeccion.insertBefore(tituloCarrusel, elementoSeccion.firstChild);
      }
    }


    elementoSeccion.innerHTML += `
      <div class="contenedor-tarjetas">
        ${seccion.tarjetas.map(tarjeta => {
      const idTarjeta = `tarjeta${contadorIdTarjeta++}`;

      // Verificar si la tarjeta tiene una imagen
      const imagen = tarjeta.img
        ? `<div class="icono"><img src="${tarjeta.img}" alt="${tarjeta.titulo}"></div>`
        : `
              <div class="imagen-svg">
                <svg viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="30" cy="30" r="45%" stroke="var(--borde-color-captivate)" stroke-width="2" fill="lightgray"/>
                  <text x="50%" y="50%" alignment-baseline="middle" text-anchor="middle" font-size="18" fill="#000">${contadorIdTarjeta - 1}</text>
                </svg>
              </div>
            `;
      console.log(contadorIdTarjeta);
      return `
            <div class="tarjeta" id="${idTarjeta}">
              <div class="tarjeta-interna">
                <div class="tarjeta-frontal">
                ${imagen}
                  <div class="contenidos-tarjeta">
                    <div class="div-titulo-icono">
                      <h3 class="titulo-tarjeta">${tarjeta.titulo}</h3>
                      <div class="div_icono_click">
                        <img src='./PLUGINS/CARRUSELTARJETAS/RECURSOS/icono-click.png' class='icono-click' alt="Click para voltear">
                      </div>
                    </div>
                  </div>
                </div>
                <div class="tarjeta-trasera">
                  <p>${tarjeta.contenido}</p>
                </div>
              </div>
            </div>
          `;
    }).join('')}
      </div>
    `;


    pista.appendChild(elementoSeccion);
  });


  // Funcionalidad del carrusel
  let indiceActual = 0;
  const botonAnterior = contenedor.querySelector('#anterior');
  const botonSiguiente = contenedor.querySelector('#siguiente');
  const totalSecciones = secciones.length;
  if (totalSecciones <= 1) {
    botonAnterior.style.display = "none";
    botonSiguiente.style.display = "none";
  }
  const actualizarCarrusel = () => {
    pista.style.transform = `translateX(-${indiceActual * 100}%)`;
    botonAnterior.disabled = indiceActual === 0;
    botonSiguiente.disabled = indiceActual === totalSecciones - 1;
  };

  botonAnterior.addEventListener('click', () => {
    if (indiceActual > 0) {
      indiceActual -= 1;
      actualizarCarrusel();
    }
  });

  botonSiguiente.addEventListener('click', () => {
    if (indiceActual < totalSecciones - 1) {
      indiceActual += 1;
      actualizarCarrusel();
    }
  });

  // Inicializar estado de botones
  actualizarCarrusel();

  // Habilitar volteo de tarjetas
  const tarjetas = contenedor.querySelectorAll('.tarjeta-interna');

  tarjetas.forEach((tarjeta) => {
    // Remover eventos anteriores si existen
    const nuevoElemento = tarjeta.cloneNode(true);
    tarjeta.parentNode.replaceChild(nuevoElemento, tarjeta);

    // Agregar nuevo evento
    nuevoElemento.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      nuevoElemento.classList.toggle('volteada');
    });
  });

  // Posicionar controles
  const carrusel = contenedor.querySelector('.carrusel');
  const controles = contenedor.querySelector('.controles-carrusel');

  if (carrusel && controles) {
    controles.style.position = 'fixed';
    controles.style.top = `40%`;
  }

  // Retornar métodos públicos
  return {
    actualizarPosicion: () => {
      if (carrusel && controles) {
        const alturaCarrusel = carrusel.offsetHeight;
        controles.style.top = `${alturaCarrusel / 4}px`;
      }
    }
  };
}