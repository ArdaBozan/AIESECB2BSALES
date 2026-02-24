'use client';

import React from 'react';
import { 
  Building2, 
  FileText, 
  Phone, 
  Mail, 
  MapPin, 
  Edit3, 
  Eye, 
  Settings,
  User
} from 'lucide-react';
import { Company, Activity } from '@/types';
import { useAuth } from '@/contexts/AuthContext';
import StatusBadge from '@/components/common/StatusBadge';
import './CompanySidebar.css';

interface CompanySidebarProps {
  company: Company;
  recentActivities?: Activity[];
  onViewProfile?: () => void;
  onManageActivities?: () => void;
}

function formatRelativeTime(date: Date): string {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  
  if (diffDays === 0) return 'Bugün';
  if (diffDays === 1) return '1 gün önce';
  if (diffDays < 7) return `${diffDays} gün önce`;
  if (diffDays < 30) return `${Math.floor(diffDays / 7)} hafta önce`;
  return `${Math.floor(diffDays / 30)} ay önce`;
}

export default function CompanySidebar({ 
  company, 
  recentActivities = [],
  onViewProfile,
  onManageActivities 
}: CompanySidebarProps) {
  const { permissions } = useAuth();

  return (
    <div className="company-sidebar">
      <div className="company-sidebar__header">
        <div className="company-sidebar__icon">
          <Building2 />
        </div>
        <div className="company-sidebar__title">
          <h2 className="company-sidebar__name">{company.name}</h2>
          <div className="company-sidebar__category">
            <FileText className="company-sidebar__category-icon" />
            Şirket Türü
          </div>
          <div style={{ marginTop: '4px', fontSize: '14px', fontWeight: 500 }}>
            {company.category}
          </div>
        </div>
      </div>

      <div className="company-sidebar__section">
        <div className="company-sidebar__section-header">
          <h3 className="company-sidebar__section-title">İletişim Bilgileri</h3>
          {permissions.canEditCompany && (
            <button className="company-sidebar__section-edit">
              <Edit3 className="company-sidebar__section-edit-icon" />
            </button>
          )}
        </div>

        <div className="company-sidebar__info-item">
          <Phone className="company-sidebar__info-icon" />
          <div className="company-sidebar__info-content">
            <div className="company-sidebar__info-label">Telefon Numarası</div>
            <div className="company-sidebar__info-value">{company.phone}</div>
          </div>
        </div>

        <div className="company-sidebar__info-item">
          <Mail className="company-sidebar__info-icon" />
          <div className="company-sidebar__info-content">
            <div className="company-sidebar__info-label">E-Posta Adresi</div>
            <div className="company-sidebar__info-value">{company.email}</div>
          </div>
        </div>

        <div className="company-sidebar__info-item">
          <MapPin className="company-sidebar__info-icon" />
          <div className="company-sidebar__info-content">
            <div className="company-sidebar__info-label">Lokasyon</div>
            <div className="company-sidebar__info-value">{company.location}</div>
          </div>
        </div>
      </div>

      {recentActivities.length > 0 && (
        <div className="company-sidebar__section">
          <div className="company-sidebar__section-header">
            <h3 className="company-sidebar__section-title">Aktivite Özeti</h3>
            <button className="company-sidebar__section-edit">
              <Settings className="company-sidebar__section-edit-icon" />
            </button>
          </div>

          {recentActivities.slice(0, 4).map((activity) => (
            <div key={activity.id} className="company-sidebar__activity-item">
              <div className="company-sidebar__activity-left">
                <StatusBadge status={activity.type} showIcon />
              </div>
              <div className="company-sidebar__activity-user">
                <User className="company-sidebar__activity-user-icon" />
                <span className="company-sidebar__activity-name" title={activity.userName}>
                  {activity.userName}
                </span>
              </div>
              <span className="company-sidebar__activity-date">
                {formatRelativeTime(activity.completedAt || activity.createdAt)}
              </span>
            </div>
          ))}
        </div>
      )}

      <div className="company-sidebar__actions">
        <button 
          className="company-sidebar__action-btn company-sidebar__action-btn--primary"
          onClick={onViewProfile}
        >
          <Eye className="company-sidebar__action-icon" />
          Tam Profili Görüntüle
        </button>
        <button 
          className="company-sidebar__action-btn company-sidebar__action-btn--secondary"
          onClick={onManageActivities}
        >
          <Settings className="company-sidebar__action-icon" />
          Aktiviteyi Yönet
        </button>
      </div>
    </div>
  );
}
