import React from 'react';
import { useAppContext } from '../../context/AppContext';
import { PackageIcon, TruckIcon, XCircleIcon } from 'lucide-react';

export const MyOrders: React.FC = () => {
  const { orders, items, updateOrder } = useAppContext();
  const customerOrders = orders.filter((order) => order.customerId === '3');

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">My Laboratory Orders</h1>
        <p className="text-sm text-gray-500">
          Track live delivery status, view itemized chemical/equipment breakdowns, and manage pending requisitions
        </p>
      </div>

      {customerOrders.length > 0 ? (
        <div className="space-y-5">
          {customerOrders.map((order) => (
            <div
              key={order.id}
              className="bg-white p-6 rounded-xl shadow-sm border border-gray-200"
            >
              <div className="flex flex-wrap justify-between items-start mb-4 gap-3">
                <div>
                  <div className="flex items-center space-x-2">
                    <h3 className="text-lg font-bold text-blue-900">{order.id}</h3>
                    {order.invoiceNumber && (
                      <span className="text-xs bg-gray-100 text-gray-700 px-2 py-0.5 rounded border border-gray-200">
                        Invoice: {order.invoiceNumber}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    Placed on {new Date(order.createdAt).toLocaleString()}
                    {order.trackingNumber && ` • Tracking: ${order.trackingNumber}`}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <span
                    className={`px-3 py-1 text-xs font-semibold rounded-full capitalize ${
                      order.status === 'completed' || order.status === 'delivered'
                        ? 'bg-green-100 text-green-800'
                        : order.status === 'pending'
                        ? 'bg-yellow-100 text-yellow-800'
                        : order.status === 'in-transit'
                        ? 'bg-blue-100 text-blue-800'
                        : order.status === 'cancelled'
                        ? 'bg-red-100 text-red-800'
                        : 'bg-purple-100 text-purple-800'
                    }`}
                  >
                    {order.status.replace('-', ' ')}
                  </span>

                  {order.status === 'pending' && (
                    <button
                      onClick={() => updateOrder(order.id, { status: 'cancelled' })}
                      className="text-xs text-red-600 hover:text-red-800 border border-red-200 bg-red-50 px-2.5 py-1 rounded-lg flex items-center font-medium"
                    >
                      <XCircleIcon className="h-3.5 w-3.5 mr-1" /> Cancel Order
                    </button>
                  )}
                </div>
              </div>

              <div className="border-t border-b border-gray-200 py-4 my-4">
                <div className="space-y-2.5">
                  {order.items.map((orderItem, idx) => {
                    const catalogItem = items.find((i) => i.id === orderItem.itemId);
                    const displayName =
                      orderItem.name || catalogItem?.name || `Item #${orderItem.itemId}`;
                    return (
                      <div key={idx} className="flex justify-between text-sm items-center">
                        <div>
                          <span className="font-medium text-gray-900">{displayName}</span>
                          <span className="text-gray-500 text-xs ml-2">
                            ({catalogItem?.sku || `ID-${orderItem.itemId}`}) × {orderItem.quantity}
                          </span>
                        </div>
                        <span className="font-semibold text-gray-900">
                          ${(orderItem.quantity * orderItem.price).toFixed(2)}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="flex flex-wrap justify-between items-center gap-4">
                <div className="text-xs text-gray-600 space-y-1">
                  <p>
                    Payment Method:{' '}
                    <span className="font-semibold text-gray-900 uppercase">
                      {order.paymentMethod}
                    </span>{' '}
                    ({order.paymentStatus || 'Paid'})
                  </p>
                  <p className="flex items-center">
                    <TruckIcon className="h-3.5 w-3.5 mr-1 text-blue-600" />
                    Fulfillment:{' '}
                    <span className="font-semibold text-gray-900 capitalize ml-1">
                      {order.fulfillmentOption}
                    </span>{' '}
                    — {order.deliveryAddress || 'LISM Pickup Counter'}
                  </p>
                  {order.assignedDriver && (
                    <p className="text-blue-700 font-medium">
                      Assigned Hazmat Courier: {order.assignedDriver}
                    </p>
                  )}
                </div>
                <div className="text-right">
                  <p className="text-xs text-gray-500">Order Total (Incl. Tax)</p>
                  <p className="text-xl font-bold text-gray-900">
                    ${order.totalAmount.toFixed(2)}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white p-12 rounded-lg shadow-sm border border-gray-200 text-center">
          <PackageIcon className="h-16 w-16 mx-auto text-gray-300 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No orders yet
          </h3>
          <p className="text-gray-500">
            Start shopping to place your first laboratory order
          </p>
        </div>
      )}
    </div>
  );
};
