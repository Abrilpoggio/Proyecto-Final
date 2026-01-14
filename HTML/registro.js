// registro.js

document.getElementById('registroForm').addEventListener('submit', function (e) {
    e.preventDefault(); // Evita el comportamiento por defecto (y las burbujas del navegador)

    // Obtener elementos
    const nombre = document.getElementById('nombre');
    const email = document.getElementById('email');
    const password = document.getElementById('password');
    const confirmPassword = document.getElementById('confirmPassword');
    const terminos = document.getElementById('termscondition');
    const mensajeResultado = document.getElementById('mensajeResultado');
    const errorTerminos = document.getElementById('error-terminos');

    // Limpiar mensajes previos
    mensajeResultado.textContent = '';
    mensajeResultado.className = '';
    errorTerminos.style.display = 'none';

    let valido = true;

    // Validar nombre
    if (!nombre.value.trim()) {
        mensajeResultado.textContent = 'El nombre completo es obligatorio.';
        mensajeResultado.className = 'error';
        valido = false;
    }

    // Validar email
    if (!email.value.trim()) {
        mensajeResultado.textContent = 'El correo electrónico es obligatorio.';
        mensajeResultado.className = 'error';
        valido = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value)) {
        mensajeResultado.textContent = 'El correo electrónico no es válido.';
        mensajeResultado.className = 'error';
        valido = false;
    }

    // Validar contraseña
    if (!password.value.trim()) {
        mensajeResultado.textContent = 'La contraseña es obligatoria.';
        mensajeResultado.className = 'error';
        valido = false;
    } else if (password.value !== confirmPassword.value) {
        mensajeResultado.textContent = 'Las contraseñas no coinciden.';
        mensajeResultado.className = 'error';
        valido = false;
    }

    // Validar términos y condiciones
    if (!terminos.checked) {
        errorTerminos.style.display = 'block';
        valido = false;
    }

    // Si todo es válido, enviar
    if (valido) {
        const datos = {
            nombre: nombre.value.trim(),      // ← Ahora usamos el nombre ingresado
            contacto: email.value.trim(),
            password: password.value
        };

        fetch('http://localhost:8080/api/registrarCliente', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(datos)
        })
        .then(response => response.json())
        .then(data => {
            if (data.response === 'OK') {
                mensajeResultado.textContent = 'Registro exitoso. Redirigiendo...';
                mensajeResultado.className = 'success';
                setTimeout(() => {
                    window.location.href = 'loginClient.html';
                }, 1500);
            } else {
                mensajeResultado.textContent = data.message || 'Error al registrar el cliente.';
                mensajeResultado.className = 'error';
            }
        })
        .catch(error => {
            console.error('Error:', error);
            mensajeResultado.textContent = 'Error de conexión con el servidor.';
            mensajeResultado.className = 'error';
        });
    }
});