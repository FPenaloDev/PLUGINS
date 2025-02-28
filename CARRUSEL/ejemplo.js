import { carrusel } from './carrusel.js';


const contenedor = document.getElementById('ejemplo');

const secciones = [
    {
        pagina: 1,
        titulo: "SISTEMA DIGESTIVO",
        elementos: [
            {
                tipo: 'parrafo',
                contenido: 'El <strong>sistema digestivo</strong> es como un largo tubo retorcido que va desde la boca hasta el ano. Encontramos órganos huecos como la boca, el esófago, el estómago, el intestino delgado, el intestino grueso y el ano durante esta expedición. Pero también hay órganos sólidos como el páncreas, la vesícula biliar y el hígado que cumplen funciones cruciales. Es como un equipo trabajando juntos para descomponer los alimentos y así poder dar a nuestro cuerpo los nutrientes que necesita.'
            }
        ]
    },
    {
        pagina: 2,
        titulo: "INTESTINO DELGADO",
        elementos: [
            {
                tipo: 'parrafo',
                contenido: 'El <strong>intestino delgado</strong> tiene tres partes, que son las encargadas de la absorción de nutrientes y agua de los alimentos.'
            }
            ,
            {
                tipo: 'lista',
                estilo: 'ul',
                items: [
                    'El intestino delgado se divide en tres partes:',
                    '<strong>Duodeno:</strong>es la parte inicial del intestino delgado y está unida al estómago. El duodeno ayuda a seguir el proceso de digestión de los alimentos que se expulsan del estómago. Absorbe nutrientes (vitaminas, minerales, carbohidratos, grasas y proteínas) y agua de los alimentos para que el cuerpo los utilice.',
                    '<strong>Yeyuno:</strong> se encuentra en la mitad del intestino delgado. Está entre el duodeno que es la primera parte y el íleon, que es la última parte. El yeyuno ayuda a continuar la digestión del estómago.',
                    '<strong>Íleon:</strong> es el final del intestino delgado. Se conecta con la primera parte del intestino grueso, conocida como el ciego. El íleon ayuda a continuar la digestión de los alimentos del estómago y otros segmentos del intestino delgado.'
                ]
            }
        ]
    },
    {
        pagina: 3,
        titulo: "INTESTINO GRUESO",
        elementos: [
            {
                tipo: 'parrafo',
                contenido: 'El <strong>intestino grueso</strong> está constituido por cuatro partes: el ciego, el colon, el recto y el ano. Los alimentos parcialmente digeridos por el intestino delgado pasan por el ciego al colon que termina de absorber agua, algunos nutrientes y electrolitos. Los residuos restantes, denominados heces, pasan al recto donde se almacenan para ser expulsados por el ano.'
            }
        ]
    },
    {
        pagina: 4,
        titulo: "¿SABÍAS QUÉ?",
        elementos: [
            {
                tipo: 'parrafo',
                contenido: 'El <strong>apéndice</strong> es una pequeña bolsa situada en el lugar donde se unen el intestino delgado y el colon. A pesar de que solía tener una función, ahora se cree que ha perdido su propósito. Se pensaba que ayudaba a digerir la celulosa de las plantas, pero nuestra dieta ha cambiado y ya no lo necesitamos.<br><br>Sin embargo, según algunas investigaciones, el apéndice podría desempeñar una función importante que aún no comprendemos por completo. Pero todavía se considera en gran medida como un órgano vestigial, es decir, un órgano que ha perdido su función original a lo largo de la evolución. Por lo tanto, a pesar de que su papel sigue siendo un misterio, todavía estamos descubriendo su impacto en nuestro cuerpo.'
            }
        ]
    },
    /*     {
            pagina:1,
            titulo:"TITULO",
            elementos:[
                {
                    tipo:'parrafo',
                    contenido:'CONTENIDO'
                }
            ]
        }, */
]


carrusel(contenedor, secciones);