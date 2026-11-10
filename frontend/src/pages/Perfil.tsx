import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Header from '../components/Header';
import PerfilUser from '../components/PerfilUser';

const Perfil: React.FC = () => {
  const { isLoggedIn, authLoading } = useAuth();

  if (authLoading) {
    return <main className="perfil-verificando">Verificando sesión…</main>;
  }

  if (!isLoggedIn) {
    return <Navigate to="/ingresar" state={{ from: '/perfil' }} replace />;
  }

  return (
    <>
      <Header />
      <PerfilUser />
    </>
  );
};

export default Perfil;
