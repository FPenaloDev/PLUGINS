export function speaking(contenedor, frases, audios) {
  if (document.querySelector('.css')) {
    document.querySelector('.css').remove();
  }
  const css = document.createElement('link');
  css.rel = 'stylesheet';
  css.className = 'css';
  css.type = 'text/css';
  css.href = 'PLUGINS/SPEAKING/Speaking.css';
  document.head.appendChild(css);

  // Estructura HTML
  contenedor.innerHTML = `
        <div class="actividad_speaking">
          <div class="contenedor_frase">
            <div id="numero_frase">
              <p></p>
            </div>
            <p id="palabra">Hello</p>
          </div>
          <div class="espectro_audio" id="espectro">
              ${'<div></div>'.repeat(40)} <!-- Generar 40 barras -->
          </div>
            <p id="resultados"></p>
            <p id="palabras_dichas"></p>
          <div class="contenedor_botones">
            <button id="back-button">BACK<br /><svg xmlns="http://www.w3.org/2000/svg"
                viewbox="0 0 1025 1024" style="transform: rotate(180deg);">
                <path
                  d="M896.62 1024q-53 0-90.5-37.5t-37.5-90.5V128q0-53 37.5-90.5T896.62 0t90.5 37.5t37.5 90.5v768q0 53-37.5 90.5t-90.5 37.5m-834-11q-25 27-62-13V24q37-40 62-13l563 463q15 16 15 38.5t-15 37.5z">
                </path>
              </svg></button>
            <button id="listen-button">LISTEN<br /><svg xmlns="http://www.w3.org/2000/svg" 
                viewbox="0 0 512 512">
                <path 
                  d="M133 440a35.37 35.37 0 0 1-17.5-4.67c-12-6.8-19.46-20-19.46-34.33V111c0-14.37 7.46-27.53 19.46-34.33a35.13 35.13 0 0 1 35.77.45l247.85 148.36a36 36 0 0 1 0 61l-247.89 148.4A35.5 35.5 0 0 1 133 440">
                </path>
              </svg></button>
            <button id="start-button">START<br /><svg xmlns="http://www.w3.org/2000/svg" 
                viewbox="0 0 512 512">
                <path id="path_1" stroke-linecap="round" stroke-linejoin="round" stroke-width="32"
                  d="M192 448h128m64-240v32c0 70.4-57.6 128-128 128h0c-70.4 0-128-57.6-128-128v-32m128 160v80"></path>
                <path 
                  d="M256 320a78.83 78.83 0 0 1-56.55-24.1A80.9 80.9 0 0 1 176 239V128a79.69 79.69 0 0 1 80-80c44.86 0 80 35.14 80 80v111c0 44.66-35.89 81-80 81">
                </path>
              </svg></button>
            <button id="next-button">NEXT<br /><svg xmlns="http://www.w3.org/2000/svg" 
                viewbox="0 0 1025 1024">
                <path
                  d="M896.62 1024q-53 0-90.5-37.5t-37.5-90.5V128q0-53 37.5-90.5T896.62 0t90.5 37.5t37.5 90.5v768q0 53-37.5 90.5t-90.5 37.5m-834-11q-25 27-62-13V24q37-40 62-13l563 463q15 16 15 38.5t-15 37.5z">
                </path>
              </svg></button>
          </div>

        </div>
        <div id="audios">
          ${audios.map(audio => `<audio id="${audio.id}" src="${audio.ruta}"></audio>`).join('')}
        </div>
  `;

  const espectroAudio = contenedor.querySelector('#espectro');
  const barrasEspectro = espectroAudio.querySelectorAll('div');
  let estaReproduciendo = false;

  const audioContext = new (window.AudioContext)();
  const analizador = audioContext.createAnalyser();
  const datosFrec = new Uint8Array(analizador.frequencyBinCount);

  const totalBarras = barrasEspectro.length;
  const cantidadAzul = Math.floor(totalBarras * 0.7);
  const cantidadRoja = totalBarras - cantidadAzul;

  const colores = new Array(cantidadAzul).fill('#163d73').concat(new Array(cantidadRoja).fill('#bf4e638c'));

  // Mezclar colores de manera aleatoria
  for (let i = colores.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [colores[i], colores[j]] = [colores[j], colores[i]];
  }

  // Aplicar colores a las barras
  barrasEspectro.forEach((barra, index) => {
    barra.style.backgroundColor = colores[index];
  });

  let indexActual = 0;

  function actualizarFrase() {
    const frase = frases[indexActual];
    const palabra = contenedor.querySelector('#palabra');
    const numero_frase = contenedor.querySelector('#numero_frase');
    const resultados = contenedor.querySelector('#resultados');
    const palabras_dichas = contenedor.querySelector('#palabras_dichas');

    palabra.innerHTML = '';
    frase.split(' ').forEach(palabraEncontrada => {
      const spanPalabra = document.createElement('span');
      spanPalabra.textContent = palabraEncontrada;
      spanPalabra.style.cssText = 'padding: 5px; margin: 2px; border-radius: 3px; display: inline-block; cursor: pointer;';
      palabra.appendChild(spanPalabra);
    });

    Array.from(palabra.getElementsByTagName('span')).forEach(span => {
      span.style.backgroundColor = '';
    });
    resultados.textContent = '';
    palabras_dichas.textContent = '';

    numero_frase.textContent = `${indexActual + 1}`;
  }

  // Objeto con mapeo de contracciones y sus formas expandidas
  const contractionMap = {
    'donot': 'dont',
    'doesnet': 'doesnt',
    'didnot': 'didnt',
    'hasnot': 'hasnt',
    'havenot': 'havent',
    'hadnot': 'hadnt',
    'willnot': 'wont',
    'wouldnot': 'wouldnt',
    'shouldnot': 'shouldnt',
    'couldnot': 'couldnt',
    'mustnot': 'mustnt',
    'isnot': 'isnt',
    'arenot': 'arent',
    'werenot': 'werent',
    'wasnot': 'wasnt',
    'iam': 'im',
    'youare': 'youre',
    'heis': 'hes',
    'sheis': 'shes',
    'itis': 'its',
    'weare': 'were',
    'theyare': 'theyre',
    'ihave': 'ive',
    'youhave': 'youve',
    'wehave': 'weve',
    'theyhave': 'theyve',
    'iwill': 'ill',
    'hewill': 'hell',
    'shewill': 'shell',
    'wewill': 'well',
    'theywill': 'theyll',
    'youwill': 'youll',
    'iwould': 'id',
    'youwould': 'youd',
    'hewould': 'hed',
    'shewould': 'shed',
    'wewould': 'wed',
    'theywould': 'theyd',
    'letus': 'lets',
    'whatis': 'whats',
    'thatis': 'thats',
    'howis': 'hows',
    'whereis': 'wheres',
    'whenis': 'whens',
    'whyis': 'whys'
  };

  // Función para normalizar texto
  function normalizeText(text) {
    // Paso 1: Convertir a minúsculas y normalizar apóstrofes
    let normalized = text.toLowerCase()
      .replace(/['´']/g, "'");

    // Paso 2: Manejar contracciones existentes
    normalized = normalized.replace(/(\w+)'(\w+)/g, '$1$2');

    // Paso 3: Eliminar caracteres especiales y espacios extras, pero mantener el espacio después del punto
    normalized = normalized
      .replace(/[^\w\s.]/g, '') // Eliminar caracteres especiales, pero mantener letras, espacios y puntos
      .replace(/\s+/g, ' ') // Reducir múltiples espacios a uno solo
      .replace(/\.\s*/g, '. ') // Asegurar un espacio después del punto
      .trim();

    // Paso 4: Procesar formas expandidas
    const words = normalized.split(' ');
    const processedWords = words.map(word => {
      // Buscar pares de palabras que podrían formar una contracción
      if (words.indexOf(word) < words.length - 1) {
        const twoWords = word + words[words.indexOf(word) + 1];
        const contractionForm = contractionMap[twoWords];
        if (contractionForm) {
          words[words.indexOf(word) + 1] = ''; // Marcar la segunda palabra para eliminar
          return contractionForm;
        }
      }
      return word;
    });

    // Paso 5: Unir y limpiar
    return processedWords
      .filter(word => word !== '')
      .join(' ')
      .trim();
  }

  function animarEspectro() {
    if (!estaReproduciendo) {
      barrasEspectro.forEach((barra) => {
        barra.style.height = "0%";
      });
      return;
    }

    analizador.getByteFrequencyData(datosFrec);

    barrasEspectro.forEach((barra, indice) => {
      const valor = datosFrec[indice];
      const altura = (valor / 255) * 100;
      barra.style.height = `${altura}%`;
    });

    requestAnimationFrame(animarEspectro);
  }

  function playAudio() {
    const originalAudio = contenedor.querySelector(`#audio_${indexActual + 1}`);

    if (!originalAudio) {
      console.error("Audio element not found.");
      return;
    }

    const clonedAudio = originalAudio.cloneNode(true);

    clonedAudio.addEventListener('ended', () => {
      estaReproduciendo = false;
      animarEspectro();
    });

    const sourceNode = audioContext.createMediaElementSource(clonedAudio);
    sourceNode.connect(analizador);
    analizador.connect(audioContext.destination);

    clonedAudio.play();
    estaReproduciendo = true;
    animarEspectro();
  }

  contenedor.querySelector('#listen-button').addEventListener('click', playAudio);

  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  const recognition = new SpeechRecognition();
  recognition.lang = 'en-GB';

  recognition.onresult = function (event) {
    const palabras_dichas = event.results[0][0].transcript;
    const frase_objetivo = frases[indexActual];

    // Normalizar ambos textos usando la función mejorada
    const palabras_dichasNormalized = normalizeText(palabras_dichas);
    const fraseObjetivoNormalized = normalizeText(frase_objetivo);

    // Dividir en palabras, ignorando los puntos
    const palabras_dichasArray = palabras_dichasNormalized.split(' ').filter(word => word !== '.');
    const targetWords = fraseObjetivoNormalized.split(' ').filter(word => word !== '.');

    const palabra = contenedor.querySelector('#palabra');
    let correcto = true;

    // Resaltar todas las palabras que coincidan, independientemente de su posición
    targetWords.forEach((palabraEncontrada, index) => {
      const spanPalabra = palabra.childNodes[index];
      if (palabras_dichasArray.includes(palabraEncontrada)) {
        spanPalabra.style.backgroundColor = '#4caf50'; // Verde si la palabra está en lo dicho
        spanPalabra.style.color = '#fff';
      } else {
        spanPalabra.style.backgroundColor = '#c53429fb'; // Rojo si la palabra no está en lo dicho
        spanPalabra.style.color = '#fff';
        correcto = false;
      }
    });

    // Mostrar el texto original hablado
    contenedor.querySelector('#palabras_dichas').textContent = `You said: ${palabras_dichas}`;
    contenedor.querySelector('#palabras_dichas').style.display = 'block';

    if (correcto) {
      contenedor.querySelector('#resultados').textContent = 'You said it correctly!';
      contenedor.querySelector('#resultados').style.display = 'block';
      contenedor.querySelector('#resultados').style.color = '#255541';
      contenedor.querySelector('#resultados').style.border = '2px solid #255541';
      contenedor.querySelector('#resultados').style.background = '#bbd9a0';
      contenedor.querySelector('#resultados').style.margin = 'auto';
    } else {
      contenedor.querySelector('#resultados').textContent = 'Some words were incorrect. Try again!';
      contenedor.querySelector('#resultados').style.display = 'block';
      contenedor.querySelector('#resultados').style.background = '#c53429fb';
      contenedor.querySelector('#resultados').style.color = ' #fff';
      contenedor.querySelector('#resultados').style.border = '2px rgb(107, 6, 6) solid';
      contenedor.querySelector('#resultados').style.margin = 'auto';
    }
  };

  recognition.onerror = function (event) {
    contenedor.querySelector('#resultados').textContent = `Recognition error: ${event.error}`;
  };

  contenedor.querySelector('#start-button').addEventListener('click', () => {
    recognition.start();
  });

  contenedor.querySelector('#next-button').addEventListener('click', () => {
    contenedor.querySelector('#palabras_dichas').style.display = 'none';
    contenedor.querySelector('#resultados').style.display = 'none';
    indexActual = (indexActual + 1) % frases.length;
    actualizarFrase();
  });

  contenedor.querySelector('#back-button').addEventListener('click', () => {
    indexActual = (indexActual - 1 + frases.length) % frases.length;
    actualizarFrase();
    contenedor.querySelector('#palabras_dichas').style.display = 'none';
    contenedor.querySelector('#resultados').style.display = 'none';
  });

  actualizarFrase();
}