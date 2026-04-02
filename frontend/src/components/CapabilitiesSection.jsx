import { motion } from 'framer-motion';
import { Users, Server, Network, Eye, BarChart3, ShieldCheck } from 'lucide-react';

const caps = [
    {
        icon: Users,
        title: 'Role-Based Access',
        description: 'Fine-grained RBAC for Admins, Team Leads, and Developers with audit trails.',
        color: '#4F46E5',
        tag: 'Security',
    },
    {
        icon: Server,
        title: 'Service Registry',
        description: 'Centralized registry for all microservices with versioning and metadata tagging.',
        color: '#06B6D4',
        tag: 'Core',
    },
    {
        icon: Network,
        title: 'Dependency Management',
        description: 'Define, track, and version service dependencies with change history.',
        color: '#8B5CF6',
        tag: 'Core',
    },
    {
        icon: Eye,
        title: 'Architecture Visualization',
        description: 'Live dependency graphs with zoom, filter, cluster, and export capabilities.',
        color: '#F59E0B',
        tag: 'Visualization',
    },
    {
        icon: BarChart3,
        title: 'Impact Analysis',
        description: 'Blast-radius simulation to show affected services before any change.',
        color: '#10B981',
        tag: 'Analysis',
    },
    {
        icon: ShieldCheck,
        title: 'Risk Prediction',
        description: 'ML model trained on your SLAs and incidents to predict deployment risk.',
        color: '#EF4444',
        tag: 'ML',
    },
];

export default function CapabilitiesSection() {
    return (
        <section id="capabilities" className="section" style={{ background: '#F6F8FB' }}>
            <div className="container">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 24 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    style={{ textAlign: 'center', marginBottom: 64 }}
                >
                    <span className="badge badge-primary" style={{ marginBottom: 16, display: 'inline-block' }}>Platform Capabilities</span>
                    <h2 style={{
                        fontFamily: 'Poppins, sans-serif', fontWeight: 700,
                        fontSize: 'clamp(1.8rem, 4vw, 2.6rem)', color: '#1E293B',
                        marginBottom: 14, letterSpacing: '-0.02em',
                    }}>
                        Built for{' '}
                        <span className="gradient-text">Enterprise Scale</span>
                    </h2>
                    <p style={{ fontSize: '1.05rem', color: '#64748B', maxWidth: 540, margin: '0 auto', lineHeight: 1.7 }}>
                        Six powerful modules that work together to give you complete control and visibility over your service ecosystem.
                    </p>
                </motion.div>

                {/* Grid */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 24 }}>
                    {caps.map((cap, i) => (
                        <motion.div
                            key={cap.title}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: i * 0.08 }}
                            whileHover={{ y: -4 }}
                            style={{
                                background: 'rgba(255,255,255,0.75)',
                                backdropFilter: 'blur(16px)',
                                WebkitBackdropFilter: 'blur(16px)',
                                border: '1px solid rgba(255,255,255,0.9)',
                                borderRadius: 18,
                                padding: 28,
                                boxShadow: '0 4px 24px rgba(0,0,0,0.05)',
                                cursor: 'default',
                                position: 'relative',
                                overflow: 'hidden',
                                transition: 'box-shadow 0.3s ease',
                            }}
                            onMouseEnter={e => { e.currentTarget.style.boxShadow = `0 12px 40px ${cap.color}20`; e.currentTarget.style.borderColor = `${cap.color}30`; }}
                            onMouseLeave={e => { e.currentTarget.style.boxShadow = '0 4px 24px rgba(0,0,0,0.05)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.9)'; }}
                        >
                            {/* Background glow */}
                            <div style={{
                                position: 'absolute', top: -30, right: -30,
                                width: 100, height: 100,
                                borderRadius: '50%',
                                background: `radial-gradient(circle, ${cap.color}15 0%, transparent 70%)`,
                            }} />

                            {/* Tag */}
                            <div style={{
                                display: 'inline-flex', alignItems: 'center',
                                padding: '3px 10px', borderRadius: 100,
                                background: `${cap.color}12`,
                                color: cap.color,
                                fontSize: '0.7rem', fontWeight: 600,
                                textTransform: 'uppercase', letterSpacing: '0.06em',
                                marginBottom: 14,
                            }}>
                                {cap.tag}
                            </div>

                            {/* Icon */}
                            <div style={{
                                width: 46, height: 46, borderRadius: 12,
                                background: `${cap.color}15`,
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                marginBottom: 16,
                            }}>
                                <cap.icon size={24} color={cap.color} />
                            </div>

                            <h3 style={{
                                fontFamily: 'Poppins, sans-serif', fontWeight: 600,
                                fontSize: '1rem', color: '#1E293B', marginBottom: 10,
                            }}>
                                {cap.title}
                            </h3>

                            <p style={{ fontSize: '0.875rem', color: '#64748B', lineHeight: 1.7 }}>
                                {cap.description}
                            </p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
