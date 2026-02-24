'use client';

import React, { ReactNode } from 'react';
import Sidebar from '../Sidebar';
import Header from '../Header';
import './MainLayout.css';

interface MainLayoutProps {
  children: ReactNode;
}

export default function MainLayout({ children }: MainLayoutProps) {
  return (
    <div className="main-layout">
      <Sidebar />
      <Header />
      <main className="main-layout__content">
        <div className="main-layout__page">
          {children}
        </div>
      </main>
    </div>
  );
}
