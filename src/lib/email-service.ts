
'use server';

export async function sendPasswordResetEmail(to: string, name: string, resetUrl: string): Promise<void> {
    const apiKey = process.env.MAILEROO_API_KEY;
    const fromEmail = process.env.MAILEROO_FROM_EMAIL;

    if (!apiKey || !fromEmail) {
        console.error('Maileroo API key or From Email is not configured.');
        throw new Error('Email service is not configured.');
    }

    const subject = 'Restablece tu contraseña de Ajal de Raiz';
    
    const plainBody = `
        Hola ${name},
        
        Para restablecer tu contraseña, usa el siguiente enlace:
        ${resetUrl}
        
        Si no solicitaste esto, ignora este correo.
        
        El equipo de Ajal de Raiz
    `;

    const htmlBody = `
        <div style="font-family: Arial, sans-serif; line-height: 1.6;">
            <div style="max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px;">
                <h2 style="color: #333;">Restablece tu Contraseña</h2>
                <p>Hola ${name},</p>
                <p>Recibimos una solicitud para restablecer la contraseña de tu cuenta en Ajal de Raiz. Haz clic en el botón de abajo para establecer una nueva contraseña:</p>
                <p style="text-align: center;">
                    <a href="${resetUrl}" style="display: inline-block; padding: 12px 24px; background-color: #10B981; color: #ffffff; text-decoration: none; border-radius: 5px; font-weight: bold;">
                        Restablecer Contraseña
                    </a>
                </p>
                <p>Si el botón no funciona, copia y pega la siguiente URL en tu navegador:</p>
                <p><a href="${resetUrl}">${resetUrl}</a></p>
                <p>Si no solicitaste un restablecimiento de contraseña, puedes ignorar este correo electrónico de forma segura.</p>
                <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;" />
                <p style="font-size: 0.9em; color: #777;">Saludos,<br/>El equipo de Ajal de Raiz</p>
            </div>
        </div>
    `;

    const formData = new FormData();
    formData.append('from', fromEmail);
    formData.append('to', to);
    formData.append('subject', subject);
    formData.append('plain', plainBody);
    formData.append('html', htmlBody);

    try {
        const response = await fetch('https://smtp.maileroo.com/send', {
            method: 'POST',
            headers: {
                'X-API-Key': apiKey,
            },
            body: formData,
        });

        if (!response.ok) {
            const errorBody = await response.json();
            const errorMessage = `Error ${response.status}: ${errorBody.message || 'Failed to send email'}`;
            console.error('Maileroo API Error:', errorMessage);
            throw new Error(errorMessage);
        }

        console.log('Password reset email sent successfully to:', to);

    } catch (error) {
        console.error('Error sending password reset email:', error);
        // Re-throw the error so the action can catch the detailed message
        throw error;
    }
}
