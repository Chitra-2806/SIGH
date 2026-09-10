import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  InspectionRecord,
  ExtractedPackageData,
  RuleEvaluationResult,
  StandardRegulatoryStatus
} from '../types';
import { MOCK_PREPACKAGED_SAMPLES, MOCK_INSPECTION_HISTORY } from '../data/mockData';
import { apiService } from '../services/api';
import { useAuth } from './AuthContext';

export interface InspectionContextType {
  // Store & location context
  storeName: string;
  setStoreName: (val: string) => void;
  storeAddress: string;
  setStoreAddress: (val: string) => void;
  city: string;
  setCity: (val: string) => void;
  district: string;
  setDistrict: (val: string) => void;
  state: string;
  setState: (val: string) => void;

  // Specimen package selection & camera
  selectedPresetId: string;
  setSelectedPresetId: (id: string) => void;
  customImageUrl: string | null;
  setCustomImageUrl: (url: string | null) => void;
  uploadedFile: File | null;
  setUploadedFile: (file: File | null) => void;
  displayImage: string;

  // Multi-angle capture slots
  capturedAngles: {
    frontPdp: string | null;
    ingredientsNutrition: string | null;
    mrpPackerLabel: string | null;
  };
  setCapturedAngle: (slot: 'frontPdp' | 'ingredientsNutrition' | 'mrpPackerLabel', url: string | null) => void;

  // 5-step analysis pipeline state
  isAnalyzing: boolean;
  pipelineStep: number; // 0 to 5
  pipelineStepNames: string[];
  currentStepMessage: string;
  runAnalysisPipeline: () => Promise<InspectionRecord>;

  // Extracted entities review
  extractedData: ExtractedPackageData;
  setExtractedData: React.Dispatch<React.SetStateAction<ExtractedPackageData>>;
  updateExtractedField: <K extends keyof ExtractedPackageData>(field: K, value: ExtractedPackageData[K]) => void;

  // Score & Evaluation
  activeRecord: InspectionRecord | null;
  setActiveRecord: (rec: InspectionRecord | null) => void;
  officerAction: InspectionRecord['actionTaken'];
  setOfficerAction: (action: InspectionRecord['actionTaken']) => void;
  officerNotes: string;
  setOfficerNotes: (notes: string) => void;

  // Reset helper
  resetWorkflow: () => void;
  selectPreset: (presetId: string) => void;
}

const PIPELINE_STEPS = [
  'Perspective Rectification & Shadow Dewarping',
  'High-Precision OCR Character Extraction',
  'Entity Categorization (Net Qty, MRP, USP, Mfg Date, Packer Info)',
  'Legal Metrology PCR 2011 Calibration & Font Metric Evaluation',
  'Formal Compliance Assessment Synthesis'
];

const InspectionContext = createContext<InspectionContextType | undefined>(undefined);

export const InspectionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();

  // Store & location metadata
  const [storeName, setStoreName] = useState('Reliance Smart Hypermarket');
  const [storeAddress, setStoreAddress] = useState('Shop 12-14, District Centre, Janakpuri');
  const [city, setCity] = useState('New Delhi');
  const [district, setDistrict] = useState(user?.district || 'West Delhi');
  const [state, setState] = useState(user?.state || 'Delhi');

  // Specimen selection
  const [selectedPresetId, setSelectedPresetId] = useState<string>(MOCK_PREPACKAGED_SAMPLES[0].id);
  const [customImageUrl, setCustomImageUrl] = useState<string | null>(null);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);

  // Multi-angle capture
  const [capturedAngles, setCapturedAngles] = useState<{
    frontPdp: string | null;
    ingredientsNutrition: string | null;
    mrpPackerLabel: string | null;
  }>({
    frontPdp: null,
    ingredientsNutrition: null,
    mrpPackerLabel: null,
  });

  const setCapturedAngle = (slot: 'frontPdp' | 'ingredientsNutrition' | 'mrpPackerLabel', url: string | null) => {
    setCapturedAngles((prev) => ({ ...prev, [slot]: url }));
    if (slot === 'frontPdp' && url) {
      setCustomImageUrl(url);
    }
  };

  // Pipeline state
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [pipelineStep, setPipelineStep] = useState(0);
  const [currentStepMessage, setCurrentStepMessage] = useState('Ready for specimen acquisition');

  // Extracted data (starts with sample 0)
  const defaultPreset = MOCK_PREPACKAGED_SAMPLES.find((s) => s.id === selectedPresetId) || MOCK_PREPACKAGED_SAMPLES[0];
  const [extractedData, setExtractedData] = useState<ExtractedPackageData>(defaultPreset.extractedData);

  // Active record
  const [activeRecord, setActiveRecord] = useState<InspectionRecord | null>(MOCK_INSPECTION_HISTORY[0]);
  const [officerAction, setOfficerAction] = useState<InspectionRecord['actionTaken']>('Notice Issued');
  const [officerNotes, setOfficerNotes] = useState(
    'Specimen audited on-site. Unit symbol non-compliance and missing Unit Sale Price detected pursuant to Rule 6(11).'
  );

  const displayImage = customImageUrl || defaultPreset.imageUrl;

  const selectPreset = (presetId: string) => {
    setSelectedPresetId(presetId);
    setCustomImageUrl(null);
    setUploadedFile(null);
    const sample = MOCK_PREPACKAGED_SAMPLES.find((s) => s.id === presetId);
    if (sample) {
      setExtractedData(JSON.parse(JSON.stringify(sample.extractedData)));
    }
  };

  const updateExtractedField = <K extends keyof ExtractedPackageData>(
    field: K,
    value: ExtractedPackageData[K]
  ) => {
    setExtractedData((prev) => ({ ...prev, [field]: value }));
  };

  const runAnalysisPipeline = async (): Promise<InspectionRecord> => {
    setIsAnalyzing(true);
    setPipelineStep(1);
    setCurrentStepMessage('Step 1/5: Correcting optical perspective and normalizing illumination gradients...');

    await new Promise((r) => setTimeout(r, 600));
    setPipelineStep(2);
    setCurrentStepMessage('Step 2/5: Extracting typography and numeral characters from Principal Display Panel...');

    await new Promise((r) => setTimeout(r, 650));
    setPipelineStep(3);
    setCurrentStepMessage('Step 3/5: Parsing mandatory declarations: Net Qty, MRP, USP, Mfg Date & Packer...');

    await new Promise((r) => setTimeout(r, 700));
    setPipelineStep(4);
    setCurrentStepMessage('Step 4/5: Cross-referencing against Legal Metrology PCR 2011 clauses & Table 1 PDA font metrics...');

    await new Promise((r) => setTimeout(r, 600));
    setPipelineStep(5);
    setCurrentStepMessage('Step 5/5: Synthesizing statutory score and checking penalty thresholds...');

    try {
      const record = await apiService.analyzePackage({
        imageFile: uploadedFile || undefined,
        imagePreviewUrl: customImageUrl || undefined,
        samplePresetId: selectedPresetId,
        storeName,
        storeAddress,
        city,
        district,
        state,
        inspectorId: user?.id || 'INSP-DEL-041',
        inspectorName: user?.name || 'Rajesh Sharma',
        badgeNumber: user?.badgeNumber || 'LM-DL-8821',
      });

      // Synchronize extracted data and active record
      setExtractedData(record.extractedData);
      setActiveRecord(record);
      setOfficerAction(record.actionTaken);
      setOfficerNotes(record.inspectorNotes || '');
      setIsAnalyzing(false);
      return record;
    } catch (err) {
      setIsAnalyzing(false);
      throw err;
    }
  };

  const resetWorkflow = () => {
    setSelectedPresetId(MOCK_PREPACKAGED_SAMPLES[0].id);
    setCustomImageUrl(null);
    setUploadedFile(null);
    setExtractedData(JSON.parse(JSON.stringify(MOCK_PREPACKAGED_SAMPLES[0].extractedData)));
    setCapturedAngles({ frontPdp: null, ingredientsNutrition: null, mrpPackerLabel: null });
    setPipelineStep(0);
    setIsAnalyzing(false);
  };

  return (
    <InspectionContext.Provider
      value={{
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
        setSelectedPresetId,
        customImageUrl,
        setCustomImageUrl,
        uploadedFile,
        setUploadedFile,
        displayImage,
        capturedAngles,
        setCapturedAngle,
        isAnalyzing,
        pipelineStep,
        pipelineStepNames: PIPELINE_STEPS,
        currentStepMessage,
        runAnalysisPipeline,
        extractedData,
        setExtractedData,
        updateExtractedField,
        activeRecord,
        setActiveRecord,
        officerAction,
        setOfficerAction,
        officerNotes,
        setOfficerNotes,
        resetWorkflow,
        selectPreset,
      }}
    >
      {children}
    </InspectionContext.Provider>
  );
};

export const useInspection = (): InspectionContextType => {
  const context = useContext(InspectionContext);
  if (!context) {
    throw new Error('useInspection must be used within an InspectionProvider');
  }
  return context;
};
