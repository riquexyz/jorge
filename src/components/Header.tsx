import React, { useState } from 'react';
import {
  Clock,
  Star,
  MapPin,
  MessageCircle,
  CreditCard,
  ChefHat,
  ShieldCheck,
  UtensilsCrossed,
  Sparkles,
  QrCode,
  Compass
} from 'lucide-react';
import { RestaurantInfo } from '../types';

interface HeaderProps {
  restaurant: RestaurantInfo;
  activeView: 'client' | 'kds' | 'admin';
  setActiveView: (view: 'client' | 'kds' | 'admin') => void;
  tableNumber: string;
  onOpenTableModal: () => void;
  onOpenDemoTour: () => void;
  onOpenPanelsModal: () => void;
  onRequestAdmin: () => void;
  onRequestKitchen: () => void;
  darkMode: boolean;
  setDarkMode: (dark: boolean) => void;
  activeOrdersCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  restaurant,
  activeView,
  setActiveView,
  tableNumber,
  onOpenTableModal,
  onOpenDemoTour,
  onOpenPanelsModal,
  onRequestAdmin,
  onRequestKitchen,
  darkMode,
  setDarkMode,
  activeOrdersCount
}) => {
  const [showInfoModal, setShowInfoModal] = useState(false);

  return (
    <>
      {/* Top Application Bar */}
      <header className="sticky top-0 z-40 bg-[#0B2B3A] text-white border-b border-[#1E4252] shadow-md transition-colors">
        <div className="max-w-7xl mx-auto px-4 py-2.5 flex items-center justify-between gap-3">
          
          {/* Brand & Table Badge */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setActiveView('client')}
              className="flex items-center gap-2.5 text-left group focus:outline-none"
              aria-label="Voltar para o cardápio"
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#1F7A8C] to-[#0B2B3A] border border-[#E8A33D]/40 flex items-center justify-center text-[#E8A33D] font-serif text-xl font-bold shadow-inner">
                Θ
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="font-serif tracking-wide text-base font-semibold text-white group-hover:text-[#E8A33D] transition-colors">
                    Thalassa
                  </span>
                  <span className="hidden sm:inline-block text-xs bg-[#1F7A8C]/40 text-[#E8A33D] border border-[#E8A33D]/30 px-1.5 py-0.5 rounded-full font-medium">
                    Peruíbe
                  </span>
                </div>
                <div className="text-[11px] text-[#B9D3D8] flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                  {restaurant.isOpen ? `Aberto até ${restaurant.closesAt}` : 'Fechado no momento'}
                </div>
              </div>
            </button>

            {/* Current Table Badge */}
            {tableNumber && (
              <button
                onClick={onOpenTableModal}
                className="hidden md:flex items-center gap-1.5 bg-[#1F7A8C]/30 hover:bg-[#1F7A8C]/60 text-[#E8A33D] border border-[#E8A33D]/40 px-2.5 py-1 rounded-lg text-xs font-semibold transition-all"
                title="Clique para alterar mesa ou ver comanda"
              >
                <QrCode className="w-3.5 h-3.5" />
                <span>Mesa {tableNumber}</span>
              </button>
            )}
          </div>

          {/* Navigation View Switcher (Client, KDS Cozinha, Admin) */}
          <div className="flex items-center gap-1 sm:gap-2">
            <div className="flex bg-[#04121A] p-1 rounded-xl border border-[#1E4252] shadow-inner">
              <button
                onClick={() => setActiveView('client')}
                className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  activeView === 'client'
                    ? 'bg-[#1F7A8C] text-white shadow-sm'
                    : 'text-[#93B0B8] hover:text-white'
                }`}
                title="Cardápio para clientes"
              >
                <UtensilsCrossed className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Cardápio</span>
              </button>

              <button
                onClick={onRequestKitchen}
                className={`relative flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  activeView === 'kds'
                    ? 'bg-[#E8A33D] text-[#0B2B3A] shadow-sm font-bold'
                    : 'text-[#93B0B8] hover:text-white'
                }`}
                title="Painel de Cozinha KDS (com senha)"
              >
                <ChefHat className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Cozinha KDS</span>
                {activeOrdersCount > 0 && (
                  <span className="w-4 h-4 rounded-full bg-rose-500 text-white text-[10px] font-bold flex items-center justify-center">
                    {activeOrdersCount}
                  </span>
                )}
              </button>

              <button
                onClick={onRequestAdmin}
                className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  activeView === 'admin'
                    ? 'bg-[#1F7A8C] text-white shadow-sm'
                    : 'text-[#93B0B8] hover:text-white'
                }`}
                title="Painel Administrativo (com senha)"
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Admin</span>
              </button>
            </div>

            {/* Separated Panels Link Button */}
            <button
              onClick={onOpenPanelsModal}
              className="flex items-center gap-1.5 bg-[#1F7A8C]/30 hover:bg-[#1F7A8C]/60 text-[#E8A33D] font-bold px-2.5 sm:px-3 py-1.5 rounded-xl text-xs border border-[#E8A33D]/40 transition-all active:scale-95 cursor-pointer"
              title="Ver links separados para Mesas, Cozinha e Administração"
            >
              <QrCode className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Separar Painéis</span>
            </button>

            {/* Quick Demo Tour */}
            <button
              onClick={onOpenDemoTour}
              className="flex items-center gap-1 bg-gradient-to-r from-[#E8A33D] to-[#F3B353] hover:brightness-110 text-[#0B2B3A] font-bold px-2.5 sm:px-3 py-1.5 rounded-xl text-xs shadow-md transition-all active:scale-95"
              title="Testar fluxo completo de ponta a ponta"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span className="hidden md:inline">Tour Demo</span>
            </button>

            {/* Restaurant Info Trigger */}
            <button
              onClick={() => setShowInfoModal(true)}
              className="p-1.5 rounded-lg text-[#B9D3D8] hover:text-white hover:bg-[#1E4252] transition-colors"
              title="Informações do restaurante"
              aria-label="Informações do restaurante"
            >
              <Compass className="w-4 h-4" />
            </button>

            {/* Theme Toggle */}
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="p-1.5 rounded-lg text-[#B9D3D8] hover:text-[#E8A33D] hover:bg-[#1E4252] transition-colors"
              title="Alternar modo claro / escuro"
              aria-label="Alternar tema"
            >
              {darkMode ? '☀️' : '🌙'}
            </button>
          </div>
        </div>
      </header>

      {/* Info Modal */}
      {showInfoModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white dark:bg-[#0F2B38] text-[#0B2B3A] dark:text-[#E6F1EF] max-w-md w-full rounded-2xl p-6 shadow-2xl border border-[#C5DAD6] dark:border-[#1E4252] relative">
            <button
              onClick={() => setShowInfoModal(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 dark:hover:text-white text-xl p-1"
              aria-label="Fechar"
            >
              ✕
            </button>

            <div className="text-center mb-5">
              <span className="font-serif text-3xl text-[#E8A33D]">Θάλασσα</span>
              <h2 className="text-xl font-bold font-serif mt-1">{restaurant.name}</h2>
              <p className="text-xs text-[#4F6B75] dark:text-[#93B0B8] mt-1">{restaurant.tagline}</p>
            </div>

            <div className="space-y-3.5 text-sm">
              <div className="flex items-center gap-3 p-2.5 rounded-xl bg-[#EAF3F1] dark:bg-[#081C26]">
                <Clock className="w-5 h-5 text-[#1F7A8C]" />
                <div>
                  <div className="font-semibold">Horário de Atendimento</div>
                  <div className="text-xs text-[#4F6B75] dark:text-[#93B0B8]">
                    Aberto hoje das {restaurant.opensAt} às {restaurant.closesAt}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3 p-2.5 rounded-xl bg-[#EAF3F1] dark:bg-[#081C26]">
                <Star className="w-5 h-5 text-[#E8A33D] fill-[#E8A33D]" />
                <div>
                  <div className="font-semibold">Avaliação dos Clientes</div>
                  <div className="text-xs text-[#4F6B75] dark:text-[#93B0B8]">
                    {restaurant.rating} estrelas ({restaurant.reviewCount} avaliações no Google)
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3 p-2.5 rounded-xl bg-[#EAF3F1] dark:bg-[#081C26]">
                <MapPin className="w-5 h-5 text-[#1F7A8C]" />
                <div className="flex-1">
                  <div className="font-semibold">{restaurant.address}</div>
                  <div className="text-xs text-[#4F6B75] dark:text-[#93B0B8]">
                    {restaurant.neighborhood} · {restaurant.city}
                  </div>
                </div>
                <a
                  href={restaurant.mapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-2.5 py-1 text-xs bg-[#1F7A8C] text-white rounded-lg font-medium hover:bg-[#1F7A8C]/80"
                >
                  Abrir Mapa
                </a>
              </div>

              <div className="flex items-center gap-3 p-2.5 rounded-xl bg-[#EAF3F1] dark:bg-[#081C26]">
                <MessageCircle className="w-5 h-5 text-emerald-500" />
                <div className="flex-1">
                  <div className="font-semibold">WhatsApp da Taberna</div>
                  <div className="text-xs text-[#4F6B75] dark:text-[#93B0B8]">{restaurant.phone}</div>
                </div>
                <a
                  href={`https://wa.me/${restaurant.whatsapp}?text=Olá,%20gostaria%20de%20informações%20sobre%20o%20Thalassa`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-2.5 py-1 text-xs bg-emerald-600 text-white rounded-lg font-medium hover:bg-emerald-700"
                >
                  Conversar
                </a>
              </div>

              <div className="p-2.5 rounded-xl bg-[#EAF3F1] dark:bg-[#081C26]">
                <div className="flex items-center gap-2 font-semibold mb-1.5">
                  <CreditCard className="w-4 h-4 text-[#1F7A8C]" />
                  <span>Formas de Pagamento Aceitas</span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {restaurant.acceptedPaymentMethods.map((pm, idx) => (
                    <span
                      key={idx}
                      className="text-[11px] bg-white dark:bg-[#0F2B38] border border-[#C5DAD6] dark:border-[#1E4252] px-2 py-0.5 rounded-md"
                    >
                      {pm}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <button
              onClick={() => setShowInfoModal(false)}
              className="w-full mt-5 py-2.5 bg-[#0B2B3A] dark:bg-[#1F7A8C] text-white font-semibold rounded-xl hover:opacity-90 transition-opacity"
            >
              Voltar ao Cardápio
            </button>
          </div>
        </div>
      )}
    </>
  );
};
