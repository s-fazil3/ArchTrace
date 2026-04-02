import { motion, AnimatePresence } from 'framer-motion';
import { User, Bell, Shield, Paintbrush, Building2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useState } from 'react';

export default function Settings() {
    const { user } = useAuth();
    const [activeTab, setActiveTab] = useState('profile');

    const tabs = [
        { id: 'profile', icon: User, label: 'Profile Settings' },
        ...(user?.role === 'admin' ? [{ id: 'organization', icon: Building2, label: 'Organization Setup' }] : []),
        { id: 'security', icon: Shield, label: 'Password & Security' },
        { id: 'notifications', icon: Bell, label: 'Notifications' },
        { id: 'appearance', icon: Paintbrush, label: 'Appearance' }
    ];
    return (
        <div className="space-y-6 max-w-4xl mx-auto">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-2">
                <div>
                    <h1 className="text-2xl font-bold font-poppins text-slate-800 tracking-tight">Settings</h1>
                    <p className="text-slate-500 text-sm mt-1">Manage your account and UI preferences.</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Settings Navigation */}
                <div className="md:col-span-1 space-y-2">
                    {tabs.map((item) => (
                        <div
                            key={item.id}
                            onClick={() => setActiveTab(item.id)}
                            className={`flex items-center gap-3 px-4 py-3 rounded-lg cursor-pointer transition-colors ${activeTab === item.id
                                ? 'bg-indigo-50 text-indigo-700 font-semibold shadow-sm border border-indigo-100/50'
                                : 'text-slate-600 hover:bg-slate-50 font-medium'
                                }`}
                        >
                            <item.icon size={18} className={activeTab === item.id ? 'text-indigo-600' : 'text-slate-400'} />
                            <span className="text-sm">{item.label}</span>
                        </div>
                    ))}
                </div>

                {/* Settings Content */}
                <motion.div
                    key={activeTab}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="md:col-span-2 bg-white rounded-2xl shadow-sm border border-slate-200 p-8"
                >
                    {activeTab === 'profile' && (
                        <>
                            <h2 className="text-xl font-bold font-poppins text-slate-800 mb-6 border-b border-slate-100 pb-4">Profile Settings</h2>

                            <div className="space-y-6">
                                <div className="flex items-center gap-6">
                                    <div className="relative">
                                        <div className="w-24 h-24 rounded-full bg-indigo-100 border-4 border-white shadow-md flex items-center justify-center text-indigo-600 text-3xl font-bold font-poppins uppercase">
                                            {user?.name ? user.name.charAt(0) : 'U'}
                                        </div>
                                        <button className="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-white border border-slate-200 shadow-sm flex items-center justify-center text-slate-600 hover:text-indigo-600 transition-colors">
                                            <Paintbrush size={14} />
                                        </button>
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-slate-800 text-lg">{user?.name || 'Guest User'}</h3>
                                        <p className="text-sm text-slate-500 capitalize">{user?.role || 'Developer'}</p>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-semibold text-slate-700 mb-1">Full Name</label>
                                        <input type="text" className="input-field max-w-sm" defaultValue={user?.name || ''} />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold text-slate-700 mb-1">Email Address</label>
                                        <input type="email" className="input-field max-w-sm" defaultValue={user?.email || ''} />
                                    </div>
                                    <div className="sm:col-span-2">
                                        <label className="block text-sm font-semibold text-slate-700 mb-1">Team</label>
                                        <input type="text" className="input-field max-w-sm bg-slate-50" readOnly defaultValue={user?.team || 'Unassigned'} />
                                    </div>
                                </div>

                                <div className="pt-6 border-t border-slate-100 flex justify-end">
                                    <button className="btn-primary px-6 py-2.5 rounded-lg flex items-center gap-2 font-medium shadow-sm transition-all focus:ring-4 focus:ring-indigo-500/20">
                                        Save Changes
                                    </button>
                                </div>
                            </div>
                        </>
                    )}

                    {activeTab === 'organization' && user?.role === 'admin' && (
                        <>
                            <h2 className="text-xl font-bold font-poppins text-slate-800 mb-6 border-b border-slate-100 pb-4">Organization Setup</h2>

                            <div className="space-y-6">
                                <div>
                                    <label className="block text-sm font-semibold text-slate-700 mb-1">Organization Name</label>
                                    <input type="text" className="input-field max-w-sm" defaultValue="ShopKart" />
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-slate-700 mb-1">Industry Vertical</label>
                                    <select className="input-field max-w-sm">
                                        <option>E-commerce / Retail</option>
                                        <option>Finance / Banking</option>
                                        <option>Technology</option>
                                        <option>Logistics</option>
                                    </select>
                                </div>

                                <div className="pt-6 border-t border-slate-100 flex justify-end">
                                    <button className="btn-primary px-6 py-2.5 rounded-lg flex items-center gap-2 font-medium shadow-sm transition-all focus:ring-4 focus:ring-indigo-500/20">
                                        Update Organization
                                    </button>
                                </div>
                            </div>
                        </>
                    )}
                </motion.div>
            </div>
        </div>
    );
}
