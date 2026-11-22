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
    <div className="space-y-8">
      <div>
        <span className="text-xs font-bold uppercase tracking-widest text-[#27c2d2]">
          Institutional Accounting
        </span>
        <h1 className="sp-type-headline-lg text-3xl sm:text-[46px] text-white mt-1">
          Tax Invoices & Billing
        </h1>
        <p className="text-sm text-[#b0b0b0] mt-1">
          Official itemized laboratory invoices styled in high-contrast elevated cards with download and print support
        </p>
      </div>

      {/* High-Contrast Elevated Light Cards (.card-elevated-media-top recipe: #d4d4d4 / #ffffff, 32px radius) */}
      <div className="grid grid-cols-1 gap-8">
        {orders.map((order) => {
          const subtotal =
            order.subtotal ||
            order.items.reduce((sum, i) => sum + i.price * i.quantity, 0);
          const taxAmount =
            order.taxAmount ?? Number((order.totalAmount - subtotal).toFixed(2));
          return (
            <div
              key={order.id}
              className="sp-card-elevated-light p-7 sm:p-9"
            >
              <div className="flex flex-wrap justify-between items-start mb-4 gap-4">
                <div>
                  <div className="flex items-center space-x-3">
                    <h3 className="text-xl font-bold text-[#111111] font-display">
                      Invoice {order.invoiceNumber || `INV-${order.id}`}
                    </h3>
                    <span className="px-3 py-1 text-xs font-bold rounded-full bg-[#0e97b0] text-white">
                      Order {order.id}
                    </span>
                  </div>
                  <p className="text-sm text-[#3d3d3d] mt-1">
                    Billed To:{' '}
                    <span className="font-bold text-[#111111]">
                      {order.customerName || 'Dr. Aris Thorne'}
                    </span>{' '}
                    • Issued: {new Date(order.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={() => handleDownloadInvoice(order)}
                    className="sp-btn-primary h-[44px] px-5 text-sm"
                  >
                    <DownloadIcon className="h-4 w-4 mr-1.5" /> Download Invoice
                  </button>
                  <button
                    onClick={() => window.print()}
                    className="sp-btn-ink h-[44px] px-5 text-sm"
                  >
                    <PrinterIcon className="h-4 w-4 mr-1.5" /> Print
                  </button>
                </div>
              </div>

              <div className="border-t border-b border-black/15 py-4 my-4">
                <div className="grid grid-cols-12 gap-4 text-xs font-bold uppercase text-[#3d3d3d] mb-2">
                  <div className="col-span-6">Laboratory Item & SKU</div>
                  <div className="col-span-2 text-center">Quantity</div>
                  <div className="col-span-2 text-right">Unit Price</div>
                  <div className="col-span-2 text-right">Line Total</div>
                </div>
                <div className="divide-y divide-black/10">
                  {order.items.map((item, idx) => {
                    const catalogItem = items.find((i) => i.id === item.itemId);
                    const displayName =
                      item.name || catalogItem?.name || `Item #${item.itemId}`;
                    return (
                      <div
                        key={idx}
                        className="grid grid-cols-12 gap-4 text-sm py-3 items-center"
                      >
                        <div className="col-span-6">
                          <p className="font-bold text-[#111111]">{displayName}</p>
                          <p className="text-xs text-[#3d3d3d]">
                            SKU: {catalogItem?.sku || `LISM-00${item.itemId}`}
                          </p>
                        </div>
                        <div className="col-span-2 text-center font-medium text-[#111111]">
                          {item.quantity} {item.unit || catalogItem?.unit || 'unit'}
                        </div>
                        <div className="col-span-2 text-right text-[#3d3d3d]">
                          ${item.price.toFixed(2)}
                        </div>
                        <div className="col-span-2 text-right font-bold text-[#111111]">
                          ${(item.quantity * item.price).toFixed(2)}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="flex flex-wrap justify-between items-end gap-4">
                <div className="text-sm space-y-1">
                  <p className="text-[#3d3d3d]">
                    Payment Method:{' '}
                    <span className="font-bold text-[#111111] uppercase">
                      {order.paymentMethod}
                    </span>{' '}
                    <span className="inline-flex items-center text-xs text-white bg-[#0f9b40] px-2.5 py-0.5 rounded-full ml-1.5 font-semibold">
                      <CheckCircleIcon className="h-3 w-3 mr-1" />
                      {order.paymentStatus || 'Verified'}
                    </span>
                  </p>
                  <p className="text-[#3d3d3d]">
                    Fulfillment:{' '}
                    <span className="font-bold text-[#111111] capitalize">
                      {order.fulfillmentOption}
                    </span>{' '}
                    ({order.deliveryAddress || 'LISM Facility Counter'})
                  </p>
                </div>
                <div className="text-right space-y-1">
                  <div className="text-xs text-[#3d3d3d]">
                    Subtotal:{' '}
                    <span className="font-bold text-[#111111]">
                      ${subtotal.toFixed(2)}
                    </span>
                    {taxAmount > 0 && (
                      <span className="ml-3">
                        Tax & Shipping:{' '}
                        <span className="font-bold text-[#111111]">
                          ${(order.totalAmount - subtotal).toFixed(2)}
                        </span>
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-[#3d3d3d]">Total Billed Amount</p>
                  <p className="text-3xl font-bold text-[#0e4e65] font-display">
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
