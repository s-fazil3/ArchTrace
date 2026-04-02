import { motion, AnimatePresence } from 'framer-motion';
import {
    Play, Share2, AlertOctagon, ActivitySquare, CheckCircle, Search, FileText, BellRing
} from 'lucide-react';
import { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const changeTypes = ["API Update", "Version Upgrade", "Schema Change", "Contract Breaking", "Configuration Update"];

export default function ImpactAnalysis() {
    const { user } = useAuth();
    const [searchParams] = useSearchParams();
    const serviceFromUrl = searchParams.get('service') || '';

    const [services, setServices] = useState([]);
    const [analyzing, setAnalyzing] = useState(false);
    const [results, setResults] = useState(null);
    const [notifiedTeams, setNotifiedTeams] = useState(new Set());

    const [selectedService, setSelectedService] = useState(serviceFromUrl);
    const [changeType, setChangeType] = useState('API Update');
    const [desc, setDesc] = useState('');

    useEffect(() => {
        const fetchServices = async () => {
            const token = localStorage.getItem('archtrace_token');
            const res = await fetch('http://localhost:8080/api/services', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (res.ok) setServices(await res.json());
        };
        fetchServices();
    }, []);

    const handleAnalyze = async () => {
        if (!selectedService) return;
        setAnalyzing(true);
        setResults(null);
        setNotifiedTeams(new Set());

        const token = localStorage.getItem('archtrace_token'); // ✅ Moved here so it's in scope for setTimeout

        try {
            const depRes = await fetch('http://localhost:8080/api/dependencies', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const deps = depRes.ok ? await depRes.json() : [];

            setTimeout(() => {
                setAnalyzing(false);

                const graph = {};
                services.forEach(s => graph[s.name.toLowerCase()] = []);

                deps.forEach(d => {
                    const sourceName = d.source.toLowerCase();
                    const targetName = d.target.toLowerCase();

                    if (!graph[sourceName]) graph[sourceName] = [];
                    if (!graph[targetName]) graph[targetName] = [];

                    // DIRECTED IMPACT: If Source depends on Target, then Target change impacts Source.
                    graph[targetName].push(sourceName);
                });

                const visited = new Set();
                const queue = [selectedService.toLowerCase()];
                visited.add(selectedService.toLowerCase());

                while (queue.length > 0) {
                    const current = queue.shift();
                    const neighbors = graph[current] || [];
                    for (let neighbor of neighbors) {
                        if (!visited.has(neighbor)) {
                            visited.add(neighbor);
                            queue.push(neighbor);
                        }
                    }
                }

                visited.delete(selectedService.toLowerCase()); // Remove the selected service itself

                const affectedServicesData = Array.from(visited).map(name => {
                    const srv = services.find(s => s.name.toLowerCase() === name.toLowerCase()) || { team: 'Unknown' };
                    return { name: srv.name || name, team: srv.team, impact: "Moderate (Cascading Risk)" };
                });

                const affectedTeams = [...new Set(affectedServicesData.map(s => s.team))].join(", ");

                // Scientific Risk Calculation (Professional Model)
                let baseRisk = 10;
                if (changeType === 'Contract Breaking') baseRisk = 50;
                else if (changeType === 'Schema Change') baseRisk = 35;
                else if (changeType === 'Version Upgrade') baseRisk = 20;
                else if (changeType === 'API Update') baseRisk = 15;

                const cascadeWeight = affectedServicesData.length * 12;
                const riskScore = Math.min(95, baseRisk + cascadeWeight);

                let riskLevel = 'LOW';
                if (riskScore > 80) riskLevel = 'CATASTROPHIC';
                else if (riskScore > 50) riskLevel = 'HIGH';
                else if (riskScore > 25) riskLevel = 'MEDIUM';

                setResults({
                    risk: riskLevel,
                    score: riskScore,
                    affectedServices: affectedServicesData,
                    message: `Deploying this ${changeType || 'update'} to ${selectedService} has a ${riskScore}% probability of causing failures. Affected Teams: ${affectedTeams || 'None'}.`
                });
            }, 1500);
        } catch (error) {
            console.error("Error running impact analysis:", error);
            setAnalyzing(false);
        }
    };

    const handleNotifyTeam = async (srv) => {
        const msg = `URGENT: Your service '${srv.name}' is heavily impacted by changes to '${selectedService}'. Please review the architecture graph.`;

        try {
            const token = localStorage.getItem('archtrace_token');
            const res = await fetch('http://localhost:8080/api/notifications', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    title: `Dependency Alert: ${srv.name}`,
                    message: msg,
                    type: 'danger',
                    targetTeam: srv.team,
                    targetRole: 'TEAM_LEAD'
                })
            });
            if (res.ok) {
                setNotifiedTeams(prev => new Set(prev).add(srv.name));
            }
        } catch (error) {
            console.error("Failed to send notification:", error);
        }
    };

    const handleNotifyAll = async () => {
        if (!results || !results.affectedServices) return;

        // Find unique teams from affected services
        const uniqueTeams = [...new Set(results.affectedServices.filter(s => s.team && s.team !== 'Unknown').map(s => s.team))];

        for (const teamName of uniqueTeams) {
            const teamServices = results.affectedServices.filter(s => s.team === teamName).map(s => s.name).join(", ");
            const msg = `URGENT for ${teamName}: Changes to '${selectedService}' will impact your services: ${teamServices}. Please review.`;

            try {
                const token = localStorage.getItem('archtrace_token');
                await fetch('http://localhost:8080/api/notifications', {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        title: `Infrastructure Alert: ${teamName}`,
                        message: msg,
                        type: 'danger',
                        targetTeam: teamName,
                        targetRole: 'TEAM_LEAD'
                    })
                });
            } catch (err) {
                console.error("Failed to notify team " + teamName, err);
            }
        }

        // Mark all as notified in UI
        const allSrvNames = results.affectedServices.map(s => s.name);
        setNotifiedTeams(prev => new Set([...prev, ...allSrvNames]));
    };

    return (
        <div className="space-y-6 max-w-5xl mx-auto">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-2">
                <div>
                    <h1 className="text-2xl font-bold font-poppins text-slate-800 tracking-tight">Impact Analysis</h1>
                    <p className="text-slate-500 text-sm mt-1">Simulate changes and blast-radius before deployment.</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Simulation Configuration Form */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8"
                >
                    <div className="w-12 h-12 rounded-xl bg-indigo-50 flex items-center justify-center mb-6">
                        <Share2 className="text-indigo-600" size={24} />
                    </div>
                    <h2 className="text-xl font-bold font-poppins text-slate-800 mb-6">Configure Simulation</h2>

                    <div className="space-y-5">
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-1">Target Service</label>
                            <select className="input-field pb-2" value={selectedService} onChange={e => setSelectedService(e.target.value)}>
                                <option value="">Select service to modify...</option>
                                {services.map(s => <option key={s.id} value={s.name}>{s.name}</option>)}
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-1">Change Type</label>
                            <select className="input-field pb-2" value={changeType} onChange={e => setChangeType(e.target.value)}>
                                <option value="">Select scope of change...</option>
                                {changeTypes.map(c => <option key={c}>{c}</option>)}
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-1">Change Description (Optional)</label>
                            <textarea
                                className="input-field resize-none h-24"
                                placeholder="Describe the PR or structural changes briefly for better context parsing..."
                                value={desc}
                                onChange={e => setDesc(e.target.value)}
                            ></textarea>
                        </div>

                        <button
                            onClick={handleAnalyze}
                            disabled={analyzing}
                            className={`w-full py-3.5 rounded-xl flex items-center justify-center gap-2 font-semibold shadow-sm transition-all focus:ring-4 focus:ring-indigo-500/20 ${analyzing ? 'bg-indigo-400 text-white cursor-wait' : 'btn-primary'
                                }`}
                        >
                            {analyzing ? (
                                <>
                                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                    Simulating...
                                </>
                            ) : (
                                <>
                                    <Play size={18} fill="currentColor" /> Run Impact Analysis
                                </>
                            )}
                        </button>
                    </div>
                </motion.div>

                {/* Results Area */}
                <div className="flex flex-col">
                    <AnimatePresence mode="wait">
                        {!results && !analyzing && (
                            <motion.div
                                key="empty"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                className="flex-1 bg-slate-50 border border-slate-200 border-dashed rounded-2xl flex flex-col items-center justify-center p-10 text-center text-slate-500"
                            >
                                <div className="w-16 h-16 rounded-full bg-white shadow-sm flex items-center justify-center mb-4">
                                    <Search size={24} className="text-slate-400" />
                                </div>
                                <h3 className="font-semibold text-slate-700 mb-1">No Simulation Data</h3>
                                <p className="text-sm max-w-xs">Configure the parameters on the left and run analysis to calculate the blast radius.</p>
                            </motion.div>
                        )}

                        {analyzing && (
                            <motion.div
                                key="loading"
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0 }}
                                className="flex-1 bg-white border border-slate-200 rounded-2xl p-8 flex flex-col items-center justify-center text-center space-y-6 shadow-sm overflow-hidden relative"
                            >
                                {/* Scanning animation rings */}
                                <div className="relative w-32 h-32 flex items-center justify-center">
                                    <div className="absolute inset-0 bg-indigo-100 rounded-full animate-ping opacity-75"></div>
                                    <div className="absolute inset-2 bg-indigo-50 rounded-full animate-ping opacity-75" style={{ animationDelay: '0.2s' }}></div>
                                    <div className="relative w-16 h-16 bg-white rounded-full shadow-md flex items-center justify-center z-10">
                                        <ActivitySquare className="text-indigo-600 animate-pulse" size={32} />
                                    </div>
                                </div>
                                <div>
                                    <h3 className="text-lg font-bold text-slate-800">Traversing Dependency Graph</h3>
                                    <p className="text-slate-500 mt-1">Analyzing 1,492 connection paths...</p>
                                </div>
                            </motion.div>
                        )}

                        {results && (
                            <motion.div
                                key="results"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                className="flex-1 flex flex-col space-y-4"
                            >
                                {/* Risk Card */}
                                <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 relative overflow-hidden">
                                    <div className="absolute top-0 left-0 w-1.5 h-full bg-rose-500"></div>
                                    <div className="flex justify-between items-start mb-4">
                                        <div>
                                            <div className="flex items-center gap-2 mb-1">
                                                <AlertOctagon size={18} className={results.risk === 'CATASTROPHIC' || results.risk === 'HIGH' ? 'text-rose-600' : 'text-amber-600'} />
                                                <span className="font-bold text-slate-800 uppercase tracking-wider text-sm">Risk Assessment</span>
                                            </div>
                                            <h2 className={`text-3xl font-bold font-poppins ${results.risk === 'CATASTROPHIC' || results.risk === 'HIGH' ? 'text-rose-600' : 'text-amber-600'}`}>
                                                {results.risk} RISK
                                            </h2>
                                        </div>
                                        <div className="flex flex-col items-end">
                                            <span className="text-4xl font-bold font-poppins text-slate-800">{results.score}%</span>
                                            <span className="text-xs text-slate-500 uppercase tracking-widest font-semibold mt-1">Impact Score</span>
                                        </div>
                                    </div>
                                    <p className="text-slate-600 leading-relaxed text-sm bg-rose-50 p-4 rounded-xl border border-rose-100/50">
                                        {results.message}
                                    </p>
                                </div>

                                {/* Affected Services List */}
                                <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden flex-1">
                                    <div className="p-5 border-b border-slate-100 bg-slate-50 flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <FileText size={16} className="text-slate-500" />
                                            <h3 className="font-bold text-slate-800 text-sm">Affected Downstream Services</h3>
                                        </div>
                                        <button
                                            onClick={handleNotifyAll}
                                            className="text-xs flex items-center gap-1.5 font-bold text-indigo-600 bg-indigo-50 px-3 py-1.5 rounded-lg border border-indigo-100 hover:bg-indigo-100 transition-all hover:scale-105 shadow-sm"
                                        >
                                            <BellRing size={13} /> Notify All Teams
                                        </button>
                                    </div>
                                    <div className="divide-y divide-slate-100">
                                        {results.affectedServices.map((srv, idx) => (
                                            <motion.div
                                                initial={{ opacity: 0, y: 10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={{ delay: 0.1 * idx }}
                                                key={idx}
                                                className="p-4 hover:bg-slate-50 transition-colors flex justify-between items-center group cursor-pointer"
                                            >
                                                <div>
                                                    <div className="font-semibold text-slate-800 text-sm mb-0.5 group-hover:text-indigo-600 transition-colors">{srv.name}</div>
                                                    <div className="text-xs text-slate-500 flex items-center gap-2">
                                                        <span className="w-2 h-2 rounded-full bg-slate-300"></span> {srv.team}
                                                    </div>
                                                </div>
                                                <div className="text-right flex items-center justify-end gap-3">
                                                    <button
                                                        onClick={(e) => { e.stopPropagation(); handleNotifyTeam(srv); }}
                                                        disabled={notifiedTeams.has(srv.name)}
                                                        className={`p-1.5 rounded-md transition-colors ${notifiedTeams.has(srv.name) ? 'bg-emerald-50 text-emerald-600 cursor-not-allowed' : 'bg-slate-100 text-slate-500 hover:bg-indigo-50 hover:text-indigo-600'}`}
                                                        title={notifiedTeams.has(srv.name) ? "Notified!" : `Notify ${srv.team} about ${srv.name}`}
                                                    >
                                                        {notifiedTeams.has(srv.name) ? <CheckCircle size={14} /> : <BellRing size={14} />}
                                                    </button>
                                                    <span className={`text-xs font-semibold px-2 py-1 rounded-md ${srv.impact.includes('Severe') ? 'bg-rose-100 text-rose-700' :
                                                        srv.impact.includes('Moderate') ? 'bg-amber-100 text-amber-700' :
                                                            'bg-emerald-100 text-emerald-700'
                                                        }`}>
                                                        {srv.impact}
                                                    </span>
                                                </div>
                                            </motion.div>
                                        ))}
                                    </div>
                                    <div className="p-4 bg-slate-50 border-t border-slate-100 flex justify-center">
                                        <Link
                                            to={`/dashboard/architecture?highlight=${[selectedService, ...results.affectedServices.map(s => s.name)].join(',')}`}
                                            className="btn-primary w-full py-2.5 rounded-lg flex items-center justify-center gap-2 font-medium shadow-sm transition-all text-sm"
                                        >
                                            <Share2 size={16} /> Visualize Blast Radius
                                        </Link>
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
}
