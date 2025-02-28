import { crearActividad } from "./arrastrarSoltarTexto.js";

const contenedor = document.getElementById('ejemplo');

const secciones =
{
    frases: [
        { texto: `Haciendo una {PRUEBA} para {ANA}` },
        { texto: `PLUGIN {DESARROLLADO} POR {FRAN}` },
    ],
    palabras: ["PRUEBA", "ANA","DESARROLLADO","FRAN"]
}


crearActividad(contenedor, secciones);