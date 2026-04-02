import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { Activity, Mail, Lock, Chrome, ArrowRight, Eye, EyeOff } from 'lucide-react';
import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../components/Toast';

export default function LoginPage() {
    const navigate = useNavigate();
    const { login } = useAuth();
    const { toast } = useToast();
    const [view, setView] = useState('login'); // 'login' or 'forgot'
    const [resetEmail, setResetEmail] = useState('');
    const [showPass, setShowPass] = useState(false);
    const [form, setForm] = useState({ email: '', password: '' });

    const handleForgotPassword = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch('http://localhost:8080/auth/forgot-password', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: resetEmail })
            });
            if (response.ok) {
                toast('If this email exists in our records, you can now reset your password.', 'success');
                setView('reset');
            } else {
                toast('Email not found.', 'error');
            }
        } catch (error) {
            toast('Error processing request.', 'error');
        }
    };

    const handleResetPassword = async (e) => {
        e.preventDefault();
        const newPass = prompt("Enter your new password:");
        if (!newPass) return;
        try {
            const response = await fetch('http://localhost:8080/auth/reset-password', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: resetEmail, newPassword: newPass })
            });
            if (response.ok) {
                toast('Password reset successfully! You can now log in.', 'success');
                setView('login');
            }
        } catch (error) {
            toast('Error resetting password.', 'error');
        }
    };

    return (
        <div style={{
            minHeight: '100vh',
            background: 'linear-gradient(135deg, #EEF2FF 0%, #F0FDFF 50%, #F6F8FB 100%)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            position: 'relative', overflow: 'hidden', padding: '24px',
        }}>
            {/* Animated blobs */}
            <div className="blob-animate" style={{
                position: 'absolute', top: '-15%', left: '-10%',
                width: 550, height: 550,
                background: 'radial-gradient(circle, rgba(79,70,229,0.18) 0%, transparent 65%)',
                borderRadius: '50%', pointerEvents: 'none',
            }} />
            <div className="blob-animate-2" style={{
                position: 'absolute', bottom: '-10%', right: '-10%',
                width: 450, height: 450,
                background: 'radial-gradient(circle, rgba(6,182,212,0.14) 0%, transparent 65%)',
                borderRadius: '50%', pointerEvents: 'none',
            }} />

            {/* Card */}
            <motion.div
                initial={{ opacity: 0, y: 40, scale: 0.97 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
                style={{
                    width: '100%', maxWidth: 440,
                    background: 'rgba(255,255,255,0.75)',
                    backdropFilter: 'blur(24px)',
                    WebkitBackdropFilter: 'blur(24px)',
                    border: '1px solid rgba(255,255,255,0.9)',
                    borderRadius: 24,
                    padding: 40,
                    boxShadow: '0 24px 64px rgba(79,70,229,0.14), 0 4px 20px rgba(0,0,0,0.06)',
                    position: 'relative', zIndex: 1,
                }}
            >
                {/* Logo */}
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: 32 }}>
                    <motion.div
                        animate={{ rotate: [0, 5, -5, 0] }}
                        transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                        style={{
                            width: 52, height: 52,
                            background: 'linear-gradient(135deg, #4F46E5, #06B6D4)',
                            borderRadius: 15,
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            boxShadow: '0 8px 24px rgba(79,70,229,0.35)',
                            marginBottom: 14,
                        }}
                    >
                        <Activity size={26} color="#fff" />
                    </motion.div>
                    <h1 style={{
                        fontFamily: 'Poppins, sans-serif', fontWeight: 700,
                        fontSize: '1.5rem', color: '#1E293B', marginBottom: 6,
                    }}>
                        {view === 'login' ? 'Welcome back' : view === 'forgot' ? 'Reset Password' : 'Verify Email'}
                    </h1>
                    <p style={{ fontSize: '0.9rem', color: '#64748B' }}>
                        {view === 'login' ? 'Sign in to your ArchTrace account' : 'Enter your email to receive reset instructions'}
                    </p>
                </div>

                {view === 'login' ? (
                    <form onSubmit={e => e.preventDefault()} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                        <div>
                            <label className="form-label" htmlFor="login-email">
                                <Mail size={13} style={{ display: 'inline', marginRight: 5 }} />Email address
                            </label>
                            <div style={{ position: 'relative' }}>
                                <input
                                    id="login-email"
                                    className="input-field"
                                    type="email"
                                    placeholder="you@company.com"
                                    value={form.email}
                                    onChange={e => setForm({ ...form, email: e.target.value })}
                                    style={{ paddingLeft: 40 }}
                                    required
                                />
                                <Mail size={15} color="#94A3B8" style={{ position: 'absolute', left: 13, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
                            </div>
                        </div>

                        <div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                                <label className="form-label" htmlFor="login-pass" style={{ marginBottom: 0 }}>
                                    <Lock size={13} style={{ display: 'inline', marginRight: 5 }} />Password
                                </label>
                                <button type="button" onClick={() => setView('forgot')} style={{ background: 'none', border: 'none', fontSize: '0.82rem', color: '#4F46E5', fontWeight: 500, cursor: 'pointer' }}>
                                    Forgot password?
                                </button>
                            </div>
                            <div style={{ position: 'relative' }}>
                                <input
                                    id="login-pass"
                                    className="input-field"
                                    type={showPass ? 'text' : 'password'}
                                    placeholder="Enter your password"
                                    value={form.password}
                                    onChange={e => setForm({ ...form, password: e.target.value })}
                                    style={{ paddingLeft: 40, paddingRight: 44 }}
                                    required
                                />
                                <Lock size={15} color="#94A3B8" style={{ position: 'absolute', left: 13, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
                                <button type="button" onClick={() => setShowPass(!showPass)}
                                    style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#94A3B8', transition: 'color 0.2s', display: 'flex', alignItems: 'center' }}
                                >
                                    {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                                </button>
                            </div>
                        </div>

                        <motion.button
                            type="submit"
                            className="btn-primary"
                            onClick={async (e) => {
                                e.preventDefault();
                                if (!form.email || !form.password) {
                                    toast('Please fill in all fields.', 'error');
                                    return;
                                }

                                try {
                                    await login({ email: form.email, password: form.password });
                                    navigate('/dashboard/overview');
                                } catch (err) {
                                    toast(err.message || 'Invalid credentials. Please try again.', 'error');
                                }
                            }}
                            whileHover={{ scale: 1.01 }}
                            whileTap={{ scale: 0.99 }}
                            style={{ justifyContent: 'center', padding: '13px', fontSize: '0.95rem', marginTop: 4 }}
                        >
                            Sign In <ArrowRight size={16} />
                        </motion.button>
                    </form>
                ) : view === 'forgot' ? (
                    <form onSubmit={handleForgotPassword} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                        <div>
                            <label className="form-label">Email Address</label>
                            <input
                                className="input-field"
                                type="email"
                                placeholder="you@company.com"
                                value={resetEmail}
                                onChange={e => setResetEmail(e.target.value)}
                                required
                            />
                        </div>
                        <button type="submit" className="btn-primary" style={{ justifyContent: 'center' }}>Send Instructions</button>
                        <button type="button" onClick={() => setView('login')} style={{ fontSize: '0.875rem', color: '#64748B', background: 'none', border: 'none', cursor: 'pointer' }}>Back to Login</button>
                    </form>
                ) : (
                    <div style={{ textAlign: 'center' }}>
                        <p style={{ marginBottom: 20, color: '#64748B' }}>Resetting password for <b>{resetEmail}</b></p>
                        <button onClick={handleResetPassword} className="btn-primary" style={{ width: '100%', justifyContent: 'center' }}>Set New Password</button>
                        <button onClick={() => setView('login')} style={{ marginTop: 15, background: 'none', border: 'none', color: '#64748B', cursor: 'pointer' }}>Cancel</button>
                    </div>
                )}

                <p style={{ textAlign: 'center', marginTop: 24, fontSize: '0.875rem', color: '#64748B' }}>
                    Don't have an account?{' '}
                    <Link to="/signup" style={{ color: '#4F46E5', fontWeight: 600, transition: 'opacity 0.2s' }}>
                        Create account
                    </Link>
                </p>
            </motion.div>
        </div>
    );
}
