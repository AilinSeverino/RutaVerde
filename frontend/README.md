# Ruta Verde - Contexto de autenticación

## Información compartida a través del Context

La aplicación comparte el estado de autenticación del usuario y los datos del perfil logueado mediante React Context. En particular, el contexto expone:

- `usuario`: datos del usuario autenticado (nombre, email, foto, descripción, ubicación, etc.).
- `isLoggedIn`: booleano que indica si hay una sesión activa.
- `login(usuario)`: función para iniciar sesión y guardar el usuario en el estado global.
- `logout()`: función para cerrar sesión y limpiar la sesión activa.
- `updateUsuario(datos)`: función para actualizar los datos del perfil del usuario sin necesitar props manuales.

Estos datos se usan para mantener la UI sincronizada entre distintos componentes, como el header, el perfil y los formularios de ingreso/registro.

## Archivo donde fue creado el Context

Ruta del archivo:
`src/context/AuthContext.tsx`

## Componente contenedor donde se ubicó el Provider

El `Provider` se ubica en el componente raíz de la aplicación:
`src/App.tsx`

Se envuelve toda la aplicación de la siguiente manera:

```tsx
<AuthProvider>
  <BrowserRouter>
    <Routes>
      ...
    </Routes>
    <Footer />
  </BrowserRouter>
</AuthProvider>
```

## Componentes que consumen la información mediante useContext

Los componentes que consumen el contexto son:

- `src/components/Header.tsx` - muestra la foto/avatar del usuario y decide si mostrar la sección autenticada o no.
- `src/pages/Perfil.tsx` - valida si el usuario está autenticado antes de renderizar el perfil.
- `src/components/InicioForm.tsx` - ejecuta `login()` al iniciar sesión.
- `src/components/RegistroForm.tsx` - ejecuta `login()` al registrar un usuario.
- `src/components/PerfilUser.tsx` - lee `usuario` para mostrar el perfil y usa `logout()` y `updateUsuario()` para gestionar la sesión y edición del perfil.

## Justificación técnica del uso de Context

Resultaba necesario y conveniente utilizar Context en este caso porque el estado del usuario está siendo compartido por varios componentes que no forman una relación directa de padre a hijo en toda la jerarquía. Por ejemplo, el formulario de ingreso se encuentra en una ruta distinta al header y al perfil, y aun así ambos deben reflejar el mismo estado de sesión.

Sin Context, se habría requerido pasar manualmente el estado y las funciones de autenticación por props a través de múltiples niveles o mantener duplicado el estado en varios puntos de la aplicación. React Context permite centralizar la lógica de autenticación, mantener el estado global consistente y evitar prop drilling, mejorando además la mantenibilidad del código.

## Ejemplo de uso del Context

A continuación se muestra un ejemplo de cómo consumir el contexto en un componente funcional:

```tsx
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

const MiComponente = () => {
  const { usuario, isLoggedIn, login, logout, updateUsuario } = useContext(AuthContext);

  const manejarLogin = () => {
    const datosUsuario = { /* obtener datos del usuario */ };
    login(datosUsuario);
  };

  const manejarLogout = () => {
    logout();
  };

  return (
    <div>
      {isLoggedIn ? (
        <div>
          <h2>Bienvenido, {usuario.nombre}</h2>
          <button onClick={manejarLogout}>Cerrar sesión</button>
        </div>
      ) : (
        <button onClick={manejarLogin}>Iniciar sesión</button>
      )}
    </div>
  );
};
```

En este ejemplo, `MiComponente` consume el `AuthContext` para acceder a la información del usuario y las funciones de autenticación. Dependiendo del estado de `isLoggedIn`, muestra un mensaje de bienvenida con el nombre del usuario y un botón para cerrar sesión, o un botón para iniciar sesión.

