import React, { useState } from 'react';
import {
  Users,
  Globe2,
  Plus,
  ShieldCheck,
  Mail,
  Award,
  ExternalLink,
  Edit,
  Trash2,
  CheckCircle2
} from 'lucide-react';
import { NewsAuthorItem, NewsSourceItem } from '../../types';

interface AuthorsSourcesViewProps {
  authors: NewsAuthorItem[];
  sources: NewsSourceItem[];
  defaultTab?: 'authors' | 'sources';
  onCreateAuthor: (auth: Omit<NewsAuthorItem, 'id' | 'articleCount'>) => void;
  onCreateSource: (source: Omit<NewsSourceItem, 'id'>) => void;
}

export const AuthorsSourcesView: React.FC<AuthorsSourcesViewProps> = ({
  authors,
  sources,
  defaultTab = 'authors',
  onCreateAuthor,
  onCreateSource
}) => {
  const [activeTab, setActiveTab] = useState<'authors' | 'sources'>(defaultTab);

  // Author Modal
  const [showAuthorModal, setShowAuthorModal] = useState(false);
  const [authName, setAuthName] = useState('');
  const [authRole, setAuthRole] = useState<NewsAuthorItem['role']>('Medical Editor');
  const [authCredentials, setAuthCredentials] = useState('');
  const [authAffiliation, setAuthAffiliation] = useState('');
  const [authEmail, setAuthEmail] = useState('');
  const [authBio, setAuthBio] = useState('');

  // Source Modal
  const [showSourceModal, setShowSourceModal] = useState(false);
  const [srcName, setSrcName] = useState('');
  const [srcType, setSrcType] = useState<NewsSourceItem['publicationType']>('Peer-Reviewed Journal');
  const [srcUrl, setSrcUrl] = useState('');
  const [srcCredibility, setSrcCredibility] = useState(98);
  const [srcImpact, setSrcImpact] = useState('');
  const [srcHq, setSrcHq] = useState('');

  const handleSaveAuthor = () => {
    if (!authName.trim()) {
      alert('Please enter an author/reviewer name.');
      return;
    }
    onCreateAuthor({
      name: authName,
      role: authRole,
      credentials: authCredentials,
      affiliation: authAffiliation,
      email: authEmail,
      bio: authBio,
      avatarUrl: `https://images.unsplash.com/photo-${1559839734 + authors.length}?auto=format&fit=crop&q=80&w=200`
    });
    setShowAuthorModal(false);
  };

  const handleSaveSource = () => {
    if (!srcName.trim()) {
      alert('Please enter a source name.');
      return;
    }
    onCreateSource({
      name: srcName,
      publicationType: srcType,
      websiteUrl: srcUrl || 'https://www.nejm.org',
      credibilityScore: srcCredibility,
      impactFactor: srcImpact,
      headquarters: srcHq
    });
    setShowSourceModal(false);
  };

  return (
    <div className="p-6 lg:p-8 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-200 pb-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-teal-700 uppercase tracking-wider mb-1">
            <Users className="h-4 w-4" /> Editorial Governance & Credibility
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Authors, Reviewers & Sources Registry
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Maintain certified medical reviewers, clinical journalists, and verified scientific journals.
          </p>
        </div>

        {/* Tab Toggle */}
        <div className="flex items-center gap-2 bg-slate-100 p-1 rounded-xl">
          <button
            onClick={() => setActiveTab('authors')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition ${
              activeTab === 'authors' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Authors & Reviewers ({authors.length})
          </button>
          <button
            onClick={() => setActiveTab('sources')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition ${
              activeTab === 'sources' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Sources & Journals ({sources.length})
          </button>
        </div>
      </div>

      {/* Tab 1: Authors & Reviewers (Section 19) */}
      {activeTab === 'authors' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-extrabold uppercase tracking-wider text-slate-700">
              Registered Medical Board & Writers
            </h2>
            <button
              onClick={() => {
                setAuthName('');
                setAuthCredentials('');
                setAuthAffiliation('');
                setAuthEmail('');
                setAuthBio('');
                setShowAuthorModal(true);
              }}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold transition shadow-sm"
            >
              <Plus className="h-3.5 w-3.5" />
              <span>+ Add Author / Reviewer</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {authors.map((auth) => (
              <div
                key={auth.id}
                className="rounded-2xl border border-slate-200 bg-white p-6 shadow-2xs space-y-4 hover:border-slate-300 transition flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <img
                        src={auth.avatarUrl || 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=200'}
                        alt={auth.name}
                        className="h-12 w-12 rounded-xl object-cover border border-slate-200"
                      />
                      <div>
                        <h3 className="text-sm font-extrabold text-slate-900">{auth.name}</h3>
                        <span className={`inline-block px-2 py-0.2 rounded-md text-[10px] font-bold ${
                          auth.role === 'Chief Medical Officer'
                            ? 'bg-purple-100 text-purple-800'
                            : auth.role === 'Medical Editor'
                            ? 'bg-teal-100 text-teal-800'
                            : auth.role === 'Clinical Reviewer'
                            ? 'bg-indigo-100 text-indigo-800'
                            : 'bg-slate-100 text-slate-700'
                        }`}>
                          {auth.role}
                        </span>
                      </div>
                    </div>

                    <span className="text-[10px] font-bold bg-slate-50 text-slate-600 px-2 py-0.5 rounded-full border border-slate-100">
                      {auth.articleCount || 0} articles
                    </span>
                  </div>

                  {auth.credentials && (
                    <div className="text-xs text-teal-800 font-bold flex items-center gap-1">
                      <ShieldCheck className="h-3.5 w-3.5 text-teal-600 shrink-0" />
                      <span>{auth.credentials}</span>
                    </div>
                  )}

                  {auth.affiliation && (
                    <div className="text-[11px] text-slate-500 font-medium">
                      {auth.affiliation}
                    </div>
                  )}

                  {auth.bio && (
                    <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                      {auth.bio}
                    </p>
                  )}
                </div>

                {auth.email && (
                  <div className="pt-3 border-t border-slate-100 text-[11px] text-slate-400 flex items-center gap-1">
                    <Mail className="h-3 w-3" />
                    <span>{auth.email}</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 2: Sources & Journals (Section 20) */}
      {activeTab === 'sources' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-extrabold uppercase tracking-wider text-slate-700">
              Verified Medical Journals & Global Health Agencies
            </h2>
            <button
              onClick={() => {
                setSrcName('');
                setSrcUrl('');
                setSrcImpact('');
                setSrcHq('');
                setShowSourceModal(true);
              }}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold transition shadow-sm"
            >
              <Plus className="h-3.5 w-3.5" />
              <span>+ Add Source</span>
            </button>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white shadow-2xs overflow-hidden">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                  <th className="py-3.5 px-4">Publication / Source Name</th>
                  <th className="py-3.5 px-3">Type</th>
                  <th className="py-3.5 px-3">Credibility Score</th>
                  <th className="py-3.5 px-3">Impact Factor</th>
                  <th className="py-3.5 px-3">Headquarters</th>
                  <th className="py-3.5 pr-4 pl-3 text-right">Official Site</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {sources.map((src) => (
                  <tr key={src.id} className="hover:bg-slate-50/80 transition">
                    <td className="py-3.5 px-4 font-bold text-slate-900">
                      {src.name}
                    </td>
                    <td className="py-3.5 px-3">
                      <span className="inline-block rounded-md bg-slate-100 px-2 py-0.5 text-[10px] font-semibold text-slate-700">
                        {src.publicationType}
                      </span>
                    </td>
                    <td className="py-3.5 px-3">
                      <div className="flex items-center gap-1.5">
                        <div className="h-2 w-16 rounded-full bg-slate-100 overflow-hidden">
                          <div
                            className="h-full bg-teal-500 rounded-full"
                            style={{ width: `${src.credibilityScore}%` }}
                          />
                        </div>
                        <span className="font-bold text-teal-700">{src.credibilityScore}%</span>
                      </div>
                    </td>
                    <td className="py-3.5 px-3 font-mono text-slate-700">
                      {src.impactFactor || '—'}
                    </td>
                    <td className="py-3.5 px-3 text-slate-500">
                      {src.headquarters || '—'}
                    </td>
                    <td className="py-3.5 pr-4 pl-3 text-right">
                      <a
                        href={src.websiteUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1 text-teal-700 hover:text-teal-800 font-bold"
                      >
                        <span>Visit</span>
                        <ExternalLink className="h-3 w-3" />
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Add Author Modal */}
      {showAuthorModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <h3 className="text-base font-extrabold text-slate-900">Add Author / Reviewer</h3>
            
            <div className="space-y-3 text-xs">
              <div className="space-y-1">
                <label className="font-bold text-slate-800">Full Name *</label>
                <input
                  type="text"
                  value={authName}
                  onChange={(e) => setAuthName(e.target.value)}
                  placeholder="e.g. Dr. Julian Croft"
                  className="w-full rounded-xl border border-slate-200 bg-white p-2.5 text-xs text-slate-800 focus:border-teal-500 focus:outline-hidden"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-800">Editorial Role *</label>
                <select
                  value={authRole}
                  onChange={(e) => setAuthRole(e.target.value as any)}
                  className="w-full rounded-xl border border-slate-200 bg-white p-2.5 text-xs text-slate-800 focus:border-teal-500 focus:outline-hidden"
                >
                  <option value="Chief Medical Officer">Chief Medical Officer</option>
                  <option value="Medical Editor">Medical Editor</option>
                  <option value="Clinical Reviewer">Clinical Reviewer</option>
                  <option value="Health Journalist">Health Journalist</option>
                  <option value="Admin">Admin</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-800">Credentials (e.g. MD, PhD, FACC)</label>
                <input
                  type="text"
                  value={authCredentials}
                  onChange={(e) => setAuthCredentials(e.target.value)}
                  placeholder="MD, FACC, Interventional Cardiology"
                  className="w-full rounded-xl border border-slate-200 bg-white p-2.5 text-xs text-slate-800 focus:border-teal-500 focus:outline-hidden"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-800">Affiliation / Institution</label>
                <input
                  type="text"
                  value={authAffiliation}
                  onChange={(e) => setAuthAffiliation(e.target.value)}
                  placeholder="Johns Hopkins School of Medicine"
                  className="w-full rounded-xl border border-slate-200 bg-white p-2.5 text-xs text-slate-800 focus:border-teal-500 focus:outline-hidden"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-800">Short Bio</label>
                <textarea
                  rows={2}
                  value={authBio}
                  onChange={(e) => setAuthBio(e.target.value)}
                  placeholder="Clinical background and research interests..."
                  className="w-full rounded-xl border border-slate-200 bg-white p-2.5 text-xs text-slate-800 focus:border-teal-500 focus:outline-hidden"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
              <button
                onClick={() => setShowAuthorModal(false)}
                className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveAuthor}
                className="px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-xs font-bold text-white shadow-sm"
              >
                Save Author
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Source Modal */}
      {showSourceModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <h3 className="text-base font-extrabold text-slate-900">Add Medical Source / Journal</h3>
            
            <div className="space-y-3 text-xs">
              <div className="space-y-1">
                <label className="font-bold text-slate-800">Source Name *</label>
                <input
                  type="text"
                  value={srcName}
                  onChange={(e) => setSrcName(e.target.value)}
                  placeholder="e.g. British Medical Journal (BMJ)"
                  className="w-full rounded-xl border border-slate-200 bg-white p-2.5 text-xs text-slate-800 focus:border-teal-500 focus:outline-hidden"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-800">Publication Type</label>
                <select
                  value={srcType}
                  onChange={(e) => setSrcType(e.target.value as any)}
                  className="w-full rounded-xl border border-slate-200 bg-white p-2.5 text-xs text-slate-800 focus:border-teal-500 focus:outline-hidden"
                >
                  <option value="Peer-Reviewed Journal">Peer-Reviewed Journal</option>
                  <option value="Government Agency">Government Agency</option>
                  <option value="Global Health Body">Global Health Body</option>
                  <option value="Academic Institution">Academic Institution</option>
                  <option value="Medical Press">Medical Press</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-800">Official Website URL</label>
                <input
                  type="text"
                  value={srcUrl}
                  onChange={(e) => setSrcUrl(e.target.value)}
                  placeholder="https://www.bmj.com"
                  className="w-full rounded-xl border border-slate-200 bg-white p-2.5 text-xs text-slate-800 focus:border-teal-500 focus:outline-hidden font-mono"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1">
                  <label className="font-bold text-slate-800">Impact Factor</label>
                  <input
                    type="text"
                    value={srcImpact}
                    onChange={(e) => setSrcImpact(e.target.value)}
                    placeholder="93.6"
                    className="w-full rounded-xl border border-slate-200 bg-white p-2.5 text-xs text-slate-800 focus:border-teal-500 focus:outline-hidden"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-bold text-slate-800">Credibility %</label>
                  <input
                    type="number"
                    min={50}
                    max={100}
                    value={srcCredibility}
                    onChange={(e) => setSrcCredibility(Number(e.target.value) || 95)}
                    className="w-full rounded-xl border border-slate-200 bg-white p-2.5 text-xs text-slate-800 focus:border-teal-500 focus:outline-hidden"
                  />
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
              <button
                onClick={() => setShowSourceModal(false)}
                className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveSource}
                className="px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-xs font-bold text-white shadow-sm"
              >
                Save Source
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
