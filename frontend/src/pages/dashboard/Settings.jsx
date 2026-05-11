import { motion } from 'framer-motion';
import { User, Bell, Shield, Paintbrush, Building2, Eye, EyeOff, Check, Moon, Sun, Monitor } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useState, useEffect } from 'react';

// ─── Password & Security Panel ───────────────────────────────────────────────
function SecurityPanel() {
    const [showCurrent, setShowCurrent] = useState(false);
    const [showNew, setShowNew] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const [saved, setSaved] = useState(false);
    const [form, setForm] = useState({ current: '', newPass: '', confirm: '' });
    const [error, setError] = useState('');

    const handleSave = () => {
        if (!form.current || !form.newPass || !form.confirm) {
            setError('All fields are required.'); return;
        }
        if (form.newPass.length < 8) {
            setError('New password must be at least 8 characters.'); return;
        }
        if (form.newPass === form.current) {
            setError('New password cannot be the same as current password.'); return;
        }
        if (form.newPass !== form.confirm) {
            setError('New passwords do not match.'); return;
        }
        setError('');
        setSaved(true);
        setForm({ current: '', newPass: '', confirm: '' });
        setTimeout(() => setSaved(false), 3000);
    };

    const PasswordInput = ({ label, field, show, toggle }) => (
        <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">{label}</label>
            <div className="relative max-w-sm">
                <input
                    type={show ? 'text' : 'password'}
                    className="input-field pr-10 w-full"
                    value={form[field]}
                    onChange={e => setForm(f => ({ ...f, [field]: e.target.value }))}
                />
                <button
                    type="button"
                    onClick={toggle}
                    className="absolute inset-y-0 right-3 flex items-center text-slate-400 hover:text-indigo-600 transition-colors"
                >
                    {show ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
            </div>
        </div>
    );

    return (
        <>
            <h2 className="text-xl font-bold font-poppins text-slate-800 mb-1 border-b border-slate-100 pb-4">
                Password &amp; Security
            </h2>
            <p className="text-sm text-slate-500 mb-6">Update your password to keep your account secure.</p>

            <div className="space-y-5">
                <PasswordInput label="Current Password" field="current" show={showCurrent} toggle={() => setShowCurrent(v => !v)} />
                <PasswordInput label="New Password" field="newPass" show={showNew} toggle={() => setShowNew(v => !v)} />
                <PasswordInput label="Confirm New Password" field="confirm" show={showConfirm} toggle={() => setShowConfirm(v => !v)} />

                {error && (
                    <p className="text-sm text-red-500 bg-red-50 border border-red-100 rounded-lg px-4 py-2">{error}</p>
                )}

                {/* Password strength hint */}
                <div className="bg-slate-50 border border-slate-100 rounded-lg p-4 text-sm text-slate-600">
                    <p className="font-semibold text-slate-700 mb-2">Password requirements</p>
                    <ul className="space-y-1 list-none">
                        {[
                            'At least 8 characters',
                            'Mix of letters and numbers recommended',
                            'Avoid using your name or email',
                        ].map(req => (
                            <li key={req} className="flex items-center gap-2 text-slate-500">
                                <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 inline-block" />
                                {req}
                            </li>
                        ))}
                    </ul>
                </div>

                <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                    {saved && (
                        <span className="flex items-center gap-2 text-sm text-emerald-600 font-medium">
                            <Check size={16} /> Password updated successfully
                        </span>
                    )}
                    <div className="ml-auto">
                        <button onClick={handleSave} className="btn-primary px-6 py-2.5 rounded-lg font-medium shadow-sm transition-all focus:ring-4 focus:ring-indigo-500/20">
                            Update Password
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
}

// ─── Notifications Panel ─────────────────────────────────────────────────────
function NotificationsPanel() {
    const [prefs, setPrefs] = useState({
        impactAlerts: true,
        teamNotifications: true,
        deploymentUpdates: true,
        weeklyDigest: false,
        browserPush: false,
    });
    const [saved, setSaved] = useState(false);

    const toggle = key => setPrefs(p => ({ ...p, [key]: !p[key] }));

    const sections = [
        {
            title: 'Architecture Alerts',
            items: [
                { key: 'impactAlerts', label: 'Impact Analysis Alerts', desc: 'Notify when a component change affects your services.' },
                { key: 'deploymentUpdates', label: 'Deployment Status Updates', desc: 'Get notified when a blocked deployment is unblocked.' },
            ]
        },
        {
            title: 'Team & Collaboration',
            items: [
                { key: 'teamNotifications', label: 'Team Notifications', desc: 'Receive messages from other team leads about dependencies.' },
            ]
        },
        {
            title: 'Digest & Push',
            items: [
                { key: 'weeklyDigest', label: 'Weekly Summary Digest', desc: 'A weekly summary of architecture changes and dependency health.' },
                { key: 'browserPush', label: 'Browser Push Notifications', desc: 'Allow real-time in-browser alerts (requires browser permission).' },
            ]
        }
    ];

    const handleSave = () => {
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
    };

    return (
        <>
            <h2 className="text-xl font-bold font-poppins text-slate-800 mb-1 border-b border-slate-100 pb-4">
                Notifications
            </h2>
            <p className="text-sm text-slate-500 mb-6">Choose which alerts and updates you want to receive.</p>

            <div className="space-y-7">
                {sections.map(section => (
                    <div key={section.title}>
                        <p className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-3">{section.title}</p>
                        <div className="space-y-3">
                            {section.items.map(({ key, label, desc }) => (
                                <div key={key} className="flex items-start justify-between gap-4 bg-slate-50 border border-slate-100 rounded-xl px-4 py-3">
                                    <div>
                                        <p className="text-sm font-semibold text-slate-700">{label}</p>
                                        <p className="text-xs text-slate-500 mt-0.5">{desc}</p>
                                    </div>
                                    {/* Toggle switch */}
                                    <button
                                        onClick={() => toggle(key)}
                                        className={`relative flex-shrink-0 w-11 h-6 rounded-full transition-colors duration-200 focus:outline-none ${prefs[key] ? 'bg-indigo-600' : 'bg-slate-200'}`}
                                    >
                                        <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform duration-200 ${prefs[key] ? 'translate-x-5' : 'translate-x-0'}`} />
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}

                <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                    {saved && (
                        <span className="flex items-center gap-2 text-sm text-emerald-600 font-medium">
                            <Check size={16} /> Preferences saved
                        </span>
                    )}
                    <div className="ml-auto">
                        <button onClick={handleSave} className="btn-primary px-6 py-2.5 rounded-lg font-medium shadow-sm transition-all focus:ring-4 focus:ring-indigo-500/20">
                            Save Preferences
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
}

// ─── Appearance Panel ─────────────────────────────────────────────────────────
function AppearancePanel() {
    // Load persisted settings
    const [theme, setTheme] = useState(() => localStorage.getItem('archtrace_theme') || 'light');
    const [density, setDensity] = useState(() => localStorage.getItem('archtrace_density') || 'comfortable');
    const [saved, setSaved] = useState(false);

    const themes = [
        { id: 'light', icon: Sun, label: 'Light', desc: 'Clean and bright interface.' },
        { id: 'dark', icon: Moon, label: 'Dark', desc: 'Easy on the eyes at night.' },
        { id: 'system', icon: Monitor, label: 'System', desc: 'Follows your OS preference.' },
    ];

    const densities = [
        { id: 'compact', label: 'Compact', desc: 'More info, less spacing.' },
        { id: 'comfortable', label: 'Comfortable', desc: 'Balanced default spacing.' },
        { id: 'spacious', label: 'Spacious', desc: 'Airy layout with more breathing room.' },
    ];

    const applyTheme = (t) => {
        const root = document.documentElement;
        // Clear any inline styles set by previous versions of this tool to avoid "sticky" colors
        root.removeAttribute('style');
        
        if (t === 'dark') {
            root.classList.add('dark');
        } else if (t === 'light') {
            root.classList.remove('dark');
        } else {
            const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
            root.classList.toggle('dark', isDark);
        }
    };

    const applyDensity = (d) => {
        const body = document.body;
        body.classList.remove('density-compact', 'density-comfortable', 'density-spacious');
        body.classList.add(`density-${d}`);
        
        // Example of live CSS variable adjustment for density
        const root = document.documentElement;
        if (d === 'compact') root.style.setProperty('--density-gap', '12px');
        else if (d === 'spacious') root.style.setProperty('--density-gap', '32px');
        else root.style.setProperty('--density-gap', '24px');
    };

    const handleSave = () => {
        localStorage.setItem('archtrace_theme', theme);
        localStorage.setItem('archtrace_density', density);
        
        // Apply changes immediately to the DOM
        applyTheme(theme);
        applyDensity(density);
        
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
    };

    // Initialize on mount
    useEffect(() => {
        applyTheme(theme);
        applyDensity(density);
    }, []);

    return (
        <>
            <h2 className="text-xl font-bold font-poppins text-slate-800 mb-1 border-b border-slate-100 pb-4">
                Appearance
            </h2>
            <p className="text-sm text-slate-500 mb-6">Customize how ArchTrace looks for you.</p>

            <div className="space-y-7">
                {/* Theme */}
                <div>
                    <p className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-3">Theme</p>
                    <div className="grid grid-cols-3 gap-3">
                        {themes.map(({ id, icon: Icon, label, desc }) => (
                            <button
                                key={id}
                                onClick={() => setTheme(id)}
                                className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all text-center ${
                                    theme === id
                                        ? 'border-indigo-500 bg-indigo-50 shadow-sm'
                                        : 'border-slate-200 bg-white hover:border-slate-300'
                                }`}
                            >
                                <Icon size={22} className={theme === id ? 'text-indigo-600' : 'text-slate-400'} />
                                <span className={`text-sm font-semibold ${theme === id ? 'text-indigo-700' : 'text-slate-700'}`}>{label}</span>
                                <span className="text-xs text-slate-400 leading-tight">{desc}</span>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Density */}
                <div>
                    <p className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-3">Layout Density</p>
                    <div className="space-y-2">
                        {densities.map(({ id, label, desc }) => (
                            <button
                                key={id}
                                onClick={() => setDensity(id)}
                                className={`w-full flex items-center gap-4 px-4 py-3 rounded-xl border-2 transition-all text-left ${
                                    density === id
                                        ? 'border-indigo-500 bg-indigo-50'
                                        : 'border-slate-200 bg-white hover:border-slate-300'
                                }`}
                            >
                                <span className={`w-4 h-4 rounded-full border-2 flex-shrink-0 transition-colors ${
                                    density === id ? 'border-indigo-600 bg-indigo-600' : 'border-slate-300'
                                }`} />
                                <div>
                                    <p className={`text-sm font-semibold ${density === id ? 'text-indigo-700' : 'text-slate-700'}`}>{label}</p>
                                    <p className="text-xs text-slate-400">{desc}</p>
                                </div>
                            </button>
                        ))}
                    </div>
                </div>

                <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                    {saved && (
                        <span className="flex items-center gap-2 text-sm text-emerald-600 font-medium">
                            <Check size={16} /> Appearance saved and applied
                        </span>
                    )}
                    <div className="ml-auto">
                        <button onClick={handleSave} className="btn-primary px-6 py-2.5 rounded-lg font-medium shadow-sm transition-all focus:ring-4 focus:ring-indigo-500/20">
                            Save Appearance
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
}

// ─── Main Settings Page ───────────────────────────────────────────────────────
export default function Settings() {
    const { user } = useAuth();
    const [activeTab, setActiveTab] = useState('profile');

    const tabs = [
        { id: 'profile', icon: User, label: 'Profile Settings' },
        ...(user?.role === 'ADMIN' ? [{ id: 'organization', icon: Building2, label: 'Organization Setup' }] : []),
        { id: 'security', icon: Shield, label: 'Password & Security' },
        { id: 'notifications', icon: Bell, label: 'Notifications' },
        { id: 'appearance', icon: Paintbrush, label: 'Appearance' },
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
                {/* Sidebar Navigation */}
                <div className="md:col-span-1 space-y-2">
                    {tabs.map((item) => (
                        <div
                            key={item.id}
                            onClick={() => setActiveTab(item.id)}
                            className={`flex items-center gap-3 px-4 py-3 rounded-lg cursor-pointer transition-colors ${
                                activeTab === item.id
                                    ? 'bg-indigo-50 text-indigo-700 font-semibold shadow-sm border border-indigo-100/50'
                                    : 'text-slate-600 hover:bg-slate-50 font-medium'
                            }`}
                        >
                            <item.icon size={18} className={activeTab === item.id ? 'text-indigo-600' : 'text-slate-400'} />
                            <span className="text-sm">{item.label}</span>
                        </div>
                    ))}
                </div>

                {/* Content Panel */}
                <motion.div
                    key={activeTab}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.2 }}
                    className="md:col-span-2 bg-white rounded-2xl shadow-sm border border-slate-200 p-8"
                >
                    {/* ── Profile ── */}
                    {activeTab === 'profile' && (
                        <>
                            <h2 className="text-xl font-bold font-poppins text-slate-800 mb-6 border-b border-slate-100 pb-4">Profile Settings</h2>
                            <div className="space-y-6">
                                <div className="flex items-center gap-6">
                                    <div className="relative">
                                        <div className="w-24 h-24 rounded-full bg-indigo-100 border-4 border-white shadow-md flex items-center justify-center text-indigo-600 text-3xl font-bold font-poppins uppercase">
                                            {user?.name ? user.name.charAt(0) : 'U'}
                                        </div>
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-slate-800 text-lg">{user?.name || 'Guest User'}</h3>
                                        <p className="text-sm text-slate-500 capitalize">{user?.role?.toLowerCase() || 'Developer'}</p>
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

                    {/* ── Organization (admin only) ── */}
                    {activeTab === 'organization' && user?.role === 'ADMIN' && (
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

                    {/* ── Security ── */}
                    {activeTab === 'security' && <SecurityPanel />}

                    {/* ── Notifications ── */}
                    {activeTab === 'notifications' && <NotificationsPanel />}

                    {/* ── Appearance ── */}
                    {activeTab === 'appearance' && <AppearancePanel />}
                </motion.div>
            </div>
        </div>
    );
}
