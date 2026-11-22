import React from 'react';
import { useAppContext } from '../../context/AppContext';
import {
  TruckIcon,
  CheckCircleIcon,
  ClockIcon,
  DownloadIcon
} from 'lucide-react';

export const DeliveryReports: React.FC = () => {
  const { orders } = useAppContext();
  const deliveryOrders = orders.filter(
    (order) => order.fulfillmentOption === 'delivery'
  );
  const completedDeliveries = deliveryOrders.filter(
    (o) => o.status === 'delivered' || o.status === 'completed'
  );
  const inTransit = deliveryOrders.filter((o) => o.status === 'in-transit');
  const pending = deliveryOrders.filter(
    (o) => o.status === 'pending' || o.status === 'processing'
  );

  const exportDeliveryCSV = () => {
    const headers = [
      'OrderID,TrackingNumber,Customer,Address,Driver,ItemsCount,Status,PaymentMethod,TotalAmount'
    ];
    const rows = deliveryOrders.map(
      (o) =>
        `"${o.id}","${o.trackingNumber || ''}","${o.customerName || ''}","${
          o.deliveryAddress || ''
        }","${o.assignedDriver || 'Carlos Mendez'}","${o.items.length}","${
          o.status
        }","${o.paymentMethod}","${o.totalAmount.toFixed(2)}"`
    );
    const csv = 'data:text/csv;charset=utf-8,' + [headers, ...rows].join('\n');
    const link = document.createElement('a');
    link.href = encodeURI(csv);
    link.download = `LISM_Delivery_Logistics_Report_${new Date()
      .toISOString()
      .slice(0, 10)}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap justify-between items-end gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-widest text-[#27c2d2]">
            Fleet Performance Telemetry
          </span>
          <h1 className="sp-type-headline-lg text-3xl sm:text-[46px] text-white mt-1">
            Delivery & Fleet Logistics Reports
          </h1>
          <p className="text-sm text-[#b0b0b0] mt-1">
            Review completed laboratory dispatches, active transit manifests, and export fleet logs
          </p>
        </div>
        <button
          onClick={exportDeliveryCSV}
          className="sp-btn-primary h-[50px] px-7 text-sm"
        >
          <DownloadIcon className="h-4 w-4 mr-1.5" /> Export Logistics CSV
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="sp-card-dark p-6">
          <div className="flex items-center justify-between">
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
        </div>

        <div className="sp-card-dark p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs uppercase tracking-wider text-[#b0b0b0]">
                Currently In Transit
              </p>
              <p className="text-3xl font-bold text-[#27c2d2] mt-1 font-display">
                {inTransit.length}
              </p>
            </div>
            <div className="h-14 w-14 rounded-full bg-[#27c2d2] text-black flex items-center justify-center shadow-lg">
              <TruckIcon className="h-6 w-6" />
            </div>
          </div>
        </div>

        <div className="sp-card-crimson p-6 shadow-xl">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs uppercase tracking-wider text-white/80">
                Awaiting Dispatch
              </p>
              <p className="text-3xl font-bold text-white mt-1 font-display">
                {pending.length}
              </p>
            </div>
            <div className="h-14 w-14 rounded-full bg-black/30 text-white flex items-center justify-center">
              <ClockIcon className="h-6 w-6" />
            </div>
          </div>
        </div>
      </div>

      <div className="sp-card-dark p-6 sm:p-8">
        <h2 className="text-xl font-bold text-white mb-6 font-display">
          Complete Fleet Dispatch Log
        </h2>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-[#212121] text-sm">
            <thead className="bg-[#131313]">
              <tr>
                <th className="px-4 py-3.5 text-left text-xs font-semibold text-[#b0b0b0] uppercase">
                  Order & Tracking
                </th>
                <th className="px-4 py-3.5 text-left text-xs font-semibold text-[#b0b0b0] uppercase">
                  Recipient
                </th>
                <th className="px-4 py-3.5 text-left text-xs font-semibold text-[#b0b0b0] uppercase">
                  Destination Address
                </th>
                <th className="px-4 py-3.5 text-left text-xs font-semibold text-[#b0b0b0] uppercase">
                  Driver
                </th>
                <th className="px-4 py-3.5 text-left text-xs font-semibold text-[#b0b0b0] uppercase">
                  Items
                </th>
                <th className="px-4 py-3.5 text-left text-xs font-semibold text-[#b0b0b0] uppercase">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#212121]">
              {deliveryOrders.map((order) => (
                <tr key={order.id} className="hover:bg-[#131313]">
                  <td className="px-4 py-4 whitespace-nowrap">
                    <div className="font-bold text-[#27c2d2]">{order.id}</div>
                    <div className="text-xs font-mono text-[#b0b0b0]">
                      {order.trackingNumber || 'TRK-LOCAL'}
                    </div>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    <div className="font-bold text-white">
                      {order.customerName || 'Dr. Aris Thorne'}
                    </div>
                    <div className="text-xs text-[#b0b0b0]">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </div>
                  </td>
                  <td className="px-4 py-4 text-xs text-[#b0b0b0] max-w-xs">
                    {order.deliveryAddress}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-xs font-bold text-white">
                    {order.assignedDriver || 'Carlos Mendez'}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-xs text-white">
                    {order.items.length} items (${order.totalAmount.toFixed(2)})
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    <span
                      className={`px-3 py-1 text-xs font-bold rounded-full capitalize ${
                        order.status === 'completed' ||
                        order.status === 'delivered'
                          ? 'bg-[#0f9b40]/30 text-[#4dfd88]'
                          : order.status === 'in-transit'
                          ? 'bg-[#0e97b0]/30 text-[#27c2d2]'
                          : 'bg-[#aa4266] text-white'
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
    </div>
  );
};
