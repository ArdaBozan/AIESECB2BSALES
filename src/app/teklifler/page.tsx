'use client';

import React, { useState, useCallback, useRef, useEffect } from 'react';
import { DollarSign, Filter, Plus, User, Building2, Calendar, Percent, X, RotateCcw, Save } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { mockProposals as initialProposals, mockCompanies } from '@/data/mockData';
import { DealStage, Proposal } from '@/types';
import Modal from '@/components/common/Modal';
import './page.css';

// Filter types for deals
interface DealFilter {
  stage?: DealStage;
  probability?: 'low' | 'medium' | 'high';
  owner?: string;
}

const stages: { id: DealStage; label: string }[] = [
  { id: 'new_lead', label: 'Yeni Lead' },
  { id: 'qualified', label: 'Nitelikli' },
  { id: 'proposal', label: 'Teklif' },
  { id: 'negotiation', label: 'Müzakere' },
  { id: 'closed_won', label: 'Kazanıldı' },
  { id: 'closed_lost', label: 'Kaybedildi' },
];

// Get unique owners from proposals
const uniqueOwners = Array.from(new Set(initialProposals.map(p => p.ownerName)));

export default function DealsPage() {
  const { permissions } = useAuth();
  const [proposals, setProposals] = useState<Proposal[]>(initialProposals);
  const [draggedProposal, setDraggedProposal] = useState<string | null>(null);
  const [dragOverColumn, setDragOverColumn] = useState<DealStage | null>(null);
  const [showFilter, setShowFilter] = useState(false);
  const [filters, setFilters] = useState<DealFilter>({});
  const [showAddModal, setShowAddModal] = useState(false);
  
  // Add deal form state
  const [newDeal, setNewDeal] = useState({
    companyId: '',
    title: '',
    value: '',
    stage: 'new_lead' as DealStage,
    probability: 20,
    nextAction: '',
  });
  
  // Touch drag state
  const touchStartRef = useRef<{ x: number; y: number; proposalId: string } | null>(null);
  const draggedElementRef = useRef<HTMLElement | null>(null);
  const kanbanRef = useRef<HTMLDivElement>(null);
  const filterWrapperRef = useRef<HTMLDivElement>(null);

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

  // Filter proposals
  const filteredProposals = React.useMemo(() => {
    return proposals.filter(p => {
      // Filter by stage
      if (filters.stage && p.stage !== filters.stage) return false;
      
      // Filter by probability
      if (filters.probability) {
        if (filters.probability === 'low' && p.probability > 30) return false;
        if (filters.probability === 'medium' && (p.probability <= 30 || p.probability > 70)) return false;
        if (filters.probability === 'high' && p.probability <= 70) return false;
      }
      
      // Filter by owner
      if (filters.owner && p.ownerName !== filters.owner) return false;
      
      return true;
    });
  }, [proposals, filters]);

  // Group proposals by stage
  const proposalsByStage = React.useMemo(() => {
    const grouped: Record<DealStage, Proposal[]> = {
      new_lead: [],
      qualified: [],
      proposal: [],
      negotiation: [],
      closed_won: [],
      closed_lost: [],
    };

    filteredProposals.forEach(p => {
      grouped[p.stage].push(p);
    });

    return grouped;
  }, [filteredProposals]);

  // Calculate stats
  const totalValue = filteredProposals.reduce((sum, p) => sum + p.value, 0);
  const avgProbability = filteredProposals.length > 0 
    ? Math.round(filteredProposals.reduce((sum, p) => sum + p.probability, 0) / filteredProposals.length)
    : 0;
  const wonValue = filteredProposals
    .filter(p => p.stage === 'closed_won')
    .reduce((sum, p) => sum + p.value, 0);

  // Filter handlers
  const handleApplyFilters = (newFilters: DealFilter) => {
    setFilters(newFilters);
    setShowFilter(false);
  };

  const handleResetFilters = () => {
    setFilters({});
  };

  // Add deal handler
  const handleAddDeal = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, this would submit to an API
    alert(`Teklif eklendi: ${newDeal.title}`);
    setShowAddModal(false);
    setNewDeal({
      companyId: '',
      title: '',
      value: '',
      stage: 'new_lead',
      probability: 20,
      nextAction: '',
    });
  };

  // Drag handlers
  const handleDragStart = useCallback((e: React.DragEvent, proposalId: string) => {
    setDraggedProposal(proposalId);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', proposalId);
    
    // Add dragging class after a small delay for visual feedback
    setTimeout(() => {
      const element = e.target as HTMLElement;
      element.classList.add('deal-card--dragging');
    }, 0);
  }, []);

  const handleDragEnd = useCallback((e: React.DragEvent) => {
    setDraggedProposal(null);
    setDragOverColumn(null);
    const element = e.target as HTMLElement;
    element.classList.remove('deal-card--dragging');
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent, stageId: DealStage) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    setDragOverColumn(stageId);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    // Only clear if leaving the column entirely
    const relatedTarget = e.relatedTarget as HTMLElement;
    if (!relatedTarget?.closest('.kanban__column')) {
      setDragOverColumn(null);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent, targetStage: DealStage) => {
    e.preventDefault();
    const proposalId = e.dataTransfer.getData('text/plain');
    
    if (proposalId) {
      setProposals(prev => prev.map(p => 
        p.id === proposalId ? { ...p, stage: targetStage } : p
      ));
    }
    
    setDraggedProposal(null);
    setDragOverColumn(null);
  }, []);

  // Touch handlers for mobile drag
  const handleTouchStart = useCallback((e: React.TouchEvent, proposalId: string) => {
    const touch = e.touches[0];
    touchStartRef.current = {
      x: touch.clientX,
      y: touch.clientY,
      proposalId
    };
    draggedElementRef.current = e.currentTarget as HTMLElement;
  }, []);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    if (!touchStartRef.current || !draggedElementRef.current) return;

    const touch = e.touches[0];
    const deltaX = Math.abs(touch.clientX - touchStartRef.current.x);
    const deltaY = Math.abs(touch.clientY - touchStartRef.current.y);

    // If moving more horizontally, we're likely trying to scroll the kanban
    if (deltaX > deltaY && deltaX > 10) {
      return;
    }

    // If moving vertically enough, start drag
    if (deltaY > 20) {
      e.preventDefault();
      setDraggedProposal(touchStartRef.current.proposalId);
      draggedElementRef.current.classList.add('deal-card--dragging');

      // Find which column we're over
      const columns = document.querySelectorAll('.kanban__column');
      columns.forEach(column => {
        const rect = column.getBoundingClientRect();
        if (touch.clientX >= rect.left && touch.clientX <= rect.right) {
          const stageId = column.getAttribute('data-stage') as DealStage;
          if (stageId) {
            setDragOverColumn(stageId);
          }
        }
      });
    }
  }, []);

  const handleTouchEnd = useCallback((e: React.TouchEvent) => {
    if (!touchStartRef.current || !draggedProposal) {
      touchStartRef.current = null;
      draggedElementRef.current = null;
      return;
    }

    const touch = e.changedTouches[0];
    const columns = document.querySelectorAll('.kanban__column');
    
    columns.forEach(column => {
      const rect = column.getBoundingClientRect();
      if (touch.clientX >= rect.left && touch.clientX <= rect.right &&
          touch.clientY >= rect.top && touch.clientY <= rect.bottom) {
        const stageId = column.getAttribute('data-stage') as DealStage;
        if (stageId) {
          setProposals(prev => prev.map(p => 
            p.id === touchStartRef.current?.proposalId ? { ...p, stage: stageId } : p
          ));
        }
      }
    });

    if (draggedElementRef.current) {
      draggedElementRef.current.classList.remove('deal-card--dragging');
    }
    
    setDraggedProposal(null);
    setDragOverColumn(null);
    touchStartRef.current = null;
    draggedElementRef.current = null;
  }, [draggedProposal]);

  if (!permissions.canViewDeals) {
    return (
      <div className="deals-page">
        <div className="deals-page__header">
          <div className="deals-page__title">
            <DollarSign className="deals-page__title-icon" />
            <h1 className="deals-page__title-text">Teklifler</h1>
          </div>
        </div>
        <p style={{ color: 'var(--text-light)', textAlign: 'center', padding: 'var(--spacing-2xl)' }}>
          Bu sayfayı görüntüleme yetkiniz bulunmamaktadır.
        </p>
      </div>
    );
  }

  return (
    <div className="deals-page">
      <div className="deals-page__header">
        <div className="deals-page__title">
          <DollarSign className="deals-page__title-icon" />
          <h1 className="deals-page__title-text">Teklifler Pipeline</h1>
        </div>
        <div className="deals-page__actions">
          <div className="deals-page__filter-wrapper" ref={filterWrapperRef}>
            <button 
              className="deals-page__filter-btn"
              onClick={() => setShowFilter(!showFilter)}
            >
              <Filter className="deals-page__filter-btn-icon" />
              Filtrele
            </button>
            {showFilter && (
              <div className="deals-page__filter-dropdown">
                <div className="filter-panel">
                  <div className="filter-panel__header">
                    <h3 className="filter-panel__title">Filtrele</h3>
                    <button className="filter-panel__close" onClick={() => setShowFilter(false)}>
                      <X className="filter-panel__close-icon" />
                    </button>
                  </div>

                  <div className="filter-panel__group">
                    <label className="filter-panel__label">Aşama</label>
                    <select 
                      className="filter-panel__select"
                      value={filters.stage || ''}
                      onChange={(e) => setFilters(prev => ({ ...prev, stage: e.target.value as DealStage || undefined }))}
                    >
                      <option value="">Tümü</option>
                      {stages.map(s => (
                        <option key={s.id} value={s.id}>{s.label}</option>
                      ))}
                    </select>
                  </div>

                  <div className="filter-panel__group">
                    <label className="filter-panel__label">Olasılık</label>
                    <select 
                      className="filter-panel__select"
                      value={filters.probability || ''}
                      onChange={(e) => setFilters(prev => ({ ...prev, probability: e.target.value as 'low' | 'medium' | 'high' || undefined }))}
                    >
                      <option value="">Tümü</option>
                      <option value="low">Düşük (%0-30)</option>
                      <option value="medium">Orta (%31-70)</option>
                      <option value="high">Yüksek (%71-100)</option>
                    </select>
                  </div>

                  <div className="filter-panel__group">
                    <label className="filter-panel__label">Sorumlu</label>
                    <select 
                      className="filter-panel__select"
                      value={filters.owner || ''}
                      onChange={(e) => setFilters(prev => ({ ...prev, owner: e.target.value || undefined }))}
                    >
                      <option value="">Tümü</option>
                      {uniqueOwners.map(owner => (
                        <option key={owner} value={owner}>{owner}</option>
                      ))}
                    </select>
                  </div>

                  <div className="filter-panel__actions">
                    <button 
                      className="filter-panel__btn filter-panel__btn--primary" 
                      onClick={() => handleApplyFilters(filters)}
                    >
                      <Filter className="filter-panel__btn-icon" />
                      Filtrele
                    </button>
                    <button 
                      className="filter-panel__btn filter-panel__btn--secondary" 
                      onClick={handleResetFilters}
                    >
                      <RotateCcw className="filter-panel__btn-icon" />
                      Temizle
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
          <button 
            className="deals-page__add-btn"
            onClick={() => setShowAddModal(true)}
          >
            <Plus className="deals-page__add-btn-icon" />
            Yeni Teklif
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="deals-page__stats">
        <div className="deals-page__stat">
          <div className="deals-page__stat-label">Toplam Teklif Değeri</div>
          <div className="deals-page__stat-value deals-page__stat-value--currency">
            {totalValue.toLocaleString('tr-TR')} TL
          </div>
        </div>
        <div className="deals-page__stat">
          <div className="deals-page__stat-label">Ortalama Olasılık</div>
          <div className="deals-page__stat-value">{avgProbability}%</div>
        </div>
        <div className="deals-page__stat">
          <div className="deals-page__stat-label">Kazanılan Değer</div>
          <div className="deals-page__stat-value deals-page__stat-value--currency">
            {wonValue.toLocaleString('tr-TR')} TL
          </div>
        </div>
        <div className="deals-page__stat">
          <div className="deals-page__stat-label">Aktif Teklif</div>
          <div className="deals-page__stat-value">
            {filteredProposals.filter(p => !['closed_won', 'closed_lost'].includes(p.stage)).length}
          </div>
        </div>
      </div>

      {/* Kanban Board */}
      <div className="kanban-wrapper" ref={kanbanRef}>
        <div className="kanban">
          {stages.map((stage) => (
            <div 
              key={stage.id} 
              className={`kanban__column ${dragOverColumn === stage.id ? 'kanban__column--drag-over' : ''}`}
              data-stage={stage.id}
              onDragOver={(e) => handleDragOver(e, stage.id)}
              onDragLeave={handleDragLeave}
              onDrop={(e) => handleDrop(e, stage.id)}
            >
              <div className={`kanban__column-header kanban__column-header--${stage.id}`}>
                <span className="kanban__column-title">{stage.label}</span>
                <span className="kanban__column-count">{proposalsByStage[stage.id].length}</span>
              </div>
              <div className={`kanban__cards ${dragOverColumn === stage.id ? 'kanban__cards--drag-over' : ''}`}>
                {proposalsByStage[stage.id].map((proposal) => {
                  const company = mockCompanies.find(c => c.id === proposal.companyId);
                  const probabilityClass = 
                    proposal.probability >= 70 ? 'deal-card__probability--high' :
                    proposal.probability <= 30 ? 'deal-card__probability--low' : '';
                  const isDragging = draggedProposal === proposal.id;
                  
                  return (
                    <div 
                      key={proposal.id} 
                      className={`deal-card ${isDragging ? 'deal-card--dragging' : ''}`}
                      draggable
                      onDragStart={(e) => handleDragStart(e, proposal.id)}
                      onDragEnd={handleDragEnd}
                      onTouchStart={(e) => handleTouchStart(e, proposal.id)}
                      onTouchMove={handleTouchMove}
                      onTouchEnd={handleTouchEnd}
                    >
                      <div className="deal-card__header">
                        <span className="deal-card__company">{company?.name}</span>
                        <span className="deal-card__value">
                          {proposal.value.toLocaleString('tr-TR')} TL
                        </span>
                      </div>
                      <div className="deal-card__title">{proposal.title}</div>
                      <div className="deal-card__meta">
                        <div className="deal-card__meta-row">
                          <Building2 className="deal-card__meta-icon" />
                          <span>{company?.category}</span>
                        </div>
                      </div>
                      <div className="deal-card__footer">
                        <div className="deal-card__owner">
                          <div className="deal-card__owner-avatar">
                            <User className="deal-card__owner-avatar-icon" />
                          </div>
                          <span>{proposal.ownerName}</span>
                        </div>
                        <span className={`deal-card__probability ${probabilityClass}`}>
                          <Percent style={{ width: 10, height: 10, display: 'inline' }} />
                          {proposal.probability}
                        </span>
                      </div>
                      {proposal.nextAction && (
                        <div className="deal-card__next-action">
                          <Calendar className="deal-card__next-action-icon" />
                          {proposal.nextAction}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Add Deal Modal */}
      <Modal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        title="Yeni Teklif Ekle"
        maxWidth="600px"
      >
        <form className="modal__form" onSubmit={handleAddDeal}>
          <div className="modal__section">
            <h4 className="modal__section-title">Teklif Bilgileri</h4>
            <div className="modal__row">
              <div className="modal__field">
                <label className="modal__label modal__label--required">Şirket</label>
                <select
                  className="modal__select"
                  value={newDeal.companyId}
                  onChange={(e) => setNewDeal(prev => ({ ...prev, companyId: e.target.value }))}
                  required
                >
                  <option value="">Şirket seçin</option>
                  {mockCompanies.map(company => (
                    <option key={company.id} value={company.id}>{company.name}</option>
                  ))}
                </select>
              </div>
              <div className="modal__field">
                <label className="modal__label modal__label--required">Aşama</label>
                <select
                  className="modal__select"
                  value={newDeal.stage}
                  onChange={(e) => setNewDeal(prev => ({ ...prev, stage: e.target.value as DealStage }))}
                  required
                >
                  {stages.map(s => (
                    <option key={s.id} value={s.id}>{s.label}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="modal__field">
              <label className="modal__label modal__label--required">Teklif Başlığı</label>
              <input
                type="text"
                className="modal__input"
                placeholder="Örn: Yazılım Geliştirme Projesi"
                value={newDeal.title}
                onChange={(e) => setNewDeal(prev => ({ ...prev, title: e.target.value }))}
                required
              />
            </div>
            <div className="modal__row">
              <div className="modal__field">
                <label className="modal__label modal__label--required">Değer (TL)</label>
                <input
                  type="number"
                  className="modal__input"
                  placeholder="0"
                  value={newDeal.value}
                  onChange={(e) => setNewDeal(prev => ({ ...prev, value: e.target.value }))}
                  required
                  min="0"
                />
              </div>
              <div className="modal__field">
                <label className="modal__label">Olasılık (%)</label>
                <input
                  type="number"
                  className="modal__input"
                  placeholder="20"
                  value={newDeal.probability}
                  onChange={(e) => setNewDeal(prev => ({ ...prev, probability: parseInt(e.target.value) || 0 }))}
                  min="0"
                  max="100"
                />
              </div>
            </div>
          </div>

          <div className="modal__section">
            <h4 className="modal__section-title">Sonraki Adım</h4>
            <div className="modal__field">
              <label className="modal__label">Sonraki Aksiyon</label>
              <input
                type="text"
                className="modal__input"
                placeholder="Örn: Takip görüşmesi yap"
                value={newDeal.nextAction}
                onChange={(e) => setNewDeal(prev => ({ ...prev, nextAction: e.target.value }))}
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
