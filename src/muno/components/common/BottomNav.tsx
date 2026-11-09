import React from 'react';
import { ActiveTab } from '../../types';
import { Button } from '@/components/ui/button';

interface BottomNavProps {
  currentTab: ActiveTab;
  onTabChange: (tab: ActiveTab) => void;
  savedCount?: number;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  currentTab,
  onTabChange,
}) => {
  return (
    <nav aria-label="Main navigation" className="muno-bottom-nav flex items-center justify-around px-2 z-50 select-none shrink-0 w-full">
      {/* 1. Home (Exact match to Screenshot_20261018_102215_Munowatch.jpg) */}
      <Button variant="ghost"
        onClick={() => onTabChange('home')}
        className={`flex-1 flex flex-col items-center justify-center py-1 transition-colors focus:outline-none ${
          currentTab === 'home'
            ? 'text-white'
            : 'text-[#8E8E9F] hover:text-white/80'
        }`}
      >
        <svg
          className="w-[23px] h-[23px]"
          viewBox="0 0 24 24"
          fill="currentColor"
        >
          {/* Solid filled home icon with door opening */}
          <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" />
        </svg>
        <span
          className={`text-[13.5px] mt-0.5 tracking-normal leading-tight ${
            currentTab === 'home'
              ? 'text-white font-bold'
              : 'text-[#8E8E9F] font-normal'
          }`}
        >
          Home
        </span>
      </Button>

      {/* 2. Categories (Exact 3 centered horizontal lines matching Screenshot_20261018_102215) */}
      <Button variant="ghost"
        onClick={() => onTabChange('categories')}
        className={`flex-1 flex flex-col items-center justify-center py-1 transition-colors focus:outline-none ${
          currentTab === 'categories'
            ? 'text-white'
            : 'text-[#8E8E9F] hover:text-white/80'
        }`}
      >
        <svg
          className="w-[23px] h-[23px]"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.4"
          strokeLinecap="round"
        >
          {/* Centered decreasing bars: top wide, middle medium, bottom short */}
          <line x1="4" y1="7" x2="20" y2="7" />
          <line x1="7" y1="12" x2="17" y2="12" />
          <line x1="10" y1="17" x2="14" y2="17" />
        </svg>
        <span
          className={`text-[13.5px] mt-0.5 tracking-normal leading-tight ${
            currentTab === 'categories'
              ? 'text-white font-bold'
              : 'text-[#8E8E9F] font-normal'
          }`}
        >
          Categories
        </span>
      </Button>

      {/* 3. Saved (Exact bookmark outline matching Screenshot_20261018_102215) */}
      <Button variant="ghost"
        onClick={() => onTabChange('saved')}
        className={`flex-1 flex flex-col items-center justify-center py-1 transition-colors focus:outline-none ${
          currentTab === 'saved'
            ? 'text-white'
            : 'text-[#8E8E9F] hover:text-white/80'
        }`}
      >
        <svg
          className="w-[23px] h-[23px]"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          {/* Bookmark outline matching screenshot */}
          <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
        </svg>
        <span
          className={`text-[13.5px] mt-0.5 tracking-normal leading-tight ${
            currentTab === 'saved'
              ? 'text-white font-bold'
              : 'text-[#8E8E9F] font-normal'
          }`}
        >
          Saved
        </span>
      </Button>

      {/* 4. Menu (Exact 3 lines with arrow matching Screenshot_20261018_102215) */}
      <Button variant="ghost"
        onClick={() => onTabChange('menu')}
        className={`flex-1 flex flex-col items-center justify-center py-1 transition-colors focus:outline-none ${
          currentTab === 'menu'
            ? 'text-white'
            : 'text-[#8E8E9F] hover:text-white/80'
        }`}
      >
        <svg
          className="w-[23px] h-[23px]"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          {/* Top line */}
          <line x1="3" y1="7" x2="15" y2="7" />
          {/* Middle line with arrow bracket */}
          <line x1="3" y1="12" x2="15" y2="12" />
          {/* Bottom line */}
          <line x1="3" y1="17" x2="15" y2="17" />
          {/* Right arrow bracket */}
          <polyline points="18 9 21 12 18 15" />
        </svg>
        <span
          className={`text-[13.5px] mt-0.5 tracking-normal leading-tight ${
            currentTab === 'menu'
              ? 'text-white font-bold'
              : 'text-[#8E8E9F] font-normal'
          }`}
        >
          Menu
        </span>
      </Button>
    </nav>
  );
};
