import { ordena } from './ordena.js';
// Niveles del juego
const contenedor = document.getElementById('ejemplo');

const secciones = [
  {
    titulo: "Proceso de Desarrollo",
    conceptos: [
      "Primero los requisitos se analizan",
      "Luego se diseña la solución",
      "Después se implementa el código",
      "Se realizan las pruebas necesarias",
      "Finalmente se despliega la aplicación"
    ]
  }/* ,
  {
    titulo: "Ciclo del Agua",
    conceptos: [
      "El agua se evapora de océanos y lagos",
      "El vapor forma nubes en la atmósfera",
      "Las nubes producen precipitación",
      "El agua fluye por ríos y arroyos",
      "Finalmente regresa a océanos y lagos"
    ]
  },
  {
    titulo: "Historia de Internet",
    conceptos: [
      "ARPANET conecta las primeras computadoras",
      "Se desarrolla el protocolo TCP/IP",
      "Tim Berners-Lee crea la World Wide Web",
      "Surge el primer navegador gráfico",
      "La web se vuelve accesible al público"
    ]
  } */
];


ordena(contenedor, secciones);