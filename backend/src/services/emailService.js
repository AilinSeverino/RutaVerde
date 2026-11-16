// backend/src/services/emailService.js

export async function enviarCodigoVerificacion(destinatario, nombreUsuario, codigo) {
  try {
    const apiKey = process.env.RESEND_API_KEY;

    if (!apiKey) {
      return { success: false, error: 'Falta configurar RESEND_API_KEY en el .env' };
    }

    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        from: 'Ruta Verde <onboarding@resend.dev>',
        to: [destinatario],
        subject: 'Tu código de verificación - Ruta Verde',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 480px; margin: auto; padding: 24px; border: 1px solid #e0e0e0; border-radius: 12px;">
            <h2 style="color: #2e7d32;">¡Hola, ${nombreUsuario || 'Usuario'}!</h2>
            <p>Tu código de verificación para ingresar a <strong>Ruta Verde</strong> es:</p>
            <div style="font-size: 32px; font-weight: bold; letter-spacing: 6px; text-align: center; padding: 16px; background: #f1f8e9; color: #1b5e20; border-radius: 8px; margin: 20px 0;">
              ${codigo}
            </div>
            <p style="font-size: 13px; color: #666;">Este código vence en 10 minutos. Si no solicitaste este ingreso, ignorá este mensaje.</p>
          </div>
        `
      })
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('Error Resend API:', data);
      return { success: false, error: data.message || 'Error al enviar correo vía API' };
    }

    return { success: true, id: data.id };
  } catch (error) {
    console.error('Error enviando correo:', error);
    return { success: false, error: error.message };
  }
}

export async function enviarCodigoRecuperacion(destinatario, nombreUsuario, codigo) {
  try {
    const apiKey = process.env.RESEND_API_KEY;

    if (!apiKey) {
      return { success: false, error: 'Falta configurar RESEND_API_KEY en el .env' };
    }

    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        from: 'Ruta Verde <onboarding@resend.dev>',
        to: [destinatario],
        subject: 'Recuperación de contraseña - Ruta Verde',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 480px; margin: auto; padding: 24px; border: 1px solid #e0e0e0; border-radius: 12px;">
            <h2 style="color: #2e7d32;">Recuperación de contraseña</h2>
            <p>Hola ${nombreUsuario || ''}, usá este código para restablecer tu contraseña en <strong>Ruta Verde</strong>:</p>
            <div style="font-size: 32px; font-weight: bold; letter-spacing: 6px; text-align: center; padding: 16px; background: #f1f8e9; color: #1b5e20; border-radius: 8px; margin: 20px 0;">
              ${codigo}
            </div>
            <p style="font-size: 13px; color: #666;">Este código vence en 15 minutos.</p>
          </div>
        `
      })
    });

    const data = await response.json();

    if (!response.ok) {
      return { success: false, error: data.message || 'Error al enviar correo vía API' };
    }

    return { success: true, id: data.id };
  } catch (error) {
    return { success: false, error: error.message };
  }
}