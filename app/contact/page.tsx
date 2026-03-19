'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { Mail, Phone, MapPin, Clock, CheckCircle2, Facebook, Instagram, Send, Shield, Star, Zap, Calendar } from 'lucide-react';

function useReveal(threshold = 0.12) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { threshold }
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);
  return { ref, visible };
}

function useCounter(target: number, duration = 1600, started = false) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!started) return;
    let val = 0;
    const step = target / (duration / 16);
    const t = setInterval(() => {
      val += step;
      if (val >= target) { setCount(target); clearInterval(t); }
      else setCount(Math.floor(val));
    }, 16);
    return () => clearInterval(t);
  }, [started, target]);
  return count;
}

function Reveal({ children, delay = 0, dir = 'up' }: { children: React.ReactNode; delay?: number; dir?: 'up' | 'left' | 'right' }) {
  const { ref, visible } = useReveal();
  const t = dir === 'left' ? 'translateX(-50px)' : dir === 'right' ? 'translateX(50px)' : 'translateY(45px)';
  return (
    <div ref={ref} style={{ opacity: visible ? 1 : 0, transform: visible ? 'none' : t, transition: `opacity .7s ease ${delay}ms, transform .7s ease ${delay}ms` }}>
      {children}
    </div>
  );
}

/* Animated stat card with colored icon box */
function StatCard({ value, suffix, label, icon, delay = 0 }: {
  value: number; suffix: string; label: string; icon: React.ReactNode; delay?: number;
}) {
  const { ref, visible } = useReveal(0.3);
  const count = useCounter(value, 1600, visible);
  return (
    <div ref={ref}
      className="rounded-2xl p-5 border border-white/15 hover:scale-105 hover:-translate-y-1 transition-all duration-300 cursor-default group"
      style={{
        background: 'rgba(0,0,0,0.28)', backdropFilter: 'blur(12px)',
        opacity: visible ? 1 : 0, transform: visible ? 'translateY(0)' : 'translateY(30px)',
        transition: `opacity .7s ease ${delay}ms, transform .7s ease ${delay}ms`,
      }}>
      <div className="w-9 h-9 rounded-xl flex items-center justify-center mb-4 text-white group-hover:scale-110 transition-transform duration-300"
        style={{ background: 'rgba(231,76,60,0.55)', border: '1px solid rgba(231,76,60,0.4)' }}>
        {icon}
      </div>
      <div className="text-3xl font-black text-white mb-1 leading-none">{count}{suffix}</div>
      <div className="text-xs text-red-100/55 font-semibold tracking-wide">{label}</div>
    </div>
  );
}

/* Static card — avoids "0 Free" counter glitch */
function StatCardStatic({ headline, label, icon, delay = 0 }: {
  headline: string; label: string; icon: React.ReactNode; delay?: number;
}) {
  const { ref, visible } = useReveal(0.3);
  return (
    <div ref={ref}
      className="rounded-2xl p-5 border border-white/15 hover:scale-105 hover:-translate-y-1 transition-all duration-300 cursor-default group"
      style={{
        background: 'rgba(0,0,0,0.28)', backdropFilter: 'blur(12px)',
        opacity: visible ? 1 : 0, transform: visible ? 'translateY(0)' : 'translateY(30px)',
        transition: `opacity .7s ease ${delay}ms, transform .7s ease ${delay}ms`,
      }}>
      <div className="w-9 h-9 rounded-xl flex items-center justify-center mb-4 text-white group-hover:scale-110 transition-transform duration-300"
        style={{ background: 'rgba(231,76,60,0.55)', border: '1px solid rgba(231,76,60,0.4)' }}>
        {icon}
      </div>
      <div className="text-3xl font-black text-white mb-1 leading-none">{headline}</div>
      <div className="text-xs text-red-100/55 font-semibold tracking-wide">{label}</div>
    </div>
  );
}

function FloatingParticles() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {[...Array(10)].map((_, i) => (
        <div key={i} className="absolute rounded-full" style={{
          width: `${3 + (i % 4) * 2}px`, height: `${3 + (i % 4) * 2}px`,
          left: `${(i * 10.3) % 100}%`, top: `${(i * 13.7) % 100}%`,
          background: i % 2 === 0 ? 'rgba(231,76,60,0.4)' : 'rgba(255,255,255,0.15)',
          animation: `float-p${i % 3} ${4 + (i % 3) * 2}s ease-in-out infinite`,
          animationDelay: `${i * 0.4}s`,
        }} />
      ))}
    </div>
  );
}

export default function ContactPage() {
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', subject: '', message: '' });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [heroIn, setHeroIn] = useState(false);

  useEffect(() => { setTimeout(() => setHeroIn(true), 80); }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false); setSubmitted(true);
      setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
      setTimeout(() => setSubmitted(false), 6000);
    }, 1200);
  };

  const trustBadges = [
    { icon: <Shield className="w-3 h-3" />,       text: 'PRC Licensed' },
    { icon: <Star   className="w-3 h-3" />,        text: '4.9★ Rated' },
    { icon: <CheckCircle2 className="w-3 h-3" />,  text: 'HLURB Accredited' },
  ];

  const quickInfo = [
    { icon: <MapPin   className="w-3.5 h-3.5" />, text: 'Quezon City' },
    { icon: <Zap      className="w-3.5 h-3.5" />, text: 'Fast Response' },
    { icon: <Calendar className="w-3.5 h-3.5" />, text: 'Available 7 Days' },
  ];

  return (
    <div className="w-full min-h-screen bg-white">
      <style>{`
        @keyframes float-p0{0%,100%{transform:translateY(0)}50%{transform:translateY(-18px)}}
        @keyframes float-p1{0%,100%{transform:translateY(0)}50%{transform:translateY(-12px)}}
        @keyframes float-p2{0%,100%{transform:translateY(0)}50%{transform:translateY(-22px)}}
        @keyframes shimmer{0%{left:-100%}100%{left:200%}}
      `}</style>

      {/* ── HERO ── */}
      <section className="relative pt-32 pb-28 overflow-hidden"
        style={{ background: 'linear-gradient(145deg,#7a1818 0%,#a02020 35%,#7a1818 65%,#4a0e0e 100%)' }}>

        <div className="absolute inset-0 opacity-10"
          style={{ backgroundImage: 'radial-gradient(circle at 1px 1px,rgba(255,255,255,0.5) 1px,transparent 0)', backgroundSize: '30px 30px' }} />
        <div className="absolute top-0 right-0 w-[600px] h-[600px] opacity-30"
          style={{ background: 'radial-gradient(circle,#e74c3c 0%,transparent 65%)' }} />
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div style={{ position: 'absolute', top: 0, left: '-100%', width: '50%', height: '100%', background: 'linear-gradient(90deg,transparent,rgba(255,255,255,0.05),transparent)', animation: 'shimmer 5s ease-in-out infinite' }} />
        </div>
        <FloatingParticles />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

            {/* LEFT — text column */}
            <div>

              {/* Eyebrow */}
              <div style={{ opacity: heroIn ? 1 : 0, transform: heroIn ? 'none' : 'translateY(35px)', transition: 'opacity .8s ease 0ms, transform .8s ease 0ms' }}>
                <div className="inline-flex items-center gap-2 mb-5">
                  <div className="h-px w-10 bg-red-200/70" />
                  <span className="text-red-200 text-xs font-black tracking-[0.2em] uppercase">We'd Love to Hear From You</span>
                </div>
              </div>

              {/* Headline */}
              <div style={{ opacity: heroIn ? 1 : 0, transform: heroIn ? 'none' : 'translateY(35px)', transition: 'opacity .8s ease 150ms, transform .8s ease 150ms' }}>
                <h1 className="text-5xl sm:text-6xl font-black text-white leading-tight mb-5 drop-shadow-xl">
                  Get in<br />
                  <span className="text-red-300">Touch</span>{' '}
                  <span className="text-white/50">With Us</span>
                </h1>
              </div>

              {/* Paragraph */}
              <div style={{ opacity: heroIn ? 1 : 0, transform: heroIn ? 'none' : 'translateY(35px)', transition: 'opacity .8s ease 250ms, transform .8s ease 250ms' }}>
                <p className="text-white/80 text-lg leading-relaxed max-w-lg mb-5">
                  Have a question, want to schedule a viewing, or just want to say hello? Our team at Alfima Realty Inc. is ready to help.
                </p>
              </div>

              {/* ① Trust badge pills */}
              <div style={{ opacity: heroIn ? 1 : 0, transform: heroIn ? 'none' : 'translateY(35px)', transition: 'opacity .8s ease 330ms, transform .8s ease 330ms' }}>
                <div className="flex flex-wrap gap-2 mb-5">
                  {trustBadges.map(({ icon, text }) => (
                    <span key={text}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold text-white/90 border border-white/20 hover:border-white/40 transition-all cursor-default"
                      style={{ background: 'rgba(255,255,255,0.1)', backdropFilter: 'blur(8px)' }}>
                      <span className="text-red-300">{icon}</span>
                      {text}
                    </span>
                  ))}
                </div>
              </div>

              {/* ④ Quick-info strip */}
              <div style={{ opacity: heroIn ? 1 : 0, transform: heroIn ? 'none' : 'translateY(35px)', transition: 'opacity .8s ease 410ms, transform .8s ease 410ms' }}>
                <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mb-7">
                  {quickInfo.map(({ icon, text }, i) => (
                    <span key={text} className="inline-flex items-center gap-1.5 text-white/55 text-sm">
                      <span className="text-red-300/80">{icon}</span>
                      {text}
                      {i < quickInfo.length - 1 && <span className="ml-4 text-white/20 hidden sm:inline">·</span>}
                    </span>
                  ))}
                </div>
              </div>

              {/* Buttons */}
              <div style={{ opacity: heroIn ? 1 : 0, transform: heroIn ? 'none' : 'translateY(35px)', transition: 'opacity .8s ease 490ms, transform .8s ease 490ms' }}>
                <div className="flex gap-4 flex-wrap">
                  <a href="#contact-form">
                    <button className="inline-flex items-center gap-2 bg-white text-red-800 font-black px-7 py-3.5 rounded-full hover:bg-red-50 shadow-xl hover:scale-105 hover:shadow-2xl transition-all duration-200">
                      <Send className="w-4 h-4" /> Send a Message
                    </button>
                  </a>
                  <a href="tel:+639171234567">
                    <button className="inline-flex items-center gap-2 border-2 border-white/50 hover:border-white text-white font-bold px-7 py-3.5 rounded-full hover:bg-white/10 hover:scale-105 transition-all duration-200">
                      <Phone className="w-4 h-4" /> Call Us Now
                    </button>
                  </a>
                </div>
              </div>
            </div>

            {/* RIGHT — stat cards */}
            <div className="grid grid-cols-2 gap-4">
              {/* ② All cards now have colored icon boxes */}
              <StatCard       value={24}  suffix="h"   label="Response Time"       icon={<Clock        className="w-4 h-4" />} delay={200} />
              <StatCard       value={100} suffix="%"   label="Client Satisfaction" icon={<CheckCircle2 className="w-4 h-4" />} delay={350} />
              {/* ③ Fixed "0 Free" bug — static card */}
              <StatCardStatic headline="Free"          label="Consultation"        icon={<Phone        className="w-4 h-4" />} delay={500} />
              <StatCard       value={7}   suffix="d"   label="Available Support"   icon={<Mail         className="w-4 h-4" />} delay={650} />
            </div>

          </div>
        </div>

        {/* Wave to white */}
        <div className="absolute bottom-0 left-0 w-full overflow-hidden">
          <svg viewBox="0 0 1440 70" preserveAspectRatio="none" className="w-full h-14" fill="white">
            <path d="M0,70 C480,0 960,70 1440,20 L1440,70 Z" />
          </svg>
        </div>
      </section>

      {/* ── CONTACT SECTION — light bg ── */}
      <section id="contact-form" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

            {/* Sidebar */}
            <Reveal dir="left">
              <div className="space-y-4">

                <div className="rounded-2xl p-6 border-2 border-red-100 shadow-sm"
                  style={{ background: 'linear-gradient(135deg,#fff5f5 0%,#fff 100%)' }}>
                  <div className="h-1 w-12 rounded-full mb-5" style={{ background: 'linear-gradient(90deg,#e74c3c,#ff8080)' }} />
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-11 h-11 rounded-xl overflow-hidden ring-2 ring-red-200">
                      <img src="/alfima.png" alt="Alfima" className="w-full h-full object-cover" />
                    </div>
                    <div>
                      <p className="text-gray-900 font-black">Alfima Realty Inc.</p>
                      <p className="text-red-500 text-xs font-medium">Licensed Real Estate Broker</p>
                    </div>
                  </div>
                  <p className="text-gray-500 text-sm leading-relaxed">Helping Filipinos find their dream properties since day one. Reach out — let's talk about what you need.</p>
                </div>

                {[
                  { icon: <MapPin className="w-5 h-5" />, label: 'Visit Us',       lines: ['Unit 1, Sample Building', 'Quezon City, Metro Manila', 'Philippines'] },
                  { icon: <Phone  className="w-5 h-5" />, label: 'Call Us',        lines: ['+63 917 123 4567', '+63 2 8123 4567'], links: ['tel:+639171234567', 'tel:+63281234567'] },
                  { icon: <Mail   className="w-5 h-5" />, label: 'Email Us',       lines: ['info@alfimarealtyinc.com', 'support@alfimarealtyinc.com'], links: ['mailto:info@alfimarealtyinc.com', 'mailto:support@alfimarealtyinc.com'] },
                  { icon: <Clock  className="w-5 h-5" />, label: 'Business Hours', lines: ['Mon – Fri: 9:00 AM – 6:00 PM', 'Saturday: 10:00 AM – 4:00 PM', 'Sunday: Closed'] },
                ].map(({ icon, label, lines, links }, i) => (
                  <Reveal key={label} delay={i * 80}>
                    <div className="rounded-2xl p-5 bg-white hover:-translate-y-1 hover:shadow-lg transition-all duration-300 group border border-gray-100 shadow-sm">
                      <div className="flex items-start gap-4">
                        <div className="w-10 h-10 rounded-xl flex items-center justify-center text-white flex-shrink-0 group-hover:scale-110 transition-transform duration-300"
                          style={{ background: '#c0392b' }}>{icon}</div>
                        <div>
                          <p className="text-gray-400 text-xs font-black uppercase tracking-widest mb-1">{label}</p>
                          {lines.map((line, j) => (
                            links?.[j]
                              ? <a key={j} href={links[j]} className="block text-gray-800 hover:text-red-600 text-sm font-medium transition-colors">{line}</a>
                              : <p key={j} className="text-gray-600 text-sm">{line}</p>
                          ))}
                        </div>
                      </div>
                    </div>
                  </Reveal>
                ))}

                <Reveal delay={320}>
                  <div className="rounded-2xl p-5 bg-white border border-gray-100 shadow-sm">
                    <p className="text-gray-400 text-xs font-black uppercase tracking-widest mb-3">Follow Us</p>
                    <div className="flex gap-3">
                      {[
                        { icon: <Facebook  className="w-4 h-4" />, label: 'Facebook',  href: '#' },
                        { icon: <Instagram className="w-4 h-4" />, label: 'Instagram', href: '#' },
                      ].map(({ icon, label, href }) => (
                        <a key={label} href={href}
                          className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-gray-600 hover:text-white transition-all text-sm font-bold border border-gray-200 hover:border-red-600 hover:bg-red-600 hover:scale-105">
                          {icon} {label}
                        </a>
                      ))}
                    </div>
                  </div>
                </Reveal>
              </div>
            </Reveal>

            {/* Form */}
            <div className="lg:col-span-2">
              <Reveal dir="right" delay={100}>
                <div className="rounded-3xl overflow-hidden shadow-xl border border-gray-100">
                  <div className="px-10 pt-10 pb-6 border-b border-red-900/20"
                    style={{ background: 'linear-gradient(135deg,#c0392b,#96281b)' }}>
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center">
                        <Send className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h2 className="text-2xl font-black text-white">Send Us a Message</h2>
                        <p className="text-white/70 text-sm">We'll get back to you within 24 hours</p>
                      </div>
                    </div>
                  </div>

                  <div className="p-10 bg-white">
                    {submitted ? (
                      <div className="flex flex-col items-center justify-center py-16 text-center">
                        <div className="w-20 h-20 rounded-full flex items-center justify-center mb-6 bg-green-100">
                          <CheckCircle2 className="w-10 h-10 text-green-500" />
                        </div>
                        <h3 className="text-gray-900 text-2xl font-black mb-2">Message Sent!</h3>
                        <p className="text-gray-500 max-w-sm">Thank you for reaching out. Our team will get back to you within 24 hours.</p>
                      </div>
                    ) : (
                      <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                          <div>
                            <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">Full Name *</label>
                            <input type="text" name="name" value={formData.name} onChange={handleChange} required
                              className="w-full px-4 py-3.5 rounded-xl text-gray-900 bg-gray-50 border-2 border-gray-200 focus:border-red-500 focus:bg-white focus:outline-none transition-all text-sm font-medium placeholder-gray-400"
                              placeholder="Juan dela Cruz" />
                          </div>
                          <div>
                            <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">Phone Number</label>
                            <input type="tel" name="phone" value={formData.phone} onChange={handleChange}
                              className="w-full px-4 py-3.5 rounded-xl text-gray-900 bg-gray-50 border-2 border-gray-200 focus:border-red-500 focus:bg-white focus:outline-none transition-all text-sm font-medium placeholder-gray-400"
                              placeholder="+63 917 000 0000" />
                          </div>
                        </div>

                        <div>
                          <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">Email Address *</label>
                          <input type="email" name="email" value={formData.email} onChange={handleChange} required
                            className="w-full px-4 py-3.5 rounded-xl text-gray-900 bg-gray-50 border-2 border-gray-200 focus:border-red-500 focus:bg-white focus:outline-none transition-all text-sm font-medium placeholder-gray-400"
                            placeholder="juan@email.com" />
                        </div>

                        <div>
                          <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">Subject *</label>
                          <select name="subject" value={formData.subject} onChange={handleChange} required
                            className="w-full px-4 py-3.5 rounded-xl text-gray-900 bg-gray-50 border-2 border-gray-200 focus:border-red-500 focus:bg-white focus:outline-none transition-all text-sm font-medium">
                            <option value="">Select a topic...</option>
                            <option value="general">General Inquiry</option>
                            <option value="property">Property Question</option>
                            <option value="agent">Connect with an Agent</option>
                            <option value="viewing">Schedule a Viewing</option>
                            <option value="listing">List My Property</option>
                            <option value="support">Customer Support</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">Message *</label>
                          <textarea name="message" value={formData.message} onChange={handleChange} required rows={5}
                            className="w-full px-4 py-3.5 rounded-xl text-gray-900 bg-gray-50 border-2 border-gray-200 focus:border-red-500 focus:bg-white focus:outline-none transition-all text-sm font-medium placeholder-gray-400 resize-none"
                            placeholder="Tell us more about what you're looking for..." />
                        </div>

                        <button type="submit" disabled={loading}
                          className="w-full inline-flex items-center justify-center gap-3 text-white font-black py-4 rounded-xl transition-all hover:scale-[1.02] hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed text-base"
                          style={{ background: 'linear-gradient(135deg,#c0392b,#96281b)', boxShadow: '0 8px 25px rgba(192,57,43,0.35)' }}>
                          {loading
                            ? <><span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Sending your message…</>
                            : <><Send className="w-5 h-5" /> Send Message</>
                          }
                        </button>

                        <p className="text-center text-xs text-gray-400">
                          By submitting, you agree to our <a href="#" className="text-red-600 hover:underline">Privacy Policy</a>
                        </p>
                      </form>
                    )}
                  </div>
                </div>
              </Reveal>
            </div>

          </div>
        </div>
      </section>

    </div>
  );
}