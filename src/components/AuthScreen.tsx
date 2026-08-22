import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  ShieldCheck,
  Fingerprint,
  ScanFace,
  Lock,
  ArrowRight,
  Sparkles,
  RefreshCw,
  Eye,
  EyeOff,
  Smartphone,
  CheckCircle2,
  KeyRound,
} from 'lucide-react';
import { useBanking } from '../context/BankingContext';
import { MonogramAvatar } from './MonogramAvatar';

export const AuthScreen: React.FC = () => {
  const { user, authenticate } = useBanking();
  const [authMode, setAuthMode] = useState<'fingerprint' | 'face' | 'passcode'>('fingerprint');
  const [pin, setPin] = useState<string>('');
  const [isScanning, setIsScanning] = useState<boolean>(false);
  const [scanSuccess, setScanSuccess] = useState<boolean>(false);
  const [isError, setIsError] = useState<boolean>(false);
  const [showPinHelper, setShowPinHelper] = useState<boolean>(false);

  const handleBiometricScan = (type: 'fingerprint' | 'face') => {
    setIsScanning(true);
    setIsError(false);

    setTimeout(() => {
      setIsScanning(false);
      setScanSuccess(true);
      setTimeout(() => {
        authenticate('biometric');
      }, 600);
    }, 1100);
  };

  const handlePinInput = (digit: string) => {
    if (pin.length < 6) {
      const newPin = pin + digit;
      setPin(newPin);
      setIsError(false);

      if (newPin.length === 6) {
        if (newPin === user.passcode) {
          setScanSuccess(true);
          setTimeout(() => {
            authenticate('pin', newPin);
          }, 500);
        } else {
          setIsError(true);
          setTimeout(() => {
            setPin('');
            setIsError(false);
          }, 800);
        }
      }
    }
  };

  const handleDeleteDigit = () => {
    setPin((prev) => prev.slice(0, -1));
    setIsError(false);
  };

  return (
    <div id="auth-screen-container" className="relative flex flex-col justify-between h-full min-h-[640px] p-6 bg-white text-slate-900 overflow-hidden">
      {/* Ambient background glows */}
      <div className="absolute -top-24 -left-24 w-72 h-72 bg-blue-500/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -right-24 w-72 h-72 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />

      {/* Top Brand Header */}
      <div className="relative z-10 flex items-center justify-between pt-2">
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-xl bg-slate-900 p-[1.5px] shadow-sm flex items-center justify-center text-white">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold tracking-tight text-slate-900 text-lg">APEX</span>
              <span className="text-[10px] font-bold tracking-wider uppercase px-1.5 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200">
                INDIA
              </span>
            </div>
            <p className="text-[11px] text-slate-500 font-medium">Private Banking & Wealth</p>
          </div>
        </div>

        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs">
          <button
            onClick={() => {
              setAuthMode('fingerprint');
              setPin('');
            }}
            className={`p-1.5 rounded-lg transition ${
              authMode === 'fingerprint'
                ? 'bg-white text-blue-600 font-bold shadow-2xs'
                : 'text-slate-500 hover:text-slate-900'
            }`}
            title="Fingerprint"
          >
            <Fingerprint className="w-4 h-4" />
          </button>
          <button
            onClick={() => {
              setAuthMode('face');
              setPin('');
            }}
            className={`p-1.5 rounded-lg transition ${
              authMode === 'face'
                ? 'bg-white text-purple-600 font-bold shadow-2xs'
                : 'text-slate-500 hover:text-slate-900'
            }`}
            title="Face Lock"
          >
            <ScanFace className="w-4 h-4" />
          </button>
          <button
            onClick={() => {
              setAuthMode('passcode');
              setPin('');
            }}
            className={`p-1.5 rounded-lg transition ${
              authMode === 'passcode'
                ? 'bg-white text-slate-900 font-bold shadow-2xs'
                : 'text-slate-500 hover:text-slate-900'
            }`}
            title="Passcode"
          >
            <KeyRound className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* User Welcome profile */}
      <div className="relative z-10 my-auto flex flex-col items-center text-center">
        <div className="relative mb-3">
          <MonogramAvatar
            name={user.name}
            size="xl"
            badge={
              <div className="w-6 h-6 rounded-full bg-slate-900 flex items-center justify-center text-white ring-2 ring-white shadow-xs">
                <Sparkles className="w-3 h-3" />
              </div>
            }
          />
        </div>

        <h1 className="text-lg font-bold text-slate-900 tracking-tight">Welcome, {user.name}</h1>
        <p className="text-xs text-slate-500 font-medium">{user.tier}</p>

        {/* Dynamic Auth Section */}
        <div className="w-full max-w-xs mt-5">
          <AnimatePresence mode="wait">
            {authMode === 'fingerprint' && (
              <motion.div
                key="fingerprint-pane"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="flex flex-col items-center"
              >
                {/* Fingerprint Scanner Visual */}
                <div className="relative my-3 flex items-center justify-center">
                  {isScanning && (
                    <>
                      <div className="absolute w-28 h-28 rounded-full border border-blue-500/30 animate-ping" />
                      <div className="absolute w-32 h-32 rounded-full border border-blue-400/20 animate-pulse" />
                    </>
                  )}

                  <button
                    id="fingerprint-trigger-btn"
                    onClick={() => handleBiometricScan('fingerprint')}
                    disabled={isScanning || scanSuccess}
                    className={`relative w-24 h-24 rounded-3xl flex flex-col items-center justify-center transition-all duration-300 shadow-lg ${
                      scanSuccess
                        ? 'bg-emerald-500 text-white scale-105 shadow-emerald-500/30'
                        : isScanning
                        ? 'bg-blue-50 text-blue-600 border border-blue-400 scale-105'
                        : 'bg-slate-50 hover:bg-blue-50/60 text-slate-700 border border-slate-200 hover:border-blue-400 group'
                    }`}
                  >
                    {scanSuccess ? (
                      <CheckCircle2 className="w-10 h-10 text-white" />
                    ) : isScanning ? (
                      <RefreshCw className="w-10 h-10 text-blue-600 animate-spin" />
                    ) : (
                      <Fingerprint className="w-11 h-11 text-blue-600 group-hover:scale-110 transition-transform duration-200" />
                    )}
                  </button>
                </div>

                <p className="text-xs text-slate-600 font-medium mt-1">
                  {scanSuccess
                    ? 'Fingerprint Verified • Unlocking'
                    : isScanning
                    ? 'Scanning Biometric Sensor...'
                    : 'Touch sensor or tap above to verify'}
                </p>

                <button
                  id="start-fingerprint-btn"
                  onClick={() => handleBiometricScan('fingerprint')}
                  disabled={isScanning}
                  className="mt-4 w-full py-2.5 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-md transition active:scale-[0.98] flex items-center justify-center gap-2"
                >
                  <Fingerprint className="w-4 h-4" />
                  <span>Verify Fingerprint</span>
                </button>
              </motion.div>
            )}

            {authMode === 'face' && (
              <motion.div
                key="face-pane"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="flex flex-col items-center"
              >
                {/* Face Lock Visual */}
                <div className="relative my-3 flex items-center justify-center">
                  {isScanning && (
                    <>
                      <div className="absolute w-28 h-28 rounded-full border border-purple-500/30 animate-ping" />
                      <div className="absolute w-32 h-32 rounded-full border border-purple-400/20 animate-pulse" />
                    </>
                  )}

                  <button
                    id="face-trigger-btn"
                    onClick={() => handleBiometricScan('face')}
                    disabled={isScanning || scanSuccess}
                    className={`relative w-24 h-24 rounded-3xl flex flex-col items-center justify-center transition-all duration-300 shadow-lg ${
                      scanSuccess
                        ? 'bg-emerald-500 text-white scale-105 shadow-emerald-500/30'
                        : isScanning
                        ? 'bg-purple-50 text-purple-600 border border-purple-400 scale-105'
                        : 'bg-slate-50 hover:bg-purple-50/60 text-slate-700 border border-slate-200 hover:border-purple-400 group'
                    }`}
                  >
                    {scanSuccess ? (
                      <CheckCircle2 className="w-10 h-10 text-white" />
                    ) : isScanning ? (
                      <ScanFace className="w-10 h-10 text-purple-600 animate-pulse" />
                    ) : (
                      <ScanFace className="w-11 h-11 text-purple-600 group-hover:scale-110 transition-transform duration-200" />
                    )}
                  </button>
                </div>

                <p className="text-xs text-slate-600 font-medium mt-1">
                  {scanSuccess
                    ? 'Face ID Matched • Unlocking'
                    : isScanning
                    ? 'Scanning Face & Depth Mesh...'
                    : 'Look at camera or tap above to verify'}
                </p>

                <button
                  id="start-face-btn"
                  onClick={() => handleBiometricScan('face')}
                  disabled={isScanning}
                  className="mt-4 w-full py-2.5 px-4 rounded-xl bg-purple-700 hover:bg-purple-800 text-white font-bold text-xs shadow-md transition active:scale-[0.98] flex items-center justify-center gap-2"
                >
                  <ScanFace className="w-4 h-4" />
                  <span>Verify with Face ID</span>
                </button>
              </motion.div>
            )}

            {authMode === 'passcode' && (
              <motion.div
                key="passcode-pane"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="flex flex-col items-center"
              >
                {/* 6-Digit PIN Indicators */}
                <div className={`flex items-center gap-3 my-3 ${isError ? 'animate-shake' : ''}`}>
                  {[0, 1, 2, 3, 4, 5].map((index) => {
                    const isFilled = pin.length > index;
                    return (
                      <div
                        key={index}
                        className={`w-3 h-3 rounded-full transition-all duration-200 ${
                          isFilled
                            ? 'bg-slate-900 scale-110 shadow-xs'
                            : 'bg-slate-200 border border-slate-300'
                        } ${isError ? 'bg-rose-500 border-rose-500' : ''}`}
                      />
                    );
                  })}
                </div>

                {isError && (
                  <p className="text-xs text-rose-600 font-semibold mb-1">Incorrect Passcode. Try again.</p>
                )}

                {/* Keypad Grid */}
                <div className="grid grid-cols-3 gap-2 w-full mt-1">
                  {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map((digit) => (
                    <button
                      key={digit}
                      onClick={() => handlePinInput(digit)}
                      className="h-10 rounded-xl bg-slate-100 hover:bg-slate-200 active:bg-slate-300 border border-slate-200 text-slate-900 font-bold text-base font-mono-num transition flex items-center justify-center shadow-2xs"
                    >
                      {digit}
                    </button>
                  ))}
                  <button
                    onClick={() => setShowPinHelper(!showPinHelper)}
                    className="h-10 rounded-xl text-slate-500 hover:text-slate-700 text-xs font-medium flex items-center justify-center"
                    title="Show Demo PIN"
                  >
                    {showPinHelper ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                  <button
                    onClick={() => handlePinInput('0')}
                    className="h-10 rounded-xl bg-slate-100 hover:bg-slate-200 active:bg-slate-300 border border-slate-200 text-slate-900 font-bold text-base font-mono-num transition flex items-center justify-center shadow-2xs"
                  >
                    0
                  </button>
                  <button
                    onClick={handleDeleteDigit}
                    className="h-10 rounded-xl text-slate-600 hover:text-rose-600 text-xs font-bold flex items-center justify-center"
                  >
                    Delete
                  </button>
                </div>

                {showPinHelper && (
                  <p className="text-[10px] text-slate-700 font-mono-num mt-2 bg-slate-100 px-2.5 py-0.5 rounded-md border border-slate-200">
                    Demo Passcode: <strong>123456</strong>
                  </p>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Footer Security Badges */}
      <div className="relative z-10 flex items-center justify-between text-[10px] text-slate-500 border-t border-slate-100 pt-2.5">
        <div className="flex items-center gap-1">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
          <span>NPCI & Hardware Enclave 2FA</span>
        </div>
        <div className="flex items-center gap-1">
          <Smartphone className="w-3.5 h-3.5 text-slate-400" />
          <span>Apex India Banking</span>
        </div>
      </div>
    </div>
  );
};
