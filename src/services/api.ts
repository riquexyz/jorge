import { Category, Product, Order, TableInfo, Coupon, Review, RestaurantInfo, OrderStatus } from '../types';
import {
  INITIAL_CATEGORIES,
  INITIAL_PRODUCTS,
  INITIAL_RESTAURANT_INFO,
  INITIAL_TABLES,
  INITIAL_COUPONS,
  INITIAL_ORDERS,
  INITIAL_REVIEWS
} from '../data/initialData';

export type EventCallback = (event: { type: string; payload: unknown }) => void;

class ApiService {
  private eventListeners: EventCallback[] = [];
  private eventSource: EventSource | null = null;
  private isConnectingSSE = false;

  constructor() {
    this.initSSE();
  }

  private initSSE() {
    if (typeof window === 'undefined' || this.isConnectingSSE) return;
    this.isConnectingSSE = true;

    try {
      this.eventSource = new EventSource('/api/events');
      
      this.eventSource.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          this.eventListeners.forEach(listener => listener(data));
        } catch (err) {
          console.error('[SSE parse error]', err);
        }
      };

      this.eventSource.onerror = () => {
        // Will automatically retry connecting
        this.eventSource?.close();
        setTimeout(() => {
          this.isConnectingSSE = false;
          this.initSSE();
        }, 5000);
      };
    } catch {
      this.isConnectingSSE = false;
    }
  }

  public subscribeToEvents(callback: EventCallback): () => void {
    this.eventListeners.push(callback);
    return () => {
      this.eventListeners = this.eventListeners.filter(cb => cb !== callback);
    };
  }

  // Restaurant Info
  async getRestaurant(): Promise<RestaurantInfo> {
    try {
      const res = await fetch('/api/restaurant');
      if (!res.ok) throw new Error('Falha ao buscar dados do restaurante');
      return await res.json();
    } catch {
      return INITIAL_RESTAURANT_INFO;
    }
  }

  async updateRestaurant(info: Partial<RestaurantInfo>): Promise<RestaurantInfo> {
    const res = await fetch('/api/restaurant', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(info)
    });
    return await res.json();
  }

  // Categories
  async getCategories(): Promise<Category[]> {
    try {
      const res = await fetch('/api/categories');
      if (!res.ok) throw new Error('Falha ao buscar categorias');
      return await res.json();
    } catch {
      return INITIAL_CATEGORIES;
    }
  }

  async createCategory(cat: Partial<Category>): Promise<Category> {
    const res = await fetch('/api/categories', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(cat)
    });
    return await res.json();
  }

  async updateCategory(id: string, cat: Partial<Category>): Promise<Category> {
    const res = await fetch(`/api/categories/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(cat)
    });
    return await res.json();
  }

  async deleteCategory(id: string): Promise<boolean> {
    const res = await fetch(`/api/categories/${id}`, { method: 'DELETE' });
    return res.ok;
  }

  // Products
  async getProducts(): Promise<Product[]> {
    try {
      const res = await fetch('/api/products');
      if (!res.ok) throw new Error('Falha ao buscar produtos');
      return await res.json();
    } catch {
      return INITIAL_PRODUCTS;
    }
  }

  async createProduct(product: Partial<Product>): Promise<Product> {
    const res = await fetch('/api/products', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(product)
    });
    return await res.json();
  }

  async updateProduct(id: string, product: Partial<Product>): Promise<Product> {
    const res = await fetch(`/api/products/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(product)
    });
    return await res.json();
  }

  async toggleProductAvailability(id: string): Promise<Product> {
    const res = await fetch(`/api/products/${id}/toggle-availability`, {
      method: 'PATCH'
    });
    return await res.json();
  }

  async deleteProduct(id: string): Promise<boolean> {
    const res = await fetch(`/api/products/${id}`, { method: 'DELETE' });
    return res.ok;
  }

  // Tables
  async getTables(): Promise<TableInfo[]> {
    try {
      const res = await fetch('/api/tables');
      if (!res.ok) throw new Error('Falha ao buscar mesas');
      return await res.json();
    } catch {
      return INITIAL_TABLES;
    }
  }

  async getTableComanda(tableNumber: string): Promise<{
    tableNumber: string;
    orders: Order[];
    total: number;
    ordersCount: number;
  }> {
    try {
      const res = await fetch(`/api/tables/${tableNumber}/comanda`);
      if (!res.ok) throw new Error('Falha ao buscar comanda');
      return await res.json();
    } catch {
      const orders = INITIAL_ORDERS.filter(o => o.tableNumber === tableNumber);
      return {
        tableNumber,
        orders,
        total: orders.reduce((s, o) => s + o.total, 0),
        ordersCount: orders.length
      };
    }
  }

  // Orders
  async getOrders(params?: { table?: string; status?: string }): Promise<Order[]> {
    try {
      const query = new URLSearchParams();
      if (params?.table) query.set('table', params.table);
      if (params?.status) query.set('status', params.status);
      const res = await fetch(`/api/orders?${query.toString()}`);
      if (!res.ok) throw new Error('Falha ao buscar pedidos');
      return await res.json();
    } catch {
      return INITIAL_ORDERS;
    }
  }

  async getOrder(id: string): Promise<Order | null> {
    try {
      const res = await fetch(`/api/orders/${id}`);
      if (!res.ok) throw new Error('Pedido não encontrado');
      return await res.json();
    } catch {
      return INITIAL_ORDERS.find(o => o.id === id) || null;
    }
  }

  async createOrder(orderData: unknown): Promise<Order> {
    const res = await fetch('/api/orders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(orderData)
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({ error: 'Erro ao criar pedido' }));
      throw new Error(err.error || 'Erro ao processar pedido no servidor');
    }
    return await res.json();
  }

  async updateOrderStatus(id: string, status: OrderStatus): Promise<Order> {
    const res = await fetch(`/api/orders/${id}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status })
    });
    if (!res.ok) {
      throw new Error('Falha ao atualizar status do pedido');
    }
    return await res.json();
  }

  async updateOrderPayment(id: string, paymentStatus: 'paid' | 'pending'): Promise<Order> {
    const res = await fetch(`/api/orders/${id}/payment`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ paymentStatus })
    });
    return await res.json();
  }

  // Coupons
  async validateCoupon(code: string, subtotal: number): Promise<{
    valid: boolean;
    coupon?: Coupon;
    discount?: number;
    message?: string;
  }> {
    try {
      const res = await fetch('/api/coupons/validate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code, subtotal })
      });
      return await res.json();
    } catch {
      const c = INITIAL_COUPONS.find(item => item.code.toUpperCase() === code.toUpperCase());
      if (c && (!c.minOrderValue || subtotal >= c.minOrderValue)) {
        const discount = c.discountType === 'percentage' ? (subtotal * c.value) / 100 : c.value;
        return { valid: true, coupon: c, discount: Math.min(discount, subtotal) };
      }
      return { valid: false, message: 'Cupom inválido' };
    }
  }

  // Reviews
  async getReviews(): Promise<Review[]> {
    try {
      const res = await fetch('/api/reviews');
      if (!res.ok) throw new Error('Falha ao buscar avaliações');
      return await res.json();
    } catch {
      return INITIAL_REVIEWS;
    }
  }

  async submitReview(review: {
    orderId?: string;
    orderNumber?: number;
    customerName: string;
    rating: number;
    comment: string;
  }): Promise<Review> {
    const res = await fetch('/api/reviews', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(review)
    });
    return await res.json();
  }

  // Stats
  async getStats(): Promise<{
    totalOrdersToday: number;
    activeOrders: number;
    totalRevenue: number;
    averageTicket: number;
    cancelledOrders: number;
    averagePrepTimeMinutes: number;
    topProducts: { name: string; quantity: number; revenue: number }[];
    totalCustomersServed: number;
  }> {
    try {
      const res = await fetch('/api/stats');
      if (!res.ok) throw new Error('Falha ao carregar métricas');
      return await res.json();
    } catch {
      return {
        totalOrdersToday: 18,
        activeOrders: 3,
        totalRevenue: 2840.0,
        averageTicket: 157.7,
        cancelledOrders: 1,
        averagePrepTimeMinutes: 24,
        topProducts: [
          { name: 'Moqueca Caiçara Mista', quantity: 12, revenue: 1848 },
          { name: 'Camarão na Moranga', quantity: 9, revenue: 1116 },
          { name: 'Robalo Grelhado na Brasa', quantity: 7, revenue: 658 },
          { name: 'Burger Thalassa Costeiro', quantity: 14, revenue: 658 }
        ],
        totalCustomersServed: 42
      };
    }
  }
}

export const api = new ApiService();
