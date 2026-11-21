import React, { useState } from 'react';
import { useAppContext, Item } from '../../context/AppContext';
import {
  PackageIcon,
  PlusIcon,
  AlertCircleIcon,
  CalendarIcon,
  SearchIcon,
  XIcon,
  CheckCircleIcon,
  RefreshCwIcon
} from 'lucide-react';

export const InventoryDashboard: React.FC = () => {
  const { items, addItem, updateItem, deleteItem, restockItem } = useAppContext();
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('all');
  const [showItemModal, setShowItemModal] = useState(false);
  const [editingItem, setEditingItem] = useState<Item | null>(null);

  const [formData, setFormData] = useState({
    sku: 'CHEM-NEW-013',
    name: '',
    type: 'chemical' as 'chemical' | 'equipment',
    category: 'Acids',
    price: 49.99,
    stock: 20,
    unit: 'liter',
    description: '',
    expiryDate: '2028-01-01',
    lowStockThreshold: 10,
    manufacturer: 'SigmaChem Diagnostics',
    batchNumber: 'LOT-2026-901',
    storageLocation: 'Zone A - Acid Cabinet 1',
    storageTemp: '15°C - 25°C',
    casNumber: '',
    hazardLevel: 'Corrosive' as Item['hazardLevel'],
    purityGrade: '99.0% ACS Grade',
    calibrationDate: '',
    warrantyMonths: 24,
    modelNumber: '',
    image: 'https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?auto=format&fit=crop&q=80&w=400&h=300'
  });

  const today = new Date();
  const expiredItems = items.filter(
    (item) => item.expiryDate && new Date(item.expiryDate) < today
  );
  const lowStockItems = items.filter(
    (item) => item.stock <= item.lowStockThreshold
  );

  const filteredItems = items.filter((item) => {
    const matchesSearch =
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.batchNumber.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter =
      filter === 'all' ||
      (filter === 'chemical' && item.type === 'chemical') ||
      (filter === 'equipment' && item.type === 'equipment') ||
      (filter === 'expired' &&
        item.expiryDate &&
        new Date(item.expiryDate) < today) ||
      (filter === 'lowstock' && item.stock <= item.lowStockThreshold);
    return matchesSearch && matchesFilter;
  });

  const openAddModal = () => {
    setEditingItem(null);
    setFormData({
      sku: `LISM-${Math.floor(100 + Math.random() * 900)}`,
      name: '',
      type: 'chemical',
      category: 'Acids',
      price: 45.0,
      stock: 25,
      unit: 'liter',
      description: '',
      expiryDate: '2028-06-30',
      lowStockThreshold: 10,
      manufacturer: 'SigmaChem Diagnostics',
      batchNumber: `LOT-2026-${Math.floor(100 + Math.random() * 899)}`,
      storageLocation: 'Zone A - Cabinet 2',
      storageTemp: '15°C - 25°C',
      casNumber: '7732-18-5',
      hazardLevel: 'Low',
      purityGrade: '99.5% ACS',
      calibrationDate: '',
      warrantyMonths: 24,
      modelNumber: '',
      image: 'https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?auto=format&fit=crop&q=80&w=400&h=300'
    });
    setShowItemModal(true);
  };

  const openEditModal = (item: Item) => {
    setEditingItem(item);
    setFormData({
      sku: item.sku,
      name: item.name,
      type: item.type,
      category: item.category,
      price: item.price,
      stock: item.stock,
      unit: item.unit,
      description: item.description,
      expiryDate: item.expiryDate || '',
      lowStockThreshold: item.lowStockThreshold,
      manufacturer: item.manufacturer,
      batchNumber: item.batchNumber,
      storageLocation: item.storageLocation,
      storageTemp: item.storageTemp,
      casNumber: item.casNumber || '',
      hazardLevel: item.hazardLevel || 'None',
      purityGrade: item.purityGrade || '',
      calibrationDate: item.calibrationDate || '',
      warrantyMonths: item.warrantyMonths || 12,
      modelNumber: item.modelNumber || '',
      image: item.image || ''
    });
    setShowItemModal(true);
  };

  const handleSaveItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingItem) {
      updateItem(editingItem.id, formData);
    } else {
      addItem(formData);
    }
    setShowItemModal(false);
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">
          Inventory & Warehouse Dashboard
        </h1>
        <p className="text-sm text-gray-500">
          Monitor chemical vault lots, equipment calibration statuses, expiry alerts, and safety thresholds
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm text-gray-500">Total Catalog SKUs</p>
              <p className="text-2xl font-bold text-gray-900">{items.length}</p>
            </div>
            <div className="p-3 bg-blue-100 rounded-full">
              <PackageIcon className="h-6 w-6 text-blue-600" />
            </div>
          </div>
          <div className="flex mt-2 text-xs text-gray-500 space-x-4">
            <div>
              <span className="font-semibold text-blue-600">
                {items.filter((i) => i.type === 'chemical').length}
              </span>{' '}
              Chemicals
            </div>
            <div>
              <span className="font-semibold text-blue-600">
                {items.filter((i) => i.type === 'equipment').length}
              </span>{' '}
              Equipment
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm text-gray-500">Low Stock Items</p>
              <p className="text-2xl font-bold text-amber-600">
                {lowStockItems.length}
              </p>
            </div>
            <div className="p-3 bg-amber-100 rounded-full">
              <AlertCircleIcon className="h-6 w-6 text-amber-600" />
            </div>
          </div>
          <p className="text-xs text-gray-500 mt-2">
            Items at or below minimum threshold
          </p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm text-gray-500">Expired Chemical Lots</p>
              <p className="text-2xl font-bold text-red-600">
                {expiredItems.length}
              </p>
            </div>
            <div className="p-3 bg-red-100 rounded-full">
              <CalendarIcon className="h-6 w-6 text-red-600" />
            </div>
          </div>
          <p className="text-xs text-gray-500 mt-2">
            Lots requiring quarantine or disposal
          </p>
        </div>
      </div>

      {/* Inventory Table */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 mb-6">
        <div className="flex flex-wrap justify-between items-center mb-6 gap-4">
          <h2 className="text-lg font-semibold">Active Inventory Catalog</h2>
          <button
            onClick={openAddModal}
            className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg flex items-center text-sm font-medium shadow-sm"
          >
            <PlusIcon className="h-4 w-4 mr-1.5" /> Add New Item / Batch
          </button>
        </div>

        <div className="flex flex-wrap gap-4 mb-6">
          <div className="relative flex-grow max-w-md">
            <input
              type="text"
              placeholder="Search by item name, SKU, or batch lot..."
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
            <option value="all">All Items ({items.length})</option>
            <option value="chemical">Chemicals</option>
            <option value="equipment">Equipment</option>
            <option value="expired">Expired Lots ({expiredItems.length})</option>
            <option value="lowstock">Low Stock ({lowStockItems.length})</option>
          </select>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Item & SKU
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Batch & Location
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Spec / Hazard
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Price
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Stock Level
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredItems.map((item) => {
                const isExpired =
                  item.expiryDate && new Date(item.expiryDate) < today;
                const isLowStock = item.stock <= item.lowStockThreshold;
                return (
                  <tr key={item.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="h-10 w-10 flex-shrink-0 mr-3">
                          {item.image ? (
                            <img
                              src={item.image}
                              alt={item.name}
                              className="h-10 w-10 rounded-lg object-cover border border-gray-200"
                            />
                          ) : (
                            <div className="h-10 w-10 rounded-lg bg-gray-200 flex items-center justify-center">
                              <PackageIcon className="h-5 w-5 text-gray-500" />
                            </div>
                          )}
                        </div>
                        <div>
                          <div className="font-semibold text-gray-900">
                            {item.name}
                          </div>
                          <div className="text-xs text-blue-600 font-medium">
                            {item.sku} • {item.category}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-xs">
                      <div className="font-mono font-semibold text-gray-800">
                        {item.batchNumber}
                      </div>
                      <div className="text-gray-500">{item.storageLocation}</div>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-xs">
                      <div>
                        {item.type === 'chemical'
                          ? `CAS: ${item.casNumber || 'N/A'}`
                          : `Model: ${item.modelNumber || 'N/A'}`}
                      </div>
                      <div className="text-gray-500">
                        Hazard: {item.hazardLevel || 'None'}
                      </div>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap font-medium">
                      ${item.price.toFixed(2)}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <div
                        className={
                          isLowStock
                            ? 'text-red-600 font-bold'
                            : 'font-semibold text-gray-900'
                        }
                      >
                        {item.stock} {item.unit}
                      </div>
                      <div className="text-xs text-gray-400">
                        Min: {item.lowStockThreshold} {item.unit}
                      </div>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      {isExpired ? (
                        <span className="px-2.5 py-0.5 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">
                          Expired ({item.expiryDate})
                        </span>
                      ) : isLowStock ? (
                        <span className="px-2.5 py-0.5 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
                          Low Stock
                        </span>
                      ) : (
                        <span className="px-2.5 py-0.5 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                          In Stock
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm space-x-2">
                      <button
                        onClick={() => restockItem(item.id, 10)}
                        className="text-green-600 hover:text-green-800 font-medium text-xs bg-green-50 border border-green-200 px-2 py-1 rounded inline-flex items-center"
                        title="Quick Restock +10 units"
                      >
                        <RefreshCwIcon className="h-3 w-3 mr-1" /> +10
                      </button>
                      <button
                        onClick={() => openEditModal(item)}
                        className="text-blue-600 hover:text-blue-800 font-medium text-xs"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => deleteItem(item.id)}
                        className="text-red-600 hover:text-red-800 font-medium text-xs"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                );
              })}
              {filteredItems.length === 0 && (
                <tr>
                  <td
                    colSpan={7}
                    className="px-4 py-8 text-center text-gray-500"
                  >
                    No items found matching your criteria
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Item Modal */}
      {showItemModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full overflow-hidden">
            <div className="flex justify-between items-center p-5 border-b border-gray-200 bg-gray-50">
              <h2 className="text-lg font-bold text-gray-900">
                {editingItem
                  ? `Edit Inventory Item (${editingItem.sku})`
                  : 'Add New Laboratory Item'}
              </h2>
              <button
                onClick={() => setShowItemModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <XIcon className="h-5 w-5" />
              </button>
            </div>
            <form
              onSubmit={handleSaveItem}
              className="p-6 space-y-4 max-h-[80vh] overflow-y-auto"
            >
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">
                    SKU Code *
                  </label>
                  <input
                    type="text"
                    required
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
                    value={formData.sku}
                    onChange={(e) =>
                      setFormData({ ...formData, sku: e.target.value })
                    }
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">
                    Item Name *
                  </label>
                  <input
                    type="text"
                    required
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">
                    Item Type
                  </label>
                  <select
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
                    value={formData.type}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        type: e.target.value as 'chemical' | 'equipment'
                      })
                    }
                  >
                    <option value="chemical">Chemical</option>
                    <option value="equipment">Equipment</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">
                    Category
                  </label>
                  <input
                    type="text"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
                    value={formData.category}
                    onChange={(e) =>
                      setFormData({ ...formData, category: e.target.value })
                    }
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">
                    Manufacturer
                  </label>
                  <input
                    type="text"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
                    value={formData.manufacturer}
                    onChange={(e) =>
                      setFormData({ ...formData, manufacturer: e.target.value })
                    }
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">
                    Unit Price ($) *
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
                    value={formData.price}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        price: parseFloat(e.target.value) || 0
                      })
                    }
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">
                    Current Stock *
                  </label>
                  <input
                    type="number"
                    required
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
                    value={formData.stock}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        stock: parseInt(e.target.value) || 0
                      })
                    }
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">
                    Unit (liter, kg, piece)
                  </label>
                  <input
                    type="text"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
                    value={formData.unit}
                    onChange={(e) =>
                      setFormData({ ...formData, unit: e.target.value })
                    }
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">
                    Low Stock Threshold
                  </label>
                  <input
                    type="number"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
                    value={formData.lowStockThreshold}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        lowStockThreshold: parseInt(e.target.value) || 0
                      })
                    }
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">
                    Batch / Serial Number
                  </label>
                  <input
                    type="text"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
                    value={formData.batchNumber}
                    onChange={(e) =>
                      setFormData({ ...formData, batchNumber: e.target.value })
                    }
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">
                    Warehouse Location
                  </label>
                  <input
                    type="text"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
                    value={formData.storageLocation}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        storageLocation: e.target.value
                      })
                    }
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">
                    Hazard Level
                  </label>
                  <select
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
                    value={formData.hazardLevel}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        hazardLevel: e.target.value as Item['hazardLevel']
                      })
                    }
                  >
                    <option value="None">None</option>
                    <option value="Low">Low</option>
                    <option value="Moderate">Moderate</option>
                    <option value="High">High</option>
                    <option value="Corrosive">Corrosive</option>
                    <option value="Flammable">Flammable</option>
                    <option value="Oxidizer">Oxidizer</option>
                    <option value="Toxic">Toxic</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">
                    {formData.type === 'chemical' ? 'CAS Number' : 'Model Number'}
                  </label>
                  <input
                    type="text"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
                    value={
                      formData.type === 'chemical'
                        ? formData.casNumber
                        : formData.modelNumber
                    }
                    onChange={(e) =>
                      formData.type === 'chemical'
                        ? setFormData({ ...formData, casNumber: e.target.value })
                        : setFormData({ ...formData, modelNumber: e.target.value })
                    }
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">
                    {formData.type === 'chemical'
                      ? 'Expiry Date'
                      : 'Calibration Date'}
                  </label>
                  <input
                    type="date"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
                    value={
                      formData.type === 'chemical'
                        ? formData.expiryDate
                        : formData.calibrationDate
                    }
                    onChange={(e) =>
                      formData.type === 'chemical'
                        ? setFormData({ ...formData, expiryDate: e.target.value })
                        : setFormData({
                            ...formData,
                            calibrationDate: e.target.value
                          })
                    }
                  />
                </div>
                <div className="sm:col-span-3">
                  <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">
                    Technical Description *
                  </label>
                  <textarea
                    rows={2}
                    required
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => setShowItemModal(false)}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-sm"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-blue-600 text-white rounded-lg text-sm font-semibold hover:bg-blue-700 flex items-center"
                >
                  <CheckCircleIcon className="h-4 w-4 mr-1.5" />
                  {editingItem ? 'Update Item' : 'Save New Item'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
