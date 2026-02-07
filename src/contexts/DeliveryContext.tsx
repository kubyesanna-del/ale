import React, { createContext, useContext, useState, ReactNode } from 'react';

export interface DeliveryMode {
  id: 'motorbike' | 'car' | 'bicycle';
  name: string;
  icon: string;
  deliveryTime: number;
  basePrice: number;
  description: string;
}

export interface DeliveryState {
  selectedMode: DeliveryMode | null;
  deliveryAddresses: string[];
  cartItems: any[];
  foodSubtotal: number;
  itemCount: number;
  promoDiscount: number;
}

interface DeliveryContextType {
  state: DeliveryState;
  setSelectedMode: (mode: DeliveryMode) => void;
  setDeliveryAddresses: (addresses: string[]) => void;
  setCartData: (items: any[], subtotal: number, itemCount: number) => void;
  getDeliveryFee: () => number;
  getTotal: () => number;
}

const DeliveryContext = createContext<DeliveryContextType | undefined>(undefined);

export function DeliveryProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<DeliveryState>({
    selectedMode: null,
    deliveryAddresses: [],
    cartItems: [],
    foodSubtotal: 0,
    itemCount: 0,
    promoDiscount: 0.30,
  });

  const setSelectedMode = (mode: DeliveryMode) => {
    setState(prev => ({ ...prev, selectedMode: mode }));
  };

  const setDeliveryAddresses = (addresses: string[]) => {
    setState(prev => ({ ...prev, deliveryAddresses: addresses }));
  };

  const setCartData = (items: any[], subtotal: number, itemCount: number) => {
    setState(prev => ({ ...prev, cartItems: items, foodSubtotal: subtotal, itemCount }));
  };

  const getDeliveryFee = () => {
    if (!state.selectedMode) return 0;
    return state.selectedMode.basePrice;
  };

  const getTotal = () => {
    const subtotal = state.foodSubtotal;
    const deliveryFee = getDeliveryFee();
    const total = subtotal + deliveryFee;
    return total;
  };

  return (
    <DeliveryContext.Provider
      value={{
        state,
        setSelectedMode,
        setDeliveryAddresses,
        setCartData,
        getDeliveryFee,
        getTotal,
      }}
    >
      {children}
    </DeliveryContext.Provider>
  );
}

export function useDelivery() {
  const context = useContext(DeliveryContext);
  if (!context) {
    throw new Error('useDelivery must be used within DeliveryProvider');
  }
  return context;
}
