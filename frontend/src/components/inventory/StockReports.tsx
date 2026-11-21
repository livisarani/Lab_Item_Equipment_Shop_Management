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
    <div>
      <div className="flex flex-wrap justify-between items-center mb-6 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Stock Valuation & Compliance Reports
          </h1>
          <p className="text-sm text-gray-500">
            Analyze total warehouse valuation, replenish low-stock items, and export audit-ready CSV sheets
          </p>
        </div>
        <button
          onClick={exportInventoryCSV}
          className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg flex items-center text-sm font-medium"
        >
          <DownloadIcon className="h-4 w-4 mr-1.5" /> Export Stock CSV
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <p className="text-sm text-gray-500">Total Warehouse Asset Value</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">
            ${totalValue.toFixed(2)}
          </p>
          <p className="text-xs text-gray-500 mt-2">
            Across {items.reduce((s, i) => s + i.stock, 0)} total units in storage
          </p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Low Stock Alerts</p>
              <p className="text-2xl font-bold text-amber-600">
                {lowStockItems.length}
              </p>
            </div>
            <div className="p-3 bg-amber-100 rounded-full">
              <TrendingDownIcon className="h-6 w-6 text-amber-600" />
            </div>
          </div>
          <p className="text-xs text-gray-500 mt-2">Require supplier purchase orders</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Expired Chemical Batches</p>
              <p className="text-2xl font-bold text-red-600">
                {expiredItems.length}
              </p>
            </div>
            <div className="p-3 bg-red-100 rounded-full">
              <AlertCircleIcon className="h-6 w-6 text-red-600" />
            </div>
          </div>
          <p className="text-xs text-gray-500 mt-2">Flagged for hazmat disposal</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h2 className="text-lg font-semibold mb-4">
            Low Stock Replenishment Queue
          </h2>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 text-sm">
              <thead>
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Item & SKU
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Current
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Threshold
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Quick Action
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {lowStockItems.map((item) => (
                  <tr key={item.id}>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <div className="font-medium text-gray-900">{item.name}</div>
                      <div className="text-xs text-gray-500">{item.sku}</div>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-red-600 font-bold">
                      {item.stock} {item.unit}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-gray-600">
                      {item.lowStockThreshold} {item.unit}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <button
                        onClick={() => restockItem(item.id, 15)}
                        className="text-xs bg-blue-600 hover:bg-blue-700 text-white px-2.5 py-1 rounded flex items-center"
                      >
                        <RefreshCwIcon className="h-3 w-3 mr-1" /> Restock +15
                      </button>
                    </td>
                  </tr>
                ))}
                {lowStockItems.length === 0 && (
                  <tr>
                    <td colSpan={4} className="px-4 py-6 text-center text-gray-500">
                      No low stock items — all inventory thresholds satisfied!
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h2 className="text-lg font-semibold mb-4">
            Inventory Breakdown by Category
          </h2>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-sm font-medium">
                  Chemicals, Acids, Bases & Solvents
                </span>
                <span className="text-sm text-gray-600">
                  {items.filter((i) => i.type === 'chemical').length} SKUs
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div
                  className="bg-blue-600 h-2.5 rounded-full"
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
              <div className="flex justify-between mb-1">
                <span className="text-sm font-medium">
                  Precision Equipment, Optics & Glassware
                </span>
                <span className="text-sm text-gray-600">
                  {items.filter((i) => i.type === 'equipment').length} SKUs
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div
                  className="bg-green-600 h-2.5 rounded-full"
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
