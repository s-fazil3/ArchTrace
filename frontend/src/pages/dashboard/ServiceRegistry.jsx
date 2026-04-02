import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Search, Filter, MoreVertical, Edit2, Trash2, RotateCw, Play } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useToast } from '../../components/Toast';

export default function ServiceRegistry() {
    const { user } = useAuth();
    const navigate = useNavigate();
    const toast = useToast();
    const isDeveloper = user?.role === 'DEVELOPER';
    const [services, setServices] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [editingService, setEditingService] = useState(null);
    const [openDropdownId, setOpenDropdownId] = useState(null);
    const [statusFilter, setStatusFilter] = useState('All');
    const [techFilter, setTechFilter] = useState('All');

    // Sync local search with global search from TopNav
    const [searchParams, setSearchParams] = useSearchParams();
    const globalSearch = searchParams.get('search') || '';
    const [searchTerm, setSearchTerm] = useState(globalSearch);

    // Keep them in sync when URL changes
    useEffect(() => {
        setSearchTerm(globalSearch);
    }, [globalSearch]);

    const handleLocalSearch = (val) => {
        setSearchTerm(val);
        if (val) setSearchParams({ search: val });
        else setSearchParams({});
    };

    const [newService, setNewService] = useState({ name: '', team: '', tech: '', endpoint: '', version: '' });

    useEffect(() => {
        const role = user?.role?.toUpperCase();
        if (role === 'TEAM_LEAD') {
            setNewService(prev => ({ ...prev, team: user.team }));
        }
    }, [user, isModalOpen]);

    const [teams, setTeams] = useState([]);
    useEffect(() => {
        fetchServices();
        fetchTeams();

        const poll = setInterval(fetchServices, 30000); // Poll every 30 seconds
        return () => clearInterval(poll);
    }, []);

    const fetchTeams = async () => {
        const token = localStorage.getItem('archtrace_token');
        if (!token) return;
        try {
            const res = await fetch('http://localhost:8080/api/teams', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (res.ok) setTeams(await res.json());
            else console.error(`Failed to fetch teams: ${res.status}`);
        } catch (err) {
            console.error("Error fetching teams for registry:", err);
        }
    };

    const fetchServices = async () => {
        const token = localStorage.getItem('archtrace_token');
        if (!token) return;
        try {
            const response = await fetch('http://localhost:8080/api/services', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (response.ok) {
                const data = await response.json();
                setServices(data);
            } else {
                console.error(`Failed to fetch services: ${response.status}`);
            }
        } catch (error) {
            console.error("Error fetching services:", error);
        }
    };

    const handleSaveService = async () => {
        if (!newService.name) return;

        // Ensure team lead's team is used correctly
        const role = user?.role?.toUpperCase();
        const serviceData = {
            ...newService,
            team: (role === 'TEAM_LEAD') ? user.team : newService.team
        };

        try {
            const token = localStorage.getItem('archtrace_token');
            const response = await fetch('http://localhost:8080/api/services', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(serviceData)
            });

            if (response.ok) {
                fetchServices(); // Refresh list
                setIsModalOpen(false);
                setNewService({ name: '', team: '', tech: '', endpoint: '', version: '' });
            }
        } catch (error) {
            console.error("Error saving service:", error);
        }
    };

    const handleDelete = async (id) => {
        try {
            const token = localStorage.getItem('archtrace_token');
            const response = await fetch(`http://localhost:8080/api/services/${id}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (response.ok) {
                fetchServices();
            }
        } catch (error) {
            console.error("Error deleting service:", error);
        }
    };
    const handleEdit = (service) => {
        setEditingService({ ...service });
        setIsEditModalOpen(true);
        setOpenDropdownId(null);
    };

    const handleUpdateService = async () => {
        if (!editingService?.name) return;
        try {
            const token = localStorage.getItem('archtrace_token');
            const response = await fetch(`http://localhost:8080/api/services/${editingService.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(editingService)
            });
            if (response.ok) {
                fetchServices();
                setIsEditModalOpen(false);
                setEditingService(null);
            }
        } catch (error) {
            console.error("Error updating service:", error);
        }
    };

    const handleRefreshHealth = async () => {
        const token = localStorage.getItem('archtrace_token');
        if (!token) return;
        try {
            await fetch('http://localhost:8080/api/services/scan-health', {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            fetchServices();
            toast("Health simulation triggered!", "success");
        } catch (err) {
            console.error(err);
        }
    };

    const toggleDropdown = (id, e) => {
        e.stopPropagation();
        setOpenDropdownId(openDropdownId === id ? null : id);
    };

    useEffect(() => {
        const handleClickOutside = () => setOpenDropdownId(null);
        if (openDropdownId !== null) {
            document.addEventListener('click', handleClickOutside);
            return () => document.removeEventListener('click', handleClickOutside);
        }
    }, [openDropdownId]);

    const filteredServices = services.filter(srv => {
        const matchesSearch = (srv.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
            (srv.team || '').toLowerCase().includes(searchTerm.toLowerCase());
        const matchesGlobalSearch = (srv.name || '').toLowerCase().includes(globalSearch.toLowerCase()) ||
            (srv.team || '').toLowerCase().includes(globalSearch.toLowerCase()) ||
            (srv.tech || '').toLowerCase().includes(globalSearch.toLowerCase());
        const matchesStatus = statusFilter === 'All' || (srv.status || 'Healthy').toLowerCase() === statusFilter.toLowerCase();
        const matchesTech = techFilter === 'All' || (srv.tech || '').toLowerCase().includes(techFilter.toLowerCase());
        return matchesSearch && matchesGlobalSearch && matchesStatus && matchesTech;
    });

    const uniqueTechs = [...new Set(services.map(s => s.tech).filter(Boolean))];

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-2">
                <div>
                    <h1 className="text-2xl font-bold font-poppins text-slate-800 tracking-tight">Service Registry</h1>
                    <p className="text-slate-500 text-sm mt-1">Manage and monitor all deployed microservices.</p>
                </div>
                {!isDeveloper && (
                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => setIsModalOpen(true)}
                        className="btn-primary px-5 py-2.5 rounded-lg flex items-center justify-center gap-2 font-medium shadow-sm transition-all whitespace-nowrap"
                    >
                        <Plus size={18} /> Add Service
                    </motion.button>
                )}
            </div>

            {/* Controls Bar */}
            <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 flex flex-col sm:flex-row gap-4 justify-between items-center">
                <div className="relative w-full sm:max-w-md">
                    <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                        type="text"
                        placeholder="Search services by name or team..."
                        value={searchTerm}
                        onChange={(e) => handleLocalSearch(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all font-inter"
                    />
                </div>
                <div className="flex items-center gap-3 w-full sm:w-auto">
                    <button
                        onClick={handleRefreshHealth}
                        className="flex items-center gap-2 text-slate-600 font-medium text-sm px-4 py-2 border border-slate-200 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors whitespace-nowrap"
                    >
                        <motion.div animate={{ rotate: 360 }} transition={{ duration: 2, repeat: Infinity, ease: "linear", paused: true }} whileTap={{ rotate: 90 }}>
                            <RotateCw size={16} />
                        </motion.div>
                        Trigger Probes
                    </button>
                    <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="flex items-center gap-2 text-slate-600 font-medium text-sm px-4 py-2 border border-slate-200 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors whitespace-nowrap focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                    >
                        <option value="All">All Status</option>
                        <option value="Healthy">Healthy Only</option>
                        <option value="Warning">Warning Only</option>
                        <option value="Critical">Critical Only</option>
                    </select>
                    <select
                        value={techFilter}
                        onChange={(e) => setTechFilter(e.target.value)}
                        className="flex items-center gap-2 text-slate-600 font-medium text-sm px-4 py-2 border border-slate-200 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors whitespace-nowrap focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                    >
                        <option value="All">All Tech</option>
                        {[...uniqueTechs].sort().map(t => <option key={t} value={t}>{t}</option>)}
                    </select>
                </div>
            </div>

            {/* Table */}
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden"
            >
                <div>
                    <table className="w-full text-left border-collapse table-fixed">
                        <colgroup>
                            <col style={{ width: '20%' }} />
                            <col style={{ width: '14%' }} />
                            <col style={{ width: '10%' }} />
                            <col style={{ width: '12%' }} />
                            <col style={{ width: '22%' }} />
                            <col style={{ width: '9%' }} />
                            <col style={{ width: '8%' }} />
                            {!isDeveloper && <col style={{ width: '10%' }} />}
                        </colgroup>
                        <thead>
                            <tr className="bg-slate-50 border-b border-slate-200">
                                <th className="px-3 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Service Name</th>
                                <th className="px-3 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Team</th>
                                <th className="px-3 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Status</th>
                                <th className="px-3 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Tech</th>
                                <th className="px-3 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">API Endpoint</th>
                                <th className="px-3 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Version</th>
                                <th className="px-3 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Deps</th>
                                {!isDeveloper && <th className="px-3 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider text-right">Actions</th>}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {filteredServices.map((service, index) => (
                                <motion.tr
                                    key={service.id}
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: index * 0.05 }}
                                    className="hover:bg-slate-50/80 transition-colors group cursor-pointer"
                                >
                                    <td className="px-3 py-3">
                                        <div className="flex flex-col">
                                            <span className="font-semibold text-slate-800 text-xs truncate" title={service.name}>{service.name}</span>
                                            <span className="text-[10px] text-slate-400 font-mono mt-0.5">SRV-{String(service.id).padStart(3, '0')}</span>
                                        </div>
                                    </td>
                                    <td className="px-3 py-3 text-xs text-slate-600 truncate" title={service.team}>{service.team}</td>
                                    <td className="px-3 py-3">
                                        <div className="flex items-center gap-1.5">
                                            <span className={`w-2 h-2 rounded-full flex-shrink-0 ${service.status === 'Critical' ? 'bg-rose-500' : service.status === 'Warning' ? 'bg-amber-500' : 'bg-emerald-500'}`} />
                                            <span className="text-xs font-medium text-slate-600 capitalize">{service.status || 'Healthy'}</span>
                                        </div>
                                    </td>
                                    <td className="px-3 py-3">
                                        <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-medium bg-slate-100 text-slate-600 border border-slate-200 truncate max-w-full" title={service.tech}>
                                            {service.tech}
                                        </span>
                                    </td>
                                    <td className="px-3 py-3 text-xs font-mono text-slate-500 truncate" title={service.endpoint}>{service.endpoint}</td>
                                    <td className="px-3 py-3 text-xs font-mono text-slate-500">{service.version}</td>
                                    <td className="px-3 py-3 text-xs text-slate-600 font-medium">{service.dependenciesCount || 0}</td>
                                    <td className="px-3 py-3 text-right text-sm">
                                        {(() => {
                                            const role = user?.role?.toUpperCase();
                                            const isOwner = role === 'ADMIN' || service.team === user?.team;
                                            if (isOwner && !isDeveloper) {
                                                return (
                                                    <div className="flex items-center justify-end gap-1 transition-opacity">
                                                        <button
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                navigate(`/dashboard/impact?service=${service.name}`);
                                                            }}
                                                            className="p-1.5 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-md transition-colors"
                                                            title="Analyze Impact"
                                                        >
                                                            <Play size={15} fill="currentColor" />
                                                        </button>
                                                        <button onClick={() => handleEdit(service)} className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-md transition-colors"><Edit2 size={16} /></button>
                                                        <button onClick={() => handleDelete(service.id)} className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors"><Trash2 size={16} /></button>
                                                    </div>
                                                );
                                            }
                                            return (
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        navigate(`/dashboard/impact?service=${service.name}`);
                                                    }}
                                                    className="p-1.5 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-md transition-colors"
                                                    title="Analyze Impact"
                                                >
                                                    <Play size={15} fill="currentColor" />
                                                </button>
                                            );
                                        })()}
                                    </td>
                                </motion.tr>
                            ))}
                            {filteredServices.length === 0 && (
                                <tr>
                                    <td colSpan={isDeveloper ? 6 : 7} className="px-6 py-8 text-center text-slate-500 text-sm">
                                        No services found matching {searchTerm}
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </motion.div>

            {/* Add Service Modal */}
            <AnimatePresence>
                {isModalOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
                            onClick={() => setIsModalOpen(false)}
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            className="relative w-full max-w-lg bg-white rounded-2xl shadow-xl overflow-hidden border border-slate-100"
                        >
                            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                                <h3 className="text-lg font-bold font-poppins text-slate-800">Add New Service</h3>
                            </div>

                            <div className="p-6 space-y-4">
                                <div>
                                    <label className="block text-sm font-semibold text-slate-700 mb-1">Service Name</label>
                                    <input type="text" className="input-field" placeholder="e.g. Payment Service" value={newService.name} onChange={e => setNewService({ ...newService, name: e.target.value })} />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-slate-700 mb-1">Owning Team</label>
                                    {(user?.role === 'TEAM_LEAD' || user?.role === 'Team Lead') ? (
                                        <input
                                            type="text"
                                            className="input-field bg-slate-50 cursor-not-allowed text-slate-600 font-medium"
                                            value={user.team || ''}
                                            readOnly
                                        />
                                    ) : (
                                        <select
                                            className="input-field"
                                            value={newService.team}
                                            onChange={e => setNewService({ ...newService, team: e.target.value })}
                                        >
                                            <option value="">Select a team...</option>
                                            {teams.map(t => <option key={t.name} value={t.name}>{t.name}</option>)}
                                        </select>
                                    )}
                                    {(user?.role === 'TEAM_LEAD' || user?.role === 'Team Lead') && (
                                        <p className="text-[10px] text-slate-500 mt-1.5 font-medium flex items-center gap-1">
                                            <span className="w-1 h-1 rounded-full bg-indigo-400"></span>
                                            Team Leads can only register services for their assigned team.
                                        </p>
                                    )}
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-slate-700 mb-1">API Endpoint</label>
                                    <input type="text" className="input-field font-mono" placeholder="/payment/process" value={newService.endpoint} onChange={e => setNewService({ ...newService, endpoint: e.target.value })} />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-semibold text-slate-700 mb-1">Primary Tech</label>
                                        <input type="text" className="input-field" placeholder="e.g. Spring Boot, Node.js" value={newService.tech} onChange={e => setNewService({ ...newService, tech: e.target.value })} />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold text-slate-700 mb-1">Version</label>
                                        <input type="text" className="input-field" placeholder="v1.0.0" value={newService.version} onChange={e => setNewService({ ...newService, version: e.target.value })} />
                                    </div>
                                </div>
                            </div>

                            <div className="px-6 py-4 border-t border-slate-100 bg-slate-50 flex justify-end gap-3">
                                <button
                                    onClick={() => setIsModalOpen(false)}
                                    className="px-4 py-2 font-medium text-sm text-slate-600 hover:bg-slate-200 rounded-lg transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleSaveService}
                                    className="btn-primary px-5 py-2 rounded-lg text-sm"
                                >
                                    Save Service
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
            {/* Edit Service Modal */}
            <AnimatePresence>
                {isEditModalOpen && editingService && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
                            onClick={() => setIsEditModalOpen(false)}
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            className="relative w-full max-w-lg bg-white rounded-2xl shadow-xl overflow-hidden border border-slate-100"
                        >
                            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                                <h3 className="text-lg font-bold font-poppins text-slate-800">Edit Service</h3>
                            </div>

                            <div className="p-6 space-y-4">
                                <div>
                                    <label className="block text-sm font-semibold text-slate-700 mb-1">Service Name</label>
                                    <input type="text" className="input-field" placeholder="e.g. Payment Service" value={editingService.name} onChange={e => setEditingService({ ...editingService, name: e.target.value })} />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-slate-700 mb-1">Owning Team</label>
                                    {(user?.role === 'TEAM_LEAD' || user?.role === 'Team Lead') ? (
                                        <input
                                            type="text"
                                            className="input-field bg-slate-50 cursor-not-allowed text-slate-600 font-medium"
                                            value={editingService.team || ''}
                                            readOnly
                                        />
                                    ) : (
                                        <select
                                            className="input-field"
                                            value={editingService.team || ''}
                                            onChange={e => setEditingService({ ...editingService, team: e.target.value })}
                                        >
                                            <option value="">Select a team...</option>
                                            {teams.map(t => <option key={t.name} value={t.name}>{t.name}</option>)}
                                        </select>
                                    )}
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-slate-700 mb-1">API Endpoint</label>
                                    <input type="text" className="input-field font-mono" placeholder="/payment/process" value={editingService.endpoint || ''} onChange={e => setEditingService({ ...editingService, endpoint: e.target.value })} />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-slate-700 mb-1">Health Status</label>
                                    <div className="flex items-center gap-3">
                                        <select
                                            className="input-field flex-1"
                                            value={editingService.status || 'Healthy'}
                                            onChange={e => setEditingService({ ...editingService, status: e.target.value })}
                                        >
                                            <option value="Healthy">Healthy</option>
                                            <option value="Warning">Warning</option>
                                            <option value="Critical">Critical</option>
                                        </select>
                                        <div className={`w-3 h-3 rounded-full ${editingService.status === 'Critical' ? 'bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.4)]' :
                                            editingService.status === 'Warning' ? 'bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.4)]' :
                                                'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.4)]'
                                            }`} />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-slate-700 mb-1">
                                        Health Check URL <span className="text-[10px] font-normal text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded ml-1">optional</span>
                                    </label>
                                    <input
                                        type="url"
                                        className="input-field font-mono text-xs"
                                        placeholder="http://localhost:3001/health"
                                        value={editingService.healthCheckUrl || ''}
                                        onChange={e => setEditingService({ ...editingService, healthCheckUrl: e.target.value })}
                                    />
                                    <p className="text-[10px] text-slate-400 mt-1.5 leading-relaxed">
                                        ArchTrace will ping this URL when "Run Full Scan" is clicked and determine health from the HTTP response code and latency — like Kubernetes probes.
                                    </p>
                                    {editingService.healthCheckUrl && (
                                        <div className="mt-1 flex items-center gap-1.5 text-[10px] text-emerald-600 font-semibold">
                                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                                            Real health pinging enabled
                                        </div>
                                    )}
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-semibold text-slate-700 mb-1">Primary Tech</label>
                                        <input type="text" className="input-field" placeholder="e.g. Spring Boot, Node.js" value={editingService.tech || ''} onChange={e => setEditingService({ ...editingService, tech: e.target.value })} />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold text-slate-700 mb-1">Version</label>
                                        <input type="text" className="input-field" placeholder="v1.0.0" value={editingService.version || ''} onChange={e => setEditingService({ ...editingService, version: e.target.value })} />
                                    </div>
                                </div>
                            </div>

                            <div className="px-6 py-4 border-t border-slate-100 bg-slate-50 flex justify-end gap-3">
                                <button
                                    onClick={() => setIsEditModalOpen(false)}
                                    className="px-4 py-2 font-medium text-sm text-slate-600 hover:bg-slate-200 rounded-lg transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleUpdateService}
                                    className="btn-primary px-5 py-2 rounded-lg text-sm"
                                >
                                    Save Changes
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}
