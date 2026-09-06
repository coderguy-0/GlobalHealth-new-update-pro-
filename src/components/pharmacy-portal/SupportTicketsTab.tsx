import React, { useState } from 'react';
import { 
  HelpCircle, 
  Plus, 
  MessageSquare, 
  Send, 
  Clock, 
  CheckCircle2, 
  ShieldCheck, 
  AlertCircle,
  X 
} from 'lucide-react';
import { SupportTicketItem } from '../../types/pharmacyPortal';
import { PharmacyPortalService } from '../../services/pharmacyPortalStore';

interface SupportTicketsTabProps {
  tickets: SupportTicketItem[];
  onTicketsUpdated: () => void;
}

export const SupportTicketsTab: React.FC<SupportTicketsTabProps> = ({
  tickets,
  onTicketsUpdated
}) => {
  const [isNewTicketModal, setIsNewTicketModal] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState<SupportTicketItem>(tickets[0] || null);
  const [replyText, setReplyText] = useState('');

  // New ticket state
  const [subject, setSubject] = useState('');
  const [category, setCategory] = useState('Prescription Clarification');
  const [priority, setPriority] = useState('Medium');
  const [message, setMessage] = useState('');

  const handleCreateTicket = (e: React.FormEvent) => {
    e.preventDefault();
    const newT = PharmacyPortalService.createTicket(subject, category as any, priority as any, message);
    setSelectedTicket(newT);
    setIsNewTicketModal(false);
    setSubject('');
    setMessage('');
    onTicketsUpdated();
  };

  const handleSendReply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyText.trim() || !selectedTicket) return;

    selectedTicket.messages.push({
      sender: 'Pharmacy',
      senderName: 'Dr. S. K. Ramanathan (Owner)',
      timestamp: 'Just now',
      content: replyText
    });
    setReplyText('');
    onTicketsUpdated();
  };

  return (
    <div className="space-y-6">
      
      {/* Top Header */}
      <div className="p-5 rounded-3xl bg-slate-900 border border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-base font-black text-white">Partner Operations & Clinical Support Desk</h2>
          <p className="text-xs text-slate-400">
            Direct high-priority hotline to GlobalHealth pharmacy operations, catalog auditing, and financial settlement teams.
          </p>
        </div>

        <button
          onClick={() => setIsNewTicketModal(true)}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-400 hover:to-emerald-400 text-slate-950 font-black text-xs transition cursor-pointer shadow-md shadow-teal-950/50"
        >
          <Plus className="w-4 h-4" />
          <span>Raise Support Ticket</span>
        </button>
      </div>

      {/* Split Ticket Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Ticket List (4 cols) */}
        <div className="lg:col-span-4 bg-slate-900 border border-slate-800 rounded-3xl p-4 space-y-2">
          <span className="text-xs font-bold text-slate-300 uppercase tracking-wider block pb-2 border-b border-slate-800">
            Open Tickets ({tickets.length})
          </span>

          <div className="space-y-2 max-h-[500px] overflow-y-auto pr-1">
            {tickets.map(t => {
              const isSelected = selectedTicket?.id === t.id;
              return (
                <div
                  key={t.id}
                  onClick={() => setSelectedTicket(t)}
                  className={`p-3.5 rounded-2xl border transition cursor-pointer space-y-1.5 ${
                    isSelected
                      ? 'bg-slate-950 border-teal-500/50 shadow-md shadow-teal-500/10'
                      : 'bg-slate-950/50 border-slate-800/80 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-teal-300 text-[11px] font-bold">{t.ticketNumber}</span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      t.status === 'Resolved' ? 'bg-emerald-500/20 text-emerald-300' : 'bg-amber-500/20 text-amber-300'
                    }`}>
                      {t.status}
                    </span>
                  </div>

                  <div className="font-bold text-white text-xs leading-snug">{t.subject}</div>
                  <div className="text-[10px] text-slate-400">{t.category} • {t.lastUpdated}</div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Ticket Conversation (8 cols) */}
        {selectedTicket ? (
          <div className="lg:col-span-8 bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-5">
            
            <div className="flex items-start justify-between border-b border-slate-800 pb-3">
              <div>
                <span className="font-mono text-teal-300 text-xs font-bold">{selectedTicket.ticketNumber}</span>
                <h3 className="text-base font-bold text-white mt-0.5">{selectedTicket.subject}</h3>
                <div className="text-xs text-slate-400">{selectedTicket.category} • Priority: {selectedTicket.priority}</div>
              </div>
              <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                selectedTicket.status === 'Resolved' ? 'bg-emerald-500/20 text-emerald-300' : 'bg-amber-500/20 text-amber-300'
              }`}>
                {selectedTicket.status}
              </span>
            </div>

            {/* Conversation Stream */}
            <div className="space-y-3 max-h-[350px] overflow-y-auto pr-1">
              {selectedTicket.messages.map((msg, idx) => (
                <div
                  key={idx}
                  className={`p-3.5 rounded-2xl text-xs space-y-1 ${
                    msg.sender === 'Pharmacy'
                      ? 'bg-slate-950 border border-slate-800 text-slate-200 ml-6'
                      : 'bg-teal-950/60 border border-teal-500/30 text-teal-100 mr-6'
                  }`}
                >
                  <div className="flex justify-between items-center text-[10px]">
                    <strong className={msg.sender === 'Pharmacy' ? 'text-teal-400' : 'text-emerald-300'}>
                      {msg.senderName}
                    </strong>
                    <span className="text-slate-400 font-mono">{msg.timestamp}</span>
                  </div>
                  <p className="leading-relaxed">{msg.content}</p>
                </div>
              ))}
            </div>

            {/* Reply Input */}
            <form onSubmit={handleSendReply} className="flex gap-2 pt-2 border-t border-slate-800">
              <input
                type="text"
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                placeholder="Type your response to GlobalHealth compliance desk..."
                className="flex-1 rounded-xl bg-slate-950 border border-slate-800 px-3.5 py-2 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-teal-500"
              />
              <button
                type="submit"
                className="px-4 py-2 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-black text-xs transition cursor-pointer flex items-center gap-1"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Send</span>
              </button>
            </form>

          </div>
        ) : null}

      </div>

      {/* New Ticket Modal */}
      {isNewTicketModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-black text-white">Raise Compliance / Ops Ticket</h3>
              <button onClick={() => setIsNewTicketModal(false)} className="text-slate-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateTicket} className="space-y-3 text-xs">
              <div className="space-y-1">
                <label className="font-bold text-slate-300">Subject *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Schedule H1 register verification query"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="w-full rounded-xl bg-slate-950 border border-slate-800 px-3 py-2 text-xs text-white focus:outline-none focus:border-teal-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-slate-300">Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full rounded-xl bg-slate-950 border border-slate-800 px-3 py-2 text-xs text-white focus:outline-none focus:border-teal-500 cursor-pointer"
                  >
                    <option value="Prescription Clarification">Prescription Clarification</option>
                    <option value="Inventory Synchronization">Inventory Synchronization</option>
                    <option value="Payment & Payout">Payment & Payout</option>
                    <option value="Delivery Dispatch Issue">Delivery Dispatch Issue</option>
                    <option value="Compliance / License Audit">Compliance / License Audit</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-300">Priority</label>
                  <select
                    value={priority}
                    onChange={(e) => setPriority(e.target.value)}
                    className="w-full rounded-xl bg-slate-950 border border-slate-800 px-3 py-2 text-xs text-white focus:outline-none focus:border-teal-500 cursor-pointer"
                  >
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                    <option value="Urgent">Urgent (SLA 30m)</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-300">Detailed Message *</label>
                <textarea
                  rows={4}
                  required
                  placeholder="Describe your query or operational requirement..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full rounded-xl bg-slate-950 border border-slate-800 p-3 text-xs text-white focus:outline-none focus:border-teal-500"
                />
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsNewTicketModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-black text-xs"
                >
                  Submit Ticket
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
