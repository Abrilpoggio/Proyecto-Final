// resetPassword.js

document.addEventListener('DOMContentLoaded', function () {
    const form = document.getElementById('resetForm');
    const mensajeResultado = document.getElementById('mensajeResultado');

    form.addEventListener('submit', async (event) => {
        event.preventDefault(); // Evita el envío tradicional del formulario

        const formData = new FormData(form);
        const data = Object.fromEntries(formData.entries());

        // Validaciones
        if (!data.contacto || !data.newPassword || !data.confirmNewPassword) {
            mensajeResultado.textContent = 'Por favor, complete todos los campos.';
            mensajeResultado.className = 'error';
            return;
        }

        // Opcional: Validar contraseña actual si se incluye en el HTML
        // if (!data.password) {
        //     mensajeResultado.textContent = 'Por favor, ingrese su contraseña actual.';
        //     mensajeResultado.className = 'error';
        //     return;
        // }

        if (data.newPassword !== data.confirmNewPassword) {
            mensajeResultado.textContent = 'Las nuevas contraseñas no coinciden.';
            mensajeResultado.className = 'error';
            return;
        }

        // Preparar datos para enviar (contacto, newPassword, y opcionalmente password)
        const resetData = {
            contacto: data.contacto,
            newPassword: data.newPassword
            // password: data.password // Incluir si se pide la contraseña actual
        };

        try {
            const response = await fetch('http://localhost:8080/api/resetClienteEmail', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(resetData),
            });

            const responseData = await response.json();
            console.log('Respuesta del servidor:', responseData);

            if (responseData.response === 'OK') {
                mensajeResultado.textContent = '¡Contraseña actualizada exitosamente! Redirigiendo a login...';
                mensajeResultado.className = 'success';
                // Opcional: Limpiar el formulario
                form.reset();
                // Redirigir después de un breve delay
                setTimeout(() => {
                    window.location.href = 'loginClient.html';
                }, 2000); // 2 segundos

            } else if (responseData.response === 'ERROR') {
                mensajeResultado.textContent = `Error: ${responseData.message || 'No se pudo actualizar la contraseña.'}`;
                mensajeResultado.className = 'error';
            } else {
                 mensajeResultado.textContent = `Error inesperado: ${JSON.stringify(responseData)}`;
                 mensajeResultado.className = 'error';
            }

        } catch (error) {
            console.error('Error en la solicitud de reset de contraseña:', error);
            mensajeResultado.textContent = 'Error de red o del servidor. Intente nuevamente.';
            mensajeResultado.className = 'error';
        }
    });
});