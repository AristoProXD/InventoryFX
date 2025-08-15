// Tipos para listas de clientes
type ListaProducto = { id: string; name: string; cantidad: number; price: number; qv: number };
type ListaCliente = {
  id: string;
  nombre: string;
  fecha: string;
  direccion: string;
  productos: ListaProducto[];
  created_at?: string;
  updated_at?: string;
};
// Backup de la configuración actual del componente InventoryApp
// Nombre: Inventario Completo

"use client";

import { useState, useLayoutEffect, useEffect } from 'react';
import { supabase, getProducts, addProduct, updateProductStock, getDebts, getListasClientes } from '../lib/supabase';
import { Plus, Minus, Edit2, Trash2, Box, LogOut } from 'lucide-react';

const PRODUCT_CATEGORIES = [
  'Limpia',
  'Nutrición y Regeneración',
  'Energía y Revitalización',
  'Inmunológica',
  'Control de Peso',
  'Anti-Edad',
  'Virgor Mental',
  'Sport',
  'Gastronomia',
  'Cosmecéutica',
  'Auxiliar de Venta'
];

// Productos iniciales eliminados, todo desde Supabase



function getStatusText(product: any) {
  if (product.stock === 0) return 'Sin stock';
  if (product.stock === 1) return 'Bajo stock';
  return 'Activo';
}

const TABS = [
  { key: 'inventario', label: '📦 Inventario' },
  { key: 'cuentas', label: '💰 Cuentas' },
  { key: 'listas', label: '📝 Listas de clientes' }
];

export default function InventoryApp() {
  // Tema claro/oscuro
  // Forzar modo oscuro siempre
  useLayoutEffect(() => {
    document.documentElement.classList.add('dark');
    localStorage.setItem('theme', 'dark');
  }, []);
  // Función para salir (logout simple)
  function handleLogout() {
    localStorage.clear();
    window.location.reload();
  }
  const [activeTab, setActiveTab] = useState('inventario');
  // Inventario, cuentas y listas: sincronización en tiempo real
  const [products, setProducts] = useState<any[]>([]);
  const [cuentas, setCuentas] = useState<any[]>([]);
  const [listas, setListas] = useState<any[]>([]);
  const [syncStatus, setSyncStatus] = useState<'loading'|'ok'|'error'>('loading');

  useEffect(() => {
    let channels: any[] = [];
    async function fetchAll() {
      setSyncStatus('loading');
      const [prods, debts, listasC] = await Promise.all([
        getProducts(),
        getDebts(),
        getListasClientes()
      ]);
      if (prods) setProducts(prods);
      if (debts) setCuentas(debts);
      if (listasC) setListas(listasC);
      setSyncStatus(prods && debts && listasC ? 'ok' : 'error');
    }
    fetchAll();
    if (supabase) {
      channels.push(
        supabase.channel('products-changes')
          .on('postgres_changes', { event: '*', schema: 'public', table: 'products' }, fetchAll)
          .subscribe()
      );
      channels.push(
        supabase.channel('debts-changes')
          .on('postgres_changes', { event: '*', schema: 'public', table: 'debts' }, fetchAll)
          .subscribe()
      );
      channels.push(
        supabase.channel('listas-clientes-changes')
          .on('postgres_changes', { event: '*', schema: 'public', table: 'listas_clientes' }, fetchAll)
          .subscribe()
      );
    }
    return () => { channels.forEach(ch => ch && supabase && supabase.removeChannel(ch)); };
  }, []);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [lowStockFilter, setLowStockFilter] = useState(false);
  const [showProductForm, setShowProductForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<string | null>(null);
  const [productForm, setProductForm] = useState({
    name: '',
    description: '',
    category: '',
    color: '#1e293b',
    price: '',
    qv: '',
    stock: ''
  });
  const [formError, setFormError] = useState<string | null>(null);

  // Estados para Cuentas
  type CuentaProducto = { id: string; name: string; cantidad: number; price: number };
  type Cuenta = {
    id: string;
    nombre: string;
    fecha: string;
    tipo: 'Monto' | 'Productos';
    monto?: number;
    productos?: CuentaProducto[];
    estado: 'Pendiente' | 'Cancelado';
  };
  const [showCuentaForm, setShowCuentaForm] = useState(false);
  const [editingCuenta, setEditingCuenta] = useState<string | null>(null);
  const [cuentaForm, setCuentaForm] = useState<{
    nombre: string;
    fecha: string;
    tipo: 'Monto' | 'Productos';
    monto: string;
    productos: CuentaProducto[];
    estado: 'Pendiente' | 'Cancelado';
  }>({
    nombre: '',
    fecha: '',
    tipo: 'Monto',
    monto: '',
    productos: [],
    estado: 'Pendiente',
  });
  const [cuentaFormError, setCuentaFormError] = useState<string | null>(null);
  // --- Cuentas helpers (form/product logic, only one set) ---
  function handleCuentaFormChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
    const { name, value } = e.target;
    setCuentaForm(prev => ({ ...prev, [name]: value }));
    setCuentaFormError(null);
  }

  function handleCuentaTipoChange(tipo: 'Monto' | 'Productos') {
    setCuentaForm(prev => ({ ...prev, tipo, monto: '', productos: [] }));
    setCuentaFormError(null);
  }

  function handleCuentaProductoAdd() {
    if (products.length === 0) return;
    setCuentaForm(prev => ({
      ...prev,
      productos: [
        ...prev.productos,
        { id: products[0].id, name: products[0].name, cantidad: 1, price: products[0].price }
      ]
    }));
  }

  function handleCuentaProductoChange(idx: number, field: 'id' | 'cantidad') {
    return (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      setCuentaForm(prev => {
        const productos = [...prev.productos];
        if (field === 'id') {
          const prod = products.find(p => p.id === e.target.value);
          if (prod) {
            productos[idx] = { id: prod.id, name: prod.name, cantidad: productos[idx].cantidad, price: prod.price };
          }
        } else if (field === 'cantidad') {
          productos[idx] = { ...productos[idx], cantidad: Math.max(1, Number(e.target.value)) };
        }
        return { ...prev, productos };
      });
    };
  }

  function handleCuentaProductoRemove(idx: number) {
    setCuentaForm(prev => ({
      ...prev,
      productos: prev.productos.filter((_, i) => i !== idx)
    }));
  }

  // --- CRUD y edición de cuentas con Supabase ---
  const statusMap: Record<string, 'pending' | 'cancelled'> = { 'Pendiente': 'pending', 'Cancelado': 'cancelled' };

  async function handleCuentaFormSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!cuentaForm.nombre.trim()) {
      setCuentaFormError('El nombre es obligatorio');
      return;
    }
    if (!cuentaForm.fecha) {
      setCuentaFormError('La fecha es obligatoria');
      return;
    }
    if (cuentaForm.tipo === 'Monto' && (!cuentaForm.monto || isNaN(Number(cuentaForm.monto)))) {
      setCuentaFormError('Monto inválido');
      return;
    }
    if (cuentaForm.tipo === 'Productos' && (!cuentaForm.productos || cuentaForm.productos.length === 0)) {
      setCuentaFormError('Agrega al menos un producto');
      return;
    }
    const mappedStatus = statusMap[cuentaForm.estado] || 'pending';
    if (!supabase) {
      setCuentaFormError('No hay conexión con la base de datos.');
      return;
    }
    let result;
    if (editingCuenta) {
      await supabase.from('debts').delete().eq('id', editingCuenta);
    }
    result = await supabase.from('debts').insert({
      nombre: cuentaForm.nombre,
      fecha: cuentaForm.fecha,
      tipo: cuentaForm.tipo,
      monto: cuentaForm.tipo === 'Monto' ? Number(cuentaForm.monto) : 0,
      productos: cuentaForm.tipo === 'Productos' ? cuentaForm.productos : null,
      estado: cuentaForm.estado,
      status: mappedStatus
    });
    if (result.error) {
      setCuentaFormError('Error al guardar la cuenta: ' + result.error.message);
      return;
    }
    setShowCuentaForm(false);
    setEditingCuenta(null);
    setCuentaForm({ nombre: '', fecha: '', tipo: 'Monto', monto: '', productos: [], estado: 'Pendiente' });
    setCuentaFormError(null);
  }

  async function handleDeleteCuenta(cuenta: any) {
    if (window.confirm(`¿Eliminar la cuenta de "${cuenta.nombre || cuenta.name}"?`) && supabase) {
      await supabase.from('debts').delete().eq('id', cuenta.id);
    }
  }

  function handleEditCuenta(cuenta: any) {
    setEditingCuenta(cuenta.id);
    setCuentaForm({
      nombre: cuenta.nombre,
      fecha: cuenta.fecha,
      tipo: cuenta.tipo,
      monto: cuenta.monto ? cuenta.monto.toString() : '',
      productos: cuenta.productos ? cuenta.productos.map((p: any) => ({ ...p })) : [],
      estado: cuenta.estado
    });
    setShowCuentaForm(true);
  }
  // --- Estados para Listas ---
  const [showListaForm, setShowListaForm] = useState(false);
  const [editingLista, setEditingLista] = useState<string | null>(null);
  const [listaForm, setListaForm] = useState<{
    nombre: string;
    fecha: string;
    direccion: string;
    productos: ListaProducto[];
  }>({
    nombre: '',
    fecha: '',
    direccion: '',
    productos: [],
  });
  const [listaFormError, setListaFormError] = useState<string | null>(null);
  // Funciones para listas de clientes
  function handleListaFormChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    setListaForm(prev => ({ ...prev, [name]: value }));
    setListaFormError(null);
  }

  function handleListaProductoAdd() {
    if (products.length === 0) return;
    setListaForm(prev => ({
      ...prev,
      productos: [
        ...prev.productos,
        { id: products[0].id, name: products[0].name, cantidad: 1, price: products[0].price, qv: products[0].qv }
      ]
    }));
  }

  function handleListaProductoChange(idx: number, field: 'id' | 'cantidad') {
    return (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      setListaForm(prev => {
        const productos = [...prev.productos];
        if (field === 'id') {
          const prod = products.find(p => p.id === e.target.value);
          if (prod) {
            productos[idx] = { id: prod.id, name: prod.name, cantidad: productos[idx].cantidad, price: prod.price, qv: prod.qv };
          }
        } else if (field === 'cantidad') {
          productos[idx] = { ...productos[idx], cantidad: Math.max(1, Number(e.target.value)) };
        }
        return { ...prev, productos };
      });
    };
  }

  function handleListaProductoRemove(idx: number) {
    setListaForm(prev => ({
      ...prev,
      productos: prev.productos.filter((_, i) => i !== idx)
    }));
  }

  function validateListaForm() {
    if (!listaForm.nombre.trim()) return 'El nombre es obligatorio';
    if (!listaForm.fecha) return 'La fecha es obligatoria';
    if (!listaForm.direccion.trim()) return 'La dirección es obligatoria';
    if (listaForm.productos.length === 0) return 'Agrega al menos un producto';
    for (const p of listaForm.productos) {
      if (!p.id || !products.find(prod => prod.id === p.id)) return 'Producto inválido';
      if (!p.cantidad || isNaN(Number(p.cantidad)) || Number(p.cantidad) < 1) return 'Cantidad inválida';
    }
    return null;
  }

  async function handleListaFormSubmit(e: React.FormEvent) {
    e.preventDefault();
    const error = validateListaForm();
    if (error) {
      setListaFormError(error);
      return;
    }
    if (!supabase) {
      setListaFormError('No hay conexión con la base de datos.');
      return;
    }
    if (editingLista) {
      await supabase.from('listas_clientes').update({
        nombre: listaForm.nombre,
        fecha: listaForm.fecha,
        direccion: listaForm.direccion,
        productos: listaForm.productos
      }).eq('id', editingLista);
    } else {
      await supabase.from('listas_clientes').insert({
        nombre: listaForm.nombre,
        fecha: listaForm.fecha,
        direccion: listaForm.direccion,
        productos: listaForm.productos
      });
    }
    // Forzar recarga inmediata de listas
    const listasActualizadas = await getListasClientes();
    if (listasActualizadas) setListas(listasActualizadas);
    setShowListaForm(false);
    setEditingLista(null);
    setListaForm({ nombre: '', fecha: '', direccion: '', productos: [] });
    setListaFormError(null);
  }

  function handleDeleteLista(lista: ListaCliente) {
    if (window.confirm(`¿Eliminar la lista de "${lista.nombre}"?`) && supabase) {
      supabase.from('listas_clientes').delete().eq('id', lista.id).then(async () => {
        const listasActualizadas = await getListasClientes();
        if (listasActualizadas) setListas(listasActualizadas);
      });
    }
  }

  function handleEditLista(lista: ListaCliente) {
    setEditingLista(lista.id);
    setListaForm({
      nombre: lista.nombre,
      fecha: lista.fecha,
      direccion: lista.direccion,
      productos: lista.productos.map(p => ({ ...p }))
    });
    setShowListaForm(true);
  }
  // ...existing code...

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = !categoryFilter || product.category === categoryFilter;
    const matchesLowStock = !lowStockFilter || product.stock <= 1;
    return matchesSearch && matchesCategory && matchesLowStock;
  });

  async function updateStock(id: string, delta: number) {
    const prod = products.find(p => p.id === id);
    if (!prod) return;
    const newStock = Math.max(0, Number(prod.stock) + delta);
    await updateProductStock(id, newStock);
    // El realtime actualizará el estado
  }

  function handleProductFormChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
    const { name, value } = e.target;
    setProductForm(prev => ({ ...prev, [name]: value }));
    setFormError(null);
  }

  function validateProductForm() {
    if (!productForm.name.trim()) return 'El nombre es obligatorio';
    if (!productForm.price || isNaN(Number(productForm.price))) return 'Precio inválido';
    if (!productForm.qv || isNaN(Number(productForm.qv))) return 'QV inválido';
    if (!productForm.stock || isNaN(Number(productForm.stock))) return 'Stock inválido';
    return null;
  }

  async function handleProductFormSubmit(e: React.FormEvent) {
    e.preventDefault();
    const error = validateProductForm();
    if (error) {
      setFormError(error);
      return;
    }
    if (editingProduct) {
      // Actualizar producto existente (solo stock por ahora)
      await updateProductStock(editingProduct, Number(productForm.stock));
    } else {
      await addProduct({
        name: productForm.name,
        description: productForm.description,
        category: productForm.category,
        color: productForm.color,
        price: Number(productForm.price),
        qv: Number(productForm.qv),
        stock: Number(productForm.stock)
      });
    }
    setShowProductForm(false);
    setEditingProduct(null);
    setProductForm({ name: '', description: '', category: '', color: '#1e293b', price: '', qv: '', stock: '' });
    setFormError(null);
  }

  async function handleDeleteProduct(product: any) {
    if (window.confirm(`¿Estás seguro de que deseas eliminar el producto "${product.name}"? Esta acción no se puede deshacer.`)) {
      if (supabase) {
        await supabase.from('products').delete().eq('id', product.id);
      }
    }
  }

  // Dashboard métricas
  const totalProductos = products.length;
  const stockTotal = products.reduce((acc, p) => acc + Number(p.stock), 0);
  const stockBajo = products.filter(p => p.stock <= 1).length;
  const sinStock = products.filter(p => p.stock === 0).length;
  const valorTotal = products.reduce((acc, p) => acc + (Number(p.stock) * Number(p.price)), 0);

  return (
  <div className="min-h-screen bg-gradient-to-br from-gray-950 via-slate-900 to-gray-900 transition-colors duration-300">
      {/* Banner superior */}
  <header className="w-full bg-gradient-to-r from-blue-900/80 via-slate-800/80 to-violet-900/80 backdrop-blur-md shadow-lg border-b border-slate-700 flex items-center justify-between px-2 sm:px-8 py-4 sticky top-0 z-50 transition-all duration-300">
    <div className="flex items-center gap-2 sm:gap-3">
      <Box className="h-7 w-7 sm:h-8 sm:w-8 text-blue-400 drop-shadow-glow" />
      <span className="text-xl sm:text-2xl md:text-3xl font-extrabold text-white tracking-tight drop-shadow-glow">Inventario Fuxion Casa</span>
    </div>
    {/* Botón Sincronizado + Salir en móvil, separados en desktop */}
    <div className="flex items-center gap-2">
      <button
        onClick={handleLogout}
        className={`flex items-center gap-2 font-semibold px-3 py-2 rounded-xl transition-all border shadow-lg backdrop-blur-md animate-pulse sm:hidden
          ${syncStatus === 'ok' ? 'text-green-400 border-green-700 bg-green-900/30' : syncStatus === 'loading' ? 'text-yellow-300 border-yellow-700 bg-yellow-900/30' : 'text-red-400 border-red-700 bg-red-900/30'}`}
        title="Sincronizado / Salir"
      >
        <svg width="14" height="14" viewBox="0 0 20 20" fill="none" className="inline-block">
          <circle cx="10" cy="10" r="8" fill={syncStatus === 'ok' ? '#22c55e' : syncStatus === 'loading' ? '#fde047' : '#ef4444'} />
        </svg>
        {syncStatus === 'ok' ? 'Sincronizado' : syncStatus === 'loading' ? 'Sincronizando...' : 'Sin conexión'}
        <LogOut className="h-5 w-5 text-slate-200 ml-1" />
      </button>
      <span className={`hidden sm:flex items-center gap-1 font-semibold text-base px-3 py-1 rounded-full shadow-inner border animate-pulse
        ${syncStatus === 'ok' ? 'text-green-400 bg-green-900/30 border-green-700' : syncStatus === 'loading' ? 'text-yellow-300 bg-yellow-900/30 border-yellow-700' : 'text-red-400 bg-red-900/30 border-red-700'}`}
      >
        <svg width="14" height="14" viewBox="0 0 20 20" fill="none" className="inline-block">
          <circle cx="10" cy="10" r="8" fill={syncStatus === 'ok' ? '#22c55e' : syncStatus === 'loading' ? '#fde047' : '#ef4444'} />
        </svg>
        {syncStatus === 'ok' ? 'Sincronizado' : syncStatus === 'loading' ? 'Sincronizando...' : 'Sin conexión'}
      </span>
      <button
        onClick={handleLogout}
        className="hidden sm:flex items-center gap-2 text-slate-200 hover:text-red-400 font-semibold px-4 py-2 rounded-xl transition-all border border-slate-700 hover:border-red-400 bg-gradient-to-r from-slate-800/80 to-slate-900/80 hover:from-red-900/80 hover:to-red-900/80 shadow-lg backdrop-blur-md"
      >
        <LogOut className="h-5 w-5" />
        Salir
      </button>
    </div>
  </header>
      <div className="max-w-6xl mx-auto mb-6 mt-6 px-2 sm:px-4">
        <div className="flex flex-wrap gap-2 sm:gap-4 justify-center">
          {TABS.map(tab => (
            <button
              key={tab.key}
              className={`px-8 py-4 text-lg rounded-t-2xl font-bold tracking-wide transition-all duration-200 border-b-4 shadow-xl backdrop-blur-lg ${activeTab === tab.key ? 'border-blue-500 bg-gradient-to-r from-blue-900/80 via-slate-800/80 to-violet-900/80 text-white scale-105 shadow-blue-900/40' : 'border-transparent bg-slate-800/60 text-slate-300 hover:bg-slate-700/80 hover:text-white'}`}
              style={{ letterSpacing: '0.02em' }}
              onClick={() => setActiveTab(tab.key)}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>
  <main className="max-w-7xl mx-auto px-2 sm:px-4 md:px-8 py-6 sm:py-10 md:py-14">
        {activeTab === 'inventario' && (
          <>
            {/* Dashboard de métricas */}
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-5 md:gap-8 mb-8 md:mb-14">
              <div className="rounded-2xl shadow-xl bg-gradient-to-br from-blue-900/60 via-slate-800/80 to-slate-900/80 backdrop-blur-md border border-blue-800 flex flex-col items-center justify-center p-6 text-center">
                <div className="text-3xl font-extrabold text-blue-300 drop-shadow-glow">{totalProductos}</div>
                <div className="text-sm md:text-base text-blue-100 font-semibold mt-1">Productos</div>
              </div>
              <div className="rounded-2xl shadow-xl bg-gradient-to-br from-blue-900/60 via-slate-800/80 to-slate-900/80 backdrop-blur-md border border-blue-800 flex flex-col items-center justify-center p-6 text-center">
                <div className="text-3xl font-extrabold text-blue-300 drop-shadow-glow">{stockTotal}</div>
                <div className="text-sm md:text-base text-blue-100 font-semibold mt-1">Stock total</div>
              </div>
              <div className="rounded-2xl shadow-xl bg-gradient-to-br from-yellow-900/60 via-slate-800/80 to-slate-900/80 backdrop-blur-md border border-yellow-800 flex flex-col items-center justify-center p-6 text-center">
                <div className="text-3xl font-extrabold text-yellow-300 drop-shadow-glow">{stockBajo}</div>
                <div className="text-sm md:text-base text-yellow-100 font-semibold mt-1">Stock bajo</div>
              </div>
              <div className="rounded-2xl shadow-xl bg-gradient-to-br from-red-900/60 via-slate-800/80 to-slate-900/80 backdrop-blur-md border border-red-800 flex flex-col items-center justify-center p-6 text-center">
                <div className="text-3xl font-extrabold text-red-300 drop-shadow-glow">{sinStock}</div>
                <div className="text-sm md:text-base text-red-100 font-semibold mt-1">Sin stock</div>
              </div>
              <div className="rounded-2xl shadow-xl bg-gradient-to-br from-green-900/60 via-slate-800/80 to-slate-900/80 backdrop-blur-md border border-green-800 flex flex-col items-center justify-center p-6 text-center">
                <div className="text-3xl font-extrabold text-green-300 drop-shadow-glow">S/ {valorTotal.toLocaleString('es-PE', { minimumFractionDigits: 2 })}</div>
                <div className="text-sm md:text-base text-green-100 font-semibold mt-1">Valor total</div>
              </div>
            </div>
            {/* Formulario modal para agregar/editar producto */}
            {showProductForm && (
              <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/30">
                <form
                  className="bg-white rounded-xl shadow-lg p-8 w-full max-w-md relative animate-fadeIn border border-blue-900/40"
                  onSubmit={handleProductFormSubmit}
                >
                  <div className="text-xl font-bold mb-4">{editingProduct ? 'Editar producto' : 'Agregar producto'}</div>
                  <div className="grid gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">Nombre *</label>
                      <input
                        className="warehouse-input w-full text-black placeholder:text-black"
                        name="name"
                        value={productForm.name}
                        onChange={handleProductFormChange}
                        required
                        autoFocus
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Descripción</label>
                      <input
                        className="warehouse-input w-full text-black placeholder:text-black"
                        name="description"
                        value={productForm.description}
                        onChange={handleProductFormChange}
                      />
                    </div>
                    <div>
                      <label className="block text-base font-semibold mb-2 text-black">Categoría</label>
                      <select
                        className="warehouse-input w-full text-lg px-6 py-4 rounded-2xl bg-slate-100 border-2 border-blue-900/40 shadow-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black"
                        name="category"
                        value={productForm.category}
                        onChange={handleProductFormChange}
                      >
                        <option value="">Sin categoría</option>
                        {PRODUCT_CATEGORIES.map(cat => (
                          <option key={cat} value={cat}>{cat}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1 text-black">Color</label>
                      <input
                        className="warehouse-input w-full"
                        name="color"
                        type="color"
                        value={productForm.color}
                        onChange={handleProductFormChange}
                        style={{ height: 40, width: 60, padding: 0, border: 'none', background: 'none' }}
                      />
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                      <div>
                        <label className="block text-sm font-medium mb-1 text-black">Precio *</label>
                        <input
                          className="warehouse-input w-full"
                          name="price"
                          type="number"
                          min="0"
                          step="0.01"
                          inputMode="decimal"
                          value={productForm.price}
                          onChange={handleProductFormChange}
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1 text-black">QV *</label>
                        <input
                          className="warehouse-input w-full"
                          name="qv"
                          type="number"
                          min="0"
                          value={productForm.qv}
                          onChange={handleProductFormChange}
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1 text-black">Stock *</label>
                        <input
                          className="warehouse-input w-full"
                          name="stock"
                          type="number"
                          min="0"
                          value={productForm.stock}
                          onChange={handleProductFormChange}
                          required
                        />
                      </div>
                    </div>
                  </div>
                  {formError && <div className="text-red-600 mt-3 text-sm font-semibold">{formError}</div>}
                  <div className="flex gap-4 mt-6 justify-end">
                    <button
                      type="button"
                      className="warehouse-button bg-slate-200 hover:bg-slate-300 text-slate-700 px-4 py-2 rounded-lg border border-slate-400"
                      onClick={() => {
                        setShowProductForm(false);
                        setEditingProduct(null);
                        setProductForm({ name: '', description: '', category: '', color: '#1e293b', price: '', qv: '', stock: '' });
                        setFormError(null);
                      }}
                    >
                      Cancelar
                    </button>
                    <button
                      type="submit"
                      className="warehouse-button bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg shadow-md border border-blue-900/40"
                    >
                      {editingProduct ? 'Guardar cambios' : 'Agregar'}
                    </button>
                  </div>
                </form>
              </div>
            )}
            {/* ...Inventario UI... */}
            <div className="flex flex-col md:flex-row md:items-end gap-4 md:gap-6 mb-6 md:mb-10">
              <div className="flex flex-col flex-1 min-w-[220px] md:max-w-[350px]">
                <label className="block text-base font-semibold mb-2 text-slate-200">Buscar producto</label>
                <div className="relative flex items-center">
                  <span className="absolute left-3 text-blue-400 pointer-events-none"><Box className="h-6 w-6" /></span>
                  <input
                    type="text"
                    className="warehouse-input w-full text-lg pl-12 pr-6 py-4 rounded-2xl bg-gradient-to-r from-slate-900/80 via-slate-800/80 to-gray-900/80 border-2 border-blue-900/40 shadow-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 placeholder:text-slate-500"
                    placeholder="Nombre del producto..."
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>
              <div className="flex flex-col flex-1 min-w-[180px] md:max-w-[220px]">
                <label className="block text-base font-semibold mb-2 text-slate-200">Categoría</label>
                <select
                  className="warehouse-input w-full text-lg px-6 py-4 rounded-2xl bg-gradient-to-r from-slate-900/80 via-slate-800/80 to-gray-900/80 border-2 border-blue-900/40 shadow-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black"
                  value={categoryFilter}
                  onChange={e => setCategoryFilter(e.target.value)}
                >
                  <option value="" className="text-black">Todas</option>
                  {PRODUCT_CATEGORIES.map(cat => (
                    <option key={cat} value={cat} className="text-black">{cat}</option>
                  ))}
                </select>
              </div>
              <div className="flex flex-col flex-1 min-w-[160px] md:max-w-[200px]">
                <label className="block text-base font-semibold mb-2 text-slate-200">Filtros rápidos</label>
                <div className="flex gap-2 mt-1">
                  <button
                    className={`warehouse-button w-full text-lg px-6 py-4 rounded-2xl shadow-lg border-2 border-yellow-400/60 transition-all duration-200 ${lowStockFilter ? 'bg-yellow-400 text-black scale-105 ring-2 ring-yellow-300' : 'bg-slate-800/80 text-yellow-200 hover:bg-yellow-400/20 hover:text-yellow-300'}`}
                    onClick={() => setLowStockFilter(f => !f)}
                    type="button"
                  >
                    <Minus className="inline-block mr-1 h-5 w-5" /> Bajo Stock
                  </button>
                </div>
              </div>
              <div className="flex-1 flex justify-end items-end mt-4 md:mt-0">
                <button
                  className="warehouse-button text-lg px-6 py-4 rounded-2xl bg-gradient-to-r from-blue-700 via-blue-600 to-blue-800 hover:from-blue-800 hover:to-blue-900 text-white flex items-center gap-3 shadow-lg font-bold transition-all"
                  onClick={() => {
                    setEditingProduct(null);
                    setProductForm({ name: '', description: '', category: '', color: '#1e293b', price: '', qv: '', stock: '' });
                    setShowProductForm(true);
                  }}
                >
                  <Plus className="h-5 w-5" /> Agregar Producto
                </button>
              </div>
            </div>
            {filteredProducts.length === 0 ? (
              <div className="text-center text-gray-500">No hay productos para mostrar.</div>
            ) : (
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 lg:gap-8">
                {products.filter(product => {
                  const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
                  const matchesCategory = !categoryFilter || product.category === categoryFilter;
                  const matchesLowStock = !lowStockFilter || product.stock <= 1;
                  return matchesSearch && matchesCategory && matchesLowStock;
                }).map(product => (
                  <div
                    key={product.id}
                    className="warehouse-card relative flex flex-col bg-gradient-to-br from-slate-800/80 via-slate-900/80 to-gray-900/80 border border-violet-900/60 shadow-2xl rounded-2xl hover:scale-[1.03] hover:shadow-violet-900/40 transition-all duration-200 group p-0 overflow-hidden min-h-[140px] backdrop-blur-md"
                  >
                    <div
                      className="flex items-center justify-between px-4 pt-4 pb-1"
                      style={{
                        background: `linear-gradient(90deg, ${product.color || '#38bdf8'} 0%, rgba(255,255,255,0.0) 100%)`
                      }}
                    >
                      <span className={`px-2 py-1 rounded-full text-xs font-bold shadow-sm ${product.stock === 0 ? 'bg-red-200 text-red-900' : product.stock === 1 ? 'bg-yellow-200 text-yellow-900' : 'bg-green-200 text-green-900'} border border-black/10`}>{getStatusText(product)}</span>
                      <div className="flex gap-2">
                        <button
                          className="bg-blue-50 hover:bg-blue-100 rounded-full p-1 shadow transition-all duration-200 border border-blue-200"
                          onClick={() => {
                            setEditingProduct(product.id);
                            setProductForm({
                              name: product.name,
                              description: product.description,
                              category: product.category,
                              color: product.color,
                              price: product.price.toString(),
                              qv: product.qv.toString(),
                              stock: product.stock.toString()
                            });
                            setShowProductForm(true);
                          }}
                          aria-label="Editar producto"
                        >
                          <Edit2 className="h-4 w-4 text-blue-600" />
                        </button>
                        <button
                          className="bg-red-50 hover:bg-red-100 rounded-full p-1 shadow transition-all duration-200 border border-red-200"
                          onClick={() => handleDeleteProduct(product)}
                          aria-label="Eliminar producto"
                        >
                          <Trash2 className="h-4 w-4 text-red-500" />
                        </button>
                      </div>
                    </div>
                    <div className="flex-1 flex flex-col justify-between px-4 pb-4 pt-1">
                      <div className="mb-1">
                        <div className="font-extrabold text-lg md:text-xl text-white leading-tight drop-shadow-glow group-hover:scale-105 group-hover:drop-shadow-lg transition-transform duration-200">{product.name}</div>
                        <div className="text-sm md:text-base text-slate-300 font-medium mb-1 mt-1 tracking-tight">{product.description}</div>
                      </div>
                      <div className="flex items-center justify-center gap-3 my-2">
                        <button
                          className="rounded-full bg-red-400 hover:bg-red-500 text-white w-7 h-7 md:w-8 md:h-8 flex items-center justify-center text-base font-bold shadow transition-all duration-200 scale-100 active:scale-90"
                          onClick={() => updateStock(product.id, -1)}
                          aria-label="Disminuir stock"
                          type="button"
                          disabled={product.stock <= 0}
                        >
                          <Minus className="h-4 w-4 md:h-5 md:w-5" />
                        </button>
                        <span className="text-xl md:text-2xl font-extrabold text-white select-none px-2 tracking-wider drop-shadow-glow">{product.stock}</span>
                        <button
                          className="rounded-full bg-green-300 hover:bg-green-400 text-black w-7 h-7 md:w-8 md:h-8 flex items-center justify-center text-base font-bold shadow transition-all duration-200 scale-100 active:scale-90"
                          onClick={() => updateStock(product.id, 1)}
                          aria-label="Aumentar stock"
                          type="button"
                        >
                          <Plus className="h-4 w-4 md:h-5 md:w-5" />
                        </button>
                      </div>
                      <div className="flex flex-col gap-1 mt-2 items-center">
                        <div className="text-sm md:text-base font-semibold text-blue-200">Precio: <span className="font-bold text-blue-100">S/ {Number(product.price).toFixed(2)}</span></div>
                        <div className="text-sm md:text-base text-violet-200">QV: {product.qv}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
        {activeTab === 'cuentas' && (
          <div className="p-8 md:p-12 bg-gradient-to-br from-slate-900/80 via-slate-800/90 to-gray-900/80 rounded-3xl shadow-2xl text-white max-w-4xl mx-auto transition-colors border-2 border-violet-900/40 backdrop-blur-md">
            <div className="flex items-center justify-between mb-4">
              <div className="text-2xl font-bold flex items-center gap-2">💰 Cuentas</div>
              <button
                className="warehouse-button bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 shadow-md transition-all"
                onClick={() => {
                  setEditingCuenta(null);
                  setCuentaForm({ nombre: '', fecha: '', tipo: 'Monto', monto: '', productos: [], estado: 'Pendiente' });
                  setShowCuentaForm(true);
                }}
              >
                <Plus className="h-4 w-4" /> Agregar Cuenta
              </button>
            </div>
            {/* Formulario modal */}
            {showCuentaForm && (
              <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/30">
                <form
          className="bg-white rounded-xl shadow-lg p-8 w-full max-w-md relative animate-fadeIn"
                  onSubmit={handleCuentaFormSubmit}
                >
          <div className="text-xl font-bold mb-4 text-black">{editingCuenta ? 'Editar cuenta' : 'Agregar cuenta'}</div>
                  <div className="grid gap-4">
                    <div>
            <label className="block text-sm font-medium mb-1 text-black">Nombre *</label>
                      <input
                        className="warehouse-input w-full text-black placeholder:text-black"
                        name="nombre"
                        value={cuentaForm.nombre}
                        onChange={handleCuentaFormChange}
                        required
                        autoFocus
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1 text-black">Fecha *</label>
                      <input
                        className="warehouse-input w-full"
                        name="fecha"
                        type="date"
                        value={cuentaForm.fecha}
                        onChange={handleCuentaFormChange}
                        required
                        style={{ color: '#111' }}
                        placeholder="dd/mm/yyyy"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1 text-black">Tipo *</label>
                      <select
                        className="warehouse-input w-full"
                        name="tipo"
                        value={cuentaForm.tipo}
                        onChange={e => handleCuentaTipoChange(e.target.value as 'Monto' | 'Productos')}
                        style={{ color: '#111' }}
                      >
                        <option value="Monto" style={{ color: '#111' }}>Monto</option>
                        <option value="Productos" style={{ color: '#111' }}>Productos</option>
                      </select>
                    </div>
                    {cuentaForm.tipo === 'Monto' ? (
                      <div>
                        <label className="block text-sm font-medium mb-1 text-black">Monto (S/)*</label>
                        <input
                          className="warehouse-input w-full text-black placeholder:text-black"
                          name="monto"
                          type="number"
                          min="0"
                          step="0.01"
                          inputMode="decimal"
                          value={cuentaForm.monto}
                          onChange={handleCuentaFormChange}
                          required
                        />
                      </div>
                    ) : (
                      <div>
                        <label className="block text-sm font-medium mb-1 text-black">Productos *</label>
                        <div className="flex flex-col gap-2">
                          {cuentaForm.productos.map((prod, idx) => (
                            <div key={idx} className="flex gap-2 items-center">
                              <select
                                className="warehouse-input text-base px-4 py-3 rounded-xl bg-gradient-to-r from-slate-900/80 via-slate-800/80 to-gray-900/80 border-2 border-blue-900/40 shadow-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-slate-200"
                                value={prod.id}
                                onChange={handleCuentaProductoChange(idx, 'id')}
                              >
                                {products.map(p => (
                                  <option key={p.id} value={p.id}>{p.name}</option>
                                ))}
                              </select>
                              <input
                                className="warehouse-input w-20"
                                type="number"
                                min="1"
                                value={prod.cantidad}
                                onChange={handleCuentaProductoChange(idx, 'cantidad')}
                                style={{ color: '#111' }}
                              />
                              <span className="text-xs text-black">S/ {prod.price}</span>
                              <button type="button" className="text-red-500 hover:text-red-700" onClick={() => handleCuentaProductoRemove(idx)}>
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </div>
                          ))}
                          <button type="button" className="warehouse-button bg-gradient-to-r from-blue-700 via-blue-600 to-blue-800 hover:from-blue-800 hover:to-blue-900 text-white px-4 py-2 rounded-xl flex items-center gap-2 shadow-md text-base font-bold transition-all" onClick={handleCuentaProductoAdd}>
                            <Plus className="h-4 w-4" /> Agregar producto
                          </button>
                        </div>
                      </div>
                    )}
                    <div>
                      <label className="block text-sm font-medium mb-1 text-black">Estado *</label>
                      <select
                          className="warehouse-input w-full text-black placeholder:text-black"
                        name="estado"
                        value={cuentaForm.estado}
                        onChange={handleCuentaFormChange}
                      >
                        <option value="Pendiente">Pendiente</option>
                        <option value="Cancelado">Cancelado</option>
                      </select>
                    </div>
                  </div>
                  {cuentaFormError && <div className="text-red-600 mt-3 text-sm font-semibold">{cuentaFormError}</div>}
                  <div className="flex gap-4 mt-6 justify-end">
                    <button
                      type="button"
                      className="warehouse-button bg-slate-200 hover:bg-slate-300 text-slate-700 px-4 py-2 rounded-lg"
                      onClick={() => {
                        setShowCuentaForm(false);
                        setEditingCuenta(null);
                        setCuentaForm({ nombre: '', fecha: '', tipo: 'Monto', monto: '', productos: [], estado: 'Pendiente' });
                        setCuentaFormError(null);
                      }}
                    >
                      Cancelar
                    </button>
                    <button
                      type="submit"
                      className="warehouse-button bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg shadow-md"
                    >
                      {editingCuenta ? 'Guardar cambios' : 'Agregar'}
                    </button>
                  </div>
                </form>
              </div>
            )}
            {/* Listado de cuentas */}
            {cuentas.length === 0 ? (
              <div className="text-center text-gray-500 mt-8">No hay cuentas registradas.</div>
            ) : (
              <div className="mt-10 flex flex-col gap-6">
                {cuentas.map(cuenta => (
                  <div key={cuenta.id} className="bg-gradient-to-br from-gray-900/90 via-slate-900/95 to-slate-800/90 border-2 border-blue-900/40 rounded-2xl shadow-2xl p-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4 transition-all backdrop-blur-md">
                    <div className="flex-1 flex flex-col md:flex-row md:items-center gap-2 md:gap-6">
                      <div>
                        <div className="font-bold text-lg text-blue-100 drop-shadow-glow">{cuenta.nombre}</div>
                        <div className="text-xs text-slate-400">{cuenta.fecha}</div>
                      </div>
                      <div className="text-sm text-violet-200 font-semibold">
                        {cuenta.tipo === 'Monto'
                          ? <>Monto: <span className="text-blue-600 font-bold">S/ {cuenta.monto?.toFixed(2)}</span></>
                          : <>
                              Productos:
                              <ul className="ml-2 list-disc text-xs text-slate-600">
                                {cuenta.productos?.map((p: any, i: number) => (
                                  <li key={i}>{p.name} x{p.cantidad} <span className="text-slate-400">(S/ {p.price})</span></li>
                                ))}
                              </ul>
                            </>
                        }
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-1 rounded-full text-xs font-bold ${cuenta.estado === 'Pendiente' ? 'bg-yellow-200 text-yellow-900' : 'bg-green-200 text-green-900'}`}>{cuenta.estado}</span>
                      <button className="bg-blue-50 hover:bg-blue-100 rounded-full p-2 border border-blue-200" onClick={() => handleEditCuenta(cuenta)} aria-label="Editar cuenta">
                        <Edit2 className="h-4 w-4 text-blue-600" />
                      </button>
                      <button className="bg-red-50 hover:bg-red-100 rounded-full p-2 border border-red-200" onClick={() => handleDeleteCuenta(cuenta)} aria-label="Eliminar cuenta">
                        <Trash2 className="h-4 w-4 text-red-500" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
        {activeTab === 'listas' && (
          <div className="p-8 md:p-12 bg-gradient-to-br from-slate-900/80 via-slate-800/90 to-gray-900/80 rounded-3xl shadow-2xl text-white max-w-4xl mx-auto transition-colors border-2 border-violet-900/40 backdrop-blur-md">
            <div className="flex items-center justify-between mb-4">
              <div className="text-2xl font-bold flex items-center gap-2">📝 Listas de clientes</div>
              <button
                className="warehouse-button bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 shadow-md transition-all"
                onClick={() => {
                  setEditingLista(null);
                  setListaForm({ nombre: '', fecha: '', direccion: '', productos: [] });
                  setShowListaForm(true);
                }}
              >
                <Plus className="h-4 w-4" /> Agregar Lista
              </button>
            </div>
            {/* Formulario modal */}
            {showListaForm && (
              <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/30">
                <form
          className="bg-white rounded-xl shadow-lg p-8 w-full max-w-md relative animate-fadeIn"
                  onSubmit={handleListaFormSubmit}
                >
          <div className="text-xl font-bold mb-4 text-black">{editingLista ? 'Editar lista' : 'Agregar lista'}</div>
                  <div className="grid gap-4">
                    <div>
            <label className="block text-sm font-medium mb-1 text-black">Nombre *</label>
                      <input
                          className="warehouse-input w-full text-black placeholder:text-black"
                        name="nombre"
                        value={listaForm.nombre}
                        onChange={handleListaFormChange}
                        required
                        autoFocus
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1 text-black">Fecha *</label>
                      <input
                          className="warehouse-input w-full text-black placeholder:text-black"
                        name="fecha"
                        type="date"
                        value={listaForm.fecha}
                        onChange={handleListaFormChange}
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1 text-black">Dirección *</label>
                      <input
                        className="warehouse-input w-full text-black placeholder:text-black"
                        name="direccion"
                        value={listaForm.direccion}
                        onChange={handleListaFormChange}
                        required
                      />
                    </div>
                    <div>
          <label className="block text-sm font-medium mb-1 text-black">Productos *</label>
                      <div className="flex flex-col gap-2">
                        {listaForm.productos.map((prod, idx) => (
                          <div key={idx} className="flex gap-2 items-center">
                            <select
                              className="warehouse-input text-base px-4 py-3 rounded-xl bg-gradient-to-r from-slate-900/80 via-slate-800/80 to-gray-900/80 border-2 border-blue-900/40 shadow-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-slate-200"
                              value={prod.id}
                              onChange={handleListaProductoChange(idx, 'id')}
                            >
                              {products.map(p => (
                                <option key={p.id} value={p.id}>{p.name}</option>
                              ))}
                            </select>
                            <input
                              className="warehouse-input w-20"
                              type="number"
                              min="1"
                              value={prod.cantidad}
                              onChange={handleListaProductoChange(idx, 'cantidad')}
                              style={{ color: '#111' }}
                            />
            <span className="text-xs text-black">S/ {prod.price} | QV: {prod.qv}</span>
                            <button type="button" className="text-red-500 hover:text-red-700" onClick={() => handleListaProductoRemove(idx)}>
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        ))}
                        <button type="button" className="warehouse-button bg-gradient-to-r from-blue-700 via-blue-600 to-blue-800 hover:from-blue-800 hover:to-blue-900 text-white px-4 py-2 rounded-xl flex items-center gap-2 shadow-md text-base font-bold transition-all" onClick={handleListaProductoAdd}>
                          <Plus className="h-4 w-4" /> Agregar producto
                        </button>
                      </div>
                    </div>
                  </div>
                  {listaFormError && <div className="text-red-600 mt-3 text-sm font-semibold">{listaFormError}</div>}
                  <div className="flex gap-4 mt-6 justify-end">
                    <button
                      type="button"
                      className="warehouse-button bg-slate-200 hover:bg-slate-300 text-slate-700 px-4 py-2 rounded-lg"
                      onClick={() => {
                        setShowListaForm(false);
                        setEditingLista(null);
                        setListaForm({ nombre: '', fecha: '', direccion: '', productos: [] });
                        setListaFormError(null);
                      }}
                    >
                      Cancelar
                    </button>
                    <button
                      type="submit"
                      className="warehouse-button bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg shadow-md"
                    >
                      {editingLista ? 'Guardar cambios' : 'Agregar'}
                    </button>
                  </div>
                </form>
              </div>
            )}
            {/* Listado de listas de clientes */}
            {listas.length === 0 ? (
              <div className="text-center text-gray-500 mt-8">No hay listas registradas.</div>
            ) : (
              <div className="mt-10 flex flex-col gap-6">
                {listas.map(lista => {
                  const totalCosto = lista.productos.reduce((acc: number, p: ListaProducto) => acc + (p.price * p.cantidad), 0);
                  const totalQV = lista.productos.reduce((acc: number, p: ListaProducto) => acc + (p.qv * p.cantidad), 0);
                  return (
                    <div key={lista.id} className="bg-gradient-to-br from-gray-900/90 via-slate-900/95 to-slate-800/90 border-2 border-blue-900/40 rounded-2xl shadow-2xl p-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4 transition-all backdrop-blur-md">
                      <div className="flex-1 flex flex-col md:flex-row md:items-center gap-3 md:gap-8">
                        <div>
                          <div className="font-bold text-lg text-blue-100 drop-shadow-glow">{lista.nombre}</div>
                          <div className="text-xs text-slate-400">{lista.fecha}</div>
                          <div className="text-xs text-slate-400">{lista.direccion}</div>
                        </div>
                        <div className="text-sm text-violet-200 font-semibold">
                          Productos:
                          <ul className="ml-2 list-disc text-xs text-slate-600">
                            {lista.productos.map((p: ListaProducto, i: number) => (
                              <li key={i}>{p.name} x{p.cantidad} <span className="text-slate-400">(S/ {p.price} | QV: {p.qv})</span></li>
                            ))}
                          </ul>
                        </div>
                      </div>
                      <div className="flex flex-col items-end gap-2 min-w-[160px]">
                        <span className="text-xs text-slate-500">Total Costo:</span>
                        <span className="font-bold text-blue-600">S/ {totalCosto.toFixed(2)}</span>
                        <span className="text-xs text-slate-500">Total QV:</span>
                        <span className="font-bold text-green-600">{totalQV}</span>
                        <div className="flex gap-2 mt-2">
                          <button className="bg-blue-50 hover:bg-blue-100 rounded-full p-2 border border-blue-200" onClick={() => handleEditLista(lista)} aria-label="Editar lista">
                            <Edit2 className="h-4 w-4 text-blue-600" />
                          </button>
                          <button className="bg-red-50 hover:bg-red-100 rounded-full p-2 border border-red-200" onClick={() => handleDeleteLista(lista)} aria-label="Eliminar lista">
                            <Trash2 className="h-4 w-4 text-red-500" />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
