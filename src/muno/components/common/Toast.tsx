import React from 'react';
import { CheckCircle2, Info } from 'lucide-react';

interface ToastProps {
  message: string | null;
  onClose?: () => void;
}

export const Toast: React.FC<ToastProps> = ({ message }) => {
  if (!message) return null;

  return (
    <div className="absolute top-16 left-1/2 -translate-x-1/2 z-50 max-w-[90%] px-4 py-2.5 bg-[#0D0D36]/95 border border-[#00D522]/40 rounded-full shadow-[0_8px_30px_rgba(0,0,0,0.8)] backdrop-blur-md flex items-center space-x-2 text-white text-xs font-semibold animate-fadeIn pointer-events-none">
      <div className="w-4 h-4 rounded-full bg-[#00D522] flex items-center justify-center text-[#05051F] flex-shrink-0">
        <CheckCircle2 className="w-3 h-3 stroke-[3]" />
      </div>
      <span className="truncate">{message}</span>
    </div>
  );
};
