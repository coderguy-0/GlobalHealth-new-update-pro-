import React, { useMemo, useState } from 'react';
import { Plus, CheckCircle2, Send, Printer, Download, Sparkles, AlertTriangle } from 'lucide-react';
import { useClinicalWorkspace, PrescriptionMedicine, RX_STATUS_LABEL } from './doctorClinicalData';
import { useDoctorPortal } from './doctorPortalData';

export const DoctorPrescriptions: React.FC<{ onNavigate?: (v: any) => void }> = ({ onNavigate }) => {
  const { patients, selectedPatientId, addPrescription, updatePrescriptionStatus } = useClinicalWorkspace();
  const { doctor } = useDoctorPortal();
  const [patientId, setPatientId] = useState(selectedPatientId || patients[0]?.id || '');
  const [rxId, setRxId] = useState('');
  const [status, setStatus] = useState<'list' | 'builder' | 'review' | 'signed'>('list');
  const [signedRx, setSignedRx] = useState<string>('');
  const [medicines, setMedicines] = useState<PrescriptionMedicine[]>([]);
  const [form, setForm] = useState<PrescriptionMedicine>({
    id: `m-${Date.now()}`, name: '', strength: '', form: 'Tablet', dose: '', frequency: 'Once daily', duration: '30 days', route: 'Oral', instructions: '', quantity: 30, refills: 0,
  });
  const [patientVerified, setPatientVerified] = useState(true);
  const [allergyChecked, setAllergyChecked] = useState(true);

  const patient = patients.find((p) => p.id === patientId) || null;
  const allRx = useMemo(() => patients.flatMap((p) => p.prescriptions.map((rx) => ({ ...rx, patientName: p.name }))), [patients]);

  const addMedicine = () => {
    if (!form.name.trim() || !form.dose.trim() || !form.frequency.trim()) return;
    setMedicines((prev) => [...prev, { ...form, id: `m-${Date.now()}` }]);
    setForm((f) => ({ ...f, name: '', strength: '', dose: '', instructions: '' }));
  };

  const ready = patientVerified && allergyChecked && medicines.length > 0 && medicines.every((m) => m.name && m.dose && m.duration);

  const saveDraft = () => {
    if (!patient) return;
    const id = `rx-${Date.now()}`;
    const nextId = rxId || `RX-GH-${Math.floor(29000 + Math.random() * 9000)}`;
    addPrescription(patient.id, {
      rxId: nextId, date: new Date().toISOString().slice(0, 10), status: 'draft',
      medicines: medicines.length ? medicines : [{ ...form, id: `m-${Date.now()}` }],
      review: { patientVerified, medicineSelected: medicines.length > 0, dosageCompleted: medicines.every((m) => m.name && m.dose), durationCompleted: medicines.every((m) => m.duration), allergyChecked, requiredFields: ready },
    });
    setRxId(nextId);
    setMedicines([]);
  };

  const sign = () => {
    if (!patient || !ready) return;
    const id = `rx-${Date.now()}`;
    const nextId = rxId || `RX-GH-${Math.floor(29000 + Math.random() * 9000)}`;
    addPrescription(patient.id, {
      rxId: nextId, date: new Date().toISOString().slice(0, 10), status: 'signed',
      medicines, review: { patientVerified, medicineSelected: true, dosageCompleted: true, durationCompleted: true, allergyChecked, requiredFields: true },
    });
    setRxId('');
    setMedicines([]);
    setSignedRx(nextId);
    setStatus('signed');
  };

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 className="text-lg font-extrabold tracking-tight text-[#162235]">Prescriptions</h2>
          <p className="text-xs text-[#607086]">Create, review and securely sign digital prescriptions.</p>
        </div>
        <button type="button" onClick={() => { setStatus('builder'); setMedicines([]); }} className="inline-flex items-center gap-1.5 rounded-xl bg-[#1769E0] px-3.5 py-2 text-xs font-bold text-white hover:bg-[#145bbf]"><Plus className="h-3.5 w-3.5" /> New prescription</button>
      </div>

      {status === 'builder' || status === 'review' ? (
        <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
          <section className="rounded-2xl border border-[#E3E8EF] bg-white p-5 shadow-soft lg:col-span-2">
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <label className="block">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#8A97A8]">Patient</span>
                <select value={patientId} onChange={(e) => setPatientId(e.target.value)} className="mt-1 w-full rounded-xl border border-[#E3E8EF] px-3 py-2 text-xs focus:border-[#1769E0] focus:outline-none">
                  {patients.map((p) => <option key={p.id} value={p.id}>{p.name} · {p.identifier}</option>)}
                </select>
              </label>
              <label className="block">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#8A97A8]">Prescription ID</span>
                <input value={rxId} onChange={(e) => setRxId(e.target.value)} placeholder="Auto-generated" className="mt-1 w-full rounded-xl border border-[#E3E8EF] px-3 py-2 text-xs focus:border-[#1769E0] focus:outline-none" />
              </label>
            </div>
            <div className="mt-4 border-t border-[#E3E8EF] pt-4">
              <p className="mb-2 text-[10px] font-bold uppercase tracking-wider text-[#8A97A8]">Add medicine</p>
              <div className="grid grid-cols-2 gap-2.5 md:grid-cols-4">
                <input value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} placeholder="Medicine name" className="rounded-xl border border-[#E3E8EF] px-3 py-2 text-xs focus:border-[#1769E0] focus:outline-none md:col-span-2" />
                <input value={form.strength} onChange={(e) => setForm((f) => ({ ...f, strength: e.target.value }))} placeholder="Strength" className="rounded-xl border border-[#E3E8EF] px-3 py-2 text-xs focus:border-[#1769E0] focus:outline-none" />
                <select value={form.form} onChange={(e) => setForm((f) => ({ ...f, form: e.target.value }))} className="rounded-xl border border-[#E3E8EF] px-3 py-2 text-xs focus:border-[#1769E0] focus:outline-none">
                  {['Tablet', 'Capsule', 'Syrup', 'Injection', 'Inhaler', 'Cream'].map((x) => <option key={x}>{x}</option>)}
                </select>
                <input value={form.dose} onChange={(e) => setForm((f) => ({ ...f, dose: e.target.value }))} placeholder="Dose" className="rounded-xl border border-[#E3E8EF] px-3 py-2 text-xs focus:border-[#1769E0] focus:outline-none" />
                <select value={form.frequency} onChange={(e) => setForm((f) => ({ ...f, frequency: e.target.value }))} className="rounded-xl border border-[#E3E8EF] px-3 py-2 text-xs focus:border-[#1769E0] focus:outline-none">
                  {['Once daily', 'Twice daily', 'Thrice daily', 'At night', 'Weekly'].map((x) => <option key={x}>{x}</option>)}
                </select>
                <input value={form.duration} onChange={(e) => setForm((f) => ({ ...f, duration: e.target.value }))} placeholder="Duration" className="rounded-xl border border-[#E3E8EF] px-3 py-2 text-xs focus:border-[#1769E0] focus:outline-none" />
                <select value={form.route} onChange={(e) => setForm((f) => ({ ...f, route: e.target.value }))} className="rounded-xl border border-[#E3E8EF] px-3 py-2 text-xs focus:border-[#1769E0] focus:outline-none">
                  {['Oral', 'Topical', 'Sublingual', 'IV', 'Inhaled'].map((x) => <option key={x}>{x}</option>)}
                </select>
                <input value={form.instructions} onChange={(e) => setForm((f) => ({ ...f, instructions: e.target.value }))} placeholder="Instructions" className="rounded-xl border border-[#E3E8EF] px-3 py-2 text-xs focus:border-[#1769E0] focus:outline-none md:col-span-2" />
                <input type="number" value={form.quantity} onChange={(e) => setForm((f) => ({ ...f, quantity: Number(e.target.value) }))} placeholder="Qty" className="rounded-xl border border-[#E3E8EF] px-3 py-2 text-xs focus:border-[#1769E0] focus:outline-none" />
                <input type="number" value={form.refills} onChange={(e) => setForm((f) => ({ ...f, refills: Number(e.target.value) }))} placeholder="Refills" className="rounded-xl border border-[#E3E8EF] px-3 py-2 text-xs focus:border-[#1769E0] focus:outline-none" />
              </div>
              <button type="button" onClick={addMedicine} className="mt-2 inline-flex items-center gap-1.5 rounded-xl border border-[#1769E0] px-3 py-2 text-xs font-bold text-[#1769E0] hover:bg-[#1769E0]/5"><Plus className="h-3.5 w-3.5" /> Add medicine</button>
            </div>
            <div className="mt-4">
              <p className="mb-2 text-[10px] font-bold uppercase tracking-wider text-[#8A97A8]">Medicines in this prescription</p>
              {medicines.length === 0 ? <p className="text-xs text-slate-400">No medicines added yet.</p> : (
                <ul className="divide-y divide-[#E3E8EF]">
                  {medicines.map((m) => (
                    <li key={m.id} className="flex items-center justify-between py-2 text-xs">
                      <span className="font-bold text-[#162235]">{m.name} {m.strength} · {m.dose} · {m.frequency} · {m.duration}</span>
                      <button type="button" onClick={() => setMedicines((prev) => prev.filter((x) => x.id !== m.id))} className="rounded-lg px-2 py-1 text-[10px] font-bold text-rose-600 hover:bg-rose-50">Remove</button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
            <div className="mt-4 flex flex-wrap gap-2 border-t border-[#E3E8EF] pt-4">
              <button type="button" onClick={saveDraft} className="rounded-xl border border-[#E3E8EF] px-3.5 py-2 text-xs font-bold text-[#607086] hover:bg-slate-50">Save draft</button>
              <button type="button" onClick={() => setStatus('review')} disabled={!ready} className="rounded-xl bg-[#1769E0] px-3.5 py-2 text-xs font-bold text-white hover:bg-[#145bbf] disabled:opacity-50">Review & sign</button>
            </div>
          </section>
          <section className="rounded-2xl border border-[#E3E8EF] bg-white p-5 shadow-soft">
            <h3 className="mb-3 text-sm font-extrabold text-[#162235]">Prescription safety</h3>
            <ul className="space-y-2 text-xs">
              <SafetyRow ok={!!patient} label="Patient verified" />
              <SafetyRow ok={medicines.length > 0} label="Medicine selected" />
              <SafetyRow ok={medicines.every((m) => m.name && m.dose)} label="Dosage completed" />
              <SafetyRow ok={medicines.every((m) => m.duration)} label="Duration completed" />
              <SafetyRow ok={allergyChecked} label="Allergy checked" />
              <SafetyRow ok={ready} label="Required fields completed" />
            </ul>
            <label className="mt-4 flex items-center gap-2 text-xs text-[#607086]"><input type="checkbox" checked={allergyChecked} onChange={(e) => setAllergyChecked(e.target.checked)} className="h-4 w-4 rounded border-[#E3E8EF]" /> I have reviewed patient allergies</label>
            <p className="mt-3 flex items-start gap-1.5 rounded-xl bg-teal-50 p-2.5 text-[10px] leading-relaxed text-teal-800 ring-1 ring-teal-200"><Sparkles className="mt-0.5 h-3.5 w-3.5 shrink-0" /> This safety layer is clinical decision support only. The final clinical decision remains with you.</p>
          </section>
        </div>
      ) : null}

      {status === 'signed' && signedRx && (
        <section className="mx-auto max-w-2xl rounded-3xl border border-[#E3E8EF] bg-white p-8 shadow-soft">
          <div className="text-center">
            <div className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-emerald-50 text-emerald-600"><CheckCircle2 className="h-7 w-7" /></div>
            <h3 className="mt-3 text-xl font-extrabold text-[#162235]">Prescription signed</h3>
            <p className="text-sm text-[#607086]">{signedRx} · {doctor.displayName} · {patient?.name}</p>
          </div>
          <div className="mt-5 rounded-2xl border border-[#E3E8EF] bg-slate-50/60 p-5 text-xs">
            <p className="font-extrabold text-[#162235]">GlobalHealth Electronic Prescription</p>
            <p className="mt-1 text-[#607086]">{doctor.professionalTitle} · {doctor.specialty} · Registration {doctor.id}</p>
            <p className="mt-1 text-[#607086]">Patient {patient?.name} ({patient?.identifier}) · {new Date().toLocaleDateString()}</p>
          </div>
          <div className="mt-4 flex flex-wrap justify-center gap-2">
            <button type="button" onClick={() => { setStatus('list'); setSignedRx(''); }} className="inline-flex items-center gap-1.5 rounded-xl bg-[#1769E0] px-4 py-2 text-xs font-bold text-white hover:bg-[#145bbf]"><CheckCircle2 className="h-3.5 w-3.5" /> Done</button>
            <button type="button" className="inline-flex items-center gap-1.5 rounded-xl border border-[#E3E8EF] px-4 py-2 text-xs font-bold text-[#607086] hover:bg-slate-50"><Printer className="h-3.5 w-3.5" /> Print</button>
            <button type="button" className="inline-flex items-center gap-1.5 rounded-xl border border-[#E3E8EF] px-4 py-2 text-xs font-bold text-[#607086] hover:bg-slate-50"><Download className="h-3.5 w-3.5" /> Download</button>
            <button type="button" className="inline-flex items-center gap-1.5 rounded-xl border border-teal-200 bg-teal-50 px-4 py-2 text-xs font-bold text-teal-700 hover:bg-teal-100"><Send className="h-3.5 w-3.5" /> Send to verified pharmacy</button>
          </div>
        </section>
      )}

      {status === 'list' && (
        <section className="overflow-x-auto rounded-2xl border border-[#E3E8EF] bg-white shadow-soft">
          <table className="w-full min-w-[720px] text-left text-xs">
            <thead className="bg-slate-50/80">
              <tr className="border-b border-[#E3E8EF] text-[10px] font-bold uppercase tracking-wider text-[#8A97A8]"><th className="px-4 py-3">RX ID</th><th className="px-3 py-3">Patient</th><th className="px-3 py-3">Medicines</th><th className="px-3 py-3">Date</th><th className="px-3 py-3">Status</th><th className="px-3 py-3 text-right">Actions</th></tr>
            </thead>
            <tbody>
              {allRx.map((rx) => (
                <tr key={rx.id} className="border-b border-slate-50">
                  <td className="px-4 py-3 font-mono font-bold text-[#162235]">{rx.rxId}</td>
                  <td className="px-3 py-3">{rx.patientName}</td>
                  <td className="px-3 py-3 text-[#607086]">{rx.medicines.map((m) => m.name).join(', ')}</td>
                  <td className="px-3 py-3">{rx.date}</td>
                  <td className="px-3 py-3"><span className={`rounded-full px-2 py-0.5 text-[9px] font-bold ${rx.status === 'signed' ? 'bg-emerald-50 text-emerald-700' : rx.status === 'sent_pharmacy' ? 'bg-teal-50 text-teal-700' : 'bg-slate-100 text-slate-500'}`}>{RX_STATUS_LABEL[rx.status]}</span></td>
                  <td className="px-3 py-3 text-right">
                    {rx.status === 'draft' && <button type="button" onClick={() => updatePrescriptionStatus(rx.id, 'signed')} className="rounded-lg bg-[#1769E0] px-2.5 py-1.5 text-[10px] font-bold text-white">Sign</button>}
                    {rx.status === 'signed' && <button type="button" onClick={() => updatePrescriptionStatus(rx.id, 'sent_pharmacy')} className="rounded-lg border border-[#E3E8EF] px-2.5 py-1.5 text-[10px] font-bold text-[#607086]">Send</button>}
                  </td>
                </tr>
              ))}
              {allRx.length === 0 && <tr><td colSpan={6} className="py-8 text-center text-xs text-slate-400">No prescriptions yet.</td></tr>}
            </tbody>
          </table>
        </section>
      )}
    </div>
  );
};

const SafetyRow: React.FC<{ ok: boolean; label: string }> = ({ ok, label }) => (
  <li className={`flex items-center gap-2 rounded-xl px-3 py-2 ${ok ? 'bg-emerald-50 text-emerald-800' : 'bg-slate-50 text-[#607086]'}`}>
    {ok ? <CheckCircle2 className="h-4 w-4 text-emerald-600" /> : <AlertTriangle className="h-4 w-4 text-slate-400" />} <span className="font-bold">{label}</span>
  </li>
);
