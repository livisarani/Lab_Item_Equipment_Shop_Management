import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../../context/AppContext';
import {
  SearchIcon,
  ShoppingCartIcon,
  PackageIcon,
  PlusIcon,
  MinusIcon,
  TrashIcon,
  CheckCircleIcon,
  XIcon,
  ShieldAlertIcon,
  ActivityIcon,
  SparklesIcon,
  ShieldCheckIcon,
  PlayIcon,
  PauseIcon,
  EditIcon,
  RefreshCwIcon,
  ArrowRightIcon
} from 'lucide-react';

export const CustomerDashboard: React.FC = () => {
  const {
    items,
    orders,
    cart,
    addToCart,
    updateCartQuantity,
    removeFromCart,
    clearCart,
    checkoutCart,
    systemConfig
  } = useAppContext();
  const navigate = useNavigate();
  const editCartSectionRef = useRef<HTMLDivElement>(null);

  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('all');
  const [heroPlaying, setHeroPlaying] = useState(true);
  const [incubationHour, setIncubationHour] = useState(8);
  const [quickAddId, setQuickAddId] = useState(items[2]?.id || '3');
  const [quickAddQty, setQuickAddQty] = useState(1);
  const [itemBatchNotes, setItemBatchNotes] = useState<Record<string, string>>({
    '1': 'Require Lot CoA & Acid Containment Bin',
    '4': 'Include ISO-17025 Calibration Certificate'
  });

  const [showCheckoutModal, setShowCheckoutModal] = useState(false);
  const [orderPlacedSuccess, setOrderPlacedSuccess] = useState<string | null>(null);
  const [checkoutData, setCheckoutData] = useState({
    paymentMethod: 'online' as 'online' | 'cod',
    fulfillmentOption: 'delivery' as 'pickup' | 'delivery',
    deliveryAddress: '123 Lab St, BioResearch Wing, Science City, SC 12345',
    notes: 'Please include Certificate of Analysis (CoA) and MSDS documentation.'
  });

  const customerOrders = orders.filter((order) => order.customerId === '3');

  const filteredItems = items.filter((item) => {
    const matchesSearch =
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.sku.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filter === 'all' || item.type === filter;
    return matchesSearch && matchesFilter;
  });

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const cartSubtotal = cart.reduce((sum, cartItem) => {
    const item = items.find((i) => i.id === cartItem.itemId);
    return item ? sum + cartItem.quantity * item.price : sum;
  }, 0);
  const cartTax = Number(((cartSubtotal * systemConfig.taxRate) / 100).toFixed(2));
  const cartShipping =
    cart.length > 0 && checkoutData.fulfillmentOption === 'delivery'
      ? systemConfig.standardShippingFee
      : 0;
  const cartGrandTotal = Number((cartSubtotal + cartTax + cartShipping).toFixed(2));

  const scrollToEditCart = () => {
    editCartSectionRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleQuickAddItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!quickAddId || quickAddQty <= 0) return;
    addToCart(quickAddId, quickAddQty);
    setQuickAddQty(1);
  };

  const handleConfirmCheckout = (e: React.FormEvent) => {
    e.preventDefault();
    const combinedNotes = [
      checkoutData.notes,
      ...Object.entries(itemBatchNotes)
        .filter(([id]) => cart.some((c) => c.itemId === id))
        .map(([id, note]) => {
          const it = items.find((i) => i.id === id);
          return note ? `[${it?.sku || id}: ${note}]` : '';
        })
        .filter(Boolean)
    ].join(' ');

    const newOrder = checkoutCart({
      ...checkoutData,
      notes: combinedNotes
    });
    if (newOrder) {
      setShowCheckoutModal(false);
      setOrderPlacedSuccess(newOrder.id);
      setTimeout(() => setOrderPlacedSuccess(null), 6000);
    }
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

  // Dynamic colony count based on slider (1h to 24h)
  const detectedColonies = Math.min(280, Math.round(Math.pow(incubationHour, 1.75)));
  const isFirstDetectionReached = incubationHour >= 8;
  const isTraditionalReached = incubationHour >= 24;

  return (
    <div className="space-y-16">
      {/* =====================================================================
          SECTION 1: HERO BANNER (myscanstation.com desktop-1440-fold.png)
          720px height, centered 72px/800 heading, 24px body, 66px primary CTA,
          and bottom-right 45px round pause/play ghost icon button
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
              'linear-gradient(rgba(0, 0, 0, 0.35), rgba(0, 0, 0, 0.65))'
          }}
        />

        <div className="relative z-10 max-w-[880px] mx-auto space-y-6">
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
              onClick={() => navigate('/customer/shop')}
              className="sp-btn-primary h-[66px] px-10 text-[20.8px]"
            >
              Start your journey
            </button>
            <button
              onClick={scrollToEditCart}
              className="sp-btn-ink h-[66px] px-8 text-[17.6px] border border-white/30"
            >
              <ShoppingCartIcon className="h-5 w-5 mr-2 text-[#27c2d2]" />
              Edit Cart ({cartCount} items)
            </button>
          </div>
        </div>

        {/* Bottom-right 45px round video play/pause button (.icon-button-ghost from components.css) */}
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
          SECTION 2: "They trust us" Partner Marquee + "Read more" Outline CTA
          + 3 Cyan Petri-Dish 56px Round Feature Highlights (Region r1)
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

        <div>
          <button
            onClick={() => navigate('/customer/shop')}
            className="sp-btn-outline h-[57px] px-7 text-[16px]"
          >
            Read more
          </button>
        </div>

        {/* 3 Cyan Petri-Dish Round 56px Feature Highlights (.avatar-56px-round) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-8 text-left max-w-5xl mx-auto">
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
          SECTION 3: "Get anticipated results" (section_home_anticipated)
          Interactive Range Slider (#2ca5b8) + Crimson Card (#aa4266, radius 10px)
          + Simulated Real-Time Colony Growth Petri Dish
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

            {/* Range Slider (.slider from components.css: 518x28px, #2ca5b8) */}
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

            {/* 3 State Cards including the measured .card-filled (#aa4266, radius 10px) */}
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

              {/* Exact measured .card-filled recipe from demos/card-filled.html */}
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

          {/* Right: Interactive Visual Petri Dish & Growth Curve */}
          <div className="bg-[#000000] border border-[#212121] rounded-[36px] p-8 flex flex-col items-center justify-center relative">
            <div className="w-56 h-56 rounded-full bg-gradient-to-br from-[#f3e39c] via-[#d8be60] to-[#a78932] border-8 border-[#262626] shadow-2xl relative flex items-center justify-center overflow-hidden">
              {/* Simulated bacterial colonies scaling with incubationHour */}
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
          SECTION 4: "Automation in the laboratory, a major challenge"
          (section_home_spider from desktop-1440-full.jpg)
          Radial Teal Spotlight + Central Lab Hub + 3 Bottom Petri-Dish Callouts
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

        {/* Center Illuminated Lab Instrument Visual */}
        <div className="relative max-w-3xl mx-auto py-8 flex flex-col items-center justify-center">
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

        {/* 3 Bottom Compliance Pillars */}
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
          SECTION 5: "NEW — Stay connected to your lab" (Region r2 White Band)
          Full-bleed high-contrast white section (#ffffff, text #3d3d3d) with
          48px rounded mobile screen preview card (.card-elevated-media-top)
         ===================================================================== */}
      <section className="bg-white text-[#3d3d3d] rounded-[48px] p-8 sm:p-14 shadow-2xl">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left: Title + 48px Rounded Elevated Device Mockup (.card-elevated-media-top) */}
          <div className="lg:col-span-5 flex flex-col items-center lg:items-start">
            <span className="inline-block bg-[#27c2d2] text-white text-sm font-bold uppercase px-4 py-1.5 rounded-full shadow mb-4">
              NEW
            </span>
            <h2 className="sp-type-headline-lg text-4xl sm:text-[48px] sm:leading-[52px] text-[#111111] mb-8">
              Stay connected
              <br />
              to your lab
            </h2>

            {/* Elevated 48px radius mobile app screen mockup matching desktop-1440-full.jpg */}
            <div className="w-[300px] sm:w-[330px] bg-[#007593] text-white rounded-[48px] p-5 border-[8px] border-[#111111] shadow-[2px_2px_20px_15px_rgba(0,0,0,0.2)]">
              <div className="text-center pb-3 border-b border-white/20 mb-4">
                <p className="text-[11px] text-white/75">12:48 • LISM Telemetry</p>
                <p className="font-bold text-sm tracking-wide mt-0.5">
                  myLISMStation
                </p>
              </div>
              <div className="grid grid-cols-2 gap-3 text-center text-xs">
                <div
                  onClick={() => navigate('/customer/orders')}
                  className="bg-[#0e97b0] hover:bg-[#27c2d2] hover:text-black transition p-4 rounded-[20px] cursor-pointer flex flex-col items-center justify-center aspect-square"
                >
                  <PackageIcon className="h-8 w-8 mb-2" />
                  <span className="font-bold">Plate & Lot Alarms</span>
                </div>
                <div
                  onClick={() => navigate('/customer/support')}
                  className="bg-[#aa4266] hover:opacity-90 transition p-4 rounded-[20px] cursor-pointer flex flex-col items-center justify-center aspect-square"
                >
                  <ShieldAlertIcon className="h-8 w-8 mb-2" />
                  <span className="font-bold">System Alerts (1)</span>
                </div>
                <div
                  onClick={() => navigate('/customer/shop')}
                  className="bg-[#0e97b0] hover:bg-[#27c2d2] hover:text-black transition p-4 rounded-[20px] cursor-pointer flex flex-col items-center justify-center aspect-square"
                >
                  <ActivityIcon className="h-8 w-8 mb-2" />
                  <span className="font-bold">Live Catalog</span>
                </div>
                <div
                  onClick={scrollToEditCart}
                  className="bg-[#0e97b0] hover:bg-[#27c2d2] hover:text-black transition p-4 rounded-[20px] cursor-pointer flex flex-col items-center justify-center aspect-square"
                >
                  <ShoppingCartIcon className="h-8 w-8 mb-2" />
                  <span className="font-bold">Edit Cart ({cartCount})</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right: 2 Feature Blocks ("Visualize your analyses remotely" & "Instant notifications") */}
          <div className="lg:col-span-7 space-y-10">
            <div className="space-y-4">
              <h3 className="sp-type-headline-md text-2xl sm:text-[33.6px] text-[#3d3d3d]">
                Visualize your analyses & orders remotely
              </h3>
              <p className="sp-type-body-md text-lg sm:text-[22px] sm:leading-[28px] text-[#3d3d3d]">
                View and validate analyses and reagent deliveries wherever you are. Load Petri dishes and navigate <strong className="text-[#111111]">myLISMStation</strong> application to visualize bacterial growth and live chemical inventory.
              </p>
              <div className="flex flex-wrap gap-3 pt-2">
                <button
                  onClick={() => navigate('/customer/orders')}
                  className="bg-black text-white px-5 py-2.5 rounded-[12px] text-xs font-bold flex items-center space-x-2 hover:bg-[#222]"
                >
                  <span>App Store • iOS Lab Client</span>
                </button>
                <button
                  onClick={() => navigate('/customer/orders')}
                  className="bg-black text-white px-5 py-2.5 rounded-[12px] text-xs font-bold flex items-center space-x-2 hover:bg-[#222]"
                >
                  <span>Google Play • Android Client</span>
                </button>
              </div>
            </div>

            <div className="border-t border-[#d1d1d1] pt-8 space-y-4">
              <h3 className="sp-type-headline-md text-2xl sm:text-[33.6px] text-[#3d3d3d]">
                Instant notifications
              </h3>
              <p className="sp-type-body-md text-lg sm:text-[22px] sm:leading-[28px] text-[#3d3d3d]">
                Be immediately informed of temperature peaks, exceeded count thresholds, low stock alerts, or the presence of a contaminant by email or on <strong className="text-[#111111]">myLISMStation</strong> application.
              </p>
              <div className="flex flex-wrap gap-3 pt-2">
                <button
                  onClick={scrollToEditCart}
                  className="sp-btn-primary h-[50px] px-7 text-sm"
                >
                  Open Interactive Edit Cart ↓
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================================
          SECTION 6: "Easily fit in your laboratory" (Region r3)
          12 Culture Media & Reagent Compatibility Grid (PDA, TSA/PCA, MRS, VRBL...)
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
              onClick={() => navigate('/customer/shop')}
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

      {/* =====================================================================
          SECTION 7: DEDICATED INTERACTIVE "EDIT CART" WORKSPACE
          Full cart editor: direct numeric input, +/- steppers, per-item batch/CoA
          notes, quick-add item dropdown, clear cart, fulfillment toggle & checkout
         ===================================================================== */}
      <section
        ref={editCartSectionRef}
        id="edit-cart-section"
        className="scroll-mt-28 sp-card-elevated-light p-7 sm:p-10 border-4 border-[#0e97b0]"
      >
        <div className="flex flex-wrap justify-between items-center gap-4 pb-6 border-b border-black/15">
          <div className="flex items-center space-x-3.5">
            <div className="h-14 w-14 rounded-full bg-[#000000] text-[#27c2d2] flex items-center justify-center shadow-lg">
              <EditIcon className="h-6 w-6" />
            </div>
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-[#0e4e65]">
                Interactive Requisition Editor
              </span>
              <h2 className="sp-type-headline-md text-2xl sm:text-[33.6px] text-[#111111]">
                Edit Cart & Laboratory Requisition
              </h2>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <span className="bg-[#000000] text-white text-sm font-bold px-4 py-2 rounded-full">
              {cartCount} {cartCount === 1 ? 'Unit' : 'Units'} Selected
            </span>
            {cart.length > 0 && (
              <button
                onClick={clearCart}
                className="px-4 py-2 rounded-[20px] bg-[#aa4266] hover:bg-[#8f3554] text-white text-xs font-bold flex items-center transition-colors"
              >
                <TrashIcon className="h-3.5 w-3.5 mr-1.5" /> Clear Entire Cart
              </button>
            )}
          </div>
        </div>

        {orderPlacedSuccess && (
          <div className="my-6 p-5 bg-[#0f9b40] text-white rounded-[20px] flex items-center justify-between text-sm font-bold shadow-lg">
            <div className="flex items-center">
              <CheckCircleIcon className="h-5 w-5 mr-2.5" />
              Order {orderPlacedSuccess} placed! Inventory stock updated and invoice generated.
            </div>
            <button
              onClick={() => navigate('/customer/orders')}
              className="bg-black text-white px-4 py-1.5 rounded-full text-xs"
            >
              View Order →
            </button>
          </div>
        )}

        {/* Quick-Add Bar inside Edit Cart Section */}
        <form
          onSubmit={handleQuickAddItem}
          className="my-6 bg-white/80 p-4 rounded-[24px] border border-black/10 flex flex-wrap items-center justify-between gap-4"
        >
          <div className="flex items-center space-x-2 text-sm font-bold text-[#111111]">
            <PlusIcon className="h-4 w-4 text-[#0e97b0]" />
            <span>Quick-Add Catalog Item to Cart:</span>
          </div>
          <div className="flex flex-wrap items-center gap-3 flex-1 max-w-2xl">
            <select
              value={quickAddId}
              onChange={(e) => setQuickAddId(e.target.value)}
              className="flex-1 min-w-[220px] bg-white border border-black/25 text-[#111111] px-3.5 py-2 text-sm font-medium rounded-none"
            >
              {items.map((it) => (
                <option key={it.id} value={it.id} disabled={it.stock <= 0}>
                  {it.sku} — {it.name} (${it.price.toFixed(2)} / {it.unit}) [
                  {it.stock} in stock]
                </option>
              ))}
            </select>
            <input
              type="number"
              min={1}
              max={50}
              value={quickAddQty}
              onChange={(e) =>
                setQuickAddQty(Math.max(1, parseInt(e.target.value) || 1))
              }
              className="w-20 bg-white border border-black/25 text-[#111111] px-3 py-2 text-sm font-bold text-center rounded-none"
            />
            <button
              type="submit"
              className="sp-btn-primary h-[42px] px-6 text-sm"
            >
              + Add to Cart
            </button>
          </div>
        </form>

        {/* Editable Cart Items Table + Summary */}
        {cart.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-6">
            {/* Left 2 Columns: Line-by-Line Cart Editor */}
            <div className="lg:col-span-2 space-y-4">
              {cart.map((cartItem) => {
                const item = items.find((i) => i.id === cartItem.itemId);
                if (!item) return null;
                return (
                  <div
                    key={cartItem.itemId}
                    className="bg-white rounded-[24px] p-5 shadow-md border border-black/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                  >
                    <div className="flex items-center space-x-4">
                      {item.image ? (
                        <img
                          src={item.image}
                          alt={item.name}
                          className="h-16 w-16 rounded-[14px] object-cover border border-black/10 flex-shrink-0"
                        />
                      ) : (
                        <div className="h-16 w-16 rounded-[14px] bg-gray-200 flex items-center justify-center">
                          <PackageIcon className="h-7 w-7 text-gray-500" />
                        </div>
                      )}
                      <div>
                        <div className="flex items-center space-x-2">
                          <span className="text-[11px] font-bold text-[#0e97b0] uppercase">
                            {item.sku}
                          </span>
                          {item.hazardLevel && item.hazardLevel !== 'None' && (
                            <span className="bg-[#aa4266] text-white text-[10px] font-bold px-2 py-0.5 rounded">
                              {item.hazardLevel}
                            </span>
                          )}
                        </div>
                        <h3 className="font-bold text-base text-[#111111]">
                          {item.name}
                        </h3>
                        <p className="text-xs text-[#3d3d3d]">
                          Unit Price: <strong>${item.price.toFixed(2)}</strong> /{' '}
                          {item.unit} • Available Stock:{' '}
                          <strong>
                            {item.stock} {item.unit}s
                          </strong>
                        </p>
                        {/* Per-item editable batch/CoA instruction */}
                        <div className="mt-2">
                          <input
                            type="text"
                            placeholder="Add custom batch, CoA, or calibration note for this item..."
                            value={itemBatchNotes[item.id] || ''}
                            onChange={(e) =>
                              setItemBatchNotes({
                                ...itemBatchNotes,
                                [item.id]: e.target.value
                              })
                            }
                            className="w-full sm:w-80 bg-gray-100 border border-black/15 text-[#111111] placeholder-gray-500 px-2.5 py-1 text-xs rounded-none"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Right Controls: Stepper, Direct Quantity Input, Line Subtotal & Delete */}
                    <div className="flex sm:flex-col items-center sm:items-end justify-between w-full sm:w-auto gap-3">
                      <div className="flex items-center space-x-1.5 bg-gray-100 p-1.5 rounded-[16px] border border-black/15">
                        <button
                          type="button"
                          onClick={() =>
                            updateCartQuantity(item.id, cartItem.quantity - 1)
                          }
                          className="h-8 w-8 rounded-full bg-white hover:bg-black hover:text-white text-[#111111] font-bold flex items-center justify-center shadow-sm transition-colors"
                          title="Decrease quantity"
                        >
                          <MinusIcon className="h-3.5 w-3.5" />
                        </button>
                        <input
                          type="number"
                          min={1}
                          max={item.stock}
                          value={cartItem.quantity}
                          onChange={(e) =>
                            updateCartQuantity(
                              item.id,
                              parseInt(e.target.value) || 1
                            )
                          }
                          className="w-14 text-center bg-transparent font-bold text-sm text-[#111111] focus:outline-none"
                        />
                        <button
                          type="button"
                          onClick={() =>
                            updateCartQuantity(item.id, cartItem.quantity + 1)
                          }
                          disabled={cartItem.quantity >= item.stock}
                          className="h-8 w-8 rounded-full bg-white hover:bg-black hover:text-white text-[#111111] font-bold flex items-center justify-center shadow-sm transition-colors disabled:opacity-40"
                          title="Increase quantity"
                        >
                          <PlusIcon className="h-3.5 w-3.5" />
                        </button>
                      </div>

                      <div className="flex items-center space-x-3">
                        <span className="text-lg font-bold text-[#111111]">
                          ${(cartItem.quantity * item.price).toFixed(2)}
                        </span>
                        <button
                          type="button"
                          onClick={() => removeFromCart(item.id)}
                          className="p-2 rounded-full bg-[#aa4266]/15 text-[#aa4266] hover:bg-[#aa4266] hover:text-white transition-colors"
                          title="Remove item from cart"
                        >
                          <TrashIcon className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Right Column: Live Order Configuration & Summary */}
            <div className="bg-[#090909] text-white p-6 sm:p-7 rounded-[28px] shadow-2xl flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <span className="text-xs font-bold uppercase tracking-widest text-[#27c2d2]">
                  Live Requisition Summary
                </span>
                <h3 className="text-xl font-bold font-display">
                  Fulfillment & Pricing
                </h3>

                <div>
                  <label className="block text-xs font-semibold text-[#b0b0b0] uppercase mb-1">
                    Delivery Mode
                  </label>
                  <select
                    value={checkoutData.fulfillmentOption}
                    onChange={(e) =>
                      setCheckoutData({
                        ...checkoutData,
                        fulfillmentOption: e.target.value as 'pickup' | 'delivery'
                      })
                    }
                    className="w-full bg-[#131313] border border-[#2d2d2d] text-white px-3 py-2 text-xs rounded-none"
                  >
                    <option value="delivery">
                      ADR Hazmat Fleet Delivery ($
                      {systemConfig.standardShippingFee.toFixed(2)})
                    </option>
                    <option value="pickup">
                      LISM Warehouse Counter Pickup ($0.00)
                    </option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#b0b0b0] uppercase mb-1">
                    Payment Settlement
                  </label>
                  <select
                    value={checkoutData.paymentMethod}
                    onChange={(e) =>
                      setCheckoutData({
                        ...checkoutData,
                        paymentMethod: e.target.value as 'online' | 'cod'
                      })
                    }
                    className="w-full bg-[#131313] border border-[#2d2d2d] text-white px-3 py-2 text-xs rounded-none"
                  >
                    <option value="online">Online Institutional Grant / Card</option>
                    <option value="cod">Cash / Purchase Order on Delivery</option>
                  </select>
                </div>

                <div className="border-t border-[#212121] pt-4 space-y-2 text-sm">
                  <div className="flex justify-between text-[#b0b0b0]">
                    <span>Items Subtotal ({cartCount} units):</span>
                    <span className="text-white font-semibold">
                      ${cartSubtotal.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between text-[#b0b0b0]">
                    <span>Estimated Tax ({systemConfig.taxRate}%):</span>
                    <span className="text-white font-semibold">
                      ${cartTax.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between text-[#b0b0b0]">
                    <span>Hazmat / Cold-Chain Shipping:</span>
                    <span className="text-white font-semibold">
                      ${cartShipping.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between text-xl font-bold text-[#27c2d2] pt-3 border-t border-[#212121]">
                    <span>Total Amount:</span>
                    <span>${cartGrandTotal.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => setShowCheckoutModal(true)}
                className="sp-btn-primary w-full h-[58px] text-base"
              >
                Confirm & Book Order <ArrowRightIcon className="h-5 w-5 ml-1.5" />
              </button>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-[24px] p-10 text-center my-4">
            <ShoppingCartIcon className="h-14 w-14 mx-auto text-gray-400 mb-3" />
            <h3 className="text-lg font-bold text-[#111111]">
              Your laboratory cart is currently empty
            </h3>
            <p className="text-sm text-[#3d3d3d] mt-1 mb-5">
              Use the Quick-Add bar above or select items from the catalog below to populate your requisition.
            </p>
            <button
              onClick={() => {
                addToCart('1', 2);
                addToCart('2', 1);
              }}
              className="sp-btn-ink px-6 py-3 text-sm"
            >
              <RefreshCwIcon className="h-4 w-4 mr-2" /> Load Sample Lab Requisition
            </button>
          </div>
        )}
      </section>

      {/* =====================================================================
          SECTION 8: "Increase your efficiency with one of our 3 ScanStation models"
          + Featured Laboratory Catalog & Recent Orders
         ===================================================================== */}
      <section className="space-y-8">
        <div className="flex flex-wrap justify-between items-end gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-[#27c2d2]">
              Direct Requisition Catalog
            </span>
            <h2 className="sp-type-headline-lg text-3xl sm:text-[44px] text-white mt-1">
              Increase your efficiency with our Lab Catalog
            </h2>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <div className="relative">
              <input
                type="text"
                placeholder="Search items or SKU..."
                className="pl-9 pr-4 py-2 text-sm bg-[#090909] border border-[#2d2d2d] text-white placeholder-[#b0b0b0] rounded-none focus:outline-none focus:border-[#0e97b0]"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <SearchIcon className="absolute left-3 top-2.5 h-4 w-4 text-[#b0b0b0]" />
            </div>
            <select
              className="bg-[#090909] border border-[#2d2d2d] text-white px-3 py-2 text-sm rounded-none focus:outline-none focus:border-[#0e97b0]"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
            >
              <option value="all">All Items</option>
              <option value="chemical">Chemicals</option>
              <option value="equipment">Equipment</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.slice(0, 6).map((item) => {
            const inCartItem = cart.find((c) => c.itemId === item.id);
            return (
              <div
                key={item.id}
                className="bg-[#090909] border border-[#212121] rounded-[32px] overflow-hidden flex flex-col justify-between hover:border-[#0e97b0] transition-all duration-300 group shadow-xl"
              >
                <div>
                  <div className="h-44 bg-[#000000] flex items-center justify-center relative overflow-hidden">
                    {item.image ? (
                      <img
                        src={item.image}
                        alt={item.name}
                        className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <PackageIcon className="h-12 w-12 text-[#5d5d5d]" />
                    )}
                    {item.hazardLevel && item.hazardLevel !== 'None' && (
                      <span className="absolute top-3 right-3 bg-[#aa4266] text-white text-[10px] font-bold px-2.5 py-1 rounded-[10px] shadow flex items-center">
                        <ShieldAlertIcon className="h-3 w-3 mr-1" />
                        {item.hazardLevel}
                      </span>
                    )}
                  </div>
                  <div className="p-6">
                    <span className="text-[10px] font-bold text-[#27c2d2] uppercase tracking-wider">
                      {item.sku}
                    </span>
                    <h3 className="font-bold text-lg text-white line-clamp-1 mt-0.5 font-display">
                      {item.name}
                    </h3>
                    <p className="text-xs text-[#b0b0b0] mb-3">
                      {item.category} • {item.manufacturer}
                    </p>
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-xl text-white">
                        ${item.price.toFixed(2)}
                        <span className="text-xs font-normal text-[#b0b0b0]">
                          /{item.unit}
                        </span>
                      </span>
                      <span
                        className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full ${
                          item.stock > item.lowStockThreshold
                            ? 'bg-[#0f9b40]/25 text-[#4dfd88] border border-[#0f9b40]'
                            : 'bg-[#aa4266]/30 text-[#ff8da8] border border-[#aa4266]'
                        }`}
                      >
                        {item.stock > 0 ? `${item.stock} in stock` : 'Out of stock'}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="p-6 pt-0 flex items-center gap-2">
                  {inCartItem ? (
                    <div className="flex items-center justify-between w-full bg-[#131313] border border-[#0e97b0] rounded-[20px] px-3 py-1.5">
                      <button
                        onClick={() =>
                          updateCartQuantity(item.id, inCartItem.quantity - 1)
                        }
                        className="h-8 w-8 rounded-full bg-black text-white hover:bg-[#aa4266] flex items-center justify-center"
                      >
                        <MinusIcon className="h-3.5 w-3.5" />
                      </button>
                      <span className="text-sm font-bold text-[#27c2d2]">
                        {inCartItem.quantity} in cart
                      </span>
                      <button
                        onClick={() =>
                          updateCartQuantity(item.id, inCartItem.quantity + 1)
                        }
                        className="h-8 w-8 rounded-full bg-black text-white hover:bg-[#0e97b0] flex items-center justify-center"
                      >
                        <PlusIcon className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => addToCart(item.id, 1)}
                      disabled={item.stock <= 0}
                      className="sp-btn-primary w-full py-3 px-4 text-sm"
                    >
                      Add to Cart
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Checkout Modal */}
      {showCheckoutModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-[#090909] border border-[#212121] rounded-[32px] shadow-2xl max-w-lg w-full overflow-hidden text-white">
            <div className="flex justify-between items-center p-6 border-b border-[#212121] bg-[#131313]">
              <h2 className="text-lg font-bold text-white font-display">
                Complete Laboratory Requisition
              </h2>
              <button
                onClick={() => setShowCheckoutModal(false)}
                className="text-[#b0b0b0] hover:text-white"
              >
                <XIcon className="h-5 w-5" />
              </button>
            </div>
            <form onSubmit={handleConfirmCheckout} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[#b0b0b0] uppercase mb-1">
                  Fulfillment Option
                </label>
                <select
                  className="w-full bg-[#000000] border border-[#2d2d2d] text-white px-3 py-2.5 text-sm rounded-none"
                  value={checkoutData.fulfillmentOption}
                  onChange={(e) =>
                    setCheckoutData({
                      ...checkoutData,
                      fulfillmentOption: e.target.value as 'pickup' | 'delivery'
                    })
                  }
                >
                  <option value="delivery">
                    Hazmat / Cold-Chain Fleet Delivery ($
                    {systemConfig.standardShippingFee.toFixed(2)})
                  </option>
                  <option value="pickup">
                    Warehouse Facility Counter Pickup ($0.00)
                  </option>
                </select>
              </div>

              {checkoutData.fulfillmentOption === 'delivery' && (
                <div>
                  <label className="block text-xs font-semibold text-[#b0b0b0] uppercase mb-1">
                    Laboratory Delivery Address *
                  </label>
                  <input
                    type="text"
                    required
                    className="w-full bg-[#000000] border border-[#2d2d2d] text-white px-3 py-2.5 text-sm rounded-none"
                    value={checkoutData.deliveryAddress}
                    onChange={(e) =>
                      setCheckoutData({
                        ...checkoutData,
                        deliveryAddress: e.target.value
                      })
                    }
                  />
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-[#b0b0b0] uppercase mb-1">
                  Payment Method
                </label>
                <select
                  className="w-full bg-[#000000] border border-[#2d2d2d] text-white px-3 py-2.5 text-sm rounded-none"
                  value={checkoutData.paymentMethod}
                  onChange={(e) =>
                    setCheckoutData({
                      ...checkoutData,
                      paymentMethod: e.target.value as 'online' | 'cod'
                    })
                  }
                >
                  <option value="online">
                    Institutional Card / Online Grant Settlement
                  </option>
                  <option value="cod">Cash / PO on Delivery (COD)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#b0b0b0] uppercase mb-1">
                  Special Handling & Compliance Notes
                </label>
                <textarea
                  rows={2}
                  className="w-full bg-[#000000] border border-[#2d2d2d] text-white px-3 py-2 text-sm rounded-none"
                  value={checkoutData.notes}
                  onChange={(e) =>
                    setCheckoutData({ ...checkoutData, notes: e.target.value })
                  }
                />
              </div>

              <div className="bg-[#131313] p-4 rounded-[20px] border border-[#212121] text-sm space-y-1">
                <div className="flex justify-between">
                  <span className="text-[#b0b0b0]">Items Subtotal:</span>
                  <span className="font-medium">${cartSubtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#b0b0b0]">
                    Tax ({systemConfig.taxRate}%):
                  </span>
                  <span className="font-medium">${cartTax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#b0b0b0]">Shipping & Hazmat Handling:</span>
                  <span className="font-medium">${cartShipping.toFixed(2)}</span>
                </div>
                <div className="flex justify-between font-bold text-base text-[#27c2d2] pt-2 border-t border-[#212121]">
                  <span>Final Order Total:</span>
                  <span>${cartGrandTotal.toFixed(2)}</span>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowCheckoutModal(false)}
                  className="sp-btn-outline px-5 py-2.5 text-sm"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="sp-btn-primary px-6 py-2.5 text-sm"
                >
                  Confirm & Place Order
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
