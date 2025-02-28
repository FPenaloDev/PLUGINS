export function iniciarAnimacionCarga(divObjetivo) {
    // Ejecutar la función inicial con opacidad 0
    const estilo = document.createElement('link');
    estilo.rel = 'stylesheet';
    estilo.type = 'text/css';
    estilo.href = 'PLUGINS/INICIARANIMACION/iniciarAnimacion.css';
    document.head.appendChild(estilo);
    // Crear contenedor principal para la animación
    const animacionCarga = document.createElement('div');
    animacionCarga.className = 'div-contador';
    divObjetivo.insertBefore(animacionCarga,divObjetivo.firstChild);

    // Crear contenedor del círculo y el texto
    const contenedor = document.createElement('div');
    contenedor.style.position = 'relative';
    contenedor.style.width = '100%';
    contenedor.style.height = '100%';
    animacionCarga.appendChild(contenedor);

    // Crear círculo giratorio
    const circuloCarga = document.createElement('div');
    circuloCarga.className = 'circulo-carga';
    contenedor.appendChild(circuloCarga);

    // Crear texto para los números
    const textoCarga = document.createElement('div');
    textoCarga.className = 'texto-carga';
    textoCarga.innerHTML = `<p><span class="contador">Cargando</span></p>`;
    contenedor.appendChild(textoCarga);

    // Lógica para la cuenta regresiva
    let puntos = '.';
    let cuenta = 1;

    const intervalo = setInterval(() => {
        let pTextoCarga = document.querySelector('.texto-carga p');
        pTextoCarga.textContent += puntos;
        cuenta--;

        if (cuenta < 0) {
            clearInterval(intervalo);
            animacionCarga.style.display = 'none';
        }
    }, 1000);
}