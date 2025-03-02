import React from 'react';
import { Check, TrendingUp, Calendar, Clock, Zap, Sparkles, ArrowUp } from 'lucide-react';

const StatsCard = ({ 
  title, 
  value, 
  icon, 
  trend, 
  trendText, 
  borderColor, 
  iconBgColor, 
  iconTextColor,
  progressBar = false,
  progressValue = 0,
  progressBarColor
}) => {
  // Renderiza o ícone correto
  const renderIcon = () => {
    switch (icon) {
      case 'check':
        return <Check className="w-3.5 h-3.5" />;
      case 'trendingUp':
        return <TrendingUp className="w-3.5 h-3.5" />;
      case 'calendar':
        return <Calendar className="w-3.5 h-3.5" />;
      case 'clock':
        return <Clock className="w-3.5 h-3.5" />;
      case 'zap':
        return <Zap className="w-3.5 h-3.5" />;
      case 'sparkles':
        return <Sparkles className="w-3.5 h-3.5" />;
      case 'arrowUp':
        return <ArrowUp className="w-3.5 h-3.5" />;
      default:
        return <Check className="w-3.5 h-3.5" />;
    }
  };

  // Renderiza o ícone de tendência
  const renderTrendIcon = () => {
    if (trend === 'up') {
      return <TrendingUp className="w-3.5 h-3.5 mr-1" />;
    } else if (trend === 'arrowUp') {
      return <ArrowUp className="w-3.5 h-3.5 mr-1" />;
    } else {
      return <Clock className="w-3.5 h-3.5 mr-1" />;
    }
  };

  return (
    <div className={`bg-white p-4 rounded-xl shadow-sm border-t-4 ${borderColor}`}>
      <div className="flex justify-between items-start mb-2">
        <p className="text-gray-500 text-sm">{title}</p>
        <div className={`p-1.5 rounded-full ${iconBgColor} ${iconTextColor}`}>
          {renderIcon()}
        </div>
      </div>
      <p className="text-2xl font-bold text-gray-800">{value}</p>
      
      {progressBar && (
        <div className="w-full bg-gray-200 rounded-full h-1.5 mt-2">
          <div 
            className={`h-1.5 rounded-full ${progressBarColor}`}
            style={{ width: `${progressValue}%` }}
          ></div>
        </div>
      )}
      
      {trendText && (
        <div className={`flex items-center ${trend === 'up' || trend === 'arrowUp' ? 'text-green-600' : 'text-gray-500'} text-xs mt-2`}>
          {renderTrendIcon()}
          <span>{trendText}</span>
        </div>
      )}
    </div>
  );
};

export default StatsCard;