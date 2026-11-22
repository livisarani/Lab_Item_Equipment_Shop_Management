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
    <div className="space-y-8">
      <div>
        <span className="text-xs font-bold uppercase tracking-widest text-[#27c2d2]">
          Real-Time Vault Matrix
        </span>
        <h1 className="sp-type-headline-lg text-3xl sm:text-[46px] text-white mt-1">
          Item Availability & Technical Directory
        </h1>
        <p className="text-sm text-[#b0b0b0] mt-1">
          Inspect real-time stock quantities, warehouse storage zones, batch/lot numbers, and CAS/calibration specifications
        </p>
      </div>

      <div className="sp-card-dark p-6 sm:p-8">
        <div className="flex flex-wrap gap-4 mb-6">
          <div className="relative flex-grow max-w-md">
            <input
              type="text"
              placeholder="Search by item name, SKU, category, or CAS #..."
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
            <option value="chemical">Laboratory Chemicals</option>
            <option value="equipment">Precision Equipment</option>
          </select>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map((item) => {
            const isLow = item.stock <= item.lowStockThreshold;
            return (
              <div
                key={item.id}
                className="bg-[#131313] border border-[#212121] rounded-[28px] p-5 hover:border-[#0e97b0] transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center">
                      {item.image ? (
                        <img
                          src={item.image}
                          alt={item.name}
                          className="h-14 w-14 rounded-full object-cover mr-3.5 border border-[#212121]"
                        />
                      ) : (
                        <div className="h-14 w-14 rounded-full bg-[#090909] flex items-center justify-center mr-3.5">
                          <PackageIcon className="h-6 w-6 text-[#27c2d2]" />
                        </div>
                      )}
                      <div>
                        <span className="text-[11px] font-bold text-[#27c2d2] uppercase tracking-wider">
                          {item.sku}
                        </span>
                        <h3 className="font-bold text-white leading-snug font-display">
                          {item.name}
                        </h3>
                        <p className="text-xs text-[#b0b0b0]">
                          {item.category} • {item.manufacturer}
                        </p>
                      </div>
                    </div>
                  </div>

                  <p className="text-xs text-[#b0b0b0] mb-4 line-clamp-2">
                    {item.description}
                  </p>

                  <div className="bg-[#090909] rounded-[18px] p-3.5 space-y-1.5 text-xs mb-4 border border-[#212121]">
                    <div className="flex justify-between">
                      <span className="text-[#b0b0b0] flex items-center">
                        <MapPinIcon className="h-3.5 w-3.5 mr-1 text-[#27c2d2]" />
                        Location:
                      </span>
                      <span className="font-semibold text-white">
                        {item.storageLocation}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#b0b0b0]">Batch / Serial:</span>
                      <span className="font-mono text-[#27c2d2]">
                        {item.batchNumber}
                      </span>
                    </div>
                    {item.type === 'chemical' ? (
                      <>
                        <div className="flex justify-between">
                          <span className="text-[#b0b0b0]">CAS / Purity:</span>
                          <span className="font-semibold text-white">
                            {item.casNumber} ({item.purityGrade})
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-[#b0b0b0] flex items-center">
                            <CalendarIcon className="h-3.5 w-3.5 mr-1 text-[#27c2d2]" />
                            Expiry Date:
                          </span>
                          <span className="font-semibold text-white">
                            {item.expiryDate || 'N/A'}
                          </span>
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="flex justify-between">
                          <span className="text-[#b0b0b0]">Model / Warranty:</span>
                          <span className="font-semibold text-white">
                            {item.modelNumber} ({item.warrantyMonths}m)
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-[#b0b0b0]">Last Calibration:</span>
                          <span className="font-semibold text-white">
                            {item.calibrationDate || 'Factory Certified'}
                          </span>
                        </div>
                      </>
                    )}
                    {item.hazardLevel && item.hazardLevel !== 'None' && (
                      <div className="flex justify-between items-center pt-1">
                        <span className="text-[#b0b0b0] flex items-center">
                          <ShieldAlertIcon className="h-3.5 w-3.5 mr-1 text-[#aa4266]" />
                          Hazard Class:
                        </span>
                        <span className="px-2.5 py-0.5 rounded-[10px] bg-[#aa4266] text-white font-bold text-[11px]">
                          {item.hazardLevel}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="border-t border-[#212121] pt-3 flex items-center justify-between">
                  <div>
                    <span className="text-xs text-[#b0b0b0] block">Unit Price</span>
                    <span className="text-lg font-bold text-white">
                      ${item.price.toFixed(2)}
                    </span>
                    <span className="text-xs text-[#b0b0b0]"> / {item.unit}</span>
                  </div>
                  <div className="text-right">
                    <span
                      className={`px-3 py-1 text-xs font-bold rounded-full ${
                        !isLow
                          ? 'bg-[#0f9b40]/30 text-[#4dfd88]'
                          : 'bg-[#aa4266] text-white'
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
