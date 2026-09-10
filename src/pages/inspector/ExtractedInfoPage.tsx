import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FileText,
  CheckCircle2,
  AlertTriangle,
  Scale,
  ShieldCheck,
  Building2,
  Calendar,
  PhoneCall,
  Edit3,
  ArrowRight,
  Sparkles,
  Info
} from 'lucide-react';
import { useInspection } from '../../context/InspectionContext';
import { Card, CardHeader, CardTitle, CardBody } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/common/Input';
import { Badge } from '../../components/common/Badge';

export const ExtractedInfoPage: React.FC = () => {
  const navigate = useNavigate();
  const {
    displayImage,
    extractedData,
    updateExtractedField,
    officerNotes,
    setOfficerNotes
  } = useInspection();

  const [isEditing, setIsEditing] = useState(false);

  // Local helper to update nested properties if editing
  const handleNetQtyChange = (val: string) => {
    updateExtractedField('netQuantity', {
      ...extractedData.netQuantity,
      declared: val,
    });
  };

  const handleMrpChange = (val: string) => {
    updateExtractedField('mrp', {
      ...extractedData.mrp,
      declared: val,
    });
  };

  const handleUspChange = (val: string) => {
    updateExtractedField('unitSalePrice', {
      ...extractedData.unitSalePrice,
      declared: val,
    });
  };

  const handleProceedToScore = () => {
    navigate('/compliance-score');
  };

  return (
    <div className="space-y-6 pb-24 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#E8E1D2] dark:border-neutral-800 pb-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#D5E2D9] text-[#2C493D] dark:bg-[#426B5A]/40 dark:text-[#D5E2D9] text-xs font-semibold mb-1">
            <FileText className="w-3.5 h-3.5" />
            <span>STEP 3 OF 5 — MANDATORY DECLARATION REVIEW</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-[#303530] dark:text-white">
            Extracted Statutory Entities & Declaration Audit
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Verify OCR character entities against Legal Metrology Rules 2011 before scoring.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsEditing(!isEditing)}
            className="border-[#8FAF9A]/60 text-[#2C493D] dark:text-[#D5E2D9] text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
          >
            <Edit3 className="w-3.5 h-3.5" />
            <span>{isEditing ? 'Done Editing' : 'Edit Values'}</span>
          </Button>

          <Button
            id="btn-proceed-to-score"
            onClick={handleProceedToScore}
            className="bg-[#426B5A] hover:bg-[#2C493D] text-white text-xs font-bold px-4 py-2 flex items-center gap-1.5 shadow-sm cursor-pointer"
          >
            <span>[ COMPUTE SCORE ]</span>
            <ArrowRight className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Evidentiary Specimen Reference Bar */}
      <div className="flex items-center gap-4 p-3.5 rounded-xl bg-[#FAF9F5] dark:bg-[#202622] border border-[#8FAF9A]/40 dark:border-[#3F4A43] shadow-xs">
        <img
          src={displayImage}
          alt="Specimen thumbnail"
          className="w-14 h-14 rounded-lg object-cover border border-[#E8E1D2] shrink-0"
        />
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-[#2C493D] dark:text-[#D5E2D9]">
              {extractedData.commodityName} &bull; {extractedData.brandName}
            </span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#EEF3EF] dark:bg-[#343D37] text-[#4A534B] dark:text-[#D4D0C5]">
              {extractedData.packageType}
            </span>
          </div>
          <p className="text-[11px] text-[#5C6B61] dark:text-[#B0ACA0] mt-0.5">
            Specimen photo preserved in authentic original state without overlay markers pursuant to Sec. 65B Indian Evidence Act.
          </p>
        </div>
      </div>

      {/* Entity Declarations Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* 1. Net Quantity & SI Units */}
        <Card className="border-[#E8E1D2] dark:border-neutral-800 shadow-xs">
          <CardHeader className="py-3 px-4 border-b border-[#E8E1D2] dark:border-neutral-800 bg-[#FAF9F5] dark:bg-neutral-900 flex items-center justify-between">
            <CardTitle className="text-xs font-bold uppercase tracking-wider text-[#303530] dark:text-white flex items-center gap-1.5">
              <Scale className="w-4 h-4 text-[#426B5A] dark:text-[#8FAF9A]" />
              <span>Net Quantity (Rule 11 & Sched. 3)</span>
            </CardTitle>
            {extractedData.netQuantity.unitStandardized ? (
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300 flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" />
                <span>SI Unit Valid</span>
              </span>
            ) : (
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-100 text-rose-800 dark:bg-rose-950/40 dark:text-rose-300 flex items-center gap-1">
                <AlertTriangle className="w-3 h-3" />
                <span>Non-Standard Unit</span>
              </span>
            )}
          </CardHeader>
          <CardBody className="p-4 space-y-2 text-xs">
            {isEditing ? (
              <Input
                label="Declared Net Quantity"
                value={extractedData.netQuantity.declared}
                onChange={(e) => handleNetQtyChange(e.target.value)}
              />
            ) : (
              <div className="flex items-baseline justify-between">
                <span className="text-slate-500">Declared Value:</span>
                <span className="font-bold text-sm text-[#303530] dark:text-white">
                  {extractedData.netQuantity.declared}
                </span>
              </div>
            )}
            <div className="flex items-center justify-between text-slate-500 pt-1 border-t border-slate-100 dark:border-neutral-800">
              <span>Standard Symbol:</span>
              <span className="font-mono font-semibold text-slate-700 dark:text-slate-300">
                {extractedData.netQuantity.unit}
              </span>
            </div>
          </CardBody>
        </Card>

        {/* 2. Maximum Retail Price (MRP) */}
        <Card className="border-[#E8E1D2] dark:border-neutral-800 shadow-xs">
          <CardHeader className="py-3 px-4 border-b border-[#E8E1D2] dark:border-neutral-800 bg-[#FAF9F5] dark:bg-neutral-900 flex items-center justify-between">
            <CardTitle className="text-xs font-bold uppercase tracking-wider text-[#303530] dark:text-white flex items-center gap-1.5">
              <span className="font-mono text-sm font-bold text-[#426B5A]">₹</span>
              <span>MRP Declaration (Rule 6(1)(e))</span>
            </CardTitle>
            {extractedData.mrp.isInclusiveOfTaxes ? (
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300 flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" />
                <span>Taxes Included</span>
              </span>
            ) : (
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-100 text-rose-800 dark:bg-rose-950/40 dark:text-rose-300 flex items-center gap-1">
                <AlertTriangle className="w-3 h-3" />
                <span>Tax Statement Missing</span>
              </span>
            )}
          </CardHeader>
          <CardBody className="p-4 space-y-2 text-xs">
            {isEditing ? (
              <Input
                label="Declared MRP"
                value={extractedData.mrp.declared}
                onChange={(e) => handleMrpChange(e.target.value)}
              />
            ) : (
              <div className="flex items-baseline justify-between">
                <span className="text-slate-500">Declared MRP:</span>
                <span className="font-bold text-sm text-[#303530] dark:text-white">
                  {extractedData.mrp.declared}
                </span>
              </div>
            )}
            <div className="flex items-center justify-between text-slate-500 pt-1 border-t border-slate-100 dark:border-neutral-800">
              <span>Numeric Amount:</span>
              <span className="font-mono font-semibold text-slate-700 dark:text-slate-300">
                ₹{extractedData.mrp.amount}
              </span>
            </div>
          </CardBody>
        </Card>

        {/* 3. Unit Sale Price (USP) */}
        <Card className="border-[#E8E1D2] dark:border-neutral-800 shadow-xs">
          <CardHeader className="py-3 px-4 border-b border-[#E8E1D2] dark:border-neutral-800 bg-[#FAF9F5] dark:bg-neutral-900 flex items-center justify-between">
            <CardTitle className="text-xs font-bold uppercase tracking-wider text-[#303530] dark:text-white flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-[#426B5A] dark:text-[#8FAF9A]" />
              <span>Unit Sale Price (Rule 6(11) 2022)</span>
            </CardTitle>
            {extractedData.unitSalePrice.declared ? (
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300 flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" />
                <span>Declared</span>
              </span>
            ) : (
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-100 text-rose-800 dark:bg-rose-950/40 dark:text-rose-300 flex items-center gap-1">
                <AlertTriangle className="w-3 h-3" />
                <span>Missing (Infraction)</span>
              </span>
            )}
          </CardHeader>
          <CardBody className="p-4 space-y-2 text-xs">
            {isEditing ? (
              <Input
                label="Declared USP"
                value={extractedData.unitSalePrice.declared || ''}
                onChange={(e) => handleUspChange(e.target.value)}
                placeholder="e.g. ₹0.30 / g"
              />
            ) : (
              <div className="flex items-baseline justify-between">
                <span className="text-slate-500">Declared USP:</span>
                <span className="font-bold text-sm text-[#303530] dark:text-white">
                  {extractedData.unitSalePrice.declared || 'Not Found on Package'}
                </span>
              </div>
            )}
            <div className="flex items-center justify-between text-slate-500 pt-1 border-t border-slate-100 dark:border-neutral-800">
              <span>Statutory Calculated USP:</span>
              <span className="font-mono font-semibold text-[#426B5A] dark:text-[#8FAF9A]">
                {extractedData.unitSalePrice.calculated}
              </span>
            </div>
          </CardBody>
        </Card>

        {/* 4. Manufacturing & Expiry Dates */}
        <Card className="border-[#E8E1D2] dark:border-neutral-800 shadow-xs">
          <CardHeader className="py-3 px-4 border-b border-[#E8E1D2] dark:border-neutral-800 bg-[#FAF9F5] dark:bg-neutral-900 flex items-center justify-between">
            <CardTitle className="text-xs font-bold uppercase tracking-wider text-[#303530] dark:text-white flex items-center gap-1.5">
              <Calendar className="w-4 h-4 text-[#426B5A] dark:text-[#8FAF9A]" />
              <span>Dates & Batch (Rule 6(1)(d))</span>
            </CardTitle>
            {extractedData.manufacturingDate ? (
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300">
                Date Stated
              </span>
            ) : (
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-100 text-rose-800 dark:bg-rose-950/40 dark:text-rose-300">
                Missing Date
              </span>
            )}
          </CardHeader>
          <CardBody className="p-4 space-y-2 text-xs">
            <div className="flex items-center justify-between">
              <span className="text-slate-500">Mfg / Pkg Date:</span>
              <span className="font-semibold text-slate-800 dark:text-slate-200">
                {extractedData.manufacturingDate || 'Not Stated'}
              </span>
            </div>
            <div className="flex items-center justify-between pt-1 border-t border-slate-100 dark:border-neutral-800 text-slate-500">
              <span>Best Before / Expiry:</span>
              <span className="font-semibold text-slate-800 dark:text-slate-200">
                {extractedData.expiryDate || extractedData.bestBeforePeriod || 'Stated'}
              </span>
            </div>
            <div className="flex items-center justify-between pt-1 border-t border-slate-100 dark:border-neutral-800 text-slate-500">
              <span>Batch Code:</span>
              <span className="font-mono font-semibold text-slate-700 dark:text-slate-300">
                {extractedData.batchNumber || 'Present'}
              </span>
            </div>
          </CardBody>
        </Card>

        {/* 5. Manufacturer & Packer Postal Address */}
        <Card className="border-[#E8E1D2] dark:border-neutral-800 shadow-xs">
          <CardHeader className="py-3 px-4 border-b border-[#E8E1D2] dark:border-neutral-800 bg-[#FAF9F5] dark:bg-neutral-900 flex items-center justify-between">
            <CardTitle className="text-xs font-bold uppercase tracking-wider text-[#303530] dark:text-white flex items-center gap-1.5">
              <Building2 className="w-4 h-4 text-[#426B5A] dark:text-[#8FAF9A]" />
              <span>Manufacturer Address (Rule 6(1)(a))</span>
            </CardTitle>
            {extractedData.manufacturerDetails.isCompleteAddress ? (
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300">
                Complete
              </span>
            ) : (
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-100 text-rose-800 dark:bg-rose-950/40 dark:text-rose-300">
                Vague / Incomplete
              </span>
            )}
          </CardHeader>
          <CardBody className="p-4 space-y-2 text-xs">
            <p className="font-bold text-slate-800 dark:text-slate-200">
              {extractedData.manufacturerDetails.name}
            </p>
            <p className="text-slate-600 dark:text-slate-400">
              {extractedData.manufacturerDetails.address}
            </p>
            <div className="flex items-center justify-between pt-1 border-t border-slate-100 dark:border-neutral-800 text-slate-500">
              <span>Origin Jurisdiction:</span>
              <span className="font-semibold text-slate-700 dark:text-slate-300">
                {extractedData.countryOfOrigin || 'India'}
              </span>
            </div>
          </CardBody>
        </Card>

        {/* 6. Consumer Care & Grievance Mechanism */}
        <Card className="border-[#E8E1D2] dark:border-neutral-800 shadow-xs">
          <CardHeader className="py-3 px-4 border-b border-[#E8E1D2] dark:border-neutral-800 bg-[#FAF9F5] dark:bg-neutral-900 flex items-center justify-between">
            <CardTitle className="text-xs font-bold uppercase tracking-wider text-[#303530] dark:text-white flex items-center gap-1.5">
              <PhoneCall className="w-4 h-4 text-[#426B5A] dark:text-[#8FAF9A]" />
              <span>Consumer Grievance Cell (Rule 6(1)(h))</span>
            </CardTitle>
            {extractedData.consumerCareDetails.isValidComplete ? (
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300">
                Verified
              </span>
            ) : (
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 dark:bg-amber-950/40 dark:text-amber-300">
                Review Redressal
              </span>
            )}
          </CardHeader>
          <CardBody className="p-4 space-y-2 text-xs">
            <div className="flex items-center justify-between">
              <span className="text-slate-500">Grievance Officer:</span>
              <span className="font-semibold text-slate-800 dark:text-slate-200">
                {extractedData.consumerCareDetails.officerOrPersonName || 'Manager Consumer Affairs'}
              </span>
            </div>
            <div className="flex items-center justify-between pt-1 border-t border-slate-100 dark:border-neutral-800">
              <span className="text-slate-500">Helpline Phone:</span>
              <span className="font-mono font-semibold text-slate-800 dark:text-slate-200">
                {extractedData.consumerCareDetails.phone}
              </span>
            </div>
            <div className="flex items-center justify-between pt-1 border-t border-slate-100 dark:border-neutral-800">
              <span className="text-slate-500">Email Address:</span>
              <span className="font-mono text-slate-800 dark:text-slate-200 truncate max-w-[200px]">
                {extractedData.consumerCareDetails.email}
              </span>
            </div>
          </CardBody>
        </Card>
      </div>

      {/* PDA & Font Metric Bar */}
      <Card className="border-[#E8E1D2] dark:border-neutral-800 shadow-xs">
        <CardBody className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#426B5A] dark:text-[#8FAF9A]">
              Rule 9 Table 1 Typography Assessment
            </span>
            <p className="text-xs font-bold text-[#303530] dark:text-white mt-0.5">
              Principal Display Area: {extractedData.dimensionAndFont.principalDisplayAreaSqCm} cm² &bull; Detected Font Height: {extractedData.dimensionAndFont.detectedFontHeightMm} mm
            </p>
            <p className="text-[11px] text-slate-500 mt-0.5">
              Required Minimum Height for this PDA bracket: {extractedData.dimensionAndFont.minimumRequiredFontHeightMm} mm
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {extractedData.dimensionAndFont.isFontHeightCompliant ? (
              <span className="px-3 py-1.5 rounded-lg bg-emerald-100 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300 font-bold text-xs flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4" />
                <span>Font Height Complies</span>
              </span>
            ) : (
              <span className="px-3 py-1.5 rounded-lg bg-rose-100 text-rose-800 dark:bg-rose-950/40 dark:text-rose-300 font-bold text-xs flex items-center gap-1.5">
                <AlertTriangle className="w-4 h-4" />
                <span>Under-sized Font</span>
              </span>
            )}
          </div>
        </CardBody>
      </Card>

      {/* Field Officer Notes & Proceed Button */}
      <div className="space-y-3">
        <label className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400">
          Inspecting Officer Field Notes (Will appear in Statutory Form III Memo)
        </label>
        <textarea
          value={officerNotes}
          onChange={(e) => setOfficerNotes(e.target.value)}
          rows={3}
          placeholder="Record any on-site remarks, witness statements, or merchant explanations..."
          className="w-full rounded-xl border border-[#E8E1D2] dark:border-neutral-800 bg-white dark:bg-neutral-900 p-3 text-xs text-[#303530] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#426B5A]"
        />

        <div className="flex justify-end pt-2">
          <Button
            id="btn-compute-score-bottom"
            onClick={handleProceedToScore}
            className="w-full sm:w-auto bg-[#426B5A] hover:bg-[#2C493D] text-white font-bold px-6 py-3 text-sm shadow-md flex items-center justify-center gap-2 cursor-pointer"
          >
            <span>[ COMPUTE STATUTORY COMPLIANCE SCORE ]</span>
            <ArrowRight className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};
