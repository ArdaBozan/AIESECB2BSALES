'use client';

import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { X, User, Camera, Eye, EyeOff, Check, AlertCircle, LogOut } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { UserRole } from '@/types';
import ConfirmModal from '@/components/common/ConfirmModal';
import './ProfileModal.css';

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const roleLabels: Record<UserRole, string> = {
  MCP: 'MCP',
  MCVP: 'MCVP',
  LCP: 'LCP',
  LCVP: 'LCVP',
  TeamLeader: 'Team Leader',
  TeamMember: 'Takım Üyesi',
};

const departmentLabels: Record<UserRole, string> = {
  MCP: 'Yönetim',
  MCVP: 'Yönetim',
  LCP: 'Yerel Komite',
  LCVP: 'Yerel Komite',
  TeamLeader: 'Satış Ekibi',
  TeamMember: 'Satış Ekibi',
};

const languages = [
  { value: 'tr', label: 'Türkçe' },
  { value: 'en', label: 'English' },
];

const timezones = [
  { value: 'Europe/Istanbul', label: 'İstanbul (UTC+3)' },
  { value: 'Europe/London', label: 'Londra (UTC+0)' },
  { value: 'America/New_York', label: 'New York (UTC-5)' },
  { value: 'Asia/Tokyo', label: 'Tokyo (UTC+9)' },
];

export default function ProfileModal({ isOpen, onClose }: ProfileModalProps) {
  const { user, setUser, logout } = useAuth();
  const modalRef = useRef<HTMLDivElement>(null);

  // Form state
  const [fullName, setFullName] = useState(user.name);
  const [email, setEmail] = useState(user.email);
  const [phone, setPhone] = useState('');
  const [language, setLanguage] = useState('tr');
  const [timezone, setTimezone] = useState('Europe/Istanbul');
  
  // Password state
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  // Validation state
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  // Reset form when modal opens
  useEffect(() => {
    if (isOpen) {
      setFullName(user.name);
      setEmail(user.email);
      setErrors({});
      setSaveSuccess(false);
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    }
  }, [isOpen, user]);

  // Handle escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  // Handle click outside
  const handleBackdropClick = (e: React.MouseEvent) => {
    if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
      onClose();
    }
  };

  // Lock body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  // Password strength calculator
  const getPasswordStrength = (password: string): { level: number; label: string; color: string } => {
    if (!password) return { level: 0, label: '', color: '' };
    
    let strength = 0;
    if (password.length >= 8) strength++;
    if (password.match(/[a-z]/)) strength++;
    if (password.match(/[A-Z]/)) strength++;
    if (password.match(/[0-9]/)) strength++;
    if (password.match(/[^a-zA-Z0-9]/)) strength++;

    if (strength <= 2) return { level: 1, label: 'Zayıf', color: 'var(--status-negative)' };
    if (strength <= 3) return { level: 2, label: 'Orta', color: 'var(--status-passive)' };
    if (strength <= 4) return { level: 3, label: 'Güçlü', color: 'var(--activity-meeting)' };
    return { level: 4, label: 'Çok Güçlü', color: 'var(--status-active)' };
  };

  const passwordStrength = getPasswordStrength(newPassword);

  // Validation
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!fullName.trim()) {
      newErrors.fullName = 'Ad Soyad zorunludur';
    }

    if (!email.trim()) {
      newErrors.email = 'E-posta zorunludur';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = 'Geçerli bir e-posta adresi girin';
    }

    // Password validation only if user is trying to change password
    if (newPassword || confirmPassword || currentPassword) {
      if (!currentPassword) {
        newErrors.currentPassword = 'Mevcut şifrenizi girin';
      }
      if (!newPassword) {
        newErrors.newPassword = 'Yeni şifre zorunludur';
      } else if (newPassword.length < 8) {
        newErrors.newPassword = 'Şifre en az 8 karakter olmalıdır';
      }
      if (newPassword !== confirmPassword) {
        newErrors.confirmPassword = 'Şifreler eşleşmiyor';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsSaving(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // Update user in context
    setUser({
      ...user,
      name: fullName,
      email: email,
    });
    
    setIsSaving(false);
    setSaveSuccess(true);
    
    // Close modal after success
    setTimeout(() => {
      onClose();
    }, 1000);
  };

  if (!isOpen) return null;

  return createPortal(
    <div className="profile-modal__overlay" onClick={handleBackdropClick}>
      <div className="profile-modal" ref={modalRef}>
        <div className="profile-modal__header">
          <h2 className="profile-modal__title">Profil Ayarları</h2>
          <button className="profile-modal__close" onClick={onClose} aria-label="Kapat">
            <X />
          </button>
        </div>

        <form className="profile-modal__content" onSubmit={handleSubmit}>
          {/* Profile Photo Section */}
          <div className="profile-modal__section">
            <h3 className="profile-modal__section-title">Profil Fotoğrafı</h3>
            <div className="profile-modal__avatar-wrapper">
              <div className="profile-modal__avatar">
                {user.avatar ? (
                  <img src={user.avatar} alt={user.name} />
                ) : (
                  <User className="profile-modal__avatar-icon" />
                )}
              </div>
              <div className="profile-modal__avatar-actions">
                <button type="button" className="profile-modal__avatar-btn">
                  <Camera />
                  Fotoğraf Değiştir
                </button>
                <button type="button" className="profile-modal__avatar-btn profile-modal__avatar-btn--secondary">
                  Kaldır
                </button>
              </div>
            </div>
          </div>

          {/* Basic Information */}
          <div className="profile-modal__section">
            <h3 className="profile-modal__section-title">Temel Bilgiler</h3>
            
            <div className="profile-modal__field">
              <label className="profile-modal__label">Ad Soyad *</label>
              <input
                type="text"
                className={`profile-modal__input ${errors.fullName ? 'profile-modal__input--error' : ''}`}
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Ad Soyad"
              />
              {errors.fullName && (
                <span className="profile-modal__error">
                  <AlertCircle />
                  {errors.fullName}
                </span>
              )}
            </div>

            <div className="profile-modal__field">
              <label className="profile-modal__label">Rol</label>
              <input
                type="text"
                className="profile-modal__input profile-modal__input--readonly"
                value={roleLabels[user.role]}
                readOnly
              />
            </div>

            <div className="profile-modal__field">
              <label className="profile-modal__label">Departman</label>
              <input
                type="text"
                className="profile-modal__input profile-modal__input--readonly"
                value={departmentLabels[user.role]}
                readOnly
              />
            </div>
          </div>

          {/* Contact Information */}
          <div className="profile-modal__section">
            <h3 className="profile-modal__section-title">İletişim Bilgileri</h3>
            
            <div className="profile-modal__field">
              <label className="profile-modal__label">E-posta Adresi *</label>
              <input
                type="email"
                className={`profile-modal__input ${errors.email ? 'profile-modal__input--error' : ''}`}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="ornek@aiesec.net"
              />
              {errors.email && (
                <span className="profile-modal__error">
                  <AlertCircle />
                  {errors.email}
                </span>
              )}
            </div>

            <div className="profile-modal__field">
              <label className="profile-modal__label">Telefon Numarası</label>
              <input
                type="tel"
                className="profile-modal__input"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+90 555 123 4567"
              />
            </div>
          </div>

          {/* Account Settings */}
          <div className="profile-modal__section">
            <h3 className="profile-modal__section-title">Hesap Ayarları</h3>
            
            <div className="profile-modal__row">
              <div className="profile-modal__field">
                <label className="profile-modal__label">Dil</label>
                <select
                  className="profile-modal__select"
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                >
                  {languages.map(lang => (
                    <option key={lang.value} value={lang.value}>{lang.label}</option>
                  ))}
                </select>
              </div>

              <div className="profile-modal__field">
                <label className="profile-modal__label">Saat Dilimi</label>
                <select
                  className="profile-modal__select"
                  value={timezone}
                  onChange={(e) => setTimezone(e.target.value)}
                >
                  {timezones.map(tz => (
                    <option key={tz.value} value={tz.value}>{tz.label}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Security */}
          <div className="profile-modal__section">
            <h3 className="profile-modal__section-title">Güvenlik</h3>
            
            <div className="profile-modal__field">
              <label className="profile-modal__label">Mevcut Şifre</label>
              <div className="profile-modal__password-wrapper">
                <input
                  type={showCurrentPassword ? 'text' : 'password'}
                  className={`profile-modal__input ${errors.currentPassword ? 'profile-modal__input--error' : ''}`}
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  className="profile-modal__password-toggle"
                  onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                >
                  {showCurrentPassword ? <EyeOff /> : <Eye />}
                </button>
              </div>
              {errors.currentPassword && (
                <span className="profile-modal__error">
                  <AlertCircle />
                  {errors.currentPassword}
                </span>
              )}
            </div>

            <div className="profile-modal__field">
              <label className="profile-modal__label">Yeni Şifre</label>
              <div className="profile-modal__password-wrapper">
                <input
                  type={showNewPassword ? 'text' : 'password'}
                  className={`profile-modal__input ${errors.newPassword ? 'profile-modal__input--error' : ''}`}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  className="profile-modal__password-toggle"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                >
                  {showNewPassword ? <EyeOff /> : <Eye />}
                </button>
              </div>
              {newPassword && (
                <div className="profile-modal__strength">
                  <div className="profile-modal__strength-bars">
                    {[1, 2, 3, 4].map(level => (
                      <div
                        key={level}
                        className="profile-modal__strength-bar"
                        style={{
                          backgroundColor: level <= passwordStrength.level 
                            ? passwordStrength.color 
                            : 'var(--border-color)',
                        }}
                      />
                    ))}
                  </div>
                  <span 
                    className="profile-modal__strength-label"
                    style={{ color: passwordStrength.color }}
                  >
                    {passwordStrength.label}
                  </span>
                </div>
              )}
              {errors.newPassword && (
                <span className="profile-modal__error">
                  <AlertCircle />
                  {errors.newPassword}
                </span>
              )}
            </div>

            <div className="profile-modal__field">
              <label className="profile-modal__label">Şifreyi Onayla</label>
              <div className="profile-modal__password-wrapper">
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  className={`profile-modal__input ${errors.confirmPassword ? 'profile-modal__input--error' : ''}`}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  className="profile-modal__password-toggle"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? <EyeOff /> : <Eye />}
                </button>
              </div>
              {errors.confirmPassword && (
                <span className="profile-modal__error">
                  <AlertCircle />
                  {errors.confirmPassword}
                </span>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="profile-modal__actions">
            <button 
              type="button" 
              className="profile-modal__btn profile-modal__btn--logout"
              onClick={() => setShowLogoutConfirm(true)}
            >
              <LogOut />
              Çıkış Yap
            </button>
            <div className="profile-modal__actions-right">
              <button 
                type="button" 
                className="profile-modal__btn profile-modal__btn--secondary"
                onClick={onClose}
              >
                İptal
              </button>
              <button 
                type="submit" 
                className={`profile-modal__btn profile-modal__btn--primary ${saveSuccess ? 'profile-modal__btn--success' : ''}`}
                disabled={isSaving}
              >
                {isSaving ? (
                  'Kaydediliyor...'
                ) : saveSuccess ? (
                  <>
                    <Check />
                    Kaydedildi
                  </>
                ) : (
                  'Değişiklikleri Kaydet'
                )}
              </button>
            </div>
          </div>
        </form>

        {/* Logout Confirmation Modal */}
        <ConfirmModal
          isOpen={showLogoutConfirm}
          onClose={() => setShowLogoutConfirm(false)}
          onConfirm={() => {
            logout();
            onClose();
          }}
          title="Çıkış Yap"
          message="Hesabınızdan çıkış yapmak istediğinizden emin misiniz?"
          confirmText="Çıkış Yap"
          cancelText="İptal"
          type="danger"
        />
      </div>
    </div>,
    document.body
  );
}
