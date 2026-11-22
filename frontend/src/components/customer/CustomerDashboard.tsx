import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../../context/AppContext';
import {
  SearchIcon,
  ShoppingCartIcon,
  PackageIcon,
  PlusIcon,
  MinusIcon,
  ShieldAlertIcon,
  EditIcon,
  ClipboardListIcon,
  MessageSquareIcon,
  ArrowRightIcon
} from 'lucide-react';

export const CustomerDashboard: React.FC = () => {
  const { items, orders, cart, addToCart, updateCartQuantity } = useAppContext();
  const navigate = useNavigate();

  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('all');

  const customerOrders = orders.filter((order) => order.customerId === '3');
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const cartSubtotal = cart.reduce((sum, cartItem) => {
    const item = items.find((i) => i.id === cartItem.itemId);
    return item ? sum + cartItem.quantity * item.price : sum;
  }, 0);

  const filteredItems = items.filter((item) => {
    const matchesSearch =
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.sku.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filter === 'all' || item.type === filter;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="space-y-8">
      {/* Customer Portal Dashboard Header */}
      <div className="flex flex-wrap justify-between items-end gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-widest text-[#27c2d2]">
            Customer Portal • BSL-2 Verified Account
          </span>
          <h1 className="sp-type-headline-lg text-3xl sm:text-[46px] text-white mt-1">
            Customer Dashboard
          </h1>
          <p className="text-sm text-[#b0b0b0] mt-1">
            Manage your laboratory requisitions, edit your active shopping cart, browse chemicals/equipment, and track orders
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          <button
            onClick={() => navigate('/customer/edit-cart')}
            className="sp-btn-primary h-[48px] px-7 text-sm"
          >
            <EditIcon className="h-4 w-4 mr-2" />
            Edit Cart ({cartCount} items • ${cartSubtotal.toFixed(2)})
          </button>
          <button
            onClick={() => navigate('/customer/shop')}
            className="sp-btn-outline h-[48px] px-6 text-sm"
          >
            Full Shop Catalog →
          </button>
        </div>
      </div>

      {/* Customer KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div
          onClick={() => navigate('/customer/edit-cart')}
          className="sp-card-dark p-6 cursor-pointer hover:border-[#27c2d2] transition-all"
        >
          <div className="flex justify-between items-center">
            <div>
              <p className="text-xs uppercase tracking-wider text-[#b0b0b0]">
                Active Cart
              </p>
              <p className="text-3xl font-bold text-[#27c2d2] mt-1 font-display">
                {cartCount} Units
              </p>
            </div>
            <div className="h-12 w-12 rounded-full bg-[#27c2d2] text-black flex items-center justify-center">
              <ShoppingCartIcon className="h-6 w-6" />
            </div>
          </div>
          <p className="text-xs text-[#b0b0b0] mt-3">
            Est. Subtotal: <strong className="text-white">${cartSubtotal.toFixed(2)}</strong> • Click to Edit
          </p>
        </div>

        <div
          onClick={() => navigate('/customer/orders')}
          className="sp-card-dark p-6 cursor-pointer hover:border-[#27c2d2] transition-all"
        >
          <div className="flex justify-between items-center">
            <div>
              <p className="text-xs uppercase tracking-wider text-[#b0b0b0]">
                My Lab Orders
              </p>
              <p className="text-3xl font-bold text-white mt-1 font-display">
                {customerOrders.length}
              </p>
            </div>
            <div className="h-12 w-12 rounded-full bg-[#0e97b0] text-white flex items-center justify-center">
              <ClipboardListIcon className="h-6 w-6" />
            </div>
          </div>
          <p className="text-xs text-[#b0b0b0] mt-3">
            {customerOrders.filter((o) => o.status === 'in-transit').length} currently in transit
          </p>
        </div>

        <div
          onClick={() => navigate('/customer/shop')}
          className="sp-card-dark p-6 cursor-pointer hover:border-[#27c2d2] transition-all"
        >
          <div className="flex justify-between items-center">
            <div>
              <p className="text-xs uppercase tracking-wider text-[#b0b0b0]">
                Catalog SKUs
              </p>
              <p className="text-3xl font-bold text-[#4dfd88] mt-1 font-display">
                {items.length}
              </p>
            </div>
            <div className="h-12 w-12 rounded-full bg-[#0f9b40] text-white flex items-center justify-center">
              <PackageIcon className="h-6 w-6" />
            </div>
          </div>
          <p className="text-xs text-[#b0b0b0] mt-3">
            ACS Reagents & ISO-17025 Equipment
          </p>
        </div>

        <div
          onClick={() => navigate('/customer/support')}
          className="sp-card-crimson p-6 cursor-pointer shadow-xl"
        >
          <div className="flex justify-between items-center">
            <div>
              <p className="text-xs uppercase tracking-wider text-white/80">
                R&D & SDS Help
              </p>
              <p className="text-2xl font-bold text-white mt-1 font-display">
                24/7 Support
              </p>
            </div>
            <div className="h-12 w-12 rounded-full bg-black/30 text-white flex items-center justify-center">
              <MessageSquareIcon className="h-6 w-6" />
            </div>
          </div>
          <p className="text-xs text-white/90 mt-3 font-medium">
            Request Lot CoA & MSDS Sheets →
          </p>
        </div>
      </div>

      {/* Main Split: Quick Product Browser + Quick Cart Summary & Recent Orders */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="sp-card-dark p-6 sm:p-8 lg:col-span-2">
          <div className="flex flex-wrap justify-between items-center mb-6 gap-4">
            <h2 className="text-xl font-bold text-white font-display">
              Quick Requisition Catalog
            </h2>
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
            {filteredItems.slice(0, 6).map((item) => {
              const inCart = cart.find((c) => c.itemId === item.id);
              return (
                <div
                  key={item.id}
                  className="bg-[#131313] border border-[#212121] rounded-[28px] overflow-hidden flex flex-col justify-between hover:border-[#0e97b0] transition-all group"
                >
                  <div>
                    <div className="h-36 bg-[#000000] flex items-center justify-center relative overflow-hidden">
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
                        <span className="absolute top-2.5 right-2.5 bg-[#aa4266] text-white text-[10px] font-bold px-2.5 py-0.5 rounded-[8px] flex items-center">
                          <ShieldAlertIcon className="h-3 w-3 mr-1" />
                          {item.hazardLevel}
                        </span>
                      )}
                    </div>
                    <div className="p-4">
                      <span className="text-[10px] font-bold text-[#27c2d2] uppercase">
                        {item.sku}
                      </span>
                      <h3 className="font-bold text-sm text-white line-clamp-1 mt-0.5">
                        {item.name}
                      </h3>
                      <p className="text-xs text-[#b0b0b0] mb-3">{item.category}</p>
                      <div className="flex justify-between items-center">
                        <span className="font-bold text-base text-white">
                          ${item.price.toFixed(2)}
                          <span className="text-[11px] font-normal text-[#b0b0b0]">
                            /{item.unit}
                          </span>
                        </span>
                        <span className="text-[11px] font-bold text-[#4dfd88]">
                          {item.stock} in stock
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="p-4 pt-0">
                    {inCart ? (
                      <div className="flex items-center justify-between bg-[#090909] border border-[#0e97b0] rounded-[18px] px-2.5 py-1">
                        <button
                          onClick={() =>
                            updateCartQuantity(item.id, inCart.quantity - 1)
                          }
                          className="h-7 w-7 rounded-full bg-[#131313] text-white hover:bg-[#aa4266] flex items-center justify-center"
                        >
                          <MinusIcon className="h-3 w-3" />
                        </button>
                        <span className="text-xs font-bold text-[#27c2d2]">
                          {inCart.quantity} in cart
                        </span>
                        <button
                          onClick={() =>
                            updateCartQuantity(item.id, inCart.quantity + 1)
                          }
                          className="h-7 w-7 rounded-full bg-[#131313] text-white hover:bg-[#0e97b0] flex items-center justify-center"
                        >
                          <PlusIcon className="h-3 w-3" />
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => addToCart(item.id, 1)}
                        disabled={item.stock <= 0}
                        className="sp-btn-primary w-full py-2 text-xs"
                      >
                        Add to Cart
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Elevated Cart Preview + Recent Orders */}
        <div className="space-y-6">
          <div className="sp-card-elevated-light p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-widest text-[#0e4e65]">
                  Customer Portal Cart
                </span>
                <h2 className="text-xl font-bold text-[#111111] font-display">
                  Shopping Cart
                </h2>
              </div>
              <span className="bg-black text-white text-xs font-bold px-3 py-1 rounded-full">
                {cartCount} items
              </span>
            </div>

            {cart.length > 0 ? (
              <>
                <div className="space-y-2.5 mb-4 max-h-56 overflow-y-auto divide-y divide-black/10">
                  {cart.map((c) => {
                    const it = items.find((i) => i.id === c.itemId);
                    if (!it) return null;
                    return (
                      <div
                        key={c.itemId}
                        className="pt-2 first:pt-0 flex justify-between items-center text-sm"
                      >
                        <div>
                          <p className="font-bold text-[#111111] line-clamp-1">
                            {it.name}
                          </p>
                          <p className="text-xs text-[#3d3d3d]">
                            {c.quantity} × ${it.price.toFixed(2)}
                          </p>
                        </div>
                        <span className="font-bold text-[#111111]">
                          ${(c.quantity * it.price).toFixed(2)}
                        </span>
                      </div>
                    );
                  })}
                </div>
                <div className="border-t border-black/15 pt-3 mb-4 flex justify-between font-bold text-base text-[#111111]">
                  <span>Subtotal:</span>
                  <span>${cartSubtotal.toFixed(2)}</span>
                </div>
                <button
                  onClick={() => navigate('/customer/edit-cart')}
                  className="sp-btn-ink w-full h-[50px] text-sm"
                >
                  <EditIcon className="h-4 w-4 mr-1.5 text-[#27c2d2]" />
                  Open Full Edit Cart & Checkout <ArrowRightIcon className="h-4 w-4 ml-1" />
                </button>
              </>
            ) : (
              <div className="text-center py-6 text-[#3d3d3d]">
                <ShoppingCartIcon className="h-10 w-10 mx-auto text-black/30 mb-2" />
                <p className="text-sm">Your cart is empty</p>
              </div>
            )}
          </div>

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
            <div className="space-y-3">
              {customerOrders.slice(0, 3).map((order) => (
                <div
                  key={order.id}
                  className="bg-[#131313] border border-[#212121] rounded-[20px] p-3.5"
                >
                  <div className="flex justify-between mb-1">
                    <span className="font-bold text-sm text-[#27c2d2]">
                      {order.id}
                    </span>
                    <span className="text-[11px] px-2.5 py-0.5 rounded-full font-bold capitalize bg-[#0e97b0]/30 text-[#27c2d2]">
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
          </div>
        </div>
      </div>
    </div>
  );
};
