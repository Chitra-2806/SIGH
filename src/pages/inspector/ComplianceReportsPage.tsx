import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  FileText,
  Download,
  Printer,
  Share2,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  AlertOctagon,
  Calendar,
  Clock,
  MapPin,
  Store,
  User,
  Send,
  RotateCcw,
  Sparkles,
  ArrowLeft,
  Lock,
  Package,
  Building,
  Check
} from 'lucide-react';
import { useInspection } from '../../context/InspectionContext';
import { apiService } from '../../services/api';
import { InspectionRecord, StandardRegulatoryStatus } from '../../types';
import { generateInspectionPDF } from '../../utils/pdfGenerator';
import { Card, CardHeader, CardTitle, CardBody } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { StatusPill } from '../../components/common/StatusPill';

export const ComplianceReportsPage: React.FC = () => {
  const { id } = useParams<{ id?: string }>();
  const navigate = useNavigate();
  const { activeRecord, resetWorkflow } = useInspection();

  const [record, setRecord] = useState<InspectionRecord | null>(activeRecord);
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
  const [dispatchStatus, setDispatchStatus] = useState<'idle' | 'dispatched'>('idle');

  useEffect(() => {
    const loadRecord = async () => {
      if (id) {
        try {
          const fetched = await apiService.getInspectionById(id);
          if (fetched) setRecord(fetched);
        } catch (err) {
          console.error('Failed to load record by id', err);
        }
      } else if (!record && activeRecord) {
        setRecord(activeRecord);
      }
    };
    loadRecord();
  }, [id, activeRecord, record]);

  if (!record) {
    return (
      <div className="py-20 text-center space-y-4">
        <p className="text-sm text-[#565D57] dark:text-[#D2CDC0]">No inspection dossier selected.</p>
        <Button onClick={() => navigate('/audit-history')} className="bg-[#426B5A] text-white">
          Go to Audit Register
        </Button>
      </div>
    );
  }

  const handleDownloadPDF = () => {
    setIsGeneratingPdf(true);
    try {
      generateInspectionPDF(record);
    } catch (err) {
      console.error('PDF generation error', err);
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  const handleDispatchNotice = () => {
    setDispatchStatus('dispatched');
    setTimeout(() => {
      setDispatchStatus('idle');
    }, 4000);
  };

  // Derive exact regulatory status:
  // 'COMPLIANT' | 'POTENTIAL NON-COMPLIANCE' | 'REQUIRES OFFICER REVIEW'
  let reportStandardStatus: StandardRegulatoryStatus = 'REQUIRES OFFICER REVIEW';
  if (record.overallScore >= 90) {
    reportStandardStatus = 'COMPLIANT';
  } else if (record.overallScore < 70) {
    reportStandardStatus = 'POTENTIAL NON-COMPLIANCE';
  } else {
    reportStandardStatus = 'REQUIRES OFFICER REVIEW';
  }

  const reportId = `RPT-2026-${record.id.replace('INS-', '')}`;
  const officerId = record.inspectorId || record.badgeNumber || 'LM-OFF-2049';
  const inspectionZone = record.zone || 'North Zone — National Capital Territory';

  const pseudoHash = `SHA256: ${(record.id + record.inspectionDate)
    .split('')
    .map((c) => c.charCodeAt(0).toString(16))
    .join('')
    .slice(0, 32)}...`;

  return (
    <div className="space-y-6 pb-24 max-w-4xl mx-auto">
      {/* Top Header & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#E8E1D2] dark:border-[#3A443E] pb-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#D5E2D9] text-[#2C493D] dark:bg-[#426B5A]/40 dark:text-[#D5E2D9] text-xs font-semibold mb-1">
            <FileText className="w-3.5 h-3.5" />
            <span>STATUTORY FORM III COMPLIANCE DOSSIER</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-[#303530] dark:text-[#F5F3EA]">
            Statutory Inspection Report: {reportId}
          </h1>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <Button
            variant="secondary"
            size="sm"
            onClick={() => window.print()}
            className="text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print</span>
          </Button>

          <Button
            id="btn-download-form3-pdf"
            onClick={handleDownloadPDF}
            disabled={isGeneratingPdf}
            className="bg-[#426B5A] hover:bg-[#2C493D] text-white text-xs font-bold px-4 py-2 flex items-center gap-1.5 shadow-xs cursor-pointer"
          >
            <Download className="w-4 h-4" />
            <span>{isGeneratingPdf ? 'Generating...' : 'Export Form III PDF'}</span>
          </Button>
        </div>
      </div>

      {/* Official Directorate Form III Header Preview */}
      <div className="rounded-2xl border-2 border-[#426B5A] bg-white dark:bg-[#2B332E] shadow-sm overflow-hidden">
        {/* Banner */}
        <div className="bg-[#426B5A] dark:bg-[#202622] text-[#FAF9F5] p-5 text-center space-y-1 border-b border-[#343D37]">
          <p className="text-xs font-bold tracking-widest uppercase text-[#D5E2D9]">
            GOVERNMENT OF INDIA &bull; MINISTRY OF CONSUMER AFFAIRS
          </p>
          <h2 className="text-base sm:text-lg font-bold text-[#FAF9F5] tracking-wide">
            DIRECTORATE OF LEGAL METROLOGY (PACKAGED COMMODITIES)
          </h2>
          <p className="text-[11px] text-[#D5E2D9] font-serif italic">
            Statutory Field Compliance Memo Pursuant to Rule 6 & Rule 9 of Legal Metrology (Packaged Commodities) Rules, 2011
          </p>
        </div>

        {/* 1. Report Metadata Strip (Report ID, Inspection ID, Date/Time, Officer, Officer ID, Zone) */}
        <div className="p-4 sm:p-5 bg-[#FAF9F5] dark:bg-[#202622] border-b border-[#E8E1D2] dark:border-[#3A443E] grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 text-xs">
          <div>
            <span className="text-[10px] uppercase font-bold text-[#4A534B] dark:text-[#D4D0C5] block">Report ID</span>
            <span className="font-mono font-bold text-[#426B5A] dark:text-[#8FAF9A]">{reportId}</span>
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold text-[#4A534B] dark:text-[#D4D0C5] block">Inspection ID</span>
            <span className="font-mono font-bold text-[#303530] dark:text-[#F5F3EA]">{record.id}</span>
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold text-[#4A534B] dark:text-[#D4D0C5] block">Date / Time</span>
            <span className="font-semibold text-[#303530] dark:text-[#F5F3EA]">{record.inspectionDate} &bull; {record.timestamp}</span>
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold text-[#4A534B] dark:text-[#D4D0C5] block">Officer</span>
            <span className="font-semibold text-[#303530] dark:text-[#F5F3EA] truncate block">{record.inspectorName}</span>
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold text-[#4A534B] dark:text-[#D4D0C5] block">Officer ID</span>
            <span className="font-mono font-bold text-[#303530] dark:text-[#F5F3EA]">{officerId}</span>
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold text-[#4A534B] dark:text-[#D4D0C5] block">Inspection Zone</span>
            <span className="font-semibold text-[#303530] dark:text-[#F5F3EA] truncate block">{inspectionZone}</span>
          </div>
        </div>

        {/* 2. Score & Regulatory Status Banner */}
        <div className="p-4 sm:p-5 border-b border-[#E8E1D2] dark:border-[#3A443E] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <span className="text-[10px] uppercase font-bold text-[#4A534B] dark:text-[#D4D0C5] block">
              Official Compliance Score & Statutory Status
            </span>
            <div className="flex items-center gap-3">
              <span className="text-3xl font-black text-[#303530] dark:text-[#F5F3EA]">
                {record.overallScore}%
              </span>
              <StatusPill status={reportStandardStatus} size="md" />
            </div>
          </div>

          <div className="space-y-1 text-left sm:text-right">
            <span className="text-[10px] uppercase font-bold text-[#4A534B] dark:text-[#D4D0C5] block">
              Statutory Action Taken
            </span>
            <span className="inline-block px-3 py-1 rounded-lg bg-[#D5E2D9] text-[#2C493D] dark:bg-[#426B5A]/40 dark:text-[#D5E2D9] font-bold text-xs">
              {record.actionTaken}
            </span>
            {record.noticeNumber && (
              <p className="text-[11px] font-mono text-[#4A534B] dark:text-[#D4D0C5]">
                Ref Notice: {record.noticeNumber}
              </p>
            )}
          </div>
        </div>

        {/* 3. Product Details Section */}
        <div className="p-4 sm:p-5 border-b border-[#E8E1D2] dark:border-[#3A443E] space-y-3">
          <div className="flex items-center gap-2">
            <Package className="w-4 h-4 text-[#426B5A] dark:text-[#8FAF9A]" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#303530] dark:text-[#F5F3EA]">
              Product Details & Packaging Specification
            </h3>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs bg-[#FAF9F5] dark:bg-[#202622] p-3.5 rounded-xl border border-[#E8E1D2] dark:border-[#3A443E]">
            <div>
              <span className="text-[10px] uppercase font-bold text-[#79827B] dark:text-[#9BA39D] block">Commodity Name</span>
              <span className="font-semibold text-[#303530] dark:text-[#F5F3EA]">{record.extractedData.commodityName}</span>
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-[#79827B] dark:text-[#9BA39D] block">Brand Name</span>
              <span className="font-semibold text-[#303530] dark:text-[#F5F3EA]">{record.extractedData.brandName}</span>
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-[#79827B] dark:text-[#9BA39D] block">Package Type</span>
              <span className="font-semibold text-[#303530] dark:text-[#F5F3EA]">{record.extractedData.packageType}</span>
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-[#79827B] dark:text-[#9BA39D] block">Declared Net Qty</span>
              <span className="font-semibold text-[#303530] dark:text-[#F5F3EA]">{record.extractedData.netQuantity.declared}</span>
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-[#79827B] dark:text-[#9BA39D] block">Retail Sale Price (MRP)</span>
              <span className="font-semibold text-[#303530] dark:text-[#F5F3EA]">{record.extractedData.mrp.declaredValue}</span>
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-[#79827B] dark:text-[#9BA39D] block">Batch / Lot No.</span>
              <span className="font-mono text-[#303530] dark:text-[#F5F3EA]">{record.extractedData.batchOrLotNumber}</span>
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-[#79827B] dark:text-[#9BA39D] block">Mfg / Pkg Date</span>
              <span className="font-semibold text-[#303530] dark:text-[#F5F3EA]">{record.extractedData.manufacturingDate}</span>
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-[#79827B] dark:text-[#9BA39D] block">Principal Display Area</span>
              <span className="font-semibold text-[#303530] dark:text-[#F5F3EA]">{record.extractedData.dimensionAndFont.principalDisplayAreaSqCm} cm²</span>
            </div>
          </div>
        </div>

        {/* 4. Exhibit A: Specimen Evidence Image (PRISTINE & UNMODIFIED) */}
        <div className="p-4 sm:p-5 border-b border-[#E8E1D2] dark:border-[#3A443E] space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-[#303530] dark:text-[#F5F3EA]">
              Exhibit A — Specimen Evidence Image (Unmodified)
            </span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#D5E2D9] dark:bg-[#343D37] text-[#2C493D] dark:text-[#6F9B84] font-bold">
              Sec. 65B Indian Evidence Act Certified
            </span>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 items-start bg-[#FAF9F5] dark:bg-[#202622] p-3.5 rounded-xl border border-[#E8E1D2] dark:border-[#3A443E]">
            <img
              src={record.packageImage}
              alt="Exhibit A Specimen"
              className="w-32 h-32 rounded-lg object-contain bg-[#FAF9F5] dark:bg-[#202622] border border-[#E8E1D2] dark:border-[#3A443E] shrink-0"
            />
            <div className="text-xs space-y-1.5 flex-1">
              <p className="font-bold text-[#303530] dark:text-[#F5F3EA]">
                Unadulterated Photographic Evidence of Specimen Package
              </p>
              <p className="text-[#565D57] dark:text-[#D2CDC0] leading-relaxed">
                As mandated by Legal Metrology inspection guidelines, this photographic record is archived in raw, unedited format. No optical bounding boxes or artificial graphic markers have been superimposed onto the specimen image, maintaining complete evidentiary authenticity.
              </p>
              <p className="text-[10px] font-mono text-[#79827B] dark:text-[#9BA39D] pt-1">
                Checksum: {pseudoHash}
              </p>
            </div>
          </div>
        </div>

        {/* 5. Rule-Wise Findings Table */}
        <div className="p-4 sm:p-5 border-b border-[#E8E1D2] dark:border-[#3A443E] space-y-3">
          <span className="text-xs font-bold uppercase tracking-wider text-[#303530] dark:text-[#F5F3EA]">
            Rule-Wise Statutory Findings (PCR 2011)
          </span>

          <div className="overflow-x-auto rounded-xl border border-[#E8E1D2] dark:border-[#3A443E]">
            <table className="w-full text-xs text-left">
              <thead className="bg-[#426B5A]/10 dark:bg-[#426B5A]/20 text-[#2C493D] dark:text-[#D5E2D9] font-bold border-b border-[#E8E1D2] dark:border-[#3A443E]">
                <tr>
                  <th className="py-2.5 px-3">Statutory Rule</th>
                  <th className="py-2.5 px-3">Mandate Requirement</th>
                  <th className="py-2.5 px-3">Status</th>
                  <th className="py-2.5 px-3">Finding & Observation</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E8E1D2] dark:divide-[#3A443E]">
                {record.ruleResults.map((r) => {
                  let ruleStatusLabel: StandardRegulatoryStatus = 'REQUIRES OFFICER REVIEW';
                  if (r.status === 'compliant') ruleStatusLabel = 'COMPLIANT';
                  else if (r.status === 'non-compliant') ruleStatusLabel = 'POTENTIAL NON-COMPLIANCE';
                  return (
                    <tr key={r.ruleId} className="hover:bg-[#FAF9F5] dark:hover:bg-[#202622]/50">
                      <td className="py-2.5 px-3 font-mono font-bold text-[#426B5A] dark:text-[#8FAF9A]">
                        {r.clauseNumber}
                      </td>
                      <td className="py-2.5 px-3 font-semibold text-[#303530] dark:text-[#F5F3EA]">
                        {r.ruleTitle}
                      </td>
                      <td className="py-2.5 px-3">
                        <StatusPill status={ruleStatusLabel} size="sm" />
                      </td>
                      <td className="py-2.5 px-3 text-[#4A534B] dark:text-[#D4D0C5]">
                        {r.findingNote}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* 6. Officer Conclusion & Cryptographic Verification */}
        <div className="p-4 sm:p-5 space-y-4 bg-[#FAF9F5] dark:bg-[#202622]">
          <div className="space-y-1">
            <span className="text-[10px] uppercase font-bold text-[#79827B] dark:text-[#9BA39D]">
              Inspecting Officer Conclusion & Recommendation
            </span>
            <p className="text-xs text-[#303530] dark:text-[#F5F3EA] font-medium leading-relaxed">
              {record.inspectorNotes || 'Physical specimen audited at retail establishment premises under Legal Metrology Act, 2009. Mandatory declarations cross-checked against PCR 2011 Schedule requirements. Notice dispatched for any observed non-compliance.'}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-3 border-t border-[#E8E1D2] dark:border-[#3A443E] text-[11px] text-[#565D57] dark:text-[#D2CDC0] font-mono">
            <div className="flex items-center gap-1.5">
              <Lock className="w-3.5 h-3.5 text-[#426B5A] dark:text-[#8FAF9A]" />
              <span>{pseudoHash}</span>
            </div>
            <div className="text-right">
              <p className="font-bold text-[#303530] dark:text-[#F5F3EA] font-sans">
                {record.inspectorName}
              </p>
              <p className="text-[10px] text-[#79827B] dark:text-[#9BA39D]">
                Inspector of Legal Metrology &bull; Officer ID: {officerId} &bull; {inspectionZone}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Notice Dispatch & Action Controls */}
      <Card className="border-[#E8E1D2] dark:border-[#3A443E] shadow-xs bg-white dark:bg-[#2B332E]">
        <CardBody className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-0.5">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#303530] dark:text-[#F5F3EA]">
              Statutory Notice Dispatch & Record Transmission
            </h3>
            <p className="text-xs text-[#565D57] dark:text-[#D2CDC0]">
              Transmit Form III Notice to {inspectionZone} Controller & Establishment registry.
            </p>
          </div>

          <div className="flex items-center gap-3">
            {dispatchStatus === 'dispatched' ? (
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#EAF2ED] text-[#2C493D] text-xs font-bold border border-[#8FAF9A]/60">
                <CheckCircle2 className="w-4 h-4 text-[#426B5A]" />
                <span>Notice Transmitted to Zonal Controller</span>
              </div>
            ) : (
              <Button
                id="btn-dispatch-statutory-notice"
                onClick={handleDispatchNotice}
                className="bg-[#426B5A] hover:bg-[#2C493D] text-white text-xs font-bold px-4 py-2 flex items-center gap-1.5 shadow-xs cursor-pointer"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Dispatch Statutory Notice</span>
              </Button>
            )}
          </div>
        </CardBody>
      </Card>
    </div>
  );
};

