import React from 'react';
import { 
  Bot, 
  LogOut, 
  ShieldCheck, 
  Radio, 
  FileCode2, 
  Database, 
  RefreshCw,
  ExternalLink
} from 'lucide-react';
import { AdminUser } from '../lib/supabase';

interface NavbarProps {
  admin: AdminUser | null;
  onLogout: () => void;
  isRealtimeActive: boolean;
  onRefresh: () => void;
  isRefreshing: boolean;
  onOpenSqlGuide: () => void;
  onOpenExportModal: () => void;
  recordCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  admin,
  onLogout,
  isRealtimeActive,
  onRefresh,
  isRefreshing,
  onOpenSqlGuide,
  onOpenExportModal,
  recordCount
}) => {
  return (
    <header className="sticky top-0 z-30 border-b border-white/10 bg-[#090d16]/90 backdrop-blur-md px-4 lg:px-8 py-3.5">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        
        {/* Brand / Logo */}
        <div className="flex items-center gap-3">
          <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-lime-500/10 border border-lime-500/30 text-lime-400 shadow-[0_0_15px_rgba(132,204,22,0.2)]">
            <Bot className="w-5 h-5 text-lime-400" />
            <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-lime-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-lime-500"></span>
            </span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold tracking-tight text-white text-lg">DAMALE<span className="text-lime-400">BOT</span></span>
              <span className="text-[10px] font-semibold tracking-wider uppercase px-2 py-0.5 rounded-full bg-lime-500/10 text-lime-400 border border-lime-500/20">
                MASTER ADMIN
              </span>
            </div>
            <p className="text-xs text-slate-400 hidden sm:block">Control Maestro de Tiendas & Agentes IA</p>
          </div>
        </div>

        {/* Center / Status */}
        <div className="hidden md:flex items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-900/80 border border-white/5 text-xs">
            <Radio className={`w-3.5 h-3.5 ${isRealtimeActive ? 'text-lime-400 animate-pulse' : 'text-slate-500'}`} />
            <span className="text-slate-300 font-medium">Supabase Realtime</span>
            <span className="w-1.5 h-1.5 rounded-full bg-lime-400"></span>
            <span className="text-slate-400 text-[11px] font-mono">{recordCount} registros</span>
          </div>

          <button
            onClick={onRefresh}
            disabled={isRefreshing}
            title="Sincronizar datos de Supabase"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-700/80 text-slate-300 hover:text-white text-xs border border-white/5 transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin text-lime-400' : ''}`} />
            <span>Sincronizar</span>
          </button>
        </div>

        {/* Right Tools & Admin Profile */}
        <div className="flex items-center gap-2 sm:gap-3">
          <button
            onClick={onOpenExportModal}
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-lime-500/10 hover:bg-lime-500/20 text-lime-400 border border-lime-500/30 text-xs font-medium transition-all"
            title="Ver o copiar el archivo HTML único para Vercel"
          >
            <FileCode2 className="w-3.5 h-3.5" />
            <span>HTML Vercel</span>
          </button>

          <button
            onClick={onOpenSqlGuide}
            className="hidden lg:flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-slate-800/60 hover:bg-slate-800 text-slate-400 hover:text-slate-200 text-xs border border-white/5 transition-colors"
            title="Información de esquema de Supabase"
          >
            <Database className="w-3.5 h-3.5" />
            <span>Esquema</span>
          </button>

          {/* User badge */}
          {admin && (
            <div className="flex items-center gap-2 pl-2 border-l border-white/10">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-lime-500/20 to-slate-800 border border-lime-500/30 flex items-center justify-center text-lime-400 font-bold text-xs">
                {admin.username.charAt(0).toUpperCase()}
              </div>
              <div className="hidden xl:block text-left">
                <div className="flex items-center gap-1">
                  <span className="text-xs font-semibold text-white leading-tight">{admin.username}</span>
                  <ShieldCheck className="w-3.5 h-3.5 text-lime-400" />
                </div>
                <span className="text-[10px] text-slate-400 block uppercase tracking-wider">{admin.role}</span>
              </div>
            </div>
          )}

          {/* Logout Button */}
          <button
            onClick={onLogout}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 hover:text-red-300 border border-red-500/20 text-xs font-medium transition-all"
            title="Cerrar sesión de administrador"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Cerrar Sesión</span>
          </button>
        </div>

      </div>
    </header>
  );
};
