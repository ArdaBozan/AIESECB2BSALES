'use client';

import React, { useState, useMemo } from 'react';
import { 
  Users, 
  Search, 
  Plus, 
  Building2, 
  User, 
  Phone, 
  Mail,
  MessageSquare,
  Info,
  Save
} from 'lucide-react';
import { mockCompanies, mockContacts } from '@/data/mockData';
import { useAuth } from '@/contexts/AuthContext';
import Modal from '@/components/common/Modal';
import './page.css';

export default function PeoplePage() {
  const { permissions } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  
  // Add contact form state
  const [newContact, setNewContact] = useState({
    companyId: '',
    name: '',
    email: '',
    phone: '',
    position: '',
    isPrimary: false,
  });

  // Group contacts by company
  const companiesWithContacts = useMemo(() => {
    return mockCompanies.map(company => {
      const contacts = mockContacts.filter(c => c.companyId === company.id);
      return {
        ...company,
        contacts: contacts.filter(contact => 
          contact.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (contact.email && contact.email.toLowerCase().includes(searchQuery.toLowerCase()))
        ),
      };
    }).filter(company => company.contacts.length > 0 || searchQuery === '');
  }, [searchQuery]);

  const totalContacts = mockContacts.length;

  // Add contact handler
  const handleAddContact = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, this would submit to an API
    alert(`Kişi eklendi: ${newContact.name}`);
    setShowAddModal(false);
    setNewContact({
      companyId: '',
      name: '',
      email: '',
      phone: '',
      position: '',
      isPrimary: false,
    });
  };

  return (
    <div className="people-page">
      <div className="people-page__header">
        <div className="people-page__title">
          <Users className="people-page__title-icon" />
          <h1 className="people-page__title-text">Kişiler</h1>
        </div>
        <div className="people-page__actions">
          <div className="people-page__search">
            <Search className="people-page__search-icon" />
            <input
              type="text"
              className="people-page__search-input"
              placeholder="Kişi ara..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <button 
            className="people-page__add-btn"
            onClick={() => setShowAddModal(true)}
          >
            <Plus className="people-page__add-btn-icon" />
            Kişi Ekle
          </button>
        </div>
      </div>

      <div className="people-page__info">
        <Info className="people-page__info-icon" />
        <span className="people-page__info-text">
          Tüm kişiler şirketlere bağlıdır. Yeni kişi eklemek için önce bir şirket seçin veya oluşturun.
        </span>
      </div>

      <div className="people-page__companies">
        {companiesWithContacts.map((company) => (
          <div key={company.id} className="people-page__company">
            <div className="people-page__company-header">
              <div className="people-page__company-info">
                <div className="people-page__company-icon">
                  <Building2 />
                </div>
                <div className="people-page__company-details">
                  <h3 className="people-page__company-name">{company.name}</h3>
                  <p className="people-page__company-meta">{company.category} • {company.location}</p>
                </div>
              </div>
              <span className="people-page__company-count">
                {company.contacts.length} kişi
              </span>
            </div>
            
            {company.contacts.length > 0 ? (
              <div className="people-page__contacts">
                {company.contacts.map((contact) => (
                  <div key={contact.id} className="contact-card">
                    <div className="contact-card__avatar">
                      <User className="contact-card__avatar-icon" />
                    </div>
                    <div className="contact-card__content">
                      <div className="contact-card__name">
                        {contact.name}
                        {contact.isPrimary && (
                          <span className="contact-card__primary-badge">Birincil</span>
                        )}
                      </div>
                      {contact.position && (
                        <div className="contact-card__position">{contact.position}</div>
                      )}
                      <div className="contact-card__meta">
                        {contact.phone && (
                          <div className="contact-card__meta-item">
                            <Phone className="contact-card__meta-icon" />
                            {contact.phone}
                          </div>
                        )}
                        {contact.email && (
                          <div className="contact-card__meta-item">
                            <Mail className="contact-card__meta-icon" />
                            {contact.email}
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="contact-card__actions">
                      <button className="contact-card__action">
                        <Phone className="contact-card__action-icon" />
                      </button>
                      <button className="contact-card__action">
                        <MessageSquare className="contact-card__action-icon" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="people-page__contacts" style={{ padding: 'var(--spacing-lg)' }}>
                <p style={{ color: 'var(--text-light)', fontSize: '14px' }}>
                  Bu şirkette henüz kişi bulunmuyor.
                </p>
              </div>
            )}
          </div>
        ))}
      </div>

      {companiesWithContacts.length === 0 && searchQuery && (
        <div style={{ textAlign: 'center', padding: 'var(--spacing-2xl)' }}>
          <p style={{ color: 'var(--text-light)' }}>
            &quot;{searchQuery}&quot; için sonuç bulunamadı.
          </p>
        </div>
      )}

      {/* Add Contact Modal */}
      <Modal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        title="Yeni Kişi Ekle"
        maxWidth="520px"
      >
        <form className="modal__form" onSubmit={handleAddContact}>
          <div className="modal__section">
            <h4 className="modal__section-title">Şirket Seçimi</h4>
            <div className="modal__field">
              <label className="modal__label modal__label--required">Şirket</label>
              <select
                className="modal__select"
                value={newContact.companyId}
                onChange={(e) => setNewContact(prev => ({ ...prev, companyId: e.target.value }))}
                required
              >
                <option value="">Şirket seçin</option>
                {mockCompanies.map(company => (
                  <option key={company.id} value={company.id}>{company.name}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="modal__section">
            <h4 className="modal__section-title">Kişi Bilgileri</h4>
            <div className="modal__row">
              <div className="modal__field">
                <label className="modal__label modal__label--required">Ad Soyad</label>
                <input
                  type="text"
                  className="modal__input"
                  placeholder="Ad Soyad"
                  value={newContact.name}
                  onChange={(e) => setNewContact(prev => ({ ...prev, name: e.target.value }))}
                  required
                />
              </div>
              <div className="modal__field">
                <label className="modal__label">Pozisyon</label>
                <input
                  type="text"
                  className="modal__input"
                  placeholder="Örn: Satış Müdürü"
                  value={newContact.position}
                  onChange={(e) => setNewContact(prev => ({ ...prev, position: e.target.value }))}
                />
              </div>
            </div>
          </div>

          <div className="modal__section">
            <h4 className="modal__section-title">İletişim Bilgileri</h4>
            <div className="modal__row">
              <div className="modal__field">
                <label className="modal__label">Telefon</label>
                <input
                  type="tel"
                  className="modal__input"
                  placeholder="+90 XXX XXX XX XX"
                  value={newContact.phone}
                  onChange={(e) => setNewContact(prev => ({ ...prev, phone: e.target.value }))}
                />
              </div>
              <div className="modal__field">
                <label className="modal__label">E-posta</label>
                <input
                  type="email"
                  className="modal__input"
                  placeholder="email@sirket.com"
                  value={newContact.email}
                  onChange={(e) => setNewContact(prev => ({ ...prev, email: e.target.value }))}
                />
              </div>
            </div>
          </div>

          <div className="modal__section">
            <label className="modal__checkbox-label">
              <input
                type="checkbox"
                checked={newContact.isPrimary}
                onChange={(e) => setNewContact(prev => ({ ...prev, isPrimary: e.target.checked }))}
              />
              <span>Bu kişiyi birincil bağlantı olarak işaretle</span>
            </label>
          </div>

          <div className="modal__actions">
            <button
              type="button"
              className="modal__btn modal__btn--secondary"
              onClick={() => setShowAddModal(false)}
            >
              İptal
            </button>
            <button type="submit" className="modal__btn modal__btn--primary">
              <Save />
              Kaydet
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
