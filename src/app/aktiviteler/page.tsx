'use client';

import React, { useState, useRef, useEffect } from 'react';
import { 
  ListTodo, 
  Filter, 
  Phone, 
  Clock, 
  MessageSquare, 
  DollarSign,
  Building2,
  FileText,
  MapPin,
  RefreshCw,
  Users,
  User,
  MoreVertical,
  X,
  RotateCcw,
  Eye,
  Edit3,
  Trash2,
  Copy,
  Search
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { mockCompanies, mockActivities } from '@/data/mockData';
import { ActivityType, Company } from '@/types';
import StatusBadge from '@/components/common/StatusBadge';
import ConfirmModal from '@/components/common/ConfirmModal';
import './page.css';

const activityTypes: { type: ActivityType; label: string; icon: React.ReactNode }[] = [
  { type: 'cold_call', label: 'Cold Call', icon: <Phone /> },
  { type: 'postponed', label: 'Ertelenen', icon: <Clock /> },
  { type: 'meeting', label: 'Görüşmede', icon: <MessageSquare /> },
  { type: 'proposal', label: 'Teklifler', icon: <DollarSign /> },
];

// Mock activity log data for the table
const mockActivityLog = [
  { id: '1', userName: 'Ali Nazgul', status: 'cold_call' as ActivityType, date: '2026-06-04 13:54', role: 'Admin', note: 'Teklif sunulacak' },
  { id: '2', userName: 'Aziz Şanverdi', status: 'meeting' as ActivityType, date: '2026-06-04 13:54', role: 'Üye', note: 'Tekrar görüşme yapılacak' },
  { id: '3', userName: 'Mehmet Yıldırım', status: 'cold_call' as ActivityType, date: '2026-06-04 13:54', role: 'Admin', note: 'Teklif sunulacak' },
  { id: '4', userName: 'Semih Taş', status: 'postponed' as ActivityType, date: '2026-06-04 13:54', role: 'Üye', note: '1 Ay sonra tekrar aranacak' },
  { id: '5', userName: 'Emine Meryem Karagül', status: 'proposal' as ActivityType, date: '2026-06-04 13:54', role: 'Üye', note: 'Teklif kabul edildi' },
  { id: '6', userName: 'Ali Nazgul', status: 'cold_call' as ActivityType, date: '2026-06-04 13:54', role: 'Admin', note: 'Görüşme yapılmalı' },
  { id: '7', userName: 'Zeynep Kaya', status: 'meeting' as ActivityType, date: '2026-06-03 10:30', role: 'Admin', note: 'Fiyat görüşmesi yapıldı' },
  { id: '8', userName: 'Burak Demir', status: 'cold_call' as ActivityType, date: '2026-06-03 09:15', role: 'Üye', note: 'İlk görüşme tamamlandı' },
  { id: '9', userName: 'Ayşe Yılmaz', status: 'postponed' as ActivityType, date: '2026-06-02 14:20', role: 'Admin', note: 'Bütçe onayı bekleniyor' },
  { id: '10', userName: 'Can Öztürk', status: 'proposal' as ActivityType, date: '2026-06-02 11:45', role: 'Üye', note: 'Teklif gönderildi' },
];

export default function ActivitiesPage() {
  const { user, permissions } = useAuth();
  const [selectedType, setSelectedType] = useState<ActivityType>('cold_call');
  const [selectedCompanyId, setSelectedCompanyId] = useState<string>(mockCompanies[0]?.id || '');
  const [notes, setNotes] = useState('');
  const [showFilter, setShowFilter] = useState(false);
  const [filterType, setFilterType] = useState<ActivityType | ''>('');
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const [detailModal, setDetailModal] = useState<{ isOpen: boolean; activity: typeof mockActivityLog[0] | null }>({ isOpen: false, activity: null });
  const [editModal, setEditModal] = useState<{ isOpen: boolean; activity: typeof mockActivityLog[0] | null }>({ isOpen: false, activity: null });
  const [deleteModal, setDeleteModal] = useState<{ isOpen: boolean; activity: typeof mockActivityLog[0] | null }>({ isOpen: false, activity: null });
  const [editFormData, setEditFormData] = useState({ userName: '', status: '' as ActivityType, note: '' });
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const menuRef = useRef<HTMLDivElement>(null);
  const ITEMS_PER_PAGE = 6;

  // Close menu dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setOpenMenuId(null);
      }
    };

    if (openMenuId) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [openMenuId]);

  // Filter activities based on user permissions
  const filteredActivities = mockActivities.filter(activity => {
    if (!permissions.canViewAllActivities) {
      return activity.userId === user.id;
    }
    return true;
  });

  // Group activities by company for display
  const companiesWithActivities = mockCompanies.map(company => {
    const companyActivities = filteredActivities.filter(a => a.companyId === company.id);
    const latestActivity = companyActivities[0];
    return {
      ...company,
      latestActivity,
      activityCount: companyActivities.length,
    };
  }).filter(c => c.activityCount > 0);

  // Filter activity log based on selected filter and search
  const filteredActivityLog = mockActivityLog.filter(a => {
    // Apply type filter
    if (filterType && a.status !== filterType) return false;
    
    // Apply search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      const typeLabels: Record<string, string> = {
        'cold_call': 'cold call',
        'postponed': 'ertelendi',
        'meeting': 'görüşmede',
        'proposal': 'teklif'
      };
      return (
        a.userName.toLowerCase().includes(query) ||
        a.note.toLowerCase().includes(query) ||
        a.role.toLowerCase().includes(query) ||
        a.status.toLowerCase().includes(query) ||
        (typeLabels[a.status] && typeLabels[a.status].includes(query))
      );
    }
    return true;
  });

  // Pagination calculations
  const totalPages = Math.ceil(filteredActivityLog.length / ITEMS_PER_PAGE);
  const paginatedActivityLog = filteredActivityLog.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  // Reset page when filter/search changes
  useEffect(() => {
    setCurrentPage(1);
  }, [filterType, searchQuery]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, this would submit to an API
    alert(`Aktivite eklendi: ${selectedType} - ${selectedCompanyId}`);
    setNotes('');
  };

  return (
    <div className="activities-page">
      {/* Activity Form Sidebar */}
      <div className="activities-page__sidebar">
        <form className="activity-form" onSubmit={handleSubmit}>
          <h2 className="activity-form__title">Aktivite Ekle</h2>
          
          <div className="activity-form__group">
            <label className="activity-form__label">Şirket Seçimi</label>
            <select 
              className="activity-form__select"
              value={selectedCompanyId}
              onChange={(e) => setSelectedCompanyId(e.target.value)}
            >
              {mockCompanies.map(company => (
                <option key={company.id} value={company.id}>
                  {company.name}
                </option>
              ))}
            </select>
          </div>

          <div className="activity-form__group">
            <label className="activity-form__label">Aktivite Seçimi</label>
            <div className="activity-form__types">
              {activityTypes.map(({ type, label, icon }) => (
                <button
                  key={type}
                  type="button"
                  className={`activity-form__type activity-form__type--${type} ${selectedType === type ? 'activity-form__type--selected' : ''}`}
                  onClick={() => setSelectedType(type)}
                >
                  <span className="activity-form__type-icon">{icon}</span>
                  <span className="activity-form__type-label">{label}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="activity-form__group">
            <label className="activity-form__label">Notlar</label>
            <textarea
              className="activity-form__textarea"
              placeholder="Aktivite ile ilgili notlarınızı yazın..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
          </div>

          <button type="submit" className="activity-form__submit">
            Gönder
          </button>
        </form>
      </div>

      {/* Activity List */}
      <div className="activities-page__main">
        <div className="activities-page__header">
          <div className="activities-page__title">
            <ListTodo className="activities-page__title-icon" />
            <h1 className="activities-page__title-text">Aktiviteler</h1>
          </div>
          <div className="activities-page__header-actions">
            <div className="activities-page__search">
              <Search className="activities-page__search-icon" />
              <input 
                type="text" 
                className="activities-page__search-input"
                placeholder="Ara"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <button 
              className="activities-page__filter-btn"
              onClick={() => setShowFilter(!showFilter)}
            >
              <Filter className="activities-page__filter-btn-icon" />
              Filtrele
            </button>
          </div>
        </div>

        <div className="activity-list">
          {companiesWithActivities.map((company) => (
            <div key={company.id} className="activity-card">
              <div className="activity-card__icon">
                <Building2 />
              </div>
              <div className="activity-card__content">
                <div className="activity-card__header">
                  <div>
                    <h3 className="activity-card__company">{company.name}</h3>
                    <div className="activity-card__meta">
                      <span className="activity-card__meta-item">
                        <FileText className="activity-card__meta-icon" />
                        {company.category}
                      </span>
                      <span>•</span>
                      <span className="activity-card__meta-item">
                        <MapPin className="activity-card__meta-icon" />
                        {company.location}
                      </span>
                    </div>
                  </div>
                  {company.latestActivity && (
                    <StatusBadge status={company.latestActivity.type} showIcon />
                  )}
                </div>
                <div className="activity-card__footer">
                  <div className="activity-card__proposals">
                    <RefreshCw className="activity-card__proposals-icon" />
                    {company.activeProposals} Adet Aktif Teklif
                  </div>
                  <div className="activity-card__contacts">
                    <Users className="activity-card__contacts-icon" />
                    {company.contactCount} Bağlantı
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Activity Log Table */}
        <div className="activity-log">
          <table className="activity-log__table">
            <thead>
              <tr>
                <th>Kullanıcı</th>
                <th>Durum</th>
                <th>Tarih</th>
                <th>Yetki</th>
                <th>Not</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {paginatedActivityLog.length > 0 ? (
                paginatedActivityLog.map((activity) => (
                <tr key={activity.id}>
                  <td className="activity-log__user">
                    <div className="activity-log__user-avatar">
                      <User />
                    </div>
                    <span className="activity-log__user-name">{activity.userName}</span>
                  </td>
                  <td>
                    <StatusBadge status={activity.status} showIcon />
                  </td>
                  <td className="activity-log__date">{activity.date}</td>
                  <td className="activity-log__role">{activity.role}</td>
                  <td className="activity-log__note">{activity.note}</td>
                  <td className="activity-log__actions">
                    <div className="activity-log__menu-wrapper" ref={openMenuId === activity.id ? menuRef : null}>
                      <button 
                        className="activity-log__action-btn"
                        onClick={() => setOpenMenuId(openMenuId === activity.id ? null : activity.id)}
                      >
                        <MoreVertical />
                      </button>
                      {openMenuId === activity.id && (
                        <div className="activity-log__dropdown">
                          <button className="activity-log__dropdown-item" onClick={() => { setDetailModal({ isOpen: true, activity }); setOpenMenuId(null); }}>
                            <Eye className="activity-log__dropdown-icon" />
                            Detaylar
                          </button>
                          <button className="activity-log__dropdown-item" onClick={() => { setEditModal({ isOpen: true, activity }); setEditFormData({ userName: activity.userName, status: activity.status, note: activity.note }); setOpenMenuId(null); }}>
                            <Edit3 className="activity-log__dropdown-icon" />
                            Düzenle
                          </button>
                          <button className="activity-log__dropdown-item" onClick={() => { alert('Kopyalandı: ' + activity.userName); setOpenMenuId(null); }}>
                            <Copy className="activity-log__dropdown-icon" />
                            Kopyala
                          </button>
                          <button className="activity-log__dropdown-item activity-log__dropdown-item--danger" onClick={() => { setDeleteModal({ isOpen: true, activity }); setOpenMenuId(null); }}>
                            <Trash2 className="activity-log__dropdown-icon" />
                            Sil
                          </button>
                        </div>
                      )}
                    </div>
                  </td>
                </tr>
              ))
              ) : (
                <tr>
                  <td colSpan={6} className="activity-log__empty">
                    Sonuç bulunamadı
                  </td>
                </tr>
              )}
            </tbody>
          </table>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="pagination">
              <div className="pagination__pages">
                {(() => {
                  const pages: (number | string)[] = [];
                  
                  // Always show first page
                  pages.push(1);
                  
                  // Add ellipsis after first page if needed
                  if (currentPage > 3) {
                    pages.push('...');
                  }
                  
                  // Add pages around current page
                  for (let i = Math.max(2, currentPage - 1); i <= Math.min(totalPages - 1, currentPage + 1); i++) {
                    if (!pages.includes(i)) {
                      pages.push(i);
                    }
                  }
                  
                  // Add ellipsis before last page if needed
                  if (currentPage < totalPages - 2) {
                    pages.push('...');
                  }
                  
                  // Always show last page
                  if (totalPages > 1 && !pages.includes(totalPages)) {
                    pages.push(totalPages);
                  }
                  
                  return pages.map((page, idx) => (
                    typeof page === 'string' ? (
                      <span key={`ellipsis-${idx}`} className="pagination__ellipsis">...</span>
                    ) : (
                      <button
                        key={page}
                        className={`pagination__page ${currentPage === page ? 'pagination__page--active' : ''}`}
                        onClick={() => setCurrentPage(page)}
                      >
                        {page}
                      </button>
                    )
                  ));
                })()}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Detail Modal */}
      {detailModal.isOpen && detailModal.activity && (
        <>
          <div className="activity-modal__overlay" onClick={() => setDetailModal({ isOpen: false, activity: null })} />
          <div className="activity-modal">
            <div className="activity-modal__header">
              <h2 className="activity-modal__title">Aktivite Detayı</h2>
              <button className="activity-modal__close" onClick={() => setDetailModal({ isOpen: false, activity: null })}>
                <X />
              </button>
            </div>
            <div className="activity-modal__content">
              <div className="activity-modal__row">
                <span className="activity-modal__label">Kullanıcı</span>
                <div className="activity-modal__user">
                  <div className="activity-modal__user-avatar">
                    <User />
                  </div>
                  <span>{detailModal.activity.userName}</span>
                </div>
              </div>
              <div className="activity-modal__row">
                <span className="activity-modal__label">Durum</span>
                <StatusBadge status={detailModal.activity.status} showIcon />
              </div>
              <div className="activity-modal__row">
                <span className="activity-modal__label">Tarih</span>
                <span className="activity-modal__value">{detailModal.activity.date}</span>
              </div>
              <div className="activity-modal__row">
                <span className="activity-modal__label">Yetki</span>
                <span className="activity-modal__value">{detailModal.activity.role}</span>
              </div>
              <div className="activity-modal__row">
                <span className="activity-modal__label">Not</span>
                <span className="activity-modal__value">{detailModal.activity.note}</span>
              </div>
            </div>
            <div className="activity-modal__actions">
              <button className="activity-modal__btn activity-modal__btn--secondary" onClick={() => setDetailModal({ isOpen: false, activity: null })}>
                Kapat
              </button>
              <button className="activity-modal__btn activity-modal__btn--primary" onClick={() => { setEditModal({ isOpen: true, activity: detailModal.activity }); setEditFormData({ userName: detailModal.activity!.userName, status: detailModal.activity!.status, note: detailModal.activity!.note }); setDetailModal({ isOpen: false, activity: null }); }}>
                Düzenle
              </button>
            </div>
          </div>
        </>
      )}

      {/* Edit Modal */}
      {editModal.isOpen && editModal.activity && (
        <>
          <div className="activity-modal__overlay" onClick={() => setEditModal({ isOpen: false, activity: null })} />
          <div className="activity-modal">
            <div className="activity-modal__header">
              <h2 className="activity-modal__title">Aktivite Düzenle</h2>
              <button className="activity-modal__close" onClick={() => setEditModal({ isOpen: false, activity: null })}>
                <X />
              </button>
            </div>
            <div className="activity-modal__content">
              <div className="activity-modal__form-group">
                <label className="activity-modal__form-label">Kullanıcı Adı</label>
                <input 
                  type="text" 
                  className="activity-modal__form-input" 
                  value={editFormData.userName}
                  onChange={(e) => setEditFormData({ ...editFormData, userName: e.target.value })}
                />
              </div>
              <div className="activity-modal__form-group">
                <label className="activity-modal__form-label">Durum</label>
                <select 
                  className="activity-modal__form-select"
                  value={editFormData.status}
                  onChange={(e) => setEditFormData({ ...editFormData, status: e.target.value as ActivityType })}
                >
                  <option value="cold_call">Cold Call</option>
                  <option value="postponed">Ertelendi</option>
                  <option value="meeting">Görüşmede</option>
                  <option value="proposal">Teklif Verildi</option>
                </select>
              </div>
              <div className="activity-modal__form-group">
                <label className="activity-modal__form-label">Not</label>
                <textarea 
                  className="activity-modal__form-textarea"
                  value={editFormData.note}
                  onChange={(e) => setEditFormData({ ...editFormData, note: e.target.value })}
                />
              </div>
            </div>
            <div className="activity-modal__actions">
              <button className="activity-modal__btn activity-modal__btn--secondary" onClick={() => setEditModal({ isOpen: false, activity: null })}>
                İptal
              </button>
              <button className="activity-modal__btn activity-modal__btn--primary" onClick={() => { alert('Değişiklikler kaydedildi'); setEditModal({ isOpen: false, activity: null }); }}>
                Kaydet
              </button>
            </div>
          </div>
        </>
      )}

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ isOpen: false, activity: null })}
        onConfirm={() => alert('Aktivite silindi: ' + deleteModal.activity?.userName)}
        title="Aktiviteyi Sil"
        message={`"${deleteModal.activity?.userName}" kullanıcısına ait bu aktiviteyi silmek istediğinizden emin misiniz? Bu işlem geri alınamaz.`}
        confirmText="Sil"
        cancelText="İptal"
        type="danger"
      />

      {/* Filter Modal */}
      {showFilter && (
        <>
          <div className="filter-modal__overlay" onClick={() => setShowFilter(false)} />
          <div className="filter-modal">
            <div className="filter-modal__header">
              <div className="filter-modal__icon">
                <Filter />
              </div>
              <button className="filter-modal__close" onClick={() => setShowFilter(false)}>
                <X />
              </button>
            </div>
            <div className="filter-modal__content">
              <h2 className="filter-modal__title">Aktivite Türü</h2>
              <p className="filter-modal__message">Görüntülemek istediğiniz aktivite türünü seçin</p>
            </div>
            <div className="filter-modal__options">
              <label className="filter-modal__option">
                <input 
                  type="radio" 
                  name="filterType" 
                  checked={filterType === ''} 
                  onChange={() => setFilterType('')}
                />
                <span className="filter-modal__radio"></span>
                <span>Tümü</span>
              </label>
              {activityTypes.map(({ type, label }) => (
                <label key={type} className="filter-modal__option">
                  <input 
                    type="radio" 
                    name="filterType" 
                    checked={filterType === type} 
                    onChange={() => setFilterType(type)}
                  />
                  <span className="filter-modal__radio"></span>
                  <span>{label}</span>
                </label>
              ))}
            </div>
            <div className="filter-modal__actions">
              <button 
                className="filter-modal__btn filter-modal__btn--cancel"
                onClick={() => {
                  setFilterType('');
                  setShowFilter(false);
                }}
              >
                Sıfırla
              </button>
              <button 
                className="filter-modal__btn filter-modal__btn--primary"
                onClick={() => setShowFilter(false)}
              >
                Uygula
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
