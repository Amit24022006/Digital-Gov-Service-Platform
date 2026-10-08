import React, { useState } from 'react';
import { Database, UploadCloud, RefreshCw, Download, CheckCircle2, AlertTriangle, FileJson } from 'lucide-react';
import api from '../../api/client.js';

export default function AdminSeeding() {
  const [jsonInput, setJsonInput] = useState('');
  const [importing, setImporting] = useState(false);
  const [resetting, setResetting] = useState(false);
  const [statusMessage, setStatusMessage] = useState(null);

  const sampleJson = `[
  {
    "id": "srv_kanya_sumangala",
    "category_id": "cat_welfare",
    "title": "Mukhya Mantri Kanya Sumangala Yojana",
    "title_hi": "मुख्यमंत्री कन्या सुमंगला योजना",
    "department": "Department of Women & Child Development",
    "scheme_type": "State",
    "mode": "Online",
    "state": "Uttar Pradesh",
    "benefits": "Financial grant of ₹25,000 delivered in 6 stages from birth to graduation for female child welfare.",
    "processing_time": "30 Days",
    "fee": "Free",
    "official_url": "https://mksy.up.gov.in",
    "eligibility_rules": {
      "min_age": 0,
      "max_age": 25,
      "max_annual_income": 300000
    }
  }
]`;

  const handleResetSeed = async () => {
    if (!window.confirm('Are you sure you want to reset the database to the verified 10 categories and initial schemes?')) return;
    setResetting(true);
    setStatusMessage(null);
    try {
      const res = await api.post('/admin/seed/reset');
      if (res.data.success) {
        setStatusMessage({ type: 'success', text: res.data.message });
      }
    } catch (err) {
      setStatusMessage({ type: 'error', text: 'Reset failed: ' + err.message });
    } finally {
      setResetting(false);
    }
  };

  const handleBulkImport = async () => {
    if (!jsonInput.trim()) {
      alert('Please paste JSON data first.');
      return;
    }

    setImporting(true);
    setStatusMessage(null);
    try {
      const parsed = JSON.parse(jsonInput);
      const schemes = Array.isArray(parsed) ? parsed : [parsed];

      const res = await api.post('/admin/seed/bulk', { schemes });
      if (res.data.success) {
        setStatusMessage({ type: 'success', text: res.data.message });
        setJsonInput('');
      }
    } catch (err) {
      setStatusMessage({ type: 'error', text: 'Invalid JSON or Import Error: ' + err.message });
    } finally {
      setImporting(false);
    }
  };

  return (
    <div className="max-w-4xl space-y-8">
      
      <div>
        <h1 className="text-2xl font-black text-slate-900">Content Seeding & Open Data Management</h1>
        <p className="text-xs text-slate-500">Seed, bulk-import open government data, or restore verified baseline records.</p>
      </div>

      {statusMessage && (
        <div className={`p-4 rounded-2xl text-xs font-semibold flex items-center space-x-2 ${
          statusMessage.type === 'success' 
            ? 'bg-emerald-50 text-emerald-900 border border-emerald-200' 
            : 'bg-red-50 text-red-900 border border-red-200'
        }`}>
          {statusMessage.type === 'success' ? <CheckCircle2 className="w-4 h-4" /> : <AlertTriangle className="w-4 h-4" />}
          <span>{statusMessage.text}</span>
        </div>
      )}

      {/* 1. Reseed to default baseline */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-4">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <h3 className="text-base font-bold text-slate-900">Baseline Content Reseeding</h3>
            <p className="text-xs text-slate-500 max-w-lg">
              Reloads the verified database with all 10 national categories (Farmer, Education, Health, MSME, Housing, Transport, etc.), 23+ official schemes, and pre-mapped Seva Kendras.
            </p>
          </div>

          <button
            onClick={handleResetSeed}
            disabled={resetting}
            className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-amber-300 rounded-xl text-xs font-bold shadow-xs flex items-center space-x-2 shrink-0"
          >
            <RefreshCw className={`w-4 h-4 ${resetting ? 'animate-spin' : ''}`} />
            <span>{resetting ? 'Reseeding...' : 'Restore Official Seed Data'}</span>
          </button>
        </div>
      </div>

      {/* 2. Bulk JSON Import */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-900">Bulk Import Schemes (Open Data JSON)</h3>
            <p className="text-xs text-slate-500">Paste JSON array of scheme objects to batch-seed into the catalog.</p>
          </div>
          <button
            type="button"
            onClick={() => setJsonInput(sampleJson)}
            className="text-xs text-blue-700 font-bold hover:underline"
          >
            Load Sample JSON Template
          </button>
        </div>

        <textarea
          rows="10"
          value={jsonInput}
          onChange={(e) => setJsonInput(e.target.value)}
          placeholder={`[\n  {\n    "title": "Scheme Title",\n    "category_id": "cat_farmer",\n    "benefits": "...",\n    "official_url": "https://..."\n  }\n]`}
          className="w-full p-4 text-xs font-mono border border-slate-300 rounded-2xl bg-slate-50 focus:bg-white focus:ring-2 focus:ring-blue-600 focus:outline-hidden"
        />

        <div className="flex justify-end">
          <button
            onClick={handleBulkImport}
            disabled={importing}
            className="px-6 py-2.5 bg-blue-700 hover:bg-blue-800 text-white rounded-xl text-xs font-bold shadow-md flex items-center space-x-2"
          >
            <UploadCloud className="w-4 h-4" />
            <span>{importing ? 'Seeding Data...' : 'Import & Publish to Catalog'}</span>
          </button>
        </div>
      </div>

    </div>
  );
}
