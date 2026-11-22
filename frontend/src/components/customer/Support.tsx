import React, { useState } from 'react';
import { useAppContext } from '../../context/AppContext';
import { SendIcon, CheckCircleIcon, MessageSquareIcon } from 'lucide-react';

export const Support: React.FC = () => {
  const { createSupportTicket, conversations, systemConfig } = useAppContext();
  const [subject, setSubject] = useState('');
  const [category, setCategory] = useState('SDS & Certificate of Analysis (CoA)');
  const [priority, setPriority] = useState<'Low' | 'Normal' | 'High' | 'Urgent'>('Normal');
  const [message, setMessage] = useState('');
  const [submittedBanner, setSubmittedBanner] = useState(false);

  const myTickets = conversations.filter((c) => c.userId === '3');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createSupportTicket(subject, category, priority, message);
    setSubject('');
    setMessage('');
    setSubmittedBanner(true);
    setTimeout(() => setSubmittedBanner(false), 4000);
  };

  return (
    <div className="space-y-10">
      <div>
        <span className="text-xs font-bold uppercase tracking-widest text-[#27c2d2]">
          R&D & Regulatory Assistance
        </span>
        <h1 className="sp-type-headline-lg text-3xl sm:text-[46px] text-white mt-1">
          Stay connected to your lab
        </h1>
        <p className="text-sm text-[#b0b0b0] mt-1">
          Request Safety Data Sheets (SDS), Certificates of Analysis (CoA), GMP Annex 1 validation, or hazmat delivery assistance
        </p>
      </div>

      {submittedBanner && (
        <div className="p-4 bg-[#0f9b40]/20 border border-[#0f9b40] rounded-[20px] flex items-center text-white text-sm font-medium">
          <CheckCircleIcon className="h-5 w-5 mr-2.5 text-[#4dfd88]" />
          Your support ticket has been routed directly to the Operations Manager (visible in Manager → Messages)!
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left: Dark Obsidian Ticket Submission Panel */}
        <div className="sp-card-dark p-6 sm:p-8">
          <h2 className="text-xl font-bold text-white mb-5 font-display">
            Submit an R&D / Compliance Ticket
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-[#b0b0b0] uppercase mb-1">
                Subject *
              </label>
              <input
                type="text"
                placeholder="e.g. Requesting CoA for Lot LOT-SA-2026-089"
                className="w-full bg-[#000000] border border-[#2d2d2d] text-white placeholder-[#b0b0b0] px-3.5 py-2.5 text-sm rounded-none focus:outline-none focus:border-[#0e97b0]"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                required
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-[#b0b0b0] uppercase mb-1">
                  Inquiry Category
                </label>
                <select
                  className="w-full bg-[#000000] border border-[#2d2d2d] text-white px-3 py-2.5 text-sm rounded-none focus:outline-none focus:border-[#0e97b0]"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                >
                  <option value="SDS & Certificate of Analysis (CoA)">
                    SDS & Certificate of Analysis (CoA)
                  </option>
                  <option value="Delivery & Hazmat Logistics">
                    Delivery & Hazmat Logistics
                  </option>
                  <option value="Instrument Calibration & Warranty">
                    Instrument Calibration & Warranty
                  </option>
                  <option value="Billing & Institutional Tax Invoice">
                    Billing & Institutional Tax Invoice
                  </option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#b0b0b0] uppercase mb-1">
                  Priority Level
                </label>
                <select
                  className="w-full bg-[#000000] border border-[#2d2d2d] text-white px-3 py-2.5 text-sm rounded-none focus:outline-none focus:border-[#0e97b0]"
                  value={priority}
                  onChange={(e) =>
                    setPriority(
                      e.target.value as 'Low' | 'Normal' | 'High' | 'Urgent'
                    )
                  }
                >
                  <option value="Low">Low</option>
                  <option value="Normal">Normal</option>
                  <option value="High">High</option>
                  <option value="Urgent">Urgent (Hazmat / Cold-Chain)</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#b0b0b0] uppercase mb-1">
                Detailed Message *
              </label>
              <textarea
                rows={5}
                placeholder="Describe your order ID, batch number, or technical question..."
                className="w-full bg-[#000000] border border-[#2d2d2d] text-white placeholder-[#b0b0b0] px-3.5 py-2.5 text-sm rounded-none focus:outline-none focus:border-[#0e97b0]"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                required
              ></textarea>
            </div>

            <button
              type="submit"
              className="sp-btn-primary w-full h-[54px] text-base"
            >
              <SendIcon className="h-4 w-4 mr-2" /> Send Message
            </button>
          </form>

          {/* My Active Support Threads */}
          <div className="mt-8 pt-6 border-t border-[#212121]">
            <h3 className="font-bold text-sm text-white mb-3 flex items-center">
              <MessageSquareIcon className="h-4 w-4 mr-1.5 text-[#27c2d2]" />
              My Active Support Threads ({myTickets.length})
            </h3>
            <div className="space-y-3 max-h-60 overflow-y-auto">
              {myTickets.map((t) => (
                <div
                  key={t.id}
                  className="p-3.5 rounded-[20px] bg-[#131313] border border-[#212121] text-xs"
                >
                  <div className="flex justify-between items-center mb-1">
                    <span className="font-bold text-white">{t.subject}</span>
                    <span className="px-2.5 py-0.5 rounded-full bg-[#0e97b0] text-white font-bold">
                      {t.status}
                    </span>
                  </div>
                  <p className="text-[#b0b0b0]">Latest: {t.lastMessage}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right: High-Contrast White/Light Section Band (Region r2 "Stay connected to your lab" recipe) */}
        <div className="space-y-6">
          <div className="bg-white text-[#111111] p-7 sm:p-8 rounded-[40px] shadow-2xl">
            <span className="inline-block bg-[#27c2d2] text-white text-xs font-bold uppercase px-3 py-1 rounded-full mb-3">
              NEW
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-[#111111] mb-4 font-display">
              Visualize your analyses & SDS remotely
            </h2>
            <div className="space-y-5 text-sm text-[#3d3d3d]">
              <div>
                <h3 className="font-bold text-base text-[#111111] mb-1">
                  Safety Data Sheets (SDS) & Certificates of Analysis (CoA)
                </h3>
                <p className="leading-relaxed">
                  Every chemical batch includes a printed CoA & SDS in the shipping pouch, or you can request digital 21 CFR Part 11 signed PDFs by referencing the Batch/Lot number.
                </p>
              </div>
              <div>
                <h3 className="font-bold text-base text-[#111111] mb-1">
                  Corrosive & Flammable Chemical Deliveries
                </h3>
                <p className="leading-relaxed">
                  Restricted reagents require an active BSL/OSHA clearance on your account and are delivered via LISM ADR-certified hazmat couriers with secondary containment.
                </p>
              </div>
              <div>
                <h3 className="font-bold text-base text-[#111111] mb-1">
                  ISO-17025 Optical & Metrology Calibration
                </h3>
                <p className="leading-relaxed">
                  All balances, centrifuges, thermal cyclers, and spectrophotometers ship with an ISO-17025 traceable factory calibration certificate.
                </p>
              </div>
            </div>
          </div>

          <div className="sp-card-dark p-6 sm:p-8">
            <h2 className="text-lg font-bold text-white mb-4 font-display">
              LISM Interscience Contact Information
            </h2>
            <div className="space-y-2.5 text-sm text-[#b0b0b0]">
              <p>
                <span className="font-bold text-white">Operations Email:</span>{' '}
                {systemConfig.companyEmail}
              </p>
              <p>
                <span className="font-bold text-white">24/7 Lab Hotline:</span>{' '}
                {systemConfig.companyPhone}
              </p>
              <p>
                <span className="font-bold text-white">Facility Address:</span>{' '}
                {systemConfig.companyAddress}
              </p>
              <p>
                <span className="font-bold text-white">Dispatch Hours:</span>{' '}
                Mon–Fri, 7:30 AM – 6:00 PM
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
