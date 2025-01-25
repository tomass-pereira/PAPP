import React, { useState, useRef } from 'react';
import { Calendar } from 'lucide-react';

const DraggableSession = ({ dragToCreatePlugin }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [touchPosition, setTouchPosition] = useState({ x: 0, y: 0 });
  const elementRef = useRef(null);
  const eventId = useRef(null);

  // Desktop drag handler
  const handleDragStart = () => {
    eventId.current = crypto.randomUUID();
    dragToCreatePlugin.dragToCreate(eventId.current, {
      title: 'Sessão de Fisioterapia',
      description: 'Nova sessão',
    });
  };

  // Mobile touch handlers
  const handleTouchStart = (e) => {
    const touch = e.touches[0];
    setTouchPosition({
      x: touch.clientX,
      y: touch.clientY
    });
    
    eventId.current = crypto.randomUUID();
    setIsDragging(true);

    // Initialize drag position
    const rect = e.target.getBoundingClientRect();
    const offsetX = touch.clientX - rect.left;
    const offsetY = touch.clientY - rect.top;

    dragToCreatePlugin.dragToCreate(eventId.current, {
      title: 'Sessão de Fisioterapia',
      description: 'Nova sessão',
    }, {
      x: touch.clientX - offsetX,
      y: touch.clientY - offsetY
    });
  };

  const handleTouchMove = (e) => {
    if (!isDragging) return;
    
    const touch = e.touches[0];
    setTouchPosition({
      x: touch.clientX,
      y: touch.clientY
    });

    // Update drag position
    if (dragToCreatePlugin.updateDragPosition) {
      dragToCreatePlugin.updateDragPosition(touch.clientX, touch.clientY);
    }

    e.preventDefault();
  };

  const handleTouchEnd = () => {
    if (!isDragging) return;
    
    setIsDragging(false);
    
    // Trigger drop event at the last touch position
    const dropEvent = new MouseEvent('mouseup', {
      clientX: touchPosition.x,
      clientY: touchPosition.y,
      bubbles: true
    });
    document.dispatchEvent(dropEvent);
  };

  return (
    <div className="flex justify-center p-4">
      <div
        ref={elementRef}
        draggable={true}
        onDragStart={handleDragStart}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        className={`flex items-center gap-2 px-4 py-3 
                   bg-purple-100 hover:bg-purple-200 
                   text-purple-900 rounded-lg 
                   shadow-md hover:shadow-lg 
                   transition-all duration-200 
                   border-2 border-purple-200
                   select-none touch-none
                   ${isDragging ? 'opacity-50' : 'cursor-move'}`}
      >
        <Calendar size={20} />
        <span className="font-medium">Criar Sessão</span>
      </div>
    </div>
  );
};

export default DraggableSession;