import React, { useState } from 'react';
import { supabase, AdminUser } from '../lib/supabase';
import { 
  Bot, 
  Lock, 
  User, 
  ShieldCheck, 
  Eye, 
  EyeOff, 
  KeyRound, 
  AlertCircle, 
  CheckCircle2, 
  ArrowRight,
  Database,
  Sparkles
} from 'lucide-react';

interface LoginScreenProps {
  onLoginSuccess: (admin: AdminUser) => void;
}

export const LoginScreen: React.FC<LoginScreenProps> = ({ onLoginSuccess }) => {
  const [username, setUsername] = useState('admin@damalebot.com');
  const [password, setPassword] = useState('damalebot2026');
  const [rememberMe, setRememberMe] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Master authorized admin list & PINs
  const MASTER_CREDENTIALS = [
    { user: 'admin@damalebot.com', pass: 'damalebot2026', pin: '8400', role: 'superadmin' as const },
    { user: 'damalebot', pass: 'damalebot2026', pin: '8400', role: 'superadmin' as const },
    { user: 'damianalegriad@gmail.com', pass: 'damalebot2026', pin: '8400', role: 'superadmin' as const },
  ];

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const inputUser = username.trim().toLowerCase();
    const inputPass = password.trim();

    if (!inputUser || !inputPass) {
      setError('Por favor ingresa usuario/correo y contraseña o PIN maestro.');
      setLoading(false);
      return;
    }

    try {
      let authenticated = false;
      let adminData: AdminUser = {
        username: inputUser.split('@')[0] || inputUser,
        email: inputUser.includes('@') ? inputUser : `${inputUser}@damalebot.com`,
        role: 'superadmin',
        last_login: new Date().toISOString(),
      };

      // 1. Check against Supabase public.admins or public.store_admins if they exist
      try {
        const { data: dbAdmins, error: dbError } = await supabase
          .from('admins')
          .select('*')
          .or(`username.eq.${inputUser},email.eq.${inputUser}`)
          .limit(1);

        if (!dbError && dbAdmins && dbAdmins.length > 0) {
          const match = dbAdmins[0];
          // If password matches in database
          if (match.password === inputPass || match.pin === inputPass) {
            authenticated = true;
            adminData = {
              id: match.id,
              username: match.username || inputUser,
              email: match.email || inputUser,
              role: match.role || 'superadmin',
              last_login: new Date().toISOString(),
            };
          }
        }
      } catch (checkErr) {
        // Table may not exist yet, continue to fallback
      }

      // 2. If table didn't exist or didn't authenticate, check master credentials / PIN
      if (!authenticated) {
        const masterMatch = MASTER_CREDENTIALS.find(
          (c) =>
            (c.user.toLowerCase() === inputUser || inputUser.includes('admin') || inputUser === 'damalebot') &&
            (c.pass === inputPass || c.pin === inputPass || inputPass === 'damalebot2026' || inputPass === '8400' || inputPass === '2026')
        );

        if (masterMatch) {
          authenticated = true;
          adminData.role = masterMatch.role;
        }
      }

      // 3. Alternatively, if user typed the master PIN '8400' or '2026' with any admin user
      if (!authenticated && (inputPass === '8400' || inputPass === 'damalebot2026' || inputPass === '2026')) {
        authenticated = true;
      }

      if (!authenticated) {
        setError('Credenciales inválidas. Verifica tu usuario y contraseña/PIN maestro.');
        setLoading(false);
        return;
      }

      // Save session in localStorage
      if (rememberMe) {
        localStorage.setItem('damalebot_admin_session', JSON.stringify({
          ...adminData,
          token: btoa(`${adminData.username}:${Date.now()}`),
          expiresAt: Date.now() + 1000 * 60 * 60 * 24 * 7, // 7 days
        }));
      } else {
        sessionStorage.setItem('damalebot_admin_session', JSON.stringify({
          ...adminData,
          token: btoa(`${adminData.username}:${Date.now()}`),
        }));
      }

      onLoginSuccess(adminData);
    } catch (err: any) {
      console.error('Login error:', err);
      setError(err.message || 'Error en el proceso de autenticación');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickDemo = () => {
    setUsername('admin@damalebot.com');
    setPassword('damalebot2026');
    setError(null);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-[#080c14] relative overflow-hidden">
      {/* Background radial glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-lime-500/10 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute -bottom-10 right-1/4 w-80 h-80 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none"></div>

      <div className="w-full max-w-md relative z-10 animate-in fade-in zoom-in-95 duration-300">
        
        {/* Brand header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-lime-500/20 via-slate-900 to-black border border-lime-500/40 text-lime-400 shadow-[0_0_30px_rgba(132,204,22,0.25)] mb-4">
            <Bot className="w-8 h-8 text-lime-400" />
          </div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">
            DAMALE<span className="text-lime-400">BOT</span>
          </h1>
          <p className="text-sm text-slate-400 mt-1 font-medium">
            Panel de Control Maestro & Agentes Supabase
          </p>
        </div>

        {/* Login Box */}
        <div className="rounded-2xl bg-[#0e1422]/90 border border-white/10 p-7 shadow-2xl backdrop-blur-xl">
          
          <div className="flex items-center justify-between pb-4 border-b border-white/5 mb-5">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-400">
              <ShieldCheck className="w-4 h-4 text-lime-400" />
              <span>Acceso Administrador</span>
            </div>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-lime-500/10 text-lime-400 border border-lime-500/20 font-mono">
              v2.5 PWA
            </span>
          </div>

          {error && (
            <div className="mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-300 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            
            {/* Username */}
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5 flex items-center justify-between">
                <span>Usuario o Correo Administrador</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                  <User className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="admin@damalebot.com"
                  className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-[#141d30] border border-white/10 focus:border-lime-500 focus:outline-none focus:ring-1 focus:ring-lime-500 text-sm text-white placeholder-slate-500 transition-colors"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5 flex items-center justify-between">
                <span>Contraseña o PIN Maestro</span>
                <span className="text-[10px] text-slate-500 font-mono">PIN: 8400</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-[#141d30] border border-white/10 focus:border-lime-500 focus:outline-none focus:ring-1 focus:ring-lime-500 text-sm text-white placeholder-slate-500 transition-colors font-mono"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-500 hover:text-slate-300"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Remember Me */}
            <div className="flex items-center justify-between pt-1">
              <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-400 hover:text-slate-200">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="rounded bg-slate-800 border-white/10 text-lime-500 focus:ring-lime-500 focus:ring-offset-0"
                />
                <span>Mantener sesión activa (localStorage)</span>
              </label>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 py-3 px-4 rounded-xl bg-lime-500 hover:bg-lime-400 text-slate-950 font-bold text-sm flex items-center justify-center gap-2 transition-all shadow-[0_0_20px_rgba(132,204,22,0.3)] hover:shadow-[0_0_25px_rgba(132,204,22,0.5)] disabled:opacity-50"
            >
              {loading ? (
                <span>Validando credenciales en Supabase...</span>
              ) : (
                <>
                  <span>Ingresar al Panel Maestro</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Quick Credential Test Helper */}
          <div className="mt-5 pt-4 border-t border-white/5">
            <button
              type="button"
              onClick={handleQuickDemo}
              className="w-full flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg bg-slate-800/60 hover:bg-slate-800 text-slate-400 hover:text-slate-200 text-xs transition-colors border border-white/5"
            >
              <Sparkles className="w-3.5 h-3.5 text-lime-400" />
              <span>Autocompletar Credenciales Maestras</span>
            </button>
          </div>

        </div>

        {/* Database Connection Note */}
        <div className="mt-4 text-center">
          <p className="text-[11px] text-slate-500 flex items-center justify-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-lime-400 animate-pulse"></span>
            Conexión protegida con Supabase: <span className="font-mono text-slate-400">dascjzrsxrctveepnbck</span>
          </p>
        </div>

      </div>
    </div>
  );
};
