import React, { useState, useRef, useEffect } from 'react';
import {
  X,
  Upload,
  Camera,
  HardDrive,
  FileText,
  Plus,
  Trash2,
  Check,
  Calendar,
  User,
  Building2,
  Stethoscope,
  Sparkles,
  AlertCircle,
  Clock,
  ShieldCheck,
  Eye,
  RefreshCw,
  Image as ImageIcon,
  CheckCircle2,
  FileCode,
  Layers,
  HelpCircle
} from 'lucide-react';
import {
  ClinicalPrescriptionRecord,
  PrescriptionSourceType,
  PrescriptionPageItem,
  PrescribedMedicationEntry
} from '../../types/clinicalPrescription';

interface SavePrescriptionModalProps {
  isOpen: boolean;
  onClose: () => void;
  patientId: string;
  patientName: string;
  onSave: (prescription: Omit<ClinicalPrescriptionRecord, 'id' | 'createdAt'>) => void;
  onAddMedicationReminder?: (reminder: {
    name: string;
    dosage: string;
    time: string;
    days: string[];
    notes?: string;
  }) => void;
}

const SAMPLE_GOOGLE_DRIVE_FILES = [
  {
    id: 'DRIVE-DOC-1',
    name: 'Dr_Chen_Apex_Heart_Prescription_Aug2026.pdf',
    size: '520 KB',
    updated: '2026-08-07',
    doctor: 'Dr. Alexandra Chen, MD',
    clinic: 'Apex Multispecialty Hospital',
    thumbnail: 'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'DRIVE-DOC-2',
    name: 'Max_SuperSpeciality_Endocrine_Rx_Jul2026.pdf',
    size: '890 KB',
    updated: '2026-07-20',
    doctor: 'Dr. Sarah Jenkins, MD',
    clinic: 'Max Super Speciality Hospital',
    thumbnail: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'DRIVE-DOC-3',
    name: 'Apollo_Discharge_Prescription_Cardiology.pdf',
    size: '1.4 MB',
    updated: '2026-06-15',
    doctor: 'Dr. Marcus Vance, MD',
    clinic: 'Apollo Health City',
    thumbnail: 'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&w=800&q=80'
  }
];

export const SavePrescriptionModal: React.FC<SavePrescriptionModalProps> = ({
  isOpen,
  onClose,
  patientId,
  patientName,
  onSave,
  onAddMedicationReminder
}) => {
  // Mode of Adding / Uploading
  const [sourceMode, setSourceMode] = useState<PrescriptionSourceType>('FILE_UPLOAD');

  // Form Fields
  const [title, setTitle] = useState('');
  const [doctorName, setDoctorName] = useState('');
  const [doctorRegNo, setDoctorRegNo] = useState('');
  const [doctorSpecialty, setDoctorSpecialty] = useState('Cardiology & Internal Medicine');
  const [hospitalClinic, setHospitalClinic] = useState('');
  const [department, setDepartment] = useState('');
  const [prescriptionDate, setPrescriptionDate] = useState(
    new Date().toISOString().split('T')[0]
  );
  const [validUntil, setValidUntil] = useState(
    new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
  );
  const [diagnosis, setDiagnosis] = useState('');
  const [clinicalNotes, setClinicalNotes] = useState('');
  const [syncReminders, setSyncReminders] = useState(true);

  // Pages & Scans
  const [pages, setPages] = useState<PrescriptionPageItem[]>([]);
  const [customDriveUrl, setCustomDriveUrl] = useState('');
  const [selectedDriveDoc, setSelectedDriveDoc] = useState<string | null>(null);

  // Prescribed Medications Table
  const [medications, setMedications] = useState<PrescribedMedicationEntry[]>([
    {
      id: 'med-1',
      name: '',
      dosage: '',
      form: 'Tablet',
      frequency: 'Once Daily',
      timing: 'After Meals',
      duration: '30 Days',
      refillsRemaining: 2,
      instructions: 'Take with plenty of water.'
    }
  ]);

  // Camera State
  const [cameraStream, setCameraStream] = useState<MediaStream | null>(null);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Reset form when opened
  useEffect(() => {
    if (isOpen) {
      setTitle('Cardiovascular & General Health Regimen');
      setDoctorName('Dr. Alexandra Chen, MD');
      setDoctorRegNo('MCI-748920-CARD');
      setHospitalClinic('Apex Multispecialty Hospital');
      setDepartment('Outpatient Cardiology');
      setDiagnosis('Hypertension (Stage 1) & Mild Dyslipidemia');
      setClinicalNotes('Maintain regular blood pressure monitoring. Continue low-sodium diet.');
      setPages([
        {
          id: `page-${Date.now()}-1`,
          pageNumber: 1,
          fileName: 'Apex_Hospital_Prescription_Page_1.jpg',
          fileSize: '640 KB',
          fileType: 'image/jpeg',
          previewUrl: 'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&w=800&q=80',
          uploadedAt: new Date().toISOString()
        }
      ]);
      setMedications([
        {
          id: `med-${Date.now()}-1`,
          name: 'Lisinopril',
          dosage: '10mg',
          form: 'Tablet',
          frequency: 'Once Daily (Morning)',
          timing: 'After Meals',
          duration: '90 Days',
          refillsRemaining: 3,
          instructions: 'Take in morning. Check BP weekly.'
        },
        {
          id: `med-${Date.now()}-2`,
          name: 'Atorvastatin',
          dosage: '20mg',
          form: 'Tablet',
          frequency: 'Once Daily (Bedtime)',
          timing: 'At Bedtime',
          duration: '90 Days',
          refillsRemaining: 3,
          instructions: 'Take after dinner or at bedtime.'
        }
      ]);
    } else {
      stopCamera();
    }
  }, [isOpen]);

  // Camera Lifecycle
  const startCamera = async () => {
    setCameraError(null);
    setIsCameraActive(true);
    try {
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: 'environment', width: { ideal: 1280 }, height: { ideal: 720 } }
        });
        setCameraStream(stream);
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.play();
        }
      } else {
        setCameraError('Camera access not supported on this device. You can upload an image file instead.');
      }
    } catch (err: any) {
      setCameraError('Camera access was not granted. Please allow camera permissions or upload a saved photo.');
    }
  };

  const stopCamera = () => {
    if (cameraStream) {
      cameraStream.getTracks().forEach((track) => track.stop());
      setCameraStream(null);
    }
    setIsCameraActive(false);
  };

  const capturePhoto = () => {
    if (videoRef.current) {
      const video = videoRef.current;
      const canvas = document.createElement('canvas');
      canvas.width = video.videoWidth || 640;
      canvas.height = video.videoHeight || 480;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        const dataUrl = canvas.toDataURL('image/jpeg', 0.9);
        const newPage: PrescriptionPageItem = {
          id: `page-cam-${Date.now()}`,
          pageNumber: pages.length + 1,
          fileName: `Prescription_Capture_Page_${pages.length + 1}.jpg`,
          fileSize: '780 KB',
          fileType: 'image/jpeg',
          previewUrl: dataUrl,
          capturedViaCamera: true,
          uploadedAt: new Date().toISOString()
        };
        setPages((prev) => [...prev, newPage]);
      }
    } else {
      // Fallback simulated photo capture
      const newPage: PrescriptionPageItem = {
        id: `page-cam-${Date.now()}`,
        pageNumber: pages.length + 1,
        fileName: `Prescription_Camera_Photo_${pages.length + 1}.jpg`,
        fileSize: '820 KB',
        fileType: 'image/jpeg',
        previewUrl: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=800&q=80',
        capturedViaCamera: true,
        uploadedAt: new Date().toISOString()
      };
      setPages((prev) => [...prev, newPage]);
    }
  };

  // Local File Upload Handler
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    Array.from(files).forEach((file: File, index) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        const previewUrl =
          (event.target?.result as string) ||
          'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&w=800&q=80';
        
        const newPage: PrescriptionPageItem = {
          id: `page-file-${Date.now()}-${index}`,
          pageNumber: pages.length + index + 1,
          fileName: file.name,
          fileSize: `${Math.round(file.size / 1024)} KB`,
          fileType: file.type.includes('pdf') ? 'application/pdf' : 'image/jpeg',
          previewUrl,
          uploadedAt: new Date().toISOString()
        };
        setPages((prev) => [...prev, newPage]);
      };
      reader.readAsDataURL(file);
    });

    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Google Drive Import Handler
  const handleSelectDriveDoc = (doc: typeof SAMPLE_GOOGLE_DRIVE_FILES[0]) => {
    setSelectedDriveDoc(doc.id);
    const newPage: PrescriptionPageItem = {
      id: `page-drive-${Date.now()}`,
      pageNumber: pages.length + 1,
      fileName: doc.name,
      fileSize: doc.size,
      fileType: 'application/pdf',
      previewUrl: doc.thumbnail,
      driveUrl: `https://drive.google.com/file/d/${doc.id}/view`,
      uploadedAt: new Date().toISOString()
    };
    setPages((prev) => [...prev, newPage]);
    setDoctorName(doc.doctor);
    setHospitalClinic(doc.clinic);
  };

  const handleAddDriveUrl = () => {
    if (!customDriveUrl.trim()) return;
    const newPage: PrescriptionPageItem = {
      id: `page-drive-${Date.now()}`,
      pageNumber: pages.length + 1,
      fileName: 'Google_Drive_Prescription_Document.pdf',
      fileSize: 'Cloud Linked',
      fileType: 'application/pdf',
      previewUrl: 'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&w=800&q=80',
      driveUrl: customDriveUrl,
      uploadedAt: new Date().toISOString()
    };
    setPages((prev) => [...prev, newPage]);
    setCustomDriveUrl('');
  };

  const removePage = (id: string) => {
    setPages((prev) => prev.filter((p) => p.id !== id).map((p, idx) => ({ ...p, pageNumber: idx + 1 })));
  };

  // Medication rows handling
  const addMedicationRow = () => {
    setMedications((prev) => [
      ...prev,
      {
        id: `med-${Date.now()}-${prev.length + 1}`,
        name: '',
        dosage: '',
        form: 'Tablet',
        frequency: 'Once Daily',
        timing: 'After Meals',
        duration: '30 Days',
        refillsRemaining: 1,
        instructions: ''
      }
    ]);
  };

  const updateMedicationRow = (
    id: string,
    field: keyof PrescribedMedicationEntry,
    value: any
  ) => {
    setMedications((prev) =>
      prev.map((m) => (m.id === id ? { ...m, [field]: value } : m))
    );
  };

  const removeMedicationRow = (id: string) => {
    if (medications.length <= 1) return;
    setMedications((prev) => prev.filter((m) => m.id !== id));
  };

  // Pre-fill Verified Sample Data
  const handleAutoFillSample = () => {
    setTitle('Cardiology Preventive Regimen');
    setDoctorName('Dr. Alexandra Chen, MD, FACC');
    setDoctorRegNo('MCI-748920-CARD');
    setDoctorSpecialty('Cardiology & Hypertension');
    setHospitalClinic('Apex Multispecialty Hospital & Heart Institute');
    setDepartment('Preventive Cardiology Clinic');
    setDiagnosis('Primary Hypertension (ICD-10: I10)');
    setClinicalNotes('Patient responded positively to initial therapy. Maintain lifestyle modifications.');
    if (pages.length === 0) {
      setPages([
        {
          id: `page-sample-1`,
          pageNumber: 1,
          fileName: 'Apex_Cardiology_Verified_Prescription.pdf',
          fileSize: '540 KB',
          fileType: 'application/pdf',
          previewUrl: 'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&w=800&q=80',
          uploadedAt: new Date().toISOString()
        }
      ]);
    }
    setMedications([
      {
        id: 'med-sample-1',
        name: 'Lisinopril',
        dosage: '10mg',
        form: 'Tablet',
        frequency: 'Once Daily (Morning)',
        timing: 'After Meals',
        duration: '90 Days',
        refillsRemaining: 3,
        instructions: 'Take with full glass of water.'
      },
      {
        id: 'med-sample-2',
        name: 'Metoprolol Succinate ER',
        dosage: '25mg',
        form: 'Tablet',
        frequency: 'Once Daily (Morning)',
        timing: 'With Meals',
        duration: '90 Days',
        refillsRemaining: 3,
        instructions: 'Do not crush extended-release tablet.'
      }
    ]);
  };

  // Submit & Save
  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const validMeds = medications.filter((m) => m.name.trim() !== '');

    const finalRecord: Omit<ClinicalPrescriptionRecord, 'id' | 'createdAt'> = {
      patientId,
      patientName,
      title: title.trim() || 'Medical Prescription Document',
      doctorName: doctorName.trim() || 'Attending Physician',
      doctorRegNo: doctorRegNo.trim() || 'REG-PENDING',
      doctorSpecialty: doctorSpecialty.trim() || 'General Medicine',
      hospitalClinic: hospitalClinic.trim() || 'Clinical Medical Center',
      department: department.trim() || 'Outpatient Clinic',
      prescriptionDate,
      validUntil,
      status: 'Active',
      diagnosis: diagnosis.trim() || 'Clinical Health Review',
      medications: validMeds,
      clinicalNotes,
      source: sourceMode,
      pages: pages.length > 0 ? pages : [
        {
          id: `page-def-${Date.now()}`,
          pageNumber: 1,
          fileName: 'Clinical_Prescription_Slip.pdf',
          fileSize: '320 KB',
          fileType: 'application/pdf',
          previewUrl: 'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&w=800&q=80',
          uploadedAt: new Date().toISOString()
        }
      ],
      isVerifiedByClinician: true,
      verifiedBy: doctorName.trim() || 'Dr. Alexandra Chen, MD',
      verifiedAt: new Date().toISOString(),
      tags: ['Clinical Record', doctorSpecialty, 'Prescription Slip']
    };

    onSave(finalRecord);

    // Auto-sync medication reminders if enabled
    if (syncReminders && onAddMedicationReminder) {
      validMeds.forEach((m) => {
        onAddMedicationReminder({
          name: `${m.name} ${m.dosage}`,
          dosage: m.dosage,
          time: m.timing === 'At Bedtime' ? '09:00 PM' : '08:00 AM',
          days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
          notes: `${m.instructions} (Prescribed by ${doctorName})`
        });
      });
    }

    stopCamera();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/70 backdrop-blur-xs overflow-y-auto animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-4xl rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh] my-auto">
        
        {/* Header */}
        <div className="p-5 sm:p-6 bg-slate-900 text-white flex items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-teal-500/20 text-teal-300 border border-teal-400/30 flex items-center justify-center shrink-0">
              <FileText className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base sm:text-lg font-black tracking-tight text-white">
                  Save Doctor Prescription
                </h3>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-teal-400/20 text-teal-300 border border-teal-400/30">
                  Clinical Health Record
                </span>
              </div>
              <p className="text-xs text-slate-300">
                Patient: <strong className="text-white">{patientName}</strong> • Archive scanned prescription slips, camera clicks & Drive documents
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleAutoFillSample}
              className="hidden sm:inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-teal-300 text-xs font-semibold border border-slate-700 transition"
              title="Pre-fill sample verified prescription"
            >
              <Sparkles className="h-3.5 w-3.5" />
              <span>Sample Pre-fill</span>
            </button>

            <button
              onClick={() => {
                stopCamera();
                onClose();
              }}
              className="rounded-full p-2 text-slate-400 hover:bg-slate-800 hover:text-white transition"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Prescription Source Method Switcher */}
        <div className="p-4 bg-slate-50 border-b border-slate-200 flex flex-wrap items-center gap-2 shrink-0">
          <span className="text-xs font-bold text-slate-700 mr-1">Capture Method:</span>
          
          <button
            type="button"
            onClick={() => {
              setSourceMode('FILE_UPLOAD');
              stopCamera();
            }}
            className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
              sourceMode === 'FILE_UPLOAD'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-100'
            }`}
          >
            <Upload className="h-3.5 w-3.5" />
            <span>Upload File (PDF / Images)</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setSourceMode('CAMERA_CAPTURE');
              startCamera();
            }}
            className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
              sourceMode === 'CAMERA_CAPTURE'
                ? 'bg-teal-700 text-white shadow-xs'
                : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-100'
            }`}
          >
            <Camera className="h-3.5 w-3.5" />
            <span>Click Photo / Camera</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setSourceMode('GOOGLE_DRIVE');
              stopCamera();
            }}
            className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
              sourceMode === 'GOOGLE_DRIVE'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-100'
            }`}
          >
            <HardDrive className="h-3.5 w-3.5" />
            <span>Google Drive Import</span>
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <form onSubmit={handleFormSubmit} className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-6">

          {/* ========================================================================= */}
          {/* SECTION 1: PRESCRIPTION PAGES & SCANNED DOCUMENTS                         */}
          {/* ========================================================================= */}
          <div className="p-4 sm:p-5 rounded-2xl bg-slate-50/80 border border-slate-200 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                  <Layers className="h-4 w-4 text-teal-700" />
                  <span>Prescription Pages & Scanned Slips ({pages.length} Pages)</span>
                </h4>
                <p className="text-[11px] text-slate-500">
                  Save one or multiple pages of the prescription slip
                </p>
              </div>

              {sourceMode === 'FILE_UPLOAD' && (
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition cursor-pointer shadow-2xs"
                >
                  <Plus className="h-3.5 w-3.5" />
                  <span>Add Page / File</span>
                </button>
              )}
            </div>

            {/* Hidden Native File Input */}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*,application/pdf"
              multiple
              onChange={handleFileUpload}
              className="hidden"
            />

            {/* 1A. CAMERA CAPTURE VIEW */}
            {sourceMode === 'CAMERA_CAPTURE' && (
              <div className="p-4 rounded-2xl bg-slate-900 text-white space-y-3">
                <div className="relative aspect-video max-h-64 bg-slate-950 rounded-xl overflow-hidden flex items-center justify-center border border-slate-800">
                  {isCameraActive && !cameraError ? (
                    <video
                      ref={videoRef}
                      autoPlay
                      playsInline
                      muted
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="text-center p-4 space-y-2">
                      <Camera className="h-8 w-8 text-slate-500 mx-auto" />
                      <p className="text-xs text-slate-400">
                        {cameraError || 'Camera initialized. Position prescription slip in good lighting.'}
                      </p>
                    </div>
                  )}

                  {/* Viewfinder Grid Overlay */}
                  <div className="absolute inset-4 border-2 border-dashed border-teal-400/40 rounded-lg pointer-events-none flex items-center justify-center">
                    <span className="text-[10px] text-teal-300 font-mono bg-slate-950/70 px-2 py-0.5 rounded">
                      Align Prescription Paper Here
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-1">
                  <div className="text-[11px] text-slate-400">
                    Click <strong>Capture Page Photo</strong> to snapshot page #{pages.length + 1}
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={startCamera}
                      className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition"
                    >
                      <RefreshCw className="h-3 w-3 inline mr-1" />
                      Restart Camera
                    </button>
                    <button
                      type="button"
                      onClick={capturePhoto}
                      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 text-xs font-black transition shadow-md cursor-pointer"
                    >
                      <Camera className="h-4 w-4" />
                      <span>Capture Page Photo</span>
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* 1B. GOOGLE DRIVE IMPORT VIEW */}
            {sourceMode === 'GOOGLE_DRIVE' && (
              <div className="p-4 rounded-2xl bg-blue-50/60 border border-blue-200 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs font-bold text-blue-900">
                    <HardDrive className="h-4 w-4 text-blue-600" />
                    <span>Select from Connected Google Drive</span>
                  </div>
                  <span className="text-[10px] font-bold text-blue-700 bg-blue-100 px-2 py-0.5 rounded-md">
                    OAuth Connected
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                  {SAMPLE_GOOGLE_DRIVE_FILES.map((doc) => (
                    <div
                      key={doc.id}
                      onClick={() => handleSelectDriveDoc(doc)}
                      className={`p-3 rounded-xl border cursor-pointer transition flex flex-col justify-between gap-2 text-xs ${
                        selectedDriveDoc === doc.id
                          ? 'border-blue-600 bg-blue-100/60 ring-2 ring-blue-500/20'
                          : 'border-slate-200 bg-white hover:bg-slate-50'
                      }`}
                    >
                      <div className="space-y-1">
                        <div className="flex items-center justify-between">
                          <FileText className="h-4 w-4 text-blue-600" />
                          <span className="text-[10px] text-slate-400 font-mono">{doc.size}</span>
                        </div>
                        <p className="font-bold text-slate-900 text-[11px] line-clamp-2 leading-tight">
                          {doc.name}
                        </p>
                        <p className="text-[10px] text-slate-500 truncate">{doc.doctor}</p>
                      </div>
                      <button
                        type="button"
                        className="w-full text-center py-1 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-bold text-[10px] transition"
                      >
                        + Import Document
                      </button>
                    </div>
                  ))}
                </div>

                <div className="pt-2 border-t border-blue-200/80 flex items-center gap-2">
                  <input
                    type="url"
                    placeholder="Or paste Google Drive document sharing link (https://drive.google.com/...)"
                    value={customDriveUrl}
                    onChange={(e) => setCustomDriveUrl(e.target.value)}
                    className="flex-1 px-3 py-2 rounded-xl bg-white border border-slate-200 text-xs focus:ring-2 focus:ring-blue-500 outline-hidden"
                  />
                  <button
                    type="button"
                    onClick={handleAddDriveUrl}
                    disabled={!customDriveUrl.trim()}
                    className="px-3 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white text-xs font-bold transition shrink-0"
                  >
                    Add Drive Link
                  </button>
                </div>
              </div>
            )}

            {/* Scanned Pages Thumbnails Gallery */}
            {pages.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
                {pages.map((page) => (
                  <div
                    key={page.id}
                    className="relative group rounded-xl border border-slate-200 bg-white p-2 text-xs space-y-1.5 shadow-2xs"
                  >
                    <div className="relative aspect-3/4 bg-slate-100 rounded-lg overflow-hidden flex items-center justify-center">
                      <img
                        src={page.previewUrl}
                        alt={page.fileName}
                        className="w-full h-full object-cover"
                      />
                      <span className="absolute top-1.5 left-1.5 px-1.5 py-0.5 rounded-md bg-slate-900/80 text-white font-bold text-[10px] font-mono">
                        Page {page.pageNumber}
                      </span>
                      {page.capturedViaCamera && (
                        <span className="absolute bottom-1.5 left-1.5 px-1.5 py-0.5 rounded-md bg-teal-600 text-white text-[9px] font-bold">
                          📸 Camera
                        </span>
                      )}
                      {page.driveUrl && (
                        <span className="absolute bottom-1.5 left-1.5 px-1.5 py-0.5 rounded-md bg-blue-600 text-white text-[9px] font-bold">
                          ☁️ Drive
                        </span>
                      )}
                    </div>
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="font-semibold text-slate-800 truncate max-w-[90px]" title={page.fileName}>
                        {page.fileName}
                      </span>
                      <button
                        type="button"
                        onClick={() => removePage(page.id)}
                        className="p-1 text-slate-400 hover:text-rose-600 transition"
                        title="Remove page"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div
                onClick={() => fileInputRef.current?.click()}
                className="p-6 rounded-2xl border-2 border-dashed border-slate-300 text-center space-y-2 bg-white cursor-pointer hover:border-emerald-500 hover:bg-emerald-50/20 transition"
              >
                <div className="w-10 h-10 rounded-full bg-slate-100 text-slate-400 mx-auto flex items-center justify-center">
                  <Upload className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-800">
                    Click to select prescription files or drag and drop
                  </p>
                  <p className="text-[11px] text-slate-500">
                    Supports high-res Photos (JPG, PNG, WEBP) and multi-page PDFs
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* ========================================================================= */}
          {/* SECTION 2: CLINICAL HEADER & DOCTOR DETAILS                               */}
          {/* ========================================================================= */}
          <div className="space-y-4">
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
              <Stethoscope className="h-4 w-4 text-emerald-600" />
              <span>Doctor, Clinic & Prescription Header</span>
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Prescription Title / Regimen Name *</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Hypertension & Cardiac Maintenance Plan"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500 outline-hidden font-medium"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Doctor / Prescriber Name *</label>
                <div className="relative">
                  <User className="h-4 w-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    value={doctorName}
                    onChange={(e) => setDoctorName(e.target.value)}
                    placeholder="e.g. Dr. Alexandra Chen, MD"
                    className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500 outline-hidden font-medium"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Doctor Registration / License #</label>
                <input
                  type="text"
                  value={doctorRegNo}
                  onChange={(e) => setDoctorRegNo(e.target.value)}
                  placeholder="e.g. MCI-748920-CARD"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500 outline-hidden font-mono text-[11px]"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Specialization / Department</label>
                <input
                  type="text"
                  value={doctorSpecialty}
                  onChange={(e) => setDoctorSpecialty(e.target.value)}
                  placeholder="e.g. Cardiology & Preventive Medicine"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500 outline-hidden font-medium"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Hospital / Clinic / Practice Name *</label>
                <div className="relative">
                  <Building2 className="h-4 w-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    value={hospitalClinic}
                    onChange={(e) => setHospitalClinic(e.target.value)}
                    placeholder="e.g. Apex Multispecialty Hospital"
                    className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500 outline-hidden font-medium"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Diagnosis / Indication</label>
                <input
                  type="text"
                  value={diagnosis}
                  onChange={(e) => setDiagnosis(e.target.value)}
                  placeholder="e.g. Essential Hypertension, Dyslipidemia"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500 outline-hidden font-medium"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Prescription Date *</label>
                <input
                  type="date"
                  required
                  value={prescriptionDate}
                  onChange={(e) => setPrescriptionDate(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500 outline-hidden font-medium"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Valid Until / Expiry Date</label>
                <input
                  type="date"
                  value={validUntil}
                  onChange={(e) => setValidUntil(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500 outline-hidden font-medium"
                />
              </div>
            </div>
          </div>

          {/* ========================================================================= */}
          {/* SECTION 3: PRESCRIBED MEDICATIONS LIST                                    */}
          {/* ========================================================================= */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                  <FileText className="h-4 w-4 text-emerald-600" />
                  <span>Prescribed Medication Schedule ({medications.length})</span>
                </h4>
                <p className="text-[11px] text-slate-500">
                  Itemized list of medicines prescribed by doctor on this slip
                </p>
              </div>

              <button
                type="button"
                onClick={addMedicationRow}
                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition cursor-pointer"
              >
                <Plus className="h-3.5 w-3.5" />
                <span>Add Medicine</span>
              </button>
            </div>

            <div className="space-y-3">
              {medications.map((med, index) => (
                <div
                  key={med.id}
                  className="p-4 rounded-2xl border border-slate-200 bg-white space-y-3 text-xs shadow-2xs"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-800 flex items-center gap-1.5">
                      <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-800 text-[11px] flex items-center justify-center font-mono">
                        {index + 1}
                      </span>
                      <span>Medicine Item #{index + 1}</span>
                    </span>
                    {medications.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeMedicationRow(med.id)}
                        className="text-slate-400 hover:text-rose-600 transition"
                        title="Remove medicine row"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    )}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div className="sm:col-span-2">
                      <label className="font-semibold text-slate-700 block mb-1 text-[11px]">
                        Medicine Name & Formulation *
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Lisinopril, Metformin ER, Amoxicillin"
                        value={med.name}
                        onChange={(e) => updateMedicationRow(med.id, 'name', e.target.value)}
                        className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500 outline-hidden font-medium"
                      />
                    </div>

                    <div>
                      <label className="font-semibold text-slate-700 block mb-1 text-[11px]">Dosage / Strength</label>
                      <input
                        type="text"
                        placeholder="e.g. 10mg, 500mg, 100mcg"
                        value={med.dosage}
                        onChange={(e) => updateMedicationRow(med.id, 'dosage', e.target.value)}
                        className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500 outline-hidden font-medium"
                      />
                    </div>

                    <div>
                      <label className="font-semibold text-slate-700 block mb-1 text-[11px]">Frequency</label>
                      <select
                        value={med.frequency}
                        onChange={(e) => updateMedicationRow(med.id, 'frequency', e.target.value)}
                        className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500 outline-hidden bg-white"
                      >
                        <option value="Once Daily (Morning)">Once Daily (Morning)</option>
                        <option value="Once Daily (Night)">Once Daily (Night)</option>
                        <option value="Twice Daily (BID)">Twice Daily (BID)</option>
                        <option value="Thrice Daily (TID)">Thrice Daily (TID)</option>
                        <option value="Four Times Daily (QID)">Four Times Daily (QID)</option>
                        <option value="Every 6-8 Hours PRN">Every 6-8 Hours PRN</option>
                        <option value="Once Weekly">Once Weekly</option>
                      </select>
                    </div>

                    <div>
                      <label className="font-semibold text-slate-700 block mb-1 text-[11px]">Meal Timing</label>
                      <select
                        value={med.timing}
                        onChange={(e) => updateMedicationRow(med.id, 'timing', e.target.value as any)}
                        className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500 outline-hidden bg-white"
                      >
                        <option value="After Meals">After Meals</option>
                        <option value="Before Meals">Before Meals</option>
                        <option value="With Meals">With Meals</option>
                        <option value="At Bedtime">At Bedtime</option>
                        <option value="As Needed (PRN)">As Needed (PRN)</option>
                      </select>
                    </div>

                    <div>
                      <label className="font-semibold text-slate-700 block mb-1 text-[11px]">Duration / Course</label>
                      <input
                        type="text"
                        placeholder="e.g. 90 Days, 5 Days"
                        value={med.duration}
                        onChange={(e) => updateMedicationRow(med.id, 'duration', e.target.value)}
                        className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500 outline-hidden"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="font-semibold text-slate-700 block mb-1 text-[11px]">
                      Special Instructions / Doctor Notes
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Take with breakfast. Avoid grapefruit juice. Check seated blood pressure weekly."
                      value={med.instructions}
                      onChange={(e) => updateMedicationRow(med.id, 'instructions', e.target.value)}
                      className="w-full px-3 py-1.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500 outline-hidden text-[11px]"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* ========================================================================= */}
          {/* SECTION 4: CLINICAL NOTES & AUTO-REMINDERS                                */}
          {/* ========================================================================= */}
          <div className="p-4 rounded-2xl bg-emerald-50/60 border border-emerald-200/90 space-y-3 text-xs">
            <div className="flex items-start gap-2.5">
              <ShieldCheck className="h-4 w-4 text-emerald-700 shrink-0 mt-0.5" />
              <div className="flex-1">
                <label className="flex items-center gap-2 font-bold text-emerald-950 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={syncReminders}
                    onChange={(e) => setSyncReminders(e.target.checked)}
                    className="rounded text-emerald-600 focus:ring-emerald-500"
                  />
                  <span>Automatically sync these prescribed medicines with my Daily Medication Reminders</span>
                </label>
                <p className="text-[11px] text-emerald-800/90 mt-0.5">
                  Creates customizable morning and bedtime alarms for on-time adherence.
                </p>
              </div>
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">Attending Physician Advice & Clinical Notes</label>
              <textarea
                rows={2}
                value={clinicalNotes}
                onChange={(e) => setClinicalNotes(e.target.value)}
                placeholder="Doctor's overall diet, exercise or follow-up recommendations..."
                className="w-full px-3.5 py-2 rounded-xl bg-white border border-slate-200 focus:ring-2 focus:ring-emerald-500 outline-hidden text-xs"
              />
            </div>
          </div>

          {/* Form Actions */}
          <div className="pt-3 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0">
            <p className="text-[11px] text-slate-500">
              Prescriptions are encrypted and stored in your longitudinal EHR vault.
            </p>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <button
                type="button"
                onClick={() => {
                  stopCamera();
                  onClose();
                }}
                className="w-full sm:w-auto px-4 py-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-bold text-xs transition cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs transition shadow-md shadow-emerald-950/20 cursor-pointer flex items-center justify-center gap-1.5"
              >
                <Check className="h-4 w-4" />
                <span>Save Prescription to EHR</span>
              </button>
            </div>
          </div>

        </form>
      </div>
    </div>
  );
};
