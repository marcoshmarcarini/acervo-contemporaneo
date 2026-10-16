import { create } from "zustand";
import { persist } from "zustand/middleware";

// 1. Tipagem: Definimos como um item do carrinho deve ser
export interface CartItem {
  id: string;
  databaseId?: number | string;
  name: string;
  price: string;
  image?: string;
  quantity: number;
}

// 2. Tipagem: Definir o que a "Store" vai guardar e quais ações ela pode fazer
interface CartState {
  items: CartItem[]; // Lista de produtos no carrinho
  addItem: (item: CartItem) => void; // Função para adicionar
  removeItem: (id: string) => void; // Função para remover
  updateQuantity: (id: string, quantity: number) => void; // Função para atualizar a quantidade
  clearCart: () => void; //Função para limpar tudo
}

// 3. A Store em si (usando o persist para salvar o localStorage)
export const useCartStore = create<CartState>()(
  persist(
    (set) => ({
      items: [], //O carrinho começa vazio

      // Lógica para adicionar um item
      addItem: (newItem) =>
        set((state) => {
          // Verifica se o item já está no carrinho
          const existingItem = state.items.find(
            (item) => item.id === newItem.id,
          );

          if (existingItem) {
            // Se já existe, só aumenta a quantidade
            return {
              items: state.items.map((item) =>
                item.id === newItem.id
                  ? { ...item, quantity: item.quantity + 1 }
                  : item,
              ),
            };
          }
          // Se é um item novo, adiciona no final da lista
          return { items: [...state.items, newItem] };
        }),

      // Lógica para remover um item
      removeItem: (id) =>
        set((state) => ({
          items: state.items.filter((item) => item.id !== id),
        })),

      // Lógica para atualizar a quantidade de um item
      updateQuantity: (id, quantity) =>
        set((state) => ({
          items: state.items.map((item) =>
            item.id === id
              ? { ...item, quantity: Math.max(1, quantity) }
              : item
          ),
        })),

      //Lógica para esvaziar o carrinho
      clearCart: () => set({ items: [] }),
    }),
    {
      name: "acervo-carrinho", // Nome que vai aparecer no Local Storage do Navegador
    },
  ),
);
