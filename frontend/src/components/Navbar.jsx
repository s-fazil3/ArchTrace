import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Activity, LayoutDashboard } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
    const { user } = useAuth();
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener('scroll', onScroll);
        return () => window.removeEventListener('scroll', onScroll);
    }, []);

    const getDashboardLink = () => {
        if (!user) return '/login';
        const role = user.role?.toUpperCase();
        if (role === 'ADMIN') return '/admin/dashboard';
        if (role === 'TEAM_LEAD') return '/team/dashboard';
        return '/developer/dashboard';
    };

    return (
        <motion.nav
            initial={{ y: -60, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled
                ? 'bg-white/85 backdrop-blur-xl shadow-md border-b border-white/60'
                : 'bg-transparent'
                }`}
        >
            <div className="container" style={{ paddingTop: 0, paddingBottom: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '68px' }}>
                    {/* Logo */}
                    <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none' }}>
                        <div style={{
                            width: 36, height: 36,
                            background: 'linear-gradient(135deg, #4F46E5, #06B6D4)',
                            borderRadius: 10,
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            boxShadow: '0 4px 12px rgba(79,70,229,0.3)'
                        }}>
                            <Activity size={20} color="#fff" />
                        </div>
                        <span style={{
                            fontFamily: 'Poppins, sans-serif',
                            fontWeight: 700,
                            fontSize: '1.25rem',
                            color: scrolled ? '#1E293B' : '#FFFFFF',
                            letterSpacing: '-0.02em',
                            transition: 'color 0.3s ease'
                        }}>
                            Arch<span className="gradient-text">Trace</span>
                        </span>
                    </Link>

                    {/* CTA Buttons */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <Link to="/login">
                            <button className="btn-secondary" style={{ padding: '8px 20px', fontSize: '0.88rem', background: '#fff' }}>Sign In</button>
                        </Link>
                        <Link to="/signup">
                            <button className="btn-primary" style={{ padding: '8px 20px', fontSize: '0.88rem' }}>Get Started</button>
                        </Link>
                    </div>
                </div>
            </div>
        </motion.nav>
    );
}
