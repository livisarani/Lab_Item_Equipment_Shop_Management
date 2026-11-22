import React, { useState } from 'react';
import { useAppContext } from '../../context/AppContext';
import { SendIcon, SearchIcon, CheckCircleIcon } from 'lucide-react';

export const Messages: React.FC = () => {
  const { conversations, sendMessage, resolveConversation } = useAppContext();
  const [selectedConversationId, setSelectedConversationId] = useState<string>(
    conversations[0]?.id || '1'
  );
  const [searchTerm, setSearchTerm] = useState('');
  const [messageText, setMessageText] = useState('');

  const filteredConversations = conversations.filter(
    (c) =>
      c.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.lastMessage.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const activeConversation = conversations.find(
    (c) => c.id === selectedConversationId
  );

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeConversation || !messageText.trim()) return;
    sendMessage(activeConversation.id, messageText, 'Marcus Sterling (Manager)', true);
    setMessageText('');
  };

  return (
    <div className="space-y-8">
      <div>
        <span className="text-xs font-bold uppercase tracking-widest text-[#27c2d2]">
          Real-Time Lab Communications
        </span>
        <h1 className="sp-type-headline-lg text-3xl sm:text-[46px] text-white mt-1">
          Messages & Support Tickets
        </h1>
        <p className="text-sm text-[#b0b0b0] mt-1">
          Direct communication with laboratory customers, inventory warehouse, and delivery staff
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Conversation List */}
        <div className="sp-card-dark overflow-hidden">
          <div className="p-4 border-b border-[#212121] bg-[#131313]">
            <div className="relative">
              <input
                type="text"
                placeholder="Search threads or tickets..."
                className="pl-10 pr-4 py-2.5 w-full bg-[#000000] border border-[#2d2d2d] text-white placeholder-[#b0b0b0] rounded-none text-sm focus:outline-none focus:border-[#0e97b0]"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <SearchIcon className="absolute left-3.5 top-3 h-4 w-4 text-[#b0b0b0]" />
            </div>
          </div>
          <div className="divide-y divide-[#212121] max-h-[540px] overflow-y-auto">
            {filteredConversations.map((conv) => (
              <div
                key={conv.id}
                onClick={() => setSelectedConversationId(conv.id)}
                className={`p-4 cursor-pointer hover:bg-[#131313] transition-colors ${
                  selectedConversationId === conv.id
                    ? 'bg-[#0e4e65]/30 border-l-4 border-[#27c2d2]'
                    : ''
                }`}
              >
                <div className="flex justify-between items-start mb-1">
                  <div>
                    <h3 className="font-bold text-sm text-white">{conv.user}</h3>
                    <p className="text-xs text-[#27c2d2] font-semibold">
                      {conv.subject}
                    </p>
                  </div>
                  <span className="text-xs text-[#b0b0b0]">{conv.time}</span>
                </div>
                <p className="text-xs text-[#b0b0b0] truncate mt-1">
                  {conv.lastMessage}
                </p>
                <div className="flex items-center justify-between mt-2.5">
                  <span
                    className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${
                      conv.status === 'Resolved'
                        ? 'bg-[#0f9b40]/30 text-[#4dfd88]'
                        : conv.status === 'In Progress'
                        ? 'bg-[#0e97b0]/30 text-[#27c2d2]'
                        : 'bg-[#aa4266] text-white'
                    }`}
                  >
                    {conv.status}
                  </span>
                  {conv.unread && (
                    <span className="px-2 py-0.5 bg-[#27c2d2] text-black text-[10px] font-bold rounded-full">
                      New
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Active Conversation Thread */}
        <div
          className="lg:col-span-2 sp-card-dark flex flex-col overflow-hidden"
          style={{ height: '600px' }}
        >
          {activeConversation ? (
            <>
              <div className="p-5 border-b border-[#212121] flex justify-between items-center bg-[#131313]">
                <div>
                  <h2 className="font-bold text-white font-display">
                    {activeConversation.user}{' '}
                    <span className="text-xs font-normal text-[#b0b0b0]">
                      ({activeConversation.organization || activeConversation.role})
                    </span>
                  </h2>
                  <p className="text-xs text-[#27c2d2] font-semibold mt-0.5">
                    Subject: {activeConversation.subject}
                  </p>
                </div>
                {activeConversation.status !== 'Resolved' && (
                  <button
                    onClick={() => resolveConversation(activeConversation.id)}
                    className="px-4 py-2 bg-[#0f9b40] hover:bg-[#27b064] text-white text-xs font-bold rounded-[20px] flex items-center transition-colors"
                  >
                    <CheckCircleIcon className="h-3.5 w-3.5 mr-1.5" /> Mark Resolved
                  </button>
                )}
              </div>

              <div className="flex-1 overflow-y-auto p-5 space-y-4 bg-[#000000]/60">
                {activeConversation.messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex ${msg.isOwn ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-md px-5 py-3 rounded-[24px] shadow-md ${
                        msg.isOwn
                          ? 'bg-[#0e97b0] text-white'
                          : 'bg-[#131313] border border-[#212121] text-white'
                      }`}
                    >
                      <p
                        className={`text-[11px] font-bold mb-0.5 ${
                          msg.isOwn ? 'text-white/90' : 'text-[#27c2d2]'
                        }`}
                      >
                        {msg.sender}
                      </p>
                      <p className="text-sm leading-relaxed">{msg.text}</p>
                      <p
                        className={`text-[10px] mt-1 text-right ${
                          msg.isOwn ? 'text-white/75' : 'text-[#b0b0b0]'
                        }`}
                      >
                        {msg.time}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <form
                onSubmit={handleSend}
                className="p-4 border-t border-[#212121] bg-[#131313]"
              >
                <div className="flex gap-3">
                  <input
                    type="text"
                    placeholder="Type a reply to this thread..."
                    className="flex-1 bg-[#000000] border border-[#2d2d2d] text-white placeholder-[#b0b0b0] px-4 py-2.5 text-sm rounded-none focus:outline-none focus:border-[#0e97b0]"
                    value={messageText}
                    onChange={(e) => setMessageText(e.target.value)}
                  />
                  <button
                    type="submit"
                    className="sp-btn-primary px-6 py-2.5 text-sm"
                  >
                    <SendIcon className="h-4 w-4 mr-1.5" /> Send
                  </button>
                </div>
              </form>
            </>
          ) : (
            <div className="flex items-center justify-center h-full text-[#b0b0b0]">
              Select a conversation thread to start messaging
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
