import React, { useState, useRef } from 'react';
import {
  X,
  User,
  Camera,
  Upload,
  Link,
  Trash2,
  Check,
  Phone,
  Calendar,
  Heart,
  Droplet,
  Shield,
  Sparkles,
  AlertCircle,
  RefreshCw
} from 'lucide-react';
import { PatientProfile } from '../types';
import { useLocalization } from '../context/LocalizationContext';

interface EditProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialProfile: PatientProfile;
  onSave: (updated: PatientProfile) => void;
}

const BLOOD_GROUPS = ['O+', 'O-', 'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'Unknown'];
const GENDERS: Array<'Male' | 'Female' | 'Other' | 'Prefer not to say'> = [
  'Male',
  'Female',
  'Other',
  'Prefer not to say'
];

const PRESET_AVATARS = [
  { label: 'Avatar 1 (Male)', url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=300' },
  { label: 'Avatar 2 (Male)', url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=300' },
  { label: 'Avatar 3 (Female)', url: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=300' },
  { label: 'Avatar 4 (Male)', url: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=300' },
  { label: 'Avatar 5 (Female)', url: 'https://images.unsplash.com/photo-1594824813593-5494d45d985a?auto=format&fit=crop&q=80&w=300' },
  { label: 'Avatar 6 (Female)', url: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=300' },
];

export const EditProfileModal: React.FC<EditProfileModalProps> = ({
  isOpen,
  onClose,
  initialProfile,
  onSave
}) => {
  const { t } = useLocalization();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState<PatientProfile>({ ...initialProfile });
  const [photoMode, setPhotoMode] = useState<'upload' | 'url' | 'presets'>('upload');
  const [customUrl, setCustomUrl] = useState('');
  const [photoError, setPhotoError] = useState<string | null>(null);
  const [showSavedToast, setShowSavedToast] = useState(false);

  if (!isOpen) return null;

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    setPhotoError(null);
    if (!file) return;

    // Check size limit ~5MB
    if (file.size > 5 * 1024 * 1024) {
      setPhotoError('Image file is too large (maximum size is 5MB).');
      return;
    }

    if (!file.type.startsWith('image/')) {
      setPhotoError('Please select a valid image file (PNG, JPG, WEBP).');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      if (typeof event.target?.result === 'string') {
        setFormData((prev) => ({ ...prev, photoUrl: event.target?.result as string }));
      }
    };
    reader.onerror = () => {
      setPhotoError('Failed to read photo file. Please try again.');
    };
    reader.readAsDataURL(file);
  };

  const handleApplyCustomUrl = () => {
    if (!customUrl.trim()) return;
    setFormData((prev) => ({ ...prev, photoUrl: customUrl.trim() }));
    setCustomUrl('');
  };

  const handleRemovePhoto = () => {
    setFormData((prev) => ({ ...prev, photoUrl: undefined }));
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleDobChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newDob = e.target.value;
    setFormData((prev) => {
      let calculatedAge = prev.age;
      if (newDob) {
        const birthDate = new Date(newDob);
        const today = new Date();
        let age = today.getFullYear() - birthDate.getFullYear();
        const monthDiff = today.getMonth() - birthDate.getMonth();
        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
          age--;
        }
        if (!isNaN(age) && age >= 0 && age <= 130) {
          calculatedAge = age;
        }
      }
      return { ...prev, dateOfBirth: newDob, age: calculatedAge };
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.fullName.trim()) return;

    onSave(formData);
    setShowSavedToast(true);
    setTimeout(() => {
      setShowSavedToast(false);
      onClose();
    }, 600);
  };

  const getInitials = (name: string) => {
    const parts = name.trim().split(' ');
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return name.slice(0, 2).toUpperCase() || 'PT';
  };

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-xs overflow-y-auto animate-in fade-in duration-150">
      <div className="relative w-full max-w-2xl rounded-3xl bg-white p-6 sm:p-8 shadow-2xl border border-slate-100 my-8">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-6">
          <div className="flex items-center gap-3">
            <div className="grid h-10 w-10 place-items-center rounded-2xl bg-emerald-50 text-emerald-600 border border-emerald-100">
              <User className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-lg sm:text-xl font-extrabold text-slate-900">
                {t('Edit Patient Health Profile')}
              </h3>
              <p className="text-xs text-slate-500">
                {t('Update your personal details, blood group, contact information, and photo.')}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-full p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition"
            aria-label="Close modal"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="space-y-6">
          
          {/* PHOTO SECTION */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black uppercase text-slate-500 tracking-wider flex items-center gap-1.5">
                <Camera className="h-4 w-4 text-emerald-600" /> {t('Profile Photo / Avatar')}
              </span>
              {formData.photoUrl && (
                <button
                  type="button"
                  onClick={handleRemovePhoto}
                  className="text-xs font-semibold text-rose-600 hover:text-rose-700 flex items-center gap-1 transition"
                >
                  <Trash2 className="h-3.5 w-3.5" /> {t('Remove Photo')}
                </button>
              )}
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-5">
              {/* Photo Preview Frame */}
              <div className="relative group shrink-0">
                {formData.photoUrl ? (
                  <img
                    src={formData.photoUrl}
                    alt={formData.fullName}
                    className="h-24 w-24 rounded-2xl object-cover border-2 border-emerald-500 shadow-md"
                  />
                ) : (
                  <div className="grid h-24 w-24 place-items-center rounded-2xl bg-emerald-600 text-white font-black text-2xl shadow-md border-2 border-emerald-400">
                    {getInitials(formData.fullName)}
                  </div>
                )}
                <div 
                  onClick={() => fileInputRef.current?.click()}
                  className="absolute inset-0 bg-black/40 rounded-2xl opacity-0 group-hover:opacity-100 transition flex items-center justify-center cursor-pointer text-white text-[11px] font-bold"
                >
                  <Camera className="h-4 w-4 mr-1" /> {t('Change')}
                </div>
              </div>

              {/* Photo Options */}
              <div className="flex-1 space-y-3 w-full">
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setPhotoMode('upload')}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                      photoMode === 'upload'
                        ? 'bg-emerald-600 text-white shadow-2xs'
                        : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    <Upload className="h-3.5 w-3.5 inline mr-1" /> {t('Upload Photo')}
                  </button>
                  <button
                    type="button"
                    onClick={() => setPhotoMode('url')}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                      photoMode === 'url'
                        ? 'bg-emerald-600 text-white shadow-2xs'
                        : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    <Link className="h-3.5 w-3.5 inline mr-1" /> {t('Image URL')}
                  </button>
                  <button
                    type="button"
                    onClick={() => setPhotoMode('presets')}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                      photoMode === 'presets'
                        ? 'bg-emerald-600 text-white shadow-2xs'
                        : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    <Sparkles className="h-3.5 w-3.5 inline mr-1" /> {t('Preset Avatars')}
                  </button>
                </div>

                {photoMode === 'upload' && (
                  <div className="space-y-2">
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleFileUpload}
                      className="hidden"
                      id="profile-photo-upload"
                    />
                    <label
                      htmlFor="profile-photo-upload"
                      className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white border border-slate-200 text-xs font-bold text-slate-800 hover:border-emerald-500 hover:text-emerald-700 cursor-pointer shadow-2xs transition"
                    >
                      <Upload className="h-4 w-4 text-emerald-600" />
                      <span>{t('Choose Image from Device')}</span>
                    </label>
                    <span className="text-[11px] text-slate-500 block">
                      {t('Supports PNG, JPG, JPEG, WEBP up to 5MB')}
                    </span>
                  </div>
                )}

                {photoMode === 'url' && (
                  <div className="flex items-center gap-2">
                    <input
                      type="url"
                      value={customUrl}
                      onChange={(e) => setCustomUrl(e.target.value)}
                      placeholder="https://example.com/photo.jpg"
                      className="flex-1 rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs text-slate-800 focus:border-emerald-500 focus:outline-hidden"
                    />
                    <button
                      type="button"
                      onClick={handleApplyCustomUrl}
                      className="px-3.5 py-1.5 rounded-xl bg-slate-900 text-white text-xs font-bold hover:bg-slate-800 transition"
                    >
                      {t('Apply')}
                    </button>
                  </div>
                )}

                {photoMode === 'presets' && (
                  <div className="flex flex-wrap items-center gap-2 pt-1">
                    {PRESET_AVATARS.map((avatar, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setFormData((prev) => ({ ...prev, photoUrl: avatar.url }))}
                        className={`relative h-10 w-10 rounded-xl overflow-hidden border-2 transition ${
                          formData.photoUrl === avatar.url
                            ? 'border-emerald-600 ring-2 ring-emerald-400'
                            : 'border-slate-200 hover:border-emerald-400'
                        }`}
                        title={avatar.label}
                      >
                        <img src={avatar.url} alt={avatar.label} className="h-full w-full object-cover" />
                      </button>
                    ))}
                  </div>
                )}

                {photoError && (
                  <div className="text-[11px] text-rose-600 font-semibold flex items-center gap-1">
                    <AlertCircle className="h-3.5 w-3.5 shrink-0" /> {photoError}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* PRIMARY PERSONAL DATA GRID */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            {/* Full Name */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                {t('Full Name')} <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                value={formData.fullName}
                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                placeholder="e.g. Rahul Kumar"
                className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-xs text-slate-900 font-bold focus:border-emerald-500 focus:outline-hidden shadow-2xs"
              />
            </div>

            {/* Phone Number */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                {t('Phone Number')}
              </label>
              <div className="relative">
                <Phone className="absolute left-3 top-3 h-3.5 w-3.5 text-slate-400" />
                <input
                  type="tel"
                  value={formData.phoneNumber}
                  onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                  placeholder="e.g. +1 (555) 234-5678"
                  className="w-full rounded-xl border border-slate-200 bg-white pl-9 pr-3.5 py-2.5 text-xs text-slate-900 font-bold focus:border-emerald-500 focus:outline-hidden shadow-2xs"
                />
              </div>
            </div>

            {/* Age */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                {t('Age (Years)')}
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  min={0}
                  max={130}
                  value={formData.age}
                  onChange={(e) => setFormData({ ...formData, age: Number(e.target.value) || 0 })}
                  className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-xs text-slate-900 font-bold focus:border-emerald-500 focus:outline-hidden shadow-2xs"
                />
                <span className="text-xs font-bold text-slate-500 shrink-0">{t('Yrs')}</span>
              </div>
            </div>

            {/* Date of Birth */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                {t('Date of Birth')}
              </label>
              <div className="relative">
                <Calendar className="absolute left-3 top-3 h-3.5 w-3.5 text-slate-400" />
                <input
                  type="date"
                  value={formData.dateOfBirth}
                  onChange={handleDobChange}
                  className="w-full rounded-xl border border-slate-200 bg-white pl-9 pr-3.5 py-2.5 text-xs text-slate-900 font-bold focus:border-emerald-500 focus:outline-hidden shadow-2xs"
                />
              </div>
            </div>

            {/* Blood Group */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                {t('Blood Group')}
              </label>
              <div className="relative">
                <Droplet className="absolute left-3 top-3 h-3.5 w-3.5 text-rose-500" />
                <select
                  value={formData.bloodGroup}
                  onChange={(e) => setFormData({ ...formData, bloodGroup: e.target.value })}
                  className="w-full rounded-xl border border-slate-200 bg-white pl-9 pr-3.5 py-2.5 text-xs text-slate-900 font-black focus:border-emerald-500 focus:outline-hidden shadow-2xs cursor-pointer"
                >
                  {BLOOD_GROUPS.map((bg) => (
                    <option key={bg} value={bg}>
                      {bg}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Gender */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                {t('Gender')}
              </label>
              <select
                value={formData.gender}
                onChange={(e) => setFormData({ ...formData, gender: e.target.value as any })}
                className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-xs text-slate-900 font-bold focus:border-emerald-500 focus:outline-hidden shadow-2xs cursor-pointer"
              >
                {GENDERS.map((g) => (
                  <option key={g} value={g}>
                    {g}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* EMERGENCY CONTACT SECTION */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-3">
            <span className="text-xs font-black uppercase text-slate-500 tracking-wider flex items-center gap-1.5">
              <Shield className="h-4 w-4 text-emerald-600" /> {t('Emergency Contact Details')}
            </span>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-[11px] font-bold text-slate-600 mb-1">
                  {t('Contact Name')}
                </label>
                <input
                  type="text"
                  value={formData.emergencyContactName}
                  onChange={(e) => setFormData({ ...formData, emergencyContactName: e.target.value })}
                  placeholder="e.g. Priya Kumar"
                  className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs text-slate-800 font-bold focus:border-emerald-500 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-600 mb-1">
                  {t('Relationship')}
                </label>
                <input
                  type="text"
                  value={formData.emergencyContactRelation}
                  onChange={(e) => setFormData({ ...formData, emergencyContactRelation: e.target.value })}
                  placeholder="e.g. Spouse / Parent"
                  className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs text-slate-800 font-bold focus:border-emerald-500 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-600 mb-1">
                  {t('Emergency Phone')}
                </label>
                <input
                  type="tel"
                  value={formData.emergencyContactPhone}
                  onChange={(e) => setFormData({ ...formData, emergencyContactPhone: e.target.value })}
                  placeholder="e.g. +1 (555) 890-1234"
                  className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs text-slate-800 font-bold focus:border-emerald-500 focus:outline-hidden"
                />
              </div>
            </div>
          </div>

          {/* FOOTER ACTIONS */}
          <div className="flex items-center justify-between pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl border border-slate-200 bg-white text-xs font-bold text-slate-700 hover:bg-slate-50 transition"
            >
              {t('Cancel')}
            </button>

            <button
              type="submit"
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-md shadow-emerald-600/20 transition cursor-pointer"
            >
              <Check className="h-4 w-4" />
              <span>{t('Save Health Profile')}</span>
            </button>
          </div>
        </form>

        {/* Success Toast */}
        {showSavedToast && (
          <div className="absolute bottom-6 right-6 flex items-center gap-2 px-4 py-2.5 bg-emerald-600 text-white rounded-2xl shadow-xl text-xs font-bold animate-in fade-in slide-in-from-bottom-3">
            <Check className="h-4 w-4" /> {t('Health Profile Updated!')}
          </div>
        )}
      </div>
    </div>
  );
};
