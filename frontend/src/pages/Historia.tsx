import Header from '../components/Header';
import HistoriaComp from '../components/Historia'; 
import LTtit from '../components/LTtit';
import LineaTiempo from '../components/LineaTiempo';
import PFtit from '../components/PFtit';
import PregFre2 from '../components/PregFre2';
import PregFre3 from '../components/PregFre3';
import LT2 from '../components/LT2';
import LT3 from '../components/LT3';
import LT4 from '../components/LT4';

export default function Historia() {
  return (
    <>
      <Header />
      <HistoriaComp />
      <LTtit />
      <LineaTiempo />
      <LT2 />
      <LT3 />
      <LT4 />
      <PFtit />
      <PregFre2 />
      <PregFre3 />
    </>
  );
}