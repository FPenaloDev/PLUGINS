// Importar la función rellenarHuecos
import { rellenarHuecos } from './rellenarHuecos.js';

// Crear el contenedor
const contenedor = document.getElementById('ejemplo');

// Definir las secciones con las preguntas y respuestas
const secciones = [
    {
        frase: "La capital de Francia es <input id='answer-0-0' type='text'>.",
        tipoInput: 'desplegable',
        opciones: ['Berlín', 'Madrid', 'París', 'Lisboa'],
        respuesta: ['París']
    },
    {
        frase: "El océano más grande del mundo es <input id='answer-1-0' type='text'>.",
        tipoInput: 'desplegable',
        opciones: ['Atlántico', 'Índico', 'Ártico', 'Pacífico'],
        respuesta: ['Pacífico']
    }
];

// Llamar a la función rellenarHuecos con el contenedor y las secciones
rellenarHuecos(contenedor, secciones);