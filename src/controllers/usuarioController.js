import { supabase, getSupabaseAdmin } from '../config/supabase.js';

export async function listarUsuarios(req, res) {
    try {
        const { data, error } = await supabase
            .from('Usuarios')
            .select(`
                id_usuario,
                nombreC,
                email,
                id_rol,
                id_region,
                fotoPerfil,
                fechaR,
                Roles ( nombreRol )
            `)
            .order('id_usuario', { ascending: true });

        if (error) {
            return res.status(400).json({ success: false, error: error.message });
        }

        const usuariosFormateados = (data || []).map(u => {
            const nombreValido = u.nombreC || u.email || 'Usuario';
            return {
                id: u.id_usuario,
                id_usuario: u.id_usuario,
                nombre: nombreValido,
                nombreC: nombreValido,
                email: u.email || '',
                id_rol: u.id_rol,
                rol: u.Roles?.nombreRol || (u.id_rol === 1 ? 'Administrador' : 'Usuario'),
                id_region: u.id_region,
                fotoPerfil: u.fotoPerfil || null,
                fechaRegistro: u.fechaR,
                activo: true
            };
        });

        return res.status(200).json({ success: true, data: usuariosFormateados });
    } catch (error) {
        return res.status(500).json({ success: false, error: error.message });
    }
}

export async function actualizarUsuario(req, res) {
    try {
        const { id } = req.params;
        const campos = req.body || {};

        const { data, error } = await getSupabaseAdmin()
            .from('Usuarios')
            .update(campos)
            .eq('id_usuario', id)
            .select();

        if (error) {
            return res.status(400).json({ success: false, error: error.message });
        }

        if (!data || data.length === 0) {
            return res.status(404).json({ success: false, error: 'Usuario no encontrado.' });
        }

        return res.status(200).json({ success: true, data: data[0] });
    } catch (error) {
        return res.status(500).json({ success: false, error: error.message });
    }
}

export async function cambiarRolUsuario(req, res) {
    try {
        const { id } = req.params;
        const { id_rol } = req.body;

        if (id_rol === undefined || id_rol === null) {
            return res.status(400).json({ success: false, error: 'Falta id_rol.' });
        }

        const { data, error } = await getSupabaseAdmin()
            .from('Usuarios')
            .update({ id_rol })
            .eq('id_usuario', id)
            .select();

        if (error) {
            return res.status(400).json({ success: false, error: error.message });
        }

        return res.status(200).json({ success: true, data: data[0] });
    } catch (error) {
        return res.status(500).json({ success: false, error: error.message });
    }
}

export async function eliminarUsuario(req, res) {
    try {
        const { id } = req.params;

        const { data, error } = await getSupabaseAdmin()
            .from('Usuarios')
            .delete()
            .eq('id_usuario', id)
            .select();

        if (error) {
            return res.status(400).json({ success: false, error: error.message });
        }

        return res.status(200).json({ success: true, data: data[0] || null });
    } catch (error) {
        return res.status(500).json({ success: false, error: error.message });
    }
}