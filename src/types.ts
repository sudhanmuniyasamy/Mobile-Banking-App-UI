export type CurrencyCode = 'INR';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatar: string;
  tier: 'Apex Black Tier' | 'Apex Platinum Member' | 'Apex Premier';
  memberSince: string;
  biometricEnabled: boolean;
  twoFactorEnabled: boolean;
  passcode: string;
  preferredCurrency: CurrencyCode;
}

export type AccountType = 'checking' | 'savings' | 'investment' | 'crypto';

export interface BankAccount {
  id: string;
  type: AccountType;
  name: string;
  accountNumber: string;
  routingNumber: string;
  balance: number;
  currency: CurrencyCode;
  apy?: number;
  isPrimary?: boolean;
  colorTheme: string;
  cardDesign: string;
}

export type CardTier = 'black_titanium' | 'emerald_elite' | 'gold_reserve' | 'virtual_disposable';
export type CardNetwork = 'visa' | 'mastercard' | 'amex';

export interface BankCard {
  id: string;
  accountId: string;
  cardNumber: string;
  maskedNumber: string;
  cardHolder: string;
  expiry: string;
  cvv: string;
  network: CardNetwork;
  tier: CardTier;
  isFrozen: boolean;
  isVirtual: boolean;
  spendingLimitDaily: number;
  currentSpentToday: number;
  contactlessEnabled: boolean;
  onlinePurchasesEnabled: boolean;
  atmWithdrawalsEnabled: boolean;
  internationalEnabled: boolean;
  colorGradient: string;
  pin: string;
}

export type TransactionCategory =
  | 'Dining & Drinks'
  | 'Shopping & Retail'
  | 'Groceries'
  | 'Travel & Transport'
  | 'Tech & Subscriptions'
  | 'Entertainment'
  | 'Healthcare'
  | 'Investments & Crypto'
  | 'Salary & Income'
  | 'Transfer'
  | 'Bills & Utilities';

export type TransactionStatus = 'completed' | 'pending' | 'failed' | 'flagged';

export interface Transaction {
  id: string;
  accountId: string;
  type: 'expense' | 'income' | 'transfer';
  amount: number;
  currency: CurrencyCode;
  title: string;
  merchantName: string;
  merchantCategory: TransactionCategory;
  timestamp: string; // ISO string
  status: TransactionStatus;
  referenceCode: string;
  location?: string;
  receiptNote?: string;
  tags?: string[];
  fee: number;
  splitWith?: { name: string; amount: number; settled: boolean }[];
  isDisputed?: boolean;
  iconName?: string;
}

export interface RecipientContact {
  id: string;
  name: string;
  handle: string;
  phone: string;
  email: string;
  avatar: string;
  accountNumber: string;
  bankName: string;
  isFavorite: boolean;
  recentSentAmount?: number;
}

export interface BillItem {
  id: string;
  name: string;
  category: string;
  amount: number;
  dueDate: string;
  isAutoPay: boolean;
  isPaid: boolean;
  logo: string;
  frequency: 'Monthly' | 'Annual' | 'Bi-Weekly';
  accountId: string;
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  type: 'alert' | 'transaction' | 'security' | 'insight';
  amount?: number;
}

export interface CategorySpending {
  category: TransactionCategory;
  amount: number;
  percentage: number;
  color: string;
  icon: string;
  count: number;
}

export interface StockHolding {
  id: string;
  symbol: string;
  name: string;
  exchange: 'NSE' | 'BSE';
  shares: number;
  avgBuyPrice: number;
  currentPrice: number;
  dayChangePercent: number;
  dayChangeAmount: number;
  totalInvested: number;
  currentValue: number;
  totalGainPercent: number;
  sector: string;
  logoColor: string;
}

export interface FixedDepositItem {
  id: string;
  fdNumber: string;
  bankName: string;
  principalAmount: number;
  interestRate: number; // e.g. 7.9%
  tenureMonths: number;
  startDate: string;
  maturityDate: string;
  maturityAmount: number;
  accruedInterest: number;
  payoutType: 'Cumulative' | 'Monthly' | 'Quarterly';
  status: 'active' | 'matured' | 'closed';
  taxSaving?: boolean;
}

export interface MutualFundSIP {
  id: string;
  fundName: string;
  category: string;
  monthlyAmount: number;
  sipDate: number; // day of month e.g. 5
  totalInvested: number;
  currentValue: number;
  returnXIRR: number;
  riskRating: 'Very High' | 'High' | 'Moderate';
}

export interface DigitalGoldHolding {
  grams: number;
  buyPriceAvg: number;
  livePricePerGram: number;
  totalValue: number;
  purity: string;
}

export type ActiveTab =
  | 'home'
  | 'search'
  | 'scanner'
  | 'notifications'
  | 'activity'
  | 'transfers'
  | 'cards'
  | 'bills'
  | 'insights'
  | 'dashboard'
  | 'transactions';
