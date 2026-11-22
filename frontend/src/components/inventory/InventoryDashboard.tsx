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
    image:
      'https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?auto=format&fit=crop&q=80&w=400&h=300'
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
      image:
        'https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?auto=format&fit=crop&q=80&w=400&h=300'
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
    <div className="space-y-8">
      <div className="flex flex-wrap justify-between items-end gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-widest text-[#27c2d2]">
            Chemical Vault & Metrology Storage
          </span>
          <h1 className="sp-type-headline-lg text-3xl sm:text-[46px] text-white mt-1">
            Inventory & Batch Management
          </h1>
          <p className="text-sm text-[#b0b0b0] mt-1">
            Monitor chemical vault lots, equipment calibration statuses, expiry alerts, and safety thresholds
          </p>
        </div>
        <button
          onClick={openAddModal}
          className="sp-btn-primary h-[50px] px-7 text-sm"
        >
          <PlusIcon className="h-4 w-4 mr-1.5" /> Add New Item / Batch
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="sp-card-dark p-6">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-xs uppercase tracking-wider text-[#b0b0b0]">
                Total Catalog SKUs
              </p>
              <p className="text-3xl font-bold text-white mt-1 font-display">
                {items.length}
              </p>
            </div>
            <div className="h-14 w-14 rounded-full bg-[#27c2d2] text-black flex items-center justify-center shadow-lg">
              <PackageIcon className="h-6 w-6" />
            </div>
          </div>
          <div className="flex mt-3 text-xs text-[#b0b0b0] space-x-4">
            <div>
              <span className="font-bold text-[#27c2d2]">
                {items.filter((i) => i.type === 'chemical').length}
              </span>{' '}
              Chemicals
            </div>
            <div>
              <span className="font-bold text-[#4dfd88]">
                {items.filter((i) => i.type === 'equipment').length}
              </span>{' '}
              Equipment
            </div>
          </div>
        </div>

        <div className="sp-card-dark p-6">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-xs uppercase tracking-wider text-[#b0b0b0]">
                Low Stock Items
              </p>
              <p className="text-3xl font-bold text-[#27c2d2] mt-1 font-display">
                {lowStockItems.length}
              </p>
            </div>
            <div className="h-14 w-14 rounded-full bg-[#0e97b0] text-white flex items-center justify-center shadow-lg">
              <AlertCircleIcon className="h-6 w-6" />
            </div>
          </div>
          <p className="text-xs text-[#b0b0b0] mt-3">
            Items at or below minimum threshold
          </p>
        </div>

        <div className="sp-card-crimson p-6 shadow-xl">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-xs uppercase tracking-wider text-white/80">
                Expired Chemical Lots
              </p>
              <p className="text-3xl font-bold text-white mt-1 font-display">
                {expiredItems.length}
              </p>
            </div>
            <div className="h-14 w-14 rounded-full bg-black/30 text-white flex items-center justify-center">
              <CalendarIcon className="h-6 w-6" />
            </div>
          </div>
          <p className="text-xs text-white/90 mt-3 font-medium">
            Lots requiring quarantine or disposal
          </p>
        </div>
      </div>

      {/* Inventory Table */}
      <div className="sp-card-dark p-6 sm:p-8">
        <div className="flex flex-wrap gap-4 mb-6">
          <div className="relative flex-grow max-w-md">
            <input
              type="text"
              placeholder="Search by item name, SKU, or batch lot..."
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
            <option value="all">All Items ({items.length})</option>
            <option value="chemical">Chemicals</option>
            <option value="equipment">Equipment</option>
            <option value="expired">Expired Lots ({expiredItems.length})</option>
            <option value="lowstock">Low Stock ({lowStockItems.length})</option>
          </select>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-[#212121] text-sm">
            <thead className="bg-[#131313]">
              <tr>
                <th className="px-4 py-3.5 text-left text-xs font-semibold text-[#b0b0b0] uppercase tracking-wider">
                  Item & SKU
                </th>
                <th className="px-4 py-3.5 text-left text-xs font-semibold text-[#b0b0b0] uppercase tracking-wider">
                  Batch & Location
                </th>
                <th className="px-4 py-3.5 text-left text-xs font-semibold text-[#b0b0b0] uppercase tracking-wider">
                  Spec / Hazard
                </th>
                <th className="px-4 py-3.5 text-left text-xs font-semibold text-[#b0b0b0] uppercase tracking-wider">
                  Price
                </th>
                <th className="px-4 py-3.5 text-left text-xs font-semibold text-[#b0b0b0] uppercase tracking-wider">
                  Stock Level
                </th>
                <th className="px-4 py-3.5 text-left text-xs font-semibold text-[#b0b0b0] uppercase tracking-wider">
                  Status
                </th>
                <th className="px-4 py-3.5 text-left text-xs font-semibold text-[#b0b0b0] uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#212121]">
              {filteredItems.map((item) => {
                const isExpired =
                  item.expiryDate && new Date(item.expiryDate) < today;
                const isLowStock = item.stock <= item.lowStockThreshold;
                return (
                  <tr key={item.id} className="hover:bg-[#131313]">
                    <td className="px-4 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="h-11 w-11 flex-shrink-0 mr-3.5">
                          {item.image ? (
                            <img
                              src={item.image}
                              alt={item.name}
                              className="h-11 w-11 rounded-full object-cover border border-[#212121]"
                            />
                          ) : (
                            <div className="h-11 w-11 rounded-full bg-[#131313] flex items-center justify-center">
                              <PackageIcon className="h-5 w-5 text-[#27c2d2]" />
                            </div>
                          )}
                        </div>
                        <div>
                          <div className="font-bold text-white">{item.name}</div>
                          <div className="text-xs text-[#27c2d2] font-semibold">
                            {item.sku} • {item.category}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-xs">
                      <div className="font-mono font-bold text-white">
                        {item.batchNumber}
                      </div>
                      <div className="text-[#b0b0b0]">{item.storageLocation}</div>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-xs">
                      <div className="text-white">
                        {item.type === 'chemical'
                          ? `CAS: ${item.casNumber || 'N/A'}`
                          : `Model: ${item.modelNumber || 'N/A'}`}
                      </div>
                      <div className="text-[#b0b0b0]">
                        Hazard: {item.hazardLevel || 'None'}
                      </div>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap font-bold text-white">
                      ${item.price.toFixed(2)}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <div
                        className={
                          isLowStock
                            ? 'text-[#aa4266] font-bold'
                            : 'font-bold text-white'
                        }
                      >
                        {item.stock} {item.unit}
                      </div>
                      <div className="text-xs text-[#b0b0b0]">
                        Min: {item.lowStockThreshold} {item.unit}
                      </div>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      {isExpired ? (
                        <span className="px-3 py-1 inline-flex text-xs font-bold rounded-full bg-[#aa4266] text-white">
                          Expired ({item.expiryDate})
                        </span>
                      ) : isLowStock ? (
                        <span className="px-3 py-1 inline-flex text-xs font-bold rounded-full bg-[#aa4266]/40 border border-[#aa4266] text-[#ff8da8]">
                          Low Stock
                        </span>
                      ) : (
                        <span className="px-3 py-1 inline-flex text-xs font-bold rounded-full bg-[#0f9b40]/30 text-[#4dfd88]">
                          In Stock
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm space-x-2.5">
                      <button
                        onClick={() => restockItem(item.id, 10)}
                        className="text-white hover:bg-[#27b064] font-bold text-xs bg-[#0f9b40] px-2.5 py-1 rounded-full inline-flex items-center transition-colors"
                        title="Quick Restock +10 units"
                      >
                        <RefreshCwIcon className="h-3 w-3 mr-1" /> +10
                      </button>
                      <button
                        onClick={() => openEditModal(item)}
                        className="text-[#27c2d2] hover:underline font-semibold text-xs"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => deleteItem(item.id)}
                        className="text-[#aa4266] hover:underline font-semibold text-xs"
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
                    className="px-4 py-8 text-center text-[#b0b0b0]"
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
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-[#090909] border border-[#212121] rounded-[32px] shadow-2xl max-w-2xl w-full overflow-hidden text-white">
            <div className="flex justify-between items-center p-6 border-b border-[#212121] bg-[#131313]">
              <h2 className="text-lg font-bold text-white font-display">
                {editingItem
                  ? `Edit Inventory Item (${editingItem.sku})`
                  : 'Add New Laboratory Item'}
              </h2>
              <button
                onClick={() => setShowItemModal(false)}
                className="text-[#b0b0b0] hover:text-white"
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
                  <label className="block text-xs font-semibold text-[#b0b0b0] uppercase mb-1">
                    SKU Code *
                  </label>
                  <input
                    type="text"
                    required
                    className="w-full bg-[#000000] border border-[#2d2d2d] text-white px-3 py-2 text-sm rounded-none"
                    value={formData.sku}
                    onChange={(e) =>
                      setFormData({ ...formData, sku: e.target.value })
                    }
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-[#b0b0b0] uppercase mb-1">
                    Item Name *
                  </label>
                  <input
                    type="text"
                    required
                    className="w-full bg-[#000000] border border-[#2d2d2d] text-white px-3 py-2 text-sm rounded-none"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#b0b0b0] uppercase mb-1">
                    Item Type
                  </label>
                  <select
                    className="w-full bg-[#000000] border border-[#2d2d2d] text-white px-3 py-2 text-sm rounded-none"
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
                  <label className="block text-xs font-semibold text-[#b0b0b0] uppercase mb-1">
                    Category
                  </label>
                  <input
                    type="text"
                    className="w-full bg-[#000000] border border-[#2d2d2d] text-white px-3 py-2 text-sm rounded-none"
                    value={formData.category}
                    onChange={(e) =>
                      setFormData({ ...formData, category: e.target.value })
                    }
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#b0b0b0] uppercase mb-1">
                    Manufacturer
                  </label>
                  <input
                    type="text"
                    className="w-full bg-[#000000] border border-[#2d2d2d] text-white px-3 py-2 text-sm rounded-none"
                    value={formData.manufacturer}
                    onChange={(e) =>
                      setFormData({ ...formData, manufacturer: e.target.value })
                    }
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#b0b0b0] uppercase mb-1">
                    Unit Price ($) *
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    className="w-full bg-[#000000] border border-[#2d2d2d] text-white px-3 py-2 text-sm rounded-none"
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
                  <label className="block text-xs font-semibold text-[#b0b0b0] uppercase mb-1">
                    Current Stock *
                  </label>
                  <input
                    type="number"
                    required
                    className="w-full bg-[#000000] border border-[#2d2d2d] text-white px-3 py-2 text-sm rounded-none"
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
                  <label className="block text-xs font-semibold text-[#b0b0b0] uppercase mb-1">
                    Unit (liter, kg, piece)
                  </label>
                  <input
                    type="text"
                    className="w-full bg-[#000000] border border-[#2d2d2d] text-white px-3 py-2 text-sm rounded-none"
                    value={formData.unit}
                    onChange={(e) =>
                      setFormData({ ...formData, unit: e.target.value })
                    }
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#b0b0b0] uppercase mb-1">
                    Low Stock Threshold
                  </label>
                  <input
                    type="number"
                    className="w-full bg-[#000000] border border-[#2d2d2d] text-white px-3 py-2 text-sm rounded-none"
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
                  <label className="block text-xs font-semibold text-[#b0b0b0] uppercase mb-1">
                    Batch / Serial Number
                  </label>
                  <input
                    type="text"
                    className="w-full bg-[#000000] border border-[#2d2d2d] text-white px-3 py-2 text-sm rounded-none"
                    value={formData.batchNumber}
                    onChange={(e) =>
                      setFormData({ ...formData, batchNumber: e.target.value })
                    }
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#b0b0b0] uppercase mb-1">
                    Warehouse Location
                  </label>
                  <input
                    type="text"
                    className="w-full bg-[#000000] border border-[#2d2d2d] text-white px-3 py-2 text-sm rounded-none"
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
                  <label className="block text-xs font-semibold text-[#b0b0b0] uppercase mb-1">
                    Hazard Level
                  </label>
                  <select
                    className="w-full bg-[#000000] border border-[#2d2d2d] text-white px-3 py-2 text-sm rounded-none"
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
                  <label className="block text-xs font-semibold text-[#b0b0b0] uppercase mb-1">
                    {formData.type === 'chemical' ? 'CAS Number' : 'Model Number'}
                  </label>
                  <input
                    type="text"
                    className="w-full bg-[#000000] border border-[#2d2d2d] text-white px-3 py-2 text-sm rounded-none"
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
                  <label className="block text-xs font-semibold text-[#b0b0b0] uppercase mb-1">
                    {formData.type === 'chemical'
                      ? 'Expiry Date'
                      : 'Calibration Date'}
                  </label>
                  <input
                    type="date"
                    className="w-full bg-[#000000] border border-[#2d2d2d] text-white px-3 py-2 text-sm rounded-none"
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
                  <label className="block text-xs font-semibold text-[#b0b0b0] uppercase mb-1">
                    Technical Description *
                  </label>
                  <textarea
                    rows={2}
                    required
                    className="w-full bg-[#000000] border border-[#2d2d2d] text-white px-3 py-2 text-sm rounded-none"
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-[#212121]">
                <button
                  type="button"
                  onClick={() => setShowItemModal(false)}
                  className="sp-btn-outline px-5 py-2 text-sm"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="sp-btn-primary px-6 py-2 text-sm"
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
