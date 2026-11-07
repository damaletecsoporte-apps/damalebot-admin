/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useCallback } from 'react';
import { supabase, StoreAgent, AdminUser } from './lib/supabase';
import { Navbar } from './components/Navbar';
import { StatsCards } from './components/StatsCards';
import { AgentTable } from './components/AgentTable';
import { AgentGrid } from './components/AgentGrid';
import { AgentModal } from './components/AgentModal';
import { PdfViewerModal } from './components/PdfViewerModal';
import { LoginScreen } from './components/LoginScreen';
import { SqlGuideModal } from './components/SqlGuideModal';
import { StandaloneExportModal } from './components/StandaloneExportModal';
import { 
  Search, 
  Plus, 
  LayoutList, 
  LayoutGrid, 
  FileText, 
  Filter, 
  CheckCircle2, 
  AlertCircle,
  Download,
  FileCode2,
  Sparkles
} from 'lucide-react';

export default function App() {
  const [admin, setAdmin] = useState<AdminUser | null>(null);
  const [agents, setAgents] = useState<StoreAgent[]>([]);
  const [loading, setLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isRealtimeActive, setIsRealtimeActive] = useState(false);

  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedAgentFilter, setSelectedAgentFilter] = useState('ALL');
  const [pdfFilter, setPdfFilter] = useState<'ALL' | 'WITH_PDF' | 'NO_PDF'>('ALL');
  const [viewMode, setViewMode] = useState<'table' | 'grid'>('table');

  // Modals state
  const [isAgentModalOpen, setIsAgentModalOpen] = useState(false);
  const [agentToEdit, setAgentToEdit] = useState<StoreAgent | null>(null);
  
  const [isPdfModalOpen, setIsPdfModalOpen] = useState(false);
  const [activePdfUrl, setActivePdfUrl] = useState<string | null>(null);
  const [activePdfStore, setActivePdfStore] = useState<string | null>(null);

  const [isSqlModalOpen, setIsSqlModalOpen] = useState(false);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);

  // Toast feedback
  const [toastMessage, setToastMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  const showToast = (text: string, type: 'success' | 'error' = 'success') => {
    setToastMessage({ text, type });
    setTimeout(() => setToastMessage(null), 3500);
  };

  // 1. Check local session on mount
  useEffect(() => {
    const stored = localStorage.getItem('damalebot_admin_session') || sessionStorage.getItem('damalebot_admin_session');
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setAdmin(parsed);
      } catch {
        localStorage.removeItem('damalebot_admin_session');
      }
    }
  }, []);

  // 2. Fetch data from Supabase
  const fetchAgents = useCallback(async (quiet = false) => {
    if (!quiet) setIsRefreshing(true);
    try {
      const { data, error } = await supabase
        .from('store_agents')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching store_agents:', error);
        showToast('Error al conectar con Supabase: ' + error.message, 'error');
      } else {
        setAgents(data || []);
      }
    } catch (err: any) {
      console.error(err);
      showToast('Error de red al consultar Supabase', 'error');
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  }, []);

  // 3. Set up Realtime subscription
  useEffect(() => {
    if (!admin) return;

    fetchAgents();

    // Setup channel for store_agents table
    const channel = supabase
      .channel('damalebot_store_agents_realtime')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'store_agents' },
        (payload) => {
          console.log('Realtime update received:', payload);
          setIsRealtimeActive(true);
          fetchAgents(true);
          showToast('Actualización en tiempo real recibida de Supabase', 'success');
        }
      )
      .subscribe((status) => {
        if (status === 'SUBSCRIBED') {
          setIsRealtimeActive(true);
        }
      });

    return () => {
      supabase.removeChannel(channel);
    };
  }, [admin, fetchAgents]);

  const handleLogout = () => {
    localStorage.removeItem('damalebot_admin_session');
    sessionStorage.removeItem('damalebot_admin_session');
    setAdmin(null);
  };

  const handleEditAgent = (agent: StoreAgent) => {
    setAgentToEdit(agent);
    setIsAgentModalOpen(true);
  };

  const handleCreateNewAgent = () => {
    setAgentToEdit(null);
    setIsAgentModalOpen(true);
  };

  const handleDeleteAgent = async (id: string, name: string) => {
    if (!confirm(`¿Estás seguro de que deseas eliminar la tienda "${name}" de Supabase? Esta acción no se puede deshacer.`)) {
      return;
    }

    try {
      const { error } = await supabase.from('store_agents').delete().eq('id', id);
      if (error) throw error;

      setAgents((prev) => prev.filter((a) => a.id !== id));
      showToast(`Tienda "${name}" eliminada de Supabase`, 'success');
    } catch (err: any) {
      console.error('Delete error:', err);
      showToast('Error al eliminar: ' + err.message, 'error');
    }
  };

  const handleViewPdf = (url: string, storeName: string) => {
    setActivePdfUrl(url);
    setActivePdfStore(storeName);
    setIsPdfModalOpen(true);
  };

  const handleAgentSaved = (saved: StoreAgent, isNew: boolean) => {
    if (isNew) {
      setAgents((prev) => [saved, ...prev]);
      showToast('Nueva tienda y agente agregados a Supabase', 'success');
    } else {
      setAgents((prev) => prev.map((a) => (a.id === saved.id ? saved : a)));
      showToast('Registro de tienda actualizado correctamente en Supabase', 'success');
    }
  };

  // Filtered agents list
  const filteredAgents = agents.filter((agent) => {
    const q = searchQuery.toLowerCase().trim();
    const matchesSearch =
      !q ||
      (agent.store_name || '').toLowerCase().includes(q) ||
      (agent.client_name || '').toLowerCase().includes(q) ||
      (agent.contact_phone || '').includes(q) ||
      (agent.store_id || '').includes(q) ||
      (agent.custom_notes || '').toLowerCase().includes(q);

    const matchesAgent =
      selectedAgentFilter === 'ALL' || agent.selected_agent === selectedAgentFilter;

    const hasPdf =
      agent.pdf_catalog_url &&
      agent.pdf_catalog_url.trim() !== '' &&
      agent.pdf_catalog_url.toUpperCase() !== 'N/A' &&
      agent.pdf_catalog_url.startsWith('http');

    const matchesPdf =
      pdfFilter === 'ALL' ||
      (pdfFilter === 'WITH_PDF' && hasPdf) ||
      (pdfFilter === 'NO_PDF' && !hasPdf);

    return matchesSearch && matchesAgent && matchesPdf;
  });

  // Unique agent names for dropdown filter
  const agentNames = Array.from(new Set(agents.map((a) => a.selected_agent || 'Alejandro').filter(Boolean)));

  // If not logged in, show clean admin login screen
  if (!admin) {
    return <LoginScreen onLoginSuccess={(user) => setAdmin(user)} />;
  }

  return (
    <div className="min-h-screen bg-[#080c14] text-slate-100 flex flex-col font-['Inter',sans-serif]">
      
      {/* Top Navbar */}
      <Navbar
        admin={admin}
        onLogout={handleLogout}
        isRealtimeActive={isRealtimeActive}
        onRefresh={() => fetchAgents(false)}
        isRefreshing={isRefreshing}
        onOpenSqlGuide={() => setIsSqlModalOpen(true)}
        onOpenExportModal={() => setIsExportModalOpen(true)}
        recordCount={agents.length}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 lg:px-8 py-6">
        
        {/* Banner with action */}
        <div className="mb-6 p-4 rounded-2xl bg-gradient-to-r from-lime-500/10 via-[#0e1422] to-slate-900 border border-lime-500/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-lg">
          <div>
            <h1 className="text-xl font-black text-white tracking-tight flex items-center gap-2">
              <span>Panel Maestro DAMALEBOT</span>
              <span className="text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full bg-lime-500/20 text-lime-400 border border-lime-500/30">
                Supabase DB
              </span>
            </h1>
            <p className="text-xs text-slate-400 mt-0.5">
              Gestión centralizada de tiendas, avatares seleccionados, catálogo PDF y notas de prompting para el bot.
            </p>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              onClick={() => setIsExportModalOpen(true)}
              className="flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-white/10 text-xs font-semibold transition-colors"
            >
              <FileCode2 className="w-3.5 h-3.5 text-lime-400" />
              <span>HTML Vercel (1 Archivo)</span>
            </button>

            <button
              onClick={handleCreateNewAgent}
              className="flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl bg-lime-500 hover:bg-lime-400 text-slate-950 text-xs font-bold shadow-[0_0_20px_rgba(132,204,22,0.3)] transition-all"
            >
              <Plus className="w-4 h-4 text-slate-950" />
              <span>Nueva Tienda</span>
            </button>
          </div>
        </div>

        {/* Key Metrics / KPI Cards */}
        <StatsCards agents={agents} />

        {/* Filter & Search Toolbar */}
        <div className="mb-5 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
          
          {/* Search Bar */}
          <div className="relative flex-1 max-w-lg">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
              <Search className="w-4 h-4" />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar por nombre de tienda, cliente, teléfono, ID o notas..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#0e1422] border border-white/10 focus:border-lime-500 focus:outline-none focus:ring-1 focus:ring-lime-500 text-xs text-white placeholder-slate-500 transition-colors"
            />
          </div>

          {/* Filter Dropdowns and View Mode Switch */}
          <div className="flex flex-wrap items-center gap-2">
            
            {/* Filter by Agent */}
            <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-[#0e1422] border border-white/10 text-xs text-slate-300">
              <span className="text-slate-500 text-[11px]">Agente:</span>
              <select
                value={selectedAgentFilter}
                onChange={(e) => setSelectedAgentFilter(e.target.value)}
                className="bg-transparent text-white focus:outline-none cursor-pointer font-medium"
              >
                <option value="ALL" className="bg-slate-900">Todos</option>
                {agentNames.map((name) => (
                  <option key={name} value={name} className="bg-slate-900">{name}</option>
                ))}
              </select>
            </div>

            {/* Filter by PDF */}
            <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-[#0e1422] border border-white/10 text-xs text-slate-300">
              <FileText className="w-3.5 h-3.5 text-emerald-400" />
              <select
                value={pdfFilter}
                onChange={(e) => setPdfFilter(e.target.value as any)}
                className="bg-transparent text-white focus:outline-none cursor-pointer font-medium"
              >
                <option value="ALL" className="bg-slate-900">Catálogos: Todos</option>
                <option value="WITH_PDF" className="bg-slate-900">Con Catálogo PDF</option>
                <option value="NO_PDF" className="bg-slate-900">Sin Catálogo (N/A)</option>
              </select>
            </div>

            {/* View Mode Toggle */}
            <div className="flex items-center p-1 rounded-xl bg-[#0e1422] border border-white/10 text-xs">
              <button
                onClick={() => setViewMode('table')}
                title="Vista de Tabla detallada"
                className={`p-1.5 rounded-lg transition-colors ${
                  viewMode === 'table'
                    ? 'bg-lime-500 text-slate-950 font-bold'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <LayoutList className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('grid')}
                title="Vista en Cuadrícula"
                className={`p-1.5 rounded-lg transition-colors ${
                  viewMode === 'grid'
                    ? 'bg-lime-500 text-slate-950 font-bold'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <LayoutGrid className="w-4 h-4" />
              </button>
            </div>

          </div>
        </div>

        {/* Data Presentation (Table or Grid) */}
        {loading ? (
          <div className="p-16 text-center rounded-2xl bg-[#0e1422] border border-white/5">
            <div className="inline-block w-8 h-8 border-2 border-lime-400 border-t-transparent rounded-full animate-spin mb-3"></div>
            <p className="text-xs text-slate-400">Cargando tiendas desde Supabase...</p>
          </div>
        ) : viewMode === 'table' ? (
          <AgentTable
            agents={filteredAgents}
            onEdit={handleEditAgent}
            onDelete={handleDeleteAgent}
            onViewPdf={handleViewPdf}
          />
        ) : (
          <AgentGrid
            agents={filteredAgents}
            onEdit={handleEditAgent}
            onDelete={handleDeleteAgent}
            onViewPdf={handleViewPdf}
          />
        )}

      </main>

      {/* Footer */}
      <footer className="border-t border-white/5 bg-[#070b12] py-4 px-6 text-center text-xs text-slate-500 mt-8">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>DAMALEBOT Master Admin &copy; {new Date().getFullYear()} — Desarrollado para alta seguridad y tiempo real.</span>
          <div className="flex items-center gap-3">
            <button onClick={() => setIsSqlModalOpen(true)} className="hover:text-lime-400 transition-colors">
              Guía Supabase SQL
            </button>
            <span>&bull;</span>
            <button onClick={() => setIsExportModalOpen(true)} className="hover:text-lime-400 transition-colors">
              Exportar HTML Vercel
            </button>
          </div>
        </div>
      </footer>

      {/* Modals */}
      <AgentModal
        isOpen={isAgentModalOpen}
        onClose={() => setIsAgentModalOpen(false)}
        agentToEdit={agentToEdit}
        onSuccess={handleAgentSaved}
      />

      <PdfViewerModal
        isOpen={isPdfModalOpen}
        onClose={() => setIsPdfModalOpen(false)}
        pdfUrl={activePdfUrl}
        storeName={activePdfStore}
      />

      <SqlGuideModal
        isOpen={isSqlModalOpen}
        onClose={() => setIsSqlModalOpen(false)}
      />

      <StandaloneExportModal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
      />

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-5 right-5 z-50 flex items-center gap-2 px-4 py-3 rounded-xl bg-[#0e1628] border border-white/10 shadow-2xl animate-in slide-in-from-bottom duration-200">
          {toastMessage.type === 'success' ? (
            <CheckCircle2 className="w-4 h-4 text-lime-400 shrink-0" />
          ) : (
            <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
          )}
          <span className="text-xs font-medium text-white">{toastMessage.text}</span>
        </div>
      )}

    </div>
  );
}
