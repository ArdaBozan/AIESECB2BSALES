'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  Home, 
  Building2, 
  Users, 
  DollarSign,
  ListTodo,
  Menu,
  X
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { UserRole } from '@/types';
import './Sidebar.css';

interface NavItem {
  href: string;
  label: string;
  icon: React.ReactNode;
  requiresPermission?: keyof typeof permissionMap;
}

const permissionMap = {
  viewDeals: 'canViewDeals',
} as const;

const navItems: NavItem[] = [
  {
    href: '/',
    label: 'Anasayfa',
    icon: <Home className="sidebar__nav-icon" />,
  },
  {
    href: '/sirketler',
    label: 'Şirketler',
    icon: <Building2 className="sidebar__nav-icon" />,
  },
  {
    href: '/kisiler',
    label: 'Kişiler',
    icon: <Users className="sidebar__nav-icon" />,
  },
  {
    href: '/teklifler',
    label: 'Teklifler',
    icon: <DollarSign className="sidebar__nav-icon" />,
    requiresPermission: 'viewDeals',
  },
  {
    href: '/aktiviteler',
    label: 'Aktiviteler',
    icon: <ListTodo className="sidebar__nav-icon" />,
  },
];

const roleLabels: Record<UserRole, string> = {
  MCP: 'MCP',
  MCVP: 'MCVP',
  LCP: 'LCP',
  LCVP: 'LCVP',
  TeamLeader: 'Team Leader',
  TeamMember: 'Takım Üyesi',
};

export default function Sidebar() {
  const pathname = usePathname();
  const { user, permissions, switchRole } = useAuth();
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileOpen(false);
  }, [pathname]);

  // Close mobile menu on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsMobileOpen(false);
    };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, []);

  const isActive = (href: string) => {
    if (href === '/') {
      return pathname === '/';
    }
    return pathname.startsWith(href);
  };

  const filteredNavItems = navItems.filter(item => {
    if (item.requiresPermission === 'viewDeals') {
      return permissions.canViewDeals;
    }
    return true;
  });

  return (
    <>
      <button 
        className={`sidebar__mobile-toggle ${isMobileOpen ? 'sidebar__mobile-toggle--hidden' : ''}`}
        onClick={() => setIsMobileOpen(true)}
        aria-label="Menüyü Aç"
      >
        <Menu className="sidebar__mobile-toggle-icon" />
      </button>
      
      <aside className={`sidebar ${isMobileOpen ? 'sidebar--open' : ''}`}>
        <div className="sidebar__logo">
          <button 
            className="sidebar__close-btn"
            onClick={() => setIsMobileOpen(false)}
            aria-label="Menüyü Kapat"
          >
            <X />
          </button>
          <img src="/logo/primary.svg" alt="AIESEC Logo" className="sidebar__logo-full" />
          <img src="/logo/fav.svg" alt="AIESEC" className="sidebar__logo-icon" />
        </div>
        <div className="sidebar__subtitle">Yönetim Paneli</div>

      <nav className="sidebar__nav">
        <ul className="sidebar__nav-list">
          {filteredNavItems.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                className={`sidebar__nav-item ${
                  isActive(item.href) ? 'sidebar__nav-item--active' : ''
                }`}
              >
                {item.icon}
                <span className="sidebar__nav-label">{item.label}</span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      {/* Role Switcher for Demo */}
      <div className="sidebar__footer">
        <div className="sidebar__role-switcher">
          <div className="sidebar__role-label">Rol Değiştir</div>
          <select
            className="sidebar__role-select"
            value={user.role}
            onChange={(e) => switchRole(e.target.value as UserRole)}
          >
            {Object.entries(roleLabels).map(([role, label]) => (
              <option key={role} value={role}>
                {label}
              </option>
            ))}
          </select>
        </div>
      </div>
    </aside>
    
    {isMobileOpen && (
      <div 
        className="sidebar__overlay" 
        style={{ display: 'block' }}
        onClick={() => setIsMobileOpen(false)}
      />
    )}
  </>
  );
}
