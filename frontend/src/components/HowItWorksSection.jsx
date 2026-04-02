import { motion } from 'framer-motion';
import { ServerCog, Network, Eye, BarChart3 } from 'lucide-react';

const steps = [
    {
        icon: ServerCog,
        step: '01',
        title: 'Register Services',
        description: 'Connect your microservices via REST API, Kubernetes discovery, or manual registry import.',
        color: '#4F46E5',
    },
    {
        icon: Network,
        step: '02',
        title: 'Define Dependencies',
        description: 'Map service-to-service relationships, SLAs, and communication protocols automatically.',
        color: '#8B5CF6',
    },
    {
        icon: Eye,
        step: '03',
        title: 'Visualize Architecture',
        description: 'Get a live, interactive dependency graph with health indicators and traffic flows.',
        color: '#06B6D4',
    },
    {
        icon: BarChart3,
        step: '04',
        title: 'Analyze Impact',
        description: 'Run blast-radius simulations and ML risk assessments before every deployment.',
        color: '#10B981',
    },
];

export default function HowItWorksSection() {
    return (
        <section id="how-it-works" className="section" style={{
            background: 'linear-gradient(180deg, #EEF2FF 0%, #F6F8FB 100%)',
            position: 'relative', overflow: 'hidden'
        }}>
            {/* Background decorations */}
            <div style={{
                position: 'absolute', top: '50%', left: '50%',
                transform: 'translate(-50%, -50%)',
                width: 800, height: 400,
                background: 'radial-gradient(ellipse, rgba(99,102,241,0.07) 0%, transparent 70%)',
                pointerEvents: 'none',
            }} />

            <div className="container" style={{ position: 'relative', zIndex: 1 }}>
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 24 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    style={{ textAlign: 'center', marginBottom: 72 }}
                >
                    <span className="badge badge-primary" style={{ marginBottom: 16, display: 'inline-block' }}>How It Works</span>
                    <h2 style={{
                        fontFamily: 'Poppins, sans-serif', fontWeight: 700,
                        fontSize: 'clamp(1.8rem, 4vw, 2.6rem)', color: '#1E293B',
                        marginBottom: 14, letterSpacing: '-0.02em',
                    }}>
                        Up and Running in{' '}
                        <span className="gradient-text">4 Simple Steps</span>
                    </h2>
                    <p style={{ fontSize: '1.05rem', color: '#64748B', maxWidth: 520, margin: '0 auto', lineHeight: 1.7 }}>
                        From zero to full architectural visibility in minutes, not months.
                    </p>
                </motion.div>

                {/* Steps */}
                <div style={{ position: 'relative' }}>
                    {/* Connecting line */}
                    <div style={{
                        position: 'absolute',
                        top: 40, left: 'calc(12.5%)',
                        right: 'calc(12.5%)',
                        height: 2,
                        background: 'linear-gradient(90deg, #4F46E5, #8B5CF6, #06B6D4, #10B981)',
                        borderRadius: 1,
                        zIndex: 0,
                        opacity: 0.4,
                    }} />

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 24, position: 'relative', zIndex: 1 }}>
                        {steps.map((step, i) => (
                            <motion.div
                                key={step.step}
                                initial={{ opacity: 0, y: 40 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.6, delay: i * 0.12 }}
                                style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}
                            >
                                {/* Node circle */}
                                <motion.div
                                    whileHover={{ scale: 1.1, boxShadow: `0 12px 32px ${step.color}40` }}
                                    transition={{ type: 'spring', stiffness: 300 }}
                                    style={{
                                        width: 80, height: 80, borderRadius: '50%',
                                        background: `linear-gradient(135deg, ${step.color}20, ${step.color}40)`,
                                        border: `3px solid ${step.color}`,
                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        marginBottom: 24,
                                        boxShadow: `0 4px 20px ${step.color}25`,
                                        cursor: 'default',
                                        position: 'relative',
                                        backgroundColor: '#fff',
                                    }}
                                >
                                    <step.icon size={32} color={step.color} />
                                    {/* Step badge */}
                                    <div style={{
                                        position: 'absolute', top: -8, right: -8,
                                        width: 26, height: 26, borderRadius: '50%',
                                        background: step.color,
                                        color: '#fff',
                                        fontSize: '0.7rem', fontWeight: 700,
                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        border: '2px solid #fff',
                                    }}>
                                        {i + 1}
                                    </div>
                                </motion.div>

                                <div style={{
                                    fontFamily: 'Poppins, sans-serif',
                                    fontSize: '0.72rem', fontWeight: 700,
                                    color: step.color, letterSpacing: '0.1em',
                                    textTransform: 'uppercase', marginBottom: 8,
                                }}>
                                    Step {step.step}
                                </div>

                                <h3 style={{
                                    fontFamily: 'Poppins, sans-serif', fontWeight: 600,
                                    fontSize: '1rem', color: '#1E293B', marginBottom: 10,
                                }}>
                                    {step.title}
                                </h3>

                                <p style={{ fontSize: '0.875rem', color: '#64748B', lineHeight: 1.7 }}>
                                    {step.description}
                                </p>
                            </motion.div>
                        ))}
                    </div>
                </div>

                {/* Bottom CTA */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.5 }}
                    style={{ textAlign: 'center', marginTop: 64 }}
                >
                    <div style={{
                        display: 'inline-flex', alignItems: 'center', gap: 8,
                        padding: '10px 24px',
                        background: 'rgba(79,70,229,0.07)',
                        border: '1px solid rgba(79,70,229,0.2)',
                        borderRadius: 100,
                        color: '#4F46E5', fontWeight: 500, fontSize: '0.9rem',
                    }}>
                        ⚡ Average setup time: <strong>12 minutes</strong>
                    </div>
                </motion.div>
            </div>

            <style>{`
        @media (max-width: 768px) {
          #how-it-works .container > div:last-child > div:first-child {
            display: none !important;
          }
          #how-it-works .container > div:last-child > div:last-child {
            grid-template-columns: 1fr 1fr !important;
          }
        }
        @media (max-width: 480px) {
          #how-it-works .container > div:last-child > div:last-child {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
        </section>
    );
}
