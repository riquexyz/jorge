import express, { Request, Response } from 'express';
import { fileURLToPath } from 'url';
import path from 'path';
import {
  INITIAL_RESTAURANT_INFO,
  INITIAL_CATEGORIES,
  INITIAL_PRODUCTS,
  INITIAL_TABLES,
  INITIAL_COUPONS,
  INITIAL_ORDERS,
  INITIAL_REVIEWS
} from './src/data/initialData.ts';
import { Order, OrderStatus, Product, Category, Coupon, Review, TableInfo, RestaurantInfo } from './src/types.ts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const isProd = process.env.NODE_ENV === 'production';
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

const app = express();
app.use(express.json());

// In-Memory Database Store (Ready for PostgreSQL / Supabase migration)
const db = {
  restaurant: { ...INITIAL_RESTAURANT_INFO } as RestaurantInfo,
  categories: [...INITIAL_CATEGORIES] as Category[],
  products: [...INITIAL_PRODUCTS] as Product[],
  tables: [...INITIAL_TABLES] as TableInfo[],
  coupons: [...INITIAL_COUPONS] as Coupon[],
  orders: [...INITIAL_ORDERS] as Order[],
  reviews: [...INITIAL_REVIEWS] as Review[],
  lastOrderNumber: 1042
};

// SSE Connected Clients Pool for instant Real-time broadcasts
interface SSEClient {
  id: number;
  res: Response;
}
let sseClients: SSEClient[] = [];
let nextClientId = 1;

export function broadcastEvent(event: { type: string; payload: unknown }) {
  const data = `data: ${JSON.stringify(event)}\n\n`;
  sseClients.forEach(client => {
    try {
      client.res.write(data);
    } catch {
      // Failed client will be pruned on next heartbeat or close
    }
  });
}

// -------------------------------------------------------------
// SSE Real-Time Endpoint
// -------------------------------------------------------------
app.get('/api/events', (req: Request, res: Response) => {
  res.writeHead(200, {
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    'Connection': 'keep-alive',
    'Access-Control-Allow-Origin': '*'
  });

  const clientId = nextClientId++;
  sseClients.push({ id: clientId, res });

  // Send initial connection handshake
  res.write(`data: ${JSON.stringify({ type: 'CONNECTED', clientId })}\n\n`);

  req.on('close', () => {
    sseClients = sseClients.filter(c => c.id !== clientId);
  });
});

// -------------------------------------------------------------
// REST API Endpoints
// -------------------------------------------------------------

// 1. Restaurant Info
app.get('/api/restaurant', (_req: Request, res: Response) => {
  res.json(db.restaurant);
});

app.put('/api/restaurant', (req: Request, res: Response) => {
  db.restaurant = { ...db.restaurant, ...req.body };
  broadcastEvent({ type: 'RESTAURANT_UPDATED', payload: db.restaurant });
  res.json(db.restaurant);
});

// 2. Categories
app.get('/api/categories', (_req: Request, res: Response) => {
  const sorted = [...db.categories].sort((a, b) => a.displayOrder - b.displayOrder);
  res.json(sorted);
});

app.post('/api/categories', (req: Request, res: Response) => {
  const { name, description, iconName } = req.body;
  if (!name) {
    return res.status(400).json({ error: 'Nome da categoria é obrigatório' });
  }
  const newCat: Category = {
    id: `cat-${Date.now()}`,
    name,
    description: description || '',
    iconName: iconName || 'Utensils',
    displayOrder: db.categories.length + 1,
    active: true
  };
  db.categories.push(newCat);
  broadcastEvent({ type: 'CATEGORIES_UPDATED', payload: db.categories });
  res.status(201).json(newCat);
});

app.put('/api/categories/:id', (req: Request, res: Response) => {
  const { id } = req.params;
  const idx = db.categories.findIndex(c => c.id === id);
  if (idx === -1) {
    return res.status(404).json({ error: 'Categoria não encontrada' });
  }
  db.categories[idx] = { ...db.categories[idx], ...req.body };
  broadcastEvent({ type: 'CATEGORIES_UPDATED', payload: db.categories });
  res.json(db.categories[idx]);
});

app.delete('/api/categories/:id', (req: Request, res: Response) => {
  const { id } = req.params;
  db.categories = db.categories.filter(c => c.id !== id);
  broadcastEvent({ type: 'CATEGORIES_UPDATED', payload: db.categories });
  res.json({ success: true, id });
});

// 3. Products
app.get('/api/products', (_req: Request, res: Response) => {
  res.json(db.products);
});

app.post('/api/products', (req: Request, res: Response) => {
  const p = req.body;
  if (!p.name || !p.categoryId || typeof p.price !== 'number') {
    return res.status(400).json({ error: 'Nome, categoria e preço numérico são obrigatórios' });
  }
  const newProd: Product = {
    id: `prod-${Date.now()}`,
    categoryId: p.categoryId,
    name: p.name,
    description: p.description || '',
    price: Number(p.price),
    promoPrice: p.promoPrice ? Number(p.promoPrice) : undefined,
    imageUrl: p.imageUrl || 'https://images.unsplash.com/photo-1559847844-5315695dadae?auto=format&fit=crop&w=800&q=80',
    active: p.active !== false,
    preparationTimeMin: p.preparationTimeMin ? Number(p.preparationTimeMin) : 20,
    tags: Array.isArray(p.tags) ? p.tags : [],
    ingredients: Array.isArray(p.ingredients) ? p.ingredients : [],
    allergens: Array.isArray(p.allergens) ? p.allergens : [],
    optionGroups: Array.isArray(p.optionGroups) ? p.optionGroups : [],
    servesCount: p.servesCount ? Number(p.servesCount) : 1
  };
  db.products.push(newProd);
  broadcastEvent({ type: 'PRODUCTS_UPDATED', payload: db.products });
  res.status(201).json(newProd);
});

app.put('/api/products/:id', (req: Request, res: Response) => {
  const { id } = req.params;
  const idx = db.products.findIndex(p => p.id === id);
  if (idx === -1) {
    return res.status(404).json({ error: 'Produto não encontrado' });
  }
  db.products[idx] = { ...db.products[idx], ...req.body };
  broadcastEvent({ type: 'PRODUCTS_UPDATED', payload: db.products });
  res.json(db.products[idx]);
});

app.patch('/api/products/:id/toggle-availability', (req: Request, res: Response) => {
  const { id } = req.params;
  const prod = db.products.find(p => p.id === id);
  if (!prod) {
    return res.status(404).json({ error: 'Produto não encontrado' });
  }
  prod.active = !prod.active;
  broadcastEvent({ type: 'PRODUCT_AVAILABILITY_CHANGED', payload: { id: prod.id, active: prod.active } });
  res.json(prod);
});

app.delete('/api/products/:id', (req: Request, res: Response) => {
  const { id } = req.params;
  db.products = db.products.filter(p => p.id !== id);
  broadcastEvent({ type: 'PRODUCTS_UPDATED', payload: db.products });
  res.json({ success: true, id });
});

// 4. Tables & Comandas
app.get('/api/tables', (_req: Request, res: Response) => {
  // Compute real-time comanda total per table from active orders
  const updatedTables = db.tables.map(table => {
    const activeOrders = db.orders.filter(
      o => o.tableNumber === table.number && o.status !== 'delivered' && o.status !== 'cancelled'
    );
    const totalSpent = activeOrders.reduce((acc, curr) => acc + curr.total, 0);
    return {
      ...table,
      status: activeOrders.length > 0 ? ('occupied' as const) : ('available' as const),
      activeComandaTotal: totalSpent,
      activeOrdersCount: activeOrders.length
    };
  });
  res.json(updatedTables);
});

app.get('/api/tables/:tableNumber/comanda', (req: Request, res: Response) => {
  const { tableNumber } = req.params;
  const tableOrders = db.orders.filter(
    o => o.tableNumber === tableNumber && o.status !== 'cancelled'
  );
  const total = tableOrders.reduce((sum, o) => sum + o.total, 0);
  res.json({
    tableNumber,
    orders: tableOrders,
    total,
    ordersCount: tableOrders.length
  });
});

// 5. Coupons
app.post('/api/coupons/validate', (req: Request, res: Response) => {
  const { code, subtotal } = req.body;
  if (!code) {
    return res.status(400).json({ valid: false, message: 'Código de cupom não informado' });
  }
  const coupon = db.coupons.find(c => c.code.toUpperCase() === String(code).trim().toUpperCase() && c.active);
  if (!coupon) {
    return res.status(404).json({ valid: false, message: 'Cupom inválido ou expirado' });
  }
  if (coupon.minOrderValue && subtotal < coupon.minOrderValue) {
    return res.status(400).json({
      valid: false,
      message: `Válido para pedidos acima de R$ ${coupon.minOrderValue.toFixed(2).replace('.', ',')}`
    });
  }

  let discount = 0;
  if (coupon.discountType === 'percentage') {
    discount = (subtotal * coupon.value) / 100;
  } else {
    discount = coupon.value;
  }
  discount = Math.min(discount, subtotal);

  res.json({
    valid: true,
    coupon,
    discount: Number(discount.toFixed(2))
  });
});

// 6. Orders
app.get('/api/orders', (req: Request, res: Response) => {
  const { table, status } = req.query;
  let result = [...db.orders];
  if (table) {
    result = result.filter(o => o.tableNumber === String(table));
  }
  if (status) {
    result = result.filter(o => o.status === String(status));
  }
  // Sort newest first
  result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  res.json(result);
});

app.get('/api/orders/:id', (req: Request, res: Response) => {
  const order = db.orders.find(o => o.id === req.params.id);
  if (!order) {
    return res.status(404).json({ error: 'Pedido não encontrado' });
  }
  res.json(order);
});

// SECURITY & BUSINESS RULE: NEVER trust client price totals. Recalculate on server!
app.post('/api/orders', (req: Request, res: Response) => {
  const body = req.body;
  if (!body.items || !Array.isArray(body.items) || body.items.length === 0) {
    return res.status(400).json({ error: 'O pedido deve conter pelo menos 1 item' });
  }

  let calculatedSubtotal = 0;
  const verifiedItems = [];

  for (const item of body.items) {
    const product = db.products.find(p => p.id === item.productId);
    if (!product) {
      return res.status(400).json({ error: `Produto não encontrado: ${item.productId}` });
    }
    if (!product.active) {
      return res.status(400).json({ error: `O produto "${product.name}" está indisponível no momento.` });
    }

    const basePrice = (typeof product.promoPrice === 'number' && product.promoPrice > 0)
      ? product.promoPrice
      : product.price;

    let optionsTotal = 0;
    const verifiedOptions: { groupName: string; optionName: string; price: number }[] = [];

    if (Array.isArray(item.selectedOptions)) {
      for (const sel of item.selectedOptions) {
        // Validate against product options if group exists
        let optPrice = 0;
        if (product.optionGroups) {
          for (const g of product.optionGroups) {
            const match = g.options.find(o => o.name === sel.optionName);
            if (match) {
              optPrice = match.price;
              break;
            }
          }
        }
        optionsTotal += optPrice;
        verifiedOptions.push({
          groupName: sel.groupName || '',
          optionName: sel.optionName,
          price: optPrice
        });
      }
    }

    const itemUnitPrice = basePrice + optionsTotal;
    const qty = Math.max(1, parseInt(item.quantity, 10) || 1);
    const lineTotal = itemUnitPrice * qty;

    calculatedSubtotal += lineTotal;
    verifiedItems.push({
      productId: product.id,
      productName: product.name,
      quantity: qty,
      unitPrice: Number(itemUnitPrice.toFixed(2)),
      selectedOptions: verifiedOptions,
      removedIngredients: Array.isArray(item.removedIngredients) ? item.removedIngredients : [],
      notes: item.notes ? String(item.notes).slice(0, 300) : undefined,
      totalPrice: Number(lineTotal.toFixed(2))
    });
  }

  // Calculate fees and discounts
  const orderType = body.orderType || 'local';
  const serviceFee = (orderType === 'local' && body.includeServiceFee !== false)
    ? Number((calculatedSubtotal * 0.10).toFixed(2))
    : 0;
  const deliveryFee = orderType === 'delivery' ? 12.0 : 0;

  let discount = 0;
  let appliedCouponCode: string | undefined = undefined;

  if (body.couponCode) {
    const coupon = db.coupons.find(
      c => c.code.toUpperCase() === String(body.couponCode).trim().toUpperCase() && c.active
    );
    if (coupon && (!coupon.minOrderValue || calculatedSubtotal >= coupon.minOrderValue)) {
      appliedCouponCode = coupon.code;
      if (coupon.discountType === 'percentage') {
        discount = Number(((calculatedSubtotal * coupon.value) / 100).toFixed(2));
      } else {
        discount = coupon.value;
      }
      discount = Math.min(discount, calculatedSubtotal);
    }
  }

  const finalTotal = Math.max(0, calculatedSubtotal + serviceFee + deliveryFee - discount);

  db.lastOrderNumber += 1;
  const orderNumber = db.lastOrderNumber;
  const newOrder: Order = {
    id: `ord-${orderNumber}`,
    orderNumber,
    orderType,
    tableNumber: orderType === 'local' ? (body.tableNumber ? String(body.tableNumber) : 'Balcão') : undefined,
    customerName: body.customerName ? String(body.customerName).trim() : 'Cliente Thalassa',
    customerPhone: body.customerPhone ? String(body.customerPhone).trim() : '',
    deliveryAddress: orderType === 'delivery' ? body.deliveryAddress : undefined,
    items: verifiedItems,
    subtotal: Number(calculatedSubtotal.toFixed(2)),
    serviceFee,
    deliveryFee,
    discount,
    couponCode: appliedCouponCode,
    total: Number(finalTotal.toFixed(2)),
    status: 'received',
    paymentMethod: body.paymentMethod || 'pix',
    paymentStatus: body.paymentStatus === 'paid' ? 'paid' : (body.paymentMethod === 'pix' ? 'paid' : 'pending'),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    estimatedMinutes: 25,
    customerNotes: body.customerNotes ? String(body.customerNotes).slice(0, 500) : undefined
  };

  db.orders.unshift(newOrder);

  // Broadcast to all clients (KDS, Admin, Customer)
  broadcastEvent({ type: 'NEW_ORDER', payload: newOrder });

  res.status(201).json(newOrder);
});

// Update order status (KDS Kitchen transitions)
app.patch('/api/orders/:id/status', (req: Request, res: Response) => {
  const { id } = req.params;
  const { status } = req.body;
  const validStatuses: OrderStatus[] = ['received', 'confirmed', 'preparing', 'ready', 'delivered', 'cancelled'];
  if (!validStatuses.includes(status)) {
    return res.status(400).json({ error: `Status inválido: ${status}` });
  }

  const order = db.orders.find(o => o.id === id);
  if (!order) {
    return res.status(404).json({ error: 'Pedido não encontrado' });
  }

  order.status = status as OrderStatus;
  order.updatedAt = new Date().toISOString();

  // If delivered, mark payment as paid if on table
  if (status === 'delivered') {
    order.paymentStatus = 'paid';
  }

  broadcastEvent({ type: 'ORDER_STATUS_CHANGED', payload: order });
  res.json(order);
});

// Update payment status
app.patch('/api/orders/:id/payment', (req: Request, res: Response) => {
  const { id } = req.params;
  const { paymentStatus } = req.body;
  const order = db.orders.find(o => o.id === id);
  if (!order) {
    return res.status(404).json({ error: 'Pedido não encontrado' });
  }
  order.paymentStatus = paymentStatus === 'paid' ? 'paid' : 'pending';
  order.updatedAt = new Date().toISOString();
  broadcastEvent({ type: 'ORDER_PAYMENT_CHANGED', payload: order });
  res.json(order);
});

// 7. Reviews
app.get('/api/reviews', (_req: Request, res: Response) => {
  const sorted = [...db.reviews].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  res.json(sorted);
});

app.post('/api/reviews', (req: Request, res: Response) => {
  const { orderId, orderNumber, customerName, rating, comment } = req.body;
  if (!rating || rating < 1 || rating > 5) {
    return res.status(400).json({ error: 'Avaliação deve ser entre 1 e 5 estrelas' });
  }
  const newReview: Review = {
    id: `rev-${Date.now()}`,
    orderId: orderId || '',
    orderNumber: Number(orderNumber) || 0,
    customerName: customerName || 'Cliente Anônimo',
    rating: Number(rating),
    comment: comment || '',
    createdAt: new Date().toISOString()
  };
  db.reviews.unshift(newReview);

  // Mark order as reviewed if matching
  const matchingOrder = db.orders.find(o => o.id === orderId);
  if (matchingOrder) {
    matchingOrder.reviewed = true;
  }

  broadcastEvent({ type: 'NEW_REVIEW', payload: newReview });
  res.status(201).json(newReview);
});

// 8. Stats for Admin Dashboard
app.get('/api/stats', (_req: Request, res: Response) => {
  const completedOrders = db.orders.filter(o => o.status !== 'cancelled');
  const revenue = completedOrders.reduce((sum, o) => sum + o.total, 0);
  const avgTicket = completedOrders.length > 0 ? revenue / completedOrders.length : 0;
  const cancelledCount = db.orders.filter(o => o.status === 'cancelled').length;

  // Product popularity
  const countMap: Record<string, { name: string; quantity: number; revenue: number }> = {};
  completedOrders.forEach(o => {
    o.items.forEach(item => {
      if (!countMap[item.productId]) {
        countMap[item.productId] = { name: item.productName, quantity: 0, revenue: 0 };
      }
      countMap[item.productId].quantity += item.quantity;
      countMap[item.productId].revenue += item.totalPrice;
    });
  });

  const topProducts = Object.values(countMap)
    .sort((a, b) => b.quantity - a.quantity)
    .slice(0, 5);

  res.json({
    totalOrdersToday: db.orders.length,
    activeOrders: db.orders.filter(o => o.status !== 'delivered' && o.status !== 'cancelled').length,
    totalRevenue: Number(revenue.toFixed(2)),
    averageTicket: Number(avgTicket.toFixed(2)),
    cancelledOrders: cancelledCount,
    averagePrepTimeMinutes: 24,
    topProducts,
    totalCustomersServed: completedOrders.length * 2
  });
});

// -------------------------------------------------------------
// Vite Integration (Dev middleware or Static dist)
// -------------------------------------------------------------
async function startServer() {
  if (!isProd) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[Thalassa Server] Servidor ouvindo em http://0.0.0.0:${PORT}`);
  });
}

startServer().catch(err => {
  console.error('[Thalassa Server] Falha ao iniciar:', err);
  process.exit(1);
});
