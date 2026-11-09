import React from 'react';
import { Users2, Radio, X } from 'lucide-react';

interface SupportScreenProps {
  onBack: () => void;
  onShowToast?: (msg: string) => void;
}

const GROUP_URL = 'https://chat.whatsapp.com/EfjzgGyIIBJ1i017P0VlAB?s=cl&p=a&mlu=4&ilr=4';
const CHANNEL_URL = 'https://whatsapp.com/channel/0029VazB22oEFeXpRzIEEL1q';

export const SupportScreen: React.FC<SupportScreenProps> = ({ onBack }) => {
  const links = [
    { href: GROUP_URL, icon: <Users2 className="w-5 h-5 stroke-[2]" />, title: 'WhatsApp Group', sub: 'Join movie lovers community & discussions' },
    { href: CHANNEL_URL, icon: <Radio className="w-5 h-5 stroke-[2]" />, title: 'WhatsApp Channel', sub: 'Daily movie schedules & release announcements' },
  ];
  return (
    <div className="fixed inset-0 z-50 flex flex-col justify-end bg-black/70 backdrop-blur-xs select-none">
      <div className="flex-1" onClick={onBack} />
      <div className="w-full max-w-[430px] mx-auto bg-[#070728] border-t border-white/[0.08] rounded-t-2xl shadow-2xl animate-slideUp overflow-hidden">
        <div className="px-5 py-3 border-b border-white/[0.04] flex items-center justify-between">
          <h3 className="text-sm font-bold text-white tracking-wide">MunoMovies Support & Community</h3>
          <button onClick={onBack} className="p-1 text-[#9292A5] hover:text-white" aria-label="Close">
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="py-2 divide-y divide-white/[0.04]">
          {links.map((l) => (
            <a
              key={l.title}
              href={l.href}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setTimeout(onBack, 300)}
              className="w-full px-5 py-3.5 flex items-center space-x-4 text-left hover:bg-white/[0.04] transition-colors"
            >
              <div className="w-9 h-9 rounded-xl bg-emerald-500/15 flex items-center justify-center text-[#00D522]">{l.icon}</div>
              <div>
                <span className="text-white text-[14px] font-semibold block">{l.title}</span>
                <span className="text-[#9292A5] text-[11px]">{l.sub}</span>
              </div>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
};
