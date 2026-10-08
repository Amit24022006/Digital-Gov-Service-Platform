import React, { useState } from 'react';
import { X, FileCheck, CheckCircle2, Clock, UploadCloud, Download, AlertCircle, ShieldCheck } from 'lucide-react';

export default function DocumentChecklistModal({ service, isOpen, onClose }) {
  const [docStatuses, setDocStatuses] = useState(() => {
    const initial = {};
    if (service?.documents) {
      service.documents.forEach((doc, idx) => {
        initial[doc.id || idx] = idx === 0 ? 'verified' : 'pending';
      });
    }
    return initial;
  });

  const [uploadedFiles, setUploadedFiles] = useState({});

  if (!isOpen || !service) return null;

  const handleStatusChange = (id, status) => {
    setDocStatuses(prev => ({
      ...prev,
      [id]: status
    }));
  };

  const handleSimulatedUpload = (id, e) => {
    const file = e.target.files[0];
    if (file) {
      setUploadedFiles(prev => ({
        ...prev,
        [id]: file.name
      }));
      setDocStatuses(prev => ({
        ...prev,
        [id]: 'uploaded'
      }));
    }
  };

  const docs = service.documents || [];
  const verifiedCount = Object.values(docStatuses).filter(s => s === 'verified').length;
  const uploadedCount = Object.values(docStatuses).filter(s => s === 'uploaded').length;
  const totalCount = docs.length;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-xl w-full shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="bg-slate-900 text-white p-5 flex items-start justify-between border-b border-slate-800">
          <div>
            <div className="flex items-center space-x-2">
              <span className="px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded bg-amber-500 text-slate-950">
                Step 5 · Guidance & Support
              </span>
              <span className="text-xs text-slate-300">Document Checklist</span>
            </div>
            <h3 className="text-base font-bold mt-1 text-white">
              {service.title}
            </h3>
          </div>
          <button 
            onClick={onClose}
            className="p-1 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Readiness Progress Bar */}
        <div className="bg-blue-50 px-6 py-3 border-b border-blue-100 flex items-center justify-between text-xs">
          <div>
            <span className="font-semibold text-blue-950">Readiness Score: </span>
            <span className="text-blue-700 font-bold">{verifiedCount + uploadedCount} of {totalCount} documents ready</span>
          </div>
          <div className="w-32 bg-slate-200 rounded-full h-2 overflow-hidden">
            <div 
              className="bg-emerald-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${totalCount ? ((verifiedCount + uploadedCount) / totalCount) * 100 : 0}%` }}
            />
          </div>
        </div>

        {/* Documents List */}
        <div className="p-6 max-h-[60vh] overflow-y-auto space-y-3">
          {docs.length === 0 ? (
            <p className="text-xs text-slate-500 text-center py-6">No specific document checklist required.</p>
          ) : (
            docs.map((doc, idx) => {
              const docId = doc.id || idx;
              const currentStatus = docStatuses[docId] || 'pending';
              const fileName = uploadedFiles[docId];

              return (
                <div 
                  key={docId}
                  className="p-3.5 rounded-xl border border-slate-200 bg-white hover:border-slate-300 transition-colors shadow-xs"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2">
                        <span className="font-bold text-xs text-slate-900">{doc.name}</span>
                        {doc.mandatory && (
                          <span className="px-1.5 py-0.2 text-[10px] font-semibold bg-red-100 text-red-700 rounded">
                            Mandatory
                          </span>
                        )}
                      </div>
                      {doc.sample && (
                        <p className="text-[11px] text-slate-500 mt-0.5">{doc.sample}</p>
                      )}
                      {fileName && (
                        <p className="text-[11px] text-blue-600 font-mono mt-1 flex items-center space-x-1">
                          <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                          <span>Attached: {fileName}</span>
                        </p>
                      )}
                    </div>

                    {/* Status Pill Badge */}
                    <div className="shrink-0 flex items-center space-x-1">
                      <button
                        onClick={() => handleStatusChange(docId, 'pending')}
                        className={`px-2 py-1 text-[10px] font-bold rounded-lg border transition-colors ${
                          currentStatus === 'pending'
                            ? 'bg-amber-100 text-amber-800 border-amber-300'
                            : 'bg-slate-50 text-slate-500 border-slate-200 hover:bg-slate-100'
                        }`}
                      >
                        Pending
                      </button>

                      <button
                        onClick={() => handleStatusChange(docId, 'uploaded')}
                        className={`px-2 py-1 text-[10px] font-bold rounded-lg border transition-colors ${
                          currentStatus === 'uploaded'
                            ? 'bg-blue-100 text-blue-800 border-blue-300'
                            : 'bg-slate-50 text-slate-500 border-slate-200 hover:bg-slate-100'
                        }`}
                      >
                        Uploaded
                      </button>

                      <button
                        onClick={() => handleStatusChange(docId, 'verified')}
                        className={`px-2 py-1 text-[10px] font-bold rounded-lg border transition-colors ${
                          currentStatus === 'verified'
                            ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                            : 'bg-slate-50 text-slate-500 border-slate-200 hover:bg-slate-100'
                        }`}
                      >
                        Verified
                      </button>
                    </div>
                  </div>

                  {/* Upload action */}
                  <div className="mt-2.5 pt-2 border-t border-slate-100 flex items-center justify-between text-[11px]">
                    <label className="text-blue-700 hover:text-blue-800 font-semibold cursor-pointer inline-flex items-center space-x-1">
                      <UploadCloud className="w-3.5 h-3.5" />
                      <span>{fileName ? 'Re-upload Document' : 'Attach from Device'}</span>
                      <input 
                        type="file" 
                        className="hidden" 
                        onChange={(e) => handleSimulatedUpload(docId, e)}
                        accept=".pdf,.jpg,.jpeg,.png"
                      />
                    </label>

                    <button 
                      onClick={() => alert(`Downloaded sample format checklist for "${doc.name}"`)}
                      className="text-slate-500 hover:text-slate-800 inline-flex items-center space-x-1"
                    >
                      <Download className="w-3 h-3" />
                      <span>Download Format</span>
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
          <span className="text-xs text-slate-500">
            Keep copies self-attested before visiting Seva Kendra
          </span>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-blue-700 hover:bg-blue-800 text-white text-xs font-bold rounded-xl shadow-sm"
          >
            Done & Save Status
          </button>
        </div>

      </div>
    </div>
  );
}
