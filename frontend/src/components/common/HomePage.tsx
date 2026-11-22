import React, { useState, useRef } from 'react';
import { useAppContext } from '../../context/AppContext';
import {
  ActivityIcon,
  SparklesIcon,
  ShieldCheckIcon,
  PlayIcon,
  PauseIcon,
  LockIcon,
  UserCheckIcon,
  ShieldIcon,
  BriefcaseIcon,
  ShoppingBagIcon,
  BoxesIcon,
  TruckIcon,
  LayoutDashboardIcon,
  LogOutIcon,
  CheckCircleIcon,
  ArrowRightIcon,
  ShoppingCartIcon,
  PackageIcon,
  ClipboardListIcon,
  AlertCircleIcon
} from 'lucide-react';

interface HomePageProps {
  isAuthenticated: boolean;
  loggedInRole: string | null;
  onLoginSuccess: (role: string) => void;
  onOpenPortalDashboard: (role: string, targetPath?: string) => void;
  onLogout: () => void;
}

export const HomePage: React.FC<HomePageProps> = ({
  isAuthenticated,
  loggedInRole,
  onLoginSuccess,
  onOpenPortalDashboard,
  onLogout
}) => {
  const { users, items, orders, cart, conversations } = useAppContext();
  const loginSectionRef = useRef<HTMLDivElement>(null);
  const roleHomeSectionRef = useRef<HTMLDivElement>(null);

  const [heroPlaying, setHeroPlaying] = useState(true);
  const [incubationHour, setIncubationHour] = useState(8);

  // Role-based login state
  const [selectedRole, setSelectedRole] = useState<string>(loggedInRole || 'customer');
  const [email, setEmail] = useState('customer@example.com');
  const [password, setPassword] = useState('••••••••••••');
  const [loginMessage, setLoginMessage] = useState<string | null>(null);

  const roleCredentials: Record<
    string,
    {
      label: string;
      email: string;
      userName: string;
      clearance: string;
      tagline: string;
      description: string;
      heroImage: string;
      accent: string;
      icon: JSX.Element;
      quickActions: { label: string; path: string }[];
    }
  > = {
    customer: {
      label: 'Customer (Lab Buyer)',
      email: 'customer@example.com',
      userName: 'Dr. Aris Thorne',
      clearance: 'BSL-2 Verified Buyer • Apex BioLabs Institute',
      tagline: 'Real-Time Chemical & Precision Equipment Requisition Home',
      description:
        'Browse ACS reagent-grade chemicals, edit your laboratory requisition cart, track cold-chain deliveries, and download Safety Data Sheets (SDS).',
      heroImage:
        'https://images.unsplash.com/photo-1581093458791-9f3c3900df4b?auto=format&fit=crop&q=85&w=1400',
      accent: '#0e97b0',
      icon: <ShoppingBagIcon className="h-5 w-5" />,
      quickActions: [
        { label: 'Open Customer Dashboard', path: '/customer' },
        { label: 'Edit Cart Workspace', path: '/customer/edit-cart' },
        { label: 'Browse Lab Shop', path: '/customer/shop' },
        { label: 'My Orders & Tracking', path: '/customer/orders' }
      ]
    },
    manager: {
      label: 'Operations Manager',
      email: 'manager@lism.com',
      userName: 'Marcus Sterling',
      clearance: 'Level 4 Operations & Quality Control Manager',
      tagline: 'Commercial Operations, Order Approval & Telemetry Home',
      description:
        'Approve pending laboratory requisitions, monitor real-time chemical stock thresholds, issue institutional tax invoices, and coordinate with customers.',
      heroImage:
        'https://images.unsplash.com/photo-1579154204601-01588f351e67?auto=format&fit=crop&q=85&w=1400',
      accent: '#27c2d2',
      icon: <BriefcaseIcon className="h-5 w-5" />,
      quickActions: [
        { label: 'Open Manager Dashboard', path: '/manager' },
        { label: 'Process Lab Orders', path: '/manager/orders' },
        { label: 'Item Availability Matrix', path: '/manager/items' },
        { label: 'Tax Invoices & Billing', path: '/manager/invoices' }
      ]
    },
    inventory: {
      label: 'Inventory Manager',
      email: 'inventory@lism.com',
      userName: 'Helena Chen',
      clearance: 'Level 3 Hazmat Vault & Metrology Custodian',
      tagline: 'Chemical Vault, Batch Traceability & Calibration Home',
      description:
        'Manage chemical lot numbers, monitor acid/flammable storage cabinets, track reagent expiry dates, and replenish low-stock laboratory SKUs.',
      heroImage:
        'https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?auto=format&fit=crop&q=85&w=1400',
      accent: '#0f9b40',
      icon: <BoxesIcon className="h-5 w-5" />,
      quickActions: [
        { label: 'Open Inventory Dashboard', path: '/inventory' },
        { label: 'Manage Batches & Stock', path: '/inventory/manage' },
        { label: 'Valuation & Expiry Reports', path: '/inventory/reports' }
      ]
    },
    delivery: {
      label: 'Delivery & Fleet Staff',
      email: 'delivery@lism.com',
      userName: 'Carlos Mendez',
      clearance: 'ADR Hazmat & Cold-Chain Certified Courier',
      tagline: 'Cold-Chain & ADR Hazmat Fleet Dispatch Home',
      description:
        'Access assigned laboratory delivery manifests, inspect corrosive/flammable containment instructions, and update live transit statuses.',
      heroImage:
        'https://images.unsplash.com/photo-1582719471384-894fbb16e074?auto=format&fit=crop&q=85&w=1400',
      accent: '#0e97b0',
      icon: <TruckIcon className="h-5 w-5" />,
      quickActions: [
        { label: 'Open Delivery Dashboard', path: '/delivery' },
        { label: 'Active Dispatch Queue', path: '/delivery/manage' },
        { label: 'Fleet Logistics Reports', path: '/delivery/reports' }
      ]
    },
    admin: {
      label: 'System Administrator',
      email: 'admin@lism.com',
      userName: 'Dr. Evelyn Vance',
      clearance: 'Level 5 Root Administrator • 21 CFR Part 11 Compliance',
      tagline: 'Enterprise Governance, Biosafety Clearances & Audit Home',
      description:
        'Control user role clearances, configure global tax and hazmat parameters, and inspect immutable 21 CFR Part 11 security audit trails.',
      heroImage:
        'https://images.unsplash.com/photo-1516546453174-5e1098a4b4af?auto=format&fit=crop&q=85&w=1400',
      accent: '#aa4266',
      icon: <ShieldIcon className="h-5 w-5" />,
      quickActions: [
        { label: 'Open Admin Dashboard', path: '/admin' },
        { label: 'User & Clearance Management', path: '/admin/users' },
        { label: 'System Configuration', path: '/admin/config' },
        { label: '21 CFR Part 11 Audit Trails', path: '/admin/audit' }
      ]
    }
  };

  const handleRolePillSelect = (roleKey: string) => {
    setSelectedRole(roleKey);
    setEmail(roleCredentials[roleKey].email);
    setPassword('••••••••••••');
  };

  const scrollToLoginOrRoleHome = () => {
    if (isAuthenticated && loggedInRole) {
      roleHomeSectionRef.current?.scrollIntoView({ behavior: 'smooth' });
    } else {
      loginSectionRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onLoginSuccess(selectedRole);
    setLoginMessage(
      `Authenticated as ${roleCredentials[selectedRole].userName} (${roleCredentials[selectedRole].label})`
    );
    setTimeout(() => {
      roleHomeSectionRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 150);
  };

  const partnerLogos = [
    'COLGATE-PALMOLIVE',
    'Daiichi-Sankyo',
    'FMC BioPolymer',
    'FUJIFILM LifeSciences',
    'Mallinckrodt Pharma',
    'SC Johnson Labs',
    'CJ BioDiagnostics',
    'NISSIN BIO'
  ];

  const cultureMediaList = [
    { code: 'PDA', label: 'Potato Dextrose Agar', color: '#e6c86e' },
    { code: 'TSA / PCA', label: 'Tryptic Soy / Plate Count', color: '#d9b854' },
    { code: 'MRS', label: 'De Man, Rogosa & Sharpe', color: '#c48f3f' },
    { code: 'VRBL / VRBG', label: 'Violet Red Bile Agar', color: '#aa4266' },
    { code: 'TBX', label: 'Tryptone Bile X-Glucuronide', color: '#8ac4d0' },
    { code: 'Slanetz', label: 'Slanetz & Bartley Medium', color: '#b84b5c' },
    { code: 'Sabouraud', label: 'Sabouraud Dextrose Agar', color: '#dec378' },
    { code: 'R2A', label: 'Reasoner’s 2A Agar', color: '#e3d5a5' },
    { code: 'GVPC', label: 'Legionella GVPC Selective', color: '#454545' },
    { code: 'TTC', label: 'Tergitol-7 TTC Agar', color: '#7ea862' },
    { code: 'Yeast & Mold', label: 'Rapid Yeast & Mold Agar', color: '#d4b259' },
    { code: 'Coliforms', label: 'Chromogenic Coliform Agar', color: '#27c2d2' }
  ];

  const detectedColonies = Math.min(280, Math.round(Math.pow(incubationHour, 1.75)));
  const isFirstDetectionReached = incubationHour >= 8;
  const isTraditionalReached = incubationHour >= 24;

  const activeRoleKey = loggedInRole || selectedRole;
  const activeRoleMeta = roleCredentials[activeRoleKey] || roleCredentials.customer;
  const cartCount = cart.reduce((s, c) => s + c.quantity, 0);
  const lowStockCount = items.filter((i) => i.stock <= i.lowStockThreshold).length;
  const pendingOrdersCount = orders.filter((o) => o.status === 'pending').length;

  return (
    <div className="space-y-16">
      {/* =====================================================================
          SECTION 1: SCANSTATION HERO BANNER (desktop-1440-fold.png)
          Clicking "Start your journey" scrolls smoothly to the Role-Based Login
          section (or Role Home Page if already authenticated).
         ===================================================================== */}
      <section className="relative rounded-[48px] overflow-hidden border border-[#212121] shadow-2xl min-h-[580px] lg:min-h-[680px] flex items-center justify-center text-center px-6 py-20">
        <img
          src="https://images.unsplash.com/photo-1581093458791-9f3c3900df4b?auto=format&fit=crop&q=85&w=1600"
          alt="ScanStation Laboratory Automation"
          className={`absolute inset-0 w-full h-full object-cover transition-transform duration-1000 ${
            heroPlaying ? 'scale-105 opacity-50' : 'scale-100 opacity-35'
          }`}
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              'linear-gradient(rgba(0, 0, 0, 0.35), rgba(0, 0, 0, 0.72))'
          }}
        />

        <div className="relative z-10 max-w-[880px] mx-auto space-y-6">
          <span className="inline-flex items-center px-4 py-1.5 rounded-full bg-[#0e97b0]/25 border border-[#27c2d2]/40 text-[#27c2d2] text-xs font-bold uppercase tracking-widest">
            LISMStation • Interscience Laboratory Ecosystem
          </span>
          <h1 className="sp-type-headline-display text-4xl sm:text-6xl lg:text-[72px] lg:leading-[72px] text-white tracking-tight">
            Shape the future
            <br />
            of lab automation
          </h1>
          <p className="sp-type-body-md text-lg sm:text-[24px] sm:leading-[28px] text-white max-w-[680px] mx-auto">
            Discover how automation with ScanStation & LISM can upgrade your laboratory and optimize your productivity.
          </p>
          <div className="pt-4 flex flex-wrap justify-center gap-4">
            <button
              onClick={scrollToLoginOrRoleHome}
              className="sp-btn-primary h-[66px] px-10 text-[20.8px]"
            >
              Start your journey
            </button>
            {isAuthenticated && loggedInRole && (
              <button
                onClick={() => onOpenPortalDashboard(loggedInRole)}
                className="sp-btn-ink h-[66px] px-8 text-[17.6px] border border-[#27c2d2]"
              >
                <LayoutDashboardIcon className="h-5 w-5 mr-2 text-[#27c2d2]" />
                Dashboard ({roleCredentials[loggedInRole]?.label.split(' ')[0]})
              </button>
            )}
          </div>
        </div>

        {/* Bottom-right 45px round video play/pause button (.icon-button-ghost) */}
        <button
          onClick={() => setHeroPlaying(!heroPlaying)}
          className="absolute bottom-6 right-6 z-20 h-[45px] w-[45px] rounded-full border-2 border-white text-white hover:bg-white hover:text-black transition-colors flex items-center justify-center"
          title={heroPlaying ? 'Pause background motion' : 'Play background motion'}
        >
          {heroPlaying ? (
            <PauseIcon className="h-4 w-4" />
          ) : (
            <PlayIcon className="h-4 w-4" />
          )}
        </button>
      </section>

      {/* =====================================================================
          SECTION 2: ROLE-BASED LOGIN & SEPARATE ROLE-WISE HOME PAGE
          Triggered when clicking "Start your journey"
         ===================================================================== */}
      <div ref={loginSectionRef} id="role-login-section" className="scroll-mt-28">
        {!isAuthenticated ? (
          <section className="sp-card-dark p-8 sm:p-12 border-2 border-[#0e97b0] shadow-2xl">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
              {/* Left 5 Cols: Role Selection Cards */}
              <div className="lg:col-span-6 space-y-5">
                <span className="text-xs font-bold uppercase tracking-widest text-[#27c2d2]">
                  Role-Based Authentication
                </span>
                <h2 className="sp-type-headline-lg text-3xl sm:text-[44px] sm:leading-[48px] text-white">
                  Sign in to your
                  <br />
                  Laboratory Portal
                </h2>
                <p className="text-sm text-[#b0b0b0] leading-relaxed">
                  Select your functional laboratory role below. Upon authentication, you will enter your dedicated <strong className="text-white">Role-Wise Home Page</strong> with your live <strong className="text-[#27c2d2]">Dashboard</strong> launcher and full sidebar portal access.
                </p>

                <div className="space-y-2.5 pt-2">
                  {Object.entries(roleCredentials).map(([roleKey, meta]) => {
                    const isSelected = selectedRole === roleKey;
                    return (
                      <button
                        key={roleKey}
                        type="button"
                        onClick={() => handleRolePillSelect(roleKey)}
                        className={`w-full text-left p-4 rounded-[20px] border transition-all flex items-center justify-between ${
                          isSelected
                            ? 'bg-[#0e4e65]/40 border-[#27c2d2] text-white shadow-lg'
                            : 'bg-[#131313] border-[#212121] text-[#b0b0b0] hover:border-[#5d5d5d] hover:text-white'
                        }`}
                      >
                        <div className="flex items-center space-x-3.5">
                          <div
                            className={`h-10 w-10 rounded-full flex items-center justify-center ${
                              isSelected
                                ? 'bg-[#27c2d2] text-black'
                                : 'bg-[#090909] text-[#27c2d2]'
                            }`}
                          >
                            {meta.icon}
                          </div>
                          <div>
                            <p className="font-bold text-sm text-white">
                              {meta.label}
                            </p>
                            <p className="text-xs text-[#b0b0b0]">
                              {meta.userName} • {meta.email}
                            </p>
                          </div>
                        </div>
                        <span
                          className={`text-xs font-bold px-3 py-1 rounded-full ${
                            isSelected
                              ? 'bg-[#27c2d2] text-black'
                              : 'bg-[#090909] text-[#b0b0b0]'
                          }`}
                        >
                          {isSelected ? 'Selected' : 'Select'}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Right 6 Cols: High-Contrast Login Form */}
              <div className="lg:col-span-6">
                <div className="sp-card-elevated-light p-8 sm:p-10">
                  <div className="flex items-center justify-between mb-6 pb-4 border-b border-black/15">
                    <div className="flex items-center space-x-3">
                      <div className="h-12 w-12 rounded-full bg-black text-[#27c2d2] flex items-center justify-center">
                        <LockIcon className="h-5 w-5" />
                      </div>
                      <div>
                        <span className="text-[11px] font-bold uppercase tracking-widest text-[#0e4e65]">
                          21 CFR Part 11 Verified Access
                        </span>
                        <h3 className="text-xl font-bold text-[#111111] font-display">
                          {roleCredentials[selectedRole].label} Login
                        </h3>
                      </div>
                    </div>
                  </div>

                  <form onSubmit={handleLoginSubmit} className="space-y-5">
                    <div>
                      <label className="block text-xs font-bold uppercase text-[#3d3d3d] mb-1.5">
                        Select Portal Role
                      </label>
                      <select
                        value={selectedRole}
                        onChange={(e) => handleRolePillSelect(e.target.value)}
                        className="w-full bg-white border border-black/25 text-[#111111] px-4 py-3 text-sm font-bold rounded-none focus:outline-none focus:border-[#0e97b0]"
                      >
                        <option value="customer">Customer Portal (Dr. Aris Thorne)</option>
                        <option value="manager">Manager Portal (Marcus Sterling)</option>
                        <option value="inventory">Inventory Portal (Helena Chen)</option>
                        <option value="delivery">Delivery Portal (Carlos Mendez)</option>
                        <option value="admin">Admin Portal (Dr. Evelyn Vance)</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase text-[#3d3d3d] mb-1.5">
                        Institutional Email Address
                      </label>
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full bg-white border border-black/25 text-[#111111] px-4 py-3 text-sm font-medium rounded-none focus:outline-none focus:border-[#0e97b0]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase text-[#3d3d3d] mb-1.5">
                        Security Passkey / Token
                      </label>
                      <input
                        type="password"
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full bg-white border border-black/25 text-[#111111] px-4 py-3 text-sm font-medium rounded-none focus:outline-none focus:border-[#0e97b0]"
                      />
                    </div>

                    <div className="bg-black/5 p-3.5 rounded-[16px] text-xs text-[#3d3d3d] flex items-center space-x-2.5">
                      <UserCheckIcon className="h-4 w-4 text-[#0e97b0] flex-shrink-0" />
                      <span>
                        Clearance Profile:{' '}
                        <strong className="text-[#111111]">
                          {roleCredentials[selectedRole].clearance}
                        </strong>
                      </span>
                    </div>

                    <button
                      type="submit"
                      className="sp-btn-primary w-full h-[58px] text-lg"
                    >
                      Sign In & Open {roleCredentials[selectedRole].label.split(' ')[0]} Home Page →
                    </button>
                  </form>
                </div>
              </div>
            </div>
          </section>
        ) : (
          /* =====================================================================
             SEPARATE ROLE-WISE HOME PAGE (Shown once authenticated)
             Features tailored Role Home Hero, Role KPIs, "Dashboard" button that
             opens the portal details + reveals the Sidebar, and quick role switcher.
             ===================================================================== */
          <section
            ref={roleHomeSectionRef}
            className="sp-card-dark p-8 sm:p-12 border-2 border-[#27c2d2] shadow-2xl space-y-8"
          >
            {loginMessage && (
              <div className="p-4 bg-[#0f9b40]/25 border border-[#0f9b40] rounded-[20px] flex flex-wrap items-center justify-between gap-4 text-sm text-white">
                <div className="flex items-center">
                  <CheckCircleIcon className="h-5 w-5 mr-2.5 text-[#4dfd88]" />
                  <span>{loginMessage}</span>
                </div>
                <span className="text-xs text-[#4dfd88] font-bold uppercase">
                  Session Active
                </span>
              </div>
            )}

            {/* Role-Wise Home Header & Switcher Bar */}
            <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-[#212121]">
              <div className="flex items-center space-x-3.5">
                <div className="h-14 w-14 rounded-full bg-[#27c2d2] text-black flex items-center justify-center shadow-lg">
                  {activeRoleMeta.icon}
                </div>
                <div>
                  <span className="text-xs font-bold uppercase tracking-widest text-[#27c2d2]">
                    Authenticated Role-Wise Home Page
                  </span>
                  <h2 className="sp-type-headline-md text-2xl sm:text-[36px] text-white mt-0.5">
                    Welcome, {activeRoleMeta.userName} ({activeRoleMeta.label})
                  </h2>
                  <p className="text-xs text-[#b0b0b0]">{activeRoleMeta.clearance}</p>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                {/* Switch between Role Home Pages */}
                <select
                  value={activeRoleKey}
                  onChange={(e) => onLoginSuccess(e.target.value)}
                  className="bg-[#131313] border border-[#2d2d2d] text-white px-3.5 py-2.5 text-xs font-bold rounded-none"
                  title="Switch Role Home Page"
                >
                  <option value="customer">Switch Home: Customer</option>
                  <option value="manager">Switch Home: Manager</option>
                  <option value="inventory">Switch Home: Inventory</option>
                  <option value="delivery">Switch Home: Delivery</option>
                  <option value="admin">Switch Home: Admin</option>
                </select>

                {/* Primary "Dashboard" Button that navigates to Portal Details & reveals Sidebar */}
                <button
                  onClick={() => onOpenPortalDashboard(activeRoleKey)}
                  className="sp-btn-primary h-[54px] px-8 text-base"
                >
                  <LayoutDashboardIcon className="h-5 w-5 mr-2" />
                  Dashboard
                </button>

                <button
                  onClick={onLogout}
                  className="sp-btn-outline h-[54px] px-5 text-xs"
                  title="Sign Out"
                >
                  <LogOutIcon className="h-4 w-4 mr-1.5" /> Sign Out
                </button>
              </div>
            </div>

            {/* Role-Specific Home Hero & Overview Content */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-7 space-y-5">
                <span className="inline-block px-3.5 py-1 rounded-full bg-[#0e97b0]/25 text-[#27c2d2] text-xs font-bold uppercase">
                  {activeRoleKey.toUpperCase()} HOME OVERVIEW
                </span>
                <h3 className="sp-type-headline-lg text-3xl sm:text-[42px] sm:leading-[46px] text-white">
                  {activeRoleMeta.tagline}
                </h3>
                <p className="text-base text-[#b0b0b0] leading-relaxed">
                  {activeRoleMeta.description}
                </p>

                {/* Role-Specific Live Telemetry Summary Cards */}
                {activeRoleKey === 'customer' && (
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                    <div className="bg-[#131313] border border-[#212121] p-4 rounded-[20px]">
                      <p className="text-xs text-[#b0b0b0]">Items in Cart</p>
                      <p className="text-2xl font-bold text-[#27c2d2] mt-1 font-display">
                        {cartCount} Units
                      </p>
                    </div>
                    <div className="bg-[#131313] border border-[#212121] p-4 rounded-[20px]">
                      <p className="text-xs text-[#b0b0b0]">My Orders</p>
                      <p className="text-2xl font-bold text-white mt-1 font-display">
                        {orders.filter((o) => o.customerId === '3').length} Active
                      </p>
                    </div>
                    <div className="bg-[#131313] border border-[#212121] p-4 rounded-[20px]">
                      <p className="text-xs text-[#b0b0b0]">Available SKUs</p>
                      <p className="text-2xl font-bold text-[#4dfd88] mt-1 font-display">
                        {items.length} Verified
                      </p>
                    </div>
                  </div>
                )}

                {activeRoleKey === 'manager' && (
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                    <div className="bg-[#131313] border border-[#212121] p-4 rounded-[20px]">
                      <p className="text-xs text-[#b0b0b0]">Pending Orders</p>
                      <p className="text-2xl font-bold text-[#27c2d2] mt-1 font-display">
                        {pendingOrdersCount} Awaiting
                      </p>
                    </div>
                    <div className="bg-[#aa4266] p-4 rounded-[20px]">
                      <p className="text-xs text-white/80">Low Stock Alerts</p>
                      <p className="text-2xl font-bold text-white mt-1 font-display">
                        {lowStockCount} SKUs
                      </p>
                    </div>
                    <div className="bg-[#131313] border border-[#212121] p-4 rounded-[20px]">
                      <p className="text-xs text-[#b0b0b0]">Unread Messages</p>
                      <p className="text-2xl font-bold text-[#4dfd88] mt-1 font-display">
                        {conversations.filter((c) => c.unread).length} Threads
                      </p>
                    </div>
                  </div>
                )}

                {activeRoleKey === 'inventory' && (
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                    <div className="bg-[#131313] border border-[#212121] p-4 rounded-[20px]">
                      <p className="text-xs text-[#b0b0b0]">Total Vault SKUs</p>
                      <p className="text-2xl font-bold text-white mt-1 font-display">
                        {items.length} Batches
                      </p>
                    </div>
                    <div className="bg-[#aa4266] p-4 rounded-[20px]">
                      <p className="text-xs text-white/80">Below Threshold</p>
                      <p className="text-2xl font-bold text-white mt-1 font-display">
                        {lowStockCount} Alerts
                      </p>
                    </div>
                    <div className="bg-[#131313] border border-[#212121] p-4 rounded-[20px]">
                      <p className="text-xs text-[#b0b0b0]">Vault Temperature</p>
                      <p className="text-2xl font-bold text-[#4dfd88] mt-1 font-display">
                        18.4°C OK
                      </p>
                    </div>
                  </div>
                )}

                {activeRoleKey === 'delivery' && (
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                    <div className="bg-[#131313] border border-[#212121] p-4 rounded-[20px]">
                      <p className="text-xs text-[#b0b0b0]">Active Dispatches</p>
                      <p className="text-2xl font-bold text-[#27c2d2] mt-1 font-display">
                        {
                          orders.filter(
                            (o) =>
                              o.fulfillmentOption === 'delivery' &&
                              ['pending', 'processing', 'in-transit'].includes(o.status)
                          ).length
                        }{' '}
                        Routes
                      </p>
                    </div>
                    <div className="bg-[#131313] border border-[#212121] p-4 rounded-[20px]">
                      <p className="text-xs text-[#b0b0b0]">In Transit</p>
                      <p className="text-2xl font-bold text-white mt-1 font-display">
                        {orders.filter((o) => o.status === 'in-transit').length} Fleet
                      </p>
                    </div>
                    <div className="bg-[#131313] border border-[#212121] p-4 rounded-[20px]">
                      <p className="text-xs text-[#b0b0b0]">ADR Status</p>
                      <p className="text-2xl font-bold text-[#4dfd88] mt-1 font-display">
                        Certified
                      </p>
                    </div>
                  </div>
                )}

                {activeRoleKey === 'admin' && (
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                    <div className="bg-[#131313] border border-[#212121] p-4 rounded-[20px]">
                      <p className="text-xs text-[#b0b0b0]">Registered Users</p>
                      <p className="text-2xl font-bold text-white mt-1 font-display">
                        {users.length} Accounts
                      </p>
                    </div>
                    <div className="bg-[#131313] border border-[#212121] p-4 rounded-[20px]">
                      <p className="text-xs text-[#b0b0b0]">Active Clearances</p>
                      <p className="text-2xl font-bold text-[#4dfd88] mt-1 font-display">
                        {users.filter((u) => u.isActive).length} Verified
                      </p>
                    </div>
                    <div className="bg-[#aa4266] p-4 rounded-[20px]">
                      <p className="text-xs text-white/80">21 CFR Part 11</p>
                      <p className="text-2xl font-bold text-white mt-1 font-display">
                        Enforced
                      </p>
                    </div>
                  </div>
                )}

                {/* Action Buttons: Dashboard + Sub-Modules */}
                <div className="pt-4 flex flex-wrap gap-3">
                  <button
                    onClick={() => onOpenPortalDashboard(activeRoleKey)}
                    className="sp-btn-primary h-[56px] px-8 text-base"
                  >
                    <LayoutDashboardIcon className="h-5 w-5 mr-2" />
                    Go to {activeRoleMeta.label.split(' ')[0]} Dashboard & Show Sidebar →
                  </button>
                  {activeRoleMeta.quickActions.slice(1).map((qa, i) => (
                    <button
                      key={i}
                      onClick={() => onOpenPortalDashboard(activeRoleKey, qa.path)}
                      className="sp-btn-outline h-[56px] px-6 text-sm"
                    >
                      {qa.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Right 5 Cols: Role Home Visual Preview Card */}
              <div className="lg:col-span-5">
                <div className="relative rounded-[36px] overflow-hidden border-2 border-[#212121] shadow-2xl h-80">
                  <img
                    src={activeRoleMeta.heroImage}
                    alt={activeRoleMeta.label}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent flex flex-col justify-end p-6">
                    <span className="text-xs font-bold uppercase text-[#27c2d2]">
                      Dedicated Portal Ready
                    </span>
                    <p className="text-lg font-bold text-white mt-0.5">
                      Click "Dashboard" to open full sidebar navigation & workspace
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}
      </div>

      {/* =====================================================================
          SECTION 3: "They trust us" Partner Marquee + 3 Cyan Petri-Dish Callouts
         ===================================================================== */}
      <section className="py-6 text-center space-y-10">
        <h2 className="sp-type-headline-lg text-3xl sm:text-[51.2px] sm:leading-[53.76px] text-white">
          They trust us
        </h2>

        <div className="relative overflow-hidden py-6">
          <div
            className="pointer-events-none absolute inset-y-0 left-0 w-24 z-10"
            style={{
              backgroundImage:
                'linear-gradient(90deg, rgb(0, 0, 0) 36%, rgba(255, 255, 255, 0))'
            }}
          />
          <div
            className="pointer-events-none absolute inset-y-0 right-0 w-24 z-10"
            style={{
              backgroundImage:
                'linear-gradient(270deg, rgb(0, 0, 0) 36%, rgba(255, 255, 255, 0))'
            }}
          />

          <div className="sp-marquee-track gap-20 items-center">
            {[...partnerLogos, ...partnerLogos].map((logo, idx) => (
              <div
                key={idx}
                className="px-6 py-2 text-[#b0b0b0] hover:text-white transition-colors font-display text-2xl sm:text-3xl font-bold tracking-wider uppercase whitespace-nowrap opacity-75 hover:opacity-100"
              >
                {logo}
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-6 text-left max-w-5xl mx-auto">
          <div className="flex items-center space-x-4">
            <div className="h-[56px] w-[56px] rounded-full bg-[#27c2d2] text-black flex items-center justify-center flex-shrink-0 shadow-lg">
              <ActivityIcon className="h-7 w-7" />
            </div>
            <p className="text-base text-white leading-snug">
              <strong className="text-[#27c2d2]">Visualize bacterial growth</strong> with real-time counting & reagent tracking
            </p>
          </div>
          <div className="flex items-center space-x-4">
            <div className="h-[56px] w-[56px] rounded-full bg-[#27c2d2] text-black flex items-center justify-center flex-shrink-0 shadow-lg">
              <SparklesIcon className="h-7 w-7" />
            </div>
            <p className="text-base text-white leading-snug">
              <strong className="text-[#27c2d2]">Get results up to 3 times faster</strong> and optimize your lab process
            </p>
          </div>
          <div className="flex items-center space-x-4">
            <div className="h-[56px] w-[56px] rounded-full bg-[#27c2d2] text-black flex items-center justify-center flex-shrink-0 shadow-lg">
              <ShieldCheckIcon className="h-7 w-7" />
            </div>
            <p className="text-base text-white leading-snug">
              <strong className="text-[#27c2d2]">An innovative solution</strong> for better production & stock management
            </p>
          </div>
        </div>
      </section>

      {/* =====================================================================
          SECTION 4: "Get anticipated results" (Interactive Range Slider + Petri Dish)
         ===================================================================== */}
      <section className="sp-card-dark p-8 sm:p-12 border border-[#212121]">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <span className="text-xs font-bold uppercase tracking-widest text-[#27c2d2]">
              Real-Time Kinetic Analysis
            </span>
            <h2 className="sp-type-headline-lg text-3xl sm:text-[51.2px] sm:leading-[53.76px] text-white">
              Get anticipated results
            </h2>
            <p className="text-[#b0b0b0] text-lg leading-relaxed">
              E.g.: Coliforms at 37°C — Drag the incubation timeline slider below to compare <strong className="text-white">ScanStation anticipated detection (8h)</strong> against traditional 24h manual Petri dish reading.
            </p>

            <div className="space-y-3 pt-2">
              <div className="flex justify-between text-sm font-bold">
                <span className="text-[#27c2d2]">
                  Incubation Time: {incubationHour}h 00m
                </span>
                <span className="text-white">
                  Detected Colonies: {detectedColonies} CFU
                </span>
              </div>
              <input
                type="range"
                min={1}
                max={24}
                value={incubationHour}
                onChange={(e) => setIncubationHour(parseInt(e.target.value))}
                className="w-full h-3 bg-[#212121] accent-[#27c2d2] cursor-pointer"
              />
              <div className="flex justify-between text-xs text-[#b0b0b0]">
                <span>0h (Inoculation)</span>
                <span className="text-[#aa4266] font-bold">8h (Anticipated Result)</span>
                <span>24h (Traditional Method)</span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4">
              <div
                onClick={() => setIncubationHour(6)}
                className={`p-4 rounded-[10px] cursor-pointer text-center transition-all border ${
                  incubationHour >= 6 && incubationHour < 8
                    ? 'bg-[#0e97b0] text-white border-[#27c2d2]'
                    : 'bg-[#131313] text-[#b0b0b0] border-[#212121]'
                }`}
              >
                <p className="text-xs uppercase font-bold">6 Hours</p>
                <p className="text-base font-bold text-white mt-1">
                  First detection
                </p>
              </div>

              <div
                onClick={() => setIncubationHour(8)}
                className={`sp-card-crimson p-4 cursor-pointer text-center flex flex-col items-center justify-center shadow-lg ${
                  isFirstDetectionReached ? 'ring-2 ring-white' : 'opacity-80'
                }`}
              >
                <p className="text-xs uppercase font-bold text-white/85">8 Hours</p>
                <p className="text-[19.2px] font-medium text-white leading-tight mt-0.5">
                  Anticipated results
                </p>
              </div>

              <div
                onClick={() => setIncubationHour(24)}
                className={`p-4 rounded-[10px] cursor-pointer text-center transition-all border ${
                  isTraditionalReached
                    ? 'bg-[#0f9b40] text-white border-[#4dfd88]'
                    : 'bg-[#131313] text-[#b0b0b0] border-[#212121]'
                }`}
              >
                <p className="text-xs uppercase font-bold">24 Hours</p>
                <p className="text-base font-bold text-white mt-1">
                  Traditional method
                </p>
              </div>
            </div>
          </div>

          <div className="bg-[#000000] border border-[#212121] rounded-[36px] p-8 flex flex-col items-center justify-center relative">
            <div className="w-56 h-56 rounded-full bg-gradient-to-br from-[#f3e39c] via-[#d8be60] to-[#a78932] border-8 border-[#262626] shadow-2xl relative flex items-center justify-center overflow-hidden">
              {Array.from({ length: Math.min(45, incubationHour * 2) }).map((_, i) => {
                const angle = (i * 137.5 * Math.PI) / 180;
                const radius = 12 + ((i * 19) % 72);
                const x = 50 + Math.cos(angle) * (radius * 0.5);
                const y = 50 + Math.sin(angle) * (radius * 0.5);
                const size = Math.min(14, 3 + Math.floor(incubationHour / 3));
                return (
                  <span
                    key={i}
                    style={{
                      left: `${x}%`,
                      top: `${y}%`,
                      width: `${size}px`,
                      height: `${size}px`
                    }}
                    className="absolute rounded-full bg-[#6d5316] ring-2 ring-[#27c2d2]/80 transition-all duration-300"
                  />
                );
              })}
            </div>
            <div className="mt-6 text-center">
              <span className="inline-block px-3.5 py-1 rounded-full bg-[#0e97b0]/20 text-[#27c2d2] text-xs font-bold">
                Plate ID #28 • Total Flora @ {incubationHour}:00h
              </span>
              <p className="text-xs text-[#b0b0b0] mt-2">
                Real-time telecentric camera counting every 30 minutes
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================================
          SECTION 5: "Automation in the laboratory, a major challenge"
         ===================================================================== */}
      <section className="sp-ambient-glow rounded-[48px] border border-[#212121] p-8 sm:p-14 space-y-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          <h2 className="sp-type-headline-lg text-3xl sm:text-[51.2px] sm:leading-[53.76px] text-white">
            Automation in the laboratory,
            <br />a major challenge
          </h2>
          <p className="text-lg text-[#b0b0b0] leading-relaxed">
            <strong className="text-[#27c2d2]">
              Combine traditional methods with rapid methods and their anticipated results
            </strong>{' '}
            while keeping operating costs low. Adopt real-time monitoring to help rapid detection of potential contaminants to reduce product risk according to GMP Annex 1.
          </p>
        </div>

        <div className="relative max-w-3xl mx-auto py-6 flex flex-col items-center justify-center">
          <div
            className="w-72 h-72 sm:w-96 sm:h-96 rounded-full flex items-center justify-center relative"
            style={{
              background:
                'radial-gradient(circle, rgba(39, 194, 210, 0.35) 0%, rgba(14, 78, 101, 0.15) 50%, rgba(0, 0, 0, 0) 75%)'
            }}
          >
            <img
              src="https://images.unsplash.com/photo-1582719471384-894fbb16e074?auto=format&fit=crop&q=85&w=700"
              alt="LISM Automated Incubator & Carousel"
              className="w-60 h-60 sm:w-72 sm:h-72 object-cover rounded-[36px] border-2 border-[#27c2d2]/50 shadow-2xl"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-4">
          <div className="flex items-center space-x-4">
            <div className="h-[56px] w-[56px] rounded-full bg-[#27c2d2] text-black flex items-center justify-center flex-shrink-0 font-bold text-lg">
              01
            </div>
            <p className="text-sm sm:text-base text-white">
              <strong className="text-[#27c2d2]">Improve the quality of your results</strong> by eliminating manual errors
            </p>
          </div>
          <div className="flex items-center space-x-4">
            <div className="h-[56px] w-[56px] rounded-full bg-[#27c2d2] text-black flex items-center justify-center flex-shrink-0 font-bold text-lg">
              02
            </div>
            <p className="text-sm sm:text-base text-white">
              <strong className="text-[#27c2d2]">Procedure</strong> standardization across all shifts
            </p>
          </div>
          <div className="flex items-center space-x-4">
            <div className="h-[56px] w-[56px] rounded-full bg-[#27c2d2] text-black flex items-center justify-center flex-shrink-0 font-bold text-lg">
              03
            </div>
            <p className="text-sm sm:text-base text-white">
              <strong className="text-[#27c2d2]">Compliance with regulatory standards</strong> (GMP, AOAC, ISO)
            </p>
          </div>
        </div>
      </section>

      {/* =====================================================================
          SECTION 6: "NEW — Stay connected to your lab" (White Contrast Band)
         ===================================================================== */}
      <section className="bg-white text-[#3d3d3d] rounded-[48px] p-8 sm:p-14 shadow-2xl">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-5 flex flex-col items-center lg:items-start">
            <span className="inline-block bg-[#27c2d2] text-white text-sm font-bold uppercase px-4 py-1.5 rounded-full shadow mb-4">
              NEW
            </span>
            <h2 className="sp-type-headline-lg text-4xl sm:text-[48px] sm:leading-[52px] text-[#111111] mb-8">
              Stay connected
              <br />
              to your lab
            </h2>

            <div className="w-[300px] sm:w-[330px] bg-[#007593] text-white rounded-[48px] p-5 border-[8px] border-[#111111] shadow-[2px_2px_20px_15px_rgba(0,0,0,0.2)]">
              <div className="text-center pb-3 border-b border-white/20 mb-4">
                <p className="text-[11px] text-white/75">12:48 • LISM Telemetry</p>
                <p className="font-bold text-sm tracking-wide mt-0.5">
                  myLISMStation
                </p>
              </div>
              <div className="grid grid-cols-2 gap-3 text-center text-xs">
                <div
                  onClick={() => onOpenPortalDashboard('customer', '/customer/orders')}
                  className="bg-[#0e97b0] hover:bg-[#27c2d2] hover:text-black transition p-4 rounded-[20px] cursor-pointer flex flex-col items-center justify-center aspect-square"
                >
                  <PackageIcon className="h-8 w-8 mb-2" />
                  <span className="font-bold">Plate & Lot Alarms</span>
                </div>
                <div
                  onClick={() => onOpenPortalDashboard('manager', '/manager')}
                  className="bg-[#aa4266] hover:opacity-90 transition p-4 rounded-[20px] cursor-pointer flex flex-col items-center justify-center aspect-square"
                >
                  <AlertCircleIcon className="h-8 w-8 mb-2" />
                  <span className="font-bold">System Alerts</span>
                </div>
                <div
                  onClick={() => onOpenPortalDashboard('customer', '/customer/shop')}
                  className="bg-[#0e97b0] hover:bg-[#27c2d2] hover:text-black transition p-4 rounded-[20px] cursor-pointer flex flex-col items-center justify-center aspect-square"
                >
                  <ActivityIcon className="h-8 w-8 mb-2" />
                  <span className="font-bold">Live Catalog</span>
                </div>
                <div
                  onClick={() => onOpenPortalDashboard('customer', '/customer/edit-cart')}
                  className="bg-[#0e97b0] hover:bg-[#27c2d2] hover:text-black transition p-4 rounded-[20px] cursor-pointer flex flex-col items-center justify-center aspect-square"
                >
                  <ShoppingCartIcon className="h-8 w-8 mb-2" />
                  <span className="font-bold">Edit Cart ({cartCount})</span>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-7 space-y-10">
            <div className="space-y-4">
              <h3 className="sp-type-headline-md text-2xl sm:text-[33.6px] text-[#3d3d3d]">
                Visualize your analyses & orders remotely
              </h3>
              <p className="sp-type-body-md text-lg sm:text-[22px] sm:leading-[28px] text-[#3d3d3d]">
                View and validate analyses and reagent deliveries wherever you are. Load Petri dishes and navigate <strong className="text-[#111111]">myLISMStation</strong> application to visualize bacterial growth and live chemical inventory.
              </p>
            </div>

            <div className="border-t border-[#d1d1d1] pt-8 space-y-4">
              <h3 className="sp-type-headline-md text-2xl sm:text-[33.6px] text-[#3d3d3d]">
                Instant notifications & Role Dashboards
              </h3>
              <p className="sp-type-body-md text-lg sm:text-[22px] sm:leading-[28px] text-[#3d3d3d]">
                Be immediately informed of temperature peaks, exceeded count thresholds, low stock alerts, or the presence of a contaminant by email or on <strong className="text-[#111111]">myLISMStation</strong> application.
              </p>
              <div className="flex flex-wrap gap-3 pt-2">
                <button
                  onClick={scrollToLoginOrRoleHome}
                  className="sp-btn-primary h-[52px] px-8 text-sm"
                >
                  {isAuthenticated
                    ? `Open ${activeRoleMeta.label.split(' ')[0]} Home Section ↑`
                    : 'Sign In to Role Portal ↑'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================================
          SECTION 7: "Easily fit in your laboratory" (12 Culture Media Grid)
         ===================================================================== */}
      <section className="space-y-8">
        <div className="max-w-3xl">
          <h2 className="sp-type-headline-lg text-3xl sm:text-[51.2px] sm:leading-[53.76px] text-white">
            Easily fit in your laboratory
          </h2>
          <p className="text-xl text-[#b0b0b0] mt-3">
            Keep your Petri dish suppliers, already validated associated equipment, ACS reagents, and consumables:
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-5">
          {cultureMediaList.map((media, idx) => (
            <div
              key={idx}
              onClick={() => onOpenPortalDashboard('customer', '/customer/shop')}
              className="bg-[#090909] border border-[#212121] hover:border-[#27c2d2] rounded-[24px] p-4 text-center cursor-pointer transition-all group"
            >
              <div
                className="w-20 h-20 mx-auto rounded-full border-4 border-[#262626] shadow-inner mb-3 flex items-center justify-center group-hover:scale-105 transition-transform"
                style={{ backgroundColor: media.color }}
              >
                <span className="text-[11px] font-bold text-black/80 bg-white/70 px-2 py-0.5 rounded-full">
                  {media.code}
                </span>
              </div>
              <p className="font-bold text-sm text-white">{media.code}</p>
              <p className="text-[11px] text-[#b0b0b0] mt-0.5 line-clamp-1">
                {media.label}
              </p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
