import { unir } from "./unir_horizontal.js";

const contenedor = document.getElementById("ejemplo");

export const secciones = [
    {
        pagina: 1,
        conceptos:
            [
                {
                    izquierda: "hola",
                    derecha: "hola"
                },
/*                 {
                    izquierda: "adios",
                    derecha: "adios"
                },
                {
                    izquierda: "k tal",
                    derecha: "k tal"
                } */
            ]



    }
];

unir(contenedor, secciones);