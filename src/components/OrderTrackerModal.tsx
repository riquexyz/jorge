import React, { useEffect, useState } from 'react';
import {
  X,
  CheckCircle2,
  Clock,
  ChefHat,
  Bell,
  Utensils,
  Star,
  Receipt,
  Sparkles
} from 'lucide-react';
import { Order, OrderStatus } from '../types';

interface OrderTrackerModalProps {
  order: Order | null;
  onClose: () => void;
  onOpenReview: (order: Order) => void;
  onRefreshStatus?: () => void;
}

export const OrderTrackerModal: React.FC<OrderTrackerModalProps> = ({
  order,
  onClose,
  onOpenReview
}) => {
  const [elapsedMinutes, setElapsedMinutes] = useState(0);

  useEffect(() => {
    if (!order) return;
    const calculateElapsed = () => {
      const created = new Date(order.createdAt).getTime();
      const now = Date.now();
      const diffMin = Math.max(0, Math.floor((now - created) / 60000));
      setElapsedMinutes(diffMin);
    };
    calculateElapsed();
    const timer = setInterval(calculateElapsed, 15000);
    return () => clearInterval(timer);
  }, [order]);

  if (!order) return null;

  const steps: { key: OrderStatus; label: string; desc: string; icon: typeof Clock }[] = [
    { key: 'received', label: 'Pedido Recebido', desc: 'Registrado no sistema da taberna', icon: Receipt },
    { key: 'confirmed', label: 'Restaurante Confirmou', desc: 'A cozinha visualizou e aprovou seu pedido', icon: CheckCircle2 },
    { key: 'preparing', label: 'Preparando na Cozinha', desc: 'Os peixes e pratos estão na brasa ou forno', icon: ChefHat },
    { key: 'ready', label: 'Pronto para Servir!', desc: 'O garçom está levando até a sua mesa', icon: Bell },
    { key: 'delivered', label: 'Entregue na Mesa', desc: 'Bom apetite! Experiência concluída', icon: Utensils }
  ];

  const statusIndexMap: Record<OrderStatus, number> = {
    received: 0,
    confirmed: 1,
    preparing: 2,
    ready: 3,
    delivered: 4,
    cancelled: -1
  };

  const currentStepIndex = statusIndexMap[order.status] ?? 0;
  const isDelivered = order.status === 'delivered';
  const isCancelled = order.status === 'cancelled';

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto animate-in fade-in duration-200">
      <div className="bg-white dark:bg-[#0F2B38] text-[#0B2B3A] dark:text-[#E6F1EF] w-full max-w-lg rounded-2xl sm:rounded-3xl overflow-hidden shadow-2xl border border-[#C5DAD6] dark:border-[#1E4252] flex flex-col max-h-[92vh] my-auto">
        
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-[#C5DAD6] dark:border-[#1E4252] flex items-center justify-between bg-[#EAF3F1]/80 dark:bg-[#081C26]">
          <div className="flex items-center gap-2">
            <span className="w-8 h-8 rounded-xl bg-[#E8A33D] text-[#0B2B3A] flex items-center justify-center font-serif font-bold text-sm">
              Θ
            </span>
            <div>
              <h2 className="font-serif text-lg sm:text-xl font-bold">
                Acompanhar Pedido #{order.orderNumber}
              </h2>
              <span className="text-xs text-[#4F6B75] dark:text-[#93B0B8]">
                {order.orderType === 'local' ? `Mesa ${order.tableNumber || '08'}` : order.orderType.toUpperCase()} · {order.customerName}
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-400 hover:text-gray-700 dark:hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6 text-sm">
          
          {/* Estimated Preparation Time Banner */}
          {!isDelivered && !isCancelled && (
            <div className="p-4 rounded-2xl bg-gradient-to-r from-[#1F7A8C]/20 to-[#E8A33D]/20 border border-[#1F7A8C]/40 text-center space-y-1">
              <div className="flex items-center justify-center gap-1.5 text-xs text-[#1F7A8C] dark:text-[#5CC0D3] font-bold uppercase tracking-wider">
                <Clock className="w-4 h-4 animate-spin" />
                <span>Status ao vivo em tempo real</span>
              </div>
              <div className="font-serif text-xl sm:text-2xl font-bold text-[#0B2B3A] dark:text-white">
                Ficará pronto em aprox. <strong>{Math.max(5, order.estimatedMinutes - elapsedMinutes)} min</strong>
              </div>
              <p className="text-xs text-[#4F6B75] dark:text-[#93B0B8]">
                Tempo decorrido desde o envio: {elapsedMinutes} minutos
              </p>
            </div>
          )}

          {isDelivered && (
            <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-800 text-center space-y-2">
              <div className="w-12 h-12 rounded-full bg-emerald-500 text-white mx-auto flex items-center justify-center font-bold">
                <CheckCircle2 className="w-7 h-7" />
              </div>
              <h3 className="font-serif text-xl font-bold text-emerald-900 dark:text-emerald-200">
                Pedido Entregue! Bom Apetite!
              </h3>
              <p className="text-xs text-emerald-700 dark:text-emerald-400">
                Esperamos que sua refeição na taberna Thalassa esteja inesquecível.
              </p>

              {/* Review button */}
              {!order.reviewed ? (
                <button
                  onClick={() => onOpenReview(order)}
                  className="mt-2 py-2 px-5 bg-[#E8A33D] hover:bg-[#F3B353] text-[#0B2B3A] font-bold rounded-xl text-xs flex items-center gap-2 mx-auto shadow-md cursor-pointer"
                >
                  <Star className="w-4 h-4 fill-current" />
                  <span>Avaliar sua Experiência</span>
                </button>
              ) : (
                <div className="text-xs text-emerald-600 font-semibold pt-1">
                  ⭐ Obrigado pela sua avaliação!
                </div>
              )}
            </div>
          )}

          {/* Interactive Step-by-Step Progress Timeline */}
          <div className="space-y-4">
            <h3 className="font-serif font-bold text-sm text-[#0B2B3A] dark:text-white flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-[#E8A33D]" />
              <span>Etapas do Pedido</span>
            </h3>

            <div className="space-y-3 relative pl-3">
              {/* Connecting line */}
              <div className="absolute left-6 top-3 bottom-3 w-0.5 bg-[#C5DAD6] dark:bg-[#1E4252] -z-0"></div>

              {steps.map((st, idx) => {
                const isCompleted = idx < currentStepIndex;
                const isCurrent = idx === currentStepIndex;
                const Icon = st.icon;

                return (
                  <div
                    key={st.key}
                    className={`flex items-start gap-3 relative z-10 transition-all ${
                      isCurrent
                        ? 'p-2.5 rounded-xl bg-[#1F7A8C]/10 dark:bg-[#1F7A8C]/20 border border-[#1F7A8C]/50 ring-1 ring-[#1F7A8C]/40'
                        : ''
                    }`}
                  >
                    <div
                      className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0 transition-colors shadow-xs ${
                        isCompleted
                          ? 'bg-emerald-500 text-white'
                          : isCurrent
                          ? 'bg-[#E8A33D] text-[#0B2B3A] ring-4 ring-[#E8A33D]/30 animate-pulse'
                          : 'bg-gray-200 dark:bg-gray-800 text-gray-500 dark:text-gray-400'
                      }`}
                    >
                      {isCompleted ? <CheckCircle2 className="w-4 h-4" /> : <Icon className="w-3.5 h-3.5" />}
                    </div>

                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <span
                          className={`font-serif font-bold text-sm ${
                            isCurrent
                              ? 'text-[#1F7A8C] dark:text-[#E8A33D]'
                              : isCompleted
                              ? 'text-[#0B2B3A] dark:text-white'
                              : 'text-gray-400 dark:text-gray-500'
                          }`}
                        >
                          {st.label}
                        </span>
                        {isCurrent && (
                          <span className="text-[10px] bg-[#1F7A8C] text-white px-2 py-0.5 rounded-full font-sans font-semibold">
                            AGORA
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-[#4F6B75] dark:text-[#93B0B8] leading-tight mt-0.5">
                        {st.desc}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Items breakdown card */}
          <div className="p-3.5 rounded-xl bg-gray-50 dark:bg-[#081C26] border border-[#C5DAD6] dark:border-[#1E4252] space-y-2">
            <div className="flex items-center justify-between text-xs font-bold text-[#4F6B75] dark:text-[#93B0B8] uppercase">
              <span>Itens Solicitados</span>
              <span className={`px-2 py-0.5 rounded-full font-bold text-[10px] ${order.paymentStatus === 'paid' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'}`}>
                {order.paymentStatus === 'paid' ? '✓ PAGO' : 'PAGAMENTO PENDENTE'}
              </span>
            </div>

            <div className="space-y-1.5 text-xs divide-y divide-gray-200 dark:divide-gray-800">
              {order.items.map((it, idx) => (
                <div key={idx} className="pt-1.5 first:pt-0">
                  <div className="flex justify-between font-semibold">
                    <span>{it.quantity}x {it.productName}</span>
                    <span>R$ {it.totalPrice.toFixed(2).replace('.', ',')}</span>
                  </div>
                  {it.selectedOptions && it.selectedOptions.length > 0 && (
                    <div className="text-[11px] text-[#4F6B75] dark:text-[#93B0B8]">
                      {it.selectedOptions.map(o => `${o.groupName}: ${o.optionName}`).join(' | ')}
                    </div>
                  )}
                  {it.notes && (
                    <div className="text-[10px] text-amber-600 dark:text-amber-400 italic">
                      Obs: {it.notes}
                    </div>
                  )}
                </div>
              ))}
            </div>

            <div className="pt-2 border-t border-gray-200 dark:border-gray-800 flex justify-between font-serif text-sm font-bold text-[#0B2B3A] dark:text-white">
              <span>Total do Pedido:</span>
              <span className="text-[#E8A33D]">R$ {order.total.toFixed(2).replace('.', ',')}</span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-[#C5DAD6] dark:border-[#1E4252] bg-[#EAF3F1]/80 dark:bg-[#081C26]">
          <button
            onClick={onClose}
            className="w-full py-2.5 bg-[#0B2B3A] dark:bg-[#1F7A8C] text-white font-semibold rounded-xl hover:opacity-90 transition-opacity"
          >
            Continuar Navegando
          </button>
        </div>
      </div>
    </div>
  );
};
