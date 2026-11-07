import { Resend } from 'resend';

export async function enviarCodigoVerificacion(email, nombre, codigo) {
    try {
        // Inicializamos Resend justo al enviar para garantizar que lea process.env
        const resend = new Resend(process.env.RESEND_API_KEY);

        const data = await resend.emails.send({
            from: process.env.RESEND_FROM_EMAIL || 'onboarding@resend.dev',
            to: email,
            subject: 'Ruta Verde - Código de verificación',
            html: `
                <div style="font-family: Arial, sans-serif; padding: 20px; border: 1px solid #eee; border-radius: 8px;">
                    <h2 style="color: #2e7d32;">¡Hola ${nombre || 'Usuario'}!</h2>
                    <p>Tu código de verificación para iniciar sesión en Ruta Verde es:</p>
                    <h1 style="color: #4CAF50; letter-spacing: 5px; font-size: 32px; background: #f4f4f4; padding: 10px; display: inline-block; border-radius: 4px;">${codigo}</h1>
                    <p>Este código expira en 10 minutos.</p>
                </div>
            `
        });

        if (data.error) {
            console.error('Error reportado por Resend:', data.error);
            return { success: false, error: data.error.message };
        }

        console.log('--- ¡CORREO ENVIADO CON ÉXITO VÍA RESEND! ---', data.id);
        return { success: true, data };

    } catch (error) {
        console.error('Error enviando correo:', error);
        return { success: false, error: error.message };
    }
}

export async function enviarCodigoRecuperacion(email, nombre, codigo) {
    try {
        const resend = new Resend(process.env.RESEND_API_KEY);
        const data = await resend.emails.send({
            from: process.env.RESEND_FROM_EMAIL || 'onboarding@resend.dev',
            to: email,
            subject: 'Ruta Verde - Recuperación de contraseña',
            html: `
                <div style="font-family: Arial, sans-serif; padding: 20px; border: 1px solid #eee; border-radius: 8px;">
                    <h2 style="color: #2e7d32;">Hola ${nombre || 'Usuario'}</h2>
                    <p>Usá este código para cambiar la contraseña de tu cuenta de Ruta Verde:</p>
                    <h1 style="color: #4CAF50; letter-spacing: 5px; font-size: 32px; background: #f4f4f4; padding: 10px; display: inline-block; border-radius: 4px;">${codigo}</h1>
                    <p>El código vence en 15 minutos. Si no pediste este cambio, ignorá este correo.</p>
                </div>
            `
        });

        if (data.error) {
            console.error('Error reportado por Resend al recuperar contraseña:', data.error);
            return { success: false, error: data.error.message };
        }

        return { success: true };
    } catch (error) {
        console.error('Error enviando código de recuperación:', error);
        return { success: false, error: error.message };
    }
}