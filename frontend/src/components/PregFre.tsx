import React, { useState } from 'react';
import './PregFre.css';

interface FAQProps {
  question?: string;
  answer?: string;
}

const FAQItem: React.FC<FAQProps> = ({ 
  question = "¿Qué es Ruta Verde?", //hola
  answer = "Ruta Verde es una iniciativa enfocada en la sostenibilidad y el cuidado del medio ambiente, promoviendo prácticas ecológicas y rutas de transporte limpio." 
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleOpen = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className={`faq-container ${isOpen ? 'open' : ''}`}>
      <div className="faq-header" onClick={toggleOpen}>
        <h3 className="faq-question">{question}</h3>
        <button 
          className="faq-toggle" 
          aria-expanded={isOpen}
          aria-label={isOpen ? "Cerrar respuesta" : "Ver respuesta"}
        >
          <span className="plus-icon">{isOpen ? '−' : '+'}</span>
        </button>
      </div>
      <div className="faq-answer-wrapper">
        <div className="faq-answer">
          <p>{answer}</p>
        </div>
      </div>
    </div>
  );
};

export default FAQItem;
