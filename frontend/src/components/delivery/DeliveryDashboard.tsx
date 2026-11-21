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
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">
          Delivery & Hazmat Fleet Management
        </h1>
        <p className="text-sm text-gray-500">
          Manage active cold-chain and ADR hazmat dispatches, inspect handling notes, and confirm deliveries
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm text-gray-500">Pending Dispatch</p>
              <p className="text-2xl font-bold text-amber-600">
                {
                  deliveryOrders.filter(
                    (o) => o.status === 'pending' || o.status === 'processing'
                  ).length
                }
              </p>
            </div>
            <div className="p-3 bg-amber-100 rounded-full">
              <TruckIcon className="h-6 w-6 text-amber-600" />
            </div>
          </div>
          <p className="text-xs text-gray-500 mt-2">Ready for vehicle loading</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm text-gray-500">In Transit</p>
              <p className="text-2xl font-bold text-blue-600">
                {deliveryOrders.filter((o) => o.status === 'in-transit').length}
              </p>
            </div>
            <div className="p-3 bg-blue-100 rounded-full">
              <MapPinIcon className="h-6 w-6 text-blue-600" />
            </div>
          </div>
          <p className="text-xs text-gray-500 mt-2">
            En route to laboratory facilities
          </p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm text-gray-500">Completed Deliveries</p>
              <p className="text-2xl font-bold text-green-600">
                {completedDeliveries.length}
              </p>
            </div>
            <div className="p-3 bg-green-100 rounded-full">
              <CheckCircleIcon className="h-6 w-6 text-green-600" />
            </div>
          </div>
          <p className="text-xs text-gray-500 mt-2">Signed & verified by recipient</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Delivery Queue */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h2 className="text-lg font-semibold mb-4">
            Active Delivery Queue ({deliveryOrders.length})
          </h2>
          {deliveryOrders.length > 0 ? (
            <div className="space-y-4">
              {deliveryOrders.map((order) => (
                <div
                  key={order.id}
                  className={`border rounded-xl p-4 cursor-pointer transition ${
                    selectedOrder === order.id
                      ? 'border-blue-500 bg-blue-50/70'
                      : 'border-gray-200 hover:border-blue-300'
                  }`}
                  onClick={() => setSelectedOrder(order.id)}
                >
                  <div className="flex justify-between mb-2">
                    <div>
                      <span className="font-bold text-gray-900">{order.id}</span>
                      {order.trackingNumber && (
                        <span className="ml-2 text-xs text-blue-600 font-mono">
                          {order.trackingNumber}
                        </span>
                      )}
                    </div>
                    <span
                      className={`text-xs px-2.5 py-0.5 rounded-full font-semibold capitalize ${
                        order.status === 'pending'
                          ? 'bg-yellow-100 text-yellow-800'
                          : order.status === 'processing'
                          ? 'bg-purple-100 text-purple-800'
                          : 'bg-blue-100 text-blue-800'
                      }`}
                    >
                      {order.status.replace('-', ' ')}
                    </span>
                  </div>

                  <div className="text-xs text-gray-600 space-y-1 mb-2">
                    <div className="flex items-center">
                      <UserIcon className="h-3.5 w-3.5 mr-1.5 text-gray-400" />
                      <span className="font-medium text-gray-800">
                        {order.customerName || 'Dr. Aris Thorne'}
                      </span>
                    </div>
                    <div className="flex items-center">
                      <MapPinIcon className="h-3.5 w-3.5 mr-1.5 text-gray-400" />
                      {order.deliveryAddress}
                    </div>
                    <div className="flex items-center">
                      <ClipboardListIcon className="h-3.5 w-3.5 mr-1.5 text-gray-400" />
                      {order.items.length} item(s) • Driver:{' '}
                      {order.assignedDriver || 'Carlos Mendez'}
                    </div>
                  </div>

                  <div className="flex justify-between items-center mt-3 pt-2 border-t border-gray-200/60">
                    <span className="font-bold text-gray-900">
                      ${order.totalAmount.toFixed(2)}
                    </span>
                    <span className="text-xs font-medium text-gray-600">
                      {order.paymentMethod === 'cod'
                        ? 'Collect Cash/PO on Delivery'
                        : 'Paid Online'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <TruckIcon className="h-12 w-12 mx-auto text-gray-300 mb-2" />
              <p>All active deliveries have been completed!</p>
            </div>
          )}
        </div>

        {/* Selected Delivery Details */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h2 className="text-lg font-semibold mb-4">
            Dispatch & Manifest Details
          </h2>
          {selectedOrder ? (
            (() => {
              const order = orders.find((o) => o.id === selectedOrder);
              if (!order) return null;
              return (
                <div>
                  <div className="bg-gray-50 p-4 rounded-xl border border-gray-200 mb-4">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h3 className="font-bold text-lg text-gray-900">
                          Order {order.id}
                        </h3>
                        <p className="text-xs text-blue-600 font-mono">
                          Tracking: {order.trackingNumber || 'TRK-LISM-LOCAL'}
                        </p>
                      </div>
                      <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800 capitalize">
                        {order.status.replace('-', ' ')}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-3 text-xs">
                      <div>
                        <p className="text-gray-500">Recipient</p>
                        <p className="font-semibold text-gray-900">
                          {order.customerName || 'Dr. Aris Thorne'}
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-500">Contact Phone</p>
                        <p className="font-semibold text-gray-900 flex items-center">
                          <PhoneIcon className="h-3 w-3 mr-1 text-blue-600" />
                          {order.customerPhone || '555-345-6789'}
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-500">Payment Settlement</p>
                        <p className="font-semibold text-gray-900">
                          {order.paymentMethod === 'cod'
                            ? 'Cash / PO on Delivery'
                            : 'Pre-Paid Online'}
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-500">Total Value</p>
                        <p className="font-bold text-gray-900">
                          ${order.totalAmount.toFixed(2)}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="mb-4">
                    <h3 className="font-semibold text-sm mb-1.5">
                      Destination Laboratory Address
                    </h3>
                    <div className="bg-gray-50 p-3 rounded-lg border border-gray-200 text-sm text-gray-800">
                      {order.deliveryAddress}
                    </div>
                    {order.notes && (
                      <div className="mt-2 bg-amber-50 border border-amber-200 text-amber-900 p-2.5 rounded-lg text-xs">
                        <strong>Hazmat / Driver Instructions:</strong> {order.notes}
                      </div>
                    )}
                  </div>

                  <div className="mb-6">
                    <h3 className="font-semibold text-sm mb-2">
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
                            className="bg-gray-50 p-3 rounded-lg border border-gray-200 flex justify-between items-center text-sm"
                          >
                            <div>
                              <p className="font-medium text-gray-900">{itemName}</p>
                              <p className="text-xs text-gray-500">
                                Quantity: {item.quantity} {catItem?.unit || 'unit'} •
                                Hazard: {catItem?.hazardLevel || 'Standard'}
                              </p>
                            </div>
                            <p className="font-semibold">
                              ${(item.price * item.quantity).toFixed(2)}
                            </p>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  <div className="border-t border-gray-200 pt-4">
                    <h3 className="font-semibold text-sm mb-3">
                      Update Live Delivery Status
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      <button
                        onClick={() => updateOrderStatus(order.id, 'processing')}
                        disabled={order.status !== 'pending'}
                        className="px-3 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-xs font-semibold disabled:bg-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed"
                      >
                        1. Mark as Processing / Loaded
                      </button>
                      <button
                        onClick={() => updateOrderStatus(order.id, 'in-transit')}
                        disabled={
                          order.status !== 'processing' && order.status !== 'pending'
                        }
                        className="px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold disabled:bg-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed"
                      >
                        2. Start Transit Dispatch
                      </button>
                      <button
                        onClick={() => updateOrderStatus(order.id, 'delivered')}
                        disabled={order.status !== 'in-transit'}
                        className="px-3 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg text-xs font-semibold disabled:bg-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed"
                      >
                        3. Confirm Delivered & Signed
                      </button>
                    </div>
                  </div>
                </div>
              );
            })()
          ) : (
            <div className="text-center py-16 text-gray-500">
              <p>Select a delivery from the queue to view manifest details</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
