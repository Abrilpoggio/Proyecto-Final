// loginClient.js

// Esperamos a que el DOM esté completamente cargado
document.addEventListener('DOMContentLoaded', function () {
    // Obtenemos el formulario por su clase
    const form = document.querySelector('.form');

    // Agregamos un listener para el evento 'submit' del formulario
    form.addEventListener('submit', async function (event) {
        // Prevenimos el comportamiento por defecto del formulario (recargar la página)
        event.preventDefault();

        console.log("Application Server: Revisa el valor del form:");

        // Capturamos los datos del formulario directamente
        const contacto = document.getElementById('contacto').value.trim();
        const password = document.getElementById('password').value;
        const terminos = document.getElementById('termscondition'); // Checkbox

        // Limpiar mensajes previos
        document.getElementById('resultado1').textContent = '';
        document.getElementById('resultado2').textContent = '';
        document.getElementById('resultado2').style.display = 'none'; // Asegura que esté oculto al empezar

        // Validamos que los campos requeridos estén presentes
        if (!contacto || !password) {
            document.getElementById('resultado1').style.color = 'RED';
            document.getElementById('resultado1').textContent = 'Por favor, complete todos los campos.';
            return;
        }

        // ✅ Validación personalizada de términos y condiciones (sin burbuja del navegador)
        if (!terminos || !terminos.checked) {
            console.log('No aceptó los T&C, no se puede loggear');
            document.getElementById('resultado2').style.textAlign = 'center';
            document.getElementById('resultado2').style.color = 'RED';
            document.getElementById('resultado2').style.display = 'block'; // Asegura visibilidad
            document.getElementById('resultado2').textContent = 'Debe aceptar los T&C para poder usar el sistema';
            return;
        }

        // --- Llamada a la nueva API ---
        console.log("API REST: http://localhost:8080/api/loginClienteEmail");
        console.log({ contacto, password });

        const options = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                contacto: contacto,
                password: password
            })
        };

        console.log("options", JSON.stringify(options));

        try {
            const response = await fetch('http://localhost:8080/api/loginClienteEmail', options);

            if (!response.ok) {
                throw new Error(`Error en la respuesta del servidor: ${response.status} ${response.statusText}`);
            }

            const responseData = await response.json();
            console.log("Respuesta de la API:", JSON.stringify(responseData));

            if (responseData.response === 'OK' && responseData.id) {
                console.log('Login correcto según nueva API.');

                const userId = responseData.id;

                // Llamada a la API para obtener los datos del cliente
                const getUserDetailsResponse = await fetch(`http://localhost:8080/api/getCliente/${userId}`, {
                    method: 'POST',
                });

                if (!getUserDetailsResponse.ok) {
                    throw new Error(`Error obteniendo datos del usuario: ${getUserDetailsResponse.status} ${getUserDetailsResponse.statusText}`);
                }

                const userDetailData = await getUserDetailsResponse.json();

                if (userDetailData.response === 'OK' && userDetailData.cliente) {
                    const user = userDetailData.cliente;

                    // ✅ Eliminamos el mensaje de bienvenida
                    // document.getElementById('resultado1').style.color = 'BLACK';
                    // document.getElementById('resultado1').textContent = `Bienvenido al sistema ${user.nombre}, último ingreso ${user.fecha_ultimo_ingreso}`;

                    // ✅ Redirigimos INMEDIATAMENTE sin mostrar nada
                    const urlParams = new URLSearchParams({
                        id: user.id,
                        nombre: user.nombre,
                        contacto: user.contacto,
                        fecha_ultimo_ingreso: user.fecha_ultimo_ingreso,
                        mode: 'LOCAL'
                    });
                    window.location.href = `listarTicket.html?${urlParams.toString()}`;

                } else {
                    console.error('Error: No se pudieron obtener los datos del usuario después del login exitoso.');
                    document.getElementById('resultado1').style.color = 'RED';
                    document.getElementById('resultado1').textContent = 'Error al obtener datos del usuario.';
                }

            } else if (responseData.response === 'invalido') {
                console.log('La contraseña o el correo electrónico son incorrectos (según nueva API).');
                document.getElementById('resultado1').style.color = 'RED';
                document.getElementById('resultado1').textContent = 'Error de login, correo o contraseña incorrectos.';
            } else {
                console.error('Error inesperado en la respuesta de login:', responseData);
                document.getElementById('resultado1').style.color = 'RED';
                document.getElementById('resultado1').textContent = 'Error inesperado en el servidor.';
            }

        } catch (error) {
            console.error('Error en la comunicación con el servidor:', error);
            document.getElementById('resultado1').style.color = 'RED';
            document.getElementById('resultado1').textContent = `Error en la comunicación con el servidor: ${error.message}`;
        }
    });
});