import React, { useState } from 'react';
import { useAppContext } from '../../context/AppContext';
import { SaveIcon, SettingsIcon, CheckCircleIcon, ShieldIcon } from 'lucide-react';

export const SystemConfiguration: React.FC = () => {
  const { systemConfig, updateSystemConfig } = useAppContext();
  const [config, setConfig] = useState(systemConfig);
  const [savedBanner, setSavedBanner] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateSystemConfig(config);
    setSavedBanner(true);
    setTimeout(() => setSavedBanner(false), 3000);
  };

  return (
    <div>
      <div className="flex flex-wrap justify-between items-center mb-6 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">System Configuration</h1>
          <p className="text-sm text-gray-500">
            Configure laboratory compliance rules, tax rates, shipping fees, and notification preferences
          </p>
        </div>
        <button
          onClick={handleSave}
          className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg flex items-center font-medium shadow-sm"
        >
          <SaveIcon className="h-4 w-4 mr-1.5" /> Save Configuration
        </button>
      </div>

      {savedBanner && (
        <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center text-green-800 text-sm font-medium">
          <CheckCircleIcon className="h-5 w-5 mr-2 text-green-600" />
          System configuration saved and applied across all role portals!
        </div>
      )}

      <form onSubmit={handleSave} className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h2 className="text-lg font-semibold mb-4 flex items-center">
            <SettingsIcon className="h-5 w-5 mr-2 text-blue-600" />
            General & Financial Settings
          </h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Organization / Portal Title
              </label>
              <input
                type="text"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
                value={config.siteName}
                onChange={(e) =>
                  setConfig({ ...config, siteName: e.target.value })
                }
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Operations Email
                </label>
                <input
                  type="email"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
                  value={config.companyEmail}
                  onChange={(e) =>
                    setConfig({ ...config, companyEmail: e.target.value })
                  }
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Support Hotline
                </label>
                <input
                  type="text"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
                  value={config.companyPhone}
                  onChange={(e) =>
                    setConfig({ ...config, companyPhone: e.target.value })
                  }
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Headquarters & Warehouse Address
              </label>
              <input
                type="text"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
                value={config.companyAddress}
                onChange={(e) =>
                  setConfig({ ...config, companyAddress: e.target.value })
                }
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Default Low Stock Threshold
                </label>
                <input
                  type="number"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
                  value={config.lowStockThreshold}
                  onChange={(e) =>
                    setConfig({
                      ...config,
                      lowStockThreshold: parseInt(e.target.value) || 0
                    })
                  }
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Maximum Order Limit ($)
                </label>
                <input
                  type="number"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
                  value={config.maxOrderAmount}
                  onChange={(e) =>
                    setConfig({
                      ...config,
                      maxOrderAmount: parseInt(e.target.value) || 0
                    })
                  }
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tax Rate (%)
                </label>
                <input
                  type="number"
                  step="0.1"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
                  value={config.taxRate}
                  onChange={(e) =>
                    setConfig({
                      ...config,
                      taxRate: parseFloat(e.target.value) || 0
                    })
                  }
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Hazmat / Standard Shipping Fee ($)
                </label>
                <input
                  type="number"
                  step="0.5"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
                  value={config.standardShippingFee}
                  onChange={(e) =>
                    setConfig({
                      ...config,
                      standardShippingFee: parseFloat(e.target.value) || 0
                    })
                  }
                />
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h2 className="text-lg font-semibold mb-4 flex items-center">
            <ShieldIcon className="h-5 w-5 mr-2 text-blue-600" />
            Compliance & Operational Controls
          </h2>
          <div className="space-y-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-sm">Email Notifications</p>
                <p className="text-xs text-gray-500">
                  Send automated email alerts for low stock, orders, and CoA expiry
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  className="sr-only peer"
                  checked={config.emailNotifications}
                  onChange={(e) =>
                    setConfig({ ...config, emailNotifications: e.target.checked })
                  }
                />
                <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-sm">SMS Fleet & Hazmat Dispatch Alerts</p>
                <p className="text-xs text-gray-500">
                  Notify delivery drivers and customers via SMS on cold-chain dispatches
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  className="sr-only peer"
                  checked={config.smsNotifications}
                  onChange={(e) =>
                    setConfig({ ...config, smsNotifications: e.target.checked })
                  }
                />
                <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-sm">Require Hazmat & BSL Clearance Approval</p>
                <p className="text-xs text-gray-500">
                  Enforce Biosafety & OSHA verification on Corrosive, Oxidizer, and Flammable items
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  className="sr-only peer"
                  checked={config.requireHazmatApproval}
                  onChange={(e) =>
                    setConfig({ ...config, requireHazmatApproval: e.target.checked })
                  }
                />
                <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-sm">Automated Daily Cloud & SDS Backup</p>
                <p className="text-xs text-gray-500">
                  Daily encrypted snapshots of chemical batch records and invoices
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  className="sr-only peer"
                  checked={config.autoBackup}
                  onChange={(e) =>
                    setConfig({ ...config, autoBackup: e.target.checked })
                  }
                />
                <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-gray-100">
              <div>
                <p className="font-medium text-sm text-amber-800">Maintenance Mode</p>
                <p className="text-xs text-gray-500">
                  Display maintenance banner and restrict external customer checkouts
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  className="sr-only peer"
                  checked={config.maintenanceMode}
                  onChange={(e) =>
                    setConfig({ ...config, maintenanceMode: e.target.checked })
                  }
                />
                <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-amber-600"></div>
              </label>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};
