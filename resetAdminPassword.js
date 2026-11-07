import { createInterface } from 'node:readline';
import { stdin, stdout } from 'node:process';
import bcrypt from 'bcrypt';
import { getSupabaseAdmin } from './src/config/supabase.js';

function askLine(prompt) {
  return new Promise((resolve) => {
    const readline = createInterface({ input: stdin, output: stdout });
    readline.question(prompt, (answer) => {
      readline.close();
      resolve(answer.trim());
    });
  });
}

function askSecret(prompt) {
  if (!stdin.isTTY || typeof stdin.setRawMode !== 'function') {
    throw new Error('Ejecutá este script desde una terminal interactiva.');
  }

  return new Promise((resolve) => {
    let value = '';
    stdout.write(prompt);
    stdin.setRawMode(true);
    stdin.resume();

    const finish = (result) => {
      stdin.off('data', onData);
      stdin.setRawMode(false);
      stdout.write('\n');
      resolve(result);
    };

    const onData = (chunk) => {
      for (const character of chunk.toString()) {
        if (character === '\u0003') {
          stdin.off('data', onData);
          stdin.setRawMode(false);
          stdout.write('\n');
          process.exit(130);
        }

        if (character === '\r' || character === '\n') {
          finish(value);
          return;
        }

        if (character === '\u007f' || character === '\b') {
          value = value.slice(0, -1);
          continue;
        }

        value += character;
      }
    };

    stdin.on('data', onData);
  });
}

try {
  const email = (await askLine('Correo de la cuenta administradora: ')).toLowerCase();
  const password = await askSecret('Nueva contraseña (entrada oculta): ');
  const confirmation = await askSecret('Repetí la nueva contraseña: ');

  if (password.length < 8) {
    throw new Error('La contraseña debe tener al menos 8 caracteres.');
  }

  if (!/^(?=.*[A-Za-z])(?=.*\d)/.test(password)) {
    throw new Error('La contraseña debe incluir al menos una letra y un número.');
  }

  if (password !== confirmation) {
    throw new Error('Las contraseñas no coinciden.');
  }

  const supabaseAdmin = getSupabaseAdmin();
  const { data: usuario, error: lookupError } = await supabaseAdmin
    .from('Usuarios')
    .select('id_usuario, id_rol')
    .eq('email', email)
    .maybeSingle();

  if (lookupError) throw new Error(`No se pudo verificar la cuenta: ${lookupError.message}`);
  if (!usuario || Number(usuario.id_rol) !== 1) {
    throw new Error('Ese correo no corresponde a una cuenta administradora.');
  }

  const hash = await bcrypt.hash(password, 10);
  const { data, error } = await supabaseAdmin
    .from('Usuarios')
    .update({ contrasena: hash, codigo_2fa: null, expiracion_2fa: null })
    .eq('id_usuario', usuario.id_usuario)
    .select('id_usuario');

  if (error) throw new Error(`No se pudo actualizar la contraseña: ${error.message}`);
  if (!data?.length) throw new Error('No se actualizó ninguna cuenta.');

  console.log('Contraseña actualizada. No se imprimió ni guardó en un archivo.');
} catch (error) {
  console.error(error.message);
  process.exitCode = 1;
}
