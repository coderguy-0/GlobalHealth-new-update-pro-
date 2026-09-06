import React, { useState } from 'react';
import { X, GitPullRequest, AlertCircle, Sparkles } from 'lucide-react';
import { useHospitalPortal } from '../../../context/HospitalContext';

export const DraftModal: React.FC = () => {
  const { activeModal, closeModal, submitDraft, currentUser, currentRole } = useHospitalPortal();

  const [module, setModule] = useState<'Pricing & Tariffs' | 'Doctor Faculty' | 'Clinical Services' | 'Hospital Profile' | 'Capacity & Wings'>('Pricing & Tariffs');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [diffSummary, setDiffSummary] = useState('');
  const [currentVal, setCurrentVal] = useState('');
  const [proposedVal, setProposedVal] = useState('');
  const [error, setError] = useState('');

  if (activeModal !== 'submit_draft') return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !description) {
      setError('Draft title and business justification are required.');
      return;
    }

    submitDraft({
      module,
      title,
      description,
      submittedBy: currentUser?.name || 'Authorized Staff',
      submittedByRole: currentRole,
      originalValue: { current: currentVal || 'Existing Standard' },
      proposedValue: { proposed: proposedVal || 'Proposed Revision' },
      diffSummary: diffSummary || `Proposed changes to ${module}: ${title}`
    });

    closeModal();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#17221E]/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="w-full max-w-xl bg-[#FFFFFF] rounded-2xl border border-[#DCEBE4] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#DCEBE4] bg-[#FFF7E6]">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-[#D99718] text-white">
              <GitPullRequest className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-[#A86E00]">Stage Change Management Draft</h3>
              <p className="text-xs text-[#52635C]">Two-Phase Clinical & Financial Governance Pipeline</p>
            </div>
          </div>
          <button onClick={closeModal} className="p-1.5 rounded-lg text-[#52635C] hover:bg-[#FED88B] transition cursor-pointer">
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-4">
          {error && (
            <div className="flex items-center gap-2 p-3 rounded-xl bg-[#FFF1F1] border border-[#F2CCCC] text-[#C53939] text-xs font-semibold">
              <AlertCircle className="h-4 w-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-[#52635C] mb-1">Target Governance Module</label>
              <select
                value={module}
                onChange={(e) => setModule(e.target.value as any)}
                className="w-full px-3.5 py-2 text-sm bg-white border border-[#D8E7E0] rounded-xl text-[#17221E] focus:outline-none focus:border-[#008F68]"
              >
                <option value="Pricing & Tariffs">Pricing & Tariffs Master</option>
                <option value="Doctor Faculty">Doctor Faculty & Fee Schedule</option>
                <option value="Clinical Services">Clinical Services & Packages</option>
                <option value="Hospital Profile">Hospital Master Profile</option>
                <option value="Capacity & Wings">Capacity & Wings Allocation</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-[#52635C] mb-1">Authorizer Sign-Off Required</label>
              <input
                type="text"
                disabled
                value="Medical Director / Administrator"
                className="w-full px-3.5 py-2 text-sm bg-[#F1FAF6] border border-[#D8E7E0] rounded-xl text-[#52635C] font-semibold"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-[#52635C] mb-1">Proposal Title *</label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Rationalize ICU Daily Rate & Add Multipara Monitor Line Item"
              className="w-full px-3.5 py-2 text-sm bg-white border border-[#D8E7E0] rounded-xl text-[#17221E] focus:outline-none focus:border-[#008F68]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-[#52635C] mb-1">Clinical / Financial Justification *</label>
            <textarea
              required
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Explain the clinical rationale, market benchmark, or regulatory reason for this revision..."
              className="w-full px-3.5 py-2 text-sm bg-white border border-[#D8E7E0] rounded-xl text-[#17221E] focus:outline-none focus:border-[#008F68]"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3.5 rounded-xl bg-[#F1FAF6] border border-[#DCEBE4]">
            <div>
              <label className="block text-[11px] font-bold text-[#52635C] mb-1">Current Baseline Value</label>
              <input
                type="text"
                value={currentVal}
                onChange={(e) => setCurrentVal(e.target.value)}
                placeholder="e.g. ₹14,500/day"
                className="w-full px-3 py-1.5 text-xs bg-white border border-[#D8E7E0] rounded-lg text-[#17221E]"
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-[#008F68] mb-1">Proposed Revision Value</label>
              <input
                type="text"
                value={proposedVal}
                onChange={(e) => setProposedVal(e.target.value)}
                placeholder="e.g. ₹15,800/day (+₹1,300)"
                className="w-full px-3 py-1.5 text-xs bg-white border border-[#BDE4D5] rounded-lg text-[#008F68] font-bold"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-[#52635C] mb-1">One-Line Diff Summary</label>
            <input
              type="text"
              value={diffSummary}
              onChange={(e) => setDiffSummary(e.target.value)}
              placeholder="e.g. Adjusts base ICU bed tariff from ₹14.5k to ₹15.8k"
              className="w-full px-3.5 py-2 text-sm bg-white border border-[#D8E7E0] rounded-xl text-[#17221E] focus:outline-none focus:border-[#008F68]"
            />
          </div>

          <div className="pt-4 border-t border-[#DCEBE4] flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={closeModal}
              className="px-4 py-2 text-xs font-bold text-[#52635C] hover:bg-[#F1FAF6] rounded-xl transition cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-xs font-bold text-white bg-[#008F68] hover:bg-[#007A59] rounded-xl transition shadow-xs flex items-center gap-1.5 cursor-pointer"
            >
              <GitPullRequest className="h-4 w-4" />
              <span>Submit to Governance Pipeline</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
