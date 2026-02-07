import { DeliveryMode } from '../contexts/DeliveryContext';

export const DELIVERY_MODES: DeliveryMode[] = [
  {
    id: 'motorbike',
    name: 'Motorbike',
    icon: '🏍️',
    deliveryTime: 2,
    basePrice: 40,
    description: 'Fast delivery',
  },
  {
    id: 'car',
    name: 'Car',
    icon: '🚗',
    deliveryTime: 20,
    basePrice: 60,
    description: 'Standard delivery',
  },
  {
    id: 'bicycle',
    name: 'Bicycle',
    icon: '🚴',
    deliveryTime: 20,
    basePrice: 25,
    description: 'Eco-friendly delivery',
  },
];

export const getDeliveryModeById = (id: string): DeliveryMode | undefined => {
  return DELIVERY_MODES.find(mode => mode.id === id);
};

export const PROMO_DISCOUNT_PERCENTAGE = 30;
