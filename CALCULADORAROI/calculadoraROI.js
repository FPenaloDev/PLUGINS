import { cargarConfeti, mostrarConfetiFinal } from '../ANIMACIONES/CONFETTI/confetti.js';

import {playAudio} from '../audios/audio.js';

export function calculadoraROI(contenedor, secciones) {
  const css = document.createElement('link');
  css.rel = 'stylesheet';
  css.type = 'text/css';
  css.href = 'PLUGINS/CALCULADORAROI/calculadoraROI.css';
  document.head.appendChild(css);

  contenedor.innerHTML = `
<div class="contenedor-cuestionario">
  <div class="barra-lateral animate__animated animate__slideInLeft"></div>
  <p>Calcula la liquidez, solvencia y escribe el resultado:</p>
  <div>
    <div class="contenedor-progreso">
      <div class="barra-progreso">
        <div class="progreso" id="progreso"></div>
      </div>
    </div>
  </div>
</div>
<div class="contenido-principal animate__animated animate__fadeIn">
  <div class="resultado" id="resultado"></div>
  <div id="formulario-cuestionario"></div>
  <div class="contenedor-botones">
    <button id="boton-enviar">
        <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24"><path fill="none" stroke="#ffffff" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M22 2L11 13M22 2l-7 20l-4-9l-9-4z"/></svg>
        <span class="texto-boton">Enviar</span>
    </button>
    <button id="boton-mostrar-soluciones">
<svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24"><path fill="#ffffff" d="M12 9a3.02 3.02 0 0 0-3 3c0 1.642 1.358 3 3 3s3-1.358 3-3s-1.359-3-3-3"/><path fill="#ffffff" d="M12 5c-7.633 0-9.927 6.617-9.948 6.684L1.946 12l.105.316C2.073 12.383 4.367 19 12 19s9.927-6.617 9.948-6.684l.106-.316l-.105-.316C21.927 11.617 19.633 5 12 5m0 12c-5.351 0-7.424-3.846-7.926-5C4.578 10.842 6.652 7 12 7c5.351 0 7.424 3.846 7.926 5c-.504 1.158-2.578 5-7.926 5"/></svg>
        <span class="texto-boton">Soluciones</span>
    </button>
    <button id="boton-mostrar-formulas">
        <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 32 32"><path fill="#ffffff" d="M5.896 5.333V21.25h23.417V5.333zM26.312 18.25H8.896V8.334h17.417v9.916zM4.896 9.542h-3.21V25.46h23.418v-3.21H4.896z"/></svg>
        <span class="texto-boton">Fórmulas</span>
    </button>
</div>
</div>
<div class="popup-overlay" id="popup-overlay">
  <div id="popup-formulas" class="popup oculto">
    <div class="popup-contenido">
    <button id="cerrar-popup">×</button><br>
    ${secciones[0].popup}
    </div>
  </div>
</div>
`;

  const formularioCuestionario = document.getElementById('formulario-cuestionario');
  const botonEnviar = document.getElementById('boton-enviar');
  const botonMostrarSoluciones = document.getElementById('boton-mostrar-soluciones');
  const divResultado = document.getElementById('resultado');
  const barraProgreso = document.getElementById('progreso');

  let respuestas = secciones.map(() => []);

  cargarConfeti();

  function crearFormularioCuestionario() {
    secciones.forEach((_, indice) => {
      const contenedorPregunta = document.createElement('div');
      contenedorPregunta.className = 'contenedor-pregunta animate__animated animate__fadeInUp';
      contenedorPregunta.style.animationDelay = `${indice * 0.1}s`;

      const contenedorTexto = document.createElement('div');
      contenedorTexto.classList.add('texto-cuestionario');

      const etiqueta = document.createElement('label');
      etiqueta.innerHTML = secciones[indice].texto;

      const imagen = document.createElement('img');
      imagen.src = secciones[indice].imagen;
      if (secciones[indice].estilo) {
        imagen.style = secciones[indice].estilo;
      }

      contenedorTexto.appendChild(imagen);
      contenedorTexto.appendChild(etiqueta);
      contenedorPregunta.appendChild(contenedorTexto);

      const contenedorInputs = document.createElement('div');
      contenedorInputs.className = 'inputs-cuestionario';

      secciones[indice].inputs.forEach((inputHTML, subIndice) => {
        const divInput = document.createElement('div');
        divInput.className = 'div_input';

        const span = document.createElement('span');
        span.className = 'titulo-input';

        const input = document.createElement('input');
        input.type = 'text';
        input.id = `respuesta-${indice}-${subIndice}`;
        input.className = 'input-respuesta';
        input.value = ''; // Vacío al inicio

        const placeholderMatch = inputHTML.match(/placeholder="([^"]*)/);
        if (placeholderMatch) {
          input.placeholder = placeholderMatch[1];
        }

        // Descomenta este evento para que funcione la barra de progreso
        input.addEventListener('input', (event) => {
          manejarEntrada(indice, subIndice, event.target.value);
        });

        span.textContent = inputHTML.replace(/<[^>]*>/g, '').trim();
        divInput.appendChild(span);
        divInput.appendChild(input);

        contenedorInputs.appendChild(divInput);
      });

      contenedorPregunta.appendChild(contenedorInputs);
      formularioCuestionario.appendChild(contenedorPregunta);
    });
  }

  function configurarPopup() {
    const popupOverlay = document.getElementById('popup-overlay');
    const popupFormulas = document.getElementById('popup-formulas');
    const botonMostrarFormulas = document.getElementById('boton-mostrar-formulas');


    // Muestra el contenido de secciones[0].popup
    popupFormulas.innerHTML = secciones[0].popup;
    popupFormulas.id = 'popup-formulas';

    // Mostrar popup al hacer clic en el botón "Mostrar Formulas"
    botonMostrarFormulas.addEventListener('click', () => {
      popupOverlay.classList.add('mostrar');
      popupFormulas.classList.remove('oculto');
    });

    // También cierra el popup si se hace clic fuera del contenido
    popupOverlay.addEventListener('click', (event) => {
      if (event.target === popupOverlay) {
        popupOverlay.classList.remove('mostrar');
        popupFormulas.classList.add('oculto');
      }
    });

  }

  function botonCerrarPopup() {
    const popupOverlay = document.getElementById('popup-overlay');
    const popupFormulas = document.getElementById('popup-formulas');
    const botonCerrarPopup = document.createElement('button');

    // Estilo del botón de cerrar
    botonCerrarPopup.id = 'cerrar-popup';
    botonCerrarPopup.textContent = '×';

    // Inserta el botón de cierre al contenido del popup
    popupFormulas.appendChild(botonCerrarPopup);

    // Cerrar popup al hacer clic en el botón de cerrar
    botonCerrarPopup.addEventListener('click', () => {
      popupOverlay.classList.remove('mostrar');
      popupFormulas.classList.add('oculto');
    });

  }

  function manejarEntrada(indice, subIndice, valor) {
    if (!respuestas[indice]) respuestas[indice] = [];
    respuestas[indice][subIndice] = valor.toLowerCase().trim();
    actualizarProgreso();
  }

  function actualizarProgreso() {
    const totalRespuestas = respuestas.reduce((contador, resp) => contador + resp.filter(Boolean).length, 0);
    const totalInputs = secciones.reduce((contador, item) => contador + item.respuesta.length, 0);
    const progreso = (totalRespuestas / totalInputs) * 100;
    barraProgreso.style.width = `${progreso}%`;
  }

  function verificarRespuestas() {
    let puntuacion = 0;
    let totalInputs = 0;

    secciones.forEach((item, indice) => {
      item.respuesta.forEach((respuestaCorrecta, subIndice) => {
        totalInputs++;
        const input = document.getElementById(`respuesta-${indice}-${subIndice}`);
        const respuestaUsuario = respuestas[indice][subIndice];

        if (respuestaUsuario && respuestaUsuario.toLowerCase() === respuestaCorrecta.toLowerCase()) {
          input.style.background = 'var(--color-exito)';
          input.style.color = '#fff';
          input.style.fontWeight = '700';
          input.disabled = true;
          puntuacion++;
          playAudio('./PLUGINS/AUDIOS/acierto.mp3');
        } else {
          input.style.background = 'var(--color-error)';
          input.style.color = '#fff';
          input.style.fontWeight = '700';
          playAudio('./PLUGINS/AUDIOS/error.mp3');
        }
      });
    });

    const porcentaje = (puntuacion / totalInputs) * 100;
    divResultado.textContent = `¡Has acertado ${puntuacion} de ${totalInputs}! Tu porcentaje de aciertos es: ${porcentaje.toFixed(2)}%`;
    divResultado.classList.add('animate__animated', 'animate__fadeInUp');

    // Solo mostrar confeti si todas las respuestas son correctas
    if (puntuacion === totalInputs) {
      playAudio('./PLUGINS/AUDIOS/win.mp3');
      mostrarConfetiFinal();
      botonEnviar.disabled = true;
    }
  }

  function mostrarSoluciones() {
    secciones.forEach((item, indice) => {
      item.respuesta.forEach((respuestaCorrecta, subIndice) => {
        const input = document.getElementById(`respuesta-${indice}-${subIndice}`);
        input.value = respuestaCorrecta;
        input.disabled = true; // Deshabilitar input
      });
    });

    // Deshabilitar botones
    botonEnviar.disabled = true;
    botonMostrarSoluciones.disabled = true;
  }


  // Manejo de eventos para botones
  botonEnviar.addEventListener('click', verificarRespuestas);
  botonMostrarSoluciones.addEventListener('click', mostrarSoluciones);
  // Crear formulario al inicio
  crearFormularioCuestionario();
  configurarPopup(); // Llamada para configurar el popup
  botonCerrarPopup();
}
