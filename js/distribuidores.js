document.addEventListener('DOMContentLoaded', () => {
    inicializarModal();
    inicializarFiltroCatalogo();
});

function inicializarModal() {
    const modal = document.getElementById('filtro-modal');
    const form = document.getElementById('filtro-form');
    const marcaInput = document.getElementById('filtro-marca');
    const cerrarButton = document.getElementById('cerrar-filtro');
    if (!modal || !form || !marcaInput || !cerrarButton) return;
    let marcaSeleccionada = '';

    const cerrarModal = () => {
        modal.classList.remove('filtro-modal--visible');
        modal.setAttribute('aria-hidden', 'true');
    };

    document.querySelectorAll('.brand-card__filter-button').forEach((button) => {
        button.addEventListener('click', () => {
            marcaSeleccionada = button.dataset.marca;
            marcaInput.value = marcaSeleccionada;
            modal.classList.add('filtro-modal--visible');
            modal.setAttribute('aria-hidden', 'false');
            marcaInput.focus();
        });
    });

    form.addEventListener('submit', (event) => {
        event.preventDefault();
        const datos = new FormData(form);
        const marca = datos.get('marca');
        const categoria = datos.get('categoria');
        const parametros = new URLSearchParams({ marca, categoria });
        cerrarModal();
        window.open(
            `distribuidoresfiltro.html?${parametros.toString()}#${categoria === 'todos' ? 'motos' : categoria}`,
            '_blank',
            'noopener,noreferrer'
        );
    });

    cerrarButton.addEventListener('click', cerrarModal);
    modal.addEventListener('click', (event) => {
        if (event.target === modal) cerrarModal();
    });
    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape') cerrarModal();
    });
}

function inicializarFiltroCatalogo() {
    const form = document.getElementById('filtro-catalogo-form');
    if (!form) return;

    const url = new URLSearchParams(window.location.search);
    const estadoFiltro = {
        marca: normalizar(url.get('marca')) || 'todos',
        categoria: (url.get('categoria') || 'todos').trim().toLowerCase()
    };

    const aplicarFiltro = () => {
        let visibles = 0;
        document.querySelectorAll('.filtro-categoria').forEach((seccion) => {
            const coincideCategoria = estadoFiltro.categoria === 'todos' || seccion.dataset.categoria === estadoFiltro.categoria;
            let visiblesEnSeccion = 0;
            seccion.querySelectorAll('.producto-card').forEach((producto) => {
                const coincideMarca = estadoFiltro.marca === 'todos' || normalizar(producto.dataset.marca) === estadoFiltro.marca;
                const visible = coincideCategoria && coincideMarca;
                producto.style.display = visible ? '' : 'none';
                if (visible) visiblesEnSeccion += 1;
            });
            seccion.classList.toggle('filtro-categoria--oculta', visiblesEnSeccion === 0);
            visibles += visiblesEnSeccion;
        });
        const marca = estadoFiltro.marca === 'todos' ? 'todas las marcas' : estadoFiltro.marca;
        const categoria = estadoFiltro.categoria === 'todos' ? 'todos los productos' : estadoFiltro.categoria;
        document.getElementById('filtro-estado').textContent = visibles
            ? `Mostrando ${visibles} producto${visibles === 1 ? '' : 's'} de ${marca} en ${categoria}.`
            : `No hay productos de ${marca} en ${categoria}.`;
    };

    fetch('Productos.html').then((respuesta) => respuesta.text()).then((contenido) => {
        const documento = new DOMParser().parseFromString(contenido, 'text/html');
        const resultados = document.getElementById('filtro-resultados');
        const marcas = new Set();
        documento.querySelectorAll('.categoria').forEach((original) => {
            const seccion = document.createElement('section');
            seccion.className = 'categoria filtro-categoria';
            seccion.dataset.categoria = original.id;
            seccion.innerHTML = `<h2 class="categoria__titulo">${original.querySelector('.categoria__titulo').textContent}</h2><div class="productos-grid"></div>`;
            original.querySelectorAll('.producto-card').forEach((originalProducto) => {
                const producto = originalProducto.cloneNode(true);
                producto.querySelectorAll('[onclick]').forEach((elemento) => elemento.removeAttribute('onclick'));
                marcas.add(producto.dataset.marca);
                seccion.querySelector('.productos-grid').appendChild(producto);
            });
            resultados.appendChild(seccion);
        });
        const selector = document.getElementById('filtro-marca');
        [...marcas].sort().forEach((marca) => selector.insertAdjacentHTML('beforeend', `<option value="${marca}">${marca}</option>`));
        selector.value = marcas.has(estadoFiltro.marca) ? estadoFiltro.marca : 'todos';
        document.getElementById('filtro-categoria').value = ['motos', 'repuestos', 'accesorios'].includes(estadoFiltro.categoria) ? estadoFiltro.categoria : 'todos';
        aplicarFiltro();
    }).catch(() => {
        document.getElementById('filtro-estado').textContent = 'No fue posible cargar el catalogo.';
    });

    form.addEventListener('submit', (event) => {
        event.preventDefault();
        const datos = new FormData(event.currentTarget);
        estadoFiltro.marca = normalizar(datos.get('marca')) || 'todos';
        estadoFiltro.categoria = (datos.get('categoria') || 'todos').toLowerCase();
        history.replaceState(null, '', `distribuidoresfiltro.html?marca=${encodeURIComponent(estadoFiltro.marca)}&categoria=${estadoFiltro.categoria}`);
        aplicarFiltro();
    });
}

function normalizar(valor) {
    return (valor || '').trim().toUpperCase();
}