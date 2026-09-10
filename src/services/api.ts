import {
  InspectionRecord,
  RuleClause,
  SupervisorSummary,
  AdminStats,
  RuleEvaluationResult,
  ExtractedPackageData,
  User,
  UserRole,
  InspectionStatus
} from '../types';
import {
  MOCK_INSPECTION_HISTORY,
  MOCK_SUPERVISORS,
  MOCK_ADMIN_STATS,
  RULEBOOK_CLAUSES,
  MOCK_PREPACKAGED_SAMPLES
} from '../data/mockData';

// Configuration for easy swap to REST API
export const API_CONFIG = {
  USE_MOCK: true,
  BASE_URL:
    (typeof import.meta !== 'undefined' &&
      (import.meta.env?.VITE_API_BASE_URL || import.meta.env?.VITE_API_URL)) ||
    'https://api.legalmetrix.gov.in/v1',
  TIMEOUT_MS: 8000,
};

// Storage keys for in-memory / local persistent storage
const STORAGE_KEYS = {
  INSPECTIONS: 'legalmetrix_inspections',
  SUPERVISORS: 'legalmetrix_supervisors',
  AUTH_TOKEN: 'legalmetrix_auth_token',
};

// Token Helper functions (no sensitive info logged)
export const getAuthToken = (): string | null => {
  try {
    return localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
  } catch {
    return null;
  }
};

export const setAuthToken = (token: string): void => {
  try {
    localStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, token);
  } catch (e) {
    console.warn('Could not store auth token', e);
  }
};

export const clearAuthToken = (): void => {
  try {
    localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
  } catch (e) {
    console.warn('Could not clear auth token', e);
  }
};

// Local storage mock helpers
const getStoredInspections = (): InspectionRecord[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.INSPECTIONS);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.warn('Could not read inspections from localStorage', e);
  }
  return [...MOCK_INSPECTION_HISTORY];
};

const persistInspections = (data: InspectionRecord[]) => {
  try {
    localStorage.setItem(STORAGE_KEYS.INSPECTIONS, JSON.stringify(data));
  } catch (e) {
    console.warn('Could not save inspections to localStorage', e);
  }
};

const getStoredSupervisors = (): SupervisorSummary[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.SUPERVISORS);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.warn('Could not read supervisors from localStorage', e);
  }
  return [...MOCK_SUPERVISORS];
};

const persistSupervisors = (data: SupervisorSummary[]) => {
  try {
    localStorage.setItem(STORAGE_KEYS.SUPERVISORS, JSON.stringify(data));
  } catch (e) {
    console.warn('Could not save supervisors to localStorage', e);
  }
};

// Simulated network latency for mock mode
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Centralized HTTP Fetch Request Handler
 * - Adds Authorization header when token exists
 * - Handles JSON vs FormData (leaves Content-Type header unset for FormData to let browser set boundary)
 * - Implements timeout handling via AbortController
 * - Centralizes error parsing without exposing sensitive credentials in logs
 */
async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), API_CONFIG.TIMEOUT_MS);

  const headers: Record<string, string> = {
    ...(options.headers as Record<string, string>),
  };

  const token = getAuthToken();
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  // Set Content-Type to application/json unless body is FormData
  if (options.body && !(options.body instanceof FormData)) {
    headers['Content-Type'] = 'application/json';
  }

  const url = `${API_CONFIG.BASE_URL}${endpoint}`;

  try {
    const response = await fetch(url, {
      ...options,
      headers,
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      let errorMessage = `HTTP Error ${response.status}: ${response.statusText}`;
      try {
        const errorData = await response.json();
        if (errorData?.message) errorMessage = errorData.message;
      } catch {
        // Fallback to HTTP status text if json parsing fails
      }
      throw new Error(errorMessage);
    }

    // Return json or empty object if 204 No Content
    if (response.status === 204) {
      return {} as T;
    }

    return await response.json();
  } catch (error: any) {
    clearTimeout(timeoutId);
    if (error.name === 'AbortError') {
      throw new Error(`API Request timeout after ${API_CONFIG.TIMEOUT_MS}ms`);
    }
    throw error;
  }
}

/**
 * LegalMetriX Unified API Service Layer
 * Supports both offline mock mode (API_CONFIG.USE_MOCK === true) and REST backend integration
 */
export const apiService = {
  /**
   * Endpoint 1: Login / Authentication
   */
  async login(credentials: {
    badgeNumber?: string;
    password?: string;
    role: UserRole;
  }): Promise<{ token: string; user: User }> {
    if (!API_CONFIG.USE_MOCK) {
      const result = await request<{ token: string; user: User }>('/auth/login', {
        method: 'POST',
        body: JSON.stringify(credentials),
      });
      if (result.token) {
        setAuthToken(result.token);
      }
      return result;
    }

    await delay(400);
    const mockToken = `demo_token_${credentials.role}_${Date.now()}`;
    setAuthToken(mockToken);

    const mockUser: User =
      credentials.role === 'admin'
        ? {
            id: 'ADMIN-HQ-001',
            name: 'Dr. Arvind Mehra',
            badgeNumber: credentials.badgeNumber || 'LM-DIR-009',
            role: 'admin',
            designation: 'Joint Controller of Legal Metrology',
            zone: 'National Headquarters',
            district: 'New Delhi',
            state: 'Govt. of India',
            email: 'arvind.mehra@gov.in',
            phone: '+91 11 2338 4122',
            dutyStatus: 'on-duty',
            assignedStation: 'Krishi Bhawan, Dept. of Consumer Affairs',
            lastActive: 'Active',
          }
        : {
            id: 'INSP-DEL-041',
            name: 'Rajesh Sharma',
            badgeNumber: credentials.badgeNumber || 'LM-DL-8821',
            role: 'inspector',
            designation: 'Senior Legal Metrology Inspector',
            zone: 'North Delhi Zone',
            district: 'Central District',
            state: 'Delhi (NCT)',
            email: 'rajesh.sharma@lm.delhi.gov.in',
            phone: '+91 98112 34567',
            dutyStatus: 'on-duty',
            assignedStation: 'Civil Lines LM Office, Delhi',
            lastActive: 'Just now',
          };

    return { token: mockToken, user: mockUser };
  },

  /**
   * Endpoint 2: Product Specimen Image Upload
   */
  async uploadSpecimenImage(
    file: File,
    slot: string = 'frontPdp'
  ): Promise<{ imageUrl: string; imageId: string; timestamp: string }> {
    if (!API_CONFIG.USE_MOCK) {
      const formData = new FormData();
      formData.append('specimen', file);
      formData.append('slot', slot);
      return request<{ imageUrl: string; imageId: string; timestamp: string }>('/specimens/upload', {
        method: 'POST',
        body: formData,
      });
    }

    await delay(300);
    return {
      imageUrl: URL.createObjectURL(file),
      imageId: `IMG-${Math.floor(1000 + Math.random() * 9000)}`,
      timestamp: new Date().toISOString(),
    };
  },

  /**
   * Endpoint 3: OCR / Analysis Engine
   */
  async analyzePackage(payload: {
    imageFile?: File;
    imagePreviewUrl?: string;
    samplePresetId?: string;
    storeName: string;
    storeAddress: string;
    city: string;
    district: string;
    state: string;
    inspectorId: string;
    inspectorName: string;
    badgeNumber: string;
  }): Promise<InspectionRecord> {
    if (!API_CONFIG.USE_MOCK) {
      const formData = new FormData();
      if (payload.imageFile) formData.append('packageImage', payload.imageFile);
      if (payload.samplePresetId) formData.append('samplePresetId', payload.samplePresetId);
      formData.append('storeName', payload.storeName);
      formData.append('storeAddress', payload.storeAddress);
      formData.append('city', payload.city);
      formData.append('district', payload.district);
      formData.append('state', payload.state);
      formData.append('inspectorId', payload.inspectorId);

      return request<InspectionRecord>('/inspections/analyze', {
        method: 'POST',
        body: formData,
      });
    }

    // Mock analysis processing simulation
    await delay(1600);

    const preset =
      MOCK_PREPACKAGED_SAMPLES.find((s) => s.id === payload.samplePresetId) ||
      MOCK_PREPACKAGED_SAMPLES[0];

    const extracted: ExtractedPackageData = JSON.parse(JSON.stringify(preset.extractedData));

    const ruleResults: RuleEvaluationResult[] = [
      {
        ruleId: 'LM-R6-1A',
        clauseNumber: 'Rule 6(1)(a)',
        ruleTitle: 'Name & Address of Manufacturer / Packer / Importer',
        status: extracted.manufacturerDetails.isCompleteAddress ? 'compliant' : 'non-compliant',
        severity: 'high',
        confidenceScore: 98,
        expectedValue: 'Complete registered postal address with PIN',
        detectedValue: extracted.manufacturerDetails.address || 'Incomplete address detected',
        findingNote: extracted.manufacturerDetails.isCompleteAddress
          ? 'Full postal address identified.'
          : 'Address lacks postal code or locality specification.',
        applicableLaw: 'Rule 6(1)(a) Legal Metrology (PC) Rules 2011',
      },
      {
        ruleId: 'LM-R6-1B',
        clauseNumber: 'Rule 6(1)(b)',
        ruleTitle: 'Generic or Common Name of Commodity',
        status: extracted.commodityName ? 'compliant' : 'non-compliant',
        severity: 'medium',
        confidenceScore: 96,
        expectedValue: 'Clear generic name on Principal Display Panel',
        detectedValue: extracted.commodityName,
        findingNote: 'Commodity description verified on principal display panel.',
        applicableLaw: 'Rule 6(1)(b)',
      },
      {
        ruleId: 'LM-R6-1C',
        clauseNumber: 'Rule 6(1)(c)',
        ruleTitle: 'Net Quantity Declaration in Standard Units',
        status: extracted.netQuantity.unitStandardized ? 'compliant' : 'non-compliant',
        severity: 'high',
        confidenceScore: 95,
        expectedValue: 'Standard SI unit (g, kg, ml, l, m)',
        detectedValue: `Declared as "${extracted.netQuantity.declared}"`,
        findingNote: extracted.netQuantity.unitStandardized
          ? 'Standard SI units correctly used.'
          : `Non-standard unit "${extracted.netQuantity.unit}" violates Rule 11.`,
        applicableLaw: 'Rule 6(1)(c) read with Rule 11 & 12',
      },
      {
        ruleId: 'LM-R6-1D',
        clauseNumber: 'Rule 6(1)(d)',
        ruleTitle: 'Month & Year of Manufacture / Packing',
        status: extracted.manufacturingDate ? 'compliant' : 'non-compliant',
        severity: 'high',
        confidenceScore: 97,
        expectedValue: 'Month & Year format (MM/YYYY)',
        detectedValue: extracted.manufacturingDate || 'Not detected on package',
        findingNote: extracted.manufacturingDate
          ? `Manufacturing date ${extracted.manufacturingDate} verified.`
          : 'Mandatory manufacturing/packing date is missing.',
        applicableLaw: 'Rule 6(1)(d)',
      },
      {
        ruleId: 'LM-R6-1E',
        clauseNumber: 'Rule 6(1)(e)',
        ruleTitle: 'Maximum Retail Price (MRP) & Tax Inclusivity',
        status: extracted.mrp.isInclusiveOfTaxes ? 'compliant' : 'non-compliant',
        severity: 'critical',
        confidenceScore: 99,
        expectedValue: '₹ Amount inclusive of all taxes',
        detectedValue: extracted.mrp.declared,
        findingNote: extracted.mrp.isInclusiveOfTaxes
          ? 'Explicit tax inclusive statement present.'
          : 'Missing mandatory "inclusive of all taxes" statement.',
        applicableLaw: 'Rule 6(1)(e) & Section 36(1)',
      },
      {
        ruleId: 'LM-R6-11',
        clauseNumber: 'Rule 6(11)',
        ruleTitle: 'Unit Sale Price (USP)',
        status: extracted.unitSalePrice.declared ? 'compliant' : 'non-compliant',
        severity: 'high',
        confidenceScore: 96,
        expectedValue: `Mandatory USP: ${extracted.unitSalePrice.calculated}`,
        detectedValue: extracted.unitSalePrice.declared || 'Not declared on package',
        findingNote: extracted.unitSalePrice.declared
          ? 'Prominent USP declaration detected.'
          : 'Unit sale price missing. Mandatory for pre-packaged commodities.',
        applicableLaw: 'Rule 6(11) as amended 2022',
      },
      {
        ruleId: 'LM-R6-1H',
        clauseNumber: 'Rule 6(1)(h)',
        ruleTitle: 'Consumer Care & Grievance Redressal',
        status: extracted.consumerCareDetails.isValidComplete ? 'compliant' : 'partial',
        severity: 'medium',
        confidenceScore: 92,
        expectedValue: 'Name, valid phone, valid email, and physical postal address',
        detectedValue: `Email: ${extracted.consumerCareDetails.email || 'None'} | Ph: ${extracted.consumerCareDetails.phone || 'None'}`,
        findingNote: extracted.consumerCareDetails.isValidComplete
          ? 'Complete consumer grievance contact mechanism present.'
          : 'Consumer grievance details are incomplete or contain malformed email.',
        applicableLaw: 'Rule 6(1)(h)',
      },
      {
        ruleId: 'LM-R9-T1',
        clauseNumber: 'Rule 9 Table 1',
        ruleTitle: 'Minimum Height of Numerals & Letters',
        status: extracted.dimensionAndFont.isFontHeightCompliant ? 'compliant' : 'non-compliant',
        severity: 'medium',
        confidenceScore: 90,
        expectedValue: `Min ${extracted.dimensionAndFont.minimumRequiredFontHeightMm} mm for PDA ${extracted.dimensionAndFont.principalDisplayAreaSqCm} cm²`,
        detectedValue: `${extracted.dimensionAndFont.detectedFontHeightMm} mm detected`,
        findingNote: extracted.dimensionAndFont.isFontHeightCompliant
          ? 'Typography complies with Table 1 height mandates.'
          : `Detected font height (${extracted.dimensionAndFont.detectedFontHeightMm}mm) is below required ${extracted.dimensionAndFont.minimumRequiredFontHeightMm}mm.`,
        applicableLaw: 'Rule 9 Table 1',
      },
    ];

    const totalCount = ruleResults.length;
    const compliantCount = ruleResults.filter((r) => r.status === 'compliant').length;
    const partialCount = ruleResults.filter((r) => r.status === 'partial').length;
    const rawScore = Math.round(((compliantCount * 1.0 + partialCount * 0.5) / totalCount) * 100);

    let status: InspectionRecord['status'] = 'COMPLIANT';
    let actionTaken: InspectionRecord['actionTaken'] = 'Cleared';
    let noticeNumber: string | undefined = undefined;

    if (rawScore < 50) {
      status = 'REQUIRES OFFICER REVIEW';
      actionTaken = 'Stock Seized';
      noticeNumber = `DL/LM/2026/SZ-${Math.floor(1000 + Math.random() * 9000)}`;
    } else if (rawScore < 85) {
      status = 'POTENTIAL NON-COMPLIANCE';
      actionTaken = 'Notice Issued';
      noticeNumber = `DL/LM/2026/N-${Math.floor(1000 + Math.random() * 9000)}`;
    }

    const newRecord: InspectionRecord = {
      id: `INSP-2026-${Math.floor(1000 + Math.random() * 9000)}`,
      inspectionDate: new Date().toISOString().split('T')[0],
      timestamp: `${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} IST`,
      inspectorId: payload.inspectorId,
      inspectorName: payload.inspectorName,
      badgeNumber: payload.badgeNumber,
      storeName: payload.storeName,
      storeAddress: payload.storeAddress,
      city: payload.city,
      district: payload.district,
      state: payload.state,
      packageImage: payload.imagePreviewUrl || preset.imageUrl,
      extractedData: extracted,
      overallScore: rawScore,
      status,
      ruleResults,
      actionTaken,
      noticeNumber,
      inspectorNotes:
        'Field inspection automated verification under Legal Metrology (Packaged Commodities) Rules, 2011.',
      gpsCoordinates: {
        latitude: 28.6139,
        longitude: 77.209,
      },
    };

    const current = getStoredInspections();
    persistInspections([newRecord, ...current]);

    return newRecord;
  },

  /**
   * Endpoint 4: Extracted Information Updates
   */
  async updateExtractedData(
    id: string,
    extractedData: ExtractedPackageData
  ): Promise<{ success: boolean; extractedData: ExtractedPackageData }> {
    if (!API_CONFIG.USE_MOCK) {
      return request<{ success: boolean; extractedData: ExtractedPackageData }>(
        `/inspections/${id}/extracted-data`,
        {
          method: 'PUT',
          body: JSON.stringify(extractedData),
        }
      );
    }

    await delay(300);
    const list = getStoredInspections();
    const index = list.findIndex((item) => item.id === id);
    if (index !== -1) {
      list[index].extractedData = extractedData;
      persistInspections(list);
    }
    return { success: true, extractedData };
  },

  /**
   * Endpoint 5: Compliance Score Computation
   */
  async computeComplianceScore(
    extractedData: ExtractedPackageData
  ): Promise<{ overallScore: number; status: InspectionStatus; ruleResults: RuleEvaluationResult[] }> {
    if (!API_CONFIG.USE_MOCK) {
      return request<{
        overallScore: number;
        status: InspectionStatus;
        ruleResults: RuleEvaluationResult[];
      }>('/inspections/compute-score', {
        method: 'POST',
        body: JSON.stringify({ extractedData }),
      });
    }

    await delay(250);
    return {
      overallScore: 85,
      status: 'POTENTIAL NON-COMPLIANCE',
      ruleResults: [],
    };
  },

  /**
   * Endpoint 6: Rule Findings
   */
  async getRuleResults(inspectionId: string): Promise<RuleEvaluationResult[]> {
    if (!API_CONFIG.USE_MOCK) {
      const res = await request<{ ruleResults: RuleEvaluationResult[] }>(
        `/inspections/${inspectionId}/rule-results`
      );
      return res.ruleResults;
    }

    await delay(200);
    const record = await this.getInspectionById(inspectionId);
    return record?.ruleResults || [];
  },

  /**
   * Endpoint 7: Fetch all inspection history records with optional filtering
   */
  async getInspectionHistory(filters?: {
    inspectorId?: string;
    status?: string;
    search?: string;
  }): Promise<InspectionRecord[]> {
    if (!API_CONFIG.USE_MOCK) {
      const params = new URLSearchParams(filters as Record<string, string>);
      return request<InspectionRecord[]>(`/inspections?${params.toString()}`);
    }

    await delay(350);
    let list = getStoredInspections();

    if (filters?.inspectorId) {
      list = list.filter((item) => item.inspectorId === filters.inspectorId);
    }
    if (filters?.status && filters.status !== 'all') {
      list = list.filter((item) => item.status.toLowerCase() === filters.status?.toLowerCase());
    }
    if (filters?.search) {
      const q = filters.search.toLowerCase();
      list = list.filter(
        (item) =>
          item.storeName.toLowerCase().includes(q) ||
          item.extractedData.commodityName.toLowerCase().includes(q) ||
          item.extractedData.brandName.toLowerCase().includes(q) ||
          item.id.toLowerCase().includes(q) ||
          item.city.toLowerCase().includes(q)
      );
    }

    return list;
  },

  /**
   * Endpoint 8: Get single inspection by ID
   */
  async getInspectionById(id: string): Promise<InspectionRecord | null> {
    if (!API_CONFIG.USE_MOCK) {
      return request<InspectionRecord>(`/inspections/${id}`);
    }

    await delay(250);
    const list = getStoredInspections();
    const found = list.find((item) => item.id === id);
    return found || null;
  },

  /**
   * Update the action taken or notes on an existing inspection
   */
  async updateInspectionAction(
    id: string,
    update: {
      actionTaken: InspectionRecord['actionTaken'];
      inspectorNotes?: string;
      noticeNumber?: string;
    }
  ): Promise<InspectionRecord> {
    if (!API_CONFIG.USE_MOCK) {
      return request<InspectionRecord>(`/inspections/${id}/action`, {
        method: 'PATCH',
        body: JSON.stringify(update),
      });
    }

    await delay(300);
    const list = getStoredInspections();
    const index = list.findIndex((item) => item.id === id);
    if (index === -1) throw new Error('Inspection not found');

    list[index] = {
      ...list[index],
      actionTaken: update.actionTaken,
      inspectorNotes: update.inspectorNotes ?? list[index].inspectorNotes,
      noticeNumber: update.noticeNumber ?? list[index].noticeNumber,
    };

    persistInspections(list);
    return list[index];
  },

  /**
   * Endpoint 9: PDF / Form III Report Dossier Data
   */
  async getInspectionDossier(
    id: string
  ): Promise<{ record: InspectionRecord; officialFormHeader: string; digitalSignatureHash: string }> {
    if (!API_CONFIG.USE_MOCK) {
      return request<{
        record: InspectionRecord;
        officialFormHeader: string;
        digitalSignatureHash: string;
      }>(`/inspections/${id}/dossier`);
    }

    await delay(250);
    const record = await this.getInspectionById(id);
    if (!record) throw new Error('Dossier not found');

    return {
      record,
      officialFormHeader: 'FORM III STATUTORY COMPLIANCE MEMORANDUM',
      digitalSignatureHash: `0x${Math.random().toString(16).slice(2, 10).toUpperCase()}...SEC65B`,
    };
  },

  /**
   * Endpoint 10: Inspector Profile & Duty Status Update
   */
  async updateInspectorDutyStatus(status: 'on-duty' | 'off-duty' | 'on-leave'): Promise<User> {
    if (!API_CONFIG.USE_MOCK) {
      return request<User>('/officer/duty-status', {
        method: 'PATCH',
        body: JSON.stringify({ dutyStatus: status }),
      });
    }

    await delay(200);
    return {
      id: 'INSP-DEL-041',
      name: 'Rajesh Sharma',
      badgeNumber: 'LM-DL-8821',
      role: 'inspector',
      designation: 'Senior Legal Metrology Inspector',
      zone: 'North Delhi Zone',
      district: 'Central District',
      state: 'Delhi (NCT)',
      email: 'rajesh.sharma@lm.delhi.gov.in',
      phone: '+91 98112 34567',
      dutyStatus: status,
    };
  },

  /**
   * Retrieve Rulebook clauses
   */
  async getRulebook(category?: string): Promise<RuleClause[]> {
    if (!API_CONFIG.USE_MOCK) {
      const query = category && category !== 'All' ? `?category=${encodeURIComponent(category)}` : '';
      return request<RuleClause[]>(`/rulebook${query}`);
    }

    await delay(200);
    if (category && category !== 'All') {
      return RULEBOOK_CLAUSES.filter((r) => r.category === category);
    }
    return RULEBOOK_CLAUSES;
  },

  /**
   * Endpoint 11: Get supervisor list for admin directory
   */
  async getSupervisors(filters?: {
    zone?: string;
    district?: string;
    status?: string;
    search?: string;
  }): Promise<SupervisorSummary[]> {
    if (!API_CONFIG.USE_MOCK) {
      const params = new URLSearchParams(filters as Record<string, string>);
      const query = params.toString() ? `?${params.toString()}` : '';
      return request<SupervisorSummary[]>(`/admin/supervisors${query}`);
    }

    await delay(300);
    let list = getStoredSupervisors();

    if (filters?.zone && filters.zone !== 'All') {
      list = list.filter((s) => s.zone === filters.zone);
    }
    if (filters?.status && filters.status !== 'All') {
      list = list.filter((s) => s.dutyStatus === filters.status);
    }
    if (filters?.search) {
      const q = filters.search.toLowerCase();
      list = list.filter(
        (s) =>
          s.name.toLowerCase().includes(q) ||
          s.badgeNumber.toLowerCase().includes(q) ||
          s.district.toLowerCase().includes(q)
      );
    }

    return list;
  },

  /**
   * Endpoint 12: Get single supervisor details
   */
  async getSupervisorById(id: string): Promise<SupervisorSummary | null> {
    if (!API_CONFIG.USE_MOCK) {
      return request<SupervisorSummary>(`/admin/supervisors/${id}`);
    }

    await delay(200);
    const list = getStoredSupervisors();
    return list.find((s) => s.id === id) || null;
  },

  /**
   * Endpoint 13: Update supervisor duty status (on-duty, off-duty, on-leave)
   */
  async updateSupervisorDutyStatus(
    id: string,
    dutyStatus: 'on-duty' | 'off-duty' | 'on-leave'
  ): Promise<SupervisorSummary> {
    if (!API_CONFIG.USE_MOCK) {
      return request<SupervisorSummary>(`/admin/supervisors/${id}/status`, {
        method: 'PATCH',
        body: JSON.stringify({ dutyStatus }),
      });
    }

    await delay(300);
    const list = getStoredSupervisors();
    const index = list.findIndex((s) => s.id === id);
    if (index === -1) throw new Error('Supervisor not found');

    list[index] = {
      ...list[index],
      dutyStatus,
    };
    persistSupervisors(list);
    return list[index];
  },

  /**
   * Admin dashboard metrics & aggregate stats
   */
  async getAdminStats(): Promise<AdminStats> {
    if (!API_CONFIG.USE_MOCK) {
      return request<AdminStats>('/admin/stats');
    }

    await delay(250);
    const storedInspections = getStoredInspections();
    const storedSupervisors = getStoredSupervisors();

    const totalInspectionsCount = storedInspections.length;
    const compliantCount = storedInspections.filter((i) => i.status === 'Compliant' || i.status === 'COMPLIANT').length;
    const violationsCount = storedInspections.filter((i) => i.status !== 'Compliant' && i.status !== 'COMPLIANT').length;
    const seizuresCount = storedInspections.filter((i) => i.actionTaken === 'Stock Seized').length;
    const noticesIssuedCount = storedInspections.filter((i) => i.actionTaken === 'Notice Issued').length;
    const activeInspectorsCount = storedSupervisors.filter((s) => s.dutyStatus === 'on-duty').length;
    const onDutySupervisorsCount = activeInspectorsCount;
    const offDutySupervisorsCount = storedSupervisors.filter((s) => s.dutyStatus !== 'on-duty').length;
    const totalScoreSum = storedInspections.reduce((acc, curr) => acc + curr.overallScore, 0);
    const averageComplianceScore = totalInspectionsCount > 0 ? Math.round(totalScoreSum / totalInspectionsCount) : 75;

    return {
      totalInspectionsCount,
      compliantCount,
      violationsCount,
      seizuresCount,
      noticesIssuedCount,
      activeInspectorsCount,
      totalInspectorsCount: storedSupervisors.length,
      onDutySupervisorsCount,
      offDutySupervisorsCount,
      averageComplianceScore,
    };
  },
};

export default apiService;
