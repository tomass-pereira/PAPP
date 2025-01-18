// SmoothScroll.jsx
import React from 'react';

const SmoothScroll = ({ targetId, children, className, onClick }) => {
  const scrollToElement = (e) => {
    e.preventDefault();
    const element = document.getElementById(targetId);
    
    if (element) {
    
      const navbarHeight = 76; 
      
      
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - navbarHeight;

      // Fazer o scroll
      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
      
     
      if (onClick) {
        onClick(targetId);
      }
    }
  };

  return (
    <a 
      href={`#${targetId}`} 
      onClick={scrollToElement} 
      className={className}
    >
      {children}
    </a>
  );
};

export default SmoothScroll;