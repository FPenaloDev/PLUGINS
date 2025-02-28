import { arrastrarYSoltar } from '../../PLUGINS/ARRASTRARSOLTAR/arrastrarSoltar.js';
const contenedor = document.getElementById('ejemplo');
  const elementos = [
    { texto: "Happy", categoria: "grad" }
];

const categorias = [
    { id: "grad", nombre: "Gradable" },
    { id: "nograd", nombre: "Non-Gradable" }
];

arrastrarYSoltar(contenedor,elementos,categorias);