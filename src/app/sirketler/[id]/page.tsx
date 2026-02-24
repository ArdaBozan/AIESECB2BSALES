'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { 
  ArrowLeft, 
  Building2, 
  FileText, 
  MapPin, 
  Phone, 
  Mail, 
  Globe,
  Edit3,
  Settings,
  ExternalLink,
  User,
  MessageSquare,
  Clock,
  Search,
  Filter,
  MoreVertical,
  DollarSign,
  Users,
  RefreshCw,
  X,
  Bell,
  Trash2,
  Shield,
  Eye,
  Copy
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { 
  getCompanyById, 
  getContactsByCompanyId, 
  getActivitiesByCompanyId, 
  getProposalsByCompanyId 
} from '@/data/mockData';
import StatusBadge from '@/components/common/StatusBadge';
import ConfirmModal from '@/components/common/ConfirmModal';
import './page.css';

export default function CompanyDetailPage() {
  const router = useRouter();
  const params = useParams();
  const { permissions } = useAuth();
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const [detailModal, setDetailModal] = useState<{ isOpen: boolean; activity: any }>({ isOpen: false, activity: null });
  const [editModal, setEditModal] = useState<{ isOpen: boolean; activity: any }>({ isOpen: false, activity: null });
  const [deleteActivityModal, setDeleteActivityModal] = useState<{ isOpen: boolean; activity: any }>({ isOpen: false, activity: null });
  const [deleteCompanyModal, setDeleteCompanyModal] = useState(false);
  const [editFormData, setEditFormData] = useState({ status: '', notes: '' });
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const menuRef = useRef<HTMLDivElement>(null);
  const ITEMS_PER_PAGE = 6;

  // Close dropdown when clicking outside
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
  
  const company = getCompanyById(params.id as string);
  const contacts = getContactsByCompanyId(params.id as string);
  const allActivities = getActivitiesByCompanyId(params.id as string);
  const proposals = getProposalsByCompanyId(params.id as string);

  // Filter activities based on search query
  const filteredActivities = allActivities.filter(activity => {
    if (!searchQuery.trim()) return true;
    const query = searchQuery.toLowerCase();
    const typeLabels: Record<string, string> = {
      'cold_call': 'cold call',
      'postponed': 'ertelendi',
      'meeting': 'görüşmede',
      'proposal': 'teklif'
    };
    return (
      (activity.notes && activity.notes.toLowerCase().includes(query)) ||
      activity.type.toLowerCase().includes(query) ||
      (typeLabels[activity.type] && typeLabels[activity.type].includes(query))
    );
  });

  // Pagination calculations
  const totalPages = Math.ceil(filteredActivities.length / ITEMS_PER_PAGE);
  const activities = filteredActivities.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  // Reset page when search changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery]);

  if (!company) {
    return (
      <div className="company-detail">
        <p>Şirket bulunamadı</p>
      </div>
    );
  }

  return (
    <div className="company-detail">
      {/* Header */}
      <div className="company-detail__header">
        <button 
          className="company-detail__back"
          onClick={() => router.back()}
        >
          <ArrowLeft className="company-detail__back-icon" />
          Geri Dön
        </button>
        
        <div className="company-detail__actions">
          <button 
            className="company-detail__action-btn company-detail__action-btn--outline"
            onClick={() => setShowSettingsModal(true)}
          >
            <Settings className="company-detail__action-icon" />
            Şirket Ayarları
          </button>
          {permissions.canEditCompany && (
            <button className="company-detail__action-btn company-detail__action-btn--primary">
              <ExternalLink className="company-detail__action-icon" />
              Şirket Bilgilerini Düzenle
            </button>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="company-detail__content">
        {/* Company Info */}
        <div className="company-detail__info">
          <div className="company-detail__info-header">
            <div className="company-detail__icon">
              <Building2 />
            </div>
            <div className="company-detail__title">
              <h1 className="company-detail__name">{company.name}</h1>
              <div className="company-detail__meta">
                <span className="company-detail__meta-item">
                  <FileText className="company-detail__meta-icon" />
                  {company.category}
                </span>
                <span>•</span>
                <span className="company-detail__meta-item">
                  <MapPin className="company-detail__meta-icon" />
                  {company.location}
                </span>
              </div>
            </div>
          </div>

          <div className="company-detail__info-grid">
            <div className="company-detail__info-row">
              <MapPin className="company-detail__info-icon" />
              <div className="company-detail__info-content">
                <div className="company-detail__info-label">Konum:</div>
                <div className="company-detail__info-value">{company.location}</div>
              </div>
            </div>

            <div className="company-detail__info-row">
              <Phone className="company-detail__info-icon" />
              <div className="company-detail__info-content">
                <div className="company-detail__info-label">Telefon:</div>
                <div className="company-detail__info-value">{company.phone}</div>
              </div>
            </div>

            <div className="company-detail__info-row">
              <Mail className="company-detail__info-icon" />
              <div className="company-detail__info-content">
                <div className="company-detail__info-label">E-Posta:</div>
                <div className="company-detail__info-value">{company.email}</div>
              </div>
            </div>

            {company.website && (
              <div className="company-detail__info-row">
                <Globe className="company-detail__info-icon" />
                <div className="company-detail__info-content">
                  <div className="company-detail__info-label">Website:</div>
                  <div className="company-detail__info-value">{company.website}</div>
                </div>
              </div>
            )}
          </div>

          {permissions.canEditCompany && (
            <button className="company-detail__edit-btn">
              <Edit3 className="company-detail__edit-icon" />
              Bilgileri Düzenle
            </button>
          )}
        </div>

        {/* Contacts */}
        <div className="company-detail__card">
          <div className="company-detail__card-header">
            <h3 className="company-detail__card-title">Bağlantılar</h3>
            <div className="company-detail__card-count">
              <Users className="company-detail__card-count-icon" />
              {contacts.length}
            </div>
          </div>

          <div className="company-detail__contact-list">
            {contacts.map((contact) => (
              <div key={contact.id} className="company-detail__contact-item">
                <div className="company-detail__contact-left">
                  <div className="company-detail__contact-avatar">
                    <User className="company-detail__contact-avatar-icon" />
                  </div>
                  <span className="company-detail__contact-name">{contact.name}</span>
                </div>
                <div className="company-detail__contact-actions">
                  <button className="company-detail__contact-action">
                    <Phone className="company-detail__contact-action-icon" />
                  </button>
                  <button className="company-detail__contact-action">
                    <MessageSquare className="company-detail__contact-action-icon" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Proposals */}
        <div className="company-detail__card">
          <div className="company-detail__card-header">
            <h3 className="company-detail__card-title">Teklifler</h3>
            <div className="company-detail__card-count">
              <RefreshCw className="company-detail__card-count-icon" />
              {proposals.length}
            </div>
          </div>

          <div className="company-detail__proposal-list">
            {proposals.map((proposal) => (
              <div key={proposal.id} className="company-detail__proposal-item">
                <div className="company-detail__proposal-left">
                  <DollarSign className="company-detail__proposal-icon" />
                  <span className="company-detail__proposal-value">
                    {proposal.value.toLocaleString('tr-TR')} {proposal.currency}
                  </span>
                </div>
                <button className="company-detail__proposal-action">
                  <Clock className="company-detail__proposal-action-icon" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Activities Table */}
      <div className="company-detail__activities">
        <div className="company-detail__activities-header">
          <h2 className="company-detail__activities-title">Aktiviteler</h2>
          <div className="company-detail__activities-actions">
            <div className="company-detail__activities-search">
              <Search className="company-detail__activities-search-icon" />
              <input 
                type="text" 
                className="company-detail__activities-search-input"
                placeholder="Ara"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <button className="company-detail__activities-filter">
              <Filter className="company-detail__activities-filter-icon" />
              Filtrele
            </button>
          </div>
        </div>

        <div className="company-detail__table-wrapper">
          <table className="company-detail__table">
            <thead>
              <tr>
                <th>Durum</th>
                <th>Tarih</th>
                <th>Yetki</th>
                <th>Not</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {activities.length > 0 ? (
                activities.map((activity) => (
                <tr key={activity.id}>
                  <td>
                    <StatusBadge status={activity.type} showIcon />
                  </td>
                  <td>
                    {(activity.completedAt || activity.createdAt).toLocaleString('tr-TR', {
                      year: 'numeric',
                      month: '2-digit',
                      day: '2-digit',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </td>
                  <td>Admin</td>
                  <td>{activity.notes || '-'}</td>
                  <td>
                    <div className="company-detail__menu-wrapper" ref={openMenuId === activity.id ? menuRef : null}>
                      <button 
                        className="company-detail__table-action"
                        onClick={() => setOpenMenuId(openMenuId === activity.id ? null : activity.id)}
                      >
                        <MoreVertical className="company-detail__table-action-icon" />
                      </button>
                      {openMenuId === activity.id && (
                        <div className="company-detail__dropdown">
                          <button className="company-detail__dropdown-item" onClick={() => { setDetailModal({ isOpen: true, activity }); setOpenMenuId(null); }}>
                            <Eye className="company-detail__dropdown-icon" />
                            Detaylar
                          </button>
                          <button className="company-detail__dropdown-item" onClick={() => { setEditModal({ isOpen: true, activity }); setEditFormData({ status: activity.type, notes: activity.notes || '' }); setOpenMenuId(null); }}>
                            <Edit3 className="company-detail__dropdown-icon" />
                            Düzenle
                          </button>
                          <button className="company-detail__dropdown-item" onClick={() => { alert('Kopyalandı'); setOpenMenuId(null); }}>
                            <Copy className="company-detail__dropdown-icon" />
                            Kopyala
                          </button>
                          <button className="company-detail__dropdown-item company-detail__dropdown-item--danger" onClick={() => { setDeleteActivityModal({ isOpen: true, activity }); setOpenMenuId(null); }}>
                            <Trash2 className="company-detail__dropdown-icon" />
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
                  <td colSpan={5} className="company-detail__table-empty">
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

      {/* Settings Modal */}
      {showSettingsModal && (
        <>
          <div 
            className="company-detail__modal-overlay"
            onClick={() => setShowSettingsModal(false)}
          />
          <div className="company-detail__settings-modal">
            <div className="company-detail__settings-header">
              <h2 className="company-detail__settings-title">Şirket Ayarları</h2>
              <button 
                className="company-detail__settings-close"
                onClick={() => setShowSettingsModal(false)}
              >
                <X />
              </button>
            </div>
            <div className="company-detail__settings-content">
              <div className="company-detail__settings-section">
                <h3 className="company-detail__settings-section-title">Bildirim Ayarları</h3>
                <div className="company-detail__settings-option">
                  <div className="company-detail__settings-option-left">
                    <Bell className="company-detail__settings-option-icon" />
                    <div>
                      <div className="company-detail__settings-option-label">E-posta Bildirimleri</div>
                      <div className="company-detail__settings-option-desc">Bu şirketle ilgili e-posta al</div>
                    </div>
                  </div>
                  <label className="company-detail__settings-toggle">
                    <input type="checkbox" defaultChecked />
                    <span className="company-detail__settings-toggle-slider"></span>
                  </label>
                </div>
                <div className="company-detail__settings-option">
                  <div className="company-detail__settings-option-left">
                    <Bell className="company-detail__settings-option-icon" />
                    <div>
                      <div className="company-detail__settings-option-label">Aktivite Bildirimleri</div>
                      <div className="company-detail__settings-option-desc">Yeni aktivitelerde bildirim al</div>
                    </div>
                  </div>
                  <label className="company-detail__settings-toggle">
                    <input type="checkbox" defaultChecked />
                    <span className="company-detail__settings-toggle-slider"></span>
                  </label>
                </div>
              </div>
              <div className="company-detail__settings-section">
                <h3 className="company-detail__settings-section-title">Erişim Ayarları</h3>
                <div className="company-detail__settings-option">
                  <div className="company-detail__settings-option-left">
                    <Shield className="company-detail__settings-option-icon" />
                    <div>
                      <div className="company-detail__settings-option-label">Herkese Açık</div>
                      <div className="company-detail__settings-option-desc">Tüm ekip üyeleri görebilir</div>
                    </div>
                  </div>
                  <label className="company-detail__settings-toggle">
                    <input type="checkbox" defaultChecked />
                    <span className="company-detail__settings-toggle-slider"></span>
                  </label>
                </div>
              </div>
              <div className="company-detail__settings-section company-detail__settings-section--danger">
                <h3 className="company-detail__settings-section-title">Diğer</h3>
                <button 
                  className="company-detail__settings-danger-btn"
                  onClick={() => { setShowSettingsModal(false); setDeleteCompanyModal(true); }}
                >
                  <Trash2 />
                  Şirketi Sil
                </button>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Activity Detail Modal */}
      {detailModal.isOpen && detailModal.activity && (
        <>
          <div className="company-detail__modal-overlay" onClick={() => setDetailModal({ isOpen: false, activity: null })} />
          <div className="company-detail__activity-modal">
            <div className="company-detail__activity-modal-header">
              <h2 className="company-detail__activity-modal-title">Aktivite Detayı</h2>
              <button className="company-detail__activity-modal-close" onClick={() => setDetailModal({ isOpen: false, activity: null })}>
                <X />
              </button>
            </div>
            <div className="company-detail__activity-modal-content">
              <div className="company-detail__activity-modal-row">
                <span className="company-detail__activity-modal-label">Durum</span>
                <StatusBadge status={detailModal.activity.type} showIcon />
              </div>
              <div className="company-detail__activity-modal-row">
                <span className="company-detail__activity-modal-label">Tarih</span>
                <span className="company-detail__activity-modal-value">
                  {(detailModal.activity.completedAt || detailModal.activity.createdAt).toLocaleString('tr-TR')}
                </span>
              </div>
              <div className="company-detail__activity-modal-row">
                <span className="company-detail__activity-modal-label">Yetki</span>
                <span className="company-detail__activity-modal-value">Admin</span>
              </div>
              <div className="company-detail__activity-modal-row">
                <span className="company-detail__activity-modal-label">Not</span>
                <span className="company-detail__activity-modal-value">{detailModal.activity.notes || '-'}</span>
              </div>
            </div>
            <div className="company-detail__activity-modal-actions">
              <button className="company-detail__activity-modal-btn company-detail__activity-modal-btn--secondary" onClick={() => setDetailModal({ isOpen: false, activity: null })}>
                Kapat
              </button>
              <button className="company-detail__activity-modal-btn company-detail__activity-modal-btn--primary" onClick={() => { setEditModal({ isOpen: true, activity: detailModal.activity }); setEditFormData({ status: detailModal.activity.type, notes: detailModal.activity.notes || '' }); setDetailModal({ isOpen: false, activity: null }); }}>
                Düzenle
              </button>
            </div>
          </div>
        </>
      )}

      {/* Activity Edit Modal */}
      {editModal.isOpen && editModal.activity && (
        <>
          <div className="company-detail__modal-overlay" onClick={() => setEditModal({ isOpen: false, activity: null })} />
          <div className="company-detail__activity-modal">
            <div className="company-detail__activity-modal-header">
              <h2 className="company-detail__activity-modal-title">Aktivite Düzenle</h2>
              <button className="company-detail__activity-modal-close" onClick={() => setEditModal({ isOpen: false, activity: null })}>
                <X />
              </button>
            </div>
            <div className="company-detail__activity-modal-content">
              <div className="company-detail__activity-modal-form-group">
                <label className="company-detail__activity-modal-form-label">Durum</label>
                <select 
                  className="company-detail__activity-modal-form-select"
                  value={editFormData.status}
                  onChange={(e) => setEditFormData({ ...editFormData, status: e.target.value })}
                >
                  <option value="cold_call">Cold Call</option>
                  <option value="postponed">Ertelendi</option>
                  <option value="meeting">Görüşmede</option>
                  <option value="proposal">Teklif Verildi</option>
                </select>
              </div>
              <div className="company-detail__activity-modal-form-group">
                <label className="company-detail__activity-modal-form-label">Not</label>
                <textarea 
                  className="company-detail__activity-modal-form-textarea"
                  value={editFormData.notes}
                  onChange={(e) => setEditFormData({ ...editFormData, notes: e.target.value })}
                />
              </div>
            </div>
            <div className="company-detail__activity-modal-actions">
              <button className="company-detail__activity-modal-btn company-detail__activity-modal-btn--secondary" onClick={() => setEditModal({ isOpen: false, activity: null })}>
                İptal
              </button>
              <button className="company-detail__activity-modal-btn company-detail__activity-modal-btn--primary" onClick={() => { alert('Değişiklikler kaydedildi'); setEditModal({ isOpen: false, activity: null }); }}>
                Kaydet
              </button>
            </div>
          </div>
        </>
      )}

      {/* Delete Activity Confirmation */}
      <ConfirmModal
        isOpen={deleteActivityModal.isOpen}
        onClose={() => setDeleteActivityModal({ isOpen: false, activity: null })}
        onConfirm={() => alert('Aktivite silindi')}
        title="Aktiviteyi Sil"
        message="Bu aktiviteyi silmek istediğinizden emin misiniz? Bu işlem geri alınamaz."
        confirmText="Sil"
        cancelText="İptal"
        type="danger"
      />

      {/* Delete Company Confirmation */}
      <ConfirmModal
        isOpen={deleteCompanyModal}
        onClose={() => setDeleteCompanyModal(false)}
        onConfirm={() => { alert('Şirket silindi'); router.push('/sirketler'); }}
        title="Şirketi Sil"
        message={`"${company.name}" şirketini silmek istediğinizden emin misiniz? Bu işlem geri alınamaz ve şirkete ait tüm veriler silinecektir.`}
        confirmText="Şirketi Sil"
        cancelText="İptal"
        type="danger"
      />
    </div>
  );
}
