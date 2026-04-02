import { motion } from 'framer-motion';
import { Star, Quote } from 'lucide-react';

const testimonials = [
    {
        name: 'Marcus Kim',
        role: 'VP of Engineering',
        company: 'NovaTech Systems',
        avatar: 'MK',
        color: '#4F46E5',
        stars: 5,
        text: '"ArchTrace completely transformed how our team understands service dependencies. We caught a critical dependency loop before it hit production and saved hours of incident response time."',
    },
    {
        name: 'Sarah Leighton',
        role: 'Platform Architect',
        company: 'CloudSphere Inc.',
        avatar: 'SL',
        color: '#06B6D4',
        stars: 5,
        text: '"The ML risk prediction is genuinely impressive. It flagged a risk we hadn\'t even considered, and the graph visualization makes onboarding new engineers so much faster."',
    },
    {
        name: 'Arun Ravindra',
        role: 'CTO',
        company: 'FinEdge Labs',
        avatar: 'AR',
        color: '#8B5CF6',
        stars: 5,
        text: '"We manage 200+ microservices. ArchTrace is the only tool that gives us true, real-time architectural clarity. The impact analysis alone has prevented 3 outages this quarter."',
    },
];

export default function TestimonialsSection() {
    return (
        <section id="testimonials" className="section" style={{
            background: 'linear-gradient(180deg, #EEF2FF 0%, #F6F8FB 100%)',
            position: 'relative', overflow: 'hidden',
        }}>
            <div style={{
                position: 'absolute', inset: 0,
                backgroundImage: 'radial-gradient(rgba(99,102,241,0.06) 1px, transparent 1px)',
                backgroundSize: '32px 32px',
                pointerEvents: 'none',
            }} />

            <div className="container" style={{ position: 'relative', zIndex: 1 }}>
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 24 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    style={{ textAlign: 'center', marginBottom: 64 }}
                >
                    <span className="badge badge-primary" style={{ marginBottom: 16, display: 'inline-block' }}>Testimonials</span>
                    <h2 style={{
                        fontFamily: 'Poppins, sans-serif', fontWeight: 700,
                        fontSize: 'clamp(1.8rem, 4vw, 2.6rem)', color: '#1E293B',
                        marginBottom: 14, letterSpacing: '-0.02em',
                    }}>
                        Trusted by{' '}
                        <span className="gradient-text">Engineering Leaders</span>
                    </h2>
                    <p style={{ fontSize: '1.05rem', color: '#64748B', maxWidth: 500, margin: '0 auto', lineHeight: 1.7 }}>
                        See why teams at top companies have made ArchTrace their architectural intelligence platform of choice.
                    </p>
                </motion.div>

                {/* Cards */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 28 }}>
                    {testimonials.map((t, i) => (
                        <motion.div
                            key={t.name}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6, delay: i * 0.12 }}
                            whileHover={{ y: -5, boxShadow: '0 20px 48px rgba(79,70,229,0.12)' }}
                            style={{
                                background: '#fff',
                                borderRadius: 20,
                                padding: 32,
                                border: '1px solid #E2E8F0',
                                boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
                                cursor: 'default',
                                position: 'relative',
                                transition: 'box-shadow 0.3s ease',
                            }}
                        >
                            {/* Quote icon */}
                            <div style={{ position: 'absolute', top: 24, right: 24 }}>
                                <Quote size={28} color={t.color} opacity={0.2} />
                            </div>

                            {/* Stars */}
                            <div style={{ display: 'flex', gap: 3, marginBottom: 18 }}>
                                {Array.from({ length: t.stars }).map((_, i) => (
                                    <Star key={i} size={16} color="#F59E0B" fill="#F59E0B" />
                                ))}
                            </div>

                            {/* Text */}
                            <p style={{ fontSize: '0.95rem', color: '#475569', lineHeight: 1.8, marginBottom: 28, fontStyle: 'italic' }}>
                                {t.text}
                            </p>

                            {/* Author */}
                            <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                                <div style={{
                                    width: 46, height: 46, borderRadius: '50%',
                                    background: `linear-gradient(135deg, ${t.color}, ${t.color}99)`,
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    color: '#fff', fontWeight: 700, fontSize: '0.85rem',
                                    flexShrink: 0,
                                }}>
                                    {t.avatar}
                                </div>
                                <div>
                                    <div style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 600, fontSize: '0.95rem', color: '#1E293B' }}>
                                        {t.name}
                                    </div>
                                    <div style={{ fontSize: '0.8rem', color: '#94A3B8', marginTop: 2 }}>
                                        {t.role} · {t.company}
                                    </div>
                                </div>
                            </div>

                            {/* Bottom accent */}
                            <div style={{
                                position: 'absolute', bottom: 0, left: 0, right: 0,
                                height: 3, borderRadius: '0 0 20px 20px',
                                background: `linear-gradient(90deg, ${t.color}, transparent)`,
                            }} />
                        </motion.div>
                    ))}
                </div>

                {/* Stats bar */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.4 }}
                    style={{
                        marginTop: 64,
                        display: 'grid',
                        gridTemplateColumns: 'repeat(4, 1fr)',
                        gap: 24,
                        background: '#fff',
                        borderRadius: 20,
                        padding: '32px 40px',
                        border: '1px solid #E2E8F0',
                        boxShadow: '0 4px 24px rgba(0,0,0,0.06)',
                    }}
                >
                    {[
                        { label: 'Engineers', value: '500+' },
                        { label: 'Services Tracked', value: '12,000+' },
                        { label: 'Outages Prevented', value: '340+' },
                        { label: 'Avg Risk Reduction', value: '68%' },
                    ].map(stat => (
                        <div key={stat.label} style={{ textAlign: 'center' }}>
                            <div style={{
                                fontFamily: 'Poppins, sans-serif', fontWeight: 800,
                                fontSize: '2rem', letterSpacing: '-0.03em',
                            }} className="gradient-text">
                                {stat.value}
                            </div>
                            <div style={{ fontSize: '0.85rem', color: '#94A3B8', marginTop: 4 }}>{stat.label}</div>
                        </div>
                    ))}
                </motion.div>
            </div>

            <style>{`
        @media (max-width: 640px) {
          #testimonials .container > div:last-child {
            grid-template-columns: 1fr 1fr !important;
          }
        }
      `}</style>
        </section>
    );
}
