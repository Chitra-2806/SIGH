import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Camera,
  Upload,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  FileText,
  Download,
  RotateCcw,
  Store,
  MapPin,
  Scale,
  DollarSign,
  Building,
  PhoneCall,
  Calendar,
  Check,
  ChevronRight,
  ShieldCheck,
  Eye
} from 'lucide-react';
import { Card, CardHeader, CardBody, CardFooter } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import { Input } from '../../components/common/Input';
import { StatusPill } from '../../components/common/StatusPill';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import { useAuth } from '../../context/AuthContext';
import { apiService } from '../../services/api';
import { InspectionRecord, ExtractedPackageData } from '../../types';
import { MOCK_PREPACKAGED_SAMPLES } from '../../data/mockData';
import { generateInspectionPDF } from '../../utils/pdfGenerator';

type WorkflowStep = 'input' | 'analyzing' | 'results' | 'report';

export const FieldInspectionWorkflow: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  // Step state
  const [currentStep, setCurrentStep] = useState<WorkflowStep>('input');

  // Form state
  const [storeName, setStoreName] = useState('Reliance Smart Hypermarket');
  const [storeAddress, setStoreAddress] = useState('Shop 12-14, District Centre, Janakpuri');
  const [city, setCity] = useState('New Delhi');
  const [district, setDistrict] = useState(user?.district || 'West Delhi');
  const [state, setState] = useState(user?.state || 'Delhi');

  // Package Image & Presets
  const [selectedPresetId, setSelectedPresetId] = useState<string>(MOCK_PREPACKAGED_SAMPLES[0].id);
  const [customImageUrl, setCustomImageUrl] = useState<string | null>(null);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);

  // Analysis result
  const [inspectionResult, setInspectionResult] = useState<InspectionRecord | null>(null);
  const [analysisPhase, setAnalysisPhase] = useState<string>('Initializing OCR module...');

  // Editable extracted data
  const [editableExtracted, setEditableExtracted] = useState<ExtractedPackageData | null>(null);

  // Officer notes
  const [officerAction, setOfficerAction] = useState<InspectionRecord['actionTaken']>('Notice Issued');
  const [officerNotes, setOfficerNotes] = useState('');

  // Handle preset sample selection
  const handleSelectPreset = (presetId: string) => {
    setSelectedPresetId(presetId);
    setCustomImageUrl(null);
    setUploadedFile(null);
  };

  // Handle local image file upload
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setUploadedFile(file);
      const url = URL.createObjectURL(file);
      setCustomImageUrl(url);
    }
  };

  // Run the analysis through API Service
  const handleStartAnalysis = async () => {
    setCurrentStep('analyzing');
    setAnalysisPhase('Extracting Principal Display Panel text...');

    const timer1 = setTimeout(() => {
      setAnalysisPhase('Recognizing Net Quantity, Standard SI Units & MRP...');
    }, 500);

    const timer2 = setTimeout(() => {
      setAnalysisPhase('Evaluating Legal Metrology (PC) Rules, 2011 Clauses...');
    }, 1100);

    try {
      const result = await apiService.analyzePackage({
        imageFile: uploadedFile || undefined,
        imagePreviewUrl: customImageUrl || undefined,
        samplePresetId: selectedPresetId,
        storeName,
        storeAddress,
        city,
        district,
        state,
        inspectorId: user?.id || 'INSP-UNKNOWN',
        inspectorName: user?.name || 'Field Inspector',
        badgeNumber: user?.badgeNumber || 'LM-UNKNOWN',
      });

      clearTimeout(timer1);
      clearTimeout(timer2);

      setInspectionResult(result);
      setEditableExtracted(result.extractedData);
      setOfficerAction(result.actionTaken);
      setOfficerNotes(result.inspectorNotes || '');
      setCurrentStep('results');
    } catch (err) {
      console.error('Inspection analysis error', err);
      setCurrentStep('input');
    }
  };

  const activePreset = MOCK_PREPACKAGED_SAMPLES.find((s) => s.id === selectedPresetId);
  const currentDisplayImage = customImageUrl || activePreset?.imageUrl || MOCK_PREPACKAGED_SAMPLES[0].imageUrl;

  const handleDownloadPDF = () => {
    if (inspectionResult) {
      generateInspectionPDF({
        ...inspectionResult,
        extractedData: editableExtracted || inspectionResult.extractedData,
        actionTaken: officerAction,
        inspectorNotes: officerNotes,
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* Workflow Progress Breadcrumb */}
      <div className="flex items-center justify-between bg-white dark:bg-[#2B332E] px-4 py-3 rounded-xl border border-[#E8E1D2] dark:border-[#3F4A43] shadow-xs">
        <div className="flex items-center gap-2 sm:gap-4 text-xs font-semibold">
          <div
            className={`flex items-center gap-1.5 ${
              currentStep === 'input'
                ? 'text-[#426B5A] dark:text-[#8FAF9A] font-bold'
                : 'text-[#426B5A] dark:text-[#8FAF9A]'
            }`}
          >
            <span className="w-5 h-5 rounded-full bg-[#EEF3EF] dark:bg-[#343D37] flex items-center justify-center text-[10px]">
              1
            </span>
            <span>Scan & Input</span>
          </div>

          <ChevronRight className="w-3.5 h-3.5 text-[#8FAF9A]" />

          <div
            className={`flex items-center gap-1.5 ${
              currentStep === 'analyzing'
                ? 'text-[#426B5A] dark:text-[#8FAF9A] font-bold'
                : currentStep === 'results' || currentStep === 'report'
                ? 'text-[#426B5A] dark:text-[#8FAF9A]'
                : 'text-[#5C6B61] dark:text-[#B0ACA0]'
            }`}
          >
            <span className="w-5 h-5 rounded-full bg-[#EEF3EF] dark:bg-[#343D37] flex items-center justify-center text-[10px]">
              2
            </span>
            <span>Compliance Engine</span>
          </div>

          <ChevronRight className="w-3.5 h-3.5 text-[#8FAF9A]" />

          <div
            className={`flex items-center gap-1.5 ${
              currentStep === 'results' || currentStep === 'report'
                ? 'text-[#426B5A] dark:text-[#8FAF9A] font-bold'
                : 'text-[#5C6B61] dark:text-[#B0ACA0]'
            }`}
          >
            <span className="w-5 h-5 rounded-full bg-[#EEF3EF] dark:bg-[#343D37] flex items-center justify-center text-[10px]">
              3
            </span>
            <span>Findings & Report</span>
          </div>
        </div>

        {currentStep !== 'input' && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setCurrentStep('input')}
            leftIcon={<RotateCcw className="w-3.5 h-3.5" />}
          >
            New Scan
          </Button>
        )}
      </div>

      {/* STEP 1: SCAN & INPUT */}
      {currentStep === 'input' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left: Package Image Upload & Presets */}
          <div className="lg:col-span-6 space-y-4">
            <Card>
              <CardHeader className="flex items-center justify-between py-3">
                <div className="flex items-center gap-2">
                  <Camera className="w-4 h-4 text-[#426B5A] dark:text-[#8FAF9A]" />
                  <h2 className="text-sm font-semibold text-[#303530] dark:text-white">
                    Package Capture / Upload
                  </h2>
                </div>
                <span className="text-[11px] text-[#5C6B61] dark:text-[#B0ACA0]">
                  Principal Display Panel
                </span>
              </CardHeader>
              <CardBody className="space-y-4">
                {/* Active Image Preview Box */}
                <div className="relative aspect-4/3 w-full bg-[#F4F1E9] dark:bg-[#202622] rounded-xl overflow-hidden border border-[#E8E1D2] dark:border-[#3F4A43] group">
                  <img
                    src={currentDisplayImage}
                    alt="Commodity Package"
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-80 flex items-end p-3 text-white">
                    <div>
                      <p className="text-xs font-semibold">
                        {customImageUrl ? 'Uploaded Package' : activePreset?.name}
                      </p>
                      <p className="text-[10px] text-slate-200">
                        {customImageUrl ? 'Custom capture image' : activePreset?.category}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Upload or Camera buttons */}
                <div className="flex gap-2">
                  <label
                    htmlFor="package-file-input"
                    className="flex-1 flex items-center justify-center gap-2 py-2 px-3 text-xs font-medium rounded-lg border border-[#E8E1D2] dark:border-[#3F4A43] bg-white dark:bg-[#2B332E] hover:bg-[#F4F1E9] dark:hover:bg-[#343D37] cursor-pointer text-[#303530] dark:text-[#F5F3EA] transition-colors"
                  >
                    <Upload className="w-3.5 h-3.5 text-[#426B5A] dark:text-[#8FAF9A]" />
                    <span>Upload Image</span>
                    <input
                      id="package-file-input"
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleFileUpload}
                    />
                  </label>

                  <label
                    htmlFor="package-camera-input"
                    className="flex-1 flex items-center justify-center gap-2 py-2 px-3 text-xs font-medium rounded-lg border border-[#E8E1D2] dark:border-[#3F4A43] bg-white dark:bg-[#2B332E] hover:bg-[#F4F1E9] dark:hover:bg-[#343D37] cursor-pointer text-[#303530] dark:text-[#F5F3EA] transition-colors"
                  >
                    <Camera className="w-3.5 h-3.5 text-[#426B5A] dark:text-[#8FAF9A]" />
                    <span>Camera Snap</span>
                    <input
                      id="package-camera-input"
                      type="file"
                      accept="image/*"
                      capture="environment"
                      className="hidden"
                      onChange={handleFileUpload}
                    />
                  </label>
                </div>

                {/* Test Presets Selection */}
                <div>
                  <label className="block text-xs font-semibold text-[#303530] dark:text-[#F5F3EA] mb-2">
                    Quick Benchmark Test Packages (Legal Metrology Scenarios)
                  </label>
                  <div className="space-y-2">
                    {MOCK_PREPACKAGED_SAMPLES.map((sample) => (
                      <button
                        key={sample.id}
                        type="button"
                        onClick={() => handleSelectPreset(sample.id)}
                        className={`w-full text-left p-2.5 rounded-lg border transition-all cursor-pointer flex items-start gap-3 ${
                          selectedPresetId === sample.id && !customImageUrl
                            ? 'border-[#426B5A] bg-[#EEF3EF] dark:bg-[#343D37] dark:border-[#8FAF9A]'
                            : 'border-[#E8E1D2] dark:border-[#3F4A43] hover:border-[#8FAF9A]'
                        }`}
                      >
                        <div className="w-12 h-12 rounded-md overflow-hidden shrink-0 bg-[#F4F1E9]">
                          <img
                            src={sample.imageUrl}
                            alt={sample.name}
                            className="w-full h-full object-cover"
                            referrerPolicy="no-referrer"
                          />
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center justify-between">
                            <p className="text-xs font-semibold text-[#303530] dark:text-white truncate">
                              {sample.name}
                            </p>
                            {sample.id.includes('compliant') ? (
                              <Badge variant="success" size="sm">
                                Compliant
                              </Badge>
                            ) : sample.id.includes('major') ? (
                              <Badge variant="danger" size="sm">
                                High Infringement
                              </Badge>
                            ) : (
                              <Badge variant="warning" size="sm">
                                Rule 6 Violation
                              </Badge>
                            )}
                          </div>
                          <p className="text-[11px] text-[#5C6B61] dark:text-[#B0ACA0] line-clamp-1 mt-0.5">
                            {sample.description}
                          </p>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              </CardBody>
            </Card>
          </div>

          {/* Right: Inspection Premises & Location Metadata */}
          <div className="lg:col-span-6 space-y-4">
            <Card>
              <CardHeader className="flex items-center justify-between py-3">
                <div className="flex items-center gap-2">
                  <Store className="w-4 h-4 text-[#426B5A] dark:text-[#8FAF9A]" />
                  <h2 className="text-sm font-semibold text-[#303530] dark:text-white">
                    Premises & Inspection Context
                  </h2>
                </div>
                <Badge variant="neutral" size="sm">
                  Jurisdiction: {district}
                </Badge>
              </CardHeader>
              <CardBody className="space-y-3.5">
                <Input
                  id="input-store-name"
                  label="Establishment / Store / Wholesaler Name"
                  value={storeName}
                  onChange={(e) => setStoreName(e.target.value)}
                  leftIcon={<Store className="w-4 h-4" />}
                  placeholder="e.g. Metro Mart / Kirana General Store"
                  required
                />

                <Input
                  id="input-store-address"
                  label="Street Address / Market Complex"
                  value={storeAddress}
                  onChange={(e) => setStoreAddress(e.target.value)}
                  leftIcon={<MapPin className="w-4 h-4" />}
                  placeholder="e.g. Shop 44, Commercial Belt"
                  required
                />

                <div className="grid grid-cols-2 gap-3">
                  <Input
                    id="input-city"
                    label="City / Town"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    required
                  />
                  <Input
                    id="input-district"
                    label="District Zone"
                    value={district}
                    onChange={(e) => setDistrict(e.target.value)}
                    required
                  />
                </div>

                <div className="p-3 bg-[#EEF3EF] dark:bg-[#202622] rounded-lg text-xs space-y-1.5 border border-[#E8E1D2] dark:border-[#3F4A43]">
                  <div className="flex justify-between text-[#5C6B61] dark:text-[#B0ACA0]">
                    <span>Inspecting Officer:</span>
                    <span className="font-semibold text-[#303530] dark:text-[#F5F3EA]">
                      {user?.name}
                    </span>
                  </div>
                  <div className="flex justify-between text-[#5C6B61] dark:text-[#B0ACA0]">
                    <span>Badge Authorization:</span>
                    <span className="font-mono text-[#303530] dark:text-[#F5F3EA]">
                      {user?.badgeNumber}
                    </span>
                  </div>
                  <div className="flex justify-between text-[#5C6B61] dark:text-[#B0ACA0]">
                    <span>Statutory Scope:</span>
                    <span className="text-[#426B5A] dark:text-[#8FAF9A] font-medium">
                      Legal Metrology (PC) Rules, 2011
                    </span>
                  </div>
                </div>

                <div className="pt-2">
                  <Button
                    id="btn-trigger-analysis"
                    onClick={handleStartAnalysis}
                    className="w-full justify-center py-3 text-sm font-semibold"
                    leftIcon={<Sparkles className="w-4 h-4" />}
                  >
                    Run Automated Compliance Check
                  </Button>
                  <p className="text-[11px] text-center text-[#5C6B61] dark:text-[#B0ACA0] mt-2">
                    Simulates OCR extraction, unit normalization & statutory rule audit
                  </p>
                </div>
              </CardBody>
            </Card>
          </div>
        </div>
      )}

      {/* STEP 2: ANALYZING SPINNER */}
      {currentStep === 'analyzing' && (
        <Card className="max-w-md mx-auto py-8">
          <CardBody className="text-center space-y-4">
            <LoadingSpinner size="lg" message={analysisPhase} />
            <div className="space-y-1 text-xs text-[#5C6B61] dark:text-[#B0ACA0]">
              <p>Scanning typography height against Rule 9 Table 1...</p>
              <p>Validating ₹ Tax inclusivity under Rule 6(1)(e)...</p>
              <p>Evaluating mandatory Unit Sale Price declaration...</p>
            </div>
          </CardBody>
        </Card>
      )}

      {/* STEP 3 & 4: RESULTS, EXTRACTED INFO & RULE BREAKDOWN */}
      {(currentStep === 'results' || currentStep === 'report') && inspectionResult && editableExtracted && (
        <div className="space-y-6">
          {/* Top Score Banner */}
          <div className="bg-white dark:bg-[#2B332E] border border-[#E8E1D2] dark:border-[#3F4A43] rounded-2xl p-5 shadow-xs">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                {/* Score Circular dial preview */}
                <div
                  className={`w-16 h-16 rounded-2xl flex flex-col items-center justify-center font-bold border-2 shadow-xs ${
                    inspectionResult.overallScore >= 85
                      ? 'bg-[#EAF2ED] border-[#8FAF9A] text-[#2C493D] dark:bg-[#23352B] dark:text-[#C4E2D0]'
                      : inspectionResult.overallScore >= 60
                      ? 'bg-[#F6F0E4] border-[#D8C79B] text-[#6B4E23] dark:bg-[#3B3426] dark:text-[#E8D5B0]'
                      : 'bg-[#FDF2F0] border-[#E8B8B0] text-[#8F4336] dark:bg-[#3E2926] dark:text-[#F2C7BF]'
                  }`}
                >
                  <span className="text-2xl leading-none">{inspectionResult.overallScore}%</span>
                  <span className="text-[9px] uppercase tracking-wider font-semibold mt-0.5">
                    Score
                  </span>
                </div>

                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-lg font-bold text-[#303530] dark:text-white">
                      {editableExtracted.commodityName || 'Packaged Commodity'}
                    </h2>
                    <StatusPill status={inspectionResult.status} />
                  </div>
                  <p className="text-xs text-[#5C6B61] dark:text-[#B0ACA0] mt-0.5">
                    Inspection ID: <span className="font-mono">{inspectionResult.id}</span> &bull;{' '}
                    {inspectionResult.storeName} ({inspectionResult.city})
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 self-end sm:self-center">
                <Button
                  id="btn-download-pdf"
                  variant="primary"
                  size="sm"
                  onClick={handleDownloadPDF}
                  leftIcon={<Download className="w-3.5 h-3.5" />}
                >
                  Export PDF Report
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => navigate('/audit-history')}
                  leftIcon={<Eye className="w-3.5 h-3.5" />}
                >
                  View in History
                </Button>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left: Extracted Declarations Card */}
            <div className="lg:col-span-5 space-y-4">
              <Card>
                <CardHeader className="flex items-center justify-between py-3">
                  <div className="flex items-center gap-2">
                    <FileText className="w-4 h-4 text-[#426B5A] dark:text-[#8FAF9A]" />
                    <h3 className="text-sm font-semibold text-[#303530] dark:text-white">
                      Extracted Package Information
                    </h3>
                  </div>
                  <Badge variant="neutral" size="sm">
                    OCR Parsed
                  </Badge>
                </CardHeader>
                <CardBody className="space-y-3 text-xs">
                  {/* Package thumbnail */}
                  <div className="flex items-center gap-3 p-2 bg-[#FAF9F5] dark:bg-[#202622] rounded-lg border border-[#E8E1D2] dark:border-[#3F4A43]">
                    <img
                      src={inspectionResult.packageImage}
                      alt="Product"
                      className="w-12 h-12 object-cover rounded-md border border-[#E8E1D2]"
                      referrerPolicy="no-referrer"
                    />
                    <div>
                      <p className="font-semibold text-[#303530] dark:text-[#F5F3EA]">
                        {editableExtracted.brandName}
                      </p>
                      <p className="text-[#5C6B61] dark:text-[#B0ACA0] text-[11px]">
                        {editableExtracted.packageType}
                      </p>
                    </div>
                  </div>

                  {/* Net Quantity */}
                  <div className="p-2.5 rounded-lg border border-[#E8E1D2] dark:border-[#3F4A43] space-y-1">
                    <div className="flex justify-between items-center text-[#5C6B61]">
                      <span className="flex items-center gap-1">
                        <Scale className="w-3.5 h-3.5 text-[#426B5A]" /> Net Quantity
                      </span>
                      {editableExtracted.netQuantity.unitStandardized ? (
                        <span className="text-[#426B5A] dark:text-[#8FAF9A] font-semibold flex items-center gap-1 text-[11px]">
                          <Check className="w-3 h-3" /> Standard Unit
                        </span>
                      ) : (
                        <span className="text-[#8F4336] font-semibold flex items-center gap-1 text-[11px]">
                          <AlertTriangle className="w-3 h-3" /> Non-standard Symbol
                        </span>
                      )}
                    </div>
                    <p className="font-semibold text-[#303530] dark:text-white">
                      {editableExtracted.netQuantity.declared}
                    </p>
                  </div>

                  {/* MRP and Unit Sale Price */}
                  <div className="p-2.5 rounded-lg border border-[#E8E1D2] dark:border-[#3F4A43] space-y-1">
                    <div className="flex justify-between items-center text-[#5C6B61]">
                      <span className="flex items-center gap-1">
                        <DollarSign className="w-3.5 h-3.5 text-[#426B5A]" /> Retail Price & USP
                      </span>
                      {editableExtracted.mrp.isInclusiveOfTaxes ? (
                        <span className="text-[#426B5A] dark:text-[#8FAF9A] font-semibold text-[11px]">
                          Incl. of all taxes
                        </span>
                      ) : (
                        <span className="text-[#8F4336] font-semibold text-[11px]">
                          Missing Tax Note
                        </span>
                      )}
                    </div>
                    <p className="font-semibold text-[#303530] dark:text-white">
                      {editableExtracted.mrp.declared}
                    </p>
                    <p className="text-[11px] text-[#5C6B61] dark:text-[#D4D0C5]">
                      Unit Sale Price (USP):{' '}
                      <span
                        className={
                          editableExtracted.unitSalePrice.declared
                            ? 'font-semibold text-[#426B5A] dark:text-[#8FAF9A]'
                            : 'font-semibold text-[#8F4336]'
                        }
                      >
                        {editableExtracted.unitSalePrice.declared ||
                          `Missing (Expected: ${editableExtracted.unitSalePrice.calculated})`}
                      </span>
                    </p>
                  </div>

                  {/* Manufacturing / Packing Date */}
                  <div className="p-2.5 rounded-lg border border-[#E8E1D2] dark:border-[#3F4A43] space-y-1">
                    <div className="flex justify-between items-center text-[#5C6B61]">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5 text-[#426B5A]" /> Mfg / Expiry
                      </span>
                      <span>Batch: {editableExtracted.batchNumber || 'N/A'}</span>
                    </div>
                    <p className="font-semibold text-[#303530] dark:text-white">
                      Mfg: {editableExtracted.manufacturingDate || 'Not declared'}{' '}
                      {editableExtracted.expiryDate && `| Expiry: ${editableExtracted.expiryDate}`}
                    </p>
                  </div>

                  {/* Manufacturer & Country of Origin */}
                  <div className="p-2.5 rounded-lg border border-[#E8E1D2] dark:border-[#3F4A43] space-y-1">
                    <div className="flex justify-between items-center text-[#5C6B61]">
                      <span className="flex items-center gap-1">
                        <Building className="w-3.5 h-3.5 text-[#426B5A]" /> Manufacturer / Packer
                      </span>
                      <span className="font-medium text-[#303530] dark:text-[#D4D0C5]">
                        Origin: {editableExtracted.countryOfOrigin || 'Not declared'}
                      </span>
                    </div>
                    <p className="font-semibold text-[#303530] dark:text-white">
                      {editableExtracted.manufacturerDetails.name}
                    </p>
                    <p className="text-[11px] text-[#5C6B61] dark:text-[#B0ACA0]">
                      {editableExtracted.manufacturerDetails.address}
                    </p>
                  </div>

                  {/* Consumer Care */}
                  <div className="p-2.5 rounded-lg border border-[#E8E1D2] dark:border-[#3F4A43] space-y-1">
                    <div className="flex justify-between items-center text-[#5C6B61]">
                      <span className="flex items-center gap-1">
                        <PhoneCall className="w-3.5 h-3.5 text-[#426B5A]" /> Consumer Grievance
                      </span>
                      {editableExtracted.consumerCareDetails.isValidComplete ? (
                        <span className="text-[#426B5A] dark:text-[#8FAF9A] font-semibold text-[11px]">
                          Complete
                        </span>
                      ) : (
                        <span className="text-[#6B4E23] dark:text-[#E8D5B0] font-semibold text-[11px]">
                          Incomplete Redressal
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-[#5C6B61] dark:text-[#D4D0C5]">
                      Ph: {editableExtracted.consumerCareDetails.phone || 'None'} | Email:{' '}
                      {editableExtracted.consumerCareDetails.email || 'None'}
                    </p>
                  </div>
                </CardBody>
              </Card>
            </div>

            {/* Right: Clause-by-Clause Rule Audit & Officer Actions */}
            <div className="lg:col-span-7 space-y-4">
              <Card>
                <CardHeader className="flex items-center justify-between py-3">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-[#426B5A] dark:text-[#8FAF9A]" />
                    <h3 className="text-sm font-semibold text-[#303530] dark:text-white">
                      Legal Metrology (PC) Rules, 2011 — Evaluation
                    </h3>
                  </div>
                  <span className="text-xs text-[#5C6B61]">
                    {inspectionResult.ruleResults.filter((r) => r.status === 'compliant').length} of{' '}
                    {inspectionResult.ruleResults.length} Passed
                  </span>
                </CardHeader>
                <CardBody className="p-0">
                  <div className="divide-y divide-[#E8E1D2] dark:divide-[#3F4A43]">
                    {inspectionResult.ruleResults.map((rule) => {
                      const isPass = rule.status === 'compliant';
                      const isPartial = rule.status === 'partial';

                      return (
                        <div key={rule.ruleId} className="p-4 space-y-1.5 hover:bg-[#FAF9F5]/60 dark:hover:bg-[#202622]/50 transition-colors">
                          <div className="flex items-start justify-between gap-3">
                            <div className="flex items-center gap-2">
                              {isPass ? (
                                <CheckCircle2 className="w-4 h-4 text-[#426B5A] shrink-0" />
                              ) : isPartial ? (
                                <AlertTriangle className="w-4 h-4 text-[#6B4E23] shrink-0" />
                              ) : (
                                <XCircle className="w-4 h-4 text-[#8F4336] shrink-0" />
                              )}
                              <span className="font-semibold text-xs text-[#303530] dark:text-white">
                                {rule.clauseNumber}: {rule.ruleTitle}
                              </span>
                            </div>

                            {isPass ? (
                              <Badge variant="success" size="sm">
                                Compliant
                              </Badge>
                            ) : isPartial ? (
                              <Badge variant="warning" size="sm">
                                Partial Violation
                              </Badge>
                            ) : (
                              <Badge variant="danger" size="sm">
                                Non-Compliant
                              </Badge>
                            )}
                          </div>

                          <p className="text-xs text-[#5C6B61] dark:text-[#D4D0C5] pl-6 leading-relaxed">
                            {rule.findingNote}
                          </p>

                          <div className="pl-6 flex flex-wrap items-center gap-x-4 gap-y-1 text-[11px] text-[#5C6B61] dark:text-[#B0ACA0]">
                            <span>
                              Detected:{' '}
                              <strong className="text-[#303530] dark:text-[#F5F3EA]">
                                {rule.detectedValue}
                              </strong>
                            </span>
                            <span>&bull;</span>
                            <span className="text-[#426B5A] dark:text-[#8FAF9A] font-mono">
                              {rule.applicableLaw}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </CardBody>
              </Card>

              {/* Statutory Action Dispatch Box */}
              <Card>
                <CardHeader className="py-3">
                  <h3 className="text-sm font-semibold text-[#303530] dark:text-white">
                    Field Action Dispatch & Statutory Notice
                  </h3>
                </CardHeader>
                <CardBody className="space-y-3">
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {(
                      [
                        'Cleared',
                        'Notice Issued',
                        'Sample Collected',
                        'Stock Seized',
                      ] as InspectionRecord['actionTaken'][]
                    ).map((action) => (
                      <button
                        key={action}
                        type="button"
                        onClick={() => setOfficerAction(action)}
                        className={`py-2 px-2.5 rounded-lg text-xs font-semibold border transition-all cursor-pointer text-center ${
                          officerAction === action
                            ? action === 'Cleared'
                              ? 'bg-[#426B5A] text-white border-[#426B5A] shadow-xs'
                              : action === 'Stock Seized'
                              ? 'bg-[#8F4336] text-white border-[#8F4336] shadow-xs'
                              : 'bg-[#6B4E23] text-white border-[#6B4E23] shadow-xs'
                            : 'border-[#E8E1D2] dark:border-[#3F4A43] text-[#303530] dark:text-[#D4D0C5] bg-white dark:bg-[#2B332E] hover:bg-[#FAF9F5]'
                        }`}
                      >
                        {action}
                      </button>
                    ))}
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#303530] dark:text-[#F5F3EA] mb-1">
                      Inspector Remarks / Notice Provisions
                    </label>
                    <textarea
                      rows={3}
                      value={officerNotes}
                      onChange={(e) => setOfficerNotes(e.target.value)}
                      placeholder="Add specific officer remarks, seizure memo reference, or compounding directions..."
                      className="w-full text-xs p-3 rounded-lg border border-[#E8E1D2] dark:border-[#3F4A43] bg-white dark:bg-[#202622] text-[#303530] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#426B5A]"
                    />
                  </div>

                  <div className="flex items-center justify-between pt-1">
                    <Button
                      id="btn-save-and-download"
                      onClick={handleDownloadPDF}
                      leftIcon={<Download className="w-4 h-4" />}
                    >
                      Generate Official PDF Memo
                    </Button>

                    <Button
                      variant="outline"
                      onClick={() => navigate('/audit-history')}
                    >
                      Complete Inspection
                    </Button>
                  </div>
                </CardBody>
              </Card>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
