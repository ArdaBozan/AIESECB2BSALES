'use client';

import React from 'react';
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
  RefreshCw
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { 
  getCompanyById, 
  getContactsByCompanyId, 
  getActivitiesByCompanyId, 
  getProposalsByCompanyId 
} from '@/data/mockData';
import StatusBadge from '@/components/common/StatusBadge';
import './page.css';

export default function CompanyDetailPage() {
  const router = useRouter();
  const params = useParams();
  const { permissions } = useAuth();
  
  const company = getCompanyById(params.id as string);
  const contacts = getContactsByCompanyId(params.id as string);
  const activities = getActivitiesByCompanyId(params.id as string);
  const proposals = getProposalsByCompanyId(params.id as string);

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
          <button className="company-detail__action-btn company-detail__action-btn--outline">
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
              {activities.map((activity) => (
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
                    <button className="company-detail__table-action">
                      <MoreVertical className="company-detail__table-action-icon" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
