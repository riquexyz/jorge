export type OrderType = 'local' | 'pickup' | 'delivery';

export type OrderStatus =
  | 'received'    // Pedido recebido pelo sistema
  | 'confirmed'   // Restaurante aceitou
  | 'preparing'   // Cozinha iniciou o preparo
  | 'ready'       // Pronto para entrega / garçom levar
  | 'delivered'   // Entregue ao cliente
  | 'cancelled';  // Cancelado

export type PaymentMethod =
  | 'pix'
  | 'credit'
  | 'debit'
  | 'cash'
  | 'table'
  | 'counter';

export type PaymentStatus = 'pending' | 'paid';

export interface ProductOption {
  id: string;
  name: string;
  price: number;
  available?: boolean;
}

export interface ProductOptionGroup {
  id: string;
  name: string;
  description?: string;
  type: 'single' | 'multiple';
  required: boolean;
  min?: number;
  max?: number;
  options: ProductOption[];
}

export interface Product {
  id: string;
  categoryId: string;
  name: string;
  description: string;
  price: number;
  promoPrice?: number;
  imageUrl: string;
  active: boolean;
  preparationTimeMin: number;
  tags: string[]; // 'Mais pedido', 'Novo', 'Promoção', 'Vegetariano', 'Vegano', 'Sem glúten', 'Sem lactose'
  ingredients: string[];
  allergens: string[];
  optionGroups?: ProductOptionGroup[];
  servesCount?: number;
}

export interface Category {
  id: string;
  name: string;
  description: string;
  iconName?: string;
  displayOrder: number;
  active: boolean;
}

export interface SelectedOption {
  groupName: string;
  optionName: string;
  price: number;
}

export interface CartItem {
  cartItemId: string;
  productId: string;
  product: Product;
  quantity: number;
  selectedOptions: SelectedOption[];
  notes: string;
  removedIngredients: string[];
  unitPrice: number;
  itemTotal: number;
}

export interface OrderItem {
  id?: string;
  productId: string;
  productName: string;
  quantity: number;
  unitPrice: number;
  selectedOptions: SelectedOption[];
  removedIngredients?: string[];
  notes?: string;
  totalPrice: number;
}

export interface DeliveryAddress {
  cep: string;
  street: string;
  number: string;
  complement?: string;
  neighborhood: string;
  city?: string;
  reference?: string;
}

export interface Order {
  id: string;
  orderNumber: number;
  orderType: OrderType;
  tableNumber?: string;
  customerName: string;
  customerPhone: string;
  deliveryAddress?: DeliveryAddress;
  items: OrderItem[];
  subtotal: number;
  serviceFee: number;
  deliveryFee: number;
  discount: number;
  couponCode?: string;
  total: number;
  status: OrderStatus;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  createdAt: string;
  updatedAt: string;
  estimatedMinutes: number;
  customerNotes?: string;
  reviewed?: boolean;
}

export interface TableInfo {
  id: string;
  number: string;
  name: string;
  capacity: number;
  qrCodeUrl: string;
  status: 'available' | 'occupied' | 'reserved';
  activeComandaTotal?: number;
  activeOrdersCount?: number;
}

export interface Coupon {
  id: string;
  code: string;
  discountType: 'percentage' | 'fixed';
  value: number;
  minOrderValue?: number;
  description: string;
  active: boolean;
}

export interface Review {
  id: string;
  orderId: string;
  orderNumber: number;
  customerName: string;
  rating: number; // 1 - 5
  comment: string;
  createdAt: string;
}

export interface RestaurantInfo {
  name: string;
  greekName: string;
  subtitle: string;
  tagline: string;
  isOpen: boolean;
  opensAt: string;
  closesAt: string;
  avgPrepTime: string;
  rating: number;
  reviewCount: number;
  address: string;
  neighborhood: string;
  city: string;
  mapsUrl: string;
  whatsapp: string;
  phone: string;
  instagram: string;
  acceptedPaymentMethods: string[];
  pixKey?: string;
}
