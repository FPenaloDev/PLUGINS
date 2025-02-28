import { desplegableImportante } from "../../../PLUGINS/DESPLEGABLE/IMPORTANTE/desplegable_importante.js";
const contenedor = document.getElementById('si21599');
const secciones = [
    {
        tipo: 'parrafo',
        icono: 'dr/iconos/marcador.gif',
        contenido: 'texto'
    }

];
desplegableImportante(contenedor, secciones);