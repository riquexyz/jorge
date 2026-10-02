import React from 'react';
import {
  Clock,
  Star,
  MapPin,
  MessageCircle,
  ArrowRight,
  Flame,
  Award
} from 'lucide-react';
import { Product, RestaurantInfo } from '../types';

interface HeroProps {
  restaurant: RestaurantInfo;
  featuredProducts: Product[];
  onSelectProduct: (product: Product) => void;
  onScrollToMenu: () => void;
  tableNumber: string;
}

export const Hero: React.FC<HeroProps> = ({
  restaurant,
  featuredProducts,
  onSelectProduct,
  onScrollToMenu,
  tableNumber
}) => {
  return (
    <div className="relative bg-[#0B2B3A] text-[#EAF3F1] overflow-hidden pt-7 sm:pt-10 transition-colors">
      
      {/* Background Decorative Sea Glow */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-[#1F7A8C]/20 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20"></div>
      <div className="absolute bottom-10 left-0 w-80 h-80 bg-[#E8A33D]/10 rounded-full blur-3xl pointer-events-none -ml-20"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
        
        {/* Main Hero Header */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* Left Text Block */}
          <div className="lg:col-span-7 space-y-4 text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#1F7A8C]/30 border border-[#1F7A8C]/60 text-xs font-semibold text-[#B9D3D8]">
              <span className="w-2 h-2 rounded-full bg-[#E8A33D] animate-ping"></span>
              <span>Pesca do Dia & Alta Gastronomia Litorânea</span>
            </div>

            <div>
              <p className="font-serif text-5xl sm:text-7xl font-normal tracking-wide text-[#E8A33D] leading-none mb-1 select-none">
                {restaurant.greekName}
              </p>
              <h1 className="font-serif text-3xl sm:text-5xl font-normal text-white tracking-tight leading-tight">
                {restaurant.name}
              </h1>
            </div>

            <p className="text-sm sm:text-base text-[#B9D3D8] max-w-2xl leading-relaxed">
              {restaurant.tagline} Sabores autênticos do mar preparados na brasa de lenha e em tradicionais panelas de barro capixabas.
            </p>

            {/* Quick Metrics Bar */}
            <div className="flex flex-wrap items-center gap-3 sm:gap-6 pt-2 text-xs sm:text-sm text-[#E6F1EF]">
              <div className="flex items-center gap-1.5 bg-[#04121A]/70 px-3 py-1.5 rounded-lg border border-[#1E4252]">
                <Clock className="w-4 h-4 text-[#E8A33D]" />
                <span>Preparo médio: <strong>{restaurant.avgPrepTime}</strong></span>
              </div>

              <div className="flex items-center gap-1.5 bg-[#04121A]/70 px-3 py-1.5 rounded-lg border border-[#1E4252]">
                <Star className="w-4 h-4 text-[#E8A33D] fill-[#E8A33D]" />
                <span><strong>{restaurant.rating}</strong> ({restaurant.reviewCount} avaliações)</span>
              </div>

              <div className="flex items-center gap-1.5 bg-[#04121A]/70 px-3 py-1.5 rounded-lg border border-[#1E4252]">
                <MapPin className="w-4 h-4 text-[#1F7A8C]" />
                <span>{restaurant.address} · Peruíbe</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-3 pt-3">
              <button
                onClick={onScrollToMenu}
                className="flex items-center justify-center gap-2 bg-[#E8A33D] hover:bg-[#F3B353] text-[#0B2B3A] font-bold px-6 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all active:scale-95 text-sm sm:text-base cursor-pointer"
              >
                <span>Fazer Pedido {tableNumber ? `(Mesa ${tableNumber})` : ''}</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={onScrollToMenu}
                className="flex items-center justify-center gap-2 bg-[#1F7A8C]/30 hover:bg-[#1F7A8C]/50 text-white font-semibold px-5 py-3 rounded-xl border border-[#1F7A8C] transition-all text-sm sm:text-base"
              >
                Ver Cardápio Completo
              </button>

              <a
                href={`https://wa.me/${restaurant.whatsapp}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 bg-emerald-600/30 hover:bg-emerald-600/50 text-emerald-300 font-semibold px-4 py-3 rounded-xl border border-emerald-500/50 transition-all text-sm"
                title="Falar no WhatsApp"
              >
                <MessageCircle className="w-4 h-4" />
                <span className="hidden sm:inline">WhatsApp</span>
              </a>
            </div>
          </div>

          {/* Right Visual Image Card with Badge */}
          <div className="lg:col-span-5 relative">
            <div className="relative rounded-2xl overflow-hidden shadow-2xl border-2 border-[#1E4252] group">
              <img
                src="https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=1000&q=80"
                alt="Gastronomia Litorânea Thalassa"
                className="w-full h-64 sm:h-80 object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0B2B3A] via-transparent to-black/20"></div>

              {/* Floating Chef Recommendation Badge */}
              <div className="absolute bottom-4 left-4 right-4 bg-[#04121A]/90 backdrop-blur-md p-3.5 rounded-xl border border-[#1E4252] flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-[#E8A33D] text-[#0B2B3A] flex items-center justify-center font-bold">
                    <Award className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-xs text-[#E8A33D] font-bold uppercase tracking-wider">Sugestão do Chef</div>
                    <div className="text-sm font-serif font-bold text-white">Moqueca Mista de Robalo & Camarão</div>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-xs line-through text-[#93B0B8]">R$ 168</span>
                  <div className="text-sm font-bold text-[#E8A33D]">R$ 154,00</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Destaques de Hoje Carousel/Grid */}
        <div className="mt-10 pt-6 border-t border-[#1E4252]/60">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Flame className="w-5 h-5 text-[#E8A33D]" />
              <h2 className="text-lg font-serif font-semibold text-white tracking-wide">
                Destaques de Hoje da Taberna
              </h2>
            </div>
            <button
              onClick={onScrollToMenu}
              className="text-xs text-[#E8A33D] hover:underline font-semibold flex items-center gap-1"
            >
              Ver todas as categorias →
            </button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {featuredProducts.slice(0, 4).map(product => (
              <div
                key={product.id}
                onClick={() => onSelectProduct(product)}
                className="bg-[#04121A]/80 hover:bg-[#103040] border border-[#1E4252] hover:border-[#E8A33D]/60 rounded-xl p-2.5 transition-all cursor-pointer group flex flex-col justify-between"
              >
                <div className="relative rounded-lg overflow-hidden h-24 mb-2">
                  <img
                    src={product.imageUrl}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                    loading="lazy"
                  />
                  {product.promoPrice && (
                    <span className="absolute top-1 left-1 bg-[#E8A33D] text-[#0B2B3A] text-[10px] font-bold px-1.5 py-0.5 rounded shadow">
                      OFERTA
                    </span>
                  )}
                </div>

                <div>
                  <h3 className="text-xs font-serif font-semibold text-white line-clamp-1 group-hover:text-[#E8A33D] transition-colors">
                    {product.name}
                  </h3>
                  <div className="mt-1 flex items-baseline gap-1.5">
                    <span className="text-xs font-bold text-[#E8A33D]">
                      R$ {(product.promoPrice || product.price).toFixed(2).replace('.', ',')}
                    </span>
                    {product.promoPrice && (
                      <span className="text-[10px] line-through text-[#93B0B8]">
                        R$ {product.price.toFixed(2).replace('.', ',')}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Coastal Ocean Waves SVG Transition */}
      <div className="w-full overflow-hidden leading-none mt-6 sm:mt-8">
        <svg
          className="w-full h-10 sm:h-14 text-[#EAF3F1] dark:text-[#081C26] fill-current"
          viewBox="0 0 1200 60"
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          <path
            className="animate-drift opacity-25"
            d="M0 30 Q60 5 120 30 T240 30 T360 30 T480 30 T600 30 T720 30 T840 30 T960 30 T1080 30 T1200 30 T1320 30 V60 H0Z"
          />
          <path
            d="M0 40 Q75 20 150 40 T300 40 T450 40 T600 40 T750 40 T900 40 T1050 40 T1200 40 V60 H0Z"
          />
        </svg>
      </div>
    </div>
  );
};
