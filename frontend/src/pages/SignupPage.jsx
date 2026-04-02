import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { Activity, Mail, Lock, User, Building2, Eye, EyeOff, ArrowRight, Check } from 'lucide-react';
import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../components/Toast';

export default function SignupPage() {
    const navigate = useNavigate();
    const { login, register } = useAuth();
    const { toast } = useToast();
    const [showPass, setShowPass] = useState(false);
    const [form, setForm] = useState({ name: '', email: '', password: '' });

    const getStrength = (p) => {
        let s = 0;
        if (p.length >= 8) s++;
        if (/[A-Z]/.test(p)) s++;
        if (/[0-9]/.test(p)) s++;
        if (/[^A-Za-z0-9]/.test(p)) s++;
        return s;
    };

    const strength = getStrength(form.password);
    const strengthColors = ['#EF4444', '#F59E0B', '#06B6D4', '#10B981'];
    const strengthLabels = ['Weak', 'Fair', 'Good', 'Strong'];

    return (
        <div style={{
            minHeight: '100vh',
            background: 'linear-gradient(135deg, #EEF2FF 0%, #F0FDFF 50%, #F6F8FB 100%)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            position: 'relative', overflow: 'hidden', padding: '24px',
        }}>
            {/* Blobs */}
            <div className="blob-animate" style={{
                position: 'absolute', top: '-10%', right: '-5%',
                width: 500, height: 500,
                background: 'radial-gradient(circle, rgba(139,92,246,0.15) 0%, transparent 65%)',
                borderRadius: '50%', pointerEvents: 'none',
            }} />
            <div className="blob-animate-3" style={{
                position: 'absolute', bottom: '-10%', left: '-5%',
                width: 400, height: 400,
                background: 'radial-gradient(circle, rgba(6,182,212,0.12) 0%, transparent 65%)',
                borderRadius: '50%', pointerEvents: 'none',
            }} />

            {/* Card */}
            <motion.div
                initial={{ opacity: 0, y: 40, scale: 0.97 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
                style={{
                    width: '100%', maxWidth: 480,
                    background: 'rgba(255,255,255,0.78)',
                    backdropFilter: 'blur(24px)',
                    WebkitBackdropFilter: 'blur(24px)',
                    border: '1px solid rgba(255,255,255,0.9)',
                    borderRadius: 24,
                    padding: 40,
                    boxShadow: '0 24px 64px rgba(79,70,229,0.13), 0 4px 20px rgba(0,0,0,0.05)',
                    position: 'relative', zIndex: 1,
                }}
            >
                {/* Logo */}
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: 28 }}>
                    <motion.div
                        animate={{ rotate: [0, 5, -5, 0] }}
                        transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                        style={{
                            width: 52, height: 52,
                            background: 'linear-gradient(135deg, #4F46E5, #06B6D4)',
                            borderRadius: 15, display: 'flex', alignItems: 'center', justifyContent: 'center',
                            boxShadow: '0 8px 24px rgba(79,70,229,0.35)',
                            marginBottom: 14,
                        }}
                    >
                        <Activity size={26} color="#fff" />
                    </motion.div>
                    <h1 style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 700, fontSize: '1.5rem', color: '#1E293B', marginBottom: 4 }}>
                        Create your account
                    </h1>
                    <p style={{ fontSize: '0.88rem', color: '#64748B' }}>
                        Join 500+ engineers on ArchTrace
                    </p>
                </div>



                <form onSubmit={e => { e.preventDefault(); }} style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3 }}
                        style={{ display: 'flex', flexDirection: 'column', gap: 18 }}
                    >
                        {/* Name */}
                        <div>
                            <label className="form-label" htmlFor="signup-name">
                                <User size={13} style={{ display: 'inline', marginRight: 5 }} />Full Name
                            </label>
                            <div style={{ position: 'relative' }}>
                                <input id="signup-name" className="input-field" type="text" placeholder="Your full name"
                                    value={form.name} onChange={e => setForm({ ...form, name: e.target.value })}
                                    style={{ paddingLeft: 40 }} required />
                                <User size={15} color="#94A3B8" style={{ position: 'absolute', left: 13, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
                            </div>
                        </div>

                        {/* Email */}
                        <div>
                            <label className="form-label" htmlFor="signup-email">
                                <Mail size={13} style={{ display: 'inline', marginRight: 5 }} />Email
                            </label>
                            <div style={{ position: 'relative' }}>
                                <input id="signup-email" className="input-field" type="email" placeholder="you@company.com"
                                    value={form.email} onChange={e => setForm({ ...form, email: e.target.value })}
                                    style={{ paddingLeft: 40 }} required />
                                <Mail size={15} color="#94A3B8" style={{ position: 'absolute', left: 13, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
                            </div>
                        </div>

                        {/* Password */}
                        <div>
                            <label className="form-label" htmlFor="signup-pass">
                                <Lock size={13} style={{ display: 'inline', marginRight: 5 }} />Password
                            </label>
                            <div style={{ position: 'relative' }}>
                                <input id="signup-pass" className="input-field" type={showPass ? 'text' : 'password'}
                                    placeholder="Minimum 8 characters"
                                    value={form.password} onChange={e => setForm({ ...form, password: e.target.value })}
                                    style={{ paddingLeft: 40, paddingRight: 44 }} required />
                                <Lock size={15} color="#94A3B8" style={{ position: 'absolute', left: 13, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
                                <button type="button" onClick={() => setShowPass(!showPass)}
                                    style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#94A3B8', display: 'flex' }}>
                                    {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                                </button>
                            </div>
                            {/* Strength meter */}
                            {form.password && (
                                <div style={{ marginTop: 10 }}>
                                    <div style={{ display: 'flex', gap: 4, marginBottom: 4 }}>
                                        {[1, 2, 3, 4].map(i => (
                                            <div key={i} style={{
                                                flex: 1, height: 3, borderRadius: 3,
                                                background: i <= strength ? strengthColors[strength - 1] : '#E2E8F0',
                                                transition: 'background 0.3s ease',
                                            }} />
                                        ))}
                                    </div>
                                    <span style={{ fontSize: '0.75rem', color: strength > 0 ? strengthColors[strength - 1] : '#94A3B8', fontWeight: 500 }}>
                                        {strength > 0 ? strengthLabels[strength - 1] : ''}
                                    </span>
                                </div>
                            )}
                        </div>

                        {/* Terms */}
                        <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                            <input type="checkbox" id="signup-terms" style={{ marginTop: 3, accentColor: '#4F46E5', cursor: 'pointer' }} required />
                            <label htmlFor="signup-terms" style={{ fontSize: '0.83rem', color: '#64748B', cursor: 'pointer', lineHeight: 1.6 }}>
                                I agree to the{' '}
                                <a href="#" style={{ color: '#4F46E5', fontWeight: 500 }}>Terms of Service</a>{' '}and{' '}
                                <a href="#" style={{ color: '#4F46E5', fontWeight: 500 }}>Privacy Policy</a>
                            </label>
                        </div>

                        <button type="submit" className="btn-primary"
                            style={{ justifyContent: 'center', padding: '13px', fontSize: '0.95rem', marginTop: 6 }}
                            onClick={async (e) => {
                                e.preventDefault();
                                if (form.email && !form.email.toLowerCase().endsWith('@gmail.com')) {
                                    toast('Only @gmail.com addresses are allowed.', 'error');
                                    return;
                                }
                                if (form.name && form.email && form.password) {
                                    try {
                                        await register({
                                            name: form.name,
                                            email: form.email,
                                            password: form.password
                                        });
                                        toast('Account created successfully! Please log in with your credentials.', 'success');
                                        navigate('/login');
                                    } catch (err) {
                                        toast(err.message || 'Signup failed. Please try again.', 'error');
                                    }
                                } else {
                                    toast('Please fill all required fields.', 'error');
                                }
                            }}
                        >
                            Create Account <Check size={16} />
                        </button>
                    </motion.div>
                </form>

                <p style={{ textAlign: 'center', marginTop: 24, fontSize: '0.875rem', color: '#64748B' }}>
                    Already have an account?{' '}
                    <Link to="/login" style={{ color: '#4F46E5', fontWeight: 600 }}>Sign in</Link>
                </p>
            </motion.div>
        </div>
    );
}
