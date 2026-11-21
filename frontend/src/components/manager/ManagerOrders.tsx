import React, { useState } from 'react';
import { useAppContext, Order } from '../../context/AppContext';
import {
  SearchIcon,
  EyeIcon,
  XIcon,
  TruckIcon,
  CheckCircleIcon
} from 'lucide-react';

export const ManagerOrders: React.FC = () => {
  const { orders, items, updateOrder } = useAppContext();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (order.customerName || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (order.invoiceNumber || '').toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      filterStatus === 'all' || order.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const handleStatusChange = (orderId: string, newStatus: Order['status']) => {
    updateOrder(orderId, { status: newStatus });
    if (selectedOrder && selectedOrder.id === orderId) {
      setSelectedOrder({ ...selectedOrder, status: newStatus });
    }
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Order Management</h1>
        <p className="text-sm text-gray-500">
          Review, approve, assign drivers, and update fulfillment status for all customer laboratory orders
        </p>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <div className="flex flex-wrap gap-4 mb-6">
          <div className="relative flex-grow max-w-md">
            <input
              type="text"
              placeholder="Search by Order ID, Invoice #, or Customer Name..."
              className="pl-9 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <SearchIcon className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
          </div>
          <select
            className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <option value="all">All Statuses ({orders.length})</option>
            <option value="pending">Pending</option>
            <option value="processing">Processing</option>
            <option value="in-transit">In Transit</option>
            <option value="delivered">Delivered</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Order / Invoice
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Customer
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Date
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Items
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Total
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Fulfillment
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Status
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredOrders.map((order) => (
                <tr key={order.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 whitespace-nowrap">
                    <div className="font-semibold text-blue-600">{order.id}</div>
                    <div className="text-xs text-gray-500">
                      {order.invoiceNumber || 'INV-GENERATED'}
                    </div>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <div className="font-medium text-gray-900">
                      {order.customerName || 'Dr. Aris Thorne'}
                    </div>
                    <div className="text-xs text-gray-500">
                      {order.customerEmail || 'customer@example.com'}
                    </div>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-gray-600">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    {order.items.length} item(s)
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap font-bold text-gray-900">
                    ${order.totalAmount.toFixed(2)}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-xs">
                    <span className="capitalize font-medium text-gray-800">
                      {order.fulfillmentOption}
                    </span>{' '}
                    ({order.paymentMethod.toUpperCase()})
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <select
                      value={order.status}
                      onChange={(e) =>
                        handleStatusChange(order.id, e.target.value as Order['status'])
                      }
                      className={`text-xs font-semibold rounded-full px-2.5 py-1 border cursor-pointer ${
                        order.status === 'completed' || order.status === 'delivered'
                          ? 'bg-green-100 text-green-800 border-green-300'
                          : order.status === 'pending'
                          ? 'bg-yellow-100 text-yellow-800 border-yellow-300'
                          : order.status === 'in-transit'
                          ? 'bg-blue-100 text-blue-800 border-blue-300'
                          : order.status === 'cancelled'
                          ? 'bg-red-100 text-red-800 border-red-300'
                          : 'bg-purple-100 text-purple-800 border-purple-300'
                      }`}
                    >
                      <option value="pending">Pending</option>
                      <option value="processing">Processing</option>
                      <option value="in-transit">In Transit</option>
                      <option value="delivered">Delivered</option>
                      <option value="completed">Completed</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <button
                      onClick={() => setSelectedOrder(order)}
                      className="text-blue-600 hover:text-blue-800 font-medium inline-flex items-center"
                    >
                      <EyeIcon className="h-4 w-4 mr-1" /> Details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Order Details Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full overflow-hidden">
            <div className="flex justify-between items-center p-5 border-b border-gray-200 bg-gray-50">
              <div>
                <h2 className="text-lg font-bold text-gray-900">
                  Order Details — {selectedOrder.id}
                </h2>
                <p className="text-xs text-gray-500">
                  Invoice: {selectedOrder.invoiceNumber || 'N/A'} • Placed{' '}
                  {new Date(selectedOrder.createdAt).toLocaleString()}
                </p>
              </div>
              <button
                onClick={() => setSelectedOrder(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                <XIcon className="h-5 w-5" />
              </button>
            </div>

            <div className="p-6 space-y-5 max-h-[80vh] overflow-y-auto">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-gray-50 p-4 rounded-lg border border-gray-200 text-sm">
                <div>
                  <p className="text-xs text-gray-500 uppercase font-semibold">
                    Customer Details
                  </p>
                  <p className="font-semibold text-gray-900 mt-1">
                    {selectedOrder.customerName || 'Dr. Aris Thorne'}
                  </p>
                  <p className="text-gray-600 text-xs">
                    {selectedOrder.customerEmail || 'customer@example.com'}
                  </p>
                  <p className="text-gray-600 text-xs">
                    {selectedOrder.customerPhone || '555-345-6789'}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 uppercase font-semibold">
                    Fulfillment & Logistics
                  </p>
                  <p className="font-medium text-gray-900 mt-1 capitalize">
                    Method: {selectedOrder.fulfillmentOption} ({selectedOrder.paymentMethod.toUpperCase()})
                  </p>
                  <p className="text-gray-600 text-xs">
                    Driver: {selectedOrder.assignedDriver || 'Carlos Mendez'}
                  </p>
                  <p className="text-gray-600 text-xs">
                    Tracking: {selectedOrder.trackingNumber || 'Local Pickup'}
                  </p>
                </div>
                <div className="sm:col-span-2">
                  <p className="text-xs text-gray-500 uppercase font-semibold">
                    Destination / Lab Address
                  </p>
                  <p className="text-gray-800 text-xs mt-0.5">
                    {selectedOrder.deliveryAddress || 'LISM Main Lab Facility Pickup Counter'}
                  </p>
                  {selectedOrder.notes && (
                    <p className="text-amber-800 bg-amber-50 border border-amber-200 rounded px-2.5 py-1.5 text-xs mt-2">
                      <strong>Handling Notes:</strong> {selectedOrder.notes}
                    </p>
                  )}
                </div>
              </div>

              <div>
                <h3 className="font-semibold text-sm text-gray-800 mb-2">
                  Ordered Laboratory Items
                </h3>
                <div className="border border-gray-200 rounded-lg divide-y divide-gray-200">
                  {selectedOrder.items.map((orderItem, idx) => {
                    const catalogItem = items.find((i) => i.id === orderItem.itemId);
                    const itemName =
                      orderItem.name || catalogItem?.name || `Item #${orderItem.itemId}`;
                    return (
                      <div
                        key={idx}
                        className="p-3 flex justify-between items-center text-sm"
                      >
                        <div>
                          <p className="font-medium text-gray-900">{itemName}</p>
                          <p className="text-xs text-gray-500">
                            {catalogItem?.sku || `ID-${orderItem.itemId}`} • Qty:{' '}
                            {orderItem.quantity} × ${orderItem.price.toFixed(2)}
                          </p>
                        </div>
                        <p className="font-semibold text-gray-900">
                          ${(orderItem.quantity * orderItem.price).toFixed(2)}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="flex justify-between items-center border-t border-gray-200 pt-4">
                <div>
                  <span className="text-xs text-gray-500 block">Quick Workflow Actions</span>
                  <div className="flex flex-wrap gap-2 mt-1.5">
                    <button
                      onClick={() => handleStatusChange(selectedOrder.id, 'processing')}
                      className="px-3 py-1.5 bg-purple-600 text-white rounded text-xs font-medium hover:bg-purple-700"
                    >
                      Approve & Process
                    </button>
                    <button
                      onClick={() => handleStatusChange(selectedOrder.id, 'in-transit')}
                      className="px-3 py-1.5 bg-blue-600 text-white rounded text-xs font-medium hover:bg-blue-700 flex items-center"
                    >
                      <TruckIcon className="h-3.5 w-3.5 mr-1" /> Dispatch Delivery
                    </button>
                    <button
                      onClick={() => handleStatusChange(selectedOrder.id, 'completed')}
                      className="px-3 py-1.5 bg-green-600 text-white rounded text-xs font-medium hover:bg-green-700 flex items-center"
                    >
                      <CheckCircleIcon className="h-3.5 w-3.5 mr-1" /> Complete Order
                    </button>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xs text-gray-500">Total Amount</p>
                  <p className="text-2xl font-bold text-blue-900">
                    ${selectedOrder.totalAmount.toFixed(2)}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
