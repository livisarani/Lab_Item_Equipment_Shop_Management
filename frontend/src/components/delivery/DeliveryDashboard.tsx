import React, { useState } from 'react';
import { useAppContext, Order } from '../../context/AppContext';
import {
  TruckIcon,
  MapPinIcon,
  CheckCircleIcon,
  ClipboardListIcon,
  PhoneIcon,
  UserIcon
} from 'lucide-react';

export const DeliveryDashboard: React.FC = () => {
  const { orders, items, updateOrder } = useAppContext();
  const [selectedOrder, setSelectedOrder] = useState<string | null>(
    orders.find((o) => o.fulfillmentOption === 'delivery')?.id || null
  );

  const deliveryOrders = orders.filter(
    (order) =>
      order.fulfillmentOption === 'delivery' &&
      ['pending', 'processing', 'in-transit'].includes(order.status)
  );
  const completedDeliveries = orders.filter(
    (order) =>
      order.fulfillmentOption === 'delivery' &&
      ['delivered', 'completed'].includes(order.status)
  );

  const updateOrderStatus = (orderId: string, status: Order['status']) => {
    updateOrder(orderId, { status });
  };

  return (
    <div className="space-y-8">
      <div>
        <span className="text-xs font-bold uppercase tracking-widest text-[#27c2d2]">
          Cold-Chain & ADR Hazmat Logistics
        </span>
        <h1 className="sp-type-headline-lg text-3xl sm:text-[46px] text-white mt-1">
          Delivery & Hazmat Fleet Management
        </h1>
        <p className="text-sm text-[#b0b0b0] mt-1">
          Manage active cold-chain and ADR hazmat dispatches, inspect handling notes, and confirm deliveries
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="sp-card-crimson p-6 shadow-xl">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-xs uppercase tracking-wider text-white/80">
                Pending Dispatch
              </p>
              <p className="text-3xl font-bold text-white mt-1 font-display">
                {
                  deliveryOrders.filter(
                    (o) => o.status === 'pending' || o.status === 'processing'
                  ).length
                }
              </p>
            </div>
            <div className="h-14 w-14 rounded-full bg-black/30 text-white flex items-center justify-center">
              <TruckIcon className="h-6 w-6" />
            </div>
          </div>
          <p className="text-xs text-white/90 mt-3 font-medium">
            Ready for vehicle loading
          </p>
        </div>

        <div className="sp-card-dark p-6">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-xs uppercase tracking-wider text-[#b0b0b0]">
                In Transit
              </p>
              <p className="text-3xl font-bold text-[#27c2d2] mt-1 font-display">
                {deliveryOrders.filter((o) => o.status === 'in-transit').length}
              </p>
            </div>
            <div className="h-14 w-14 rounded-full bg-[#27c2d2] text-black flex items-center justify-center shadow-lg">
              <MapPinIcon className="h-6 w-6" />
            </div>
          </div>
          <p className="text-xs text-[#b0b0b0] mt-3">
            En route to laboratory facilities
          </p>
        </div>

        <div className="sp-card-dark p-6">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-xs uppercase tracking-wider text-[#b0b0b0]">
                Completed Deliveries
              </p>
              <p className="text-3xl font-bold text-[#4dfd88] mt-1 font-display">
                {completedDeliveries.length}
              </p>
            </div>
            <div className="h-14 w-14 rounded-full bg-[#0f9b40] text-white flex items-center justify-center shadow-lg">
              <CheckCircleIcon className="h-6 w-6" />
            </div>
          </div>
          <p className="text-xs text-[#b0b0b0] mt-3">
            Signed & verified by recipient
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Delivery Queue */}
        <div className="sp-card-dark p-6 sm:p-8">
          <h2 className="text-xl font-bold text-white mb-6 font-display">
            Active Delivery Queue ({deliveryOrders.length})
          </h2>
          {deliveryOrders.length > 0 ? (
            <div className="space-y-4">
              {deliveryOrders.map((order) => (
                <div
                  key={order.id}
                  className={`border rounded-[24px] p-5 cursor-pointer transition-all ${
                    selectedOrder === order.id
                      ? 'border-[#27c2d2] bg-[#0e4e65]/30 shadow-lg'
                      : 'border-[#212121] bg-[#131313] hover:border-[#0e97b0]'
                  }`}
                  onClick={() => setSelectedOrder(order.id)}
                >
                  <div className="flex justify-between mb-2">
                    <div>
                      <span className="font-bold text-white">{order.id}</span>
                      {order.trackingNumber && (
                        <span className="ml-2 text-xs text-[#27c2d2] font-mono">
                          {order.trackingNumber}
                        </span>
                      )}
                    </div>
                    <span
                      className={`text-xs px-3 py-0.5 rounded-full font-bold capitalize ${
                        order.status === 'pending'
                          ? 'bg-[#aa4266] text-white'
                          : 'bg-[#0e97b0] text-white'
                      }`}
                    >
                      {order.status.replace('-', ' ')}
                    </span>
                  </div>

                  <div className="text-xs text-[#b0b0b0] space-y-1.5 mb-2">
                    <div className="flex items-center">
                      <UserIcon className="h-3.5 w-3.5 mr-1.5 text-[#27c2d2]" />
                      <span className="font-bold text-white">
                        {order.customerName || 'Dr. Aris Thorne'}
                      </span>
                    </div>
                    <div className="flex items-center">
                      <MapPinIcon className="h-3.5 w-3.5 mr-1.5 text-[#27c2d2]" />
                      {order.deliveryAddress}
                    </div>
                    <div className="flex items-center">
                      <ClipboardListIcon className="h-3.5 w-3.5 mr-1.5 text-[#27c2d2]" />
                      {order.items.length} item(s) • Driver:{' '}
                      {order.assignedDriver || 'Carlos Mendez'}
                    </div>
                  </div>

                  <div className="flex justify-between items-center mt-3 pt-2.5 border-t border-[#212121]">
                    <span className="font-bold text-white">
                      ${order.totalAmount.toFixed(2)}
                    </span>
                    <span className="text-xs font-medium text-[#b0b0b0]">
                      {order.paymentMethod === 'cod'
                        ? 'Collect Cash/PO on Delivery'
                        : 'Paid Online'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-[#b0b0b0]">
              <TruckIcon className="h-12 w-12 mx-auto text-[#5d5d5d] mb-2" />
              <p>All active deliveries have been completed!</p>
            </div>
          )}
        </div>

        {/* Selected Delivery Details */}
        <div className="sp-card-dark p-6 sm:p-8">
          <h2 className="text-xl font-bold text-white mb-6 font-display">
            Dispatch & Manifest Details
          </h2>
          {selectedOrder ? (
            (() => {
              const order = orders.find((o) => o.id === selectedOrder);
              if (!order) return null;
              return (
                <div>
                  <div className="bg-[#131313] p-5 rounded-[24px] border border-[#212121] mb-5">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h3 className="font-bold text-lg text-white font-display">
                          Order {order.id}
                        </h3>
                        <p className="text-xs text-[#27c2d2] font-mono">
                          Tracking: {order.trackingNumber || 'TRK-LISM-LOCAL'}
                        </p>
                      </div>
                      <span className="px-3 py-1 text-xs font-bold rounded-full bg-[#0e97b0] text-white capitalize">
                        {order.status.replace('-', ' ')}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-3 text-xs">
                      <div>
                        <p className="text-[#b0b0b0]">Recipient</p>
                        <p className="font-bold text-white">
                          {order.customerName || 'Dr. Aris Thorne'}
                        </p>
                      </div>
                      <div>
                        <p className="text-[#b0b0b0]">Contact Phone</p>
                        <p className="font-bold text-white flex items-center">
                          <PhoneIcon className="h-3 w-3 mr-1 text-[#27c2d2]" />
                          {order.customerPhone || '555-345-6789'}
                        </p>
                      </div>
                      <div>
                        <p className="text-[#b0b0b0]">Payment Settlement</p>
                        <p className="font-bold text-white">
                          {order.paymentMethod === 'cod'
                            ? 'Cash / PO on Delivery'
                            : 'Pre-Paid Online'}
                        </p>
                      </div>
                      <div>
                        <p className="text-[#b0b0b0]">Total Value</p>
                        <p className="font-bold text-[#27c2d2]">
                          ${order.totalAmount.toFixed(2)}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="mb-5">
                    <h3 className="font-bold text-sm text-white mb-2">
                      Destination Laboratory Address
                    </h3>
                    <div className="bg-[#131313] p-3.5 rounded-[18px] border border-[#212121] text-sm text-white">
                      {order.deliveryAddress}
                    </div>
                    {order.notes && (
                      <div className="mt-2.5 bg-[#aa4266]/30 border border-[#aa4266] text-white p-3 rounded-[14px] text-xs">
                        <strong>Hazmat / Driver Instructions:</strong> {order.notes}
                      </div>
                    )}
                  </div>

                  <div className="mb-6">
                    <h3 className="font-bold text-sm text-white mb-2">
                      Cargo Manifest ({order.items.length} items)
                    </h3>
                    <div className="space-y-2">
                      {order.items.map((item, index) => {
                        const catItem = items.find((i) => i.id === item.itemId);
                        const itemName =
                          item.name || catItem?.name || `Item #${item.itemId}`;
                        return (
                          <div
                            key={index}
                            className="bg-[#131313] p-3.5 rounded-[18px] border border-[#212121] flex justify-between items-center text-sm"
                          >
                            <div>
                              <p className="font-bold text-white">{itemName}</p>
                              <p className="text-xs text-[#b0b0b0]">
                                Quantity: {item.quantity} {catItem?.unit || 'unit'} •
                                Hazard: {catItem?.hazardLevel || 'Standard'}
                              </p>
                            </div>
                            <p className="font-bold text-white">
                              ${(item.price * item.quantity).toFixed(2)}
                            </p>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  <div className="border-t border-[#212121] pt-4">
                    <h3 className="font-bold text-sm text-white mb-3">
                      Update Live Delivery Status
                    </h3>
                    <div className="flex flex-wrap gap-2.5">
                      <button
                        onClick={() => updateOrderStatus(order.id, 'processing')}
                        disabled={order.status !== 'pending'}
                        className="sp-btn-outline px-4 py-2 text-xs disabled:opacity-40"
                      >
                        1. Mark as Processing / Loaded
                      </button>
                      <button
                        onClick={() => updateOrderStatus(order.id, 'in-transit')}
                        disabled={
                          order.status !== 'processing' && order.status !== 'pending'
                        }
                        className="sp-btn-primary px-4 py-2 text-xs"
                      >
                        2. Start Transit Dispatch
                      </button>
                      <button
                        onClick={() => updateOrderStatus(order.id, 'delivered')}
                        disabled={order.status !== 'in-transit'}
                        className="px-4 py-2 bg-[#0f9b40] hover:bg-[#27b064] text-white rounded-[20px] text-xs font-bold disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                      >
                        3. Confirm Delivered & Signed
                      </button>
                    </div>
                  </div>
                </div>
              );
            })()
          ) : (
            <div className="text-center py-16 text-[#b0b0b0]">
              <p>Select a delivery from the queue to view manifest details</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
