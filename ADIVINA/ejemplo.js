import { adivina } from "./adivina.js";

const contenedor = document.getElementById("ejemplo");

const secciones = [
    {
        palabra: "gato",
        pistas: ["Es un animal doméstico que maulla.", "Es conocido por cazar ratones.", "es un felino"],
        letrasMostradas: []
    },
    {
        palabra: "perro",
        pistas: ["Es conocido como el mejor amigo del hombre.", "Ladra y es muy leal.","Cuando ladra dice GUAU"],
        letrasMostradas: []
    }
];

adivina(contenedor, secciones);
