// Lista editable de categorías de productos
export interface Category {
  id: string;
  name: string;
}

// Ejemplo de categorías iniciales
export const INITIAL_CATEGORIES: Category[] = [
  { id: '1', name: 'Limpieza' },
  { id: '2', name: 'Quemador de Grasa' },
  { id: '3', name: 'Nutrición' },
];
