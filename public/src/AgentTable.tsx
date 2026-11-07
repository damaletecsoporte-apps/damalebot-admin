import React from 'react';
import { StoreAgent } from '../lib/supabase';
import { 
  FileText, 
  ExternalLink, 
  Edit3, 
  Trash2, 
  MessageSquare, 
  Phone, 
  Eye, 
  Bot, 
  AlertCircle,
  Copy,
  Check
} from 'lucide-react';

interface AgentTableProps {
  agents: StoreAgent[];
  onEdit: (agent: StoreAgent) => void;
  onDelete: (id: string, name: string) => void;
  onViewPdf: (url: string, storeName: string) => void;
}

export const AgentTable: React.FC<AgentTableProps> = ({
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

  const formatDate = (dateStr: string) => {
    if (!dateStr) return 'N/A';
    try {
      const d = new Date(dateStr);
      return d.toLocaleDateString('es-MX', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      });
    } catch {
      return dateStr;
    }
  };

  if (agents.length === 0) {
    return (
      <div className="rounded-xl border border-white/5 bg-[#0e1422] p-12 text-center">
        <Bot className="w-12 h-12 text-slate-600 mx-auto mb-3" />
        <h3 className="text-base font-semibold text-white">No se encontraron tiendas ni agentes</h3>
        <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
          Prueba ajustando el término de búsqueda o el filtro seleccionado.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-xl border border-white/10 bg-[#0e1422] shadow-xl">
      <table className="w-full text-left text-sm text-slate-300">
        <thead className="bg-[#121b2d] text-[11px] uppercase tracking-wider text-slate-400 border-b border-white/10">
          <tr>
            <th className="px-4 py-3.5 font-semibold">Tienda / Comercio</th>
            <th className="px-4 py-3.5 font-semibold">Cliente & Teléfono</th>
            <th className="px-4 py-3.5 font-semibold">Agente / Avatar</th>
            <th className="px-4 py-3.5 font-semibold">Precios (Setup / Mes)</th>
            <th className="px-4 py-3.5 font-semibold">Catálogo PDF</th>
            <th className="px-4 py-3.5 font-semibold">Notas Personalizadas</th>
            <th className="px-4 py-3.5 font-semibold">Fecha</th>
            <th className="px-4 py-3.5 font-semibold text-right">Acciones</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-white/5">
          {agents.map((agent) => {
            const validPdf = hasValidPdf(agent.pdf_catalog_url);
            const cleanPhone = (agent.contact_phone || '').replace(/\D/g, '');

            return (
              <tr 
                key={agent.id}
                className="hover:bg-slate-800/40 transition-colors group"
              >
                {/* Tienda & ID */}
                <td className="px-4 py-3.5 whitespace-nowrap">
                  <div className="font-semibold text-white group-hover:text-lime-400 transition-colors flex items-center gap-1.5">
                    {agent.store_name || 'Sin Nombre'}
                  </div>
                  <div className="flex items-center gap-1 text-[11px] text-slate-400 font-mono mt-0.5">
                    <span>ID: {agent.store_id || 'N/A'}</span>
                    <button 
                      onClick={() => copyToClipboard(agent.store_id, `id-${agent.id}`)}
                      className="text-slate-500 hover:text-slate-300"
                      title="Copiar ID de tienda"
                    >
                      {copiedId === `id-${agent.id}` ? (
                        <Check className="w-3 h-3 text-lime-400" />
                      ) : (
                        <Copy className="w-3 h-3" />
                      )}
                    </button>
                  </div>
                  <span className="inline-block mt-1 px-1.5 py-0.5 rounded text-[10px] bg-slate-800 text-slate-300 border border-white/5">
                    {agent.business_type || 'ESTÁNDAR'}
                  </span>
                </td>

                {/* Cliente & Contacto */}
                <td className="px-4 py-3.5 whitespace-nowrap">
                  <div className="text-slate-200 font-medium">
                    {agent.client_name || 'Sin especificar'}
                  </div>
                  {cleanPhone ? (
                    <a
                      href={`https://wa.me/52${cleanPhone}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-xs text-lime-400 hover:text-lime-300 mt-0.5 transition-colors font-mono"
                      title="Abrir chat en WhatsApp"
                    >
                      <Phone className="w-3 h-3" />
                      <span>{agent.contact_phone}</span>
                    </a>
                  ) : (
                    <span className="text-xs text-slate-500 font-mono">Sin teléfono</span>
                  )}
                </td>

                {/* Agente / Avatar */}
                <td className="px-4 py-3.5 whitespace-nowrap">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-full bg-lime-500/10 border border-lime-500/30 flex items-center justify-center text-lime-400">
                      <Bot className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="font-semibold text-white text-xs block">
                        {agent.selected_agent || 'Agente Genérico'}
                      </span>
                      <span className="text-[10px] text-slate-400">
                        Estilo: {agent.avatar_style || 'Default'}
                      </span>
                    </div>
                  </div>
                </td>

                {/* Precios */}
                <td className="px-4 py-3.5 whitespace-nowrap">
                  <div className="font-mono text-xs">
                    <span className="text-slate-400 text-[11px]">Setup: </span>
                    <span className="text-white font-semibold">{formatCurrency(agent.setup_price)}</span>
                  </div>
                  <div className="font-mono text-xs mt-0.5">
                    <span className="text-slate-400 text-[11px]">Mes: </span>
                    <span className="text-lime-400 font-semibold">{formatCurrency(agent.monthly_price)}</span>
                    <span className="text-[10px] text-slate-400">/m</span>
                  </div>
                </td>

                {/* Catálogo PDF */}
                <td className="px-4 py-3.5 whitespace-nowrap">
                  {validPdf ? (
                    <div className="flex items-center gap-1.5">
                      <a
                        href={agent.pdf_catalog_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-xs font-medium transition-all group/btn"
                        title="Abrir PDF en pestaña nueva"
                      >
                        <FileText className="w-3.5 h-3.5" />
                        <span>Abrir PDF</span>
                        <ExternalLink className="w-3 h-3 opacity-60 group-hover/btn:opacity-100" />
                      </a>
                      <button
                        onClick={() => onViewPdf(agent.pdf_catalog_url, agent.store_name)}
                        className="p-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
                        title="Vista previa rápida en ventana modal"
                      >
                        <Eye className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ) : (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] bg-slate-800/80 text-slate-400 border border-white/5">
                      <AlertCircle className="w-3 h-3 text-amber-500" />
                      <span>Sin Catálogo (N/A)</span>
                    </span>
                  )}
                </td>

                {/* Notas Personalizadas */}
                <td className="px-4 py-3.5 max-w-[200px]">
                  <div 
                    className="text-xs text-slate-300 truncate"
                    title={agent.custom_notes || 'Sin notas'}
                  >
                    {agent.custom_notes || <span className="text-slate-600 italic">Sin notas</span>}
                  </div>
                </td>

                {/* Fecha */}
                <td className="px-4 py-3.5 whitespace-nowrap text-xs text-slate-400 font-mono">
                  {formatDate(agent.created_at)}
                </td>

                {/* Acciones */}
                <td className="px-4 py-3.5 whitespace-nowrap text-right">
                  <div className="flex items-center justify-end gap-1.5">
                    <button
                      onClick={() => onEdit(agent)}
                      className="p-1.5 rounded-lg bg-lime-500/10 hover:bg-lime-500/20 text-lime-400 border border-lime-500/30 transition-all hover:scale-105"
                      title="Editar registro en Supabase"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => onDelete(agent.id, agent.store_name)}
                      className="p-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 transition-all hover:scale-105"
                      title="Eliminar de la base de datos"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};
