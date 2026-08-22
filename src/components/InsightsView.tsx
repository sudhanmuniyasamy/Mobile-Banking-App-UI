import React from 'react';
import {
  TrendingUp,
  TrendingDown,
  PieChart,
  ShieldCheck,
  Sparkles,
  ArrowUpRight,
  ArrowDownLeft,
  Layers,
  ShoppingBag,
  Utensils,
  Car,
  Laptop,
  HeartPulse,
} from 'lucide-react';
import { useBanking } from '../context/BankingContext';
import { TransactionCategory } from '../types';

export const InsightsView: React.FC = () => {
  const { transactions, formatCurrency, totalNetWorth } = useBanking();

  // Calculate category breakdown from actual transactions
  const categoryTotals: Record<string, { amount: number; count: number }> = {};
  let totalExpenses = 0;
  let totalIncome = 0;

  transactions.forEach((tx) => {
    if (tx.type === 'expense') {
      totalExpenses += tx.amount;
      if (!categoryTotals[tx.merchantCategory]) {
        categoryTotals[tx.merchantCategory] = { amount: 0, count: 0 };
      }
      categoryTotals[tx.merchantCategory].amount += tx.amount;
      categoryTotals[tx.merchantCategory].count += 1;
    } else if (tx.type === 'income') {
      totalIncome += tx.amount;
    }
  });

  const categoryList = Object.entries(categoryTotals).map(([cat, data]) => ({
    category: cat,
    amount: data.amount,
    count: data.count,
    percentage: totalExpenses > 0 ? (data.amount / totalExpenses) * 100 : 0,
  }));

  categoryList.sort((a, b) => b.amount - a.amount);

  const getCategoryColor = (cat: string) => {
    switch (cat) {
      case 'Dining & Drinks':
        return 'bg-amber-400';
      case 'Shopping & Retail':
        return 'bg-cyan-400';
      case 'Groceries':
        return 'bg-emerald-400';
      case 'Travel & Transport':
        return 'bg-indigo-400';
      case 'Tech & Subscriptions':
        return 'bg-purple-400';
      case 'Bills & Utilities':
        return 'bg-rose-400';
      default:
        return 'bg-teal-400';
    }
  };

  return (
    <div id="insights-view-content" className="space-y-4 p-4 pb-8 text-slate-900">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-extrabold text-slate-900 tracking-tight">
            Financial Health & Analytics
          </h2>
          <p className="text-xs text-slate-500 font-medium">Cashflow intelligence & spending breakdown</p>
        </div>
        <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200 flex items-center gap-1">
          <Sparkles className="w-3 h-3" /> Score: 94/100
        </span>
      </div>

      {/* Cashflow Burn Matrix */}
      <div className="p-4 rounded-3xl bg-white border border-slate-200 space-y-3 shadow-2xs">
        <div className="flex items-center justify-between text-xs text-slate-500">
          <span className="font-bold uppercase tracking-wider">Monthly Cashflow Ratio</span>
          <span className="text-emerald-700 font-bold">
            {totalIncome > 0 ? `${Math.round(((totalIncome - totalExpenses) / totalIncome) * 100)}% Net Savings` : 'Stable'}
          </span>
        </div>

        <div className="grid grid-cols-2 gap-3 pt-1">
          <div className="p-3.5 rounded-2xl bg-emerald-50/70 border border-emerald-200">
            <span className="text-[10px] font-bold text-emerald-700 flex items-center gap-1">
              <ArrowDownLeft className="w-3 h-3" /> Inflow
            </span>
            <div className="text-base font-extrabold text-emerald-700 font-mono-num mt-0.5">
              +{formatCurrency(totalIncome)}
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-rose-50/70 border border-rose-200">
            <span className="text-[10px] font-bold text-rose-700 flex items-center gap-1">
              <ArrowUpRight className="w-3 h-3" /> Outflow
            </span>
            <div className="text-base font-extrabold text-slate-900 font-mono-num mt-0.5">
              -{formatCurrency(totalExpenses)}
            </div>
          </div>
        </div>

        {/* Multi-segment spending bar */}
        <div className="space-y-1.5 pt-2">
          <div className="w-full h-3 rounded-full bg-slate-100 flex overflow-hidden border border-slate-200">
            {categoryList.map((item) => (
              <div
                key={item.category}
                style={{ width: `${item.percentage}%` }}
                className={`h-full ${getCategoryColor(item.category)}`}
                title={`${item.category}: ${item.percentage.toFixed(1)}%`}
              />
            ))}
          </div>
          <p className="text-[10px] text-slate-500 font-medium text-right">
            Total expenses tracked: {formatCurrency(totalExpenses)}
          </p>
        </div>
      </div>

      {/* Category Breakdown list */}
      <div className="space-y-2">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 px-1">
          Top Spending Categories
        </h3>

        {categoryList.map((item) => (
          <div
            key={item.category}
            className="p-3 rounded-2xl bg-white border border-slate-200 flex items-center justify-between shadow-2xs"
          >
            <div className="flex items-center gap-3">
              <div
                className={`w-3.5 h-3.5 rounded-full ${getCategoryColor(item.category)} shrink-0 shadow-2xs`}
              />
              <div>
                <h4 className="text-xs font-bold text-slate-900">{item.category}</h4>
                <p className="text-[10px] text-slate-500 font-medium">{item.count} transactions</p>
              </div>
            </div>

            <div className="text-right">
              <div className="text-xs font-bold text-slate-900 font-mono-num">
                {formatCurrency(item.amount)}
              </div>
              <div className="text-[10px] font-mono text-slate-500 font-medium">
                {item.percentage.toFixed(1)}%
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* AI Financial Health recommendations */}
      <div className="p-4 rounded-2xl bg-blue-50/70 border border-blue-100 space-y-2 shadow-2xs">
        <div className="flex items-center gap-2 text-xs font-bold text-blue-800">
          <Sparkles className="w-4 h-4 text-blue-600" />
          <span>Apex Wealth Advisor Recommendations</span>
        </div>
        <ul className="text-xs text-slate-700 space-y-1.5 list-disc list-inside font-medium">
          <li>
            You are saving <strong className="text-emerald-700 font-bold">66% of your monthly income</strong>, well above the 20% benchmark.
          </li>
          <li>
            Allocating ₹50,000 more into the <strong className="text-slate-900 font-bold">High-Yield Vault (7.15% p.a.)</strong> earns an extra ~₹3,575/yr compounding.
          </li>
        </ul>
      </div>
    </div>
  );
};
