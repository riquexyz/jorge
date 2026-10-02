import React, { useState } from 'react';
import {
  X,
  QrCode,
  ChefHat,
  ShieldCheck,
  Copy,
  Check,
  ExternalLink,
  Smartphone,
  Monitor,
  Lock,
  ArrowRight
} from 'lucide-react';

interface PanelsLinkModalProps {
  isOpen: boolean;
  onClose: () => void;
  tableNumber: string;
  onSelectView: (view: 'client' | 'kds' | 'admin') => void;
}

export const PanelsLinkModal: React.FC<PanelsLinkModalProps> = ({
  isOpen,
  onClose,
  tableNumber,
  onSelectView
}) => {
  const [copiedLink, setCopiedLink] = useState<string | null>(null);

  if (!isOpen) return null;

  const baseUrl = typeof window !== 'undefined'
    ? `${window.location.origin}${window.location.pathname}`
    : 'https://seusite.com';

  const clientUrl = `${baseUrl}?mesa=${tableNumber || '08'}`;
  const kitchenUrl = `${baseUrl}?painel=cozinha`;
  const adminUrl = `${baseUrl}?painel=admin`;

  const copyToClipboard = (url: string, label: string) => {
    navigator.clipboard.writeText(url);
    setCopiedLink(label);
    setTimeout(() => setCopiedLink(null), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto animate-in fade-in duration-200">
      <div className="bg-white dark:bg-[#0F2B38] text-[#0B2B3A] dark:text-[#E6F1EF] w-full max-w-2xl rounded-2xl sm:rounded-3xl overflow-hidden shadow-2xl border border-[#C5DAD6] dark:border-[#1E4252] flex flex-col max-h-[92vh]">
        
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-[#C5DAD6] dark:border-[#1E4252] flex items-center justify-between bg-gradient-to-r from-[#0B2B3A] to-[#1F7A8C] text-white">
          <div>
            <span className="text-xs uppercase tracking-wider text-[#E8A33D] font-bold">
              Organização do Restaurante
            </span>
            <h2 className="font-serif text-lg sm:text-xl font-bold mt-0.5">
              Links Separados para Clientes, Cozinha e Administração
            </h2>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-300 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-4 text-xs sm:text-sm">
          <p className="text-[#4F6B75] dark:text-[#93B0B8] leading-relaxed">
            Cada área do seu restaurante tem um link próprio. Dessa forma, <strong>o cliente só vê o cardápio da mesa dele</strong>, <strong>a cozinha só vê os pedidos para preparar</strong>, e <strong>você controla o faturamento</strong> com segurança.
          </p>

          <div className="space-y-3">
            
            {/* Panel 1: Cliente na Mesa */}
            <div className="p-4 rounded-2xl border-2 border-emerald-500/40 bg-emerald-50/50 dark:bg-emerald-950/20 space-y-2.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold">
                    <Smartphone className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="font-serif font-bold text-sm text-[#0B2B3A] dark:text-white">
                      1. Painel do Cliente (Mesas)
                    </h3>
                    <span className="text-[11px] text-emerald-700 dark:text-emerald-400 font-semibold">
                      O que o cliente vê ao ler o QR Code da mesa
                    </span>
                  </div>
                </div>

                <span className="text-[11px] bg-emerald-100 dark:bg-emerald-900 text-emerald-800 dark:text-emerald-200 px-2 py-0.5 rounded-full font-bold">
                  Público
                </span>
              </div>

              <p className="text-xs text-[#4F6B75] dark:text-[#93B0B8]">
                Apenas cardápio, fotos, personalização dos pratos, carrinho e acompanhamento em 5 etapas.
              </p>

              <div className="flex items-center gap-2 bg-white dark:bg-[#081C26] p-2 rounded-xl border border-emerald-200 dark:border-emerald-800 font-mono text-[11px]">
                <span className="truncate flex-1 text-gray-700 dark:text-gray-300">{clientUrl}</span>
                <button
                  onClick={() => copyToClipboard(clientUrl, 'client')}
                  className="px-2.5 py-1 bg-emerald-600 text-white rounded-lg font-sans font-semibold flex items-center gap-1 hover:bg-emerald-700"
                >
                  {copiedLink === 'client' ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                  <span>{copiedLink === 'client' ? 'Copiado!' : 'Copiar'}</span>
                </button>
              </div>

              <div className="flex justify-end pt-1">
                <button
                  onClick={() => {
                    onSelectView('client');
                    onClose();
                  }}
                  className="text-xs text-emerald-700 dark:text-emerald-400 font-bold hover:underline flex items-center gap-1"
                >
                  <span>Abrir tela do cliente agora</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>
            </div>

            {/* Panel 2: Cozinha KDS */}
            <div className="p-4 rounded-2xl border-2 border-amber-500/40 bg-amber-50/50 dark:bg-amber-950/20 space-y-2.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-[#E8A33D] text-[#0B2B3A] flex items-center justify-center font-bold">
                    <ChefHat className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="font-serif font-bold text-sm text-[#0B2B3A] dark:text-white">
                      2. Painel da Cozinha (KDS)
                    </h3>
                    <span className="text-[11px] text-amber-700 dark:text-amber-400 font-semibold">
                      Para deixar aberto em um tablet ou monitor na cozinha
                    </span>
                  </div>
                </div>

                <span className="text-[11px] bg-amber-100 dark:bg-amber-900 text-amber-800 dark:text-amber-200 px-2 py-0.5 rounded-full font-bold flex items-center gap-1">
                  <Lock className="w-3 h-3" />
                  <span>Senha: 0000</span>
                </span>
              </div>

              <p className="text-xs text-[#4F6B75] dark:text-[#93B0B8]">
                Protegido por senha (PIN <strong>0000</strong>). Mostra pedidos em colunas (Novos → Preparo → Pronto), toca a campainha sonoro quando entra pedido e alerta se atrasar mais de 20 min.
              </p>

              <div className="flex items-center gap-2 bg-white dark:bg-[#081C26] p-2 rounded-xl border border-amber-200 dark:border-amber-800 font-mono text-[11px]">
                <span className="truncate flex-1 text-gray-700 dark:text-gray-300">{kitchenUrl}</span>
                <button
                  onClick={() => copyToClipboard(kitchenUrl, 'kds')}
                  className="px-2.5 py-1 bg-[#E8A33D] text-[#0B2B3A] rounded-lg font-sans font-bold flex items-center gap-1 hover:bg-[#F3B353]"
                >
                  {copiedLink === 'kds' ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                  <span>{copiedLink === 'kds' ? 'Copiado!' : 'Copiar'}</span>
                </button>
              </div>

              <div className="flex justify-end pt-1">
                <button
                  onClick={() => {
                    onSelectView('kds');
                    onClose();
                  }}
                  className="text-xs text-[#E8A33D] font-bold hover:underline flex items-center gap-1"
                >
                  <span>Abrir tela da cozinha agora</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>
            </div>

            {/* Panel 3: Painel Administrativo */}
            <div className="p-4 rounded-2xl border-2 border-[#1F7A8C]/40 bg-[#1F7A8C]/10 space-y-2.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-[#1F7A8C] text-white flex items-center justify-center font-bold">
                    <ShieldCheck className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="font-serif font-bold text-sm text-[#0B2B3A] dark:text-white">
                      3. Painel Administrativo & Caixa
                    </h3>
                    <span className="text-[11px] text-[#1F7A8C] dark:text-[#5CC0D3] font-semibold">
                      Para o dono, gerente ou caixa do restaurante
                    </span>
                  </div>
                </div>

                <span className="text-[11px] bg-[#1F7A8C]/20 text-[#1F7A8C] dark:text-[#5CC0D3] px-2 py-0.5 rounded-full font-bold flex items-center gap-1">
                  <Lock className="w-3 h-3" />
                  <span>Senha: 1234</span>
                </span>
              </div>

              <p className="text-xs text-[#4F6B75] dark:text-[#93B0B8]">
                Protegido por senha (PIN <strong>1234</strong>). Acompanhe o faturamento em tempo real, ative/desative pratos com 1 clique, altere preços, gerencie mesas e imprima as plaquinhas QR Code.
              </p>

              <div className="flex items-center gap-2 bg-white dark:bg-[#081C26] p-2 rounded-xl border border-[#1F7A8C]/30 font-mono text-[11px]">
                <span className="truncate flex-1 text-gray-700 dark:text-gray-300">{adminUrl}</span>
                <button
                  onClick={() => copyToClipboard(adminUrl, 'admin')}
                  className="px-2.5 py-1 bg-[#1F7A8C] text-white rounded-lg font-sans font-semibold flex items-center gap-1 hover:bg-[#155A68]"
                >
                  {copiedLink === 'admin' ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                  <span>{copiedLink === 'admin' ? 'Copiado!' : 'Copiar'}</span>
                </button>
              </div>

              <div className="flex justify-end pt-1">
                <button
                  onClick={() => {
                    onSelectView('admin');
                    onClose();
                  }}
                  className="text-xs text-[#1F7A8C] dark:text-[#5CC0D3] font-bold hover:underline flex items-center gap-1"
                >
                  <span>Abrir tela do administrador agora</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>
            </div>

          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-[#C5DAD6] dark:border-[#1E4252] bg-[#EAF3F1]/80 dark:bg-[#081C26] flex items-center justify-between">
          <div className="text-[11px] text-[#4F6B75] dark:text-[#93B0B8]">
            Dica: Salve o link da cozinha nos favoritos do navegador do tablet da cozinha!
          </div>
          <button
            onClick={onClose}
            className="px-5 py-2 bg-[#0B2B3A] dark:bg-[#1F7A8C] text-white font-semibold rounded-xl text-xs"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
};
