import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
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
        <div className="flex flex-col h-screen bg-gray-50">
          <Header currentRole={currentRole} />
          <div className="flex flex-1 overflow-hidden">
            <Sidebar currentRole={currentRole} />
            <main className="flex-1 overflow-y-auto p-4 md:p-6">
              <RoleSwitcher
                currentRole={currentRole}
                setCurrentRole={setCurrentRole}
              />

              <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-100">
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
            </main>
          </div>
        </div>
      </BrowserRouter>
    </AppProvider>
  );
}
