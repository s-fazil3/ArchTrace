import { motion } from 'framer-motion';
import { Send, Mail, User, MessageSquare } from 'lucide-react';
import { useState } from 'react';
import { useToast } from './Toast';

export default function ContactSection() {
    const [form, setForm] = useState({ name: '', email: '', message: '' });
    const [sent, setSent] = useState(false);
    const toast = useToast();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch('http://localhost:8080/api/contact', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(form)
            });
            if (response.ok) {
                setSent(true);
                setTimeout(() => setSent(false), 4000);
                setForm({ name: '', email: '', message: '' });
            }
        } catch (error) {
            console.error('Error sending message:', error);
            toast('Failed to send message. Please try again later.', 'error');
        }
    };

    return (
        <section id="contact" className="section" style={{ background: '#F6F8FB' }}>
            <div className="container">
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 64, alignItems: 'center', flexWrap: 'wrap' }}>
                    {/* Left — Info */}
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                    >
                        <span className="badge badge-primary" style={{ marginBottom: 20, display: 'inline-block' }}>Get In Touch</span>
                        <h2 style={{
                            fontFamily: 'Poppins, sans-serif', fontWeight: 700,
                            fontSize: 'clamp(1.8rem, 3vw, 2.4rem)', color: '#1E293B',
                            marginBottom: 16, letterSpacing: '-0.02em', lineHeight: 1.2,
                        }}>
                            Ready to Map Your{' '}
                            <span className="gradient-text">Architecture?</span>
                        </h2>
                        <p style={{ fontSize: '1rem', color: '#64748B', lineHeight: 1.8, marginBottom: 32 }}>
                            Our enterprise solutions team is ready to walk you through a personalized demo. Get in touch and we'll respond within 24 hours.
                        </p>

                        {/* Contact details */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                            {[
                                { icon: Mail, label: 'Email', value: 'enterprise@archtrace.io' },
                                { icon: MessageSquare, label: 'Live Chat', value: 'Mon–Fri, 9am–6pm EST' },
                            ].map(item => (
                                <div key={item.label} style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                                    <div style={{
                                        width: 40, height: 40, borderRadius: 10,
                                        background: 'rgba(79,70,229,0.08)',
                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    }}>
                                        <item.icon size={18} color="#4F46E5" />
                                    </div>
                                    <div>
                                        <div style={{ fontSize: '0.78rem', color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 600 }}>{item.label}</div>
                                        <div style={{ fontSize: '0.9rem', color: '#1E293B', fontWeight: 500 }}>{item.value}</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </motion.div>

                    {/* Right — Form */}
                    <motion.div
                        initial={{ opacity: 0, x: 30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: 0.1 }}
                    >
                        <div className="gradient-border">
                            <div style={{
                                background: '#fff',
                                borderRadius: 15,
                                padding: 36,
                            }}>
                                <h3 style={{
                                    fontFamily: 'Poppins, sans-serif', fontWeight: 600,
                                    fontSize: '1.15rem', color: '#1E293B', marginBottom: 24,
                                }}>
                                    Send us a message
                                </h3>

                                {sent ? (
                                    <motion.div
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        style={{
                                            padding: '20px 24px',
                                            background: 'rgba(16,185,129,0.08)',
                                            border: '1px solid rgba(16,185,129,0.25)',
                                            borderRadius: 12,
                                            color: '#059669',
                                            fontWeight: 600,
                                            textAlign: 'center',
                                        }}
                                    >
                                        ✓ Message sent! We'll get back to you soon.
                                    </motion.div>
                                ) : (
                                    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                                        <div>
                                            <label className="form-label" htmlFor="contact-name">
                                                <User size={13} style={{ display: 'inline', marginRight: 5 }} />Name
                                            </label>
                                            <input
                                                id="contact-name"
                                                className="input-field"
                                                type="text"
                                                placeholder="Your full name"
                                                value={form.name}
                                                onChange={e => setForm({ ...form, name: e.target.value })}
                                                required
                                            />
                                        </div>

                                        <div>
                                            <label className="form-label" htmlFor="contact-email">
                                                <Mail size={13} style={{ display: 'inline', marginRight: 5 }} />Email
                                            </label>
                                            <input
                                                id="contact-email"
                                                className="input-field"
                                                type="email"
                                                placeholder="you@company.com"
                                                value={form.email}
                                                onChange={e => setForm({ ...form, email: e.target.value })}
                                                required
                                            />
                                        </div>

                                        <div>
                                            <label className="form-label" htmlFor="contact-message">
                                                <MessageSquare size={13} style={{ display: 'inline', marginRight: 5 }} />Message
                                            </label>
                                            <textarea
                                                id="contact-message"
                                                className="input-field"
                                                rows={4}
                                                placeholder="Tell us about your infrastructure and what you're looking to achieve..."
                                                value={form.message}
                                                onChange={e => setForm({ ...form, message: e.target.value })}
                                                required
                                                style={{ resize: 'vertical', minHeight: 110 }}
                                            />
                                        </div>

                                        <button type="submit" className="btn-primary" style={{ justifyContent: 'center', padding: '13px 28px', fontSize: '0.95rem' }}>
                                            Send Message <Send size={16} />
                                        </button>
                                    </form>
                                )}
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>

            <style>{`
        @media (max-width: 768px) {
          #contact .container > div {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
        </section>
    );
}
