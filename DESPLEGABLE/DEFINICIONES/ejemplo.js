import { desplegableDefiniciones } from '../../../PLUGINS/DESPLEGABLE/DEFINICIONES/desplegable-definiciones.js'; 

const contenedor = document.getElementById('si36774'); 

const secciones = [
    { id: 1, titulo:'titulo',contenido: 'Contenido' }, 
    { id: 2, titulo:'titulo',contenido: 'Contenido' } /* ... */
];

desplegableDefiniciones(contenedor, secciones);
