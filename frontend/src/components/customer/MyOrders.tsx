import React from 'react';
import { useAppContext } from '../../context/AppContext';
import { PackageIcon, TruckIcon, XCircleIcon } from 'lucide-react';

export const MyOrders: React.FC = () => {
  const { orders, items, updateOrder } = useAppContext();
  const customerOrders = orders.filter((order) => order.customerId === '3');

  return (
    <div className="space-y-8">
      <div>
        <span className="text-xs font-bold uppercase tracking-widest text-[#27c2d2]">
          Real-Time Requisition Tracking
        </span>
        <h1 className="sp-type-headline-lg text-3xl sm:text-[46px] text-white mt-1">
          My Laboratory Orders
        </h1>
        <p className="text-sm text-[#b0b0b0] mt-1">
          Track live hazmat and cold-chain dispatches, inspect itemized chemical lots, and manage pending requisitions
        </p>
      </div>

      {customerOrders.length > 0 ? (
        <div className="space-y-6">
          {customerOrders.map((order) => (
            <div
              key={order.id}
              className="sp-card-dark p-6 sm:p-8 hover:border-[#0e97b0] transition-colors"
            >
              <div className="flex flex-wrap justify-between items-start mb-4 gap-3">
                <div>
                  <div className="flex items-center space-x-3">
                    <h3 className="text-xl font-bold text-[#27c2d2] font-display">
                      {order.id}
                    </h3>
                    {order.invoiceNumber && (
                      <span className="text-xs bg-[#131313] text-[#b0b0b0] px-3 py-1 rounded-full border border-[#212121]">
                        Invoice: {order.invoiceNumber}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-[#b0b0b0] mt-1.5">
                    Placed on {new Date(order.createdAt).toLocaleString()}
                    {order.trackingNumber && ` • Tracking: ${order.trackingNumber}`}
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <span
                    className={`px-4 py-1.5 text-xs font-bold rounded-full capitalize ${
                      order.status === 'completed' || order.status === 'delivered'
                        ? 'bg-[#0f9b40] text-white'
                        : order.status === 'pending'
                        ? 'bg-[#aa4266] text-white'
                        : order.status === 'in-transit'
                        ? 'bg-[#0e97b0] text-white'
                        : 'bg-[#212121] text-[#b0b0b0]'
                    }`}
                  >
                    {order.status.replace('-', ' ')}
                  </span>

                  {order.status === 'pending' && (
                    <button
                      onClick={() => updateOrder(order.id, { status: 'cancelled' })}
                      className="text-xs text-white bg-[#aa4266]/40 hover:bg-[#aa4266] border border-[#aa4266] px-3.5 py-1.5 rounded-[20px] flex items-center font-semibold transition-colors"
                    >
                      <XCircleIcon className="h-3.5 w-3.5 mr-1" /> Cancel Order
                    </button>
                  )}
                </div>
              </div>

              <div className="border-t border-b border-[#212121] py-4 my-4">
                <div className="space-y-3">
                  {order.items.map((orderItem, idx) => {
                    const catalogItem = items.find((i) => i.id === orderItem.itemId);
                    const displayName =
                      orderItem.name || catalogItem?.name || `Item #${orderItem.itemId}`;
                    return (
                      <div key={idx} className="flex justify-between text-sm items-center">
                        <div>
                          <span className="font-semibold text-white">{displayName}</span>
                          <span className="text-[#b0b0b0] text-xs ml-2">
                            ({catalogItem?.sku || `ID-${orderItem.itemId}`}) × {orderItem.quantity}
                          </span>
                        </div>
                        <span className="font-bold text-white">
                          ${(orderItem.quantity * orderItem.price).toFixed(2)}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="flex flex-wrap justify-between items-center gap-4">
                <div className="text-xs text-[#b0b0b0] space-y-1">
                  <p>
                    Payment Method:{' '}
                    <span className="font-bold text-white uppercase">
                      {order.paymentMethod}
                    </span>{' '}
                    ({order.paymentStatus || 'Paid'})
                  </p>
                  <p className="flex items-center">
                    <TruckIcon className="h-3.5 w-3.5 mr-1.5 text-[#27c2d2]" />
                    Fulfillment:{' '}
                    <span className="font-bold text-white capitalize ml-1">
                      {order.fulfillmentOption}
                    </span>{' '}
                    — {order.deliveryAddress || 'LISM Pickup Counter'}
                  </p>
                  {order.assignedDriver && (
                    <p className="text-[#27c2d2] font-semibold">
                      Assigned ADR Hazmat Courier: {order.assignedDriver}
                    </p>
                  )}
                </div>
                <div className="text-right">
                  <p className="text-xs text-[#b0b0b0]">Order Total (Incl. Tax)</p>
                  <p className="text-2xl font-bold text-white font-display">
                    ${order.totalAmount.toFixed(2)}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="sp-card-dark p-12 text-center">
          <PackageIcon className="h-16 w-16 mx-auto text-[#5d5d5d] mb-4" />
          <h3 className="text-lg font-bold text-white mb-2">No orders yet</h3>
          <p className="text-[#b0b0b0]">
            Start shopping to place your first laboratory order
          </p>
        </div>
      )}
    </div>
  );
};
