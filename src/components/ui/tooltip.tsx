import React from 'react';

interface TooltipProps {
  text: string;
  children: React.ReactNode;
}

export const Tooltip: React.FC<TooltipProps> = ({ text, children }) => {
  return (
    <div className="relative flex items-center">
      {children}
      <div className="absolute bottom-full mb-2 w-max p-2 bg-black text-white text-xs rounded opacity-0 transition-opacity duration-300 tooltip-content">
        {text}
      </div>
    </div>
  );
};
