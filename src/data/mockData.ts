import { RuleClause, InspectionRecord, SupervisorSummary, AdminStats, ExtractedPackageData } from '../types';

export const RULEBOOK_CLAUSES: RuleClause[] = [
  {
    ruleId: 'LM-R6-1A',
    clauseNumber: 'Rule 6(1)(a)',
    title: 'Name & Address of Manufacturer / Packer / Importer',
    category: 'Manufacturer & Origin',
    description: 'Every package shall bear the name and complete postal address of the manufacturer, or where manufacturer is not packer, the name and address of manufacturer and packer.',
    mandatoryRequirement: 'Complete address with Pin Code, City, State, and registered entity name.',
    penaltySection: 'Section 36(1) of Legal Metrology Act, 2009 — Fine up to ₹25,000 (first offense), ₹50,000 (second), up to ₹1,00,000 or imprisonment.',
    applicableTo: 'All pre-packaged commodities'
  },
  {
    ruleId: 'LM-R6-1B',
    clauseNumber: 'Rule 6(1)(b)',
    title: 'Generic or Common Name of Commodity',
    category: 'Mandatory Declarations',
    description: 'The common or generic names of the commodity contained in the package must be prominently declared on the principal display panel.',
    mandatoryRequirement: 'Clear unambiguous generic commodity description (e.g. "Atta (Wheat Flour)", "Refined Sunflower Oil").',
    penaltySection: 'Section 36(1) of Legal Metrology Act, 2009',
    applicableTo: 'All pre-packaged commodities'
  },
  {
    ruleId: 'LM-R6-1C',
    clauseNumber: 'Rule 6(1)(c)',
    title: 'Net Quantity Declaration in Standard SI Units',
    category: 'Net Quantity & Units',
    description: 'The net quantity in terms of standard unit of weight or measure or number must be stated. No non-standard symbols like gms, grm, kgs, ltrs are permissible.',
    mandatoryRequirement: 'Permissible symbols: g, kg, mg, ml, l, m, cm, mm, or N (number).',
    penaltySection: 'Rule 32 & Section 36(2) of Legal Metrology Act',
    applicableTo: 'All solid, liquid, gaseous commodities and count packages'
  },
  {
    ruleId: 'LM-R6-1D',
    clauseNumber: 'Rule 6(1)(d)',
    title: 'Month & Year of Manufacture / Packing / Import',
    category: 'Mandatory Declarations',
    description: 'The month and year in which the commodity is manufactured or packed or imported shall be clearly marked.',
    mandatoryRequirement: 'Format: "Mfg Date: MM/YYYY" or "Packed on: MM/YYYY". Valid numerals.',
    penaltySection: 'Section 36(1) of Legal Metrology Act, 2009',
    applicableTo: 'All pre-packaged commodities (except packages with shelf life < 1 month where DD/MM/YY is mandatory)'
  },
  {
    ruleId: 'LM-R6-1E',
    clauseNumber: 'Rule 6(1)(e)',
    title: 'Maximum Retail Price (MRP) & Tax Inclusivity',
    category: 'MRP & Pricing',
    description: 'Retail sale price of package shall clearly be declared as "Maximum or Max. Retail Price ₹ ... inclusive of all taxes" or "MRP ₹ ... incl. of all taxes".',
    mandatoryRequirement: 'Must contain Indian Rupee symbol ₹ or Rs., numeric price, and explicit mention "inclusive of all taxes". Overcharging or dual MRP is strictly illegal.',
    penaltySection: 'Section 36(1) & Section 52 of Legal Metrology Act, 2009',
    applicableTo: 'All commodities intended for retail sale'
  },
  {
    ruleId: 'LM-R6-11',
    clauseNumber: 'Rule 6(11)',
    title: 'Unit Sale Price (USP) Declaration',
    category: 'MRP & Pricing',
    description: 'Mandatory declaration of Unit Sale Price (USP) in ₹ per g/kg or ₹ per ml/l or ₹ per piece alongside the retail price to empower consumer value comparison.',
    mandatoryRequirement: 'Mandatory for packages > 1kg or 1L (declare per kg/L) and <= 1kg or 1L (declare per 100g/100ml).',
    penaltySection: 'Legal Metrology Amendment Rules (Effective Jan 1, 2022)',
    applicableTo: 'All packaged commodities sold by weight, volume or count'
  },
  {
    ruleId: 'LM-R6-1AA',
    clauseNumber: 'Rule 6(1)(aa)',
    title: 'Country of Origin / Manufacturing Origin',
    category: 'Manufacturer & Origin',
    description: 'For imported goods, the name of the country of origin or manufacture shall be mentioned on the package.',
    mandatoryRequirement: 'Clear mention: "Country of Origin: [Country]" or "Made in [Country]".',
    penaltySection: 'Section 36(1) of Legal Metrology Act, 2009',
    applicableTo: 'All imported & domestic packaged items'
  },
  {
    ruleId: 'LM-R6-1H',
    clauseNumber: 'Rule 6(1)(h)',
    title: 'Consumer Care / Grievance Redressal Mechanism',
    category: 'Consumer Grievance',
    description: 'Name, address, telephone number, and e-mail address of the person who can be contacted by the consumer in case of complaints or queries.',
    mandatoryRequirement: 'Must include all 4 components: Contact Person/Officer designation, Postal Address, Active Telephone/Toll-free number, and Valid Email ID.',
    penaltySection: 'Section 36(1) of Legal Metrology Act, 2009',
    applicableTo: 'All pre-packaged commodities'
  },
  {
    ruleId: 'LM-R9-T1',
    clauseNumber: 'Rule 9 Table 1',
    title: 'Minimum Height of Numerals and Letters',
    category: 'Font & Dimensions',
    description: 'The height of any numeral and letter on principal display panel shall not be less than the minimum height specified in Table 1 based on Principal Display Area (PDA).',
    mandatoryRequirement: 'PDA <= 50 cm²: min 1.0mm (blown/embossed 2.0mm); 50-200 cm²: min 2.0mm; 200-1000 cm²: min 4.0mm; > 1000 cm²: min 6.0mm.',
    penaltySection: 'Rule 9 & Rule 32 of Legal Metrology Rules, 2011',
    applicableTo: 'Principal Display Panel typography'
  },
  {
    ruleId: 'LM-R6-1F',
    clauseNumber: 'Rule 6(1)(f)',
    title: 'Best Before / Use by / Expiry Date',
    category: 'Mandatory Declarations',
    description: 'For food products or commodities which may become unfit for consumption with time, the "Best Before" or "Use by" date must be declared.',
    mandatoryRequirement: 'Legible declaration "Best Before X months from packaging" or "Expiry Date: DD/MM/YYYY".',
    penaltySection: 'Food Safety and Standards Act / LM Rules Rule 6',
    applicableTo: 'Perishable, cosmetic, and food products'
  }
];

export const MOCK_PREPACKAGED_SAMPLES: {
  id: string;
  name: string;
  category: string;
  imageUrl: string;
  description: string;
  extractedData: ExtractedPackageData;
}[] = [
  {
    id: 'sample-biscuits-violation',
    name: 'NutriBite Premium Oats Cookies (400g)',
    category: 'Bakery & Confectionery',
    imageUrl: 'https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=600&auto=format&fit=crop&q=80',
    description: 'Sample package found in Metro Hypermarket. Missing Unit Sale Price and incomplete consumer care email.',
    extractedData: {
      commodityName: 'Oats & Almond Baked Cookies',
      brandName: 'NutriBite',
      category: 'Food / Bakery',
      netQuantity: {
        declared: '400 gms',
        numericValue: 400,
        unit: 'gms',
        unitStandardized: false // Non-standard symbol 'gms' instead of standard 'g'
      },
      mrp: {
        declared: '₹ 145.00 (Inclusive of all taxes)',
        amount: 145,
        currency: 'INR',
        isInclusiveOfTaxes: true
      },
      unitSalePrice: {
        declared: '', // Missing USP
        calculated: '₹ 0.36 / g (or ₹ 36.25 / 100g)',
        matchesStandard: false
      },
      manufacturingDate: '01/2026',
      expiryDate: '10/2026',
      bestBeforePeriod: '9 months from packaging',
      batchNumber: 'NB-2026-X89',
      manufacturerDetails: {
        name: 'NutriBite Foods Pvt Ltd',
        address: 'Plot 42, Industrial Area, Sector 18, Gurugram, Haryana 122015',
        isCompleteAddress: true
      },
      countryOfOrigin: 'India',
      consumerCareDetails: {
        officerOrPersonName: 'Consumer Grievance Officer',
        phone: '1800-200-8899',
        email: 'help@nutribite', // Invalid malformed email
        address: 'Plot 42, Industrial Area, Sector 18, Gurugram',
        isValidComplete: false
      },
      dimensionAndFont: {
        principalDisplayAreaSqCm: 180,
        minimumRequiredFontHeightMm: 2.0,
        detectedFontHeightMm: 1.4, // Non-compliant font height
        isFontHeightCompliant: false
      },
      barcodeOrQr: '8901030892341',
      packageType: 'Rigid Paperboard Box'
    }
  },
  {
    id: 'sample-oil-compliant',
    name: 'Kisan Shuddha Mustard Oil (1 Litre)',
    category: 'Edible Oils',
    imageUrl: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=600&auto=format&fit=crop&q=80',
    description: 'Standard pet bottle mustard oil. Fully compliant with Legal Metrology (PC) Rules 2011 & 2022 Amendment.',
    extractedData: {
      commodityName: 'Kachi Ghani Pure Mustard Oil',
      brandName: 'Kisan Shuddha',
      category: 'Edible Oils',
      netQuantity: {
        declared: '1 l (or 1000 ml)',
        numericValue: 1000,
        unit: 'l',
        unitStandardized: true
      },
      mrp: {
        declared: '₹ 180.00 (Incl. of all taxes)',
        amount: 180,
        currency: 'INR',
        isInclusiveOfTaxes: true
      },
      unitSalePrice: {
        declared: '₹ 180.00 / l',
        calculated: '₹ 180.00 / l',
        matchesStandard: true
      },
      manufacturingDate: '02/2026',
      expiryDate: '02/2027',
      bestBeforePeriod: '12 months from manufacturing',
      batchNumber: 'KS-MO-542',
      manufacturerDetails: {
        name: 'Kisan Agro Oils Limited',
        address: 'Survey No. 88, Mandi Road, Alwar, Rajasthan 301001',
        isCompleteAddress: true
      },
      countryOfOrigin: 'India',
      consumerCareDetails: {
        officerOrPersonName: 'Manager - Customer Service',
        phone: '1800-419-5522',
        email: 'care@kisanagroofoods.com',
        address: 'Survey No. 88, Mandi Road, Alwar, Rajasthan 301001',
        isValidComplete: true
      },
      dimensionAndFont: {
        principalDisplayAreaSqCm: 320,
        minimumRequiredFontHeightMm: 4.0,
        detectedFontHeightMm: 4.2,
        isFontHeightCompliant: true
      },
      barcodeOrQr: '8902541098712',
      packageType: 'PET Bottle'
    }
  },
  {
    id: 'sample-detergent-major',
    name: 'Sparkle Max Laundry Detergent Powder (2 kg)',
    category: 'Household Chemicals',
    imageUrl: 'https://images.unsplash.com/photo-1610557892470-55d9e80c0bce?w=600&auto=format&fit=crop&q=80',
    description: 'High violation pouch: Non-compliant MRP (missing taxes declaration), missing manufacturing date, non-standard unit declaration.',
    extractedData: {
      commodityName: 'Fabric Washing Detergent Powder',
      brandName: 'Sparkle Max',
      category: 'Cleaning Goods',
      netQuantity: {
        declared: '2 Kgs Net',
        numericValue: 2,
        unit: 'Kgs',
        unitStandardized: false // Non-standard 'Kgs'
      },
      mrp: {
        declared: 'MRP Rs. 299', // Missing "inclusive of all taxes"
        amount: 299,
        currency: 'INR',
        isInclusiveOfTaxes: false
      },
      unitSalePrice: {
        declared: '', // Missing USP
        calculated: '₹ 149.50 / kg',
        matchesStandard: false
      },
      manufacturingDate: '', // Missing
      expiryDate: '12/2027',
      bestBeforePeriod: '24 months',
      batchNumber: 'SM-2026-09',
      manufacturerDetails: {
        name: 'Sparkle Chemicals Ltd',
        address: 'Industrial Estate, Phase 1', // Incomplete address: missing city, pin, state
        isCompleteAddress: false
      },
      countryOfOrigin: '', // Missing
      consumerCareDetails: {
        officerOrPersonName: '',
        phone: '9876543210',
        email: '',
        address: '',
        isValidComplete: false
      },
      dimensionAndFont: {
        principalDisplayAreaSqCm: 450,
        minimumRequiredFontHeightMm: 4.0,
        detectedFontHeightMm: 2.1,
        isFontHeightCompliant: false
      },
      barcodeOrQr: '8904321098765',
      packageType: 'Polyester Laminate Pouch'
    }
  }
];

export const MOCK_SUPERVISORS: SupervisorSummary[] = [
  {
    id: 'INSP-DEL-041',
    name: 'Rajesh Sharma',
    badgeNumber: 'LM-DL-8821',
    zone: 'North Delhi',
    district: 'Central District',
    dutyStatus: 'on-duty',
    totalInspections: 84,
    violationsFound: 29,
    complianceRate: 65.5,
    currentLocation: 'Chandni Chowk Market, Delhi',
    contactNumber: '+91 98112 34567',
    email: 'rajesh.sharma@lm.delhi.gov.in',
    joinedDate: '2021-04-15',
    lastActive: '12 mins ago (Live Patrol)',
    monthlyQuota: 100,
    completedQuota: 84,
    activityHistory: [
      {
        id: 'ACT-DEL-01',
        timestamp: 'Today, 14:25 IST',
        title: 'Form III Compounding Notice Issued',
        detail: 'Reliance Smart Superstore, Plot 12 Vikas Marg. Non-standard unit symbol "gms" & missing USP.',
        type: 'notice'
      },
      {
        id: 'ACT-DEL-02',
        timestamp: 'Today, 11:10 IST',
        title: 'Retail Surveillance Patrol Checked In',
        detail: 'Field patrol geo-authenticated at Chandni Chowk Commercial Zone.',
        type: 'checkin'
      },
      {
        id: 'ACT-DEL-03',
        timestamp: 'Yesterday, 16:45 IST',
        title: 'Routine FMCG Packaged Goods Audit',
        detail: 'Audit completed at Modern Bazaar, Connaught Place. 12 commodities cleared.',
        type: 'inspection'
      },
      {
        id: 'ACT-DEL-04',
        timestamp: '07 Sep 2026, 15:30 IST',
        title: 'Stock Seizure Under Section 15 LM Act',
        detail: 'Seized 42 packages of unverified edible oil lacking packer address details.',
        type: 'seizure'
      },
      {
        id: 'ACT-DEL-05',
        timestamp: '03 Sep 2026, 10:00 IST',
        title: 'Quarterly Metrology Enforcement Refresher',
        detail: 'Completed National Legal Metrology Institute (IILM) calibration seminar.',
        type: 'training'
      }
    ]
  },
  {
    id: 'INSP-MUM-102',
    name: 'Priyanka Patil',
    badgeNumber: 'LM-MH-4412',
    zone: 'South Mumbai',
    district: 'Mumbai City',
    dutyStatus: 'on-duty',
    totalInspections: 112,
    violationsFound: 18,
    complianceRate: 83.9,
    currentLocation: 'Crawford Market, Mumbai',
    contactNumber: '+91 98201 87654',
    email: 'priyanka.patil@lm.maharashtra.gov.in',
    joinedDate: '2020-08-10',
    lastActive: '4 mins ago (Active Inspection)',
    monthlyQuota: 120,
    completedQuota: 112,
    activityHistory: [
      {
        id: 'ACT-MUM-01',
        timestamp: 'Today, 15:10 IST',
        title: 'Supermarket Wholesale Surveillance Audit',
        detail: 'Wholesale hypermarket audit in South Mumbai. All declarations verified compliant.',
        type: 'inspection'
      },
      {
        id: 'ACT-MUM-02',
        timestamp: 'Today, 09:30 IST',
        title: 'Commenced Daily High-Risk Retail Beat',
        detail: 'Check-in logged at Crawford Market Enforcement Zone.',
        type: 'checkin'
      },
      {
        id: 'ACT-MUM-03',
        timestamp: 'Yesterday, 14:00 IST',
        title: 'Statutory Notice for Font Height Infringement',
        detail: 'Rule 9 violation on imported confectionery item at Nariman Point.',
        type: 'notice'
      },
      {
        id: 'ACT-MUM-04',
        timestamp: '05 Sep 2026, 11:20 IST',
        title: 'Surprise Packaging Check at Port Warehouse',
        detail: 'Customs transit verification for packaged dry fruits.',
        type: 'inspection'
      }
    ]
  },
  {
    id: 'INSP-BLR-077',
    name: 'Karthik Ramanathan',
    badgeNumber: 'LM-KA-9903',
    zone: 'Bengaluru East',
    district: 'Bengaluru Urban',
    dutyStatus: 'on-duty',
    totalInspections: 95,
    violationsFound: 14,
    complianceRate: 85.2,
    currentLocation: 'Indiranagar Commercial Hub, Bengaluru',
    contactNumber: '+91 94481 22334',
    email: 'karthik.r@lm.karnataka.gov.in',
    joinedDate: '2022-01-20',
    lastActive: '18 mins ago (On Patrol)',
    monthlyQuota: 100,
    completedQuota: 95,
    activityHistory: [
      {
        id: 'ACT-BLR-01',
        timestamp: 'Today, 13:40 IST',
        title: 'Quick Commerce Fulfillment Hub Audit',
        detail: 'Verification of rapid grocery warehouse packaging & net quantity compliance.',
        type: 'inspection'
      },
      {
        id: 'ACT-BLR-02',
        timestamp: 'Yesterday, 17:15 IST',
        title: 'Statutory Cautionary Warning Recorded',
        detail: 'Warning issued for faint MRP printing on organic pulses.',
        type: 'notice'
      },
      {
        id: 'ACT-BLR-03',
        timestamp: '06 Sep 2026, 09:15 IST',
        title: 'Weekly Beat Deployment Initialized',
        detail: 'East Bengaluru commercial zones roster activated.',
        type: 'checkin'
      }
    ]
  },
  {
    id: 'INSP-HYD-019',
    name: 'Ananya Reddy',
    badgeNumber: 'LM-TS-5542',
    zone: 'Hyderabad West',
    district: 'Hyderabad Central',
    dutyStatus: 'off-duty',
    totalInspections: 73,
    violationsFound: 21,
    complianceRate: 71.2,
    currentLocation: 'Secunderabad Head Office',
    contactNumber: '+91 97003 44556',
    email: 'ananya.reddy@lm.telangana.gov.in',
    joinedDate: '2023-03-05',
    lastActive: 'Yesterday, 18:30 IST',
    monthlyQuota: 80,
    completedQuota: 73,
    activityHistory: [
      {
        id: 'ACT-HYD-01',
        timestamp: 'Yesterday, 18:20 IST',
        title: 'Duty Shift Completed & Logged Out',
        detail: 'End-of-day reports submitted to Zonal Controller.',
        type: 'checkin'
      },
      {
        id: 'ACT-HYD-02',
        timestamp: 'Yesterday, 14:45 IST',
        title: 'Commercial Complex Sweeping Inspection',
        detail: 'Inspected 18 consumer retail stores in Banjara Hills.',
        type: 'inspection'
      },
      {
        id: 'ACT-HYD-03',
        timestamp: '08 Sep 2026, 11:30 IST',
        title: 'Compounding Notice Issued on Misbranded Rice',
        detail: 'Absence of manufacturer address & incorrect date format.',
        type: 'notice'
      }
    ]
  },
  {
    id: 'INSP-KOL-035',
    name: 'Subhash Bose',
    badgeNumber: 'LM-WB-1120',
    zone: 'Kolkata North',
    district: 'Kolkata',
    dutyStatus: 'off-duty',
    totalInspections: 62,
    violationsFound: 26,
    complianceRate: 58.0,
    currentLocation: 'Kolkata Zonal Headquarters',
    contactNumber: '+91 98300 77889',
    email: 'subhash.bose@lm.wb.gov.in',
    joinedDate: '2019-11-12',
    lastActive: '2 days ago, 17:00 IST',
    monthlyQuota: 80,
    completedQuota: 62,
    activityHistory: [
      {
        id: 'ACT-KOL-01',
        timestamp: '07 Sep 2026, 16:50 IST',
        title: 'Duty Stand-Down Logged',
        detail: 'Scheduled administrative rest period initiated.',
        type: 'checkin'
      },
      {
        id: 'ACT-KOL-02',
        timestamp: '07 Sep 2026, 13:15 IST',
        title: 'Spice Packaging Market Raid',
        detail: 'Confiscated non-standard weight spice packets lacking required customer care info.',
        type: 'seizure'
      },
      {
        id: 'ACT-KOL-03',
        timestamp: '06 Sep 2026, 10:00 IST',
        title: 'Standard Weight Calibration Verification',
        detail: 'Conducted standard weight testing at Salt Lake commercial stores.',
        type: 'inspection'
      }
    ]
  },
  {
    id: 'INSP-CHN-088',
    name: 'Meenakshi Sundaram',
    badgeNumber: 'LM-TN-6731',
    zone: 'Chennai Central',
    district: 'Chennai',
    dutyStatus: 'on-duty',
    totalInspections: 104,
    violationsFound: 19,
    complianceRate: 81.7,
    currentLocation: 'T. Nagar Commercial Complex, Chennai',
    contactNumber: '+91 94440 99112',
    email: 'meenakshi.s@lm.tn.gov.in',
    joinedDate: '2021-09-01',
    lastActive: '7 mins ago (Active Inspection)',
    monthlyQuota: 110,
    completedQuota: 104,
    activityHistory: [
      {
        id: 'ACT-CHN-01',
        timestamp: 'Today, 14:50 IST',
        title: 'Beverage Packaging Verification Audit',
        detail: 'Sampled 8 bottled beverages at T. Nagar market. Verified volume declaration & USP.',
        type: 'inspection'
      },
      {
        id: 'ACT-CHN-02',
        timestamp: 'Today, 10:00 IST',
        title: 'Morning Deployment Sign-In',
        detail: 'Active beat coverage assigned for Chennai Central sector.',
        type: 'checkin'
      },
      {
        id: 'ACT-CHN-03',
        timestamp: '08 Sep 2026, 16:15 IST',
        title: 'Notice Issued for Missing Best Before Declaration',
        detail: 'Rule 6(1)(d) non-compliance recorded on packaged sweetmeat box.',
        type: 'notice'
      }
    ]
  }
];

export const MOCK_INSPECTION_HISTORY: InspectionRecord[] = [
  {
    id: 'INSP-2026-0089',
    inspectionDate: '2026-09-09',
    timestamp: '14:25 IST',
    inspectorId: 'INSP-DEL-041',
    inspectorName: 'Rajesh Sharma',
    badgeNumber: 'LM-DL-8821',
    storeName: 'Reliance Smart Superstore',
    storeAddress: 'Plot 12, Vikas Marg, Laxmi Nagar',
    city: 'New Delhi',
    district: 'East Delhi',
    state: 'Delhi',
    packageImage: 'https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=600&auto=format&fit=crop&q=80',
    extractedData: MOCK_PREPACKAGED_SAMPLES[0].extractedData,
    overallScore: 58,
    status: 'POTENTIAL NON-COMPLIANCE',
    actionTaken: 'Notice Issued',
    noticeNumber: 'DL/LM/2026/N-4091',
    inspectorNotes: 'Non-standard unit symbol "gms" used instead of "g". Unit sale price absent on 400g carton. Consumer email format invalid. Notice issued under Rule 6(11) & Section 36.',
    gpsCoordinates: {
      latitude: 28.6304,
      longitude: 77.2773
    },
    ruleResults: [
      {
        ruleId: 'LM-R6-1A',
        clauseNumber: 'Rule 6(1)(a)',
        ruleTitle: 'Name & Address of Manufacturer / Packer',
        status: 'compliant',
        severity: 'high',
        confidenceScore: 98,
        expectedValue: 'Complete registered postal address with PIN',
        detectedValue: 'Plot 42, Industrial Area, Sector 18, Gurugram, Haryana 122015',
        findingNote: 'Valid and full postal address detected.',
        applicableLaw: 'Rule 6(1)(a) Legal Metrology (PC) Rules, 2011'
      },
      {
        ruleId: 'LM-R6-1B',
        clauseNumber: 'Rule 6(1)(b)',
        ruleTitle: 'Generic Commodity Name',
        status: 'compliant',
        severity: 'medium',
        confidenceScore: 96,
        expectedValue: 'Clear generic name on Principal Display Panel',
        detectedValue: 'Oats & Almond Baked Cookies',
        findingNote: 'Compliant generic description present.',
        applicableLaw: 'Rule 6(1)(b)'
      },
      {
        ruleId: 'LM-R6-1C',
        clauseNumber: 'Rule 6(1)(c)',
        ruleTitle: 'Net Quantity Standard Units',
        status: 'non-compliant',
        severity: 'high',
        confidenceScore: 94,
        expectedValue: 'Standard SI unit: "g" or "kg"',
        detectedValue: 'Declared as "400 gms"',
        findingNote: 'Use of non-standard symbol "gms". Only "g" is permissible under Rule 11.',
        applicableLaw: 'Rule 6(1)(c) read with Rule 11'
      },
      {
        ruleId: 'LM-R6-1E',
        clauseNumber: 'Rule 6(1)(e)',
        ruleTitle: 'Maximum Retail Price (MRP)',
        status: 'compliant',
        severity: 'critical',
        confidenceScore: 99,
        expectedValue: '₹ Amount inclusive of all taxes',
        detectedValue: '₹ 145.00 (Inclusive of all taxes)',
        findingNote: 'Mandatory declaration and tax statement present.',
        applicableLaw: 'Rule 6(1)(e)'
      },
      {
        ruleId: 'LM-R6-11',
        clauseNumber: 'Rule 6(11)',
        ruleTitle: 'Unit Sale Price (USP)',
        status: 'non-compliant',
        severity: 'high',
        confidenceScore: 97,
        expectedValue: 'Mandatory USP: ₹ 0.36 / g (or ₹ 36.25 / 100g)',
        detectedValue: 'Not declared on package',
        findingNote: 'Violation: Unit sale price absent on retail package.',
        applicableLaw: 'Rule 6(11) as amended 2022'
      },
      {
        ruleId: 'LM-R6-1H',
        clauseNumber: 'Rule 6(1)(h)',
        ruleTitle: 'Consumer Care Details',
        status: 'partial',
        severity: 'medium',
        confidenceScore: 92,
        expectedValue: 'Full name, valid phone, valid email, and address',
        detectedValue: 'Phone present, email invalid ("help@nutribite")',
        findingNote: 'Malformed email syntax; incomplete consumer grievance contact.',
        applicableLaw: 'Rule 6(1)(h)'
      },
      {
        ruleId: 'LM-R9-T1',
        clauseNumber: 'Rule 9 Table 1',
        ruleTitle: 'Minimum Height of Numerals & Letters',
        status: 'non-compliant',
        severity: 'medium',
        confidenceScore: 90,
        expectedValue: 'Min 2.0 mm (for PDA 50-200 cm²)',
        detectedValue: '1.4 mm detected via optical measurement',
        findingNote: 'Typography height violates Table 1 minimum specification.',
        applicableLaw: 'Rule 9 read with Table 1'
      }
    ]
  },
  {
    id: 'INSP-2026-0088',
    inspectionDate: '2026-09-08',
    timestamp: '11:10 IST',
    inspectorId: 'INSP-DEL-041',
    inspectorName: 'Rajesh Sharma',
    badgeNumber: 'LM-DL-8821',
    storeName: 'Kirana Mart Wholesale',
    storeAddress: 'Shop 4, Daryaganj Main Road',
    city: 'New Delhi',
    district: 'Central District',
    state: 'Delhi',
    packageImage: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=600&auto=format&fit=crop&q=80',
    extractedData: MOCK_PREPACKAGED_SAMPLES[1].extractedData,
    overallScore: 98,
    status: 'COMPLIANT',
    actionTaken: 'Cleared',
    inspectorNotes: 'All 10 mandatory declarations verified. Dimensions and USP comply with 2022 amendment.',
    gpsCoordinates: {
      latitude: 28.6432,
      longitude: 77.2415
    },
    ruleResults: [
      {
        ruleId: 'LM-R6-1A',
        clauseNumber: 'Rule 6(1)(a)',
        ruleTitle: 'Name & Address of Manufacturer',
        status: 'compliant',
        severity: 'high',
        confidenceScore: 99,
        expectedValue: 'Complete address with PIN',
        detectedValue: 'Survey No. 88, Mandi Road, Alwar, Rajasthan 301001',
        findingNote: 'Fully compliant.',
        applicableLaw: 'Rule 6(1)(a)'
      },
      {
        ruleId: 'LM-R6-1C',
        clauseNumber: 'Rule 6(1)(c)',
        ruleTitle: 'Net Quantity Standard Units',
        status: 'compliant',
        severity: 'high',
        confidenceScore: 100,
        expectedValue: 'Standard unit: "l" or "ml"',
        detectedValue: '1 l (or 1000 ml)',
        findingNote: 'Standard SI unit symbols correctly utilized.',
        applicableLaw: 'Rule 6(1)(c)'
      },
      {
        ruleId: 'LM-R6-1E',
        clauseNumber: 'Rule 6(1)(e)',
        ruleTitle: 'Maximum Retail Price (MRP)',
        status: 'compliant',
        severity: 'critical',
        confidenceScore: 99,
        expectedValue: '₹ Amount inclusive of all taxes',
        detectedValue: '₹ 180.00 (Incl. of all taxes)',
        findingNote: 'Compliant declaration.',
        applicableLaw: 'Rule 6(1)(e)'
      },
      {
        ruleId: 'LM-R6-11',
        clauseNumber: 'Rule 6(11)',
        ruleTitle: 'Unit Sale Price (USP)',
        status: 'compliant',
        severity: 'high',
        confidenceScore: 98,
        expectedValue: 'USP stated per Litre',
        detectedValue: '₹ 180.00 / l',
        findingNote: 'Accurately calculated and prominently displayed.',
        applicableLaw: 'Rule 6(11)'
      }
    ]
  },
  {
    id: 'INSP-2026-0082',
    inspectionDate: '2026-09-06',
    timestamp: '16:40 IST',
    inspectorId: 'INSP-DEL-041',
    inspectorName: 'Rajesh Sharma',
    badgeNumber: 'LM-DL-8821',
    storeName: 'Bazaar Superette',
    storeAddress: '14, Sector 7, Rohini',
    city: 'New Delhi',
    district: 'North West Delhi',
    state: 'Delhi',
    packageImage: 'https://images.unsplash.com/photo-1610557892470-55d9e80c0bce?w=600&auto=format&fit=crop&q=80',
    extractedData: MOCK_PREPACKAGED_SAMPLES[2].extractedData,
    overallScore: 32,
    status: 'REQUIRES OFFICER REVIEW',
    actionTaken: 'Stock Seized',
    noticeNumber: 'DL/LM/2026/SZ-0129',
    inspectorNotes: 'Severe violations: Missing tax inclusion statement on MRP, missing manufacturing date, non-standard weight unit, incomplete manufacturer address. Stock seized under Section 15 of Legal Metrology Act.',
    gpsCoordinates: {
      latitude: 28.7112,
      longitude: 77.1235
    },
    ruleResults: [
      {
        ruleId: 'LM-R6-1E',
        clauseNumber: 'Rule 6(1)(e)',
        ruleTitle: 'MRP Taxes Declaration',
        status: 'non-compliant',
        severity: 'critical',
        confidenceScore: 98,
        expectedValue: 'Must mention "inclusive of all taxes"',
        detectedValue: 'MRP Rs. 299 (taxes statement missing)',
        findingNote: 'Direct violation of Rule 6(1)(e).',
        applicableLaw: 'Section 36(1)'
      },
      {
        ruleId: 'LM-R6-1D',
        clauseNumber: 'Rule 6(1)(d)',
        ruleTitle: 'Month & Year of Manufacture',
        status: 'non-compliant',
        severity: 'high',
        confidenceScore: 99,
        expectedValue: 'Mandatory Month and Year of manufacture',
        detectedValue: 'None found on packet',
        findingNote: 'Total absence of manufacturing date.',
        applicableLaw: 'Rule 6(1)(d)'
      },
      {
        ruleId: 'LM-R6-1A',
        clauseNumber: 'Rule 6(1)(a)',
        ruleTitle: 'Complete Manufacturer Address',
        status: 'non-compliant',
        severity: 'high',
        confidenceScore: 95,
        expectedValue: 'Full postal address with City and PIN',
        detectedValue: 'Industrial Estate, Phase 1 (no city or pin)',
        findingNote: 'Vague address hinders consumer grievance redressal.',
        applicableLaw: 'Rule 6(1)(a)'
      }
    ]
  }
];

export const MOCK_ADMIN_STATS: AdminStats = {
  totalInspectionsCount: 530,
  compliantCount: 382,
  violationsCount: 148,
  seizuresCount: 24,
  noticesIssuedCount: 124,
  activeInspectorsCount: 4,
  totalInspectorsCount: 6,
  onDutySupervisorsCount: 4,
  offDutySupervisorsCount: 2,
  averageComplianceScore: 78.4
};
