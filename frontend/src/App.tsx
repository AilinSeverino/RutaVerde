import { BrowserRouter, Routes, Route } from 'react-router-dom';

import Landing from './pages/Landing';
import Historia from './pages/Historia';
import Aportes from './pages/Aportes';
import Newsletter from './pages/Newsletter';
import MapaPage from './pages/Mapa';
import Perfil from './pages/Perfil';
import InicioForm from './components/InicioForm';
import RegistroForm from './components/RegistroForm';
import RecuperarContrasenia from './components/RecuperarContrasenia';
import Footer from './components/Footer';
import { AuthProvider } from './context/AuthContext';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/mapa" element={<MapaPage />} />
          <Route path="/historia" element={<Historia />} />
          <Route path="/aportes" element={<Aportes />} />
          <Route path="/newsletter" element={<Newsletter />} />
          <Route path="/ingresar" element={<InicioForm />} />
          <Route path="/recuperar" element={<RecuperarContrasenia />} />
          <Route path="/registrarse" element={<RegistroForm />} />
          <Route path="/perfil" element={<Perfil />} />
        </Routes>
        <Footer />
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
