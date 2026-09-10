export type UserRole = 'inspector' | 'admin';

export interface User {
  id: string;
  name: string;
  badgeNumber: string;
  role: UserRole;
  designation: string;
  zone: string;
  state: string;
  district: string;
  email: string;
  phone: string;
  avatarUrl?: string;
  dutyStatus?: 'on-duty' | 'off-duty' | 'on-leave';
  lastActive?: string;
  assignedStation?: string;
}

export interface RuleClause {
  ruleId: string;
  clauseNumber: string;
  title: string;
  category: 'Mandatory Declarations' | 'Font & Dimensions' | 'Net Quantity & Units' | 'MRP & Pricing' | 'Consumer Grievance' | 'Manufacturer & Origin';
  description: string;
  mandatoryRequirement: string;
  penaltySection: string;
  applicableTo: string;
}

export interface RuleEvaluationResult {
  ruleId: string;
  clauseNumber: string;
  ruleTitle: string;
  status: 'compliant' | 'non-compliant' | 'partial' | 'not-applicable';
  severity: 'low' | 'medium' | 'high' | 'critical';
  confidenceScore: number; // 0 - 100
  expectedValue: string;
  detectedValue: string;
  findingNote: string;
  applicableLaw: string;
}

export interface ExtractedPackageData {
  commodityName: string;
  brandName: string;
  category: string;
  netQuantity: {
    declared: string;
    numericValue: number;
    unit: string;
    unitStandardized: boolean; // e.g. 'g', 'kg', 'ml', 'l'
  };
  mrp: {
    declared: string;
    amount: number;
    currency: string;
    isInclusiveOfTaxes: boolean;
  };
  unitSalePrice: {
    declared: string;
    calculated: string;
    matchesStandard: boolean;
  };
  manufacturingDate: string; // MM/YYYY or DD/MM/YYYY
  expiryDate?: string;
  bestBeforePeriod?: string;
  batchNumber?: string;
  manufacturerDetails: {
    name: string;
    address: string;
    isCompleteAddress: boolean;
  };
  packerOrImporterDetails?: {
    name: string;
    address: string;
  };
  countryOfOrigin: string;
  consumerCareDetails: {
    officerOrPersonName: string;
    email: string;
    phone: string;
    address: string;
    isValidComplete: boolean;
  };
  dimensionAndFont: {
    principalDisplayAreaSqCm: number;
    minimumRequiredFontHeightMm: number;
    detectedFontHeightMm: number;
    isFontHeightCompliant: boolean;
  };
  barcodeOrQr?: string;
  packageType: string;
}

export type StandardRegulatoryStatus = 
  | 'COMPLIANT' 
  | 'POTENTIAL NON-COMPLIANCE' 
  | 'REQUIRES OFFICER REVIEW';

export type InspectionStatus = 
  | StandardRegulatoryStatus
  | 'Compliant' 
  | 'Minor Violation' 
  | 'Major Non-Compliance' 
  | 'Seizure Recommended';

export interface InspectionRecord {
  id: string;
  inspectionDate: string;
  timestamp: string;
  inspectorId: string;
  inspectorName: string;
  badgeNumber: string;
  storeName: string;
  storeAddress: string;
  city: string;
  district: string;
  state: string;
  packageImage: string;
  additionalImages?: string[];
  extractedData: ExtractedPackageData;
  overallScore: number; // 0 - 100
  status: InspectionStatus;
  ruleResults: RuleEvaluationResult[];
  inspectorNotes?: string;
  actionTaken: 'Cleared' | 'Notice Issued' | 'Sample Collected' | 'Stock Seized' | 'Compounding Notice';
  noticeNumber?: string;
  gpsCoordinates?: {
    latitude: number;
    longitude: number;
  };
}

export interface SupervisorActivityLog {
  id: string;
  timestamp: string;
  title: string;
  detail: string;
  type: 'inspection' | 'notice' | 'seizure' | 'checkin' | 'training';
}

export interface SupervisorSummary {
  id: string;
  name: string;
  badgeNumber: string;
  zone: string;
  district: string;
  dutyStatus: 'on-duty' | 'off-duty' | 'on-leave';
  totalInspections: number;
  violationsFound: number;
  complianceRate: number; // percentage
  currentLocation?: string;
  contactNumber: string;
  email: string;
  joinedDate: string;
  lastActive?: string;
  monthlyQuota?: number;
  completedQuota?: number;
  activityHistory?: SupervisorActivityLog[];
}

export interface AdminStats {
  totalInspectionsCount: number;
  compliantCount: number;
  violationsCount: number;
  seizuresCount: number;
  noticesIssuedCount: number;
  activeInspectorsCount: number;
  totalInspectorsCount: number;
  onDutySupervisorsCount: number;
  offDutySupervisorsCount: number;
  averageComplianceScore: number;
}
