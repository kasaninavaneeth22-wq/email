import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Search, 
  Filter, 
  Trash2, 
  ExternalLink, 
  RefreshCw, 
  ChevronLeft, 
  ChevronRight, 
  Clock, 
  ShieldAlert, 
  ArrowUpDown,
  Mail,
  AlertCircle
} from 'lucide-react';
import { api } from '../services/api';
import { HistoryItem, HistoryListResponse } from '../types';
import { RiskBadge } from '../components/RiskBadge';
import { ConfirmModal } from '../components/ConfirmModal';

export const HistoryPage: React.FC = () => {
  const [data, setData] = useState<HistoryListResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filter & Pagination States
  const [page, setPage] = useState(1);
  const [pageSize] = useState(10);
  const [search, setSearch] = useState('');
  const [classification, setClassification] = useState('all');
  const [sortBy, setSortBy] = useState('analyzed_at');
  const [sortOrder, setSortOrder] = useState('desc');

  // Modal States
  const [singleDeleteId, setSingleDeleteId] = useState<number | null>(null);
  const [showClearModal, setShowClearModal] = useState(false);

  const fetchHistory = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await api.getHistory({
        page,
        pageSize,
        search: search.trim() || undefined,
        classification: classification !== 'all' ? classification : undefined,
        sortBy,
        sortOrder,
      });
      setData(res);
    } catch (err: any) {
      setError(err.message || 'Failed to retrieve analysis history.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, [page, classification, sortBy, sortOrder]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    fetchHistory();
  };

  const handleConfirmSingleDelete = async () => {
    if (!singleDeleteId) return;
    try {
      await api.deleteHistory(singleDeleteId);
      setSingleDeleteId(null);
      fetchHistory();
    } catch (err: any) {
      alert(`Error deleting record: ${err.message}`);
    }
  };

  const handleConfirmClearAll = async () => {
    try {
      await api.clearAllHistory();
      setShowClearModal(false);
      fetchHistory();
    } catch (err: any) {
      alert(`Error clearing history: ${err.message}`);
    }
  };

  return (
    <div className="space-y-6 py-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">Security Audit History</h1>
          <p className="text-sm text-slate-400 mt-1">Audit log of all processed email analyses stored in persistent SQLite repository.</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => fetchHistory()}
            className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
            title="Refresh history"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
          {data && data.total > 0 && (
            <button
              onClick={() => setShowClearModal(true)}
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-rose-300 bg-rose-950/40 hover:bg-rose-900/50 border border-rose-500/30 rounded-lg transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Clear History</span>
            </button>
          )}
        </div>
      </div>

      {/* Search and Filters Bar */}
      <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        {/* Search Input */}
        <form onSubmit={handleSearchSubmit} className="flex-1 relative">
          <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by sender, subject, or message body..."
            className="w-full pl-9 pr-4 py-2 rounded-lg bg-slate-950 border border-slate-800 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors"
          />
        </form>

        {/* Filter by Category */}
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-slate-400 shrink-0" />
          <select
            value={classification}
            onChange={(e) => {
              setClassification(e.target.value);
              setPage(1);
            }}
            className="px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-xs font-medium text-slate-200 focus:outline-none focus:border-indigo-500"
          >
            <option value="all">All Categories</option>
            <option value="phishing">Phishing Threats</option>
            <option value="spam">Spam Emails</option>
            <option value="legitimate">Legitimate Emails</option>
          </select>

          {/* Sort By */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-xs font-medium text-slate-200 focus:outline-none focus:border-indigo-500"
          >
            <option value="analyzed_at">Sort by Date</option>
            <option value="risk_score">Sort by Risk Score</option>
            <option value="subject">Sort by Subject</option>
          </select>

          {/* Sort Direction Toggle */}
          <button
            type="button"
            onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
            className="p-2 rounded-lg bg-slate-950 border border-slate-800 text-slate-300 hover:text-white"
            title={`Toggle order (${sortOrder.toUpperCase()})`}
          >
            <ArrowUpDown className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Table */}
      {loading ? (
        <div className="min-h-[40vh] flex flex-col items-center justify-center space-y-3">
          <RefreshCw className="w-7 h-7 text-indigo-400 animate-spin" />
          <p className="text-xs text-slate-400">Querying database records...</p>
        </div>
      ) : error ? (
        <div className="p-8 rounded-xl bg-rose-950/20 border border-rose-500/30 text-center space-y-2">
          <AlertCircle className="w-8 h-8 text-rose-400 mx-auto" />
          <p className="text-sm font-semibold text-white">{error}</p>
        </div>
      ) : !data || data.items.length === 0 ? (
        /* Empty State */
        <div className="p-12 text-center rounded-2xl bg-slate-900/40 border border-slate-800 space-y-4">
          <Mail className="w-10 h-10 text-slate-500 mx-auto" />
          <div>
            <h3 className="text-base font-semibold text-white">No Analysis Records Found</h3>
            <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
              {search || classification !== 'all' 
                ? 'No emails match your current search or filter criteria.' 
                : 'Your database has no stored email analyses yet. Go to the analyzer to start evaluating messages.'}
            </p>
          </div>
          <Link
            to="/analyzer"
            className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded-lg shadow-md transition-colors"
          >
            Scan New Email
          </Link>
        </div>
      ) : (
        <div className="bg-slate-900/70 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-300">
              <thead className="text-xs uppercase bg-slate-950/80 text-slate-400 border-b border-slate-800">
                <tr>
                  <th className="py-3.5 px-4">Date & Time</th>
                  <th className="py-3.5 px-4">Sender</th>
                  <th className="py-3.5 px-4">Subject</th>
                  <th className="py-3.5 px-4">Classification</th>
                  <th className="py-3.5 px-4">Risk Score</th>
                  <th className="py-3.5 px-4">Risk Level</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {data.items.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-800/40 transition-colors">
                    {/* Timestamp */}
                    <td className="py-3.5 px-4 text-xs font-mono text-slate-400 whitespace-nowrap">
                      {new Date(item.analyzed_at).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' })}
                    </td>

                    {/* Sender */}
                    <td className="py-3.5 px-4 text-xs font-mono text-slate-300 max-w-[180px] truncate">
                      {item.sender || <span className="text-slate-600 italic">Not specified</span>}
                    </td>

                    {/* Subject */}
                    <td className="py-3.5 px-4 font-medium text-white max-w-xs truncate">
                      <Link to={`/history/${item.id}`} className="hover:text-indigo-400 transition-colors">
                        {item.subject}
                      </Link>
                    </td>

                    {/* Classification */}
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <RiskBadge type="classification" value={item.classification} size="sm" />
                    </td>

                    {/* Risk Score */}
                    <td className="py-3.5 px-4 font-mono font-bold whitespace-nowrap">
                      <span className={
                        item.risk_score >= 80 ? 'text-red-400' :
                        item.risk_score >= 55 ? 'text-rose-400' :
                        item.risk_score >= 30 ? 'text-amber-400' : 'text-emerald-400'
                      }>
                        {item.risk_score}
                      </span>
                      <span className="text-xs text-slate-500 font-normal"> / 100</span>
                    </td>

                    {/* Risk Level */}
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <RiskBadge type="level" value={item.risk_level} size="sm" showIcon={false} />
                    </td>

                    {/* Actions */}
                    <td className="py-3.5 px-4 text-right whitespace-nowrap space-x-1">
                      <Link
                        to={`/history/${item.id}`}
                        className="p-1.5 inline-flex items-center text-slate-400 hover:text-indigo-300 hover:bg-slate-800 rounded transition-colors"
                        title="View Full Threat Report"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </Link>
                      <button
                        onClick={() => setSingleDeleteId(item.id)}
                        className="p-1.5 inline-flex items-center text-slate-500 hover:text-rose-400 hover:bg-rose-950/30 rounded transition-colors"
                        title="Delete this record"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination Footer */}
          <div className="p-4 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-400">
            <div>
              Showing <span className="font-semibold text-slate-200">{(page - 1) * pageSize + 1}</span> to{' '}
              <span className="font-semibold text-slate-200">{Math.min(page * pageSize, data.total)}</span> of{' '}
              <span className="font-semibold text-slate-200">{data.total}</span> analyses
            </div>
            <div className="flex items-center gap-2">
              <button
                disabled={page <= 1}
                onClick={() => setPage(page - 1)}
                className="p-1.5 rounded bg-slate-800 hover:bg-slate-700 disabled:opacity-40 disabled:cursor-not-allowed text-slate-200 transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <span className="font-mono text-slate-300 px-2">Page {page} of {data.total_pages || 1}</span>
              <button
                disabled={page >= data.total_pages}
                onClick={() => setPage(page + 1)}
                className="p-1.5 rounded bg-slate-800 hover:bg-slate-700 disabled:opacity-40 disabled:cursor-not-allowed text-slate-200 transition-colors"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Single Item Delete Modal */}
      <ConfirmModal
        isOpen={singleDeleteId !== null}
        title="Delete Analysis Record"
        message="Are you sure you want to permanently delete this audit record from the database? This action cannot be reversed."
        confirmLabel="Delete Record"
        onConfirm={handleConfirmSingleDelete}
        onCancel={() => setSingleDeleteId(null)}
      />

      {/* Clear All History Modal */}
      <ConfirmModal
        isOpen={showClearModal}
        title="Clear All Analysis History"
        message="Are you sure you want to delete ALL stored email analyses and user feedback records from the database? This will reset all dashboard statistics."
        confirmLabel="Clear All Data"
        onConfirm={handleConfirmClearAll}
        onCancel={() => setShowClearModal(false)}
      />
    </div>
  );
};
