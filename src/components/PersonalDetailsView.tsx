import React, { useState } from 'react';
import {
  Calendar,
  Camera,
  HeartPulse,
  Mail,
  Pencil,
  Phone,
  ShieldAlert,
  ShieldCheck,
  User,
} from 'lucide-react';
import { PatientProfile, UserAccount } from '../types';
import { EditProfileModal } from './EditProfileModal';
import { usePatientEhr } from '../context/PatientEhrContext';

interface PersonalDetailsViewProps {
  currentUser: UserAccount;
  onUpdateUser?: (updated: UserAccount) => void;
}

export const PersonalDetailsView: React.FC<PersonalDetailsViewProps> = ({
  currentUser,
  onUpdateUser,
}) => {
  const { activePatient, updatePatientDemographics } = usePatientEhr();
  const [isEditOpen, setIsEditOpen] = useState(false);

  const profile: PatientProfile = {
    fullName: activePatient.name || currentUser.fullName,
    age: activePatient.age ?? currentUser.age ?? 0,
    gender: (activePatient.gender === 'Other' ? 'Other' : activePatient.gender) as PatientProfile['gender'],
    bloodGroup: activePatient.bloodGroup || currentUser.bloodGroup || 'Unknown',
    phoneNumber: activePatient.phone || currentUser.phoneNumber || '',
    dateOfBirth: activePatient.dob || currentUser.dateOfBirth || '',
    photoUrl: currentUser.avatarUrl,
    mrn: activePatient.mrn || currentUser.mrn || '—',
    emergencyContactName: activePatient.emergencyContact?.name || currentUser.emergencyContactName || '',
    emergencyContactPhone: activePatient.emergencyContact?.phone || currentUser.emergencyContactPhone || '',
    emergencyContactRelation: activePatient.emergencyContact?.relation || currentUser.emergencyContactRelation || '',
  };

  const getInitials = (name: string) => {
    const parts = name.trim().split(' ');
    if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
    return name.slice(0, 2).toUpperCase() || 'PT';
  };

  const handleSave = (updated: PatientProfile) => {
    updatePatientDemographics(updated);
    if (onUpdateUser) {
      onUpdateUser({
        ...currentUser,
        fullName: updated.fullName,
        age: updated.age,
        gender: updated.gender,
        bloodGroup: updated.bloodGroup,
        phoneNumber: updated.phoneNumber,
        dateOfBirth: updated.dateOfBirth,
        avatarUrl: updated.photoUrl,
        mrn: updated.mrn,
        emergencyContactName: updated.emergencyContactName,
        emergencyContactPhone: updated.emergencyContactPhone,
        emergencyContactRelation: updated.emergencyContactRelation,
      });
    }
  };

  const detailRows: { label: string; value: string; icon: React.ReactNode }[] = [
    { label: 'Full name', value: profile.fullName, icon: <User className="h-3.5 w-3.5" /> },
    { label: 'Username', value: `@${currentUser.username}`, icon: <User className="h-3.5 w-3.5" /> },
    { label: 'Email', value: currentUser.email, icon: <Mail className="h-3.5 w-3.5" /> },
    { label: 'Phone', value: profile.phoneNumber || 'Not provided', icon: <Phone className="h-3.5 w-3.5" /> },
    { label: 'Date of birth', value: profile.dateOfBirth || 'Not provided', icon: <Calendar className="h-3.5 w-3.5" /> },
    { label: 'Age', value: profile.age ? `${profile.age} years` : 'Not provided', icon: <Calendar className="h-3.5 w-3.5" /> },
    { label: 'Gender', value: profile.gender || 'Not provided', icon: <User className="h-3.5 w-3.5" /> },
    { label: 'Blood group', value: profile.bloodGroup, icon: <HeartPulse className="h-3.5 w-3.5" /> },
    { label: 'Medical record number', value: profile.mrn, icon: <ShieldCheck className="h-3.5 w-3.5" /> },
  ];

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6">
      <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
        <div className="bg-gradient-to-br from-teal-800 via-emerald-800 to-slate-900 px-6 py-8 text-white sm:px-8">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-4">
              {profile.photoUrl ? (
                <img
                  src={profile.photoUrl}
                  alt={profile.fullName}
                  className="h-20 w-20 rounded-2xl object-cover ring-4 ring-white/20"
                />
              ) : (
                <div className="grid h-20 w-20 place-items-center rounded-2xl bg-white/15 text-2xl font-black ring-4 ring-white/20">
                  {getInitials(profile.fullName)}
                </div>
              )}
              <div>
                <div className="text-[11px] font-bold uppercase tracking-wider text-emerald-200">
                  Personal details
                </div>
                <h1 className="text-2xl font-extrabold tracking-tight">{profile.fullName}</h1>
                <p className="mt-1 text-sm text-emerald-50/80">
                  MRN {profile.mrn} · Canonical EHR identity
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setIsEditOpen(true)}
              className="inline-flex items-center gap-2 rounded-xl bg-white px-4 py-2.5 text-xs font-bold text-emerald-800 shadow-sm transition hover:bg-emerald-50 cursor-pointer"
            >
              <Pencil className="h-3.5 w-3.5" />
              Edit details
            </button>
          </div>
        </div>

        <div className="grid gap-4 p-6 sm:grid-cols-2">
          {detailRows.map((row) => (
            <div
              key={row.label}
              className="flex items-start gap-3 rounded-2xl border border-slate-100 bg-slate-50/70 px-4 py-3"
            >
              <div className="mt-0.5 grid h-8 w-8 shrink-0 place-items-center rounded-xl bg-white text-teal-700 ring-1 ring-slate-200">
                {row.icon}
              </div>
              <div className="min-w-0">
                <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  {row.label}
                </div>
                <div className="truncate text-sm font-bold text-slate-900">{row.value}</div>
              </div>
            </div>
          ))}
        </div>

        <div className="border-t border-slate-100 px-6 pb-6">
          <div className="mt-2 rounded-2xl border border-rose-100 bg-rose-50/70 p-4">
            <div className="mb-2 flex items-center gap-2 text-xs font-extrabold uppercase tracking-wide text-rose-800">
              <ShieldAlert className="h-4 w-4" />
              Emergency contact
            </div>
            <div className="grid gap-3 sm:grid-cols-3 text-sm">
              <div>
                <div className="text-[10px] font-bold uppercase text-rose-400">Name</div>
                <div className="font-bold text-slate-900">
                  {profile.emergencyContactName || 'Not provided'}
                </div>
              </div>
              <div>
                <div className="text-[10px] font-bold uppercase text-rose-400">Relationship</div>
                <div className="font-bold text-slate-900">
                  {profile.emergencyContactRelation || 'Not provided'}
                </div>
              </div>
              <div>
                <div className="text-[10px] font-bold uppercase text-rose-400">Phone</div>
                <div className="font-mono font-bold text-teal-800">
                  {profile.emergencyContactPhone || 'Not provided'}
                </div>
              </div>
            </div>
          </div>

          <div className="mt-4 flex items-center gap-2 text-[11px] text-slate-500">
            <Camera className="h-3.5 w-3.5 text-slate-400" />
            Profile photo and demographics are stored in your private GlobalHealth EHR identity.
          </div>
        </div>
      </div>

      <EditProfileModal
        isOpen={isEditOpen}
        onClose={() => setIsEditOpen(false)}
        initialProfile={profile}
        onSave={handleSave}
      />
    </div>
  );
};
