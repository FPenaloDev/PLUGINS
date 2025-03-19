import { rellenarHuecos } from "./rellenarHuecos_escribir.js";

const contenedor = document.getElementById("ejemplo");

const secciones = [

    {
        frase: `El <input id="answer-0-0" oninput="manejarInput(0,0,this.value)"> es un animal`,
        respuesta: [`perro`]
    }
];


rellenarHuecos(contenedor, secciones);

document.head.innerHTML += `
<style>
@import url('./color_curso.css');
:root{

    --fondo-div-barra:none;
    --borde-barra-progreso: var(--primario);
    --relleno-barra-progreso: var(--primario);
    --borde-superior-pregunta:var(--primario);
    --background-pregunta:#fff;
    --sombra-pregunta:0 5px 15px rgba(0, 0, 0, 0.1);
    --background-boton:var(--primario);
    --background-boton-hover:var(--primario);
    --color-boton:#fff;
    --sombra-boton-hover:0 5px 10px var(--primario);
    --borde-input:var(--primario);
    --input-seleccionado: var(--primario);
    --sombra-input: 0 0 5px #f2f2f2b0;
}


* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }
  
  body {
    font-family: 'Poppins', sans-serif;
  }
  
  .contenedor-cuestionario {
    margin-top: 3%;
    display: flex;
    flex-direction: column;
    width: 100%;
  }
  
  .contenedor-cuestionario .fila-pregunta {
    display: flex;
    justify-content: space-between;
    margin-bottom: 20px;
  }
  
  .contenedor-cuestionario .contenedor-pregunta {
    width: 90%;
    margin: 0 auto;
  }
  
  .contenedor-cuestionario .barra-lateral {
    width: 90%;
    background-color: var(--fondo-div-barra);
    display: flex;
    flex-direction: column;
    height: max-content;
    margin: 0 auto;
  }
  
  .contenedor-cuestionario .contenido-principal {
    width: 70%;
    height: max-content;
    overflow-y: auto;
    scrollbar-width: none;
    margin: 0 auto;
  }
  
  .contenedor-cuestionario .contenedor-progreso {
    margin: auto;
  }
  
  .contenedor-cuestionario .barra-progreso {
    width: 60%;
    height: 2.4em;
    margin: auto;
    border: 3px solid var(--borde-barra-progreso);
    border-radius: 40px;
    overflow: hidden;
  }
  
  .contenedor-cuestionario .progreso {
    height: 100%;
    background-color: var(--relleno-barra-progreso);
    width: 0;
    transition: width 0.3s ease;
  }
  
  .contenedor-cuestionario .contenedor-pregunta {
    max-width:95%;
    background-color: var(--background-pregunta);
    border-radius: 25px;
    border-top: 5px solid var(--borde-superior-pregunta);
    padding: 20px;
    font-size: 150%;
    color: #000000;
    margin-bottom: 20px;
    box-shadow: var(--sombra-pregunta);
    transition: all 0.3s ease;
  }
  
  .contenedor-cuestionario .contenedor-pregunta.cortas {
    width: 40%;
  }
  
  .contenedor-cuestionario .contenedor-pregunta:hover {
    transform: translateY(-5px);
  }
  
  .contenedor-cuestionario .icono-feedback {
    display: inline-block;
    margin-left: 10px;
    font-size: 20px;
  }
  
  .contenedor-cuestionario .contenedor-boton {
    padding: 15px 0;
    display: flex;
    justify-content: space-around;
    text-align: center;
  }
  
  .contenedor-cuestionario .contenedor-boton button {
    background-color: var(--background-boton);
    color: var(--color-boton);
    border: none;
    max-width: 8.5em;
    padding: 12px 24px;
    font-size: 18px;
    font-family:'Poppins' !important;
    font-weight: bold;
    border-radius: 50px;
    cursor: pointer;
    transition: all 0.3s ease-in-out;
    margin: auto;
  }

  .contenedor-cuestionario .contenedor-boton #reiniciar-btn {
    display:flex;
    align-items: center;
    svg {
        transition: all 0.6s ease-in;
        min-width:1.5em;
        margin:0 5px;
        path {

        }
    }
    .texto-boton {
        transition: all 0.6s ease-in;
        max-width:0.1px;
        opacity:0;
    }
  }
  .contenedor-cuestionario .contenedor-boton #reiniciar-btn:hover {      
    max-width:30%;
    width:max-content;
    svg {
        transform: rotate(360deg);
    }
    .texto-boton {
        max-width:100px;
        opacity:1;
    }
  }
  
  .contenedor-cuestionario button:hover {
    background-color: var(--background-boton-hover);
    color: #fff;
    border-bottom: 2px solid #000;
    transition: all 0.3s ease-in;
    transform: translateY(2px);
    box-shadow: var(--sombra-boton-hover);
  }
  
  .contenedor-cuestionario .resultado {
    position: relative;
    margin: auto;
    margin-top: 30px;
    padding: 3% 7%;
    max-width: max-content;
    background-color: var(--primario-opacidad);
    display: flex;
    align-items: center;
    color:var(--blanco);
    border-radius: 50px;
    border:3px solid var(--primario);
    display: none;
    text-align: center;
    font-size: 20px;
    font-weight: 600;
  }
  
  .contenedor-cuestionario select.input-desplegable {
    padding: 8px 10px;
    margin: 0.5% 0;
    font-size: 16px;
    border: 2px solid var(--borde-input);
    border-radius: 5px;
    transition: all 0.3s ease;
    text-align: center;
    width: auto;
    min-width: 150px;
  }
  
  .contenedor-cuestionario select.input-desplegable:focus {
    outline: none;
    border: 3px solid var(--input-seleccionado);
  }
  
  .contenedor-cuestionario .palabras {
    max-width: 95%;
    margin: auto;
    width: max-content;
    display: block;
    font-size: 85%;
    font-weight: bold;
    background: #fff;
    border-radius: 5px;
    padding: 4%;
    color: var(--primario);
  }
  
  .contenedor-cuestionario .frase {
    max-width: 80%;
    margin: auto;
    font-size: 0.8em;
  }
  
  .contenedor-cuestionario input {
    max-width: 100%;
    min-height: 40px; /* Ajusta la altura mínima según sea necesario */
    padding: 8px 10px;
    margin: 0.5% 0;
    font-size: 16px;
    border: 2px solid var(--borde-input);
    border-radius: 10px;
    transition: all 0.3s ease;
    text-align: left; /* Cambia a izquierda para mejor legibilidad */
    resize: none; /* Desactiva el redimensionamiento manual */
    overflow: hidden; /* Oculta el desbordamiento */
    white-space: pre-wrap; /* Permite que el texto se ajuste a la siguiente línea */
  }
  
  .contenedor-cuestionario .correcto {
    background: green !important;
    color: #fff;
    font-weight: bold;
  }
  .contenedor-cuestionario .incorrecto {
    background: #ca2d2d;
    color: #fff;
    font-weight: bold;
  }
  
  .contenedor-cuestionario input[type="text"]:focus {
    outline: none;
    border: 3px solid var(--input-seleccionado);
  }
  
  .contenedor-cuestionario #formulario-cuestionario {
    overflow-y: auto;
    display: flex;
    flex-wrap: wrap;
    /*   scrollbar-arrow-color:transparent ;
    scrollbar-color: var(--secundario) transparent; */
    max-height:40vh;
    padding: 3%;
  }
  .contenedor-cuestionario #formulario-cuestionario::-webkit-scrollbar {
    background: var(--primario);
    border-radius: 10px;
  }
  .contenedor-cuestionario #formulario-cuestionario::-webkit-scrollbar-thumb {
    background: var(--secundario);
    border-radius: 20px;
    /* box-shadow: inset 0 60px 0 var(--primario), inset 0 -60px 0 var(--primario); */
  
  }
  .contenedor-cuestionario #formulario-cuestionario.corto {
    display: flex;
    flex-wrap: wrap;
    flex: 1 1 calc(40% -10px);
  }
  
  .contenedor-cuestionario label {
    font-size: 150%;
  }
  
  @media (max-width: 900px) {
    .contenedor-cuestionario {
      flex-direction: column;
    }
  
    .contenedor-cuestionario .barra-lateral,
    .contenedor-cuestionario .contenido-principal {
      width: 85%;
    }
  
    .contenedor-cuestionario p {
      font-size: 1.1em;
      padding: 0 0 5% 0;
    }
  
    .contenedor-cuestionario .barra-lateral {
      padding: 0;
    }
  
    .contenedor-cuestionario .barra-progreso {
      margin: 0 auto 5% auto;
    }
  
    .contenedor-cuestionario .contenedor-boton {
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      margin: 2.5% auto;
      top: 92%;
      left: 10%;
    }
  
    .contenedor-cuestionario .contenedor-boton button {
      font-size: 13px;
      max-width: 40%;
  
    }
  
    .contenedor-cuestionario #formulario-cuestionario {
      scrollbar-width: auto;
      max-height: 50vh;
    }
    .contenedor-cuestionario #formulario-cuestionario .contenedor-pregunta {
      max-width: 85%;
    }
  }
  
  @media (max-width: 650px) {
  
    .contenedor-cuestionario .contenedor-pregunta,
    .contenedor-cuestionario .contenedor-pregunta.cortas {
      width: 90%;
    }
  }
</style>
`;