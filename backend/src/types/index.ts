export interface Item {
  id: string;
  sku: string;
  name: string;
  type: 'chemical' | 'equipment';
  category: string;
  price: number;
  stock: number;
  unit: string;
  description: string;
  expiryDate?: string;
  lowStockThreshold: number;
  image?: string;
  manufacturer: string;
  batchNumber: string;
  storageLocation: string;
  storageTemp: string;
  casNumber?: string;
  hazardLevel?: 'None' | 'Low' | 'Moderate' | 'High' | 'Corrosive' | 'Flammable';
  purityGrade?: string;
  calibrationDate?: string;
  warrantyMonths?: number;
  modelNumber?: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'manager' | 'customer' | 'inventory' | 'delivery';
  phone?: string;
  address?: string;
  department?: string;
  organization?: string;
  isActive: boolean;
  createdAt: string;
  lastLogin?: string;
}

export interface Order {
  id: string;
  invoiceNumber: string;
  customerId: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  items: {
    itemId: string;
    name: string;
    quantity: number;
    price: number;
    unit: string;
  }[];
  subtotal: number;
  taxAmount: number;
  shippingFee: number;
  totalAmount: number;
  status: 'pending' | 'processing' | 'in-transit' | 'delivered' | 'completed' | 'cancelled';
  paymentMethod: 'online' | 'cod';
  paymentStatus: 'paid' | 'pending' | 'refunded';
  fulfillmentOption: 'pickup' | 'delivery';
  deliveryAddress?: string;
  assignedDriver?: string;
  trackingNumber?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
  deliveredAt?: string;
}

export interface AuditLog {
  id: string;
  user: string;
  userRole: string;
  action: string;
  target: string;
  details: string;
  timestamp: string;
  type: 'create' | 'update' | 'delete' | 'system';
}

export interface SystemConfig {
  siteName: string;
  companyEmail: string;
  companyPhone: string;
  companyAddress: string;
  lowStockThreshold: number;
  emailNotifications: boolean;
  smsNotifications: boolean;
  autoBackup: boolean;
  maintenanceMode: boolean;
  requireHazmatApproval: boolean;
  maxOrderAmount: number;
  taxRate: number;
  standardShippingFee: number;
  currency: string;
}
