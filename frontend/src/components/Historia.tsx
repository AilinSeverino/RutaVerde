import React from 'react';
import './Historia.css';

const Historia: React.FC = () => {
  return (
    <section className="historia-container">
      <div className="historia-content">

        {/* ── Bloque 1 ── */}
        <div className="historia-bloque">
          <h2 className="historia-title">¿Qué es la Ruta Verde?</h2>
          <p className="historia-intro">
            La Ruta Verde es un biocorredor, una respuesta comunitaria al calentamiento global y al
            cambio climático. Es una iniciativa continental que busca construir un gran corredor
            biológico de flora y fauna nativa que vaya desde Tierra del Fuego hasta Alaska.
            Impulsada por Red Solidaria, junto a gobiernos, organizaciones, instituciones y acciones
            colectivas e individuales.
          </p>
          <p className="historia-text-p">
            El propósito es recomponer hábitats, recuperar biodiversidad en una respuesta comunitaria
            concreta frente a la crisis climática. La unidad mínima de la Ruta es lo que llamamos{' '}
            <strong>baldosa verde</strong>: un punto con especies nativas que puede tener distintas
            escalas, desde un cantero en la vereda urbana o una maceta, hasta un bosque o una reserva
            natural protegida. Al conectarse entre sí, estas baldosas forman biocorredores que permiten
            que plantas, insectos, aves y otros organismos encuentren alimento, refugio y continuidad
            territorial. También forman parte de la Ruta Verde los espacios de flora y fauna nativa ya
            existentes, que al ser identificados y conectados ayudan a fortalecer su preservación.
          </p>
          <p className="historia-text-p">
            La Ruta Verde es un biocorredor de flora y fauna, pero también es una red que conecta
            personas. Es una propuesta social, educativa, científica y cultural. Invita a personas,
            escuelas, universidades, organizaciones, municipios, clubes, comunidades religiosas y
            espacios privados a sumar acciones locales dentro de una acción común. Plantar nativas,
            germinar semillas, compostar, mapear espacios verdes, participar en jornadas de plantación,
            desarrollar investigaciones, impulsar proyectos de restauración y difundir la iniciativa son
            distintas formas de construir, baldosa por baldosa, una ruta continental de biodiversidad.
          </p>
        </div>

        {/* ── Bloque 2 ── */}
        <div className="historia-bloque">
          <h2 className="historia-title">Historia de Ruta Verde</h2>
          <p className="historia-text-p">
            En época de pandemia comenzaron las primeras reflexiones sobre la posibilidad de conformar
            una acción comunitaria que uniera a toda América en una gran respuesta colectiva al cambio
            climático.
          </p>
          <p className="historia-text-p">
            En junio de 2024 se realizó en la Reserva costera de Olivos, Provincia de Buenos Aires, la
            primera plantación de especies nativas conformando la primera baldosa verde. Hacia fines de
            2024, la Ruta ya contaba con 150 baldosas en Argentina, presencia en 12 países y una
            primera plantación en Alaska. En la Reserva El Potrero, en Gualeguaychú, Entre Ríos, se
            realizó una de las plantaciones más grandes de la ruta, sumando 710 árboles nativos y
            enredaderas.
          </p>
          <p className="historia-text-p">
            En 2025 se sumó a la ruta la Autopista Papa Francisco, proponiendo plantar con especies
            nativas el recorrido de la peregrinación a Luján, con la mirada ambiental expresada en la
            encíclica papal Laudato si'. En 2025, el Encuentro de Ruta Verde realizado en River Plate
            reunió experiencias de biocorredores urbanos, conservación, reservas, escuelas, viveros,
            universidades y organizaciones ambientales. A partir de allí, Ruta Verde empezó a
            consolidarse no solo como una campaña de plantación, sino como una red abierta de
            comunidades que diseñan, cuidan y registran nuevos puntos de biodiversidad nativa.
          </p>
          <p className="historia-text-p">
            Iniciando 2026 se realizó una plantación de un árbol nativo en Río Grande, Provincia de
            Tierra del Fuego, delimitando el extremo sur de la Ruta. Hoy la Ruta cuenta con más de 375
            baldosas registradas en más de 20 países de América y muchas más iniciativas que adhieren
            al proyecto, participando de un cambio ambiental activo y comunitario.
          </p>
        </div>

        {/* ── Bloque 3 ── */}
        <div className="historia-bloque historia-bloque--last">
          <h2 className="historia-title">¿Cómo sumarme a Ruta Verde?</h2>
          <p className="historia-text-p">
            Si querés sumarte a la Ruta Verde lo podés hacer con una acción concreta: identificar un
            espacio cercano donde pueda crecer vegetación nativa. Puede ser un patio, un cantero, una
            vereda, una escuela, una plaza, una reserva, un campo o cualquier lugar que pueda
            transformarse en una baldosa verde. Encontrar especies nativas adecuadas para ese espacio
            y en lo posible proponer una acción de intervención colectiva o comunitaria.
          </p>
          <p className="historia-text-p">
            Otra manera es identificar y preservar espacios nativos preexistentes, ayudando con esto a
            su protección, conservación y a su conexión con otras iniciativas de la Ruta. Tengamos
            presente que la Ruta, además de los espacios con flora y fauna nativa, incluye iniciativas
            como proyectos y programas de investigación enfocados en la restauración ambiental.
          </p>
          <p className="historia-text-p">
            También se puede participar germinando semillas, generando plantines, compostando en casa
            o en el trabajo para alimentar nuevas plantas, y sumándose a las jornadas de plantación que
            se realizan periódicamente. Cada acción, por pequeña que parezca, puede formar parte de
            una red mayor.
          </p>
          <p className="historia-text-p">
            Otra forma de participar es difundir el proyecto: contar por qué las plantas nativas son
            importantes, invitar a otras personas e instituciones a sumar nuevas baldosas verdes y
            ayudar a construir conciencia ambiental en la comunidad. Ruta Verde crece cuando cada punto
            se conecta con otros: una maceta, una escuela, una plaza, una reserva o un barrio pueden
            ser parte del mismo corredor biológico continental.
          </p>
        </div>

      </div>
    </section>
  );
};

export default Historia;
