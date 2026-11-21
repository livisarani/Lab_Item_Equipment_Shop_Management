# LISM — Lab Item & Equipment Shop Management System

A full-stack web application for managing laboratory chemicals, optical & precision equipment, orders, invoices, inventory stock, deliveries, customer support, and system administration across 5 specialized user roles.

## Architecture & Folder Structure

```text
Lab_Item_Equipment_Shop_Management/
├── package.json                      # Root workspace script runner
├── README.md                         # Project documentation
├── backend/                          # Node.js + Express + TypeScript REST API
│   ├── package.json
│   ├── tsconfig.json
│   └── src/
│       ├── server.ts                 # Express server entrypoint
│       ├── types/
│       │   └── index.ts              # Shared TypeScript interfaces
│       ├── data/
│       │   └── seedData.ts           # Rich seed dataset for items, users, orders, logs, tickets, configs
│       └── routes/
│           ├── items.ts              # Inventory & Lab Equipment CRUD endpoints
│           ├── orders.ts             # Order lifecycle & fulfillment endpoints
│           ├── users.ts              # Role & User management endpoints
│           ├── messages.ts           # Support tickets & internal messaging endpoints
│           └── system.ts             # System config, notifications & audit trail endpoints
└── frontend/                         # React + Vite + Tailwind CSS + Lucide Icons
    ├── index.html
    ├── package.json
    ├── postcss.config.js
    ├── tailwind.config.js
    ├── tsconfig.json
    ├── tsconfig.node.json
    ├── vite.config.ts
    └── src/
        ├── index.tsx                 # React 18 root mounting
        ├── index.css                 # Tailwind directives & custom scrollbars
        ├── App.tsx                   # Role-aware router & main application layout
        ├── AppRouter.tsx             # Router wrapper
        ├── context/
        │   └── AppContext.tsx        # Global state management, Cart, CRUD actions & API sync
        ├── data/
        │   └── mockData.ts           # Rich lab items, chemical specs, users, orders, audit logs & messages
        └── components/
            ├── common/
            │   ├── Header.tsx        # Top bar with shop info, active role badge, cart indicator & notification dropdown
            │   ├── Sidebar.tsx       # Dynamic navigation panel per role
            │   ├── RoleSwitcher.tsx  # Instant switcher between Admin, Manager, Customer, Inventory & Delivery views
            │   └── Dashboard.tsx     # Container wrapper component
            ├── admin/
            │   ├── AdminDashboard.tsx      # System-wide KPIs, user overview, audit feed & notifications
            │   ├── UserManagement.tsx      # Full CRUD modal for adding/editing users & toggling active status
            │   ├── SystemConfiguration.tsx # Persistent system settings, thresholds, tax rates & maintenance toggles
            │   └── AuditTrails.tsx         # Live filterable & exportable security and action audit logs
            ├── manager/
            │   ├── ManagerDashboard.tsx    # Revenue analytics, pending order alerts & low-stock notifications
            │   ├── ItemAvailability.tsx    # Detailed item catalog with CAS numbers, hazard classes, locations & stock
            │   ├── ManagerOrders.tsx       # Order processing, status updates, assignment & detailed order modal
            │   ├── Invoices.tsx            # Printable/downloadable tax invoices with itemized breakdowns
            │   ├── Reports.tsx             # Financial & operational performance charts and category breakdowns
            │   └── Messages.tsx            # Real-time 2-way messaging center with customers, inventory & delivery staff
            ├── customer/
            │   ├── CustomerDashboard.tsx   # Featured catalog, quick cart checkout modal & recent order tracker
            │   ├── Shop.tsx                # Full laboratory catalog with technical specs modal, filters & checkout flow
            │   ├── MyOrders.tsx            # Order history, tracking timeline, invoice view & cancellation options
            │   └── Support.tsx             # Interactive ticket submission linked to Manager Messages + FAQ
            ├── inventory/
            │   ├── InventoryDashboard.tsx  # Stock health KPIs, expiry tracking, quick restock & Add/Edit item modals
            │   ├── InventoryManagement.tsx # Complete inventory CRUD, batch/lot tracking, hazard & calibration details
            │   └── StockReports.tsx        # Valuation reports, category distribution & CSV report export
            └── delivery/
                ├── DeliveryDashboard.tsx   # Active dispatch queue, route details, driver notes & status progression
                ├── Deliveries.tsx          # Full delivery management, customer contact info & proof-of-delivery updates
                └── DeliveryReports.tsx     # Fulfillment metrics, payment collection summary & exportable logs
```

## Getting Started

### 1. Frontend Application
```bash
cd frontend
npm install
npm run dev
```

### 2. Backend API Server
```bash
cd backend
npm install
npm run dev
```
