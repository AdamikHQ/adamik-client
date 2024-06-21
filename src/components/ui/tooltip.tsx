import React, { useState } from 'react';

interface TooltipProps {
  text: string;
  children: React.ReactNode;
}

export const Tooltip: React.FC<TooltipProps> = ({ text, children }) => {
  const [visible, setVisible] = useState(false);

  return (
    <div
      className="relative flex items-center"
      onMouseEnter={() => text && setVisible(true)}
      onMouseLeave={() => setVisible(false)}
    >
      {children}
      {text && (
        <div
          className={`absolute bottom-full mb-2 w-max p-2 bg-black text-white text-xs rounded transition-opacity duration-300 ${
            visible ? 'opacity-100' : 'opacity-0'
          }`}
          dangerouslySetInnerHTML={{ __html: text }} // Set HTML content
        />
      )}
    </div>
  );
};