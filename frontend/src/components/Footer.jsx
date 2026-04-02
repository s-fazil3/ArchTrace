import { motion } from 'framer-motion';
import {
    Github, Linkedin, Twitter, Activity,
    Home, Zap, BookOpen, Mail
} from 'lucide-react';
import { Link } from 'react-router-dom';

const footerLinks = {
    Product: [
        { label: 'Home', href: '/', icon: Home },
        { label: 'Features', href: '#features', icon: Zap },
        { label: 'Documentation', href: '#', icon: BookOpen },
        { label: 'Contact', href: '#contact', icon: Mail },
    ],
    Company: [
        { label: 'About Us', href: '#' },
        { label: 'Blog', href: '#' },
        { label: 'Careers', href: '#' },
        { label: 'GitHub', href: '#' },
    ],
    Legal: [
        { label: 'Privacy Policy', href: '#' },
        { label: 'Terms of Service', href: '#' },
        { label: 'Cookie Policy', href: '#' },
        { label: 'Security', href: '#' },
    ],
};

const socials = [
    { icon: Linkedin, href: '#', label: 'LinkedIn' },
    { icon: Github, href: '#', label: 'GitHub' },
    { icon: Twitter, href: '#', label: 'Twitter' },
];

export default function Footer() {
    return (
        <footer style={{
            background: 'linear-gradient(180deg, #0F172A 0%, #1E293B 100%)',
            color: '#CBD5E1',
            paddingTop: 72,
            paddingBottom: 32,
            position: 'relative',
            overflow: 'hidden',
        }}>
            {/* Background glow */}
            <div style={{
                position: 'absolute', top: 0, left: '50%', transform: 'translateX(-50%)',
                width: 600, height: 200,
                background: 'radial-gradient(ellipse, rgba(79,70,229,0.15) 0%, transparent 70%)',
                pointerEvents: 'none'
            }} />

            <div className="container" style={{ position: 'relative', zIndex: 1 }}>
                {/* Top Row */}
                <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', gap: 48, marginBottom: 64 }}>
                    {/* Brand */}
                    <div>
                        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
                            <div style={{
                                width: 36, height: 36,
                                background: 'linear-gradient(135deg, #4F46E5, #06B6D4)',
                                borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center'
                            }}>
                                <Activity size={20} color="#fff" />
                            </div>
                            <span style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 700, fontSize: '1.2rem', color: '#F8FAFC' }}>
                                ArchTrace
                            </span>
                        </Link>
                        <p style={{ fontSize: '0.9rem', color: '#94A3B8', lineHeight: 1.7, maxWidth: 280, marginBottom: 24 }}>
                            Enterprise-grade service dependency analysis and microservice architecture visualization platform.
                        </p>
                        {/* Socials */}
                        <div style={{ display: 'flex', gap: 12 }}>
                            {socials.map(({ icon: Icon, href, label }) => (
                                <motion.a
                                    key={label}
                                    href={href}
                                    aria-label={label}
                                    whileHover={{ scale: 1.1, y: -2 }}
                                    whileTap={{ scale: 0.95 }}
                                    style={{
                                        width: 38, height: 38,
                                        background: 'rgba(255,255,255,0.06)',
                                        border: '1px solid rgba(255,255,255,0.1)',
                                        borderRadius: 10,
                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        color: '#94A3B8',
                                        transition: 'color 0.2s, background 0.2s'
                                    }}
                                    onMouseEnter={e => { e.currentTarget.style.color = '#06B6D4'; e.currentTarget.style.background = 'rgba(6,182,212,0.1)'; }}
                                    onMouseLeave={e => { e.currentTarget.style.color = '#94A3B8'; e.currentTarget.style.background = 'rgba(255,255,255,0.06)'; }}
                                >
                                    <Icon size={17} />
                                </motion.a>
                            ))}
                        </div>
                    </div>

                    {/* Link Groups */}
                    {Object.entries(footerLinks).map(([group, links]) => (
                        <div key={group}>
                            <h4 style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 600, fontSize: '0.85rem', color: '#F1F5F9', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 18 }}>
                                {group}
                            </h4>
                            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 12 }}>
                                {links.map(link => (
                                    <li key={link.label}>
                                        <a
                                            href={link.href}
                                            style={{ color: '#94A3B8', fontSize: '0.9rem', transition: 'color 0.2s' }}
                                            onMouseEnter={e => { e.currentTarget.style.color = '#06B6D4'; }}
                                            onMouseLeave={e => { e.currentTarget.style.color = '#94A3B8'; }}
                                        >
                                            {link.label}
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>

                {/* Divider */}
                <div style={{ height: 1, background: 'rgba(255,255,255,0.08)', marginBottom: 28 }} />

                {/* Bottom Row */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
                    <p style={{ fontSize: '0.85rem', color: '#64748B' }}>
                        © 2025 ArchTrace. All rights reserved.
                    </p>
                    <div style={{ display: 'flex', gap: 24 }}>
                        {['Privacy Policy', 'Terms of Service'].map(item => (
                            <a key={item} href="#" style={{ fontSize: '0.85rem', color: '#64748B', transition: 'color 0.2s' }}
                                onMouseEnter={e => { e.currentTarget.style.color = '#94A3B8'; }}
                                onMouseLeave={e => { e.currentTarget.style.color = '#64748B'; }}>
                                {item}
                            </a>
                        ))}
                    </div>
                </div>
            </div>

            <style>{`
        @media (max-width: 768px) {
          footer .container > div:first-child {
            grid-template-columns: 1fr 1fr !important;
          }
        }
        @media (max-width: 480px) {
          footer .container > div:first-child {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
        </footer>
    );
}
