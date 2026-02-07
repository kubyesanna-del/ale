import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Plus, ChevronUp, Clock, MapPin } from 'lucide-react';
import { useFoodOrderSession } from '../contexts/FoodOrderSession';
import { useDelivery } from '../contexts/DeliveryContext';
import { DeliveryMap } from '../components/DeliveryMap';
import { DELIVERY_MODES, PROMO_DISCOUNT_PERCENTAGE } from '../data/deliveryModes';

type PanelPosition = 'collapsed' | 'mid' | 'expanded';

export function FoodDeliveryNew() {
  const navigate = useNavigate();
  const { cartItems, stops, deliveryLocation } = useFoodOrderSession();
  const { state, setSelectedMode, setCartData, setDeliveryAddresses, getDeliveryFee, getTotal } = useDelivery();

  const [panelPosition, setPanelPosition] = useState<PanelPosition>('collapsed');
  const [dragOffset, setDragOffset] = useState(0);
  const [filter, setFilter] = useState<'recommended' | 'faster' | 'cheaper'>('recommended');
  const panelRef = useRef<HTMLDivElement>(null);
  const dragStartRef = useRef(0);

  // Initialize delivery data
  useEffect(() => {
    const allAddresses = [deliveryLocation, ...stops.map(s => s.address).filter(a => a)];
    setDeliveryAddresses(allAddresses);

    const total = cartItems.reduce((sum, item) => sum + (item.price || 0) * (item.quantity || 0), 0);
    const count = cartItems.reduce((sum, item) => sum + (item.quantity || 0), 0);
    setCartData(cartItems, total, count);

    // Set default to motorbike
    if (!state.selectedMode) {
      setSelectedMode(DELIVERY_MODES[0]);
    }
  }, [cartItems, deliveryLocation, stops, setCartData, setDeliveryAddresses, state.selectedMode, setSelectedMode]);

  // Get sorted delivery modes based on filter
  const getSortedModes = () => {
    const modes = [...DELIVERY_MODES];
    switch (filter) {
      case 'faster':
        return modes.sort((a, b) => a.deliveryTime - b.deliveryTime);
      case 'cheaper':
        return modes.sort((a, b) => a.basePrice - b.basePrice);
      default:
        return modes;
    }
  };

  const handleDragStart = (e: React.TouchEvent) => {
    dragStartRef.current = e.touches[0].clientY;
  };

  const handleDragMove = (e: React.TouchEvent) => {
    if (!dragStartRef.current) return;
    const currentY = e.touches[0].clientY;
    const diff = dragStartRef.current - currentY;
    setDragOffset(diff);
  };

  const handleDragEnd = () => {
    const threshold = 50;

    if (dragOffset > threshold) {
      setPanelPosition(panelPosition === 'collapsed' ? 'mid' : 'expanded');
    } else if (dragOffset < -threshold) {
      setPanelPosition(panelPosition === 'expanded' ? 'mid' : 'collapsed');
    }

    setDragOffset(0);
    dragStartRef.current = 0;
  };

  const getPanelHeight = () => {
    switch (panelPosition) {
      case 'collapsed':
        return 'h-40';
      case 'mid':
        return 'h-96';
      case 'expanded':
        return 'h-full';
    }
  };

  const itemCount = state.itemCount;
  const deliveryAddresses = [deliveryLocation, ...stops.map(s => s.address).filter(a => a)];

  return (
    <div className="relative w-full h-screen overflow-hidden bg-gray-50">
      {/* Map Background */}
      <DeliveryMap />

      {/* Top Fixed Header */}
      <div className="fixed top-0 left-0 right-0 z-40 bg-white border-b border-gray-200">
        <div className="p-3 flex items-center justify-between gap-2">
          <motion.button
            onClick={() => navigate('/foodies-route')}
            whileTap={{ scale: 0.95 }}
            className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors flex-shrink-0"
          >
            <X size={20} className="text-gray-800" />
          </motion.button>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1 px-3 py-2 bg-gray-100 rounded-full text-center">
              <span className="text-xs font-medium text-gray-700 truncate">
                {deliveryAddresses[0]?.split(',')[0] || 'Current Location'} → Delivery ( {itemCount} item{itemCount !== 1 ? 's' : ''}...)
              </span>
            </div>
          </div>

          <motion.button
            onClick={() => navigate('/foodies-route')}
            whileTap={{ scale: 0.95 }}
            className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors flex-shrink-0"
          >
            <Plus size={20} className="text-green-600" />
          </motion.button>
        </div>
      </div>

      {/* Bottom Fixed Action Panel */}
      <div className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 px-3 py-3">
        <div className="flex items-center gap-3 mb-3">
          <button className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-200 hover:bg-gray-300 transition-colors">
            👤
          </button>
          <button className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-200 hover:bg-gray-300 transition-colors">
            💼
          </button>
          <button className="flex-1 px-4 py-2 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors text-sm font-medium text-gray-700">
            Cash
          </button>
        </div>

        <motion.button
          whileTap={{ scale: 0.98 }}
          className="w-full py-3 bg-green-600 hover:bg-green-700 text-white font-semibold text-sm rounded-lg transition-colors"
        >
          Select {state.selectedMode?.name}
        </motion.button>
      </div>

      {/* Draggable Main Panel */}
      <motion.div
        ref={panelRef}
        onTouchStart={handleDragStart}
        onTouchMove={handleDragMove}
        onTouchEnd={handleDragEnd}
        animate={{
          bottom: panelPosition === 'expanded' ? 0 : panelPosition === 'mid' ? '20%' : '0%',
        }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        className={`fixed left-0 right-0 z-30 ${getPanelHeight()} bg-white rounded-t-3xl shadow-2xl overflow-hidden flex flex-col pointer-events-auto`}
        style={{ bottom: panelPosition === 'collapsed' ? '100px' : undefined }}
      >
        {/* Drag Handle */}
        <div className="flex justify-center pt-2 pb-1">
          <div className="w-12 h-1 bg-gray-300 rounded-full cursor-grab active:cursor-grabbing" />
        </div>

        {/* Promo Banner */}
        <motion.div className="bg-blue-600 text-white px-4 py-2 flex items-center justify-center gap-2">
          <span className="text-sm font-semibold">✓ {PROMO_DISCOUNT_PERCENTAGE}% promo applied</span>
          <ChevronUp size={16} />
        </motion.div>

        {/* Filter Buttons - Only visible when expanded */}
        <AnimatePresence>
          {panelPosition === 'expanded' && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="px-4 py-3 flex gap-2 border-b border-gray-100"
            >
              {[
                { id: 'recommended' as const, label: 'Standard', icon: '📍' },
                { id: 'faster' as const, label: 'Faster', icon: '⚡' },
                { id: 'cheaper' as const, label: 'Cheaper', icon: '💰' },
              ].map(btn => (
                <motion.button
                  key={btn.id}
                  onClick={() => setFilter(btn.id)}
                  className={`flex-1 px-3 py-2 rounded-full text-xs font-medium transition-all ${
                    filter === btn.id
                      ? 'bg-green-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                  whileTap={{ scale: 0.95 }}
                >
                  {btn.icon} {btn.label}
                </motion.button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Delivery Modes Section */}
        <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3">
          {getSortedModes().map(mode => (
            <motion.button
              key={mode.id}
              onClick={() => setSelectedMode(mode)}
              whileTap={{ scale: 0.98 }}
              className={`w-full p-4 rounded-xl border-2 transition-all ${
                state.selectedMode?.id === mode.id
                  ? 'border-green-600 bg-green-50'
                  : 'border-gray-200 bg-white hover:border-gray-300'
              }`}
            >
              <div className="flex items-start gap-4">
                <div className="text-3xl">{mode.icon}</div>

                <div className="flex-1 text-left">
                  <div className="flex items-baseline gap-1 mb-1">
                    <h3 className="font-bold text-gray-900">{mode.name}</h3>
                    <span className="text-xs text-gray-500">{mode.deliveryTime} min</span>
                  </div>
                  <div className="flex items-center gap-1 text-xs mb-2">
                    <span>🍔</span>
                    <span className="text-gray-600">{itemCount}</span>
                  </div>
                  <p className="text-xs text-gray-600">{mode.description}</p>
                </div>

                <div className="text-right flex-shrink-0">
                  <div className="font-bold text-gray-900">R {state.foodSubtotal + mode.basePrice}</div>
                  <div className="text-xs text-gray-500">R {mode.basePrice}</div>
                </div>
              </div>
            </motion.button>
          ))}
        </div>

        {/* Price Breakdown - Only visible when expanded */}
        <AnimatePresence>
          {panelPosition === 'expanded' && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="px-4 py-4 border-t border-gray-200 bg-gray-50"
            >
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Food subtotal</span>
                  <span className="font-medium text-gray-900">R {state.foodSubtotal}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Delivery fee</span>
                  <span className="font-medium text-gray-900">R {getDeliveryFee()}</span>
                </div>
                <div className="border-t border-gray-300 pt-2 flex justify-between">
                  <span className="font-semibold text-gray-900">Total</span>
                  <span className="font-bold text-gray-900">R {getTotal()}</span>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
