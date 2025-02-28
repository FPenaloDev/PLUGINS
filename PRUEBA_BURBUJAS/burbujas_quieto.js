export function inicializarBurbujasFlotantes(contenedor) {
    let burbujaSeleccionada = null;
    let panelInfo = null;
    let burbujasInfo = [];
    let animacionActiva = true;
    
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
    
    contenedor.style.cssText = `
        display: flex;
        flex-direction: row-reverse;
        justify-content: space-between;
        max-width: 100%;
        height: 50vh;
        background-color: #87CEEB;
        border: 10px solid #4682B4;
        border-radius: 20px;
        overflow: hidden;
    `;
    
    const tablaBurbujas = document.createElement('div');
    tablaBurbujas.style.cssText = `
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: 10px;
        padding: 10px;
        width: 50%;
    `;
    
    contenedor.appendChild(tablaBurbujas);
    
    lenguajes.forEach((lenguaje, index) => {
        const burbuja = crearBurbuja(lenguaje);
        tablaBurbujas.appendChild(burbuja);
        burbujasInfo.push({
            burbuja,
            velocidadX: (Math.random() - 0.5) * 4,
            velocidadY: (Math.random() - 0.5) * 4
        });
    });
    
    iniciarAnimacion();
    
    function crearBurbuja(lenguaje) {
        const burbuja = document.createElement('div');
        burbuja.className = 'burbuja';
        burbuja.dataset.id = lenguaje.id;
        burbuja.style.cssText = `
            width: 80px;
            height: 80px;
            background-color: rgba(255, 255, 255, 0.8);
            border-radius: 50%;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            box-shadow: 0 0 10px rgba(255, 255, 255, 0.5);
            transition: transform 0.5s ease;
        `;
        
        const img = document.createElement('img');
        img.src = lenguaje.logo;
        img.alt = lenguaje.nombre;
        img.style.cssText = 'width: 50px; height: 50px; border-radius: 50%;';
        
        burbuja.appendChild(img);
        burbuja.addEventListener('click', () => mostrarInformacion(lenguaje, burbuja));
        return burbuja;
    }
    
    function mostrarInformacion(lenguaje, burbuja) {
        animacionActiva = false;
        if (panelInfo) {
            panelInfo.remove();
        }
        panelInfo = document.createElement('div');
        panelInfo.className = 'panel-info';
        panelInfo.style.cssText = `
            position: absolute;
            left: 10px;
            top: 50%;
            transform: translateY(-50%);
            width: 40%;
            padding: 16px;
            background-color: white;
            border-radius: 8px;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
            animation: slideIn 0.5s ease-in-out;
        `;
        panelInfo.innerHTML = `<strong>${lenguaje.nombre}</strong><br>${lenguaje.descripcion}`;
        contenedor.appendChild(panelInfo);
        
        burbuja.style.transform = 'translateY(-50px)';
    }
    
    function iniciarAnimacion() {
        function animar() {
            if (!animacionActiva) return;
            requestAnimationFrame(animar);
        }
        requestAnimationFrame(animar);
    }
}
