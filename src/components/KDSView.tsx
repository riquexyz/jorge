import React, { useState, useEffect } from 'react';
import {
  ChefHat,
  Volume2,
  VolumeX,
  Clock,
  Printer,
  Check,
  Play,
  RotateCcw,
  Sparkles,
  UtensilsCrossed
} from 'lucide-react';
import { Order, OrderStatus } from '../types';
import { audioService } from '../services/audio';

interface KDSViewProps {
  orders: Order[];
  onUpdateStatus: (orderId: string, newStatus: OrderStatus) => Promise<void>;
  onRefreshOrders: () => void;
}

export const KDSView: React.FC<KDSViewProps> = ({
  orders,
  onUpdateStatus,
  onRefreshOrders
}) => {
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [filterTable, setFilterTable] = useState('all');
  const [currentTime, setCurrentTime] = useState(Date.now());

  // Update elapsed clock every 10 seconds
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(Date.now()), 10000);
    return () => clearInterval(timer);
  }, []);

  // Compute elapsed minutes for an order
  const getElapsed = (createdAt: string) => {
    const diffMs = currentTime - new Date(createdAt).getTime();
    return Math.max(0, Math.floor(diffMs / 60000));
  };

  // Color code for order lateness
  const getLatenessBadge = (minutes: number) => {
    if (minutes <= 10) {
      return {
        bg: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40',
        dot: 'bg-emerald-400',
        label: `${minutes} min (No prazo)`
      };
    } else if (minutes <= 20) {
      return {
        bg: 'bg-amber-500/20 text-amber-400 border-amber-500/40',
        dot: 'bg-amber-400',
        label: `${minutes} min (Atenção)`
      };
    } else {
      return {
        bg: 'bg-rose-500/25 text-rose-300 border-rose-500/60 animate-pulse',
        dot: 'bg-rose-500',
        label: `${minutes} min (Atrasado!)`
      };
    }
  };

  // Filter orders by table if selected
  const activeOrders = orders.filter(o => {
    if (filterTable !== 'all' && o.tableNumber !== filterTable) return false;
    return o.status !== 'cancelled';
  });

  const columnReceived = activeOrders.filter(o => o.status === 'received');
  const columnPreparing = activeOrders.filter(o => o.status === 'confirmed' || o.status === 'preparing');
  const columnReady = activeOrders.filter(o => o.status === 'ready');
  const columnDelivered = activeOrders.filter(o => o.status === 'delivered').slice(0, 10);

  const handleTestSound = () => {
    audioService.playOrderBell();
  };

  const handlePrintTicket = (order: Order) => {
    const printWindow = window.open('', '_blank', 'width=350,height=550');
    if (!printWindow) return;
    printWindow.document.write(`
      <html>
        <head>
          <title>Comanda #${order.orderNumber}</title>
          <style>
            body { font-family: monospace; font-size: 13px; padding: 12px; }
            h2 { text-align: center; margin: 0; font-size: 18px; }
            .sep { border-top: 1px dashed #000; margin: 8px 0; }
            .item { margin: 6px 0; }
            .obs { font-style: italic; color: #333; }
          </style>
        </head>
        <body>
          <h2>THALASSA · PERUÍBE</h2>
          <div style="text-align:center">COMANDA DE PRODUÇÃO</div>
          <div class="sep"></div>
          <div><strong>PEDIDO #${order.orderNumber}</strong></div>
          <div>MESA: ${order.tableNumber || 'Balcão / Delivery'}</div>
          <div>CLIENTE: ${order.customerName}</div>
          <div>HORA: ${new Date(order.createdAt).toLocaleTimeString()}</div>
          <div class="sep"></div>
          ${order.items.map(it => `
            <div class="item">
              <strong>${it.quantity}x ${it.productName}</strong>
              ${it.selectedOptions.map(o => `<div>- ${o.groupName}: ${o.optionName}</div>`).join('')}
              ${it.removedIngredients && it.removedIngredients.length ? `<div>* SEM: ${it.removedIngredients.join(', ')}</div>` : ''}
              ${it.notes ? `<div class="obs">Obs: ${it.notes}</div>` : ''}
            </div>
          `).join('')}
          <div class="sep"></div>
          <div>TOTAL: R$ ${order.total.toFixed(2)}</div>
          <div>PAGTO: ${order.paymentMethod.toUpperCase()} (${order.paymentStatus.toUpperCase()})</div>
          <div class="sep"></div>
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
  };

  return (
    <div className="min-h-screen bg-[#04121A] text-white p-3 sm:p-5 flex flex-col font-sans">
      
      {/* KDS Kitchen Control Bar */}
      <div className="bg-[#0B2B3A] border border-[#1E4252] rounded-2xl p-3.5 mb-4 flex flex-wrap items-center justify-between gap-3 shadow-lg">
        
        {/* Left Title & Status */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#E8A33D] text-[#0B2B3A] flex items-center justify-center font-bold shadow-md">
            <ChefHat className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-serif text-lg sm:text-xl font-bold tracking-wide">
                KDS Cozinha Thalassa · Monitor de Produção
              </h1>
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping"></span>
            </div>
            <div className="text-xs text-[#B9D3D8]">
              Atualização instantânea em tempo real · Pedidos ativos: {activeOrders.filter(o => o.status !== 'delivered').length}
            </div>
          </div>
        </div>

        {/* Right Tools */}
        <div className="flex items-center gap-2">
          {/* Table filter */}
          <div className="flex items-center gap-1.5 text-xs bg-[#04121A] px-2.5 py-1.5 rounded-xl border border-[#1E4252]">
            <span className="text-[#93B0B8]">Mesa:</span>
            <select
              value={filterTable}
              onChange={e => setFilterTable(e.target.value)}
              className="bg-transparent text-white font-bold focus:outline-none cursor-pointer"
            >
              <option value="all">Todas as Mesas</option>
              {['01','02','03','04','05','06','07','08','09','10'].map(m => (
                <option key={m} value={m} className="bg-[#0B2B3A]">Mesa {m}</option>
              ))}
            </select>
          </div>

          {/* Sound notification toggle */}
          <button
            onClick={() => {
              setSoundEnabled(!soundEnabled);
              if (!soundEnabled) handleTestSound();
            }}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
              soundEnabled
                ? 'bg-[#1F7A8C] border-[#1F7A8C] text-white shadow-xs'
                : 'bg-[#04121A] border-[#1E4252] text-gray-400'
            }`}
            title="Sino sonoro quando entrar novo pedido"
          >
            {soundEnabled ? <Volume2 className="w-3.5 h-3.5 text-[#E8A33D]" /> : <VolumeX className="w-3.5 h-3.5" />}
            <span className="hidden sm:inline">Sino KDS</span>
          </button>

          {/* Test Sound button */}
          <button
            onClick={handleTestSound}
            className="p-1.5 rounded-xl bg-[#04121A] border border-[#1E4252] text-[#E8A33D] hover:bg-[#103040] text-xs flex items-center gap-1"
            title="Testar som da campainha da cozinha"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span className="hidden md:inline">Testar Campainha</span>
          </button>

          {/* Refresh */}
          <button
            onClick={onRefreshOrders}
            className="p-1.5 rounded-xl bg-[#04121A] border border-[#1E4252] text-[#B9D3D8] hover:text-white"
            title="Atualizar lista"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* 4-Column Kanban Board */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 flex-1 items-start">
        
        {/* COLUMN 1: NOVOS */}
        <div className="bg-[#081C26] rounded-2xl border border-[#1E4252] flex flex-col max-h-[85vh] shadow-md">
          <div className="p-3 border-b border-[#1E4252] flex items-center justify-between bg-[#0F2B38] rounded-t-2xl">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-rose-500 animate-pulse"></span>
              <h2 className="font-serif font-bold text-sm tracking-wide text-white">
                1. NOVOS PEDIDOS
              </h2>
            </div>
            <span className="w-6 h-6 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/40 text-xs font-bold flex items-center justify-center">
              {columnReceived.length}
            </span>
          </div>

          <div className="p-2.5 overflow-y-auto space-y-3 flex-1">
            {columnReceived.length === 0 ? (
              <div className="text-center py-10 text-xs text-[#4F6B75] italic">
                Nenhum novo pedido pendente
              </div>
            ) : (
              columnReceived.map(order => renderOrderCard(order, 'received'))
            )}
          </div>
        </div>

        {/* COLUMN 2: EM PREPARO */}
        <div className="bg-[#081C26] rounded-2xl border border-[#1E4252] flex flex-col max-h-[85vh] shadow-md">
          <div className="p-3 border-b border-[#1E4252] flex items-center justify-between bg-[#0F2B38] rounded-t-2xl">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-amber-400 animate-spin"></span>
              <h2 className="font-serif font-bold text-sm tracking-wide text-white">
                2. EM PREPARO NA BRASA/FORNO
              </h2>
            </div>
            <span className="w-6 h-6 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 text-xs font-bold flex items-center justify-center">
              {columnPreparing.length}
            </span>
          </div>

          <div className="p-2.5 overflow-y-auto space-y-3 flex-1">
            {columnPreparing.length === 0 ? (
              <div className="text-center py-10 text-xs text-[#4F6B75] italic">
                Cozinha livre no momento
              </div>
            ) : (
              columnPreparing.map(order => renderOrderCard(order, 'preparing'))
            )}
          </div>
        </div>

        {/* COLUMN 3: PRONTO */}
        <div className="bg-[#081C26] rounded-2xl border border-[#1E4252] flex flex-col max-h-[85vh] shadow-md">
          <div className="p-3 border-b border-[#1E4252] flex items-center justify-between bg-[#0F2B38] rounded-t-2xl">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-emerald-400"></span>
              <h2 className="font-serif font-bold text-sm tracking-wide text-white">
                3. PRONTO PARA SERVIR
              </h2>
            </div>
            <span className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-xs font-bold flex items-center justify-center">
              {columnReady.length}
            </span>
          </div>

          <div className="p-2.5 overflow-y-auto space-y-3 flex-1">
            {columnReady.length === 0 ? (
              <div className="text-center py-10 text-xs text-[#4F6B75] italic">
                Nenhum prato aguardando garçom
              </div>
            ) : (
              columnReady.map(order => renderOrderCard(order, 'ready'))
            )}
          </div>
        </div>

        {/* COLUMN 4: ENTREGUE */}
        <div className="bg-[#081C26] rounded-2xl border border-[#1E4252] flex flex-col max-h-[85vh] shadow-md">
          <div className="p-3 border-b border-[#1E4252] flex items-center justify-between bg-[#0F2B38] rounded-t-2xl">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-[#1F7A8C]"></span>
              <h2 className="font-serif font-bold text-sm tracking-wide text-white">
                4. ENTREGUES HOJE
              </h2>
            </div>
            <span className="w-6 h-6 rounded-full bg-[#1F7A8C]/20 text-[#5CC0D3] border border-[#1F7A8C]/40 text-xs font-bold flex items-center justify-center">
              {columnDelivered.length}
            </span>
          </div>

          <div className="p-2.5 overflow-y-auto space-y-3 flex-1">
            {columnDelivered.length === 0 ? (
              <div className="text-center py-10 text-xs text-[#4F6B75] italic">
                Histórico limpo
              </div>
            ) : (
              columnDelivered.map(order => renderOrderCard(order, 'delivered'))
            )}
          </div>
        </div>

      </div>
    </div>
  );

  // Render individual KDS Order Card
  function renderOrderCard(order: Order, stage: 'received' | 'preparing' | 'ready' | 'delivered') {
    const elapsed = getElapsed(order.createdAt);
    const lateness = getLatenessBadge(elapsed);

    return (
      <div
        key={order.id}
        className="bg-[#0F2B38] border-2 border-[#1E4252] hover:border-[#E8A33D]/60 rounded-xl p-3 shadow-md space-y-2.5 transition-all text-left"
      >
        {/* Card Header: Order Number, Table & Latency Timer */}
        <div className="flex items-start justify-between gap-2 border-b border-[#1E4252] pb-2">
          <div>
            <div className="flex items-center gap-2">
              <span className="font-serif text-lg font-bold text-[#E8A33D]">
                #{order.orderNumber}
              </span>
              <span className="text-xs bg-[#1F7A8C] text-white px-2 py-0.5 rounded-md font-bold">
                {order.orderType === 'local' ? `MESA ${order.tableNumber || '08'}` : order.orderType.toUpperCase()}
              </span>
            </div>
            <div className="text-[11px] text-[#93B0B8] truncate max-w-[140px]">
              {order.customerName}
            </div>
          </div>

          {/* Lateness timer badge */}
          <div className="text-right">
            <span
              className={`inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full border ${lateness.bg}`}
            >
              <span className={`w-1.5 h-1.5 rounded-full ${lateness.dot}`}></span>
              <span>{lateness.label}</span>
            </span>
            <div className="text-[10px] text-[#93B0B8] mt-0.5 flex items-center justify-end gap-1">
              <Clock className="w-3 h-3" />
              <span>{new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
            </div>
          </div>
        </div>

        {/* Items List */}
        <div className="space-y-2 text-xs divide-y divide-[#1E4252]/50">
          {order.items.map((it, idx) => (
            <div key={idx} className="pt-1.5 first:pt-0">
              <div className="flex items-start justify-between font-bold text-white">
                <span className="text-sm text-[#E8A33D] font-mono mr-1.5">{it.quantity}x</span>
                <span className="flex-1 text-sm">{it.productName}</span>
              </div>

              {/* Selected Options */}
              {it.selectedOptions && it.selectedOptions.length > 0 && (
                <div className="pl-5 text-[11px] text-[#B9D3D8] space-y-0.5">
                  {it.selectedOptions.map((opt, oIdx) => (
                    <div key={oIdx}>• {opt.groupName}: <strong className="text-white">{opt.optionName}</strong></div>
                  ))}
                </div>
              )}

              {/* Removed Ingredients */}
              {it.removedIngredients && it.removedIngredients.length > 0 && (
                <div className="pl-5 text-[11px] text-rose-400 font-bold">
                  🚫 SEM: {it.removedIngredients.join(', ')}
                </div>
              )}

              {/* Specific item notes */}
              {it.notes && (
                <div className="pl-5 text-[11px] text-amber-300 italic bg-amber-950/40 p-1 rounded mt-0.5">
                  Obs: {it.notes}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Customer Global Notes */}
        {order.customerNotes && (
          <div className="p-2 rounded-lg bg-amber-950/50 border border-amber-800/60 text-[11px] text-amber-200">
            <strong>Nota Geral:</strong> {order.customerNotes}
          </div>
        )}

        {/* Card Actions & State Transition Buttons */}
        <div className="pt-2 border-t border-[#1E4252] flex items-center justify-between gap-1.5">
          <button
            onClick={() => handlePrintTicket(order)}
            className="p-2 rounded-lg bg-[#04121A] hover:bg-[#103040] text-[#B9D3D8] border border-[#1E4252]"
            title="Imprimir comanda térmica"
          >
            <Printer className="w-3.5 h-3.5" />
          </button>

          {stage === 'received' && (
            <div className="flex gap-1 flex-1">
              <button
                onClick={() => onUpdateStatus(order.id, 'preparing')}
                className="flex-1 py-2 px-3 bg-[#E8A33D] hover:bg-[#F3B353] text-[#0B2B3A] font-bold rounded-lg text-xs flex items-center justify-center gap-1 cursor-pointer shadow-md"
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>ACEITAR & INICIAR</span>
              </button>
            </div>
          )}

          {stage === 'preparing' && (
            <button
              onClick={() => onUpdateStatus(order.id, 'ready')}
              className="flex-1 py-2 px-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-lg text-xs flex items-center justify-center gap-1 cursor-pointer shadow-md"
            >
              <Check className="w-4 h-4" />
              <span>MARCAR COMO PRONTO</span>
            </button>
          )}

          {stage === 'ready' && (
            <button
              onClick={() => onUpdateStatus(order.id, 'delivered')}
              className="flex-1 py-2 px-3 bg-[#1F7A8C] hover:bg-[#155A68] text-white font-bold rounded-lg text-xs flex items-center justify-center gap-1 cursor-pointer shadow-md"
            >
              <UtensilsCrossed className="w-3.5 h-3.5" />
              <span>ENTREGAR NA MESA</span>
            </button>
          )}

          {stage === 'delivered' && (
            <div className="text-[11px] text-emerald-400 font-semibold flex items-center gap-1">
              <Check className="w-3.5 h-3.5" />
              <span>Concluído</span>
            </div>
          )}
        </div>
      </div>
    );
  }
};
