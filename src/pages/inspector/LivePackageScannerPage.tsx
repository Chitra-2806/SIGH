import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Camera,
  Upload,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  ArrowRight,
  Maximize2,
  RefreshCw,
  Store,
  MapPin,
  HelpCircle,
  FileCheck2,
  Layers,
  ChevronDown,
  Info
} from 'lucide-react';
import { useInspection } from '../../context/InspectionContext';
import { MOCK_PREPACKAGED_SAMPLES } from '../../data/mockData';
import { Card, CardBody, CardHeader, CardTitle } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/common/Input';

export const LivePackageScannerPage: React.FC = () => {
  const navigate = useNavigate();
  const {
    storeName,
    setStoreName,
    storeAddress,
    setStoreAddress,
    city,
    setCity,
    district,
    setDistrict,
    state,
    setState,
    selectedPresetId,
    selectPreset,
    customImageUrl,
    setCustomImageUrl,
    setUploadedFile,
    displayImage,
    capturedAngles,
    setCapturedAngle,
  } = useInspection();

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [activeSlot, setActiveSlot] = useState<'frontPdp' | 'ingredientsNutrition' | 'mrpPackerLabel'>('frontPdp');
  const [showStoreFields, setShowStoreFields] = useState(false);
  const [flashActive, setFlashActive] = useState(false);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setUploadedFile(file);
      const url = URL.createObjectURL(file);
      setCustomImageUrl(url);
      setCapturedAngle(activeSlot, url);
    }
  };

  const handleProceedToAnalysis = () => {
    navigate('/analyzing-package');
  };

  return (
    <div className="space-y-6 pb-24 max-w-4xl mx-auto">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#E8E1D2] dark:border-neutral-800 pb-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#D5E2D9] text-[#2C493D] dark:bg-[#426B5A]/40 dark:text-[#D5E2D9] text-xs font-semibold mb-1">
            <Camera className="w-3.5 h-3.5" />
            <span>STEP 1 OF 5 — LIVE SPECIMEN ACQUISITION</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-[#303530] dark:text-white">
            Principal Display Panel (PDP) Optical Viewfinder
          </h1>
        </div>

        {/* Premises Quick Toggle */}
        <button
          onClick={() => setShowStoreFields(!showStoreFields)}
          className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg border border-[#8FAF9A]/60 text-[#2C493D] dark:text-[#D5E2D9] hover:bg-[#D5E2D9]/20 transition cursor-pointer self-start sm:self-auto"
        >
          <Store className="w-3.5 h-3.5 text-[#426B5A] dark:text-[#8FAF9A]" />
          <span>Premises: {storeName ? storeName.slice(0, 20) + '...' : 'Add Location'}</span>
          <ChevronDown className={`w-3 h-3 transition-transform ${showStoreFields ? 'rotate-180' : ''}`} />
        </button>
      </div>

      {/* Evidentiary Integrity Guarantee Banner (Section 65B Indian Evidence Act) */}
      <div className="p-3.5 rounded-xl bg-[#FAF9F5] dark:bg-[#202622] border border-[#8FAF9A]/40 dark:border-[#3F4A43] flex items-start gap-3 shadow-xs">
        <ShieldCheck className="w-5 h-5 text-[#426B5A] dark:text-[#8FAF9A] shrink-0 mt-0.5" />
        <div className="text-xs text-[#303530] dark:text-neutral-300">
          <p className="font-bold text-[#2C493D] dark:text-[#D5E2D9]">
            Evidentiary Integrity Guarantee (Sec. 65B Indian Evidence Act Compliant)
          </p>
          <p className="text-[11px] text-slate-600 dark:text-slate-400 mt-0.5 leading-relaxed">
            All captured commodity photos remain completely unmodified. The system records pristine evidentiary images without augmented overlays, graphical bounding boxes, or markings to ensure unassailable legal admissibility in statutory compounding hearings.
          </p>
        </div>
      </div>

      {/* Expandable Premises Metadata Form */}
      {showStoreFields && (
        <Card className="border-[#8FAF9A]/50 bg-[#FAF9F5] dark:bg-[#202622] shadow-sm animate-in fade-in duration-200">
          <CardHeader className="py-3 px-4 border-b border-[#E8E1D2] dark:border-[#3F4A43] flex items-center justify-between">
            <CardTitle className="text-xs font-bold uppercase tracking-wider text-[#426B5A] dark:text-[#8FAF9A] flex items-center gap-1.5">
              <Store className="w-4 h-4" />
              <span>Inspection Premises & Zonal Territory Details</span>
            </CardTitle>
            <span className="text-[11px] text-slate-500">Auto-filled for Form III Memo</span>
          </CardHeader>
          <CardBody className="p-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Input
              id="input-store-name"
              label="Retail Establishment / Warehouse Name"
              value={storeName}
              onChange={(e) => setStoreName(e.target.value)}
              placeholder="e.g. Reliance Smart Hypermarket"
            />
            <Input
              id="input-store-address"
              label="Street Address / Market Complex"
              value={storeAddress}
              onChange={(e) => setStoreAddress(e.target.value)}
              placeholder="e.g. Shop 12-14, District Centre"
            />
            <div className="grid grid-cols-3 gap-2 sm:col-span-2">
              <Input
                id="input-store-city"
                label="City / Town"
                value={city}
                onChange={(e) => setCity(e.target.value)}
              />
              <Input
                id="input-store-district"
                label="District / Zone"
                value={district}
                onChange={(e) => setDistrict(e.target.value)}
              />
              <Input
                id="input-store-state"
                label="State Jurisdiction"
                value={state}
                onChange={(e) => setState(e.target.value)}
              />
            </div>
          </CardBody>
        </Card>
      )}

      {/* Main Viewfinder Canvas & Multi-Angle Stage */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Optical Viewfinder Window (Col 8) */}
        <div className="lg:col-span-8 flex flex-col gap-3">
          <div className="relative aspect-[4/3] w-full rounded-2xl overflow-hidden bg-neutral-950 border-2 border-[#426B5A]/80 shadow-lg flex items-center justify-center">
            {/* Specimen Photo (PRISTINE, UNMODIFIED) */}
            <img
              src={displayImage}
              alt="Principal Display Panel Specimen"
              className="w-full h-full object-contain"
            />

            {/* Viewfinder Target Reticle & PDP Alignment Corners (Purely optical framing guide) */}
            <div className="absolute inset-0 pointer-events-none p-6 sm:p-8 flex flex-col justify-between">
              <div className="flex justify-between items-start">
                <div className="w-8 h-8 border-t-2 border-l-2 border-[#8FAF9A]" />
                <div className="w-8 h-8 border-t-2 border-r-2 border-[#8FAF9A]" />
              </div>

              {/* Center Framing Reticle */}
              <div className="self-center flex flex-col items-center gap-1.5 opacity-80">
                <div className="w-20 h-20 rounded-xl border border-dashed border-[#8FAF9A]/60 flex items-center justify-center">
                  <div className="w-2 h-2 rounded-full bg-[#8FAF9A]" />
                </div>
                <span className="text-[10px] font-mono font-semibold tracking-widest text-white/80 bg-black/60 px-2 py-0.5 rounded">
                  ALIGN PRINCIPAL DISPLAY PANEL (RULE 9)
                </span>
              </div>

              <div className="flex justify-between items-end">
                <div className="w-8 h-8 border-b-2 border-l-2 border-[#8FAF9A]" />
                <div className="w-8 h-8 border-b-2 border-r-2 border-[#8FAF9A]" />
              </div>
            </div>

            {/* Flash Simulation Overlay */}
            {flashActive && (
              <div className="absolute inset-0 bg-white/70 pointer-events-none animate-ping duration-300" />
            )}

            {/* Viewfinder Status Overlay */}
            <div className="absolute top-3 left-3 right-3 flex items-center justify-between pointer-events-none">
              <span className="bg-black/60 backdrop-blur-md text-[#8FAF9A] font-mono text-[10px] px-2.5 py-1 rounded-md flex items-center gap-1.5 font-bold">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                OPTICAL SENSOR ACTIVE &bull; 4K HIGH RES
              </span>
              <span className="bg-black/60 backdrop-blur-md text-white font-mono text-[10px] px-2 py-1 rounded-md">
                PDA RATIO: 1:1
              </span>
            </div>
          </div>

          {/* Viewfinder Controls & Capture Bar */}
          <div className="flex items-center justify-between gap-3 p-3 bg-white dark:bg-neutral-900 rounded-xl border border-[#E8E1D2] dark:border-neutral-800">
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => fileInputRef.current?.click()}
                className="border-slate-300 dark:border-neutral-700 text-xs flex items-center gap-1.5 cursor-pointer"
              >
                <Upload className="w-3.5 h-3.5" />
                <span>Upload Photo</span>
              </Button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleFileUpload}
              />

              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setFlashActive(true);
                  setTimeout(() => setFlashActive(false), 300);
                }}
                className="border-slate-300 dark:border-neutral-700 text-xs flex items-center gap-1.5 cursor-pointer"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Trigger Reticle</span>
              </Button>
            </div>

            <Button
              id="btn-proceed-to-analysis"
              onClick={handleProceedToAnalysis}
              className="bg-[#426B5A] hover:bg-[#2C493D] text-white font-bold px-5 py-2.5 text-xs shadow-md flex items-center gap-2 cursor-pointer"
            >
              <span>[ RUN STATUTORY ANALYSIS ]</span>
              <ArrowRight className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Multi-Angle Capture Tray & Benchmark Presets (Col 4) */}
        <div className="lg:col-span-4 space-y-4">
          {/* Multi-Angle Evidence Tray */}
          <Card className="border-[#E8E1D2] dark:border-neutral-800 shadow-xs">
            <CardHeader className="py-2.5 px-4 border-b border-[#E8E1D2] dark:border-neutral-800 bg-[#FAF9F5] dark:bg-neutral-900">
              <CardTitle className="text-xs font-bold uppercase tracking-wider text-[#303530] dark:text-white flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-[#426B5A] dark:text-[#8FAF9A]" />
                <span>Multi-Angle Evidence Tray</span>
              </CardTitle>
            </CardHeader>
            <CardBody className="p-3 space-y-2">
              <div
                onClick={() => setActiveSlot('frontPdp')}
                className={`p-2.5 rounded-lg border text-xs flex items-center justify-between cursor-pointer transition ${
                  activeSlot === 'frontPdp'
                    ? 'border-[#8FAF9A] bg-[#EEF3EF] font-bold text-[#426B5A] dark:bg-[#23352B] dark:text-[#8FAF9A] dark:border-[#4A6E59]'
                    : 'border-[#E8E1D2] dark:border-neutral-800 hover:bg-[#FAF9F5] text-[#4A534B] dark:text-slate-300'
                }`}
              >
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-[#426B5A] dark:bg-[#8FAF9A]" />
                  <span>1. Front Principal Display (PDP)</span>
                </div>
                <span className="text-[10px] text-[#66706A] font-mono">Primary</span>
              </div>

              <div
                onClick={() => setActiveSlot('ingredientsNutrition')}
                className={`p-2.5 rounded-lg border text-xs flex items-center justify-between cursor-pointer transition ${
                  activeSlot === 'ingredientsNutrition'
                    ? 'border-[#8FAF9A] bg-[#EEF3EF] font-bold text-[#426B5A] dark:bg-[#23352B] dark:text-[#8FAF9A] dark:border-[#4A6E59]'
                    : 'border-[#E8E1D2] dark:border-neutral-800 hover:bg-[#FAF9F5] text-[#4A534B] dark:text-slate-300'
                }`}
              >
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-[#D2CBC0]" />
                  <span>2. Side Label (MRP & Net Qty)</span>
                </div>
                <span className="text-[10px] text-[#66706A] font-mono">Optional</span>
              </div>

              <div
                onClick={() => setActiveSlot('mrpPackerLabel')}
                className={`p-2.5 rounded-lg border text-xs flex items-center justify-between cursor-pointer transition ${
                  activeSlot === 'mrpPackerLabel'
                    ? 'border-[#8FAF9A] bg-[#EEF3EF] font-bold text-[#426B5A] dark:bg-[#23352B] dark:text-[#8FAF9A] dark:border-[#4A6E59]'
                    : 'border-[#E8E1D2] dark:border-neutral-800 hover:bg-[#FAF9F5] text-[#4A534B] dark:text-slate-300'
                }`}
              >
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-[#D2CBC0]" />
                  <span>3. Back Label (Manufacturer & Grievance)</span>
                </div>
                <span className="text-[10px] text-[#66706A] font-mono">Optional</span>
              </div>
            </CardBody>
          </Card>

          {/* Benchmark Regulatory Presets */}
          <Card className="border-[#E8E1D2] dark:border-neutral-800 shadow-xs">
            <CardHeader className="py-2.5 px-4 border-b border-[#E8E1D2] dark:border-neutral-800 bg-[#FAF9F5] dark:bg-neutral-900">
              <CardTitle className="text-xs font-bold uppercase tracking-wider text-[#303530] dark:text-white flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-[#426B5A] dark:text-[#8FAF9A]" />
                <span>PCR 2011 Test Benchmarks</span>
              </CardTitle>
            </CardHeader>
            <CardBody className="p-3 space-y-2">
              {MOCK_PREPACKAGED_SAMPLES.map((preset) => (
                <button
                  key={preset.id}
                  onClick={() => selectPreset(preset.id)}
                  className={`w-full p-2.5 rounded-xl border text-left flex items-start gap-2.5 transition cursor-pointer ${
                    selectedPresetId === preset.id && !customImageUrl
                      ? 'border-[#8FAF9A] bg-[#EEF3EF] text-[#426B5A] dark:bg-[#23352B] dark:text-[#8FAF9A] dark:border-[#4A6E59] font-semibold'
                      : 'border-[#E8E1D2] dark:border-neutral-800 hover:bg-[#FAF9F5] dark:hover:bg-neutral-800/50 text-[#4A534B] dark:text-slate-300'
                  }`}
                >
                  <img
                    src={preset.imageUrl}
                    alt={preset.name}
                    className="w-10 h-10 rounded-md object-cover border border-[#E8E1D2] dark:border-neutral-700 shrink-0"
                  />
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-bold truncate text-[#303530] dark:text-white">{preset.name}</p>
                    <p className="text-[10px] text-[#66706A] dark:text-slate-400 mt-0.5 line-clamp-1">
                      {preset.description}
                    </p>
                  </div>
                </button>
              ))}
            </CardBody>
          </Card>
        </div>
      </div>
    </div>
  );
};
