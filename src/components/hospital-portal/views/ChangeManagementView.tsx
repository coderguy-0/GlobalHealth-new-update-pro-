import React, { useState } from 'react';
import {
  GitPullRequest,
  CheckCircle2,
  XCircle,
  Clock,
  UserCheck,
  Plus,
  ArrowRight,
  ShieldCheck
} from 'lucide-react';
import { useHospitalPortal } from '../../../context/HospitalContext';

export const ChangeManagementView: React.FC = () => {
  const { drafts, approveDraft, rejectDraft, openModal, currentUser, currentRole } = useHospitalPortal();
  const [selectedStatus, setSelectedStatus] = useState<'ALL' | 'Pending Review' | 'Approved & Published' | 'Rejected'>('ALL');

  const filteredDrafts = drafts.filter(
    (d) => selectedStatus === 'ALL' || d.status === selectedStatus
  );

  const pendingCount = drafts.filter((d) => d.status === 'Pending Review').length;

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#DCEBE4] pb-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-bold text-[#17221E]">Two-Phase Change Governance Pipeline</h1>
            <span className="text-xs font-mono font-bold bg-[#FFF7E6] text-[#A86E00] px-2 py-0.5 rounded border border-[#FED88B]">
              {pendingCount} Pending Review
            </span>
          </div>
          <p className="text-xs text-[#52635C]">
            Mandatory dual-key ratification workflow for hospital tariffs, doctor faculty additions & clinical protocols
          </p>
        </div>

        <button
          onClick={() => openModal('submit_draft')}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#008F68] hover:bg-[#007A59] text-white text-xs font-bold transition shadow-xs cursor-pointer shrink-0"
        >
          <Plus className="h-4 w-4" />
          <span>Stage New Draft</span>
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2">
        {(['ALL', 'Pending Review', 'Approved & Published', 'Rejected'] as const).map((status) => (
          <button
            key={status}
            onClick={() => setSelectedStatus(status)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
              selectedStatus === status
                ? 'bg-[#008F68] text-white'
                : 'bg-white text-[#52635C] border border-[#DCEBE4] hover:bg-[#F1FAF6]'
            }`}
          >
            {status}
          </button>
        ))}
      </div>

      {/* Drafts List */}
      <div className="space-y-4">
        {filteredDrafts.map((draft) => {
          const isPending = draft.status === 'Pending Review';
          const isApproved = draft.status === 'Approved & Published';
          return (
            <div
              key={draft.id}
              className={`p-6 rounded-2xl bg-white border shadow-xs space-y-4 ${
                isPending ? 'border-[#FED88B]' : 'border-[#DCEBE4]'
              }`}
            >
              {/* Draft Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#DCEBE4] pb-3">
                <div className="flex items-center gap-2.5">
                  <div
                    className={`p-2 rounded-xl ${
                      isPending ? 'bg-[#FFF7E6] text-[#A86E00]' : isApproved ? 'bg-[#E8F7F1] text-[#008F68]' : 'bg-[#FFF1F1] text-[#C53939]'
                    }`}
                  >
                    <GitPullRequest className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-[#17221E]">{draft.title}</h3>
                    <p className="text-xs text-[#52635C]">
                      Module: <strong className="text-[#17221E]">{draft.module}</strong> • Draft ID:{' '}
                      <span className="font-mono">{draft.id}</span>
                    </p>
                  </div>
                </div>

                <span
                  className={`text-xs font-bold px-3 py-1 rounded-full self-start sm:self-auto ${
                    isPending
                      ? 'bg-[#FFF7E6] text-[#A86E00] border border-[#FED88B]'
                      : isApproved
                      ? 'bg-[#E8F7F1] text-[#008F68] border border-[#BDE4D5]'
                      : 'bg-[#FFF1F1] text-[#C53939] border border-[#F2CCCC]'
                  }`}
                >
                  {draft.status}
                </span>
              </div>

              {/* Business Description */}
              <p className="text-xs text-[#17221E] leading-relaxed">{draft.description}</p>

              {/* Visual Diff Box */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 p-4 rounded-xl bg-[#F6FBF8] border border-[#DCEBE4]">
                <div>
                  <span className="text-[10px] font-bold text-[#52635C] uppercase tracking-wider block mb-1">
                    Current Baseline
                  </span>
                  <div className="p-2.5 rounded-lg bg-white border border-[#DCEBE4] text-xs font-mono text-[#52635C]">
                    {JSON.stringify(draft.originalValue)}
                  </div>
                </div>
                <div>
                  <span className="text-[10px] font-bold text-[#008F68] uppercase tracking-wider block mb-1">
                    Proposed Revision (Target)
                  </span>
                  <div className="p-2.5 rounded-lg bg-[#E8F7F1] border border-[#BDE4D5] text-xs font-mono font-bold text-[#008F68]">
                    {JSON.stringify(draft.proposedValue)}
                  </div>
                </div>
              </div>

              {/* Submitter & Reviewer Telemetry */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2 text-xs text-[#52635C]">
                <div>
                  Submitted by <strong className="text-[#17221E]">{draft.submittedBy}</strong> ({draft.submittedByRole}) on{' '}
                  <span className="font-mono">{new Date(draft.submittedAt).toLocaleDateString()}</span>
                </div>

                {/* Approve / Reject Controls */}
                {isPending && (
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => {
                        const reason = prompt('Enter rejection rationale:', 'Does not meet board pricing threshold.');
                        if (reason) rejectDraft(draft.id, reason);
                      }}
                      className="px-3 py-1.5 rounded-xl border border-[#F2CCCC] text-[#C53939] hover:bg-[#FFF1F1] font-bold text-xs transition cursor-pointer"
                    >
                      Reject Proposal
                    </button>
                    <button
                      onClick={() => {
                        approveDraft(draft.id, 'Ratified under institutional medical administration authority.');
                      }}
                      className="px-4 py-1.5 rounded-xl bg-[#008F68] hover:bg-[#007A59] text-white font-bold text-xs transition shadow-xs cursor-pointer flex items-center gap-1.5"
                    >
                      <CheckCircle2 className="h-3.5 w-3.5" />
                      <span>Approve & Publish to Production</span>
                    </button>
                  </div>
                )}

                {draft.reviewedBy && (
                  <div className="text-[11px] text-[#008F68] font-semibold">
                    Reviewed by {draft.reviewedBy} • {draft.reviewNotes}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
