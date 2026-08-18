document.addEventListener('DOMContentLoaded', () => {
    const formulario = document.querySelector('.contacto-form');

    if (!formulario) {
        return;
    }

    const campos = formulario.querySelectorAll('.campo');
    const nombreInput = campos[0];
    const emailInput = campos[1];
    const mensajeInput = formulario.querySelector('.campo-area');
    const botonEnviar = formulario.querySelector('.btn-enviar');

    if (!nombreInput || !emailInput || !mensajeInput || !botonEnviar) {
        return;
    }

    const mensajeEstado = document.createElement('p');
    mensajeEstado.className = 'contacto-form__estado';
    mensajeEstado.setAttribute('aria-live', 'polite');
    formulario.appendChild(mensajeEstado);

    const mostrarEstado = (texto, tipo = 'success') => {
        mensajeEstado.textContent = texto;
        mensajeEstado.classList.remove('error', 'success');
        mensajeEstado.classList.add(tipo);
        mensajeEstado.style.display = 'block';
    };

    const validarEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

    formulario.addEventListener('submit', (event) => {
        event.preventDefault();

        const nombre = nombreInput.value.trim();
        const email = emailInput.value.trim();
        const mensaje = mensajeInput.value.trim();

        if (!nombre || !email || !mensaje) {
            mostrarEstado('Por favor completa todos los campos.', 'error');
            if (!nombre) nombreInput.focus();
            else if (!email) emailInput.focus();
            else mensajeInput.focus();
            return;
        }

        if (!validarEmail(email)) {
            mostrarEstado('Ingresa un correo electrónico válido.', 'error');
            emailInput.focus();
            return;
        }

        const asunto = encodeURIComponent(`Consulta de ${nombre}`);
        const cuerpo = encodeURIComponent(
            `Nombre: ${nombre}\n` +
            `Correo: ${email}\n\n` +
            `Mensaje:\n${mensaje}`
        );

        const mailtoUrl = `mailto:jajmotos@rutasegura.com?subject=${asunto}&body=${cuerpo}`;

        mostrarEstado('Tu mensaje ha sido preparado. Si tu cliente de correo no se abre, envía el formulario manualmente a jajmotos@rutasegura.com.', 'success');
        formulario.reset();

        setTimeout(() => {
            window.location.href = mailtoUrl;
        }, 250);
    });
});
