import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../../context/AppContext';
import {
  SearchIcon,
  ShoppingCartIcon,
  PackageIcon,
  PlusIcon,
  MinusIcon,
  TrashIcon,
  CheckCircleIcon,
  XIcon,
  ShieldAlertIcon
} from 'lucide-react';

export const CustomerDashboard: React.FC = () => {
  const {
    items,
    orders,
    cart,
    addToCart,
    updateCartQuantity,
    removeFromCart,
    checkoutCart,
    systemConfig
  } = useAppContext();
  const navigate = useNavigate();

  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('all');
  const [showCheckoutModal, setShowCheckoutModal] = useState(false);
  const [orderPlacedSuccess, setOrderPlacedSuccess] = useState<string | null>(null);
  const [checkoutData, setCheckoutData] = useState({
    paymentMethod: 'online' as 'online' | 'cod',
    fulfillmentOption: 'delivery' as 'pickup' | 'delivery',
    deliveryAddress: '123 Lab St, BioResearch Wing, Science City, SC 12345',
    notes: 'Please include Certificate of Analysis (CoA) and MSDS documentation.'
  });

  const customerOrders = orders.filter((order) => order.customerId === '3');

  const filteredItems = items.filter((item) => {
    const matchesSearch =
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.sku.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filter === 'all' || item.type === filter;
    return matchesSearch && matchesFilter;
  });

  const cartSubtotal = cart.reduce((sum, cartItem) => {
    const item = items.find((i) => i.id === cartItem.itemId);
    return item ? sum + cartItem.quantity * item.price : sum;
  }, 0);

  const handleConfirmCheckout = (e: React.FormEvent) => {
    e.preventDefault();
    const newOrder = checkoutCart(checkoutData);
    if (newOrder) {
      setShowCheckoutModal(false);
      setOrderPlacedSuccess(newOrder.id);
      setTimeout(() => setOrderPlacedSuccess(null), 5000);
    }
  };

  return (
    <div>
      <div className="flex flex-wrap justify-between items-center mb-6 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Welcome to the LISM Scientific Supply Portal
          </h1>
          <p className="text-sm text-gray-500">
            Order ACS reagent-grade chemicals, calibrated analytical instruments, and track lab shipments
          </p>
        </div>
        <button
          onClick={() => navigate('/customer/shop')}
          className="bg-blue-600 hover:bg-blue-700 text-white text-sm px-4 py-2 rounded-lg font-medium"
        >
          Open Full Catalog →
        </button>
      </div>

      {orderPlacedSuccess && (
        <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center justify-between text-green-800 text-sm font-medium">
          <div className="flex items-center">
            <CheckCircleIcon className="h-5 w-5 mr-2 text-green-600" />
            Order {orderPlacedSuccess} placed! Stock updated and invoice generated.
          </div>
          <button
            onClick={() => navigate('/customer/orders')}
            className="text-xs bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700"
          >
            Track Order
          </button>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Product Quick Browser */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 lg:col-span-2">
          <div className="flex flex-wrap justify-between items-center mb-4 gap-3">
            <h2 className="text-lg font-semibold">Featured Laboratory Products</h2>
            <div className="flex items-center gap-2">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search items or SKU..."
                  className="pl-9 pr-4 py-1.5 text-sm border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <SearchIcon className="absolute left-3 top-2 h-4 w-4 text-gray-400" />
              </div>
              <select
                className="border border-gray-300 rounded-lg px-3 py-1.5 text-sm focus:ring-blue-500 focus:border-blue-500"
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
              >
                <option value="all">All Items</option>
                <option value="chemical">Chemicals</option>
                <option value="equipment">Equipment</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredItems.slice(0, 6).map((item) => (
              <div
                key={item.id}
                className="border border-gray-200 rounded-xl overflow-hidden flex flex-col justify-between hover:shadow-md transition-shadow"
              >
                <div>
                  <div className="h-36 bg-gray-100 flex items-center justify-center relative">
                    {item.image ? (
                      <img
                        src={item.image}
                        alt={item.name}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <PackageIcon className="h-12 w-12 text-gray-400" />
                    )}
                    {item.hazardLevel && item.hazardLevel !== 'None' && (
                      <span className="absolute top-2 right-2 bg-amber-100 text-amber-800 text-[10px] font-bold px-2 py-0.5 rounded shadow-sm flex items-center">
                        <ShieldAlertIcon className="h-3 w-3 mr-0.5" />
                        {item.hazardLevel}
                      </span>
                    )}
                  </div>
                  <div className="p-3.5">
                    <span className="text-[10px] font-bold text-blue-600 uppercase">
                      {item.sku}
                    </span>
                    <h3 className="font-semibold text-sm text-gray-900 line-clamp-1">
                      {item.name}
                    </h3>
                    <p className="text-xs text-gray-500 mb-2">
                      {item.category} • {item.manufacturer}
                    </p>
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-gray-900">
                        ${item.price.toFixed(2)}
                        <span className="text-[11px] font-normal text-gray-500">
                          /{item.unit}
                        </span>
                      </span>
                      <span
                        className={`text-[11px] font-semibold px-2 py-0.5 rounded ${
                          item.stock > item.lowStockThreshold
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {item.stock > 0 ? `${item.stock} in stock` : 'Out of stock'}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="p-3.5 pt-0">
                  <button
                    onClick={() => addToCart(item.id, 1)}
                    disabled={item.stock <= 0}
                    className={`w-full py-2 px-3 rounded-lg text-xs font-semibold transition-colors ${
                      item.stock > 0
                        ? 'bg-blue-600 text-white hover:bg-blue-700'
                        : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    }`}
                  >
                    Add to Cart
                  </button>
                </div>
              </div>
            ))}
            {filteredItems.length === 0 && (
              <div className="col-span-full text-center py-8 text-gray-500">
                No items found matching your criteria
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Interactive Cart & Recent Orders */}
        <div>
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 mb-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">Shopping Cart</h2>
              <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-1 rounded-full">
                {cart.reduce((sum, item) => sum + item.quantity, 0)} items
              </span>
            </div>

            {cart.length > 0 ? (
              <>
                <div className="space-y-3 mb-4 max-h-64 overflow-y-auto pr-1">
                  {cart.map((cartItem) => {
                    const item = items.find((i) => i.id === cartItem.itemId);
                    if (!item) return null;
                    return (
                      <div
                        key={cartItem.itemId}
                        className="flex justify-between items-center border-b border-gray-100 pb-2.5"
                      >
                        <div className="pr-2">
                          <p className="font-medium text-sm text-gray-900 line-clamp-1">
                            {item.name}
                          </p>
                          <p className="text-xs text-gray-500">
                            ${item.price.toFixed(2)} / {item.unit}
                          </p>
                          <div className="flex items-center space-x-2 mt-1">
                            <button
                              onClick={() =>
                                updateCartQuantity(item.id, cartItem.quantity - 1)
                              }
                              className="p-1 rounded bg-gray-100 hover:bg-gray-200 text-gray-700"
                            >
                              <MinusIcon className="h-3 w-3" />
                            </button>
                            <span className="text-xs font-semibold">
                              {cartItem.quantity}
                            </span>
                            <button
                              onClick={() =>
                                updateCartQuantity(item.id, cartItem.quantity + 1)
                              }
                              className="p-1 rounded bg-gray-100 hover:bg-gray-200 text-gray-700"
                            >
                              <PlusIcon className="h-3 w-3" />
                            </button>
                            <button
                              onClick={() => removeFromCart(item.id)}
                              className="p-1 text-red-500 hover:text-red-700 ml-1"
                              title="Remove"
                            >
                              <TrashIcon className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        </div>
                        <p className="font-semibold text-sm text-gray-900">
                          ${(cartItem.quantity * item.price).toFixed(2)}
                        </p>
                      </div>
                    );
                  })}
                </div>
                <div className="border-t border-gray-200 pt-3 mb-4 space-y-1 text-sm">
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>Subtotal:</span>
                    <span>${cartSubtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>Est. Tax ({systemConfig.taxRate}%):</span>
                    <span>
                      ${((cartSubtotal * systemConfig.taxRate) / 100).toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between font-bold text-base text-gray-900 pt-1">
                    <span>Est. Total:</span>
                    <span>
                      $
                      {(
                        cartSubtotal +
                        (cartSubtotal * systemConfig.taxRate) / 100
                      ).toFixed(2)}
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => setShowCheckoutModal(true)}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2.5 px-4 rounded-lg font-medium text-sm shadow-sm"
                >
                  Proceed to Checkout
                </button>
              </>
            ) : (
              <div className="text-center py-6 text-gray-500">
                <ShoppingCartIcon className="h-12 w-12 mx-auto text-gray-300 mb-2" />
                <p className="text-sm">Your cart is empty</p>
              </div>
            )}
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold">My Recent Orders</h2>
              <button
                onClick={() => navigate('/customer/orders')}
                className="text-xs text-blue-600 hover:text-blue-800 font-medium"
              >
                View All →
              </button>
            </div>
            {customerOrders.length > 0 ? (
              <div className="space-y-3">
                {customerOrders.slice(0, 3).map((order) => (
                  <div
                    key={order.id}
                    className="border border-gray-200 rounded-lg p-3.5 hover:bg-gray-50 transition"
                  >
                    <div className="flex justify-between mb-1">
                      <span className="font-semibold text-sm text-blue-600">
                        {order.id}
                      </span>
                      <span
                        className={`text-xs px-2 py-0.5 rounded-full font-semibold capitalize ${
                          order.status === 'completed' || order.status === 'delivered'
                            ? 'bg-green-100 text-green-800'
                            : order.status === 'pending'
                            ? 'bg-yellow-100 text-yellow-800'
                            : order.status === 'in-transit'
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}
                      >
                        {order.status.replace('-', ' ')}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500">
                      {new Date(order.createdAt).toLocaleDateString()} •{' '}
                      {order.items.length} item(s)
                    </p>
                    <p className="font-bold text-sm text-gray-900 mt-1">
                      ${order.totalAmount.toFixed(2)}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-6 text-gray-500">
                <p>No orders yet</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Checkout Modal */}
      {showCheckoutModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-lg w-full overflow-hidden">
            <div className="flex justify-between items-center p-5 border-b border-gray-200 bg-gray-50">
              <h2 className="text-lg font-bold text-gray-900">
                Complete Laboratory Requisition
              </h2>
              <button
                onClick={() => setShowCheckoutModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <XIcon className="h-5 w-5" />
              </button>
            </div>
            <form onSubmit={handleConfirmCheckout} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">
                  Fulfillment Option
                </label>
                <select
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
                  value={checkoutData.fulfillmentOption}
                  onChange={(e) =>
                    setCheckoutData({
                      ...checkoutData,
                      fulfillmentOption: e.target.value as 'pickup' | 'delivery'
                    })
                  }
                >
                  <option value="delivery">
                    Hazmat / Cold-Chain Fleet Delivery (${systemConfig.standardShippingFee.toFixed(2)})
                  </option>
                  <option value="pickup">
                    Warehouse Facility Counter Pickup ($0.00)
                  </option>
                </select>
              </div>

              {checkoutData.fulfillmentOption === 'delivery' && (
                <div>
                  <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">
                    Laboratory Delivery Address *
                  </label>
                  <input
                    type="text"
                    required
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
                    value={checkoutData.deliveryAddress}
                    onChange={(e) =>
                      setCheckoutData({
                        ...checkoutData,
                        deliveryAddress: e.target.value
                      })
                    }
                  />
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">
                  Payment Method
                </label>
                <select
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
                  value={checkoutData.paymentMethod}
                  onChange={(e) =>
                    setCheckoutData({
                      ...checkoutData,
                      paymentMethod: e.target.value as 'online' | 'cod'
                    })
                  }
                >
                  <option value="online">
                    Institutional Card / Online Grant Settlement
                  </option>
                  <option value="cod">Cash / PO on Delivery (COD)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">
                  Special Handling & Compliance Notes
                </label>
                <textarea
                  rows={2}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
                  value={checkoutData.notes}
                  onChange={(e) =>
                    setCheckoutData({ ...checkoutData, notes: e.target.value })
                  }
                />
              </div>

              <div className="bg-blue-50 p-4 rounded-lg border border-blue-200 text-sm space-y-1">
                <div className="flex justify-between">
                  <span className="text-gray-600">Items Subtotal:</span>
                  <span className="font-medium">${cartSubtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">
                    Tax ({systemConfig.taxRate}%):
                  </span>
                  <span className="font-medium">
                    ${((cartSubtotal * systemConfig.taxRate) / 100).toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Shipping & Hazmat Handling:</span>
                  <span className="font-medium">
                    $
                    {checkoutData.fulfillmentOption === 'delivery'
                      ? systemConfig.standardShippingFee.toFixed(2)
                      : '0.00'}
                  </span>
                </div>
                <div className="flex justify-between font-bold text-base text-blue-900 pt-1 border-t border-blue-200">
                  <span>Final Order Total:</span>
                  <span>
                    $
                    {(
                      cartSubtotal +
                      (cartSubtotal * systemConfig.taxRate) / 100 +
                      (checkoutData.fulfillmentOption === 'delivery'
                        ? systemConfig.standardShippingFee
                        : 0)
                    ).toFixed(2)}
                  </span>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowCheckoutModal(false)}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg text-sm font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-semibold"
                >
                  Confirm & Place Order
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
