import React, { useState } from 'react';
import { 
  GraduationCap, 
  Code2, 
  Layers, 
  Workflow, 
  AlertCircle, 
  Sparkles, 
  User, 
  Building2, 
  Calendar, 
  Edit3, 
  Check, 
  ShieldCheck,
  Cpu,
  Database
} from 'lucide-react';

export const AboutPage: React.FC = () => {
  // Configurable Academic Information (with interactive in-memory editor for viva presentation)
  const [isEditing, setIsEditing] = useState(false);
  const [academicInfo, setAcademicInfo] = useState({
    collegeName: '[Your College / University Name]',
    department: 'Department of Computer Science & Engineering',
    academicYear: '2026 - 2027',
    degree: 'Bachelor of Technology (B.Tech)',
    guideName: '[Faculty Guide Name, Designation]',
    teamMembers: [
      { name: '[Student Name 1]', rollNo: '[Roll No / Register No]' },
      { name: '[Student Name 2]', rollNo: '[Roll No / Register No]' },
    ]
  });

  const handleMemberChange = (index: number, field: 'name' | 'rollNo', value: string) => {
    const updated = [...academicInfo.teamMembers];
    updated[index][field] = value;
    setAcademicInfo({ ...academicInfo, teamMembers: updated });
  };

  const addMember = () => {
    setAcademicInfo({
      ...academicInfo,
      teamMembers: [...academicInfo.teamMembers, { name: '[Student Name]', rollNo: '[Roll No]' }]
    });
  };

  const removeMember = (index: number) => {
    if (academicInfo.teamMembers.length <= 1) return;
    const updated = academicInfo.teamMembers.filter((_, i) => i !== index);
    setAcademicInfo({ ...academicInfo, teamMembers: updated });
  };

  return (
    <div className="space-y-12 py-6 max-w-5xl mx-auto">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 text-indigo-400 text-xs font-semibold uppercase tracking-wider mb-1">
          <GraduationCap className="w-4 h-4" />
          <span>Academic Capstone Documentation</span>
        </div>
        <h1 className="text-3xl font-extrabold text-white tracking-tight">About The Project</h1>
        <p className="text-sm text-slate-400 mt-2 max-w-2xl leading-relaxed">
          Comprehensive academic specification, architectural blueprint, and presentation metadata for the Email Spam and Phishing Detection System.
        </p>
      </div>

      {/* Academic Viva Information Card (Configurable) */}
      <div className="p-6 rounded-2xl bg-slate-900/80 border border-indigo-500/30 relative overflow-hidden space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
              <GraduationCap className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">Academic Project Details</h3>
              <p className="text-xs text-slate-400">Institutional presentation metadata</p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setIsEditing(!isEditing)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-300 border border-indigo-500/30 text-xs font-semibold transition-colors"
          >
            {isEditing ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Edit3 className="w-3.5 h-3.5" />}
            <span>{isEditing ? 'Save Changes' : 'Edit Placeholders'}</span>
          </button>
        </div>

        {isEditing ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs pt-2">
            <div>
              <label className="text-slate-400 block mb-1 font-medium">Institution / College Name</label>
              <input
                type="text"
                value={academicInfo.collegeName}
                onChange={(e) => setAcademicInfo({ ...academicInfo, collegeName: e.target.value })}
                className="w-full px-3 py-2 rounded bg-slate-950 border border-slate-700 text-white"
              />
            </div>
            <div>
              <label className="text-slate-400 block mb-1 font-medium">Department</label>
              <input
                type="text"
                value={academicInfo.department}
                onChange={(e) => setAcademicInfo({ ...academicInfo, department: e.target.value })}
                className="w-full px-3 py-2 rounded bg-slate-950 border border-slate-700 text-white"
              />
            </div>
            <div>
              <label className="text-slate-400 block mb-1 font-medium">Academic Year</label>
              <input
                type="text"
                value={academicInfo.academicYear}
                onChange={(e) => setAcademicInfo({ ...academicInfo, academicYear: e.target.value })}
                className="w-full px-3 py-2 rounded bg-slate-950 border border-slate-700 text-white"
              />
            </div>
            <div>
              <label className="text-slate-400 block mb-1 font-medium">Project Guide / Mentor Name</label>
              <input
                type="text"
                value={academicInfo.guideName}
                onChange={(e) => setAcademicInfo({ ...academicInfo, guideName: e.target.value })}
                className="w-full px-3 py-2 rounded bg-slate-950 border border-slate-700 text-white"
              />
            </div>
            <div className="md:col-span-2 space-y-2 pt-2">
              <label className="text-slate-400 block font-medium">Team Members</label>
              {academicInfo.teamMembers.map((m, idx) => (
                <div key={idx} className="flex gap-2 items-center">
                  <input
                    type="text"
                    value={m.name}
                    placeholder="Student Name"
                    onChange={(e) => handleMemberChange(idx, 'name', e.target.value)}
                    className="flex-1 px-3 py-1.5 rounded bg-slate-950 border border-slate-700 text-white text-xs"
                  />
                  <input
                    type="text"
                    value={m.rollNo}
                    placeholder="Roll Number"
                    onChange={(e) => handleMemberChange(idx, 'rollNo', e.target.value)}
                    className="w-48 px-3 py-1.5 rounded bg-slate-950 border border-slate-700 text-white text-xs font-mono"
                  />
                  <button
                    type="button"
                    onClick={() => removeMember(idx)}
                    className="px-2 py-1.5 bg-rose-950/40 text-rose-400 rounded text-xs hover:bg-rose-900/50"
                  >
                    ✕
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={addMember}
                className="text-xs text-indigo-400 hover:text-indigo-300 font-medium"
              >
                + Add Another Team Member
              </button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-xs pt-1">
            <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-850">
              <span className="text-slate-500 block mb-1">College / University</span>
              <span className="font-semibold text-slate-100 text-sm">{academicInfo.collegeName}</span>
            </div>
            <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-850">
              <span className="text-slate-500 block mb-1">Academic Department</span>
              <span className="font-semibold text-slate-100">{academicInfo.department}</span>
            </div>
            <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-850">
              <span className="text-slate-500 block mb-1">Program & Year</span>
              <span className="font-semibold text-slate-100">{academicInfo.degree} ({academicInfo.academicYear})</span>
            </div>
            <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-850">
              <span className="text-slate-500 block mb-1">Project Faculty Guide</span>
              <span className="font-semibold text-indigo-400">{academicInfo.guideName}</span>
            </div>
            <div className="md:col-span-2 lg:col-span-4 p-4 rounded-xl bg-slate-950 border border-slate-850">
              <span className="text-slate-500 block mb-2 font-medium">Project Team Members:</span>
              <div className="flex flex-wrap gap-3">
                {academicInfo.teamMembers.map((m, idx) => (
                  <div key={idx} className="px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs">
                    <span className="font-medium text-white">{m.name}</span>{' '}
                    <span className="font-mono text-slate-400">({m.rollNo})</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Objective, Problem, Proposed Solution */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center">
            <Sparkles className="w-5 h-5" />
          </div>
          <h3 className="text-base font-bold text-white">Project Objective</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            To architect, train, and deploy an explainable end-to-end web system that autonomously classifies incoming emails into 
            <strong> Spam</strong>, <strong>Phishing</strong>, or <strong>Legitimate</strong> categories while offering transparent forensic rationales.
          </p>
        </div>

        <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-3">
          <div className="w-10 h-10 rounded-xl bg-rose-500/10 text-rose-400 flex items-center justify-center">
            <AlertCircle className="w-5 h-5" />
          </div>
          <h3 className="text-base font-bold text-white">Problem Statement</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Email remains the #1 initial infection and credential harvesting vector in cybersecurity. Traditional blacklists fail against freshly registered domains, 
            while black-box neural networks fail to provide users with transparent reasons for why a message is deemed dangerous.
          </p>
        </div>

        <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <h3 className="text-base font-bold text-white">Proposed Solution</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            A hybrid detection model uniting balanced TF-IDF machine learning text classification with rule-based forensic modules 
            inspecting brand impersonation, urgent coercion, credential solicitations, and offline URL heuristics.
          </p>
        </div>
      </div>

      {/* Technologies Used Grid */}
      <div className="p-6 rounded-2xl bg-slate-900/70 border border-slate-800 space-y-4">
        <h3 className="text-lg font-bold text-white flex items-center gap-2">
          <Code2 className="w-5 h-5 text-indigo-400" />
          <span>Full-Stack Architecture & Technologies</span>
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-1">
          <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-850">
            <span className="text-indigo-400 text-xs font-semibold block">Frontend</span>
            <span className="text-sm font-bold text-white block mt-0.5">React 18 + Vite</span>
            <span className="text-[11px] text-slate-400">TypeScript & Tailwind CSS</span>
          </div>
          <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-850">
            <span className="text-cyan-400 text-xs font-semibold block">Data Visualization</span>
            <span className="text-sm font-bold text-white block mt-0.5">Recharts & Lucide</span>
            <span className="text-[11px] text-slate-400">Interactive SVG telemetry</span>
          </div>
          <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-850">
            <span className="text-violet-400 text-xs font-semibold block">Backend Framework</span>
            <span className="text-sm font-bold text-white block mt-0.5">Python & FastAPI</span>
            <span className="text-[11px] text-slate-400">Asynchronous RESTful API</span>
          </div>
          <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-850">
            <span className="text-emerald-400 text-xs font-semibold block">Intelligence & Storage</span>
            <span className="text-sm font-bold text-white block mt-0.5">Scikit-Learn + SQLite</span>
            <span className="text-[11px] text-slate-400">TF-IDF & WAL Persistent DB</span>
          </div>
        </div>
      </div>

      {/* Limitations and Future Enhancements */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-3">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-amber-400" />
            <span>Current Limitations</span>
          </h3>
          <ul className="space-y-2 text-xs text-slate-300">
            <li>• Encrypted email body formats (e.g. S/MIME, PGP) cannot be read without private keys.</li>
            <li>• Dynamic URL redirection (cloaking after sandbox checks) requires runtime browser sandboxing.</li>
            <li>• Password-protected attachments cannot be inspected via text parsing.</li>
            <li>• Adversarial character obfuscation (zero-width spaces) requires ongoing tokenizer updates.</li>
          </ul>
        </div>

        <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-3">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-indigo-400" />
            <span>Future Enhancements</span>
          </h3>
          <ul className="space-y-2 text-xs text-slate-300">
            <li>• Integration of transformer-based LLM embedding models (e.g. RoBERTa/BERT).</li>
            <li>• Deep attachment inspection (PDF and Office macro disassembler).</li>
            <li>• DNS SPF, DKIM, and DMARC cryptographic signature verifier module.</li>
            <li>• Browser extension for real-time webmail integration (Gmail/Outlook).</li>
          </ul>
        </div>
      </div>
    </div>
  );
};
