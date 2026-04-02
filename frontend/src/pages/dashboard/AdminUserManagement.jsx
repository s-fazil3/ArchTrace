import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Shield, User, Building, Search, Edit2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../components/Toast';

export default function AdminUserManagement() {
    const [users, setUsers] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [availableTeams, setAvailableTeams] = useState([]);
    const { user: currentUser, updateUserRole } = useAuth();

    useEffect(() => {
        fetchUsers();
        fetchTeams();
    }, []);

    const fetchTeams = async () => {
        try {
            const token = localStorage.getItem('archtrace_token');
            const res = await fetch('http://localhost:8080/api/teams', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (res.ok) {
                setAvailableTeams(await res.json());
            }
        } catch (err) {
            console.error("Error fetching teams for management:", err);
        }
    };

    const fetchUsers = async () => {
        try {
            const token = localStorage.getItem('archtrace_token');
            const response = await fetch('http://localhost:8080/users', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            if (response.ok) {
                const data = await response.json();
                setUsers(data);
            }
        } catch (error) {
            console.error('Error fetching users:', error);
        }
    };

    const handleRoleChange = async (userId, newRole) => {
        try {
            const token = localStorage.getItem('archtrace_token');
            const response = await fetch(`http://localhost:8080/users/${userId}/role`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ role: newRole })
            });

            if (response.ok) {
                // Refresh local state
                const updated = users.map(u => u.id === userId ? { ...u, role: newRole.toUpperCase() } : u);
                setUsers(updated);

                // If Admin changing their own role OR if we want to immediately reflect changes in current session (if possible)
                const targetUser = updated.find(u => u.id === userId);
                if (targetUser && targetUser.email === currentUser?.email) {
                    updateUserRole(newRole.toUpperCase());
                }
            }
        } catch (error) {
            console.error('Error updating role:', error);
        }
    };

    const handleTeamChange = async (userId, newTeam) => {
        try {
            const token = localStorage.getItem('archtrace_token');
            const response = await fetch(`http://localhost:8080/users/${userId}/team`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ team: newTeam })
            });

            if (response.ok) {
                setUsers(prevUsers => prevUsers.map(u =>
                    String(u.id) === String(userId) ? { ...u, team: newTeam } : u
                ));
            } else {
                const errText = await response.text();
                toast(`Error: ${response.status} - ${errText || 'Failed to update team'}`, 'error');
            }
        } catch (error) {
            console.error('Error updating team:', error);
            toast('Network error while updating team.', 'error');
        }
    };

    const filteredUsers = users.filter(u =>
    (u.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        u.email?.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-2">
                <div>
                    <h1 className="text-2xl font-bold font-poppins text-slate-800 tracking-tight">User Management</h1>
                    <p className="text-slate-500 text-sm mt-1">Assign roles and manage access across the organization.</p>
                </div>
                <div className="relative">
                    <input
                        type="text"
                        placeholder="Search users..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10 pr-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 w-64 shadow-sm"
                    />
                    <Search size={16} className="absolute left-3 top-2.5 text-slate-400" />
                </div>
            </div>

            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden"
            >
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50 border-b border-slate-200">
                                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Name / Email</th>
                                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Team</th>
                                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Role</th>
                                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {filteredUsers.map((u, index) => (
                                <motion.tr
                                    key={u.id}
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: index * 0.05 }}
                                    className="hover:bg-slate-50/80 transition-colors"
                                >
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center font-bold text-sm">
                                                {u.name.charAt(0)}
                                            </div>
                                            <div>
                                                <div className="font-semibold text-slate-800 text-sm">{u.name}</div>
                                                <div className="text-xs text-slate-500">{u.email}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                                        <div className="flex items-center gap-2">
                                            <Building size={14} className="text-slate-400 shrink-0" />
                                            <select
                                                className="bg-slate-50 border border-slate-200 text-slate-700 text-xs rounded-md px-2 py-1 focus:ring-indigo-500 focus:border-indigo-500 cursor-pointer hover:bg-white transition-all outline-none min-w-[120px]"
                                                value={u.team || 'None'}
                                                onChange={(e) => handleTeamChange(u.id, e.target.value)}
                                            >
                                                <option value="None">No Team</option>
                                                {/* Ensure the user's current team is always an option even if not in seeded availableTeams */}
                                                {u.team && !availableTeams.some(t => t.name === u.team) && (
                                                    <option key={u.team} value={u.team}>{u.team}</option>
                                                )}
                                                {availableTeams.map(t => (
                                                    <option key={t.name} value={t.name}>{t.name}</option>
                                                ))}
                                            </select>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-bold border ${u.role === 'ADMIN' ? 'bg-indigo-50 text-indigo-700 border-indigo-100' :
                                            u.role === 'TEAM_LEAD' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' :
                                                'bg-slate-100 text-slate-700 border-slate-200'
                                            }`}>
                                            {u.role === 'ADMIN' && <Shield size={12} className="mr-1" />}
                                            {u.role === 'TEAM_LEAD' && <User size={12} className="mr-1" />}
                                            {u.role}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right">
                                        <div className="relative inline-block text-left">
                                            <select
                                                className={`bg-white border flex items-center gap-2 border-slate-200 text-slate-700 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full p-2 ${u.email === currentUser?.email ? 'opacity-50 cursor-not-allowed bg-slate-50' : 'cursor-pointer'}`}
                                                value={u.role}
                                                onChange={(e) => handleRoleChange(u.id, e.target.value)}
                                                disabled={u.email === currentUser?.email}
                                                title={u.email === currentUser?.email ? "You cannot demote yourself" : ""}
                                            >
                                                <option value="DEVELOPER">{u.role === 'DEVELOPER' ? 'Current: Developer' : 'Make Developer'}</option>
                                                <option value="TEAM_LEAD">{u.role === 'TEAM_LEAD' ? 'Current: Team Lead' : 'Make Team Lead'}</option>
                                                <option value="ADMIN">{u.role === 'ADMIN' ? 'Current: Admin' : 'Make Admin'}</option>
                                            </select>
                                        </div>
                                    </td>
                                </motion.tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </motion.div>
        </div>
    );
}
