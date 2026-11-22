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
    <div className="space-y-8">
      <div className="flex flex-wrap justify-between items-end gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-widest text-[#27c2d2]">
            Operations & Quality Control
          </span>
          <h1 className="sp-type-headline-lg text-3xl sm:text-[46px] text-white mt-1">
            Manager Dashboard
          </h1>
          <p className="text-sm text-[#b0b0b0] mt-1">
            Commercial operations, order fulfillment oversight, revenue metrics, and stock availability
          </p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => navigate('/manager/orders')}
            className="sp-btn-primary h-[48px] px-7 text-sm"
          >
            Process Orders ({pendingOrders.length} Pending)
          </button>
          <button
            onClick={() => navigate('/manager/invoices')}
            className="sp-btn-outline h-[48px] px-6 text-sm"
          >
            View Invoices
          </button>
        </div>
      </div>

      {notifiedBanner && (
        <div className="p-4 bg-[#0f9b40]/20 border border-[#0f9b40] rounded-[20px] flex items-center text-white text-sm font-medium">
          <CheckCircleIcon className="h-5 w-5 mr-2.5 text-[#4dfd88]" />
          Inventory Manager (Helena Chen) has been notified via system alert and direct message!
        </div>
      )}

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="sp-card-dark p-6">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-xs uppercase tracking-wider text-[#b0b0b0]">
                Pending Orders
              </p>
              <p className="text-3xl font-bold text-white mt-1 font-display">
                {pendingOrders.length}
              </p>
            </div>
            <div className="h-14 w-14 rounded-full bg-[#27c2d2] text-black flex items-center justify-center shadow-lg">
              <ShoppingCartIcon className="h-6 w-6" />
            </div>
          </div>
          <p className="text-xs text-[#b0b0b0] mt-3">
            Require review & dispatch approval
          </p>
        </div>

        <div className="sp-card-crimson p-6 shadow-xl">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-xs uppercase tracking-wider text-white/80">
                Low Stock Items
              </p>
              <p className="text-3xl font-bold text-white mt-1 font-display">
                {lowStockItems.length}
              </p>
            </div>
            <div className="h-14 w-14 rounded-full bg-black/30 text-white flex items-center justify-center">
              <PackageIcon className="h-6 w-6" />
            </div>
          </div>
          <p className="text-xs text-white/90 mt-3 font-medium">
            Items at or below safety threshold
          </p>
        </div>

        <div className="sp-card-dark p-6">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-xs uppercase tracking-wider text-[#b0b0b0]">
                Settled Revenue
              </p>
              <p className="text-3xl font-bold text-[#4dfd88] mt-1 font-display">
                ${totalSales.toFixed(2)}
              </p>
            </div>
            <div className="h-14 w-14 rounded-full bg-[#0f9b40] text-white flex items-center justify-center shadow-lg">
              <BarChartIcon className="h-6 w-6" />
            </div>
          </div>
          <p className="text-xs text-[#b0b0b0] mt-3">
            From{' '}
            {orders.filter((o) => ['delivered', 'completed'].includes(o.status)).length}{' '}
            fulfilled orders
          </p>
        </div>

        <div className="sp-card-dark p-6">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-xs uppercase tracking-wider text-[#b0b0b0]">
                Active Invoices
              </p>
              <p className="text-3xl font-bold text-white mt-1 font-display">
                {orders.length}
              </p>
            </div>
            <div className="h-14 w-14 rounded-full bg-[#0e97b0] text-white flex items-center justify-center shadow-lg">
              <ClipboardListIcon className="h-6 w-6" />
            </div>
          </div>
          <p className="text-xs text-[#b0b0b0] mt-3">
            {orders.filter((o) => o.paymentStatus === 'paid' || o.paymentMethod === 'online').length}{' '}
            paid in full
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Orders Table */}
        <div className="sp-card-dark p-6 sm:p-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-white font-display">
              Recent Orders
            </h2>
            <button
              onClick={() => navigate('/manager/orders')}
              className="text-sm text-[#27c2d2] hover:underline font-medium"
            >
              View All Orders →
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-[#212121] text-sm">
              <thead>
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-[#b0b0b0] uppercase tracking-wider">
                    Order ID
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-[#b0b0b0] uppercase tracking-wider">
                    Customer
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-[#b0b0b0] uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-[#b0b0b0] uppercase tracking-wider">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#212121]">
                {orders.map((order) => (
                  <tr key={order.id} className="hover:bg-[#131313]">
                    <td className="px-4 py-3.5 whitespace-nowrap font-bold text-[#27c2d2]">
                      {order.id}
                    </td>
                    <td className="px-4 py-3.5 whitespace-nowrap">
                      <p className="font-bold text-white">
                        {order.customerName || 'Lab Customer'}
                      </p>
                      <p className="text-xs text-[#b0b0b0]">
                        {new Date(order.createdAt).toLocaleDateString()}
                      </p>
                    </td>
                    <td className="px-4 py-3.5 whitespace-nowrap font-bold text-white">
                      ${order.totalAmount.toFixed(2)}
                    </td>
                    <td className="px-4 py-3.5 whitespace-nowrap">
                      <span
                        className={`px-3 py-1 inline-flex text-xs font-bold rounded-full capitalize ${
                          order.status === 'completed' || order.status === 'delivered'
                            ? 'bg-[#0f9b40]/30 text-[#4dfd88]'
                            : order.status === 'pending'
                            ? 'bg-[#aa4266] text-white'
                            : 'bg-[#0e97b0]/30 text-[#27c2d2]'
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
        <div className="sp-card-dark p-6 sm:p-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-white font-display">
              Low Stock Alerts
            </h2>
            <button
              onClick={handleNotifyInventory}
              className="text-xs bg-[#aa4266] hover:bg-[#c04c75] text-white px-4 py-2 rounded-[20px] font-bold flex items-center transition-colors"
            >
              <BellRingIcon className="h-3.5 w-3.5 mr-1.5" /> Notify Inventory Manager
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-[#212121] text-sm">
              <thead>
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-[#b0b0b0] uppercase tracking-wider">
                    Item & SKU
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-[#b0b0b0] uppercase tracking-wider">
                    Location
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-[#b0b0b0] uppercase tracking-wider">
                    Current Stock
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-[#b0b0b0] uppercase tracking-wider">
                    Threshold
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#212121]">
                {lowStockItems.map((item) => (
                  <tr key={item.id} className="hover:bg-[#131313]">
                    <td className="px-4 py-3.5 whitespace-nowrap">
                      <p className="font-bold text-white">{item.name}</p>
                      <p className="text-xs text-[#27c2d2]">{item.sku}</p>
                    </td>
                    <td className="px-4 py-3.5 whitespace-nowrap text-xs text-[#b0b0b0]">
                      {item.storageLocation}
                    </td>
                    <td className="px-4 py-3.5 whitespace-nowrap">
                      <span className="text-[#aa4266] font-bold">
                        {item.stock} {item.unit}
                      </span>
                    </td>
                    <td className="px-4 py-3.5 whitespace-nowrap text-[#b0b0b0]">
                      {item.lowStockThreshold} {item.unit}
                    </td>
                  </tr>
                ))}
                {lowStockItems.length === 0 && (
                  <tr>
                    <td colSpan={4} className="px-4 py-6 text-center text-[#b0b0b0]">
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
