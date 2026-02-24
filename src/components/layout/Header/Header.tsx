'use client';

import React, { useState, useRef, useEffect } from 'react';
import { 
  Search, 
  Bell, 
  User, 
  ChevronDown, 
  Building2, 
  DollarSign, 
  X, 
  Check, 
  Clock,
  MessageSquare,
  UserPlus,
  FileText,
  AlertCircle,
  CheckCircle2
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useSearch } from '@/contexts/SearchContext';
import { UserRole } from '@/types';
import ProfileModal from '@/components/common/ProfileModal/ProfileModal';
import './Header.css';

// Mock notifications data
interface Notification {
  id: string;
  type: 'deal' | 'activity' | 'mention' | 'assignment' | 'system';
  title: string;
  message: string;
  time: string;
  read: boolean;
  actionUrl?: string;
}

const mockNotifications: Notification[] = [
  {
    id: '1',
    type: 'deal',
    title: 'Yeni Teklif Kazanıldı',
    message: 'Global Teknoloji şirketi ile 150.000₺ değerinde teklif onaylandı.',
    time: '5 dakika önce',
    read: false,
  },
  {
    id: '2',
    type: 'mention',
    title: 'Bahsedildiniz',
    message: 'Mehmet Yıldırım sizi "Aselsan Görüşmesi" notunda etiketledi.',
    time: '15 dakika önce',
    read: false,
  },
  {
    id: '3',
    type: 'assignment',
    title: 'Yeni Görev Atandı',
    message: 'TechCorp Solutions şirketine cold call görevi atandı.',
    time: '1 saat önce',
    read: false,
  },
  {
    id: '4',
    type: 'activity',
    title: 'Aktivite Hatırlatması',
    message: 'Savunma Bakanlığı ile planlanan görüşme 30 dakika sonra.',
    time: '2 saat önce',
    read: true,
  },
  {
    id: '5',
    type: 'system',
    title: 'Haftalık Rapor Hazır',
    message: 'Bu haftanın satış performans raporu hazırlandı.',
    time: '1 gün önce',
    read: true,
  },
];

const notificationIcons: Record<string, React.ReactNode> = {
  deal: <DollarSign />,
  activity: <Clock />,
  mention: <MessageSquare />,
  assignment: <UserPlus />,
  system: <FileText />,
};

const roleLabels: Record<UserRole, string> = {
  MCP: 'MCP',
  MCVP: 'MCVP',
  LCP: 'LCP',
  LCVP: 'LCVP',
  TeamLeader: 'Team Leader',
  TeamMember: 'Takım Üyesi',
};

const typeIcons: Record<string, React.ReactNode> = {
  company: <Building2 className="header__result-icon header__result-icon--company" />,
  contact: <User className="header__result-icon header__result-icon--contact" />,
  deal: <DollarSign className="header__result-icon header__result-icon--deal" />,
  activity: <Bell className="header__result-icon header__result-icon--activity" />,
};

const typeLabels: Record<string, string> = {
  company: 'Şirket',
  contact: 'Kişi',
  deal: 'Teklif',
  activity: 'Aktivite',
};

export default function Header() {
  const { user } = useAuth();
  const { query, setQuery, results, placeholder, clearSearch, navigateToResult } = useSearch();
  const [showResults, setShowResults] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>(mockNotifications);
  const searchRef = useRef<HTMLDivElement>(null);
  const notificationRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  
  const unreadCount = notifications.filter(n => !n.read).length;

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowResults(false);
      }
      if (notificationRef.current && !notificationRef.current.contains(event.target as Node)) {
        setShowNotifications(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Show results when query changes
  useEffect(() => {
    if (query.length >= 2) {
      setShowResults(true);
    }
  }, [query]);

  // Handle keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      setShowResults(false);
      inputRef.current?.blur();
    }
    if (e.key === 'Enter' && results.length > 0) {
      navigateToResult(results[0]);
      setShowResults(false);
    }
  };

  const handleResultClick = (result: typeof results[0]) => {
    navigateToResult(result);
    setShowResults(false);
  };

  const markAsRead = (id: string) => {
    setNotifications(prev => 
      prev.map(n => n.id === id ? { ...n, read: true } : n)
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  return (
    <header className="header">
      <div className="header__search" ref={searchRef}>
        <div className="header__search-wrapper">
          <Search className="header__search-icon" />
          <input
            ref={inputRef}
            type="text"
            className="header__search-input"
            placeholder={placeholder}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => query.length >= 2 && setShowResults(true)}
            onKeyDown={handleKeyDown}
          />
          {query && (
            <button 
              className="header__search-clear"
              onClick={() => {
                clearSearch();
                setShowResults(false);
              }}
            >
              <X />
            </button>
          )}
        </div>

        {/* Search Results Dropdown */}
        {showResults && query.length >= 2 && (
          <div className="header__search-results">
            {results.length > 0 ? (
              <>
                <div className="header__results-header">
                  <span>{results.length} sonuç bulundu</span>
                </div>
                <div className="header__results-list">
                  {results.map((result) => (
                    <button
                      key={`${result.type}-${result.id}`}
                      className="header__result-item"
                      onClick={() => handleResultClick(result)}
                    >
                      {typeIcons[result.type]}
                      <div className="header__result-content">
                        <span className="header__result-title">{result.title}</span>
                        <span className="header__result-subtitle">{result.subtitle}</span>
                      </div>
                      <span className="header__result-type">{typeLabels[result.type]}</span>
                    </button>
                  ))}
                </div>
              </>
            ) : (
              <div className="header__results-empty">
                <Search className="header__results-empty-icon" />
                <span>Sonuç bulunamadı</span>
                <span className="header__results-empty-hint">Farklı bir arama terimi deneyin</span>
              </div>
            )}
          </div>
        )}
      </div>

      <div className="header__actions">
        <div className="header__notification-wrapper" ref={notificationRef}>
          <button 
            className="header__notification"
            onClick={() => setShowNotifications(!showNotifications)}
          >
            <Bell className="header__notification-icon" />
            {unreadCount > 0 && (
              <span className="header__notification-badge">{unreadCount}</span>
            )}
            <span className="header__notification-text">{unreadCount} Yeni Bildirim</span>
          </button>

          {/* Notifications Dropdown */}
          {showNotifications && (
            <div className="header__notifications-dropdown">
              <div className="header__notifications-header">
                <div className="header__notifications-title">
                  <Bell className="header__notifications-title-icon" />
                  <span>Bildirimler</span>
                  {unreadCount > 0 && (
                    <span className="header__notifications-count">{unreadCount}</span>
                  )}
                </div>
                {unreadCount > 0 && (
                  <button 
                    className="header__notifications-mark-all"
                    onClick={markAllAsRead}
                  >
                    <CheckCircle2 />
                    Tümünü Okundu İşaretle
                  </button>
                )}
              </div>

              <div className="header__notifications-list">
                {notifications.length > 0 ? (
                  notifications.map((notification) => (
                    <div 
                      key={notification.id}
                      className={`header__notification-item ${!notification.read ? 'header__notification-item--unread' : ''}`}
                      onClick={() => markAsRead(notification.id)}
                    >
                      <div className={`header__notification-item-icon header__notification-item-icon--${notification.type}`}>
                        {notificationIcons[notification.type]}
                      </div>
                      <div className="header__notification-item-content">
                        <div className="header__notification-item-header">
                          <span className="header__notification-item-title">{notification.title}</span>
                          {!notification.read && (
                            <span className="header__notification-item-dot" />
                          )}
                        </div>
                        <p className="header__notification-item-message">{notification.message}</p>
                        <span className="header__notification-item-time">{notification.time}</span>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="header__notifications-empty">
                    <Bell className="header__notifications-empty-icon" />
                    <span>Bildirim yok</span>
                    <span className="header__notifications-empty-hint">Yeni bildirimler burada görünecek</span>
                  </div>
                )}
              </div>

              <div className="header__notifications-footer">
                <button className="header__notifications-view-all">
                  Tüm Bildirimleri Gör
                </button>
              </div>
            </div>
          )}
        </div>

        <div className="header__divider" />

        <div className="header__user" onClick={() => setShowProfileModal(true)}>
          <div className="header__user-info">
            <span className="header__user-greeting">
              Merhaba, <span className="header__user-name">{user.name}</span>
            </span>
            <span className="header__user-role">{roleLabels[user.role]}</span>
          </div>
          <div className="header__user-avatar">
            <User className="header__user-avatar-icon" />
          </div>
          <ChevronDown className="header__dropdown-icon" />
        </div>
      </div>

      <ProfileModal 
        isOpen={showProfileModal} 
        onClose={() => setShowProfileModal(false)} 
      />
    </header>
  );
}
