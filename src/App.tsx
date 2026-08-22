/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { BankingProvider, useBanking } from './context/BankingContext';
import { AuthScreen } from './components/AuthScreen';
import { StatusBar } from './components/StatusBar';
import { BottomNav } from './components/BottomNav';
import { DashboardView } from './components/DashboardView';
import { TransactionsView } from './components/TransactionsView';
import { SearchView } from './components/SearchView';
import { ScannerView } from './components/ScannerView';
import { NotificationsView } from './components/NotificationsView';
import { SendMoneyView } from './components/SendMoneyView';
import { CardsView } from './components/CardsView';
import { BillsView } from './components/BillsView';
import { InsightsView } from './components/InsightsView';
import { MobileFrame } from './components/MobileFrame';
import { TransactionReceiptModal } from './components/TransactionReceiptModal';
import { TransferModal } from './components/TransferModal';
import { ScanPayModal } from './components/ScanPayModal';
import { ReceiveQRModal } from './components/ReceiveQRModal';
import { DepositCheckModal } from './components/DepositCheckModal';
import { NotificationsDrawer } from './components/NotificationsDrawer';
import { AccountDetailsModal } from './components/AccountDetailsModal';
import { ContactsSearchModal } from './components/ContactsSearchModal';
import { BankTransferModal } from './components/BankTransferModal';
import { FastagModal } from './components/FastagModal';
import { ElectricBillModal } from './components/ElectricBillModal';
import { MobileRechargeModal } from './components/MobileRechargeModal';
import { BillsModal } from './components/BillsModal';
import { StockDetailModal } from './components/StockDetailModal';
import { FixedDepositModal } from './components/FixedDepositModal';
import { DigitalGoldModal } from './components/DigitalGoldModal';

const AppContent: React.FC = () => {
  const { isAuthenticated, isLocked, activeTab } = useBanking();

  return (
    <MobileFrame>
      {!isAuthenticated || isLocked ? (
        <AuthScreen />
      ) : (
        <div className="relative w-full h-full flex flex-col justify-between bg-white text-slate-900 overflow-hidden">
          <StatusBar />

          <main className="flex-1 overflow-y-auto relative no-scrollbar">
            {(activeTab === 'home' || activeTab === 'dashboard') && <DashboardView />}
            {activeTab === 'search' && <SearchView />}
            {activeTab === 'scanner' && <ScannerView />}
            {activeTab === 'notifications' && <NotificationsView />}
            {(activeTab === 'activity' || activeTab === 'transactions') && <TransactionsView />}
            {activeTab === 'transfers' && <SendMoneyView />}
            {activeTab === 'cards' && <CardsView />}
            {activeTab === 'bills' && <BillsView />}
            {activeTab === 'insights' && <InsightsView />}
          </main>

          <BottomNav />

          {/* Global Action Modals - Contained Strictly Inside Mobile Screen */}
          <TransactionReceiptModal />
          <TransferModal />
          <ScanPayModal />
          <ReceiveQRModal />
          <DepositCheckModal />
          <NotificationsDrawer />
          <AccountDetailsModal />
          <ContactsSearchModal />
          <BankTransferModal />
          <FastagModal />
          <ElectricBillModal />
          <MobileRechargeModal />
          <BillsModal />
          <StockDetailModal />
          <FixedDepositModal />
          <DigitalGoldModal />
        </div>
      )}
    </MobileFrame>
  );
};

export default function App() {
  return (
    <BankingProvider>
      <AppContent />
    </BankingProvider>
  );
}
