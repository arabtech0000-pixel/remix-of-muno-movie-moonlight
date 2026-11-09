import React from 'react';
import {
  X,
  Home,
  Film,
  Bookmark,
  History,
  ArrowDownCircle,
  User,
  Headphones,
  Power,
  ShieldCheck,
} from 'lucide-react';
import { ViewScreen } from '../../types';

interface MenuScreenProps {
  onClose: () => void;
  onNavigate: (screen: ViewScreen) => void;
  onLogout: () => void;
  onOpenSupport: () => void;
  isAdmin?: boolean;
}

export const MenuScreen: React.FC<MenuScreenProps> = ({
  onClose,
  onNavigate,
  onLogout,
  onOpenSupport,
  isAdmin = false,
}) => {
  const menuOptions = [
    {
      id: 'home',
      label: 'HOME',
      icon: <Home className="w-5 h-5 text-white stroke-[2.2]" />,
      action: () => onNavigate('home'),
    },
    {
      id: 'shows',
      label: 'SHOWS',
      icon: <Film className="w-5 h-5 text-white stroke-[2.2]" />,
      action: () => onNavigate('shows'),
    },
    {
      id: 'saved',
      label: 'SAVED',
      icon: <Bookmark className="w-5 h-5 text-white stroke-[2.2]" />,
      action: () => onNavigate('saved'),
    },
    {
      id: 'recently-watched',
      label: 'RECENTLY WATCHED',
      icon: <History className="w-5 h-5 text-white stroke-[2.2]" />,
      action: () => onNavigate('recently_watched'),
    },
    {
      id: 'downloads',
      label: 'DOWNLOADS',
      icon: <ArrowDownCircle className="w-5 h-5 text-white stroke-[2.2]" />,
      action: () => onNavigate('downloads'),
    },
    {
      id: 'account',
      label: 'MY ACCOUNT',
      icon: <User className="w-5 h-5 text-white stroke-[2.2]" />,
      action: () => onNavigate('account'),
    },
    ...(isAdmin
      ? [
          {
            id: 'admin_dashboard',
            label: 'ADMIN DASHBOARD',
            icon: <ShieldCheck className="w-5 h-5 text-purple-400 stroke-[2.2]" />,
            action: () => onNavigate('admin_dashboard'),
          },
        ]
      : []),
    {
      id: 'support',
      label: 'SUPPORT',
      icon: <Headphones className="w-5 h-5 text-white stroke-[2.2]" />,
      action: onOpenSupport,
    },
    {
      id: 'logout',
      label: 'LOG OUT',
      icon: <Power className="w-5 h-5 text-white stroke-[2.2]" />,
      action: onLogout,
    },
  ];

  return (
    <div className="min-h-full bg-[#05051F] text-white flex flex-col pb-24 select-none animate-fadeIn">
      {/* Top Header */}
      <div className="h-16 px-4 flex items-center justify-between sticky top-0 bg-[#05051F]/95 backdrop-blur-md z-30">
        <button
          onClick={onClose}
          className="p-1 -ml-1 text-white hover:text-white/80 transition-colors focus:outline-none cursor-pointer"
          aria-label="Close menu"
        >
          <X className="w-6 h-6 stroke-[2.2]" />
        </button>

        <h2 className="text-white text-[15px] font-bold tracking-[0.16em] uppercase text-center flex-1 pr-6">
          APP MENU
        </h2>
      </div>

      {/* Menu Options List */}
      <div className="px-5 py-6 space-y-6">
        {menuOptions.map((item) => (
          <button
            key={item.id}
            onClick={item.action}
            className="w-full flex items-center space-x-5 text-left text-white hover:text-[#00D522] transition-colors group focus:outline-none cursor-pointer"
          >
            <div className="w-6 flex items-center justify-center">
              {item.icon}
            </div>
            <span className="text-[14px] font-bold tracking-wider uppercase text-white group-hover:text-[#00D522] transition-colors">
              {item.label}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
};
