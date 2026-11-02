export const validarRegistro = (req, res, next) => {
  const { nombre, email, password } = req.body;
  const errores = [];

  if (!nombre || !nombre.trim()) {
    errores.push('El nombre es obligatorio.');
  }

  if (!email || !email.trim()) {
    errores.push('El correo electrónico es obligatorio.');
  }

  if (!password) {
    errores.push('La contraseña es obligatoria.');
  }

  if (errores.length > 0) {
    return res.status(400).json({ success: false, errores });
  }

  const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!regexEmail.test(email.trim())) {
    errores.push('El formato del correo electrónico no es válido.');
  }

  if (password.length < 8) {
    errores.push('La contraseña debe tener al menos 8 caracteres.');
  }
  
  const regexPasswordSegura = /^(?=.*[A-Za-z])(?=.*\d)/;
  if (!regexPasswordSegura.test(password)) {
    errores.push('La contraseña debe contener al menos una letra y un número.');
  }

  if (errores.length > 0) {
    return res.status(400).json({ success: false, errores });
  }

  next(); 
};