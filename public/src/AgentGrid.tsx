import React from 'react';
import { StoreAgent } from '../lib/supabase';
import { 
  Bot, 
  FileText, 
  ExternalLink, 
  Edit3, 
  Trash2, 
  Phone, 
  Store, 
  Eye, 
  AlertCircle,
  Copy,
  Check
} from 'lucide-react';

interface AgentGridProps {
  agents: StoreAgent[];
  onEdit: (agent: StoreAgent) => void;
  onDelete: (id: string, name: string) => void;
  onViewPdf: (url: string, storeName: string) => void;
}

export const AgentGrid: React.FC<AgentGridProps> = ({
  agents,
  onEdit,
  onDelete,
  onViewPdf,
}) => {
  const [copiedId, setCopiedId] = React.useState<string | null>(null);

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const hasValidPdf = (url: string) => {
    return url && url.trim() !== '' && url.toUpperCase() !== 'N/A' && (url.startsWith('http://') || url.startsWith('https://'));
  };

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN',
      maximumFractionDigits: 0,
    }).format(val || 0);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {agents.map((agent) => {
        const validPdf = hasValidPdf(agent.pdf_catalog_url);
        const cleanPhone = (agent.contact_phone || '').replace(/\D/g, '');

        return (
          <div 
            key={agent.id}
            className="rounded-xl border border-white/10 bg-[#0e1422] p-5 hover:border-lime-500/30 transition-all flex flex-col justify-between group shadow-lg"
          >
            <div>
              {/* Card Header */}
              <div className="flex items-start justify-between gap-3 mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-lime-500/20 to-slate-800 border border-lime-500/30 flex items-center justify-center text-lime-400 font-bold">
                    <Bot className="w-5 h-5 text-lime-400" />
                  </div>
                  <div>
                    <h3 className="font-bold text-white text-base group-hover:text-lime-400 transition-colors">
                      {agent.store_name || 'Sin Nombre'}
                    </h3>
                    <div className="flex items-center gap-1.5 text-xs text-slate-400 font-mono">
                      <span>ID: {agent.store_id || 'N/A'}</span>
                      <button 
                        onClick={() => copyToClipboard(agent.store_id, `grid-${agent.id}`)}
                        className="text-slate-500 hover:text-slate-300"
                        title="Copiar ID"
                      >
                        {copiedId === `grid-${agent.id}` ? (
                          <Check className="w-3 h-3 text-lime-400" />
                        ) : (
                          <Copy className="w-3 h-3" />
                        )}
                      </button>
                    </div>
                  </div>
                </div>

                <span className="px-2 py-0.5 rounded text-[10px] font-semibold uppercase bg-lime-500/10 text-lime-400 border border-lime-500/20">
                  {agent.selected_agent || 'Agente'}
                </span>
              </div>

              {/* Client & Phone */}
              <div className="p-3 rounded-lg bg-slate-900/60 border border-white/5 space-y-2 mb-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-400">Cliente:</span>
                  <span className="font-semibold text-slate-200">{agent.client_name || 'Sin nombre'}</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-400">Teléfono:</span>
                  {cleanPhone ? (
                    <a
                      href={`https://wa.me/52${cleanPhone}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-lime-400 hover:text-lime-300 font-mono"
                    >
                      <Phone className="w-3 h-3" />
                      <span>{agent.contact_phone}</span>
                    </a>
                  ) : (
                    <span className="text-slate-500">N/A</span>
                  )}
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-400">Avatar / Tipo:</span>
                  <span className="text-slate-300 font-mono text-[11px]">{agent.avatar_style || 'Default'} ({agent.business_type || 'Estándar'})</span>
                </div>
              </div>

              {/* Pricing breakdown */}
              <div className="grid grid-cols-2 gap-2 mb-3">
                <div className="p-2.5 rounded-lg bg-slate-800/40 border border-white/5 text-center">
                  <div className="text-[10px] uppercase text-slate-400">Setup Inicial</div>
                  <div className="text-sm font-bold text-white font-mono">{formatCurrency(agent.setup_price)}</div>
                </div>
                <div className="p-2.5 rounded-lg bg-lime-500/5 border border-lime-500/10 text-center">
                  <div className="text-[10px] uppercase text-lime-400/80">Mensualidad</div>
                  <div className="text-sm font-bold text-lime-400 font-mono">{formatCurrency(agent.monthly_price)}/m</div>
                </div>
              </div>

              {/* Custom Notes */}
              {agent.custom_notes && (
                <div className="text-xs text-slate-400 bg-slate-900/40 p-2.5 rounded border border-white/5 mb-3 italic line-clamp-2">
                  "{agent.custom_notes}"
                </div>
              )}
            </div>

            {/* Footer with PDF & Actions */}
            <div className="pt-3 border-t border-white/5 flex items-center justify-between gap-2">
              {validPdf ? (
                <div className="flex items-center gap-1.5">
                  <a
                    href={agent.pdf_catalog_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-xs font-medium transition-all"
                  >
                    <FileText className="w-3.5 h-3.5" />
                    <span>Catálogo PDF</span>
                    <ExternalLink className="w-3 h-3 ml-0.5" />
                  </a>
                  <button
                    onClick={() => onViewPdf(agent.pdf_catalog_url, agent.store_name)}
                    className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300"
                    title="Vista previa"
                  >
                    <Eye className="w-3.5 h-3.5" />
                  </button>
                </div>
              ) : (
                <span className="inline-flex items-center gap-1 text-[11px] text-slate-500">
                  <AlertCircle className="w-3 h-3 text-amber-500" />
                  <span>Sin PDF</span>
                </span>
              )}

              <div className="flex items-center gap-1.5 ml-auto">
                <button
                  onClick={() => onEdit(agent)}
                  className="p-1.5 rounded-lg bg-lime-500/10 hover:bg-lime-500/20 text-lime-400 border border-lime-500/30 transition-all"
                  title="Editar registro"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => onDelete(agent.id, agent.store_name)}
                  className="p-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 transition-all"
                  title="Eliminar registro"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};
