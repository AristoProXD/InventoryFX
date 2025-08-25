// ===== PRODUCTO =====
export interface Product {
  id: string;
  name: string;
  description: string; // Descripción corta, editable
  category: string;    // Categoría, editable, enlaza con Category
  color: string;       // Color diferenciador, formato HEX, editable
  sku: string;         // QV (puntos) en la interfaz
  stock: number;
  minStock: number;
  price: number;
  location: string;
  supplier: string;
  lastUpdated: string;
  status: 'active' | 'inactive' | 'low_stock' | 'out_of_stock';
  order?: number; // Orden de aparición en la UI
}

// MOVIMIENTO DE PRODUCTO (egreso/venta)
export interface ProductMovement {
  id: string;
  product_id: string;
  quantity: number;
  type: 'egreso' | 'ingreso';
  created_at: string;
}

// ===== USUARIO FAMILIAR =====
export interface User {
  username: string;
  name: string;
  loginTime: string;
}

// ===== DEUDA =====
export interface Debt {
  id: string;
  type: 'owe_us' | 'we_owe'; // nos deben | debemos
  personName: string;
  productName: string;
  quantity: number;
  unitPrice: number;
  totalAmount: number;
  description: string;
  date: string;
  status: 'pending' | 'paid' | 'cancelled';
}
