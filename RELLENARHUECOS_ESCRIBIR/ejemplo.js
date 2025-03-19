import { rellenarHuecos } from "./rellenarHuecos_escribir.js";

const contenedor = document.getElementById("ejemplo");

const secciones = [

    {
        frase: `El <input id="answer-0-0" oninput="manejarInput(0,0,this.value)"> es un animal`,
        respuesta: [`perro`]
    }
];


rellenarHuecos(contenedor, secciones);