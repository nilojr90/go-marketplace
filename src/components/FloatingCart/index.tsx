import React, { useState, useMemo } from 'react';

import { useNavigation } from '@react-navigation/native';

import FeatherIcon from 'react-native-vector-icons/Feather';
import {
  Container,
  CartPricing,
  CartButton,
  CartButtonText,
  CartTotalPrice,
} from './styles';

import formatValue from '../../utils/formatValue';

import { useCart } from '../../hooks/cart';
import { isTemplateHead } from 'typescript';

// Calculo do total
// Navegação no clique do TouchableHighlight

const FloatingCart: React.FC = () => {
  const { products } = useCart();

  const navigation = useNavigation();

  const cartTotal = useMemo(() => {
    //RETURN THE SUM OF THE PRICE FROM ALL ITEMS IN THE CART
    if (products.length === 0) {
      return formatValue(0);
    }

    const cartTotal = products
      .map((item) => (item.price * item.quantity))
      .reduce((total, item) => { return total + item });

    return formatValue(cartTotal);
  }, [products]);

  const totalItensInCart = useMemo(() => {
    //RETURN THE SUM OF THE QUANTITY OF THE PRODUCTS IN THE CART
    if (products.length === 0) {
      return 0;
    }

    const countItensInCart = products
      .map((item) => (item.quantity))
      .reduce((total, item) => (total + item));

    return countItensInCart;
  }, [products]);

  return (
    <Container>
      <CartButton
        testID="navigate-to-cart-button"
        onPress={() => navigation.navigate('Cart')}
      >
        <FeatherIcon name="shopping-cart" size={24} color="#fff" />
        <CartButtonText>{`${totalItensInCart} itens`}</CartButtonText>
      </CartButton>

      <CartPricing>
        <CartTotalPrice>{`${cartTotal}`}</CartTotalPrice>
      </CartPricing>
    </Container>
  );
};

export default FloatingCart;
