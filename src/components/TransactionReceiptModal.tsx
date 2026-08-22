import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X,
  Share2,
  Download,
  ShieldAlert,
  Tag,
  Plus,
  Users,
  CheckCircle2,
  Clock,
  MapPin,
  FileText,
  Copy,
  Check,
  AlertTriangle,
  Building,
  CreditCard,
} from 'lucide-react';
import { useBanking } from '../context/BankingContext';

export const TransactionReceiptModal: React.FC = () => {
  const {
    selectedTransaction,
    setSelectedTransaction,
    formatCurrency,
    addTransactionTag,
    updateTransactionNote,
    toggleDisputeTransaction,
    settleBillSplit,
  } = useBanking();

  const [newTagInput, setNewTagInput] = useState<string>('');
  const [isEditingNote, setIsEditingNote] = useState<boolean>(false);
  const [noteInput, setNoteInput] = useState<string>('');
  const [isCopiedRef, setIsCopiedRef] = useState<boolean>(false);
  const [downloadSuccess, setDownloadSuccess] = useState<boolean>(false);
  const [shareSuccess, setShareSuccess] = useState<boolean>(false);

  if (!selectedTransaction) return null;

  const isIncome = selectedTransaction.type === 'income';

  const handleAddTag = (e: React.FormEvent) => {
    e.preventDefault();
    if (newTagInput.trim()) {
      addTransactionTag(selectedTransaction.id, newTagInput.trim());
      setNewTagInput('');
    }
  };

  const handleSaveNote = () => {
    updateTransactionNote(selectedTransaction.id, noteInput);
    setIsEditingNote(false);
  };

  const handleCopyRef = () => {
    navigator.clipboard.writeText(selectedTransaction.referenceCode);
    setIsCopiedRef(true);
    setTimeout(() => setIsCopiedRef(false), 2000);
  };

  const handleDownloadReceipt = () => {
    setDownloadSuccess(true);
    setTimeout(() => setDownloadSuccess(false), 3000);
  };

  const handleShare = () => {
    setShareSuccess(true);
    setTimeout(() => setShareSuccess(false), 2500);
  };

  return (
    <AnimatePresence>
      <div className="absolute inset-0 z-50 flex items-center justify-center p-3 bg-slate-900/60 backdrop-blur-xs overflow-y-auto no-scrollbar">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-sm bg-white border border-slate-200 rounded-3xl p-5 text-slate-900 shadow-xl overflow-hidden my-auto max-h-[95%]"
        >
          {/* Header Action Bar */}
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600">
                <FileText className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                  Verified Receipt
                </h3>
                <p className="text-[10px] text-slate-500 font-mono font-medium">
                  {selectedTransaction.referenceCode}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1.5">
              <button
                onClick={handleShare}
                className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 transition"
                title="Share Receipt"
              >
                {shareSuccess ? (
                  <Check className="w-4 h-4 text-emerald-600" />
                ) : (
                  <Share2 className="w-4 h-4" />
                )}
              </button>
              <button
                onClick={() => setSelectedTransaction(null)}
                className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Amount Hero */}
          <div className="text-center py-6">
            <div
              className={`text-3xl sm:text-4xl font-extrabold font-mono-num ${
                isIncome ? 'text-emerald-700' : 'text-slate-900'
              }`}
            >
              {isIncome ? '+' : '-'}
              {formatCurrency(selectedTransaction.amount, selectedTransaction.currency)}
            </div>
            <h4 className="text-sm font-bold text-slate-900 mt-1">
              {selectedTransaction.title}
            </h4>
            <p className="text-xs text-slate-500 font-medium">{selectedTransaction.merchantName}</p>

            <div className="inline-flex items-center gap-1.5 mt-3 px-3 py-1 rounded-full text-xs font-semibold">
              {selectedTransaction.isDisputed ? (
                <span className="inline-flex items-center gap-1 bg-rose-50 text-rose-700 border border-rose-200 px-3 py-1 rounded-full">
                  <AlertTriangle className="w-3.5 h-3.5" /> Under Dispute Review
                </span>
              ) : selectedTransaction.status === 'completed' ? (
                <span className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-700 border border-emerald-200 px-3 py-1 rounded-full font-bold">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Settled & Cleared
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 bg-amber-50 text-amber-700 border border-amber-200 px-3 py-1 rounded-full font-semibold">
                  <Clock className="w-3.5 h-3.5" /> Pending Authorization
                </span>
              )}
            </div>
          </div>

          {/* Transaction Metadata Grid */}
          <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200 space-y-3 text-xs">
            <div className="flex items-center justify-between">
              <span className="text-slate-500 font-medium">Category</span>
              <span className="font-bold text-slate-900">
                {selectedTransaction.merchantCategory}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-slate-500 font-medium">Date & Time</span>
              <span className="font-mono font-semibold text-slate-900">
                {new Date(selectedTransaction.timestamp).toLocaleString()}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-slate-500 font-medium">Transaction Fee</span>
              <span className="font-bold text-emerald-700 font-mono">
                ₹0.00 (UPI Waived)
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-slate-500 font-medium">Reference #</span>
              <div className="flex items-center gap-1 font-mono font-bold text-slate-900">
                <span>{selectedTransaction.referenceCode}</span>
                <button
                  onClick={handleCopyRef}
                  className="p-1 hover:text-slate-700 text-slate-400 transition"
                  title="Copy Reference"
                >
                  {isCopiedRef ? (
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                  ) : (
                    <Copy className="w-3.5 h-3.5" />
                  )}
                </button>
              </div>
            </div>

            {selectedTransaction.location && (
              <div className="flex items-center justify-between pt-1 border-t border-slate-200">
                <span className="text-slate-500 flex items-center gap-1 font-medium">
                  <MapPin className="w-3.5 h-3.5 text-slate-400" /> Location
                </span>
                <span className="text-slate-900 font-semibold">
                  {selectedTransaction.location}
                </span>
              </div>
            )}
          </div>

          {/* Notes & Memo Section */}
          <div className="mt-4">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                Personal Note / Receipt Memo
              </span>
              {!isEditingNote && (
                <button
                  onClick={() => {
                    setNoteInput(selectedTransaction.receiptNote || '');
                    setIsEditingNote(true);
                  }}
                  className="text-xs text-blue-600 hover:text-blue-700 font-bold"
                >
                  Edit Note
                </button>
              )}
            </div>

            {isEditingNote ? (
              <div className="space-y-2">
                <textarea
                  value={noteInput}
                  onChange={(e) => setNoteInput(e.target.value)}
                  placeholder="Add memo for tax or personal records..."
                  className="w-full p-2.5 rounded-xl bg-slate-100 border border-slate-200 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-slate-400 font-medium"
                  rows={2}
                />
                <div className="flex justify-end gap-2">
                  <button
                    onClick={() => setIsEditingNote(false)}
                    className="px-3 py-1 rounded-lg bg-slate-100 text-slate-700 text-xs font-bold border border-slate-200"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSaveNote}
                    className="px-3 py-1 rounded-lg bg-slate-900 text-white text-xs font-bold shadow-2xs"
                  >
                    Save Note
                  </button>
                </div>
              </div>
            ) : (
              <p className="text-xs text-slate-700 font-medium italic bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                {selectedTransaction.receiptNote || 'No notes added for this transaction.'}
              </p>
            )}
          </div>

          {/* Bill Split Section (If available) */}
          {selectedTransaction.splitWith && selectedTransaction.splitWith.length > 0 && (
            <div className="mt-4 p-3 rounded-2xl bg-blue-50/60 border border-blue-100">
              <div className="flex items-center gap-1.5 text-xs font-bold text-blue-800 mb-2">
                <Users className="w-4 h-4" />
                <span>Split Bill Breakdown</span>
              </div>
              <div className="space-y-1.5">
                {selectedTransaction.splitWith.map((friend, idx) => (
                  <div
                    key={`split-${friend.name}-${idx}`}
                    className="flex items-center justify-between text-xs p-2 rounded-xl bg-white border border-slate-200 shadow-2xs"
                  >
                    <span className="text-slate-900 font-bold">{friend.name}</span>
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-semibold text-slate-700">
                        {formatCurrency(friend.amount)}
                      </span>
                      {friend.settled ? (
                        <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                          Paid
                        </span>
                      ) : (
                        <button
                          onClick={() => settleBillSplit(selectedTransaction.id, friend.name)}
                          className="text-[10px] font-bold text-blue-700 bg-blue-50 hover:bg-blue-100 px-2 py-0.5 rounded-full border border-blue-200 transition"
                        >
                          Mark Paid
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Custom Tags Section */}
          <div className="mt-4">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-2">
              Tags
            </span>
            <div className="flex flex-wrap items-center gap-1.5">
              {selectedTransaction.tags?.map((tag, idx) => (
                <span
                  key={`tag-${tag}-${idx}`}
                  className="inline-flex items-center gap-1 text-[11px] font-bold bg-slate-100 text-slate-700 px-2.5 py-1 rounded-lg border border-slate-200"
                >
                  <Tag className="w-3 h-3 text-slate-500" />
                  {tag}
                </span>
              ))}
              <form onSubmit={handleAddTag} className="inline-flex items-center">
                <input
                  type="text"
                  value={newTagInput}
                  onChange={(e) => setNewTagInput(e.target.value)}
                  placeholder="+ Add tag..."
                  className="bg-slate-100 border border-slate-200 rounded-lg px-2.5 py-1 text-[11px] text-slate-900 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-slate-400 w-24 font-medium"
                />
              </form>
            </div>
          </div>

          {/* Footer Actions: Download PDF Receipt & Dispute Button */}
          <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between gap-3">
            <button
              onClick={handleDownloadReceipt}
              className="flex-1 py-2.5 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-700 text-xs font-bold transition flex items-center justify-center gap-1.5"
            >
              {downloadSuccess ? (
                <>
                  <Check className="w-4 h-4 text-emerald-600" />
                  <span className="text-emerald-700">PDF Saved</span>
                </>
              ) : (
                <>
                  <Download className="w-4 h-4 text-slate-600" />
                  <span>Download PDF</span>
                </>
              )}
            </button>

            <button
              onClick={() => toggleDisputeTransaction(selectedTransaction.id)}
              className={`py-2.5 px-3 rounded-xl border text-xs font-bold transition flex items-center justify-center gap-1.5 ${
                selectedTransaction.isDisputed
                  ? 'bg-emerald-50 border-emerald-200 text-emerald-700 hover:bg-emerald-100'
                  : 'bg-rose-50 border-rose-200 text-rose-700 hover:bg-rose-100'
              }`}
            >
              <ShieldAlert className="w-4 h-4" />
              <span>
                {selectedTransaction.isDisputed ? 'Cancel Dispute' : 'Dispute Charge'}
              </span>
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
