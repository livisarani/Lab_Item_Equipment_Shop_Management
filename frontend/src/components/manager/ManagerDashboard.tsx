import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../../context/AppContext';
import {
  ShoppingCartIcon,
  PackageIcon,
  BarChartIcon,
  ClipboardListIcon,
  BellRingIcon,
  CheckCircleIcon
} from 'lucide-react';

export const ManagerDashboard: React.FC = () => {
  const { orders, items, addNotification, sendMessage } = useAppContext();
  const navigate = useNavigate();
  const [notifiedBanner, setNotifiedBanner] = useState(false);

  const pendingOrders = orders.filter((order) => order.status === 'pending');
  const lowStockItems = items.filter(
    (item) => item.stock <= item.lowStockThreshold
  );
  const totalSales = orders
    .filter((order) => ['delivered', 'completed'].includes(order.status))
    .reduce((sum, order) => sum + order.totalAmount, 0);

  const handleNotifyInventory = () => {
    const lowNames = lowStockItems.map((i) => `${i.name} (${i.stock} ${i.unit})`).join(', ');
    addNotification({
      title: 'Manager Urgent Restock Request',
      message: `Operations Manager requested immediate replenishment for: ${lowNames || 'low stock items'}.`,
      type: 'warning',
      forRole: ['inventory', 'admin']
    });
    sendMessage(
      '2',
      `Urgent Restock Alert: Please replenish ${lowNames || 'all items below threshold'} immediately.`,
      'Marcus Sterling (Manager)',
      true
    );
    setNotifiedBanner(true);
    setTimeout(() => setNotifiedBanner(false), 3500);
  };

  return (
    <div>
      <div className="flex flex-wrap justify-between items-center mb-6 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Manager Dashboard</h1>
          <p className="text-sm text-gray-500">
            Commercial operations, order fulfillment oversight, revenue metrics, and stock availability
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => navigate('/manager/orders')}
            className="bg-blue-600 hover:bg-blue-700 text-white text-sm px-4 py-2 rounded-lg font-medium"
          >
            Process Orders ({pendingOrders.length} Pending)
          </button>
          <button
            onClick={() => navigate('/manager/invoices')}
            className="bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm px-4 py-2 rounded-lg font-medium border border-gray-300"
          >
            View Invoices
          </button>
        </div>
      </div>

      {notifiedBanner && (
        <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center text-green-800 text-sm font-medium">
          <CheckCircleIcon className="h-5 w-5 mr-2 text-green-600" />
          Inventory Manager (Helena Chen) has been notified via system alert and direct message!
        </div>
      )}

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm text-gray-500">Pending Orders</p>
              <p className="text-2xl font-bold text-gray-900">{pendingOrders.length}</p>
            </div>
            <div className="p-3 bg-amber-100 rounded-full">
              <ShoppingCartIcon className="h-6 w-6 text-amber-600" />
            </div>
          </div>
          <p className="text-xs text-gray-500 mt-2">
            Require review & dispatch approval
          </p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm text-gray-500">Low Stock Items</p>
              <p className="text-2xl font-bold text-red-600">{lowStockItems.length}</p>
            </div>
            <div className="p-3 bg-red-100 rounded-full">
              <PackageIcon className="h-6 w-6 text-red-600" />
            </div>
          </div>
          <p className="text-xs text-gray-500 mt-2">Items at or below safety threshold</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm text-gray-500">Settled Sales Revenue</p>
              <p className="text-2xl font-bold text-green-600">${totalSales.toFixed(2)}</p>
            </div>
            <div className="p-3 bg-green-100 rounded-full">
              <BarChartIcon className="h-6 w-6 text-green-600" />
            </div>
          </div>
          <p className="text-xs text-gray-500 mt-2">
            From{' '}
            {orders.filter((o) => ['delivered', 'completed'].includes(o.status)).length}{' '}
            fulfilled orders
          </p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm text-gray-500">Active Invoices</p>
              <p className="text-2xl font-bold text-gray-900">{orders.length}</p>
            </div>
            <div className="p-3 bg-blue-100 rounded-full">
              <ClipboardListIcon className="h-6 w-6 text-blue-600" />
            </div>
          </div>
          <p className="text-xs text-gray-500 mt-2">
            {orders.filter((o) => o.paymentStatus === 'paid' || o.paymentMethod === 'online').length}{' '}
            paid in full
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Orders Table */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold">Recent Orders</h2>
            <button
              onClick={() => navigate('/manager/orders')}
              className="text-sm text-blue-600 hover:text-blue-800 font-medium"
            >
              View All Orders →
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 text-sm">
              <thead>
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Order ID
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Customer
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {orders.map((order) => (
                  <tr key={order.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 whitespace-nowrap font-medium text-blue-600">
                      {order.id}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <p className="font-medium text-gray-900">
                        {order.customerName || 'Lab Customer'}
                      </p>
                      <p className="text-xs text-gray-500">
                        {new Date(order.createdAt).toLocaleDateString()}
                      </p>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap font-semibold">
                      ${order.totalAmount.toFixed(2)}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <span
                        className={`px-2.5 py-0.5 inline-flex text-xs leading-5 font-semibold rounded-full capitalize ${
                          order.status === 'completed' || order.status === 'delivered'
                            ? 'bg-green-100 text-green-800'
                            : order.status === 'pending'
                            ? 'bg-yellow-100 text-yellow-800'
                            : order.status === 'in-transit'
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-purple-100 text-purple-800'
                        }`}
                      >
                        {order.status.replace('-', ' ')}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Low Stock Alert */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold">Low Stock Alerts</h2>
            <button
              onClick={handleNotifyInventory}
              className="text-xs bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-300 px-3 py-1.5 rounded-lg font-semibold flex items-center"
            >
              <BellRingIcon className="h-3.5 w-3.5 mr-1.5" /> Notify Inventory Manager
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 text-sm">
              <thead>
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Item & SKU
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Location
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Current Stock
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Threshold
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {lowStockItems.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 whitespace-nowrap">
                      <p className="font-medium text-gray-900">{item.name}</p>
                      <p className="text-xs text-gray-500">{item.sku}</p>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-xs text-gray-600">
                      {item.storageLocation}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <span className="text-red-600 font-bold">
                        {item.stock} {item.unit}
                      </span>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-gray-600">
                      {item.lowStockThreshold} {item.unit}
                    </td>
                  </tr>
                ))}
                {lowStockItems.length === 0 && (
                  <tr>
                    <td colSpan={4} className="px-4 py-6 text-center text-gray-500">
                      All items are above minimum safety stock thresholds
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
