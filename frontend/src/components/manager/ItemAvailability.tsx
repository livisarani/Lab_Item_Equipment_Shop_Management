import React, { useState } from 'react';
import { useAppContext } from '../../context/AppContext';
import {
  SearchIcon,
  PackageIcon,
  MapPinIcon,
  ShieldAlertIcon,
  CalendarIcon
} from 'lucide-react';

export const ItemAvailability: React.FC = () => {
  const { items } = useAppContext();
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('all');

  const filteredItems = items.filter((item) => {
    const matchesSearch =
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (item.casNumber || '').toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filter === 'all' || item.type === filter;
    return matchesSearch && matchesFilter;
  });

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">
          Item Availability & Technical Directory
        </h1>
        <p className="text-sm text-gray-500">
          Inspect real-time stock quantities, warehouse storage zones, batch/lot numbers, and CAS/calibration specifications
        </p>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <div className="flex flex-wrap gap-4 mb-6">
          <div className="relative flex-grow max-w-md">
            <input
              type="text"
              placeholder="Search by item name, SKU, category, or CAS #..."
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
            <option value="chemical">Laboratory Chemicals</option>
            <option value="equipment">Precision Equipment</option>
          </select>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredItems.map((item) => {
            const isLow = item.stock <= item.lowStockThreshold;
            return (
              <div
                key={item.id}
                className="border border-gray-200 rounded-xl p-4 hover:shadow-md transition-shadow flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center">
                      {item.image ? (
                        <img
                          src={item.image}
                          alt={item.name}
                          className="h-14 w-14 rounded-lg object-cover mr-3 border border-gray-200"
                        />
                      ) : (
                        <div className="h-14 w-14 rounded-lg bg-gray-100 flex items-center justify-center mr-3">
                          <PackageIcon className="h-6 w-6 text-gray-500" />
                        </div>
                      )}
                      <div>
                        <span className="text-[11px] font-bold text-blue-600 uppercase tracking-wider">
                          {item.sku}
                        </span>
                        <h3 className="font-semibold text-gray-900 leading-snug">
                          {item.name}
                        </h3>
                        <p className="text-xs text-gray-500">
                          {item.category} • {item.manufacturer}
                        </p>
                      </div>
                    </div>
                  </div>

                  <p className="text-xs text-gray-600 mb-3 line-clamp-2">
                    {item.description}
                  </p>

                  <div className="bg-gray-50 rounded-lg p-3 space-y-1.5 text-xs mb-3 border border-gray-100">
                    <div className="flex justify-between">
                      <span className="text-gray-500 flex items-center">
                        <MapPinIcon className="h-3.5 w-3.5 mr-1 text-gray-400" />
                        Location:
                      </span>
                      <span className="font-medium text-gray-800">
                        {item.storageLocation}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Batch / Serial:</span>
                      <span className="font-mono text-gray-800">{item.batchNumber}</span>
                    </div>
                    {item.type === 'chemical' ? (
                      <>
                        <div className="flex justify-between">
                          <span className="text-gray-500">CAS / Purity:</span>
                          <span className="font-medium text-gray-800">
                            {item.casNumber} ({item.purityGrade})
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-500 flex items-center">
                            <CalendarIcon className="h-3.5 w-3.5 mr-1 text-gray-400" />
                            Expiry Date:
                          </span>
                          <span className="font-medium text-gray-800">
                            {item.expiryDate || 'N/A'}
                          </span>
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="flex justify-between">
                          <span className="text-gray-500">Model / Warranty:</span>
                          <span className="font-medium text-gray-800">
                            {item.modelNumber} ({item.warrantyMonths}m)
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-500">Last Calibration:</span>
                          <span className="font-medium text-gray-800">
                            {item.calibrationDate || 'Factory Certified'}
                          </span>
                        </div>
                      </>
                    )}
                    {item.hazardLevel && item.hazardLevel !== 'None' && (
                      <div className="flex justify-between items-center pt-1">
                        <span className="text-gray-500 flex items-center">
                          <ShieldAlertIcon className="h-3.5 w-3.5 mr-1 text-amber-500" />
                          Hazard Class:
                        </span>
                        <span className="px-2 py-0.5 rounded bg-amber-100 text-amber-800 font-semibold text-[11px]">
                          {item.hazardLevel}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="border-t border-gray-100 pt-3 flex items-center justify-between">
                  <div>
                    <span className="text-xs text-gray-500 block">Unit Price</span>
                    <span className="text-lg font-bold text-gray-900">
                      ${item.price.toFixed(2)}
                    </span>
                    <span className="text-xs text-gray-500"> / {item.unit}</span>
                  </div>
                  <div className="text-right">
                    <span
                      className={`px-2.5 py-1 text-xs font-semibold rounded-full ${
                        !isLow
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {item.stock} {item.unit}s ({!isLow ? 'Available' : 'Low Stock'})
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
