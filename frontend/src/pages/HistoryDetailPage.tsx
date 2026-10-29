import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Trash2, 
  Clock, 
  User, 
  Mail, 
  FileText, 
  Link as LinkIcon, 
  ShieldAlert, 
  AlertCircle, 
  ShieldCheck, 
  ThumbsUp, 
  ThumbsDown,
  RefreshCw,
  ExternalLink
} from 'lucide-react';
import { api } from '../services/api';
import { HistoryItem } from '../types';
import { RiskBadge } from '../components/RiskBadge';
import { ConfirmModal } from '../components/ConfirmModal';

export const HistoryDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [item, setItem] = useState<HistoryItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  // Feedback states
  const [feedbackSent, setFeedbackSent] = useState(false);
  const [feedbackMsg, setFeedbackMsg] = useState('');

  const fetchDetail = async () => {
    if (!id) return;
    try {
      setLoading(true);
      setError(null);
      const res = await api.getHistoryById(id);
      setItem(res);
      if (res.user_feedback) {
        setFeedbackSent(true);
        setFeedbackMsg(`Previous feedback recorded: ${res.user_feedback}`);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to fetch analysis details.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDetail();
  }, [id]);

  const handleDelete = async () => {
    if (!id) return;
    try {
      await api.deleteHistory(id);
      navigate('/history');
    } catch (err: any) {
      alert(`Error deleting record: ${err.message}`);
    }
  };

  const handleSendFeedback = async (type: 'correct' | 'incorrect') => {
    if (!item?.id) return;
    try {
      await api.submitFeedback({
        analysis_id: item.id,
        feedback_type: type,
        suggested_classification: type === 'incorrect' ? 'legitimate' : undefined,
      });
      setFeedbackSent(true);
      setFeedbackMsg(type === 'correct' ? 'Thank you! Classification confirmed.' : 'Feedback recorded for model retraining.');
    } catch {
      // Ignored
    }
  };

  if (loading) {
    return (
      <div className="min-h-[50vh] flex flex-col items-center justify-center space-y-3">
        <RefreshCw className="w-8 h-8 text-indigo-400 animate-spin" />
        <p className="text-sm text-slate-400">Loading audit record #{id}...</p>
      </div>
    );
  }

  if (error || !item) {
    return (
      <div className="max-w-2xl mx-auto my-12 p-8 rounded-2xl bg-rose-950/20 border border-rose-500/30 text-center space-y-4">
        <AlertCircle className="w-12 h-12 text-rose-400 mx-auto" />
        <h3 className="text-lg font-bold text-white">Record Not Found</h3>
        <p className="text-sm text-slate-300">{error || 'This analysis record does not exist or was deleted.'}</p>
        <Link
          to="/history"
          className="inline-flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold rounded-lg"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Return to History</span>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-8 py-6 max-w-5xl mx-auto">
      {/* Top Navigation & Actions */}
      <div className="flex items-center justify-between gap-4">
        <Link
          to="/history"
          className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to History Table</span>
        </Link>
        <button
          onClick={() => setShowDeleteModal(true)}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-rose-950/30 hover:bg-rose-900/40 border border-rose-500/30 text-rose-300 text-xs font-medium transition-colors"
        >
          <Trash2 className="w-3.5 h-3.5" />
          <span>Delete Record</span>
        </button>
      </div>

      {/* Main Title & Classification Header */}
      <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs text-slate-400 font-mono mb-1">
              <Clock className="w-3.5 h-3.5" />
              <span>Analyzed on {new Date(item.analyzed_at).toLocaleString()}</span>
              <span>•</span>
              <span>Record ID: #{item.id}</span>
            </div>
            <h1 className="text-2xl font-bold text-white tracking-tight">{item.subject}</h1>
          </div>
          <div className="flex items-center gap-3">
            <RiskBadge type="classification" value={item.classification} size="lg" />
            <RiskBadge type="level" value={item.risk_level} size="lg" />
          </div>
        </div>

        {/* Risk Score Progress Bar */}
        <div className="pt-4 border-t border-slate-800/80">
          <div className="flex items-center justify-between text-xs mb-1.5">
            <span className="text-slate-400">Risk Severity Score:</span>
            <span className="font-mono font-bold text-white text-sm">{item.risk_score} / 100</span>
          </div>
          <div className="w-full h-3 rounded-full bg-slate-950 overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-500 ${
                item.risk_score >= 80 ? 'bg-gradient-to-r from-rose-600 to-red-500' :
                item.risk_score >= 55 ? 'bg-gradient-to-r from-amber-500 to-rose-500' :
                item.risk_score >= 30 ? 'bg-gradient-to-r from-yellow-500 to-amber-500' :
                'bg-gradient-to-r from-emerald-500 to-teal-400'
              }`}
              style={{ width: `${item.risk_score}%` }}
            />
          </div>
        </div>
      </div>

      {/* Two Column Grid: Original Data vs Forensic Insights */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Left: Original Submitted Details */}
        <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-4">
          <h3 className="text-sm font-semibold text-slate-200 uppercase tracking-wider flex items-center gap-2">
            <Mail className="w-4 h-4 text-indigo-400" />
            <span>Submitted Message Details</span>
          </h3>

          <div className="space-y-3 text-xs">
            <div>
              <span className="text-slate-500 block mb-0.5">Sender Address:</span>
              <span className="font-mono text-slate-200 bg-slate-950 px-2.5 py-1 rounded border border-slate-800 inline-block">
                {item.sender || 'Not provided'}
              </span>
            </div>

            {item.url_input && (
              <div>
                <span className="text-slate-500 block mb-0.5">Extracted / Target URL:</span>
                <span className="font-mono text-slate-200 bg-slate-950 px-2.5 py-1 rounded border border-slate-800 inline-block break-all">
                  {item.url_input}
                </span>
              </div>
            )}

            <div>
              <span className="text-slate-500 block mb-1">Original Message Body Content:</span>
              <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 font-mono text-slate-300 whitespace-pre-wrap leading-relaxed max-h-64 overflow-y-auto">
                {item.body}
              </div>
            </div>
          </div>
        </div>

        {/* Right: Forensic Indicators and Recommendations */}
        <div className="space-y-6">
          {/* Reasons */}
          <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-3">
            <h3 className="text-sm font-semibold text-slate-200 uppercase tracking-wider flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-400" />
              <span>Detection Reasons</span>
            </h3>
            <ul className="space-y-2 text-xs text-slate-300">
              {item.reasons.map((reason, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="text-indigo-400 font-bold shrink-0">•</span>
                  <span className="leading-relaxed">{reason}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Suspicious Phrases */}
          {item.suspicious_keywords.length > 0 && (
            <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-3">
              <h3 className="text-sm font-semibold text-slate-200 uppercase tracking-wider">
                Flagged Coercive / Spam Phrases
              </h3>
              <div className="flex flex-wrap gap-1.5">
                {item.suspicious_keywords.map((kw, i) => (
                  <span key={i} className="px-2.5 py-1 rounded bg-slate-800 text-rose-300 border border-rose-500/20 text-xs font-mono">
                    "{kw}"
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Safety Recommendations */}
          <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-3">
            <h3 className="text-sm font-semibold text-slate-200 uppercase tracking-wider flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Safety Recommendations</span>
            </h3>
            <ul className="space-y-1.5 text-xs text-slate-300">
              {item.recommendations.map((rec, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="text-emerald-400 font-bold shrink-0">✓</span>
                  <span>{rec}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* User Feedback Widget */}
          <div className="p-5 rounded-2xl bg-slate-900/40 border border-slate-800 flex items-center justify-between gap-3 text-xs">
            <span className="text-slate-400">Validate this result for academic review:</span>
            {feedbackSent ? (
              <span className="text-emerald-400 font-medium">{feedbackMsg}</span>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleSendFeedback('correct')}
                  className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 flex items-center gap-1.5 transition-colors"
                >
                  <ThumbsUp className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Mark Correct</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleSendFeedback('incorrect')}
                  className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 flex items-center gap-1.5 transition-colors"
                >
                  <ThumbsDown className="w-3.5 h-3.5 text-rose-400" />
                  <span>Mark Incorrect</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={showDeleteModal}
        title="Delete Audit Record"
        message="Are you sure you want to permanently delete this analysis record from the database?"
        confirmLabel="Confirm Delete"
        onConfirm={handleDelete}
        onCancel={() => setShowDeleteModal(false)}
      />
    </div>
  );
};
