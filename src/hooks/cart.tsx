import React, {
  createContext,
  useState,
  useCallback,
  useContext,
  useEffect,
} from 'react';

import api from '../services/api';

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
      // TODO LOAD ITEMS FROM ASYNC STORAGE

      const response = await api.get("/products");

      if (response.status === 200) {
        let newProducts: Product[] = response.data;

        newProducts.forEach(item => {
          item.quantity = 0;
        });
        setProducts(newProducts);
      }
    }

    loadProducts();
  }, []);

  const addToCart = useCallback(async product => {
    //ADD A NEW ITEM TO THE CART
    let addedProduct: Product = await product;
    addedProduct.quantity = 1;

    const index =
      products.findIndex(
        (item) => { return item.id == addedProduct.id }
        , addedProduct.id);

    console.log(index);
    if (index === -1) {
      let newProducts = [...products, addedProduct];
      newProducts.sort((a, b) => (a.id.localeCompare(b.id)));
      setProducts([...newProducts]);
    } else {
      increment(addedProduct.id);
    }

  }, [products]);

  const increment = useCallback(async id => {
    // INCREMENTS A PRODUCT QUANTITY IN THE CART
    const searchId = await id;
    console.log("+ " + searchId);
    const index =
      products.findIndex(
        (item) => { return item.id == searchId }
        , searchId);

    if (index !== -1) {
      let newProducts = products;
      newProducts[index].quantity++;
      setProducts([...newProducts]);
    }
  }, [products]);



  const decrement = useCallback(async id => {
    // DECREMENTS A PRODUCT QUANTITY IN THE CART
    const searchId = await id;
    console.log("- " + searchId);
    const index =
      products.findIndex(
        (item) => { return item.id == searchId }
        , searchId);

    if (index !== -1) {
      let newProducts = products;
      newProducts[index].quantity--;
      setProducts([...newProducts]);
    }
  }, [products]);

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
