const PRODUCTOS_POR_PAGINA = 4;

function obtenerCardsCategoria(categoria) {
    return Array.from(categoria.querySelectorAll('.productos-grid > .producto-card'));
}

function actualizarVisibilidad(categoria) {                                                 // Filtro por precio y Mostrar más
    const inputMin = categoria.querySelector('.filtro-precio__min');
    const inputMax = categoria.querySelector('.filtro-precio__max');

    const min = inputMin && inputMin.value ? parseFloat(inputMin.value) : 0;
    const max = inputMax && inputMax.value ? parseFloat(inputMax.value) : Infinity;
    const visibles = parseInt(categoria.dataset.visibles || PRODUCTOS_POR_PAGINA, 10);

    const cards = obtenerCardsCategoria(categoria);

    const coincidentes = cards.filter(card => {
        const precio = parseInt(card.dataset.precio, 10);
        return precio >= min && precio <= max;
    });

    cards.forEach(card => {
        card.style.display = 'none';
    });

    coincidentes.slice(0, visibles).forEach(card => {
        card.style.display = '';
    });

    let mensajeVacio = categoria.querySelector('.categoria__sin-resultados');
    if (coincidentes.length === 0) {
        if (!mensajeVacio) {
            mensajeVacio = document.createElement('p');
            mensajeVacio.className = 'categoria__sin-resultados';
            mensajeVacio.textContent = 'No hay productos en ese rango de precio.';
            categoria.querySelector('.productos-grid').insertAdjacentElement('afterend', mensajeVacio);
        }
    } else if (mensajeVacio) {
        mensajeVacio.remove();
    }

    const botonMas = categoria.querySelector('.mostrar-mas');
    if (botonMas) {
        botonMas.style.display = coincidentes.length > visibles ? '' : 'none';
    }
}

function aplicarFiltro(boton) {
    const categoria = boton.closest('.categoria');
    categoria.dataset.visibles = PRODUCTOS_POR_PAGINA; // reinicia la paginación al filtrar
    actualizarVisibilidad(categoria);
}

function limpiarFiltro(boton) {
    const categoria = boton.closest('.categoria');
    const inputMin = categoria.querySelector('.filtro-precio__min');
    const inputMax = categoria.querySelector('.filtro-precio__max');

    if (inputMin) inputMin.value = '';
    if (inputMax) inputMax.value = '';

    categoria.dataset.visibles = PRODUCTOS_POR_PAGINA;
    actualizarVisibilidad(categoria);
}

function mostrarMas(boton) {
    const categoria = boton.closest('.categoria');
    const visibles = parseInt(categoria.dataset.visibles || PRODUCTOS_POR_PAGINA, 10);
    categoria.dataset.visibles = visibles + PRODUCTOS_POR_PAGINA;
    actualizarVisibilidad(categoria);
}

document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.categoria').forEach(categoria => {
        categoria.dataset.visibles = PRODUCTOS_POR_PAGINA;
        actualizarVisibilidad(categoria);
    });
});