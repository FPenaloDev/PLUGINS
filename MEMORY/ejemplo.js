import { memory } from "./memory.js";

const contenedor = document.getElementById("ejemplo");

const secciones = [


    { pareja: '1', elemento1: 'Comunidades sociales', elemento2: 'Estas comunidades las podemos encontrar en las redes sociales más usadas como X o Facebook.', borde: 'var(--negro)' },
    { pareja: '2', elemento1: 'Comunidades de conocimiento y aprendizaje', elemento2: 'Enfocadas en la adquisición de conocimientos nuevos.', borde: 'var(--terciario' },
    { pareja: '3', elemento1: 'Comunidades de expertos y asesores', elemento2: 'Plataformas como Reddit o Quora son muy socorridas para estos casos.', borde: 'var(--secundario)' },
    { pareja: '4', elemento1: 'Comunidades de insights', elemento2: 'Permiten a usuarios y empresas obtener y compartir datos, opiniones y todo tipo de métricas.', borde: 'var(--primario' },


];

memory(contenedor, secciones);
