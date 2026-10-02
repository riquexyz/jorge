import React from 'react';
import { Search, SlidersHorizontal, Sparkles, Flame, Tag, Leaf, WheatOff } from 'lucide-react';
import { Category } from '../types';

interface MenuNavProps {
  categories: Category[];
  activeCategoryId: string;
  onSelectCategory: (id: string) => void;
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  activeFilter: string;
  setActiveFilter: (filter: string) => void;
  sortBy: string;
  setSortBy: (sort: string) => void;
  productCountByCat: Record<string, number>;
}

export const MenuNav: React.FC<MenuNavProps> = ({
  categories,
  activeCategoryId,
  onSelectCategory,
  searchTerm,
  setSearchTerm,
  activeFilter,
  setActiveFilter,
  sortBy,
  setSortBy,
  productCountByCat
}) => {
  const filters = [
    { id: 'all', label: 'Todos', icon: null },
    { id: 'top', label: 'Mais Pedidos', icon: Flame },
    { id: 'promo', label: 'Promoções', icon: Tag },
    { id: 'veg', label: 'Vegetariano', icon: Leaf },
    { id: 'gluten_free', label: 'Sem Glúten', icon: WheatOff },
    { id: 'new', label: 'Novidades', icon: Sparkles }
  ];

  return (
    <div className="sticky top-[58px] z-30 bg-[#EAF3F1]/95 dark:bg-[#081C26]/95 backdrop-blur-md border-b border-[#C5DAD6] dark:border-[#1E4252] shadow-xs transition-colors">
      <div className="max-w-7xl mx-auto px-4 py-3 space-y-2.5">
        
        {/* Search & Sort Row */}
        <div className="flex items-center gap-2">
          {/* Instant Search Bar */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#4F6B75] dark:text-[#93B0B8]" />
            <input
              type="search"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              placeholder="Buscar no cardápio (ex.: Moqueca, Robalo, Casquinha, Burger...)"
              className="w-full pl-9 pr-4 py-2 rounded-xl text-sm bg-white dark:bg-[#0F2B38] border border-[#C5DAD6] dark:border-[#1E4252] text-[#0B2B3A] dark:text-[#E6F1EF] placeholder-[#4F6B75]/70 dark:placeholder-[#93B0B8]/60 focus:outline-none focus:ring-2 focus:ring-[#1F7A8C] transition-all"
              aria-label="Buscar produtos no cardápio"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700 text-xs bg-gray-200 dark:bg-gray-700 w-5 h-5 rounded-full flex items-center justify-center"
              >
                ✕
              </button>
            )}
          </div>

          {/* Sort Selector */}
          <div className="relative">
            <div className="flex items-center gap-1.5 bg-white dark:bg-[#0F2B38] border border-[#C5DAD6] dark:border-[#1E4252] px-2.5 py-2 rounded-xl text-xs font-semibold text-[#0B2B3A] dark:text-[#E6F1EF]">
              <SlidersHorizontal className="w-3.5 h-3.5 text-[#1F7A8C]" />
              <select
                value={sortBy}
                onChange={e => setSortBy(e.target.value)}
                className="bg-transparent focus:outline-none cursor-pointer pr-1"
                aria-label="Ordenar produtos"
              >
                <option value="featured">Relevância</option>
                <option value="price_asc">Menor Preço</option>
                <option value="price_desc">Maior Preço</option>
                <option value="name_asc">Nome A-Z</option>
              </select>
            </div>
          </div>
        </div>

        {/* Filter Chips */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none text-xs">
          {filters.map(f => {
            const Icon = f.icon;
            const isSelected = activeFilter === f.id;
            return (
              <button
                key={f.id}
                onClick={() => setActiveFilter(f.id)}
                className={`whitespace-nowrap px-3 py-1 rounded-full font-medium flex items-center gap-1.5 transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-[#1F7A8C] text-white shadow-xs'
                    : 'bg-white dark:bg-[#0F2B38] text-[#4F6B75] dark:text-[#93B0B8] border border-[#C5DAD6] dark:border-[#1E4252] hover:border-[#1F7A8C]'
                }`}
              >
                {Icon && <Icon className={`w-3 h-3 ${isSelected ? 'text-[#E8A33D]' : 'text-[#1F7A8C]'}`} />}
                <span>{f.label}</span>
              </button>
            );
          })}
        </div>

        {/* Categories Tab Strip */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          <button
            onClick={() => onSelectCategory('all')}
            className={`whitespace-nowrap px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
              activeCategoryId === 'all'
                ? 'bg-[#0B2B3A] dark:bg-[#E8A33D] text-[#EAF3F1] dark:text-[#0B2B3A] shadow-xs'
                : 'bg-white/80 dark:bg-[#0F2B38] text-[#0B2B3A] dark:text-[#E6F1EF] border border-[#C5DAD6] dark:border-[#1E4252] hover:bg-white'
            }`}
          >
            Todas as Seções
          </button>

          {categories.filter(c => c.active).map(cat => {
            const count = productCountByCat[cat.id] || 0;
            const isSelected = activeCategoryId === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => onSelectCategory(cat.id)}
                className={`whitespace-nowrap px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
                  isSelected
                    ? 'bg-[#0B2B3A] dark:bg-[#E8A33D] text-[#EAF3F1] dark:text-[#0B2B3A] shadow-xs'
                    : 'bg-white/80 dark:bg-[#0F2B38] text-[#0B2B3A] dark:text-[#E6F1EF] border border-[#C5DAD6] dark:border-[#1E4252] hover:bg-white'
                }`}
              >
                <span>{cat.name}</span>
                {count > 0 && (
                  <span
                    className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                      isSelected
                        ? 'bg-white/20 dark:bg-black/20'
                        : 'bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400'
                    }`}
                  >
                    {count}
                  </span>
                )}
              </button>
            );
          })}
        </div>

      </div>
    </div>
  );
};
