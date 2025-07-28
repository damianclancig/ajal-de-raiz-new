
'use server';

import { toast } from '@/hooks/use-toast';

async function sendEmail(formData: FormData): Promise<void> {
  const apiKey = process.env.MAILEROO_API_KEY;

  if (!apiKey) {
    console.error('Maileroo API key is not configured.');
    throw new Error('Email service is not configured.');
  }

  try {
    const response = await fetch('https://smtp.maileroo.com/send', {
      method: 'POST',
      headers: {
        'X-API-Key': apiKey,
      },
      body: formData,
    });
    
    if (!response.ok) {
        const errorBody = await response.json().catch(() => ({ message: 'Failed to parse error response' }));
        const errorMessage = `Error ${response.status} ${response.statusText}: ${errorBody.message || 'Failed to send email'}`;
        console.error('Maileroo API Error:', errorMessage);
        throw new Error(errorMessage);
    }
  } catch (error) {
    console.error('Error sending email:', error);
    throw error;
  }
}

export async function sendPasswordResetEmail(to: string, name: string, resetUrl: string): Promise<void> {
    const fromEmail = process.env.MAILEROO_FROM_EMAIL;
    if (!fromEmail) {
        console.error('Maileroo From Email is not configured.');
        throw new Error('Email service is not properly configured.');
    }

    const subject = 'Restablece tu contraseña de Ajal de Raiz';
    
    const plainBody = `Hola ${name},\n\nPara restablecer tu contraseña, usa el siguiente enlace:\n${resetUrl}\n\nSi no solicitaste esto, ignora este correo.\n\nEl equipo de Ajal de Raiz`;
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
    formData.append('from', `Ajal de Raiz <${fromEmail}>`);
    formData.append('to', to);
    formData.append('subject', subject);
    formData.append('plain', plainBody);
    formData.append('html', htmlBody);

    await sendEmail(formData);
    console.log('Password reset email sent successfully to:', to);
}

export async function sendContactRequestEmail(userEmail: string, message: string): Promise<void> {
    const toEmail = process.env.MAILEROO_TO_CONTACT;
    const fromEmail = process.env.MAILEROO_FROM_EMAIL;

    if (!toEmail || !fromEmail) {
        console.error('Maileroo From Email is not configured for receiving contacts.');
        throw new Error('Contact email receiver is not configured.');
    }

    const subject = `Nueva consulta de: ${userEmail}`;
    const plainBody = `El usuario con el correo electrónico ${userEmail} ha enviado el siguiente mensaje:\n\n${message}`;
    const htmlBody = `
        <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
            <div style="max-width: 600px; margin: 20px auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px;">
                <h2 style="color: #10B981;">Nueva Consulta desde la Web</h2>
                <p>Has recibido un nuevo mensaje a través del formulario de contacto de tu web.</p>
                <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;" />
                <p><strong>Email del usuario:</strong> <a href="mailto:${userEmail}" style="color: #10B981;">${userEmail}</a></p>
                <div style="margin-top: 20px; padding: 15px; background-color: #f9f9f9; border-left: 4px solid #10B981;">
                    <p><strong>Mensaje:</strong></p>
                    <p style="white-space: pre-wrap; margin: 0;">${message}</p>
                </div>
                 <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;" />
                <p>Por favor, ponte en contacto con esta persona a la brevedad.</p>
            </div>
        </div>
    `;

    const formData = new FormData();
    // Use a valid, verified sender email address.
    formData.append('from', `Ajal de Raiz <${fromEmail}>`);
    formData.append('to', toEmail);
    formData.append('subject', subject);
    formData.append('plain', plainBody);
    formData.append('html', htmlBody);

    await sendEmail(formData);
    console.log('Contact request email sent successfully for:', userEmail);
}
