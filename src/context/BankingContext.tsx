import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import confetti from 'canvas-confetti';
import {
  BankAccount,
  BankCard,
  BillItem,
  CurrencyCode,
  NotificationItem,
  RecipientContact,
  Transaction,
  UserProfile,
  ActiveTab,
  TransactionCategory,
  StockHolding,
  FixedDepositItem,
  MutualFundSIP,
  DigitalGoldHolding,
} from '../types';
import {
  INITIAL_ACCOUNTS,
  INITIAL_BILLS,
  INITIAL_CARDS,
  INITIAL_CONTACTS,
  INITIAL_NOTIFICATIONS,
  INITIAL_TRANSACTIONS,
  INITIAL_USER,
  SIMULATED_MERCHANTS,
  INITIAL_STOCKS,
  INITIAL_FDS,
  INITIAL_SIPS,
  INITIAL_GOLD,
} from '../data/mockData';

interface BankingContextType {
  user: UserProfile;
  accounts: BankAccount[];
  cards: BankCard[];
  transactions: Transaction[];
  contacts: RecipientContact[];
  bills: BillItem[];
  notifications: NotificationItem[];
  stocks: StockHolding[];
  fixedDeposits: FixedDepositItem[];
  mutualFunds: MutualFundSIP[];
  digitalGold: DigitalGoldHolding;
  
  // App UI State
  isAuthenticated: boolean;
  isLocked: boolean;
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  selectedAccountId: string;
  setSelectedAccountId: (id: string) => void;
  isPrivacyMode: boolean;
  togglePrivacyMode: () => void;
  isLiveSimulationActive: boolean;
  toggleLiveSimulation: () => void;
  selectedCurrency: CurrencyCode;
  setSelectedCurrency: (currency: CurrencyCode) => void;
  deviceFrameEnabled: boolean;
  toggleDeviceFrame: () => void;
  activeCardIndex: number;
  setActiveCardIndex: (index: number) => void;

  // Selected Transaction for modal receipt
  selectedTransaction: Transaction | null;
  setSelectedTransaction: (tx: Transaction | null) => void;
  
  // Modals & Action Drawers
  isTransferModalOpen: boolean;
  setIsTransferModalOpen: (open: boolean) => void;
  isScanPayOpen: boolean;
  setIsScanPayOpen: (open: boolean) => void;
  isReceiveQROpen: boolean;
  setIsReceiveQROpen: (open: boolean) => void;
  isDepositCheckOpen: boolean;
  setIsDepositCheckOpen: (open: boolean) => void;
  isNotificationsOpen: boolean;
  setIsNotificationsOpen: (open: boolean) => void;
  isAccountDetailsOpen: boolean;
  setIsAccountDetailsOpen: (open: boolean) => void;

  // New Requested Modals
  isContactsSearchOpen: boolean;
  setIsContactsSearchOpen: (open: boolean) => void;
  isBankTransferOpen: boolean;
  setIsBankTransferOpen: (open: boolean) => void;
  isFastagModalOpen: boolean;
  setIsFastagModalOpen: (open: boolean) => void;
  isElectricBillModalOpen: boolean;
  setIsElectricBillModalOpen: (open: boolean) => void;
  isMobileRechargeModalOpen: boolean;
  setIsMobileRechargeModalOpen: (open: boolean) => void;
  isBillsModalOpen: boolean;
  setIsBillsModalOpen: (open: boolean) => void;

  // Stocks & FD Modals
  isStockModalOpen: boolean;
  setIsStockModalOpen: (open: boolean) => void;
  selectedStock: StockHolding | null;
  setSelectedStock: (stock: StockHolding | null) => void;
  isFdModalOpen: boolean;
  setIsFdModalOpen: (open: boolean) => void;
  selectedFd: FixedDepositItem | null;
  setSelectedFd: (fd: FixedDepositItem | null) => void;
  isBookFdModalOpen: boolean;
  setIsBookFdModalOpen: (open: boolean) => void;
  isGoldModalOpen: boolean;
  setIsGoldModalOpen: (open: boolean) => void;
  
  // Core Banking Actions
  authenticate: (method: 'biometric' | 'pin', pin?: string) => boolean;
  lockApp: () => void;
  logout: () => void;
  
  // Money operations
  sendMoney: (params: {
    recipientName: string;
    recipientHandle?: string;
    amount: number;
    sourceAccountId: string;
    category: TransactionCategory;
    note?: string;
  }) => boolean;
  
  bankTransferIMPS: (params: {
    recipientName: string;
    accountNumber: string;
    ifscCode: string;
    amount: number;
    sourceAccountId: string;
    note?: string;
  }) => boolean;

  rechargeFastag: (params: {
    vehicleNumber: string;
    provider: string;
    amount: number;
    sourceAccountId: string;
  }) => boolean;

  payElectricBill: (params: {
    boardName: string;
    consumerNumber: string;
    amount: number;
    sourceAccountId: string;
  }) => boolean;

  rechargeMobile: (params: {
    mobileNumber: string;
    operator: string;
    planDetails: string;
    amount: number;
    sourceAccountId: string;
  }) => boolean;
  
  transferBetweenAccounts: (params: {
    fromAccountId: string;
    toAccountId: string;
    amount: number;
    note?: string;
  }) => boolean;
  
  payBill: (billId: string) => boolean;
  depositCheck: (params: {
    amount: number;
    targetAccountId: string;
    checkNumber: string;
    memo?: string;
  }) => boolean;

  // Wealth operations
  bookFixedDeposit: (params: {
    principalAmount: number;
    tenureMonths: number;
    interestRate: number;
    payoutType: 'Cumulative' | 'Monthly' | 'Quarterly';
    sourceAccountId: string;
    taxSaving?: boolean;
  }) => boolean;

  buyStockShares: (params: {
    symbol: string;
    shares: number;
    price: number;
    sourceAccountId: string;
  }) => boolean;

  sellStockShares: (params: {
    symbol: string;
    shares: number;
    price: number;
    targetAccountId: string;
  }) => boolean;

  buyDigitalGold: (params: {
    amount: number;
    sourceAccountId: string;
  }) => boolean;
  
  // Card Actions
  toggleFreezeCard: (cardId: string) => void;
  updateCardLimit: (cardId: string, newLimit: number) => void;
  toggleCardFeature: (cardId: string, feature: 'contactless' | 'online' | 'atm' | 'international') => void;
  
  // Transaction actions
  addTransactionTag: (txId: string, tag: string) => void;
  updateTransactionNote: (txId: string, note: string) => void;
  toggleDisputeTransaction: (txId: string) => void;
  settleBillSplit: (txId: string, friendName: string) => void;
  
  // Notification actions
  markNotificationAsRead: (notifId: string) => void;
  deleteNotification: (notifId: string) => void;
  clearAllNotifications: () => void;
  
  // Helpers
  totalNetWorth: number;
  formatCurrency: (amount: number, overrideCurrency?: CurrencyCode) => string;
  triggerLiveSimulatedTransaction: () => void;
  resetAllDemoData: () => void;
}

const BankingContext = createContext<BankingContextType | undefined>(undefined);

export const BankingProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Persistence states - versioned to guarantee Sudhan and Tamil data
  const [user, setUser] = useState<UserProfile>(() => {
    const saved = localStorage.getItem('apex_sudhan_user_v3');
    return saved ? JSON.parse(saved) : INITIAL_USER;
  });

  const [accounts, setAccounts] = useState<BankAccount[]>(() => {
    const saved = localStorage.getItem('apex_sudhan_accounts_v3');
    return saved ? JSON.parse(saved) : INITIAL_ACCOUNTS;
  });

  const [cards, setCards] = useState<BankCard[]>(() => {
    const saved = localStorage.getItem('apex_sudhan_cards_v3');
    return saved ? JSON.parse(saved) : INITIAL_CARDS;
  });

  const [transactions, setTransactions] = useState<Transaction[]>(() => {
    const saved = localStorage.getItem('apex_sudhan_transactions_v3');
    return saved ? JSON.parse(saved) : INITIAL_TRANSACTIONS;
  });

  const [contacts, setContacts] = useState<RecipientContact[]>(() => {
    const saved = localStorage.getItem('apex_sudhan_contacts_v4');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length >= 20) {
          return parsed;
        }
      } catch {
        // fallback
      }
    }
    return INITIAL_CONTACTS;
  });

  const [bills, setBills] = useState<BillItem[]>(() => {
    const saved = localStorage.getItem('apex_sudhan_bills_v3');
    return saved ? JSON.parse(saved) : INITIAL_BILLS;
  });

  const [notifications, setNotifications] = useState<NotificationItem[]>(() => {
    const saved = localStorage.getItem('apex_sudhan_notifications_v3');
    return saved ? JSON.parse(saved) : INITIAL_NOTIFICATIONS;
  });

  const [stocks, setStocks] = useState<StockHolding[]>(() => {
    const saved = localStorage.getItem('apex_sudhan_stocks_v3');
    return saved ? JSON.parse(saved) : INITIAL_STOCKS;
  });

  const [fixedDeposits, setFixedDeposits] = useState<FixedDepositItem[]>(() => {
    const saved = localStorage.getItem('apex_sudhan_fds_v3');
    return saved ? JSON.parse(saved) : INITIAL_FDS;
  });

  const [mutualFunds, setMutualFunds] = useState<MutualFundSIP[]>(() => {
    const saved = localStorage.getItem('apex_sudhan_sips_v3');
    return saved ? JSON.parse(saved) : INITIAL_SIPS;
  });

  const [digitalGold, setDigitalGold] = useState<DigitalGoldHolding>(() => {
    const saved = localStorage.getItem('apex_sudhan_gold_v3');
    return saved ? JSON.parse(saved) : INITIAL_GOLD;
  });

  // App UI states - initially require biometric / passcode verification
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLocked, setIsLocked] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<ActiveTab>('home');
  const [selectedAccountId, setSelectedAccountId] = useState<string>(INITIAL_ACCOUNTS[0].id);
  const [isPrivacyMode, setIsPrivacyMode] = useState<boolean>(false);
  const [isLiveSimulationActive, setIsLiveSimulationActive] = useState<boolean>(true);
  const [selectedCurrency, setSelectedCurrency] = useState<CurrencyCode>('INR');
  const [deviceFrameEnabled, setDeviceFrameEnabled] = useState<boolean>(true);
  const [activeCardIndex, setActiveCardIndex] = useState<number>(0);
  
  // Modals & Drawers
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
  const [isTransferModalOpen, setIsTransferModalOpen] = useState<boolean>(false);
  const [isScanPayOpen, setIsScanPayOpen] = useState<boolean>(false);
  const [isReceiveQROpen, setIsReceiveQROpen] = useState<boolean>(false);
  const [isDepositCheckOpen, setIsDepositCheckOpen] = useState<boolean>(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState<boolean>(false);
  const [isAccountDetailsOpen, setIsAccountDetailsOpen] = useState<boolean>(false);

  // New Requested Action Modals
  const [isContactsSearchOpen, setIsContactsSearchOpen] = useState<boolean>(false);
  const [isBankTransferOpen, setIsBankTransferOpen] = useState<boolean>(false);
  const [isFastagModalOpen, setIsFastagModalOpen] = useState<boolean>(false);
  const [isElectricBillModalOpen, setIsElectricBillModalOpen] = useState<boolean>(false);
  const [isMobileRechargeModalOpen, setIsMobileRechargeModalOpen] = useState<boolean>(false);
  const [isBillsModalOpen, setIsBillsModalOpen] = useState<boolean>(false);

  // Stocks & FD Modals
  const [isStockModalOpen, setIsStockModalOpen] = useState<boolean>(false);
  const [selectedStock, setSelectedStock] = useState<StockHolding | null>(null);
  const [isFdModalOpen, setIsFdModalOpen] = useState<boolean>(false);
  const [selectedFd, setSelectedFd] = useState<FixedDepositItem | null>(null);
  const [isBookFdModalOpen, setIsBookFdModalOpen] = useState<boolean>(false);
  const [isGoldModalOpen, setIsGoldModalOpen] = useState<boolean>(false);

  // Sync to local storage
  useEffect(() => {
    localStorage.setItem('apex_sudhan_stocks_v3', JSON.stringify(stocks));
  }, [stocks]);

  useEffect(() => {
    localStorage.setItem('apex_sudhan_fds_v3', JSON.stringify(fixedDeposits));
  }, [fixedDeposits]);

  useEffect(() => {
    localStorage.setItem('apex_sudhan_sips_v3', JSON.stringify(mutualFunds));
  }, [mutualFunds]);

  useEffect(() => {
    localStorage.setItem('apex_sudhan_gold_v3', JSON.stringify(digitalGold));
  }, [digitalGold]);

  // Sync to local storage
  useEffect(() => {
    localStorage.setItem('apex_sudhan_user_v3', JSON.stringify(user));
  }, [user]);

  useEffect(() => {
    localStorage.setItem('apex_sudhan_accounts_v3', JSON.stringify(accounts));
  }, [accounts]);

  useEffect(() => {
    localStorage.setItem('apex_sudhan_cards_v3', JSON.stringify(cards));
  }, [cards]);

  useEffect(() => {
    localStorage.setItem('apex_sudhan_transactions_v3', JSON.stringify(transactions));
  }, [transactions]);

  useEffect(() => {
    localStorage.setItem('apex_sudhan_contacts_v3', JSON.stringify(contacts));
  }, [contacts]);

  useEffect(() => {
    localStorage.setItem('apex_sudhan_bills_v3', JSON.stringify(bills));
  }, [bills]);

  useEffect(() => {
    localStorage.setItem('apex_sudhan_notifications_v3', JSON.stringify(notifications));
  }, [notifications]);

  // Total Net Worth calculation
  const totalNetWorth = accounts.reduce((sum, acc) => sum + acc.balance, 0);

  // Currency formatter - Pure Indian Rupee (₹) format
  const formatCurrency = useCallback((amount: number) => {
    if (isPrivacyMode) {
      return '••••••';
    }

    return `₹${amount.toLocaleString('en-IN', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  }, [isPrivacyMode]);

  // Toggle privacy mode
  const togglePrivacyMode = () => {
    setIsPrivacyMode((prev) => !prev);
  };

  // Toggle device frame
  const toggleDeviceFrame = () => {
    setDeviceFrameEnabled((prev) => !prev);
  };

  // Toggle live ticker
  const toggleLiveSimulation = () => {
    setIsLiveSimulationActive((prev) => !prev);
  };

  // Authenticate
  const authenticate = (method: 'biometric' | 'pin', pin?: string) => {
    if (method === 'biometric') {
      setIsAuthenticated(true);
      setIsLocked(false);
      return true;
    }
    if (method === 'pin' && pin === user.passcode) {
      setIsAuthenticated(true);
      setIsLocked(false);
      return true;
    }
    return false;
  };

  // Lock
  const lockApp = () => {
    setIsLocked(true);
  };

  // Logout
  const logout = () => {
    setIsAuthenticated(false);
    setIsLocked(true);
  };

  // Trigger Celebration Confetti
  const triggerConfetti = () => {
    confetti({
      particleCount: 75,
      spread: 70,
      origin: { y: 0.65 },
      colors: ['#10b981', '#06b6d4', '#6366f1', '#f59e0b', '#ec4899'],
    });
  };

  // Send money to contact / UPI ID
  const sendMoney = ({
    recipientName,
    recipientHandle,
    amount,
    sourceAccountId,
    category,
    note,
  }: {
    recipientName: string;
    recipientHandle?: string;
    amount: number;
    sourceAccountId: string;
    category: TransactionCategory;
    note?: string;
  }) => {
    const sourceAcc = accounts.find((a) => a.id === sourceAccountId) || accounts[0];
    if (!sourceAcc || sourceAcc.balance < amount) {
      return false;
    }

    // Deduct balance
    setAccounts((prev) =>
      prev.map((acc) =>
        acc.id === sourceAcc.id ? { ...acc, balance: acc.balance - amount } : acc
      )
    );

    // Create Transaction
    const newTx: Transaction = {
      id: `tx_${Date.now()}`,
      accountId: sourceAcc.id,
      type: 'expense',
      amount,
      currency: 'INR',
      title: `UPI Payment to ${recipientName}`,
      merchantName: recipientHandle ? `${recipientName} (${recipientHandle})` : recipientName,
      merchantCategory: category,
      timestamp: new Date().toISOString(),
      status: 'completed',
      referenceCode: `UPI-P2P-${Math.floor(100000 + Math.random() * 900000)}`,
      location: 'UPI Instant - Tamil Nadu',
      receiptNote: note || 'Instant UPI transfer authorized via Apex Banking',
      tags: Array.from(new Set(['UPI', 'Transfer', category])),
      fee: 0,
    };

    setTransactions((prev) => [newTx, ...prev]);

    // Create Notification
    const newNotif: NotificationItem = {
      id: `notif_${Date.now()}`,
      title: 'UPI Transfer Successful',
      message: `Transferred ₹${amount.toLocaleString('en-IN', { minimumFractionDigits: 2 })} to ${recipientName}.`,
      timestamp: 'Just now',
      read: false,
      type: 'transaction',
      amount: -amount,
    };
    setNotifications((prev) => [newNotif, ...prev]);

    triggerConfetti();
    return true;
  };

  // Bank Transfer (IMPS / NEFT) to Account + IFSC
  const bankTransferIMPS = ({
    recipientName,
    accountNumber,
    ifscCode,
    amount,
    sourceAccountId,
    note,
  }: {
    recipientName: string;
    accountNumber: string;
    ifscCode: string;
    amount: number;
    sourceAccountId: string;
    note?: string;
  }) => {
    const sourceAcc = accounts.find((a) => a.id === sourceAccountId) || accounts[0];
    if (!sourceAcc || sourceAcc.balance < amount) {
      return false;
    }

    setAccounts((prev) =>
      prev.map((acc) =>
        acc.id === sourceAcc.id ? { ...acc, balance: acc.balance - amount } : acc
      )
    );

    const maskedAcc = accountNumber.length > 4 ? `•••• ${accountNumber.slice(-4)}` : accountNumber;

    const newTx: Transaction = {
      id: `tx_${Date.now()}`,
      accountId: sourceAcc.id,
      type: 'transfer',
      amount,
      currency: 'INR',
      title: `Bank IMPS Transfer to ${recipientName}`,
      merchantName: `${recipientName} (A/C: ${maskedAcc} • IFSC: ${ifscCode.toUpperCase()})`,
      merchantCategory: 'Transfer',
      timestamp: new Date().toISOString(),
      status: 'completed',
      referenceCode: `IMPS-${Math.floor(100000 + Math.random() * 900000)}`,
      location: `IFSC: ${ifscCode.toUpperCase()}`,
      receiptNote: note || `Direct IMPS 24x7 Interbank Transfer to ${recipientName}`,
      tags: ['Bank Transfer', 'IMPS', 'Direct Account'],
      fee: 0,
    };

    setTransactions((prev) => [newTx, ...prev]);

    const newNotif: NotificationItem = {
      id: `notif_${Date.now()}`,
      title: 'IMPS Bank Transfer Successful',
      message: `₹${amount.toLocaleString('en-IN', { minimumFractionDigits: 2 })} transferred to ${recipientName} (IFSC: ${ifscCode.toUpperCase()}).`,
      timestamp: 'Just now',
      read: false,
      type: 'transaction',
      amount: -amount,
    };
    setNotifications((prev) => [newNotif, ...prev]);

    triggerConfetti();
    return true;
  };

  // FASTag Instant Toll Recharge
  const rechargeFastag = ({
    vehicleNumber,
    provider,
    amount,
    sourceAccountId,
  }: {
    vehicleNumber: string;
    provider: string;
    amount: number;
    sourceAccountId: string;
  }) => {
    const sourceAcc = accounts.find((a) => a.id === sourceAccountId) || accounts[0];
    if (!sourceAcc || sourceAcc.balance < amount) return false;

    setAccounts((prev) =>
      prev.map((acc) =>
        acc.id === sourceAcc.id ? { ...acc, balance: acc.balance - amount } : acc
      )
    );

    const newTx: Transaction = {
      id: `tx_${Date.now()}`,
      accountId: sourceAcc.id,
      type: 'expense',
      amount,
      currency: 'INR',
      title: `FASTag Recharge: ${vehicleNumber.toUpperCase()}`,
      merchantName: `${provider} NETC FASTag`,
      merchantCategory: 'Travel & Transport',
      timestamp: new Date().toISOString(),
      status: 'completed',
      referenceCode: `NETC-FTG-${Math.floor(100000 + Math.random() * 900000)}`,
      location: `Vehicle: ${vehicleNumber.toUpperCase()}`,
      receiptNote: `Instant NETC FASTag wallet recharge for vehicle ${vehicleNumber.toUpperCase()}`,
      tags: ['FASTag', 'Toll', 'NHAI'],
      fee: 0,
    };

    setTransactions((prev) => [newTx, ...prev]);

    const newNotif: NotificationItem = {
      id: `notif_${Date.now()}`,
      title: 'FASTag Recharged',
      message: `₹${amount.toLocaleString('en-IN', { minimumFractionDigits: 2 })} credited to FASTag for ${vehicleNumber.toUpperCase()}.`,
      timestamp: 'Just now',
      read: false,
      type: 'transaction',
      amount: -amount,
    };
    setNotifications((prev) => [newNotif, ...prev]);

    triggerConfetti();
    return true;
  };

  // TANGEDCO / Electricity Board Bill Payment
  const payElectricBill = ({
    boardName,
    consumerNumber,
    amount,
    sourceAccountId,
  }: {
    boardName: string;
    consumerNumber: string;
    amount: number;
    sourceAccountId: string;
  }) => {
    const sourceAcc = accounts.find((a) => a.id === sourceAccountId) || accounts[0];
    if (!sourceAcc || sourceAcc.balance < amount) return false;

    setAccounts((prev) =>
      prev.map((acc) =>
        acc.id === sourceAcc.id ? { ...acc, balance: acc.balance - amount } : acc
      )
    );

    const newTx: Transaction = {
      id: `tx_${Date.now()}`,
      accountId: sourceAcc.id,
      type: 'expense',
      amount,
      currency: 'INR',
      title: `Electric Bill: ${boardName}`,
      merchantName: boardName,
      merchantCategory: 'Bills & Utilities',
      timestamp: new Date().toISOString(),
      status: 'completed',
      referenceCode: `BBPS-EB-${Math.floor(100000 + Math.random() * 900000)}`,
      location: `Consumer No: ${consumerNumber}`,
      receiptNote: `Electricity Board bi-monthly bill payment cleared via Bharat BillPay`,
      tags: ['EB Bill', 'TANGEDCO', 'Utilities'],
      fee: 0,
    };

    setTransactions((prev) => [newTx, ...prev]);

    const newNotif: NotificationItem = {
      id: `notif_${Date.now()}`,
      title: 'Electricity Bill Paid',
      message: `₹${amount.toLocaleString('en-IN', { minimumFractionDigits: 2 })} paid to ${boardName} (Consumer: ${consumerNumber}).`,
      timestamp: 'Just now',
      read: false,
      type: 'transaction',
      amount: -amount,
    };
    setNotifications((prev) => [newNotif, ...prev]);

    triggerConfetti();
    return true;
  };

  // Mobile Recharge
  const rechargeMobile = ({
    mobileNumber,
    operator,
    planDetails,
    amount,
    sourceAccountId,
  }: {
    mobileNumber: string;
    operator: string;
    planDetails: string;
    amount: number;
    sourceAccountId: string;
  }) => {
    const sourceAcc = accounts.find((a) => a.id === sourceAccountId) || accounts[0];
    if (!sourceAcc || sourceAcc.balance < amount) return false;

    setAccounts((prev) =>
      prev.map((acc) =>
        acc.id === sourceAcc.id ? { ...acc, balance: acc.balance - amount } : acc
      )
    );

    const newTx: Transaction = {
      id: `tx_${Date.now()}`,
      accountId: sourceAcc.id,
      type: 'expense',
      amount,
      currency: 'INR',
      title: `Mobile Recharge: +91 ${mobileNumber}`,
      merchantName: `${operator} Prepaid / Postpaid`,
      merchantCategory: 'Tech & Subscriptions',
      timestamp: new Date().toISOString(),
      status: 'completed',
      referenceCode: `REC-${Math.floor(100000 + Math.random() * 900000)}`,
      location: `Mobile: +91 ${mobileNumber}`,
      receiptNote: `${operator} - ${planDetails}`,
      tags: ['Mobile Recharge', operator, 'Telecom'],
      fee: 0,
    };

    setTransactions((prev) => [newTx, ...prev]);

    const newNotif: NotificationItem = {
      id: `notif_${Date.now()}`,
      title: 'Mobile Recharge Successful',
      message: `₹${amount.toLocaleString('en-IN', { minimumFractionDigits: 2 })} recharge applied to +91 ${mobileNumber} (${operator}).`,
      timestamp: 'Just now',
      read: false,
      type: 'transaction',
      amount: -amount,
    };
    setNotifications((prev) => [newNotif, ...prev]);

    triggerConfetti();
    return true;
  };

  // Transfer between own accounts
  const transferBetweenAccounts = ({
    fromAccountId,
    toAccountId,
    amount,
    note,
  }: {
    fromAccountId: string;
    toAccountId: string;
    amount: number;
    note?: string;
  }) => {
    const fromAcc = accounts.find((a) => a.id === fromAccountId);
    const toAcc = accounts.find((a) => a.id === toAccountId);

    if (!fromAcc || !toAcc || fromAcc.balance < amount) {
      return false;
    }

    setAccounts((prev) =>
      prev.map((acc) => {
        if (acc.id === fromAccountId) return { ...acc, balance: acc.balance - amount };
        if (acc.id === toAccountId) return { ...acc, balance: acc.balance + amount };
        return acc;
      })
    );

    const newTx: Transaction = {
      id: `tx_${Date.now()}`,
      accountId: fromAccountId,
      type: 'transfer',
      amount,
      currency: 'INR',
      title: `Transfer to ${toAcc.name}`,
      merchantName: `Internal Vault: ${toAcc.name}`,
      merchantCategory: 'Transfer',
      timestamp: new Date().toISOString(),
      status: 'completed',
      referenceCode: `INT-TRF-${Math.floor(100000 + Math.random() * 900000)}`,
      location: 'Apex Internal Transfer',
      receiptNote: note || `Transferred from ${fromAcc.name} to ${toAcc.name}`,
      tags: ['Internal Transfer', 'Vault Rebalance'],
      fee: 0,
    };

    setTransactions((prev) => [newTx, ...prev]);

    const newNotif: NotificationItem = {
      id: `notif_${Date.now()}`,
      title: 'Internal Account Transfer',
      message: `Moved ₹${amount.toLocaleString('en-IN', { minimumFractionDigits: 2 })} from ${fromAcc.name} to ${toAcc.name}.`,
      timestamp: 'Just now',
      read: false,
      type: 'transaction',
    };
    setNotifications((prev) => [newNotif, ...prev]);

    triggerConfetti();
    return true;
  };

  // Pay a bill
  const payBill = (billId: string) => {
    const bill = bills.find((b) => b.id === billId);
    if (!bill || bill.isPaid) return false;

    const sourceAcc = accounts.find((a) => a.id === bill.accountId) || accounts[0];
    if (sourceAcc.balance < bill.amount) return false;

    setAccounts((prev) =>
      prev.map((acc) =>
        acc.id === sourceAcc.id ? { ...acc, balance: acc.balance - bill.amount } : acc
      )
    );

    setBills((prev) =>
      prev.map((b) => (b.id === billId ? { ...b, isPaid: true } : b))
    );

    const newTx: Transaction = {
      id: `tx_${Date.now()}`,
      accountId: sourceAcc.id,
      type: 'expense',
      amount: bill.amount,
      currency: 'INR',
      title: `Bill Payment: ${bill.name}`,
      merchantName: bill.name,
      merchantCategory: 'Bills & Utilities',
      timestamp: new Date().toISOString(),
      status: 'completed',
      referenceCode: `BILL-PAY-${Math.floor(100000 + Math.random() * 900000)}`,
      location: 'Electronic Direct Bill Pay',
      receiptNote: `${bill.frequency} bill cleared successfully`,
      tags: ['Bill Pay', 'Utilities', bill.category],
      fee: 0,
    };

    setTransactions((prev) => [newTx, ...prev]);

    triggerConfetti();
    return true;
  };

  // Mobile check deposit
  const depositCheck = ({
    amount,
    targetAccountId,
    checkNumber,
    memo,
  }: {
    amount: number;
    targetAccountId: string;
    checkNumber: string;
    memo?: string;
  }) => {
    const targetAcc = accounts.find((a) => a.id === targetAccountId) || accounts[0];
    if (!targetAcc) return false;

    setAccounts((prev) =>
      prev.map((acc) =>
        acc.id === targetAcc.id ? { ...acc, balance: acc.balance + amount } : acc
      )
    );

    const newTx: Transaction = {
      id: `tx_${Date.now()}`,
      accountId: targetAcc.id,
      type: 'income',
      amount,
      currency: 'INR',
      title: `e-Cheque Deposit #${checkNumber}`,
      merchantName: 'Remote Cheque Capture CTS-2010',
      merchantCategory: 'Salary & Income',
      timestamp: new Date().toISOString(),
      status: 'completed',
      referenceCode: `CHK-DEP-${checkNumber}`,
      location: 'Mobile Cheque Scanner AI',
      receiptNote: memo || 'CTS-2010 Cheque processed and instantly cleared via Apex Express',
      tags: ['Cheque Deposit', 'Income', 'Mobile Capture'],
      fee: 0,
    };

    setTransactions((prev) => [newTx, ...prev]);

    const newNotif: NotificationItem = {
      id: `notif_${Date.now()}`,
      title: 'Cheque Credited',
      message: `Cheque #${checkNumber} for ₹${amount.toLocaleString('en-IN', { minimumFractionDigits: 2 })} credited to ${targetAcc.name}.`,
      timestamp: 'Just now',
      read: false,
      type: 'transaction',
      amount,
    };
    setNotifications((prev) => [newNotif, ...prev]);

    triggerConfetti();
    return true;
  };

  // Wealth: Book Fixed Deposit
  const bookFixedDeposit = ({
    principalAmount,
    tenureMonths,
    interestRate,
    payoutType,
    sourceAccountId,
    taxSaving = false,
  }: {
    principalAmount: number;
    tenureMonths: number;
    interestRate: number;
    payoutType: 'Cumulative' | 'Monthly' | 'Quarterly';
    sourceAccountId: string;
    taxSaving?: boolean;
  }) => {
    const sourceAcc = accounts.find((a) => a.id === sourceAccountId) || accounts[0];
    if (!sourceAcc || sourceAcc.balance < principalAmount) return false;

    // Deduct from source account
    setAccounts((prev) =>
      prev.map((acc) =>
        acc.id === sourceAcc.id ? { ...acc, balance: acc.balance - principalAmount } : acc
      )
    );

    // Calculate maturity amount
    const years = tenureMonths / 12;
    const maturityAmount = Math.round(principalAmount * Math.pow(1 + interestRate / 400, 4 * years));
    const accruedInterest = 0;

    const startDate = new Date();
    const matDate = new Date();
    matDate.setMonth(matDate.getMonth() + tenureMonths);

    const fdNumber = `FD-APEX-${Math.floor(100000 + Math.random() * 900000)}`;

    const newFD: FixedDepositItem = {
      id: `fd_${Date.now()}`,
      fdNumber,
      bankName: taxSaving ? 'Tax Saver 80C Fixed Deposit' : `${tenureMonths}M High Yield Fixed Deposit`,
      principalAmount,
      interestRate,
      tenureMonths,
      startDate: startDate.toISOString().split('T')[0],
      maturityDate: matDate.toISOString().split('T')[0],
      maturityAmount,
      accruedInterest,
      payoutType,
      status: 'active',
      taxSaving,
    };

    setFixedDeposits((prev) => [newFD, ...prev]);

    const newTx: Transaction = {
      id: `tx_${Date.now()}`,
      accountId: sourceAcc.id,
      type: 'expense',
      amount: principalAmount,
      currency: 'INR',
      title: `Fixed Deposit Created (${fdNumber})`,
      merchantName: 'Apex Term Deposit Vault',
      merchantCategory: 'Investments & Crypto',
      timestamp: new Date().toISOString(),
      status: 'completed',
      referenceCode: fdNumber,
      location: 'Apex Wealth Desk',
      receiptNote: `Booked @ ${interestRate}% p.a. Maturing on ${matDate.toLocaleDateString('en-IN')}`,
      tags: ['Fixed Deposit', 'FD', 'Investment'],
      fee: 0,
    };

    setTransactions((prev) => [newTx, ...prev]);

    const newNotif: NotificationItem = {
      id: `notif_${Date.now()}`,
      title: 'Fixed Deposit Created Successfully',
      message: `FD #${fdNumber} booked for ₹${principalAmount.toLocaleString('en-IN')} @ ${interestRate}% p.a. Maturity ₹${maturityAmount.toLocaleString('en-IN')}.`,
      timestamp: 'Just now',
      read: false,
      type: 'insight',
      amount: principalAmount,
    };

    setNotifications((prev) => [newNotif, ...prev]);
    triggerConfetti();
    return true;
  };

  // Wealth: Buy Stock Shares
  const buyStockShares = ({
    symbol,
    shares,
    price,
    sourceAccountId,
  }: {
    symbol: string;
    shares: number;
    price: number;
    sourceAccountId: string;
  }) => {
    const totalCost = shares * price;
    const sourceAcc = accounts.find((a) => a.id === sourceAccountId) || accounts[0];
    if (!sourceAcc || sourceAcc.balance < totalCost) return false;

    setAccounts((prev) =>
      prev.map((acc) =>
        acc.id === sourceAcc.id ? { ...acc, balance: acc.balance - totalCost } : acc
      )
    );

    setStocks((prev) => {
      const existing = prev.find((s) => s.symbol === symbol);
      if (existing) {
        const totalShares = existing.shares + shares;
        const totalInvested = existing.totalInvested + totalCost;
        const avgBuyPrice = totalInvested / totalShares;
        const currentValue = totalShares * price;
        const totalGainPercent = ((currentValue - totalInvested) / totalInvested) * 100;

        return prev.map((s) =>
          s.symbol === symbol
            ? {
                ...s,
                shares: totalShares,
                avgBuyPrice,
                totalInvested,
                currentValue,
                totalGainPercent,
              }
            : s
        );
      }
      return prev;
    });

    const newTx: Transaction = {
      id: `tx_${Date.now()}`,
      accountId: sourceAcc.id,
      type: 'expense',
      amount: totalCost,
      currency: 'INR',
      title: `Bought ${shares} shares of ${symbol}`,
      merchantName: 'NSE/BSE Demat Execution',
      merchantCategory: 'Investments & Crypto',
      timestamp: new Date().toISOString(),
      status: 'completed',
      referenceCode: `STK-BUY-${Date.now().toString().slice(-6)}`,
      location: 'NSE India Exchange',
      receiptNote: `Bought @ ₹${price.toLocaleString('en-IN')}/share via Zerodha Demat Link`,
      tags: ['Stocks', symbol, 'NSE'],
      fee: 0,
    };

    setTransactions((prev) => [newTx, ...prev]);

    const newNotif: NotificationItem = {
      id: `notif_${Date.now()}`,
      title: `Order Executed: ${symbol}`,
      message: `Bought ${shares} shares of ${symbol} for ₹${totalCost.toLocaleString('en-IN')}.`,
      timestamp: 'Just now',
      read: false,
      type: 'transaction',
      amount: totalCost,
    };

    setNotifications((prev) => [newNotif, ...prev]);
    triggerConfetti();
    return true;
  };

  // Wealth: Sell Stock Shares
  const sellStockShares = ({
    symbol,
    shares,
    price,
    targetAccountId,
  }: {
    symbol: string;
    shares: number;
    price: number;
    targetAccountId: string;
  }) => {
    const stock = stocks.find((s) => s.symbol === symbol);
    if (!stock || stock.shares < shares) return false;

    const totalProceeds = shares * price;
    const targetAcc = accounts.find((a) => a.id === targetAccountId) || accounts[0];

    setAccounts((prev) =>
      prev.map((acc) =>
        acc.id === targetAcc.id ? { ...acc, balance: acc.balance + totalProceeds } : acc
      )
    );

    setStocks((prev) => {
      return prev.map((s) => {
        if (s.symbol !== symbol) return s;
        const remShares = s.shares - shares;
        const remInvested = remShares * s.avgBuyPrice;
        const remValue = remShares * price;
        return {
          ...s,
          shares: remShares,
          totalInvested: remInvested,
          currentValue: remValue,
          totalGainPercent: remInvested > 0 ? ((remValue - remInvested) / remInvested) * 100 : 0,
        };
      });
    });

    const newTx: Transaction = {
      id: `tx_${Date.now()}`,
      accountId: targetAcc.id,
      type: 'income',
      amount: totalProceeds,
      currency: 'INR',
      title: `Sold ${shares} shares of ${symbol}`,
      merchantName: 'NSE/BSE Demat Execution',
      merchantCategory: 'Investments & Crypto',
      timestamp: new Date().toISOString(),
      status: 'completed',
      referenceCode: `STK-SELL-${Date.now().toString().slice(-6)}`,
      location: 'NSE India Exchange',
      receiptNote: `Sold @ ₹${price.toLocaleString('en-IN')}/share, proceeds credited instantly`,
      tags: ['Stocks', symbol, 'NSE', 'Sale'],
      fee: 0,
    };

    setTransactions((prev) => [newTx, ...prev]);

    const newNotif: NotificationItem = {
      id: `notif_${Date.now()}`,
      title: `Order Executed: ${symbol}`,
      message: `Sold ${shares} shares of ${symbol} for +₹${totalProceeds.toLocaleString('en-IN')}.`,
      timestamp: 'Just now',
      read: false,
      type: 'transaction',
      amount: totalProceeds,
    };

    setNotifications((prev) => [newNotif, ...prev]);
    triggerConfetti();
    return true;
  };

  // Wealth: Buy Digital Gold
  const buyDigitalGold = ({
    amount,
    sourceAccountId,
  }: {
    amount: number;
    sourceAccountId: string;
  }) => {
    const sourceAcc = accounts.find((a) => a.id === sourceAccountId) || accounts[0];
    if (!sourceAcc || sourceAcc.balance < amount) return false;

    setAccounts((prev) =>
      prev.map((acc) =>
        acc.id === sourceAcc.id ? { ...acc, balance: acc.balance - amount } : acc
      )
    );

    const gramsBought = Math.round((amount / digitalGold.livePricePerGram) * 1000) / 1000;

    setDigitalGold((prev) => {
      const newGrams = prev.grams + gramsBought;
      const totalSpent = prev.grams * prev.buyPriceAvg + amount;
      const newAvg = totalSpent / newGrams;
      return {
        ...prev,
        grams: Math.round(newGrams * 1000) / 1000,
        buyPriceAvg: Math.round(newAvg),
        totalValue: Math.round(newGrams * prev.livePricePerGram),
      };
    });

    const newTx: Transaction = {
      id: `tx_${Date.now()}`,
      accountId: sourceAcc.id,
      type: 'expense',
      amount,
      currency: 'INR',
      title: `Bought ${gramsBought}g 24K Digital Gold`,
      merchantName: 'MMTC-PAMP Gold Reserve',
      merchantCategory: 'Investments & Crypto',
      timestamp: new Date().toISOString(),
      status: 'completed',
      referenceCode: `GOLD-BUY-${Date.now().toString().slice(-6)}`,
      location: 'MMTC-PAMP Insured Vault',
      receiptNote: `99.99% Pure 24K Vault Gold added to your locker`,
      tags: ['Digital Gold', 'Gold', 'Vault'],
      fee: 0,
    };

    setTransactions((prev) => [newTx, ...prev]);

    const newNotif: NotificationItem = {
      id: `notif_${Date.now()}`,
      title: 'Digital Gold Added to Vault',
      message: `Purchased ${gramsBought}g 24K Gold for ₹${amount.toLocaleString('en-IN')}.`,
      timestamp: 'Just now',
      read: false,
      type: 'insight',
      amount,
    };

    setNotifications((prev) => [newNotif, ...prev]);
    triggerConfetti();
    return true;
  };

  // Card Controls
  const toggleFreezeCard = (cardId: string) => {
    setCards((prev) =>
      prev.map((c) => (c.id === cardId ? { ...c, isFrozen: !c.isFrozen } : c))
    );
  };

  const updateCardLimit = (cardId: string, newLimit: number) => {
    setCards((prev) =>
      prev.map((c) => (c.id === cardId ? { ...c, spendingLimitDaily: newLimit } : c))
    );
  };

  const toggleCardFeature = (
    cardId: string,
    feature: 'contactless' | 'online' | 'atm' | 'international'
  ) => {
    setCards((prev) =>
      prev.map((c) => {
        if (c.id !== cardId) return c;
        if (feature === 'contactless') return { ...c, contactlessEnabled: !c.contactlessEnabled };
        if (feature === 'online') return { ...c, onlinePurchasesEnabled: !c.onlinePurchasesEnabled };
        if (feature === 'atm') return { ...c, atmWithdrawalsEnabled: !c.atmWithdrawalsEnabled };
        if (feature === 'international') return { ...c, internationalEnabled: !c.internationalEnabled };
        return c;
      })
    );
  };

  // Transaction details actions
  const addTransactionTag = (txId: string, tag: string) => {
    setTransactions((prev) =>
      prev.map((t) =>
        t.id === txId ? { ...t, tags: Array.from(new Set([...(t.tags || []), tag])) } : t
      )
    );
    if (selectedTransaction?.id === txId) {
      setSelectedTransaction((prev) =>
        prev ? { ...prev, tags: Array.from(new Set([...(prev.tags || []), tag])) } : null
      );
    }
  };

  const updateTransactionNote = (txId: string, note: string) => {
    setTransactions((prev) =>
      prev.map((t) => (t.id === txId ? { ...t, receiptNote: note } : t))
    );
    if (selectedTransaction?.id === txId) {
      setSelectedTransaction((prev) =>
        prev ? { ...prev, receiptNote: note } : null
      );
    }
  };

  const toggleDisputeTransaction = (txId: string) => {
    setTransactions((prev) =>
      prev.map((t) =>
        t.id === txId
          ? {
              ...t,
              isDisputed: !t.isDisputed,
              status: !t.isDisputed ? 'flagged' : 'completed',
            }
          : t
      )
    );
    if (selectedTransaction?.id === txId) {
      setSelectedTransaction((prev) =>
        prev
          ? {
              ...prev,
              isDisputed: !prev.isDisputed,
              status: !prev.isDisputed ? 'flagged' : 'completed',
            }
          : null
      );
    }
  };

  const settleBillSplit = (txId: string, friendName: string) => {
    setTransactions((prev) =>
      prev.map((t) => {
        if (t.id !== txId || !t.splitWith) return t;
        const updatedSplits = t.splitWith.map((s) =>
          s.name === friendName ? { ...s, settled: true } : s
        );
        return { ...t, splitWith: updatedSplits };
      })
    );
    if (selectedTransaction?.id === txId) {
      setSelectedTransaction((prev) => {
        if (!prev || !prev.splitWith) return prev;
        const updatedSplits = prev.splitWith.map((s) =>
          s.name === friendName ? { ...s, settled: true } : s
        );
        return { ...prev, splitWith: updatedSplits };
      });
    }
  };

  // Enforce pure light theme
  useEffect(() => {
    localStorage.removeItem('apex_dark_mode');
    document.documentElement.classList.remove('dark');
  }, []);

  // Notification actions
  const markNotificationAsRead = (notifId: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === notifId ? { ...n, read: true } : n))
    );
  };

  const deleteNotification = (notifId: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== notifId));
  };

  const clearAllNotifications = () => {
    setNotifications([]);
  };

  // Simulated live random transaction generator
  const triggerLiveSimulatedTransaction = useCallback(() => {
    const randomMerchant =
      SIMULATED_MERCHANTS[Math.floor(Math.random() * SIMULATED_MERCHANTS.length)];
    const randomAmount =
      Math.round(
        (randomMerchant.min + Math.random() * (randomMerchant.max - randomMerchant.min)) * 100
      ) / 100;

    const primaryAcc = accounts[0];
    if (randomMerchant.type === 'expense' && primaryAcc.balance < randomAmount) return;

    // Update account balance
    setAccounts((prev) =>
      prev.map((a) => {
        if (a.id !== primaryAcc.id) return a;
        const newBal =
          randomMerchant.type === 'income'
            ? a.balance + randomAmount
            : a.balance - randomAmount;
        return { ...a, balance: Math.max(0, newBal) };
      })
    );

    const newTx: Transaction = {
      id: `tx_live_${Date.now()}`,
      accountId: primaryAcc.id,
      type: randomMerchant.type,
      amount: randomAmount,
      currency: 'INR',
      title: randomMerchant.name,
      merchantName: randomMerchant.name,
      merchantCategory: randomMerchant.category,
      timestamp: new Date().toISOString(),
      status: 'completed',
      referenceCode: `UPI-LIVE-${Math.floor(100000 + Math.random() * 900000)}`,
      location: randomMerchant.location,
      receiptNote: `Live authorized UPI transaction at ${randomMerchant.name}`,
      tags: ['Live Feed', randomMerchant.category],
      fee: 0,
    };

    setTransactions((prev) => [newTx, ...prev]);

    const newNotif: NotificationItem = {
      id: `notif_${Date.now()}`,
      title:
        randomMerchant.type === 'income' ? 'Live UPI Payment Received' : 'Live UPI Payment Sent',
      message: `${randomMerchant.type === 'income' ? '+' : '-'}₹${randomAmount.toLocaleString('en-IN', { minimumFractionDigits: 2 })} at ${randomMerchant.name}`,
      timestamp: 'Just now',
      read: false,
      type: 'transaction',
      amount: randomMerchant.type === 'income' ? randomAmount : -randomAmount,
    };

    setNotifications((prev) => [newNotif, ...prev]);
  }, [accounts]);

  // Periodic real-time simulator interval
  useEffect(() => {
    if (!isLiveSimulationActive || !isAuthenticated || isLocked) return;

    const interval = setInterval(() => {
      triggerLiveSimulatedTransaction();
    }, 45000);

    return () => clearInterval(interval);
  }, [isLiveSimulationActive, isAuthenticated, isLocked, triggerLiveSimulatedTransaction]);

  // Reset demo data
  const resetAllDemoData = () => {
    setUser(INITIAL_USER);
    setAccounts(INITIAL_ACCOUNTS);
    setCards(INITIAL_CARDS);
    setTransactions(INITIAL_TRANSACTIONS);
    setContacts(INITIAL_CONTACTS);
    setBills(INITIAL_BILLS);
    setNotifications(INITIAL_NOTIFICATIONS);
    setIsPrivacyMode(false);
    setIsLocked(false);
    setIsAuthenticated(true);
    localStorage.clear();
  };

  return (
    <BankingContext.Provider
      value={{
        user,
        accounts,
        cards,
        transactions,
        contacts,
        bills,
        notifications,
        stocks,
        fixedDeposits,
        mutualFunds,
        digitalGold,
        isAuthenticated,
        isLocked,
        activeTab,
        setActiveTab,
        selectedAccountId,
        setSelectedAccountId,
        isPrivacyMode,
        togglePrivacyMode,
        isLiveSimulationActive,
        toggleLiveSimulation,
        selectedCurrency,
        setSelectedCurrency,
        deviceFrameEnabled,
        toggleDeviceFrame,
        activeCardIndex,
        setActiveCardIndex,
        selectedTransaction,
        setSelectedTransaction,
        isTransferModalOpen,
        setIsTransferModalOpen,
        isScanPayOpen,
        setIsScanPayOpen,
        isReceiveQROpen,
        setIsReceiveQROpen,
        isDepositCheckOpen,
        setIsDepositCheckOpen,
        isNotificationsOpen,
        setIsNotificationsOpen,
        isAccountDetailsOpen,
        setIsAccountDetailsOpen,
        isContactsSearchOpen,
        setIsContactsSearchOpen,
        isBankTransferOpen,
        setIsBankTransferOpen,
        isFastagModalOpen,
        setIsFastagModalOpen,
        isElectricBillModalOpen,
        setIsElectricBillModalOpen,
        isMobileRechargeModalOpen,
        setIsMobileRechargeModalOpen,
        isBillsModalOpen,
        setIsBillsModalOpen,
        isStockModalOpen,
        setIsStockModalOpen,
        selectedStock,
        setSelectedStock,
        isFdModalOpen,
        setIsFdModalOpen,
        selectedFd,
        setSelectedFd,
        isBookFdModalOpen,
        setIsBookFdModalOpen,
        isGoldModalOpen,
        setIsGoldModalOpen,
        authenticate,
        lockApp,
        logout,
        sendMoney,
        bankTransferIMPS,
        rechargeFastag,
        payElectricBill,
        rechargeMobile,
        transferBetweenAccounts,
        payBill,
        depositCheck,
        bookFixedDeposit,
        buyStockShares,
        sellStockShares,
        buyDigitalGold,
        toggleFreezeCard,
        updateCardLimit,
        toggleCardFeature,
        addTransactionTag,
        updateTransactionNote,
        toggleDisputeTransaction,
        settleBillSplit,
        markNotificationAsRead,
        deleteNotification,
        clearAllNotifications,
        totalNetWorth,
        formatCurrency,
        triggerLiveSimulatedTransaction,
        resetAllDemoData,
      }}
    >
      {children}
    </BankingContext.Provider>
  );
};

export const useBanking = () => {
  const context = useContext(BankingContext);
  if (!context) {
    throw new Error('useBanking must be used within a BankingProvider');
  }
  return context;
};
