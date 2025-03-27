import { mapPlugin } from "./comandos.js";

export async function cargarPlugin(comando, contenedor, secciones) {
    if (mapPlugin[comando]) {
        try {
            const modulo = await import(mapPlugin[comando]);
            modulo.default(contenedor, secciones);
        } catch (error) {
            console.error(`Error al cargar el plugin '${comando}'`, error);
        }
    } else {
        console.error(`Comando '${comando}' no reconocido.`);
    }
}
