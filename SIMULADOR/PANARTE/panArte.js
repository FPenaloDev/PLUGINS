import { evaluarPuntuacion } from './puntuacionPanArte.js';
if (document.getElementById('css')) {
    document.getElementById('css').remove();
  }
const panArteCss = document.createElement('link');
panArteCss.rel = 'stylesheet';
panArteCss.id = 'css';
panArteCss.type = 'text/css';
panArteCss.href = 'PLUGINS/SIMULADOR/PANARTE/panArte.css';
document.head.appendChild(panArteCss);

export function panArte(contenedor, secciones) {
    let presupuesto = 1000;
    let situacionActual = 0;
    let elecciones = [];
    let opcionSeleccionada = null;

    function actualizarPresupuesto(cantidad) {
        presupuesto -= cantidad;
        document.querySelector('#presupuesto p').innerHTML = `<p>Presupuesto: €${presupuesto}</p>`;
    }



    function hacerEleccion(opcion, costo) {
        opcionSeleccionada = opcion;
        document.querySelectorAll('.opciones button').forEach(btn => {
            btn.style.opacity = btn.onclick.toString().includes(opcion) ? 1 : 0.5;
        });
        const imagen = document.getE
        document.getElementById('siguiente-button').style.display = 'block';
    }

    function siguienteSituacion() {
        if (opcionSeleccionada !== null) {
            const situacionActualData = secciones[situacionActual].contenidos[0];
            const opcionElegida = situacionActualData.opciones.find(opt => opt.opcion === opcionSeleccionada);
            if (opcionElegida && opcionElegida.costo) {
                actualizarPresupuesto(opcionElegida.costo);
            }
            elecciones.push(opcionSeleccionada);
            mostrarResultado();
            opcionSeleccionada = null;
            situacionActual++;
            if (situacionActual < secciones.length) {
                setTimeout(mostrarSituacion, 3500);
            } else {
                setTimeout(mostrarResultadoFinal, 3500);
            }
        }
    }

    function mostrarResultado() {
        const situacionActualData = secciones[situacionActual].contenidos[0];
        if (situacionActualData.resultados && situacionActualData.resultados[opcionSeleccionada]) {
            document.getElementById('resultado').innerText = situacionActualData.resultados[opcionSeleccionada];
        }
    }
    async function cargarIcono(icono) {
        try {
            const ruta = icono;
            const response = await fetch(ruta);
            return await response.text();
        } catch (error) {
            console.error('Error cargando el icono:', error);
            return ''; // Devolver cadena vacía en caso de error
        }

    }
    const svgOpcion = cargarIcono('./PLUGINS/SIMULADOR/PANARTE/RECURSOS/ICONOS/icono-opcion.svg');
    const svgDinero = cargarIcono('./PLUGINS/SIMULADOR/PANARTE/RECURSOS/ICONOS/icono-dinero.svg');

    async function mostrarSituacion() {
        const situacionData = secciones[situacionActual].contenidos[0];
        const iconoOpcion = await svgOpcion;
        const iconoDinero = await svgDinero;

        // Crear el elemento popup una sola vez
        const popup = document.createElement('div');
        popup.className = 'popup-info';
        popup.style.display = 'none';
        document.body.appendChild(popup);

        // Modificar el SVG para cada opción y guardar los resultados
        const svgsModificados = situacionData.opciones.map(opcion => {
            const parser = new DOMParser();
            const svgDoc = parser.parseFromString(iconoOpcion, 'image/svg+xml');
            const texto = svgDoc.createElementNS("http://www.w3.org/2000/svg", "text");
            texto.setAttribute("x", "220");
            texto.setAttribute("y", "400");
            texto.setAttribute("font-family", "Poppins");
            texto.setAttribute("font-size", "150");
            texto.setAttribute("fill", "#000");
            texto.setAttribute("text-anchor", "middle");
            texto.setAttribute("dominant-baseline", "middle");

            texto.textContent = opcion.opcion;

            svgDoc.documentElement.appendChild(texto);
            return svgDoc.documentElement.outerHTML;
        });

        let html = `
        <div class="${situacionActual === 0 ? 'intro' : 'situacion'}">
            <div class="${situacionActual === 0 ? 'intro-texto' : 'situacion-texto'}">
                                <div id="presupuesto">
                        <div class="icono-dinero">${iconoDinero}</div>
                        <p>Presupuesto: €${presupuesto}</p>
                    </div>
                <p class="enunciado-escena">${situacionData.descripcion}</p>
                <div class="opciones">
                    ${situacionData.opciones.map((opcion, index) =>
            `<button class="opcion" 
                            onclick="window.hacerEleccion('${opcion.opcion}', ${opcion.costo || 0})"
                            data-info="${opcion.texto}">
                            <div class="icono-opcion">${svgsModificados[index]}</div>
                            ${opcion.costo ? ` €${opcion.costo}` : ''}
                        </button>`
        ).join('')}
                </div>

            <div class="siguiente-button" id="siguiente-button">


                <button class="siguiente" onclick="${situacionActual === 0 ? 'window.iniciarJuego()' : 'window.siguienteSituacion()'}">
                    ${situacionActual === 0 ? 'Comenzar' : 'Continuar'}
                </button>
            </div>
        </div>

        `;

        // Inyectar en el contenedor
        contenedor.innerHTML = `
            <div id="simulador">
                <div id="toldo">
                    <h1 class="toldo-superior">PanArte - Gestión de Panadería</h1>
                    <div class="decorado">
                        <div class="toldo-principio"></div>
                        ${'<div class="toldo"></div>'.repeat(2)}
                        <div class="toldo-final"></div>
                    </div>
                    <div class="situacion-imagen">
                        <img src="https://i.postimg.cc/7Pc98zNZ/izq.png" alt="Situación ${situacionActual}">
                    </div>
                    <h2 class="titulo-escena">${situacionData.titulo}</h2>
                </div>
                ${html}
                <div id="resultado"></div>
            </div>
        `;
        // Agregar los event listeners después de que el contenido se haya insertado
        setTimeout(() => {
            const botones = document.querySelectorAll('.opcion');

            botones.forEach(boton => {
                boton.addEventListener('mouseover', (e) => {
                    const info = e.target.getAttribute('data-info');
                    popup.innerHTML = `<p>${info}</p>`;
                    popup.style.fontFamily = 'Poppins';
                        popup.style.display = 'block';


                    // Obtener la posición del botón
                    const rect = boton.getBoundingClientRect();
                    
                    // Posicionar el popup debajo del botón
                    popup.style.left = (rect.left + window.scrollX - 200) + 'px';
                    popup.style.top = (rect.bottom + window.scrollY + 10) + 'px';

                    popup.style.opacity = '1';
                    
                });

                boton.addEventListener('mouseout', () => {
                    popup.style.display = 'none';

                });

                // Eliminar el evento mousemove ya que no es necesario
            });
        }, 0);
    }



    function mostrarResultadoFinal() {
        let totalGastado = 1000 - presupuesto;

        // Evaluar las elecciones del usuario
        const resultado = evaluarPuntuacion(elecciones);

        // Definir el color del texto según el resultado
        const colorEstilo = {
            'rojo': '#FF0000',
            'verde': '#008000',
            'azul': '#0000FF'
        };

        contenedor.innerHTML = `
            <div class="situacion">
                <div class="situacion-texto">
                    <h2>Resultado Final</h2>
                    <p style="color: ${colorEstilo[resultado.color]}">${resultado.feedback}</p>
                    <p>Presupuesto final: €${presupuesto}</p>
                    <p>Total gastado: €${totalGastado}</p>
                    </div>
                    <div class="situacion-imagen">
                    <img src="https://i.postimg.cc/7Pc98zNZ/izq.png" alt="Resultado final">
                    <p class="div_puntuacion" style="border:2px solid ${colorEstilo[resultado.color]};color: ${colorEstilo[resultado.color]}"><strong>Puntuación ${resultado.puntuacion}/100</strong></p>
                </div>
            </div>
        `;
    }

    // Exponer funciones necesarias globalmente
    window.iniciarJuego = iniciarJuego;
    window.hacerEleccion = hacerEleccion;
    window.siguienteSituacion = siguienteSituacion;

    // Iniciar el juego
    mostrarSituacion();
    function iniciarJuego() {
        situacionActual = 1;
        document.getElementById('presupuesto').style.display = 'block';
        mostrarSituacion();
    }
}