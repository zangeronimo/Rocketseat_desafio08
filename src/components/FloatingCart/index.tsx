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

// Calculo do total
// Navegação no clique do TouchableHighlight

interface Product {
  id: string;
  title: string;
  image_url: string;
  price: number;
  quantity: number;
}

const FloatingCart: React.FC = () => {
  const { products } = useCart();

  const navigation = useNavigation();

  const cartTotal = useMemo(() => {
    const productsPrices = products.map(
      (item: Product) => item.quantity * item.price,
    );
    if (productsPrices.length > 0) {
      const priceTotal = productsPrices.reduce(
        (price, total = 0) => total + price,
      );
      return formatValue(priceTotal);
    }
    formatValue(0);
  }, [products]);

  const totalItensInCart = useMemo(() => {
    const productsQuantities = products.map((item: Product) => item.quantity);

    if (productsQuantities.length > 0) {
      const quantityTotal = productsQuantities.reduceRight(
        (quantity, total = 0) => total + quantity,
      );
      return quantityTotal;
    }
    return 0;
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
        <CartTotalPrice>{cartTotal}</CartTotalPrice>
      </CartPricing>
    </Container>
  );
};

export default FloatingCart;
