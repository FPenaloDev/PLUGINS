import { carruselTarjetas } from '../../PLUGINS/CARRUSELTARJETAS/carruselTarjetas.js';

const contenedor = document.getElementById('ejemplo');

const secciones = [
    {
        titulo:"HI",
        tarjetas:[
            {titulo:"TESTING",img:"",contenido:"contenido de prueba"}
        ]
    }
];
carruselTarjetas(contenedor, secciones);