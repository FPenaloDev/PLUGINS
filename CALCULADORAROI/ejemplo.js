import { calculadoraROI } from './calculadoraROI.js';

const contenedor = document.getElementById('ejemplo');

const secciones = [
    {
        texto: "La empresa Tech Solutions S.A. se dedica a la fabricación y venta de dispositivos tecnológicos. Debes averiguar el Ratio de Liquidez y el Ratio de Solvencia de la empresa.<br> Para evaluar su situación financiera, se nos proporciona el siguiente balance general resumido al cierre del ejercicio:",
        inputs: [
            "Ratio de liquidez:<input type='text' id='respuesta-0-0' oninput='manejarEntrada(0, 0, this.value)'>",
            "Ratio de solvencia:<input type='text' id='respuesta-0-1' oninput='manejarEntrada(0, 1, this.value)'>"
        ],
        imagen:'imagenes_CONTABILIDAD/tablas 1.2.3.png',
        respuesta: ["0,94", "1,48"],
        popup: `
        <p><strong>Las fórmulas para calcular la liquidez y la solvencia son:</strong>
        <br>Ratio de liquidez = Activo Corriente / Pasivo Corriente
        <br>Ratio de solvencia = Activo Total / Pasivo Total</p>
      `
    }
    
];

calculadoraROI(contenedor, secciones);