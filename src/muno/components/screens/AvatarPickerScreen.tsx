// @ts-nocheck -- imported app code; strict typing not yet applied
import React, { useState } from 'react';
import { ArrowLeft, Check, Sparkles, Shield, Film, CheckCircle2 } from 'lucide-react';

interface AvatarPickerScreenProps {
  onBack: () => void;
  currentAvatar: string;
  onSaveAvatar: (avatarUrl: string) => void;
  onShowToast: (msg: string) => void;
}

interface AvatarItem {
  id: string;
  name: string;
  url: string;
}

const MARVEL_AVATARS: AvatarItem[] = [
  {
    id: 'hulk',
    name: 'Hulk',
    url: 'https://images.unsplash.com/photo-1601645191163-3fc0d5d64e35?auto=format&fit=crop&w=300&q=80',
  },
  {
    id: 'thor',
    name: 'Thor',
    url: 'https://images.unsplash.com/photo-1569003339405-ea396a5a8a90?auto=format&fit=crop&w=300&q=80',
  },
  {
    id: 'spiderman',
    name: 'Spider-Man',
    url: 'https://images.unsplash.com/photo-1635805737707-575885ab0820?auto=format&fit=crop&w=300&q=80',
  },
  {
    id: 'ironman',
    name: 'Iron Man',
    url: 'https://images.unsplash.com/photo-1626278664285-f796b9ee7806?auto=format&fit=crop&w=300&q=80',
  },
  {
    id: 'captain-america',
    name: 'Capt. America',
    url: 'https://images.unsplash.com/photo-1612036782180-6f0b6cd846fe?auto=format&fit=crop&w=300&q=80',
  },
  {
    id: 'black-panther',
    name: 'Black Panther',
    url: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=300&q=80',
  },
  {
    id: 'wolverine',
    name: 'Wolverine',
    url: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=300&q=80',
  },
  {
    id: 'doctor-strange',
    name: 'Dr. Strange',
    url: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=300&q=80',
  },
];

const DC_AVATARS: AvatarItem[] = [
  {
    id: 'batman',
    name: 'Batman',
    url: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=300&q=80',
  },
  {
    id: 'superman',
    name: 'Superman',
    url: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=300&q=80',
  },
  {
    id: 'wonder-woman',
    name: 'Wonder Woman',
    url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
  },
  {
    id: 'flash',
    name: 'The Flash',
    url: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=300&q=80',
  },
  {
    id: 'joker',
    name: 'Joker',
    url: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&w=300&q=80',
  },
  {
    id: 'aquaman',
    name: 'Aquaman',
    url: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=300&q=80',
  },
];

const DISNEY_AVATARS: AvatarItem[] = [
  {
    id: 'simba',
    name: 'Simba (Lion King)',
    url: 'https://images.unsplash.com/photo-1546182990-dffeafbe841d?auto=format&fit=crop&w=300&q=80',
  },
  {
    id: 'mickey',
    name: 'Mickey Mouse',
    url: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&w=300&q=80',
  },
  {
    id: 'elsa',
    name: 'Elsa (Frozen)',
    url: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=300&q=80',
  },
  {
    id: 'aladdin',
    name: 'Aladdin',
    url: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?auto=format&fit=crop&w=300&q=80',
  },
  {
    id: 'toystory',
    name: 'Buzz Lightyear',
    url: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=300&q=80',
  },
  {
    id: 'stitch',
    name: 'Stitch',
    url: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=300&q=80',
  },
];

export const AvatarPickerScreen: React.FC<AvatarPickerScreenProps> = ({
  onBack,
  currentAvatar,
  onSaveAvatar,
  onShowToast,
}) => {
  const [selectedUrl, setSelectedUrl] = useState(currentAvatar || MARVEL_AVATARS[0].url);

  const handleSelectAndSave = (url: string) => {
    setSelectedUrl(url);
    onSaveAvatar(url);
    onShowToast('Avatar updated successfully!');
    setTimeout(() => {
      onBack();
    }, 200);
  };

  return (
    <div className="min-h-full bg-[#05051F] text-white flex flex-col pb-24 select-none animate-fadeIn">
      {/* Top Header */}
      <div className="h-14 px-4 flex items-center justify-between border-b border-white/[0.06] sticky top-0 bg-[#05051F]/95 backdrop-blur-md z-30">
        <div className="flex items-center space-x-3">
          <button
            onClick={onBack}
            className="p-1 -ml-1 text-white hover:text-[#00D522] transition-colors focus:outline-none cursor-pointer"
            aria-label="Back"
          >
            <ArrowLeft className="w-6 h-6 stroke-[2.2]" />
          </button>
          <h1 className="text-white text-[18px] font-bold tracking-tight">
            Choose Your Avatar
          </h1>
        </div>
      </div>

      <div className="px-4 py-5 max-w-2xl mx-auto w-full space-y-7">
        {/* Active Selection Preview Card */}
        <div className="p-4 bg-gradient-to-r from-[#0C0C38] to-[#080829] border border-white/[0.08] rounded-2xl flex items-center justify-between shadow-xl">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <img
                src={selectedUrl}
                alt="Selected Avatar"
                className="w-16 h-16 rounded-full object-cover border-2 border-[#00D522] shadow-lg shadow-[#00D522]/20"
              />
              <div className="absolute -bottom-1 -right-1 bg-[#00D522] p-0.5 rounded-full">
                <CheckCircle2 className="w-4 h-4 text-[#05051F]" />
              </div>
            </div>
            <div>
              <div className="text-sm font-bold text-white">Active Avatar</div>
              <div className="text-xs text-[#9292A5]">Tap any circular superhero icon below to apply</div>
            </div>
          </div>

          <button
            onClick={() => handleSelectAndSave(selectedUrl)}
            className="px-4 py-2 bg-[#00D522] hover:bg-[#00c21e] text-[#05051F] font-bold text-xs rounded-xl shadow transition-colors cursor-pointer"
          >
            Done
          </button>
        </div>

        {/* SECTION 1: MARVEL SUPERHEROES */}
        <div className="space-y-3">
          <div className="flex items-center space-x-2">
            <Shield className="w-4 h-4 text-red-400" />
            <h2 className="text-white text-sm font-bold uppercase tracking-wider">
              Marvel Superheroes
            </h2>
          </div>
          <div className="grid grid-cols-4 sm:grid-cols-4 gap-4">
            {MARVEL_AVATARS.map((item) => {
              const isSelected = selectedUrl === item.url;
              return (
                <button
                  key={item.id}
                  onClick={() => handleSelectAndSave(item.url)}
                  className="flex flex-col items-center space-y-1.5 group cursor-pointer focus:outline-none"
                >
                  <div
                    className={`relative w-16 h-16 sm:w-20 sm:h-20 rounded-full overflow-hidden border-2 transition-all ${
                      isSelected
                        ? 'border-[#00D522] ring-4 ring-[#00D522]/30 scale-105 shadow-lg shadow-[#00D522]/40'
                        : 'border-white/10 group-hover:border-white/40 group-hover:scale-102'
                    }`}
                  >
                    <img
                      src={item.url}
                      alt={item.name}
                      className="w-full h-full object-cover"
                    />
                    {isSelected && (
                      <div className="absolute inset-0 bg-[#00D522]/25 flex items-center justify-center">
                        <Check className="w-6 h-6 text-[#00D522] stroke-[3]" />
                      </div>
                    )}
                  </div>
                  <span
                    className={`text-[11px] font-medium text-center truncate max-w-full ${
                      isSelected ? 'text-[#00D522] font-bold' : 'text-[#D0D0D8] group-hover:text-white'
                    }`}
                  >
                    {item.name}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* SECTION 2: DC SUPERHEROES */}
        <div className="space-y-3">
          <div className="flex items-center space-x-2">
            <Sparkles className="w-4 h-4 text-blue-400" />
            <h2 className="text-white text-sm font-bold uppercase tracking-wider">
              DC Superheroes
            </h2>
          </div>
          <div className="grid grid-cols-3 sm:grid-cols-4 gap-4">
            {DC_AVATARS.map((item) => {
              const isSelected = selectedUrl === item.url;
              return (
                <button
                  key={item.id}
                  onClick={() => handleSelectAndSave(item.url)}
                  className="flex flex-col items-center space-y-1.5 group cursor-pointer focus:outline-none"
                >
                  <div
                    className={`relative w-16 h-16 sm:w-20 sm:h-20 rounded-full overflow-hidden border-2 transition-all ${
                      isSelected
                        ? 'border-[#00D522] ring-4 ring-[#00D522]/30 scale-105 shadow-lg shadow-[#00D522]/40'
                        : 'border-white/10 group-hover:border-white/40 group-hover:scale-102'
                    }`}
                  >
                    <img
                      src={item.url}
                      alt={item.name}
                      className="w-full h-full object-cover"
                    />
                    {isSelected && (
                      <div className="absolute inset-0 bg-[#00D522]/25 flex items-center justify-center">
                        <Check className="w-6 h-6 text-[#00D522] stroke-[3]" />
                      </div>
                    )}
                  </div>
                  <span
                    className={`text-[11px] font-medium text-center truncate max-w-full ${
                      isSelected ? 'text-[#00D522] font-bold' : 'text-[#D0D0D8] group-hover:text-white'
                    }`}
                  >
                    {item.name}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* SECTION 3: DISNEY & ANIMATION ICONS */}
        <div className="space-y-3">
          <div className="flex items-center space-x-2">
            <Film className="w-4 h-4 text-amber-400" />
            <h2 className="text-white text-sm font-bold uppercase tracking-wider">
              Disney & Animation Icons
            </h2>
          </div>
          <div className="grid grid-cols-3 sm:grid-cols-4 gap-4">
            {DISNEY_AVATARS.map((item) => {
              const isSelected = selectedUrl === item.url;
              return (
                <button
                  key={item.id}
                  onClick={() => handleSelectAndSave(item.url)}
                  className="flex flex-col items-center space-y-1.5 group cursor-pointer focus:outline-none"
                >
                  <div
                    className={`relative w-16 h-16 sm:w-20 sm:h-20 rounded-full overflow-hidden border-2 transition-all ${
                      isSelected
                        ? 'border-[#00D522] ring-4 ring-[#00D522]/30 scale-105 shadow-lg shadow-[#00D522]/40'
                        : 'border-white/10 group-hover:border-white/40 group-hover:scale-102'
                    }`}
                  >
                    <img
                      src={item.url}
                      alt={item.name}
                      className="w-full h-full object-cover"
                    />
                    {isSelected && (
                      <div className="absolute inset-0 bg-[#00D522]/25 flex items-center justify-center">
                        <Check className="w-6 h-6 text-[#00D522] stroke-[3]" />
                      </div>
                    )}
                  </div>
                  <span
                    className={`text-[11px] font-medium text-center truncate max-w-full ${
                      isSelected ? 'text-[#00D522] font-bold' : 'text-[#D0D0D8] group-hover:text-white'
                    }`}
                  >
                    {item.name}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
