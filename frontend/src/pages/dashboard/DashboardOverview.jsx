import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import {
    Box, GitBranch, AlertTriangle, Clock,
    ArrowUpRight, ArrowDownRight, Activity, Users, ShieldAlert
} from 'lucide-react';
import {
    LineChart, Line, AreaChart, Area, XAxis, YAxis,
    CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar
} from 'recharts';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../components/Toast';

export default function DashboardOverview() {
    const { user } = useAuth();
    const toast = useToast();
    const [analyticsData, setAnalyticsData] = useState([]);
    const [growthData, setGrowthData] = useState([]);
    const [riskData, setRiskData] = useState([]);
    const [isScanning, setIsScanning] = useState(false);
    const [scanPhase, setScanPhase] = useState("");

    /**
     * REFRESH DASHBOARD (Read Only)
     * Fetches existing state from the database without triggering new pings.
     */
    const refreshDashboard = useCallback(async (silent = false) => {
        const token = localStorage.getItem('archtrace_token');
        if (!token) return;

        try {
            const [srvRes, depRes, teamRes, auditRes] = await Promise.all([
                fetch('http://localhost:8080/api/services', { headers: { 'Authorization': `Bearer ${token}` } }),
                fetch('http://localhost:8080/api/dependencies', { headers: { 'Authorization': `Bearer ${token}` } }),
                fetch('http://localhost:8080/api/teams', { headers: { 'Authorization': `Bearer ${token}` } }),
                fetch('http://localhost:8080/api/audit', { headers: { 'Authorization': `Bearer ${token}` } })
            ]);

            const [storedServices, storedDeps, teams, auditLogs] = await Promise.all([
                srvRes.json(), depRes.json(), teamRes.json(), auditRes.json()
            ]);

            const role = user?.role?.toUpperCase();

            // Growth Data
            const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
            const mockGrowth = days.map((day, i) => ({
                name: day,
                services: Math.max(2, Math.floor(storedServices.length * (0.7 + (i * 0.05)))),
                dependencies: Math.max(1, Math.floor(storedDeps.length * (0.6 + (i * 0.08))))
            }));
            setGrowthData(mockGrowth);

            const criticalCount = storedServices.filter(s => s.status === 'Critical').length;
            const warningCount = storedServices.filter(s => s.status === 'Warning').length;
            const healthyCount = storedServices.filter(s => s.status === 'Healthy').length;
            const teamServicesCount = storedServices.filter(s => s.team === user?.team).length;

            const avgRisk = storedServices.length > 0
                ? Math.floor(((criticalCount * 90) + (warningCount * 50) + (healthyCount * 10)) / storedServices.length)
                : 0;

            let cards = [
                { title: "Team Services", value: teamServicesCount.toString(), change: "+1", trend: "up", icon: Box, color: "text-indigo-600", bg: "bg-indigo-100/50" },
                { title: "Impact Score", value: `${avgRisk}%`, change: "-2%", trend: "down", icon: ShieldAlert, color: "text-rose-600", bg: "bg-rose-100/50" },
                { title: "Recent Changes", value: auditLogs.length.toString(), change: `+${auditLogs.filter(l => (new Date() - new Date(l.timestamp)) < 86400000).length}`, trend: "up", icon: Clock, color: "text-emerald-600", bg: "bg-emerald-100/50" },
                { title: "Dependencies", value: storedDeps.length.toString(), change: "+3", trend: "up", icon: GitBranch, color: "text-cyan-600", bg: "bg-cyan-100/50" }
            ];

            if (role === 'ADMIN') {
                cards = [
                    { title: "Total Users", value: "8", change: "+1", trend: "up", icon: Users, color: "text-blue-600", bg: "bg-blue-100/50" },
                    { title: "Total Teams", value: teams.length.toString(), change: "0", trend: "up", icon: Users, color: "text-purple-600", bg: "bg-purple-100/50" },
                    { title: "Total Services", value: storedServices.length.toString(), change: "+2", trend: "up", icon: Box, color: "text-indigo-600", bg: "bg-indigo-100/50" },
                    { title: "Critical Issues", value: (criticalCount + warningCount).toString(), change: "-1", trend: "down", icon: AlertTriangle, color: "text-amber-600", bg: "bg-amber-100/50" }
                ];
            }

            setAnalyticsData(cards);
            setRiskData([
                { name: 'Healthy', count: healthyCount, fill: '#10B981' },
                { name: 'Warning', count: warningCount, fill: '#F59E0B' },
                { name: 'Critical', count: criticalCount, fill: '#EF4444' },
            ]);
        } catch (err) {
            console.error(err);
        }
    }, [user]);

    /**
     * TRIGGER LIVE SCAN (Write Access)
     * Actively pings endpoints and notifies teams.
     */
    const handleTriggerScan = async () => {
        setIsScanning(true);
        setScanPhase("Probing Nodes...");
        const token = localStorage.getItem('archtrace_token');

        try {
            // First delay for realism (Deep Probe phase)
            await new Promise(r => setTimeout(r, 1200));
            setScanPhase("Analyzing Response...");

            const res = await fetch('http://localhost:8080/api/services/scan-health', {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${token}` }
            });

            // Second delay for result processing (Analysis phase)
            await new Promise(r => setTimeout(r, 1300));
            setScanPhase("Updating Dashboard...");

            if (res.ok) {
                await refreshDashboard();
                if (toast) toast("Deep infrastructure scan complete!", "success");
            } else {
                if (toast) toast("Failed to trigger scan.", "error");
            }
        } catch (err) {
            console.error(err);
            if (toast) toast("Network error during scan.", "error");
        } finally {
            setIsScanning(false);
            setScanPhase("");
        }
    };

    useEffect(() => {
        refreshDashboard();
        const interval = setInterval(() => refreshDashboard(true), 60000);
        return () => clearInterval(interval);
    }, [refreshDashboard]);

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-2xl font-bold font-poppins text-slate-800 tracking-tight">System Overview</h1>
                    <p className="text-slate-500 text-sm mt-1">Real-time metrics and architectural health.</p>
                </div>
                <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleTriggerScan}
                    disabled={isScanning}
                    className={`px-6 py-2.5 rounded-lg flex items-center gap-2 font-medium shadow-sm transition-all ${isScanning ? 'bg-slate-100 text-slate-400 cursor-wait' : 'btn-primary'
                        }`}
                >
                    <Activity size={16} className={isScanning ? 'animate-spin' : ''} />
                    {isScanning ? scanPhase : 'Sync Live Health'}
                </motion.button>
            </div>

            {/* Analytics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {analyticsData.map((stat, index) => {
                    const Icon = stat.icon;
                    return (
                        <motion.div
                            key={stat.title}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                            className="bg-white rounded-2xl p-7 border border-slate-200 shadow-[0px_4px_24px_rgba(110,120,255,0.03)] hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300"
                        >
                            <div className="flex justify-between items-start mb-6">
                                <div className={`p-3.5 rounded-xl ${stat.bg} shadow-sm`}>
                                    <Icon size={24} className={stat.color} />
                                </div>
                                <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold ${stat.trend === 'up' ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'
                                    }`}>
                                    {stat.trend === 'up' ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                                    {stat.change}
                                </div>
                            </div>
                            <div>
                                <h3 className="text-slate-500 text-xs font-bold uppercase tracking-widest mb-1">{stat.title}</h3>
                                <div className="text-3xl font-bold font-poppins text-slate-800 tracking-tight leading-none">{stat.value}</div>
                            </div>
                        </motion.div>
                    );
                })}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Growth Chart */}
                <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 p-8 shadow-sm">
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h3 className="text-lg font-bold text-slate-800">Operational Growth</h3>
                            <p className="text-slate-400 text-xs">Service & Dependency expansion trend</p>
                        </div>
                        <div className="flex gap-4">
                            <div className="flex items-center gap-2">
                                <span className="w-3 h-3 rounded-full bg-indigo-500"></span>
                                <span className="text-xs text-slate-500 font-medium font-poppins uppercase tracking-wider">Services</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="w-3 h-3 rounded-full bg-indigo-200"></span>
                                <span className="text-xs text-slate-500 font-medium font-poppins uppercase tracking-wider">Deps</span>
                            </div>
                        </div>
                    </div>
                    <div className="h-[320px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={growthData}>
                                <defs>
                                    <linearGradient id="colorServ" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#6366f1" stopOpacity={0.15} />
                                        <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                <XAxis
                                    dataKey="name"
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fill: '#94a3b8', fontSize: 11, fontWeight: 600 }}
                                    dy={15}
                                />
                                <YAxis
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fill: '#94a3b8', fontSize: 11, fontWeight: 600 }}
                                />
                                <Tooltip
                                    contentStyle={{
                                        backgroundColor: '#fff',
                                        borderRadius: '12px',
                                        border: 'none',
                                        boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)'
                                    }}
                                />
                                <Area
                                    type="monotone"
                                    dataKey="services"
                                    stroke="#6366f1"
                                    strokeWidth={4}
                                    fillOpacity={1}
                                    fill="url(#colorServ)"
                                />
                                <Area
                                    type="monotone"
                                    dataKey="dependencies"
                                    stroke="#e2e8f0"
                                    strokeWidth={3}
                                    fill="transparent"
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Risk Distribution */}
                <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-sm">
                    <div className="mb-8">
                        <h3 className="text-lg font-bold text-slate-800">Health Breakdown</h3>
                        <p className="text-slate-400 text-xs">Service status distribution</p>
                    </div>
                    <div className="h-[320px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={riskData} layout="vertical" margin={{ left: -20, right: 20 }}>
                                <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#f1f5f9" />
                                <XAxis type="number" hide />
                                <YAxis
                                    dataKey="name"
                                    type="category"
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fill: '#64748b', fontSize: 12, fontWeight: 600 }}
                                />
                                <Tooltip
                                    cursor={{ fill: '#f8fafc' }}
                                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
                                />
                                <Bar dataKey="count" radius={[0, 6, 6, 0]} barSize={32} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                    <div className="mt-6 pt-6 border-t border-slate-100 grid grid-cols-1 gap-3">
                        {riskData.map(item => (
                            <div key={item.name} className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.fill }}></div>
                                    <span className="text-xs font-semibold text-slate-600">{item.name}</span>
                                </div>
                                <span className="text-xs font-bold font-poppins text-slate-800">{item.count}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
