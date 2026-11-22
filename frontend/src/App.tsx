import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate, Link } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import { Header } from './components/common/Header';
import { Sidebar } from './components/common/Sidebar';
import { RoleSwitcher } from './components/common/RoleSwitcher';
// Admin Pages
import { AdminDashboard } from './components/admin/AdminDashboard';
import { UserManagement } from './components/admin/UserManagement';
import { SystemConfiguration } from './components/admin/SystemConfiguration';
import { AuditTrails } from './components/admin/AuditTrails';
// Manager Pages
import { ManagerDashboard } from './components/manager/ManagerDashboard';
import { ItemAvailability } from './components/manager/ItemAvailability';
import { ManagerOrders } from './components/manager/ManagerOrders';
import { Invoices } from './components/manager/Invoices';
import { Reports } from './components/manager/Reports';
import { Messages } from './components/manager/Messages';
// Customer Pages
import { CustomerDashboard } from './components/customer/CustomerDashboard';
import { Shop } from './components/customer/Shop';
import { MyOrders } from './components/customer/MyOrders';
import { Support } from './components/customer/Support';
// Inventory Pages
import { InventoryDashboard } from './components/inventory/InventoryDashboard';
import { InventoryManagement } from './components/inventory/InventoryManagement';
import { StockReports } from './components/inventory/StockReports';
// Delivery Pages
import { DeliveryDashboard } from './components/delivery/DeliveryDashboard';
import { Deliveries } from './components/delivery/Deliveries';
import { DeliveryReports } from './components/delivery/DeliveryReports';

export function App() {
  const [currentRole, setCurrentRole] = useState('customer');

  return (
    <AppProvider currentRole={currentRole} setCurrentRole={setCurrentRole}>
      <BrowserRouter>
        <div className="min-h-screen flex flex-col bg-[#000000] text-white">
          <Header currentRole={currentRole} />
          <div className="flex flex-1">
            <Sidebar currentRole={currentRole} />
            <main className="flex-1 overflow-y-auto sp-ambient-glow">
              <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <RoleSwitcher
                  currentRole={currentRole}
                  setCurrentRole={setCurrentRole}
                />

                <div>
                  <Routes>
                    {/* Admin Routes */}
                    <Route path="/admin" element={<AdminDashboard />} />
                    <Route path="/admin/users" element={<UserManagement />} />
                    <Route path="/admin/config" element={<SystemConfiguration />} />
                    <Route path="/admin/audit" element={<AuditTrails />} />

                    {/* Manager Routes */}
                    <Route path="/manager" element={<ManagerDashboard />} />
                    <Route path="/manager/items" element={<ItemAvailability />} />
                    <Route path="/manager/orders" element={<ManagerOrders />} />
                    <Route path="/manager/invoices" element={<Invoices />} />
                    <Route path="/manager/reports" element={<Reports />} />
                    <Route path="/manager/messages" element={<Messages />} />

                    {/* Customer Routes */}
                    <Route path="/customer" element={<CustomerDashboard />} />
                    <Route path="/customer/shop" element={<Shop />} />
                    <Route path="/customer/orders" element={<MyOrders />} />
                    <Route path="/customer/support" element={<Support />} />

                    {/* Inventory Routes */}
                    <Route path="/inventory" element={<InventoryDashboard />} />
                    <Route path="/inventory/manage" element={<InventoryManagement />} />
                    <Route path="/inventory/reports" element={<StockReports />} />

                    {/* Delivery Routes */}
                    <Route path="/delivery" element={<DeliveryDashboard />} />
                    <Route path="/delivery/manage" element={<Deliveries />} />
                    <Route path="/delivery/reports" element={<DeliveryReports />} />

                    {/* Default redirect based on role */}
                    <Route
                      path="/"
                      element={<Navigate to={`/${currentRole}`} replace />}
                    />
                    <Route
                      path="*"
                      element={<Navigate to={`/${currentRole}`} replace />}
                    />
                  </Routes>
                </div>
              </div>

              {/* Extracted myscanstation.com Gradient Footer (.footer recipe) */}
              <footer className="sp-footer-gradient text-white mt-16 py-12 px-6 border-t border-[#212121]">
                <div className="max-w-[1280px] mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
                  <div>
                    <div className="flex items-center space-x-2.5">
                      <span className="text-2xl font-light tracking-tight">
                        LISM<span className="font-bold">Station</span>
                      </span>
                      <span className="text-xs uppercase tracking-widest bg-black/30 px-2.5 py-0.5 rounded-full">
                        interscience
                      </span>
                    </div>
                    <p className="text-sm text-white/90 mt-3 max-w-sm leading-relaxed">
                      More than 45 years of microbiology, analytical reagent & precision laboratory equipment expertise. Real-time GMP Annex 1 & ISO-9001 compliant supply chain.
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm">
                    <Link to="/customer/shop" className="underline hover:text-black transition-colors">
                      Environmental monitoring
                    </Link>
                    <Link to="/manager/items" className="underline hover:text-black transition-colors">
                      Quality control
                    </Link>
                    <Link to="/customer/support" className="underline hover:text-black transition-colors">
                      R&D & SDS Documentation
                    </Link>
                    <Link to="/admin/audit" className="underline hover:text-black transition-colors">
                      General terms and conditions of sale
                    </Link>
                    <Link to="/admin/config" className="underline hover:text-black transition-colors">
                      Legal info & FDA 21 CFR Part 11
                    </Link>
                  </div>

                  <div className="flex md:justify-end items-center space-x-4">
                    <span className="text-xs text-white/80">
                      © 2026 LISM Interscience Lab Systems
                    </span>
                  </div>
                </div>
              </footer>
            </main>
          </div>
        </div>
      </BrowserRouter>
    </AppProvider>
  );
}
