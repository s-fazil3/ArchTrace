import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    History, GitCommit, User, AlertTriangle, AlertOctagon,
    CheckCircle, RefreshCw, Search, Trash2, Calendar,
    ShieldCheck, Database, Server, Filter, ChevronRight
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export default function HistoryPage() {
    const { user } = useAuth();
    const [history, setHistory] = useState([]);
    const [filter, setFilter] = useState('all');
    const [searchTerm, setSearchTerm] = useState('');
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        fetchHistory();
        const poll = setInterval(fetchHistory, 30000);
        return () => clearInterval(poll);
    }, []);

    const fetchHistory = async () => {
        try {
            const token = localStorage.getItem('archtrace_token');
            const res = await fetch('http://localhost:8080/api/audit', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (res.ok) {
                const data = await res.json();
                setHistory(data.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp)));
            }
        } catch (err) {
            console.error("Error fetching audit logs:", err);
        } finally {
            setIsLoading(false);
        }
    };

    const handleClearLogs = async () => {
        if (!window.confirm("Are you sure you want to permanently delete all history logs?")) return;
        try {
            const token = localStorage.getItem('archtrace_token');
            const res = await fetch('http://localhost:8080/api/audit', {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (res.ok) {
                setHistory([]);
            }
        } catch (err) {
            console.error("Error clearing audit logs:", err);
        }
    };

    const formatDate = (timestamp) => {
        if (!timestamp) return 'Recently';
        const d = new Date(timestamp);
        return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true });
    };

    const getFullDate = (timestamp) => {
        if (!timestamp) return 'Today';
        const d = new Date(timestamp);
        const today = new Date();
        if (d.toDateString() === today.toDateString()) return 'Today';
        const yesterday = new Date();
        yesterday.setDate(today.getDate() - 1);
        if (d.toDateString() === yesterday.toDateString()) return 'Yesterday';
        return d.toLocaleDateString([], { month: 'long', day: 'numeric', year: 'numeric' });
    };

    const getTypeConfig = (type) => {
        switch (type?.toLowerCase()) {
            case 'critical':
                return {
                    label: 'Security Incident',
                    bg: 'bg-rose-50',
                    text: 'text-rose-600',
                    border: 'border-rose-200',
                    ico: AlertOctagon,
                    dot: 'bg-rose-500'
                };
            case 'recovery':
                return {
                    label: 'System Resolved',
                    bg: 'bg-emerald-50',
                    text: 'text-emerald-600',
                    border: 'border-emerald-200',
                    ico: CheckCircle,
                    dot: 'bg-emerald-500'
                };
            case 'warning':
                return {
                    label: 'Health Alert',
                    bg: 'bg-amber-50',
                    text: 'text-amber-600',
                    border: 'border-amber-200',
                    ico: AlertTriangle,
                    dot: 'bg-amber-500'
                };
            case 'create':
            case 'update':
                return {
                    label: 'Config Change',
                    bg: 'bg-indigo-50',
                    text: 'text-indigo-600',
                    border: 'border-indigo-200',
                    ico: Server,
                    dot: 'bg-indigo-500'
                };
            default:
                return {
                    label: 'Audit Log',
                    bg: 'bg-slate-50',
                    text: 'text-slate-600',
                    border: 'border-slate-200',
                    ico: History,
                    dot: 'bg-slate-400'
                };
        }
    };

    const filtered = history.filter(item => {
        const query = searchTerm.toLowerCase();
        const matchesSearch = (item.action || '').toLowerCase().includes(query) ||
            (item.target || '').toLowerCase().includes(query) ||
            (item.userName || '').toLowerCase().includes(query);

        if (!matchesSearch) return false;
        if (filter === 'incidents') return ['critical', 'warning', 'recovery'].includes(item.type?.toLowerCase());
        if (filter === 'config') return ['create', 'update', 'delete'].includes(item.type?.toLowerCase());
        return true;
    });

    // Group logs by Date
    const groups = filtered.reduce((acc, obj) => {
        const key = getFullDate(obj.timestamp);
        if (!acc[key]) acc[key] = [];
        acc[key].push(obj);
        return acc;
    }, {});

    return (
        <div className="space-y-8 max-w-6xl mx-auto pb-20 font-inter">
            {/* Elegant Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 bg-white p-8 rounded-3xl border border-slate-200 shadow-sm relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-50/50 rounded-full blur-3xl -mr-32 -mt-32 -z-0"></div>
                <div className="relative z-10">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="w-10 h-10 rounded-2xl bg-indigo-600 flex items-center justify-center text-white shadow-lg shadow-indigo-200">
                            <ShieldCheck size={20} />
                        </div>
                        <h1 className="text-3xl font-black font-poppins text-slate-900 tracking-tight">Audit Trail</h1>
                    </div>
                    <p className="text-slate-500 font-medium ml-1">Immutable record of all architectural state transitions.</p>
                </div>

                <div className="flex items-center gap-3 relative z-10">
                    {user?.role === 'ADMIN' && (
                        <button
                            onClick={handleClearLogs}
                            className="flex items-center gap-2 text-rose-600 font-bold text-xs px-5 py-2.5 bg-rose-50 border border-rose-100 rounded-xl hover:bg-rose-100/50 transition-all uppercase tracking-widest shadow-sm"
                        >
                            <Trash2 size={14} /> Wipe Store
                        </button>
                    )}
                    <button
                        onClick={fetchHistory}
                        className="flex items-center gap-2 text-slate-700 font-bold text-xs px-5 py-2.5 bg-white border border-slate-200 rounded-xl hover:border-indigo-400 hover:text-indigo-600 transition-all uppercase tracking-widest shadow-sm"
                    >
                        <RefreshCw size={14} className={isLoading ? 'animate-spin' : ''} /> Sync Store
                    </button>
                </div>
            </div>

            {/* Smart Filters */}
            <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
                <div className="relative w-full md:w-96">
                    <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                        type="text"
                        placeholder="Search incidents, users, or targets..."
                        value={searchTerm}
                        onChange={e => setSearchTerm(e.target.value)}
                        className="w-full pl-12 pr-6 py-3 bg-white border border-slate-200 rounded-2xl text-sm focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all shadow-sm font-medium"
                    />
                </div>

                <div className="flex p-1.5 bg-white border border-slate-200 rounded-2xl shadow-sm">
                    {['all', 'incidents', 'config'].map(f => (
                        <button
                            key={f}
                            onClick={() => setFilter(f)}
                            className={`px-6 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all ${filter === f
                                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200'
                                : 'text-slate-500 hover:text-indigo-600 hover:bg-indigo-50'
                                }`}
                        >
                            {f === 'all' ? 'Everything' : f}
                        </button>
                    ))}
                </div>
            </div>

            {/* Timeline View */}
            <div className="space-y-10 relative px-4">
                {/* Vertical Line */}
                <div className="absolute left-10 top-0 bottom-0 w-[2px] bg-slate-100 -z-10"></div>

                {Object.keys(groups).length === 0 ? (
                    <div className="bg-white p-20 rounded-3xl border border-slate-200 border-dashed text-center">
                        <History size={48} className="text-slate-200 mx-auto mb-4" />
                        <h3 className="text-xl font-bold text-slate-700">Audit Vault is Empty</h3>
                        <p className="text-slate-400 mt-2">No activities matching your query were found in the archive.</p>
                    </div>
                ) : (
                    Object.keys(groups).map((date) => (
                        <div key={date} className="space-y-6">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-2xl bg-white border border-slate-200 flex items-center justify-center shadow-sm relative z-10">
                                    <Calendar size={18} className="text-indigo-600" />
                                </div>
                                <h2 className="text-sm font-black text-slate-800 uppercase tracking-widest">{date}</h2>
                            </div>

                            <div className="pl-1 space-y-4">
                                {groups[date].map((item, idx) => {
                                    const config = getTypeConfig(item.type);
                                    const Icon = config.ico;

                                    return (
                                        <motion.div
                                            key={item.id}
                                            initial={{ opacity: 0, x: -20 }}
                                            whileInView={{ opacity: 1, x: 0 }}
                                            viewport={{ once: true }}
                                            className="group relative flex items-start gap-8 ml-8"
                                        >
                                            {/* Time Label */}
                                            <div className="w-16 pt-3 text-[10px] font-bold text-slate-400 text-right uppercase tracking-tighter">
                                                {formatDate(item.timestamp)}
                                            </div>

                                            {/* Connector Dot */}
                                            <div className="absolute left-2.5 top-4 -ml-[5px] w-2.5 h-2.5 rounded-full border-2 border-white ring-4 ring-slate-50 relative z-10 overflow-visible">
                                                <div className={`inset-0 absolute rounded-full ${config.dot} animate-pulse opacity-40`}></div>
                                            </div>

                                            {/* Activity Card */}
                                            <div className={`flex-1 bg-white p-5 rounded-2xl border ${config.border} shadow-sm group-hover:shadow-md group-hover:border-indigo-300 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 overflow-hidden relative`}>
                                                <div className="flex items-start gap-4 flex-1">
                                                    <div className={`p-3 rounded-xl ${config.bg} ${config.text} shadow-inner`}>
                                                        <Icon size={20} />
                                                    </div>
                                                    <div className="space-y-1">
                                                        <div className="flex items-center gap-2 mb-0.5">
                                                            <span className={`text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded-md ${config.bg} ${config.text}`}>
                                                                {config.label}
                                                            </span>
                                                            <span className="text-[10px] font-bold text-slate-300 font-mono">#{item.id}</span>
                                                        </div>
                                                        <p className="text-sm font-bold text-slate-800 leading-snug">{item.action}</p>
                                                        <div className="flex items-center gap-4 pt-1">
                                                            <div className="flex items-center gap-1.5 text-xs text-slate-500 font-semibold bg-slate-50 px-2 py-1 rounded-lg">
                                                                <User size={12} className="text-slate-400" />
                                                                {item.userName || 'System'}
                                                            </div>
                                                            {item.target && (
                                                                <div className="flex items-center gap-1.5 text-xs text-indigo-600 font-semibold bg-indigo-50 px-2 py-1 rounded-lg">
                                                                    <Database size={12} className="text-indigo-400" />
                                                                    {item.target}
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="flex items-center pr-2">
                                                    <ChevronRight size={20} className="text-slate-200 group-hover:text-indigo-400 group-hover:translate-x-1 transition-all" />
                                                </div>
                                            </div>
                                        </motion.div>
                                    );
                                })}
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
