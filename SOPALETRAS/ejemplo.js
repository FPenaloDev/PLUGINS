import { sopaLetras } from "../../PLUGINS/SOPALETRAS/sopaLetras.js";

const contenedor = document.getElementById("ejemplo");

const secciones = [
    {
        palabra: "ROMPECABEZAS",
        definicion: "Rompecabezas es como se define a esta seccion"
    }
];

sopaLetras(contenedor, secciones);