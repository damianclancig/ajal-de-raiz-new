
'use client';

import React, { createContext, useState, useContext, ReactNode, useCallback } from 'react';
import { useSession } from 'next-auth/react';
import { getPendingPaymentCount } from '@/lib/actions';

interface NotificationContextType {
  pendingPaymentCount: number;
  refreshPendingCount: () => Promise<void>;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const NotificationProvider = ({ children }: { children: ReactNode }) => {
  const [pendingPaymentCount, setPendingPaymentCount] = useState(0);
  const { status } = useSession();

  const refreshPendingCount = useCallback(async () => {
    if (status === 'authenticated') {
      const count = await getPendingPaymentCount();
      setPendingPaymentCount(count);
    } else {
      setPendingPaymentCount(0);
    }
  }, [status]);

  return (
    <NotificationContext.Provider value={{ pendingPaymentCount, refreshPendingCount }}>
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error('useNotification must be used within a NotificationProvider');
  }
  return context;
};
