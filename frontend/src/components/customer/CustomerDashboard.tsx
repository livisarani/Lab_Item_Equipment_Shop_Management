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
  ShieldAlertIcon,
  ActivityIcon,
  SparklesIcon,
  ShieldCheckIcon
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

  const partnerLogos = [
    'COLGATE-PALMOLIVE',
    'Daiichi-Sankyo',
    'FMC BioPolymer',
    'FUJIFILM LifeSciences',
    'Mallinckrodt Pharma',
    'SC Johnson Labs',
    'CJ BioDiagnostics',
    'Apex BioLabs'
  ];

  return (
    <div className="space-y-12">
      {/* 1. ScanStation Hero Section (desktop-1440-fold.png recipe) */}
      <section className="relative rounded-[48px] overflow-hidden border border-[#212121] shadow-2xl min-h-[460px] flex items-center justify-center text-center px-6 py-16">
        {/* Background Laboratory Automation Photography with Dark Scrim */}
        <img
          src="https://images.unsplash.com/photo-1581093458791-9f3c3900df4b?auto=format&fit=crop&q=85&w=1600"
          alt="ScanStation Laboratory Automation"
          className="absolute inset-0 w-full h-full object-cover opacity-45"
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              'radial-gradient(circle closest-corner, rgba(0, 0, 0, 0.35) 20%, rgba(0, 0, 0, 0.92) 90%)'
          }}
        />

        <div className="relative z-10 max-w-[880px] mx-auto space-y-6">
          <span className="inline-flex items-center px-4 py-1.5 rounded-full bg-[#0e97b0]/25 border border-[#27c2d2]/40 text-[#27c2d2] text-xs font-bold uppercase tracking-widest">
            Real-Time Laboratory Supply & Telemetry
          </span>
          <h1 className="sp-type-headline-display text-4xl sm:text-6xl lg:text-[72px] lg:leading-[72px] text-white tracking-tight">
            Shape the future
            <br />
            of lab automation
          </h1>
          <p className="sp-type-body-md text-lg sm:text-2xl text-white/90 max-w-2xl mx-auto leading-snug">
            Discover how automation with LISMStation can upgrade your laboratory reagents, precision optics, and optimize your productivity.
          </p>
          <div className="pt-2 flex flex-wrap justify-center gap-4">
            <button
              onClick={() => navigate('/customer/shop')}
              className="sp-btn-primary h-[66px] px-10 text-[20.8px]"
            >
              Start your journey
            </button>
            <button
              onClick={() => navigate('/customer/orders')}
              className="sp-btn-outline h-[66px] px-8 text-[17.6px]"
            >
              Track live analyses & orders
            </button>
          </div>
        </div>
      </section>

      {/* 2. "They trust us" Region r1 Marquee Band */}
      <section className="py-6 text-center">
        <h2 className="sp-type-headline-lg text-3xl sm:text-[42px] text-white mb-8">
          They trust us
        </h2>
        <div className="relative overflow-hidden py-4">
          {/* Edge fade gradients from REGIONS.md r1-n22 & r1-n23 */}
          <div
            className="pointer-events-none absolute inset-y-0 left-0 w-24 z-10"
            style={{
              backgroundImage:
                'linear-gradient(90deg, rgb(0, 0, 0) 36%, rgba(255, 255, 255, 0))'
            }}
          />
          <div
            className="pointer-events-none absolute inset-y-0 right-0 w-24 z-10"
            style={{
              backgroundImage:
                'linear-gradient(270deg, rgb(0, 0, 0) 36%, rgba(255, 255, 255, 0))'
            }}
          />

          <div className="sp-marquee-track gap-16 items-center">
            {[...partnerLogos, ...partnerLogos].map((logo, idx) => (
              <div
                key={idx}
                className="px-6 py-2 text-[#b0b0b0] hover:text-white transition-colors font-display text-xl sm:text-2xl font-bold tracking-wider uppercase whitespace-nowrap opacity-75 hover:opacity-100"
              >
                {logo}
              </div>
            ))}
          </div>
        </div>

        {/* 3 Petri-Dish Round 56px Feature Highlights from desktop-1440-full.jpg */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-10 text-left max-w-5xl mx-auto">
          <div className="flex items-center space-x-4 bg-[#090909]/80 border border-[#212121] p-4 rounded-[24px]">
            <div className="h-14 w-14 rounded-full bg-[#27c2d2] text-black flex items-center justify-center flex-shrink-0 shadow-lg">
              <ActivityIcon className="h-7 w-7" />
            </div>
            <p className="text-sm text-white leading-snug">
              <strong className="text-[#27c2d2]">Visualize chemical & stock metrics</strong> with real-time batch counting
            </p>
          </div>
          <div className="flex items-center space-x-4 bg-[#090909]/80 border border-[#212121] p-4 rounded-[24px]">
            <div className="h-14 w-14 rounded-full bg-[#27c2d2] text-black flex items-center justify-center flex-shrink-0 shadow-lg">
              <SparklesIcon className="h-7 w-7" />
            </div>
            <p className="text-sm text-white leading-snug">
              <strong className="text-[#27c2d2]">Get deliveries up to 3 times faster</strong> and optimize your lab process
            </p>
          </div>
          <div className="flex items-center space-x-4 bg-[#090909]/80 border border-[#212121] p-4 rounded-[24px]">
            <div className="h-14 w-14 rounded-full bg-[#27c2d2] text-black flex items-center justify-center flex-shrink-0 shadow-lg">
              <ShieldCheckIcon className="h-7 w-7" />
            </div>
            <p className="text-sm text-white leading-snug">
              <strong className="text-[#27c2d2]">Compliance with regulatory standards</strong> (GMP Annex 1, AOAC, ISO)
            </p>
          </div>
        </div>
      </section>

      {orderPlacedSuccess && (
        <div className="p-5 bg-[#0f9b40]/20 border border-[#0f9b40] rounded-[20px] flex items-center justify-between text-white text-sm font-medium">
          <div className="flex items-center">
            <CheckCircleIcon className="h-5 w-5 mr-2.5 text-[#4dfd88]" />
            Order {orderPlacedSuccess} confirmed! Stock deducted and tax invoice generated.
          </div>
          <button
            onClick={() => navigate('/customer/orders')}
            className="sp-btn-primary px-5 py-2 text-xs"
          >
            Track Order
          </button>
        </div>
      )}

      {/* 3. Main Interactive Catalog + Cart & Orders Split */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Product Quick Browser */}
        <div className="sp-card-dark p-6 sm:p-8 lg:col-span-2">
          <div className="flex flex-wrap justify-between items-center mb-6 gap-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-[#27c2d2]">
                Real-Time Inventory
              </span>
              <h2 className="sp-type-headline-md text-2xl sm:text-[33.6px] text-white mt-1">
                Featured Lab Catalog
              </h2>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search items or SKU..."
                  className="pl-9 pr-4 py-2 text-sm bg-[#000000] border border-[#2d2d2d] text-white placeholder-[#b0b0b0] rounded-none focus:outline-none focus:border-[#0e97b0]"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <SearchIcon className="absolute left-3 top-2.5 h-4 w-4 text-[#b0b0b0]" />
              </div>
              <select
                className="bg-[#000000] border border-[#2d2d2d] text-white px-3 py-2 text-sm rounded-none focus:outline-none focus:border-[#0e97b0]"
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
              >
                <option value="all">All Items</option>
                <option value="chemical">Chemicals</option>
                <option value="equipment">Equipment</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
            {filteredItems.slice(0, 6).map((item) => (
              <div
                key={item.id}
                className="bg-[#131313] border border-[#212121] rounded-[28px] overflow-hidden flex flex-col justify-between hover:border-[#0e97b0] transition-all duration-300 group"
              >
                <div>
                  <div className="h-40 bg-[#000000] flex items-center justify-center relative overflow-hidden">
                    {item.image ? (
                      <img
                        src={item.image}
                        alt={item.name}
                        className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <PackageIcon className="h-12 w-12 text-[#5d5d5d]" />
                    )}
                    {item.hazardLevel && item.hazardLevel !== 'None' && (
                      <span className="absolute top-3 right-3 bg-[#aa4266] text-white text-[10px] font-bold px-2.5 py-1 rounded-[10px] shadow flex items-center">
                        <ShieldAlertIcon className="h-3 w-3 mr-1" />
                        {item.hazardLevel}
                      </span>
                    )}
                  </div>
                  <div className="p-5">
                    <span className="text-[10px] font-bold text-[#27c2d2] uppercase tracking-wider">
                      {item.sku}
                    </span>
                    <h3 className="font-bold text-base text-white line-clamp-1 mt-0.5">
                      {item.name}
                    </h3>
                    <p className="text-xs text-[#b0b0b0] mb-3">
                      {item.category} • {item.manufacturer}
                    </p>
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-lg text-white">
                        ${item.price.toFixed(2)}
                        <span className="text-xs font-normal text-[#b0b0b0]">
                          /{item.unit}
                        </span>
                      </span>
                      <span
                        className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full ${
                          item.stock > item.lowStockThreshold
                            ? 'bg-[#0f9b40]/25 text-[#4dfd88] border border-[#0f9b40]'
                            : 'bg-[#aa4266]/30 text-[#ff8da8] border border-[#aa4266]'
                        }`}
                      >
                        {item.stock > 0 ? `${item.stock} in stock` : 'Out of stock'}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="p-5 pt-0">
                  <button
                    onClick={() => addToCart(item.id, 1)}
                    disabled={item.stock <= 0}
                    className="sp-btn-primary w-full py-2.5 px-4 text-sm"
                  >
                    Add to Cart
                  </button>
                </div>
              </div>
            ))}
            {filteredItems.length === 0 && (
              <div className="col-span-full text-center py-8 text-[#b0b0b0]">
                No items found matching your criteria
              </div>
            )}
          </div>
        </div>

        {/* Right Column: High-Contrast Elevated Light Cart (.card-elevated-media-top) & Recent Orders */}
        <div className="space-y-6">
          {/* Elevated Light Card (#d4d4d4 with #111111 text & 32px radius) */}
          <div className="sp-card-elevated-light p-6 sm:p-7">
            <div className="flex items-center justify-between mb-4">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#0e4e65]">
                  Requisition Basket
                </span>
                <h2 className="text-xl font-bold text-[#111111] font-display">
                  Shopping Cart
                </h2>
              </div>
              <span className="bg-[#000000] text-white text-xs font-bold px-3 py-1 rounded-full">
                {cart.reduce((sum, item) => sum + item.quantity, 0)} items
              </span>
            </div>

            {cart.length > 0 ? (
              <>
                <div className="space-y-3 mb-4 max-h-64 overflow-y-auto pr-1 divide-y divide-black/10">
                  {cart.map((cartItem) => {
                    const item = items.find((i) => i.id === cartItem.itemId);
                    if (!item) return null;
                    return (
                      <div
                        key={cartItem.itemId}
                        className="flex justify-between items-center pt-2.5 first:pt-0"
                      >
                        <div className="pr-2">
                          <p className="font-bold text-sm text-[#111111] line-clamp-1">
                            {item.name}
                          </p>
                          <p className="text-xs text-[#3d3d3d]">
                            ${item.price.toFixed(2)} / {item.unit}
                          </p>
                          <div className="flex items-center space-x-2 mt-1.5">
                            <button
                              onClick={() =>
                                updateCartQuantity(item.id, cartItem.quantity - 1)
                              }
                              className="p-1 rounded-full bg-black/10 hover:bg-black hover:text-white text-[#111111] transition-colors"
                            >
                              <MinusIcon className="h-3 w-3" />
                            </button>
                            <span className="text-xs font-bold text-[#111111]">
                              {cartItem.quantity}
                            </span>
                            <button
                              onClick={() =>
                                updateCartQuantity(item.id, cartItem.quantity + 1)
                              }
                              className="p-1 rounded-full bg-black/10 hover:bg-black hover:text-white text-[#111111] transition-colors"
                            >
                              <PlusIcon className="h-3 w-3" />
                            </button>
                            <button
                              onClick={() => removeFromCart(item.id)}
                              className="p-1 text-[#aa4266] hover:text-red-700 ml-1"
                              title="Remove"
                            >
                              <TrashIcon className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        </div>
                        <p className="font-bold text-sm text-[#111111]">
                          ${(cartItem.quantity * item.price).toFixed(2)}
                        </p>
                      </div>
                    );
                  })}
                </div>
                <div className="border-t border-black/15 pt-3 mb-5 space-y-1 text-sm">
                  <div className="flex justify-between text-xs text-[#3d3d3d]">
                    <span>Subtotal:</span>
                    <span>${cartSubtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-xs text-[#3d3d3d]">
                    <span>Est. Tax ({systemConfig.taxRate}%):</span>
                    <span>
                      ${((cartSubtotal * systemConfig.taxRate) / 100).toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between font-bold text-lg text-[#111111] pt-1">
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
                  className="sp-btn-ink w-full h-[54px] text-base"
                >
                  Book your order
                </button>
              </>
            ) : (
              <div className="text-center py-8 text-[#3d3d3d]">
                <ShoppingCartIcon className="h-12 w-12 mx-auto text-black/30 mb-2" />
                <p className="text-sm font-medium">Your requisition cart is empty</p>
              </div>
            )}
          </div>

          {/* Dark Obsidian Recent Orders Card */}
          <div className="sp-card-dark p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-bold text-white font-display">
                My Recent Orders
              </h2>
              <button
                onClick={() => navigate('/customer/orders')}
                className="text-xs text-[#27c2d2] hover:underline font-medium"
              >
                View All →
              </button>
            </div>
            {customerOrders.length > 0 ? (
              <div className="space-y-3">
                {customerOrders.slice(0, 3).map((order) => (
                  <div
                    key={order.id}
                    className="bg-[#131313] border border-[#212121] rounded-[20px] p-4 hover:border-[#0e97b0] transition"
                  >
                    <div className="flex justify-between mb-1">
                      <span className="font-bold text-sm text-[#27c2d2]">
                        {order.id}
                      </span>
                      <span
                        className={`text-[11px] px-2.5 py-0.5 rounded-full font-bold capitalize ${
                          order.status === 'completed' || order.status === 'delivered'
                            ? 'bg-[#0f9b40]/30 text-[#4dfd88]'
                            : order.status === 'pending'
                            ? 'bg-[#aa4266] text-white'
                            : 'bg-[#0e97b0]/30 text-[#27c2d2]'
                        }`}
                      >
                        {order.status.replace('-', ' ')}
                      </span>
                    </div>
                    <p className="text-xs text-[#b0b0b0]">
                      {new Date(order.createdAt).toLocaleDateString()} •{' '}
                      {order.items.length} item(s)
                    </p>
                    <p className="font-bold text-sm text-white mt-1">
                      ${order.totalAmount.toFixed(2)}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-6 text-[#b0b0b0]">
                <p>No orders yet</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Checkout Modal */}
      {showCheckoutModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-[#090909] border border-[#212121] rounded-[32px] shadow-2xl max-w-lg w-full overflow-hidden text-white">
            <div className="flex justify-between items-center p-6 border-b border-[#212121] bg-[#131313]">
              <h2 className="text-lg font-bold text-white font-display">
                Complete Laboratory Requisition
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
                  Fulfillment Option
                </label>
                <select
                  className="w-full bg-[#000000] border border-[#2d2d2d] text-white px-3 py-2.5 text-sm rounded-none"
                  value={checkoutData.fulfillmentOption}
                  onChange={(e) =>
                    setCheckoutData({
                      ...checkoutData,
                      fulfillmentOption: e.target.value as 'pickup' | 'delivery'
                    })
                  }
                >
                  <option value="delivery">
                    Hazmat / Cold-Chain Fleet Delivery ($
                    {systemConfig.standardShippingFee.toFixed(2)})
                  </option>
                  <option value="pickup">
                    Warehouse Facility Counter Pickup ($0.00)
                  </option>
                </select>
              </div>

              {checkoutData.fulfillmentOption === 'delivery' && (
                <div>
                  <label className="block text-xs font-semibold text-[#b0b0b0] uppercase mb-1">
                    Laboratory Delivery Address *
                  </label>
                  <input
                    type="text"
                    required
                    className="w-full bg-[#000000] border border-[#2d2d2d] text-white px-3 py-2.5 text-sm rounded-none"
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
                <label className="block text-xs font-semibold text-[#b0b0b0] uppercase mb-1">
                  Payment Method
                </label>
                <select
                  className="w-full bg-[#000000] border border-[#2d2d2d] text-white px-3 py-2.5 text-sm rounded-none"
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
                <label className="block text-xs font-semibold text-[#b0b0b0] uppercase mb-1">
                  Special Handling & Compliance Notes
                </label>
                <textarea
                  rows={2}
                  className="w-full bg-[#000000] border border-[#2d2d2d] text-white px-3 py-2 text-sm rounded-none"
                  value={checkoutData.notes}
                  onChange={(e) =>
                    setCheckoutData({ ...checkoutData, notes: e.target.value })
                  }
                />
              </div>

              <div className="bg-[#131313] p-4 rounded-[20px] border border-[#212121] text-sm space-y-1">
                <div className="flex justify-between">
                  <span className="text-[#b0b0b0]">Items Subtotal:</span>
                  <span className="font-medium">${cartSubtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#b0b0b0]">
                    Tax ({systemConfig.taxRate}%):
                  </span>
                  <span className="font-medium">
                    ${((cartSubtotal * systemConfig.taxRate) / 100).toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#b0b0b0]">Shipping & Hazmat Handling:</span>
                  <span className="font-medium">
                    $
                    {checkoutData.fulfillmentOption === 'delivery'
                      ? systemConfig.standardShippingFee.toFixed(2)
                      : '0.00'}
                  </span>
                </div>
                <div className="flex justify-between font-bold text-base text-[#27c2d2] pt-2 border-t border-[#212121]">
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
                  className="sp-btn-outline px-5 py-2.5 text-sm"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="sp-btn-primary px-6 py-2.5 text-sm"
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
