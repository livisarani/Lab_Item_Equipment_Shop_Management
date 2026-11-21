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
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">
          Customer Support & Compliance Helpdesk
        </h1>
        <p className="text-sm text-gray-500">
          Request Safety Data Sheets (SDS), Certificates of Analysis (CoA), calibration support, or hazmat delivery assistance
        </p>
      </div>

      {submittedBanner && (
        <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center text-green-800 text-sm font-medium">
          <CheckCircleIcon className="h-5 w-5 mr-2 text-green-600" />
          Your support ticket has been routed directly to the Operations Manager (visible in Manager → Messages)!
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h2 className="text-lg font-semibold mb-4">Submit a Support Ticket</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Subject *
              </label>
              <input
                type="text"
                placeholder="e.g. Requesting CoA for Lot LOT-SA-2026-089"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-blue-500 focus:border-blue-500"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                required
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Inquiry Category
                </label>
                <select
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
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
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Priority Level
                </label>
                <select
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
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
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Detailed Message *
              </label>
              <textarea
                rows={5}
                placeholder="Describe your order ID, batch number, or technical question..."
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-blue-500 focus:border-blue-500"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                required
              ></textarea>
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2.5 px-4 rounded-lg flex items-center justify-center font-medium text-sm"
            >
              <SendIcon className="h-4 w-4 mr-2" /> Submit Support Ticket
            </button>
          </form>

          {/* My Active Support Threads */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            <h3 className="font-semibold text-sm text-gray-900 mb-3 flex items-center">
              <MessageSquareIcon className="h-4 w-4 mr-1.5 text-blue-600" />
              My Support Threads ({myTickets.length})
            </h3>
            <div className="space-y-3 max-h-60 overflow-y-auto">
              {myTickets.map((t) => (
                <div
                  key={t.id}
                  className="p-3 rounded-lg bg-gray-50 border border-gray-200 text-xs"
                >
                  <div className="flex justify-between items-center mb-1">
                    <span className="font-semibold text-gray-900">{t.subject}</span>
                    <span className="px-2 py-0.5 rounded-full bg-blue-100 text-blue-800 font-semibold">
                      {t.status}
                    </span>
                  </div>
                  <p className="text-gray-600">Latest: {t.lastMessage}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <h2 className="text-lg font-semibold mb-4">
              Frequently Asked Questions
            </h2>
            <div className="space-y-4">
              <div>
                <h3 className="font-medium text-sm mb-1">
                  How do I obtain Safety Data Sheets (SDS) and Certificates of Analysis (CoA)?
                </h3>
                <p className="text-xs text-gray-600">
                  Every chemical batch includes a printed CoA & SDS in the shipping pouch, or you can request digital PDFs by referencing the Batch/Lot number above.
                </p>
              </div>
              <div>
                <h3 className="font-medium text-sm mb-1">
                  What are the requirements for Corrosive & Flammable chemical deliveries?
                </h3>
                <p className="text-xs text-gray-600">
                  Restricted reagents require an active BSL/OSHA clearance on your account and are delivered via LISM ADR-certified hazmat couriers with secondary containment.
                </p>
              </div>
              <div>
                <h3 className="font-medium text-sm mb-1">
                  Are optical and analytical equipment items pre-calibrated?
                </h3>
                <p className="text-xs text-gray-600">
                  Yes, all balances, centrifuges, thermal cyclers, and spectrophotometers ship with an ISO-17025 traceable calibration certificate.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <h2 className="text-lg font-semibold mb-4">
              LISM Scientific Contact Information
            </h2>
            <div className="space-y-2 text-sm text-gray-700">
              <p>
                <span className="font-semibold">Operations Email:</span>{' '}
                {systemConfig.companyEmail}
              </p>
              <p>
                <span className="font-semibold">24/7 Lab Hotline:</span>{' '}
                {systemConfig.companyPhone}
              </p>
              <p>
                <span className="font-semibold">Facility Address:</span>{' '}
                {systemConfig.companyAddress}
              </p>
              <p>
                <span className="font-semibold">Dispatch Hours:</span> Mon–Fri, 7:30 AM – 6:00 PM
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
