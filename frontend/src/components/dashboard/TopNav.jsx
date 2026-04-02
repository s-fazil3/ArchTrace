import { Bell, Search, User, Info, AlertTriangle, CheckCircle, AlertCircle, Trash2, Check, Undo2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useToast } from '../Toast';

function timeAgo(dateString) {
    if (!dateString) return '';
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now - date) / 1000);

    if (diffInSeconds < 60) return `${diffInSeconds}s ago`;
    const diffInMinutes = Math.floor(diffInSeconds / 60);
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours}h ago`;
    return date.toLocaleDateString();
}

export default function TopNav() {
    const { user } = useAuth();
    const [showNotifications, setShowNotifications] = useState(false);
    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const navigate = useNavigate();
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
                // Filter by team relevance or global
                const filtered = data.filter(n => {
                    const isMyTeam = n.targetTeam?.toLowerCase() === user?.team?.toLowerCase();
                    const isForMe = n.ownerEmail === user?.email;
                    return isMyTeam || isForMe;
                });

                setNotifications(filtered);
                setUnreadCount(filtered.filter(n => !n.read).length);
            }
        } catch (err) {
            console.error("Error fetching notifications", err);
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
            const res = await fetch(`http://localhost:8080/api/notifications/${id}/read`, {
                method: 'PUT',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (res.ok) fetchNotifications();
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
                body: JSON.stringify({ reason: "Quick resolve from navbar." })
            });
            if (res.ok) {
                toast("Incident Resolved.", "success");
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
                fetchNotifications();
            }
        } catch (err) {
            toast("Failed to acknowledge.", "error");
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

    return (
        <div className="h-16 bg-white/80 backdrop-blur-xl border-b border-slate-200 flex items-center justify-between px-8 sticky top-0 z-30 shadow-sm">
            <div className="flex-1 flex items-center gap-4">
            </div>

            <div className="flex items-center gap-6">
                <div className="relative">
                    <motion.div
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setShowNotifications(!showNotifications)}
                        className="relative cursor-pointer text-slate-500 hover:text-indigo-600 transition-colors"
                    >
                        <Bell size={20} />
                        {unreadCount > 0 && (
                            <span className="absolute -top-1 -right-1 flex items-center justify-center min-w-[14px] h-[14px] px-1 bg-red-500 text-[9px] font-bold text-white rounded-full border border-white">
                                {unreadCount > 9 ? '9+' : unreadCount}
                            </span>
                        )}
                    </motion.div>

                    <AnimatePresence>
                        {showNotifications && (
                            <motion.div
                                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                className="absolute right-0 mt-4 w-80 bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden z-50 transition-all font-inter"
                            >
                                <div className="px-5 py-4 border-b border-slate-100 bg-slate-50 flex items-center justify-between">
                                    <h3 className="font-bold text-slate-800 text-sm tracking-tight">System Alerts</h3>
                                    {unreadCount > 0 && (
                                        <span className="text-[10px] px-2 py-0.5 bg-indigo-100 text-indigo-600 rounded-full font-bold uppercase tracking-wider">{unreadCount} New</span>
                                    )}
                                </div>
                                <div className="max-h-96 overflow-y-auto">
                                    {notifications.length === 0 ? (
                                        <div className="p-8 text-center text-slate-400 text-sm">No notifications found</div>
                                    ) : (
                                        notifications.map(n => {
                                            const isTeamLead = user?.role === 'TEAM_LEAD';
                                            const isMyTeam = n.targetTeam?.toLowerCase() === user?.team?.toLowerCase();
                                            const isAdmin = user?.role === 'ADMIN';

                                            return (
                                                <div
                                                    key={n.id}
                                                    onClick={() => markAsRead(n.id, n.read)}
                                                    className={`p-4 border-b border-slate-50 hover:bg-slate-50 transition-all cursor-pointer relative ${!n.read ? 'bg-indigo-50/20' : ''}`}
                                                >
                                                    <div className="flex gap-4">
                                                        <div className={`w-9 h-9 rounded-xl ${getBgColor(n.type)} flex items-center justify-center flex-shrink-0 shadow-sm badge-success`}>
                                                            {getIcon(n.type)}
                                                        </div>
                                                        <div className="flex-1 min-w-0">
                                                            <div className="flex justify-between items-start mb-0.5">
                                                                <p className={`text-xs text-slate-800 truncate ${!n.read ? 'font-bold' : 'font-medium'}`}>{n.title}</p>
                                                                <span className="text-[9px] text-slate-400 font-medium">{timeAgo(n.timestamp)}</span>
                                                            </div>
                                                            <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">{n.message}</p>

                                                            {/* Context-Aware Quick Actions */}
                                                            <div className="flex items-center gap-2 mt-2">
                                                                {(isTeamLead && isMyTeam || isAdmin) && n.incidentStatus === 'PENDING' && (
                                                                    <button
                                                                        onClick={(e) => handleResolve(e, n.id)}
                                                                        className="flex items-center gap-1 text-[9px] font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-md border border-emerald-200 hover:bg-emerald-100 transition-colors"
                                                                    >
                                                                        <Check size={10} strokeWidth={4} /> Resolve
                                                                    </button>
                                                                )}
                                                                {n.incidentStatus === 'AWAITING_ACK' && (
                                                                    <button
                                                                        onClick={(e) => handleAcknowledge(e, n.id)}
                                                                        className="flex items-center gap-1 text-[9px] font-bold text-indigo-600 bg-indigo-50 px-2 py-1 rounded-md border border-indigo-200 hover:bg-indigo-100 transition-colors"
                                                                    >
                                                                        <Undo2 size={10} strokeWidth={4} /> Resolve Alert
                                                                    </button>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            );
                                        })
                                    )}
                                </div>
                                <div className="px-4 py-3 border-t border-slate-100 bg-slate-50 text-center">
                                    <button
                                        onClick={() => { setShowNotifications(false); navigate('/notifications'); }}
                                        className="text-xs text-indigo-600 font-bold hover:text-indigo-700 transition-colors uppercase tracking-widest"
                                    >
                                        View Dashboard Alerts
                                    </button>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                <div className="flex items-center gap-3 cursor-pointer pl-6 border-l border-slate-200">
                    <div className="text-right hidden sm:block">
                        <p className="text-sm font-semibold text-slate-800 leading-tight font-poppins">{user?.name || 'Guest User'}</p>
                        <div className="flex items-center gap-1.5 justify-end">
                            {user?.team && user.team !== 'None' && (
                                <span className="text-[10px] px-1.5 py-0.5 bg-indigo-50 text-indigo-600 border border-indigo-100/50 rounded-md font-bold uppercase tracking-wider">
                                    {user.team}
                                </span>
                            )}
                            <p className="text-xs text-slate-500 font-inter capitalize">{user?.role || 'Visitor'}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
