export function calculadoraROI(contenedor) {
    if (document.querySelector('.css')) {
        document.querySelector('.css').remove();
    }
    const css = document.createElement('link');
    css.rel = 'stylesheet';
    css.className = 'css';
    css.type = 'text/css';
    css.href = 'PLUGINS/calculadoraROI_RAQUEL/calculadoraROI.css';
    document.head.appendChild(css);
    // Crear el HTML de la calculadora
    const html = `
        <div class="calculadoraROI">
        <div class="linea">
            <label for="gananciaBruta">Ganancia Bruta:</label>
            <input type="number" class="no-spinner" id="gananciaBruta" placeholder="Ingresa la ganancia bruta">
        </div>
        <div class="linea">
            <label for="valorInversion">Valor de la Inversión:</label>
            <input type="number" class="no-spinner" id="valorInversion" placeholder="Ingresa el valor de la inversión">
        </div>
            <button id="calcular">Calcular ROI</button>
            <p id="resultado"></p>
        </div>
    `;

    // Inyectar el HTML en el contenedor
    contenedor.innerHTML = html;

    // Agregar funcionalidad a la calculadora
    const calcularROI = () => {
        // Obtener valores de los inputs
        const gananciaBruta = parseFloat(document.getElementById('gananciaBruta').value);
        const valorInversion = parseFloat(document.getElementById('valorInversion').value);

        // Validar que los valores sean números y no estén vacíos
        if (isNaN(gananciaBruta) || isNaN(valorInversion) || valorInversion === 0) {
            document.getElementById('resultado').innerText = "Por favor, introduce valores válidos.";
            return;
        }

        // Calcular ROI
        const roi = ((gananciaBruta - valorInversion) / valorInversion) * 100;

        // Mostrar resultado
        document.getElementById('resultado').innerText = "El ROI es: " + roi.toFixed(2) + "%";
    };

    // Agregar evento al botón
    contenedor.querySelector('#calcular').addEventListener('click', calcularROI);
}
