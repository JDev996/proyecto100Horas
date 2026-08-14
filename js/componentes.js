fetch("componentes/header.html")
    .then(respuesta => respuesta.text())
    .then(html => {
        document.getElementById("header").innerHTML = html;

        const paginaActual = window.location.pathname.split('/').pop() || 'index.html';
        document.querySelectorAll('.menu-link').forEach(link => {
            const href = link.getAttribute('href');
            if (href === paginaActual) {
                link.classList.add('paginaActual');
            }
        });
    });

fetch("componentes/footer.html")
    .then(respuesta => respuesta.text())
    .then(html => {
        document.getElementById("footer").innerHTML = html;
    });
