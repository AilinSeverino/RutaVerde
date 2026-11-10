import nodemailer from 'nodemailer';

// Se crea al enviar para garantizar que process.env ya esté cargado
function crearTransporte() {
    return nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.GMAIL_USER,
            pass: process.env.GMAIL_APP_PASSWORD
        }
    });
}

async function enviarCorreo({ email, asunto, html }) {
    if (!process.env.GMAIL_USER || !process.env.GMAIL_APP_PASSWORD) {
        console.error('Faltan GMAIL_USER o GMAIL_APP_PASSWORD en el .env');
        return { success: false, error: 'El envío de correos no está configurado.' };
    }

    try {
        const info = await crearTransporte().sendMail({
            from: `Ruta Verde <${process.env.GMAIL_USER}>`,
            to: email,
            subject: asunto,
            html
        });
        console.log('--- CORREO ENVIADO VÍA GMAIL ---', info.messageId, '->', email);
        return { success: true, data: info };
    } catch (error) {
        console.error('Error enviando correo:', error);
        return { success: false, error: error.message };
    }
}

export async function enviarCodigoVerificacion(email, nombre, codigo) {
    return enviarCorreo({
        email,
        asunto: 'Ruta Verde - Código de verificación',
        html: `
            <div style="font-family: Arial, sans-serif; padding: 20px; border: 1px solid #eee; border-radius: 8px;">
                <h2 style="color: #2e7d32;">¡Hola ${nombre || 'Usuario'}!</h2>
                <p>Tu código de verificación para iniciar sesión en Ruta Verde es:</p>
                <h1 style="color: #4CAF50; letter-spacing: 5px; font-size: 32px; background: #f4f4f4; padding: 10px; display: inline-block; border-radius: 4px;">${codigo}</h1>
                <p>Este código expira en 10 minutos.</p>
            </div>
        `
    });
}

export async function enviarCodigoRecuperacion(email, nombre, codigo) {
    return enviarCorreo({
        email,
        asunto: 'Ruta Verde - Recuperación de contraseña',
        html: `
            <div style="font-family: Arial, sans-serif; padding: 20px; border: 1px solid #eee; border-radius: 8px;">
                <h2 style="color: #2e7d32;">Hola ${nombre || 'Usuario'}</h2>
                <p>Usá este código para cambiar la contraseña de tu cuenta de Ruta Verde:</p>
                <h1 style="color: #4CAF50; letter-spacing: 5px; font-size: 32px; background: #f4f4f4; padding: 10px; display: inline-block; border-radius: 4px;">${codigo}</h1>
                <p>El código vence en 15 minutos. Si no pediste este cambio, ignorá este correo.</p>
            </div>
        `
    });
}
