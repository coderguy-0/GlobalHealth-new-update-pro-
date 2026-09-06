import React, { useState } from 'react';
import {
  Code,
  Copy,
  Check,
  Globe,
  ShieldCheck,
  ExternalLink,
  Terminal,
  Send,
  Zap,
  Lock,
  Sparkles,
  RefreshCw
} from 'lucide-react';
import { DoctorProfile } from '../../types/medauth';

interface IntegrationPlaygroundProps {
  doctor: DoctorProfile;
}

export const IntegrationPlayground: React.FC<IntegrationPlaygroundProps> = ({
  doctor
}) => {
  const [copiedType, setCopiedType] = useState<string | null>(null);
  const [webhookUrl, setWebhookUrl] = useState('https://api.hospital-ehr.org/webhooks/medauth-verify');
  const [webhookTesting, setWebhookTesting] = useState(false);
  const [webhookResponse, setWebhookResponse] = useState<any>(null);

  const embedOrigin = window.location.origin;
  const badgeId = doctor.verificationBadgeId || `MEDAUTH-88231-${doctor.fullName.substring(4, 8).toUpperCase()}`;

  // 1. HTML Iframe Snippet
  const htmlSnippet = `<iframe
  src="${embedOrigin}/embed/badge/${badgeId}"
  width="360"
  height="160"
  frameborder="0"
  scrolling="no"
  title="MedAuth Verified Physician - ${doctor.fullName}"
  style="border-radius: 12px; border: 1px solid #E2E8F0; box-shadow: 0 1px 3px rgba(0,0,0,0.05);"
></iframe>`;

  // 2. React Component Snippet
  const reactSnippet = `import { MedAuthVerificationBadge } from '@medauth/react-sdk';

export function DoctorProfileCard() {
  return (
    <MedAuthVerificationBadge
      npiNumber="${doctor.npiNumber}"
      badgeId="${badgeId}"
      theme="clinical-light"
      onVerify={() => undefined}
    />
  );
}`;

  // 3. Markdown Snippet
  const markdownSnippet = `[![MedAuth Verified Practitioner: ${doctor.fullName}](https://img.shields.io/badge/MedAuth_Verified-${encodeURIComponent(doctor.fullName)}-059669?style=flat-square&logo=shield&logoColor=white)](${embedOrigin}/verify/${badgeId})`;

  const handleCopy = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    setCopiedType(type);
    setTimeout(() => setCopiedType(null), 2500);
  };

  const handleTestWebhook = async () => {
    setWebhookTesting(true);
    setWebhookResponse(null);

    setTimeout(() => {
      setWebhookTesting(false);
      setWebhookResponse({
        event: 'provider.credentials.verified',
        timestamp: new Date().toISOString(),
        deliveryStatus: 200,
        signature: `sha256_hmac_${Math.random().toString(36).substring(2, 12)}`,
        payload: {
          doctor: {
            id: doctor.id,
            fullName: doctor.fullName,
            npiNumber: doctor.npiNumber,
            licenseNumber: doctor.licenseNumber,
            speciality: doctor.speciality,
            status: doctor.status,
            confidenceScore: doctor.confidenceScore,
            verificationBadgeId: doctor.verificationBadgeId,
            verifiedAt: doctor.verifiedAt
          }
        }
      });
    }, 800);
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-emerald-600 font-bold text-xs uppercase tracking-wider mb-1">
            <Code className="w-4 h-4" />
            <span>Developer SDK & Embeddable Badges</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
            Cryptographic Verification Badge & Webhook Playground
          </h2>
          <p className="text-xs text-slate-600">
            Embed live state board authentication widgets on hospital portals, telehealth apps, and medical directories.
          </p>
        </div>

        <div className="flex items-center gap-2 font-mono text-xs text-slate-600 bg-slate-100 px-3 py-1.5 rounded-xl border border-slate-200">
          <Lock className="w-3.5 h-3.5 text-emerald-600" />
          <span>Token: {doctor.integrationToken.substring(0, 16)}...</span>
        </div>
      </div>

      {/* Live Badge Preview Surface */}
      <div className="bg-slate-900 text-white rounded-2xl p-6 sm:p-8 border border-slate-800 shadow-md space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-emerald-400" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300">
              Live Rendered Interactive Cryptographic Badge
            </h3>
          </div>
          <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/60 border border-emerald-800 px-2.5 py-0.5 rounded-full">
            REAL-TIME ACTIVE
          </span>
        </div>

        <div className="flex justify-center p-4">
          {/* Badge Visual Surface */}
          <div className="w-full max-w-md bg-white text-slate-900 rounded-2xl border border-slate-200 p-5 shadow-xl space-y-3">
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-600 flex items-center justify-center text-white shadow-xs">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <h4 className="text-sm font-bold text-slate-900">{doctor.fullName}</h4>
                  </div>
                  <p className="text-xs font-semibold text-emerald-700">{doctor.speciality}</p>
                </div>
              </div>

              <div className="text-right">
                <span className="bg-emerald-50 text-emerald-800 border border-emerald-300 text-[10px] font-mono font-bold px-2 py-0.5 rounded">
                  {doctor.confidenceScore}% AUDIT
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 text-[11px] bg-slate-50 p-2.5 rounded-lg border border-slate-200">
              <div>
                <span className="text-slate-400 block font-mono text-[9px]">10-DIGIT NPI</span>
                <span className="font-mono font-bold text-slate-800">{doctor.npiNumber}</span>
              </div>
              <div>
                <span className="text-slate-400 block font-mono text-[9px]">MEDICAL BOARD LICENSE</span>
                <span className="font-mono font-bold text-slate-800">{doctor.licenseNumber}</span>
              </div>
            </div>

            <div className="flex items-center justify-between text-[10px] text-slate-500 border-t border-slate-100 pt-2 font-mono">
              <span>{doctor.verificationBadgeId}</span>
              <span className="text-emerald-700 font-bold flex items-center gap-1">
                <ShieldCheck className="w-3 h-3" />
                <span>STATE BOARD VERIFIED</span>
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Snippet Generators */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* HTML Iframe */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex flex-col justify-between space-y-3">
          <div>
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                <Globe className="w-3.5 h-3.5 text-emerald-600" />
                <span>HTML iframe Widget</span>
              </span>
              <button
                onClick={() => handleCopy(htmlSnippet, 'html')}
                className="flex items-center gap-1 text-[11px] font-bold text-emerald-600 hover:text-emerald-700 cursor-pointer"
              >
                {copiedType === 'html' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedType === 'html' ? 'Copied' : 'Copy'}</span>
              </button>
            </div>
            <pre className="p-3 bg-slate-900 text-slate-200 rounded-xl text-[10px] font-mono overflow-x-auto leading-relaxed max-h-36">
              {htmlSnippet}
            </pre>
          </div>
          <p className="text-[11px] text-slate-500">Drop directly into any HTML page or portal template.</p>
        </div>

        {/* React SDK */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex flex-col justify-between space-y-3">
          <div>
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                <Code className="w-3.5 h-3.5 text-emerald-600" />
                <span>React Component SDK</span>
              </span>
              <button
                onClick={() => handleCopy(reactSnippet, 'react')}
                className="flex items-center gap-1 text-[11px] font-bold text-emerald-600 hover:text-emerald-700 cursor-pointer"
              >
                {copiedType === 'react' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedType === 'react' ? 'Copied' : 'Copy'}</span>
              </button>
            </div>
            <pre className="p-3 bg-slate-900 text-slate-200 rounded-xl text-[10px] font-mono overflow-x-auto leading-relaxed max-h-36">
              {reactSnippet}
            </pre>
          </div>
          <p className="text-[11px] text-slate-500">Fully typed React 19 / TypeScript component with callbacks.</p>
        </div>

        {/* Markdown Badge */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex flex-col justify-between space-y-3">
          <div>
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                <Terminal className="w-3.5 h-3.5 text-emerald-600" />
                <span>Markdown Shield</span>
              </span>
              <button
                onClick={() => handleCopy(markdownSnippet, 'markdown')}
                className="flex items-center gap-1 text-[11px] font-bold text-emerald-600 hover:text-emerald-700 cursor-pointer"
              >
                {copiedType === 'markdown' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedType === 'markdown' ? 'Copied' : 'Copy'}</span>
              </button>
            </div>
            <pre className="p-3 bg-slate-900 text-slate-200 rounded-xl text-[10px] font-mono overflow-x-auto leading-relaxed max-h-36">
              {markdownSnippet}
            </pre>
          </div>
          <p className="text-[11px] text-slate-500">Perfect for GitHub doctor registries and Markdown docs.</p>
        </div>
      </div>

      {/* Webhook Testing Simulator */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-slate-200 pb-3">
          <div className="flex items-center gap-2">
            <Zap className="w-4 h-4 text-emerald-600" />
            <h3 className="text-sm font-bold text-slate-900">
              State Board Credential Webhook Simulator
            </h3>
          </div>
          <span className="text-xs font-mono text-slate-500">Event: provider.credentials.verified</span>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <input
            type="url"
            value={webhookUrl}
            onChange={(e) => setWebhookUrl(e.target.value)}
            placeholder="https://your-hospital.org/api/medauth-webhook"
            className="flex-1 px-3.5 py-2 text-xs bg-slate-50 border border-slate-300 rounded-lg font-mono text-slate-900 focus:outline-none focus:border-emerald-600"
          />

          <button
            onClick={handleTestWebhook}
            disabled={webhookTesting}
            className="flex items-center justify-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white text-xs font-bold rounded-lg transition shadow-xs cursor-pointer whitespace-nowrap"
          >
            {webhookTesting ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
            <span>Simulate Webhook Dispatch</span>
          </button>
        </div>

        {webhookResponse && (
          <div className="p-4 bg-slate-900 rounded-xl border border-slate-800 text-slate-200 space-y-2 font-mono text-[11px]">
            <div className="flex items-center justify-between text-emerald-400 border-b border-slate-800 pb-2">
              <span>✓ HTTP {webhookResponse.deliveryStatus} OK — Payload Delivered</span>
              <span className="text-slate-400">{webhookResponse.timestamp}</span>
            </div>
            <pre className="overflow-x-auto text-[10px] leading-relaxed text-slate-300">
              {JSON.stringify(webhookResponse, null, 2)}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
};
