export function desplegableSabiasQue(container, datos) {
    if (document.querySelector('.css')) {
        document.querySelector('.css').remove();
    }
    const css = document.createElement('link');
    css.rel = 'stylesheet';
    css.className = 'css';
    css.type = 'text/css';
    css.href = 'PLUGINS/DESPLEGABLE/SABIASQUE/sabiasque.css';
    document.head.appendChild(css);

    // Generar el contenido dinámicamente a partir de los datos
    const contenidoHTML = `
    <div class="main">
        <h2 id="Titulo"><span>${datos[0].titulo}</span></h2>
        <div id="desplegable1">
            ${datos.map(dato => {
        switch (dato.tipo) {
            case "parrafo":
                return `<p class="parrafo">${dato.contenido}</p>`;
            case "lista":
                if (dato.estilo === 'ordenada') {
                    // Crear una lista desordenada usando los elementos proporcionados
                    return `<ol class="lista">${dato.contenido.map(item => `<li>${item}</li>`).join('')}</ol>`;
                }
                else if (dato.estilo === 'desordenada') {
                    // Crear una lista desordenada usando los elementos proporcionados
                    return `<ul>${dato.contenido.map(item => `<li>${item}</li>`).join('')}</ul>`;
                }
                else {
                    return `<p class="parrafo">[Contenido mal declarado]</p>`;
                }
            case "texto-imagen":
                // Texto acompañado de una imagen
                return `
                            <div class="texto-imagen">
                            <img src="${dato.imagen}" alt="${dato.alt || 'Imagen relacionada'}" />
                            <p>${dato.texto}</p>
                            </div>
                        `;
            case "gif":
                // Representación de un GIF
                return `
                            <div class="gif">
                                <img src="${dato.url}" alt="${dato.alt || 'GIF'}" />
                            </div>
                        `;
            case "video":
                // Insertar un video con controles
                return `
                            <div class="video">
                                <video controls>
                                    <source src="${dato.url}" type="${dato.tipoVideo || 'video/mp4'}">
                                    Tu navegador no soporta la reproducción de este video.
                                </video>
                            </div>
                        `;
            default:
                // Tipo desconocido
                return `<p class="parrafo">[Contenido mal declarado]</p>`;
        }
    }).join('')}
        </div>
    </div>
`;


    container.innerHTML = contenidoHTML;

    // Función para desplegar/contraer contenido
    function desplegar(id) {
        const contenedor = document.getElementById(id);
        if (contenedor.style.maxHeight === '0px' || contenedor.style.maxHeight === '') {
            contenedor.style.maxHeight = contenedor.scrollHeight + 'px';
            contenedor.style.opacity = 1;
            setTimeout(function () {
                const yOffset = -10;
                const y = contenedor.getBoundingClientRect().top + window.pageYOffset + yOffset;
                window.scrollTo({ top: y, behavior: 'smooth' });
            }, 300);
        } else {
            contenedor.style.maxHeight = '0px';
            contenedor.style.opacity = 0;
        }
    }

    // Añadir el evento al título
    const titulo = document.getElementById('Titulo');
    titulo.addEventListener('click', function () {
        desplegar('desplegable1');
    });
}
