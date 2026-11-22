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
    <div className="space-y-8">
      <div className="flex flex-wrap justify-between items-end gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-widest text-[#27c2d2]">
            Platform Parameters
          </span>
          <h1 className="sp-type-headline-lg text-3xl sm:text-[46px] text-white mt-1">
            System Configuration
          </h1>
          <p className="text-sm text-[#b0b0b0] mt-1">
            Configure GMP Annex 1 laboratory compliance rules, tax rates, shipping fees, and notification preferences
          </p>
        </div>
        <button
          onClick={handleSave}
          className="sp-btn-primary h-[50px] px-7 text-sm"
        >
          <SaveIcon className="h-4 w-4 mr-1.5" /> Save Configuration
        </button>
      </div>

      {savedBanner && (
        <div className="p-4 bg-[#0f9b40]/20 border border-[#0f9b40] rounded-[20px] flex items-center text-white text-sm font-medium">
          <CheckCircleIcon className="h-5 w-5 mr-2.5 text-[#4dfd88]" />
          System configuration saved and applied across all role portals!
        </div>
      )}

      <form onSubmit={handleSave} className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="sp-card-dark p-6 sm:p-8">
          <h2 className="text-xl font-bold text-white mb-6 flex items-center font-display">
            <SettingsIcon className="h-5 w-5 mr-2.5 text-[#27c2d2]" />
            General & Financial Settings
          </h2>
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-[#b0b0b0] uppercase mb-1">
                Organization / Portal Title
              </label>
              <input
                type="text"
                className="w-full bg-[#000000] border border-[#2d2d2d] text-white px-3.5 py-2.5 text-sm rounded-none focus:outline-none focus:border-[#0e97b0]"
                value={config.siteName}
                onChange={(e) =>
                  setConfig({ ...config, siteName: e.target.value })
                }
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-[#b0b0b0] uppercase mb-1">
                  Operations Email
                </label>
                <input
                  type="email"
                  className="w-full bg-[#000000] border border-[#2d2d2d] text-white px-3.5 py-2.5 text-sm rounded-none focus:outline-none focus:border-[#0e97b0]"
                  value={config.companyEmail}
                  onChange={(e) =>
                    setConfig({ ...config, companyEmail: e.target.value })
                  }
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#b0b0b0] uppercase mb-1">
                  Support Hotline
                </label>
                <input
                  type="text"
                  className="w-full bg-[#000000] border border-[#2d2d2d] text-white px-3.5 py-2.5 text-sm rounded-none focus:outline-none focus:border-[#0e97b0]"
                  value={config.companyPhone}
                  onChange={(e) =>
                    setConfig({ ...config, companyPhone: e.target.value })
                  }
                />
              </div>
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#b0b0b0] uppercase mb-1">
                Headquarters & Warehouse Address
              </label>
              <input
                type="text"
                className="w-full bg-[#000000] border border-[#2d2d2d] text-white px-3.5 py-2.5 text-sm rounded-none focus:outline-none focus:border-[#0e97b0]"
                value={config.companyAddress}
                onChange={(e) =>
                  setConfig({ ...config, companyAddress: e.target.value })
                }
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-[#b0b0b0] uppercase mb-1">
                  Default Low Stock Threshold
                </label>
                <input
                  type="number"
                  className="w-full bg-[#000000] border border-[#2d2d2d] text-white px-3.5 py-2.5 text-sm rounded-none focus:outline-none focus:border-[#0e97b0]"
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
                <label className="block text-xs font-semibold text-[#b0b0b0] uppercase mb-1">
                  Maximum Order Limit ($)
                </label>
                <input
                  type="number"
                  className="w-full bg-[#000000] border border-[#2d2d2d] text-white px-3.5 py-2.5 text-sm rounded-none focus:outline-none focus:border-[#0e97b0]"
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
                <label className="block text-xs font-semibold text-[#b0b0b0] uppercase mb-1">
                  Tax Rate (%)
                </label>
                <input
                  type="number"
                  step="0.1"
                  className="w-full bg-[#000000] border border-[#2d2d2d] text-white px-3.5 py-2.5 text-sm rounded-none focus:outline-none focus:border-[#0e97b0]"
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
                <label className="block text-xs font-semibold text-[#b0b0b0] uppercase mb-1">
                  Hazmat / Standard Shipping Fee ($)
                </label>
                <input
                  type="number"
                  step="0.5"
                  className="w-full bg-[#000000] border border-[#2d2d2d] text-white px-3.5 py-2.5 text-sm rounded-none focus:outline-none focus:border-[#0e97b0]"
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

        <div className="sp-card-dark p-6 sm:p-8">
          <h2 className="text-xl font-bold text-white mb-6 flex items-center font-display">
            <ShieldIcon className="h-5 w-5 mr-2.5 text-[#27c2d2]" />
            Compliance & Operational Controls
          </h2>
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-bold text-sm text-white">Email Notifications</p>
                <p className="text-xs text-[#b0b0b0]">
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
                <div className="w-11 h-6 bg-[#212121] rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#0e97b0]"></div>
              </label>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="font-bold text-sm text-white">
                  SMS Fleet & Hazmat Dispatch Alerts
                </p>
                <p className="text-xs text-[#b0b0b0]">
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
                <div className="w-11 h-6 bg-[#212121] rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#0e97b0]"></div>
              </label>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="font-bold text-sm text-white">
                  Require Hazmat & BSL Clearance Approval
                </p>
                <p className="text-xs text-[#b0b0b0]">
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
                <div className="w-11 h-6 bg-[#212121] rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#0e97b0]"></div>
              </label>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="font-bold text-sm text-white">
                  Automated Daily Cloud & SDS Backup
                </p>
                <p className="text-xs text-[#b0b0b0]">
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
                <div className="w-11 h-6 bg-[#212121] rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#0e97b0]"></div>
              </label>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-[#212121]">
              <div>
                <p className="font-bold text-sm text-[#aa4266]">Maintenance Mode</p>
                <p className="text-xs text-[#b0b0b0]">
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
                <div className="w-11 h-6 bg-[#212121] rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#aa4266]"></div>
              </label>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};
