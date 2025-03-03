
export function desplegableDefiniciones(contenedor, secciones) {
    if (document.getElementById('css')) {
        document.getElementById('css').remove();
      }
    const css = document.createElement('link');
    css.rel = 'stylesheet';
    css.id = 'css';
    css.type = 'text/css';
    css.href = 'PLUGINS---/DESPLEGABLE/DEFINICIONES/desplegable-definiciones.css';
    document.head.appendChild(css);
    // Determinar el número total de páginas basado en la propiedad "pagina" de las secciones
    const totalPages = Math.max(...secciones.map(seccion => seccion.pagina));
    let currentPage = 1;
    
    // Función para mostrar los elementos de una página específica
    const renderPage = (page) => {
        // Filtrar las secciones correspondientes a la página actual
        const seccionesPagina = secciones.filter(seccion => seccion.pagina === page);
        
        // Renderizar los elementos de la página actual
        contenedor.innerHTML = `
            <div class="container">
                ${seccionesPagina.flatMap(seccion => seccion.elementos.map(elemento => `
                    <div class="definition-item">
                        <div class="definition-header">
                            <span class="icon">+</span>
                            <h3>${elemento.titulo}</h3>
                        </div>
                        <div class="definition-content">
                            <p>${elemento.contenido}</p>
                        </div>
                    </div>
                `)).join('')}
            </div>
        `;
        
        // Reconfigurar los eventos para los desplegables
        const definitionItems = contenedor.querySelectorAll('.definition-item');
        definitionItems.forEach(item => {
            const header = item.querySelector('.definition-header');
            const icon = item.querySelector('.icon');
    
            header.addEventListener('click', () => {
                item.classList.toggle('open');
                icon.textContent = item.classList.contains('open') ? '-' : '+';
            });
        });
        
        // Actualizar la paginación
        updatePagination(totalPages, page);
    };
    
    // Crear o encontrar el contenedor de paginación
    let paginationContainer = document.querySelector('.pagination-container');
    if (!paginationContainer) {
        paginationContainer = document.createElement('div');
        paginationContainer.className = 'pagination-container';
        contenedor.after(paginationContainer);
    }
    
    // Función para actualizar la paginación
    const updatePagination = (totalPages, currentPage) => {
        paginationContainer.innerHTML = '';
        paginationContainer.style.display = 'flex';
        paginationContainer.style.alignItems = 'center';
    
        // Botón de "Back"
        const backButton = document.createElement('div');
        backButton.className = `back`;
        backButton.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="2em" height="2em" style="transform:rotate(180deg)" viewBox="0 0 42 42"><path fill="var(--primario)" fill-rule="evenodd" d="M13.933 1L34 21.068L14.431 40.637l-4.933-4.933l14.638-14.636L9 5.933z"/></svg>`;
        backButton.disabled = currentPage === 1;
        if (backButton.disabled) {
            backButton.classList.add('disabled'); // Añadido la clase disabled
        }
        backButton.addEventListener('click', () => {
            if (currentPage > 1) {
                currentPage--;
                renderPage(currentPage);
            }
        });
        paginationContainer.appendChild(backButton);
    
        // Puntos de paginación
        for (let i = 1; i <= totalPages; i++) {
            const dot = document.createElement('span');
            dot.className = 'pagination-dot';
            if (i === currentPage) {
                dot.classList.add('active');
            }
            dot.addEventListener('click', () => {
                currentPage = i;
                renderPage(currentPage);
            });
            paginationContainer.appendChild(dot);
        }
    
        // Botón de "Next"
        const nextButton = document.createElement('div');
        nextButton.className = `next`;
        nextButton.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="2em" height="2em" viewBox="0 0 42 42"><path fill="var(--primario)" fill-rule="evenodd" d="M13.933 1L34 21.068L14.431 40.637l-4.933-4.933l14.638-14.636L9 5.933z"/></svg>`;
        nextButton.disabled = currentPage === totalPages;
        if (nextButton.disabled) {
            nextButton.classList.add('disabled'); // Añadido la clase disabled
        }
        nextButton.addEventListener('click', () => {
            if (currentPage < totalPages) {
                currentPage++;
                renderPage(currentPage);
            }
        });
        paginationContainer.appendChild(nextButton);
    };
    
    // Renderizar la primera página al inicio
    renderPage(currentPage);
}