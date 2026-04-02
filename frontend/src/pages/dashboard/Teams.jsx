import { motion } from 'framer-motion';
import { Users, Plus, UserPlus, Box, Trash2, Edit2 } from 'lucide-react';

import { useState, useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
import { useSearchParams } from 'react-router-dom';

export default function Teams() {
    const [searchParams] = useSearchParams();
    const globalSearch = searchParams.get('search') || '';
    const [teams, setTeams] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [newTeam, setNewTeam] = useState({ name: '', teamLead: '', color: 'indigo' });
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [editingTeam, setEditingTeam] = useState({ id: null, name: '', teamLead: '', color: 'indigo' });

    const [allUsers, setAllUsers] = useState([]);
    const [allServices, setAllServices] = useState([]);

    const assignedTeamLeads = new Set(
        teams
            .map(t => (t?.teamLead || '').trim())
            .filter(v => v.length > 0)
    );

    useEffect(() => {
        fetchTeams();

        const fetchData = async () => {
            const token = localStorage.getItem('archtrace_token');
            if (!token) return;

            try {
                // Fetch Services
                const srvRes = await fetch('http://localhost:8080/api/services', {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                if (srvRes.ok) {
                    setAllServices(await srvRes.json());
                }

                // Fetch Users (only Admins can do this, so it might fail for others)
                const userRes = await fetch('http://localhost:8080/users', {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                if (userRes.ok) {
                    setAllUsers(await userRes.json());
                }
            } catch (err) {
                console.error("Error fetching team stats:", err);
            }
        };

        fetchData();
    }, []);

    const fetchTeams = async () => {
        const token = localStorage.getItem('archtrace_token');
        if (!token) return;
        try {
            const res = await fetch('http://localhost:8080/api/teams', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (res.ok) {
                const data = await res.json();
                setTeams(data);
                localStorage.setItem('archtrace_teams', JSON.stringify(data)); // Keep for legacy/performance
            } else {
                console.error(`Failed to fetch teams: ${res.status}`);
            }
        } catch (err) {
            console.error("Error fetching teams:", err);
        }
    };

    const handleCreateTeam = async () => {
        if (!newTeam.name) return;
        try {
            const token = localStorage.getItem('archtrace_token');
            const res = await fetch('http://localhost:8080/api/teams', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(newTeam)
            });
            if (res.ok) {
                fetchTeams();
                setIsModalOpen(false);
                setNewTeam({ name: '', teamLead: '', color: 'indigo' });
            }
        } catch (err) {
            console.error("Error creating team:", err);
        }
    };

    const handleUpdateTeam = async () => {
        if (!editingTeam.name) return;
        try {
            const token = localStorage.getItem('archtrace_token');
            const res = await fetch(`http://localhost:8080/api/teams/${editingTeam.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(editingTeam)
            });
            if (res.ok) {
                fetchTeams();
                setIsEditModalOpen(false);
                setEditingTeam({ id: null, name: '', teamLead: '', color: 'indigo' });
            } else {
                console.error("Failed to update team");
            }
        } catch (err) {
            console.error("Error updating team:", err);
        }
    };

    const handleDeleteTeam = async (teamId, teamName) => {
        if (window.confirm(`Are you sure you want to delete the ${teamName} team?`)) {
            try {
                const token = localStorage.getItem('archtrace_token');
                const res = await fetch(`http://localhost:8080/api/teams/${teamId}`, {
                    method: 'DELETE',
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                if (res.ok) {
                    fetchTeams();
                }
            } catch (err) {
                console.error("Error deleting team:", err);
            }
        }
    };

    const getMemberCount = (teamName) => {
        if (allUsers.length > 0) {
            return allUsers.filter(u => u.team === teamName).length;
        }
        return "Hidden"; // Non-admins can't see the exact user count securely
    };

    const getServiceCount = (teamName) => {
        return allServices.filter(s => s.team === teamName).length;
    };

    const filteredTeams = teams.filter(team => {
        const matchesName = (team.name || '').toLowerCase().includes(globalSearch.toLowerCase());
        const matchesLead = (team.teamLead || '').toLowerCase().includes(globalSearch.toLowerCase());
        return matchesName || matchesLead;
    });

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-2">
                <div>
                    <h1 className="text-2xl font-bold font-poppins text-slate-800 tracking-tight">Teams</h1>
                    <p className="text-slate-500 text-sm mt-1">Manage engineering teams and their assigned microservices.</p>
                </div>
                <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setIsModalOpen(true)}
                    className="btn-primary px-5 py-2.5 rounded-lg flex items-center justify-center gap-2 font-medium shadow-sm transition-all whitespace-nowrap"
                >
                    <Plus size={18} /> Create Team
                </motion.button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredTeams.map((team, index) => (
                    <motion.div
                        key={team.name}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: index * 0.1 }}
                        className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 hover:shadow-md transition-shadow group cursor-pointer relative overflow-hidden"
                    >
                        <div className={`absolute top-0 left-0 w-full h-1 bg-${team.color}-500/80`}></div>
                        <div className="flex justify-between items-start mb-6">
                            <div>
                                <h3 className="text-lg font-bold font-poppins text-slate-800">{team.name}</h3>
                                <div className="mt-1 flex items-center gap-3">
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setEditingTeam(team);
                                            setIsEditModalOpen(true);
                                        }}
                                        className="text-xs text-indigo-500 hover:text-indigo-700 font-medium flex items-center gap-1 transition-colors"
                                    >
                                        <Edit2 size={12} /> Edit
                                    </button>
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleDeleteTeam(team.id, team.name);
                                        }}
                                        className="text-xs text-rose-500 hover:text-rose-700 font-medium flex items-center gap-1 transition-colors"
                                    >
                                        <Trash2 size={12} /> Delete
                                    </button>
                                </div>
                            </div>
                            <div className={`w-8 h-8 rounded-full bg-${team.color}-100 flex items-center justify-center text-${team.color}-600 font-bold text-sm border border-${team.color}-200`}>
                                {team.name.charAt(0)}
                            </div>
                        </div>

                        <div className="mb-6">
                            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-1">Team Lead</span>
                            <span className="text-sm font-medium text-slate-700">{team.teamLead}</span>
                        </div>

                        <div className="grid grid-cols-2 gap-4 border-t border-slate-100 pt-4">
                            <div>
                                <span className="text-slate-500 flex items-center gap-1.5 text-xs mb-1 font-semibold">
                                    <Users size={14} /> Members
                                </span>
                                <span className="text-lg font-bold font-poppins text-slate-800">
                                    {getMemberCount(team.name)}
                                </span>
                            </div>
                            <div>
                                <span className="text-slate-500 flex items-center gap-1.5 text-xs mb-1 font-semibold">
                                    <Box size={14} /> Services Owned
                                </span>
                                <span className="text-lg font-bold font-poppins text-slate-800">
                                    {getServiceCount(team.name)}
                                </span>
                            </div>
                        </div>
                    </motion.div>
                ))}
                {filteredTeams.length === 0 && (
                    <div className="col-span-full py-8 text-center text-slate-500 text-sm">
                        No teams found matching {globalSearch}
                    </div>
                )}
            </div>

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
                                <h3 className="text-lg font-bold font-poppins text-slate-800">Create New Team</h3>
                            </div>

                            <div className="p-6 space-y-4">
                                <div>
                                    <label className="block text-sm font-semibold text-slate-700 mb-1">Team Name</label>
                                    <input type="text" className="input-field" placeholder="e.g. Navigation Team" value={newTeam.name} onChange={e => setNewTeam({ ...newTeam, name: e.target.value })} />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-slate-700 mb-1">Team Lead</label>
                                    <select className="input-field" value={newTeam.teamLead} onChange={e => setNewTeam({ ...newTeam, teamLead: e.target.value })}>
                                        <option value="">Select a team lead...</option>
                                        {allUsers.map(u => {
                                            const isAssigned = assignedTeamLeads.has(String(u.name || '').trim());
                                            return (
                                                <option key={u.id || u.email} value={u.name} disabled={isAssigned}>
                                                    {u.name} {isAssigned ? `(Assigned)` : '- Available'}
                                                </option>
                                            );
                                        })}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-slate-700 mb-1">Theme Color</label>
                                    <select className="input-field" value={newTeam.color} onChange={e => setNewTeam({ ...newTeam, color: e.target.value })}>
                                        <option value="indigo">Indigo</option>
                                        <option value="emerald">Emerald</option>
                                        <option value="cyan">Cyan</option>
                                        <option value="amber">Amber</option>
                                        <option value="rose">Rose</option>
                                        <option value="blue">Blue</option>
                                    </select>
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
                                    onClick={handleCreateTeam}
                                    className="btn-primary px-5 py-2 rounded-lg text-sm"
                                >
                                    Create Team
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            <AnimatePresence>
                {isEditModalOpen && (
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
                                <h3 className="text-lg font-bold font-poppins text-slate-800">Edit Team</h3>
                            </div>

                            <div className="p-6 space-y-4">
                                <div>
                                    <label className="block text-sm font-semibold text-slate-700 mb-1">Team Name</label>
                                    <input type="text" className="input-field" placeholder="e.g. Navigation Team" value={editingTeam.name} onChange={e => setEditingTeam({ ...editingTeam, name: e.target.value })} />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-slate-700 mb-1">Team Lead</label>
                                    <select className="input-field" value={editingTeam.teamLead} onChange={e => setEditingTeam({ ...editingTeam, teamLead: e.target.value })}>
                                        <option value="">Select a team lead...</option>
                                        {allUsers.map(u => {
                                            const leadName = String(u.name || '').trim();
                                            const currentLeadName = String(editingTeam.teamLead || '').trim();
                                            const isAssignedToOther = assignedTeamLeads.has(leadName) && leadName !== currentLeadName;
                                            return (
                                                <option key={u.id || u.email} value={u.name} disabled={isAssignedToOther}>
                                                    {u.name} {isAssignedToOther ? `(Assigned)` : '- Available'}
                                                </option>
                                            );
                                        })}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-slate-700 mb-1">Theme Color</label>
                                    <select className="input-field" value={editingTeam.color} onChange={e => setEditingTeam({ ...editingTeam, color: e.target.value })}>
                                        <option value="indigo">Indigo</option>
                                        <option value="emerald">Emerald</option>
                                        <option value="cyan">Cyan</option>
                                        <option value="amber">Amber</option>
                                        <option value="rose">Rose</option>
                                        <option value="blue">Blue</option>
                                    </select>
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
                                    onClick={handleUpdateTeam}
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
