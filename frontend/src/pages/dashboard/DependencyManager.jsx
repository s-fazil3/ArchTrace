import { motion } from 'framer-motion';
import { Plus, ArrowRight, GitBranch, ArrowDown, Trash2 } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';

export default function DependencyManager() {
    const { user } = useAuth();
    const [services, setServices] = useState([]);
    const [dependencies, setDependencies] = useState([]);
    const [newDep, setNewDep] = useState({ source: '', target: '', type: 'sync-rest', risk: 'Medium' });

    useEffect(() => {
        fetchServices();
        fetchDependencies();
    }, []);

    const fetchServices = async () => {
        try {
            const token = localStorage.getItem('archtrace_token');
            const response = await fetch('http://localhost:8080/api/services', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (response.ok) {
                const data = await response.json();
                setServices(data);
            }
        } catch (error) {
            console.error("Error fetching services:", error);
        }
    };

    const fetchDependencies = async () => {
        try {
            const token = localStorage.getItem('archtrace_token');
            if (!token) {
                console.warn("No auth token found, skipping dependencies fetch.");
                return;
            }
            const response = await fetch('http://localhost:8080/api/dependencies', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (response.ok) {
                const data = await response.json();
                setDependencies(data);
            }
        } catch (error) {
            console.error("Error fetching dependencies:", error);
        }
    };

    const handleAddDependency = async () => {
        if (!newDep.source || !newDep.target || newDep.source === newDep.target) return;

        try {
            const token = localStorage.getItem('archtrace_token');
            const response = await fetch('http://localhost:8080/api/dependencies', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(newDep)
            });
            if (response.ok) {
                fetchDependencies();
                setNewDep({ source: '', target: '', type: 'sync-rest', risk: 'Medium' });
            }
        } catch (error) {
            console.error("Error saving dependency:", error);
        }
    };

    const handleDelete = async (id) => {
        try {
            const token = localStorage.getItem('archtrace_token');
            const response = await fetch(`http://localhost:8080/api/dependencies/${id}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (response.ok) {
                fetchDependencies();
            }
        } catch (error) {
            console.error("Error deleting dependency:", error);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-2">
                <div>
                    <h1 className="text-2xl font-bold font-poppins text-slate-800 tracking-tight">Dependency Manager</h1>
                    <p className="text-slate-500 text-sm mt-1">Define and map data flows between microservices.</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Add Dependency Pane */}
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 self-start"
                >
                    <h3 className="text-lg font-bold font-poppins text-slate-800 mb-4 flex items-center gap-2">
                        <GitBranch size={18} className="text-indigo-600" />
                        Add New Link
                    </h3>

                    <div className="space-y-5">
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-1">Source Service</label>
                            <select className="input-field" value={newDep.source} onChange={e => setNewDep({ ...newDep, source: e.target.value })}>
                                <option value="">Select source...</option>
                                {services
                                    .filter(s => {
                                        const role = user?.role?.toUpperCase();
                                        return role === 'ADMIN' || s.team === user?.team;
                                    })
                                    .map(s => <option key={s.id} value={s.name}>{s.name}</option>)
                                }
                            </select>
                        </div>

                        <div className="flex justify-center -my-2 relative z-10 text-slate-400">
                            <div className="bg-slate-50 border border-slate-100 p-1.5 rounded-full shadow-sm">
                                <ArrowDown size={14} />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-1">Target Service</label>
                            <select className="input-field" value={newDep.target} onChange={e => setNewDep({ ...newDep, target: e.target.value })}>
                                <option value="">Select target...</option>
                                {services
                                    .filter(s => s.name !== newDep.source)
                                    .map(s => <option key={s.id} value={s.name}>{s.name}</option>)
                                }
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-1">Connection Type</label>
                            <select className="input-field" value={newDep.type} onChange={e => setNewDep({ ...newDep, type: e.target.value })}>
                                <option value="sync-rest">Synchronous (REST API)</option>
                                <option value="sync-grpc">Synchronous (gRPC)</option>
                                <option value="async-kafka">Asynchronous (Kafka)</option>
                                <option value="async-rmq">Asynchronous (RabbitMQ)</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-1">Risk / Criticality</label>
                            <select className="input-field" value={newDep.risk} onChange={e => setNewDep({ ...newDep, risk: e.target.value })}>
                                <option value="Low">Low Priority</option>
                                <option value="Medium">Medium Priority</option>
                                <option value="High">High Priority</option>
                            </select>
                        </div>

                        <button onClick={handleAddDependency} className="btn-primary w-full py-2.5 rounded-lg flex items-center justify-center gap-2 font-medium shadow-sm transition-all mt-4">
                            <Plus size={18} /> Configure Dependency
                        </button>
                    </div>
                </motion.div>

                {/* Dependency Table */}
                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 }}
                    className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden flex flex-col"
                >
                    <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                        <h3 className="text-lg font-bold font-poppins text-slate-800">Current Dependencies</h3>
                    </div>

                    <div className="overflow-x-auto custom-scrollbar flex-1">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-slate-50 border-b border-slate-200">
                                    <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Source</th>
                                    <th className="px-2 py-4"></th>
                                    <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Target</th>
                                    <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Type</th>
                                    <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Risk Level</th>
                                    <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {dependencies
                                    .filter(dep => {
                                        if (user?.role === 'ADMIN' || user?.role === 'Admin') return true;
                                        const sourceSrv = services.find(s => s.name === dep.source);
                                        const targetSrv = services.find(s => s.name === dep.target);
                                        return sourceSrv?.team === user?.team || targetSrv?.team === user?.team;
                                    })
                                    .map((dep, index) => {
                                        const role = user?.role?.toUpperCase();
                                        const isOwner = role === 'ADMIN' ||
                                            services.find(s => s.name === dep.source)?.team === user?.team;

                                        return (
                                            <motion.tr
                                                key={index}
                                                initial={{ opacity: 0 }}
                                                animate={{ opacity: 1 }}
                                                transition={{ delay: index * 0.05 }}
                                                className="hover:bg-slate-50/80 transition-colors group"
                                            >
                                                <td className="px-6 py-4 whitespace-nowrap font-medium text-slate-700 text-sm">
                                                    {dep.source}
                                                </td>
                                                <td className="px-2 py-4 text-center text-slate-300">
                                                    <ArrowRight size={16} />
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap font-medium text-slate-700 text-sm">
                                                    {dep.target}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium bg-indigo-50 text-indigo-700 border border-indigo-100">
                                                        {dep.type}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium border ${dep.risk === 'High' ? 'bg-rose-50 text-rose-700 border-rose-100' :
                                                        dep.risk === 'Medium' ? 'bg-amber-50 text-amber-700 border-amber-100' :
                                                            'bg-emerald-50 text-emerald-700 border-emerald-100'
                                                        }`}>
                                                        {dep.risk} Priority
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-right">
                                                    {isOwner && (
                                                        <button
                                                            onClick={() => handleDelete(dep.id)}
                                                            className="text-slate-400 hover:text-rose-600 p-1.5 rounded-lg hover:bg-rose-50 transition-all"
                                                            title="Remove Dependency"
                                                        >
                                                            <Trash2 size={16} />
                                                        </button>
                                                    )}
                                                </td>
                                            </motion.tr>
                                        );
                                    })}
                            </tbody>
                        </table>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
