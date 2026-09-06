import React, { useState, useEffect } from 'react';
import {
  Video,
  VideoOff,
  Mic,
  MicOff,
  PhoneOff,
  Share2,
  Activity,
  Heart,
  MessageSquare,
  Sparkles,
  FileText,
  Pill,
  CheckCircle2,
  Clock,
  Shield,
  Send,
  Maximize2
} from 'lucide-react';
import { PatientRecord, DoctorProfile } from '../../types/medauth';

interface TelemedicineSuiteViewProps {
  patient: PatientRecord;
  doctor: DoctorProfile;
  onOpenRx?: () => void;
  onOpenConsultNotes?: () => void;
}

export const TelemedicineSuiteView: React.FC<TelemedicineSuiteViewProps> = ({
  patient,
  doctor,
  onOpenRx,
  onOpenConsultNotes
}) => {
  const [callActive, setCallActive] = useState(true);
  const [isMicOn, setIsMicOn] = useState(true);
  const [isVideoOn, setIsVideoOn] = useState(true);
  const [callDuration, setCallDuration] = useState(142); // in seconds
  const [chatMessages, setChatMessages] = useState<{ sender: string; text: string; time: string }[]>([
    { sender: patient.name, text: 'Hello Dr. Chen, I can see and hear you clearly.', time: '10:30 AM' },
    { sender: doctor.fullName, text: 'Good morning! Reviewing your recent Holter ECG report.', time: '10:31 AM' }
  ]);
  const [inputMsg, setInputMsg] = useState('');

  useEffect(() => {
    let timer: any;
    if (callActive) {
      timer = setInterval(() => {
        setCallDuration((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [callActive]);

  const formatDuration = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMsg.trim()) return;
    setChatMessages((prev) => [
      ...prev,
      {
        sender: doctor.fullName,
        text: inputMsg,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ]);
    setInputMsg('');
  };

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-rose-50 border border-rose-200 text-rose-700 text-[11px] font-bold mb-1">
            <span className="w-2 h-2 rounded-full bg-rose-600 animate-ping" />
            <span>Encrypted WebRTC Telehealth Session</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
            High-Definition Telemedicine Suite
          </h2>
          <p className="text-xs text-slate-600 mt-0.5">
            Connecting with: <strong className="text-slate-900">{patient.name}</strong> ({patient.mrn}) • Session Duration: <strong className="font-mono text-emerald-700">{formatDuration(callDuration)}</strong>
          </p>
        </div>

        <div className="flex items-center gap-2">
          {onOpenRx && (
            <button
              onClick={onOpenRx}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 text-xs font-bold transition cursor-pointer"
            >
              <Pill className="w-3.5 h-3.5" />
              <span>e-Prescribe</span>
            </button>
          )}

          {onOpenConsultNotes && (
            <button
              onClick={onOpenConsultNotes}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold transition cursor-pointer"
            >
              <FileText className="w-3.5 h-3.5" />
              <span>SOAP Notes</span>
            </button>
          )}
        </div>
      </div>

      {/* Main Video & Live Chat Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        
        {/* Video Canvas Viewport */}
        <div className="lg:col-span-2 bg-slate-950 rounded-2xl overflow-hidden border border-slate-800 flex flex-col justify-between relative shadow-lg min-h-[420px]">
          
          {/* Top HUD Overlay */}
          <div className="absolute top-4 left-4 right-4 z-10 flex items-center justify-between pointer-events-none">
            <div className="bg-slate-900/85 backdrop-blur-md px-3 py-1.5 rounded-xl border border-slate-700/60 text-white flex items-center gap-2 text-xs font-mono">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>LIVE • {formatDuration(callDuration)}</span>
              <span className="text-slate-400">|</span>
              <span className="text-emerald-300">256-BIT TLS</span>
            </div>

            {/* Live Patient Biometrics Stream Overlay */}
            <div className="bg-slate-900/85 backdrop-blur-md px-3 py-1.5 rounded-xl border border-slate-700/60 text-white flex items-center gap-3 text-xs font-mono">
              <span className="flex items-center gap-1 text-emerald-400">
                <Heart className="w-3.5 h-3.5" />
                <span>{patient.recentVitals.hr} BPM</span>
              </span>
              <span className="flex items-center gap-1 text-white">
                <Activity className="w-3.5 h-3.5 text-blue-400" />
                <span>{patient.recentVitals.bp}</span>
              </span>
            </div>
          </div>

          {/* Patient Video Stream Simulator */}
          <div className="flex-1 flex items-center justify-center p-8">
            <div className="text-center space-y-3">
              <div className="w-24 h-24 rounded-full bg-gradient-to-br from-slate-700 to-slate-800 border-2 border-emerald-500/60 mx-auto flex items-center justify-center text-white text-3xl font-extrabold shadow-inner">
                {patient?.name?.charAt(0) || 'P'}
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">{patient?.name || 'Patient'}</h3>
                <p className="text-xs text-slate-400">Connected via Patient Health Portal iOS App</p>
                <span className="inline-block mt-2 px-2.5 py-0.5 rounded-full bg-emerald-950/80 border border-emerald-700 text-emerald-300 text-[10px] font-mono font-bold">
                  Camera 1080p • 60 FPS • Low Latency
                </span>
              </div>
            </div>
          </div>

          {/* Doctor PIP Mini Feed (Bottom Right) */}
          <div className="absolute bottom-20 right-4 w-32 sm:w-40 h-24 sm:h-28 rounded-xl bg-slate-900 border-2 border-slate-700 overflow-hidden shadow-2xl flex items-center justify-center text-white">
            {isVideoOn ? (
              <div className="text-center p-2">
                <div className="w-8 h-8 rounded-full bg-emerald-600 text-white mx-auto flex items-center justify-center font-bold text-xs">
                  {doctor?.fullName ? (doctor.fullName.replace('Dr. ', '').charAt(0) || 'D') : 'D'}
                </div>
                <span className="text-[10px] block mt-1 font-bold truncate">{doctor?.fullName || 'Doctor'}</span>
              </div>
            ) : (
              <div className="text-slate-500 text-xs flex flex-col items-center">
                <VideoOff className="w-5 h-5 mb-1" />
                <span>Camera Off</span>
              </div>
            )}
          </div>

          {/* Bottom Call Controls Toolbar */}
          <div className="bg-slate-900/90 backdrop-blur-md p-4 border-t border-slate-800 flex items-center justify-center gap-3 z-10">
            <button
              onClick={() => setIsMicOn(!isMicOn)}
              className={`p-3 rounded-full transition cursor-pointer ${
                isMicOn ? 'bg-slate-800 hover:bg-slate-700 text-white' : 'bg-rose-600 text-white'
              }`}
              title={isMicOn ? 'Mute Mic' : 'Unmute Mic'}
            >
              {isMicOn ? <Mic className="w-5 h-5" /> : <MicOff className="w-5 h-5" />}
            </button>

            <button
              onClick={() => setIsVideoOn(!isVideoOn)}
              className={`p-3 rounded-full transition cursor-pointer ${
                isVideoOn ? 'bg-slate-800 hover:bg-slate-700 text-white' : 'bg-rose-600 text-white'
              }`}
              title={isVideoOn ? 'Turn Camera Off' : 'Turn Camera On'}
            >
              {isVideoOn ? <Video className="w-5 h-5" /> : <VideoOff className="w-5 h-5" />}
            </button>

            <button
              onClick={() => setCallActive(!callActive)}
              className={`px-5 py-3 rounded-full font-bold text-xs transition flex items-center gap-2 cursor-pointer ${
                callActive ? 'bg-rose-600 hover:bg-rose-700 text-white' : 'bg-emerald-600 hover:bg-emerald-700 text-white'
              }`}
            >
              <PhoneOff className="w-4 h-4" />
              <span>{callActive ? 'End Encounter' : 'Reconnect Call'}</span>
            </button>
          </div>
        </div>

        {/* Real-time In-Call Chat & Clinical Transcript */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex flex-col justify-between h-[420px]">
          <div>
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <div className="flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-emerald-600" />
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900">
                  Encrypted In-Session Chat
                </h3>
              </div>
              <span className="text-[10px] font-mono text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded">
                HIPAA ACTIVE
              </span>
            </div>

            <div className="mt-3 space-y-2.5 overflow-y-auto max-h-64 pr-1">
              {chatMessages.map((msg, i) => (
                <div
                  key={i}
                  className={`p-2.5 rounded-xl text-xs space-y-0.5 ${
                    msg.sender === doctor.fullName
                      ? 'bg-emerald-50 border border-emerald-200 text-emerald-950 ml-4'
                      : 'bg-slate-100 border border-slate-200 text-slate-900 mr-4'
                  }`}
                >
                  <div className="flex items-center justify-between text-[10px] font-semibold text-slate-500">
                    <span>{msg.sender}</span>
                    <span>{msg.time}</span>
                  </div>
                  <p className="leading-relaxed">{msg.text}</p>
                </div>
              ))}
            </div>
          </div>

          <form onSubmit={handleSendMessage} className="pt-3 border-t border-slate-200 flex items-center gap-2">
            <input
              type="text"
              value={inputMsg}
              onChange={(e) => setInputMsg(e.target.value)}
              placeholder="Send message to patient..."
              className="flex-1 px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:border-emerald-600"
            />
            <button
              type="submit"
              className="p-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg transition cursor-pointer"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
