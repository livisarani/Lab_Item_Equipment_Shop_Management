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
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">
          Messages & Support Tickets
        </h1>
        <p className="text-sm text-gray-500">
          Real-time communication with laboratory customers, inventory warehouse, and delivery staff
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Conversation List */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="p-4 border-b border-gray-200 bg-gray-50">
            <div className="relative">
              <input
                type="text"
                placeholder="Search threads or tickets..."
                className="pl-9 pr-4 py-2 w-full border border-gray-300 rounded-lg text-sm focus:ring-blue-500 focus:border-blue-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <SearchIcon className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
            </div>
          </div>
          <div className="divide-y divide-gray-200 max-h-[540px] overflow-y-auto">
            {filteredConversations.map((conv) => (
              <div
                key={conv.id}
                onClick={() => setSelectedConversationId(conv.id)}
                className={`p-4 cursor-pointer hover:bg-gray-50 transition-colors ${
                  selectedConversationId === conv.id ? 'bg-blue-50 border-l-4 border-blue-600' : ''
                }`}
              >
                <div className="flex justify-between items-start mb-1">
                  <div>
                    <h3 className="font-semibold text-sm text-gray-900">
                      {conv.user}
                    </h3>
                    <p className="text-xs text-blue-600 font-medium">
                      {conv.subject}
                    </p>
                  </div>
                  <span className="text-xs text-gray-400">{conv.time}</span>
                </div>
                <p className="text-xs text-gray-600 truncate mt-1">
                  {conv.lastMessage}
                </p>
                <div className="flex items-center justify-between mt-2">
                  <span
                    className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                      conv.status === 'Resolved'
                        ? 'bg-green-100 text-green-800'
                        : conv.status === 'In Progress'
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-amber-100 text-amber-800'
                    }`}
                  >
                    {conv.status}
                  </span>
                  {conv.unread && (
                    <span className="px-2 py-0.5 bg-blue-600 text-white text-[10px] font-bold rounded-full">
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
          className="lg:col-span-2 bg-white rounded-lg shadow-sm border border-gray-200 flex flex-col"
          style={{ height: '600px' }}
        >
          {activeConversation ? (
            <>
              <div className="p-4 border-b border-gray-200 flex justify-between items-center bg-gray-50">
                <div>
                  <h2 className="font-bold text-gray-900">
                    {activeConversation.user}{' '}
                    <span className="text-xs font-normal text-gray-500">
                      ({activeConversation.organization || activeConversation.role})
                    </span>
                  </h2>
                  <p className="text-xs text-blue-700 font-medium">
                    Subject: {activeConversation.subject}
                  </p>
                </div>
                {activeConversation.status !== 'Resolved' && (
                  <button
                    onClick={() => resolveConversation(activeConversation.id)}
                    className="px-3 py-1.5 bg-green-600 hover:bg-green-700 text-white text-xs font-medium rounded-lg flex items-center"
                  >
                    <CheckCircleIcon className="h-3.5 w-3.5 mr-1" /> Mark Resolved
                  </button>
                )}
              </div>

              <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50/40">
                {activeConversation.messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex ${msg.isOwn ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-md px-4 py-2.5 rounded-xl shadow-sm ${
                        msg.isOwn
                          ? 'bg-blue-600 text-white'
                          : 'bg-white border border-gray-200 text-gray-900'
                      }`}
                    >
                      <p
                        className={`text-[11px] font-semibold mb-0.5 ${
                          msg.isOwn ? 'text-blue-100' : 'text-blue-600'
                        }`}
                      >
                        {msg.sender}
                      </p>
                      <p className="text-sm">{msg.text}</p>
                      <p
                        className={`text-[10px] mt-1 text-right ${
                          msg.isOwn ? 'text-blue-200' : 'text-gray-400'
                        }`}
                      >
                        {msg.time}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <form onSubmit={handleSend} className="p-4 border-t border-gray-200 bg-white">
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Type a reply to this thread..."
                    className="flex-1 border border-gray-300 rounded-lg px-4 py-2 text-sm focus:ring-blue-500 focus:border-blue-500"
                    value={messageText}
                    onChange={(e) => setMessageText(e.target.value)}
                  />
                  <button
                    type="submit"
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center text-sm font-medium"
                  >
                    <SendIcon className="h-4 w-4 mr-1.5" /> Send
                  </button>
                </div>
              </form>
            </>
          ) : (
            <div className="flex items-center justify-center h-full text-gray-500">
              Select a conversation thread to start messaging
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
