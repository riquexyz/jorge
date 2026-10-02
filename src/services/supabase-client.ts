// src/services/supabase.ts
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('⚠️ Variáveis Supabase não configuradas. Usando fallback em memória.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// ============================================
// Funções Helper para usar no seu código
// ============================================

export async function fetchOrders() {
  try {
    const { data, error } = await supabase
      .from('orders')
      .select(`
        *,
        order_items(
          *,
          order_item_options(*)
        )
      `)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  } catch (err) {
    console.error('Erro ao buscar pedidos:', err);
    return [];
  }
}

export async function fetchProducts() {
  try {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('active', true)
      .order('category_id');

    if (error) throw error;
    return data || [];
  } catch (err) {
    console.error('Erro ao buscar produtos:', err);
    return [];
  }
}

export async function fetchCategories() {
  try {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .eq('active', true)
      .order('display_order');

    if (error) throw error;
    return data || [];
  } catch (err) {
    console.error('Erro ao buscar categorias:', err);
    return [];
  }
}

export async function createOrder(orderData: any) {
  try {
    const { data, error } = await supabase
      .from('orders')
      .insert([orderData])
      .select()
      .single();

    if (error) throw error;
    
    // Insere os items do pedido
    if (orderData.items && data) {
      for (const item of orderData.items) {
        await supabase.from('order_items').insert([
          {
            id: `oi-${Date.now()}-${Math.random()}`,
            order_id: data.id,
            product_id: item.productId,
            product_name: item.productName,
            quantity: item.quantity,
            unit_price: item.unitPrice,
            total_price: item.totalPrice,
            removed_ingredients: item.removedIngredients,
            notes: item.notes
          }
        ]);

        // Insere as opções do item
        if (item.selectedOptions && item.selectedOptions.length > 0) {
          for (const option of item.selectedOptions) {
            await supabase.from('order_item_options').insert([
              {
                id: `oo-${Date.now()}-${Math.random()}`,
                order_item_id: `oi-${Date.now()}-${Math.random()}`,
                group_name: option.groupName,
                option_name: option.optionName,
                price: option.price
              }
            ]);
          }
        }
      }
    }

    return data;
  } catch (err) {
    console.error('Erro ao criar pedido:', err);
    throw err;
  }
}

export async function updateOrderStatus(orderId: string, status: string) {
  try {
    const { data, error } = await supabase
      .from('orders')
      .update({ 
        status, 
        updated_at: new Date().toISOString() 
      })
      .eq('id', orderId)
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (err) {
    console.error('Erro ao atualizar status:', err);
    throw err;
  }
}

export async function validateCoupon(code: string, subtotal: number) {
  try {
    const { data, error } = await supabase
      .from('coupons')
      .select('*')
      .eq('code', code.toUpperCase())
      .eq('active', true)
      .single();

    if (error) {
      return {
        valid: false,
        message: 'Cupom não encontrado'
      };
    }

    if (data.min_order_value && subtotal < data.min_order_value) {
      return {
        valid: false,
        message: `Pedido mínimo de R$ ${data.min_order_value}`
      };
    }

    let discount = 0;
    if (data.discount_type === 'percentage') {
      discount = (subtotal * data.value) / 100;
    } else {
      discount = data.value;
    }

    return {
      valid: true,
      discount: Math.min(discount, subtotal),
      message: 'Cupom aplicado com sucesso!'
    };
  } catch (err) {
    console.error('Erro ao validar cupom:', err);
    return {
      valid: false,
      message: 'Erro ao validar cupom'
    };
  }
}

export async function submitReview(review: any) {
  try {
    const { data, error } = await supabase
      .from('reviews')
      .insert([
        {
          id: `rev-${Date.now()}`,
          order_id: review.orderId,
          order_number: review.orderNumber,
          customer_name: review.customerName,
          rating: review.rating,
          comment: review.comment,
          created_at: new Date().toISOString()
        }
      ])
      .select()
      .single();

    if (error) throw error;

    // Marca order como revisada
    if (review.orderId) {
      await supabase
        .from('orders')
        .update({ reviewed: true })
        .eq('id', review.orderId);
    }

    return data;
  } catch (err) {
    console.error('Erro ao salvar avaliação:', err);
    throw err;
  }
}

export async function subscribeToOrders(callback: (orders: any[]) => void) {
  return supabase
    .from('orders')
    .on('*', (payload) => {
      console.log('Pedido atualizado:', payload);
      // Recarrega a lista
      fetchOrders().then(callback);
    })
    .subscribe();
}
