import React, { useState } from 'react';
import './PregFre.css';

interface FAQProps {
  question?: string;
  answer?: string;
}

const FAQItem: React.FC<FAQProps> = ({ 
  question = "¿Cómo subo mi baldosa?", 
  answer = "Para poder subir tu baldosa, debes entrar a la pestaña llamada 'Aportes' y completar la información pedida y correspondiente." 
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