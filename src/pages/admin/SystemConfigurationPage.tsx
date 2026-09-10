import React, { useState } from 'react';
import {
  Settings,
  Scale,
  Save,
  CheckCircle2,
  AlertTriangle,
  Sliders,
  ShieldCheck,
  RotateCcw
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardBody } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/common/Input';

export const SystemConfigurationPage: React.FC = () => {
  const [uspMandatory, setUspMandatory] = useState(true);
  const [minConfidence, setMinConfidence] = useState('85');
  const [firstOffensePenalty, setFirstOffensePenalty] = useState('25000');
  const [secondOffensePenalty, setSecondOffensePenalty] = useState('50000');
  const [activeGazetteAmendment, setActiveGazetteAmendment] = useState('G.S.R. 779(E) (Effective Dec 2022)');
  const [isSaved, setIsSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  return (
    <div className="space-y-6 pb-20 max-w-5xl mx-auto">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#E8E1D2] dark:border-neutral-800 pb-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#D5E2D9] text-[#2C493D] dark:bg-[#426B5A]/40 dark:text-[#D5E2D9] text-xs font-semibold mb-1">
            <Sliders className="w-3.5 h-3.5" />
            <span>DIRECTORATE APEX POLICY ENGINE</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-[#303530] dark:text-white">
            Statutory Rule Calibration & Policy Thresholds
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Configure legal tolerances, penalty structures under Legal Metrology Act 2009, and OCR calibration settings.
          </p>
        </div>

        {isSaved && (
          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-100 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 text-xs font-bold">
            <CheckCircle2 className="w-4 h-4" />
            <span>Configuration Applied Nationally</span>
          </div>
        )}
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Gazette & Legal Framework */}
        <Card className="border-[#E8E1D2] dark:border-[#3F4A43] shadow-xs">
          <CardHeader className="py-3 px-5 border-b border-[#E8E1D2] dark:border-[#3F4A43] bg-[#FAF9F5] dark:bg-[#202622]">
            <CardTitle className="text-xs font-bold uppercase tracking-wider text-[#303530] dark:text-white flex items-center gap-2">
              <Scale className="w-4 h-4 text-[#426B5A] dark:text-[#8FAF9A]" />
              <span>Gazette Framework & Active PCR 2011 Amendments</span>
            </CardTitle>
          </CardHeader>
          <CardBody className="p-5 space-y-4 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Active Gazette Amendment Notification"
                value={activeGazetteAmendment}
                onChange={(e) => setActiveGazetteAmendment(e.target.value)}
                helperText="Determines statutory clause phrasing in field memos"
              />

              <div>
                <label className="text-xs font-bold text-[#303530] dark:text-[#F5F3EA] block mb-1.5">
                  Unit Sale Price (USP) Enforcement (Rule 6(11))
                </label>
                <div className="flex items-center gap-3 pt-2">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="usp"
                      checked={uspMandatory}
                      onChange={() => setUspMandatory(true)}
                      className="text-[#426B5A] focus:ring-[#426B5A]"
                    />
                    <span className="font-semibold text-[#303530] dark:text-[#F5F3EA]">
                      Mandatory (Dec 2022 Amendment)
                    </span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="usp"
                      checked={!uspMandatory}
                      onChange={() => setUspMandatory(false)}
                      className="text-[#426B5A] focus:ring-[#426B5A]"
                    />
                    <span className="font-semibold text-[#303530] dark:text-[#F5F3EA]">
                      Advisory Only
                    </span>
                  </label>
                </div>
              </div>
            </div>
          </CardBody>
        </Card>

        {/* Penal & Compounding Fee Limits */}
        <Card className="border-[#E8E1D2] dark:border-[#3F4A43] shadow-xs">
          <CardHeader className="py-3 px-5 border-b border-[#E8E1D2] dark:border-[#3F4A43] bg-[#FAF9F5] dark:bg-[#202622]">
            <CardTitle className="text-xs font-bold uppercase tracking-wider text-[#303530] dark:text-white flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-[#426B5A] dark:text-[#8FAF9A]" />
              <span>Section 36(1) Compounding Sanctions (INR ₹)</span>
            </CardTitle>
          </CardHeader>
          <CardBody className="p-5 space-y-4 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="First Offense Compounding Ceiling (₹)"
                type="number"
                value={firstOffensePenalty}
                onChange={(e) => setFirstOffensePenalty(e.target.value)}
                helperText="Statutory maximum under Legal Metrology Act 2009"
              />

              <Input
                label="Second Offense Compounding Ceiling (₹)"
                type="number"
                value={secondOffensePenalty}
                onChange={(e) => setSecondOffensePenalty(e.target.value)}
                helperText="Subsequent offense threshold triggering magistrate trial"
              />
            </div>
          </CardBody>
        </Card>

        {/* Rule 9 Table 1 Minimum Numeral Height Table */}
        <Card className="border-[#E8E1D2] dark:border-[#3F4A43] shadow-xs">
          <CardHeader className="py-3 px-5 border-b border-[#E8E1D2] dark:border-[#3F4A43] bg-[#FAF9F5] dark:bg-[#202622]">
            <CardTitle className="text-xs font-bold uppercase tracking-wider text-[#303530] dark:text-white">
              Rule 9 Table 1 — Minimum Height of Numerals & Letters Matrix
            </CardTitle>
          </CardHeader>
          <CardBody className="p-5 text-xs">
            <div className="overflow-x-auto rounded-xl border border-[#E8E1D2] dark:border-[#3F4A43]">
              <table className="w-full text-left">
                <thead className="bg-[#FAF9F5] dark:bg-[#202622] text-[#5C6B61] dark:text-[#B0ACA0] font-bold border-b border-[#E8E1D2] dark:border-[#3F4A43]">
                  <tr>
                    <th className="py-2.5 px-3">Principal Display Area (A in cm²)</th>
                    <th className="py-2.5 px-3">Minimum Height (Normal)</th>
                    <th className="py-2.5 px-3">Blown / Molded / Perforated</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-neutral-800">
                  <tr>
                    <td className="py-2.5 px-3 font-medium">A ≤ 50 cm²</td>
                    <td className="py-2.5 px-3 font-bold text-[#426B5A]">1.0 mm</td>
                    <td className="py-2.5 px-3">2.0 mm</td>
                  </tr>
                  <tr>
                    <td className="py-2.5 px-3 font-medium">50 cm² &lt; A ≤ 100 cm²</td>
                    <td className="py-2.5 px-3 font-bold text-[#426B5A]">1.5 mm</td>
                    <td className="py-2.5 px-3">3.0 mm</td>
                  </tr>
                  <tr>
                    <td className="py-2.5 px-3 font-medium">100 cm² &lt; A ≤ 500 cm²</td>
                    <td className="py-2.5 px-3 font-bold text-[#426B5A]">2.0 mm</td>
                    <td className="py-2.5 px-3">4.0 mm</td>
                  </tr>
                  <tr>
                    <td className="py-2.5 px-3 font-medium">500 cm² &lt; A ≤ 2500 cm²</td>
                    <td className="py-2.5 px-3 font-bold text-[#426B5A]">4.0 mm</td>
                    <td className="py-2.5 px-3">6.0 mm</td>
                  </tr>
                  <tr>
                    <td className="py-2.5 px-3 font-medium">A &gt; 2500 cm²</td>
                    <td className="py-2.5 px-3 font-bold text-[#426B5A]">6.0 mm</td>
                    <td className="py-2.5 px-3">8.0 mm</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </CardBody>
        </Card>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <Button
            type="submit"
            className="bg-[#426B5A] hover:bg-[#2C493D] text-white font-bold px-6 py-2.5 text-xs shadow-sm flex items-center gap-2 cursor-pointer"
          >
            <Save className="w-4 h-4" />
            <span>Save Configuration & Publish Rules</span>
          </Button>
        </div>
      </form>
    </div>
  );
};
