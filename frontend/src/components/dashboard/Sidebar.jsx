import { motion } from 'framer-motion';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
    LayoutDashboard, Box, GitBranch, Share2, ShieldAlert,
    ActivitySquare, Users, History, Settings, LogOut, Building
} from 'lucide-react';

const adminSidebarItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard/overview' },
    { icon: Users, label: 'Teams', path: '/dashboard/teams' },
    { icon: Users, label: 'Users', path: '/dashboard/users' },
    { icon: Box, label: 'Services', path: '/dashboard/services' },
    { icon: GitBranch, label: 'Dependencies', path: '/dashboard/dependencies' },
    { icon: Share2, label: 'Architecture', path: '/dashboard/architecture' },
    { icon: ShieldAlert, label: 'Impact Analysis', path: '/dashboard/impact' },
    { icon: History, label: 'Change History', path: '/dashboard/history' },
    { icon: Settings, label: 'Settings', path: '/dashboard/settings' },
];

const teamLeadSidebarItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard/overview' },
    { icon: Box, label: 'Team Services', path: '/dashboard/services' },
    { icon: GitBranch, label: 'Dependencies', path: '/dashboard/dependencies' },
    { icon: Share2, label: 'Architecture', path: '/dashboard/architecture' },
    { icon: ShieldAlert, label: 'Impact Analysis', path: '/dashboard/impact' },
    { icon: History, label: 'Change History', path: '/dashboard/history' },
    { icon: Settings, label: 'Settings', path: '/dashboard/settings' },
];

const developerSidebarItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard/overview' },
    { icon: Box, label: 'Services', path: '/dashboard/services' },
    { icon: Share2, label: 'Architecture', path: '/dashboard/architecture' },
    { icon: ShieldAlert, label: 'Impact Analysis', path: '/dashboard/impact' },
    { icon: History, label: 'Change History', path: '/dashboard/history' },
    { icon: Settings, label: 'Settings', path: '/dashboard/settings' },
];

export default function Sidebar() {
    const location = useLocation();
    const navigate = useNavigate();
    const { user, logout } = useAuth();

    let sidebarItems = developerSidebarItems;
    const role = user?.role?.toUpperCase();
    if (role === 'ADMIN') sidebarItems = adminSidebarItems;
    else if (role === 'TEAM_LEAD') sidebarItems = teamLeadSidebarItems;

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <motion.div
            initial={{ x: -250 }}
            animate={{ x: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="w-64 h-screen bg-white border-r border-slate-200 flex flex-col fixed left-0 top-0 z-40 shadow-sm"
        >
            <div className="h-16 flex items-center px-8 border-b border-slate-100">
                <Link to="/" className="flex items-center gap-2.5 text-decoration-none group">
                    <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-600 to-cyan-500 flex items-center justify-center shadow-lg shadow-indigo-500/20 group-hover:scale-105 transition-transform duration-200">
                        <ActivitySquare size={20} className="text-white" />
                    </div>
                    <span className="font-poppins font-bold text-xl text-slate-800 tracking-tight group-hover:text-indigo-700 transition-colors">
                        Arch<span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-cyan-500">Trace</span>
                    </span>
                </Link>
            </div>

            <div className="flex-1 overflow-y-auto py-6 px-4 flex flex-col gap-1 custom-scrollbar">
                {sidebarItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = location.pathname === item.path ||
                        (location.pathname.startsWith(item.path) && !item.path.endsWith('/dashboard'));

                    return (
                        <Link key={item.path} to={item.path} style={{ textDecoration: 'none' }}>
                            <motion.div
                                whileHover={{ x: 4, backgroundColor: isActive ? '' : 'rgba(241, 245, 249, 0.8)' }}
                                className={`relative flex items-center gap-3 px-4 py-3 rounded-xl cursor-pointer transition-colors duration-200 ${isActive
                                    ? 'bg-indigo-50/80 text-indigo-600 font-semibold'
                                    : 'text-slate-600 hover:text-slate-900 font-medium'
                                    }`}
                            >
                                {isActive && (
                                    <motion.div
                                        layoutId="active-indicator"
                                        className="absolute left-0 w-1 h-6 bg-indigo-600 rounded-r-full"
                                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                                    />
                                )}
                                <Icon size={18} className={isActive ? 'text-indigo-600' : 'text-slate-400'} />
                                <span className="text-sm">{item.label}</span>
                            </motion.div>
                        </Link>
                    );
                })}
            </div>

            <div className="p-4 border-t border-slate-100 mt-auto">
                <motion.div
                    onClick={handleLogout}
                    whileHover={{ x: 4, backgroundColor: 'rgba(254, 226, 226, 0.5)' }}
                    className="flex items-center gap-3 px-4 py-3 rounded-xl cursor-pointer text-slate-600 hover:text-red-600 transition-colors"
                >
                    <LogOut size={18} />
                    <span className="text-sm font-medium">Log out</span>
                </motion.div>
            </div>
        </motion.div>
    );
}
