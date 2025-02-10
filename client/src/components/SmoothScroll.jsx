import React from 'react';

const SmoothScroll = ({ targetId, children, className, onClick }) => {
  const scrollToElement = (e) => {
    e.preventDefault();
    
    // Primeiro executamos o onClick (mudança de página)
    if (onClick) {
      onClick();
    }
    
    // Depois fazemos o scroll com um pequeno delay para garantir que a página foi atualizada
    setTimeout(() => {
      const element = document.getElementById(targetId);
      if (element) {
        element.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    }, 100);
  };

  return (
    <button 
      type="button"
      onClick={scrollToElement} 
      className={className}
    >
      {children}
    </button>
  );
};

export default SmoothScroll;