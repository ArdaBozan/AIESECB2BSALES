'use client';

import React, { useState } from 'react';
import { X, Filter, RotateCcw } from 'lucide-react';
import { CompanyFilter } from '@/types';
import './FilterPanel.css';

interface FilterPanelProps {
  onClose: () => void;
  onApply: (filters: CompanyFilter) => void;
  onReset: () => void;
  initialFilters?: CompanyFilter;
}

const categories = ['Teknoloji', 'Kamu', 'Startup', 'Finans', 'Sağlık', 'Eğitim'];
const contactCounts = [
  { value: '', label: 'Tümü' },
  { value: 'none', label: 'Bağlantı Yok' },
  { value: 'some', label: '1-5 Bağlantı' },
  { value: 'many', label: '5+ Bağlantı' },
];
const proposalStatuses = [
  { value: '', label: 'Tümü' },
  { value: 'true', label: 'Teklif Var' },
  { value: 'false', label: 'Teklif Yok' },
];
const companyStatuses = [
  { value: '', label: 'Aktif & Pasif' },
  { value: 'aktif', label: 'Sadece Aktif' },
  { value: 'pasif', label: 'Sadece Pasif' },
];

export default function FilterPanel({ 
  onClose, 
  onApply, 
  onReset,
  initialFilters = {} 
}: FilterPanelProps) {
  const [filters, setFilters] = useState<CompanyFilter>(initialFilters);

  const handleChange = (key: keyof CompanyFilter, value: string) => {
    setFilters(prev => ({
      ...prev,
      [key]: value || undefined,
    }));
  };

  const handleApply = () => {
    onApply(filters);
    onClose();
  };

  const handleReset = () => {
    setFilters({});
    onReset();
  };

  return (
    <div className="filter-panel">
      <div className="filter-panel__header">
        <h3 className="filter-panel__title">Filtrele</h3>
        <button className="filter-panel__close" onClick={onClose}>
          <X className="filter-panel__close-icon" />
        </button>
      </div>

      <div className="filter-panel__group">
        <label className="filter-panel__label">Kategori</label>
        <select 
          className="filter-panel__select"
          value={filters.category || ''}
          onChange={(e) => handleChange('category', e.target.value)}
        >
          <option value="">Tümü</option>
          {categories.map(cat => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>
      </div>

      <div className="filter-panel__group">
        <label className="filter-panel__label">Bağlantı Sayısı</label>
        <select 
          className="filter-panel__select"
          value={filters.contactCount || ''}
          onChange={(e) => handleChange('contactCount', e.target.value)}
        >
          {contactCounts.map(opt => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
      </div>

      <div className="filter-panel__group">
        <label className="filter-panel__label">Teklif Durumu</label>
        <select 
          className="filter-panel__select"
          value={filters.hasProposal !== undefined ? String(filters.hasProposal) : ''}
          onChange={(e) => handleChange('hasProposal', e.target.value)}
        >
          {proposalStatuses.map(opt => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
      </div>

      <div className="filter-panel__group">
        <label className="filter-panel__label">Durum</label>
        <select 
          className="filter-panel__select"
          value={filters.status || ''}
          onChange={(e) => handleChange('status', e.target.value)}
        >
          {companyStatuses.map(opt => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
      </div>

      <div className="filter-panel__actions">
        <button className="filter-panel__btn filter-panel__btn--primary" onClick={handleApply}>
          <Filter className="filter-panel__btn-icon" />
          Filtrele
        </button>
        <button className="filter-panel__btn filter-panel__btn--secondary" onClick={handleReset}>
          <RotateCcw className="filter-panel__btn-icon" />
          Temizle
        </button>
      </div>
    </div>
  );
}
