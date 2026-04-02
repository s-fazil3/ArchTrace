import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Play, Server, Database, Activity, Shield, Layers, GitBranch, ArrowLeftRight, Box } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';

const slideCards = [
    {
        icon: Server,
        title: 'Service Discovery',
        desc: 'Auto-detect all microservices deployed in your Kubernetes clusters with zero configuration required.',
        color: '#4F46E5',
        bg: 'rgba(79,70,229,0.1)'
    },
    {
        icon: Database,
        title: 'Dependency Mapping',
        desc: 'Visualize dynamic data flows, API connections, and message queues in real-time architecture graphs.',
        color: '#06B6D4',
        bg: 'rgba(6,182,212,0.1)'
    },
    {
        icon: Shield,
        title: 'Impact Analysis',
        desc: 'Simulate blast-radius of architectural changes before deployment to completely prevent cascading failures.',
        color: '#10B981',
        bg: 'rgba(16,185,129,0.1)'
    },
    {
        icon: Activity,
        title: 'Risk Prediction',
        desc: 'ML models detect anomalous dependency patterns and calculate SLA breach risks automatically.',
        color: '#F59E0B',
        bg: 'rgba(245,158,11,0.1)'
    }
];

export default function HeroSection() {
    const [currentSlide, setCurrentSlide] = useState(0);

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % slideCards.length);
        }, 4500);
        return () => clearInterval(timer);
    }, []);

    return (
        <section id="hero" style={{
            position: 'relative',
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            overflow: 'hidden',
            paddingTop: 110
        }}>
            {/* Background Image from Unsplash - Architecture & Global Network */}
            <div style={{
                position: 'absolute',
                inset: 0,
                zIndex: 0,
                backgroundImage: 'url("https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=2072&auto=format&fit=crop")',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundAttachment: 'fixed',
            }} />

            {/* Overlay: Dark gradient fading to transparent so the white text stays readable without hiding the image */}
            <div style={{
                position: 'absolute',
                inset: 0,
                zIndex: 0,
                background: 'linear-gradient(90deg, rgba(15,23,42,0.92) 0%, rgba(15,23,42,0.7) 45%, rgba(15,23,42,0.2) 100%)',
                backdropFilter: 'blur(2px)',
            }} />

            <div className="container" style={{ position: 'relative', zIndex: 1, width: '100%' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 64, flexWrap: 'wrap', justifyContent: 'space-between' }}>

                    {/* Left Content */}
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
                        style={{ flex: '1 1 500px', maxWidth: 660, marginBottom: 40 }}
                    >
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.1 }}
                            style={{ marginBottom: 24 }}
                        >
                            <span className="badge badge-primary" style={{ marginBottom: 0, background: 'rgba(255,255,255,0.95)', border: '1px solid rgba(79,70,229,0.2)', padding: '6px 16px', fontSize: '0.85rem' }}>
                                🚀 Enterprise Architecture Intelligence
                            </span>
                        </motion.div>

                        <motion.h1
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.7, delay: 0.2 }}
                            style={{
                                fontFamily: 'Poppins, sans-serif',
                                fontWeight: 800,
                                fontSize: 'clamp(2.5rem, 5.5vw, 4.2rem)',
                                lineHeight: 1.15,
                                color: '#FFFFFF',
                                marginBottom: 26,
                                letterSpacing: '-0.025em',
                            }}
                        >
                            Visualize Your{' '}
                            <span className="gradient-text">Microservice</span>
                            <br />Architecture{' '}
                            <span className="gradient-text">Instantly</span>
                        </motion.h1>

                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.7, delay: 0.3 }}
                            style={{ fontSize: '1.18rem', color: '#CBD5E1', lineHeight: 1.75, marginBottom: 40, maxWidth: 580, fontWeight: 500 }}
                        >
                            Detect service dependencies and analyze system impact before deployment.
                            ArchTrace gives your team complete architectural clarity with ML-powered risk prediction.
                        </motion.p>

                        {/* Feature pills */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.7, delay: 0.4 }}
                            style={{ display: 'flex', flexWrap: 'wrap', gap: 12, marginBottom: 44 }}
                        >
                            {[
                                { icon: GitBranch, text: 'Dependency Graphs' },
                                { icon: Box, text: 'Service Registry' },
                                { icon: Layers, text: 'Impact Analysis' },
                                { icon: ArrowLeftRight, text: 'Risk Prediction' },
                            ].map(({ icon: Icon, text }) => (
                                <motion.div
                                    key={text}
                                    whileHover={{ y: -3, boxShadow: '0 8px 16px rgba(0,0,0,0.06)' }}
                                    style={{
                                        display: 'flex', alignItems: 'center', gap: 8,
                                        padding: '8px 16px',
                                        background: 'rgba(255,255,255,0.95)',
                                        border: '1px solid rgba(99,102,241,0.2)',
                                        borderRadius: 100,
                                        fontSize: '0.88rem', fontWeight: 600, color: '#1E293B',
                                        boxShadow: '0 4px 12px rgba(0,0,0,0.03)',
                                        cursor: 'default'
                                    }}
                                >
                                    <Icon size={16} color="#4F46E5" />
                                    {text}
                                </motion.div>
                            ))}
                        </motion.div>

                        {/* CTA Buttons */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.7, delay: 0.5 }}
                            style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}
                        >
                            <Link to="/signup">
                                <motion.button
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    className="btn-primary"
                                    style={{ fontSize: '1.05rem', padding: '16px 36px', borderRadius: 12 }}
                                >
                                    Get Started <ArrowRight size={18} />
                                </motion.button>
                            </Link>
                            <motion.button
                                whileHover={{ scale: 1.02, background: '#fff' }}
                                whileTap={{ scale: 0.98 }}
                                className="btn-secondary"
                                style={{ fontSize: '1.05rem', padding: '16px 36px', background: 'rgba(255,255,255,0.9)', borderRadius: 12 }}
                                onClick={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })}
                            >
                                <Play size={16} fill="currentColor" /> View Demo
                            </motion.button>
                        </motion.div>
                    </motion.div>

                    {/* Right: Slideshow Cards - Fixed position rendering */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 1, delay: 0.2, type: "spring", bounce: 0.3 }}
                        style={{
                            flex: '1 1 420px',
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            position: 'relative',
                            height: 520,
                            marginTop: -20
                        }}
                    >
                        <div style={{ position: 'relative', width: '100%', maxWidth: 440, height: 440 }}>
                            <AnimatePresence>
                                <motion.div
                                    key={currentSlide}
                                    initial={{ opacity: 0, y: 40, scale: 0.95, rotateX: 5 }}
                                    animate={{ opacity: 1, y: 0, scale: 1, rotateX: 0 }}
                                    exit={{ opacity: 0, y: -40, scale: 0.95, rotateX: -5 }}
                                    transition={{ duration: 0.6, type: "spring", bounce: 0.2 }}
                                    style={{
                                        position: 'absolute',
                                        top: 0,
                                        left: 0,
                                        right: 0,
                                        margin: '0 auto',
                                        width: '100%',
                                        background: 'rgba(30, 41, 59, 0.7)',
                                        backdropFilter: 'blur(24px)',
                                        WebkitBackdropFilter: 'blur(24px)',
                                        border: '1px solid rgba(255,255,255,0.1)',
                                        borderRadius: 28,
                                        padding: 44,
                                        boxShadow: '0 32px 64px rgba(0,0,0,0.4), inset 0 0 0 1px rgba(255,255,255,0.05)',
                                    }}
                                >
                                    <motion.div
                                        initial={{ scale: 0 }}
                                        animate={{ scale: 1 }}
                                        transition={{ delay: 0.2, type: "spring" }}
                                        style={{
                                            width: 84, height: 84, borderRadius: 20,
                                            background: slideCards[currentSlide].bg,
                                            border: `1px solid ${slideCards[currentSlide].color}40`,
                                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                                            marginBottom: 32,
                                            boxShadow: `0 8px 24px ${slideCards[currentSlide].color}20`
                                        }}
                                    >
                                        {(() => {
                                            const Icon = slideCards[currentSlide].icon;
                                            return <Icon size={42} color={slideCards[currentSlide].color} />;
                                        })()}
                                    </motion.div>

                                    <motion.h3
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: 0.3 }}
                                        style={{
                                            fontFamily: 'Poppins, sans-serif',
                                            fontSize: '1.8rem',
                                            fontWeight: 700,
                                            color: '#FFFFFF',
                                            marginBottom: 16,
                                            letterSpacing: '-0.02em'
                                        }}
                                    >
                                        {slideCards[currentSlide].title}
                                    </motion.h3>

                                    <motion.p
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        transition={{ delay: 0.4 }}
                                        style={{
                                            fontSize: '1.15rem',
                                            color: '#CBD5E1',
                                            lineHeight: 1.65,
                                            fontWeight: 500
                                        }}
                                    >
                                        {slideCards[currentSlide].desc}
                                    </motion.p>

                                    {/* Indicators */}
                                    <div style={{ display: 'flex', gap: 8, marginTop: 44 }}>
                                        {slideCards.map((_, i) => (
                                            <div key={i} style={{
                                                height: 6,
                                                borderRadius: 3,
                                                background: i === currentSlide ? slideCards[i].color : 'rgba(255,255,255,0.1)',
                                                flex: i === currentSlide ? 3 : 1,
                                                transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)'
                                            }} />
                                        ))}
                                    </div>
                                </motion.div>
                            </AnimatePresence>
                        </div>
                    </motion.div>
                </div>
            </div>

        </section>
    );
}
