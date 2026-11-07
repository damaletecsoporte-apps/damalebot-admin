import React, { useState, useEffect } from 'react';
import { StoreAgent, supabase } from '../lib/supabase';
import { 
  X, 
  Save, 
  Bot, 
  Store, 
  User, 
  Phone, 
  FileText, 
  DollarSign, 
  Calendar,
  ExternalLink,
  Loader2,
  Check
} from 'lucide-react';

interface AgentModalProps {
  isOpen: boolean;
  onClose: () => void;
  agentToEdit: StoreAgent | null;
  onSuccess: (updatedAgent: StoreAgent, isNew: boolean) => void;
}

export const AgentModal: React.FC<AgentModalProps> = ({
  isOpen,
  onClose,
  agentToEdit,
  onSuccess,
}) => {
  const [formData, setFormData] = useState<Partial<StoreAgent>>({
    store_id: '',
    store_name: '',
    client_name: '',
    contact_phone: '',
    selected_agent: 'Alejandro',
    avatar_style: 'Alejandro',
    business_type: 'PRIMER OPCION',
    setup_price: 1490,
    monthly_price: 299,
    pdf_catalog_url: 'N/A',
    custom_notes: '',
  });

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    if (agentToEdit) {
      setFormData({
        store_id: agentToEdit.store_id || '',
        store_name: agentToEdit.store_name || '',
        client_name: agentToEdit.client_name || '',
        contact_phone: agentToEdit.contact_phone || '',
        selected_agent: agentToEdit.selected_agent || 'Alejandro',
        avatar_style: agentToEdit.avatar_style || 'Alejandro',
        business_type: agentToEdit.business_type || 'PRIMER OPCION',
        setup_price: agentToEdit.setup_price ?? 1490,
        monthly_price: agentToEdit.monthly_price ?? 299,
        pdf_catalog_url: agentToEdit.pdf_catalog_url || 'N/A',
        custom_notes: agentToEdit.custom_notes || '',
      });
    } else {
      setFormData({
        store_id: Math.floor(100000 + Math.random() * 900000).toString(),
        store_name: '',
        client_name: '',
        contact_phone: '',
        selected_agent: 'Alejandro',
        avatar_style: 'Alejandro',
        business_type: 'PRIMER OPCION',
        setup_price: 1490,
        monthly_price: 299,
        pdf_catalog_url: 'N/A',
        custom_notes: '',
      });
    }
    setErrorMsg(null);
  }, [agentToEdit, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg(null);

    try {
      if (!formData.store_name?.trim()) {
        throw new Error('El nombre de la tienda es obligatorio');
      }

      if (agentToEdit && agentToEdit.id) {
        // Direct .update() to Supabase
        const { data, error } = await supabase
          .from('store_agents')
          .update({
            store_id: formData.store_id,
            store_name: formData.store_name,
            client_name: formData.client_name,
            contact_phone: formData.contact_phone,
            selected_agent: formData.selected_agent,
            avatar_style: formData.avatar_style,
            business_type: formData.business_type,
            setup_price: Number(formData.setup_price),
            monthly_price: Number(formData.monthly_price),
            pdf_catalog_url: formData.pdf_catalog_url || 'N/A',
            custom_notes: formData.custom_notes || '',
          })
          .eq('id', agentToEdit.id)
          .select()
          .single();

        if (error) {
          throw error;
        }

        onSuccess(data || ({ ...agentToEdit, ...formData } as StoreAgent), false);
      } else {
        // Create new record
        const { data, error } = await supabase
          .from('store_agents')
          .insert([
            {
              store_id: formData.store_id,
              store_name: formData.store_name,
              client_name: formData.client_name,
              contact_phone: formData.contact_phone,
              selected_agent: formData.selected_agent,
              avatar_style: formData.avatar_style,
              business_type: formData.business_type,
              setup_price: Number(formData.setup_price),
              monthly_price: Number(formData.monthly_price),
              pdf_catalog_url: formData.pdf_catalog_url || 'N/A',
              custom_notes: formData.custom_notes || '',
            },
          ])
          .select()
          .single();

        if (error) {
          throw error;
        }

        onSuccess(data as StoreAgent, true);
      }

      onClose();
    } catch (err: any) {
      console.error('Error saving agent:', err);
      setErrorMsg(err.message || 'Error al guardar los datos en Supabase');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl max-h-[92vh] overflow-y-auto rounded-2xl bg-[#0c1220] border border-white/10 shadow-2xl p-6 text-slate-200">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-lime-500/10 border border-lime-500/30 flex items-center justify-center text-lime-400">
              <Bot className="w-5 h-5 text-lime-400" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">
                {agentToEdit ? 'Editar Registro de Tienda & Agente' : 'Nuevo Registro de Tienda'}
              </h2>
              <p className="text-xs text-slate-400">
                Actualización directa en tiempo real contra la tabla <code className="text-lime-400 font-mono">store_agents</code> de Supabase.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg bg-slate-800/60 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {errorMsg && (
          <div className="mt-4 p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-300 text-xs flex items-center gap-2">
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="mt-5 space-y-4">
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Store Name */}
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5 flex items-center gap-1.5">
                <Store className="w-3.5 h-3.5 text-lime-400" />
                Nombre de la Tienda *
              </label>
              <input
                type="text"
                required
                value={formData.store_name}
                onChange={(e) => setFormData({ ...formData, store_name: e.target.value })}
                placeholder="Ej. Pizzas Reales o Panadería Central"
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#141d30] border border-white/10 focus:border-lime-500 focus:outline-none focus:ring-1 focus:ring-lime-500 text-sm text-white placeholder-slate-500"
              />
            </div>

            {/* Store ID */}
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                ID de la Tienda (Identificador Único)
              </label>
              <input
                type="text"
                value={formData.store_id}
                onChange={(e) => setFormData({ ...formData, store_id: e.target.value })}
                placeholder="123456"
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#141d30] border border-white/10 focus:border-lime-500 focus:outline-none focus:ring-1 focus:ring-lime-500 text-sm text-white font-mono placeholder-slate-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Client Name */}
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5 flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-lime-400" />
                Nombre del Cliente / Dueño
              </label>
              <input
                type="text"
                value={formData.client_name}
                onChange={(e) => setFormData({ ...formData, client_name: e.target.value })}
                placeholder="Ej. Dame dam o Damian Alegría"
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#141d30] border border-white/10 focus:border-lime-500 focus:outline-none focus:ring-1 focus:ring-lime-500 text-sm text-white placeholder-slate-500"
              />
            </div>

            {/* Contact Phone */}
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5 flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5 text-lime-400" />
                Teléfono de Contacto (WhatsApp)
              </label>
              <input
                type="text"
                value={formData.contact_phone}
                onChange={(e) => setFormData({ ...formData, contact_phone: e.target.value })}
                placeholder="6622123456"
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#141d30] border border-white/10 focus:border-lime-500 focus:outline-none focus:ring-1 focus:ring-lime-500 text-sm text-white font-mono placeholder-slate-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* Selected Agent */}
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5 flex items-center gap-1.5">
                <Bot className="w-3.5 h-3.5 text-lime-400" />
                Agente DAMALEBOT
              </label>
              <select
                value={formData.selected_agent}
                onChange={(e) => {
                  const val = e.target.value;
                  setFormData({ 
                    ...formData, 
                    selected_agent: val,
                    avatar_style: val // sync default avatar
                  });
                }}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#141d30] border border-white/10 focus:border-lime-500 focus:outline-none text-sm text-white"
              >
                <option value="Alejandro">Alejandro</option>
                <option value="Adela">Adela</option>
                <option value="Esteban">Esteban</option>
                <option value="Sofia">Sofia</option>
                <option value="Mateo">Mateo</option>
              </select>
            </div>

            {/* Avatar Style */}
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                Estilo de Avatar
              </label>
              <input
                type="text"
                value={formData.avatar_style || ''}
                onChange={(e) => setFormData({ ...formData, avatar_style: e.target.value })}
                placeholder="Ej. Alejandro, Adela, Esteban"
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#141d30] border border-white/10 focus:border-lime-500 focus:outline-none text-sm text-white font-mono"
              />
            </div>

            {/* Business Type */}
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                Tipo / Opción de Negocio
              </label>
              <select
                value={formData.business_type}
                onChange={(e) => setFormData({ ...formData, business_type: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#141d30] border border-white/10 focus:border-lime-500 focus:outline-none text-sm text-white"
              >
                <option value="PRIMER OPCION">PRIMER OPCION</option>
                <option value="SEGUNDA OPCION">SEGUNDA OPCION</option>
                <option value="PERSONALIZADA">PERSONALIZADA</option>
                <option value="ENTERPRISE">ENTERPRISE</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Setup Price */}
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5 flex items-center gap-1.5">
                <DollarSign className="w-3.5 h-3.5 text-lime-400" />
                Precio de Setup (MXN)
              </label>
              <input
                type="number"
                step="1"
                value={formData.setup_price}
                onChange={(e) => setFormData({ ...formData, setup_price: Number(e.target.value) })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#141d30] border border-white/10 focus:border-lime-500 focus:outline-none text-sm text-white font-mono"
              />
            </div>

            {/* Monthly Price */}
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5 flex items-center gap-1.5">
                <DollarSign className="w-3.5 h-3.5 text-lime-400" />
                Precio Mensual Recurrente (MXN)
              </label>
              <input
                type="number"
                step="1"
                value={formData.monthly_price}
                onChange={(e) => setFormData({ ...formData, monthly_price: Number(e.target.value) })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#141d30] border border-white/10 focus:border-lime-500 focus:outline-none text-sm text-white font-mono"
              />
            </div>
          </div>

          {/* PDF Catalog URL */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-medium text-slate-300 flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5 text-lime-400" />
                URL del Catálogo PDF (Columna <code className="text-lime-400 font-mono">pdf_catalog_url</code>)
              </label>
              {formData.pdf_catalog_url && formData.pdf_catalog_url.startsWith('http') && (
                <a
                  href={formData.pdf_catalog_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[11px] text-lime-400 hover:text-lime-300 flex items-center gap-1"
                >
                  <span>Probar URL</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              )}
            </div>
            <input
              type="text"
              value={formData.pdf_catalog_url}
              onChange={(e) => setFormData({ ...formData, pdf_catalog_url: e.target.value })}
              placeholder="https://...supabase.co/.../catalog.pdf o N/A"
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#141d30] border border-white/10 focus:border-lime-500 focus:outline-none text-sm text-white font-mono placeholder-slate-500"
            />
            <p className="text-[11px] text-slate-500 mt-1">
              Guarda la URL pública de Supabase Storage o pon 'N/A' si la tienda no tiene catálogo.
            </p>
          </div>

          {/* Custom Notes */}
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1.5">
              Notas Personalizadas para el Bot / Prompt de Tienda
            </label>
            <textarea
              rows={3}
              value={formData.custom_notes}
              onChange={(e) => setFormData({ ...formData, custom_notes: e.target.value })}
              placeholder="Ej. Esta excelente, promociones especiales en pizzas, horario de 2pm a 11pm..."
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#141d30] border border-white/10 focus:border-lime-500 focus:outline-none text-sm text-white placeholder-slate-500"
            ></textarea>
          </div>

          {/* Modal Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/10">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-sm font-medium transition-colors"
            >
              Cancelar
            </button>

            <button
              type="submit"
              disabled={loading}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-lime-500 hover:bg-lime-400 text-slate-950 text-sm font-bold shadow-[0_0_20px_rgba(132,204,22,0.3)] transition-all disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-slate-950" />
                  <span>Guardando en Supabase...</span>
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 text-slate-950" />
                  <span>{agentToEdit ? 'Actualizar Registro' : 'Crear en Supabase'}</span>
                </>
              )}
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
