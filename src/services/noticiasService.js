import { supabase } from '../config/supabase.js';

export const crearNoticia = async ({ titulo, subtitulo, cuerpo, id_usuario, file }) => {
  let url_foto = null;

  // Si se adjuntó una imagen, la subimos a Supabase Storage
  if (file) {
    const fileExt = file.originalname.split('.').pop();
    const fileName = `${Date.now()}_${Math.random().toString(36).substring(2, 8)}.${fileExt}`;
    const filePath = `noticias/${fileName}`;

    // ⚠️ Se actualiza el nombre del bucket a 'imagenes_noticias'
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('imagenes_noticias') 
      .upload(filePath, file.buffer, {
        contentType: file.mimetype,
      });

    if (uploadError) {
      throw new Error(`Error al subir la imagen: ${uploadError.message}`);
    }

    // Obtenemos la URL pública usando el bucket correcto
    const { data: publicUrlData } = supabase.storage
      .from('imagenes_noticias')
      .getPublicUrl(filePath);

    url_foto = publicUrlData.publicUrl;
  }

  // Insertamos el registro en la tabla Noticias
  const { data, error } = await supabase
    .from('Noticias')
    .insert([
      {
        titulo,
        subtitulo: subtitulo || null,
        cuerpo,
        url_foto,
        id_usuario,
        fecha_publicacion: new Date().toISOString()
      }
    ])
    .select();

  if (error) {
    throw new Error(error.message);
  }

  return data[0];
};

export async function obtenerNoticias() {
  const result = await import('./noticiaService.js');
  const data = await result.obtenerTodasLasNoticias();
  return data.success ? data.data : [];
}