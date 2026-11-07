import React, { useState } from 'react';
import { X, Copy, Check, Database, Terminal, Shield } from 'lucide-react';

interface SqlGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SqlGuideModal: React.FC<SqlGuideModalProps> = ({ isOpen, onClose }) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const sqlSnippet = `-- 1. Crear tabla de administradores para DAMALEBOT en Supabase
CREATE TABLE IF NOT EXISTS public.admins (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  username TEXT NOT NULL UNIQUE,
  email TEXT NOT NULL UNIQUE,
  password TEXT NOT NULL,
  pin TEXT DEFAULT '8400',
  role TEXT DEFAULT 'superadmin',
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 2. Habilitar seguridad por fila (RLS)
ALTER TABLE public.admins ENABLE ROW LEVEL SECURITY;

-- 3. Permitir lectura para validación de acceso del admin panel
CREATE POLICY "Allow anon read for auth verification" 
ON public.admins FOR SELECT TO anon USING (true);

-- 4. Insertar superadministrador inicial
INSERT INTO public.admins (username, email, password, pin, role)
VALUES 
  ('admin', 'admin@damalebot.com', 'damalebot2026', '8400', 'superadmin')
ON CONFLICT (email) DO NOTHING;
`;

  const copyCode = () => {
    navigator.clipboard.writeText(sqlSnippet);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl rounded-2xl bg-[#0c1220] border border-white/10 shadow-2xl p-6 text-slate-200 max-h-[90vh] overflow-y-auto">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-lime-500/10 border border-lime-500/30 flex items-center justify-center text-lime-400">
              <Database className="w-5 h-5 text-lime-400" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">Esquema de Base de Datos Supabase</h2>
              <p className="text-xs text-slate-400">Gestión de tablas <code className="text-lime-400 font-mono">store_agents</code> y <code className="text-lime-400 font-mono">admins</code></p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg bg-slate-800/60 hover:bg-slate-700 text-slate-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="mt-4 space-y-4 text-xs text-slate-300">
          <div className="p-3.5 rounded-xl bg-slate-900/60 border border-white/5 space-y-1.5">
            <div className="font-semibold text-white flex items-center gap-2">
              <Shield className="w-4 h-4 text-lime-400" />
              <span>Autenticación de Administrador Activa</span>
            </div>
            <p className="text-slate-400 leading-relaxed">
              El panel incluye autenticación con clave maestra y PIN (<code className="text-lime-400 font-mono">admin@damalebot.com / damalebot2026</code> o PIN <code className="text-lime-400 font-mono">8400</code>).
              Si deseas además guardar cuentas de administradores directamente en la base de datos Supabase, puedes ejecutar el siguiente script SQL en el <strong>SQL Editor</strong> de tu proyecto Supabase.
            </p>
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="font-semibold text-slate-200 flex items-center gap-1.5">
                <Terminal className="w-4 h-4 text-lime-400" />
                Script SQL para Supabase (Opcional):
              </span>
              <button
                onClick={copyCode}
                className="flex items-center gap-1 px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-lime-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copiado!' : 'Copiar SQL'}</span>
              </button>
            </div>
            <pre className="p-3.5 rounded-xl bg-[#080d16] border border-white/10 text-slate-300 font-mono text-[11px] overflow-x-auto leading-relaxed">
              {sqlSnippet}
            </pre>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-5 pt-3 border-t border-white/10 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-medium"
          >
            Cerrar
          </button>
        </div>

      </div>
    </div>
  );
};
