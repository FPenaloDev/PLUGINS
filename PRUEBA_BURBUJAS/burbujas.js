export function inicializarBurbujasUnificadas(contenedor) {
    const css = document.createElement('link');
    css.href = 'PLUGINS/PRUEBA_BURBUJAS/burbujas.css';
    css.rel = 'stylesheet';
    document.head.appendChild(css);

    let burbujasInfo = [];
    let animacionActiva = true;
    let posicionesGrid = [];
    let dimensionesBurbuja = { width: 80, height: 80 };

    const lenguajes = [
        { id: 1, nombre: 'JavaScript', descripcion: 'Lenguaje de programación para desarrollo web y aplicaciones interactivas.', logo: 'https://upload.wikimedia.org/wikipedia/commons/6/6a/JavaScript-logo.png' },
        { id: 2, nombre: 'Python', descripcion: 'Lenguaje versátil y fácil de leer, usado en ciencia de datos, IA y desarrollo web.', logo: 'https://upload.wikimedia.org/wikipedia/commons/c/c3/Python-logo-notext.svg' },
        { id: 3, nombre: 'Java', descripcion: 'Lenguaje de propósito general, ampliamente usado en desarrollo empresarial y móvil.', logo: 'https://upload.wikimedia.org/wikipedia/en/3/30/Java_programming_language_logo.svg' },
        { id: 4, nombre: 'C++', descripcion: 'Lenguaje de alto rendimiento usado en sistemas embebidos, juegos y aplicaciones de alto nivel.', logo: 'https://upload.wikimedia.org/wikipedia/commons/1/18/C_Programming_Language.svg' },
        { id: 5, nombre: 'Ruby', descripcion: 'Lenguaje interpretado enfocado en simplicidad y productividad, usado en desarrollo web.', logo: 'https://upload.wikimedia.org/wikipedia/commons/7/73/Ruby_logo.svg' },
        { id: 6, nombre: 'Go', descripcion: 'Lenguaje moderno desarrollado por Google, eficiente y concurrente.', logo: 'https://upload.wikimedia.org/wikipedia/commons/0/05/Go_Logo_Blue.svg' },
        { id: 7, nombre: 'Swift', descripcion: 'Lenguaje de Apple para el desarrollo de aplicaciones iOS y macOS.', logo: 'https://upload.wikimedia.org/wikipedia/commons/9/9d/Swift_logo.svg' },
        { id: 8, nombre: 'PHP', descripcion: 'Lenguaje de servidor popular en desarrollo web dinámico.', logo: 'https://upload.wikimedia.org/wikipedia/commons/2/27/PHP-logo.svg' }
    ];

    // Configuración del contenedor principal con mejor responsive
    const divBurbujas = document.createElement('div');
    divBurbujas.className = 'divBurbujas';
    contenedor.appendChild(divBurbujas);

    // Panel de información
    const panelInfo = document.createElement('div');
    panelInfo.className = 'panelInfo';
    contenedor.appendChild(panelInfo);

    // Tabla para las burbujas ordenadas
    const tablaBurbujas = document.createElement('div');
    tablaBurbujas.className = 'tablaBurbujas';
    contenedor.appendChild(tablaBurbujas);

    // Botón de animación
    const botonAnimar = document.createElement('button');
    botonAnimar.innerText = 'Animar';
    botonAnimar.className = 'botonAnimar';

    botonAnimar.onmouseover = () => {
        if (botonAnimar.style.opacity !== '0') {
            botonAnimar.style.transform = 'translateX(-50%) scale(1.05)';
            botonAnimar.style.boxShadow = '0 6px 20px rgba(0, 0, 0, 0.3)';
        }
    };
    botonAnimar.onmouseout = () => {
        if (botonAnimar.style.opacity !== '0') {
            botonAnimar.style.transform = 'translateX(-50%) scale(0.95)';
            botonAnimar.style.boxShadow = '0 4px 15px rgba(0, 0, 0, 0.2)';
        }
    };
    contenedor.appendChild(botonAnimar);

    // Función para calcular dimensiones responsivas
    function calcularDimensionesResponsivas() {
        const anchoContenedor = divBurbujas.clientWidth;
        const altoContenedor = divBurbujas.clientHeight;

        // Ajustar tamaño de burbujas según el tamaño del contenedor
        dimensionesBurbuja.width = Math.min(80, anchoContenedor * 0.15);
        dimensionesBurbuja.height = dimensionesBurbuja.width;

        return {
            esMobile: anchoContenedor < 768,
            columnas: anchoContenedor < 768 ? 2 : 3,
            espaciado: anchoContenedor < 768 ? 10 : 20
        };
    }

    // Función mejorada para calcular posiciones de la cuadrícula
    function calcularPosicionesGrid() {
        const { esMobile, columnas, espaciado } = calcularDimensionesResponsivas();
        const contenedorRect = divBurbujas.getBoundingClientRect();
        const filas = Math.ceil(lenguajes.length / columnas);

        // Calcular el ancho total disponible para la tabla
        const anchoDisponible = esMobile ?
            contenedorRect.width - espaciado * 2 :
            contenedorRect.width * 0.5;

        // Actualizar estilo de la tabla
        tablaBurbujas.style.gridTemplateColumns = `repeat(${columnas}, 1fr)`;
        tablaBurbujas.style.width = esMobile ? '65%' : '60%';
        tablaBurbujas.style.right = esMobile ? '5%' : '20px';

        // Calcular posiciones
        posicionesGrid = [];
        const anchoColumna = (anchoDisponible - (espaciado * (columnas + 1))) / columnas;

        for (let i = 0; i < lenguajes.length; i++) {
            const fila = Math.floor(i / columnas);
            const columna = i % columnas;

            posicionesGrid.push({
                x: contenedorRect.width - anchoDisponible + (columna * (anchoColumna + espaciado)) + espaciado + 70,
                y: (contenedorRect.height - (filas * (dimensionesBurbuja.height + espaciado))) / 2 +
                    (fila * (dimensionesBurbuja.height + espaciado))
            });
        }
    }

    // Función mejorada para crear burbujas
    function crearBurbuja(lenguaje, index) {
        const burbuja = document.createElement('div');
        burbuja.className = 'burbuja';
        burbuja.dataset.id = lenguaje.id;

        const posicionInicial = {
            x: Math.random() * (divBurbujas.clientWidth - dimensionesBurbuja.width),
            y: Math.random() * (divBurbujas.clientHeight - dimensionesBurbuja.height)
        };

        burbuja.style.cssText = `
            position: absolute;
            width: ${dimensionesBurbuja.width}px;
            height: ${dimensionesBurbuja.height}px;
            background-color: rgba(255, 255, 255, 0.95);
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
            transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
            left: ${posicionInicial.x}px;
            top: ${posicionInicial.y}px;
            z-index: 1;
            transform: scale(1);
        `;

        const img = document.createElement('img');
        img.src = lenguaje.logo;
        img.alt = lenguaje.nombre;
        img.style.cssText = `
            width: ${dimensionesBurbuja.width * 0.6}px;
            height: ${dimensionesBurbuja.height * 0.6}px;
            pointer-events: none;
            transition: transform 0.3s ease;
        `;
        burbuja.appendChild(img);
        divBurbujas.appendChild(burbuja);

        // Efectos hover mejorados
        burbuja.addEventListener('mouseenter', () => {
            if (animacionActiva) {
                burbuja.style.transform = 'scale(1.1)';
                burbuja.style.boxShadow = '0 8px 16px rgba(0, 0, 0, 0.3)';
                img.style.transform = 'scale(1.1)';
            }
        });

        burbuja.addEventListener('mouseleave', () => {
            if (animacionActiva) {
                burbuja.style.transform = 'scale(1)';
                burbuja.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.2)';
                img.style.transform = 'scale(1)';
            }
        });

        burbuja.addEventListener('click', () => {
            if (animacionActiva) {
                ordenarBurbujas(lenguaje, burbuja);
            }
            burbuja.classList.add('burbuja-titulo');
        });

        return {
            elemento: burbuja,
            x: posicionInicial.x,
            y: posicionInicial.y,
            velocidadX: (Math.random() - 0.5) * 2,
            velocidadY: (Math.random() - 0.5) * 2,
            posicionGrid: index
        };
    }

    // Función mejorada para ordenar burbujas
    function ordenarBurbujas(lenguaje, burbujaClickeada) {
        animacionActiva = false;
        calcularPosicionesGrid();

        // Mostrar información con animación mejorada
        panelInfo.innerHTML = `
            <h3 style="margin: 0 0 10px 0; color: #4682B4; font-size: 1.2em">${lenguaje.nombre}</h3>
            <p style="margin: auto; line-height: 1.6; color: #333">${lenguaje.descripcion}</p>
        `;
        panelInfo.style.opacity = '1';
        panelInfo.style.transform = 'translate(-50%, -50%) scale(1)';
        panelInfo.style.pointerEvents = 'auto';

        // Mover burbujas con timing mejorado
        burbujasInfo.forEach((info, index) => {
            const posicion = posicionesGrid[index];
            const delay = index * 50; // Efecto cascada

            info.elemento.style.transition = `all 0.8s cubic-bezier(0.4, 0, 0.2, 1) ${delay}ms`;
            info.elemento.style.left = `${posicion.x}px`;
            info.elemento.style.top = `${posicion.y}px`;
            info.x = posicion.x;
            info.y = posicion.y;
        });

        // Mostrar botón con delay
        setTimeout(() => {
            botonAnimar.style.opacity = '1';
            botonAnimar.style.pointerEvents = 'auto';
            botonAnimar.style.transform = 'translateX(-50%) scale(0.95)';
        }, 800 + (burbujasInfo.length * 50));
    }

    // Función mejorada para reiniciar animación
    botonAnimar.addEventListener('click', () => {
        animacionActiva = true;
        document.querySelectorAll('.burbuja-titulo').forEach(burbuja => {
            burbuja.classList.remove('burbuja-titulo');
        });
        // Ocultar elementos UI
        panelInfo.style.opacity = '0';
        panelInfo.style.transform = 'translate(-50%, -50%) scale(0.9)';
        panelInfo.style.pointerEvents = 'none';
        botonAnimar.style.opacity = '0';
        botonAnimar.style.pointerEvents = 'none';

        // Distribuir burbujas aleatoriamente con efecto cascada
        burbujasInfo.forEach((info, index) => {
            setTimeout(() => {
                info.x = Math.random() * (divBurbujas.clientWidth - dimensionesBurbuja.width);
                info.y = Math.random() * (divBurbujas.clientHeight - dimensionesBurbuja.height);
                info.velocidadX = (Math.random() - 0.5) * 2;
                info.velocidadY = (Math.random() - 0.5) * 2;
                info.elemento.style.transition = 'none';
                info.elemento.style.left = `${info.x}px`;
                info.elemento.style.top = `${info.y}px`;
            }, index * 50);
        });

        setTimeout(() => {
            iniciarAnimacion();
        }, burbujasInfo.length * 50);
    });

    // Crear y añadir burbujas
    lenguajes.forEach((lenguaje, index) => {
        const burbujaInfo = crearBurbuja(lenguaje, index);
        burbujasInfo.push(burbujaInfo);
    });

    // Función de animación mejorada con física más suave
    function iniciarAnimacion() {
        let ultimoTiempo = 0;
        const VELOCIDAD_MAX = 3;
        function animar(tiempoActual) {
            if (!animacionActiva) return;

            const deltaTime = (tiempoActual - ultimoTiempo) / 16; // Normalizar a ~60fps
            ultimoTiempo = tiempoActual;

            const limitesDivBurbujas = divBurbujas.getBoundingClientRect();

            burbujasInfo.forEach(info => {
                // Actualizar posición con deltaTime
                info.x += info.velocidadX * deltaTime;
                info.y += info.velocidadY * deltaTime;

                // Mejorar rebotes en los bordes usando los límites de divBurbujas
                if (info.x <= 0) {
                    info.velocidadX *= -1;
                    info.x = 0;
                } else if (info.x >= divBurbujas.clientWidth - dimensionesBurbuja.width) {
                    info.velocidadX *= -1;
                    info.x = divBurbujas.clientWidth - dimensionesBurbuja.width;
                }

                if (info.y <= 0) {
                    info.velocidadY *= -1;
                    info.y = 0;
                } else if (info.y >= divBurbujas.clientHeight - dimensionesBurbuja.height) {
                    info.velocidadY *= -1;
                    info.y = divBurbujas.clientHeight - dimensionesBurbuja.height;
                }

                // Limitar velocidad máxima
                info.velocidadX = Math.max(Math.min(info.velocidadX, VELOCIDAD_MAX), -VELOCIDAD_MAX);
                info.velocidadY = Math.max(Math.min(info.velocidadY, VELOCIDAD_MAX), -VELOCIDAD_MAX);

                // Aplicar posición
                info.elemento.style.left = `${info.x}px`;
                info.elemento.style.top = `${info.y}px`;
            });

            requestAnimationFrame(animar);
        }

        requestAnimationFrame(animar);
    }

    // Iniciar animación
    iniciarAnimacion();

    // Mejorar manejo de cambios de tamaño
    let temporizadorResize;
    window.addEventListener('resize', () => {
        clearTimeout(temporizadorResize);
        temporizadorResize = setTimeout(() => {
            calcularDimensionesResponsivas();
            if (!animacionActiva) {
                calcularPosicionesGrid();
                burbujasInfo.forEach((info, index) => {
                    const posicion = posicionesGrid[index];
                    info.x = posicion.x;
                    info.y = posicion.y;
                    info.elemento.style.left = `${posicion.x}px`;
                    info.elemento.style.top = `${posicion.y}px`;
                });
            }
        }, 100);
    });

    // Llamada inicial para configurar dimensiones
    calcularDimensionesResponsivas();
}

// Para usar el código:
// const contenedor = document.getElementById('contenedor');
// inicializarBurbujasUnificadas(contenedor);