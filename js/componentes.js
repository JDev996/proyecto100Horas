fetch("componentes/header.html")
    .then(respuesta => respuesta.text())
    .then(html => {
        document.getElementById("header").innerHTML = html;
    });

fetch("componentes/footer.html")
    .then(respuesta => respuesta.text())
    .then(html => {
        document.getElementById("footer").innerHTML = html;
    });
