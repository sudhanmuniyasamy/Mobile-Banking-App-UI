import React, { useState } from 'react';
import { motion } from 'motion/react';
import {
  Bell,
  CheckCheck,
  Trash2,
  ShieldCheck,
  TrendingUp,
  ArrowDownLeft,
  ArrowUpRight,
  AlertTriangle,
  CheckCircle2,
  Copy,
  Check,
  ExternalLink,
} from 'lucide-react';
import { useBanking } from '../context/BankingContext';
import { NotificationItem } from '../types';

export const NotificationsView: React.FC = () => {
  const {
    notifications,
    markNotificationAsRead,
    deleteNotification,
    clearAllNotifications,
    formatCurrency,
    setSelectedTransaction,
    transactions,
  } = useBanking();

  const [activeFilter, setActiveFilter] = useState<'all' | 'transaction' | 'security' | 'insight'>('all');
  const [selectedNotifId, setSelectedNotifId] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const filteredNotifications = notifications.filter((n) =>
    activeFilter === 'all' ? true : n.type === activeFilter
  );

  const unreadCount = notifications.filter((n) => !n.read).length;

  const handleMarkAllRead = () => {
    notifications.forEach((n) => markNotificationAsRead(n.id));
  };

  const handleNotificationClick = (notif: NotificationItem) => {
    markNotificationAsRead(notif.id);
    setSelectedNotifId((prev) => (prev === notif.id ? null : notif.id));
  };

  const handleCopyRef = (text: string, id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleViewReceipt = (notif: NotificationItem, e: React.MouseEvent) => {
    e.stopPropagation();
    const matchingTx =
      transactions.find(
        (t) =>
          notif.message.toLowerCase().includes(t.merchantName.toLowerCase()) ||
          (notif.amount && Math.abs(t.amount - Math.abs(notif.amount)) < 1)
      ) || transactions[0];

    if (matchingTx) {
      setSelectedTransaction(matchingTx);
    }
  };

  return (
    <div id="notifications-view-container" className="space-y-4 p-4 pb-24 text-slate-900 bg-white overflow-y-auto h-full">
      {/* Header */}
      <div className="flex items-center justify-between pt-1">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600">
            <Bell className="w-4.5 h-4.5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-extrabold text-slate-900 tracking-tight">
                Notifications
              </h2>
              {unreadCount > 0 && (
                <span className="text-[10px] font-bold bg-rose-500 text-white px-2 py-0.5 rounded-full shadow-2xs">
                  {unreadCount} new
                </span>
              )}
            </div>
            <p className="text-xs text-slate-500 font-medium">Real-time alerts & security notices</p>
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          {unreadCount > 0 && (
            <button
              onClick={handleMarkAllRead}
              className="p-2 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-semibold border border-slate-200 transition flex items-center gap-1"
              title="Mark all as read"
            >
              <CheckCheck className="w-3.5 h-3.5" />
            </button>
          )}
          {notifications.length > 0 && (
            <button
              onClick={clearAllNotifications}
              className="p-2 rounded-xl bg-slate-50 hover:bg-rose-50 text-slate-600 hover:text-rose-600 border border-slate-200 hover:border-rose-200 transition"
              title="Clear all"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar text-xs">
        {(
          [
            { id: 'all', label: `All (${notifications.length})` },
            { id: 'transaction', label: 'Credits & Debits' },
            { id: 'security', label: 'Security' },
            { id: 'insight', label: 'Insights & Yield' },
          ] as const
        ).map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveFilter(tab.id)}
            className={`px-3 py-1.5 rounded-xl font-bold whitespace-nowrap transition ${
              activeFilter === tab.id
                ? 'bg-slate-900 text-white shadow-xs'
                : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Notifications List */}
      <div className="space-y-2.5">
        {filteredNotifications.length === 0 ? (
          <div className="p-8 text-center bg-white rounded-3xl border border-slate-200">
            <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-3">
              <CheckCircle2 className="w-6 h-6 text-emerald-500" />
            </div>
            <p className="text-xs font-bold text-slate-700">No alerts found</p>
            <p className="text-[11px] text-slate-400 mt-0.5">
              All banking notifications and alerts are up to date.
            </p>
          </div>
        ) : (
          filteredNotifications.map((notif) => {
            const isUnread = !notif.read;
            const isExpanded = selectedNotifId === notif.id;
            const refCode = `APX-NTF-${notif.id.replace('notif_', '').slice(-6)}`;

            return (
              <div
                key={notif.id}
                onClick={() => handleNotificationClick(notif)}
                className={`p-4 rounded-3xl border transition-all cursor-pointer relative shadow-2xs ${
                  isUnread
                    ? 'bg-white border-blue-300 ring-1 ring-blue-500/15'
                    : 'bg-white border-slate-200 text-slate-700'
                } ${isExpanded ? 'ring-2 ring-blue-500/30' : ''}`}
              >
                <div className="flex items-start gap-3">
                  <div
                    className={`w-9 h-9 rounded-2xl flex items-center justify-center shrink-0 border ${
                      notif.type === 'transaction'
                        ? notif.amount && notif.amount > 0
                          ? 'bg-emerald-50 border-emerald-200 text-emerald-600'
                          : 'bg-amber-50 border-amber-200 text-amber-600'
                        : notif.type === 'security'
                        ? 'bg-blue-50 border-blue-200 text-blue-600'
                        : notif.type === 'insight'
                        ? 'bg-purple-50 border-purple-200 text-purple-600'
                        : 'bg-rose-50 border-rose-200 text-rose-600'
                    }`}
                  >
                    {notif.type === 'transaction' ? (
                      notif.amount && notif.amount > 0 ? (
                        <ArrowDownLeft className="w-4 h-4" />
                      ) : (
                        <ArrowUpRight className="w-4 h-4" />
                      )
                    ) : notif.type === 'security' ? (
                      <ShieldCheck className="w-4 h-4" />
                    ) : notif.type === 'insight' ? (
                      <TrendingUp className="w-4 h-4" />
                    ) : (
                      <AlertTriangle className="w-4 h-4" />
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-1 mb-0.5">
                      <div className="flex items-center gap-1.5 min-w-0">
                        <h4
                          className={`text-xs font-bold truncate ${
                            isUnread ? 'text-slate-900' : 'text-slate-800'
                          }`}
                        >
                          {notif.title}
                        </h4>
                        {isUnread && (
                          <span className="w-2 h-2 rounded-full bg-blue-600 shrink-0" />
                        )}
                      </div>
                      <span className="text-[10px] text-slate-400 font-medium whitespace-nowrap">
                        {notif.timestamp}
                      </span>
                    </div>

                    <p className="text-xs text-slate-600 leading-relaxed font-normal">
                      {notif.message}
                    </p>

                    {notif.amount !== undefined && (
                      <div className="mt-2 inline-flex items-center gap-1 text-xs font-extrabold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-lg border border-emerald-200">
                        <span>{notif.amount > 0 ? '+' : ''}</span>
                        <span>{formatCurrency(Math.abs(notif.amount))}</span>
                      </div>
                    )}

                    {/* Interactive Expanded Actions */}
                    {isExpanded && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="mt-3 pt-3 border-t border-slate-100 space-y-2.5"
                      >
                        <div className="flex items-center justify-between bg-slate-50 p-2 rounded-xl text-[11px] border border-slate-200/80">
                          <span className="text-slate-500 font-medium">Alert Ref Code</span>
                          <div className="flex items-center gap-1.5 font-mono text-slate-700 font-semibold">
                            <span>{refCode}</span>
                            <button
                              onClick={(e) => handleCopyRef(refCode, notif.id, e)}
                              className="p-1 rounded hover:bg-slate-200 text-slate-500 transition"
                              title="Copy Reference Code"
                            >
                              {copiedId === notif.id ? (
                                <Check className="w-3 h-3 text-emerald-600" />
                              ) : (
                                <Copy className="w-3 h-3" />
                              )}
                            </button>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 pt-1">
                          {notif.type === 'transaction' && (
                            <button
                              onClick={(e) => handleViewReceipt(notif, e)}
                              className="flex-1 py-1.5 px-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold flex items-center justify-center gap-1.5 shadow-xs transition"
                            >
                              <ExternalLink className="w-3 h-3" />
                              <span>View Receipt</span>
                            </button>
                          )}
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              deleteNotification(notif.id);
                            }}
                            className="py-1.5 px-3 rounded-xl bg-slate-50 hover:bg-rose-50 text-slate-600 hover:text-rose-600 border border-slate-200 text-xs font-semibold transition"
                          >
                            Delete
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
