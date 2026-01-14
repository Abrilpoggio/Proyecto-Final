# Proyecto Final - Sistema de Mesa de Ayuda

Este proyecto es una aplicación web desarrollada como parte de un trabajo práctico final. Permite a los usuarios registrarse, iniciar sesión, restablecer su contraseña y gestionar tickets de soporte técnico.

## Tecnologías Utilizadas

- **Frontend:** HTML, CSS, JavaScript
- **Backend:** Node.js, Express (opcional si lo usaste)
- **Base de Datos:** AWS DynamoDB
- **APIs:** AWS SDK para Node.js

## Características Principales

- Registro e inicio de sesión de usuarios por email.
- Funcionalidad para restablecer contraseña.
- Listado de tickets de soporte (frontend).
- Validaciones en el frontend y backend.
- Manejo de errores.

## Notas

- El proyecto está configurado para conectarse a una base de datos AWS DynamoDB.
- **Las credenciales de AWS (`accessKeyId.js`, `secretAccessKey.js`) no están incluidas por razones de seguridad.**
- Para ejecutar el proyecto localmente, se requiere una cuenta de AWS con los permisos adecuados y la creación de las tablas necesarias (por ejemplo, `cliente`, `ticket`).

## Propósito

Este repositorio sirve como ejemplo de mis habilidades en desarrollo web backend/frontend y manejo de bases de datos NoSQL.
