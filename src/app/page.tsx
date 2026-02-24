'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  Home, 
  Building2, 
  Phone, 
  Calendar, 
  TrendingUp, 
  TrendingDown,
  Users
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { mockCompanies, mockActivities } from '@/data/mockData';
import { CompanyCard } from '@/components/companies';
import StatusBadge from '@/components/common/StatusBadge';
import './page.css';

export default function DashboardPage() {
  const { isAdmin } = useAuth();
  const router = useRouter();

  const stats = [
    {
      id: 1,
      label: 'Toplam Şirket',
      value: mockCompanies.length,
      icon: <Building2 />,
      iconColor: 'blue',
      trend: '+12%',
      trendUp: true,
    },
    {
      id: 2,
      label: 'Cold Call (Bugün)',
      value: 8,
      icon: <Phone />,
      iconColor: 'green',
      trend: '+5',
      trendUp: true,
    },
    {
      id: 3,
      label: 'Toplantı Planlandı',
      value: 3,
      icon: <Calendar />,
      iconColor: 'orange',
    },
    {
      id: 4,
      label: 'Bu Hafta Yeni Şirket',
      value: 2,
      icon: <Users />,
      iconColor: 'purple',
      trend: '-2',
      trendUp: false,
    },
  ];

  const recentCompanies = mockCompanies.slice(0, 4);
  const recentActivities = mockActivities.slice(0, 5);

  return (
    <div className="dashboard">
      <div className="dashboard__header">
        <div className="dashboard__title">
          <Home className="dashboard__title-icon" />
          <h1 className="dashboard__title-text">Anasayfa</h1>
        </div>
      </div>

      <div className="dashboard__stats">
        {stats.map((stat) => (
          <div key={stat.id} className="stat-card">
            <div className="stat-card__header">
              <div className={`stat-card__icon stat-card__icon--${stat.iconColor}`}>
                {stat.icon}
              </div>
              {stat.trend && (
                <span className={`stat-card__trend ${stat.trendUp ? 'stat-card__trend--up' : 'stat-card__trend--down'}`}>
                  {stat.trendUp ? <TrendingUp className="stat-card__trend-icon" /> : <TrendingDown className="stat-card__trend-icon" />}
                  {stat.trend}
                </span>
              )}
            </div>
            <div className="stat-card__value">{stat.value}</div>
            <div className="stat-card__label">{stat.label}</div>
          </div>
        ))}
      </div>

      <div className="dashboard__content">
        <div className="dashboard__main">
          <div className="dashboard__section">
            <div className="dashboard__section-header">
              <h2 className="dashboard__section-title">Son Eklenen Şirketler</h2>
              <Link href="/sirketler" className="dashboard__section-action">
                Tümünü Gör
              </Link>
            </div>
            <div className="dashboard__recent-companies">
              {recentCompanies.map((company) => (
                <CompanyCard 
                  key={company.id} 
                  company={company} 
                  onClick={() => router.push(`/sirketler/${company.id}`)}
                />
              ))}
            </div>
          </div>

          <div className="dashboard__section">
            <div className="dashboard__section-header">
              <h2 className="dashboard__section-title">Son Aktiviteler</h2>
              <Link href="/aktiviteler" className="dashboard__section-action">
                Tümünü Gör
              </Link>
            </div>
            <div className="dashboard__activity-list">
              {recentActivities.map((activity) => {
                const company = mockCompanies.find(c => c.id === activity.companyId);
                return (
                  <div key={activity.id} className="dashboard__activity-item">
                    <div className="dashboard__activity-left">
                      <div className="dashboard__activity-status">
                        <StatusBadge status={activity.type} showIcon />
                      </div>
                      <div className="dashboard__activity-info">
                        <div className="dashboard__activity-company">{company?.name}</div>
                        <div className="dashboard__activity-meta">{activity.userName}</div>
                      </div>
                    </div>
                    <div className="dashboard__activity-right">
                      <span className="dashboard__activity-date">
                        {(activity.completedAt || activity.createdAt).toLocaleDateString('tr-TR')}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {isAdmin && (
            <div className="dashboard__section">
              <div className="dashboard__section-header">
                <h2 className="dashboard__section-title">Cold Call İstatistikleri</h2>
              </div>
              <div className="dashboard__activity-list">
                <div className="dashboard__activity-item">
                  <div className="dashboard__activity-left">
                    <div className="stat-card__icon stat-card__icon--blue" style={{ width: 32, height: 32 }}>
                      <Phone style={{ width: 18, height: 18 }} />
                    </div>
                    <div>
                      <div className="dashboard__activity-company">Toplam Cold Call</div>
                      <div className="dashboard__activity-meta">Bu ay</div>
                    </div>
                  </div>
                  <div className="dashboard__activity-right">
                    <span className="stat-card__value" style={{ fontSize: 20 }}>156</span>
                  </div>
                </div>
                <div className="dashboard__activity-item">
                  <div className="dashboard__activity-left">
                    <div className="stat-card__icon stat-card__icon--green" style={{ width: 32, height: 32 }}>
                      <Calendar style={{ width: 18, height: 18 }} />
                    </div>
                    <div>
                      <div className="dashboard__activity-company">Dönüşüm Oranı</div>
                      <div className="dashboard__activity-meta">Cold Call → Toplantı</div>
                    </div>
                  </div>
                  <div className="dashboard__activity-right">
                    <span className="stat-card__value" style={{ fontSize: 20 }}>24%</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="dashboard__sidebar">
          <div className="dashboard__section">
            <div className="dashboard__section-header">
              <h2 className="dashboard__section-title">Bekleyen Görevler</h2>
            </div>
            <div className="dashboard__activity-list">
              <div className="dashboard__activity-item">
                <div className="dashboard__activity-left">
                  <div>
                    <div className="dashboard__activity-company">Global Teknoloji&apos;yi ara</div>
                    <div className="dashboard__activity-meta">Bugün - 14:00</div>
                  </div>
                </div>
              </div>
              <div className="dashboard__activity-item">
                <div className="dashboard__activity-left">
                  <div>
                    <div className="dashboard__activity-company">Teklif gönder - Aselsan</div>
                    <div className="dashboard__activity-meta">Yarın - 10:00</div>
                  </div>
                </div>
              </div>
              <div className="dashboard__activity-item">
                <div className="dashboard__activity-left">
                  <div>
                    <div className="dashboard__activity-company">Toplantı - TechCorp</div>
                    <div className="dashboard__activity-meta">25 Şubat - 15:30</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
