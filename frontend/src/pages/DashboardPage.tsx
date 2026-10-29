import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  BarChart3, 
  ShieldAlert, 
  AlertTriangle, 
  CheckCircle2, 
  Mail, 
  Search, 
  Sparkles, 
  ArrowUpRight, 
  TrendingUp, 
  RefreshCw,
  Clock,
  ExternalLink,
  ShieldX
} from 'lucide-react';
import { 
  PieChart, 
  Pie, 
  Cell, 
  ResponsiveContainer, 
  Tooltip, 
  Legend, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid,
  AreaChart,
  Area
} from 'recharts';

import { api } from '../services/api';
import { DashboardStats, HistoryItem } from '../types';
import { StatCard } from '../components/StatCard';
import { RiskBadge } from '../components/RiskBadge';

export const DashboardPage: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStats = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await api.getDashboardStats();
      setStats(data);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch dashboard metrics from the database.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-4">
        <RefreshCw className="w-8 h-8 text-indigo-400 animate-spin" />
        <p className="text-sm text-slate-400">Loading security analytics from SQLite database...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto my-12 p-6 rounded-2xl bg-rose-950/20 border border-rose-500/30 text-center space-y-4">
        <ShieldX className="w-12 h-12 text-rose-400 mx-auto" />
        <h3 className="text-lg font-bold text-white">Database Connection Error</h3>
        <p className="text-sm text-slate-300 max-w-md mx-auto">{error}</p>
        <button
          onClick={fetchStats}
          className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white text-sm font-medium rounded-lg transition-colors"
        >
          Retry Connection
        </button>
      </div>
    );
  }

  const isEmpty = !stats || stats.total_analyzed === 0;

  // Data for Classification Distribution Pie Chart
  const pieData = stats ? [
    { name: 'Phishing', value: stats.phishing_count, color: '#f43f5e' },
    { name: 'Spam', value: stats.spam_count, color: '#f59e0b' },
    { name: 'Legitimate', value: stats.legitimate_count, color: '#10b981' },
  ].filter(item => item.value > 0) : [];

  // Data for Risk Level Distribution
  const riskDistData = stats ? [
    { name: 'Low', count: stats.risk_distribution.Low, color: '#10b981' },
    { name: 'Medium', count: stats.risk_distribution.Medium, color: '#f59e0b' },
    { name: 'High', count: stats.risk_distribution.High, color: '#f43f5e' },
    { name: 'Critical', count: stats.risk_distribution.Critical, color: '#b91c1c' },
  ] : [];

  return (
    <div className="space-y-8 py-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">Threat Intelligence Dashboard</h1>
          <p className="text-sm text-slate-400 mt-1">Real-time analytical telemetry computed from persistent SQLite analysis records.</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={fetchStats}
            className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
            title="Refresh statistics"
            aria-label="Refresh statistics"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
          <Link
            to="/analyzer"
            className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded-lg shadow-md transition-colors"
          >
            <Sparkles className="w-4 h-4" />
            <span>Analyze New Email</span>
          </Link>
        </div>
      </div>

      {isEmpty ? (
        /* Empty State */
        <div className="p-12 text-center rounded-2xl bg-slate-900/40 border border-slate-800/80 space-y-5">
          <div className="w-16 h-16 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center mx-auto">
            <Mail className="w-8 h-8" />
          </div>
          <div className="max-w-md mx-auto space-y-2">
            <h3 className="text-xl font-bold text-white">No Email Analyses Recorded Yet</h3>
            <p className="text-sm text-slate-400">
              The SQLite database is initialized and ready. Submit your first email analysis or load a simulated demo to populate security metrics and charts.
            </p>
          </div>
          <Link
            to="/analyzer"
            className="inline-flex items-center gap-2 px-6 py-3 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded-xl shadow-lg transition-all"
          >
            <Search className="w-4 h-4" />
            <span>Launch Email Analyzer</span>
          </Link>
        </div>
      ) : (
        <>
          {/* Key Metric Summary Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard
              title="Total Analyzed"
              value={stats.total_analyzed}
              subtitle="All stored email audits"
              icon={<Mail className="w-6 h-6" />}
              variant="blue"
            />
            <StatCard
              title="Phishing Detected"
              value={stats.phishing_count}
              subtitle={`${((stats.phishing_count / stats.total_analyzed) * 100).toFixed(1)}% of total traffic`}
              icon={<ShieldAlert className="w-6 h-6" />}
              variant="rose"
            />
            <StatCard
              title="Spam Emails"
              value={stats.spam_count}
              subtitle={`${((stats.spam_count / stats.total_analyzed) * 100).toFixed(1)}% promotional/unwanted`}
              icon={<AlertTriangle className="w-6 h-6" />}
              variant="amber"
            />
            <StatCard
              title="Legitimate (Ham)"
              value={stats.legitimate_count}
              subtitle={`${((stats.legitimate_count / stats.total_analyzed) * 100).toFixed(1)}% safe messages`}
              icon={<CheckCircle2 className="w-6 h-6" />}
              variant="emerald"
            />
          </div>

          {/* Visual Charts Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Chart 1: Classification Distribution */}
            <div className="p-6 rounded-2xl bg-slate-900/70 border border-slate-800 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-semibold text-white">Email Threat Distribution</h3>
                  <p className="text-xs text-slate-400">Proportion of scanned emails by security category</p>
                </div>
              </div>
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={85}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} stroke="#0f172a" strokeWidth={2} />
                      ))}
                    </Pie>
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', borderRadius: '8px', color: '#fff' }}
                    />
                    <Legend 
                      verticalAlign="bottom" 
                      height={36} 
                      formatter={(val) => <span className="text-xs text-slate-300 font-medium">{val}</span>}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Chart 2: Threat Severity Breakdown */}
            <div className="p-6 rounded-2xl bg-slate-900/70 border border-slate-800 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-semibold text-white">Risk Level Distribution</h3>
                  <p className="text-xs text-slate-400">Categorization across Low, Medium, High, and Critical risk</p>
                </div>
              </div>
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={riskDistData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                    <XAxis dataKey="name" stroke="#64748b" fontSize={12} tickLine={false} />
                    <YAxis stroke="#64748b" fontSize={12} allowDecimals={false} tickLine={false} />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', borderRadius: '8px', color: '#fff' }}
                    />
                    <Bar dataKey="count" radius={[6, 6, 0, 0]}>
                      {riskDistData.map((entry, index) => (
                        <Cell key={`bar-${index}`} fill={entry.color} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Detection Trends Over Time */}
          {stats.trend_by_date && stats.trend_by_date.length > 0 && (
            <div className="p-6 rounded-2xl bg-slate-900/70 border border-slate-800 space-y-4">
              <div>
                <h3 className="text-base font-semibold text-white">Analysis Timeline Activity</h3>
                <p className="text-xs text-slate-400">Daily frequency of spam, phishing, and legitimate scans</p>
              </div>
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={stats.trend_by_date} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorPhishing" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.4}/>
                        <stop offset="95%" stopColor="#f43f5e" stopOpacity={0}/>
                      </linearGradient>
                      <linearGradient id="colorSpam" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.4}/>
                        <stop offset="95%" stopColor="#f59e0b" stopOpacity={0}/>
                      </linearGradient>
                      <linearGradient id="colorLegit" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.4}/>
                        <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                    <XAxis dataKey="date" stroke="#64748b" fontSize={11} tickLine={false} />
                    <YAxis stroke="#64748b" fontSize={11} allowDecimals={false} tickLine={false} />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', borderRadius: '8px', color: '#fff' }}
                    />
                    <Area type="monotone" dataKey="phishing" stroke="#f43f5e" fillOpacity={1} fill="url(#colorPhishing)" name="Phishing" />
                    <Area type="monotone" dataKey="spam" stroke="#f59e0b" fillOpacity={1} fill="url(#colorSpam)" name="Spam" />
                    <Area type="monotone" dataKey="legitimate" stroke="#10b981" fillOpacity={1} fill="url(#colorLegit)" name="Legitimate" />
                    <Legend verticalAlign="bottom" height={24} formatter={(val) => <span className="text-xs text-slate-300">{val}</span>} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}

          {/* Recent High-Risk Incidents Table */}
          <div className="p-6 rounded-2xl bg-slate-900/70 border border-slate-800 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-semibold text-white">Recent High-Risk Email Alerts</h3>
                <p className="text-xs text-slate-400">Emails identified with high or critical threat scores</p>
              </div>
              <Link to="/history" className="text-xs font-medium text-indigo-400 hover:text-indigo-300 flex items-center gap-1">
                <span>View Full Audit Log</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {stats.recent_high_risk.length === 0 ? (
              <p className="text-xs text-slate-400 py-4 text-center">No high or critical risk emails detected yet.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm text-slate-300">
                  <thead className="text-xs uppercase bg-slate-950/60 text-slate-400 border-b border-slate-800">
                    <tr>
                      <th className="py-3 px-4">Subject</th>
                      <th className="py-3 px-4">Sender</th>
                      <th className="py-3 px-4">Classification</th>
                      <th className="py-3 px-4">Risk Score</th>
                      <th className="py-3 px-4">Timestamp</th>
                      <th className="py-3 px-4 text-right">Details</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60">
                    {stats.recent_high_risk.map((item) => (
                      <tr key={item.id} className="hover:bg-slate-800/40 transition-colors">
                        <td className="py-3 px-4 font-medium text-white max-w-xs truncate">{item.subject}</td>
                        <td className="py-3 px-4 text-xs font-mono text-slate-400 max-w-[200px] truncate">
                          {item.sender || 'Not provided'}
                        </td>
                        <td className="py-3 px-4">
                          <RiskBadge type="classification" value={item.classification} size="sm" />
                        </td>
                        <td className="py-3 px-4 font-mono">
                          <span className="text-rose-400 font-bold">{item.risk_score}</span> / 100
                        </td>
                        <td className="py-3 px-4 text-xs text-slate-400">
                          {new Date(item.analyzed_at).toLocaleString()}
                        </td>
                        <td className="py-3 px-4 text-right">
                          <Link
                            to={`/history/${item.id}`}
                            className="p-1.5 inline-flex items-center text-indigo-400 hover:text-indigo-300 hover:bg-slate-800 rounded transition-colors"
                            title="Inspect forensic details"
                          >
                            <ExternalLink className="w-4 h-4" />
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};
