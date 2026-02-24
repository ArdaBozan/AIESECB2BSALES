'use client';

import React from 'react';
import { Building2, FileText, MapPin, Users, RefreshCw } from 'lucide-react';
import { Company } from '@/types';
import StatusBadge from '@/components/common/StatusBadge';
import './CompanyCard.css';

interface CompanyCardProps {
  company: Company;
  onClick?: () => void;
}

const iconColors = ['blue', 'green', 'orange'];

export default function CompanyCard({ company, onClick }: CompanyCardProps) {
  const colorIndex = parseInt(company.id) % iconColors.length;
  const iconColor = iconColors[colorIndex];

  return (
    <div className="company-card" onClick={onClick}>
      <div className="company-card__header">
        <div className={`company-card__icon-wrapper company-card__icon-wrapper--${iconColor}`}>
          <Building2 className="company-card__icon" />
        </div>
        <div className="company-card__info">
          <div className="company-card__title-row">
            <h3 className="company-card__name">{company.name}</h3>
            <div className="company-card__status">
              <StatusBadge status={company.status} />
            </div>
          </div>
          <div className="company-card__meta">
            <span className="company-card__category">
              <FileText className="company-card__meta-icon" />
              {company.category}
            </span>
            <span className="company-card__location">
              <MapPin className="company-card__meta-icon" />
              {company.location}
            </span>
          </div>
        </div>
      </div>
      
      <div className="company-card__footer">
        <div className={`company-card__proposals ${company.activeProposals === 0 ? 'company-card__proposals--empty' : ''}`}>
          <RefreshCw className="company-card__proposals-icon" />
          {company.activeProposals > 0 
            ? `${company.activeProposals} Adet Aktif Teklif`
            : 'Teklif Yok'
          }
        </div>
        <div className={`company-card__contacts ${company.contactCount === 0 ? 'company-card__contacts--empty' : ''}`}>
          <Users className="company-card__contacts-icon" />
          {company.contactCount > 0 
            ? `${company.contactCount} Bağlantı`
            : 'Bağlantı Yok'
          }
        </div>
      </div>
    </div>
  );
}
