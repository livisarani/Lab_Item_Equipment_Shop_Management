import React, { useState, createContext, useContext, ReactNode } from 'react';
import {
  mockItems,
  mockUsers,
  mockOrders,
  mockAuditLogs,
  mockConversations,
  mockNotifications,
  mockSystemConfig
} from '../data/mockData';

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
  hazardLevel?: 'None' | 'Low' | 'Moderate' | 'High' | 'Corrosive' | 'Flammable' | 'Toxic' | 'Oxidizer';
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
  clearanceLevel?: string;
  isActive: boolean;
  createdAt: string;
  lastLogin?: string;
}

export interface OrderItem {
  itemId: string;
  name?: string;
  quantity: number;
  price: number;
  unit?: string;
}

export interface Order {
  id: string;
  invoiceNumber?: string;
  customerId: string;
  customerName?: string;
  customerEmail?: string;
  customerPhone?: string;
  items: OrderItem[];
  subtotal?: number;
  taxAmount?: number;
  shippingFee?: number;
  totalAmount: number;
  status: 'pending' | 'processing' | 'in-transit' | 'delivered' | 'completed' | 'cancelled';
  paymentMethod: 'online' | 'cod';
  paymentStatus?: 'paid' | 'pending' | 'refunded';
  fulfillmentOption: 'pickup' | 'delivery';
  deliveryAddress?: string;
  assignedDriver?: string;
  trackingNumber?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
  deliveredAt?: string;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'warning' | 'error' | 'success';
  read: boolean;
  createdAt: string;
  forRole: string[];
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

export interface ChatMessage {
  id: string;
  sender: string;
  senderRole: string;
  text: string;
  time: string;
  isOwn: boolean;
}

export interface Conversation {
  id: string;
  userId: string;
  user: string;
  role: string;
  organization?: string;
  subject: string;
  category?: string;
  priority?: 'Low' | 'Normal' | 'High' | 'Urgent';
  status: 'Open' | 'In Progress' | 'Resolved';
  lastMessage: string;
  time: string;
  unread: boolean;
  messages: ChatMessage[];
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

export interface CartItem {
  itemId: string;
  quantity: number;
}

interface AppContextProps {
  currentRole: string;
  setCurrentRole: (role: string) => void;
  items: Item[];
  users: User[];
  orders: Order[];
  auditLogs: AuditLog[];
  conversations: Conversation[];
  systemConfig: SystemConfig;
  cart: CartItem[];
  addToCart: (itemId: string, quantity?: number) => void;
  updateCartQuantity: (itemId: string, quantity: number) => void;
  removeFromCart: (itemId: string) => void;
  clearCart: () => void;
  checkoutCart: (details: {
    paymentMethod: 'online' | 'cod';
    fulfillmentOption: 'pickup' | 'delivery';
    deliveryAddress: string;
    notes?: string;
  }) => Order | null;
  addItem: (item: Omit<Item, 'id'> & { id?: string }) => void;
  updateItem: (id: string, item: Partial<Item>) => void;
  deleteItem: (id: string) => void;
  restockItem: (id: string, addedQuantity: number) => void;
  addOrder: (order: Order) => void;
  updateOrder: (id: string, order: Partial<Order>) => void;
  addUser: (user: Omit<User, 'id' | 'createdAt'> & { id?: string; createdAt?: string }) => void;
  updateUser: (id: string, user: Partial<User>) => void;
  deactivateUser: (id: string) => void;
  toggleUserStatus: (id: string) => void;
  deleteUser: (id: string) => void;
  notifications: Notification[];
  addNotification: (notification: Omit<Notification, 'id' | 'createdAt' | 'read'>) => void;
  markNotificationAsRead: (id: string) => void;
  markAllNotificationsAsRead: () => void;
  addAuditLog: (log: Omit<AuditLog, 'id' | 'timestamp'>) => void;
  sendMessage: (conversationId: string, text: string, senderName?: string, isOwn?: boolean) => void;
  createSupportTicket: (subject: string, category: string, priority: 'Low' | 'Normal' | 'High' | 'Urgent', message: string) => void;
  resolveConversation: (conversationId: string) => void;
  updateSystemConfig: (newConfig: Partial<SystemConfig>) => void;
}

const AppContext = createContext<AppContextProps | undefined>(undefined);

export const AppProvider: React.FC<{
  children: ReactNode;
  currentRole?: string;
  setCurrentRole?: (role: string) => void;
}> = ({ children, currentRole: propRole, setCurrentRole: propSetRole }) => {
  const [internalRole, setInternalRole] = useState('customer');
  const currentRole = propRole ?? internalRole;
  const setCurrentRole = propSetRole ?? setInternalRole;

  const [items, setItems] = useState<Item[]>(mockItems);
  const [users, setUsers] = useState<User[]>(mockUsers);
  const [orders, setOrders] = useState<Order[]>(mockOrders);
  const [notifications, setNotifications] = useState<Notification[]>(mockNotifications);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>(mockAuditLogs);
  const [conversations, setConversations] = useState<Conversation[]>(mockConversations);
  const [systemConfig, setSystemConfig] = useState<SystemConfig>(mockSystemConfig);
  const [cart, setCart] = useState<CartItem[]>([
    { itemId: '1', quantity: 1 },
    { itemId: '4', quantity: 1 }
  ]);

  const addAuditLog = (log: Omit<AuditLog, 'id' | 'timestamp'>) => {
    const newLog: AuditLog = {
      ...log,
      id: `AUD-${Date.now()}`,
      timestamp: new Date().toISOString()
    };
    setAuditLogs((prev) => [newLog, ...prev]);
  };

  const addNotification = (notif: Omit<Notification, 'id' | 'createdAt' | 'read'>) => {
    const newNotif: Notification = {
      ...notif,
      id: `NOTIF-${Date.now()}`,
      read: false,
      createdAt: new Date().toISOString()
    };
    setNotifications((prev) => [newNotif, ...prev]);
  };

  const markNotificationAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const markAllNotificationsAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  // Cart Actions
  const addToCart = (itemId: string, quantity = 1) => {
    const targetItem = items.find((i) => i.id === itemId);
    if (!targetItem || targetItem.stock <= 0) return;

    setCart((prev) => {
      const existing = prev.find((c) => c.itemId === itemId);
      if (existing) {
        const nextQty = Math.min(targetItem.stock, existing.quantity + quantity);
        return prev.map((c) => (c.itemId === itemId ? { ...c, quantity: nextQty } : c));
      }
      return [...prev, { itemId, quantity: Math.min(targetItem.stock, quantity) }];
    });
  };

  const updateCartQuantity = (itemId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(itemId);
      return;
    }
    const targetItem = items.find((i) => i.id === itemId);
    const maxStock = targetItem ? targetItem.stock : quantity;
    setCart((prev) =>
      prev.map((c) =>
        c.itemId === itemId ? { ...c, quantity: Math.min(maxStock, quantity) } : c
      )
    );
  };

  const removeFromCart = (itemId: string) => {
    setCart((prev) => prev.filter((c) => c.itemId !== itemId));
  };

  const clearCart = () => setCart([]);

  const checkoutCart = (details: {
    paymentMethod: 'online' | 'cod';
    fulfillmentOption: 'pickup' | 'delivery';
    deliveryAddress: string;
    notes?: string;
  }): Order | null => {
    if (cart.length === 0) return null;

    const customer = users.find((u) => u.id === '3') || users[2];
    const orderItems: OrderItem[] = cart
      .map((c) => {
        const item = items.find((i) => i.id === c.itemId);
        if (!item) return null;
        return {
          itemId: item.id,
          name: item.name,
          quantity: c.quantity,
          price: item.price,
          unit: item.unit
        };
      })
      .filter(Boolean) as OrderItem[];

    const subtotal = orderItems.reduce((sum, i) => sum + i.price * i.quantity, 0);
    const taxAmount = Number(((subtotal * systemConfig.taxRate) / 100).toFixed(2));
    const shippingFee = details.fulfillmentOption === 'delivery' ? systemConfig.standardShippingFee : 0;
    const totalAmount = Number((subtotal + taxAmount + shippingFee).toFixed(2));

    const orderNum = String(orders.length + 1).padStart(3, '0');
    const newOrder: Order = {
      id: `ORD-2026-${orderNum}`,
      invoiceNumber: `INV-2026-${100 + orders.length + 1}`,
      customerId: customer?.id || '3',
      customerName: customer?.name || 'Dr. Aris Thorne',
      customerEmail: customer?.email || 'customer@example.com',
      customerPhone: customer?.phone || '555-345-6789',
      items: orderItems,
      subtotal,
      taxAmount,
      shippingFee,
      totalAmount,
      status: 'pending',
      paymentMethod: details.paymentMethod,
      paymentStatus: details.paymentMethod === 'online' ? 'paid' : 'pending',
      fulfillmentOption: details.fulfillmentOption,
      deliveryAddress:
        details.fulfillmentOption === 'delivery'
          ? details.deliveryAddress
          : 'LISM Main Lab Facility Pickup Counter',
      assignedDriver: details.fulfillmentOption === 'delivery' ? 'Carlos Mendez' : undefined,
      trackingNumber:
        details.fulfillmentOption === 'delivery'
          ? `TRK-LISM-${Math.floor(10000 + Math.random() * 90000)}`
          : undefined,
      notes: details.notes || 'Standard laboratory handling',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    // Deduct stock
    setItems((prevItems) =>
      prevItems.map((it) => {
        const ordered = orderItems.find((oi) => oi.itemId === it.id);
        if (!ordered) return it;
        const newStock = Math.max(0, it.stock - ordered.quantity);
        if (newStock <= it.lowStockThreshold) {
          addNotification({
            title: 'Low Stock Alert',
            message: `${it.name} is down to ${newStock} ${it.unit}s (Threshold: ${it.lowStockThreshold})`,
            type: 'warning',
            forRole: ['admin', 'inventory', 'manager']
          });
        }
        return { ...it, stock: newStock };
      })
    );

    setOrders((prev) => [newOrder, ...prev]);
    setCart([]);

    addNotification({
      title: 'New Order Placed',
      message: `Order ${newOrder.id} ($${newOrder.totalAmount.toFixed(2)}) placed by ${newOrder.customerName}`,
      type: 'success',
      forRole: ['manager', 'admin', 'delivery', 'customer']
    });

    addAuditLog({
      user: newOrder.customerName || 'Customer User',
      userRole: 'customer',
      action: 'Order Placed',
      target: newOrder.id,
      details: `Placed order for ${orderItems.length} item(s) totaling $${newOrder.totalAmount.toFixed(2)} via ${details.paymentMethod.toUpperCase()}.`,
      type: 'create'
    });

    return newOrder;
  };

  // Item CRUD
  const addItem = (itemData: Omit<Item, 'id'> & { id?: string }) => {
    const newItem: Item = {
      ...itemData,
      id: itemData.id || String(Date.now())
    };
    setItems((prev) => [newItem, ...prev]);
    addAuditLog({
      user: 'Helena Chen (Inventory)',
      userRole: currentRole,
      action: 'Item Added',
      target: `${newItem.name} (${newItem.sku})`,
      details: `Added ${newItem.stock} ${newItem.unit}s at $${newItem.price.toFixed(2)} in ${newItem.storageLocation}.`,
      type: 'create'
    });
    addNotification({
      title: 'New Inventory Item Added',
      message: `${newItem.name} (${newItem.stock} ${newItem.unit}) added to catalog.`,
      type: 'info',
      forRole: ['admin', 'manager', 'inventory']
    });
  };

  const updateItem = (id: string, updatedItem: Partial<Item>) => {
    const target = items.find((i) => i.id === id);
    setItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, ...updatedItem } : item))
    );
    addAuditLog({
      user: 'Helena Chen (Inventory)',
      userRole: currentRole,
      action: 'Item Updated',
      target: target ? `${target.name} (${target.sku})` : id,
      details: `Updated inventory item specifications/stock.`,
      type: 'update'
    });
  };

  const restockItem = (id: string, addedQuantity: number) => {
    const target = items.find((i) => i.id === id);
    if (!target || addedQuantity <= 0) return;
    const newStock = target.stock + addedQuantity;
    setItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, stock: newStock } : item))
    );
    addAuditLog({
      user: 'Helena Chen (Inventory)',
      userRole: currentRole,
      action: 'Stock Replenished',
      target: `${target.name} (${target.sku})`,
      details: `Added +${addedQuantity} ${target.unit}s. New stock level: ${newStock} ${target.unit}s.`,
      type: 'update'
    });
    addNotification({
      title: 'Stock Replenished',
      message: `${target.name} restocked (+${addedQuantity} ${target.unit}). Total: ${newStock} ${target.unit}.`,
      type: 'success',
      forRole: ['inventory', 'manager', 'admin']
    });
  };

  const deleteItem = (id: string) => {
    const target = items.find((i) => i.id === id);
    setItems((prev) => prev.filter((item) => item.id !== id));
    if (target) {
      addAuditLog({
        user: 'Helena Chen (Inventory)',
        userRole: currentRole,
        action: 'Item Deleted',
        target: `${target.name} (${target.sku})`,
        details: `Removed item from active laboratory inventory catalog.`,
        type: 'delete'
      });
    }
  };

  // Order CRUD
  const addOrder = (order: Order) => {
    setOrders((prev) => [order, ...prev]);
  };

  const updateOrder = (id: string, updatedOrder: Partial<Order>) => {
    const target = orders.find((o) => o.id === id);
    setOrders((prev) =>
      prev.map((order) =>
        order.id === id
          ? {
              ...order,
              ...updatedOrder,
              updatedAt: new Date().toISOString(),
              deliveredAt:
                updatedOrder.status === 'delivered' || updatedOrder.status === 'completed'
                  ? new Date().toISOString()
                  : order.deliveredAt
            }
          : order
      )
    );
    if (target && updatedOrder.status) {
      addAuditLog({
        user: currentRole === 'delivery' ? 'Carlos Mendez (Delivery)' : 'Marcus Sterling (Manager)',
        userRole: currentRole,
        action: 'Order Status Updated',
        target: id,
        details: `Changed order ${id} status from "${target.status}" to "${updatedOrder.status}".`,
        type: 'update'
      });
      addNotification({
        title: `Order ${id} ${updatedOrder.status.replace('-', ' ').toUpperCase()}`,
        message: `Order ${id} status has been updated to ${updatedOrder.status.replace('-', ' ')}.`,
        type: 'info',
        forRole: ['customer', 'manager', 'delivery']
      });
    }
  };

  // User CRUD
  const addUser = (userData: Omit<User, 'id' | 'createdAt'> & { id?: string; createdAt?: string }) => {
    const newUser: User = {
      ...userData,
      id: userData.id || String(Date.now()),
      createdAt: userData.createdAt || new Date().toISOString(),
      lastLogin: new Date().toISOString()
    };
    setUsers((prev) => [newUser, ...prev]);
    addAuditLog({
      user: 'Dr. Evelyn Vance (Admin)',
      userRole: 'admin',
      action: 'User Created',
      target: newUser.email,
      details: `Created ${newUser.role.toUpperCase()} account for ${newUser.name} (${newUser.organization || 'LISM'}).`,
      type: 'create'
    });
  };

  const updateUser = (id: string, updatedUser: Partial<User>) => {
    const target = users.find((u) => u.id === id);
    setUsers((prev) =>
      prev.map((user) => (user.id === id ? { ...user, ...updatedUser } : user))
    );
    addAuditLog({
      user: 'Dr. Evelyn Vance (Admin)',
      userRole: 'admin',
      action: 'User Profile Updated',
      target: target?.email || id,
      details: `Updated user account details/permissions for ${target?.name || id}.`,
      type: 'update'
    });
  };

  const deactivateUser = (id: string) => {
    const target = users.find((u) => u.id === id);
    setUsers((prev) =>
      prev.map((user) => (user.id === id ? { ...user, isActive: false } : user))
    );
    if (target) {
      addAuditLog({
        user: 'Dr. Evelyn Vance (Admin)',
        userRole: 'admin',
        action: 'User Deactivated',
        target: target.email,
        details: `Suspended system access for ${target.name}.`,
        type: 'delete'
      });
    }
  };

  const toggleUserStatus = (id: string) => {
    const target = users.find((u) => u.id === id);
    if (!target) return;
    const nextStatus = !target.isActive;
    setUsers((prev) =>
      prev.map((user) => (user.id === id ? { ...user, isActive: nextStatus } : user))
    );
    addAuditLog({
      user: 'Dr. Evelyn Vance (Admin)',
      userRole: 'admin',
      action: nextStatus ? 'User Activated' : 'User Deactivated',
      target: target.email,
      details: `${nextStatus ? 'Restored' : 'Suspended'} account access for ${target.name}.`,
      type: nextStatus ? 'update' : 'delete'
    });
  };

  const deleteUser = (id: string) => {
    const target = users.find((u) => u.id === id);
    setUsers((prev) => prev.filter((u) => u.id !== id));
    if (target) {
      addAuditLog({
        user: 'Dr. Evelyn Vance (Admin)',
        userRole: 'admin',
        action: 'User Deleted',
        target: target.email,
        details: `Permanently removed user account ${target.name}.`,
        type: 'delete'
      });
    }
  };

  // Messaging & Support
  const sendMessage = (conversationId: string, text: string, senderName?: string, isOwn = true) => {
    if (!text.trim()) return;
    const timeNow = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    setConversations((prev) =>
      prev.map((conv) => {
        if (conv.id !== conversationId) return conv;
        const newMsg: ChatMessage = {
          id: `MSG-${Date.now()}`,
          sender: senderName || (isOwn ? 'Marcus Sterling (Manager)' : conv.user),
          senderRole: isOwn ? currentRole : conv.role,
          text,
          time: timeNow,
          isOwn
        };
        return {
          ...conv,
          lastMessage: text,
          time: 'Just now',
          unread: !isOwn,
          status: 'In Progress',
          messages: [...conv.messages, newMsg]
        };
      })
    );
  };

  const createSupportTicket = (
    subject: string,
    category: string,
    priority: 'Low' | 'Normal' | 'High' | 'Urgent',
    message: string
  ) => {
    const timeNow = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const newConv: Conversation = {
      id: `TCK-${Date.now()}`,
      userId: '3',
      user: 'Dr. Aris Thorne (Customer)',
      role: 'customer',
      organization: 'Apex BioLabs Institute',
      subject,
      category,
      priority,
      status: 'Open',
      lastMessage: message,
      time: 'Just now',
      unread: true,
      messages: [
        {
          id: `MSG-${Date.now()}`,
          sender: 'Dr. Aris Thorne (Customer)',
          senderRole: 'customer',
          text: message,
          time: timeNow,
          isOwn: false
        }
      ]
    };
    setConversations((prev) => [newConv, ...prev]);
    addNotification({
      title: 'New Support Ticket Submitted',
      message: `[${priority}] ${subject} — from Dr. Aris Thorne`,
      type: priority === 'Urgent' || priority === 'High' ? 'warning' : 'info',
      forRole: ['manager', 'admin', 'customer']
    });
    addAuditLog({
      user: 'Dr. Aris Thorne (Customer)',
      userRole: 'customer',
      action: 'Support Ticket Created',
      target: subject,
      details: `Category: ${category} | Priority: ${priority}`,
      type: 'create'
    });
  };

  const resolveConversation = (conversationId: string) => {
    setConversations((prev) =>
      prev.map((c) => (c.id === conversationId ? { ...c, status: 'Resolved', unread: false } : c))
    );
  };

  const updateSystemConfig = (newConfig: Partial<SystemConfig>) => {
    setSystemConfig((prev) => ({ ...prev, ...newConfig }));
    addAuditLog({
      user: 'Dr. Evelyn Vance (Admin)',
      userRole: 'admin',
      action: 'System Configuration Updated',
      target: 'Global Settings',
      details: `Updated system parameters (Tax Rate: ${newConfig.taxRate ?? systemConfig.taxRate}%, Low Stock Default: ${newConfig.lowStockThreshold ?? systemConfig.lowStockThreshold}).`,
      type: 'system'
    });
    addNotification({
      title: 'System Configuration Saved',
      message: 'Global LISM platform parameters have been updated.',
      type: 'success',
      forRole: ['admin']
    });
  };

  return (
    <AppContext.Provider
      value={{
        currentRole,
        setCurrentRole,
        items,
        users,
        orders,
        auditLogs,
        conversations,
        systemConfig,
        cart,
        addToCart,
        updateCartQuantity,
        removeFromCart,
        clearCart,
        checkoutCart,
        addItem,
        updateItem,
        deleteItem,
        restockItem,
        addOrder,
        updateOrder,
        addUser,
        updateUser,
        deactivateUser,
        toggleUserStatus,
        deleteUser,
        notifications,
        addNotification,
        markNotificationAsRead,
        markAllNotificationsAsRead,
        addAuditLog,
        sendMessage,
        createSupportTicket,
        resolveConversation,
        updateSystemConfig
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};
