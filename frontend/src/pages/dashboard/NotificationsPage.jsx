import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { AlertTriangle, CheckCircle, AlertCircle, Info, Trash2, X, Bell, Check, Undo2, ArrowLeft, Filter } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../components/Toast';

const timeAgo = (dateStr) => {
    if (!dateStr) return 'just now';
    const date = new Date(dateStr);
    const now = new Date();
    const diffInSecs = Math.floor((now - date) / 1000);
    if (diffInSecs < 60) return `${diffInSecs}s ago`;
    const diffInMins = Math.floor(diffInSecs / 60);
    if (diffInMins < 60) return `${diffInMins}m ago`;
    const diffInHours = Math.floor(diffInMins / 60);
    if (diffInHours < 24) return `${diffInHours}h ago`;
    return date.toLocaleDateString();
};

export default function NotificationsPage() {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [notifications, setNotifications] = useState([]);
    const [confirmingId, setConfirmingId] = useState(null);
    const [ackId, setAckId] = useState(null);
    const [showOnlyMyTeam, setShowOnlyMyTeam] = useState(true); // Default to my team for clarity
    const toast = useToast();

    const fetchNotifications = async () => {
        try {
            const token = localStorage.getItem('archtrace_token');
            if (!token) return;
            const res = await fetch('http://localhost:8080/api/notifications', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (res.ok) {
                const data = await res.json();
                setNotifications(data);
            }
        } catch (err) {
            console.error('Error fetching notifications', err);
        }
    };

    useEffect(() => {
        fetchNotifications();
        const interval = setInterval(fetchNotifications, 30000);
        return () => clearInterval(interval);
    }, []);

    const markAsRead = async (id, isRead) => {
        if (isRead) return;
        try {
            const token = localStorage.getItem('archtrace_token');
            await fetch(`http://localhost:8080/api/notifications/${id}/read`, {
                method: 'PUT',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            fetchNotifications();
        } catch (err) {
            console.error(err);
        }
    };

    const handleResolve = async (e, id) => {
        e.stopPropagation();
        try {
            const token = localStorage.getItem('archtrace_token');
            const res = await fetch(`http://localhost:8080/api/notifications/${id}/resolve`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ reason: "Resolved by Team Lead." })
            });
            if (res.ok) {
                toast("Incident Resolved.", "success");
                setConfirmingId(null);
                fetchNotifications();
            }
        } catch (err) {
            toast("Failed to resolve.", "error");
        }
    };

    const handleAcknowledge = async (e, id) => {
        e.stopPropagation();
        try {
            const token = localStorage.getItem('archtrace_token');
            const res = await fetch(`http://localhost:8080/api/notifications/${id}/acknowledge`, {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (res.ok) {
                toast("Acknowledged.", "success");
                setAckId(null);
                fetchNotifications();
            }
        } catch (err) {
            toast("Failed to acknowledge.", "error");
        }
    };

    const handleDelete = async (e, id) => {
        e.stopPropagation();
        try {
            const token = localStorage.getItem('archtrace_token');
            const res = await fetch(`http://localhost:8080/api/notifications/${id}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (res.ok) {
                setNotifications(prev => prev.filter(n => n.id !== id));
                toast('Removed from inbox', 'info');
            }
        } catch (err) {
            toast('Failed to delete', 'error');
        }
    };

    const handleClearAll = async () => {
        if (!window.confirm("Clear all notification history from your inbox?")) return;
        try {
            const token = localStorage.getItem('archtrace_token');
            const res = await fetch('http://localhost:8080/api/notifications/clear-all', {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (res.ok) {
                setNotifications([]);
                toast('Inbox cleared', 'success');
            }
        } catch (err) {
            toast('Failed to clear', 'error');
        }
    };

    const getIcon = (type) => {
        switch (type) {
            case 'danger': return <AlertTriangle size={14} className="text-rose-600" />;
            case 'success': return <CheckCircle size={14} className="text-emerald-600" />;
            case 'warning': return <AlertCircle size={14} className="text-amber-600" />;
            default: return <Info size={14} className="text-indigo-600" />;
        }
    };

    const getBgColor = (type) => {
        switch (type) {
            case 'danger': return 'bg-rose-100';
            case 'success': return 'bg-emerald-100';
            case 'warning': return 'bg-amber-100';
            default: return 'bg-indigo-100';
        }
    };

    // FILTER LOGIC: Strict Team Relevance
    const filteredNotifications = showOnlyMyTeam
        ? notifications.filter(n => n.targetTeam?.toLowerCase() === user?.team?.toLowerCase() || n.ownerEmail === user?.email)
        : notifications;

    return (
        <div className="space-y-6 max-w-4xl mx-auto">
            <div className="flex flex-col gap-4">
                <button
                    onClick={() => navigate('/dashboard')}
                    className="flex items-center gap-2 text-slate-400 hover:text-slate-600 transition-colors text-sm font-semibold group"
                >
                    <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
                    Back to Dashboard
                </button>
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold font-poppins text-slate-800 tracking-tight">System Alerts</h1>
                        <p className="text-slate-500 text-sm mt-1">Incident lifecycle management and team updates.</p>
                    </div>
                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => setShowOnlyMyTeam(!showOnlyMyTeam)}
                            className={`flex items-center gap-2 px-3 py-2 text-xs font-bold rounded-lg transition-all border ${showOnlyMyTeam ? 'bg-indigo-600 text-white border-indigo-600 shadow-md' : 'bg-white text-slate-500 border-slate-200 hover:bg-slate-50'
                                }`}
                        >
                            <Filter size={14} /> {showOnlyMyTeam ? 'My Team Only' : 'All Alerts'}
                        </button>
                        {notifications.length > 0 && (
                            <button
                                onClick={handleClearAll}
                                className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors border border-slate-100"
                            >
                                <Trash2 size={16} /> Clear Inbox
                            </button>
                        )}
                    </div>
                </div>
            </div>

            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden"
            >
                <div className="divide-y divide-slate-50">
                    {filteredNotifications.length === 0 ? (
                        <div className="p-16 text-center text-slate-500">
                            <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Bell size={24} className="text-slate-300" />
                            </div>
                            <p className="font-semibold text-slate-700">No active alerts for your filters</p>
                            <p className="text-sm mt-1">Try switching to 'All Alerts' or wait for system updates.</p>
                        </div>
                    ) : (
                        filteredNotifications.map(n => {
                            const isAdmin = user?.role === 'ADMIN';
                            const isTeamLead = user?.role === 'TEAM_LEAD';
                            const isMyTeam = n.targetTeam?.toLowerCase() === user?.team?.toLowerCase();
                            const canResolve = (isTeamLead && isMyTeam) || isAdmin;

                            return (
                                <div
                                    key={n.id}
                                    onClick={() => markAsRead(n.id, n.read)}
                                    className={`p-6 hover:bg-slate-50/50 transition-all cursor-pointer relative group ${!n.read ? 'bg-indigo-50/20' : ''}`}
                                >
                                    <div className="flex gap-4">
                                        <div className={`w-12 h-12 rounded-2xl ${getBgColor(n.type)} flex items-center justify-center flex-shrink-0 shadow-sm`}>
                                            {getIcon(n.type)}
                                        </div>
                                        <div className="flex-1">
                                            <div className="flex items-center justify-between mb-1">
                                                <div className="flex items-center gap-2">
                                                    <p className={`text-sm text-slate-800 ${!n.read ? 'font-bold' : 'font-semibold'}`}>{n.title}</p>
                                                    {n.incidentStatus && (
                                                        <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider ${n.incidentStatus === 'PENDING' ? 'bg-rose-100 text-rose-600' :
                                                            n.incidentStatus === 'RESOLVED' ? 'bg-emerald-100 text-emerald-600' :
                                                                n.incidentStatus === 'CLOSED' ? 'bg-slate-100 text-slate-500' : 'bg-blue-100 text-blue-600'
                                                            }`}>
                                                            {n.incidentStatus}
                                                        </span>
                                                    )}
                                                </div>
                                                <span className="text-[10px] font-medium text-slate-400 uppercase tracking-wider">{timeAgo(n.timestamp)}</span>
                                            </div>
                                            <p className="text-xs text-slate-500 leading-relaxed whitespace-pre-line mb-3">{n.message}</p>

                                            {/* Action Lifecycle Buttons */}
                                            <div className="flex items-center gap-2 mt-4">
                                                {canResolve && (n.incidentStatus === 'PENDING' || (!n.incidentStatus && n.type === 'danger')) && (
                                                    <div className="flex items-center gap-2">
                                                        {confirmingId === n.id ? (
                                                            <>
                                                                <button
                                                                    onClick={(e) => handleResolve(e, n.id)}
                                                                    className="px-4 py-1.5 bg-emerald-600 text-white text-xs font-bold rounded-lg hover:bg-emerald-700 transition-all shadow-sm"
                                                                >
                                                                    Confirm Resolve
                                                                </button>
                                                                <button
                                                                    onClick={(e) => { e.stopPropagation(); setConfirmingId(null); }}
                                                                    className="px-3 py-1.5 bg-slate-100 text-slate-500 text-xs font-bold rounded-lg hover:bg-slate-200 transition-all"
                                                                >
                                                                    Cancel
                                                                </button>
                                                            </>
                                                        ) : (
                                                            <button
                                                                onClick={(e) => { e.stopPropagation(); setConfirmingId(n.id); }}
                                                                className="px-4 py-1.5 bg-emerald-600 text-white text-xs font-bold rounded-lg hover:bg-emerald-700 transition-all flex items-center gap-1.5 shadow-sm"
                                                            >
                                                                <Check size={14} strokeWidth={3} /> Resolve Incident
                                                            </button>
                                                        )}
                                                    </div>
                                                )}

                                                {n.incidentStatus === 'AWAITING_ACK' && (
                                                    <div className="flex items-center gap-2">
                                                        {ackId === n.id ? (
                                                            <>
                                                                <button
                                                                    onClick={(e) => handleAcknowledge(e, n.id)}
                                                                    className="px-4 py-1.5 bg-indigo-600 text-white text-xs font-bold rounded-lg hover:bg-indigo-700 transition-all shadow-sm"
                                                                >
                                                                    Confirm Acknowledge
                                                                </button>
                                                                <button
                                                                    onClick={(e) => { e.stopPropagation(); setAckId(null); }}
                                                                    className="px-3 py-1.5 bg-slate-100 text-slate-500 text-xs font-bold rounded-lg hover:bg-slate-200 transition-all"
                                                                >
                                                                    Cancel
                                                                </button>
                                                            </>
                                                        ) : (
                                                            <button
                                                                onClick={(e) => { e.stopPropagation(); setAckId(n.id); }}
                                                                className="px-4 py-1.5 bg-indigo-600 text-white text-xs font-bold rounded-lg hover:bg-indigo-700 transition-all flex items-center gap-1.5 shadow-sm"
                                                            >
                                                                <Undo2 size={14} strokeWidth={3} /> Resolve Alert
                                                            </button>
                                                        )}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                        <button
                                            onClick={(e) => handleDelete(e, n.id)}
                                            className="p-2 text-slate-300 hover:text-rose-500 opacity-0 group-hover:opacity-100 transition-all rounded-lg hover:bg-rose-50 flex-shrink-0"
                                            title="Remove from inbox"
                                        >
                                            <X size={16} />
                                        </button>
                                    </div>
                                </div>
                            );
                        })
                    )}
                </div>
            </motion.div>
        </div>
    );
}
