import { panArte } from './panArte.js';

const contenedor = document.getElementById('ejemplo');

const secciones = [
  {
    escena: 1,
    contenidos: [
      {
        titulo: "Bienvenido a PanArte",
        descripcion: "Eres el gerente de la panadería PanArte. Tu objetivo es maximizar la eficiencia y rentabilidad del negocio. Tienes un presupuesto de 1000 euros para tomar decisiones importantes. Cada elección afectará la calidad de los productos y la rentabilidad. ¡Buena suerte!",
        opciones: [
          /* { texto: "Comenzar", opcion: "START" } */
        ]
      }
    ]
  },
  {
    escena: 2,
    contenidos: [
      {
        titulo: "Elección del Horno",
        descripcion: "Tu panadería necesita un nuevo horno. ¿Cuál eliges?",
        opciones: [
          { texto: "Horno de muy buena calidad", costo: 650, opcion: "A" },
          { texto: "Horno de calidad media", costo: 350, opcion: "B" },
          { texto: "Horno de calidad inferior", costo: 200, opcion: "C" }
        ],
        resultados: {
          A: "Has elegido el horno de mayor calidad. Esta opción ha reducido considerablemente nuestro presupuesto.",
          B: "Optaste por el horno de buena calidad. Mejorará nuestra eficiencia operativa.",
          C: "Elegiste el horno más económico. Recuerda que su calidad puede no ser la mejor."
        }
      }
    ]
  },
  {
    escena: 3,
    contenidos: [
      {
        titulo: "Compra de Harina",
        descripcion: "Necesitas comprar harina para la próxima semana. ¿Qué opción eliges?",
        opciones: [
          { texto: "200 kg a €1/kg", costo: 200, opcion: "A" },
          { texto: "100 kg a €1.5/kg", costo: 150, opcion: "B" },
          { texto: "50 kg a €2/kg", costo: 100, opcion: "C" }
        ],
        resultados: {
          A: "Has elegido la opción más rentable de harina.",
          B: "Has elegido una opción intermedia de harina.",
          C: "Has elegido la opción más costosa de harina."
        }
      }
    ]
  },
  {
    escena: 4,
    contenidos: [
      {
        titulo: "Contratar Ayudante",
        descripcion: "Estás considerando contratar un ayudante. ¿A quién eliges?",
        opciones: [
          { texto: "Ayudante Experimentado", costo: 300, opcion: "A" },
          { texto: "Ayudante con algo de experiencia", costo: 200, opcion: "B" },
          { texto: "Ayudante sin experiencia", costo: 80, opcion: "C" }
        ],
        resultados: {
          A: "Contrataste al ayudante con experiencia. Su salario es alto pero asegura calidad.",
          B: "Contrataste al ayudante con algo de experiencia. Es una opción equilibrada.",
          C: "Optaste por el ayudante novato. Ahorra costos pero requerirá entrenamiento."
        }
      }
    ]
  }
];
panArte(contenedor,secciones);
