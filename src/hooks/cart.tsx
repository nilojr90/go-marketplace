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
      // LOAD ITEMS FROM ASYNC STORAGE

      const newProducts = await loadCart();
      if (newProducts != null) {
        setProducts(newProducts);
      }
    }

    loadProducts();
  }, []);

  const saveCart = async (products: Product[]) => {
    try {
      const jsonProducts = JSON.stringify(products);
      await AsyncStorage.setItem('@gomarketplace-cart', jsonProducts);
    } catch (error) {
      console.log(error.message);
    }
  };

  const loadCart = async (): Promise<Product[] | null> => {
    let products = null;
    try {
      const jsonProducts = await AsyncStorage.getItem('@gomarketplace-cart');

      if (jsonProducts != null) {
        products = JSON.parse(jsonProducts);
      }
    } catch (error) {
      console.log(error.message);
    }
    return products;
  };

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
      saveCart(newProducts);
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
      if (isNaN(newProducts[index].quantity)) {
        newProducts[index].quantity = 0;
      }
      newProducts[index].quantity++;
      setProducts([...newProducts]);
      saveCart(newProducts);
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
      saveCart(newProducts);
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
