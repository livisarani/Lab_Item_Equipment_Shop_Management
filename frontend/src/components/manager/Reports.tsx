import React from 'react';
import { useAppContext } from '../../context/AppContext';
import {
  BarChartIcon,
  TrendingUpIcon,
  DollarSignIcon,
  DownloadIcon
} from 'lucide-react';

export const Reports: React.FC = () => {
  const { orders, items } = useAppContext();

  const totalRevenue = orders
    .filter((o) => o.status !== 'cancelled')
    .reduce((sum, order) => sum + order.totalAmount, 0);
  const completedOrders = orders.filter(
    (o) => o.status === 'completed' || o.status === 'delivered'
  ).length;
  const averageOrderValue = orders.length > 0 ? totalRevenue / orders.length : 0;

  // Dynamic revenue calculation by type
  let chemicalRevenue = 0;
  let equipmentRevenue = 0;
  orders.forEach((order) => {
    order.items.forEach((oi) => {
      const catItem = items.find((i) => i.id === oi.itemId);
      const lineTotal = oi.price * oi.quantity;
      if (catItem?.type === 'chemical') {
        chemicalRevenue += lineTotal;
      } else {
        equipmentRevenue += lineTotal;
      }
    });
  });

  const combinedItemRevenue = chemicalRevenue + equipmentRevenue || 1;
  const chemPct = Math.round((chemicalRevenue / combinedItemRevenue) * 100);
  const eqpPct = 100 - chemPct;

  const exportAnalyticsCSV = () => {
    const headers = ['OrderID,Invoice,Customer,Status,PaymentMethod,TotalAmount,CreatedAt'];
    const rows = orders.map(
      (o) =>
        `"${o.id}","${o.invoiceNumber || ''}","${o.customerName || ''}","${o.status}","${o.paymentMethod}","${o.totalAmount.toFixed(2)}","${o.createdAt}"`
    );
    const csv = 'data:text/csv;charset=utf-8,' + [headers, ...rows].join('\n');
    const link = document.createElement('a');
    link.href = encodeURI(csv);
    link.download = `LISM_Financial_Report_${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div>
      <div className="flex flex-wrap justify-between items-center mb-6 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Reports & Analytics</h1>
          <p className="text-sm text-gray-500">
            Real-time financial performance, category revenue split, and order fulfillment distribution
          </p>
        </div>
        <button
          onClick={exportAnalyticsCSV}
          className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg flex items-center text-sm font-medium"
        >
          <DownloadIcon className="h-4 w-4 mr-1.5" /> Export Financial CSV
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Total Gross Revenue</p>
              <p className="text-2xl font-bold text-gray-900">
                ${totalRevenue.toFixed(2)}
              </p>
            </div>
            <div className="p-3 bg-green-100 rounded-full">
              <DollarSignIcon className="h-6 w-6 text-green-600" />
            </div>
          </div>
          <p className="text-xs text-gray-500 mt-2">Across {orders.length} total orders</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Fulfilled / Delivered Orders</p>
              <p className="text-2xl font-bold text-blue-600">{completedOrders}</p>
            </div>
            <div className="p-3 bg-blue-100 rounded-full">
              <BarChartIcon className="h-6 w-6 text-blue-600" />
            </div>
          </div>
          <p className="text-xs text-gray-500 mt-2">
            {orders.length > 0 ? Math.round((completedOrders / orders.length) * 100) : 0}% completion rate
          </p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Avg Order Value (AOV)</p>
              <p className="text-2xl font-bold text-purple-600">
                ${averageOrderValue.toFixed(2)}
              </p>
            </div>
            <div className="p-3 bg-purple-100 rounded-full">
              <TrendingUpIcon className="h-6 w-6 text-purple-600" />
            </div>
          </div>
          <p className="text-xs text-gray-500 mt-2">Institutional & research buyers</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h2 className="text-lg font-semibold mb-4">Revenue Split by Product Type</h2>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="font-medium">Laboratory Chemicals & Solvents</span>
                <span className="text-gray-600">
                  ${chemicalRevenue.toFixed(2)} ({chemPct}%)
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div
                  className="bg-blue-600 h-2.5 rounded-full"
                  style={{ width: `${chemPct}%` }}
                ></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="font-medium">Precision & Optical Equipment</span>
                <span className="text-gray-600">
                  ${equipmentRevenue.toFixed(2)} ({eqpPct}%)
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div
                  className="bg-green-600 h-2.5 rounded-full"
                  style={{ width: `${eqpPct}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h2 className="text-lg font-semibold mb-4">Order Status Distribution</h2>
          <div className="space-y-3">
            {(['pending', 'processing', 'in-transit', 'delivered', 'completed'] as const).map(
              (status) => {
                const count = orders.filter((o) => o.status === status).length;
                const percentage =
                  orders.length > 0 ? (count / orders.length) * 100 : 0;
                return (
                  <div
                    key={status}
                    className="flex justify-between items-center"
                  >
                    <span className="text-sm capitalize text-gray-700">
                      {status.replace('-', ' ')}
                    </span>
                    <div className="flex items-center">
                      <div className="w-36 bg-gray-200 rounded-full h-2.5 mr-3">
                        <div
                          className="bg-purple-600 h-2.5 rounded-full"
                          style={{ width: `${percentage}%` }}
                        ></div>
                      </div>
                      <span className="text-sm font-semibold w-8 text-right">
                        {count}
                      </span>
                    </div>
                  </div>
                );
              }
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
