import React, { useState } from 'react';
import {
  ArrowLeft,
  User,
  Crown,
  CheckCircle2,
  ChevronRight,
  ShieldCheck,
  Pencil,
  Sparkles,
  Zap,
  Check,
  X,
  CreditCard,
} from 'lucide-react';

interface AccountScreenProps {
  onBack: () => void;
  onLogout: () => void;
  onShowToast: (msg: string) => void;
  isAdmin?: boolean;
  onOpenAdmin?: () => void;
  userName?: string;
  userEmail?: string;
  onUpdateProfile?: (name: string, avatar: string) => void;
  userAvatar?: string;
  onOpenAvatarPicker?: () => void;
}

const AVATAR_OPTIONS = [
  'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80',
  'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=150&q=80',
  'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=150&q=80',
  'https://images.unsplash.com/photo-1628157582853-a796fa650a6a?auto=format&fit=crop&w=150&q=80',
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
];

export const AccountScreen: React.FC<AccountScreenProps> = ({
  onBack,
  onLogout,
  onShowToast,
  isAdmin = false,
  onOpenAdmin,
  userName = 'Ashiraf Mutagwanya',
  userEmail = 'mutagwanyaashiraf@gmail.com',
  onUpdateProfile,
  userAvatar = '',
  onOpenAvatarPicker,
}) => {
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [editedName, setEditedName] = useState(userName);
  const [selectedAvatar, setSelectedAvatar] = useState(userAvatar);
  const [selectedPlanForPayment, setSelectedPlanForPayment] = useState<{
    name: string;
    price: string;
  } | null>(null);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);

  const initials = editedName
    .split(' ')
    .filter(Boolean)
    .map((n) => n[0])
    .join('')
    .substring(0, 2)
    .toUpperCase() || 'MM';

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (onUpdateProfile) {
      onUpdateProfile(editedName, selectedAvatar);
    }
    setIsEditingProfile(false);
    onShowToast('Profile and avatar updated successfully!');
  };

  const handleSubscribePlan = (planName: string, price: string) => {
    setSelectedPlanForPayment({ name: planName, price });
  };

  const handleConfirmMobileMoney = (provider: 'MTN' | 'Airtel') => {
    if (!selectedPlanForPayment) return;
    setIsProcessingPayment(true);
    setTimeout(() => {
      setIsProcessingPayment(false);
      onShowToast(
        `Push payment prompt sent to your phone for ${selectedPlanForPayment.name} (${selectedPlanForPayment.price} via ${provider} Money)!`
      );
      setSelectedPlanForPayment(null);
    }, 1200);
  };

  return (
    <div className="min-h-full bg-[#05051F] text-white flex flex-col pb-24 select-none animate-fadeIn">
      {/* Top Header */}
      <div className="h-14 px-4 flex items-center justify-between border-b border-white/[0.04] sticky top-0 bg-[#05051F]/95 backdrop-blur-md z-30">
        <div className="flex items-center space-x-3">
          <button
            onClick={onBack}
            className="p-1 -ml-1 text-white hover:text-[#00D522] transition-colors focus:outline-none cursor-pointer"
            aria-label="Go back"
          >
            <ArrowLeft className="w-6 h-6 stroke-[2.2]" />
          </button>
          <h1 className="text-white text-[18px] font-bold tracking-tight">
            My Account
          </h1>
        </div>
      </div>

      <div className="px-4 py-4 space-y-5 max-w-2xl mx-auto w-full">
        {/* Profile Card with Edit Pen icon at extreme edge */}
        <div className="p-4 bg-gradient-to-r from-[#0C0C38] to-[#080829] border border-white/[0.08] rounded-2xl flex items-center justify-between shadow-xl">
          <div className="flex items-center space-x-3.5 min-w-0">
            <div className="relative flex-shrink-0">
              {selectedAvatar ? (
                <img
                  src={selectedAvatar}
                  alt={userName}
                  className="w-14 h-14 rounded-full object-cover border-2 border-[#00D522]"
                />
              ) : (
                <div className="w-14 h-14 rounded-full bg-[#00D522]/20 border-2 border-[#00D522] flex items-center justify-center text-[#00D522] font-black text-xl">
                  {initials}
                </div>
              )}
              <div className="absolute -bottom-1 -right-1 bg-[#00D522] p-0.5 rounded-full">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#05051F]" />
              </div>
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center space-x-2">
                <h2 className="text-white font-bold text-base truncate">{userName}</h2>
              </div>
              <p className="text-[#9292A5] text-xs truncate">{userEmail}</p>
              <div className="mt-1 flex items-center space-x-1.5 flex-wrap gap-1">
                <span className="px-2 py-0.5 rounded-full bg-[#00D522]/20 text-[#00D522] text-[10px] font-bold uppercase tracking-wider flex items-center space-x-1">
                  <Crown className="w-3 h-3" />
                  <span>VIP Active</span>
                </span>
                {isAdmin && (
                  <span className="px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-400 text-[10px] font-bold uppercase tracking-wider flex items-center space-x-1">
                    <ShieldCheck className="w-3 h-3" />
                    <span>Admin</span>
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Extreme edge edit pen button */}
          <button
            onClick={() => {
              if (onOpenAvatarPicker) {
                onOpenAvatarPicker();
              } else {
                setEditedName(userName);
                setSelectedAvatar(userAvatar);
                setIsEditingProfile(true);
              }
            }}
            className="p-2.5 rounded-xl bg-white/[0.06] hover:bg-white/[0.12] text-[#00D522] border border-white/10 transition-colors cursor-pointer flex-shrink-0"
            title="Edit Profile & Avatar"
          >
            <Pencil className="w-4 h-4" />
          </button>
        </div>

        {/* Administrator Dashboard Launcher (if Admin) */}
        {isAdmin && onOpenAdmin && (
          <button
            onClick={onOpenAdmin}
            className="w-full p-4 bg-gradient-to-r from-purple-900/40 to-indigo-900/40 hover:from-purple-900/60 hover:to-indigo-900/60 border border-purple-500/30 rounded-2xl flex items-center justify-between transition-colors cursor-pointer shadow-lg"
          >
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl bg-purple-500/20 flex items-center justify-center text-purple-400">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div className="text-left">
                <div className="text-sm font-bold text-white">Administrator Panel</div>
                <div className="text-xs text-[#9292A5]">Manage users, catalog, and system settings</div>
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-purple-400" />
          </button>
        )}

        {/* Section Header: Subscription Plans */}
        <div className="pt-2">
          <div className="flex items-center space-x-2 mb-1">
            <Zap className="w-4 h-4 text-[#00D522]" />
            <h3 className="text-white text-sm font-bold tracking-wider uppercase">
              MunoMovies VIP Subscription Plans
            </h3>
          </div>
          <p className="text-[#9292A5] text-xs">
            Choose your preferred pass for uninterrupted streaming and high-speed downloads.
          </p>
        </div>

        {/* Plan 1: Daily VIP Pass (2,500 UGX) */}
        <div className="p-4 bg-white/[0.03] hover:bg-white/[0.05] border border-white/[0.06] rounded-2xl space-y-3 transition-colors shadow">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#00D522]" />
              <h4 className="text-white font-extrabold text-sm">Daily VIP Pass</h4>
            </div>
            <div className="text-right">
              <span className="text-[#00D522] font-black text-base">UGX 2,500</span>
              <span className="text-[#9292A5] text-[10px] block">/ 24 Hours</span>
            </div>
          </div>
          <p className="text-[#D0D0D8] text-xs leading-relaxed">
            Full 24-hour unlimited access to all translated movies, series episodes, and new drops by VJ Emmy & VJ Junior.
          </p>
          <button
            onClick={() => handleSubscribePlan('Daily VIP Pass', 'UGX 2,500')}
            className="w-full py-2.5 bg-[#00D522] hover:bg-[#00c21e] text-[#05051F] font-bold text-xs rounded-xl shadow-md transition-all flex items-center justify-center space-x-2 cursor-pointer active:scale-98"
          >
            <span>Subscribe Now</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* Plan 2: One Week VIP Pass (7,500 UGX) */}
        <div className="p-4 bg-gradient-to-r from-emerald-950/20 to-teal-950/20 border border-[#00D522]/30 rounded-2xl space-y-3 relative overflow-hidden shadow-lg">
          <div className="absolute top-0 right-0 bg-[#00D522] text-[#05051F] text-[9px] font-black uppercase tracking-wider px-3 py-0.5 rounded-bl-lg">
            Popular Choice
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Crown className="w-4 h-4 text-[#00D522]" />
              <h4 className="text-white font-extrabold text-sm">Weekly VIP Pass (1 Week)</h4>
            </div>
            <div className="text-right">
              <span className="text-[#00D522] font-black text-base">UGX 7,500</span>
              <span className="text-[#9292A5] text-[10px] block">/ 7 Days</span>
            </div>
          </div>
          <p className="text-[#D0D0D8] text-xs leading-relaxed">
            7 days of unlimited HD streaming across all categories, VJ translations, and offline mobile downloads.
          </p>
          <button
            onClick={() => handleSubscribePlan('Weekly VIP Pass', 'UGX 7,500')}
            className="w-full py-2.5 bg-[#00D522] hover:bg-[#00c21e] text-[#05051F] font-bold text-xs rounded-xl shadow-md transition-all flex items-center justify-center space-x-2 cursor-pointer active:scale-98"
          >
            <span>Subscribe Now</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* Plan 3: Monthly VIP Pass (15,500 UGX) */}
        <div className="p-4 bg-white/[0.03] hover:bg-white/[0.05] border border-white/[0.06] rounded-2xl space-y-3 transition-colors shadow">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <h4 className="text-white font-extrabold text-sm">Monthly VIP Pass</h4>
            </div>
            <div className="text-right">
              <span className="text-amber-400 font-black text-base">UGX 15,500</span>
              <span className="text-[#9292A5] text-[10px] block">/ 30 Days</span>
            </div>
          </div>
          <p className="text-[#D0D0D8] text-xs leading-relaxed">
            30 days of VIP pass with priority early cinema releases, 1080p downloads, and multi-device streaming freedom.
          </p>
          <button
            onClick={() => handleSubscribePlan('Monthly VIP Pass', 'UGX 15,500')}
            className="w-full py-2.5 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-500 hover:to-amber-600 text-black font-bold text-xs rounded-xl shadow-md transition-all flex items-center justify-center space-x-2 cursor-pointer active:scale-98"
          >
            <span>Subscribe Now</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Edit Profile & Avatar Modal */}
      {isEditingProfile && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#0C0C38] border border-white/[0.1] rounded-2xl p-6 max-w-sm w-full space-y-4 shadow-2xl animate-scaleUp">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-white">Edit Profile & Avatar</h3>
              <button
                onClick={() => setIsEditingProfile(false)}
                className="text-[#9292A5] hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveProfile} className="space-y-4">
              <div>
                <label className="text-[11px] font-semibold text-[#9292A5] uppercase tracking-wider block mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  required
                  value={editedName}
                  onChange={(e) => setEditedName(e.target.value)}
                  className="w-full h-11 px-3 bg-white/5 border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-[#00D522]"
                />
              </div>

              <div>
                <label className="text-[11px] font-semibold text-[#9292A5] uppercase tracking-wider block mb-2">
                  Choose Avatar
                </label>
                <div className="grid grid-cols-3 gap-2.5">
                  {AVATAR_OPTIONS.map((avatarUrl, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setSelectedAvatar(avatarUrl)}
                      className={`relative rounded-xl overflow-hidden border-2 transition-transform cursor-pointer aspect-square ${
                        selectedAvatar === avatarUrl
                          ? 'border-[#00D522] scale-105'
                          : 'border-white/10 hover:border-white/30'
                      }`}
                    >
                      <img src={avatarUrl} alt="Avatar option" className="w-full h-full object-cover" />
                      {selectedAvatar === avatarUrl && (
                        <div className="absolute inset-0 bg-[#00D522]/20 flex items-center justify-center">
                          <Check className="w-4 h-4 text-[#00D522] stroke-[3]" />
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsEditingProfile(false)}
                  className="flex-1 py-2.5 bg-white/10 hover:bg-white/15 text-white text-xs font-bold rounded-xl transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-[#00D522] hover:bg-[#00c21e] text-[#05051F] text-xs font-bold rounded-xl transition-colors cursor-pointer"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Payment Selection Sheet */}
      {selectedPlanForPayment && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-end sm:items-center justify-center p-4">
          <div className="bg-[#0C0C38] border border-white/[0.1] rounded-2xl p-6 max-w-sm w-full space-y-4 shadow-2xl animate-slideUp">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-white">{selectedPlanForPayment.name}</h3>
                <p className="text-xs text-[#00D522] font-extrabold">{selectedPlanForPayment.price}</p>
              </div>
              <button
                onClick={() => setSelectedPlanForPayment(null)}
                className="text-[#9292A5] hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-[#D0D0D8]">
              Select your payment method. An instant PIN prompt will be sent to your registered phone.
            </p>

            <div className="space-y-2 pt-1">
              <button
                disabled={isProcessingPayment}
                onClick={() => handleConfirmMobileMoney('MTN')}
                className="w-full p-3 bg-[#FFCC00]/15 hover:bg-[#FFCC00]/25 border border-[#FFCC00]/30 rounded-xl flex items-center justify-between transition-colors text-white text-xs font-bold cursor-pointer"
              >
                <div className="flex items-center space-x-2.5">
                  <span className="w-3 h-3 rounded-full bg-[#FFCC00]" />
                  <span>MTN Mobile Money (MoMo)</span>
                </div>
                <ChevronRight className="w-4 h-4 text-[#FFCC00]" />
              </button>

              <button
                disabled={isProcessingPayment}
                onClick={() => handleConfirmMobileMoney('Airtel')}
                className="w-full p-3 bg-[#FF0000]/15 hover:bg-[#FF0000]/25 border border-[#FF0000]/30 rounded-xl flex items-center justify-between transition-colors text-white text-xs font-bold cursor-pointer"
              >
                <div className="flex items-center space-x-2.5">
                  <span className="w-3 h-3 rounded-full bg-[#FF0000]" />
                  <span>Airtel Money</span>
                </div>
                <ChevronRight className="w-4 h-4 text-[#FF0000]" />
              </button>
            </div>

            {isProcessingPayment && (
              <div className="text-center text-xs text-[#00D522] font-semibold animate-pulse pt-2">
                Sending instant mobile prompt...
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
