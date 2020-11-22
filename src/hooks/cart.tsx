import React, {
  createContext,
  useState,
  useCallback,
  useContext,
  useEffect,
} from 'react';

import AsyncStorage from '@react-native-community/async-storage';

interface Product {
  id: string;
  title: string;
  image_url: string;
  price: number;
  quantity: number;
}

interface CartContext {
  products: Product[];
  addToCart(item: Omit<Product, 'quantity'>): void;
  increment(id: string): void;
  decrement(id: string): void;
}

const CartContext = createContext<CartContext | null>(null);

const CartProvider: React.FC = ({ children }) => {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    async function loadProducts(): Promise<void> {
      const storageProducts = await AsyncStorage.getItem('@cart:products');
      if (storageProducts) {
        setProducts(JSON.parse(storageProducts));
      }
    }

    loadProducts();
  }, []);

  const addToCart = useCallback(
    async (product: Product) => {
      const existeProduct = products.filter(
        (item: Product) => item.id === product.id,
      );

      if (existeProduct.length > 0) {
        const newProducts = products.map((item: Product) => {
          if (item.id === existeProduct[0].id) {
            item.quantity += 1;
          }
          return item;
        });
        setProducts(newProducts);
        await AsyncStorage.setItem(
          '@cart:products',
          JSON.stringify(newProducts),
        );
      } else {
        product.quantity = 1;
        setProducts([...products, product]);
        await AsyncStorage.setItem(
          '@cart:products',
          JSON.stringify([...products, product]),
        );
      }
    },
    [products],
  );

  const increment = useCallback(
    async id => {
      const product = products.filter((item: Product) => item.id === id);

      if (product.length > 0) {
        const newProducts = products.map(item => {
          if (item.id === product[0].id) {
            item.quantity += 1;
          }
          return item;
        });
        setProducts(newProducts);
        await AsyncStorage.setItem(
          '@cart:products',
          JSON.stringify(newProducts),
        );
      }
    },
    [products],
  );

  const decrement = useCallback(
    async id => {
      const product = products.filter((item: Product) => item.id === id);

      if (product.length > 0) {
        const newProducts = products.map(item => {
          if (item.id === product[0].id && item.quantity > 1) {
            item.quantity -= 1;
          }
          return item;
        });
        setProducts(newProducts);
        await AsyncStorage.setItem(
          '@cart:products',
          JSON.stringify(newProducts),
        );
      }
    },
    [products],
  );

  const value = React.useMemo(
    () => ({ addToCart, increment, decrement, products }),
    [products, addToCart, increment, decrement],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

function useCart(): CartContext {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error(`useCart must be used within a CartProvider`);
  }

  return context;
}

export { CartProvider, useCart };
