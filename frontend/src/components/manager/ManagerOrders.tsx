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
    <div className="space-y-8">
      <div>
        <span className="text-xs font-bold uppercase tracking-widest text-[#27c2d2]">
          Fulfillment & Dispatch Desk
        </span>
        <h1 className="sp-type-headline-lg text-3xl sm:text-[46px] text-white mt-1">
          Order Management
        </h1>
        <p className="text-sm text-[#b0b0b0] mt-1">
          Review, approve, assign drivers, and update fulfillment status for all customer laboratory orders
        </p>
      </div>

      <div className="sp-card-dark p-6 sm:p-8">
        <div className="flex flex-wrap gap-4 mb-6">
          <div className="relative flex-grow max-w-md">
            <input
              type="text"
              placeholder="Search by Order ID, Invoice #, or Customer Name..."
              className="pl-10 pr-4 py-2.5 w-full bg-[#000000] border border-[#2d2d2d] text-white placeholder-[#b0b0b0] rounded-none focus:outline-none focus:border-[#0e97b0] text-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <SearchIcon className="absolute left-3.5 top-3 h-4 w-4 text-[#b0b0b0]" />
          </div>
          <select
            className="bg-[#000000] border border-[#2d2d2d] text-white px-4 py-2.5 rounded-none focus:outline-none focus:border-[#0e97b0] text-sm"
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
          <table className="min-w-full divide-y divide-[#212121] text-sm">
            <thead className="bg-[#131313]">
              <tr>
                <th className="px-4 py-3.5 text-left text-xs font-semibold text-[#b0b0b0] uppercase">
                  Order / Invoice
                </th>
                <th className="px-4 py-3.5 text-left text-xs font-semibold text-[#b0b0b0] uppercase">
                  Customer
                </th>
                <th className="px-4 py-3.5 text-left text-xs font-semibold text-[#b0b0b0] uppercase">
                  Date
                </th>
                <th className="px-4 py-3.5 text-left text-xs font-semibold text-[#b0b0b0] uppercase">
                  Items
                </th>
                <th className="px-4 py-3.5 text-left text-xs font-semibold text-[#b0b0b0] uppercase">
                  Total
                </th>
                <th className="px-4 py-3.5 text-left text-xs font-semibold text-[#b0b0b0] uppercase">
                  Fulfillment
                </th>
                <th className="px-4 py-3.5 text-left text-xs font-semibold text-[#b0b0b0] uppercase">
                  Status
                </th>
                <th className="px-4 py-3.5 text-left text-xs font-semibold text-[#b0b0b0] uppercase">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#212121]">
              {filteredOrders.map((order) => (
                <tr key={order.id} className="hover:bg-[#131313]">
                  <td className="px-4 py-4 whitespace-nowrap">
                    <div className="font-bold text-[#27c2d2]">{order.id}</div>
                    <div className="text-xs text-[#b0b0b0]">
                      {order.invoiceNumber || 'INV-GENERATED'}
                    </div>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    <div className="font-bold text-white">
                      {order.customerName || 'Dr. Aris Thorne'}
                    </div>
                    <div className="text-xs text-[#b0b0b0]">
                      {order.customerEmail || 'customer@example.com'}
                    </div>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-[#b0b0b0]">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-white">
                    {order.items.length} item(s)
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap font-bold text-white">
                    ${order.totalAmount.toFixed(2)}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-xs text-[#b0b0b0]">
                    <span className="capitalize font-bold text-white">
                      {order.fulfillmentOption}
                    </span>{' '}
                    ({order.paymentMethod.toUpperCase()})
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    <select
                      value={order.status}
                      onChange={(e) =>
                        handleStatusChange(order.id, e.target.value as Order['status'])
                      }
                      className={`text-xs font-bold rounded-full px-3 py-1 border cursor-pointer bg-[#000000] ${
                        order.status === 'completed' || order.status === 'delivered'
                          ? 'text-[#4dfd88] border-[#0f9b40]'
                          : order.status === 'pending'
                          ? 'text-[#ff8da8] border-[#aa4266]'
                          : 'text-[#27c2d2] border-[#0e97b0]'
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
                  <td className="px-4 py-4 whitespace-nowrap">
                    <button
                      onClick={() => setSelectedOrder(order)}
                      className="text-[#27c2d2] hover:underline font-semibold inline-flex items-center"
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
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-[#090909] border border-[#212121] rounded-[32px] shadow-2xl max-w-2xl w-full overflow-hidden text-white">
            <div className="flex justify-between items-center p-6 border-b border-[#212121] bg-[#131313]">
              <div>
                <h2 className="text-lg font-bold text-white font-display">
                  Order Details — {selectedOrder.id}
                </h2>
                <p className="text-xs text-[#b0b0b0]">
                  Invoice: {selectedOrder.invoiceNumber || 'N/A'} • Placed{' '}
                  {new Date(selectedOrder.createdAt).toLocaleString()}
                </p>
              </div>
              <button
                onClick={() => setSelectedOrder(null)}
                className="text-[#b0b0b0] hover:text-white"
              >
                <XIcon className="h-5 w-5" />
              </button>
            </div>

            <div className="p-6 space-y-5 max-h-[80vh] overflow-y-auto">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-[#131313] p-4 rounded-[20px] border border-[#212121] text-sm">
                <div>
                  <p className="text-xs text-[#27c2d2] uppercase font-bold">
                    Customer Details
                  </p>
                  <p className="font-bold text-white mt-1">
                    {selectedOrder.customerName || 'Dr. Aris Thorne'}
                  </p>
                  <p className="text-[#b0b0b0] text-xs">
                    {selectedOrder.customerEmail || 'customer@example.com'}
                  </p>
                  <p className="text-[#b0b0b0] text-xs">
                    {selectedOrder.customerPhone || '555-345-6789'}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-[#27c2d2] uppercase font-bold">
                    Fulfillment & Logistics
                  </p>
                  <p className="font-bold text-white mt-1 capitalize">
                    Method: {selectedOrder.fulfillmentOption} (
                    {selectedOrder.paymentMethod.toUpperCase()})
                  </p>
                  <p className="text-[#b0b0b0] text-xs">
                    Driver: {selectedOrder.assignedDriver || 'Carlos Mendez'}
                  </p>
                  <p className="text-[#b0b0b0] text-xs">
                    Tracking: {selectedOrder.trackingNumber || 'Local Pickup'}
                  </p>
                </div>
                <div className="sm:col-span-2">
                  <p className="text-xs text-[#27c2d2] uppercase font-bold">
                    Destination / Lab Address
                  </p>
                  <p className="text-white text-xs mt-0.5">
                    {selectedOrder.deliveryAddress ||
                      'LISM Main Lab Facility Pickup Counter'}
                  </p>
                  {selectedOrder.notes && (
                    <p className="text-white bg-[#aa4266]/30 border border-[#aa4266] rounded-[12px] px-3 py-2 text-xs mt-2">
                      <strong>Handling Notes:</strong> {selectedOrder.notes}
                    </p>
                  )}
                </div>
              </div>

              <div>
                <h3 className="font-bold text-sm text-white mb-2">
                  Ordered Laboratory Items
                </h3>
                <div className="border border-[#212121] rounded-[20px] divide-y divide-[#212121] bg-[#131313]">
                  {selectedOrder.items.map((orderItem, idx) => {
                    const catalogItem = items.find((i) => i.id === orderItem.itemId);
                    const itemName =
                      orderItem.name || catalogItem?.name || `Item #${orderItem.itemId}`;
                    return (
                      <div
                        key={idx}
                        className="p-3.5 flex justify-between items-center text-sm"
                      >
                        <div>
                          <p className="font-bold text-white">{itemName}</p>
                          <p className="text-xs text-[#b0b0b0]">
                            {catalogItem?.sku || `ID-${orderItem.itemId}`} • Qty:{' '}
                            {orderItem.quantity} × ${orderItem.price.toFixed(2)}
                          </p>
                        </div>
                        <p className="font-bold text-white">
                          ${(orderItem.quantity * orderItem.price).toFixed(2)}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="flex flex-wrap justify-between items-center border-t border-[#212121] pt-4 gap-4">
                <div>
                  <span className="text-xs text-[#b0b0b0] block">
                    Quick Workflow Actions
                  </span>
                  <div className="flex flex-wrap gap-2 mt-1.5">
                    <button
                      onClick={() => handleStatusChange(selectedOrder.id, 'processing')}
                      className="sp-btn-outline px-4 py-1.5 text-xs"
                    >
                      Approve & Process
                    </button>
                    <button
                      onClick={() => handleStatusChange(selectedOrder.id, 'in-transit')}
                      className="sp-btn-primary px-4 py-1.5 text-xs"
                    >
                      <TruckIcon className="h-3.5 w-3.5 mr-1" /> Dispatch Delivery
                    </button>
                    <button
                      onClick={() => handleStatusChange(selectedOrder.id, 'completed')}
                      className="px-4 py-1.5 bg-[#0f9b40] hover:bg-[#27b064] text-white rounded-[20px] text-xs font-bold flex items-center"
                    >
                      <CheckCircleIcon className="h-3.5 w-3.5 mr-1" /> Complete Order
                    </button>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xs text-[#b0b0b0]">Total Amount</p>
                  <p className="text-2xl font-bold text-[#27c2d2] font-display">
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
