import { User, Company, Contact, Activity, Proposal, Notification } from '@/types';

// Mock Users
export const mockUsers: User[] = [
  {
    id: '1',
    name: 'Arda Bozan',
    email: 'arda@aiesec.org',
    role: 'TeamMember',
    teamId: 'team1',
    createdAt: new Date('2025-01-15'),
  },
  {
    id: '2',
    name: 'Mehmet Yıldırım',
    email: 'mehmet@aiesec.org',
    role: 'TeamLeader',
    teamId: 'team1',
    createdAt: new Date('2024-09-01'),
  },
  {
    id: '3',
    name: 'Zehra Gümüşçü',
    email: 'zehra@aiesec.org',
    role: 'LCVP',
    createdAt: new Date('2024-06-01'),
  },
  {
    id: '4',
    name: 'Ali Zekioğlu',
    email: 'ali@aiesec.org',
    role: 'LCP',
    createdAt: new Date('2024-03-01'),
  },
  {
    id: '5',
    name: 'Aziz Şanverdi',
    email: 'aziz@aiesec.org',
    role: 'TeamMember',
    teamId: 'team1',
    createdAt: new Date('2025-02-01'),
  },
];

// Current User (for demo purposes)
export const currentUser: User = mockUsers[0];

// Mock Companies
export const mockCompanies: Company[] = [
  {
    id: '1',
    name: 'Global Teknoloji',
    category: 'Teknoloji',
    location: 'İstanbul, Özer Mahalle',
    phone: '+90 533 943 12 52',
    email: 'global@teknoloji.com',
    website: 'globalteknoloji.com',
    status: 'aktif',
    activeProposals: 8,
    contactCount: 5,
    createdAt: new Date('2025-06-01'),
    updatedAt: new Date('2026-02-20'),
    assignedTo: '1',
  },
  {
    id: '2',
    name: 'Savunma Bakanlığı',
    category: 'Kamu',
    location: 'İstanbul, Özer Mahalle',
    phone: '+90 533 123 45 67',
    email: 'info@savunma.gov.tr',
    status: 'pasif',
    activeProposals: 3,
    contactCount: 2,
    createdAt: new Date('2025-05-15'),
    updatedAt: new Date('2026-02-18'),
    assignedTo: '2',
  },
  {
    id: '3',
    name: 'Aselsan',
    category: 'Teknoloji',
    location: 'İstanbul, Özer Mahalle',
    phone: '+90 533 987 65 43',
    email: 'info@aselsan.com.tr',
    website: 'aselsan.com.tr',
    status: 'aktif',
    activeProposals: 0,
    contactCount: 0,
    createdAt: new Date('2025-07-01'),
    updatedAt: new Date('2026-02-15'),
    assignedTo: '1',
  },
  {
    id: '4',
    name: 'TechCorp Solutions',
    category: 'Teknoloji',
    location: 'Ankara, Çankaya',
    phone: '+90 312 456 78 90',
    email: 'contact@techcorp.com',
    status: 'aktif',
    activeProposals: 5,
    contactCount: 3,
    createdAt: new Date('2025-08-10'),
    updatedAt: new Date('2026-02-22'),
    assignedTo: '5',
  },
  {
    id: '5',
    name: 'StartUp Hub',
    category: 'Startup',
    location: 'İzmir, Konak',
    phone: '+90 232 111 22 33',
    email: 'hello@startuphub.io',
    website: 'startuphub.io',
    status: 'pozitif',
    activeProposals: 2,
    contactCount: 4,
    createdAt: new Date('2025-09-01'),
    updatedAt: new Date('2026-02-21'),
    assignedTo: '1',
  },
];

// Mock Contacts
export const mockContacts: Contact[] = [
  {
    id: '1',
    companyId: '1',
    name: 'Mehmet Yıldırım',
    email: 'mehmet@globalteknoloji.com',
    phone: '+90 533 111 22 33',
    position: 'CEO',
    isPrimary: true,
    createdAt: new Date('2025-06-01'),
  },
  {
    id: '2',
    companyId: '1',
    name: 'Aziz Şanverdi',
    email: 'aziz@globalteknoloji.com',
    phone: '+90 533 222 33 44',
    position: 'CTO',
    isPrimary: false,
    createdAt: new Date('2025-06-05'),
  },
  {
    id: '3',
    companyId: '1',
    name: 'Ali Nazgul',
    email: 'ali@globalteknoloji.com',
    phone: '+90 533 333 44 55',
    position: 'HR Manager',
    isPrimary: false,
    createdAt: new Date('2025-06-10'),
  },
  {
    id: '4',
    companyId: '1',
    name: 'Emine Meryem Karagül',
    email: 'emine@globalteknoloji.com',
    phone: '+90 533 444 55 66',
    position: 'Sales Director',
    isPrimary: false,
    createdAt: new Date('2025-06-15'),
  },
  {
    id: '5',
    companyId: '1',
    name: 'Semih Taş',
    email: 'semih@globalteknoloji.com',
    phone: '+90 533 555 66 77',
    position: 'Marketing Manager',
    isPrimary: false,
    createdAt: new Date('2025-06-20'),
  },
];

// Mock Activities
export const mockActivities: Activity[] = [
  {
    id: '1',
    companyId: '1',
    userId: '1',
    userName: 'Arda Bozan',
    type: 'postponed',
    status: 'completed',
    notes: 'Tekrar görüşme yapılacak',
    completedAt: new Date('2026-02-21'),
    createdAt: new Date('2026-02-21'),
  },
  {
    id: '2',
    companyId: '1',
    userId: '2',
    userName: 'Mehmet Yıldırım',
    type: 'meeting',
    status: 'completed',
    notes: 'Toplantı tamamlandı',
    completedAt: new Date('2026-02-18'),
    createdAt: new Date('2026-02-18'),
  },
  {
    id: '3',
    companyId: '1',
    userId: '3',
    userName: 'Zehra Gümüşçü',
    type: 'cold_call',
    status: 'completed',
    notes: 'İlk arama yapıldı',
    completedAt: new Date('2026-02-16'),
    createdAt: new Date('2026-02-16'),
  },
  {
    id: '4',
    companyId: '1',
    userId: '4',
    userName: 'Ali Zekioğlu',
    type: 'proposal',
    status: 'completed',
    notes: 'Teklif sunuldu',
    completedAt: new Date('2026-01-23'),
    createdAt: new Date('2026-01-23'),
  },
  {
    id: '5',
    companyId: '2',
    userId: '1',
    userName: 'Ali Nazgul',
    type: 'cold_call',
    status: 'completed',
    notes: 'Teklif sunulacak',
    completedAt: new Date('2026-02-23'),
    createdAt: new Date('2026-02-23'),
  },
  {
    id: '6',
    companyId: '2',
    userId: '5',
    userName: 'Aziz Şanverdi',
    type: 'meeting',
    status: 'pending',
    notes: 'Tekrar görüşme yapılacak',
    scheduledAt: new Date('2026-02-25'),
    createdAt: new Date('2026-02-23'),
  },
  {
    id: '7',
    companyId: '1',
    userId: '1',
    userName: 'Arda Bozan',
    type: 'cold_call',
    status: 'completed',
    notes: 'Takip araması yapıldı',
    completedAt: new Date('2026-02-14'),
    createdAt: new Date('2026-02-14'),
  },
  {
    id: '8',
    companyId: '1',
    userId: '2',
    userName: 'Mehmet Yıldırım',
    type: 'meeting',
    status: 'completed',
    notes: 'Detaylı sunum yapıldı',
    completedAt: new Date('2026-02-12'),
    createdAt: new Date('2026-02-12'),
  },
  {
    id: '9',
    companyId: '1',
    userId: '3',
    userName: 'Zehra Gümüşçü',
    type: 'postponed',
    status: 'completed',
    notes: 'Bütçe onayı bekleniyor',
    completedAt: new Date('2026-02-10'),
    createdAt: new Date('2026-02-10'),
  },
  {
    id: '10',
    companyId: '1',
    userId: '4',
    userName: 'Ali Zekioğlu',
    type: 'proposal',
    status: 'completed',
    notes: 'Revize teklif gönderildi',
    completedAt: new Date('2026-02-08'),
    createdAt: new Date('2026-02-08'),
  },
];

// Mock Proposals
export const mockProposals: Proposal[] = [
  {
    id: '1',
    companyId: '1',
    title: 'Yazılım Geliştirme Projesi',
    value: 76753,
    currency: 'TL',
    stage: 'proposal',
    probability: 60,
    ownerId: '1',
    ownerName: 'Arda Bozan',
    nextAction: 'Follow up call',
    nextActionDate: new Date('2026-02-25'),
    createdAt: new Date('2026-01-15'),
    updatedAt: new Date('2026-02-20'),
  },
  {
    id: '2',
    companyId: '1',
    title: 'Danışmanlık Hizmeti',
    value: 95531,
    currency: 'TL',
    stage: 'negotiation',
    probability: 75,
    ownerId: '2',
    ownerName: 'Mehmet Yıldırım',
    nextAction: 'Contract review',
    nextActionDate: new Date('2026-02-26'),
    createdAt: new Date('2026-01-20'),
    updatedAt: new Date('2026-02-22'),
  },
  {
    id: '3',
    companyId: '1',
    title: 'Eğitim Programı',
    value: 53647,
    currency: 'TL',
    stage: 'qualified',
    probability: 40,
    ownerId: '1',
    ownerName: 'Arda Bozan',
    createdAt: new Date('2026-02-01'),
    updatedAt: new Date('2026-02-18'),
  },
  {
    id: '4',
    companyId: '1',
    title: 'Teknik Destek Sözleşmesi',
    value: 36764,
    currency: 'TL',
    stage: 'new_lead',
    probability: 20,
    ownerId: '5',
    ownerName: 'Aziz Şanverdi',
    createdAt: new Date('2026-02-10'),
    updatedAt: new Date('2026-02-20'),
  },
  {
    id: '5',
    companyId: '1',
    title: 'Yıllık Bakım Anlaşması',
    value: 86435,
    currency: 'TL',
    stage: 'closed_won',
    probability: 100,
    ownerId: '1',
    ownerName: 'Arda Bozan',
    createdAt: new Date('2025-12-01'),
    updatedAt: new Date('2026-02-15'),
  },
];

// Mock Notifications
export const mockNotifications: Notification[] = [
  {
    id: '1',
    userId: '1',
    title: 'Yeni Aktivite',
    message: 'Global Teknoloji için yeni bir toplantı planlandı',
    type: 'info',
    read: false,
    createdAt: new Date('2026-02-23'),
  },
];

// Helper function to get company by ID
export const getCompanyById = (id: string): Company | undefined => {
  return mockCompanies.find(c => c.id === id);
};

// Helper function to get contacts by company ID
export const getContactsByCompanyId = (companyId: string): Contact[] => {
  return mockContacts.filter(c => c.companyId === companyId);
};

// Helper function to get activities by company ID
export const getActivitiesByCompanyId = (companyId: string): Activity[] => {
  return mockActivities.filter(a => a.companyId === companyId);
};

// Helper function to get proposals by company ID
export const getProposalsByCompanyId = (companyId: string): Proposal[] => {
  return mockProposals.filter(p => p.companyId === companyId);
};
