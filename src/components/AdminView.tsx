import React, { useState } from 'react';
import {
  LayoutDashboard,
  UtensilsCrossed,
  Layers,
  QrCode,
  Ticket,
  Star,
  Plus,
  Edit2,
  Trash2,
  Check,
  TrendingUp,
  DollarSign,
  ShoppingBag,
  Users,
  Clock,
  Printer
} from 'lucide-react';
import { Product, Category, TableInfo, Coupon, Review, RestaurantInfo } from '../types';

interface AdminViewProps {
  restaurant: RestaurantInfo;
  products: Product[];
  categories: Category[];
  tables: TableInfo[];
  coupons: Coupon[];
  reviews: Review[];
  stats: {
    totalOrdersToday: number;
    activeOrders: number;
    totalRevenue: number;
    averageTicket: number;
    cancelledOrders: number;
    averagePrepTimeMinutes: number;
    topProducts: { name: string; quantity: number; revenue: number }[];
    totalCustomersServed: number;
  };
  onToggleAvailability: (productId: string) => Promise<void>;
  onCreateProduct: (prod: Partial<Product>) => Promise<void>;
  onUpdateProduct: (id: string, prod: Partial<Product>) => Promise<void>;
  onDeleteProduct: (id: string) => Promise<void>;
  onCreateCategory: (cat: Partial<Category>) => Promise<void>;
  onDeleteCategory: (id: string) => Promise<void>;
  onUpdateRestaurant?: (info: Partial<RestaurantInfo>) => Promise<void>;
}

export const AdminView: React.FC<AdminViewProps> = ({
  restaurant,
  products,
  categories,
  tables,
  coupons,
  reviews,
  stats,
  onToggleAvailability,
  onCreateProduct,
  onUpdateProduct,
  onDeleteProduct,
  onCreateCategory,
  onDeleteCategory,
  onUpdateRestaurant
}) => {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'products' | 'categories' | 'tables' | 'coupons' | 'reviews' | 'settings'>('dashboard');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCatFilter, setSelectedCatFilter] = useState('all');

  // Restaurant Settings Form State
  const [restForm, setRestForm] = useState<Partial<RestaurantInfo>>({ ...restaurant });
  const [restSaved, setRestSaved] = useState(false);
  const [isPrintingAllTables, setIsPrintingAllTables] = useState(false);

  // Product Create/Edit Modal State
  const [isEditingProduct, setIsEditingProduct] = useState(false);
  const [productForm, setProductForm] = useState<Partial<Product>>({
    name: '',
    description: '',
    categoryId: categories[0]?.id || 'entradas',
    price: 35.0,
    promoPrice: undefined,
    imageUrl: 'https://images.unsplash.com/photo-1559847844-5315695dadae?auto=format&fit=crop&w=800&q=80',
    preparationTimeMin: 20,
    tags: ['Novo'],
    ingredients: [],
    allergens: []
  });

  // Category Create Modal State
  const [isAddingCat, setIsAddingCat] = useState(false);
  const [newCatName, setNewCatName] = useState('');
  const [newCatDesc, setNewCatDesc] = useState('');

  // Selected table QR display
  const [previewQrTable, setPreviewQrTable] = useState<TableInfo | null>(null);

  // Filtered Products
  const filteredProducts = products.filter(p => {
    if (selectedCatFilter !== 'all' && p.categoryId !== selectedCatFilter) return false;
    if (searchTerm && !p.name.toLowerCase().includes(searchTerm.toLowerCase())) return false;
    return true;
  });

  const handleOpenNewProduct = () => {
    setProductForm({
      name: '',
      description: '',
      categoryId: categories[0]?.id || 'entradas',
      price: 45.0,
      promoPrice: undefined,
      imageUrl: 'https://images.unsplash.com/photo-1559847844-5315695dadae?auto=format&fit=crop&w=800&q=80',
      preparationTimeMin: 20,
      tags: ['Novo'],
      ingredients: ['Ingrediente fresco'],
      allergens: []
    });
    setIsEditingProduct(true);
  };

  const handleEditProduct = (prod: Product) => {
    setProductForm({ ...prod });
    setIsEditingProduct(true);
  };

  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (productForm.id) {
      await onUpdateProduct(productForm.id, productForm);
    } else {
      await onCreateProduct(productForm);
    }
    setIsEditingProduct(false);
  };

  const handleSaveCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCatName.trim()) return;
    await onCreateCategory({
      name: newCatName.trim(),
      description: newCatDesc.trim()
    });
    setNewCatName('');
    setNewCatDesc('');
    setIsAddingCat(false);
  };

  return (
    <div className="min-h-screen bg-[#EAF3F1] dark:bg-[#081C26] text-[#0B2B3A] dark:text-[#E6F1EF] pb-16 transition-colors">
      
      {/* Sub Header Navigation for Admin */}
      <div className="bg-[#0B2B3A] text-white border-b border-[#1E4252] shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-3 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <LayoutDashboard className="w-5 h-5 text-[#E8A33D]" />
            <h1 className="font-serif text-lg font-bold tracking-wide">
              Painel de Gestão · Thalassa
            </h1>
          </div>

          {/* Admin Navigation Tabs */}
          <div className="flex items-center gap-1 overflow-x-auto text-xs font-semibold scrollbar-none">
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-all ${
                activeTab === 'dashboard' ? 'bg-[#1F7A8C] text-white' : 'text-[#B9D3D8] hover:text-white'
              }`}
            >
              <TrendingUp className="w-3.5 h-3.5" />
              <span>Dashboard</span>
            </button>

            <button
              onClick={() => setActiveTab('products')}
              className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-all ${
                activeTab === 'products' ? 'bg-[#1F7A8C] text-white' : 'text-[#B9D3D8] hover:text-white'
              }`}
            >
              <UtensilsCrossed className="w-3.5 h-3.5" />
              <span>Cardápio ({products.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('categories')}
              className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-all ${
                activeTab === 'categories' ? 'bg-[#1F7A8C] text-white' : 'text-[#B9D3D8] hover:text-white'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Categorias</span>
            </button>

            <button
              onClick={() => setActiveTab('tables')}
              className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-all ${
                activeTab === 'tables' ? 'bg-[#1F7A8C] text-white' : 'text-[#B9D3D8] hover:text-white'
              }`}
            >
              <QrCode className="w-3.5 h-3.5" />
              <span>Mesas & QR Code</span>
            </button>

            <button
              onClick={() => setActiveTab('coupons')}
              className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-all ${
                activeTab === 'coupons' ? 'bg-[#1F7A8C] text-white' : 'text-[#B9D3D8] hover:text-white'
              }`}
            >
              <Ticket className="w-3.5 h-3.5" />
              <span>Cupons ({coupons.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('reviews')}
              className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-all ${
                activeTab === 'reviews' ? 'bg-[#1F7A8C] text-white' : 'text-[#B9D3D8] hover:text-white'
              }`}
            >
              <Star className="w-3.5 h-3.5" />
              <span>Avaliações ({reviews.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('settings')}
              className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-all ${
                activeTab === 'settings' ? 'bg-[#E8A33D] text-[#0B2B3A] font-bold' : 'text-[#B9D3D8] hover:text-white'
              }`}
            >
              <span>⚙️ Configurações & Implantação</span>
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6">
        
        {/* TAB 1: DASHBOARD */}
        {activeTab === 'dashboard' && (
          <div className="space-y-6">
            
            {/* KPI Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-white dark:bg-[#0F2B38] p-4 rounded-2xl border border-[#C5DAD6] dark:border-[#1E4252] shadow-xs">
                <div className="flex items-center justify-between text-xs text-[#4F6B75] dark:text-[#93B0B8]">
                  <span>Faturamento de Hoje</span>
                  <DollarSign className="w-4 h-4 text-emerald-500" />
                </div>
                <div className="font-serif text-2xl font-bold text-[#0B2B3A] dark:text-white mt-1">
                  R$ {stats.totalRevenue.toFixed(2).replace('.', ',')}
                </div>
                <div className="text-[11px] text-emerald-600 font-semibold mt-1">
                  +18% em relação à média diária
                </div>
              </div>

              <div className="bg-white dark:bg-[#0F2B38] p-4 rounded-2xl border border-[#C5DAD6] dark:border-[#1E4252] shadow-xs">
                <div className="flex items-center justify-between text-xs text-[#4F6B75] dark:text-[#93B0B8]">
                  <span>Pedidos Realizados</span>
                  <ShoppingBag className="w-4 h-4 text-[#1F7A8C]" />
                </div>
                <div className="font-serif text-2xl font-bold text-[#0B2B3A] dark:text-white mt-1">
                  {stats.totalOrdersToday}
                </div>
                <div className="text-[11px] text-[#4F6B75] dark:text-[#93B0B8] mt-1">
                  {stats.activeOrders} em andamento na cozinha
                </div>
              </div>

              <div className="bg-white dark:bg-[#0F2B38] p-4 rounded-2xl border border-[#C5DAD6] dark:border-[#1E4252] shadow-xs">
                <div className="flex items-center justify-between text-xs text-[#4F6B75] dark:text-[#93B0B8]">
                  <span>Ticket Médio</span>
                  <TrendingUp className="w-4 h-4 text-[#E8A33D]" />
                </div>
                <div className="font-serif text-2xl font-bold text-[#0B2B3A] dark:text-white mt-1">
                  R$ {stats.averageTicket.toFixed(2).replace('.', ',')}
                </div>
                <div className="text-[11px] text-[#4F6B75] dark:text-[#93B0B8] mt-1">
                  Por comanda / mesa
                </div>
              </div>

              <div className="bg-white dark:bg-[#0F2B38] p-4 rounded-2xl border border-[#C5DAD6] dark:border-[#1E4252] shadow-xs">
                <div className="flex items-center justify-between text-xs text-[#4F6B75] dark:text-[#93B0B8]">
                  <span>Tempo Médio Preparo</span>
                  <Clock className="w-4 h-4 text-[#1F7A8C]" />
                </div>
                <div className="font-serif text-2xl font-bold text-[#0B2B3A] dark:text-white mt-1">
                  {stats.averagePrepTimeMinutes} min
                </div>
                <div className="text-[11px] text-emerald-600 font-semibold mt-1">
                  Dentro da meta padrão (30 min)
                </div>
              </div>
            </div>

            {/* Top Products and Table Occupancy */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Top Selling Dishes */}
              <div className="bg-white dark:bg-[#0F2B38] p-5 rounded-2xl border border-[#C5DAD6] dark:border-[#1E4252] shadow-xs space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-serif text-base font-bold">Pratos Mais Pedidos Hoje</h3>
                  <span className="text-xs text-[#1F7A8C] font-semibold">Ranking de Vendas</span>
                </div>

                <div className="space-y-3">
                  {stats.topProducts.map((p, idx) => (
                    <div key={idx} className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2.5">
                        <span className="w-6 h-6 rounded-full bg-[#EAF3F1] dark:bg-[#081C26] font-bold text-xs flex items-center justify-center text-[#1F7A8C]">
                          {idx + 1}
                        </span>
                        <span className="font-semibold text-[#0B2B3A] dark:text-white">{p.name}</span>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-[#E8A33D]">{p.quantity} pedidos</div>
                        <div className="text-[11px] text-[#4F6B75] dark:text-[#93B0B8]">
                          R$ {p.revenue.toFixed(2).replace('.', ',')}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Live Tables Status */}
              <div className="bg-white dark:bg-[#0F2B38] p-5 rounded-2xl border border-[#C5DAD6] dark:border-[#1E4252] shadow-xs space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-serif text-base font-bold">Ocupação do Salão & Deck</h3>
                  <span className="text-xs text-[#1F7A8C] font-semibold">
                    {tables.filter(t => t.status === 'occupied').length} de {tables.length} mesas ocupadas
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                  {tables.map(tbl => (
                    <div
                      key={tbl.id}
                      className={`p-3 rounded-xl border text-left ${
                        tbl.status === 'occupied'
                          ? 'border-[#E8A33D] bg-[#E8A33D]/10'
                          : 'border-[#C5DAD6] dark:border-[#1E4252] bg-gray-50 dark:bg-[#081C26]'
                      }`}
                    >
                      <div className="flex justify-between items-center">
                        <span className="font-serif font-bold text-sm">Mesa {tbl.number}</span>
                        <span
                          className={`w-2.5 h-2.5 rounded-full ${
                            tbl.status === 'occupied' ? 'bg-amber-500 animate-pulse' : 'bg-emerald-500'
                          }`}
                        />
                      </div>
                      <div className="text-[11px] text-[#4F6B75] dark:text-[#93B0B8] truncate">
                        {tbl.name}
                      </div>
                      {tbl.activeComandaTotal ? (
                        <div className="text-xs font-bold text-[#E8A33D] mt-1">
                          R$ {tbl.activeComandaTotal.toFixed(2).replace('.', ',')}
                        </div>
                      ) : (
                        <div className="text-[11px] text-emerald-600 mt-1">Livre</div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

            </div>
          </div>
        )}

        {/* TAB 2: PRODUCTS MANAGEMENT */}
        {activeTab === 'products' && (
          <div className="space-y-4">
            
            {/* Top Bar with Add and Filters */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="flex items-center gap-2 w-full sm:w-auto">
                <input
                  type="text"
                  placeholder="Buscar prato..."
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                  className="px-3.5 py-2 rounded-xl text-xs bg-white dark:bg-[#0F2B38] border border-[#C5DAD6] dark:border-[#1E4252] w-full sm:w-64"
                />

                <select
                  value={selectedCatFilter}
                  onChange={e => setSelectedCatFilter(e.target.value)}
                  className="px-3 py-2 rounded-xl text-xs bg-white dark:bg-[#0F2B38] border border-[#C5DAD6] dark:border-[#1E4252] cursor-pointer"
                >
                  <option value="all">Todas as Categorias</option>
                  {categories.map(c => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>

              <button
                onClick={handleOpenNewProduct}
                className="w-full sm:w-auto px-4 py-2 bg-[#E8A33D] hover:bg-[#F3B353] text-[#0B2B3A] font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 shadow-md transition-all active:scale-95"
              >
                <Plus className="w-4 h-4" />
                <span>Adicionar Prato / Produto</span>
              </button>
            </div>

            {/* Products Table / Cards */}
            <div className="bg-white dark:bg-[#0F2B38] rounded-2xl border border-[#C5DAD6] dark:border-[#1E4252] overflow-hidden shadow-xs">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs sm:text-sm">
                  <thead className="bg-[#EAF3F1] dark:bg-[#04121A] text-[#4F6B75] dark:text-[#93B0B8] border-b border-[#C5DAD6] dark:border-[#1E4252]">
                    <tr>
                      <th className="p-3">Foto & Nome</th>
                      <th className="p-3">Categoria</th>
                      <th className="p-3">Preço</th>
                      <th className="p-3">Disponibilidade (1-Clique)</th>
                      <th className="p-3 text-right">Ações</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#C5DAD6] dark:divide-[#1E4252]">
                    {filteredProducts.map(prod => (
                      <tr key={prod.id} className="hover:bg-gray-50 dark:hover:bg-[#081C26]/50 transition-colors">
                        <td className="p-3">
                          <div className="flex items-center gap-3">
                            <img
                              src={prod.imageUrl}
                              alt={prod.name}
                              className="w-12 h-12 rounded-xl object-cover shrink-0"
                            />
                            <div>
                              <div className="font-bold font-serif text-sm text-[#0B2B3A] dark:text-white">
                                {prod.name}
                              </div>
                              <div className="text-xs text-[#4F6B75] dark:text-[#93B0B8] line-clamp-1 max-w-xs">
                                {prod.description}
                              </div>
                            </div>
                          </div>
                        </td>

                        <td className="p-3">
                          <span className="px-2 py-0.5 rounded-full bg-gray-100 dark:bg-gray-800 text-xs font-semibold">
                            {categories.find(c => c.id === prod.categoryId)?.name || prod.categoryId}
                          </span>
                        </td>

                        <td className="p-3 font-serif font-bold">
                          <div className="text-[#0B2B3A] dark:text-[#E8A33D]">
                            R$ {(prod.promoPrice || prod.price).toFixed(2).replace('.', ',')}
                          </div>
                          {prod.promoPrice && (
                            <span className="text-[11px] line-through text-[#4F6B75] dark:text-[#93B0B8]">
                              R$ {prod.price.toFixed(2).replace('.', ',')}
                            </span>
                          )}
                        </td>

                        {/* Availability Toggle Switch */}
                        <td className="p-3">
                          <button
                            onClick={() => onToggleAvailability(prod.id)}
                            className={`px-3 py-1.5 rounded-xl font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer ${
                              prod.active
                                ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 border border-emerald-300'
                                : 'bg-rose-100 dark:bg-rose-950 text-rose-800 dark:text-rose-300 border border-rose-300'
                            }`}
                            title="Clique para alternar disponibilidade imediatamente no cardápio do cliente"
                          >
                            <span className={`w-2 h-2 rounded-full ${prod.active ? 'bg-emerald-500' : 'bg-rose-500'}`}></span>
                            <span>{prod.active ? '✓ DISPONÍVEL' : '✗ INDISPONÍVEL'}</span>
                          </button>
                        </td>

                        <td className="p-3 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={() => handleEditProduct(prod)}
                              className="p-1.5 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-[#1F7A8C] hover:text-white transition-colors"
                              title="Editar prato"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => {
                                if (confirm(`Deseja excluir "${prod.name}"?`)) {
                                  onDeleteProduct(prod.id);
                                }
                              }}
                              className="p-1.5 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-rose-600 hover:text-white transition-colors"
                              title="Excluir prato"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: CATEGORIES MANAGEMENT */}
        {activeTab === 'categories' && (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="font-serif text-lg font-bold">Categorias do Cardápio</h2>
                <p className="text-xs text-[#4F6B75] dark:text-[#93B0B8]">
                  Crie, remova e organize a ordem em que os pratos aparecem no cardápio
                </p>
              </div>

              <button
                onClick={() => setIsAddingCat(true)}
                className="px-4 py-2 bg-[#E8A33D] hover:bg-[#F3B353] text-[#0B2B3A] font-bold rounded-xl text-xs flex items-center gap-1.5 shadow-md"
              >
                <Plus className="w-4 h-4" />
                <span>Nova Categoria</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {categories.map((cat, idx) => (
                <div
                  key={cat.id}
                  className="bg-white dark:bg-[#0F2B38] p-4 rounded-xl border border-[#C5DAD6] dark:border-[#1E4252] flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    <span className="w-8 h-8 rounded-lg bg-[#1F7A8C]/20 text-[#1F7A8C] font-bold flex items-center justify-center text-xs">
                      #{idx + 1}
                    </span>
                    <div>
                      <h4 className="font-serif font-bold text-sm text-[#0B2B3A] dark:text-white">
                        {cat.name}
                      </h4>
                      <p className="text-xs text-[#4F6B75] dark:text-[#93B0B8] line-clamp-1">
                        {cat.description}
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      if (confirm(`Excluir a categoria "${cat.name}"?`)) {
                        onDeleteCategory(cat.id);
                      }
                    }}
                    className="p-1.5 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-lg"
                    title="Excluir Categoria"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 4: TABLES & QR CODE PRINT GENERATOR */}
        {activeTab === 'tables' && (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="font-serif text-lg font-bold">Mesas do Restaurante & QR Codes</h2>
                <p className="text-xs text-[#4F6B75] dark:text-[#93B0B8]">
                  Gere e imprima displays de mesa com QR Code direto para o link individual de cada mesa.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
              {tables.map(tbl => (
                <div
                  key={tbl.id}
                  className="bg-white dark:bg-[#0F2B38] border border-[#C5DAD6] dark:border-[#1E4252] rounded-2xl p-4 flex flex-col justify-between space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-serif text-xl font-bold text-[#E8A33D]">
                      Mesa {tbl.number}
                    </span>
                    <span
                      className={`w-2.5 h-2.5 rounded-full ${
                        tbl.status === 'occupied' ? 'bg-amber-500' : 'bg-emerald-500'
                      }`}
                    />
                  </div>

                  <div className="text-xs text-[#4F6B75] dark:text-[#93B0B8]">
                    {tbl.name} · Capacidade: {tbl.capacity} pessoas
                  </div>

                  {tbl.activeComandaTotal ? (
                    <div className="text-xs font-bold text-amber-600 bg-amber-50 dark:bg-amber-950/30 p-1.5 rounded-lg">
                      Comanda: R$ {tbl.activeComandaTotal.toFixed(2).replace('.', ',')}
                    </div>
                  ) : (
                    <div className="text-xs text-emerald-600 font-medium">Mesa Livre</div>
                  )}

                  <button
                    onClick={() => setPreviewQrTable(tbl)}
                    className="w-full py-2 bg-[#1F7A8C] text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 hover:bg-[#155A68]"
                  >
                    <QrCode className="w-3.5 h-3.5" />
                    <span>Ver Placa QR Code</span>
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 5: COUPONS */}
        {activeTab === 'coupons' && (
          <div className="space-y-4">
            <h2 className="font-serif text-lg font-bold">Cupons de Desconto Ativos</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {coupons.map(c => (
                <div
                  key={c.id}
                  className="bg-white dark:bg-[#0F2B38] p-4 rounded-xl border border-[#C5DAD6] dark:border-[#1E4252] flex items-center justify-between"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-sm font-bold bg-[#E8A33D] text-[#0B2B3A] px-2 py-0.5 rounded">
                        {c.code}
                      </span>
                      <span className="text-xs text-emerald-600 font-bold">
                        {c.discountType === 'percentage' ? `${c.value}% OFF` : `R$ ${c.value},00 OFF`}
                      </span>
                    </div>
                    <p className="text-xs text-[#4F6B75] dark:text-[#93B0B8] mt-1">{c.description}</p>
                    {c.minOrderValue && (
                      <span className="text-[11px] text-[#1F7A8C]">
                        Válido acima de R$ {c.minOrderValue.toFixed(2).replace('.', ',')}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 7: SETTINGS & DEPLOYMENT */}
        {activeTab === 'settings' && (
          <div className="space-y-6">
            
            {/* Implementation Step-by-Step Guide */}
            <div className="bg-gradient-to-r from-[#0B2B3A] to-[#1F7A8C] text-white p-5 rounded-2xl shadow-lg space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xs uppercase tracking-wider font-bold text-[#E8A33D]">Guia de Ativação</span>
                  <h2 className="font-serif text-xl sm:text-2xl font-bold mt-0.5">
                    Como Colocar este Sistema em Operação no seu Restaurante
                  </h2>
                </div>
                <button
                  onClick={() => setIsPrintingAllTables(true)}
                  className="px-4 py-2.5 bg-[#E8A33D] hover:bg-[#F3B353] text-[#0B2B3A] font-bold rounded-xl text-xs flex items-center gap-2 shadow-md cursor-pointer transition-all active:scale-95"
                >
                  <Printer className="w-4 h-4" />
                  <span>Imprimir Todas as Mesas (A4)</span>
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs pt-1">
                <div className="p-3 rounded-xl bg-white/10 backdrop-blur-xs border border-white/20 space-y-1">
                  <div className="w-6 h-6 rounded-lg bg-[#E8A33D] text-[#0B2B3A] font-bold flex items-center justify-center">1</div>
                  <strong className="block text-white text-sm">Dados & Chave PIX</strong>
                  <p className="text-[#B9D3D8]">
                    Preencha o formulário abaixo com o nome real, telefone, endereço e sua chave PIX para receber os pagamentos diretamente na sua conta.
                  </p>
                </div>

                <div className="p-3 rounded-xl bg-white/10 backdrop-blur-xs border border-white/20 space-y-1">
                  <div className="w-6 h-6 rounded-lg bg-[#E8A33D] text-[#0B2B3A] font-bold flex items-center justify-center">2</div>
                  <strong className="block text-white text-sm">Ajustar Cardápio</strong>
                  <p className="text-[#B9D3D8]">
                    Na aba "Cardápio", edite os pratos, adicione fotos, insira seus preços e desative com 1 clique os itens que acabarem no dia.
                  </p>
                </div>

                <div className="p-3 rounded-xl bg-white/10 backdrop-blur-xs border border-white/20 space-y-1">
                  <div className="w-6 h-6 rounded-lg bg-[#E8A33D] text-[#0B2B3A] font-bold flex items-center justify-center">3</div>
                  <strong className="block text-white text-sm">Colocar Placas nas Mesas</strong>
                  <p className="text-[#B9D3D8]">
                    Clique em "Imprimir Todas as Mesas", recorte as placas e coloque nos displays de acrílico das mesas (Mesa 01 a 10).
                  </p>
                </div>

                <div className="p-3 rounded-xl bg-white/10 backdrop-blur-xs border border-white/20 space-y-1">
                  <div className="w-6 h-6 rounded-lg bg-[#E8A33D] text-[#0B2B3A] font-bold flex items-center justify-center">4</div>
                  <strong className="block text-white text-sm">Tablet na Cozinha (KDS)</strong>
                  <p className="text-[#B9D3D8]">
                    Abra a tela "Cozinha KDS" em um tablet ou monitor na área de preparo para os cozinheiros receberem pedidos instantaneamente com aviso sonoro.
                  </p>
                </div>
              </div>
            </div>

            {/* Restaurant Data Form */}
            <div className="bg-white dark:bg-[#0F2B38] p-5 sm:p-6 rounded-2xl border border-[#C5DAD6] dark:border-[#1E4252] shadow-xs space-y-5">
              <div className="flex items-center justify-between border-b border-[#C5DAD6] dark:border-[#1E4252] pb-3">
                <div>
                  <h3 className="font-serif text-lg font-bold text-[#0B2B3A] dark:text-white">
                    Dados do Restaurante & Chave de Pagamento
                  </h3>
                  <p className="text-xs text-[#4F6B75] dark:text-[#93B0B8]">
                    Essas informações aparecem no cabeçalho do cliente, nos comprovantes e no PIX
                  </p>
                </div>
                {restSaved && (
                  <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-3 py-1 rounded-full border border-emerald-300">
                    ✓ Alterações salvas com sucesso!
                  </span>
                )}
              </div>

              <form
                onSubmit={async (e) => {
                  e.preventDefault();
                  if (onUpdateRestaurant) {
                    await onUpdateRestaurant(restForm);
                    setRestSaved(true);
                    setTimeout(() => setRestSaved(false), 3000);
                  }
                }}
                className="space-y-4 text-xs sm:text-sm"
              >
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="font-semibold block mb-1">Nome do Restaurante *</label>
                    <input
                      type="text"
                      required
                      value={restForm.name || ''}
                      onChange={e => setRestForm({ ...restForm, name: e.target.value })}
                      className="w-full p-2.5 rounded-xl border border-[#C5DAD6] dark:border-[#1E4252] bg-white dark:bg-[#081C26]"
                    />
                  </div>

                  <div>
                    <label className="font-semibold block mb-1">Letra / Título Curto (Grego ou Estilizado)</label>
                    <input
                      type="text"
                      value={restForm.greekName || ''}
                      onChange={e => setRestForm({ ...restForm, greekName: e.target.value })}
                      className="w-full p-2.5 rounded-xl border border-[#C5DAD6] dark:border-[#1E4252] bg-white dark:bg-[#081C26]"
                    />
                  </div>
                </div>

                <div>
                  <label className="font-semibold block mb-1">Frase de Apresentação / Slogan</label>
                  <input
                    type="text"
                    value={restForm.tagline || ''}
                    onChange={e => setRestForm({ ...restForm, tagline: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-[#C5DAD6] dark:border-[#1E4252] bg-white dark:bg-[#081C26]"
                  />
                </div>

                {/* Real PIX Key */}
                <div className="p-3.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
                    <label className="font-bold text-emerald-900 dark:text-emerald-300">
                      Sua Chave PIX Real (Receba pagamentos direto na conta do restaurante) *
                    </label>
                  </div>
                  <input
                    type="text"
                    placeholder="Chave CNPJ, CPF, E-mail, Telefone ou Chave Aleatória"
                    value={restForm.pixKey || ''}
                    onChange={e => setRestForm({ ...restForm, pixKey: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-emerald-300 dark:border-emerald-700 bg-white dark:bg-[#081C26] font-mono text-xs sm:text-sm font-semibold"
                  />
                  <p className="text-[11px] text-emerald-700 dark:text-emerald-400">
                    O código PIX gerado para o cliente no checkout utilizará esta chave para pagamentos rápidos.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="font-semibold block mb-1">Telefone WhatsApp</label>
                    <input
                      type="text"
                      placeholder="5513998765432"
                      value={restForm.whatsapp || ''}
                      onChange={e => setRestForm({ ...restForm, whatsapp: e.target.value })}
                      className="w-full p-2.5 rounded-xl border border-[#C5DAD6] dark:border-[#1E4252] bg-white dark:bg-[#081C26]"
                    />
                  </div>

                  <div>
                    <label className="font-semibold block mb-1">Horário de Abertura</label>
                    <input
                      type="text"
                      placeholder="11:30"
                      value={restForm.opensAt || ''}
                      onChange={e => setRestForm({ ...restForm, opensAt: e.target.value })}
                      className="w-full p-2.5 rounded-xl border border-[#C5DAD6] dark:border-[#1E4252] bg-white dark:bg-[#081C26]"
                    />
                  </div>

                  <div>
                    <label className="font-semibold block mb-1">Horário de Fechamento</label>
                    <input
                      type="text"
                      placeholder="23:30"
                      value={restForm.closesAt || ''}
                      onChange={e => setRestForm({ ...restForm, closesAt: e.target.value })}
                      className="w-full p-2.5 rounded-xl border border-[#C5DAD6] dark:border-[#1E4252] bg-white dark:bg-[#081C26]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="font-semibold block mb-1">Endereço Completo</label>
                    <input
                      type="text"
                      value={restForm.address || ''}
                      onChange={e => setRestForm({ ...restForm, address: e.target.value })}
                      className="w-full p-2.5 rounded-xl border border-[#C5DAD6] dark:border-[#1E4252] bg-white dark:bg-[#081C26]"
                    />
                  </div>

                  <div>
                    <label className="font-semibold block mb-1">Tempo Médio Estimado de Preparo</label>
                    <input
                      type="text"
                      placeholder="25 - 35 min"
                      value={restForm.avgPrepTime || ''}
                      onChange={e => setRestForm({ ...restForm, avgPrepTime: e.target.value })}
                      className="w-full p-2.5 rounded-xl border border-[#C5DAD6] dark:border-[#1E4252] bg-white dark:bg-[#081C26]"
                    />
                  </div>
                </div>

                <div className="pt-2 flex justify-end">
                  <button
                    type="submit"
                    className="py-3 px-6 bg-[#E8A33D] hover:bg-[#F3B353] text-[#0B2B3A] font-bold rounded-xl shadow-md cursor-pointer transition-all active:scale-95 text-sm"
                  >
                    Salvar Dados do Restaurante
                  </button>
                </div>
              </form>
            </div>

            {/* Backup & Export Card */}
            <div className="bg-white dark:bg-[#0F2B38] p-5 rounded-2xl border border-[#C5DAD6] dark:border-[#1E4252] shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <h4 className="font-serif font-bold text-sm text-[#0B2B3A] dark:text-white">
                  Backup e Exportação do Cardápio
                </h4>
                <p className="text-xs text-[#4F6B75] dark:text-[#93B0B8]">
                  Exporte todo o cardápio (produtos, preços, fotos e categorias) em um arquivo JSON para segurança.
                </p>
              </div>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => {
                    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify({ categories, products, restaurant }, null, 2));
                    const downloadAnchor = document.createElement('a');
                    downloadAnchor.setAttribute("href", dataStr);
                    downloadAnchor.setAttribute("download", `cardapio-thalassa-backup-${new Date().toISOString().slice(0, 10)}.json`);
                    document.body.appendChild(downloadAnchor);
                    downloadAnchor.click();
                    downloadAnchor.remove();
                  }}
                  className="px-4 py-2 bg-[#1F7A8C] text-white rounded-xl text-xs font-semibold hover:bg-[#155A68]"
                >
                  Baixar Backup JSON
                </button>
              </div>
            </div>

          </div>
        )}

      </div>

      {/* Edit / Create Product Modal */}
      {isEditingProduct && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#0F2B38] text-[#0B2B3A] dark:text-[#E6F1EF] max-w-lg w-full rounded-2xl p-6 shadow-2xl border border-[#C5DAD6] dark:border-[#1E4252] max-h-[90vh] overflow-y-auto">
            <h3 className="font-serif text-xl font-bold mb-4">
              {productForm.id ? 'Editar Prato' : 'Adicionar Novo Prato ao Cardápio'}
            </h3>

            <form onSubmit={handleSaveProduct} className="space-y-3.5 text-xs sm:text-sm">
              <div>
                <label className="font-semibold block mb-1">Nome do Prato *</label>
                <input
                  type="text"
                  required
                  value={productForm.name || ''}
                  onChange={e => setProductForm({ ...productForm, name: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-[#C5DAD6] dark:border-[#1E4252] bg-white dark:bg-[#081C26]"
                />
              </div>

              <div>
                <label className="font-semibold block mb-1">Categoria *</label>
                <select
                  value={productForm.categoryId || categories[0]?.id}
                  onChange={e => setProductForm({ ...productForm, categoryId: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-[#C5DAD6] dark:border-[#1E4252] bg-white dark:bg-[#081C26]"
                >
                  {categories.map(c => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold block mb-1">Preço Normal (R$) *</label>
                  <input
                    type="number"
                    step="0.5"
                    required
                    value={productForm.price || ''}
                    onChange={e => setProductForm({ ...productForm, price: parseFloat(e.target.value) })}
                    className="w-full p-2.5 rounded-xl border border-[#C5DAD6] dark:border-[#1E4252] bg-white dark:bg-[#081C26]"
                  />
                </div>
                <div>
                  <label className="font-semibold block mb-1">Preço Promocional (Opcional)</label>
                  <input
                    type="number"
                    step="0.5"
                    value={productForm.promoPrice || ''}
                    onChange={e => setProductForm({ ...productForm, promoPrice: e.target.value ? parseFloat(e.target.value) : undefined })}
                    className="w-full p-2.5 rounded-xl border border-[#C5DAD6] dark:border-[#1E4252] bg-white dark:bg-[#081C26]"
                  />
                </div>
              </div>

              <div>
                <label className="font-semibold block mb-1">URL da Imagem</label>
                <input
                  type="url"
                  value={productForm.imageUrl || ''}
                  onChange={e => setProductForm({ ...productForm, imageUrl: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-[#C5DAD6] dark:border-[#1E4252] bg-white dark:bg-[#081C26]"
                />
              </div>

              <div>
                <label className="font-semibold block mb-1">Descrição do Prato</label>
                <textarea
                  rows={2}
                  value={productForm.description || ''}
                  onChange={e => setProductForm({ ...productForm, description: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-[#C5DAD6] dark:border-[#1E4252] bg-white dark:bg-[#081C26]"
                />
              </div>

              <div className="flex gap-2 pt-3">
                <button
                  type="submit"
                  className="flex-1 py-3 bg-[#E8A33D] text-[#0B2B3A] font-bold rounded-xl"
                >
                  Salvar Prato
                </button>
                <button
                  type="button"
                  onClick={() => setIsEditingProduct(false)}
                  className="py-3 px-5 bg-gray-200 dark:bg-gray-700 rounded-xl font-semibold"
                >
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Category Modal */}
      {isAddingCat && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#0F2B38] text-[#0B2B3A] dark:text-[#E6F1EF] max-w-sm w-full rounded-2xl p-6 shadow-2xl border border-[#C5DAD6] dark:border-[#1E4252]">
            <h3 className="font-serif text-lg font-bold mb-3">Nova Categoria</h3>
            <form onSubmit={handleSaveCategory} className="space-y-3 text-xs sm:text-sm">
              <div>
                <label className="font-semibold block mb-1">Nome da Categoria *</label>
                <input
                  type="text"
                  required
                  placeholder="Ex.: Sobremesas Especiais"
                  value={newCatName}
                  onChange={e => setNewCatName(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-[#C5DAD6] dark:border-[#1E4252] bg-white dark:bg-[#081C26]"
                />
              </div>
              <div>
                <label className="font-semibold block mb-1">Descrição</label>
                <input
                  type="text"
                  placeholder="Ex.: Doces artesanais caiçaras"
                  value={newCatDesc}
                  onChange={e => setNewCatDesc(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-[#C5DAD6] dark:border-[#1E4252] bg-white dark:bg-[#081C26]"
                />
              </div>
              <div className="flex gap-2 pt-2">
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-[#1F7A8C] text-white font-bold rounded-xl"
                >
                  Criar Categoria
                </button>
                <button
                  type="button"
                  onClick={() => setIsAddingCat(false)}
                  className="py-2.5 px-4 bg-gray-200 dark:bg-gray-700 rounded-xl"
                >
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* QR Code Plaque Preview in Admin */}
      {previewQrTable && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#0F2B38] text-[#0B2B3A] dark:text-[#E6F1EF] max-w-sm w-full rounded-2xl p-6 shadow-2xl border border-[#C5DAD6] dark:border-[#1E4252] text-center">
            <h3 className="font-serif text-xl font-bold mb-2">Display Acrílico para Impressão</h3>
            
            <div className="border-4 border-[#0B2B3A] dark:border-[#E8A33D] rounded-2xl p-5 bg-gradient-to-b from-white to-[#EAF3F1] dark:from-[#0F2B38] dark:to-[#081C26] my-4 shadow-inner">
              <div className="font-serif text-2xl font-bold text-[#0B2B3A] dark:text-[#E8A33D]">
                Θάλασσα
              </div>
              <div className="text-[11px] text-[#1F7A8C] uppercase font-bold tracking-widest mb-3">
                Thalassa · Peruíbe
              </div>

              {/* QR Code SVG */}
              <div className="w-40 h-40 mx-auto bg-white p-2.5 rounded-xl border border-gray-300 shadow flex items-center justify-center">
                <svg className="w-full h-full text-[#0B2B3A]" viewBox="0 0 100 100" fill="currentColor">
                  <rect x="5" y="5" width="28" height="28" fill="#0B2B3A" rx="4" />
                  <rect x="9" y="9" width="20" height="20" fill="white" rx="2" />
                  <rect x="13" y="13" width="12" height="12" fill="#0B2B3A" rx="2" />

                  <rect x="67" y="5" width="28" height="28" fill="#0B2B3A" rx="4" />
                  <rect x="71" y="9" width="20" height="20" fill="white" rx="2" />
                  <rect x="75" y="13" width="12" height="12" fill="#0B2B3A" rx="2" />

                  <rect x="5" y="67" width="28" height="28" fill="#0B2B3A" rx="4" />
                  <rect x="9" y="71" width="20" height="20" fill="white" rx="2" />
                  <rect x="13" y="75" width="12" height="12" fill="#0B2B3A" rx="2" />

                  <rect x="36" y="38" width="28" height="28" fill="#1F7A8C" rx="4" />
                  <text x="50" y="56" fill="white" fontSize="14" fontWeight="bold" textAnchor="middle" fontFamily="sans-serif">
                    {previewQrTable.number}
                  </text>
                  <rect x="38" y="12" width="10" height="6" fill="#0B2B3A" />
                  <rect x="72" y="72" width="16" height="16" fill="#0B2B3A" />
                </svg>
              </div>

              <div className="font-serif text-lg font-bold mt-3">
                MESA {previewQrTable.number}
              </div>
              <div className="text-[10px] text-[#4F6B75] dark:text-[#93B0B8]">
                Aponte a câmera para pedir
              </div>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => window.print()}
                className="flex-1 py-2.5 bg-[#1F7A8C] text-white rounded-xl font-semibold flex items-center justify-center gap-1.5"
              >
                <Printer className="w-4 h-4" />
                <span>Imprimir Display</span>
              </button>
              <button
                onClick={() => setPreviewQrTable(null)}
                className="py-2.5 px-4 bg-gray-200 dark:bg-gray-700 rounded-xl"
              >
                Fechar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Print All Tables Sheet Modal */}
      {isPrintingAllTables && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white text-black max-w-4xl w-full rounded-2xl p-6 shadow-2xl space-y-4 max-h-[92vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b pb-3 print:hidden">
              <div>
                <h3 className="font-serif text-xl font-bold">Folha A4 de Placas de Mesas (1 a 10)</h3>
                <p className="text-xs text-gray-600">
                  Pronto para imprimir, recortar nas linhas pontilhadas e colocar nos displays de acrílico das mesas.
                </p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => window.print()}
                  className="px-4 py-2 bg-[#1F7A8C] text-white font-bold rounded-xl text-xs flex items-center gap-1.5 shadow"
                >
                  <Printer className="w-4 h-4" />
                  <span>Imprimir Agora (Ctrl + P)</span>
                </button>
                <button
                  onClick={() => setIsPrintingAllTables(false)}
                  className="px-3 py-2 bg-gray-200 text-gray-800 rounded-xl text-xs font-semibold"
                >
                  Fechar
                </button>
              </div>
            </div>

            {/* Printable Grid of Tables */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 p-2">
              {tables.map(tbl => (
                <div
                  key={tbl.id}
                  className="border-2 border-dashed border-gray-400 rounded-2xl p-4 text-center bg-gray-50 flex flex-col items-center justify-between min-h-[220px]"
                >
                  <div>
                    <div className="font-serif text-xl font-bold text-[#0B2B3A]">
                      {restaurant.greekName || 'Θάλασσα'}
                    </div>
                    <div className="text-[10px] uppercase tracking-wider font-semibold text-[#1F7A8C]">
                      {restaurant.name}
                    </div>
                  </div>

                  {/* Simulated QR Code for printing */}
                  <div className="w-28 h-28 bg-white p-2 border border-gray-300 rounded-xl my-2 flex items-center justify-center">
                    <svg className="w-full h-full text-black" viewBox="0 0 100 100" fill="currentColor">
                      <rect x="5" y="5" width="28" height="28" fill="#000" rx="3" />
                      <rect x="9" y="9" width="20" height="20" fill="white" rx="1.5" />
                      <rect x="13" y="13" width="12" height="12" fill="#000" rx="1" />

                      <rect x="67" y="5" width="28" height="28" fill="#000" rx="3" />
                      <rect x="71" y="9" width="20" height="20" fill="white" rx="1.5" />
                      <rect x="75" y="13" width="12" height="12" fill="#000" rx="1" />

                      <rect x="5" y="67" width="28" height="28" fill="#000" rx="3" />
                      <rect x="9" y="71" width="20" height="20" fill="white" rx="1.5" />
                      <rect x="13" y="75" width="12" height="12" fill="#000" rx="1" />

                      <rect x="36" y="38" width="28" height="28" fill="#1F7A8C" rx="3" />
                      <text x="50" y="56" fill="white" fontSize="13" fontWeight="bold" textAnchor="middle" fontFamily="sans-serif">
                        {tbl.number}
                      </text>
                      <rect x="38" y="12" width="10" height="6" fill="#000" />
                      <rect x="72" y="72" width="16" height="16" fill="#000" />
                    </svg>
                  </div>

                  <div>
                    <div className="font-serif text-lg font-bold text-[#0B2B3A]">
                      MESA {tbl.number}
                    </div>
                    <div className="text-[9px] text-gray-500">
                      Aponte a câmera do celular para pedir
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
