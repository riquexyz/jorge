import React, { useState, useEffect, useMemo, useRef } from 'react';
import { ShoppingBag, ArrowRight } from 'lucide-react';
import {
  Product,
  Category,
  CartItem,
  Order,
  TableInfo,
  Coupon,
  Review,
  RestaurantInfo,
  OrderStatus,
  SelectedOption,
  OrderType,
  PaymentMethod,
  DeliveryAddress
} from './types';
import { api } from './services/api';
import { audioService } from './services/audio';

// Components
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { TableBanner } from './components/TableBanner';
import { MenuNav } from './components/MenuNav';
import { ProductCard } from './components/ProductCard';
import { ProductModal } from './components/ProductModal';
import { CartDrawer } from './components/CartDrawer';
import { CheckoutModal } from './components/CheckoutModal';
import { OrderTrackerModal } from './components/OrderTrackerModal';
import { KDSView } from './components/KDSView';
import { AdminView } from './components/AdminView';
import { TableComandaModal } from './components/TableComandaModal';
import { ReviewModal } from './components/ReviewModal';
import { DemoTourModal } from './components/DemoTourModal';
import { PanelsLinkModal } from './components/PanelsLinkModal';
import { AdminPinModal } from './components/AdminPinModal';

export default function App() {
  // Theme state
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('thalassa_theme') === 'dark';
    }
    return false;
  });

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('thalassa_theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('thalassa_theme', 'light');
    }
  }, [darkMode]);

  // Current view: 'client' | 'kds' | 'admin' determined by URL path or query
  const [activeView, setActiveView] = useState<'client' | 'kds' | 'admin'>('client');

  // Panels Modal and Dynamic Security PIN State (Kitchen 0000 or Admin 1234)
  const [isPanelsModalOpen, setIsPanelsModalOpen] = useState(false);
  const [pinModalConfig, setPinModalConfig] = useState<{
    isOpen: boolean;
    target: 'admin' | 'kitchen';
    title: string;
    subtitle: string;
    expectedPin: string;
    storageKey: string;
  } | null>(null);

  // Check URL on startup and enforce PIN if needed
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const p = window.location.pathname.toLowerCase();
      const params = new URLSearchParams(window.location.search);
      const painel = (params.get('painel') || params.get('view') || '').toLowerCase();

      if (p.includes('/kds') || p.includes('/cozinha') || painel === 'kds' || painel === 'cozinha') {
        if (sessionStorage.getItem('thalassa_kitchen_auth') === 'true') {
          setActiveView('kds');
        } else {
          setActiveView('client');
          setPinModalConfig({
            isOpen: true,
            target: 'kitchen',
            title: 'Senha da Cozinha (KDS)',
            subtitle: 'Digite o PIN da cozinha para acessar os pedidos',
            expectedPin: '0000',
            storageKey: 'thalassa_kitchen_auth'
          });
        }
      } else if (p.includes('/admin') || p.includes('/painel') || painel === 'admin') {
        if (sessionStorage.getItem('thalassa_admin_auth') === 'true') {
          setActiveView('admin');
        } else {
          setActiveView('client');
          setPinModalConfig({
            isOpen: true,
            target: 'admin',
            title: 'Senha de Administrador',
            subtitle: 'Digite o PIN para gerenciar o restaurante e faturamento',
            expectedPin: '1234',
            storageKey: 'thalassa_admin_auth'
          });
        }
      }
    }
  }, []);

  // Table identification from URL or storage
  const [tableNumber, setTableNumber] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search);
      const m = urlParams.get('mesa') || urlParams.get('table');
      if (m) return m.padStart(2, '0');
      const saved = localStorage.getItem('thalassa_table');
      if (saved) return saved;
    }
    return '08'; // Default demo table
  });

  useEffect(() => {
    if (tableNumber) {
      localStorage.setItem('thalassa_table', tableNumber);
    }
  }, [tableNumber]);

  // App Data State
  const [restaurant, setRestaurant] = useState<RestaurantInfo | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [tables, setTables] = useState<TableInfo[]>([]);
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [stats, setStats] = useState({
    totalOrdersToday: 0,
    activeOrders: 0,
    totalRevenue: 0,
    averageTicket: 0,
    cancelledOrders: 0,
    averagePrepTimeMinutes: 24,
    topProducts: [] as { name: string; quantity: number; revenue: number }[],
    totalCustomersServed: 0
  });

  // User Cart State
  const [cart, setCart] = useState<CartItem[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('thalassa_cart');
      if (saved) {
        try { return JSON.parse(saved); } catch { /* ignore */ }
      }
    }
    return [];
  });

  useEffect(() => {
    localStorage.setItem('thalassa_cart', JSON.stringify(cart));
  }, [cart]);

  // Favorites
  const [favorites, setFavorites] = useState<string[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('thalassa_favorites');
      if (saved) {
        try { return JSON.parse(saved); } catch { /* ignore */ }
      }
    }
    return [];
  });

  const handleToggleFavorite = (productId: string) => {
    setFavorites(prev => {
      const next = prev.includes(productId) ? prev.filter(id => id !== productId) : [...prev, productId];
      localStorage.setItem('thalassa_favorites', JSON.stringify(next));
      return next;
    });
  };

  // Coupons in cart
  const [appliedCoupon, setAppliedCoupon] = useState<Coupon | null>(null);
  const [couponDiscount, setCouponDiscount] = useState(0);
  const [includeServiceFee, setIncludeServiceFee] = useState(true);

  // Modals & Navigation State
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [trackedOrder, setTrackedOrder] = useState<Order | null>(null);
  const [isComandaModalOpen, setIsComandaModalOpen] = useState(false);
  const [reviewOrder, setReviewOrder] = useState<Order | null>(null);
  const [isDemoTourOpen, setIsDemoTourOpen] = useState(false);
  const [tableOrders, setTableOrders] = useState<Order[]>([]);

  // Menu Navigation & Search Filters
  const [activeCategoryId, setActiveCategoryId] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');
  const [sortBy, setSortBy] = useState('featured');

  const menuRef = useRef<HTMLDivElement>(null);

  // Initial Data Fetch
  const loadInitialData = async () => {
    try {
      const [restData, catData, prodData, tblData, ordData, revData, statsData] = await Promise.all([
        api.getRestaurant(),
        api.getCategories(),
        api.getProducts(),
        api.getTables(),
        api.getOrders(),
        api.getReviews(),
        api.getStats()
      ]);
      setRestaurant(restData);
      setCategories(catData);
      setProducts(prodData);
      setTables(tblData);
      setOrders(ordData);
      setReviews(revData);
      setStats(statsData);
    } catch (err) {
      console.error('Error fetching initial data:', err);
    }
  };

  useEffect(() => {
    loadInitialData();
  }, []);

  // Update table orders for comanda
  useEffect(() => {
    const active = orders.filter(o => o.tableNumber === tableNumber && o.status !== 'cancelled');
    setTableOrders(active);
  }, [orders, tableNumber]);

  // Subscribe to Real-Time SSE Events
  useEffect(() => {
    const unsubscribe = api.subscribeToEvents((event) => {
      if (event.type === 'NEW_ORDER') {
        const newOrder = event.payload as Order;
        setOrders(prev => [newOrder, ...prev.filter(o => o.id !== newOrder.id)]);
        // Play bell if new order arrives
        audioService.playOrderBell();
        // Update stats
        api.getStats().then(setStats);
        api.getTables().then(setTables);
      } else if (event.type === 'ORDER_STATUS_CHANGED') {
        const updated = event.payload as Order;
        setOrders(prev => prev.map(o => o.id === updated.id ? updated : o));
        if (trackedOrder && trackedOrder.id === updated.id) {
          setTrackedOrder(updated);
          if (updated.status === 'ready' || updated.status === 'delivered') {
            audioService.playOrderReady();
          }
        }
        api.getStats().then(setStats);
        api.getTables().then(setTables);
      } else if (event.type === 'PRODUCTS_UPDATED') {
        setProducts(event.payload as Product[]);
      } else if (event.type === 'PRODUCT_AVAILABILITY_CHANGED') {
        const { id, active } = event.payload as { id: string; active: boolean };
        setProducts(prev => prev.map(p => p.id === id ? { ...p, active } : p));
      } else if (event.type === 'CATEGORIES_UPDATED') {
        setCategories(event.payload as Category[]);
      } else if (event.type === 'NEW_REVIEW') {
        setReviews(prev => [event.payload as Review, ...prev]);
      }
    });

    return () => unsubscribe();
  }, [trackedOrder]);

  // Filter and sort products
  const filteredProducts = useMemo(() => {
    let result = [...products];

    // Category filter
    if (activeCategoryId !== 'all') {
      result = result.filter(p => p.categoryId === activeCategoryId);
    }

    // Search filter
    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase();
      result = result.filter(p =>
        p.name.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.ingredients.some(ing => ing.toLowerCase().includes(q))
      );
    }

    // Special dietary / tag filter
    if (activeFilter === 'top') {
      result = result.filter(p => p.tags.includes('Mais pedido'));
    } else if (activeFilter === 'promo') {
      result = result.filter(p => p.promoPrice || p.tags.includes('Promoção'));
    } else if (activeFilter === 'veg') {
      result = result.filter(p => p.tags.includes('Vegetariano') || p.tags.includes('Vegano'));
    } else if (activeFilter === 'gluten_free') {
      result = result.filter(p => p.tags.includes('Sem glúten'));
    } else if (activeFilter === 'new') {
      result = result.filter(p => p.tags.includes('Novo'));
    }

    // Sorting
    if (sortBy === 'price_asc') {
      result.sort((a, b) => (a.promoPrice || a.price) - (b.promoPrice || b.price));
    } else if (sortBy === 'price_desc') {
      result.sort((a, b) => (b.promoPrice || b.price) - (a.promoPrice || a.price));
    } else if (sortBy === 'name_asc') {
      result.sort((a, b) => a.name.localeCompare(b.name));
    }

    return result;
  }, [products, activeCategoryId, searchTerm, activeFilter, sortBy]);

  // Count per category
  const productCountByCat = useMemo(() => {
    const map: Record<string, number> = {};
    products.forEach(p => {
      map[p.categoryId] = (map[p.categoryId] || 0) + 1;
    });
    return map;
  }, [products]);

  // Upsell products: suggestions from drinks or desserts
  const upsellProducts = useMemo(() => {
    return products.filter(p => (p.categoryId === 'bebidas' || p.categoryId === 'sobremesas' || p.categoryId === 'coqueteis') && p.active);
  }, [products]);

  // Cart operations
  const handleAddToCart = (
    product: Product,
    quantity: number,
    selectedOptions: SelectedOption[],
    removedIngredients: string[],
    notes: string,
    calculatedTotal: number
  ) => {
    const unitPrice = calculatedTotal / quantity;
    const cartItemId = `${product.id}-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`;

    const newItem: CartItem = {
      cartItemId,
      productId: product.id,
      product,
      quantity,
      selectedOptions,
      removedIngredients,
      notes,
      unitPrice,
      itemTotal: calculatedTotal
    };

    setCart(prev => [...prev, newItem]);
    audioService.playSuccessPop();
  };

  const handleQuickAdd = (product: Product) => {
    const price = product.promoPrice || product.price;
    handleAddToCart(product, 1, [], [], '', price);
  };

  const handleUpdateQuantity = (cartItemId: string, delta: number) => {
    setCart(prev =>
      prev
        .map(item => {
          if (item.cartItemId === cartItemId) {
            const nextQty = item.quantity + delta;
            if (nextQty <= 0) return null;
            return {
              ...item,
              quantity: nextQty,
              itemTotal: item.unitPrice * nextQty
            };
          }
          return item;
        })
        .filter(Boolean) as CartItem[]
    );
  };

  const handleRemoveCartItem = (cartItemId: string) => {
    setCart(prev => prev.filter(i => i.cartItemId !== cartItemId));
  };

  const handleClearCart = () => {
    setCart([]);
    setAppliedCoupon(null);
    setCouponDiscount(0);
  };

  // Coupons
  const handleApplyCoupon = async (code: string): Promise<boolean> => {
    const subtotal = cart.reduce((sum, item) => sum + item.itemTotal, 0);
    const res = await api.validateCoupon(code, subtotal);
    if (res.valid && res.coupon && typeof res.discount === 'number') {
      setAppliedCoupon(res.coupon);
      setCouponDiscount(res.discount);
      return true;
    }
    return false;
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    setCouponDiscount(0);
  };

  // Cart Totals
  const cartSubtotal = cart.reduce((sum, item) => sum + item.itemTotal, 0);
  const cartServiceFee = includeServiceFee ? cartSubtotal * 0.10 : 0;
  const cartTotal = Math.max(0, cartSubtotal + cartServiceFee - couponDiscount);
  const totalCartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  // Order submission
  const handlePlaceOrder = async (orderPayload: {
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
  }) => {
    const created = await api.createOrder({
      ...orderPayload,
      includeServiceFee
    });
    return created;
  };

  const handleOrderSuccess = (order: Order) => {
    setCart([]);
    setAppliedCoupon(null);
    setCouponDiscount(0);
    setIsCartOpen(false);
    setIsCheckoutOpen(false);
    setTrackedOrder(order);
    audioService.playOrderBell();
  };

  // KDS Status Transition
  const handleUpdateOrderStatus = async (orderId: string, status: OrderStatus) => {
    try {
      const updated = await api.updateOrderStatus(orderId, status);
      setOrders(prev => prev.map(o => o.id === updated.id ? updated : o));
      if (trackedOrder && trackedOrder.id === orderId) {
        setTrackedOrder(updated);
      }
      if (status === 'ready' || status === 'delivered') {
        audioService.playOrderReady();
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Admin handlers
  const handleToggleAvailability = async (productId: string) => {
    const updated = await api.toggleProductAvailability(productId);
    setProducts(prev => prev.map(p => p.id === updated.id ? updated : p));
  };

  const handleCreateProduct = async (prod: Partial<Product>) => {
    const created = await api.createProduct(prod);
    setProducts(prev => [...prev, created]);
  };

  const handleUpdateProduct = async (id: string, prod: Partial<Product>) => {
    const updated = await api.updateProduct(id, prod);
    setProducts(prev => prev.map(p => p.id === id ? updated : p));
  };

  const handleDeleteProduct = async (id: string) => {
    await api.deleteProduct(id);
    setProducts(prev => prev.filter(p => p.id !== id));
  };

  const handleCreateCategory = async (cat: Partial<Category>) => {
    const created = await api.createCategory(cat);
    setCategories(prev => [...prev, created]);
  };

  const handleDeleteCategory = async (id: string) => {
    await api.deleteCategory(id);
    setCategories(prev => prev.filter(c => c.id !== id));
  };

  const handleUpdateRestaurant = async (info: Partial<RestaurantInfo>) => {
    const updated = await api.updateRestaurant(info);
    setRestaurant(updated);
  };

  const handleSubmitReview = async (reviewData: {
    orderId: string;
    orderNumber: number;
    customerName: string;
    rating: number;
    comment: string;
  }) => {
    const created = await api.submitReview(reviewData);
    setReviews(prev => [created, ...prev]);
    if (trackedOrder && trackedOrder.id === reviewData.orderId) {
      setTrackedOrder({ ...trackedOrder, reviewed: true });
    }
  };

  // Demo Tour Action: automatic complete simulation flow
  const handleStartSimulation = async () => {
    try {
      // 1. Create simulated order on current table
      const simOrder = await api.createOrder({
        orderType: 'local',
        tableNumber: tableNumber || '08',
        customerName: 'Fernanda Albuquerque (Demo)',
        customerPhone: '(13) 99123-4567',
        paymentMethod: 'pix',
        paymentStatus: 'paid',
        includeServiceFee: true,
        couponCode: 'BEMVINDO10',
        items: [
          {
            productId: 'prod-11',
            productName: 'Moqueca Caiçara Mista de Peixe & Camarão',
            quantity: 1,
            unitPrice: 154.0,
            selectedOptions: [{ groupName: 'Coentro', optionName: 'Tradicional', price: 0 }],
            removedIngredients: [],
            totalPrice: 154.0
          },
          {
            productId: 'prod-25',
            productName: 'Água de Coco Natural Geladinha',
            quantity: 2,
            unitPrice: 12.0,
            selectedOptions: [],
            removedIngredients: [],
            totalPrice: 24.0
          }
        ]
      });

      // 2. Open tracking modal
      setTrackedOrder(simOrder);
      audioService.playOrderBell();
    } catch (err) {
      console.error('Demo simulation error:', err);
    }
  };

  const scrollToMenu = () => {
    menuRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleRequestKitchen = () => {
    if (typeof window !== 'undefined' && sessionStorage.getItem('thalassa_kitchen_auth') === 'true') {
      setActiveView('kds');
    } else {
      setPinModalConfig({
        isOpen: true,
        target: 'kitchen',
        title: 'Senha da Cozinha (KDS)',
        subtitle: 'Digite a senha de 4 dígitos da cozinha (Padrão: 0000)',
        expectedPin: '0000',
        storageKey: 'thalassa_kitchen_auth'
      });
    }
  };

  const handleRequestAdmin = () => {
    if (typeof window !== 'undefined' && sessionStorage.getItem('thalassa_admin_auth') === 'true') {
      setActiveView('admin');
    } else {
      setPinModalConfig({
        isOpen: true,
        target: 'admin',
        title: 'Senha de Administrador',
        subtitle: 'Digite a senha de 4 dígitos do administrador (Padrão: 1234)',
        expectedPin: '1234',
        storageKey: 'thalassa_admin_auth'
      });
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#EAF3F1] dark:bg-[#081C26] text-[#0B2B3A] dark:text-[#E6F1EF] transition-colors">
      
      {/* 1. Header with View Switcher */}
      {restaurant && (
        <Header
          restaurant={restaurant}
          activeView={activeView}
          setActiveView={setActiveView}
          tableNumber={tableNumber}
          onOpenTableModal={() => setIsComandaModalOpen(true)}
          onOpenDemoTour={() => setIsDemoTourOpen(true)}
          onOpenPanelsModal={() => setIsPanelsModalOpen(true)}
          onRequestAdmin={handleRequestAdmin}
          onRequestKitchen={handleRequestKitchen}
          darkMode={darkMode}
          setDarkMode={setDarkMode}
          activeOrdersCount={orders.filter(o => o.status !== 'delivered' && o.status !== 'cancelled').length}
        />
      )}

      {/* VIEW: CLIENT CARDÁPIO */}
      {activeView === 'client' && (
        <main className="flex-1 pb-24">
          
          {/* Hero Banner with Greek Lettering and Highlights */}
          {restaurant && (
            <Hero
              restaurant={restaurant}
              featuredProducts={products.filter(p => p.tags.includes('Mais pedido') || p.promoPrice)}
              onSelectProduct={setSelectedProduct}
              onScrollToMenu={scrollToMenu}
              tableNumber={tableNumber}
            />
          )}

          {/* Table Identification Banner */}
          <TableBanner
            tableNumber={tableNumber}
            setTableNumber={setTableNumber}
            tables={tables}
            onOpenComandaModal={() => setIsComandaModalOpen(true)}
          />

          {/* Menu Navigation & Search */}
          <div ref={menuRef}>
            <MenuNav
              categories={categories}
              activeCategoryId={activeCategoryId}
              onSelectCategory={setActiveCategoryId}
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              activeFilter={activeFilter}
              setActiveFilter={setActiveFilter}
              sortBy={sortBy}
              setSortBy={setSortBy}
              productCountByCat={productCountByCat}
            />
          </div>

          {/* Product Grid */}
          <div className="max-w-7xl mx-auto px-4 py-6">
            {filteredProducts.length === 0 ? (
              <div className="text-center py-16 bg-white dark:bg-[#0F2B38] rounded-3xl border border-[#C5DAD6] dark:border-[#1E4252] p-8 space-y-3">
                <div className="text-3xl">🐟</div>
                <h3 className="font-serif text-xl font-bold">Nenhum prato encontrado</h3>
                <p className="text-xs text-[#4F6B75] dark:text-[#93B0B8] max-w-sm mx-auto">
                  Tente limpar os filtros ou buscar por outro termo como "camarão", "peixe", "moqueca" ou "risoto".
                </p>
                <button
                  onClick={() => {
                    setSearchTerm('');
                    setActiveFilter('all');
                    setActiveCategoryId('all');
                  }}
                  className="px-4 py-2 bg-[#1F7A8C] text-white rounded-xl text-xs font-semibold"
                >
                  Ver Todos os Pratos
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
                {filteredProducts.map(product => {
                  const inCartQty = cart
                    .filter(item => item.productId === product.id)
                    .reduce((sum, item) => sum + item.quantity, 0);

                  return (
                    <ProductCard
                      key={product.id}
                      product={product}
                      onOpenDetails={setSelectedProduct}
                      onQuickAdd={handleQuickAdd}
                      isFavorite={favorites.includes(product.id)}
                      onToggleFavorite={handleToggleFavorite}
                      cartQuantity={inCartQty}
                    />
                  );
                })}
              </div>
            )}
          </div>

          {/* Floating Sticky Cart Bar */}
          {cart.length > 0 && (
            <div className="fixed bottom-4 left-0 right-0 z-40 px-4 pointer-events-none">
              <div className="max-w-md mx-auto pointer-events-auto">
                <button
                  onClick={() => setIsCartOpen(true)}
                  className="w-full py-3.5 px-5 bg-gradient-to-r from-[#E8A33D] to-[#F3B353] hover:brightness-105 text-[#0B2B3A] font-bold rounded-2xl shadow-2xl flex items-center justify-between border-2 border-[#0B2B3A]/20 transition-all active:scale-95 cursor-pointer"
                  aria-label="Abrir comanda e carrinho"
                >
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-xl bg-[#0B2B3A] text-white flex items-center justify-center font-bold text-xs shadow-inner">
                      {totalCartCount}
                    </div>
                    <span className="text-sm font-serif font-bold tracking-wide">
                      Ver Pedido · {tableNumber ? `Mesa ${tableNumber}` : 'Balcão'}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 font-serif text-base font-bold">
                    <span>R$ {cartTotal.toFixed(2).replace('.', ',')}</span>
                    <ArrowRight className="w-4 h-4" />
                  </div>
                </button>
              </div>
            </div>
          )}

        </main>
      )}

      {/* VIEW: KDS KITCHEN */}
      {activeView === 'kds' && (
        <main className="flex-1">
          <KDSView
            orders={orders}
            onUpdateStatus={handleUpdateOrderStatus}
            onRefreshOrders={loadInitialData}
          />
        </main>
      )}

      {/* VIEW: ADMIN DASHBOARD */}
      {activeView === 'admin' && restaurant && (
        <main className="flex-1">
          <AdminView
            restaurant={restaurant}
            products={products}
            categories={categories}
            tables={tables}
            coupons={coupons}
            reviews={reviews}
            stats={stats}
            onToggleAvailability={handleToggleAvailability}
            onCreateProduct={handleCreateProduct}
            onUpdateProduct={handleUpdateProduct}
            onDeleteProduct={handleDeleteProduct}
            onCreateCategory={handleCreateCategory}
            onDeleteCategory={handleDeleteCategory}
            onUpdateRestaurant={handleUpdateRestaurant}
          />
        </main>
      )}

      {/* Footer */}
      <footer className="bg-[#0B2B3A] text-[#B9D3D8] text-xs py-6 border-t border-[#1E4252] text-center space-y-1">
        <p className="font-serif text-sm font-semibold text-white">
          Thalassa · Cozinha Caiçara & Frutos do Mar
        </p>
        <p>Av. Beira-Mar, 1420 - Peruíbe, SP · Telefone: (13) 3455-8900</p>
        <p className="text-[11px] text-[#4F6B75]">
          Sistema profissional de cardápio digital, comanda por QR code na mesa e KDS em tempo real.
        </p>
      </footer>

      {/* MODALS */}
      {/* 1. Product Customization Modal */}
      <ProductModal
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
        onAddToCart={handleAddToCart}
      />

      {/* 2. Cart Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cart}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveCartItem}
        onClearCart={handleClearCart}
        onProceedToCheckout={() => {
          setIsCartOpen(false);
          setIsCheckoutOpen(true);
        }}
        onQuickAddProduct={handleQuickAdd}
        upsellProducts={upsellProducts}
        appliedCoupon={appliedCoupon}
        onApplyCoupon={handleApplyCoupon}
        onRemoveCoupon={handleRemoveCoupon}
        couponDiscount={couponDiscount}
        includeServiceFee={includeServiceFee}
        setIncludeServiceFee={setIncludeServiceFee}
        tableNumber={tableNumber}
      />

      {/* 3. Checkout Modal with PIX & Delivery */}
      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        items={cart}
        tableNumber={tableNumber}
        subtotal={cartSubtotal}
        serviceFee={cartServiceFee}
        deliveryFee={0}
        discount={couponDiscount}
        couponCode={appliedCoupon?.code}
        finalTotal={cartTotal}
        restaurantPixKey={restaurant?.pixKey}
        onPlaceOrder={handlePlaceOrder}
        onOrderSuccess={handleOrderSuccess}
      />

      {/* 4. Order Live Tracking Modal */}
      <OrderTrackerModal
        order={trackedOrder}
        onClose={() => setTrackedOrder(null)}
        onOpenReview={setReviewOrder}
      />

      {/* 5. Shared Table Comanda Modal */}
      <TableComandaModal
        isOpen={isComandaModalOpen}
        onClose={() => setIsComandaModalOpen(false)}
        tableNumber={tableNumber}
        tableOrders={tableOrders}
        onOpenOrderTracker={setTrackedOrder}
      />

      {/* 6. Customer Review Modal */}
      <ReviewModal
        order={reviewOrder}
        onClose={() => setReviewOrder(null)}
        onSubmitReview={handleSubmitReview}
      />

      {/* 7. Demo Tour Modal */}
      <DemoTourModal
        isOpen={isDemoTourOpen}
        onClose={() => setIsDemoTourOpen(false)}
        onStartSimulation={handleStartSimulation}
        onSwitchView={setActiveView}
      />

      {/* 8. Separated Panels Link Modal */}
      <PanelsLinkModal
        isOpen={isPanelsModalOpen}
        onClose={() => setIsPanelsModalOpen(false)}
        tableNumber={tableNumber}
        onSelectView={(view) => {
          if (view === 'admin') {
            handleRequestAdmin();
          } else if (view === 'kds') {
            handleRequestKitchen();
          } else {
            setActiveView('client');
          }
        }}
      />

      {/* 9. Security PIN Modal (Kitchen 0000 or Admin 1234) */}
      {pinModalConfig && (
        <AdminPinModal
          isOpen={pinModalConfig.isOpen}
          onClose={() => setPinModalConfig(null)}
          target={pinModalConfig.target}
          title={pinModalConfig.title}
          subtitle={pinModalConfig.subtitle}
          expectedPin={pinModalConfig.expectedPin}
          storageKey={pinModalConfig.storageKey}
          onSuccess={() => {
            const nextView = pinModalConfig.target === 'kitchen' ? 'kds' : 'admin';
            setPinModalConfig(null);
            setActiveView(nextView);
          }}
        />
      )}

    </div>
  );
}
