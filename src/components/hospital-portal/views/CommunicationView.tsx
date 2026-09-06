import React, { useState } from 'react';
import {
  Radio,
  Plus,
  AlertCircle,
  CheckCircle2,
  Clock,
  Send,
  Users
} from 'lucide-react';
import { useHospitalPortal } from '../../../context/HospitalContext';

export const CommunicationView: React.FC = () => {
  const { announcements, addAnnouncement, acknowledgeAnnouncement, currentUser, currentRole } = useHospitalPortal();
  const [showCompose, setShowCompose] = useState(false);

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [priority, setPriority] = useState<'General Notice' | 'Urgent Clinical Memo' | 'Emergency Code Red'>('General Notice');
  const [targetAudience, setTargetAudience] = useState<'All Personnel' | 'Doctors & Specialists' | 'Nursing Staff' | 'Administrative & Billing'>('All Personnel');

  const handlePublish = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !content) return;
    addAnnouncement({
      title,
      content,
      priority,
      targetAudience,
      activeUntil: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      author: currentUser?.name || 'Hospital Administration',
      authorRole: currentRole
    });
    setTitle('');
    setContent('');
    setShowCompose(false);
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#DCEBE4] pb-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-bold text-[#17221E]">Hospital-Wide Broadcast & Alerts</h1>
            <span className="text-xs font-mono font-bold bg-[#E8F7F1] text-[#008F68] px-2 py-0.5 rounded border border-[#BDE4D5]">
              {announcements.length} Bulletins
            </span>
          </div>
          <p className="text-xs text-[#52635C]">
            Targeted Clinical Directives, Shift Handover Circulars & Infection Control Advisories
          </p>
        </div>

        <button
          onClick={() => setShowCompose(!showCompose)}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#008F68] hover:bg-[#007A59] text-white text-xs font-bold transition shadow-xs cursor-pointer shrink-0"
        >
          <Plus className="h-4 w-4" />
          <span>Publish Directive</span>
        </button>
      </div>

      {/* Compose Drawer */}
      {showCompose && (
        <form onSubmit={handlePublish} className="p-5 rounded-2xl bg-white border border-[#008F68] shadow-md space-y-4 animate-in fade-in">
          <h3 className="text-sm font-bold text-[#17221E]">Compose Hospital-Wide Bulletin</h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-[#52635C] mb-1">Target Audience</label>
              <select
                value={targetAudience}
                onChange={(e) => setTargetAudience(e.target.value as any)}
                className="w-full px-3 py-1.5 text-xs bg-white border border-[#D8E7E0] rounded-lg text-[#17221E] focus:outline-none focus:border-[#008F68]"
              >
                <option value="All Personnel">All Hospital Personnel</option>
                <option value="Doctors & Specialists">Clinical Specialists & HODs</option>
                <option value="Nursing Staff">Nursing & Inpatient Floor Leads</option>
                <option value="Administrative & Billing">Operations & Finance Desk</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-[#52635C] mb-1">Priority Level</label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as any)}
                className="w-full px-3 py-1.5 text-xs bg-white border border-[#D8E7E0] rounded-lg text-[#17221E] focus:outline-none focus:border-[#008F68]"
              >
                <option value="General Notice">Normal Advisory</option>
                <option value="Urgent Clinical Memo">Urgent Circular</option>
                <option value="Emergency Code Red">Critical Emergency Alert</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-[#52635C] mb-1">Directive Title</label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Revised OT Disinfection Protocol & N95 Compliance"
              className="w-full px-3.5 py-2 text-sm bg-white border border-[#D8E7E0] rounded-xl text-[#17221E] focus:outline-none focus:border-[#008F68]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-[#52635C] mb-1">Detailed Content</label>
            <textarea
              required
              rows={3}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Enter full announcement details..."
              className="w-full px-3.5 py-2 text-sm bg-white border border-[#D8E7E0] rounded-xl text-[#17221E] focus:outline-none focus:border-[#008F68]"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setShowCompose(false)}
              className="px-3 py-1.5 text-xs font-bold text-[#52635C] hover:bg-[#F1FAF6] rounded-lg transition cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 text-xs font-bold text-white bg-[#008F68] hover:bg-[#007A59] rounded-lg transition cursor-pointer flex items-center gap-1.5"
            >
              <Send className="h-3.5 w-3.5" />
              <span>Broadcast Bulletin</span>
            </button>
          </div>
        </form>
      )}

      {/* Announcements Stream */}
      <div className="space-y-4">
        {announcements.map((ann) => {
          const isEmergency = ann.priority === 'Emergency Code Red';
          const isUrgent = ann.priority === 'Urgent Clinical Memo';
          return (
            <div
              key={ann.id}
              className={`p-6 rounded-2xl bg-white border shadow-xs space-y-3 ${
                isEmergency
                  ? 'border-[#F2CCCC] bg-[#FFFDFD]'
                  : isUrgent
                  ? 'border-[#FED88B]'
                  : 'border-[#DCEBE4]'
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#DCEBE4] pb-2.5">
                <div className="flex items-center gap-2.5">
                  <div
                    className={`p-2 rounded-xl ${
                      isEmergency ? 'bg-[#FFF1F1] text-[#D64545]' : isUrgent ? 'bg-[#FFF7E6] text-[#A86E00]' : 'bg-[#E8F7F1] text-[#008F68]'
                    }`}
                  >
                    <Radio className="h-4 w-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-[#17221E]">{ann.title}</h3>
                    <p className="text-[11px] text-[#52635C]">
                      Target: <strong className="text-[#17221E]">{ann.targetAudience}</strong> • Issued by {ann.author} ({ann.authorRole})
                    </p>
                  </div>
                </div>

                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    isEmergency
                      ? 'bg-[#FFF1F1] text-[#C53939] border border-[#F2CCCC]'
                      : isUrgent
                      ? 'bg-[#FFF7E6] text-[#A86E00] border border-[#FED88B]'
                      : 'bg-[#E8F7F1] text-[#008F68] border border-[#BDE4D5]'
                  }`}
                >
                  {ann.priority}
                </span>
              </div>

              <p className="text-xs text-[#17221E] leading-relaxed">{ann.content}</p>

              <div className="pt-2 border-t border-[#DCEBE4] flex items-center justify-between text-xs text-[#52635C]">
                <span className="font-mono text-[10px]">{new Date(ann.createdAt).toLocaleString()}</span>
                <button
                  onClick={() => acknowledgeAnnouncement(ann.id)}
                  className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-[#F1FAF6] hover:bg-[#DCEBE4] text-[#17221E] font-bold text-[11px] transition cursor-pointer"
                >
                  <CheckCircle2 className="h-3.5 w-3.5 text-[#008F68]" />
                  <span>Acknowledge Receipt ({ann.acknowledgedCount})</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
