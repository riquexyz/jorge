import React, { useState } from 'react';
import {
  X,
  CheckCircle2,
  QrCode,
  CreditCard,
  Banknote,
  Copy,
  Check,
  MapPin,
  Utensils,
  ShoppingBag,
  Truck,
  ArrowRight,
  ShieldCheck
} from 'lucide-react';
import { CartItem, OrderType, PaymentMethod, DeliveryAddress, Order } from '../types';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  tableNumber: string;
  subtotal: number;
  serviceFee: number;
  deliveryFee: number;
  discount: number;
  couponCode?: string;
  finalTotal: number;
  restaurantPixKey?: string;
  onPlaceOrder: (orderPayload: {
    orderType: OrderType;
    tableNumber?: string;
    customerName: string;
    customerPhone: string;
    deliveryAddress?: DeliveryAddress;
    paymentMethod: PaymentMethod;
    paymentStatus: 'pending' | 'paid';
    customerNotes?: string;
    items: {
      productId: string;
      productName: string;
      quantity: number;
      unitPrice: number;
      selectedOptions: { groupName: string; optionName: string; price: number }[];
      removedIngredients: string[];
      notes?: string;
      totalPrice: number;
    }[];
    couponCode?: string;
  }) => Promise<Order>;
  onOrderSuccess: (order: Order) => void;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  isOpen,
  onClose,
  items,
  tableNumber,
  subtotal,
  serviceFee,
  discount,
  couponCode,
  finalTotal,
  restaurantPixKey,
  onPlaceOrder,
  onOrderSuccess
}) => {
  const [step, setStep] = useState<'details' | 'payment_pix'>('details');
  const [orderType, setOrderType] = useState<OrderType>('local');
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('pix');
  const [cashChange, setCashChange] = useState('');
  const [customerNotes, setCustomerNotes] = useState('');

  // Delivery Fields
  const [cep, setCep] = useState('');
  const [street, setStreet] = useState('');
  const [number, setNumber] = useState('');
  const [complement, setComplement] = useState('');
  const [neighborhood, setNeighborhood] = useState('Centro');
  const [reference, setReference] = useState('');

  // PIX state
  const [pixCopied, setPixCopied] = useState(false);
  const [createdOrder, setCreatedOrder] = useState<Order | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const currentDeliveryFee = orderType === 'delivery' ? 12.0 : 0;
  const calculatedTotalWithDelivery = Math.max(0, subtotal + (orderType === 'local' ? serviceFee : 0) + currentDeliveryFee - discount);

  // Generate valid formatted PIX copia-e-cola string using restaurant key
  const activePix = restaurantPixKey || "thalassa-peruibe@bancopix.com.br";
  const pixKey = "00020126580014br.gov.bcb.pix0136" + activePix + "5204000053039865405" + calculatedTotalWithDelivery.toFixed(2) + "5802BR5916THALASSA REST6007PERUIBE62070503***6304";

  const handleCopyPix = () => {
    navigator.clipboard.writeText(pixKey);
    setPixCopied(true);
    setTimeout(() => setPixCopied(false), 3000);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!customerName.trim()) {
      alert('Por favor, informe seu nome.');
      return;
    }

    if (orderType === 'delivery' && (!street.trim() || !number.trim())) {
      alert('Por favor, preencha o endereço de entrega completo.');
      return;
    }

    setIsSubmitting(true);

    try {
      const payload = {
        orderType,
        tableNumber: orderType === 'local' ? (tableNumber || '01') : undefined,
        customerName: customerName.trim(),
        customerPhone: customerPhone.trim(),
        deliveryAddress: orderType === 'delivery' ? {
          cep,
          street,
          number,
          complement,
          neighborhood,
          reference
        } : undefined,
        paymentMethod,
        paymentStatus: paymentMethod === 'pix' ? ('pending' as const) : ('pending' as const),
        customerNotes: customerNotes ? customerNotes + (paymentMethod === 'cash' && cashChange ? ` (Troco para R$ ${cashChange})` : '') : undefined,
        couponCode: couponCode || undefined,
        items: items.map(it => ({
          productId: it.productId,
          productName: it.product.name,
          quantity: it.quantity,
          unitPrice: it.unitPrice,
          selectedOptions: it.selectedOptions,
          removedIngredients: it.removedIngredients,
          notes: it.notes,
          totalPrice: it.itemTotal
        }))
      };

      const order = await onPlaceOrder(payload);
      setCreatedOrder(order);

      if (paymentMethod === 'pix') {
        setStep('payment_pix');
      } else {
        onOrderSuccess(order);
      }
    } catch (err: unknown) {
      alert((err as Error)?.message || 'Erro ao enviar pedido.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePixPaymentSimulated = () => {
    if (createdOrder) {
      // Mark as paid and transition
      onOrderSuccess({
        ...createdOrder,
        paymentStatus: 'paid'
      });
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto animate-in fade-in duration-200">
      <div className="bg-white dark:bg-[#0F2B38] text-[#0B2B3A] dark:text-[#E6F1EF] w-full max-w-lg rounded-2xl sm:rounded-3xl overflow-hidden shadow-2xl border border-[#C5DAD6] dark:border-[#1E4252] flex flex-col max-h-[92vh] my-auto">
        
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-[#C5DAD6] dark:border-[#1E4252] flex items-center justify-between bg-[#EAF3F1]/80 dark:bg-[#081C26]">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-[#1F7A8C]" />
            <h2 className="font-serif text-xl font-bold">
              {step === 'details' ? 'Confira seu Pedido' : 'Pagamento via PIX'}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-400 hover:text-gray-700 dark:hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Step 1: Details and Order Confirmation */}
        {step === 'details' && (
          <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-5 text-sm">
            
            {/* Order Items Summary */}
            <div className="p-3.5 rounded-xl bg-gray-50 dark:bg-[#081C26] border border-[#C5DAD6] dark:border-[#1E4252] space-y-2">
              <div className="text-xs font-bold text-[#4F6B75] dark:text-[#93B0B8] uppercase tracking-wider">
                Resumo da Comanda ({items.length} itens)
              </div>
              <div className="space-y-1 max-h-32 overflow-y-auto pr-1 text-xs">
                {items.map(it => (
                  <div key={it.cartItemId} className="flex justify-between">
                    <span className="truncate max-w-[70%]">
                      {it.quantity}x {it.product.name}
                    </span>
                    <span className="font-semibold text-[#0B2B3A] dark:text-white">
                      R$ {it.itemTotal.toFixed(2).replace('.', ',')}
                    </span>
                  </div>
                ))}
              </div>
              <div className="pt-2 border-t border-gray-200 dark:border-gray-800 flex justify-between font-serif text-sm font-bold text-[#0B2B3A] dark:text-[#E8A33D]">
                <span>Total a confirmar:</span>
                <span>R$ {calculatedTotalWithDelivery.toFixed(2).replace('.', ',')}</span>
              </div>
            </div>

            {/* Order Type Selection */}
            <div className="space-y-2">
              <label className="font-bold font-serif text-sm">Tipo de Pedido</label>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setOrderType('local')}
                  className={`p-2.5 rounded-xl border text-center transition-all flex flex-col items-center gap-1 cursor-pointer ${
                    orderType === 'local'
                      ? 'bg-[#1F7A8C] text-white border-[#1F7A8C] shadow-xs'
                      : 'bg-white dark:bg-[#081C26] border-[#C5DAD6] dark:border-[#1E4252] text-[#0B2B3A] dark:text-[#E6F1EF]'
                  }`}
                >
                  <Utensils className="w-4 h-4" />
                  <span className="text-xs font-semibold">Na Mesa</span>
                </button>

                <button
                  type="button"
                  onClick={() => setOrderType('pickup')}
                  className={`p-2.5 rounded-xl border text-center transition-all flex flex-col items-center gap-1 cursor-pointer ${
                    orderType === 'pickup'
                      ? 'bg-[#1F7A8C] text-white border-[#1F7A8C] shadow-xs'
                      : 'bg-white dark:bg-[#081C26] border-[#C5DAD6] dark:border-[#1E4252] text-[#0B2B3A] dark:text-[#E6F1EF]'
                  }`}
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span className="text-xs font-semibold">Retirada</span>
                </button>

                <button
                  type="button"
                  onClick={() => setOrderType('delivery')}
                  className={`p-2.5 rounded-xl border text-center transition-all flex flex-col items-center gap-1 cursor-pointer ${
                    orderType === 'delivery'
                      ? 'bg-[#1F7A8C] text-white border-[#1F7A8C] shadow-xs'
                      : 'bg-white dark:bg-[#081C26] border-[#C5DAD6] dark:border-[#1E4252] text-[#0B2B3A] dark:text-[#E6F1EF]'
                  }`}
                >
                  <Truck className="w-4 h-4" />
                  <span className="text-xs font-semibold">Delivery (+R$12)</span>
                </button>
              </div>

              {orderType === 'local' && (
                <div className="p-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 text-xs flex items-center justify-between">
                  <span>Mesa identificada automaticamente:</span>
                  <span className="font-bold text-sm bg-emerald-600 text-white px-2 py-0.5 rounded-md">
                    Mesa {tableNumber || '08'}
                  </span>
                </div>
              )}
            </div>

            {/* Customer Identification */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-xs font-semibold">Seu Nome *</label>
                <input
                  type="text"
                  required
                  value={customerName}
                  onChange={e => setCustomerName(e.target.value)}
                  placeholder="Ex.: Camila Rocha"
                  className="w-full p-2.5 rounded-xl bg-white dark:bg-[#081C26] border border-[#C5DAD6] dark:border-[#1E4252] focus:ring-2 focus:ring-[#1F7A8C] text-xs"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold">WhatsApp / Telefone</label>
                <input
                  type="tel"
                  value={customerPhone}
                  onChange={e => setCustomerPhone(e.target.value)}
                  placeholder="(13) 99999-9999"
                  className="w-full p-2.5 rounded-xl bg-white dark:bg-[#081C26] border border-[#C5DAD6] dark:border-[#1E4252] focus:ring-2 focus:ring-[#1F7A8C] text-xs"
                />
              </div>
            </div>

            {/* Delivery Address fields */}
            {orderType === 'delivery' && (
              <div className="space-y-3 p-3.5 rounded-xl bg-[#EAF3F1] dark:bg-[#081C26] border border-[#C5DAD6] dark:border-[#1E4252]">
                <div className="flex items-center gap-1.5 text-xs font-bold text-[#1F7A8C]">
                  <MapPin className="w-3.5 h-3.5" />
                  <span>Endereço para Entrega em Peruíbe</span>
                </div>

                <div className="grid grid-cols-3 gap-2">
                  <div className="col-span-1">
                    <label className="text-[10px] font-semibold">CEP</label>
                    <input
                      type="text"
                      placeholder="11750-000"
                      value={cep}
                      onChange={e => setCep(e.target.value)}
                      className="w-full p-2 rounded-lg bg-white dark:bg-[#0F2B38] border border-gray-300 dark:border-gray-700 text-xs"
                    />
                  </div>
                  <div className="col-span-2">
                    <label className="text-[10px] font-semibold">Rua / Avenida *</label>
                    <input
                      type="text"
                      required
                      placeholder="Av. Padre Anchieta"
                      value={street}
                      onChange={e => setStreet(e.target.value)}
                      className="w-full p-2 rounded-lg bg-white dark:bg-[#0F2B38] border border-gray-300 dark:border-gray-700 text-xs"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2">
                  <div>
                    <label className="text-[10px] font-semibold">Número *</label>
                    <input
                      type="text"
                      required
                      placeholder="120"
                      value={number}
                      onChange={e => setNumber(e.target.value)}
                      className="w-full p-2 rounded-lg bg-white dark:bg-[#0F2B38] border border-gray-300 dark:border-gray-700 text-xs"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-semibold">Complemento</label>
                    <input
                      type="text"
                      placeholder="Apto 42"
                      value={complement}
                      onChange={e => setComplement(e.target.value)}
                      className="w-full p-2 rounded-lg bg-white dark:bg-[#0F2B38] border border-gray-300 dark:border-gray-700 text-xs"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-semibold">Bairro</label>
                    <input
                      type="text"
                      placeholder="Stella Maris"
                      value={neighborhood}
                      onChange={e => setNeighborhood(e.target.value)}
                      className="w-full p-2 rounded-lg bg-white dark:bg-[#0F2B38] border border-gray-300 dark:border-gray-700 text-xs"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[10px] font-semibold">Ponto de Referência</label>
                  <input
                    type="text"
                    placeholder="Próximo ao quiosque 14"
                    value={reference}
                    onChange={e => setReference(e.target.value)}
                    className="w-full p-2 rounded-lg bg-white dark:bg-[#0F2B38] border border-gray-300 dark:border-gray-700 text-xs"
                  />
                </div>
              </div>
            )}

            {/* Payment Method Selection */}
            <div className="space-y-2">
              <label className="font-bold font-serif text-sm">Forma de Pagamento</label>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <button
                  type="button"
                  onClick={() => setPaymentMethod('pix')}
                  className={`p-3 rounded-xl border text-left flex items-center gap-2.5 transition-all cursor-pointer ${
                    paymentMethod === 'pix'
                      ? 'border-[#1F7A8C] bg-[#1F7A8C]/10 ring-1 ring-[#1F7A8C] font-semibold'
                      : 'border-[#C5DAD6] dark:border-[#1E4252] bg-white dark:bg-[#081C26]'
                  }`}
                >
                  <QrCode className="w-4 h-4 text-emerald-500" />
                  <div>
                    <div className="font-bold text-[#0B2B3A] dark:text-white">PIX Instantâneo</div>
                    <div className="text-[10px] text-emerald-600 font-semibold">Liberação imediata</div>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod('credit')}
                  className={`p-3 rounded-xl border text-left flex items-center gap-2.5 transition-all cursor-pointer ${
                    paymentMethod === 'credit'
                      ? 'border-[#1F7A8C] bg-[#1F7A8C]/10 ring-1 ring-[#1F7A8C] font-semibold'
                      : 'border-[#C5DAD6] dark:border-[#1E4252] bg-white dark:bg-[#081C26]'
                  }`}
                >
                  <CreditCard className="w-4 h-4 text-[#1F7A8C]" />
                  <div>
                    <div className="font-bold text-[#0B2B3A] dark:text-white">Cartão (Maquininha)</div>
                    <div className="text-[10px] text-[#4F6B75] dark:text-[#93B0B8]">Crédito ou Débito</div>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod('table')}
                  className={`p-3 rounded-xl border text-left flex items-center gap-2.5 transition-all cursor-pointer ${
                    paymentMethod === 'table'
                      ? 'border-[#1F7A8C] bg-[#1F7A8C]/10 ring-1 ring-[#1F7A8C] font-semibold'
                      : 'border-[#C5DAD6] dark:border-[#1E4252] bg-white dark:bg-[#081C26]'
                  }`}
                >
                  <Utensils className="w-4 h-4 text-[#E8A33D]" />
                  <div>
                    <div className="font-bold text-[#0B2B3A] dark:text-white">Pagar na Mesa</div>
                    <div className="text-[10px] text-[#4F6B75] dark:text-[#93B0B8]">Garçom traz a conta</div>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod('cash')}
                  className={`p-3 rounded-xl border text-left flex items-center gap-2.5 transition-all cursor-pointer ${
                    paymentMethod === 'cash'
                      ? 'border-[#1F7A8C] bg-[#1F7A8C]/10 ring-1 ring-[#1F7A8C] font-semibold'
                      : 'border-[#C5DAD6] dark:border-[#1E4252] bg-white dark:bg-[#081C26]'
                  }`}
                >
                  <Banknote className="w-4 h-4 text-emerald-600" />
                  <div>
                    <div className="font-bold text-[#0B2B3A] dark:text-white">Dinheiro</div>
                    <div className="text-[10px] text-[#4F6B75] dark:text-[#93B0B8]">Precisa de troco?</div>
                  </div>
                </button>
              </div>

              {paymentMethod === 'cash' && (
                <div className="pt-2">
                  <label className="text-xs font-semibold">Troco para quanto?</label>
                  <input
                    type="text"
                    placeholder="Ex.: R$ 200,00"
                    value={cashChange}
                    onChange={e => setCashChange(e.target.value)}
                    className="w-full mt-1 p-2 rounded-lg bg-white dark:bg-[#081C26] border border-[#C5DAD6] dark:border-[#1E4252] text-xs"
                  />
                </div>
              )}
            </div>

            {/* Free text customer notes */}
            <div className="space-y-1">
              <label className="text-xs font-semibold">Observações Gerais para o Restaurante</label>
              <input
                type="text"
                placeholder="Ex.: Talheres descartáveis, caprichar no gelo..."
                value={customerNotes}
                onChange={e => setCustomerNotes(e.target.value)}
                className="w-full p-2 rounded-xl bg-white dark:bg-[#081C26] border border-[#C5DAD6] dark:border-[#1E4252] text-xs"
              />
            </div>

            {/* Confirm & Submit */}
            <div className="pt-3 border-t border-[#C5DAD6] dark:border-[#1E4252]">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3.5 bg-[#E8A33D] hover:bg-[#F3B353] text-[#0B2B3A] font-bold rounded-xl shadow-lg flex items-center justify-center gap-2 transition-all active:scale-95 cursor-pointer disabled:opacity-50 text-base"
              >
                {isSubmitting ? (
                  <span>Enviando para a Cozinha...</span>
                ) : (
                  <>
                    <span>Confirmar Pedido · R$ {calculatedTotalWithDelivery.toFixed(2).replace('.', ',')}</span>
                    <ArrowRight className="w-5 h-5" />
                  </>
                )}
              </button>
              <p className="text-[11px] text-center text-[#4F6B75] dark:text-[#93B0B8] mt-2">
                Ao confirmar, seu pedido é enviado imediatamente para o sistema da cozinha.
              </p>
            </div>
          </form>
        )}

        {/* Step 2: Interactive PIX Payment Gate */}
        {step === 'payment_pix' && (
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 text-center">
            <div className="w-12 h-12 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 mx-auto flex items-center justify-center">
              <CheckCircle2 className="w-7 h-7" />
            </div>

            <div>
              <h3 className="font-serif text-xl font-bold">Pedido #{createdOrder?.orderNumber} Registrado!</h3>
              <p className="text-xs text-[#4F6B75] dark:text-[#93B0B8] mt-1">
                Efetue o pagamento via PIX para liberação instantânea e início imediato do preparo.
              </p>
            </div>

            {/* Dynamic Generated PIX QR Code representation */}
            <div className="w-48 h-48 mx-auto bg-white p-3 rounded-2xl border-2 border-emerald-500 shadow-md flex items-center justify-center">
              <svg className="w-full h-full text-[#0B2B3A]" viewBox="0 0 100 100" fill="currentColor">
                <rect x="5" y="5" width="28" height="28" fill="#0B2B3A" rx="3" />
                <rect x="9" y="9" width="20" height="20" fill="white" rx="1.5" />
                <rect x="13" y="13" width="12" height="12" fill="#0B2B3A" rx="1" />

                <rect x="67" y="5" width="28" height="28" fill="#0B2B3A" rx="3" />
                <rect x="71" y="9" width="20" height="20" fill="white" rx="1.5" />
                <rect x="75" y="13" width="12" height="12" fill="#0B2B3A" rx="1" />

                <rect x="5" y="67" width="28" height="28" fill="#0B2B3A" rx="3" />
                <rect x="9" y="71" width="20" height="20" fill="white" rx="1.5" />
                <rect x="13" y="75" width="12" height="12" fill="#0B2B3A" rx="1" />

                <rect x="38" y="14" width="8" height="8" fill="#1F7A8C" />
                <rect x="50" y="20" width="8" height="6" fill="#0B2B3A" />
                <rect x="42" y="38" width="16" height="16" fill="#E8A33D" rx="2" />
                <rect x="70" y="44" width="10" height="8" fill="#0B2B3A" />
                <rect x="40" y="70" width="12" height="10" fill="#0B2B3A" />
                <rect x="70" y="72" width="16" height="16" fill="#1F7A8C" />
              </svg>
            </div>

            <div className="font-serif text-2xl font-bold text-[#E8A33D]">
              R$ {calculatedTotalWithDelivery.toFixed(2).replace('.', ',')}
            </div>

            {/* Pix Copia e Cola */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-[#4F6B75] dark:text-[#93B0B8]">
                PIX Copia e Cola
              </label>
              <div className="flex items-center gap-2 p-2 rounded-xl bg-gray-100 dark:bg-gray-800 text-xs font-mono">
                <span className="truncate flex-1 text-left">{pixKey}</span>
                <button
                  type="button"
                  onClick={handleCopyPix}
                  className="px-3 py-1.5 bg-[#1F7A8C] text-white rounded-lg flex items-center gap-1 font-sans font-semibold hover:bg-[#155A68]"
                >
                  {pixCopied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{pixCopied ? 'Copiado!' : 'Copiar'}</span>
                </button>
              </div>
            </div>

            {/* Simulate Instant Payment Approved */}
            <div className="pt-2 space-y-2">
              <button
                type="button"
                onClick={handlePixPaymentSimulated}
                className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-lg flex items-center justify-center gap-2 cursor-pointer"
              >
                <Check className="w-5 h-5" />
                <span>Simular Pagamento PIX Aprovado</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  if (createdOrder) onOrderSuccess(createdOrder);
                }}
                className="text-xs text-[#4F6B75] dark:text-[#93B0B8] hover:underline"
              >
                Pagar mais tarde na mesa e acompanhar pedido →
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
