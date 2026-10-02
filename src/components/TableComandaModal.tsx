import React, { useState } from 'react';
import { X, Receipt, Users, Calculator, CheckCircle2 } from 'lucide-react';
import { Order } from '../types';

interface TableComandaModalProps {
  isOpen: boolean;
  onClose: () => void;
  tableNumber: string;
  tableOrders: Order[];
  onOpenOrderTracker: (order: Order) => void;
}

export const TableComandaModal: React.FC<TableComandaModalProps> = ({
  isOpen,
  onClose,
  tableNumber,
  tableOrders,
  onOpenOrderTracker
}) => {
  const [splitCount, setSplitCount] = useState(2);

  if (!isOpen) return null;

  const totalSpent = tableOrders.reduce((sum, o) => sum + o.total, 0);
  const perPerson = splitCount > 0 ? totalSpent / splitCount : totalSpent;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto animate-in fade-in duration-200">
      <div className="bg-white dark:bg-[#0F2B38] text-[#0B2B3A] dark:text-[#E6F1EF] w-full max-w-lg rounded-2xl sm:rounded-3xl overflow-hidden shadow-2xl border border-[#C5DAD6] dark:border-[#1E4252] flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-[#C5DAD6] dark:border-[#1E4252] flex items-center justify-between bg-[#EAF3F1]/80 dark:bg-[#081C26]">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-[#E8A33D] text-[#0B2B3A] flex items-center justify-center font-bold">
              <Receipt className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-serif text-lg sm:text-xl font-bold">
                Comanda Coletiva · Mesa {tableNumber}
              </h2>
              <span className="text-xs text-[#4F6B75] dark:text-[#93B0B8]">
                Todos os pedidos feitos pelas pessoas sentadas nesta mesa
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

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-5 text-sm">
          
          {/* Total Accumulated Box */}
          <div className="p-4 rounded-2xl bg-gradient-to-br from-[#0B2B3A] to-[#1F7A8C] text-white space-y-1 shadow-md">
            <div className="text-xs text-[#B9D3D8] font-medium flex items-center justify-between">
              <span>Total Acumulado na Mesa</span>
              <span className="bg-[#E8A33D] text-[#0B2B3A] text-[10px] font-bold px-2 py-0.5 rounded-full">
                {tableOrders.length} {tableOrders.length === 1 ? 'pedido registrado' : 'pedidos registrados'}
              </span>
            </div>
            <div className="font-serif text-3xl font-bold text-[#E8A33D]">
              R$ {totalSpent.toFixed(2).replace('.', ',')}
            </div>
          </div>

          {/* Bill Split Calculator */}
          {totalSpent > 0 && (
            <div className="p-3.5 rounded-xl bg-gray-50 dark:bg-[#081C26] border border-[#C5DAD6] dark:border-[#1E4252] space-y-2">
              <div className="flex items-center justify-between text-xs font-semibold text-[#1F7A8C]">
                <div className="flex items-center gap-1.5">
                  <Calculator className="w-4 h-4" />
                  <span>Dividir Conta da Mesa</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[11px] text-[#4F6B75] dark:text-[#93B0B8]">Pessoas:</span>
                  <div className="flex items-center gap-1">
                    {[2, 3, 4, 5].map(n => (
                      <button
                        key={n}
                        onClick={() => setSplitCount(n)}
                        className={`w-6 h-6 rounded-md text-xs font-bold transition-all ${
                          splitCount === n
                            ? 'bg-[#1F7A8C] text-white shadow-xs'
                            : 'bg-white dark:bg-[#0F2B38] border border-gray-300 dark:border-gray-700'
                        }`}
                      >
                        {n}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex justify-between items-baseline pt-1">
                <span className="text-xs text-[#4F6B75] dark:text-[#93B0B8]">
                  Fica para cada um ({splitCount} pessoas):
                </span>
                <span className="font-serif text-base font-bold text-[#0B2B3A] dark:text-emerald-400">
                  R$ {perPerson.toFixed(2).replace('.', ',')}
                </span>
              </div>
            </div>
          )}

          {/* Orders list */}
          <div className="space-y-3">
            <h3 className="font-serif font-bold text-sm text-[#0B2B3A] dark:text-white">
              Histórico de Pedidos desta Mesa
            </h3>

            {tableOrders.length === 0 ? (
              <div className="text-center py-8 text-xs text-[#4F6B75] dark:text-[#93B0B8]">
                Nenhum pedido foi enviado ainda nesta mesa. Os itens adicionados e confirmados aparecerão aqui em tempo real.
              </div>
            ) : (
              tableOrders.map(order => (
                <div
                  key={order.id}
                  onClick={() => onOpenOrderTracker(order)}
                  className="p-3.5 rounded-xl border border-[#C5DAD6] dark:border-[#1E4252] bg-white dark:bg-[#081C26] hover:border-[#1F7A8C] cursor-pointer transition-all space-y-2 group"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="font-serif font-bold text-sm group-hover:text-[#1F7A8C] transition-colors">
                        Pedido #{order.orderNumber}
                      </span>
                      <span className="text-xs text-[#4F6B75] dark:text-[#93B0B8]">
                        · {order.customerName}
                      </span>
                    </div>

                    <span className="text-xs font-bold text-[#E8A33D]">
                      R$ {order.total.toFixed(2).replace('.', ',')}
                    </span>
                  </div>

                  <div className="text-xs text-[#4F6B75] dark:text-[#93B0B8]">
                    {order.items.map(it => `${it.quantity}x ${it.productName}`).join(', ')}
                  </div>

                  <div className="flex items-center justify-between pt-1 border-t border-gray-100 dark:border-gray-800 text-[11px]">
                    <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-semibold">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Status: {order.status.toUpperCase()}</span>
                    </span>
                    <span className="text-[#1F7A8C] font-semibold group-hover:underline">
                      Acompanhar ao vivo →
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-[#C5DAD6] dark:border-[#1E4252] bg-[#EAF3F1]/80 dark:bg-[#081C26]">
          <button
            onClick={onClose}
            className="w-full py-2.5 bg-[#0B2B3A] dark:bg-[#1F7A8C] text-white font-semibold rounded-xl"
          >
            Fechar Comanda
          </button>
        </div>
      </div>
    </div>
  );
};
