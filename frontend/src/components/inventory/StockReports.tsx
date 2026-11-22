import React from 'react';
import { useAppContext } from '../../context/AppContext';
import {
  DownloadIcon,
  TrendingDownIcon,
  AlertCircleIcon,
  RefreshCwIcon
} from 'lucide-react';

export const StockReports: React.FC = () => {
  const { items, restockItem } = useAppContext();
  const today = new Date();
  const lowStockItems = items.filter(
    (item) => item.stock <= item.lowStockThreshold
  );
  const expiredItems = items.filter(
    (item) => item.expiryDate && new Date(item.expiryDate) < today
  );
  const totalValue = items.reduce(
    (sum, item) => sum + item.stock * item.price,
    0
  );

  const exportInventoryCSV = () => {
    const headers = [
      'SKU,Name,Type,Category,BatchNumber,Location,Price,Stock,Unit,Threshold,ExpiryOrCalibration,HazardLevel'
    ];
    const rows = items.map(
      (i) =>
        `"${i.sku}","${i.name}","${i.type}","${i.category}","${i.batchNumber}","${i.storageLocation}","${i.price.toFixed(
          2
        )}","${i.stock}","${i.unit}","${i.lowStockThreshold}","${
          i.expiryDate || i.calibrationDate || ''
        }","${i.hazardLevel || 'None'}"`
    );
    const csv = 'data:text/csv;charset=utf-8,' + [headers, ...rows].join('\n');
    const link = document.createElement('a');
    link.href = encodeURI(csv);
    link.download = `LISM_Stock_Valuation_Report_${new Date()
      .toISOString()
      .slice(0, 10)}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap justify-between items-end gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-widest text-[#27c2d2]">
            Warehouse Asset Telemetry
          </span>
          <h1 className="sp-type-headline-lg text-3xl sm:text-[46px] text-white mt-1">
            Stock Valuation & Compliance Reports
          </h1>
          <p className="text-sm text-[#b0b0b0] mt-1">
            Analyze total warehouse valuation, replenish low-stock items, and export audit-ready CSV sheets
          </p>
        </div>
        <button
          onClick={exportInventoryCSV}
          className="sp-btn-primary h-[50px] px-7 text-sm"
        >
          <DownloadIcon className="h-4 w-4 mr-1.5" /> Export Stock CSV
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="sp-card-dark p-6">
          <p className="text-xs uppercase tracking-wider text-[#b0b0b0]">
            Total Warehouse Asset Value
          </p>
          <p className="text-3xl font-bold text-white mt-1 font-display">
            ${totalValue.toFixed(2)}
          </p>
          <p className="text-xs text-[#b0b0b0] mt-3">
            Across {items.reduce((s, i) => s + i.stock, 0)} total units in storage
          </p>
        </div>

        <div className="sp-card-dark p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs uppercase tracking-wider text-[#b0b0b0]">
                Low Stock Alerts
              </p>
              <p className="text-3xl font-bold text-[#27c2d2] mt-1 font-display">
                {lowStockItems.length}
              </p>
            </div>
            <div className="h-14 w-14 rounded-full bg-[#27c2d2] text-black flex items-center justify-center shadow-lg">
              <TrendingDownIcon className="h-6 w-6" />
            </div>
          </div>
          <p className="text-xs text-[#b0b0b0] mt-3">
            Require supplier purchase orders
          </p>
        </div>

        <div className="sp-card-crimson p-6 shadow-xl">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs uppercase tracking-wider text-white/80">
                Expired Chemical Batches
              </p>
              <p className="text-3xl font-bold text-white mt-1 font-display">
                {expiredItems.length}
              </p>
            </div>
            <div className="h-14 w-14 rounded-full bg-black/30 text-white flex items-center justify-center">
              <AlertCircleIcon className="h-6 w-6" />
            </div>
          </div>
          <p className="text-xs text-white/90 mt-3 font-medium">
            Flagged for hazmat disposal
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="sp-card-dark p-6 sm:p-8">
          <h2 className="text-xl font-bold text-white mb-6 font-display">
            Low Stock Replenishment Queue
          </h2>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-[#212121] text-sm">
              <thead>
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-[#b0b0b0] uppercase">
                    Item & SKU
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-[#b0b0b0] uppercase">
                    Current
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-[#b0b0b0] uppercase">
                    Threshold
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-[#b0b0b0] uppercase">
                    Quick Action
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#212121]">
                {lowStockItems.map((item) => (
                  <tr key={item.id} className="hover:bg-[#131313]">
                    <td className="px-4 py-3.5 whitespace-nowrap">
                      <div className="font-bold text-white">{item.name}</div>
                      <div className="text-xs text-[#27c2d2]">{item.sku}</div>
                    </td>
                    <td className="px-4 py-3.5 whitespace-nowrap text-[#aa4266] font-bold">
                      {item.stock} {item.unit}
                    </td>
                    <td className="px-4 py-3.5 whitespace-nowrap text-[#b0b0b0]">
                      {item.lowStockThreshold} {item.unit}
                    </td>
                    <td className="px-4 py-3.5 whitespace-nowrap">
                      <button
                        onClick={() => restockItem(item.id, 15)}
                        className="sp-btn-primary px-3.5 py-1.5 text-xs"
                      >
                        <RefreshCwIcon className="h-3 w-3 mr-1" /> Restock +15
                      </button>
                    </td>
                  </tr>
                ))}
                {lowStockItems.length === 0 && (
                  <tr>
                    <td colSpan={4} className="px-4 py-6 text-center text-[#b0b0b0]">
                      No low stock items — all inventory thresholds satisfied!
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="sp-card-dark p-6 sm:p-8">
          <h2 className="text-xl font-bold text-white mb-6 font-display">
            Inventory Breakdown by Category
          </h2>
          <div className="space-y-6">
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-sm font-bold text-white">
                  Chemicals, Acids, Bases & Solvents
                </span>
                <span className="text-sm font-bold text-[#27c2d2]">
                  {items.filter((i) => i.type === 'chemical').length} SKUs
                </span>
              </div>
              <div className="w-full bg-[#131313] rounded-full h-3 border border-[#212121]">
                <div
                  className="bg-[#0e97b0] h-full rounded-full"
                  style={{
                    width: `${
                      (items.filter((i) => i.type === 'chemical').length /
                        (items.length || 1)) *
                      100
                    }%`
                  }}
                ></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-sm font-bold text-white">
                  Precision Equipment, Optics & Glassware
                </span>
                <span className="text-sm font-bold text-[#4dfd88]">
                  {items.filter((i) => i.type === 'equipment').length} SKUs
                </span>
              </div>
              <div className="w-full bg-[#131313] rounded-full h-3 border border-[#212121]">
                <div
                  className="bg-[#0f9b40] h-full rounded-full"
                  style={{
                    width: `${
                      (items.filter((i) => i.type === 'equipment').length /
                        (items.length || 1)) *
                      100
                    }%`
                  }}
                ></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
