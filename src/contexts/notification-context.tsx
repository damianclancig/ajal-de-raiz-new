/*
 * Copyright 2026 Clancig FullstackWeb
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */


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
