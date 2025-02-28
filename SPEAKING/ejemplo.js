import { speaking } from './speaking.js';
const contenedor = document.getElementById('ejemplo');
const frases = [
  "WINNER",
  "LOSER"
];


const audios = [
  { id: 'audio_1', ruta: './PLUGINS/AUDIOS/acierto.mp3' },
  { id: 'audio_2', ruta: './PLUGINS/AUDIOS/lose.mp3' }
];

// Inicializar la actividad speaking
speaking(contenedor, frases, audios);