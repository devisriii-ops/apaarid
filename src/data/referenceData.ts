import { Institution, Programme } from '../types';

export interface StateDistrictHierarchy {
  state: string;
  districts: string[];
}

export const OFFICIAL_STATES_DISTRICTS: StateDistrictHierarchy[] = [
  {
    state: 'Maharashtra',
    districts: ['Pune', 'Mumbai City', 'Mumbai Suburban', 'Nagpur', 'Nashik', 'Aurangabad', 'Kolhapur', 'Thane']
  },
  {
    state: 'Karnataka',
    districts: ['Bengaluru Urban', 'Bengaluru Rural', 'Mysuru', 'Dakshina Kannada', 'Dharwad', 'Belagavi', 'Udupi']
  },
  {
    state: 'Tamil Nadu',
    districts: ['Chennai', 'Coimbatore', 'Tiruchirappalli', 'Madurai', 'Salem', 'Kancheepuram', 'Vellore']
  },
  {
    state: 'Delhi (NCT)',
    districts: ['New Delhi', 'North Delhi', 'South Delhi', 'East Delhi', 'West Delhi', 'South West Delhi']
  },
  {
    state: 'Telangana',
    districts: ['Hyderabad', 'Ranga Reddy', 'Medchal-Malkajgiri', 'Warangal Urban', 'Karimnagar']
  },
  {
    state: 'Uttar Pradesh',
    districts: ['Gautam Buddha Nagar', 'Ghaziabad', 'Lucknow', 'Kanpur Nagar', 'Varanasi', 'Agra', 'Prayagraj']
  },
  {
    state: 'Gujarat',
    districts: ['Ahmedabad', 'Gandhinagar', 'Vadodara', 'Surat', 'Rajkot', 'Bhavnagar']
  },
  {
    state: 'Kerala',
    districts: ['Thiruvananthapuram', 'Ernakulam', 'Kozhikode', 'Thrissur', 'Palakkad', 'Kollam']
  }
];

export const INITIAL_INSTITUTIONS: Institution[] = [
  {
    id: 'inst-coep-01',
    name: 'College of Engineering, Pune (COEP Technological University)',
    aictePermanentId: '1-4328911',
    state: 'Maharashtra',
    district: 'Pune',
    category: 'Engineering & Technology',
    managementType: 'Government / State University',
    aicteApprovalRef: 'AICTE/WRO/1-4328911/2024-25/EOA',
    academicYear: '2025-26',
    approvalStatus: 'Extension of Approval (EoA)',
    effectivePeriod: '2024-2027',
    sourceReference: 'https://www.aicte-india.org/directory/eoa-letters',
    datasetVersion: 'AICTE-EOA-v2025.2',
    lastRetrievedDate: '2025-10-15',
    claimStatus: 'verified_active',
    contactEmail: 'dean.academics@coeptech.ac.in',
    website: 'https://www.coep.org.in'
  },
  {
    id: 'inst-rvce-02',
    name: 'R.V. College of Engineering (RVCE)',
    aictePermanentId: '1-5289110',
    state: 'Karnataka',
    district: 'Bengaluru Urban',
    category: 'Engineering & Technology',
    managementType: 'Private-Self Financing / Autonomous',
    aicteApprovalRef: 'AICTE/SRO/1-5289110/2024-25/EOA',
    academicYear: '2025-26',
    approvalStatus: 'Extension of Approval (EoA)',
    effectivePeriod: '2024-2027',
    sourceReference: 'https://www.aicte-india.org/directory/eoa-letters',
    datasetVersion: 'AICTE-EOA-v2025.2',
    lastRetrievedDate: '2025-10-15',
    claimStatus: 'verified_active',
    contactEmail: 'principal@rvce.edu.in',
    website: 'https://www.rvce.edu.in'
  },
  {
    id: 'inst-psg-03',
    name: 'PSG College of Technology',
    aictePermanentId: '1-6102914',
    state: 'Tamil Nadu',
    district: 'Coimbatore',
    category: 'Engineering & Technology',
    managementType: 'Govt-Aided / Autonomous',
    aicteApprovalRef: 'AICTE/SRO/1-6102914/2024-25/EOA',
    academicYear: '2025-26',
    approvalStatus: 'Extension of Approval (EoA)',
    effectivePeriod: '2024-2026',
    sourceReference: 'https://www.aicte-india.org/directory/eoa-letters',
    datasetVersion: 'AICTE-EOA-v2025.2',
    lastRetrievedDate: '2025-10-15',
    claimStatus: 'verified_active',
    contactEmail: 'admin@psgtech.edu',
    website: 'https://www.psgtech.edu'
  },
  {
    id: 'inst-dtu-04',
    name: 'Delhi Technological University (DTU)',
    aictePermanentId: '1-4019283',
    state: 'Delhi (NCT)',
    district: 'North Delhi',
    category: 'Engineering & Technology',
    managementType: 'Government / State University',
    aicteApprovalRef: 'AICTE/NWRO/1-4019283/2024-25/EOA',
    academicYear: '2025-26',
    approvalStatus: 'Extension of Approval (EoA)',
    effectivePeriod: '2024-2027',
    sourceReference: 'https://www.aicte-india.org/directory/eoa-letters',
    datasetVersion: 'AICTE-EOA-v2025.2',
    lastRetrievedDate: '2025-10-15',
    claimStatus: 'verified_active',
    contactEmail: 'academic@dtu.ac.in',
    website: 'https://www.dtu.ac.in'
  },
  {
    id: 'inst-vjti-05',
    name: 'Veermata Jijabai Technological Institute (VJTI)',
    aictePermanentId: '1-4192801',
    state: 'Maharashtra',
    district: 'Mumbai City',
    category: 'Engineering & Technology',
    managementType: 'Govt-Aided / Autonomous',
    aicteApprovalRef: 'AICTE/WRO/1-4192801/2024-25/EOA',
    academicYear: '2025-26',
    approvalStatus: 'Extension of Approval (EoA)',
    effectivePeriod: '2024-2026',
    sourceReference: 'https://www.aicte-india.org/directory/eoa-letters',
    datasetVersion: 'AICTE-EOA-v2025.2',
    lastRetrievedDate: '2025-10-15',
    claimStatus: 'verified_active',
    contactEmail: 'director@vjti.ac.in',
    website: 'https://www.vjti.ac.in'
  },
  {
    id: 'inst-jntu-06',
    name: 'JNTUH University College of Engineering Hyderabad',
    aictePermanentId: '1-5019284',
    state: 'Telangana',
    district: 'Hyderabad',
    category: 'Engineering & Technology',
    managementType: 'Government / University Constituent',
    aicteApprovalRef: 'AICTE/SCRO/1-5019284/2024-25/EOA',
    academicYear: '2025-26',
    approvalStatus: 'Extension of Approval (EoA)',
    effectivePeriod: '2024-2026',
    sourceReference: 'https://www.aicte-india.org/directory/eoa-letters',
    datasetVersion: 'AICTE-EOA-v2025.2',
    lastRetrievedDate: '2025-10-15',
    claimStatus: 'claim_pending',
    contactEmail: 'principal.uceh@jntuh.ac.in',
    website: 'https://jntuhceh.ac.in'
  }
];

export const INITIAL_PROGRAMMES: Programme[] = [
  // COEP Programmes
  {
    id: 'prog-coep-cse',
    institutionId: 'inst-coep-01',
    name: 'B.Tech in Computer Engineering',
    code: 'BTECH-CE',
    department: 'Computer Engineering & IT',
    level: 'Undergraduate',
    approvedIntake: 120,
    academicYear: '2025-26',
    status: 'Active',
    aicteApprovalRef: 'AICTE/WRO/1-4328911/PROG-01',
    lastUpdated: '2025-08-01'
  },
  {
    id: 'prog-coep-ece',
    institutionId: 'inst-coep-01',
    name: 'B.Tech in Electronics & Telecommunication',
    code: 'BTECH-ETC',
    department: 'Electronics and Telecommunication',
    level: 'Undergraduate',
    approvedIntake: 120,
    academicYear: '2025-26',
    status: 'Active',
    aicteApprovalRef: 'AICTE/WRO/1-4328911/PROG-02',
    lastUpdated: '2025-08-01'
  },
  {
    id: 'prog-coep-mech',
    institutionId: 'inst-coep-01',
    name: 'B.Tech in Mechanical Engineering',
    code: 'BTECH-MECH',
    department: 'Mechanical Engineering',
    level: 'Undergraduate',
    approvedIntake: 120,
    academicYear: '2025-26',
    status: 'Active',
    aicteApprovalRef: 'AICTE/WRO/1-4328911/PROG-03',
    lastUpdated: '2025-08-01'
  },
  {
    id: 'prog-coep-mtech-ai',
    institutionId: 'inst-coep-01',
    name: 'M.Tech in Artificial Intelligence & Robotics',
    code: 'MTECH-AIR',
    department: 'Computer Engineering & IT',
    level: 'Postgraduate',
    approvedIntake: 30,
    academicYear: '2025-26',
    status: 'Active',
    aicteApprovalRef: 'AICTE/WRO/1-4328911/PROG-04',
    lastUpdated: '2025-08-01'
  },

  // RVCE Programmes
  {
    id: 'prog-rvce-cse',
    institutionId: 'inst-rvce-02',
    name: 'B.E. in Computer Science & Engineering',
    code: 'BE-CSE',
    department: 'Computer Science & Engineering',
    level: 'Undergraduate',
    approvedIntake: 180,
    academicYear: '2025-26',
    status: 'Active',
    aicteApprovalRef: 'AICTE/SRO/1-5289110/PROG-01',
    lastUpdated: '2025-08-01'
  },
  {
    id: 'prog-rvce-ise',
    institutionId: 'inst-rvce-02',
    name: 'B.E. in Information Science & Engineering',
    code: 'BE-ISE',
    department: 'Information Science',
    level: 'Undergraduate',
    approvedIntake: 120,
    academicYear: '2025-26',
    status: 'Active',
    aicteApprovalRef: 'AICTE/SRO/1-5289110/PROG-02',
    lastUpdated: '2025-08-01'
  },
  {
    id: 'prog-rvce-mca',
    institutionId: 'inst-rvce-02',
    name: 'Master of Computer Applications (MCA)',
    code: 'MCA-PG',
    department: 'Computer Applications',
    level: 'Postgraduate',
    approvedIntake: 60,
    academicYear: '2025-26',
    status: 'Active',
    aicteApprovalRef: 'AICTE/SRO/1-5289110/PROG-03',
    lastUpdated: '2025-08-01'
  },

  // PSG Tech Programmes
  {
    id: 'prog-psg-cse',
    institutionId: 'inst-psg-03',
    name: 'B.Tech in Computer Science and Engineering',
    code: 'BTECH-CSE-PSG',
    department: 'Computer Science',
    level: 'Undergraduate',
    approvedIntake: 120,
    academicYear: '2025-26',
    status: 'Active',
    aicteApprovalRef: 'AICTE/SRO/1-6102914/PROG-01',
    lastUpdated: '2025-08-01'
  },

  // DTU Programmes
  {
    id: 'prog-dtu-cse',
    institutionId: 'inst-dtu-04',
    name: 'B.Tech in Computer Science and Engineering',
    code: 'BTECH-CSE-DTU',
    department: 'Computer Science & Engineering',
    level: 'Undergraduate',
    approvedIntake: 240,
    academicYear: '2025-26',
    status: 'Active',
    aicteApprovalRef: 'AICTE/NWRO/1-4019283/PROG-01',
    lastUpdated: '2025-08-01'
  },

  // VJTI Programmes
  {
    id: 'prog-vjti-it',
    institutionId: 'inst-vjti-05',
    name: 'B.Tech in Information Technology',
    code: 'BTECH-IT-VJTI',
    department: 'Information Technology',
    level: 'Undergraduate',
    approvedIntake: 60,
    academicYear: '2025-26',
    status: 'Active',
    aicteApprovalRef: 'AICTE/WRO/1-4192801/PROG-01',
    lastUpdated: '2025-08-01'
  }
];

export const ACADEMIC_YEARS = ['2025-26', '2024-25', '2023-24'];
