import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext, Item } from '../../context/AppContext';
import {
  SearchIcon,
  ShoppingCartIcon,
  PackageIcon,
  ShieldAlertIcon,
  InfoIcon,
  XIcon,
  CheckCircleIcon
} from 'lucide-react';

export const Shop: React.FC = () => {
  const { items, cart, addToCart, checkoutCart, systemConfig } = useAppContext();
  const navigate = useNavigate();

  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('all');
  const [selectedItemSpec, setSelectedItemSpec] = useState<Item | null>(null);
  const [showCheckoutModal, setShowCheckoutModal] = useState(false);
  const [checkoutData, setCheckoutData] = useState({
    paymentMethod: 'online' as 'online' | 'cod',
    fulfillmentOption: 'delivery' as 'pickup' | 'delivery',
    deliveryAddress: '123 Lab St, BioResearch Wing, Science City, SC 12345',
    notes: 'Include CoA and SDS sheets with shipment.'
  });

  const filteredItems = items.filter((item) => {
    const matchesSearch =
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (item.casNumber || '').toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filter === 'all' || item.type === filter;
    return matchesSearch && matchesFilter;
  });

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const cartSubtotal = cart.reduce((sum, c) => {
    const item = items.find((i) => i.id === c.itemId);
    return item ? sum + item.price * c.quantity : sum;
  }, 0);

  const handleCheckout = (e: React.FormEvent) => {
    e.preventDefault();
    const order = checkoutCart(checkoutData);
    if (order) {
      setShowCheckoutModal(false);
      navigate('/customer/orders');
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap justify-between items-end gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-widest text-[#27c2d2]">
            Interscience Catalog
          </span>
          <h1 className="sp-type-headline-lg text-3xl sm:text-[46px] text-white mt-1">
            Laboratory Chemicals & Equipment
          </h1>
          <p className="text-sm text-[#b0b0b0] mt-1">
            Verified ACS reagents, analytical solvents, optical microscopes, and ISO-17025 calibrated metrology instruments
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="bg-[#131313] border border-[#212121] px-4 py-2.5 rounded-[20px] flex items-center gap-2.5">
            <ShoppingCartIcon className="h-5 w-5 text-[#27c2d2]" />
            <span className="text-sm font-bold text-white">
              {cartCount} items (${cartSubtotal.toFixed(2)})
            </span>
          </div>
          {cartCount > 0 && (
            <button
              onClick={() => setShowCheckoutModal(true)}
              className="sp-btn-primary h-[48px] px-7 text-sm"
            >
              Book your order
            </button>
          )}
        </div>
      </div>

      {/* Filters (Sharp 0px inputs per tokens.css) */}
      <div className="flex flex-wrap gap-4 bg-[#090909] p-4 rounded-[24px] border border-[#212121]">
        <div className="relative flex-grow max-w-md">
          <input
            type="text"
            placeholder="Search by product name, SKU, category, or CAS number..."
            className="pl-10 pr-4 py-2.5 w-full bg-[#000000] border border-[#2d2d2d] text-white placeholder-[#b0b0b0] rounded-none focus:outline-none focus:border-[#0e97b0] text-sm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <SearchIcon className="absolute left-3.5 top-3 h-4 w-4 text-[#b0b0b0]" />
        </div>
        <select
          className="bg-[#000000] border border-[#2d2d2d] text-white px-4 py-2.5 rounded-none focus:outline-none focus:border-[#0e97b0] text-sm"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        >
          <option value="all">All Catalog Items ({items.length})</option>
          <option value="chemical">Chemicals & Solvents</option>
          <option value="equipment">Equipment & Glassware</option>
        </select>
      </div>

      {/* Product Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredItems.map((item) => (
          <div
            key={item.id}
            className="bg-[#090909] border border-[#212121] rounded-[32px] overflow-hidden hover:border-[#0e97b0] transition-all duration-300 flex flex-col justify-between group shadow-xl"
          >
            <div>
              {/* 0px radius media container per tokens.css */}
              <div className="h-48 bg-[#000000] flex items-center justify-center relative overflow-hidden">
                {item.image ? (
                  <img
                    src={item.image}
                    alt={item.name}
                    className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                ) : (
                  <PackageIcon className="h-16 w-16 text-[#5d5d5d]" />
                )}
                {item.hazardLevel && item.hazardLevel !== 'None' && (
                  <span className="absolute top-3 right-3 bg-[#aa4266] text-white text-xs font-bold px-3 py-1 rounded-[10px] shadow-md flex items-center">
                    <ShieldAlertIcon className="h-3.5 w-3.5 mr-1" />
                    {item.hazardLevel}
                  </span>
                )}
              </div>
              <div className="p-5">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-[11px] font-bold text-[#27c2d2] uppercase tracking-wider">
                    {item.sku}
                  </span>
                  <span className="text-[11px] text-[#b0b0b0]">{item.category}</span>
                </div>
                <h3 className="font-bold text-white text-base mb-1 line-clamp-1 font-display">
                  {item.name}
                </h3>
                <p className="text-xs text-[#b0b0b0] mb-4 line-clamp-2">
                  {item.description}
                </p>

                <div className="text-xs bg-[#131313] p-3 rounded-[16px] border border-[#212121] space-y-1.5 mb-4">
                  <div className="flex justify-between">
                    <span className="text-[#b0b0b0]">Manufacturer:</span>
                    <span className="font-semibold text-white">
                      {item.manufacturer}
                    </span>
                  </div>
                  {item.type === 'chemical' ? (
                    <div className="flex justify-between">
                      <span className="text-[#b0b0b0]">CAS / Grade:</span>
                      <span className="font-semibold text-[#27c2d2]">
                        {item.casNumber}
                      </span>
                    </div>
                  ) : (
                    <div className="flex justify-between">
                      <span className="text-[#b0b0b0]">Model / Warranty:</span>
                      <span className="font-semibold text-[#27c2d2]">
                        {item.modelNumber} ({item.warrantyMonths}m)
                      </span>
                    </div>
                  )}
                </div>

                <div className="flex justify-between items-center mb-2">
                  <div>
                    <span className="text-xl font-bold text-white">
                      ${item.price.toFixed(2)}
                    </span>
                    <span className="text-xs text-[#b0b0b0]"> / {item.unit}</span>
                  </div>
                  <span
                    className={`text-xs px-2.5 py-1 rounded-full font-bold ${
                      item.stock > item.lowStockThreshold
                        ? 'bg-[#0f9b40]/25 text-[#4dfd88] border border-[#0f9b40]'
                        : 'bg-[#aa4266] text-white'
                    }`}
                  >
                    {item.stock > 0 ? `${item.stock} in stock` : 'Out of stock'}
                  </span>
                </div>
              </div>
            </div>

            <div className="p-5 pt-0 flex gap-2.5">
              <button
                onClick={() => setSelectedItemSpec(item)}
                className="sp-btn-outline px-3.5 py-2.5 text-xs"
                title="View Technical Specifications"
              >
                <InfoIcon className="h-4 w-4" />
              </button>
              <button
                onClick={() => addToCart(item.id, 1)}
                disabled={item.stock <= 0}
                className="sp-btn-primary flex-1 py-2.5 px-4 text-sm"
              >
                Add to Cart
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Technical Specs Modal */}
      {selectedItemSpec && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-[#090909] border border-[#212121] rounded-[32px] shadow-2xl max-w-lg w-full overflow-hidden text-white">
            <div className="flex justify-between items-center p-6 border-b border-[#212121] bg-[#131313]">
              <div>
                <span className="text-xs font-bold text-[#27c2d2] uppercase">
                  {selectedItemSpec.sku}
                </span>
                <h2 className="text-lg font-bold text-white font-display">
                  {selectedItemSpec.name}
                </h2>
              </div>
              <button
                onClick={() => setSelectedItemSpec(null)}
                className="text-[#b0b0b0] hover:text-white"
              >
                <XIcon className="h-5 w-5" />
              </button>
            </div>
            <div className="p-6 space-y-4 text-sm">
              <p className="text-[#b0b0b0] leading-relaxed">
                {selectedItemSpec.description}
              </p>
              <div className="grid grid-cols-2 gap-3 bg-[#131313] p-4 rounded-[20px] border border-[#212121] text-xs">
                <div>
                  <span className="text-[#b0b0b0] block">Manufacturer</span>
                  <span className="font-bold text-white">
                    {selectedItemSpec.manufacturer}
                  </span>
                </div>
                <div>
                  <span className="text-[#b0b0b0] block">Batch / Lot Number</span>
                  <span className="font-mono font-bold text-[#27c2d2]">
                    {selectedItemSpec.batchNumber}
                  </span>
                </div>
                <div>
                  <span className="text-[#b0b0b0] block">Storage Conditions</span>
                  <span className="font-bold text-white">
                    {selectedItemSpec.storageTemp}
                  </span>
                </div>
                <div>
                  <span className="text-[#b0b0b0] block">Warehouse Zone</span>
                  <span className="font-bold text-white">
                    {selectedItemSpec.storageLocation}
                  </span>
                </div>
                {selectedItemSpec.casNumber && (
                  <div>
                    <span className="text-[#b0b0b0] block">CAS Registry Number</span>
                    <span className="font-bold text-white">
                      {selectedItemSpec.casNumber}
                    </span>
                  </div>
                )}
                {selectedItemSpec.purityGrade && (
                  <div>
                    <span className="text-[#b0b0b0] block">Purity / Grade</span>
                    <span className="font-bold text-white">
                      {selectedItemSpec.purityGrade}
                    </span>
                  </div>
                )}
                {selectedItemSpec.expiryDate && (
                  <div>
                    <span className="text-[#b0b0b0] block">Expiry Date</span>
                    <span className="font-bold text-white">
                      {selectedItemSpec.expiryDate}
                    </span>
                  </div>
                )}
                {selectedItemSpec.calibrationDate && (
                  <div>
                    <span className="text-[#b0b0b0] block">Calibration Date</span>
                    <span className="font-bold text-white">
                      {selectedItemSpec.calibrationDate}
                    </span>
                  </div>
                )}
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <button
                  onClick={() => setSelectedItemSpec(null)}
                  className="sp-btn-outline px-5 py-2.5 text-sm"
                >
                  Close
                </button>
                <button
                  onClick={() => {
                    addToCart(selectedItemSpec.id, 1);
                    setSelectedItemSpec(null);
                  }}
                  className="sp-btn-primary px-6 py-2.5 text-sm"
                >
                  Add to Cart (${selectedItemSpec.price.toFixed(2)})
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Checkout Modal */}
      {showCheckoutModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-[#090909] border border-[#212121] rounded-[32px] shadow-2xl max-w-lg w-full overflow-hidden text-white">
            <div className="flex justify-between items-center p-6 border-b border-[#212121] bg-[#131313]">
              <h2 className="text-lg font-bold text-white font-display">
                Checkout Laboratory Requisition ({cartCount} items)
              </h2>
              <button
                onClick={() => setShowCheckoutModal(false)}
                className="text-[#b0b0b0] hover:text-white"
              >
                <XIcon className="h-5 w-5" />
              </button>
            </div>
            <form onSubmit={handleCheckout} className="p-6 space-y-4">
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
                  <option value="pickup">LISM Warehouse Pickup ($0.00)</option>
                </select>
              </div>
              {checkoutData.fulfillmentOption === 'delivery' && (
                <div>
                  <label className="block text-xs font-semibold text-[#b0b0b0] uppercase mb-1">
                    Delivery Address *
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
                  <option value="online">Online Grant / Institutional Card</option>
                  <option value="cod">Cash / Purchase Order on Delivery</option>
                </select>
              </div>
              <div className="flex justify-end gap-3 pt-4 border-t border-[#212121]">
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
                  <CheckCircleIcon className="h-4 w-4 mr-1.5" /> Place Order
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
