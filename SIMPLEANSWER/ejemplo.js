import { SimpleAnswer } from "./simpleAnswer.js";

const contenedor = document.getElementById("ejemplo");

const secciones = [

    {
        frase: `¿ Cuantas patas tiene un perro? <input id="answer-0-0" oninput="manejarInput(0,0,this.value)">`,
        respuesta: [`4`]
    }
];


SimpleAnswer(contenedor, secciones);