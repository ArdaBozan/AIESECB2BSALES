'use client';

import React, { useState, useMemo, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Building2, Filter, Plus, X, Save } from 'lucide-react';
import { mockCompanies, mockActivities } from '@/data/mockData';
import { CompanyCard, CompanySidebar } from '@/components/companies';
import FilterPanel from '@/components/common/FilterPanel';
import Modal from '@/components/common/Modal';
import { Company, CompanyFilter, CompanyStatus } from '@/types';
import './page.css';

const categories = ['Teknoloji', 'Kamu', 'Startup', 'Finans', 'Sağlık', 'Eğitim'];
const statuses: { value: CompanyStatus; label: string }[] = [
  { value: 'aktif', label: 'Aktif' },
  { value: 'pasif', label: 'Pasif' },
  { value: 'pozitif', label: 'Pozitif' },
  { value: 'negatif', label: 'Negatif' },
];

export default function CompaniesPage() {
  const router = useRouter();
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);
  const [showFilter, setShowFilter] = useState(false);
  const [filters, setFilters] = useState<CompanyFilter>({});
  const [visibleCount, setVisibleCount] = useState(12);
  const [isMobile, setIsMobile] = useState(false);
  const [showMobileModal, setShowMobileModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const filterWrapperRef = useRef<HTMLDivElement>(null);

  // Add company form state
  const [newCompany, setNewCompany] = useState({
    name: '',
    category: '',
    location: '',
    phone: '',
    email: '',
    website: '',
    status: 'aktif' as CompanyStatus,
    notes: '',
  });

  // Close filter dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (filterWrapperRef.current && !filterWrapperRef.current.contains(event.target as Node)) {
        setShowFilter(false);
      }
    };

    if (showFilter) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showFilter]);

  // Check if mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 1100);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Lock body scroll when modal is open
  useEffect(() => {
    if (showMobileModal) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [showMobileModal]);

  // Close modal on escape
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setShowMobileModal(false);
        if (!isMobile) setSelectedCompany(null);
      }
    };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isMobile]);

  const filteredCompanies = useMemo(() => {
    return mockCompanies.filter(company => {
      if (filters.category && company.category !== filters.category) return false;
      if (filters.status && company.status !== filters.status) return false;
      if (filters.hasProposal !== undefined) {
        const hasProposal = company.activeProposals > 0;
        if (filters.hasProposal !== hasProposal) return false;
      }
      if (filters.contactCount) {
        if (filters.contactCount === 'none' && company.contactCount > 0) return false;
        if (filters.contactCount === 'some' && (company.contactCount < 1 || company.contactCount > 5)) return false;
        if (filters.contactCount === 'many' && company.contactCount <= 5) return false;
      }
      return true;
    });
  }, [filters]);

  const displayedCompanies = filteredCompanies.slice(0, visibleCount);
  const hasMore = visibleCount < filteredCompanies.length;

  const handleCompanyClick = (company: Company) => {
    setSelectedCompany(company);
    if (isMobile) {
      setShowMobileModal(true);
    }
  };

  const handleCloseModal = () => {
    setShowMobileModal(false);
  };

  const handleApplyFilters = (newFilters: CompanyFilter) => {
    setFilters(newFilters);
    setVisibleCount(12);
  };

  const handleResetFilters = () => {
    setFilters({});
    setVisibleCount(12);
  };

  const handleLoadMore = () => {
    setVisibleCount(prev => prev + 12);
  };

  const handleAddCompany = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, this would submit to an API
    alert(`Şirket eklendi: ${newCompany.name}`);
    setShowAddModal(false);
    setNewCompany({
      name: '',
      category: '',
      location: '',
      phone: '',
      email: '',
      website: '',
      status: 'aktif',
      notes: '',
    });
  };

  const recentActivities = selectedCompany 
    ? mockActivities.filter(a => a.companyId === selectedCompany.id)
    : [];

  return (
    <div className="companies-page">
      <div className="companies-page__main">
        <div className="companies-page__header">
          <div className="companies-page__title">
            <Building2 className="companies-page__title-icon" />
            <h1 className="companies-page__title-text">Tüm Şirketler</h1>
          </div>
          <div className="companies-page__actions">
            <div className="companies-page__filter-wrapper" ref={filterWrapperRef}>
              <button 
                className="companies-page__filter-btn"
                onClick={() => setShowFilter(!showFilter)}
              >
                <Filter className="companies-page__filter-btn-icon" />
                Filtrele
              </button>
              {showFilter && (
                <div className="companies-page__filter-dropdown">
                  <FilterPanel
                    onClose={() => setShowFilter(false)}
                    onApply={handleApplyFilters}
                    onReset={handleResetFilters}
                    initialFilters={filters}
                  />
                </div>
              )}
            </div>
            <button 
              className="companies-page__add-btn"
              onClick={() => setShowAddModal(true)}
            >
              <Plus className="companies-page__add-btn-icon" />
              Yeni Şirket Ekle
            </button>
          </div>
        </div>

        <div className="companies-page__grid">
          {displayedCompanies.map((company) => (
            <CompanyCard 
              key={company.id} 
              company={company} 
              onClick={() => handleCompanyClick(company)}
            />
          ))}
        </div>

        {hasMore && (
          <div className="companies-page__load-more">
            <button 
              className="companies-page__load-more-btn"
              onClick={handleLoadMore}
            >
              Daha Fazla Yükle
            </button>
          </div>
        )}
      </div>

      {selectedCompany && (
        <CompanySidebar
          company={selectedCompany}
          recentActivities={recentActivities}
          onViewProfile={() => router.push(`/sirketler/${selectedCompany.id}`)}
          onManageActivities={() => router.push('/aktiviteler')}
        />
      )}

      {/* Mobile Modal */}
      {showMobileModal && selectedCompany && (
        <>
          <div 
            className="companies-page__modal-overlay"
            onClick={handleCloseModal}
          />
          <div className="companies-page__modal">
            <button 
              className="companies-page__modal-close"
              onClick={handleCloseModal}
            >
              <X />
            </button>
            <CompanySidebar
              company={selectedCompany}
              recentActivities={recentActivities}
              onViewProfile={() => {
                handleCloseModal();
                router.push(`/sirketler/${selectedCompany.id}`);
              }}
              onManageActivities={() => {
                handleCloseModal();
                router.push('/aktiviteler');
              }}
            />
          </div>
        </>
      )}

      {/* Add Company Modal */}
      <Modal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        title="Yeni Şirket Ekle"
        maxWidth="600px"
      >
        <form className="modal__form" onSubmit={handleAddCompany}>
          <div className="modal__section">
            <h4 className="modal__section-title">Şirket Bilgileri</h4>
            <div className="modal__row">
              <div className="modal__field">
                <label className="modal__label modal__label--required">Şirket Adı</label>
                <input
                  type="text"
                  className="modal__input"
                  placeholder="Şirket adı girin"
                  value={newCompany.name}
                  onChange={(e) => setNewCompany(prev => ({ ...prev, name: e.target.value }))}
                  required
                />
              </div>
              <div className="modal__field">
                <label className="modal__label modal__label--required">Kategori</label>
                <select
                  className="modal__select"
                  value={newCompany.category}
                  onChange={(e) => setNewCompany(prev => ({ ...prev, category: e.target.value }))}
                  required
                >
                  <option value="">Kategori seçin</option>
                  {categories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="modal__row">
              <div className="modal__field">
                <label className="modal__label modal__label--required">Konum</label>
                <input
                  type="text"
                  className="modal__input"
                  placeholder="Şehir, Ülke"
                  value={newCompany.location}
                  onChange={(e) => setNewCompany(prev => ({ ...prev, location: e.target.value }))}
                  required
                />
              </div>
              <div className="modal__field">
                <label className="modal__label">Durum</label>
                <select
                  className="modal__select"
                  value={newCompany.status}
                  onChange={(e) => setNewCompany(prev => ({ ...prev, status: e.target.value as CompanyStatus }))}
                >
                  {statuses.map(s => (
                    <option key={s.value} value={s.value}>{s.label}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          <div className="modal__section">
            <h4 className="modal__section-title">İletişim Bilgileri</h4>
            <div className="modal__row">
              <div className="modal__field">
                <label className="modal__label">Telefon</label>
                <input
                  type="tel"
                  className="modal__input"
                  placeholder="+90 XXX XXX XX XX"
                  value={newCompany.phone}
                  onChange={(e) => setNewCompany(prev => ({ ...prev, phone: e.target.value }))}
                />
              </div>
              <div className="modal__field">
                <label className="modal__label">E-posta</label>
                <input
                  type="email"
                  className="modal__input"
                  placeholder="info@sirket.com"
                  value={newCompany.email}
                  onChange={(e) => setNewCompany(prev => ({ ...prev, email: e.target.value }))}
                />
              </div>
            </div>
            <div className="modal__field">
              <label className="modal__label">Website</label>
              <input
                type="url"
                className="modal__input"
                placeholder="https://www.sirket.com"
                value={newCompany.website}
                onChange={(e) => setNewCompany(prev => ({ ...prev, website: e.target.value }))}
              />
            </div>
          </div>

          <div className="modal__section">
            <h4 className="modal__section-title">Notlar</h4>
            <div className="modal__field">
              <textarea
                className="modal__textarea"
                placeholder="Şirket hakkında notlar..."
                value={newCompany.notes}
                onChange={(e) => setNewCompany(prev => ({ ...prev, notes: e.target.value }))}
                rows={3}
              />
            </div>
          </div>

          <div className="modal__actions">
            <button
              type="button"
              className="modal__btn modal__btn--secondary"
              onClick={() => setShowAddModal(false)}
            >
              İptal
            </button>
            <button type="submit" className="modal__btn modal__btn--primary">
              <Save />
              Kaydet
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
