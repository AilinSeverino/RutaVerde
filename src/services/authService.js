import { supabase } from '../config/supabase.js';
import bcrypt from 'bcrypt';

export async function registro(nombre, email, contrasenia, region) {
  try {
    // --- 1. VALIDACIONES DE ENTRADA ---
    
    // Campos requeridos
    if (!nombre || !nombre.trim()) {
        return { success: false, error: 'El nombre es obligatorio.' };
    }
    if (!email || !email.trim()) {
        return { success: false, error: 'El correo electrónico es obligatorio.' };
    }
    if (!contrasenia) {
        return { success: false, error: 'La contraseña es obligatoria.' };
    }
    if (!region || isNaN(parseInt(region))) {
        return { success: false, error: 'Debes seleccionar una región válida.' };
    }

    // Formato de Email
    const emailNormalizado = email.trim().toLowerCase();
    const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!regexEmail.test(emailNormalizado)) {
        return { success: false, error: 'El formato del correo electrónico no es válido.' };
    }

    // Fortaleza de la Contraseña (mínimo 8 caracteres, al menos 1 letra y 1 número)
    if (contrasenia.length < 8) {
        return { success: false, error: 'La contraseña debe tener al menos 8 caracteres.' };
    }
    const regexPasswordSegura = /^(?=.*[A-Za-z])(?=.*\d)/;
    if (!regexPasswordSegura.test(contrasenia)) {
        return { success: false, error: 'La contraseña debe contener al menos una letra y un número.' };
    }

    // --- 2. VALIDACIÓN DE DISPONIBILIDAD EN BD ---

    const { data: usuarioExistente } = await supabase
        .from('Usuarios')
        .select('email')
        .eq('email', emailNormalizado)
        .maybeSingle();

    if (usuarioExistente) {
        return { success: false, error: 'El correo electrónico ya está registrado.' };
    }

    // --- 3. INSERCIÓN DE DATOS ---

    const saltRounds = 10;
    const contraseniaEncriptada = await bcrypt.hash(contrasenia, saltRounds);

    const { data: nuevoUsuario, error: dbError } = await supabase
        .from('Usuarios')
        .insert([
            { 
                nombreC: nombre.trim(),
                email: emailNormalizado, 
                contrasena: contraseniaEncriptada,
                id_region: parseInt(region),
                id_rol: 2,
                fechaR: new Date().toISOString()
            }
        ])
        .select();

    if (dbError) {
        return { success: false, error: `Error en BD: ${dbError.message}` };
    }

    return { success: true, message: 'Usuario registrado con éxito.', data: nuevoUsuario[0] };

  } catch (error) {
    return { success: false, error: error.message };
  }
}

export async function login(email, contrasenia) {
  if (!email || !contrasenia) {
    return null;
  }

  const emailNormalizado = email.trim().toLowerCase();

  const { data: usuario, error } = await supabase
    .from('Usuarios')
    .select('*')
    .eq('email', emailNormalizado)
    .maybeSingle();

  if (error || !usuario) {
    return null;
  }

  const contraseniaValida = await bcrypt.compare(contrasenia, usuario.contrasena);
  if (!contraseniaValida) {
    return null;
  }

  const { contrasena, ...usuarioSeguro } = usuario;
  return usuarioSeguro;
}

// 1. SOLICITAR LOGIN (Genera y guarda el código 2FA)
export async function solicitarLogin(email, contrasenia) {
    try {
        const emailNormalizado = (email || '').trim().toLowerCase();
        const { data: usuario, error } = await supabase
            .from('Usuarios')
            .select('*')
            .eq('email', emailNormalizado)
            .maybeSingle();

        if (error || !usuario) {
            return { success: false, error: 'Correo o contraseña incorrectos.' };
        }

        const contraseniaValida = await bcrypt.compare(contrasenia, usuario.contrasena);
        
        if (!contraseniaValida) {
            return { success: false, error: 'Correo o contraseña incorrectos.' };
        }

        const codigo = Math.floor(100000 + Math.random() * 900000).toString();
        const expiracion = new Date(Date.now() + 10 * 60 * 1000).toISOString();

        const { error: updateError } = await supabase
            .from('Usuarios')
            .update({ codigo_2fa: codigo, expiracion_2fa: expiracion })
            .eq('id_usuario', usuario.id_usuario);

        if (updateError) {
            console.error('Error al guardar código 2FA en Supabase:', updateError.message);
            return { success: false, error: 'Error al generar el código de verificación.' };
        }

        const { contrasena, ...usuarioSeguro } = usuario;
        return { success: true, requiereCodigo: true, usuario: usuarioSeguro, codigo };

    } catch (error) {
        return { success: false, error: error.message };
    }
}

// 2. VERIFICAR CÓDIGO INGRESADO
export async function verificarCodigoLogin(email, codigoIngresado) {
    try {
        const { data: usuario, error } = await supabase
            .from('Usuarios')
            .select('*')
            .eq('email', email)
            .maybeSingle();

        if (error || !usuario || !usuario.codigo_2fa) {
            return { success: false, error: 'Código inválido o sesión no iniciada.' };
        }

        if (new Date() > new Date(usuario.expiracion_2fa)) {
            return { success: false, error: 'El código ha expirado. Vuelve a iniciar sesión.' };
        }

        if (usuario.codigo_2fa !== codigoIngresado.trim()) {
            return { success: false, error: 'El código ingresado es incorrecto.' };
        }

        await supabase
            .from('Usuarios')
            .update({ codigo_2fa: null, expiracion_2fa: null })
            .eq('id_usuario', usuario.id_usuario);

        const { contrasena, ...usuarioSeguro } = usuario;
        return { success: true, usuario: usuarioSeguro };

    } catch (error) {
        return { success: false, error: error.message };
    }
}

export async function actualizarNombreUsuario(idUsuario, nuevoNombre) {
    try {
        const { data, error } = await supabase
            .from('Usuarios')
            .update({ nombreC: nuevoNombre.trim() })
            .eq('id_usuario', parseInt(idUsuario))
            .select();

        if (error) {
            return { success: false, error: error.message };
        }

        if (!data || data.length === 0) {
            return { success: false, error: 'Usuario no encontrado.' };
        }

        const { contrasena, ...usuarioSeguro } = data[0];
        return { success: true, message: 'Nombre actualizado correctamente.', data: usuarioSeguro };

    } catch (error) {
        return { success: false, error: error.message };
    }
}

export async function subirFotoPerfil(idUsuario, archivoFoto) {
    try {
        if (!archivoFoto) {
            return { success: false, error: 'No se recibió ninguna imagen.' };
        }

        const base64Imagen = `data:${archivoFoto.mimetype};base64,${archivoFoto.buffer.toString('base64')}`;

        const { data, error } = await supabase
            .from('Usuarios')
            .update({ fotoPerfil: base64Imagen })
            .eq('id_usuario', parseInt(idUsuario))
            .select();

        if (error) {
            return { success: false, error: `Error en BD: ${error.message}` };
        }

        return { success: true, fotoPerfil: base64Imagen };
    } catch (error) {
        return { success: false, error: error.message };
    }
}

export const actualizarNombreUsuarioService = async (idUsuario, nombre) => {
  const { data, error } = await supabase
    .from('Usuarios')
    .update({ nombreC: nombre.trim() })
    .eq('id_usuario', idUsuario)
    .select();

  if (error) {
    throw new Error(`Error al actualizar el nombre: ${error.message}`);
  }

  return data[0];
};

export const actualizarFotoPerfilService = async (idUsuario, archivo) => {
  const nombreBucket = 'PerfilFoto'; 

  const fileExt = archivo.originalname.split('.').pop();
  const fileName = `${idUsuario}_${Date.now()}.${fileExt}`;

  const { error: uploadError } = await supabase.storage
    .from(nombreBucket)
    .upload(fileName, archivo.buffer, {
      contentType: archivo.mimetype, 
      upsert: true
    });

  if (uploadError) {
    throw new Error(`Error al subir la foto a Storage: ${uploadError.message}`);
  }

  const { data: urlData } = supabase.storage
    .from(nombreBucket)
    .getPublicUrl(fileName);

  const fotoUrl = urlData.publicUrl;

  const { data, error: dbError } = await supabase
    .from('Usuarios')
    .update({ fotoPerfil: fotoUrl })
    .eq('id_usuario', parseInt(idUsuario, 10))
    .select();

  if (dbError) {
    throw new Error(`Error al guardar la URL en la base de datos: ${dbError.message}`);
  }

  return data[0];
};
