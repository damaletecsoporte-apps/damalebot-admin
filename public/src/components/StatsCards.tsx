import React from 'react';
import { StoreAgent } from '../lib/supabase';
import { Store, FileText, DollarSign, Repeat, Bot, CheckCircle2 } from 'lucide-react';

interface StatsCardsProps {
  agents: StoreAgent[];
}

export const StatsCards: React.FC<StatsCardsProps> = ({ agents }) => {
  const totalStores = agents.length;
  
  const catalogsWithPdf = agents.filter(
    (a) => a.pdf_catalog_url && a.pdf_catalog_url.trim() !== '' && a.pdf_catalog_url.toUpperCase() !== 'N/A'
  ).length;

  const totalSetup = agents.reduce((acc, curr) => acc + (Number(curr.setup_price) || 0), 0);
  const totalMonthly = agents.reduce((acc, curr) => acc + (Number(curr.monthly_price) || 0), 0);

  // Group by selected agent
  const agentCounts: Record<string, number> = {};
  agents.forEach((a) => {
    const name = a.selected_agent || 'Sin Asignar';
    agentCounts[name] = (agentCounts[name] || 0) + 1;
  });

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN',
      maximumFractionDigits: 0,
    }).format(val);
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      
      {/* Total Tiendas */}
      <div className="relative overflow-hidden rounded-xl bg-[#0e1422] border border-white/5 p-4 hover:border-lime-500/30 transition-all group">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-medium text-slate-400">Total Tiendas Registradas</span>
          <div className="p-2 rounded-lg bg-lime-500/10 text-lime-400 border border-lime-500/20 group-hover:scale-110 transition-transform">
            <Store className="w-4 h-4" />
          </div>
        </div>
        <div className="flex items-baseline gap-2">
          <span className="text-2xl font-black text-white">{totalStores}</span>
          <span className="text-xs text-lime-400 font-medium flex items-center gap-0.5">
            <CheckCircle2 className="w-3 h-3" /> Activas
          </span>
        </div>
        <div className="mt-3 text-[11px] text-slate-400 flex items-center gap-1.5 border-t border-white/5 pt-2">
          <span>Agentes:</span>
          {Object.entries(agentCounts).slice(0, 3).map(([agent, count]) => (
            <span key={agent} className="px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 font-mono text-[10px]">
              {agent}: {count}
            </span>
          ))}
        </div>
      </div>

      {/* Catálogos PDF */}
      <div className="relative overflow-hidden rounded-xl bg-[#0e1422] border border-white/5 p-4 hover:border-lime-500/30 transition-all group">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-medium text-slate-400">Catálogos PDF Vinculados</span>
          <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 group-hover:scale-110 transition-transform">
            <FileText className="w-4 h-4" />
          </div>
        </div>
        <div className="flex items-baseline gap-2">
          <span className="text-2xl font-black text-white">{catalogsWithPdf}</span>
          <span className="text-xs text-slate-400">de {totalStores} tiendas</span>
        </div>
        <div className="mt-3 flex items-center justify-between text-[11px] border-t border-white/5 pt-2">
          <span className="text-slate-400">Disponibilidad en Bot:</span>
          <span className="font-semibold text-lime-400">
            {totalStores > 0 ? Math.round((catalogsWithPdf / totalStores) * 100) : 0}%
          </span>
        </div>
      </div>

      {/* Setup Price Total */}
      <div className="relative overflow-hidden rounded-xl bg-[#0e1422] border border-white/5 p-4 hover:border-lime-500/30 transition-all group">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-medium text-slate-400">Ingresos por Setup Inicial</span>
          <div className="p-2 rounded-lg bg-lime-500/10 text-lime-400 border border-lime-500/20 group-hover:scale-110 transition-transform">
            <DollarSign className="w-4 h-4" />
          </div>
        </div>
        <div className="flex items-baseline gap-2">
          <span className="text-2xl font-black text-white">{formatCurrency(totalSetup)}</span>
        </div>
        <div className="mt-3 text-[11px] text-slate-400 flex items-center justify-between border-t border-white/5 pt-2">
          <span>Promedio por tienda:</span>
          <span className="font-mono text-slate-300">
            {totalStores > 0 ? formatCurrency(totalSetup / totalStores) : '$0'}
          </span>
        </div>
      </div>

      {/* Recurrencia Mensual MRR */}
      <div className="relative overflow-hidden rounded-xl bg-[#0e1422] border border-white/5 p-4 hover:border-lime-500/30 transition-all group">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-medium text-slate-400">Recurrencia Mensual (MRR)</span>
          <div className="p-2 rounded-lg bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 group-hover:scale-110 transition-transform">
            <Repeat className="w-4 h-4" />
          </div>
        </div>
        <div className="flex items-baseline gap-2">
          <span className="text-2xl font-black text-white">{formatCurrency(totalMonthly)}</span>
          <span className="text-[11px] text-slate-400">/ mes</span>
        </div>
        <div className="mt-3 text-[11px] text-slate-400 flex items-center justify-between border-t border-white/5 pt-2">
          <span>Proyección anual:</span>
          <span className="font-mono text-cyan-300 font-semibold">
            {formatCurrency(totalMonthly * 12)}
          </span>
        </div>
      </div>

    </div>
  );
};
