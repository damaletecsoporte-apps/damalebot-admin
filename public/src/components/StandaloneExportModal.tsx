import React, { useState } from 'react';
import { X, Copy, Check, Download, FileCode2, ExternalLink, Rocket } from 'lucide-react';

interface StandaloneExportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const StandaloneExportModal: React.FC<StandaloneExportModalProps> = ({ isOpen, onClose }) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handleCopyCode = async () => {
    try {
      const res = await fetch('/damalebot-admin.html');
      const htmlText = await res.text();
      await navigator.clipboard.writeText(htmlText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (e) {
      console.error(e);
    }
  };

  const handleDownload = () => {
    const a = document.createElement('a');
    a.href = '/damalebot-admin.html';
    a.download = 'damalebot-admin.html';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl rounded-2xl bg-[#0c1220] border border-white/10 shadow-2xl p-6 text-slate-200 max-h-[92vh] overflow-y-auto">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-lime-500/10 border border-lime-500/30 flex items-center justify-center text-lime-400">
              <FileCode2 className="w-5 h-5 text-lime-400" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <span>Archivo HTML Único para Despliegue en Vercel</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-lime-500/10 text-lime-400 border border-lime-500/20 font-mono">
                  100% Autocontenido
                </span>
              </h2>
              <p className="text-xs text-slate-400">
                Single-file HTML con Tailwind CSS CDN, Supabase JS SDK y PWA sin necesidad de node_modules.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg bg-slate-800/60 hover:bg-slate-700 text-slate-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Instructions */}
        <div className="mt-5 space-y-4 text-xs text-slate-300">
          
          <div className="p-4 rounded-xl bg-gradient-to-r from-lime-500/10 to-emerald-500/5 border border-lime-500/20">
            <div className="font-semibold text-white flex items-center gap-2 text-sm mb-1.5">
              <Rocket className="w-4 h-4 text-lime-400" />
              <span>Cómo desplegar en Vercel en 30 segundos:</span>
            </div>
            <ol className="list-decimal list-inside space-y-1 text-slate-300 leading-relaxed text-xs">
              <li>Haz clic en <strong>Descargar damalebot-admin.html</strong> (o renómbralo a <code>index.html</code>).</li>
              <li>Entra a tu cuenta en <a href="https://vercel.com" target="_blank" rel="noopener noreferrer" className="text-lime-400 underline">vercel.com</a>.</li>
              <li>Arrastra la carpeta con el archivo <code>index.html</code> al panel de Vercel (o súbelo a un repositorio GitHub).</li>
              <li>¡Listo! Tu panel de administración para DAMALEBOT estará en línea con HTTPS y certificado SSL automático.</li>
            </ol>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-900/60 border border-white/5 space-y-2">
            <div className="font-semibold text-slate-200">Credenciales maestras preconfiguradas:</div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] font-mono">
              <div className="p-2 rounded bg-slate-950 border border-white/5">
                <span className="text-slate-500 block">Usuario / Email:</span>
                <span className="text-lime-400 font-bold">admin@damalebot.com</span>
              </div>
              <div className="p-2 rounded bg-slate-950 border border-white/5">
                <span className="text-slate-500 block">Contraseña / PIN Maestro:</span>
                <span className="text-lime-400 font-bold">damalebot2026 <span className="text-slate-400 font-normal">(PIN: 8400)</span></span>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
            <button
              onClick={handleCopyCode}
              className="w-full sm:w-1/2 flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-medium text-xs border border-white/10 transition-colors"
            >
              {copied ? <Check className="w-4 h-4 text-lime-400" /> : <Copy className="w-4 h-4" />}
              <span>{copied ? '¡Código Copiado al Portapapeles!' : 'Copiar Código HTML Completo'}</span>
            </button>

            <button
              onClick={handleDownload}
              className="w-full sm:w-1/2 flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-lime-500 hover:bg-lime-400 text-slate-950 font-bold text-xs shadow-[0_0_20px_rgba(132,204,22,0.3)] transition-all"
            >
              <Download className="w-4 h-4 text-slate-950" />
              <span>Descargar damalebot-admin.html</span>
            </button>
          </div>

        </div>

      </div>
    </div>
  );
};
