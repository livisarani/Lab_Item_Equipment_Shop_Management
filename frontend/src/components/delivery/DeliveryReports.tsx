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
    <div>
      <div className="flex flex-wrap justify-between items-center mb-6 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Delivery & Fleet Logistics Reports
          </h1>
          <p className="text-sm text-gray-500">
            Review completed laboratory dispatches, active transit manifests, and export fleet logs
          </p>
        </div>
        <button
          onClick={exportDeliveryCSV}
          className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg flex items-center text-sm font-medium"
        >
          <DownloadIcon className="h-4 w-4 mr-1.5" /> Export Logistics CSV
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
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
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Currently In Transit</p>
              <p className="text-2xl font-bold text-blue-600">
                {inTransit.length}
              </p>
            </div>
            <div className="p-3 bg-blue-100 rounded-full">
              <TruckIcon className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Awaiting Dispatch</p>
              <p className="text-2xl font-bold text-amber-600">
                {pending.length}
              </p>
            </div>
            <div className="p-3 bg-amber-100 rounded-full">
              <ClockIcon className="h-6 w-6 text-amber-600" />
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <h2 className="text-lg font-semibold mb-4">Complete Fleet Dispatch Log</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Order & Tracking
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Recipient
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Destination Address
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Driver
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Items
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {deliveryOrders.map((order) => (
                <tr key={order.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 whitespace-nowrap">
                    <div className="font-semibold text-blue-600">{order.id}</div>
                    <div className="text-xs font-mono text-gray-500">
                      {order.trackingNumber || 'TRK-LOCAL'}
                    </div>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <div className="font-medium text-gray-900">
                      {order.customerName || 'Dr. Aris Thorne'}
                    </div>
                    <div className="text-xs text-gray-500">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-xs text-gray-600 max-w-xs">
                    {order.deliveryAddress}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-xs font-medium text-gray-800">
                    {order.assignedDriver || 'Carlos Mendez'}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-xs">
                    {order.items.length} items (${order.totalAmount.toFixed(2)})
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <span
                      className={`px-2.5 py-0.5 text-xs font-semibold rounded-full capitalize ${
                        order.status === 'completed' ||
                        order.status === 'delivered'
                          ? 'bg-green-100 text-green-800'
                          : order.status === 'in-transit'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-yellow-100 text-yellow-800'
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
