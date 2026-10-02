import React from 'react';
import { Clock, Users, Heart, Plus, Sparkles, Tag, AlertCircle } from 'lucide-react';
import { Product } from '../types';

interface ProductCardProps {
  product: Product;
  onOpenDetails: (product: Product) => void;
  onQuickAdd: (product: Product) => void;
  isFavorite: boolean;
  onToggleFavorite: (productId: string) => void;
  cartQuantity: number;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onOpenDetails,
  onQuickAdd,
  isFavorite,
  onToggleFavorite,
  cartQuantity
}) => {
  const currentPrice = product.promoPrice || product.price;
  const hasOptions = (product.optionGroups && product.optionGroups.length > 0);

  return (
    <article
      className={`group relative bg-white dark:bg-[#0F2B38] border rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-lg flex flex-col justify-between ${
        product.active
          ? 'border-[#C5DAD6] dark:border-[#1E4252] hover:border-[#1F7A8C]'
          : 'border-gray-200 dark:border-gray-800 opacity-70 bg-gray-50 dark:bg-gray-900/50'
      }`}
    >
      <div>
        {/* Photo Container */}
        <div className="relative aspect-4/3 overflow-hidden bg-gray-100 dark:bg-gray-800">
          <img
            src={product.imageUrl}
            alt={product.name}
            className={`w-full h-full object-cover transition-transform duration-500 ${
              product.active ? 'group-hover:scale-105' : 'grayscale'
            }`}
            loading="lazy"
          />

          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none"></div>

          {/* Favorite Button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggleFavorite(product.id);
            }}
            className="absolute top-2.5 right-2.5 w-8 h-8 rounded-full bg-white/90 dark:bg-black/60 backdrop-blur-xs flex items-center justify-center text-rose-500 shadow-md transition-transform active:scale-90 hover:scale-110"
            title={isFavorite ? 'Remover dos favoritos' : 'Favoritar este prato'}
            aria-label={isFavorite ? 'Remover favorito' : 'Adicionar aos favoritos'}
          >
            <Heart
              className={`w-4 h-4 ${isFavorite ? 'fill-rose-500 text-rose-500' : 'text-gray-600 dark:text-gray-300'}`}
            />
          </button>

          {/* Top Badges */}
          <div className="absolute top-2.5 left-2.5 flex flex-wrap gap-1 max-w-[80%]">
            {product.promoPrice && (
              <span className="bg-[#E8A33D] text-[#0B2B3A] text-[11px] font-bold px-2 py-0.5 rounded-md shadow-xs flex items-center gap-1">
                <Tag className="w-3 h-3" />
                <span>OFERTA</span>
              </span>
            )}
            {product.tags.includes('Mais pedido') && (
              <span className="bg-[#0B2B3A] text-[#E8A33D] text-[10px] font-bold px-2 py-0.5 rounded-md shadow-xs border border-[#E8A33D]/40">
                Mais Pedido
              </span>
            )}
            {product.tags.includes('Novo') && (
              <span className="bg-emerald-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-md shadow-xs flex items-center gap-0.5">
                <Sparkles className="w-2.5 h-2.5" />
                <span>Novo</span>
              </span>
            )}
          </div>

          {/* Preparation & Serves Info Badges */}
          <div className="absolute bottom-2 left-2.5 right-2.5 flex items-center justify-between text-[11px] text-white font-medium">
            <span className="flex items-center gap-1 bg-black/60 backdrop-blur-xs px-2 py-0.5 rounded-md">
              <Clock className="w-3 h-3 text-[#E8A33D]" />
              <span>{product.preparationTimeMin} min</span>
            </span>

            {product.servesCount && product.servesCount > 1 && (
              <span className="flex items-center gap-1 bg-black/60 backdrop-blur-xs px-2 py-0.5 rounded-md text-[#E8A33D]">
                <Users className="w-3 h-3" />
                <span>Serve {product.servesCount}</span>
              </span>
            )}
          </div>
        </div>

        {/* Content Info */}
        <div className="p-4 space-y-2 cursor-pointer" onClick={() => onOpenDetails(product)}>
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-serif text-lg font-bold text-[#0B2B3A] dark:text-[#E6F1EF] group-hover:text-[#1F7A8C] dark:group-hover:text-[#5CC0D3] transition-colors leading-snug">
              {product.name}
            </h3>
          </div>

          <p className="text-xs text-[#4F6B75] dark:text-[#93B0B8] line-clamp-2 leading-relaxed">
            {product.description}
          </p>

          {/* Dietary & Allergy Tags */}
          <div className="flex flex-wrap gap-1 pt-1">
            {product.tags.filter(t => t !== 'Mais pedido' && t !== 'Novo' && t !== 'Promoção').map((t, idx) => (
              <span
                key={idx}
                className="text-[10px] bg-[#EAF3F1] dark:bg-[#081C26] text-[#1F7A8C] dark:text-[#5CC0D3] border border-[#C5DAD6] dark:border-[#1E4252] px-1.5 py-0.5 rounded-full font-medium"
              >
                {t}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Footer Price & Action */}
      <div className="p-4 pt-0 border-t border-transparent flex items-center justify-between gap-2 mt-auto">
        <div>
          <div className="flex items-baseline gap-1.5">
            <span className="font-serif text-lg font-bold text-[#0B2B3A] dark:text-[#E8A33D]">
              R$ {currentPrice.toFixed(2).replace('.', ',')}
            </span>
            {product.promoPrice && (
              <span className="text-xs line-through text-[#4F6B75] dark:text-[#93B0B8]">
                R$ {product.price.toFixed(2).replace('.', ',')}
              </span>
            )}
          </div>
          <span className="text-[10px] text-[#4F6B75] dark:text-[#93B0B8] block">
            {hasOptions ? 'Personalizável' : 'Pronto para pedir'}
          </span>
        </div>

        {/* Add or Customize Button */}
        <div>
          {!product.active ? (
            <span className="inline-flex items-center gap-1 text-[11px] text-rose-600 dark:text-rose-400 font-semibold bg-rose-100 dark:bg-rose-950/60 px-2.5 py-1.5 rounded-xl border border-rose-200 dark:border-rose-900">
              <AlertCircle className="w-3.5 h-3.5" />
              <span>Indisponível</span>
            </span>
          ) : hasOptions ? (
            <button
              onClick={() => onOpenDetails(product)}
              className="relative px-3.5 py-1.5 bg-[#1F7A8C] hover:bg-[#155A68] text-white text-xs font-semibold rounded-xl transition-all shadow-xs active:scale-95 flex items-center gap-1"
            >
              <span>Personalizar</span>
              {cartQuantity > 0 && (
                <span className="w-4 h-4 rounded-full bg-[#E8A33D] text-[#0B2B3A] text-[10px] font-bold flex items-center justify-center">
                  {cartQuantity}
                </span>
              )}
            </button>
          ) : (
            <button
              onClick={() => onQuickAdd(product)}
              className="relative px-3.5 py-1.5 bg-[#E8A33D] hover:bg-[#F3B353] text-[#0B2B3A] text-xs font-bold rounded-xl transition-all shadow-xs active:scale-95 flex items-center gap-1"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Adicionar</span>
              {cartQuantity > 0 && (
                <span className="w-4 h-4 rounded-full bg-[#0B2B3A] text-white text-[10px] font-bold flex items-center justify-center">
                  {cartQuantity}
                </span>
              )}
            </button>
          )}
        </div>
      </div>
    </article>
  );
};
