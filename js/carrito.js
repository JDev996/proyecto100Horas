const CARRITO_STORAGE_KEY = 'jajmotos_carrito';

function obtenerCarrito() {
    const datos = localStorage.getItem(CARRITO_STORAGE_KEY);
    return datos ? JSON.parse(datos) : [];
}

function guardarCarrito(carrito) {
    localStorage.setItem(CARRITO_STORAGE_KEY, JSON.stringify(carrito));
}

function formatearPrecio(numero) {
    return '$ ' + numero.toLocaleString('es-CO');
}

function inicializarPanelCarrito() {
    if (document.querySelector('.carrito-panel')) return;

    const overlay = document.createElement('div');
    overlay.className = 'carrito-overlay';
    overlay.addEventListener('click', cerrarCarrito);

    const panel = document.createElement('aside');
    panel.className = 'carrito-panel';
    panel.innerHTML = `
        <div class="carrito-panel__header">
            <h2 class="carrito-panel__titulo">Tu carrito</h2>
            <button type="button" class="carrito-panel__cerrar" onclick="cerrarCarrito()" aria-label="Cerrar carrito">&times;</button>
        </div>
        <div class="carrito-panel__lista" id="carrito-lista"></div>
        <div class="carrito-panel__footer">
            <div class="carrito-panel__total">
                <span>Total</span>
                <span id="carrito-total">$ 0</span>
            </div>
            <p class="carrito-panel__nota">Próximamente podrás finalizar tu compra desde aquí.</p>
        </div>
    `;

    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.id = 'carrito-toast';

    document.body.appendChild(overlay);
    document.body.appendChild(panel);
    document.body.appendChild(toast);
}

function abrirCarrito() {
    document.querySelector('.carrito-overlay').classList.add('carrito-overlay--activo');
    document.querySelector('.carrito-panel').classList.add('carrito-panel--activo');
    renderizarCarrito();
}

function cerrarCarrito() {
    document.querySelector('.carrito-overlay').classList.remove('carrito-overlay--activo');
    document.querySelector('.carrito-panel').classList.remove('carrito-panel--activo');
}

// boton = el <button> "Agregar al carrito" que se hizo clic
function agregarAlCarrito(boton) {
    const tarjeta = boton.closest('.producto-card');
    if (!tarjeta) return;

    const id = tarjeta.dataset.id;
    const nombre = tarjeta.dataset.nombre;
    const marca = tarjeta.dataset.marca;
    const precio = parseInt(tarjeta.dataset.precio, 10);
    const imagen = tarjeta.dataset.imagen;

    if (!id || !nombre || Number.isNaN(precio)) {
        console.warn('Falta data-id, data-nombre o data-precio en la tarjeta del producto.');
        return;
    }

    const carrito = obtenerCarrito();
    const existente = carrito.find(item => item.id === id);

    if (existente) {
        existente.cantidad += 1;
    } else {
        carrito.push({ id, nombre, marca, precio, imagen, cantidad: 1 });
    }

    guardarCarrito(carrito);
    actualizarBadgeCarrito();
    mostrarToast(`Agregado al carrito: ${nombre}`);
}

function cambiarCantidad(id, delta) {
    const carrito = obtenerCarrito();
    const item = carrito.find(p => p.id === id);
    if (!item) return;

    item.cantidad += delta;

    if (item.cantidad <= 0) {
        eliminarDelCarrito(id);
        return;
    }

    guardarCarrito(carrito);
    renderizarCarrito();
    actualizarBadgeCarrito();
}

function eliminarDelCarrito(id) {
    const carrito = obtenerCarrito().filter(p => p.id !== id);
    guardarCarrito(carrito);
    renderizarCarrito();
    actualizarBadgeCarrito();
}

function renderizarCarrito() {
    const lista = document.getElementById('carrito-lista');
    const totalEl = document.getElementById('carrito-total');
    if (!lista || !totalEl) return;

    const carrito = obtenerCarrito();

    if (carrito.length === 0) {
        lista.innerHTML = '<p class="carrito-panel__vacio">Tu carrito está vacío</p>';
        totalEl.textContent = formatearPrecio(0);
        return;
    }

    let total = 0;

    lista.innerHTML = carrito.map(item => {
        const subtotal = item.precio * item.cantidad;
        total += subtotal;

        return `
            <div class="carrito-item">
                <img class="carrito-item__imagen" src="${item.imagen}" alt="${item.nombre}">
                <div>
                    <span class="carrito-item__marca">${item.marca}</span>
                    <p class="carrito-item__nombre">${item.nombre}</p>
                    <span class="carrito-item__precio">${formatearPrecio(subtotal)}</span>
                    <div class="carrito-item__cantidad">
                        <button type="button" onclick="cambiarCantidad('${item.id}', -1)" aria-label="Restar">&minus;</button>
                        <span>${item.cantidad}</span>
                        <button type="button" onclick="cambiarCantidad('${item.id}', 1)" aria-label="Sumar">+</button>
                    </div>
                </div>
                <button type="button" class="carrito-item__eliminar" onclick="eliminarDelCarrito('${item.id}')" aria-label="Eliminar producto">&times;</button>
            </div>
        `;
    }).join('');

    totalEl.textContent = formatearPrecio(total);
}

function actualizarBadgeCarrito() {
    const link = document.querySelector('.carrito');
    if (!link) return;

    const carrito = obtenerCarrito();
    const cantidadTotal = carrito.reduce((sum, item) => sum + item.cantidad, 0);

    let badge = link.querySelector('.carrito-badge');
    if (!badge) {
        badge = document.createElement('span');
        badge.className = 'carrito-badge';
        link.appendChild(badge);
    }

    badge.textContent = cantidadTotal;
    badge.style.display = cantidadTotal > 0 ? 'inline-flex' : 'none';
}

let toastTimeout;
function mostrarToast(mensaje) {
    const toast = document.getElementById('carrito-toast');
    if (!toast) return;

    toast.textContent = mensaje;
    toast.classList.add('toast--visible');

    clearTimeout(toastTimeout);
    toastTimeout = setTimeout(() => {
        toast.classList.remove('toast--visible');
    }, 2500);
}

document.addEventListener('click', (e) => {
    const link = e.target.closest('.carrito');
    if (link) {
        e.preventDefault();
        abrirCarrito();
    }
});

function esperarEnlaceCarrito(callback) {
    const existente = document.querySelector('.carrito');
    if (existente) {
        callback();
        return;
    }
    const observer = new MutationObserver(() => {
        if (document.querySelector('.carrito')) {
            observer.disconnect();
            callback();
        }
    });
    observer.observe(document.body, { childList: true, subtree: true });
}

document.addEventListener('DOMContentLoaded', () => {
    inicializarPanelCarrito();
    esperarEnlaceCarrito(actualizarBadgeCarrito);
});
