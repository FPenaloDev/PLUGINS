// puntuacionPanArte.js
export function evaluarPuntuacion(elecciones) {
    // Eliminar la elección "START" si existe
    const decisionesReales = elecciones.filter(e => e !== 'START');
    
    // Convertir array de elecciones a string para comparar
    const combinacionElegida = decisionesReales.join('').toLowerCase();

    // Definir las combinaciones por color
    const combinacionesRojas = ['aaa', 'aab', 'aba', 'aca'];
    const combinacionesAzules = ['cab', 'cac', 'cba', 'cbb', 'cbc', 'cca', 'ccb', 'ccc'];
    const combinacionesVerdes = [
        'aac', 'abb', 'abc', 'acb', 'acc',
        'baa', 'bab', 'bac', 'bba', 'bbb',
        'bbc', 'bca', 'bcb', 'bcc', 'caa'
    ];

    // Mensajes por color
    const mensajes = {
        verde: "Hemos gestionado nuestro presupuesto de manera efectiva, esta decisión nos ha permitido equilibrar calidad y costo, manteniendo una producción eficiente y satisfaciendo las necesidades del negocio.",
        azul: "Desafortunadamente, al buscar opciones más económicas, hemos sacrificado la calidad en la compra de equipos y materiales. Esto se refleja en productos que no cumplen con las expectativas de nuestros clientes. En el futuro, debemos priorizar la calidad sobre el costo para mantener la competitividad y la satisfacción del cliente.",
        rojo: "Has excedido nuestro presupuesto al contratar al ayudante con experiencia. Aunque su calidad laboral es indiscutible, el alto salario ha generado un desequilibrio financiero. Esto podría afectar nuestra capacidad para invertir en otras áreas clave de la panadería, como la expansión del negocio. Necesitamos revisar nuestra estrategia de contratación para evitar futuros desbordamientos financieros."
    };

    // Determinar el color y la puntuación basada en la combinación
    let color;
    let puntuacion;

    if (combinacionesRojas.includes(combinacionElegida)) {
        color = 'rojo';
        puntuacion = 40;
    } else if (combinacionesAzules.includes(combinacionElegida)) {
        color = 'azul';
        puntuacion = 60;
    } else if (combinacionesVerdes.includes(combinacionElegida)) {
        color = 'verde';
        puntuacion = 90;
    } else {
        // Por defecto, si hay alguna combinación no contemplada
        color = 'azul';
        puntuacion = 50;
    }

    return {
        puntuacion,
        color,
        feedback: mensajes[color],
        combinacion: combinacionElegida.toUpperCase()
    };
}