import React from 'react';
import { useAppContext, Order } from '../../context/AppContext';
import { DownloadIcon, PrinterIcon, CheckCircleIcon } from 'lucide-react';

export const Invoices: React.FC = () => {
  const { orders, items, systemConfig } = useAppContext();

  const handleDownloadInvoice = (order: Order) => {
    const lines = [
      `=============================================================`,
      `  ${systemConfig.siteName.toUpperCase()}`,
      `  ${systemConfig.companyAddress}`,
      `  Email: ${systemConfig.companyEmail} | Phone: ${systemConfig.companyPhone}`,
      `=============================================================`,
      `INVOICE NUMBER : ${order.invoiceNumber || `INV-${order.id}`}`,
      `ORDER ID       : ${order.id}`,
      `DATE           : ${new Date(order.createdAt).toLocaleString()}`,
      `CUSTOMER       : ${order.customerName || 'Dr. Aris Thorne'} (${order.customerEmail || 'customer@example.com'})`,
      `DELIVERY ADDR  : ${order.deliveryAddress || 'Facility Pickup'}`,
      `PAYMENT        : ${order.paymentMethod.toUpperCase()} (${order.paymentStatus || 'paid'})`,
      `-------------------------------------------------------------`,
      `ITEMIZED BREAKDOWN:`,
      ...order.items.map((it) => {
        const cat = items.find((i) => i.id === it.itemId);
        const name = it.name || cat?.name || `Item #${it.itemId}`;
        return `  - ${name} | Qty: ${it.quantity} x $${it.price.toFixed(2)} = $${(
          it.quantity * it.price
        ).toFixed(2)}`;
      }),
      `-------------------------------------------------------------`,
      `TOTAL AMOUNT   : $${order.totalAmount.toFixed(2)}`,
      `=============================================================`
    ].join('\n');

    const blob = new Blob([lines], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${order.invoiceNumber || order.id}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Tax Invoices & Billing</h1>
        <p className="text-sm text-gray-500">
          Official itemized laboratory invoices with tax breakdowns, download, and print support
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {orders.map((order) => {
          const subtotal =
            order.subtotal ||
            order.items.reduce((sum, i) => sum + i.price * i.quantity, 0);
          const taxAmount =
            order.taxAmount ?? Number((order.totalAmount - subtotal).toFixed(2));
          return (
            <div
              key={order.id}
              className="bg-white p-6 rounded-xl shadow-sm border border-gray-200"
            >
              <div className="flex flex-wrap justify-between items-start mb-4 gap-4">
                <div>
                  <div className="flex items-center space-x-2">
                    <h3 className="text-lg font-bold text-gray-900">
                      Invoice {order.invoiceNumber || `INV-${order.id}`}
                    </h3>
                    <span className="px-2.5 py-0.5 text-xs font-semibold rounded-full bg-blue-50 text-blue-700 border border-blue-200">
                      Order {order.id}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">
                    Billed To:{' '}
                    <span className="font-medium text-gray-900">
                      {order.customerName || 'Dr. Aris Thorne'}
                    </span>{' '}
                    • Issued: {new Date(order.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleDownloadInvoice(order)}
                    className="px-3 py-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-medium flex items-center"
                  >
                    <DownloadIcon className="h-4 w-4 mr-1.5" /> Download Invoice
                  </button>
                  <button
                    onClick={() => window.print()}
                    className="px-3 py-1.5 bg-gray-100 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-200 text-sm font-medium flex items-center"
                  >
                    <PrinterIcon className="h-4 w-4 mr-1.5" /> Print
                  </button>
                </div>
              </div>

              <div className="border-t border-b border-gray-200 py-4 my-4">
                <div className="grid grid-cols-12 gap-4 text-xs font-semibold uppercase text-gray-500 mb-2">
                  <div className="col-span-6">Laboratory Item & SKU</div>
                  <div className="col-span-2 text-center">Quantity</div>
                  <div className="col-span-2 text-right">Unit Price</div>
                  <div className="col-span-2 text-right">Line Total</div>
                </div>
                <div className="divide-y divide-gray-100">
                  {order.items.map((item, idx) => {
                    const catalogItem = items.find((i) => i.id === item.itemId);
                    const displayName =
                      item.name || catalogItem?.name || `Item #${item.itemId}`;
                    return (
                      <div
                        key={idx}
                        className="grid grid-cols-12 gap-4 text-sm py-2.5 items-center"
                      >
                        <div className="col-span-6">
                          <p className="font-medium text-gray-900">{displayName}</p>
                          <p className="text-xs text-gray-500">
                            SKU: {catalogItem?.sku || `LISM-00${item.itemId}`}
                          </p>
                        </div>
                        <div className="col-span-2 text-center">
                          {item.quantity} {item.unit || catalogItem?.unit || 'unit'}
                        </div>
                        <div className="col-span-2 text-right">
                          ${item.price.toFixed(2)}
                        </div>
                        <div className="col-span-2 text-right font-semibold">
                          ${(item.quantity * item.price).toFixed(2)}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="flex flex-wrap justify-between items-end gap-4">
                <div className="text-sm space-y-1">
                  <p className="text-gray-500">
                    Payment Method:{' '}
                    <span className="font-medium text-gray-900 uppercase">
                      {order.paymentMethod}
                    </span>{' '}
                    <span className="inline-flex items-center text-xs text-green-700 bg-green-50 px-2 py-0.5 rounded ml-1">
                      <CheckCircleIcon className="h-3 w-3 mr-1" />
                      {order.paymentStatus || 'Verified'}
                    </span>
                  </p>
                  <p className="text-gray-500">
                    Fulfillment:{' '}
                    <span className="font-medium text-gray-900 capitalize">
                      {order.fulfillmentOption}
                    </span>{' '}
                    ({order.deliveryAddress || 'LISM Facility Counter'})
                  </p>
                </div>
                <div className="text-right space-y-1">
                  <div className="text-xs text-gray-500">
                    Subtotal: <span className="font-medium text-gray-800">${subtotal.toFixed(2)}</span>
                    {taxAmount > 0 && (
                      <span className="ml-3">
                        Tax & Shipping:{' '}
                        <span className="font-medium text-gray-800">
                          ${(order.totalAmount - subtotal).toFixed(2)}
                        </span>
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-gray-500">Total Billed Amount</p>
                  <p className="text-2xl font-bold text-blue-900">
                    ${order.totalAmount.toFixed(2)}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
