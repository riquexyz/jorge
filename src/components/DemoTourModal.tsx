import React from 'react';
import {
  X,
  Play,
  QrCode,
  UtensilsCrossed,
  ShoppingBag,
  ChefHat,
  Bell,
  CheckCircle2,
  ShieldCheck,
  Sparkles
} from 'lucide-react';

interface DemoTourModalProps {
  isOpen: boolean;
  onClose: () => void;
  onStartSimulation: () => void;
  onSwitchView: (view: 'client' | 'kds' | 'admin') => void;
}

export const DemoTourModal: React.FC<DemoTourModalProps> = ({
  isOpen,
  onClose,
  onStartSimulation,
  onSwitchView
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto animate-in fade-in duration-200">
      <div className="bg-white dark:bg-[#0F2B38] text-[#0B2B3A] dark:text-[#E6F1EF] w-full max-w-xl rounded-2xl sm:rounded-3xl overflow-hidden shadow-2xl border border-[#C5DAD6] dark:border-[#1E4252] flex flex-col max-h-[92vh]">
        
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-[#C5DAD6] dark:border-[#1E4252] flex items-center justify-between bg-gradient-to-r from-[#0B2B3A] to-[#1F7A8C] text-white">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-[#E8A33D] text-[#0B2B3A] flex items-center justify-center font-bold">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-serif text-lg sm:text-xl font-bold">
                Tour Demonstrativo · Thalassa Sistema Completo
              </h2>
              <span className="text-xs text-[#B9D3D8]">
                Entenda o fluxo ponta a ponta: do QR Code na mesa até a cozinha e dashboard
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-300 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-5 text-xs sm:text-sm">
          
          <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 text-amber-900 dark:text-amber-200 space-y-2">
            <h3 className="font-bold flex items-center gap-1.5 text-sm">
              <Play className="w-4 h-4 text-[#E8A33D] fill-current" />
              <span>Simulação Automática em 1-Clique</span>
            </h3>
            <p className="text-xs leading-relaxed">
              Deseja criar instantaneamente um pedido de teste completo na <strong>Mesa 08</strong> (Moqueca Mista + Água de Coco + Burger Artesanal) para ver a campainha da cozinha tocar e acompanhar a linha do tempo ao vivo?
            </p>
            <button
              onClick={() => {
                onStartSimulation();
                onClose();
              }}
              className="py-2.5 px-5 bg-[#E8A33D] hover:bg-[#F3B353] text-[#0B2B3A] font-bold rounded-xl text-xs flex items-center gap-2 shadow-md cursor-pointer transition-all active:scale-95"
            >
              <Sparkles className="w-4 h-4" />
              <span>Disparar Pedido de Demonstração Agora</span>
            </button>
          </div>

          {/* Step-by-Step Overview */}
          <div className="space-y-3">
            <h3 className="font-serif text-base font-bold text-[#0B2B3A] dark:text-white">
              Como o Sistema Funciona no Restaurante Real:
            </h3>

            <div className="space-y-2.5">
              <div className="p-3 rounded-xl border border-[#C5DAD6] dark:border-[#1E4252] flex items-start gap-3 bg-white dark:bg-[#081C26]">
                <div className="w-7 h-7 rounded-lg bg-[#1F7A8C]/20 text-[#1F7A8C] font-bold flex items-center justify-center shrink-0">
                  <QrCode className="w-4 h-4" />
                </div>
                <div>
                  <div className="font-bold text-[#0B2B3A] dark:text-white">1. QR Code na Mesa</div>
                  <p className="text-xs text-[#4F6B75] dark:text-[#93B0B8]">
                    Cada mesa possui uma placa com QR Code único (ex.: <code>?mesa=08</code>). Ao escanear, o sistema já sabe qual é a mesa sem o cliente precisar digitar nada.
                  </p>
                </div>
              </div>

              <div className="p-3 rounded-xl border border-[#C5DAD6] dark:border-[#1E4252] flex items-start gap-3 bg-white dark:bg-[#081C26]">
                <div className="w-7 h-7 rounded-lg bg-[#1F7A8C]/20 text-[#1F7A8C] font-bold flex items-center justify-center shrink-0">
                  <UtensilsCrossed className="w-4 h-4" />
                </div>
                <div>
                  <div className="font-bold text-[#0B2B3A] dark:text-white">2. Cardápio Interativo & Personalização</div>
                  <p className="text-xs text-[#4F6B75] dark:text-[#93B0B8]">
                    O cliente escolhe pratos com fotos grandes, pontos da carne, remoção de ingredientes ("sem cebola"), bebidas, tamanhos de pizza e adicionais com cálculo automático.
                  </p>
                </div>
              </div>

              <div className="p-3 rounded-xl border border-[#C5DAD6] dark:border-[#1E4252] flex items-start gap-3 bg-white dark:bg-[#081C26]">
                <div className="w-7 h-7 rounded-lg bg-[#1F7A8C]/20 text-[#1F7A8C] font-bold flex items-center justify-center shrink-0">
                  <ShoppingBag className="w-4 h-4" />
                </div>
                <div>
                  <div className="font-bold text-[#0B2B3A] dark:text-white">3. Comanda Digital Coletiva & PIX</div>
                  <p className="text-xs text-[#4F6B75] dark:text-[#93B0B8]">
                    Várias pessoas na mesma mesa podem enviar pedidos independentes que se acumulam na comanda da mesa. Pagamento aceita PIX com QR Code dinâmico, cartões ou garçom.
                  </p>
                </div>
              </div>

              <div className="p-3 rounded-xl border border-[#C5DAD6] dark:border-[#1E4252] flex items-start gap-3 bg-white dark:bg-[#081C26]">
                <div className="w-7 h-7 rounded-lg bg-[#1F7A8C]/20 text-[#1F7A8C] font-bold flex items-center justify-center shrink-0">
                  <ChefHat className="w-4 h-4" />
                </div>
                <div>
                  <div className="font-bold text-[#0B2B3A] dark:text-white">4. Envio em Tempo Real para a Cozinha (KDS)</div>
                  <p className="text-xs text-[#4F6B75] dark:text-[#93B0B8]">
                    O pedido surge instantaneamente no painel da cozinha com campainha sonora e alerta de tempo. A equipe da cozinha clica em [Aceitar] → [Iniciar Preparo] → [Pronto].
                  </p>
                </div>
              </div>

              <div className="p-3 rounded-xl border border-[#C5DAD6] dark:border-[#1E4252] flex items-start gap-3 bg-white dark:bg-[#081C26]">
                <div className="w-7 h-7 rounded-lg bg-[#1F7A8C]/20 text-[#1F7A8C] font-bold flex items-center justify-center shrink-0">
                  <Bell className="w-4 h-4" />
                </div>
                <div>
                  <div className="font-bold text-[#0B2B3A] dark:text-white">5. Acompanhamento ao Vivo pelo Cliente</div>
                  <p className="text-xs text-[#4F6B75] dark:text-[#93B0B8]">
                    O celular do cliente atualiza sozinho na tela em 5 etapas, mostrando o tempo estimado restante e liberando avaliação por estrelas ao receber.
                  </p>
                </div>
              </div>

              <div className="p-3 rounded-xl border border-[#C5DAD6] dark:border-[#1E4252] flex items-start gap-3 bg-white dark:bg-[#081C26]">
                <div className="w-7 h-7 rounded-lg bg-[#1F7A8C]/20 text-[#1F7A8C] font-bold flex items-center justify-center shrink-0">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <div>
                  <div className="font-bold text-[#0B2B3A] dark:text-white">6. Painel Administrativo & Gestão</div>
                  <p className="text-xs text-[#4F6B75] dark:text-[#93B0B8]">
                    O dono do restaurante acompanha faturamento, ticket médio, ativa/desativa pratos que esgotaram com 1 clique e imprime displays para as mesas.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Switch Buttons */}
          <div className="pt-2 border-t border-[#C5DAD6] dark:border-[#1E4252] flex flex-wrap gap-2">
            <span className="text-xs font-semibold text-[#4F6B75] dark:text-[#93B0B8] w-full">
              Alternar rapidamente de visão:
            </span>
            <button
              onClick={() => {
                onSwitchView('client');
                onClose();
              }}
              className="px-3 py-1.5 bg-[#0B2B3A] dark:bg-[#1F7A8C] text-white rounded-lg text-xs font-semibold"
            >
              📱 Ver Cardápio (Cliente)
            </button>
            <button
              onClick={() => {
                onSwitchView('kds');
                onClose();
              }}
              className="px-3 py-1.5 bg-[#E8A33D] text-[#0B2B3A] font-bold rounded-lg text-xs"
            >
              👨‍🍳 Ver Cozinha (KDS)
            </button>
            <button
              onClick={() => {
                onSwitchView('admin');
                onClose();
              }}
              className="px-3 py-1.5 bg-gray-200 dark:bg-gray-700 text-[#0B2B3A] dark:text-white font-semibold rounded-lg text-xs"
            >
              ⚙️ Ver Painel Admin
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-[#C5DAD6] dark:border-[#1E4252] bg-[#EAF3F1]/80 dark:bg-[#081C26]">
          <button
            onClick={onClose}
            className="w-full py-2.5 bg-[#0B2B3A] dark:bg-[#1F7A8C] text-white font-semibold rounded-xl"
          >
            Fechar Tour
          </button>
        </div>
      </div>
    </div>
  );
};
