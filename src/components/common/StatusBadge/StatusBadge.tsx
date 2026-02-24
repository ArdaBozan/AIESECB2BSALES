'use client';

import React from 'react';
import { Phone, Clock, Mail, CheckCircle, DollarSign, MessageSquare } from 'lucide-react';
import { CompanyStatus, ActivityType, DealStage, ActivityStatus } from '@/types';
import './StatusBadge.css';

type BadgeType = CompanyStatus | ActivityType | DealStage | ActivityStatus;

interface StatusBadgeProps {
  status: BadgeType;
  showIcon?: boolean;
}

const statusLabels: Record<string, string> = {
  // Company Status
  aktif: 'Aktif',
  pasif: 'Pasif',
  negatif: 'Negatif',
  pozitif: 'Pozitif',
  cevap_yok: 'Cevap Yok',
  tekrar_ara: 'Tekrar Ara',
  toplanti_planlandi: 'Toplantı Planlandı',
  
  // Activity Type
  cold_call: 'Cold Call',
  meeting: 'Görüşmede',
  email: 'E-posta',
  task: 'Görev',
  proposal: 'Teklif Verildi',
  postponed: 'Ertelendi',
  
  // Deal Stage
  new_lead: 'Yeni Lead',
  qualified: 'Nitelikli',
  negotiation: 'Müzakere',
  closed_won: 'Kazanıldı',
  closed_lost: 'Kaybedildi',
  
  // Activity Status
  completed: 'Tamamlandı',
  pending: 'Bekliyor',
  overdue: 'Gecikmiş',
  cancelled: 'İptal',
};

const statusIcons: Record<string, React.ReactNode> = {
  cold_call: <Phone className="status-badge__icon" />,
  meeting: <MessageSquare className="status-badge__icon" />,
  postponed: <Clock className="status-badge__icon" />,
  proposal: <DollarSign className="status-badge__icon" />,
  email: <Mail className="status-badge__icon" />,
  completed: <CheckCircle className="status-badge__icon" />,
};

export default function StatusBadge({ status, showIcon = false }: StatusBadgeProps) {
  const label = statusLabels[status] || status;
  const icon = showIcon ? statusIcons[status] : null;

  return (
    <span className={`status-badge status-badge--${status}`}>
      {icon}
      {label}
    </span>
  );
}
