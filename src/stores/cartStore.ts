import { create } from "zustand";

// Define the image type based on the data.json structure
type ProductImage = {
  thumbnail: string;
  mobile: string;
  tablet: string;
  desktop: string;
};

// Define the product type based on the data.json structure
export type Product = {
  name: string;
  category: string;
  price: number;
  image: ProductImage;
};

// Cart item extends product with quantity
export type CartItem = Product & {
  quantity: number;
};

// Define the store type
type CartStore = {
  // State
  products: Product[];
  cart: CartItem[];
  isCartOpen: boolean;
  showConfirmation: boolean;

  // Actions
  setProducts: (products: Product[]) => void;
  addToCart: (product: Product) => void;
  removeFromCart: (productName: string) => void;
  increaseQuantity: (productName: string) => void;
  decreaseQuantity: (productName: string) => void;
  toggleCart: () => void;
  clearCart: () => void;
  toggleConfirmation: () => void;

  // Computed values
  getTotalItems: () => number;
  getTotalPrice: () => number;
};

export const useCartStore = create<CartStore>((set, get) => ({
  // Initial state
  products: [],
  cart: [],
  isCartOpen: false,
  showConfirmation: false,

  // Actions
  setProducts: (products) => set({ products }),

  addToCart: (product) =>
    set((state) => {
      const existingItem = state.cart.find(
        (item) => item.name === product.name
      );

      if (existingItem) {
        // If item already exists, increase quantity
        return {
          cart: state.cart.map((item) =>
            item.name === product.name
              ? { ...item, quantity: item.quantity + 1 }
              : item
          ),
        };
      } else {
        // Otherwise add new item with quantity 1
        return {
          cart: [...state.cart, { ...product, quantity: 1 }],
        };
      }
    }),

  removeFromCart: (productName) =>
    set((state) => ({
      cart: state.cart.filter((item) => item.name !== productName),
    })),

  increaseQuantity: (productName) =>
    set((state) => ({
      cart: state.cart.map((item) =>
        item.name === productName
          ? { ...item, quantity: item.quantity + 1 }
          : item
      ),
    })),

  decreaseQuantity: (productName) =>
    set((state) => {
      const existingItem = state.cart.find((item) => item.name === productName);

      if (existingItem && existingItem.quantity === 1) {
        // If quantity is 1, remove the item
        return {
          cart: state.cart.filter((item) => item.name !== productName),
        };
      } else {
        // Otherwise decrease quantity
        return {
          cart: state.cart.map((item) =>
            item.name === productName
              ? { ...item, quantity: item.quantity - 1 }
              : item
          ),
        };
      }
    }),

  toggleCart: () =>
    set((state) => ({
      isCartOpen: !state.isCartOpen,
    })),

  clearCart: () => set({ cart: [] }),

  toggleConfirmation: () =>
    set((state) => ({
      showConfirmation: !state.showConfirmation,
    })),

  // Computed values
  getTotalItems: () => {
    return get().cart.reduce((total, item) => total + item.quantity, 0);
  },

  getTotalPrice: () => {
    return get().cart.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );
  },
}));
