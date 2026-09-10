import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  BookOpen,
  Scale,
  ShieldAlert,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  ArrowLeft,
  FileText,
  HelpCircle,
  ExternalLink,
  ChevronRight,
  Edit3,
  Save,
  Camera
} from 'lucide-react';
import { useInspection } from '../../context/InspectionContext';
import { RULEBOOK_CLAUSES } from '../../data/mockData';
import { Card, CardHeader, CardTitle, CardBody } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { StatusPill } from '../../components/common/StatusPill';
import { StandardRegulatoryStatus } from '../../types';

export const StatutoryRuleDetailPage: React.FC = () => {
  const { ruleId } = useParams<{ ruleId?: string }>();
  const navigate = useNavigate();
  const { activeRecord, displayImage, officerNotes, setOfficerNotes } = useInspection();

  const rules = activeRecord?.ruleResults || [];
  const defaultRuleId = ruleId || rules[0]?.ruleId || 'LM-R6-1E';
  const [selectedRuleId, setSelectedRuleId] = useState(defaultRuleId);

  // Local state for specific rule officer notes
  const [ruleNotesMap, setRuleNotesMap] = useState<Record<string, string>>({
    'LM-R6-1A': 'Manufacturer address verified against RoC directory. Entity is registered.',
    'LM-R6-1C': 'Unit non-compliance noted. "gms" is prohibited; only "g" permitted under Seventh Schedule.',
    'LM-R6-1E': 'Retail sale price declaration does not include mandatory text "inclusive of all taxes".',
    'LM-R9-FONT': 'Numeral height measured at 3.2mm on PDP of 180 sq cm; requires minimum 4.0mm.',
  });
  const [activeNoteText, setActiveNoteText] = useState('');
  const [isSavedNotice, setIsSavedNotice] = useState(false);

  useEffect(() => {
    if (ruleId) {
      setSelectedRuleId(ruleId);
    }
  }, [ruleId]);

  useEffect(() => {
    setActiveNoteText(ruleNotesMap[selectedRuleId] || '');
  }, [selectedRuleId, ruleNotesMap]);

  const handleSaveNote = () => {
    setRuleNotesMap((prev) => ({
      ...prev,
      [selectedRuleId]: activeNoteText,
    }));
    setIsSavedNotice(true);
    setTimeout(() => setIsSavedNotice(false), 2000);
  };

  const currentResult = rules.find((r) => r.ruleId === selectedRuleId) || rules[0];
  const statutoryReference = RULEBOOK_CLAUSES.find((c) =>
    c.clauseNumber.toLowerCase().includes(currentResult?.clauseNumber.toLowerCase().slice(0, 8) || '')
  ) || RULEBOOK_CLAUSES[0];

  // Derive exact regulatory status: 'COMPLIANT' | 'POTENTIAL NON-COMPLIANCE' | 'REQUIRES OFFICER REVIEW'
  let ruleRegulatoryStatus: StandardRegulatoryStatus = 'REQUIRES OFFICER REVIEW';
  if (currentResult?.status === 'compliant') {
    ruleRegulatoryStatus = 'COMPLIANT';
  } else if (currentResult?.status === 'non-compliant') {
    ruleRegulatoryStatus = 'POTENTIAL NON-COMPLIANCE';
  } else {
    ruleRegulatoryStatus = 'REQUIRES OFFICER REVIEW';
  }

  return (
    <div className="space-y-6 pb-24 max-w-4xl mx-auto">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#E8E1D2] dark:border-[#3A443E] pb-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#D5E2D9] text-[#2C493D] dark:bg-[#426B5A]/40 dark:text-[#D5E2D9] text-xs font-semibold mb-1">
            <BookOpen className="w-3.5 h-3.5" />
            <span>STATUTORY CLAUSE AUDIT MATRIX</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-[#303530] dark:text-[#F5F3EA]">
            Statutory Rule Detail & Legal Citations
          </h1>
          <p className="text-xs text-[#565D57] dark:text-[#D2CDC0] mt-0.5">
            Legal Metrology (Packaged Commodities) Rules, 2011 &bull; Technical & Legal Findings
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate('/compliance-score')}
            className="border-[#8FAF9A]/60 text-[#2C493D] dark:text-[#D5E2D9] text-xs flex items-center gap-1.5 cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Score</span>
          </Button>

          <Button
            onClick={() => navigate('/compliance-reports')}
            className="bg-[#426B5A] hover:bg-[#2C493D] text-white text-xs font-bold px-4 py-2 flex items-center gap-1.5 shadow-xs cursor-pointer"
          >
            <span>[ FORM III DOSSIER ]</span>
            <ArrowRight className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Horizontal Clause Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-[#E8E1D2] dark:border-[#3A443E]">
        {rules.map((r) => {
          const isSelected = r.ruleId === selectedRuleId;
          const isCompliant = r.status === 'compliant';
          return (
            <button
              key={r.ruleId}
              onClick={() => setSelectedRuleId(r.ruleId)}
              className={`px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition cursor-pointer flex items-center gap-2 ${
                isSelected
                  ? 'bg-[#EEF3EF] text-[#426B5A] border border-[#8FAF9A]/60 font-bold dark:bg-[#23352B] dark:text-[#8FAF9A] dark:border-[#4A6E59]'
                  : 'bg-white dark:bg-[#2B332E] border border-[#E8E1D2] dark:border-[#3A443E] text-[#66706A] dark:text-[#D4D0C5] hover:bg-[#FAF9F5] hover:text-[#303530]'
              }`}
            >
              <span
                className={`w-2 h-2 rounded-full ${
                  isCompliant ? 'bg-[#8FAF9A]' : 'bg-[#D8C79B]'
                }`}
              />
              <span>{r.clauseNumber}</span>
            </button>
          );
        })}
      </div>

      {currentResult && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
          {/* Main Clause Evaluation Card (Col 8) */}
          <div className="lg:col-span-8 space-y-4">
            <Card className="border-[#E8E1D2] dark:border-[#3A443E] shadow-sm overflow-hidden bg-white dark:bg-[#2B332E]">
              <CardHeader className="py-4 px-5 bg-[#FAF9F5] dark:bg-[#202622] border-b border-[#E8E1D2] dark:border-[#3A443E] flex items-center justify-between">
                <div>
                  <span className="font-mono text-xs font-bold px-2.5 py-0.5 rounded bg-[#D5E2D9] text-[#2C493D] dark:bg-[#343D37] dark:text-[#6F9B84]">
                    RULE NUMBER: {currentResult.clauseNumber}
                  </span>
                  <CardTitle className="text-base font-bold text-[#303530] dark:text-[#F5F3EA] mt-1.5">
                    {currentResult.ruleTitle}
                  </CardTitle>
                </div>

                <StatusPill status={ruleRegulatoryStatus} size="md" />
              </CardHeader>

              <CardBody className="p-5 space-y-4 text-xs">
                {/* Expected Requirement vs Extracted Value Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="p-3.5 rounded-xl bg-[#FAF9F5] dark:bg-[#202622] border border-[#E8E1D2] dark:border-[#3A443E]">
                    <span className="text-[10px] uppercase font-bold text-[#4A534B] dark:text-[#D4D0C5] block mb-1">
                      Expected Requirement (Legal Mandate)
                    </span>
                    <p className="font-semibold text-[#303530] dark:text-[#F5F3EA] leading-relaxed">
                      {currentResult.expectedValue}
                    </p>
                  </div>

                  <div
                    className={`p-3.5 rounded-xl border ${
                      ruleRegulatoryStatus === 'COMPLIANT'
                        ? 'bg-[#EAF2ED] dark:bg-[#23352B] border-[#8FAF9A]/60 dark:border-[#4A6E59]'
                        : 'bg-[#F6F0E4] dark:bg-[#3B3426] border-[#D8C79B] dark:border-[#8E7C4F]'
                    }`}
                  >
                    <span
                      className={`text-[10px] uppercase font-bold block mb-1 ${
                        ruleRegulatoryStatus === 'COMPLIANT'
                          ? 'text-[#2C493D] dark:text-[#C4E2D0]'
                          : 'text-[#6B4E23] dark:text-[#E8D5B0]'
                      }`}
                    >
                      Extracted Value (Detected On Package)
                    </span>
                    <p
                      className={`font-semibold ${
                        ruleRegulatoryStatus === 'COMPLIANT'
                          ? 'text-[#2C493D] dark:text-[#C4E2D0]'
                          : 'text-[#6B4E23] dark:text-[#E8D5B0]'
                      }`}
                    >
                      {currentResult.detectedValue || 'Declaration absent on visible panel'}
                    </p>
                  </div>
                </div>

                {/* Finding & Observation Note */}
                <div className="p-3.5 rounded-xl bg-[#EAF2ED]/60 dark:bg-[#23352B]/60 border border-[#8FAF9A]/50 space-y-1">
                  <span className="text-[10px] font-mono font-bold text-[#426B5A] dark:text-[#6F9B84] uppercase tracking-wider">
                    Statutory Analysis & Verification
                  </span>
                  <p className="text-xs text-[#2C493D] dark:text-[#C4E2D0] font-medium leading-relaxed">
                    {currentResult.findingNote}
                  </p>
                </div>

                {/* Legal Requirement (Verbatim Statutory Text) */}
                <div className="space-y-1.5 pt-2 border-t border-[#E8E1D2] dark:border-[#3A443E]">
                  <span className="text-xs font-bold uppercase tracking-wider text-[#4A534B] dark:text-[#D4D0C5]">
                    Legal Requirement (PCR 2011 Provision)
                  </span>
                  <div className="p-3 rounded-lg bg-[#FAF9F5] dark:bg-[#202622] border border-[#E8E1D2] dark:border-[#3A443E] font-serif text-[#303530] dark:text-[#F5F3EA] text-xs leading-relaxed italic">
                    "{statutoryReference.description}"
                  </div>
                </div>

                {/* Officer Notes Section */}
                <div className="space-y-2 pt-2 border-t border-[#E8E1D2] dark:border-[#3A443E]">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold uppercase tracking-wider text-[#303530] dark:text-[#F5F3EA] flex items-center gap-1.5">
                      <Edit3 className="w-3.5 h-3.5 text-[#426B5A] dark:text-[#6F9B84]" />
                      <span>Officer On-Site Notes for {currentResult.clauseNumber}</span>
                    </label>
                    {isSavedNotice && (
                      <span className="text-[11px] font-bold text-[#2C493D] dark:text-[#C4E2D0] flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#426B5A]" /> Note Recorded
                      </span>
                    )}
                  </div>
                  <textarea
                    rows={3}
                    value={activeNoteText}
                    onChange={(e) => setActiveNoteText(e.target.value)}
                    placeholder="Enter on-site verification notes, physical measurement observations, or trader explanations for this specific clause..."
                    className="w-full p-2.5 rounded-lg border border-[#E8E1D2] dark:border-[#3A443E] bg-white dark:bg-[#202622] text-[#303530] dark:text-[#FAF9F5] text-xs focus:ring-2 focus:ring-[#426B5A] focus:outline-none"
                  />
                  <div className="flex justify-end">
                    <Button
                      size="sm"
                      onClick={handleSaveNote}
                      className="bg-[#426B5A] hover:bg-[#2C493D] text-white font-bold text-xs flex items-center gap-1 cursor-pointer"
                    >
                      <Save className="w-3.5 h-3.5" />
                      <span>Save Officer Note</span>
                    </Button>
                  </div>
                </div>

                {/* Penalty Section - Calm Natural Trust Wheat/Brown styling */}
                <div className="p-3.5 rounded-xl bg-[#F6F0E4] dark:bg-[#3B3426] border border-[#D8C79B] dark:border-[#8E7C4F] flex items-start gap-2.5">
                  <ShieldAlert className="w-4 h-4 text-[#8A6730] dark:text-[#D8C79B] shrink-0 mt-0.5" />
                  <div className="space-y-0.5">
                    <span className="font-bold text-[#6B4E23] dark:text-[#E8D5B0]">
                      Penal Enforcement Authority: {currentResult.applicableLaw}
                    </span>
                    <p className="text-[11px] text-[#544021] dark:text-[#E8D5B0]/90 leading-relaxed">
                      {statutoryReference.penaltySection} &bull; First violation punishable under Section 36 of Legal Metrology Act, 2009 with compounding fine up to ₹25,000; second offense up to ₹50,000; subsequent offenses punishable with fine up to ₹1,00,000 or imprisonment up to 1 year.
                    </p>
                  </div>
                </div>
              </CardBody>
            </Card>
          </div>

          {/* Evidence / Reference Section (Col 4) */}
          <div className="lg:col-span-4 space-y-4">
            {/* Specimen Evidence Card (Unmodified, Section 65B) */}
            <Card className="border-[#E8E1D2] dark:border-[#3A443E] shadow-xs bg-white dark:bg-[#2B332E]">
              <CardHeader className="py-3 px-4 border-b border-[#E8E1D2] dark:border-[#3A443E] bg-[#FAF9F5] dark:bg-[#202622]">
                <CardTitle className="text-xs font-bold uppercase tracking-wider text-[#303530] dark:text-[#F5F3EA] flex items-center gap-1.5">
                  <Camera className="w-3.5 h-3.5 text-[#426B5A] dark:text-[#6F9B84]" />
                  <span>Evidence / Specimen Reference</span>
                </CardTitle>
              </CardHeader>
              <CardBody className="p-4 space-y-3 text-xs">
                <div className="aspect-[4/3] rounded-lg overflow-hidden border border-[#E8E1D2] dark:border-[#3A443E] bg-[#FAF9F5] dark:bg-[#202622] flex items-center justify-center">
                  <img
                    src={displayImage}
                    alt="Evidentiary specimen"
                    className="w-full h-full object-contain"
                  />
                </div>
                <div className="space-y-1 text-[11px] text-[#565D57] dark:text-[#D2CDC0]">
                  <p className="font-bold text-[#2C493D] dark:text-[#6F9B84]">
                    Section 65B Indian Evidence Act Compliant
                  </p>
                  <p className="leading-relaxed">
                    Specimen photo is recorded in unmodified optical format with cryptographic timestamp verification.
                  </p>
                </div>
              </CardBody>
            </Card>

            {/* Schedule Reference */}
            <Card className="border-[#E8E1D2] dark:border-[#3A443E] shadow-xs bg-white dark:bg-[#2B332E]">
              <CardHeader className="py-3 px-4 border-b border-[#E8E1D2] dark:border-[#3A443E] bg-[#FAF9F5] dark:bg-[#202622]">
                <CardTitle className="text-xs font-bold uppercase tracking-wider text-[#303530] dark:text-[#F5F3EA]">
                  Statutory Reference
                </CardTitle>
              </CardHeader>
              <CardBody className="p-4 space-y-3 text-xs">
                <div>
                  <span className="text-[10px] uppercase font-bold text-[#79827B] dark:text-[#9BA39D] block">
                    Rule Group
                  </span>
                  <p className="font-bold text-[#303530] dark:text-[#F5F3EA]">
                    {statutoryReference.category}
                  </p>
                </div>

                <div>
                  <span className="text-[10px] uppercase font-bold text-[#79827B] dark:text-[#9BA39D] block">
                    Applicable Schedule / Table
                  </span>
                  <p className="font-semibold text-[#565D57] dark:text-[#D2CDC0]">
                    {statutoryReference.clauseNumber.includes('9') ? 'Table 1: Minimum Height of Numerals & Letters' : 'Second Schedule: Pre-Packaged Declarations'}
                  </p>
                </div>

                <div className="pt-2 border-t border-[#E8E1D2] dark:border-[#3A443E]">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => navigate('/statutory-rulebook')}
                    className="w-full justify-center border-[#8FAF9A]/60 text-[#2C493D] dark:text-[#D5E2D9] text-xs font-semibold cursor-pointer"
                  >
                    <BookOpen className="w-3.5 h-3.5 mr-1" />
                    <span>Open Statutory Rulebook</span>
                  </Button>
                </div>
              </CardBody>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
};

