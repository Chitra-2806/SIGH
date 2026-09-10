import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Download,
  Building,
  Store,
  MapPin,
  Calendar,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  FileCheck2,
  Scale,
  DollarSign
} from 'lucide-react';
import { Card, CardHeader, CardBody } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import { StatusPill } from '../../components/common/StatusPill';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import { apiService } from '../../services/api';
import { InspectionRecord } from '../../types';
import { generateInspectionPDF } from '../../utils/pdfGenerator';
import { formatDate } from '../../utils/formatters';

export const InspectionDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [record, setRecord] = useState<InspectionRecord | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (id) {
      loadDetails(id);
    }
  }, [id]);

  const loadDetails = async (recordId: string) => {
    setIsLoading(true);
    try {
      const data = await apiService.getInspectionById(recordId);
      setRecord(data);
    } catch (err) {
      console.error('Failed to get inspection detail', err);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return <LoadingSpinner fullScreen message="Loading inspection dossier..." />;
  }

  if (!record) {
    return (
      <div className="text-center py-12">
        <p className="text-[#4A534B] dark:text-[#D4D0C5]">Inspection record not found.</p>
        <Button className="mt-4" onClick={() => navigate('/audit-history')}>
          Return to Audit History
        </Button>
      </div>
    );
  }

  const ext = record.extractedData;

  return (
    <div className="space-y-6">
      {/* Header with back button */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/audit-history')}
            className="p-2 rounded-lg hover:bg-[#E8E1D2]/50 dark:hover:bg-[#343D37] text-[#4A534B] dark:text-[#D4D0C5] transition-colors cursor-pointer"
            aria-label="Back to History"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg sm:text-xl font-bold text-[#303530] dark:text-[#F5F3EA]">
                Dossier {record.id}
              </h2>
              <StatusPill status={record.status} size="sm" />
            </div>
            <p className="text-xs text-[#4A534B] dark:text-[#D4D0C5]">
              Conducted on {formatDate(record.inspectionDate)} at {record.timestamp} by{' '}
              {record.inspectorName}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            id="btn-export-pdf-dossier"
            variant="primary"
            size="sm"
            onClick={() => generateInspectionPDF(record)}
            leftIcon={<Download className="w-4 h-4" />}
          >
            Download PDF Memo
          </Button>
        </div>
      </div>

      {/* Main Grid: Package Photo & Declarations */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Package Image & Score */}
        <div className="lg:col-span-4 space-y-4">
          <Card>
            <CardHeader className="py-3">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-[#4A534B] dark:text-[#D4D0C5]">
                Principal Display Evidence
              </h3>
            </CardHeader>
            <CardBody className="p-4 space-y-4">
              <div className="aspect-4/3 rounded-xl overflow-hidden bg-[#FAF9F5] dark:bg-[#202622] border border-[#E8E1D2] dark:border-[#3F4A43]">
                <img
                  src={record.packageImage}
                  alt="Packaged Commodity"
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>

              {/* Score & Verdict Card */}
              <div className="p-4 rounded-xl bg-[#FAF9F5] dark:bg-[#202622] border border-[#E8E1D2] dark:border-[#3F4A43] text-center space-y-1.5">
                <p className="text-xs text-[#4A534B] dark:text-[#D4D0C5] uppercase tracking-wider font-semibold">
                  Compliance Rating
                </p>
                <div className="text-3xl font-bold text-[#426B5A] dark:text-[#8FAF9A]">
                  {record.overallScore}%
                </div>
                <p className="text-xs font-semibold text-[#303530] dark:text-[#F5F3EA]">
                  Action Taken: <span className="text-[#426B5A] dark:text-[#8FAF9A]">{record.actionTaken}</span>
                </p>
                {record.noticeNumber && (
                  <p className="text-[11px] font-mono text-[#6B4E23] dark:text-[#E8D5B0]">
                    Ref: {record.noticeNumber}
                  </p>
                )}
              </div>

              {/* Store & Establishment Details */}
              <div className="text-xs space-y-2 text-[#4A534B] dark:text-[#D4D0C5] pt-2 border-t border-[#E8E1D2] dark:border-[#3F4A43]">
                <div className="flex items-start gap-2">
                  <Store className="w-3.5 h-3.5 shrink-0 text-[#426B5A] dark:text-[#8FAF9A] mt-0.5" />
                  <div>
                    <strong className="text-[#303530] dark:text-[#F5F3EA]">{record.storeName}</strong>
                    <p className="text-[11px] text-[#565E57] dark:text-[#B0ACA0]">{record.storeAddress}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="w-3.5 h-3.5 text-[#426B5A] dark:text-[#8FAF9A]" />
                  <span>
                    {record.district}, {record.state}
                  </span>
                </div>
              </div>
            </CardBody>
          </Card>
        </div>

        {/* Right: Detailed Rule Results & Declarations */}
        <div className="lg:col-span-8 space-y-4">
          <Card>
            <CardHeader className="py-3">
              <h3 className="text-sm font-semibold text-[#303530] dark:text-[#F5F3EA]">
                Statutory Rule-by-Rule Audit Findings
              </h3>
            </CardHeader>
            <CardBody className="p-0">
              <div className="divide-y divide-[#E8E1D2] dark:divide-[#3F4A43]">
                {record.ruleResults.map((rule) => {
                  const isPass = rule.status === 'compliant';
                  const isPartial = rule.status === 'partial';

                  return (
                    <div key={rule.ruleId} className="p-4 space-y-1 text-xs">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          {isPass ? (
                            <CheckCircle2 className="w-4 h-4 text-[#426B5A] dark:text-[#8FAF9A] shrink-0" />
                          ) : isPartial ? (
                            <AlertTriangle className="w-4 h-4 text-[#8A6730] dark:text-[#D8C79B] shrink-0" />
                          ) : (
                            <AlertTriangle className="w-4 h-4 text-[#6B4E23] dark:text-[#E8D5B0] shrink-0" />
                          )}
                          <span className="font-semibold text-[#303530] dark:text-[#F5F3EA]">
                            {rule.clauseNumber}: {rule.ruleTitle}
                          </span>
                        </div>
                        <StatusPill status={rule.status} size="sm" />
                      </div>
                      <p className="text-[#4A534B] dark:text-[#D4D0C5] pl-6 leading-relaxed">
                        {rule.findingNote}
                      </p>
                      <div className="pl-6 flex items-center gap-2 text-[11px] text-[#565E57] dark:text-[#B0ACA0] font-mono">
                        <span>Expected: {rule.expectedValue}</span>
                        <span>&bull;</span>
                        <span>Observed: {rule.detectedValue}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardBody>
          </Card>

          {/* Extracted Specifications Grid */}
          <Card>
            <CardHeader className="py-3">
              <h3 className="text-sm font-semibold text-[#303530] dark:text-[#F5F3EA]">
                Technical Declarations Ledger
              </h3>
            </CardHeader>
            <CardBody className="p-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <span className="text-[#4A534B] dark:text-[#D4D0C5] block text-[11px]">Commodity & Brand</span>
                  <span className="font-semibold text-[#303530] dark:text-[#F5F3EA]">
                    {ext.commodityName} ({ext.brandName})
                  </span>
                </div>
                <div>
                  <span className="text-[#4A534B] dark:text-[#D4D0C5] block text-[11px]">Net Quantity & Symbol</span>
                  <span className="font-semibold text-[#303530] dark:text-[#F5F3EA]">
                    {ext.netQuantity.declared}{' '}
                    {ext.netQuantity.unitStandardized ? '(Valid SI Unit)' : '(Non-Standard Symbol)'}
                  </span>
                </div>
                <div>
                  <span className="text-[#4A534B] dark:text-[#D4D0C5] block text-[11px]">Retail Price & Taxes</span>
                  <span className="font-semibold text-[#303530] dark:text-[#F5F3EA]">
                    {ext.mrp.declared}
                  </span>
                </div>
                <div>
                  <span className="text-[#4A534B] dark:text-[#D4D0C5] block text-[11px]">Unit Sale Price (USP)</span>
                  <span className="font-semibold text-[#303530] dark:text-[#F5F3EA]">
                    {ext.unitSalePrice.declared || 'Missing on Package'}
                  </span>
                </div>
                <div>
                  <span className="text-[#4A534B] dark:text-[#D4D0C5] block text-[11px]">Manufacturer Postal Address</span>
                  <span className="font-semibold text-[#303530] dark:text-[#F5F3EA]">
                    {ext.manufacturerDetails.name} — {ext.manufacturerDetails.address}
                  </span>
                </div>
                <div>
                  <span className="text-[#4A534B] dark:text-[#D4D0C5] block text-[11px]">Consumer Grievance Contact</span>
                  <span className="font-semibold text-[#303530] dark:text-[#F5F3EA]">
                    Tel: {ext.consumerCareDetails.phone} | Email: {ext.consumerCareDetails.email}
                  </span>
                </div>
              </div>
            </CardBody>
          </Card>
        </div>
      </div>
    </div>
  );
};
