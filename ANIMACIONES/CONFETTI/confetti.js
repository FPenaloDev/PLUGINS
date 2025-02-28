export function cargarConfeti(callback) {
    if (!document.querySelector('script[src*="confetti"]')) {
        const script = document.createElement('script');
        script.src = "https://cdn.jsdelivr.net/npm/canvas-confetti@1.5.1/dist/confetti.browser.min.js";
        script.onload = () => {
            if (callback) callback();
        };
        document.head.appendChild(script);
    } else if (callback) {
        callback();
    }
}

export function mostrarConfetiFinal() {
    if (typeof confetti === 'function') {
        for (let i = 0; i < 10; i++) {
            setTimeout(() => {
                confetti({
                    particleCount: 500,
                    spread: 500,
                    angle: 360,
                    origin: {
                        x: Math.random(),
                        y: Math.random() * 0.5
                    },
                    colors: [
                        '#FF5733', '#33FF57', '#3357FF', '#FFD700', '#FF00FF', '#FF8C00'
                    ],
                    scalar: 1.5,
                    ticks: 100,
                    gravity: 0.15,
                    drift: Math.random() * 0.5 - 0.25,
                    shapes: ['circle', 'square', 'star'],
                    startVelocity: 40,
                    bounce: 0.4,
                    random: true,
                    disableForReducedMotion: true,
                    friction: 0.98
                });
            }, i * 250);
        }
    }
}

export function mostrarConfeti() {
    if (typeof confetti === 'function') {
        // Generar 5 explosiones aleatorias
        for (let i = 0; i < 2; i++) {
            // Generar un retraso aleatorio entre explosiones para darle más dinámica
            setTimeout(() => {
                confetti({
                    particleCount: 750, // Número de partículas por explosión
                    spread: 500,         // Espacio de dispersión
                    angle: 360, // Ángulo aleatorio para las explosiones
                    origin: {
                        x: 0.5,     // Origen aleatorio en el eje X
                        y: 0.5 // Origen aleatorio en el eje Y (solo parte superior de la pantalla)
                    },
                    colors: [
                        '#FF5733', '#33FF57', '#3357FF', '#FFD700', '#FF00FF', '#FF8C00' // Colores brillantes
                    ],
                    scalar: 1.5,           // Escala para el tamaño de las partículas
                    ticks: 150,            // Duración de la animación
                    gravity: 0.15,          // Gravedad moderada para simular caída
                    drift: Math.random() * 0.5 - 0.25, // Desviación horizontal aleatoria
                    shapes: ['circle', 'square', 'star'], // Formas de las partículas
                    startVelocity: 40,     // Velocidad inicial de las partículas
                    bounce: 0.4,           // Rebote de las partículas
                    random: true,          // Movimiento aleatorio para cada partícula
                    disableForReducedMotion: true, // Mejor accesibilidad
                    friction: 0.98         // Baja fricción para que las partículas sigan moviéndose
                });
                y += 0.1;
            }, i * 250); // Separar las explosiones con un retraso de 500ms
        }
    }
}
