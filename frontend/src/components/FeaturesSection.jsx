import { motion } from 'framer-motion';
import { GitBranch, Zap, ShieldCheck } from 'lucide-react';

const features = [
    {
        icon: GitBranch,
        title: 'Service Architecture Visualization',
        description: 'Interactive dependency graph showing all service relationships in real time. Instantly understand your entire system topology with auto-layout algorithms.',
        color: '#4F46E5',
        bg: 'rgba(79,70,229,0.08)',
        delay: 0.1,
    },
    {
        icon: Zap,
        title: 'Dependency Impact Analysis',
        description: 'Automatically detect all services affected by proposed changes before deployment. Prevent cascading failures with blast-radius visualization.',
        color: '#06B6D4',
        bg: 'rgba(6,182,212,0.08)',
        delay: 0.2,
    },
    {
        icon: ShieldCheck,
        title: 'Risk Prediction with ML',
        description: 'Predict system risk scores before every deployment using machine learning models trained on your historical incident data and SLA patterns.',
        color: '#8B5CF6',
        bg: 'rgba(139,92,246,0.08)',
        delay: 0.3,
    },
];

const cardVariants = {
    hidden: { opacity: 0, y: 40 },
    visible: (delay) => ({
        opacity: 1, y: 0,
        transition: { duration: 0.6, delay, ease: [0.25, 0.46, 0.45, 0.94] }
    }),
};

export default function FeaturesSection() {
    return (
        <section id="features" className="section" style={{ background: '#F6F8FB' }}>
            <div className="container">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 24 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    style={{ textAlign: 'center', marginBottom: 64 }}
                >
                    <span className="badge badge-primary" style={{ marginBottom: 16, display: 'inline-block' }}>
                        Core Features
                    </span>
                    <h2 style={{
                        fontFamily: 'Poppins, sans-serif',
                        fontWeight: 700,
                        fontSize: 'clamp(1.8rem, 4vw, 2.6rem)',
                        color: '#1E293B',
                        marginBottom: 16,
                        letterSpacing: '-0.02em',
                    }}>
                        Everything You Need to{' '}
                        <span className="gradient-text">Understand Your Stack</span>
                    </h2>
                    <p style={{ fontSize: '1.05rem', color: '#64748B', maxWidth: 560, margin: '0 auto', lineHeight: 1.7 }}>
                        From service discovery to ML risk scoring — ArchTrace covers the full lifecycle of architectural intelligence.
                    </p>
                </motion.div>

                {/* Feature Cards */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 28 }}>
                    {features.map((feat) => (
                        <motion.div
                            key={feat.title}
                            custom={feat.delay}
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true }}
                            variants={cardVariants}
                            whileHover={{ y: -6, boxShadow: '0 20px 48px rgba(79,70,229,0.16)' }}
                            style={{
                                background: '#fff',
                                borderRadius: 20,
                                padding: 36,
                                border: '1px solid #E2E8F0',
                                boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
                                cursor: 'default',
                                transition: 'box-shadow 0.3s ease',
                                position: 'relative',
                                overflow: 'hidden',
                            }}
                        >
                            {/* Background accent */}
                            <div style={{
                                position: 'absolute', top: -20, right: -20,
                                width: 120, height: 120,
                                background: `radial-gradient(circle, ${feat.bg} 0%, transparent 70%)`,
                                borderRadius: '50%',
                            }} />

                            {/* Icon */}
                            <div style={{
                                width: 52, height: 52,
                                background: feat.bg,
                                borderRadius: 14,
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                marginBottom: 22,
                            }}>
                                <feat.icon size={26} color={feat.color} />
                            </div>

                            <h3 style={{
                                fontFamily: 'Poppins, sans-serif',
                                fontWeight: 600,
                                fontSize: '1.12rem',
                                color: '#1E293B',
                                marginBottom: 12,
                                lineHeight: 1.4,
                            }}>
                                {feat.title}
                            </h3>

                            <p style={{ fontSize: '0.92rem', color: '#64748B', lineHeight: 1.75 }}>
                                {feat.description}
                            </p>

                            {/* Bottom accent line */}
                            <div style={{
                                marginTop: 28, height: 3, borderRadius: 3,
                                background: `linear-gradient(90deg, ${feat.color}, transparent)`,
                            }} />
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
