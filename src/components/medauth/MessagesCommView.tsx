import React, { useState } from 'react';
import {
  MessageSquare,
  Send,
  User,
  Shield,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  Paperclip,
  Tag,
  Sparkles,
  Phone,
  Plus
} from 'lucide-react';
import { ClinicalMessage, DoctorProfile } from '../../types/medauth';
import { sampleMessages } from '../../data/samplePatients';

interface MessagesCommViewProps {
  doctor: DoctorProfile;
}

export const MessagesCommView: React.FC<MessagesCommViewProps> = ({ doctor }) => {
  const [messages, setMessages] = useState<ClinicalMessage[]>(sampleMessages);
  const [selectedMessageId, setSelectedMessageId] = useState<string>(sampleMessages[0].id);
  const [replyText, setReplyText] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  const activeMsg = messages.find((m) => m.id === selectedMessageId) || messages[0];

  const handleSendReply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyText.trim()) return;

    // Simulate response
    setReplyText('');
    alert(`Encrypted response sent to ${activeMsg.senderName}.`);
  };

  const filteredMessages = messages.filter((m) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      m.senderName.toLowerCase().includes(q) ||
      m.subject.toLowerCase().includes(q) ||
      m.message.toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-[11px] font-bold mb-1">
            <MessageSquare className="w-3.5 h-3.5" />
            <span>Encrypted Provider Inbox</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
            Messages & Clinical Communications
          </h2>
          <p className="text-xs text-slate-600 mt-0.5">
            HIPAA-compliant direct messaging with pharmacy teams, patients, and specialist networks.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-mono text-emerald-800 font-bold bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-xl">
            {messages.filter((m) => m.unread).length} Unread Directives
          </span>
        </div>
      </div>

      {/* Two-Pane Messaging Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        
        {/* Left Pane: Message Threads List */}
        <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs space-y-3">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search messages, patients..."
              className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl text-slate-900 focus:outline-none focus:border-emerald-600"
            />
          </div>

          <div className="space-y-2 max-h-[500px] overflow-y-auto pr-1">
            {filteredMessages.map((msg) => {
              const isSelected = msg.id === activeMsg.id;
              return (
                <button
                  key={msg.id}
                  onClick={() => setSelectedMessageId(msg.id)}
                  className={`w-full text-left p-3.5 rounded-xl border transition cursor-pointer space-y-1.5 ${
                    isSelected
                      ? 'bg-emerald-50/80 border-emerald-400 shadow-2xs'
                      : 'bg-white border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-start justify-between gap-1">
                    <span className="text-xs font-bold text-slate-900 truncate">
                      {msg.senderName}
                    </span>
                    <span className="text-[10px] font-mono text-slate-400 shrink-0">
                      {msg.timestamp}
                    </span>
                  </div>

                  <h4 className="text-xs font-semibold text-slate-700 truncate">
                    {msg.subject}
                  </h4>

                  <p className="text-[11px] text-slate-500 line-clamp-2 leading-relaxed">
                    {msg.message}
                  </p>

                  <div className="flex items-center justify-between pt-1 text-[10px]">
                    <span className="bg-slate-200 text-slate-700 px-2 py-0.5 rounded font-mono font-medium">
                      {msg.tag}
                    </span>
                    {msg.unread && (
                      <span className="text-emerald-700 font-bold font-mono">● NEW</span>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right Pane: Thread Detail & Reply Composer */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex flex-col justify-between space-y-5">
          <div className="space-y-4">
            {/* Header */}
            <div className="flex items-start justify-between border-b border-slate-200 pb-4">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                  {activeMsg.tag}
                </span>
                <h3 className="text-base font-bold text-slate-900 mt-2">
                  {activeMsg.subject}
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  From: <strong className="text-slate-800">{activeMsg.senderName}</strong> ({activeMsg.senderRole}) • Received: <span className="font-mono">{activeMsg.timestamp}</span>
                </p>
              </div>

              <span className="text-xs font-mono text-slate-400">ID: {activeMsg.id}</span>
            </div>

            {/* Original Message Card */}
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-700 leading-relaxed">
              <p className="whitespace-pre-line">{activeMsg.message}</p>
            </div>
          </div>

          {/* Reply Form */}
          <form onSubmit={handleSendReply} className="space-y-3 pt-3 border-t border-slate-200">
            <label className="text-xs font-bold text-slate-900 block">
              Quick Encrypted Response from {doctor.fullName}
            </label>
            <textarea
              rows={3}
              required
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              placeholder="Type clinical directive, refill approval or patient message..."
              className="w-full p-3 text-xs bg-slate-50 border border-slate-300 rounded-xl text-slate-900 focus:outline-none focus:border-emerald-600 leading-relaxed"
            />

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-[11px] text-slate-500">
                <Shield className="w-3.5 h-3.5 text-emerald-600" />
                <span>End-to-End Cryptographically Signed</span>
              </div>

              <button
                type="submit"
                className="flex items-center gap-1.5 px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold rounded-xl transition shadow-2xs cursor-pointer"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Dispatch Response</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
