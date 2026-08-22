import React, { useState, useEffect } from 'react';
import {
  Smartphone,
  Maximize2,
  Wifi,
  BatteryMedium,
  RefreshCw,
  ShieldCheck,
  Zap,
} from 'lucide-react';
import { useBanking } from '../context/BankingContext';

export const MobileFrame: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const {
    deviceFrameEnabled,
    toggleDeviceFrame,
    resetAllDemoData,
    triggerLiveSimulatedTransaction,
    isLiveSimulationActive,
    toggleLiveSimulation,
  } = useBanking();

  const [currentTime, setCurrentTime] = useState<string>('9:41');
  const [isMobileScreen, setIsMobileScreen] = useState<boolean>(false);

  useEffect(() => {
    const checkScreen = () => {
      setIsMobileScreen(window.innerWidth < 640);
    };
    checkScreen();
    window.addEventListener('resize', checkScreen);
    return () => window.removeEventListener('resize', checkScreen);
  }, []);

  useEffect(() => {
    const updateTime = () => {
      const d = new Date();
      let hours = d.getHours();
      const minutes = d.getMinutes().toString().padStart(2, '0');
      hours = hours % 12 || 12;
      setCurrentTime(`${hours}:${minutes}`);
    };
    updateTime();
    const interval = setInterval(updateTime, 10000);
    return () => clearInterval(interval);
  }, []);

  // When on an actual mobile screen, render full native viewport without artificial bezels
  if (isMobileScreen) {
    return (
      <div className="w-full min-h-[100dvh] h-[100dvh] bg-white text-slate-900 flex flex-col overflow-hidden select-none">
        <div className="flex-1 relative overflow-hidden flex flex-col justify-between bg-white w-full h-full">
          {children}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900 flex flex-col items-center justify-center p-2 sm:p-6 lg:p-8 select-none">
      {/* Top Floating Control Bar for Demo / Workspace Tools (Desktop Only) */}
      <div className="w-full max-w-[390px] flex items-center justify-between gap-2 mb-3 px-3.5 py-2 rounded-2xl bg-white border border-slate-200/90 shadow-xs">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-lg bg-blue-600 flex items-center justify-center text-white shadow-xs">
            <ShieldCheck className="w-3.5 h-3.5" />
          </div>
          <div>
            <span className="text-xs font-extrabold text-slate-900 tracking-tight">Apex Banking</span>
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          {/* Toggle Live Ticker */}
          <button
            onClick={toggleLiveSimulation}
            className={`px-2 py-1 rounded-xl border text-[11px] font-semibold flex items-center gap-1 transition ${
              isLiveSimulationActive
                ? 'bg-emerald-50 border-emerald-300 text-emerald-700 shadow-2xs'
                : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
            }`}
            title="Toggle Live Ticker Stream"
          >
            <span
              className={`w-1.5 h-1.5 rounded-full ${
                isLiveSimulationActive ? 'bg-emerald-500 animate-pulse' : 'bg-slate-400'
              }`}
            />
            <span>{isLiveSimulationActive ? 'Live' : 'Paused'}</span>
          </button>

          {/* Simulate Transaction */}
          <button
            onClick={triggerLiveSimulatedTransaction}
            className="p-1.5 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-800 border border-slate-200 transition"
            title="Simulate Instant Transaction"
          >
            <Zap className="w-3.5 h-3.5 text-amber-500" />
          </button>

          {/* Reset Demo Data */}
          <button
            onClick={resetAllDemoData}
            className="p-1.5 rounded-xl bg-slate-50 hover:bg-rose-50 text-slate-600 hover:text-rose-600 border border-slate-200 transition text-xs"
            title="Reset All Banking Demo Data"
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Main Smartphone Container - Strict 9:19.5 Mobile Aspect Ratio */}
      <div className="relative w-full max-w-[390px] rounded-[48px] bg-slate-900 p-[8px] shadow-[0_25px_60px_rgba(15,23,42,0.18)] ring-1 ring-slate-900/20">
        {/* Side volume & power button accents */}
        <div className="absolute -left-[10px] top-[100px] w-[3px] h-[26px] bg-slate-700 rounded-l-md" />
        <div className="absolute -left-[10px] top-[138px] w-[3px] h-[46px] bg-slate-700 rounded-l-md" />
        <div className="absolute -left-[10px] top-[194px] w-[3px] h-[46px] bg-slate-700 rounded-l-md" />
        <div className="absolute -right-[10px] top-[155px] w-[3px] h-[68px] bg-slate-700 rounded-r-md" />

        {/* Inner Screen Bezel */}
        <div className="relative w-full rounded-[40px] bg-white overflow-hidden border border-slate-200 flex flex-col h-[820px] max-h-[92vh]">
          {/* Top iOS Status Bar with Dynamic Island (Desktop Phone Mockup Only) */}
          <div className="relative z-40 px-5 pt-3 pb-1 flex items-center justify-between text-xs font-semibold text-slate-700 bg-white border-b border-slate-100 shrink-0">
            <span className="font-mono text-slate-900 font-bold text-[12px]">{currentTime}</span>

            {/* Dynamic Island */}
            <div className="absolute left-1/2 -translate-x-1/2 top-2 h-6 w-28 rounded-full bg-slate-950 flex items-center justify-between px-2.5 shadow-md border border-slate-800/60">
              <div className="w-1.5 h-1.5 rounded-full bg-slate-800 flex items-center justify-center">
                <div className="w-1 h-1 rounded-full bg-emerald-400 animate-pulse" />
              </div>
              <span className="text-[8.5px] font-mono font-bold text-white tracking-tighter">
                APEX INDIA
              </span>
              <div className="w-1.5 h-1.5 rounded-full bg-slate-800" />
            </div>

            <div className="flex items-center gap-1 text-slate-600">
              <span className="text-[9px] font-bold">5G</span>
              <Wifi className="w-3 h-3" />
              <BatteryMedium className="w-3.5 h-3.5 text-slate-800" />
            </div>
          </div>

          {/* App Body Container */}
          <div className="flex-1 relative overflow-hidden flex flex-col justify-between bg-white w-full h-full">
            {children}
          </div>

          {/* iOS Bottom Home Bar Indicator */}
          <div className="relative z-40 w-full py-1.5 bg-white border-t border-slate-100 flex justify-center shrink-0">
            <div className="w-28 h-1 bg-slate-300 rounded-full" />
          </div>
        </div>
      </div>
    </div>
  );
};
