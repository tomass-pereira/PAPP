import React from 'react';

const SmoothScrollLink = ({ targetId, children, className, Onclick }) => {
  const scrollToElement = (e) => {
    e.preventDefault();
    const element = document.getElementById(targetId);
    
    if (element) {
      element.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
      });
    }
  };
  if(Onclick){
    onclick(targetId);
  }

  return (
    <a href={`#${targetId}`} onClick={scrollToElement} className={className}>
      {children}
    </a>
  );
};


export default SmoothScrollLink;