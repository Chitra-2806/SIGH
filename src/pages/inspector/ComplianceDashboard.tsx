import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Camera,
  ArrowRight,
  BookOpen,
  ChevronRight,
  Sparkles
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useInspection } from '../../context/InspectionContext';
import { apiService } from '../../services/api';
import { InspectionRecord } from '../../types';
import { Card, CardHeader, CardTitle, CardBody } from '../../components/common/Card';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';

export const ComplianceDashboard: React.FC = () => {
  const { user, updateUserStatus } = useAuth();
  const { selectPreset, resetWorkflow } = useInspection();
  const navigate = useNavigate();

  const [inspections, setInspections] = useState<InspectionRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const data = await apiService.getInspectionHistory();
        setInspections(data);
      } catch (err) {
        console.error('Failed to load inspections for dashboard', err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchHistory();
  }, []);

  const handleStartScan = () => {
    resetWorkflow();
    navigate('/live-package-scanner');
  };

  // Calculate monthly quota stats
  const totalAudits = inspections.length || 124;
  const compliantAudits = inspections.length
    ? inspections.filter((i) => i.status === 'COMPLIANT' || i.status === 'Compliant').length
    : 98;
  const violationAudits = inspections.length
    ? inspections.filter(
        (i) =>
          i.status === 'POTENTIAL NON-COMPLIANCE' ||
          i.status === 'Minor Violation' ||
          i.status === 'REQUIRES OFFICER REVIEW' ||
          i.status === 'Major Non-Compliance'
      ).length
    : 18;

  const targetQuota = 12;
  const completedQuota = Math.min(8, targetQuota);

  return (
    <div className="space-y-4 sm:space-y-5 pb-16 max-w-md sm:max-w-xl md:max-w-3xl lg:max-w-4xl mx-auto">
      {/* 1. Officer Profile Card (Light White Card matching Stitch screenshot) */}
      <div className="bg-white dark:bg-[#2B332E] border border-[#E8E1D2] dark:border-[#3F4A43] rounded-3xl p-4 sm:p-5 shadow-xs">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            {/* Officer Portrait */}
            <img
              src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80"
              alt={user?.name || 'Ananya Sharma'}
              className="w-12 h-12 rounded-2xl object-cover border border-[#E8E1D2] dark:border-[#3F4A43] shrink-0"
            />
            <div className="min-w-0">
              <div className="flex items-center gap-1.5">
                <h2 className="text-base sm:text-lg font-bold text-[#303530] dark:text-[#F5F3EA] tracking-tight truncate">
                  {user?.name || 'Ananya Sharma'}
                </h2>
                <span className="w-2 h-2 rounded-full bg-[#426B5A] dark:bg-[#8FAF9A] shrink-0 inline-block" />
              </div>
              <p className="text-xs text-[#66706A] dark:text-[#A0A8A2] font-mono mt-0.5">
                Badge: {user?.badgeNumber || 'LM-NZ-SUP-1024'}
              </p>
            </div>
          </div>

          {/* Interactive ON DUTY Status Pill */}
          <button
            type="button"
            onClick={() => {
              const nextStatus =
                user?.dutyStatus === 'on-duty'
                  ? 'off-duty'
                  : user?.dutyStatus === 'off-duty'
                  ? 'on-leave'
                  : 'on-duty';
              updateUserStatus(nextStatus);
            }}
            title="Click to toggle duty status"
            className="px-3 py-1 rounded-full text-[11px] font-bold tracking-wider bg-[#EEF5F1] text-[#2C493D] dark:bg-[#23352B] dark:text-[#8FAF9A] border border-[#8FAF9A]/40 shrink-0 hover:opacity-90 transition cursor-pointer"
          >
            {user?.dutyStatus === 'off-duty'
              ? 'OFF DUTY'
              : user?.dutyStatus === 'on-leave'
              ? 'ON LEAVE'
              : 'ON DUTY'}
          </button>
        </div>

        {/* Subtitle Row: Zone & Quota */}
        <div className="border-t border-[#E8E1D2]/80 dark:border-[#3F4A43] pt-3 mt-3.5 flex items-center justify-between text-xs text-[#66706A] dark:text-[#D4D0C5]">
          <span>Zone: {user?.zone || 'North Zone HQ (DIV-04)'}</span>
          <span className="font-semibold text-[#303530] dark:text-[#F5F3EA]">
            Quota: {completedQuota} / {targetQuota} Audits
          </span>
        </div>
      </div>

      {/* 2. Statutory Field Scan Card (Forest Teal Hero Card matching Stitch screenshot) */}
      <div className="rounded-3xl bg-[#426B5A] p-5 sm:p-6 text-white relative shadow-sm overflow-hidden">
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-1.5 max-w-sm">
            <span className="text-[11px] uppercase font-bold tracking-wider text-[#A7D4BA] block">
              STATUTORY FIELD SCAN
            </span>
            <h3 className="text-xl sm:text-2xl font-extrabold tracking-tight text-white">
              Audit Package Commodity
            </h3>
            <p className="text-xs sm:text-sm text-[#E2EDE6] leading-relaxed pt-0.5">
              Extract mandatory declarations and run AI verification against Legal Metrology Rules.
            </p>
          </div>

          <div className="w-11 h-11 rounded-2xl bg-white/15 flex items-center justify-center text-white shrink-0 shadow-inner">
            <Camera className="w-5 h-5" />
          </div>
        </div>

        <button
          id="btn-initiate-live-scan"
          type="button"
          onClick={handleStartScan}
          className="mt-5 w-full bg-white text-[#426B5A] hover:bg-[#FAF9F5] font-bold py-3.5 px-6 rounded-2xl shadow-xs flex items-center justify-center gap-2 text-sm transition-all cursor-pointer"
        >
          <span>INITIATE LIVE SCAN</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {/* 3. Statistic Cards (3 in a row, Clean White Cards matching Stitch screenshot) */}
      <div className="grid grid-cols-3 gap-3">
        {/* Total Audits */}
        <div className="bg-white dark:bg-[#2B332E] border border-[#E8E1D2] dark:border-[#3F4A43] rounded-2xl p-3.5 sm:p-4 text-center shadow-xs">
          <span className="text-xs font-semibold text-[#66706A] dark:text-[#A0A8A2] block">
            Total Audits
          </span>
          <span className="text-2xl sm:text-3xl font-extrabold text-[#303530] dark:text-[#F5F3EA] mt-1 block">
            {totalAudits}
          </span>
        </div>

        {/* Compliant */}
        <div className="bg-white dark:bg-[#2B332E] border border-[#E8E1D2] dark:border-[#3F4A43] rounded-2xl p-3.5 sm:p-4 text-center shadow-xs">
          <span className="text-xs font-semibold text-[#66706A] dark:text-[#A0A8A2] block">
            Compliant
          </span>
          <span className="text-2xl sm:text-3xl font-extrabold text-[#2E7D52] dark:text-[#8FAF9A] mt-1 block">
            {compliantAudits}
          </span>
        </div>

        {/* Flagged */}
        <div className="bg-white dark:bg-[#2B332E] border border-[#E8E1D2] dark:border-[#3F4A43] rounded-2xl p-3.5 sm:p-4 text-center shadow-xs">
          <span className="text-xs font-semibold text-[#66706A] dark:text-[#A0A8A2] block">
            Flagged
          </span>
          <span className="text-2xl sm:text-3xl font-extrabold text-[#B07D2B] dark:text-[#D8C79B] mt-1 block">
            {violationAudits}
          </span>
        </div>
      </div>

      {/* 4. Quick Field Benchmark Specimens (Light card for instant testing) */}
      <Card className="border border-[#E8E1D2] dark:border-[#3F4A43] bg-white dark:bg-[#2B332E] rounded-2xl shadow-xs overflow-hidden">
        <CardHeader className="bg-[#FAF9F5] dark:bg-[#202622] border-b border-[#E8E1D2] dark:border-[#3F4A43] py-3 px-4 flex flex-col sm:flex-row sm:items-center justify-between gap-1">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-[#426B5A] dark:text-[#8FAF9A]" />
            <CardTitle className="text-xs font-bold uppercase tracking-wider text-[#303530] dark:text-[#F5F3EA]">
              Statutory Benchmark Specimens
            </CardTitle>
          </div>
          <span className="text-[11px] font-medium text-[#66706A] dark:text-[#A0A8A2]">
            Field presets for PCR 2011 testing
          </span>
        </CardHeader>
        <CardBody className="p-3 sm:p-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
            <button
              onClick={() => {
                selectPreset('sample-1');
                navigate('/live-package-scanner');
              }}
              className="flex items-start gap-2.5 p-3 rounded-xl border border-[#E8E1D2] dark:border-[#434D47] bg-[#FAF9F5] dark:bg-[#262B28] text-left hover:border-[#8FAF9A] transition cursor-pointer"
            >
              <span className="w-7 h-7 rounded-lg bg-[#FAF4E6] text-[#B07D2B] flex items-center justify-center shrink-0 font-bold text-xs">
                1
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-xs font-bold text-[#303530] dark:text-[#F5F3EA] truncate">
                  Cream Crunch Cookies
                </p>
                <p className="text-[10px] text-[#66706A] dark:text-[#A0A8A2] mt-0.5">
                  Missing USP & 'gms' unit
                </p>
              </div>
            </button>

            <button
              onClick={() => {
                selectPreset('sample-2');
                navigate('/live-package-scanner');
              }}
              className="flex items-start gap-2.5 p-3 rounded-xl border border-[#E8E1D2] dark:border-[#434D47] bg-[#FAF9F5] dark:bg-[#262B28] text-left hover:border-[#8FAF9A] transition cursor-pointer"
            >
              <span className="w-7 h-7 rounded-lg bg-[#EEF5F1] text-[#2C493D] flex items-center justify-center shrink-0 font-bold text-xs">
                2
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-xs font-bold text-[#303530] dark:text-[#F5F3EA] truncate">
                  Pure Virgin Olive Oil
                </p>
                <p className="text-[10px] text-[#66706A] dark:text-[#A0A8A2] mt-0.5">
                  100% PCR Compliant
                </p>
              </div>
            </button>

            <button
              onClick={() => {
                selectPreset('sample-3');
                navigate('/live-package-scanner');
              }}
              className="flex items-start gap-2.5 p-3 rounded-xl border border-[#E8E1D2] dark:border-[#434D47] bg-[#FAF9F5] dark:bg-[#262B28] text-left hover:border-[#8FAF9A] transition cursor-pointer"
            >
              <span className="w-7 h-7 rounded-lg bg-[#FAF4E6] text-[#B07D2B] flex items-center justify-center shrink-0 font-bold text-xs">
                3
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-xs font-bold text-[#303530] dark:text-[#F5F3EA] truncate">
                  Bio-Bright Detergent
                </p>
                <p className="text-[10px] text-[#66706A] dark:text-[#A0A8A2] mt-0.5">
                  Missing tax & date
                </p>
              </div>
            </button>
          </div>
        </CardBody>
      </Card>

      {/* 5. Recent Field Inspections (Matching Stitch screenshot) */}
      <div className="space-y-2.5">
        <div className="flex items-center justify-between px-1">
          <h3 className="text-xs font-bold uppercase tracking-wider text-[#66706A] dark:text-[#A0A8A2]">
            RECENT FIELD INSPECTIONS
          </h3>
          <button
            onClick={() => navigate('/audit-history')}
            className="text-xs font-semibold text-[#66706A] hover:text-[#303530] dark:text-[#D4D0C5] cursor-pointer"
          >
            View All
          </button>
        </div>

        {isLoading ? (
          <div className="py-8 flex justify-center">
            <LoadingSpinner size="lg" text="Loading statutory inspections..." />
          </div>
        ) : inspections.length === 0 ? (
          <div className="bg-white dark:bg-[#2B332E] border border-[#E8E1D2] dark:border-[#3F4A43] p-8 text-center rounded-2xl">
            <p className="text-xs text-[#66706A] dark:text-[#D4D0C5]">No inspections logged yet.</p>
          </div>
        ) : (
          <div className="space-y-2.5">
            {inspections.slice(0, 3).map((record) => {
              const isCompliant = record.overallScore >= 85;
              return (
                <div
                  key={record.id}
                  onClick={() => navigate(`/compliance-reports/${record.id}`)}
                  className="bg-white dark:bg-[#2B332E] border border-[#E8E1D2] dark:border-[#3F4A43] rounded-2xl p-3 sm:p-3.5 flex items-center justify-between gap-3 shadow-xs hover:border-[#8FAF9A] transition cursor-pointer"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <img
                      src={record.packageImage}
                      alt={record.extractedData.commodityName}
                      className="w-12 h-12 rounded-xl object-cover border border-[#E8E1D2] dark:border-[#3F4A43] shrink-0"
                    />
                    <div className="min-w-0 space-y-0.5">
                      <p className="text-xs sm:text-sm font-bold text-[#303530] dark:text-[#F5F3EA] truncate">
                        {record.extractedData.commodityName} &bull; {record.extractedData.brandName}
                      </p>
                      <p className="text-[11px] text-[#66706A] dark:text-[#A0A8A2]">
                        {record.inspectionDate} &bull; 14:38 IST
                      </p>
                    </div>
                  </div>

                  {/* Compliance Score Pill */}
                  <div
                    className={`px-2.5 py-1 rounded-full text-xs font-bold font-mono shrink-0 ${
                      isCompliant
                        ? 'bg-[#EEF5F1] text-[#2C493D] dark:bg-[#23352B] dark:text-[#8FAF9A]'
                        : 'bg-[#FAF4E6] text-[#B07D2B] dark:bg-[#342D1E] dark:text-[#D8C79B]'
                    }`}
                  >
                    {record.overallScore}%
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* 6. Packaged Commodities Rulebook (PCR) Card (Matching Stitch screenshot) */}
      <div
        onClick={() => navigate('/statutory-rulebook')}
        className="bg-[#FAF7F0] dark:bg-[#2B332E] border border-[#E8E1D2] dark:border-[#3F4A43] rounded-2xl p-4 flex items-center justify-between shadow-xs hover:border-[#8FAF9A] transition cursor-pointer"
      >
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-10 h-10 rounded-xl bg-[#E8E1D2]/70 dark:bg-[#343D37] flex items-center justify-center text-[#426B5A] dark:text-[#8FAF9A] shrink-0">
            <BookOpen className="w-5 h-5" />
          </div>
          <div className="min-w-0">
            <h4 className="text-xs sm:text-sm font-bold text-[#303530] dark:text-[#F5F3EA] truncate">
              Packaged Commodities Rulebook (PCR)
            </h4>
            <p className="text-[11px] text-[#66706A] dark:text-[#A0A8A2] truncate">
              Quick statutory reference guide & thresholds
            </p>
          </div>
        </div>

        <ChevronRight className="w-4 h-4 text-[#66706A] dark:text-[#D4D0C5] shrink-0 ml-2" />
      </div>
    </div>
  );
};
