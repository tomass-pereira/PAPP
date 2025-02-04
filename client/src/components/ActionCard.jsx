// ActionCard.jsx
import React from 'react';

const ActionCard = ({ title, description, icon: Icon, bgColor, textColor, onClick }) => {
  const isGradient = bgColor?.includes('gradient');
  const baseClasses = `p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow ${onClick ? 'cursor-pointer' : ''}`;
  const bgClasses = isGradient 
    ? `bg-gradient-to-br ${bgColor}` 
    : 'bg-white';
  const titleColor = textColor || 'text-gray-800';
  const descriptionColor = textColor ? textColor.replace('text-', 'text-') + '/80' : 'text-gray-600';

  return (
    <div 
      className={`${baseClasses} ${bgClasses}`}
      onClick={onClick}
    >
      <div className="flex items-center space-x-4 mb-4">
        <Icon className="w-8 h-8" />
        <h2 className={`text-xl font-semibold ${titleColor}`}>{title}</h2>
      </div>
      <p className={descriptionColor}>
        {description}
      </p>
    </div>
  );
};

export default ActionCard;