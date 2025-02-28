export function acordeon(contenedor, secciones) {
    const css = document.createElement('link');
    css.rel = 'stylesheet';
    css.type = 'text/css';
    css.href = 'PLUGINS/ACCORDION/accordion.css';
    document.head.appendChild(css);

    // Establecer el contenido HTML inicial del contenedor principal
    contenedor.innerHTML = `<div id="contenedor-acordeon"></div>`;

    // Generar dinámicamente las secciones del acordeón
    const contenedorPrincipal = document.getElementById('contenedor-acordeon');
    secciones.forEach(seccion => {
        const elementoAcordeon = document.createElement('div');
        elementoAcordeon.classList.add('acordeon');

        const encabezado = document.createElement('button');
        encabezado.classList.add('encabezado-acordeon');
        encabezado.textContent = seccion.titulo;

        const contenido = document.createElement('div');
        contenido.classList.add('en-linea', 'contenido-acordeon');

        // Validar si hay una imagen antes de agregarla
        if (seccion.imagen) {
            const imagen = document.createElement('img');
            imagen.classList.add('cuadrada');  // Mantén esta clase
            imagen.src = seccion.imagen;
            contenido.appendChild(imagen);
        }

        // Crear un contenedor para el texto dentro de la sección
        const contenedorTexto = document.createElement('div');
        contenedorTexto.classList.add('contenido-texto');
        if (!seccion.imagen) {
            contenedorTexto.style.width = '90%';
        }

        // Iterar sobre los elementos del contenido
        seccion.contenido.forEach(parrafo => {
            if (parrafo.lista) { // Verificar si es una lista
                const lista = document.createElement(parrafo.listaTipo === 'ordenada' ? 'ol' : 'ul');
                parrafo.lista.forEach(item => {
                    const li = document.createElement('li');
                    li.innerHTML = item;  // Usamos innerHTML para permitir que se interprete el HTML dentro del li
                    lista.appendChild(li);
                });
                contenedorTexto.appendChild(lista);
            } else {
                const p = document.createElement('p');
                p.innerHTML = `<span class="resaltado">${parrafo.titulo}</span> ${parrafo.descripcion}`;
                contenedorTexto.appendChild(p);
                
                // Acceder al 'span' dentro del párrafo y aplicar el estilo si el título es "Sabías que..."
                if (parrafo.titulo === 'Sabias que...') {
                    p.style.display = 'block';
                    const span = p.querySelector('span.resaltado'); // Buscar el <span> dentro del párrafo
                    if (span) {
                        span.style.color = '#ffffff';  // Aplicar el color blanco al span
                    }
                    p.classList.add('caja-informacion');  // Agregar la clase 'caja-informacion'
                }
            }
        });
        
        

        // Agregar el contenedor de texto al contenido del acordeón
        contenido.appendChild(contenedorTexto);

        // Agregar el encabezado y el contenido al elemento del acordeón
        elementoAcordeon.appendChild(encabezado);
        elementoAcordeon.appendChild(contenido);

        // Agregar el elemento del acordeón al contenedor principal
        contenedorPrincipal.appendChild(elementoAcordeon);
    });

    // Lógica del acordeón para manejar la apertura y cierre de secciones
    let abiertoActual = null;
    const encabezadosAcordeon = document.querySelectorAll('.encabezado-acordeon');

    encabezadosAcordeon.forEach(encabezado => {
        encabezado.addEventListener('click', function () {
            if (abiertoActual && abiertoActual !== this) {
                abiertoActual.classList.remove('activo');
                abiertoActual.nextElementSibling.style.maxHeight = null;
            }

            this.classList.toggle('activo');
            const contenido = this.nextElementSibling;

            if (contenido.style.maxHeight) {
                contenido.style.maxHeight = null;
                abiertoActual = null;
            } else {
                contenido.style.maxHeight = contenido.scrollHeight + 'px';
                abiertoActual = this;
            }
        });
    });

}
