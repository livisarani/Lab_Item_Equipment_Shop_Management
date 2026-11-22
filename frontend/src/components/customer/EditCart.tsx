import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../../context/AppContext';
import {
  ShoppingCartIcon,
  PackageIcon,
  PlusIcon,
  MinusIcon,
  TrashIcon,
  CheckCircleIcon,
  XIcon,
  ShieldAlertIcon,
  EditIcon,
  RefreshCwIcon,
  ArrowRightIcon,
  TruckIcon,
  FileTextIcon
} from 'lucide-react';

export const EditCart: React.FC = () => {
  const {
    items,
    cart,
    addToCart,
    updateCartQuantity,
    removeFromCart,
    clearCart,
    checkoutCart,
    systemConfig
  } = useAppContext();
  const navigate = useNavigate();

  const [quickAddId, setQuickAddId] = useState(items[2]?.id || '3');
  const [quickAddQty, setQuickAddQty] = useState(1);
  const [itemBatchNotes, setItemBatchNotes] = useState<Record<string, string>>({
    '1': 'Require Lot CoA & Acid Containment Bin',
    '4': 'Include ISO-17025 Calibration Certificate'
  });

  const [showCheckoutModal, setShowCheckoutModal] = useState(false);
  const [orderPlacedSuccess, setOrderPlacedSuccess] = useState<string | null>(null);
  const [checkoutData, setCheckoutData] = useState({
    paymentMethod: 'online' as 'online' | 'cod',
    fulfillmentOption: 'delivery' as 'pickup' | 'delivery',
    deliveryAddress: '123 Lab St, BioResearch Wing, Science City, SC 12345',
    notes: 'Please include Certificate of Analysis (CoA) and MSDS documentation.'
  });

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const cartSubtotal = cart.reduce((sum, cartItem) => {
    const item = items.find((i) => i.id === cartItem.itemId);
    return item ? sum + cartItem.quantity * item.price : sum;
  }, 0);
  const cartTax = Number(((cartSubtotal * systemConfig.taxRate) / 100).toFixed(2));
  const cartShipping =
    cart.length > 0 && checkoutData.fulfillmentOption === 'delivery'
      ? systemConfig.standardShippingFee
      : 0;
  const cartGrandTotal = Number((cartSubtotal + cartTax + cartShipping).toFixed(2));

  const handleQuickAddItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!quickAddId || quickAddQty <= 0) return;
    addToCart(quickAddId, quickAddQty);
    setQuickAddQty(1);
  };

  const handleConfirmCheckout = (e: React.FormEvent) => {
    e.preventDefault();
    const combinedNotes = [
      checkoutData.notes,
      ...Object.entries(itemBatchNotes)
        .filter(([id]) => cart.some((c) => c.itemId === id))
        .map(([id, note]) => {
          const it = items.find((i) => i.id === id);
          return note ? `[${it?.sku || id}: ${note}]` : '';
        })
        .filter(Boolean)
    ].join(' ');

    const newOrder = checkoutCart({
      ...checkoutData,
      notes: combinedNotes
    });
    if (newOrder) {
      setShowCheckoutModal(false);
      setOrderPlacedSuccess(newOrder.id);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header Banner */}
      <div className="flex flex-wrap justify-between items-end gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-widest text-[#27c2d2]">
            Customer Portal • Requisition Editor
          </span>
          <h1 className="sp-type-headline-lg text-3xl sm:text-[46px] text-white mt-1">
            Edit Cart & Lab Requisition
          </h1>
          <p className="text-sm text-[#b0b0b0] mt-1">
            Modify item quantities, attach batch/CoA compliance notes, quick-add catalog reagents, and configure hazmat delivery
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={() => navigate('/customer/shop')}
            className="sp-btn-outline h-[48px] px-6 text-sm"
          >
            + Browse Full Shop Catalog
          </button>
          {cart.length > 0 && (
            <button
              onClick={clearCart}
              className="px-5 h-[48px] rounded-[20px] bg-[#aa4266] hover:bg-[#8f3554] text-white text-sm font-bold flex items-center transition-colors"
            >
              <TrashIcon className="h-4 w-4 mr-1.5" /> Clear Cart
            </button>
          )}
        </div>
      </div>

      {orderPlacedSuccess && (
        <div className="p-5 bg-[#0f9b40]/25 border-2 border-[#0f9b40] text-white rounded-[24px] flex flex-wrap items-center justify-between gap-4 text-sm font-bold shadow-xl">
          <div className="flex items-center">
            <CheckCircleIcon className="h-6 w-6 mr-3 text-[#4dfd88]" />
            <div>
              <p className="text-base">
                Order {orderPlacedSuccess} Confirmed & Dispatched!
              </p>
              <p className="text-xs text-[#b0b0b0] font-normal">
                Inventory stock has been deducted and an official tax invoice has been generated.
              </p>
            </div>
          </div>
          <button
            onClick={() => navigate('/customer/orders')}
            className="sp-btn-primary px-6 py-2.5 text-xs"
          >
            Track Order Status →
          </button>
        </div>
      )}

      {/* Main Elevated Light Edit Cart Container (.sp-card-elevated-light) */}
      <div className="sp-card-elevated-light p-7 sm:p-10 border-4 border-[#0e97b0]">
        <div className="flex flex-wrap justify-between items-center gap-4 pb-6 border-b border-black/15">
          <div className="flex items-center space-x-3.5">
            <div className="h-14 w-14 rounded-full bg-[#000000] text-[#27c2d2] flex items-center justify-center shadow-lg">
              <EditIcon className="h-6 w-6" />
            </div>
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-[#0e4e65]">
                Active Requisition Workspace
              </span>
              <h2 className="sp-type-headline-md text-2xl sm:text-[32px] text-[#111111]">
                Cart Items & Specifications ({cartCount}{' '}
                {cartCount === 1 ? 'Unit' : 'Units'})
              </h2>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <span className="bg-[#000000] text-white text-sm font-bold px-4 py-2 rounded-full">
              {cart.length} {cart.length === 1 ? 'Unique SKU' : 'Unique SKUs'}
            </span>
          </div>
        </div>

        {/* Quick-Add Bar inside Edit Cart */}
        <form
          onSubmit={handleQuickAddItem}
          className="my-6 bg-white/90 p-5 rounded-[24px] border border-black/10 flex flex-wrap items-center justify-between gap-4 shadow-sm"
        >
          <div className="flex items-center space-x-2 text-sm font-bold text-[#111111]">
            <PlusIcon className="h-5 w-5 text-[#0e97b0]" />
            <span>Quick-Add Laboratory Item by SKU:</span>
          </div>
          <div className="flex flex-wrap items-center gap-3 flex-1 max-w-2xl">
            <select
              value={quickAddId}
              onChange={(e) => setQuickAddId(e.target.value)}
              className="flex-1 min-w-[220px] bg-white border border-black/25 text-[#111111] px-3.5 py-2.5 text-sm font-medium rounded-none"
            >
              {items.map((it) => (
                <option key={it.id} value={it.id} disabled={it.stock <= 0}>
                  {it.sku} — {it.name} (${it.price.toFixed(2)} / {it.unit}) [
                  {it.stock} in stock]
                </option>
              ))}
            </select>
            <input
              type="number"
              min={1}
              max={50}
              value={quickAddQty}
              onChange={(e) =>
                setQuickAddQty(Math.max(1, parseInt(e.target.value) || 1))
              }
              className="w-20 bg-white border border-black/25 text-[#111111] px-3 py-2.5 text-sm font-bold text-center rounded-none"
            />
            <button
              type="submit"
              className="sp-btn-primary h-[44px] px-6 text-sm"
            >
              + Add to Cart
            </button>
          </div>
        </form>

        {/* Editable Cart Items List + Live Order Summary */}
        {cart.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-6">
            {/* Left 2 Columns: Line-by-Line Editor */}
            <div className="lg:col-span-2 space-y-4">
              {cart.map((cartItem) => {
                const item = items.find((i) => i.id === cartItem.itemId);
                if (!item) return null;
                return (
                  <div
                    key={cartItem.itemId}
                    className="bg-white rounded-[24px] p-5 shadow-md border border-black/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                  >
                    <div className="flex items-start space-x-4">
                      {item.image ? (
                        <img
                          src={item.image}
                          alt={item.name}
                          className="h-20 w-20 rounded-[16px] object-cover border border-black/10 flex-shrink-0"
                        />
                      ) : (
                        <div className="h-20 w-20 rounded-[16px] bg-gray-200 flex items-center justify-center">
                          <PackageIcon className="h-8 w-8 text-gray-500" />
                        </div>
                      )}
                      <div>
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="text-[11px] font-bold text-[#0e97b0] uppercase">
                            {item.sku}
                          </span>
                          <span className="text-[11px] text-gray-500">
                            • Batch: {item.batchNumber}
                          </span>
                          {item.hazardLevel && item.hazardLevel !== 'None' && (
                            <span className="bg-[#aa4266] text-white text-[10px] font-bold px-2 py-0.5 rounded flex items-center">
                              <ShieldAlertIcon className="h-3 w-3 mr-0.5" />
                              {item.hazardLevel}
                            </span>
                          )}
                        </div>
                        <h3 className="font-bold text-base text-[#111111] mt-0.5">
                          {item.name}
                        </h3>
                        <p className="text-xs text-[#3d3d3d] mt-0.5">
                          Unit Price: <strong>${item.price.toFixed(2)}</strong> /{' '}
                          {item.unit} • Max Available:{' '}
                          <strong>
                            {item.stock} {item.unit}s
                          </strong>
                        </p>

                        {/* Per-item editable batch/CoA instruction */}
                        <div className="mt-2.5 flex items-center">
                          <FileTextIcon className="h-3.5 w-3.5 text-[#0e97b0] mr-1.5 flex-shrink-0" />
                          <input
                            type="text"
                            placeholder="Add custom batch, CoA, or calibration note for this item..."
                            value={itemBatchNotes[item.id] || ''}
                            onChange={(e) =>
                              setItemBatchNotes({
                                ...itemBatchNotes,
                                [item.id]: e.target.value
                              })
                            }
                            className="w-full sm:w-80 bg-gray-100 border border-black/15 text-[#111111] placeholder-gray-500 px-2.5 py-1 text-xs rounded-none focus:outline-none focus:border-[#0e97b0]"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Right Controls: Stepper, Direct Quantity Input, Line Subtotal & Delete */}
                    <div className="flex sm:flex-col items-center sm:items-end justify-between w-full sm:w-auto gap-3">
                      <div className="flex items-center space-x-1.5 bg-gray-100 p-1.5 rounded-[16px] border border-black/15">
                        <button
                          type="button"
                          onClick={() =>
                            updateCartQuantity(item.id, cartItem.quantity - 1)
                          }
                          className="h-8 w-8 rounded-full bg-white hover:bg-black hover:text-white text-[#111111] font-bold flex items-center justify-center shadow-sm transition-colors"
                          title="Decrease quantity"
                        >
                          <MinusIcon className="h-3.5 w-3.5" />
                        </button>
                        <input
                          type="number"
                          min={1}
                          max={item.stock}
                          value={cartItem.quantity}
                          onChange={(e) =>
                            updateCartQuantity(
                              item.id,
                              parseInt(e.target.value) || 1
                            )
                          }
                          className="w-14 text-center bg-transparent font-bold text-sm text-[#111111] focus:outline-none"
                        />
                        <button
                          type="button"
                          onClick={() =>
                            updateCartQuantity(item.id, cartItem.quantity + 1)
                          }
                          disabled={cartItem.quantity >= item.stock}
                          className="h-8 w-8 rounded-full bg-white hover:bg-black hover:text-white text-[#111111] font-bold flex items-center justify-center shadow-sm transition-colors disabled:opacity-40"
                          title="Increase quantity"
                        >
                          <PlusIcon className="h-3.5 w-3.5" />
                        </button>
                      </div>

                      <div className="flex items-center space-x-3">
                        <span className="text-lg font-bold text-[#111111]">
                          ${(cartItem.quantity * item.price).toFixed(2)}
                        </span>
                        <button
                          type="button"
                          onClick={() => removeFromCart(item.id)}
                          className="p-2 rounded-full bg-[#aa4266]/15 text-[#aa4266] hover:bg-[#aa4266] hover:text-white transition-colors"
                          title="Remove item from cart"
                        >
                          <TrashIcon className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Right Column: Live Order Configuration & Summary */}
            <div className="bg-[#090909] text-white p-6 sm:p-7 rounded-[28px] shadow-2xl flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <span className="text-xs font-bold uppercase tracking-widest text-[#27c2d2]">
                  Live Requisition Summary
                </span>
                <h3 className="text-xl font-bold font-display">
                  Fulfillment & Pricing
                </h3>

                <div>
                  <label className="block text-xs font-semibold text-[#b0b0b0] uppercase mb-1">
                    Delivery Mode
                  </label>
                  <select
                    value={checkoutData.fulfillmentOption}
                    onChange={(e) =>
                      setCheckoutData({
                        ...checkoutData,
                        fulfillmentOption: e.target.value as 'pickup' | 'delivery'
                      })
                    }
                    className="w-full bg-[#131313] border border-[#2d2d2d] text-white px-3 py-2.5 text-xs rounded-none"
                  >
                    <option value="delivery">
                      ADR Hazmat Fleet Delivery ($
                      {systemConfig.standardShippingFee.toFixed(2)})
                    </option>
                    <option value="pickup">
                      LISM Warehouse Counter Pickup ($0.00)
                    </option>
                  </select>
                </div>

                {checkoutData.fulfillmentOption === 'delivery' && (
                  <div>
                    <label className="block text-xs font-semibold text-[#b0b0b0] uppercase mb-1">
                      Destination Lab Address
                    </label>
                    <input
                      type="text"
                      value={checkoutData.deliveryAddress}
                      onChange={(e) =>
                        setCheckoutData({
                          ...checkoutData,
                          deliveryAddress: e.target.value
                        })
                      }
                      className="w-full bg-[#131313] border border-[#2d2d2d] text-white px-3 py-2 text-xs rounded-none"
                    />
                  </div>
                )}

                <div>
                  <label className="block text-xs font-semibold text-[#b0b0b0] uppercase mb-1">
                    Payment Settlement
                  </label>
                  <select
                    value={checkoutData.paymentMethod}
                    onChange={(e) =>
                      setCheckoutData({
                        ...checkoutData,
                        paymentMethod: e.target.value as 'online' | 'cod'
                      })
                    }
                    className="w-full bg-[#131313] border border-[#2d2d2d] text-white px-3 py-2.5 text-xs rounded-none"
                  >
                    <option value="online">Online Institutional Grant / Card</option>
                    <option value="cod">Cash / Purchase Order on Delivery</option>
                  </select>
                </div>

                <div className="border-t border-[#212121] pt-4 space-y-2 text-sm">
                  <div className="flex justify-between text-[#b0b0b0]">
                    <span>Items Subtotal ({cartCount} units):</span>
                    <span className="text-white font-semibold">
                      ${cartSubtotal.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between text-[#b0b0b0]">
                    <span>Estimated Tax ({systemConfig.taxRate}%):</span>
                    <span className="text-white font-semibold">
                      ${cartTax.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between text-[#b0b0b0]">
                    <span className="flex items-center">
                      <TruckIcon className="h-3.5 w-3.5 mr-1 text-[#27c2d2]" />
                      Hazmat / Cold-Chain Shipping:
                    </span>
                    <span className="text-white font-semibold">
                      ${cartShipping.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between text-xl font-bold text-[#27c2d2] pt-3 border-t border-[#212121]">
                    <span>Total Amount:</span>
                    <span>${cartGrandTotal.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => setShowCheckoutModal(true)}
                className="sp-btn-primary w-full h-[58px] text-base"
              >
                Confirm & Book Order <ArrowRightIcon className="h-5 w-5 ml-1.5" />
              </button>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-[24px] p-12 text-center my-4">
            <ShoppingCartIcon className="h-16 w-16 mx-auto text-gray-400 mb-3" />
            <h3 className="text-xl font-bold text-[#111111]">
              Your laboratory cart is currently empty
            </h3>
            <p className="text-sm text-[#3d3d3d] mt-1 mb-6 max-w-md mx-auto">
              Use the Quick-Add bar above, load a sample requisition below, or browse the full laboratory catalog.
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              <button
                onClick={() => {
                  addToCart('1', 2);
                  addToCart('2', 1);
                  addToCart('4', 1);
                }}
                className="sp-btn-ink px-6 py-3 text-sm"
              >
                <RefreshCwIcon className="h-4 w-4 mr-2" /> Load Sample Lab Requisition
              </button>
              <button
                onClick={() => navigate('/customer/shop')}
                className="sp-btn-primary px-6 py-3 text-sm"
              >
                Explore Lab Catalog
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Confirmation Modal */}
      {showCheckoutModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-[#090909] border border-[#212121] rounded-[32px] shadow-2xl max-w-lg w-full overflow-hidden text-white">
            <div className="flex justify-between items-center p-6 border-b border-[#212121] bg-[#131313]">
              <h2 className="text-lg font-bold text-white font-display">
                Finalize Laboratory Requisition
              </h2>
              <button
                onClick={() => setShowCheckoutModal(false)}
                className="text-[#b0b0b0] hover:text-white"
              >
                <XIcon className="h-5 w-5" />
              </button>
            </div>
            <form onSubmit={handleConfirmCheckout} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[#b0b0b0] uppercase mb-1">
                  Special Handling & Compliance Instructions
                </label>
                <textarea
                  rows={3}
                  className="w-full bg-[#000000] border border-[#2d2d2d] text-white px-3 py-2 text-sm rounded-none"
                  value={checkoutData.notes}
                  onChange={(e) =>
                    setCheckoutData({ ...checkoutData, notes: e.target.value })
                  }
                />
              </div>

              <div className="bg-[#131313] p-4 rounded-[20px] border border-[#212121] text-sm space-y-1.5">
                <div className="flex justify-between">
                  <span className="text-[#b0b0b0]">Items Subtotal:</span>
                  <span className="font-medium">${cartSubtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#b0b0b0]">
                    Tax ({systemConfig.taxRate}%):
                  </span>
                  <span className="font-medium">${cartTax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#b0b0b0]">Shipping & Hazmat Handling:</span>
                  <span className="font-medium">${cartShipping.toFixed(2)}</span>
                </div>
                <div className="flex justify-between font-bold text-lg text-[#27c2d2] pt-2 border-t border-[#212121]">
                  <span>Final Billed Total:</span>
                  <span>${cartGrandTotal.toFixed(2)}</span>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowCheckoutModal(false)}
                  className="sp-btn-outline px-5 py-2.5 text-sm"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="sp-btn-primary px-6 py-2.5 text-sm"
                >
                  <CheckCircleIcon className="h-4 w-4 mr-1.5" /> Submit Order
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
