import React from 'react';

interface MonogramAvatarProps {
  name: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  badge?: React.ReactNode;
}

const COLOR_PALETTES = [
  'bg-gradient-to-br from-indigo-500 to-indigo-700 text-white shadow-indigo-500/20',
  'bg-gradient-to-br from-blue-500 to-blue-700 text-white shadow-blue-500/20',
  'bg-gradient-to-br from-emerald-500 to-emerald-700 text-white shadow-emerald-500/20',
  'bg-gradient-to-br from-teal-500 to-teal-700 text-white shadow-teal-500/20',
  'bg-gradient-to-br from-purple-500 to-purple-700 text-white shadow-purple-500/20',
  'bg-gradient-to-br from-rose-500 to-rose-700 text-white shadow-rose-500/20',
  'bg-gradient-to-br from-amber-500 to-amber-700 text-white shadow-amber-500/20',
  'bg-gradient-to-br from-cyan-500 to-cyan-700 text-white shadow-cyan-500/20',
  'bg-gradient-to-br from-slate-700 to-slate-900 text-white shadow-slate-900/20',
];

function getPalette(name: string): string {
  if (!name) return COLOR_PALETTES[0];
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  const index = Math.abs(hash) % COLOR_PALETTES.length;
  return COLOR_PALETTES[index];
}

function getInitials(name: string): string {
  if (!name) return 'U';
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) {
    return parts[0].slice(0, 2).toUpperCase();
  }
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

export const MonogramAvatar: React.FC<MonogramAvatarProps> = ({
  name,
  size = 'md',
  className = '',
  badge,
}) => {
  const initials = getInitials(name);
  const palette = getPalette(name);

  const sizeClasses = {
    xs: 'w-7 h-7 text-[10px] font-bold',
    sm: 'w-8 h-8 text-[11px] font-bold',
    md: 'w-10 h-10 text-xs font-extrabold',
    lg: 'w-12 h-12 text-sm font-extrabold',
    xl: 'w-16 h-16 text-lg font-extrabold',
  };

  return (
    <div className="relative shrink-0 inline-flex items-center justify-center">
      <div
        className={`${sizeClasses[size]} rounded-full flex items-center justify-center tracking-wider ring-1 ring-black/5 select-none shadow-xs ${palette} ${className}`}
      >
        <span>{initials}</span>
      </div>
      {badge && <div className="absolute -bottom-0.5 -right-0.5">{badge}</div>}
    </div>
  );
};
