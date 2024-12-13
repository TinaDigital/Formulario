import { Resend } from 'resend';
import { NextResponse } from 'next/server';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request) {
  try {
    const formData = await request.json();
    console.log('Datos recibidos:', formData);

    const emailData = {
      from: 'onboarding@resend.dev',
      to: 'tinadigital.ok@gmail.com',
      subject: `Nueva Solicitud de Desarrollo Web - ${formData.businessName}`,
      html: `
        <div style="padding: 30px; background-color: #f5f5f5; font-family: Arial, sans-serif;">
          <h1 style="color: #1a4a5e; text-align: center; margin-bottom: 30px;">Nueva Solicitud de Desarrollo Web</h1>
          
          <div style="background-color: white; padding: 25px; border-radius: 10px; box-shadow: 0 2px 5px rgba(0,0,0,0.1);">
            <h2 style="color: #333; border-bottom: 2px solid #87CEEB; padding-bottom: 10px;">Información del Negocio</h2>
            <p><strong>Nombre del Negocio:</strong> ${formData.businessName}</p>
            <p><strong>Industria:</strong> ${formData.industryType}</p>
            
            <h2 style="color: #333; border-bottom: 2px solid #87CEEB; padding-bottom: 10px; margin-top: 25px;">Detalles del Proyecto</h2>
            <p><strong>Propósito del Sitio Web:</strong> ${formData.websitePurpose}</p>
            <p><strong>Público Objetivo:</strong> ${formData.targetAudience}</p>
            
            <h2 style="color: #333; border-bottom: 2px solid #87CEEB; padding-bottom: 10px; margin-top: 25px;">Características Deseadas</h2>
            <ul style="list-style-type: none; padding-left: 0;">
              ${formData.desiredFeatures.map(feature => `<li style="margin: 5px 0;">• ${feature}</li>`).join('')}
            </ul>
            
            <h2 style="color: #333; border-bottom: 2px solid #87CEEB; padding-bottom: 10px; margin-top: 25px;">Gestión y Diseño</h2>
            <p><strong>Gestión de Contenido:</strong> ${formData.contentManagement}</p>
            <p><strong>Preferencias de Diseño:</strong> ${formData.designPreferences}</p>
            <p><strong>Sitios Web de Referencia:</strong> ${formData.competitorWebsites}</p>
            
            <h2 style="color: #333; border-bottom: 2px solid #87CEEB; padding-bottom: 10px; margin-top: 25px;">Presupuesto y Tiempo</h2>
            <p><strong>Presupuesto:</strong> ${formData.budget}</p>
            <p><strong>Fecha Límite:</strong> ${formData.deadline}</p>
            
            ${formData.additionalComments ? `
              <h2 style="color: #333; border-bottom: 2px solid #87CEEB; padding-bottom: 10px; margin-top: 25px;">Comentarios Adicionales</h2>
              <p>${formData.additionalComments}</p>
            ` : ''}
          </div>
          
          <p style="color:#898989; font-size:12px; margin-top:20px; text-align: center;">
            Esta solicitud fue enviada desde el formulario de desarrollo web de Tina Digital
          </p>
        </div>
      `,
      text: `
        Nueva Solicitud de Desarrollo Web
        
        INFORMACIÓN DEL NEGOCIO
        Nombre: ${formData.businessName}
        Industria: ${formData.industryType}
        
        DETALLES DEL PROYECTO
        Propósito: ${formData.websitePurpose}
        Público Objetivo: ${formData.targetAudience}
        
        CARACTERÍSTICAS DESEADAS
        ${formData.desiredFeatures.join(', ')}
        
        GESTIÓN Y DISEÑO
        Gestión de Contenido: ${formData.contentManagement}
        Preferencias de Diseño: ${formData.designPreferences}
        Referencias: ${formData.competitorWebsites}
        
        PRESUPUESTO Y TIEMPO
        Presupuesto: ${formData.budget}
        Fecha Límite: ${formData.deadline}
        
        COMENTARIOS ADICIONALES
        ${formData.additionalComments || 'Ninguno'}
      `
    };

    console.log('Intentando enviar email con:', emailData);

    const data = await resend.emails.send(emailData);
    console.log('Respuesta de Resend:', data);

    if (data.error) {
      console.error('Error de Resend:', data.error);
      return NextResponse.json(
        { success: false, error: data.error },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      messageId: data.id,
      message: 'Email enviado correctamente'
    });

  } catch (error) {
    console.error('Error detallado:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}