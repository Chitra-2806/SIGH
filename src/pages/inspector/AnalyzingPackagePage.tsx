import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Cpu,
  CheckCircle2,
  Loader2,
  ShieldCheck,
  FileSearch,
  ScanLine,
  Scale,
  Sparkles,
  ArrowRight,
  AlertCircle
} from 'lucide-react';
import { useInspection } from '../../context/InspectionContext';
import { Card, CardBody } from '../../components/common/Card';
import { Button } from '../../components/common/Button';

export const AnalyzingPackagePage: React.FC = () => {
  const navigate = useNavigate();
  const {
    displayImage,
    runAnalysisPipeline,
    pipelineStep,
    pipelineStepNames,
    currentStepMessage,
    isAnalyzing
  } = useInspection();

  const [hasStarted, setHasStarted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    const execute = async () => {
      if (hasStarted) return;
      setHasStarted(true);
      try {
        await runAnalysisPipeline();
        if (isMounted) {
          // Pause briefly on step 5 completion before smooth transition
          setTimeout(() => {
            navigate('/extracted-info');
          }, 800);
        }
      } catch (err) {
        if (isMounted) {
          setError('Analysis pipeline encountered a transient validation timeout.');
        }
      }
    };
    execute();
    return () => {
      isMounted = false;
    };
  }, [hasStarted, navigate, runAnalysisPipeline]);

  const stepIcons = [ScanLine, FileSearch, Cpu, Scale, ShieldCheck];

  return (
    <div className="max-w-2xl mx-auto space-y-6 pb-20 pt-4">
      {/* Header Badge */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#D5E2D9] text-[#2C493D] dark:bg-[#426B5A]/40 dark:text-[#D5E2D9] text-xs font-bold">
          <Cpu className="w-4 h-4 animate-spin text-[#426B5A] dark:text-[#8FAF9A]" />
          <span>STEP 2 OF 5 — STATUTORY COMPLIANCE PIPELINE</span>
        </div>
        <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-[#303530] dark:text-white">
          Analyzing Specimen Under PCR 2011
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 max-w-md mx-auto">
          Executing multi-stage character extraction, typography metric evaluation, and Legal Metrology rule synthesis.
        </p>
      </div>

      {/* Main Analysis Card */}
      <Card className="border-[#E8E1D2] dark:border-[#3F4A43] shadow-md overflow-hidden">
        <div className="p-5 sm:p-6 space-y-6">
          {/* Specimen Thumbnail with Evidentiary Integrity Statement */}
          <div className="flex items-center gap-4 p-3 rounded-xl bg-[#FAF9F5] dark:bg-[#202622] border border-[#E8E1D2] dark:border-[#3F4A43]">
            <img
              src={displayImage}
              alt="Inspected Specimen"
              className="w-16 h-16 rounded-lg object-cover border border-[#E8E1D2] dark:border-[#3F4A43] shrink-0"
            />
            <div className="min-w-0 flex-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#426B5A] dark:text-[#8FAF9A]">
                Evidentiary Specimen
              </span>
              <p className="text-xs font-bold text-[#303530] dark:text-white truncate">
                Principal Display Panel (PDP) Capture
              </p>
              <p className="text-[11px] text-[#5C6B61] dark:text-[#B0ACA0] mt-0.5">
                Pristine optical feed &bull; Unmodified pursuant to Sec. 65B Indian Evidence Act
              </p>
            </div>
          </div>

          {/* Current Step Status Callout */}
          <div className="p-4 rounded-xl bg-[#EEF3EF] dark:bg-[#426B5A]/20 border border-[#8FAF9A]/50 text-center space-y-1">
            <span className="text-[11px] font-mono font-bold text-[#426B5A] dark:text-[#8FAF9A] tracking-wider uppercase">
              Pipeline Status
            </span>
            <p className="text-sm font-bold text-[#2C493D] dark:text-[#D5E2D9]">
              {currentStepMessage}
            </p>
          </div>

          {/* 5-Step Progress Indicators */}
          <div className="space-y-3">
            {pipelineStepNames.map((stepName, idx) => {
              const stepNumber = idx + 1;
              const isCompleted = pipelineStep > stepNumber;
              const isCurrent = pipelineStep === stepNumber;
              const Icon = stepIcons[idx] || Cpu;

              return (
                <div
                  key={stepName}
                  className={`flex items-center gap-3.5 p-3 rounded-xl border transition-all ${
                    isCompleted
                      ? 'bg-[#EAF2ED] dark:bg-[#23352B]/60 border-[#8FAF9A]/60 text-[#2C493D] dark:text-[#C4E2D0]'
                      : isCurrent
                      ? 'bg-[#EEF3EF] dark:bg-[#426B5A]/30 border-[#426B5A] text-[#2C493D] dark:text-white shadow-xs'
                      : 'bg-[#FAF9F5] dark:bg-[#202622]/40 border-[#E8E1D2] dark:border-[#3F4A43] text-[#5C6B61] dark:text-[#B0ACA0]'
                  }`}
                >
                  <div
                    className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 font-bold text-xs ${
                      isCompleted
                        ? 'bg-[#426B5A] text-white'
                        : isCurrent
                        ? 'bg-[#426B5A] text-white'
                        : 'bg-[#E8E1D2] dark:bg-[#343D37] text-[#5C6B61] dark:text-[#D4D0C5]'
                    }`}
                  >
                    {isCompleted ? (
                      <CheckCircle2 className="w-4 h-4" />
                    ) : isCurrent ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <span>{stepNumber}</span>
                    )}
                  </div>

                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-bold leading-tight truncate">
                      {stepName}
                    </p>
                    <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">
                      {isCompleted
                        ? 'Completed with high confidence score'
                        : isCurrent
                        ? 'Executing algorithmic pass...'
                        : 'Queued'}
                    </p>
                  </div>

                  <Icon className="w-4 h-4 shrink-0 opacity-70" />
                </div>
              );
            })}
          </div>

          {/* Fallback Action in case user wants to jump directly */}
          {pipelineStep >= 4 && (
            <div className="pt-2 flex justify-end">
              <Button
                id="btn-skip-to-extracted"
                onClick={() => navigate('/extracted-info')}
                className="bg-[#426B5A] hover:bg-[#2C493D] text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer"
              >
                <span>Proceed to Entity Review</span>
                <ArrowRight className="w-4 h-4" />
              </Button>
            </div>
          )}

          {error && (
            <div className="p-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
              <span>{error}</span>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
};
