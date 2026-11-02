import { client } from '../config/iaConfig.js';

export const mejorarNoticiaService = async (titulo, descripcion) => {
  const prompt = `
Eres un editor periodístico profesional especializado en noticias medioambientales para el portal "Ruta Verde".
Tu tarea es tomar el título y borrador de una noticia y reescribirlos para que sean más atractivos, claros y profesionales en español.

Borrador:
- Título: "${titulo || ''}"
- Contenido: "${descripcion || ''}"

Responde ÚNICAMENTE con un objeto JSON válido con la siguiente estructura exacta:
{
  "titulo": "Título mejorado y atrapante",
  "descripcion": "Contenido reescrito, fluido y profesional"
}
`;

  try {
    if (!client || !client.chat || !client.chat.completions) {
      throw new Error('La configuración de IA no está disponible.');
    }

    const response = await client.chat.completions.create({
      model: 'openai/gpt-oss-20b', // 👈 El modelo de Groq que pediste
      messages: [
        {
          role: 'user',
          content: prompt,
        },
      ],
      response_format: { type: 'json_object' },
    });

    const rawText = response.choices[0]?.message?.content || '{}';
    return JSON.parse(rawText);
  } catch (error) {
    console.error('Error en el servicio de IA con Groq:', error);
    throw new Error(`Error en la IA: ${error.message}`);
  }
};