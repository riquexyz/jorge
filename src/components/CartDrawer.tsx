import React, { useState } from 'react';
import {
  X,
  Trash2,
  Plus,
  Minus,
  ArrowRight,
  ShoppingBag,
  Sparkles,
  Ticket,
  Check,
  AlertCircle
} from 'lucide-react';
import { CartItem, Product, Coupon } from '../types';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onUpdateQuantity: (cartItemId: string, delta: number) => void;
  onRemoveItem: (cartItemId: string) => void;
  onClearCart: () => void;
  onProceedToCheckout: () => void;
  onQuickAddProduct: (product: Product) => void;
  upsellProducts: Product[];
  appliedCoupon: Coupon | null;
  onApplyCoupon: (code: string) => Promise<boolean>;
  onRemoveCoupon: () => void;
  couponDiscount: number;
  includeServiceFee: boolean;
  setIncludeServiceFee: (include: boolean) => void;
  tableNumber: string;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  items,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
  onProceedToCheckout,
  onQuickAddProduct,
  upsellProducts,
  appliedCoupon,
  onApplyCoupon,
  onRemoveCoupon,
  couponDiscount,
  includeServiceFee,
  setIncludeServiceFee,
  tableNumber
}) => {
  const [couponInput, setCouponInput] = useState('');
  const [couponError, setCouponError] = useState('');
  const [isApplyingCoupon, setIsApplyingCoupon] = useState(false);

  if (!isOpen) return null;

  const subtotal = items.reduce((acc, curr) => acc + curr.itemTotal, 0);
  const serviceFee = includeServiceFee ? subtotal * 0.10 : 0;
  const finalTotal = Math.max(0, subtotal + serviceFee - couponDiscount);

  const handleApplyCoupon = async () => {
    if (!couponInput.trim()) return;
    setCouponError('');
    setIsApplyingCoupon(true);
    const success = await onApplyCoupon(couponInput.trim());
    setIsApplyingCoupon(false);
    if (!success) {
      setCouponError('Cupom inválido ou não atingiu o valor mínimo');
    } else {
      setCouponInput('');
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden animate-in fade-in duration-200">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-6 sm:pl-10">
        <div className="w-screen max-w-md bg-white dark:bg-[#0F2B38] text-[#0B2B3A] dark:text-[#E6F1EF] shadow-2xl flex flex-col justify-between border-l border-[#C5DAD6] dark:border-[#1E4252]">
          
          {/* Header */}
          <div className="p-4 sm:p-5 border-b border-[#C5DAD6] dark:border-[#1E4252] flex items-center justify-between bg-[#EAF3F1]/50 dark:bg-[#081C26]/50">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-[#E8A33D] text-[#0B2B3A] flex items-center justify-center font-bold">
                <ShoppingBag className="w-5 h-5" />
              </div>
              <div>
                <h2 className="font-serif text-lg sm:text-xl font-bold">Seu Pedido</h2>
                <span className="text-xs text-[#4F6B75] dark:text-[#93B0B8]">
                  {items.length} {items.length === 1 ? 'prato selecionado' : 'pratos selecionados'} · {tableNumber ? `Mesa ${tableNumber}` : 'Balcão'}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-1">
              {items.length > 0 && (
                <button
                  onClick={onClearCart}
                  className="text-xs text-rose-500 hover:text-rose-700 px-2 py-1 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
                  title="Limpar todos os itens"
                >
                  Limpar
                </button>
              )}
              <button
                onClick={onClose}
                className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-400 hover:text-gray-700 dark:hover:text-white"
                aria-label="Fechar carrinho"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
            {items.length === 0 ? (
              <div className="text-center py-16 space-y-3">
                <div className="w-16 h-16 mx-auto rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-gray-400">
                  <ShoppingBag className="w-8 h-8" />
                </div>
                <h3 className="font-serif text-lg font-bold text-[#0B2B3A] dark:text-[#E6F1EF]">
                  Sua comanda está vazia
                </h3>
                <p className="text-xs text-[#4F6B75] dark:text-[#93B0B8] max-w-xs mx-auto">
                  Explore nosso cardápio litorâneo e adicione peixes frescos, casquinha de siri ou drinks gelados!
                </p>
                <button
                  onClick={onClose}
                  className="mt-3 px-5 py-2.5 bg-[#1F7A8C] text-white rounded-xl text-xs font-semibold hover:bg-[#155A68]"
                >
                  Ver Cardápio
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                {items.map(item => (
                  <div
                    key={item.cartItemId}
                    className="p-3.5 rounded-xl border border-[#C5DAD6] dark:border-[#1E4252] bg-white dark:bg-[#081C26] shadow-xs space-y-2"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1">
                        <h4 className="font-serif font-bold text-sm text-[#0B2B3A] dark:text-white">
                          {item.product.name}
                        </h4>
                        <div className="text-xs text-[#E8A33D] font-bold">
                          R$ {item.unitPrice.toFixed(2).replace('.', ',')} cada
                        </div>
                      </div>

                      <div className="text-right">
                        <span className="font-serif font-bold text-sm text-[#0B2B3A] dark:text-[#E8A33D]">
                          R$ {item.itemTotal.toFixed(2).replace('.', ',')}
                        </span>
                      </div>
                    </div>

                    {/* Selected Options Breakdown */}
                    {item.selectedOptions && item.selectedOptions.length > 0 && (
                      <div className="text-xs text-[#4F6B75] dark:text-[#93B0B8] space-y-0.5 bg-gray-50 dark:bg-gray-800/40 p-2 rounded-lg">
                        {item.selectedOptions.map((opt, idx) => (
                          <div key={idx} className="flex justify-between">
                            <span>• {opt.groupName}: {opt.optionName}</span>
                            {opt.price > 0 && <span>+R$ {opt.price.toFixed(2).replace('.', ',')}</span>}
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Removed Ingredients */}
                    {item.removedIngredients && item.removedIngredients.length > 0 && (
                      <div className="text-[11px] text-rose-500 font-medium">
                        🚫 Sem: {item.removedIngredients.join(', ')}
                      </div>
                    )}

                    {/* Notes */}
                    {item.notes && (
                      <div className="text-[11px] italic text-[#4F6B75] dark:text-[#93B0B8] bg-amber-50 dark:bg-amber-950/20 px-2 py-1 rounded">
                        Obs: "{item.notes}"
                      </div>
                    )}

                    {/* Quantity controls and delete */}
                    <div className="flex items-center justify-between pt-1 border-t border-gray-100 dark:border-gray-800">
                      <button
                        onClick={() => onRemoveItem(item.cartItemId)}
                        className="text-xs text-rose-500 hover:text-rose-700 flex items-center gap-1"
                        title="Remover item"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Remover</span>
                      </button>

                      <div className="flex items-center gap-2 bg-[#EAF3F1] dark:bg-[#0F2B38] px-2 py-1 rounded-lg border border-[#C5DAD6] dark:border-[#1E4252]">
                        <button
                          onClick={() => onUpdateQuantity(item.cartItemId, -1)}
                          className="w-6 h-6 rounded flex items-center justify-center font-bold text-gray-700 dark:text-gray-200 hover:bg-white dark:hover:bg-gray-800"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="text-xs font-bold w-4 text-center">{item.quantity}</span>
                        <button
                          onClick={() => onUpdateQuantity(item.cartItemId, 1)}
                          className="w-6 h-6 rounded flex items-center justify-center font-bold text-[#1F7A8C] dark:text-[#5CC0D3] hover:bg-white dark:hover:bg-gray-800"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}

                {/* Smart Upsell Suggestions */}
                {upsellProducts.length > 0 && (
                  <div className="p-3.5 rounded-xl bg-gradient-to-br from-[#1F7A8C]/15 to-[#E8A33D]/10 border border-[#1F7A8C]/30 space-y-2 mt-4">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-[#0B2B3A] dark:text-[#E6F1EF]">
                      <Sparkles className="w-3.5 h-3.5 text-[#E8A33D]" />
                      <span>Que tal completar seu pedido?</span>
                    </div>

                    <div className="space-y-1.5">
                      {upsellProducts.slice(0, 2).map(up => (
                        <div
                          key={up.id}
                          className="flex items-center justify-between p-2 rounded-lg bg-white dark:bg-[#0F2B38] border border-[#C5DAD6] dark:border-[#1E4252] text-xs"
                        >
                          <div className="flex items-center gap-2">
                            <img
                              src={up.imageUrl}
                              alt={up.name}
                              className="w-9 h-9 rounded-md object-cover"
                            />
                            <div>
                              <div className="font-semibold text-[#0B2B3A] dark:text-white line-clamp-1">
                                {up.name}
                              </div>
                              <div className="text-[11px] text-[#E8A33D] font-bold">
                                R$ {(up.promoPrice || up.price).toFixed(2).replace('.', ',')}
                              </div>
                            </div>
                          </div>

                          <button
                            onClick={() => onQuickAddProduct(up)}
                            className="px-2.5 py-1 bg-[#1F7A8C] text-white rounded-lg text-xs font-semibold hover:bg-[#155A68] flex items-center gap-1"
                          >
                            <Plus className="w-3 h-3" />
                            <span>Adicionar</span>
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Footer Totals & Checkout Button */}
          {items.length > 0 && (
            <div className="p-4 sm:p-5 border-t border-[#C5DAD6] dark:border-[#1E4252] bg-[#EAF3F1]/80 dark:bg-[#081C26] space-y-3 shrink-0">
              
              {/* Coupon Code Input */}
              <div>
                {appliedCoupon ? (
                  <div className="flex items-center justify-between p-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 text-xs">
                    <div className="flex items-center gap-1.5">
                      <Check className="w-4 h-4 text-emerald-500" />
                      <span>Cupom <strong>{appliedCoupon.code}</strong> aplicado!</span>
                    </div>
                    <button
                      onClick={onRemoveCoupon}
                      className="text-xs text-rose-500 hover:underline font-bold"
                    >
                      Remover
                    </button>
                  </div>
                ) : (
                  <div className="flex gap-2">
                    <div className="relative flex-1">
                      <Ticket className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                      <input
                        type="text"
                        placeholder="Cupom (ex.: BEMVINDO10)"
                        value={couponInput}
                        onChange={e => setCouponInput(e.target.value.toUpperCase())}
                        className="w-full pl-8 pr-3 py-1.5 rounded-lg text-xs bg-white dark:bg-[#0F2B38] border border-[#C5DAD6] dark:border-[#1E4252] uppercase font-mono tracking-wider focus:outline-none focus:ring-1 focus:ring-[#1F7A8C]"
                      />
                    </div>
                    <button
                      onClick={handleApplyCoupon}
                      disabled={isApplyingCoupon || !couponInput.trim()}
                      className="px-3 py-1.5 bg-[#0B2B3A] dark:bg-[#1F7A8C] text-white rounded-lg text-xs font-semibold disabled:opacity-50"
                    >
                      Aplicar
                    </button>
                  </div>
                )}
                {couponError && (
                  <p className="text-[11px] text-rose-500 mt-1 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    <span>{couponError}</span>
                  </p>
                )}
              </div>

              {/* Fee Breakdown */}
              <div className="space-y-1.5 text-xs text-[#4F6B75] dark:text-[#93B0B8]">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-semibold text-[#0B2B3A] dark:text-[#E6F1EF]">
                    R$ {subtotal.toFixed(2).replace('.', ',')}
                  </span>
                </div>

                {couponDiscount > 0 && (
                  <div className="flex justify-between text-emerald-600 dark:text-emerald-400 font-semibold">
                    <span>Desconto do Cupom</span>
                    <span>- R$ {couponDiscount.toFixed(2).replace('.', ',')}</span>
                  </div>
                )}

                <div className="flex items-center justify-between">
                  <label className="flex items-center gap-1.5 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={includeServiceFee}
                      onChange={e => setIncludeServiceFee(e.target.checked)}
                      className="rounded text-[#1F7A8C] focus:ring-0"
                    />
                    <span>Taxa de Serviço Opcional (10%)</span>
                  </label>
                  <span>R$ {serviceFee.toFixed(2).replace('.', ',')}</span>
                </div>

                <div className="flex justify-between pt-2 border-t border-[#C5DAD6] dark:border-[#1E4252] text-base font-bold text-[#0B2B3A] dark:text-white font-serif">
                  <span>Total a Pagar</span>
                  <span className="text-[#E8A33D] text-lg">
                    R$ {finalTotal.toFixed(2).replace('.', ',')}
                  </span>
                </div>
              </div>

              {/* Checkout CTA */}
              <button
                onClick={onProceedToCheckout}
                className="w-full py-3.5 bg-[#E8A33D] hover:bg-[#F3B353] text-[#0B2B3A] font-bold rounded-xl shadow-lg flex items-center justify-center gap-2 text-sm sm:text-base transition-all active:scale-95 cursor-pointer"
              >
                <span>Avançar para Confirmação</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
