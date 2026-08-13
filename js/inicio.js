const motos = document.querySelectorAll(".carrusel img");
let fotoActual = 0;

motos[fotoActual].classList.add("fotoActiva");

const intervaloFotos = setInterval(() => {
    motos[fotoActual].classList.remove("fotoActiva");
    fotoActual = fotoActual + 1;
    if (fotoActual === motos.length) {
        fotoActual = 0;
    }
    motos[fotoActual].classList.add("fotoActiva");
}, 3000);

