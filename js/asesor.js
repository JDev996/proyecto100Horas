const formulario = document.getElementById("chatFormulario");
const input = document.getElementById("chatInput");
const mensajes = document.getElementById("chatMensajes");

agregarMensaje("¡Hola! Contame qué buscás pues!: una moto económica, de ciudad o de ruta.", "bot");

formulario.addEventListener("submit", (evento) => {
    evento.preventDefault();

    const texto = input.value.trim();
    if (texto === "") {
        return;
    }

    agregarMensaje(texto, "motero");
    const respuesta = obtenerRespuesta(texto);
    agregarMensaje(respuesta, "bot");

    input.value = "";
});

function agregarMensaje(texto, autor) {
    const mensaje = document.createElement("div");
    mensaje.classList.add("mensaje", autor);
    mensaje.innerText = texto;
    mensajes.appendChild(mensaje);
}

function obtenerRespuesta(texto) {
    const mensaje = texto.toLowerCase();

    if (mensaje.includes("economica") || mensaje.includes("barata")) {
        return "Si buscás algo económico, mirá la Bajaj Boxer o la AKT NKD.";
    }
    if (mensaje.includes("ciudad") || mensaje.includes("urbano")) {
        return "Para ciudad, la Yamaha FZ o la Honda CB110 andan bien bueno.";
    }
    if (mensaje.includes("ruta") || mensaje.includes("viajes")) {
        return "Para ruta y viajes, la Royal Enfield Himalayan es una gran opción.";
    }
    if (mensaje.includes("hola") || mensaje.includes("tres b")) {
        return "¡Hola! ¿Qué tipo de moto buscás: económica, de ciudad o de ruta?";
    }
    if (mensaje.includes("moto") || mensaje.includes("run")) {
        return "run runnnn runnnnnnnnnnn :D , intenta otra palabra motero!";
    }

    return "No estoy seguro de que me quieres decir Motero. Prueba preguntando por motos económicas, de ciudad o de ruta. run! :D.";
}