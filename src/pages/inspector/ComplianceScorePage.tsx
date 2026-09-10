import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Award,
  ShieldCheck,
  AlertTriangle,
  AlertOctagon,
  CheckCircle2,
  FileText,
  ArrowRight,
  BookOpen,
  Share2,
  Download,
  RotateCcw,
  Sparkles,
  HelpCircle,
  ChevronRight,
  Filter
} from 'lucide-react';
import { useInspection } from '../../context/InspectionContext';
import { Card, CardHeader, CardTitle, CardBody } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { StatusPill } from '../../components/common/StatusPill';
import { StandardRegulatoryStatus } from '../../types';

export const ComplianceScorePage: React.FC = () => {
  const navigate = useNavigate();
  const {
    activeRecord,
    extractedData,
    displayImage,
    resetWorkflow
  } = useInspection();

  const [ruleFilter, setRuleFilter] = useState<'ALL' | 'COMPLIANT' | 'POTENTIAL NON-COMPLIANCE' | 'REQUIRES OFFICER REVIEW'>('ALL');

  if (!activeRecord) {
    return (
      <div className="py-20 text-center space-y-4">
        <p className="text-sm text-slate-500">No active inspection record available.</p>
        <Button onClick={() => navigate('/live-package-scanner')}>
          Initiate New Scan
        </Button>
      </div>
    );
  }

  const score = activeRecord.overallScore;

  // Map internal status to exact required regulatory statuses:
  // 'COMPLIANT' | 'POTENTIAL NON-COMPLIANCE' | 'REQUIRES OFFICER REVIEW'
  let overallStatus: StandardRegulatoryStatus = 'REQUIRES OFFICER REVIEW';
  if (score >= 90) {
    overallStatus = 'COMPLIANT';
  } else if (score < 70) {
    overallStatus = 'POTENTIAL NON-COMPLIANCE';
  } else {
    overallStatus = 'REQUIRES OFFICER REVIEW';
  }

  // Calculate rule status counts based on the exact 3 statuses
  const ruleResultsWithStandardStatus = activeRecord.ruleResults.map((r) => {
    let standardRuleStatus: StandardRegulatoryStatus = 'COMPLIANT';
    if (r.status === 'compliant') {
      standardRuleStatus = 'COMPLIANT';
    } else if (r.status === 'non-compliant') {
      standardRuleStatus = 'POTENTIAL NON-COMPLIANCE';
    } else {
      standardRuleStatus = 'REQUIRES OFFICER REVIEW';
    }
    return {
      ...r,
      standardRuleStatus,
    };
  });

  const compliantCount = ruleResultsWithStandardStatus.filter((r) => r.standardRuleStatus === 'COMPLIANT').length;
  const potentialNonComplianceCount = ruleResultsWithStandardStatus.filter((r) => r.standardRuleStatus === 'POTENTIAL NON-COMPLIANCE').length;
  const requiresReviewCount = ruleResultsWithStandardStatus.filter((r) => r.standardRuleStatus === 'REQUIRES OFFICER REVIEW').length;

  const filteredRules = ruleResultsWithStandardStatus.filter((r) => {
    if (ruleFilter === 'ALL') return true;
    return r.standardRuleStatus === ruleFilter;
  });

  return (
    <div className="space-y-6 pb-24 max-w-4xl mx-auto">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#E8E1D2] dark:border-[#3A443E] pb-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#D5E2D9] text-[#2C493D] dark:bg-[#426B5A]/40 dark:text-[#D5E2D9] text-xs font-semibold mb-1">
            <Award className="w-3.5 h-3.5" />
            <span>STEP 4 OF 5 — STATUTORY SCORING & RULE EVALUATION</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-[#303530] dark:text-[#F5F3EA]">
            Statutory Compliance Score & Findings
          </h1>
          <p className="text-xs text-[#565D57] dark:text-[#D2CDC0] mt-0.5">
            Legal Metrology (Packaged Commodities) Rules, 2011 &bull; Dossier ID: <span className="font-mono font-bold text-[#426B5A] dark:text-[#8FAF9A]">{activeRecord.id}</span>
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              resetWorkflow();
              navigate('/live-package-scanner');
            }}
            className="border-[#8FAF9A]/60 text-[#2C493D] dark:text-[#D5E2D9] text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>New Scan</span>
          </Button>

          <Button
            id="btn-goto-dossier"
            onClick={() => navigate('/compliance-reports')}
            className="bg-[#426B5A] hover:bg-[#2C493D] text-white text-xs font-bold px-4 py-2 flex items-center gap-1.5 shadow-xs cursor-pointer"
          >
            <span>[ FORM III DOSSIER ]</span>
            <ArrowRight className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Main Score Hero Card */}
      <Card className="border-[#E8E1D2] dark:border-[#3A443E] shadow-sm overflow-hidden bg-white dark:bg-[#2B332E]">
        <div className="bg-[#FAF9F5] dark:bg-[#202622] p-6 text-[#303530] dark:text-[#FAF9F5] border-b border-[#E8E1D2] dark:border-[#343D37]">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-2">
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#426B5A] dark:text-[#D5E2D9]">
                Legal Metrology PCR 2011 Overall Evaluation
              </span>
              <div className="flex items-baseline gap-3">
                <span className="text-5xl sm:text-6xl font-black tracking-tight text-[#426B5A] dark:text-[#FAF9F5]">
                  {score}%
                </span>
                <span className="text-sm font-semibold text-[#5C6B61] dark:text-[#D5E2D9]">
                  / 100 Maximum Statutory Rating
                </span>
              </div>
              <div className="pt-1.5 flex items-center gap-2 flex-wrap">
                <span className="text-xs font-bold uppercase text-[#5C6B61] dark:text-[#D5E2D9]">Overall Status:</span>
                <span
                  className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold tracking-wide uppercase ${
                    overallStatus === 'COMPLIANT'
                      ? 'bg-[#EAF2ED] text-[#2C493D] border border-[#8FAF9A]/60 dark:bg-[#2B473A] dark:text-[#C4E2D0]'
                      : overallStatus === 'POTENTIAL NON-COMPLIANCE'
                      ? 'bg-[#F6F0E4] text-[#6B4E23] border border-[#D8C79B]/60 dark:bg-[#48371F] dark:text-[#E8D5B0]'
                      : 'bg-[#F2EFE9] text-[#4D534E] border border-[#D2CBC0]/60 dark:bg-[#343D37] dark:text-[#DCD7CC]'
                  }`}
                >
                  <span
                    className={`w-2 h-2 rounded-full ${
                      overallStatus === 'COMPLIANT'
                        ? 'bg-[#8FAF9A]'
                        : overallStatus === 'POTENTIAL NON-COMPLIANCE'
                        ? 'bg-[#D8C79B]'
                        : 'bg-[#B0ACA0]'
                    }`}
                  />
                  {overallStatus}
                </span>
              </div>
            </div>

            {/* Specimen Evidence Thumbnail */}
            <div className="flex items-center gap-3 p-3 rounded-xl bg-black/25 backdrop-blur-xs border border-white/10 shrink-0">
              <img
                src={displayImage}
                alt="Specimen thumbnail"
                className="w-16 h-16 rounded-lg object-cover border border-white/20"
              />
              <div className="text-xs space-y-0.5">
                <p className="font-bold text-[#FAF9F5] truncate max-w-[180px]">
                  {extractedData.commodityName}
                </p>
                <p className="text-[11px] text-[#D5E2D9] truncate max-w-[180px]">
                  {extractedData.brandName}
                </p>
                <span className="text-[10px] text-white/70 block">
                  Sec. 65B Certified Unmodified
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* 3 Exact Status Count Metrics Strip */}
        <CardBody className="p-4 sm:p-5 bg-white dark:bg-[#2B332E] grid grid-cols-1 sm:grid-cols-3 gap-3">
          {/* Compliant Count */}
          <div className="p-3.5 rounded-xl bg-[#EAF2ED] dark:bg-[#23352B] border border-[#8FAF9A]/50 dark:border-[#4A6E59] text-left">
            <div className="flex items-center justify-between">
              <span className="text-[11px] uppercase font-bold text-[#2C493D] dark:text-[#C4E2D0]">
                Compliant Count
              </span>
              <CheckCircle2 className="w-4 h-4 text-[#426B5A] dark:text-[#6F9B84]" />
            </div>
            <div className="mt-1 flex items-baseline gap-2">
              <span className="text-2xl font-black text-[#2C493D] dark:text-[#C4E2D0]">
                {compliantCount}
              </span>
              <span className="text-xs font-medium text-[#4A534B] dark:text-[#D4D0C5]">
                of {ruleResultsWithStandardStatus.length} rules
              </span>
            </div>
          </div>

          {/* Potential Non-Compliance Count - Muted Wheat / Earthy Brown */}
          <div className="p-3.5 rounded-xl bg-[#F6F0E4] dark:bg-[#3B3426] border border-[#D8C79B] dark:border-[#8E7C4F] text-left">
            <div className="flex items-center justify-between">
              <span className="text-[11px] uppercase font-bold text-[#6B4E23] dark:text-[#E8D5B0]">
                Potential Non-Compliance
              </span>
              <AlertOctagon className="w-4 h-4 text-[#8A6730] dark:text-[#D8C79B]" />
            </div>
            <div className="mt-1 flex items-baseline gap-2">
              <span className="text-2xl font-black text-[#6B4E23] dark:text-[#E8D5B0]">
                {potentialNonComplianceCount}
              </span>
              <span className="text-xs font-medium text-[#4A534B] dark:text-[#D4D0C5]">
                statutory infractions
              </span>
            </div>
          </div>

          {/* Requires Officer Review Count - Muted Neutral / Wheat */}
          <div className="p-3.5 rounded-xl bg-[#F2EFE9] dark:bg-[#323834] border border-[#D2CBC0] dark:border-[#545D56] text-left">
            <div className="flex items-center justify-between">
              <span className="text-[11px] uppercase font-bold text-[#4D534E] dark:text-[#DCD7CC]">
                Requires Officer Review
              </span>
              <AlertTriangle className="w-4 h-4 text-[#707A72] dark:text-[#9FAAA1]" />
            </div>
            <div className="mt-1 flex items-baseline gap-2">
              <span className="text-2xl font-black text-[#4D534E] dark:text-[#DCD7CC]">
                {requiresReviewCount}
              </span>
              <span className="text-xs font-medium text-[#4A534B] dark:text-[#D4D0C5]">
                pending physical audit
              </span>
            </div>
          </div>
        </CardBody>
      </Card>

      {/* RULE RESULTS SECTION */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-[#426B5A] dark:text-[#8FAF9A]" />
            <h2 className="text-sm font-bold uppercase tracking-wider text-[#303530] dark:text-[#F5F3EA]">
              Rule Results & Statutory Findings (PCR 2011)
            </h2>
          </div>

          {/* Filter Chips */}
          <div className="flex items-center gap-1.5 flex-wrap">
            {(['ALL', 'COMPLIANT', 'POTENTIAL NON-COMPLIANCE', 'REQUIRES OFFICER REVIEW'] as const).map((filterOpt) => (
              <button
                key={filterOpt}
                type="button"
                onClick={() => setRuleFilter(filterOpt)}
                className={`px-3 py-1 rounded-full text-xs font-semibold transition cursor-pointer ${
                  ruleFilter === filterOpt
                    ? 'bg-[#EEF3EF] text-[#426B5A] border border-[#8FAF9A]/60 font-bold dark:bg-[#23352B] dark:text-[#8FAF9A] dark:border-[#4A6E59]'
                    : 'bg-white dark:bg-[#202622] text-[#66706A] dark:text-[#D4D0C5] border border-[#E8E1D2] dark:border-[#3F4A43] hover:text-[#303530] hover:bg-[#FAF9F5]'
                }`}
              >
                {filterOpt === 'POTENTIAL NON-COMPLIANCE' ? 'Non-Compliance' : filterOpt === 'REQUIRES OFFICER REVIEW' ? 'Needs Review' : filterOpt}
              </button>
            ))}
          </div>
        </div>

        {/* Rule Results Cards */}
        <div className="space-y-3">
          {filteredRules.map((rule) => {
            const isCompliant = rule.standardRuleStatus === 'COMPLIANT';
            const isViolation = rule.standardRuleStatus === 'POTENTIAL NON-COMPLIANCE';
            const isReview = rule.standardRuleStatus === 'REQUIRES OFFICER REVIEW';

            return (
              <Card
                key={rule.ruleId}
                className={`border transition hover:shadow-sm cursor-pointer ${
                  isCompliant
                    ? 'border-[#8FAF9A]/50 bg-[#FAF9F5] dark:bg-[#2B332E]'
                    : isViolation
                    ? 'border-[#D8C79B] dark:border-[#8E7C4F] bg-[#F6F0E4]/40 dark:bg-[#3B3426]/60'
                    : 'border-[#D2CBC0] dark:border-[#545D56] bg-[#F2EFE9]/40 dark:bg-[#323834]/60'
                }`}
                onClick={() => navigate(`/statutory-rule-detail/${rule.ruleId}`)}
              >
                <CardBody className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="space-y-2 min-w-0 flex-1">
                    <div className="flex items-center gap-2.5 flex-wrap">
                      <span className="font-mono text-xs font-bold px-2.5 py-0.5 rounded bg-[#FAF9F5] dark:bg-[#202622] border border-[#E8E1D2] dark:border-[#3F4A43] text-[#426B5A] dark:text-[#8FAF9A]">
                        {rule.clauseNumber}
                      </span>
                      <h3 className="text-sm font-bold text-[#303530] dark:text-[#F5F3EA]">
                        {rule.ruleTitle}
                      </h3>
                      <StatusPill status={rule.standardRuleStatus} size="sm" />
                    </div>

                    <p className="text-xs text-[#4A534B] dark:text-[#D4D0C5] leading-relaxed">
                      {rule.findingNote}
                    </p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs pt-1">
                      <div className="p-2.5 rounded-lg bg-white dark:bg-[#202622] border border-[#E8E1D2] dark:border-[#3F4A43]">
                        <span className="text-[10px] font-bold text-[#4A534B] dark:text-[#D4D0C5] uppercase block">Detected Finding</span>
                        <span className="font-mono text-xs font-semibold text-[#303530] dark:text-[#F5F3EA]">{rule.detectedValue || 'Not detected'}</span>
                      </div>
                      <div className="p-2.5 rounded-lg bg-white dark:bg-[#202622] border border-[#E8E1D2] dark:border-[#3F4A43]">
                        <span className="text-[10px] font-bold text-[#4A534B] dark:text-[#D4D0C5] uppercase block">Statutory Mandate</span>
                        <span className="text-xs text-[#303530] dark:text-[#F5F3EA]">{rule.expectedValue}</span>
                      </div>
                    </div>
                  </div>

                  <div className="shrink-0 self-end sm:self-center">
                    <Button
                      variant="secondary"
                      size="sm"
                      className="text-xs font-semibold flex items-center gap-1 cursor-pointer"
                    >
                      <span>Rule Details</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </Button>
                  </div>
                </CardBody>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Two Primary Action Paths */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
        <Button
          id="btn-trigger-clause-audit"
          variant="outline"
          onClick={() => navigate('/statutory-rule-detail')}
          className="border-[#426B5A] text-[#2C493D] dark:text-[#D5E2D9] hover:bg-[#D5E2D9]/20 font-bold py-3.5 text-xs flex items-center justify-center gap-2 cursor-pointer"
        >
          <BookOpen className="w-4 h-4 text-[#426B5A]" />
          <span>[ DETAILED STATUTORY CLAUSE AUDIT ]</span>
        </Button>

        <Button
          id="btn-trigger-compliance-reports"
          onClick={() => navigate('/compliance-reports')}
          className="bg-[#426B5A] hover:bg-[#2C493D] text-white font-bold py-3.5 text-xs shadow-md flex items-center justify-center gap-2 cursor-pointer"
        >
          <FileText className="w-4 h-4" />
          <span>[ FORM III DOSSIER & DISPATCH NOTICE ]</span>
        </Button>
      </div>
    </div>
  );
};

