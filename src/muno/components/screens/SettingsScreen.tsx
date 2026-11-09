import React, { useState } from 'react';
import {
  ArrowLeft,
  Cast,
  Bell,
  Search,
  ChevronUp,
  ChevronDown,
  Pencil,
  Smartphone,
  Trash2,
  Wifi,
  Tv,
} from 'lucide-react';

interface SettingsScreenProps {
  onBack: () => void;
  onLogout: () => void;
  defaultOpenSection?: 'overview' | 'settings';
}

export const SettingsScreen: React.FC<SettingsScreenProps> = ({
  onBack,
  onLogout,
}) => {
  const [isOverviewOpen, setIsOverviewOpen] = useState(true);
  const [isSubscriptionOpen, setIsSubscriptionOpen] = useState(true);
  const [isHistoryOpen, setIsHistoryOpen] = useState(true);
  const [wifiPlayback, setWifiPlayback] = useState(false);
  const [allowNotifications, setAllowNotifications] = useState(true);
  const [wifiDownloads, setWifiDownloads] = useState(false);

  return (
    <div className="min-h-full bg-[#05051F] text-white flex flex-col pb-20 select-none">
      {/* Top Header matching Screenshot 9 & 10 */}
      <div className="h-14 px-4 flex items-center justify-between sticky top-0 bg-[#05051F]/95 backdrop-blur-md z-30 border-b border-white/[0.04]">
        <div className="flex items-center space-x-3">
          <button
            onClick={onBack}
            className="p-1 -ml-1 text-white hover:text-white/80 transition-colors focus:outline-none"
            aria-label="Go back"
          >
            <ArrowLeft className="w-6 h-6 stroke-[2.2]" />
          </button>
          <h1 className="text-white text-[18px] font-bold tracking-tight">
            Settings
          </h1>
        </div>

        <div className="flex items-center space-x-3.5">
          <button className="text-white hover:opacity-80 transition-opacity focus:outline-none">
            <Cast className="w-[20px] h-[20px] stroke-[2]" />
          </button>
          <button className="text-white hover:opacity-80 transition-opacity focus:outline-none">
            <Bell className="w-[20px] h-[20px] stroke-[2]" />
          </button>
          <button className="text-white hover:opacity-80 transition-opacity focus:outline-none">
            <Search className="w-[20px] h-[20px] stroke-[2]" />
          </button>
        </div>
      </div>

      <div className="flex-1 divide-y divide-white/[0.04]">
        {/* Accordion 1: Overview (Screenshot 9) */}
        <div>
          <button
            onClick={() => setIsOverviewOpen(!isOverviewOpen)}
            className="w-full px-4 py-3 flex items-center justify-between text-left focus:outline-none"
          >
            <span className="text-white font-bold text-[15px]">Overview</span>
            {isOverviewOpen ? (
              <ChevronUp className="w-5 h-5 text-white" />
            ) : (
              <ChevronDown className="w-5 h-5 text-white" />
            )}
          </button>

          {isOverviewOpen && (
            <div className="px-4 pb-4 pt-1">
              {/* Sign Out header */}
              <div className="text-center mb-3">
                <button
                  onClick={onLogout}
                  className="text-white text-[15px] font-medium hover:underline focus:outline-none"
                >
                  Sign Out
                </button>
                <p className="text-[#8E8E9F] text-[10.5px] mt-0.5">Version: 4.7</p>
              </div>

              {/* Profile details matching Screenshot 9 */}
              <div className="flex items-start space-x-3.5">
                {/* Silhouette avatar */}
                <div className="w-18 h-18 bg-[#7E8899] rounded flex items-center justify-center flex-shrink-0">
                  <svg
                    className="w-14 h-14 text-white/90"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                  </svg>
                </div>

                <div className="flex-1 min-w-0 text-[12.5px] leading-relaxed">
                  <p className="text-white">
                    <span className="font-bold">Username :</span>{' '}
                    <span className="text-[#A5A5B5]">ashirafashes</span>
                  </p>
                  <p className="text-white truncate">
                    <span className="font-bold">Email :</span>{' '}
                    <span className="text-[#A5A5B5]">mutagwanyaashiraf@gmail.com</span>
                  </p>
                  <p className="text-white">
                    <span className="font-bold">Telephone:</span>{' '}
                    <span className="text-[#A5A5B5]"></span>
                  </p>
                  <p className="text-white">
                    <span className="font-bold">Last Login :</span>{' '}
                    <span className="text-[#A5A5B5]">2024-12-04 12:12:34</span>
                  </p>

                  <div className="mt-1.5 flex items-center space-x-1 text-[#00D522] cursor-pointer">
                    <Pencil className="w-3.5 h-3.5" />
                    <span className="text-[12px] font-medium">Update account info</span>
                  </div>
                </div>
              </div>

              {/* Action Links */}
              <div className="mt-4 flex items-center justify-between text-[13px] font-medium pt-2">
                <button className="text-[#3B82F6] hover:underline focus:outline-none">
                  Close account
                </button>
                <button className="text-[#00D522] hover:underline focus:outline-none">
                  change password
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Accordion 2: My subscription (Screenshot 9) */}
        <div>
          <button
            onClick={() => setIsSubscriptionOpen(!isSubscriptionOpen)}
            className="w-full px-4 py-3 flex items-center justify-between text-left focus:outline-none"
          >
            <span className="text-white font-bold text-[15px]">My subscription</span>
            {isSubscriptionOpen ? (
              <ChevronUp className="w-5 h-5 text-white" />
            ) : (
              <ChevronDown className="w-5 h-5 text-white" />
            )}
          </button>

          {isSubscriptionOpen && (
            <div className="px-4 pb-4 pt-1">
              <button className="w-full py-3 px-4 bg-[#E2E8F0] hover:bg-white text-[#05051F] font-medium text-sm rounded flex items-center justify-center space-x-2 transition-colors">
                <span>Upgrade to premium</span>
                <Tv className="w-4 h-4 ml-1" />
              </button>
            </div>
          )}
        </div>

        {/* Accordion 3: History (Screenshot 9) */}
        <div>
          <button
            onClick={() => setIsHistoryOpen(!isHistoryOpen)}
            className="w-full px-4 py-3 flex items-center justify-between text-left focus:outline-none"
          >
            <span className="text-white font-bold text-[15px]">History</span>
            {isHistoryOpen ? (
              <ChevronUp className="w-5 h-5 text-white" />
            ) : (
              <ChevronDown className="w-5 h-5 text-white" />
            )}
          </button>

          {isHistoryOpen && (
            <div className="px-4 pb-4 pt-1">
              <p className="text-[#8E8E9F] text-[13px]">Recent transactions</p>
            </div>
          )}
        </div>

        {/* Section: Video Playback (Screenshot 10) */}
        <div className="px-4 py-4 space-y-3">
          <h2 className="text-white font-bold text-[15px]">Video Playback</h2>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3.5">
              <Wifi className="w-5 h-5 text-[#8E8E9F]" />
              <div>
                <p className="text-white text-[13.5px]">WI-FI Only</p>
                <p className="text-[#8E8E9F] text-[11px]">Automatic</p>
              </div>
            </div>
            <button
              onClick={() => setWifiPlayback(!wifiPlayback)}
              className={`w-11 h-6 rounded-full transition-colors relative flex items-center px-0.5 ${
                wifiPlayback ? 'bg-[#00D522]' : 'bg-white/20'
              }`}
            >
              <div
                className={`w-5 h-5 rounded-full bg-white transition-transform ${
                  wifiPlayback ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>
        </div>

        {/* Section: Notifications (Screenshot 10) */}
        <div className="px-4 py-4 space-y-3">
          <h2 className="text-white font-bold text-[15px]">Notifications</h2>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3.5">
              <Bell className="w-5 h-5 text-[#8E8E9F]" />
              <div>
                <p className="text-white text-[13.5px]">Allow Notification</p>
                <p className="text-[#8E8E9F] text-[11px]">You will receive all notifications</p>
              </div>
            </div>
            <button
              onClick={() => setAllowNotifications(!allowNotifications)}
              className={`w-11 h-6 rounded-full transition-colors relative flex items-center px-0.5 ${
                allowNotifications ? 'bg-[#3B82F6]' : 'bg-white/20'
              }`}
            >
              <div
                className={`w-5 h-5 rounded-full bg-white transition-transform ${
                  allowNotifications ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>
        </div>

        {/* Section: Downloads (Screenshot 10) */}
        <div className="px-4 py-4 space-y-4">
          <h2 className="text-white font-bold text-[15px]">Downloads</h2>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3.5">
              <Wifi className="w-5 h-5 text-[#8E8E9F]" />
              <p className="text-white text-[13.5px]">WI-FI Only</p>
            </div>
            <button
              onClick={() => setWifiDownloads(!wifiDownloads)}
              className={`w-11 h-6 rounded-full transition-colors relative flex items-center px-0.5 ${
                wifiDownloads ? 'bg-[#00D522]' : 'bg-white/20'
              }`}
            >
              <div
                className={`w-5 h-5 rounded-full bg-white transition-transform ${
                  wifiDownloads ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          <div className="flex items-center space-x-3.5 cursor-pointer text-[#8E8E9F] hover:text-white">
            <Trash2 className="w-5 h-5" />
            <p className="text-white text-[13.5px]">Delete all downloads</p>
          </div>
        </div>

        {/* Section: About (Screenshot 10) */}
        <div className="px-4 py-4 space-y-4">
          <h2 className="text-white font-bold text-[15px]">About</h2>

          <div className="flex items-start space-x-3.5">
            <Smartphone className="w-5 h-5 text-[#8E8E9F] mt-0.5 flex-shrink-0" />
            <div className="text-[12.5px] leading-relaxed">
              <p className="text-white">Version: 13</p>
              <p className="text-[#8E8E9F]">
                App Version: 4.7 brand: samsung Model: SM-N986B c2s TP1A.220624.014 host: SWDK6513
              </p>
            </div>
          </div>

          <div className="flex items-start space-x-3.5">
            <div className="w-5 h-5 flex items-center justify-center text-[#8E8E9F]">
              <svg className="w-4.5 h-4.5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
              </svg>
            </div>
            <div className="text-[12.5px]">
              <p className="text-white">Account</p>
              <p className="text-[#8E8E9F]">Email:mutagwanyaashiraf@gmail.com</p>
              <p className="text-[#8E8E9F]">null-null</p>
            </div>
          </div>

          <div className="pl-8 text-[12.5px]">
            <p className="text-white">Version</p>
            <p className="text-[#8E8E9F]">4.7</p>
          </div>
        </div>
      </div>
    </div>
  );
};
