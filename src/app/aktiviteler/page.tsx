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
  RotateCcw
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { mockCompanies, mockActivities } from '@/data/mockData';
import { ActivityType, Company } from '@/types';
import StatusBadge from '@/components/common/StatusBadge';
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
];

export default function ActivitiesPage() {
  const { user, permissions } = useAuth();
  const [selectedType, setSelectedType] = useState<ActivityType>('cold_call');
  const [selectedCompanyId, setSelectedCompanyId] = useState<string>(mockCompanies[0]?.id || '');
  const [notes, setNotes] = useState('');
  const [showFilter, setShowFilter] = useState(false);
  const [filterType, setFilterType] = useState<ActivityType | ''>('');
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

  // Filter activity log based on selected filter
  const filteredActivityLog = filterType 
    ? mockActivityLog.filter(a => a.status === filterType)
    : mockActivityLog;

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
          <div className="activities-page__filter-wrapper" ref={filterWrapperRef}>
            <button 
              className="activities-page__filter-btn"
              onClick={() => setShowFilter(!showFilter)}
            >
              <Filter className="activities-page__filter-btn-icon" />
              Filtrele
            </button>
            {showFilter && (
              <div className="activities-page__filter-dropdown">
                <div className="activities-page__filter-header">
                  <span>Aktivite Türü</span>
                  <button 
                    className="activities-page__filter-close"
                    onClick={() => setShowFilter(false)}
                  >
                    <X />
                  </button>
                </div>
                <div className="activities-page__filter-options">
                  <label className="activities-page__filter-option">
                    <input 
                      type="radio" 
                      name="filterType" 
                      checked={filterType === ''} 
                      onChange={() => setFilterType('')}
                    />
                    <span>Tümü</span>
                  </label>
                  {activityTypes.map(({ type, label }) => (
                    <label key={type} className="activities-page__filter-option">
                      <input 
                        type="radio" 
                        name="filterType" 
                        checked={filterType === type} 
                        onChange={() => setFilterType(type)}
                      />
                      <span>{label}</span>
                    </label>
                  ))}
                </div>
                <button 
                  className="activities-page__filter-apply"
                  onClick={() => setShowFilter(false)}
                >
                  Uygula
                </button>
              </div>
            )}
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
              {filteredActivityLog.map((activity) => (
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
                    <button className="activity-log__action-btn">
                      <MoreVertical />
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
