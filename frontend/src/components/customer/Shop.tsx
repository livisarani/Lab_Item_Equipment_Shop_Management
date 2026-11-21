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
  const {
    items,
    cart,
    addToCart,
    checkoutCart,
    systemConfig
  } = useAppContext();
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
    <div>
      <div className="flex flex-wrap justify-between items-center mb-6 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Laboratory Chemicals & Equipment Shop
          </h1>
          <p className="text-sm text-gray-500">
            Browse verified ACS reagents, analytical solvents, optical microscopes, and metrology instruments
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="bg-blue-50 border border-blue-200 px-3.5 py-2 rounded-lg flex items-center gap-2">
            <ShoppingCartIcon className="h-5 w-5 text-blue-600" />
            <span className="text-sm font-semibold text-blue-900">
              {cartCount} items (${cartSubtotal.toFixed(2)})
            </span>
          </div>
          {cartCount > 0 && (
            <button
              onClick={() => setShowCheckoutModal(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-semibold shadow-sm"
            >
              Checkout Now
            </button>
          )}
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-4 mb-6">
        <div className="relative flex-grow max-w-md">
          <input
            type="text"
            placeholder="Search by product name, SKU, category, or CAS number..."
            className="pl-9 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <SearchIcon className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
        </div>
        <select
          className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        >
          <option value="all">All Catalog Items ({items.length})</option>
          <option value="chemical">Chemicals & Solvents</option>
          <option value="equipment">Equipment & Glassware</option>
        </select>
      </div>

      {/* Product Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {filteredItems.map((item) => (
          <div
            key={item.id}
            className="bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-lg transition-shadow flex flex-col justify-between"
          >
            <div>
              <div className="h-44 bg-gray-100 flex items-center justify-center relative">
                {item.image ? (
                  <img
                    src={item.image}
                    alt={item.name}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <PackageIcon className="h-16 w-16 text-gray-400" />
                )}
                {item.hazardLevel && item.hazardLevel !== 'None' && (
                  <span className="absolute top-2.5 right-2.5 bg-amber-100 text-amber-800 text-xs font-bold px-2.5 py-0.5 rounded-full shadow-sm flex items-center">
                    <ShieldAlertIcon className="h-3.5 w-3.5 mr-1" />
                    {item.hazardLevel}
                  </span>
                )}
              </div>
              <div className="p-4">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-[11px] font-bold text-blue-600 uppercase">
                    {item.sku}
                  </span>
                  <span className="text-[11px] text-gray-500">{item.category}</span>
                </div>
                <h3 className="font-bold text-gray-900 mb-1 line-clamp-1">
                  {item.name}
                </h3>
                <p className="text-xs text-gray-600 mb-3 line-clamp-2">
                  {item.description}
                </p>

                <div className="text-xs bg-gray-50 p-2.5 rounded-lg border border-gray-100 space-y-1 mb-3">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Manufacturer:</span>
                    <span className="font-medium text-gray-800">
                      {item.manufacturer}
                    </span>
                  </div>
                  {item.type === 'chemical' ? (
                    <div className="flex justify-between">
                      <span className="text-gray-500">CAS / Grade:</span>
                      <span className="font-medium text-gray-800">
                        {item.casNumber}
                      </span>
                    </div>
                  ) : (
                    <div className="flex justify-between">
                      <span className="text-gray-500">Model / Warranty:</span>
                      <span className="font-medium text-gray-800">
                        {item.modelNumber} ({item.warrantyMonths}m)
                      </span>
                    </div>
                  )}
                </div>

                <div className="flex justify-between items-center mb-3">
                  <div>
                    <span className="text-xl font-bold text-gray-900">
                      ${item.price.toFixed(2)}
                    </span>
                    <span className="text-xs text-gray-500"> / {item.unit}</span>
                  </div>
                  <span
                    className={`text-xs px-2 py-1 rounded font-semibold ${
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

            <div className="p-4 pt-0 flex gap-2">
              <button
                onClick={() => setSelectedItemSpec(item)}
                className="px-3 py-2 border border-gray-300 text-gray-700 hover:bg-gray-50 rounded-lg text-xs font-medium flex items-center"
                title="View Technical Specifications"
              >
                <InfoIcon className="h-4 w-4" />
              </button>
              <button
                onClick={() => addToCart(item.id, 1)}
                disabled={item.stock <= 0}
                className={`flex-1 py-2 px-4 rounded-lg text-sm font-semibold transition ${
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
      </div>

      {/* Technical Specs Modal */}
      {selectedItemSpec && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-lg w-full overflow-hidden">
            <div className="flex justify-between items-center p-5 border-b border-gray-200 bg-gray-50">
              <div>
                <span className="text-xs font-bold text-blue-600 uppercase">
                  {selectedItemSpec.sku}
                </span>
                <h2 className="text-lg font-bold text-gray-900">
                  {selectedItemSpec.name}
                </h2>
              </div>
              <button
                onClick={() => setSelectedItemSpec(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                <XIcon className="h-5 w-5" />
              </button>
            </div>
            <div className="p-6 space-y-4 text-sm">
              <p className="text-gray-700">{selectedItemSpec.description}</p>
              <div className="grid grid-cols-2 gap-3 bg-gray-50 p-4 rounded-lg border border-gray-200 text-xs">
                <div>
                  <span className="text-gray-500 block">Manufacturer</span>
                  <span className="font-semibold text-gray-900">
                    {selectedItemSpec.manufacturer}
                  </span>
                </div>
                <div>
                  <span className="text-gray-500 block">Batch / Lot Number</span>
                  <span className="font-mono font-semibold text-gray-900">
                    {selectedItemSpec.batchNumber}
                  </span>
                </div>
                <div>
                  <span className="text-gray-500 block">Storage Conditions</span>
                  <span className="font-semibold text-gray-900">
                    {selectedItemSpec.storageTemp}
                  </span>
                </div>
                <div>
                  <span className="text-gray-500 block">Warehouse Zone</span>
                  <span className="font-semibold text-gray-900">
                    {selectedItemSpec.storageLocation}
                  </span>
                </div>
                {selectedItemSpec.casNumber && (
                  <div>
                    <span className="text-gray-500 block">CAS Registry Number</span>
                    <span className="font-semibold text-gray-900">
                      {selectedItemSpec.casNumber}
                    </span>
                  </div>
                )}
                {selectedItemSpec.purityGrade && (
                  <div>
                    <span className="text-gray-500 block">Purity / Grade</span>
                    <span className="font-semibold text-gray-900">
                      {selectedItemSpec.purityGrade}
                    </span>
                  </div>
                )}
                {selectedItemSpec.expiryDate && (
                  <div>
                    <span className="text-gray-500 block">Expiry Date</span>
                    <span className="font-semibold text-gray-900">
                      {selectedItemSpec.expiryDate}
                    </span>
                  </div>
                )}
                {selectedItemSpec.calibrationDate && (
                  <div>
                    <span className="text-gray-500 block">Calibration Date</span>
                    <span className="font-semibold text-gray-900">
                      {selectedItemSpec.calibrationDate}
                    </span>
                  </div>
                )}
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <button
                  onClick={() => setSelectedItemSpec(null)}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium"
                >
                  Close
                </button>
                <button
                  onClick={() => {
                    addToCart(selectedItemSpec.id, 1);
                    setSelectedItemSpec(null);
                  }}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-semibold hover:bg-blue-700"
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
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-lg w-full overflow-hidden">
            <div className="flex justify-between items-center p-5 border-b border-gray-200 bg-gray-50">
              <h2 className="text-lg font-bold text-gray-900">
                Checkout Laboratory Requisition ({cartCount} items)
              </h2>
              <button
                onClick={() => setShowCheckoutModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <XIcon className="h-5 w-5" />
              </button>
            </div>
            <form onSubmit={handleCheckout} className="p-6 space-y-4">
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
                  <option value="pickup">LISM Warehouse Pickup ($0.00)</option>
                </select>
              </div>
              {checkoutData.fulfillmentOption === 'delivery' && (
                <div>
                  <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">
                    Delivery Address *
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
                  <option value="online">Online Grant / Institutional Card</option>
                  <option value="cod">Cash / Purchase Order on Delivery</option>
                </select>
              </div>
              <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => setShowCheckoutModal(false)}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-sm"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-blue-600 text-white rounded-lg text-sm font-semibold hover:bg-blue-700 flex items-center"
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
