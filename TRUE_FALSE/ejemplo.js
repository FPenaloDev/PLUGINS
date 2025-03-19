import { true_false } from "../../PLUGINS/TRUE_FALSE/true_false.js";

const contenedor = document.getElementById("ejemplo");


const secciones = [
    {
        frase: "El perro es un animal",
        correcta: true  // Debe ser un booleano (true o false)
    },
    {
        frase: "Los gatos pueden volar",
        correcta: false
    },
    {
        frase: "El agua hierve a 100°C a nivel del mar",
        correcta: true
    }
];


true_false(contenedor, secciones);