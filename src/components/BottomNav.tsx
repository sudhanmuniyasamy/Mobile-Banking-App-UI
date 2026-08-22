import React from 'react';
import {
  Home,
  Search,
  QrCode,
  Bell,
  History,
} from 'lucide-react';
import { useBanking } from '../context/BankingContext';
import { ActiveTab } from '../types';

export const BottomNav: React.FC = () => {
  const { activeTab, setActiveTab, notifications } = useBanking();

  const unreadCount = notifications.filter((n) => !n.read).length;

  const navItems: { id: ActiveTab; label: string; icon: React.FC<{ className?: string }> }[] = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'search', label: 'Search', icon: Search },
    { id: 'scanner', label: 'Scanner', icon: QrCode },
    { id: 'notifications', label: 'Notification', icon: Bell },
    { id: 'activity', label: 'Activity', icon: History },
  ];

  const currentTab =
    activeTab === 'dashboard'
      ? 'home'
      : activeTab === 'transactions'
      ? 'activity'
      : activeTab;

  return (
    <nav className="sticky bottom-0 z-30 bg-white/95 backdrop-blur-md border-t border-slate-200/80 px-2 py-1.5 transition-colors shadow-2xs">
      <div className="flex items-center justify-around">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentTab === item.id;
          const isScanner = item.id === 'scanner';

          if (isScanner) {
            return (
              <button
                key={item.id}
                id={`nav-tab-${item.id}`}
                onClick={() => setActiveTab(item.id)}
                className="relative -top-3 flex flex-col items-center justify-center group"
              >
                <div
                  className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-300 shadow-md ${
                    isActive
                      ? 'bg-purple-600 text-white ring-4 ring-purple-100 scale-110'
                      : 'bg-slate-900 text-white hover:bg-slate-800'
                  }`}
                >
                  <Icon className="w-6 h-6 stroke-[2.2px]" />
                </div>
                <span
                  className={`text-[10px] mt-1 tracking-tight font-bold ${
                    isActive ? 'text-purple-700' : 'text-slate-600'
                  }`}
                >
                  {item.label}
                </span>
              </button>
            );
          }

          return (
            <button
              key={item.id}
              id={`nav-tab-${item.id}`}
              onClick={() => setActiveTab(item.id)}
              className={`relative flex flex-col items-center justify-center py-1 px-3 rounded-xl transition-all duration-200 ${
                isActive
                  ? 'text-slate-900 font-bold scale-105'
                  : 'text-slate-500 hover:text-slate-800 font-medium'
              }`}
            >
              <div className="relative">
                <Icon
                  className={`w-5 h-5 transition-transform ${
                    isActive ? 'stroke-[2.5px] text-slate-900' : 'stroke-2'
                  }`}
                />
                {item.id === 'notifications' && unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1.5 w-3.5 h-3.5 rounded-full bg-rose-500 text-white text-[9px] font-bold flex items-center justify-center ring-2 ring-white">
                    {unreadCount}
                  </span>
                )}
              </div>
              <span className="text-[10px] mt-1 tracking-tight">{item.label}</span>
              {isActive && (
                <div className="absolute -bottom-1 w-4 h-0.5 bg-slate-900 rounded-full" />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
};
