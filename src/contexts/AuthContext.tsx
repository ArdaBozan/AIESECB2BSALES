'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';
import { User, UserRole, RolePermissions } from '@/types';
import { currentUser as defaultUser } from '@/data/mockData';

interface AuthContextType {
  user: User;
  setUser: (user: User) => void;
  permissions: RolePermissions;
  isAdmin: boolean;
  isTeamLeader: boolean;
  switchRole: (role: UserRole) => void;
  logout: () => void;
}

const getPermissions = (role: UserRole): RolePermissions => {
  const basePermissions: RolePermissions = {
    canCreateCompany: true,
    canEditCompany: false,
    canDeleteContact: false,
    canViewAllActivities: false,
    canEditAllActivities: false,
    canViewDeals: false,
    canViewRevenue: false,
    canViewTeamStats: false,
    canViewGlobalStats: false,
    canFilterByTeam: false,
  };

  switch (role) {
    case 'TeamMember':
      return {
        ...basePermissions,
        canViewDeals: false,
        canViewRevenue: false,
      };
    
    case 'TeamLeader':
      return {
        ...basePermissions,
        canEditCompany: true,
        canViewAllActivities: true,
        canEditAllActivities: true,
        canViewDeals: true,
        canViewTeamStats: true,
        canFilterByTeam: true,
      };
    
    case 'LCP':
    case 'LCVP':
      return {
        ...basePermissions,
        canEditCompany: true,
        canDeleteContact: true,
        canViewAllActivities: true,
        canEditAllActivities: true,
        canViewDeals: true,
        canViewRevenue: true,
        canViewTeamStats: true,
        canViewGlobalStats: true,
        canFilterByTeam: true,
      };
    
    case 'MCP':
    case 'MCVP':
      return {
        ...basePermissions,
        canEditCompany: true,
        canDeleteContact: true,
        canViewAllActivities: true,
        canEditAllActivities: true,
        canViewDeals: true,
        canViewRevenue: true,
        canViewTeamStats: true,
        canViewGlobalStats: true,
        canFilterByTeam: true,
      };
    
    default:
      return basePermissions;
  }
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User>(defaultUser);

  const permissions = getPermissions(user.role);
  
  const isAdmin = ['MCP', 'MCVP', 'LCP', 'LCVP'].includes(user.role);
  const isTeamLeader = user.role === 'TeamLeader' || isAdmin;

  const switchRole = (role: UserRole) => {
    setUser({ ...user, role });
  };

  const logout = () => {
    // In a real app, this would clear tokens, call logout API, etc.
    // For demo, we just show an alert
    alert('Çıkış yapıldı! (Demo modunda yeniden yönlendirme yapılmıyor)');
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      setUser, 
      permissions, 
      isAdmin, 
      isTeamLeader,
      switchRole,
      logout
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
