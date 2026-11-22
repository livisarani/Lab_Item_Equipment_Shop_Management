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
    <div className="space-y-8">
      <div className="flex flex-wrap justify-between items-end gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-widest text-[#27c2d2]">
            Get Anticipated Results
          </span>
          <h1 className="sp-type-headline-lg text-3xl sm:text-[46px] text-white mt-1">
            Reports & Analytics
          </h1>
          <p className="text-sm text-[#b0b0b0] mt-1">
            Real-time financial performance, category revenue split, and order fulfillment distribution
          </p>
        </div>
        <button
          onClick={exportAnalyticsCSV}
          className="sp-btn-primary h-[50px] px-7 text-sm"
        >
          <DownloadIcon className="h-4 w-4 mr-1.5" /> Export Financial CSV
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="sp-card-dark p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs uppercase tracking-wider text-[#b0b0b0]">
                Total Gross Revenue
              </p>
              <p className="text-3xl font-bold text-white mt-1 font-display">
                ${totalRevenue.toFixed(2)}
              </p>
            </div>
            <div className="h-14 w-14 rounded-full bg-[#0f9b40] text-white flex items-center justify-center shadow-lg">
              <DollarSignIcon className="h-6 w-6" />
            </div>
          </div>
          <p className="text-xs text-[#b0b0b0] mt-3">
            Across {orders.length} total orders
          </p>
        </div>

        <div className="sp-card-dark p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs uppercase tracking-wider text-[#b0b0b0]">
                Fulfilled / Delivered
              </p>
              <p className="text-3xl font-bold text-[#27c2d2] mt-1 font-display">
                {completedOrders}
              </p>
            </div>
            <div className="h-14 w-14 rounded-full bg-[#27c2d2] text-black flex items-center justify-center shadow-lg">
              <BarChartIcon className="h-6 w-6" />
            </div>
          </div>
          <p className="text-xs text-[#b0b0b0] mt-3">
            {orders.length > 0 ? Math.round((completedOrders / orders.length) * 100) : 0}% completion rate
          </p>
        </div>

        <div className="sp-card-crimson p-6 shadow-xl">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs uppercase tracking-wider text-white/80">
                Avg Order Value (AOV)
              </p>
              <p className="text-3xl font-bold text-white mt-1 font-display">
                ${averageOrderValue.toFixed(2)}
              </p>
            </div>
            <div className="h-14 w-14 rounded-full bg-black/30 text-white flex items-center justify-center">
              <TrendingUpIcon className="h-6 w-6" />
            </div>
          </div>
          <p className="text-xs text-white/90 mt-3">
            Institutional & research buyers
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="sp-card-dark p-6 sm:p-8">
          <h2 className="text-xl font-bold text-white mb-6 font-display">
            Revenue Split by Product Type
          </h2>
          <div className="space-y-6">
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="font-bold text-white">
                  Laboratory Chemicals & Solvents
                </span>
                <span className="text-[#27c2d2] font-bold">
                  ${chemicalRevenue.toFixed(2)} ({chemPct}%)
                </span>
              </div>
              <div className="w-full bg-[#131313] rounded-full h-3 border border-[#212121]">
                <div
                  className="bg-[#0e97b0] h-full rounded-full"
                  style={{ width: `${chemPct}%` }}
                ></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="font-bold text-white">
                  Precision & Optical Equipment
                </span>
                <span className="text-[#4dfd88] font-bold">
                  ${equipmentRevenue.toFixed(2)} ({eqpPct}%)
                </span>
              </div>
              <div className="w-full bg-[#131313] rounded-full h-3 border border-[#212121]">
                <div
                  className="bg-[#0f9b40] h-full rounded-full"
                  style={{ width: `${eqpPct}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>

        <div className="sp-card-dark p-6 sm:p-8">
          <h2 className="text-xl font-bold text-white mb-6 font-display">
            Order Status Distribution
          </h2>
          <div className="space-y-4">
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
                    <span className="text-sm capitalize text-[#b0b0b0]">
                      {status.replace('-', ' ')}
                    </span>
                    <div className="flex items-center">
                      <div className="w-40 bg-[#131313] rounded-full h-3 mr-3 border border-[#212121]">
                        <div
                          className="bg-[#27c2d2] h-full rounded-full"
                          style={{ width: `${percentage}%` }}
                        ></div>
                      </div>
                      <span className="text-sm font-bold text-white w-8 text-right">
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
