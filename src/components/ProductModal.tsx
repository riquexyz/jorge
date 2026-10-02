import React, { useState, useMemo } from 'react';
import { Clock, Users, AlertTriangle, Check, Plus, Minus, X } from 'lucide-react';
import { Product, SelectedOption, ProductOption } from '../types';

interface ProductModalProps {
  product: Product | null;
  onClose: () => void;
  onAddToCart: (
    product: Product,
    quantity: number,
    selectedOptions: SelectedOption[],
    removedIngredients: string[],
    notes: string,
    calculatedTotal: number
  ) => void;
}

export const ProductModal: React.FC<ProductModalProps> = ({
  product,
  onClose,
  onAddToCart
}) => {
  if (!product) return null;

  const basePrice = product.promoPrice || product.price;

  // State for single options: group id -> option
  const [selectedSingles, setSelectedSingles] = useState<Record<string, ProductOption>>(() => {
    const initial: Record<string, ProductOption> = {};
    if (product.optionGroups) {
      product.optionGroups.forEach(g => {
        if (g.type === 'single' && g.options.length > 0) {
          initial[g.id] = g.options[0];
        }
      });
    }
    return initial;
  });

  // State for multiple options: group id -> set of option ids
  const [selectedMultiples, setSelectedMultiples] = useState<Record<string, ProductOption[]>>({});

  // State for removed ingredients
  const [removedIngredients, setRemovedIngredients] = useState<string[]>([]);

  // Notes
  const [notes, setNotes] = useState('');

  // Quantity
  const [quantity, setQuantity] = useState(1);

  // Compute unit price with options
  const unitPrice = useMemo(() => {
    let sum = basePrice;

    // Add single options price
    Object.values(selectedSingles).forEach(opt => {
      sum += opt.price || 0;
    });

    // Add multiple options price
    Object.values(selectedMultiples).forEach(opts => {
      opts.forEach(opt => {
        sum += opt.price || 0;
      });
    });

    return Math.max(0, sum);
  }, [basePrice, selectedSingles, selectedMultiples]);

  const itemTotal = unitPrice * quantity;

  // Toggle single option
  const handleSelectSingle = (groupId: string, option: ProductOption) => {
    setSelectedSingles(prev => ({
      ...prev,
      [groupId]: option
    }));
  };

  // Toggle multiple option
  const handleToggleMultiple = (groupId: string, option: ProductOption, max?: number) => {
    setSelectedMultiples(prev => {
      const currentList = prev[groupId] || [];
      const exists = currentList.some(o => o.id === option.id);
      if (exists) {
        return {
          ...prev,
          [groupId]: currentList.filter(o => o.id !== option.id)
        };
      } else {
        if (max && currentList.length >= max) {
          return prev; // Reached max
        }
        return {
          ...prev,
          [groupId]: [...currentList, option]
        };
      }
    });
  };

  // Toggle removed ingredient
  const handleToggleIngredient = (ing: string) => {
    setRemovedIngredients(prev =>
      prev.includes(ing) ? prev.filter(i => i !== ing) : [...prev, ing]
    );
  };

  const handleConfirm = () => {
    const formattedOptions: SelectedOption[] = [];

    if (product.optionGroups) {
      product.optionGroups.forEach(g => {
        if (g.type === 'single') {
          const opt = selectedSingles[g.id];
          if (opt) {
            formattedOptions.push({
              groupName: g.name,
              optionName: opt.name,
              price: opt.price
            });
          }
        } else {
          const opts = selectedMultiples[g.id] || [];
          opts.forEach(opt => {
            formattedOptions.push({
              groupName: g.name,
              optionName: opt.name,
              price: opt.price
            });
          });
        }
      });
    }

    onAddToCart(
      product,
      quantity,
      formattedOptions,
      removedIngredients,
      notes.trim(),
      itemTotal
    );
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto animate-in fade-in duration-200">
      <div
        className="bg-white dark:bg-[#0F2B38] text-[#0B2B3A] dark:text-[#E6F1EF] w-full max-w-xl rounded-2xl sm:rounded-3xl overflow-hidden shadow-2xl border border-[#C5DAD6] dark:border-[#1E4252] flex flex-col max-h-[92vh] my-auto"
        onClick={e => e.stopPropagation()}
      >
        {/* Header Image with close button */}
        <div className="relative h-56 sm:h-64 shrink-0 bg-gray-100 dark:bg-gray-800">
          <img
            src={product.imageUrl}
            alt={product.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0F2B38] via-transparent to-black/30"></div>

          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-9 h-9 rounded-full bg-black/60 text-white flex items-center justify-center hover:bg-black/90 transition-all z-10"
            aria-label="Fechar"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Floating Badges */}
          <div className="absolute bottom-4 left-4 right-4 text-white">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs bg-[#E8A33D] text-[#0B2B3A] font-bold px-2.5 py-0.5 rounded-full">
                {product.categoryId.toUpperCase()}
              </span>
              <span className="text-xs bg-black/50 backdrop-blur-xs px-2 py-0.5 rounded-full flex items-center gap-1">
                <Clock className="w-3 h-3 text-[#E8A33D]" />
                <span>{product.preparationTimeMin} min de preparo</span>
              </span>
              {product.servesCount && product.servesCount > 1 && (
                <span className="text-xs bg-black/50 backdrop-blur-xs px-2 py-0.5 rounded-full flex items-center gap-1 text-[#E8A33D]">
                  <Users className="w-3 h-3" />
                  <span>Serve {product.servesCount}</span>
                </span>
              )}
            </div>

            <h2 className="font-serif text-2xl sm:text-3xl font-bold leading-tight">
              {product.name}
            </h2>
          </div>
        </div>

        {/* Scrollable Content Body */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-5 text-sm">
          {/* Description */}
          <div>
            <p className="text-[#4F6B75] dark:text-[#93B0B8] leading-relaxed text-sm sm:text-base">
              {product.description}
            </p>
          </div>

          {/* Allergens Alert */}
          {product.allergens && product.allergens.length > 0 && (
            <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 text-amber-800 dark:text-amber-300 text-xs flex items-start gap-2.5">
              <AlertTriangle className="w-4 h-4 shrink-0 text-amber-500 mt-0.5" />
              <div>
                <strong>Alerta para Alérgicos:</strong> Contém {product.allergens.join(', ')}.
              </div>
            </div>
          )}

          {/* Option Groups (Single & Multiple) */}
          {product.optionGroups && product.optionGroups.map(group => {
            const isSingle = group.type === 'single';
            const selectedList = selectedMultiples[group.id] || [];

            return (
              <div key={group.id} className="space-y-2 border-t border-[#C5DAD6] dark:border-[#1E4252] pt-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-bold text-sm font-serif text-[#0B2B3A] dark:text-[#E6F1EF]">
                      {group.name}
                    </h3>
                    {group.description && (
                      <p className="text-xs text-[#4F6B75] dark:text-[#93B0B8]">{group.description}</p>
                    )}
                  </div>
                  <span className="text-[11px] px-2 py-0.5 rounded-full bg-[#1F7A8C]/15 text-[#1F7A8C] dark:text-[#5CC0D3] font-medium">
                    {group.required ? 'Obrigatório' : `Opcional (até ${group.max || 1})`}
                  </span>
                </div>

                <div className="space-y-1.5">
                  {group.options.map(option => {
                    const isChecked = isSingle
                      ? selectedSingles[group.id]?.id === option.id
                      : selectedList.some(o => o.id === option.id);

                    return (
                      <label
                        key={option.id}
                        onClick={() => {
                          if (isSingle) {
                            handleSelectSingle(group.id, option);
                          } else {
                            handleToggleMultiple(group.id, option, group.max);
                          }
                        }}
                        className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer transition-all ${
                          isChecked
                            ? 'border-[#1F7A8C] bg-[#1F7A8C]/10 text-[#0B2B3A] dark:text-white font-semibold'
                            : 'border-[#C5DAD6] dark:border-[#1E4252] hover:border-[#1F7A8C]/50'
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          <div
                            className={`w-5 h-5 rounded-${isSingle ? 'full' : 'md'} border flex items-center justify-center transition-colors ${
                              isChecked
                                ? 'bg-[#1F7A8C] border-[#1F7A8C] text-white'
                                : 'border-[#C5DAD6] dark:border-[#1E4252]'
                            }`}
                          >
                            {isChecked && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                          </div>
                          <span>{option.name}</span>
                        </div>

                        {option.price > 0 ? (
                          <span className="text-xs font-bold text-[#E8A33D]">
                            + R$ {option.price.toFixed(2).replace('.', ',')}
                          </span>
                        ) : (
                          <span className="text-xs text-[#4F6B75] dark:text-[#93B0B8]">
                            Incluso
                          </span>
                        )}
                      </label>
                    );
                  })}
                </div>
              </div>
            );
          })}

          {/* Remove Ingredients Option */}
          {product.ingredients && product.ingredients.length > 0 && (
            <div className="border-t border-[#C5DAD6] dark:border-[#1E4252] pt-4 space-y-2">
              <h3 className="font-bold text-sm font-serif text-[#0B2B3A] dark:text-[#E6F1EF]">
                Deseja remover algum ingrediente?
              </h3>
              <p className="text-xs text-[#4F6B75] dark:text-[#93B0B8]">
                Selecione os ingredientes que prefere não incluir no seu prato:
              </p>
              <div className="flex flex-wrap gap-2 pt-1">
                {product.ingredients.map((ing, idx) => {
                  const isRemoved = removedIngredients.includes(ing);
                  return (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => handleToggleIngredient(ing)}
                      className={`text-xs px-3 py-1.5 rounded-full border transition-all cursor-pointer ${
                        isRemoved
                          ? 'bg-rose-500 text-white border-rose-600 line-through font-semibold'
                          : 'bg-white dark:bg-[#081C26] text-[#0B2B3A] dark:text-[#E6F1EF] border-[#C5DAD6] dark:border-[#1E4252] hover:border-rose-400'
                      }`}
                    >
                      {isRemoved ? `Sem ${ing}` : ing}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Special Notes */}
          <div className="border-t border-[#C5DAD6] dark:border-[#1E4252] pt-4 space-y-1.5">
            <label htmlFor="modal-notes" className="font-bold text-sm font-serif text-[#0B2B3A] dark:text-[#E6F1EF]">
              Observações Especiais
            </label>
            <textarea
              id="modal-notes"
              rows={2}
              value={notes}
              onChange={e => setNotes(e.target.value)}
              placeholder="Ex.: Pouco sal, molho à parte, cortar ao meio, etc."
              className="w-full p-3 rounded-xl text-xs sm:text-sm bg-white dark:bg-[#081C26] border border-[#C5DAD6] dark:border-[#1E4252] focus:outline-none focus:ring-2 focus:ring-[#1F7A8C]"
              maxLength={250}
            />
          </div>
        </div>

        {/* Modal Footer with Quantity & CTA */}
        <div className="p-4 sm:p-5 bg-[#EAF3F1]/80 dark:bg-[#081C26] border-t border-[#C5DAD6] dark:border-[#1E4252] flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0">
          
          {/* Quantity Controls */}
          <div className="flex items-center gap-3 bg-white dark:bg-[#0F2B38] border border-[#C5DAD6] dark:border-[#1E4252] px-3 py-1.5 rounded-xl shadow-xs">
            <button
              onClick={() => setQuantity(q => Math.max(1, q - 1))}
              disabled={quantity <= 1}
              className="w-8 h-8 rounded-lg bg-gray-100 dark:bg-gray-800 disabled:opacity-40 flex items-center justify-center font-bold text-[#0B2B3A] dark:text-white"
              aria-label="Diminuir quantidade"
            >
              <Minus className="w-4 h-4" />
            </button>
            <span className="font-bold text-base w-6 text-center">{quantity}</span>
            <button
              onClick={() => setQuantity(q => q + 1)}
              className="w-8 h-8 rounded-lg bg-[#1F7A8C] text-white flex items-center justify-center font-bold hover:bg-[#155A68]"
              aria-label="Aumentar quantidade"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>

          {/* Add Button */}
          <button
            onClick={handleConfirm}
            className="w-full sm:w-auto flex-1 py-3 px-6 bg-[#E8A33D] hover:bg-[#F3B353] text-[#0B2B3A] font-bold rounded-xl shadow-lg flex items-center justify-between gap-4 transition-all active:scale-95 cursor-pointer text-sm sm:text-base"
          >
            <span>Adicionar ao Pedido</span>
            <span className="font-serif text-lg font-bold">
              R$ {itemTotal.toFixed(2).replace('.', ',')}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};
