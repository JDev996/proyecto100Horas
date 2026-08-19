document.addEventListener('DOMContentLoaded', () => {
    const formulario = document.getElementById('contacto-form');
    const botonEnviar = formulario?.querySelector('.btn-enviar');
    const estadoExito = formulario?.querySelector('.contacto-form__estado--success');
    const estadoError = formulario?.querySelector('.contacto-form__estado--error');

    if (!formulario || !botonEnviar || !estadoExito || !estadoError) return;

    formulario.addEventListener('submit', (event) => {
        event.preventDefault();

        estadoExito.textContent = '';
        estadoError.textContent = '';
        botonEnviar.disabled = true;
        botonEnviar.textContent = 'Enviando...';

        const serviceID = 'default_service';
        const templateID = 'template_d95sjfs';

        emailjs.sendForm(serviceID, templateID, formulario)
            .then(() => {
                botonEnviar.disabled = false;
                botonEnviar.textContent = 'Enviar mensaje →';
                estadoExito.textContent = 'Consulta recibida. Un asesor se comunicará contigo pronto.';
                estadoExito.style.display = 'block';
                formulario.reset();
            })
            .catch((error) => {
                botonEnviar.disabled = false;
                botonEnviar.textContent = 'Enviar mensaje →';
                estadoError.textContent = 'No fue posible enviar la consulta. Intenta nuevamente.';
                estadoError.style.display = 'block';
                console.error('Error de EmailJS:', error);
            });
    });
});
