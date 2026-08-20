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

        const asesorBoton = document.getElementById("asesorBoton");
        const asesorPanel = document.getElementById("asesorPanel");

        asesorBoton.addEventListener("click", () => {
            asesorPanel.classList.toggle("oculto");
        });

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
            enviarMensaje(texto);
            input.value = "";
        });

        document.querySelectorAll(".respuestaRapida").forEach((boton) => {
            boton.addEventListener("click", () => {
                enviarMensaje(boton.innerText);
            });
        });

        function agregarMensaje(texto, autor) {
            const mensaje = document.createElement("div");
            mensaje.classList.add("mensaje", autor);
            mensaje.innerText = texto;
            mensajes.appendChild(mensaje);
            mensajes.scrollTop = mensajes.scrollHeight;
        }

        function enviarMensaje(texto) {
            agregarMensaje(texto, "motero");
            setTimeout(() => {
                const respuesta = obtenerRespuesta(texto);
                agregarMensaje(respuesta, "bot");
            }, 600);
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
    });