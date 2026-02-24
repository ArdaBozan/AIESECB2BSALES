'use client';

import React, { createContext, useContext, useState, useCallback, useMemo } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { mockCompanies, mockContacts, mockProposals, mockActivities } from '@/data/mockData';

// Search result types
export interface SearchResult {
  id: string;
  type: 'company' | 'contact' | 'deal' | 'activity';
  title: string;
  subtitle: string;
  href: string;
  icon?: string;
}

// Page search config
interface PageSearchConfig {
  placeholder: string;
  searchTypes: SearchResult['type'][];
}

const pageSearchConfigs: Record<string, PageSearchConfig> = {
  '/': {
    placeholder: 'Şirket, kişi veya teklif aratın...',
    searchTypes: ['company', 'contact', 'deal'],
  },
  '/sirketler': {
    placeholder: 'Şirket adı, kategori veya lokasyon aratın...',
    searchTypes: ['company'],
  },
  '/kisiler': {
    placeholder: 'Kişi adı, email veya pozisyon aratın...',
    searchTypes: ['contact'],
  },
  '/teklifler': {
    placeholder: 'Teklif başlığı, şirket veya sahip aratın...',
    searchTypes: ['deal'],
  },
  '/aktiviteler': {
    placeholder: 'Şirket veya aktivite türü aratın...',
    searchTypes: ['company', 'activity'],
  },
};

interface SearchContextType {
  query: string;
  setQuery: (query: string) => void;
  results: SearchResult[];
  isSearching: boolean;
  placeholder: string;
  clearSearch: () => void;
  navigateToResult: (result: SearchResult) => void;
}

const SearchContext = createContext<SearchContextType | undefined>(undefined);

export function SearchProvider({ children }: { children: React.ReactNode }) {
  const [query, setQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  // Get current page config
  const pageConfig = useMemo(() => {
    // Check for dynamic routes
    if (pathname.startsWith('/sirketler/')) {
      return pageSearchConfigs['/sirketler'];
    }
    return pageSearchConfigs[pathname] || pageSearchConfigs['/'];
  }, [pathname]);

  // Search function
  const results = useMemo(() => {
    if (!query || query.length < 2) return [];

    const searchLower = query.toLowerCase();
    const searchResults: SearchResult[] = [];
    const searchTypes = pageConfig.searchTypes;

    // Search companies
    if (searchTypes.includes('company')) {
      mockCompanies.forEach(company => {
        if (
          company.name.toLowerCase().includes(searchLower) ||
          company.category.toLowerCase().includes(searchLower) ||
          company.location.toLowerCase().includes(searchLower)
        ) {
          searchResults.push({
            id: company.id,
            type: 'company',
            title: company.name,
            subtitle: `${company.category} • ${company.location}`,
            href: `/sirketler/${company.id}`,
            icon: 'building',
          });
        }
      });
    }

    // Search contacts
    if (searchTypes.includes('contact')) {
      mockContacts.forEach(contact => {
        const company = mockCompanies.find(c => c.id === contact.companyId);
        if (
          contact.name.toLowerCase().includes(searchLower) ||
          (contact.email && contact.email.toLowerCase().includes(searchLower)) ||
          (contact.position && contact.position.toLowerCase().includes(searchLower))
        ) {
          searchResults.push({
            id: contact.id,
            type: 'contact',
            title: contact.name,
            subtitle: `${contact.position || 'Kişi'} • ${company?.name || 'Bilinmiyor'}`,
            href: `/kisiler?highlight=${contact.id}`,
            icon: 'user',
          });
        }
      });
    }

    // Search deals/proposals
    if (searchTypes.includes('deal')) {
      mockProposals.forEach(proposal => {
        const company = mockCompanies.find(c => c.id === proposal.companyId);
        if (
          proposal.title.toLowerCase().includes(searchLower) ||
          proposal.ownerName.toLowerCase().includes(searchLower) ||
          (company && company.name.toLowerCase().includes(searchLower))
        ) {
          searchResults.push({
            id: proposal.id,
            type: 'deal',
            title: proposal.title,
            subtitle: `${company?.name || 'Bilinmiyor'} • ${new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY' }).format(proposal.value)}`,
            href: `/teklifler?highlight=${proposal.id}`,
            icon: 'dollar',
          });
        }
      });
    }

    // Limit results
    return searchResults.slice(0, 8);
  }, [query, pageConfig.searchTypes]);

  const clearSearch = useCallback(() => {
    setQuery('');
  }, []);

  const navigateToResult = useCallback((result: SearchResult) => {
    router.push(result.href);
    clearSearch();
  }, [router, clearSearch]);

  return (
    <SearchContext.Provider
      value={{
        query,
        setQuery,
        results,
        isSearching,
        placeholder: pageConfig.placeholder,
        clearSearch,
        navigateToResult,
      }}
    >
      {children}
    </SearchContext.Provider>
  );
}

export function useSearch() {
  const context = useContext(SearchContext);
  if (context === undefined) {
    throw new Error('useSearch must be used within a SearchProvider');
  }
  return context;
}
