import React, { useState } from 'react';
import { 
  Send, 
  Search, 
  ShieldCheck, 
  MoreHorizontal, 
  Paperclip, 
  Smile, 
  CheckCheck, 
  CheckCircle2, 
  AlertTriangle,
  UserX,
  PhoneCall
} from 'lucide-react';
import { Conversation, DirectMessage } from './CommunityTypes';
import { useLocalization } from '../../context/LocalizationContext';

interface CommunityMessagesProps {
  conversations: Conversation[];
  onSendMessage: (conversationId: string, text: string) => void;
  onOpenUserProfile: (username: string) => void;
}

export const CommunityMessages: React.FC<CommunityMessagesProps> = ({
  conversations,
  onSendMessage,
  onOpenUserProfile
}) => {
  const { t } = useLocalization();
  const [selectedConvId, setSelectedConvId] = useState<string>(conversations[0]?.id || '');
  const [messageInput, setMessageInput] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  const activeConv = conversations.find(c => c.id === selectedConvId) || conversations[0];

  const handleSend = () => {
    if (!messageInput.trim() || !activeConv) return;
    onSendMessage(activeConv.id, messageInput.trim());
    setMessageInput('');
  };

  const filteredConversations = conversations.filter(c => 
    c.participant.displayName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.participant.username.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden h-[750px] flex flex-col md:flex-row">
      {/* Left Sidebar: Conversations list */}
      <div className="w-full md:w-80 lg:w-96 border-r border-slate-200 flex flex-col bg-slate-50/50">
        {/* Search */}
        <div className="p-4 border-b border-slate-200">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t('Search conversations...')}
              className="w-full pl-9 pr-4 py-2 rounded-xl bg-white border border-slate-200 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-violet-500/40"
            />
          </div>
        </div>

        {/* Conversations List */}
        <div className="flex-1 overflow-y-auto divide-y divide-slate-100">
          {filteredConversations.map((conv) => {
            const isSelected = conv.id === selectedConvId;
            return (
              <button
                key={conv.id}
                onClick={() => setSelectedConvId(conv.id)}
                className={`w-full p-4 text-left flex items-start gap-3 transition cursor-pointer ${
                  isSelected ? 'bg-violet-50/80 border-l-4 border-l-violet-600' : 'hover:bg-slate-100/70'
                }`}
              >
                <div className="relative shrink-0">
                  <img
                    src={conv.participant.avatar}
                    alt={conv.participant.displayName}
                    className="h-11 w-11 rounded-full object-cover ring-1 ring-slate-200"
                  />
                  {conv.participant.isVerified && (
                    <div className="absolute -bottom-1 -right-1 bg-violet-600 rounded-full p-0.5 text-white">
                      <CheckCircle2 className="h-3 w-3" />
                    </div>
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-1 mb-1">
                    <span className="text-xs font-bold text-slate-900 truncate">
                      {conv.participant.displayName}
                    </span>
                    <span className="text-[10px] text-slate-400 shrink-0">{conv.lastMessageTime}</span>
                  </div>

                  <p className="text-xs text-slate-600 truncate leading-snug">
                    {conv.lastMessage}
                  </p>

                  {conv.unreadCount > 0 && (
                    <span className="inline-block mt-1 px-1.5 py-0.2 rounded-full bg-violet-600 text-white text-[10px] font-bold">
                      {conv.unreadCount}
                    </span>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Right Chat Pane */}
      {activeConv ? (
        <div className="flex-1 flex flex-col h-full bg-white">
          {/* Chat Header */}
          <div className="p-4 border-b border-slate-200 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button
                onClick={() => onOpenUserProfile(activeConv.participant.username)}
                className="cursor-pointer"
              >
                <img
                  src={activeConv.participant.avatar}
                  alt={activeConv.participant.displayName}
                  className="h-10 w-10 rounded-full object-cover"
                />
              </button>
              <div>
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => onOpenUserProfile(activeConv.participant.username)}
                    className="text-xs font-bold text-slate-900 hover:text-violet-700 transition cursor-pointer"
                  >
                    {activeConv.participant.displayName}
                  </button>
                  {activeConv.participant.isVerified && (
                    <CheckCircle2 className="h-3.5 w-3.5 text-violet-600" />
                  )}
                </div>
                <div className="text-[11px] text-slate-500">{activeConv.participant.roleLabel}</div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-100">
                <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
                <span>{t('Encrypted & Safe')}</span>
              </span>
            </div>
          </div>

          {/* Safety Disclaimer Banner */}
          <div className="bg-amber-50/70 px-4 py-2 border-b border-amber-200/50 flex items-center gap-2 text-[11px] text-amber-900">
            <AlertTriangle className="h-3.5 w-3.5 text-amber-600 shrink-0" />
            <span>{t('Safety Reminder: Direct messages are for peer exchange only. For medical emergencies, always call 911 or 112 immediately.')}</span>
          </div>

          {/* Messages Feed */}
          <div className="flex-1 p-6 overflow-y-auto space-y-4 bg-slate-50/30">
            {activeConv.messages.map((msg) => {
              const isMine = msg.senderId === 'user-current';
              return (
                <div
                  key={msg.id}
                  className={`flex flex-col ${isMine ? 'items-end' : 'items-start'}`}
                >
                  <div
                    className={`max-w-[80%] sm:max-w-md p-3.5 rounded-2xl text-xs leading-relaxed ${
                      isMine
                        ? 'bg-violet-700 text-white rounded-br-xs shadow-2xs'
                        : 'bg-white text-slate-900 border border-slate-200 rounded-bl-xs shadow-2xs'
                    }`}
                  >
                    {msg.text}
                  </div>
                  <div className="flex items-center gap-1 text-[10px] text-slate-400 mt-1 px-1">
                    <span>{msg.timestamp}</span>
                    {isMine && <CheckCheck className="h-3 w-3 text-violet-600" />}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Chat Input Bar */}
          <div className="p-4 border-t border-slate-200 bg-white">
            <div className="flex items-center gap-2">
              <button className="p-2 text-slate-400 hover:text-slate-600 transition cursor-pointer">
                <Paperclip className="h-4 w-4" />
              </button>

              <input
                type="text"
                value={messageInput}
                onChange={(e) => setMessageInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleSend();
                }}
                placeholder={t('Type a message to collaborate...')}
                className="flex-1 px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-violet-500/40"
              />

              <button
                onClick={handleSend}
                disabled={!messageInput.trim()}
                className={`p-2.5 rounded-xl text-white transition cursor-pointer shadow-2xs ${
                  messageInput.trim() ? 'bg-violet-700 hover:bg-violet-600' : 'bg-slate-300 opacity-60 cursor-not-allowed'
                }`}
              >
                <Send className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex-1 flex items-center justify-center p-8 text-slate-400">
          {t('Select a conversation to start messaging.')}
        </div>
      )}
    </div>
  );
};
