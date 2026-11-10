import Header from '../components/Header';
import Inicio from '../components/Inicio';
import Estadisticas from '../components/Estadisticas';
import HistoLand from '../components/HistoLand';
import CarruNoti from '../components/CarruNoti';
import MapaInteractivo from '../components/MapaInteractivo';


export default function Landing() {
  return (
    <>
      <Header />
      <Inicio />
      <Estadisticas />
      <HistoLand />
      <CarruNoti />
      <MapaInteractivo />
    </>
  );
}