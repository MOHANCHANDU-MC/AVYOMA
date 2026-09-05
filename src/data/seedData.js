// Seed Data for AVYOMA CRM — B2B Defence, Aerospace & Engineering

export const USERS = [
  { id: 'usr-1', name: 'Kavya R.', email: 'kavya.r@avyoma.com', role: 'Super Admin', title: 'Sales Director', avatar: 'KR' },
  { id: 'usr-2', name: 'Rajesh Sharma', email: 'rajesh.s@avyoma.com', role: 'Sales Manager', title: 'Senior Sales Manager', avatar: 'RS' },
  { id: 'usr-3', name: 'Ananya Nair', email: 'ananya.n@avyoma.com', role: 'Technical / Engineering', title: 'Defence Tech Specialist', avatar: 'AN' },
  { id: 'usr-4', name: 'Vikram V.', email: 'vikram.v@avyoma.com', role: 'Sales Executive', title: 'Aerospace Account Executive', avatar: 'VV' },
  { id: 'usr-5', name: 'Priya Sundaram', email: 'priya.s@avyoma.com', role: 'Finance', title: 'Commercial & Finance Lead', avatar: 'PS' },
  { id: 'usr-6', name: 'Rohan Gupta', email: 'rohan.g@avyoma.com', role: 'Viewer', title: 'Engineering Observer', avatar: 'RG' }
];

export const ACCOUNTS = [
  {
    id: 'ACC-00101',
    companyName: 'Hindustan Aeronautics Ltd (HAL)',
    legalName: 'Hindustan Aeronautics Limited (Navratna PSU)',
    industry: 'Aerospace',
    sector: 'Military Aviation',
    companyType: 'Defence Organization',
    website: 'https://hal-india.co.in',
    city: 'Bengaluru',
    state: 'Karnataka',
    country: 'India',
    address: '15/1 Cubbon Road, Bengaluru - 560001',
    taxId: '29AAACH0123P1Z1',
    registrationNo: 'PSU-DEF-1964-001',
    employeeCount: '28,000+',
    annualRevenue: 260000000000, // ₹26,000 Cr
    accountOwner: 'Kavya R.',
    accountStatus: 'Active',
    customerType: 'OEM',
    createdDate: '2025-01-15'
  },
  {
    id: 'ACC-00102',
    companyName: 'Bharat Electronics Ltd (BEL)',
    legalName: 'Bharat Electronics Limited (Navratna PSU)',
    industry: 'Defence',
    sector: 'Radar & Avionics',
    companyType: 'Defence Organization',
    website: 'https://bel-india.in',
    city: 'Bengaluru',
    state: 'Karnataka',
    country: 'India',
    address: 'Outer Ring Road, Nagavara, Bengaluru - 560045',
    taxId: '29AAACB4567Q1Z8',
    registrationNo: 'PSU-DEF-1954-088',
    employeeCount: '10,000+',
    annualRevenue: 198000000000, // ₹19,800 Cr
    accountOwner: 'Rajesh Sharma',
    accountStatus: 'Active',
    customerType: 'Customer',
    createdDate: '2025-02-01'
  },
  {
    id: 'ACC-00103',
    companyName: 'L&T Defence & Aerospace Systems',
    legalName: 'Larsen & Toubro Heavy Engineering Division',
    industry: 'Defence',
    sector: 'Naval & Heavy Ordnance',
    companyType: 'OEM',
    website: 'https://larsentoubro.com/defence',
    city: 'Mumbai',
    state: 'Maharashtra',
    country: 'India',
    address: 'L&T House, Ballard Estate, Mumbai - 400001',
    taxId: '27AAACL1029R1Z3',
    registrationNo: 'CORP-DEF-1946-012',
    employeeCount: '45,000+',
    annualRevenue: 145000000000, // ₹14,500 Cr
    accountOwner: 'Vikram V.',
    accountStatus: 'Active',
    customerType: 'Customer',
    createdDate: '2025-02-10'
  },
  {
    id: 'ACC-00104',
    companyName: 'Dynamatic Technologies Ltd',
    legalName: 'Dynamatic Technologies Limited',
    industry: 'Manufacturing',
    sector: 'Aerostructures',
    companyType: 'Partner',
    website: 'https://dynamatics.com',
    city: 'Bengaluru',
    state: 'Karnataka',
    country: 'India',
    address: 'Dynamatic Park, Peenya, Bengaluru - 560058',
    taxId: '29AAACD9981K1Z2',
    registrationNo: 'CORP-AERO-1973-509',
    employeeCount: '2,500',
    annualRevenue: 1800000000, // ₹180 Cr
    accountOwner: 'Ananya Nair',
    accountStatus: 'Active',
    customerType: 'Prospect',
    createdDate: '2025-03-04'
  },
  {
    id: 'ACC-00105',
    companyName: 'Tata Advanced Systems Ltd (TASL)',
    legalName: 'Tata Advanced Systems Limited',
    industry: 'Defence',
    sector: 'Tactical Airborne Systems',
    companyType: 'OEM',
    website: 'https://tataadvancedsystems.com',
    city: 'Hyderabad',
    state: 'Telangana',
    country: 'India',
    address: 'Adibatla Aerospace Park, Hyderabad - 501510',
    taxId: '36AAACT8821M1Z4',
    registrationNo: 'CORP-DEF-2007-331',
    employeeCount: '6,000',
    annualRevenue: 42000000000, // ₹4,200 Cr
    accountOwner: 'Kavya R.',
    accountStatus: 'Active',
    customerType: 'Customer',
    createdDate: '2025-03-20'
  }
];

export const CONTACTS = [
  {
    id: 'CON-001',
    firstName: 'K. S.',
    lastName: 'Rao',
    name: 'Air Cmdr. K. S. Rao (Retd.)',
    designation: 'Director Flight Systems & Avionics',
    department: 'Research & Design Centre',
    email: 'ks.rao@hal-india.co.in',
    phone: '+91 98450 11201',
    accountId: 'ACC-00101',
    companyName: 'Hindustan Aeronautics Ltd (HAL)',
    role: 'Decision Maker',
    isPrimary: true,
    location: 'Bengaluru'
  },
  {
    id: 'CON-002',
    firstName: 'Arisudan',
    lastName: 'Mehta',
    name: 'Dr. Arisudan Mehta',
    designation: 'Chief Scientist - Radar Electronics',
    department: 'Central Research Lab',
    email: 'a.mehta@bel.co.in',
    phone: '+91 98110 44320',
    accountId: 'ACC-00102',
    companyName: 'Bharat Electronics Ltd (BEL)',
    role: 'Technical',
    isPrimary: true,
    location: 'Bengaluru'
  },
  {
    id: 'CON-003',
    firstName: 'S.',
    lastName: 'Ramakrishnan',
    name: 'S. Ramakrishnan',
    designation: 'Head of Naval Systems Procurement',
    department: 'Supply Chain Management',
    email: 's.ramki@larsentoubro.com',
    phone: '+91 99201 88302',
    accountId: 'ACC-00103',
    companyName: 'L&T Defence & Aerospace Systems',
    role: 'Procurement',
    isPrimary: true,
    location: 'Mumbai'
  },
  {
    id: 'CON-004',
    firstName: 'Meera',
    lastName: 'Menon',
    name: 'Meera Menon',
    designation: 'VP Aerostructures Engineering',
    department: 'Precision Manufacturing',
    email: 'meera.m@dynamatics.com',
    phone: '+91 98860 99411',
    accountId: 'ACC-00104',
    companyName: 'Dynamatic Technologies Ltd',
    role: 'Influencer',
    isPrimary: true,
    location: 'Bengaluru'
  },
  {
    id: 'CON-005',
    firstName: 'Devraj',
    lastName: 'Singh',
    name: 'Col. Devraj Singh',
    designation: 'VP Defense Systems Integration',
    department: 'Airborne Systems',
    email: 'devraj.singh@tata.com',
    phone: '+91 97170 33290',
    accountId: 'ACC-00105',
    companyName: 'Tata Advanced Systems Ltd (TASL)',
    role: 'Decision Maker',
    isPrimary: true,
    location: 'Hyderabad'
  }
];

export const LEADS = [
  {
    id: 'LD-2026-00248',
    firstName: 'Vikram',
    lastName: 'Aditya',
    fullName: 'Vikram Aditya',
    company: 'Godrej Aerospace Systems',
    jobTitle: 'General Manager - Propulsion R&D',
    email: 'v.aditya@godrej.com',
    phone: '+91 98200 44123',
    location: 'Mumbai',
    country: 'India',
    industry: 'Aerospace',
    sector: 'Rocket Propulsion',
    companySize: 'Enterprise (10,000+)',
    annualRevenue: '₹12,000 Cr',
    requirement: 'High-precision titanium 5-axis CNC machined nozzle rings for satellite launch vehicle thrusters.',
    estimatedValue: 45000000, // ₹4.5 Cr
    expectedTimeline: 'Q4 2026',
    leadSource: 'Government Tender',
    leadStatus: 'Qualified',
    leadScore: 88, // Very Hot
    leadOwner: 'Kavya R.',
    priority: 'Critical',
    createdDate: '2026-08-12',
    lastContacted: '2026-09-02',
    nextFollowup: '2026-09-06',
    qualificationStatus: 'Qualified'
  },
  {
    id: 'LD-2026-00249',
    firstName: 'Sanjay',
    lastName: 'Deshmukh',
    fullName: 'Sanjay Deshmukh',
    company: 'MTAR Technologies',
    jobTitle: 'Head of Quality Assurance & Materials',
    email: 's.deshmukh@mtar.in',
    phone: '+91 94400 99821',
    location: 'Hyderabad',
    country: 'India',
    industry: 'Manufacturing',
    sector: 'Nuclear & Precision Eng',
    companySize: 'Mid-Market (1,000+)',
    annualRevenue: '₹500 Cr',
    requirement: 'Custom MIL-SPEC certified heat treatment and ultrasonic non-destructive testing for stainless steel valve bodies.',
    estimatedValue: 18000000, // ₹1.8 Cr
    expectedTimeline: 'Q3 2026',
    leadSource: 'Direct Outreach',
    leadStatus: 'Engaged',
    leadScore: 74, // Hot
    leadOwner: 'Rajesh Sharma',
    priority: 'High',
    createdDate: '2026-08-20',
    lastContacted: '2026-09-01',
    nextFollowup: '2026-09-07',
    qualificationStatus: 'In Review'
  },
  {
    id: 'LD-2026-00250',
    firstName: 'Tarun',
    lastName: 'Kapoor',
    fullName: 'Tarun Kapoor',
    company: 'Mahindra Defence Systems',
    jobTitle: 'Procurement Specialist',
    email: 't.kapoor@mahindra.com',
    phone: '+91 98190 22341',
    location: 'Pune',
    country: 'India',
    industry: 'Defence',
    sector: 'Armored Mobility',
    companySize: 'Enterprise (5,000+)',
    annualRevenue: '₹3,500 Cr',
    requirement: 'High-strength ballistic steel hull plate laser cutting and structural sub-assembly.',
    estimatedValue: 85000000, // ₹8.5 Cr
    expectedTimeline: 'Q1 2027',
    leadSource: 'Exhibition',
    leadStatus: 'New',
    leadScore: 58, // Warm
    leadOwner: 'Vikram V.',
    priority: 'Medium',
    createdDate: '2026-09-01',
    lastContacted: '2026-09-03',
    nextFollowup: '2026-09-08',
    qualificationStatus: 'Pending'
  },
  {
    id: 'LD-2026-00251',
    firstName: 'Nandini',
    lastName: 'Chawla',
    fullName: 'Nandini Chawla',
    company: 'Alpha Design Technologies',
    jobTitle: 'Sr. Systems Engineer',
    email: 'n.chawla@alphadesign.co.in',
    phone: '+91 99001 77312',
    location: 'Bengaluru',
    country: 'India',
    industry: 'Industrial',
    sector: 'Optronics & Thermal Imaging',
    companySize: 'Mid-Market (500+)',
    annualRevenue: '₹250 Cr',
    requirement: 'Ruggedized aluminum enclosures for thermal scope night vision assemblies.',
    estimatedValue: 12000000, // ₹1.2 Cr
    expectedTimeline: 'Q4 2026',
    leadSource: 'Website',
    leadStatus: 'Contacted',
    leadScore: 42, // Warm
    leadOwner: 'Ananya Nair',
    priority: 'Low',
    createdDate: '2026-08-28',
    lastContacted: '2026-08-30',
    nextFollowup: '2026-09-10',
    qualificationStatus: 'Pending'
  }
];

export const OPPORTUNITIES = [
  {
    id: 'OPP-2026-00428',
    opportunityName: 'UAV Structural Composite Canopy & Wing Spars',
    account: 'Hindustan Aeronautics Ltd (HAL)',
    accountId: 'ACC-00101',
    primaryContact: 'Air Cmdr. K. S. Rao (Retd.)',
    contactId: 'CON-001',
    owner: 'Kavya R.',
    industry: 'Aerospace',
    sector: 'Military Aviation',
    description: 'Design, tooling, and series manufacturing of carbon-fiber reinforced polymer canopy frames and main wing spar spars for tactical UAVs.',
    opportunityValue: 65000000, // ₹6.5 Cr
    currency: 'INR',
    probability: 65,
    weightedValue: 42250000,
    expectedCloseDate: '2026-10-30',
    salesStage: 'PROPOSAL',
    priority: 'High',
    leadSource: 'Government Tender',
    competitor: 'Tata Sikorsky / Maini Aerospace',
    nextStep: 'Present updated commercial quotation with 5-year maintenance SLA.',
    createdDate: '2026-06-15',
    lastUpdated: '2026-09-04',
    tenderNo: 'HAL/R&D/UAV-COMP/2026/089',
    securityLevel: 'Confidential',
    procurementType: 'RFP'
  },
  {
    id: 'OPP-2026-00429',
    opportunityName: 'Naval C-Band Radar Frequency Synthesizer Upgrade',
    account: 'Bharat Electronics Ltd (BEL)',
    accountId: 'ACC-00102',
    primaryContact: 'Dr. Arisudan Mehta',
    contactId: 'CON-002',
    owner: 'Rajesh Sharma',
    industry: 'Defence',
    sector: 'Radar & Electronics',
    description: 'Supply of ultra-low noise direct digital frequency synthesizers for naval frigate search radar modernization program.',
    opportunityValue: 124000000, // ₹12.4 Cr
    currency: 'INR',
    probability: 80,
    weightedValue: 99200000,
    expectedCloseDate: '2026-11-15',
    salesStage: 'NEGOTIATION',
    priority: 'Critical',
    leadSource: 'Direct Outreach',
    competitor: 'Astra Microwave',
    nextStep: 'Finalize payment milestone terms with finance committee.',
    createdDate: '2026-05-10',
    lastUpdated: '2026-09-05',
    tenderNo: 'BEL/NAV-RAD/SYNTH/26/102',
    securityLevel: 'Highly Confidential',
    procurementType: 'Tender'
  },
  {
    id: 'OPP-2026-00430',
    opportunityName: 'Submarine Heavy Castings & High-Pressure Shell Machining',
    account: 'L&T Defence & Aerospace Systems',
    accountId: 'ACC-00103',
    primaryContact: 'S. Ramakrishnan',
    contactId: 'CON-003',
    owner: 'Vikram V.',
    industry: 'Defence',
    sector: 'Naval Ordnance',
    description: 'Precision 5-axis heavy gantry machining of high-yield strength steel hull penetrations and valve blocks.',
    opportunityValue: 38000000, // ₹3.8 Cr
    currency: 'INR',
    probability: 50,
    weightedValue: 19000000,
    expectedCloseDate: '2026-12-05',
    salesStage: 'TECHNICAL EVALUATION',
    priority: 'High',
    leadSource: 'Partner',
    competitor: 'Walchandnagar Industries',
    nextStep: 'Complete FEA structural stress simulation report review.',
    createdDate: '2026-07-01',
    lastUpdated: '2026-09-02',
    tenderNo: 'LNT/DEF/SUB-VALVE/2026',
    securityLevel: 'Confidential',
    procurementType: 'OEM Procurement'
  },
  {
    id: 'OPP-2026-00431',
    opportunityName: 'Micro-Satellite Antenna Gimbal & Stepper Motor Drive',
    account: 'Tata Advanced Systems Ltd (TASL)',
    accountId: 'ACC-00105',
    primaryContact: 'Col. Devraj Singh',
    contactId: 'CON-005',
    owner: 'Kavya R.',
    industry: 'Aerospace',
    sector: 'Space Payload',
    description: 'Space-qualified dual-axis precision gimbal assembly for high-throughput Ka-band satellite communication links.',
    opportunityValue: 21000000, // ₹2.1 Cr
    currency: 'INR',
    probability: 90,
    weightedValue: 18900000,
    expectedCloseDate: '2026-09-25',
    salesStage: 'CONTRACT',
    priority: 'High',
    leadSource: 'Referral',
    competitor: 'None (Sole Source Tech)',
    nextStep: 'Signing formal purchase order and advance bank guarantee.',
    createdDate: '2026-04-18',
    lastUpdated: '2026-09-03',
    tenderNo: 'TASL/SATCOM/GIMBAL/044',
    securityLevel: 'Internal',
    procurementType: 'Direct Purchase'
  },
  {
    id: 'OPP-2026-00432',
    opportunityName: 'Tactical Missile Guidance Actuator Assembly',
    account: 'Bharat Electronics Ltd (BEL)',
    accountId: 'ACC-00102',
    primaryContact: 'Dr. Arisudan Mehta',
    contactId: 'CON-002',
    owner: 'Ananya Nair',
    industry: 'Defence',
    sector: 'Missile Systems',
    description: 'Series production of brushless DC electro-mechanical fin control actuators.',
    opportunityValue: 114000000, // ₹11.4 Cr
    currency: 'INR',
    probability: 100,
    weightedValue: 114000000,
    expectedCloseDate: '2026-08-28',
    salesStage: 'WON',
    priority: 'Critical',
    leadSource: 'Government Tender',
    competitor: 'BHEL Defence',
    nextStep: 'Project kick-off meeting with engineering team scheduled.',
    createdDate: '2026-03-12',
    lastUpdated: '2026-08-28',
    tenderNo: 'BEL/MISSILE/ACT-2026/01',
    securityLevel: 'Highly Confidential',
    procurementType: 'Tender'
  }
];

export const PROPOSALS = [
  {
    id: 'PRP-2026-8801',
    proposalNumber: 'AVY-PROP-2026-0881',
    opportunityId: 'OPP-2026-00428',
    opportunityName: 'UAV Structural Composite Canopy & Wing Spars',
    customer: 'Hindustan Aeronautics Ltd (HAL)',
    contact: 'Air Cmdr. K. S. Rao (Retd.)',
    proposalDate: '2026-08-25',
    validUntil: '2026-10-25',
    currency: 'INR',
    items: [
      { id: 1, name: 'Carbon Fiber Reinforced Canopy Tooling Mold', code: 'AERO-TL-09', qty: 2, unitPrice: 4500000, discount: 0, taxPercent: 18, total: 10620000 },
      { id: 2, name: 'Tactical UAV Main Wing Spar Composite Assembly', code: 'AERO-COMP-01', qty: 12, unitPrice: 3800000, discount: 5, taxPercent: 18, total: 51124800 },
      { id: 3, name: 'MIL-STD-810H Vibration & Thermal Testing', code: 'SERV-TST-02', qty: 1, unitPrice: 3200000, discount: 0, taxPercent: 18, total: 3776000 }
    ],
    subtotal: 54920000,
    discountTotal: 2280000,
    taxTotal: 9484800,
    grandTotal: 65520800,
    paymentTerms: '30% Advance with PO, 60% upon Factory Acceptance Test (FAT), 10% after delivery.',
    deliveryTerms: 'FOB Bengaluru HAL Aerospace Depot within 16 weeks.',
    status: 'Sent',
    notes: 'Quotation includes full material test certificates (MTC) and MIL-SPEC QA documentation.'
  }
];

export const ACTIVITIES = [
  {
    id: 'ACT-001',
    type: 'Technical Discussion',
    subject: 'Review of C-Band Synthesizer Phase Noise Specifications',
    relatedLead: '',
    relatedAccount: 'Bharat Electronics Ltd (BEL)',
    relatedContact: 'Dr. Arisudan Mehta',
    relatedOpportunity: 'Naval C-Band Radar Frequency Synthesizer Upgrade',
    assignedUser: 'Rajesh Sharma',
    date: '2026-09-05',
    time: '14:30',
    duration: '45 mins',
    status: 'Completed',
    notes: 'Confirmed phase noise target of -120 dBc/Hz at 10 kHz offset. BEL engineering team approved initial schematic.',
    outcome: 'Phase 1 technical compliance approved.',
    nextAction: 'Submit revised commercial proposal.'
  },
  {
    id: 'ACT-002',
    type: 'Site Visit',
    subject: 'Factory Audit & Cleanroom Inspection at HAL Facility',
    relatedLead: '',
    relatedAccount: 'Hindustan Aeronautics Ltd (HAL)',
    relatedContact: 'Air Cmdr. K. S. Rao (Retd.)',
    relatedOpportunity: 'UAV Structural Composite Canopy & Wing Spars',
    assignedUser: 'Kavya R.',
    date: '2026-09-04',
    time: '11:00',
    duration: '2 hours',
    status: 'Completed',
    notes: 'Inspected Class 10,000 cleanroom lay-up station and autoclave pressure vessel capabilities.',
    outcome: 'Auditor recommended full supplier registration.',
    nextAction: 'Send final proposal document.'
  },
  {
    id: 'ACT-003',
    type: 'Meeting',
    subject: 'Initial Requirements Gathering for Launch Vehicle Thruster',
    relatedLead: 'Vikram Aditya (Godrej Aerospace)',
    relatedAccount: 'Godrej Aerospace Systems',
    relatedContact: 'Vikram Aditya',
    relatedOpportunity: '',
    assignedUser: 'Kavya R.',
    date: '2026-09-06',
    time: '10:30 AM',
    duration: '60 mins',
    status: 'Scheduled',
    notes: 'Review tolerance requirements (+/- 5 microns) on titanium forging drawings.',
    outcome: '',
    nextAction: 'Prepare preliminary engineering feasibility brief.'
  }
];

export const TASKS = [
  {
    id: 'TSK-001',
    title: 'Send Revised Commercial Quotation to BEL',
    description: 'Update payment terms to 30/60/10 split as discussed with Dr. Arisudan Mehta.',
    assignedTo: 'Rajesh Sharma',
    relatedLead: '',
    relatedAccount: 'Bharat Electronics Ltd (BEL)',
    relatedOpportunity: 'Naval C-Band Radar Frequency Synthesizer Upgrade',
    dueDate: '2026-09-06',
    priority: 'Critical',
    status: 'In Progress'
  },
  {
    id: 'TSK-002',
    title: 'Upload MIL-SPEC Material Compliance Certificates for HAL',
    description: 'Ensure 7075-T6 aluminum test batch certificates are linked to Opportunity OPP-2026-00428.',
    assignedTo: 'Ananya Nair',
    relatedLead: '',
    relatedAccount: 'Hindustan Aeronautics Ltd (HAL)',
    relatedOpportunity: 'UAV Structural Composite Canopy & Wing Spars',
    dueDate: '2026-09-05',
    priority: 'High',
    status: 'To Do'
  },
  {
    id: 'TSK-003',
    title: 'Follow-up Call on Submarine Valve Plate Machining',
    description: 'Check status of FEA simulation approval with L&T procurement committee.',
    assignedTo: 'Vikram V.',
    relatedLead: '',
    relatedAccount: 'L&T Defence & Aerospace Systems',
    relatedOpportunity: 'Submarine Heavy Castings & High-Pressure Shell Machining',
    dueDate: '2026-09-04', // Overdue
    priority: 'High',
    status: 'To Do'
  }
];

export const PRODUCTS = [
  { id: 'PRD-01', name: 'Carbon Fiber Reinforced Composite Canopy Frame', sku: 'AERO-COMP-01', category: 'Aerospace', unit: 'Set', price: 3800000, currency: 'INR', tax: 18, status: 'Active' },
  { id: 'PRD-02', name: 'Low Noise C-Band Frequency Synthesizer Module', sku: 'DEF-RAD-99', category: 'Defence', unit: 'Unit', price: 1850000, currency: 'INR', tax: 18, status: 'Active' },
  { id: 'PRD-03', name: 'Titanium 5-Axis Precision Machined Nozzle Ring', sku: 'ENG-TIT-05', category: 'Engineering', unit: 'Piece', price: 1250000, currency: 'INR', tax: 18, status: 'Active' },
  { id: 'PRD-04', name: 'Space-Qualified Dual-Axis Antenna Gimbal', sku: 'SAT-GIM-02', category: 'Technology', unit: 'Assembly', price: 4200000, currency: 'INR', tax: 18, status: 'Active' },
  { id: 'PRD-05', name: 'MIL-STD-810H Environmental Testing & Qualification', sku: 'SERV-TST-02', category: 'Consulting', unit: 'Service', price: 3200000, currency: 'INR', tax: 18, status: 'Active' }
];

export const DOCUMENTS = [
  { id: 'DOC-01', fileName: 'HAL_UAV_Canopy_Technical_RFP.pdf', fileType: 'RFP', size: '4.8 MB', uploadedBy: 'Kavya R.', uploadDate: '2026-08-15', relatedEntity: 'Hindustan Aeronautics Ltd (HAL)', category: 'Technical Specification' },
  { id: 'DOC-02', fileName: 'BEL_Radar_Synthesizer_Tender_Doc_V2.pdf', fileType: 'Tender', size: '12.1 MB', uploadedBy: 'Rajesh Sharma', uploadDate: '2026-08-20', relatedEntity: 'Bharat Electronics Ltd (BEL)', category: 'Tender' },
  { id: 'DOC-03', fileName: 'LNT_Submarine_Machining_CAD_Drawing.dwg', fileType: 'Drawings', size: '28.5 MB', uploadedBy: 'Ananya Nair', uploadDate: '2026-09-01', relatedEntity: 'L&T Defence & Aerospace Systems', category: 'Drawings' },
  { id: 'DOC-04', fileName: 'TASL_Non_Disclosure_Agreement_Signed.pdf', fileType: 'NDA', size: '1.2 MB', uploadedBy: 'Vikram V.', uploadDate: '2026-04-20', relatedEntity: 'Tata Advanced Systems Ltd (TASL)', category: 'NDA' }
];

export const AUDIT_LOGS = [
  { id: 'AUD-01', user: 'Kavya R.', action: 'Changed Opportunity Stage', details: 'Moved OPP-2026-00428 from TECHNICAL EVALUATION → PROPOSAL', timestamp: '2026-09-04 14:42' },
  { id: 'AUD-02', user: 'Rajesh Sharma', action: 'Created Proposal', details: 'Generated proposal PRP-2026-8801 for HAL (₹6.55 Cr)', timestamp: '2026-08-25 10:15' },
  { id: 'AUD-03', user: 'Ananya Nair', action: 'Lead Converted', details: 'Converted Lead LD-2026-00190 to Opportunity OPP-2026-00432 (WON)', timestamp: '2026-08-28 16:30' },
  { id: 'AUD-04', user: 'System', action: 'Lead Score Updated', details: 'Recalculated score for Godrej Aerospace (88 / Very Hot)', timestamp: '2026-09-02 09:00' }
];

export const NOTIFICATIONS = [
  { id: 'NOT-01', title: 'Follow-up Due Today', message: 'Meeting scheduled with Vikram Aditya (Godrej Aerospace) at 10:30 AM', time: 'Today 09:00 AM', read: false, type: 'warning' },
  { id: 'NOT-02', title: 'Opportunity Stage Updated', message: 'Kavya R. moved HAL UAV Assembly to PROPOSAL stage.', time: 'Yesterday', read: false, type: 'info' },
  { id: 'NOT-03', title: 'Deal Won Alert! 🎉', message: 'Tactical Missile Guidance Actuator (₹11.4 Cr) marked as WON.', time: '2 days ago', read: true, type: 'success' }
];
