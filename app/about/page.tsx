'use client';

import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { Award, Users, MapPin, TrendingUp, Shield, Star, Phone, ArrowRight, CheckCircle, Home, Zap, Building2 } from 'lucide-react';

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

function useCounter(target: number, duration = 1800, started = false) {
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

function Reveal({ children, delay = 0, dir = 'up', className = '' }: {
  children: React.ReactNode; delay?: number; dir?: 'up' | 'left' | 'right'; className?: string;
}) {
  const { ref, visible } = useReveal();
  const t = dir === 'left' ? 'translateX(-50px)' : dir === 'right' ? 'translateX(50px)' : 'translateY(45px)';
  return (
    <div ref={ref} className={className}
      style={{ opacity: visible ? 1 : 0, transform: visible ? 'none' : t, transition: `opacity .7s ease ${delay}ms, transform .7s ease ${delay}ms` }}>
      {children}
    </div>
  );
}

/* Animated stat card with colored icon box */
function StatCard({ value, suffix, label, icon, delay = 0 }: {
  value: number; suffix: string; label: string; icon: React.ReactNode; delay?: number;
}) {
  const { ref, visible } = useReveal(0.3);
  const count = useCounter(value, 1800, visible);
  return (
    <div ref={ref}
      className="rounded-2xl p-5 border border-white/15 hover:scale-105 hover:-translate-y-1 transition-all duration-300 cursor-default group"
      style={{
        background: 'rgba(0,0,0,0.28)', backdropFilter: 'blur(12px)',
        opacity: visible ? 1 : 0, transform: visible ? 'translateY(0)' : 'translateY(30px)',
        transition: `opacity .7s ease ${delay}ms, transform .7s ease ${delay}ms`,
      }}>
      {/* ② Colored icon box */}
      <div className="w-9 h-9 rounded-xl flex items-center justify-center mb-4 text-white group-hover:scale-110 transition-transform duration-300"
        style={{ background: 'rgba(231,76,60,0.55)', border: '1px solid rgba(231,76,60,0.4)' }}>
        {icon}
      </div>
      <div className="text-3xl font-black text-white mb-1 leading-none">{count}{suffix}</div>
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

export default function AboutPage() {
  const [heroIn, setHeroIn] = useState(false);
  useEffect(() => { setTimeout(() => setHeroIn(true), 80); }, []);

  /* ① Trust badges */
  const trustBadges = [
    { icon: <Shield   className="w-3 h-3" />, text: 'PRC Licensed' },
    { icon: <Star     className="w-3 h-3" />, text: '4.9★ Rated' },
    { icon: <CheckCircle className="w-3 h-3" />, text: 'HLURB Accredited' },
    { icon: <Award    className="w-3 h-3" />, text: 'Award-Winning' },
  ];

  /* ④ Quick-info strip */
  const quickInfo = [
    { icon: <Building2 className="w-3.5 h-3.5" />, text: '10+ Years in Business' },
    { icon: <MapPin    className="w-3.5 h-3.5" />, text: '20+ Cities' },
    { icon: <Zap       className="w-3.5 h-3.5" />, text: 'Philippines-Wide' },
  ];

  return (
    <div className="w-full min-h-screen bg-white">
      <style>{`
        @keyframes float-p0{0%,100%{transform:translateY(0)}50%{transform:translateY(-18px)}}
        @keyframes float-p1{0%,100%{transform:translateY(0)}50%{transform:translateY(-12px)}}
        @keyframes float-p2{0%,100%{transform:translateY(0)}50%{transform:translateY(-22px)}}
        @keyframes shimmer{0%{left:-100%}100%{left:200%}}
      `}</style>

      {/* ══════════════════════════════
           HERO — red/dark, stays rich
         ══════════════════════════════ */}
      <section className="relative pt-32 pb-28 overflow-hidden"
        style={{ background: 'linear-gradient(145deg,#7a1818 0%,#a02020 35%,#7a1818 65%,#4a0e0e 100%)' }}>

        {/* dot grid */}
        <div className="absolute inset-0 opacity-10"
          style={{ backgroundImage: 'radial-gradient(circle at 1px 1px,rgba(255,255,255,0.5) 1px,transparent 0)', backgroundSize: '30px 30px' }} />

        {/* glow blob */}
        <div className="absolute top-0 right-0 w-[600px] h-[600px] opacity-30"
          style={{ background: 'radial-gradient(circle,#e74c3c 0%,transparent 65%)' }} />

        {/* shimmer sweep */}
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
                  <span className="text-red-200 text-xs font-black tracking-[0.2em] uppercase">Est. Since Day One</span>
                </div>
              </div>

              {/* Headline */}
              <div style={{ opacity: heroIn ? 1 : 0, transform: heroIn ? 'none' : 'translateY(35px)', transition: 'opacity .8s ease 150ms, transform .8s ease 150ms' }}>
                <h1 className="text-5xl sm:text-6xl font-black text-white leading-tight mb-5 drop-shadow-xl">
                  About<br />
                  <span className="text-red-300">Alfima</span>{' '}
                  <span className="text-white/50">Realty</span>
                </h1>
              </div>

              {/* Paragraph */}
              <div style={{ opacity: heroIn ? 1 : 0, transform: heroIn ? 'none' : 'translateY(35px)', transition: 'opacity .8s ease 250ms, transform .8s ease 250ms' }}>
                <p className="text-white/80 text-lg leading-relaxed max-w-lg mb-5">
                  Alfima Realty Inc. is a trusted real estate company dedicated to helping Filipinos find their dream homes, investment properties, and commercial spaces — with integrity, expertise, and a personal touch.
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
                  <Link href="/properties">
                    <button className="inline-flex items-center gap-2 bg-white text-red-800 font-black px-7 py-3.5 rounded-full hover:bg-red-50 shadow-xl hover:scale-105 hover:shadow-2xl transition-all duration-200">
                      Browse Properties <ArrowRight className="w-4 h-4" />
                    </button>
                  </Link>
                  <Link href="/contact">
                    <button className="inline-flex items-center gap-2 border-2 border-white/50 hover:border-white text-white font-bold px-7 py-3.5 rounded-full hover:bg-white/10 hover:scale-105 transition-all duration-200">
                      Contact Us
                    </button>
                  </Link>
                </div>
              </div>
            </div>

            {/* RIGHT — stat cards with ② colored icon boxes */}
            <div className="grid grid-cols-2 gap-4">
              <StatCard value={10}  suffix="+" label="Years in Business" icon={<TrendingUp className="w-4 h-4" />} delay={200} />
              <StatCard value={500} suffix="+" label="Properties Sold"   icon={<Award      className="w-4 h-4" />} delay={350} />
              <StatCard value={300} suffix="+" label="Happy Clients"     icon={<Users      className="w-4 h-4" />} delay={500} />
              <StatCard value={20}  suffix="+" label="Cities Covered"    icon={<MapPin     className="w-4 h-4" />} delay={650} />
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

      {/* ══════════════════════════════
           WHO WE ARE — light bg
         ══════════════════════════════ */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <Reveal dir="left">
              <div className="relative">
                <div className="rounded-3xl p-10 border-2 border-red-100 hover:border-red-300 transition-all duration-500 shadow-lg hover:shadow-xl"
                  style={{ background: 'linear-gradient(135deg,#fff5f5 0%,#fff 100%)' }}>
                  <div className="h-1 w-20 rounded-full mb-8" style={{ background: 'linear-gradient(90deg,#e74c3c,#ff8080)' }} />
                  <div className="w-16 h-16 rounded-2xl overflow-hidden mb-6 shadow-xl ring-2 ring-red-200 hover:scale-110 transition-transform duration-300">
                    <img src="/alfima.png" alt="Alfima" className="w-full h-full object-cover" />
                  </div>
                  <h3 className="text-2xl font-black text-gray-900 mb-4">Alfima Realty Inc.</h3>
                  <p className="text-gray-600 leading-relaxed mb-6">A licensed and accredited real estate brokerage firm operating across the Philippines, specializing in residential, commercial, and investment properties.</p>
                  <div className="flex flex-wrap gap-2">
                    {['PRC Licensed', 'HLURB Accredited', 'Trusted Since Day One'].map(t => (
                      <span key={t} className="px-3 py-1.5 rounded-full text-xs font-bold border"
                        style={{ background: '#fff0f0', color: '#c0392b', borderColor: '#fcc' }}>{t}</span>
                    ))}
                  </div>
                </div>
                <div className="absolute -bottom-4 -right-4 w-40 h-40 rounded-full -z-10"
                  style={{ background: 'radial-gradient(circle,rgba(200,40,40,0.08) 0%,transparent 70%)' }} />
              </div>
            </Reveal>

            <Reveal dir="right" delay={150}>
              <div>
                <div className="inline-flex items-center gap-2 mb-5">
                  <div className="h-px w-8 bg-red-500" />
                  <span className="text-red-500 text-xs font-black tracking-[0.2em] uppercase">Who We Are</span>
                </div>
                <h2 className="text-4xl font-black text-gray-900 mb-6 leading-tight">Your Trusted Partner<br />in Real Estate</h2>
                <div className="space-y-4 text-gray-600 text-base leading-relaxed">
                  <p>At Alfima Realty Inc., we understand that a property is more than just a structure — it's a home, a milestone, and a legacy. We go beyond transactions to build lasting relationships.</p>
                  <p>Our licensed brokers bring deep local knowledge to guide you through every step — buying, selling, or leasing.</p>
                  <p>First-time buyer, seasoned investor, or business owner — Alfima has the network to get it done right.</p>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════
           VALUES — red band
         ══════════════════════════════ */}
      <section className="py-24 relative overflow-hidden"
        style={{ background: 'linear-gradient(160deg,#8b1a1a 0%,#a52020 40%,#8b1a1a 70%,#6b1414 100%)' }}>
        <div className="absolute inset-0 opacity-10"
          style={{ backgroundImage: 'radial-gradient(circle at 1px 1px,rgba(255,255,255,0.5) 1px,transparent 0)', backgroundSize: '28px 28px' }} />
        <FloatingParticles />
        <div className="absolute top-0 left-0 w-full overflow-hidden rotate-180">
          <svg viewBox="0 0 1440 70" preserveAspectRatio="none" className="w-full h-14" fill="white">
            <path d="M0,70 C480,0 960,70 1440,20 L1440,70 Z" />
          </svg>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <Reveal>
            <div className="text-center mb-14">
              <div className="inline-flex items-center gap-3 mb-4 justify-center">
                <div className="h-px w-10 bg-white/60" />
                <span className="text-white text-xs font-black tracking-[0.2em] uppercase">What Drives Us</span>
                <div className="h-px w-10 bg-white/60" />
              </div>
              <h2 className="text-4xl font-black text-white drop-shadow-lg">Our Core Values</h2>
            </div>
          </Reveal>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: <Shield     className="w-7 h-7" />, title: 'Integrity',    desc: 'Full transparency and honesty in every deal we make.' },
              { icon: <Star       className="w-7 h-7" />, title: 'Excellence',   desc: 'Highest professional standards in service and expertise.' },
              { icon: <Users      className="w-7 h-7" />, title: 'Client-First', desc: 'Your goals are our goals. We listen, then deliver.' },
              { icon: <TrendingUp className="w-7 h-7" />, title: 'Growth',       desc: 'Continuously improving to get you the best outcomes.' },
            ].map(({ icon, title, desc }, i) => (
              <Reveal key={title} delay={i * 120}>
                <div className="group rounded-2xl p-8 hover:-translate-y-3 hover:shadow-2xl transition-all duration-300 cursor-default border border-white/25 hover:border-white/50"
                  style={{ background: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(12px)' }}>
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-5 bg-white/25 text-white group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300">
                    {icon}
                  </div>
                  <h3 className="text-white font-black text-lg mb-3">{title}</h3>
                  <p className="text-white/85 text-sm leading-relaxed">{desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>

        <div className="absolute bottom-0 left-0 w-full overflow-hidden">
          <svg viewBox="0 0 1440 70" preserveAspectRatio="none" className="w-full h-14" fill="white">
            <path d="M0,70 C480,0 960,70 1440,20 L1440,70 Z" />
          </svg>
        </div>
      </section>

      {/* ══════════════════════════════
           WHY CHOOSE US — light bg
         ══════════════════════════════ */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Reveal>
            <div className="text-center mb-14">
              <div className="inline-flex items-center gap-3 mb-4 justify-center">
                <div className="h-px w-10 bg-red-500" />
                <span className="text-red-500 text-xs font-black tracking-[0.2em] uppercase">Why Alfima</span>
                <div className="h-px w-10 bg-red-500" />
              </div>
              <h2 className="text-4xl font-black text-gray-900">Why Choose Us</h2>
            </div>
          </Reveal>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
            {[
              { number: '01', title: 'Local Expertise',    desc: 'Deep knowledge of Philippine real estate markets, from Metro Manila to provincial hotspots.', icon: <MapPin      className="w-6 h-6" />, bg: '#c0392b' },
              { number: '02', title: 'Verified Listings',  desc: 'Every property is verified by our team to ensure accuracy, legality, and fair pricing.',     icon: <CheckCircle className="w-6 h-6" />, bg: '#e74c3c' },
              { number: '03', title: 'End-to-End Support', desc: 'From property search to title transfer, we guide you through every step of the process.',     icon: <Home        className="w-6 h-6" />, bg: '#a93226' },
            ].map(({ number, title, desc, icon, bg }, i) => (
              <Reveal key={number} delay={i * 150} dir={i === 0 ? 'left' : i === 2 ? 'right' : 'up'}>
                <div className="relative rounded-2xl overflow-hidden hover:-translate-y-3 hover:shadow-2xl transition-all duration-300 group cursor-default h-full flex flex-col border border-gray-100">
                  <div className="h-2 w-full flex-shrink-0" style={{ background: bg }} />
                  <div className="p-8 bg-white flex flex-col flex-1">
                    <div className="flex items-start justify-between mb-6">
                      <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-white shadow-lg flex-shrink-0 group-hover:scale-110 transition-transform duration-300"
                        style={{ background: bg }}>
                        {icon}
                      </div>
                      <span className="text-7xl font-black leading-none select-none" style={{ color: `${bg}18` }}>{number}</span>
                    </div>
                    <div className="text-xs font-black tracking-[0.2em] uppercase mb-3" style={{ color: bg }}>{number}</div>
                    <h3 className="text-gray-900 font-black text-xl mb-3">{title}</h3>
                    <p className="text-gray-500 text-sm leading-relaxed flex-1">{desc}</p>
                    <div className="h-1 w-0 group-hover:w-full mt-6 rounded-full transition-all duration-500 flex-shrink-0" style={{ background: bg }} />
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════
           CTA — red band
         ══════════════════════════════ */}
      <section className="py-24 px-4 relative overflow-hidden"
        style={{ background: 'linear-gradient(145deg,#8b1a1a 0%,#a52020 50%,#6b1414 100%)' }}>
        <FloatingParticles />
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <Reveal>
            <div className="inline-flex items-center gap-3 mb-5 justify-center">
              <div className="h-px w-10 bg-white/50" />
              <span className="text-white/80 text-xs font-black tracking-[0.2em] uppercase">Let's Get Started</span>
              <div className="h-px w-10 bg-white/50" />
            </div>
            <h2 className="text-4xl sm:text-5xl font-black text-white mb-5 drop-shadow-xl">
              Ready to Find Your<br />Dream Property?
            </h2>
            <p className="text-white/80 text-lg mb-10 max-w-xl mx-auto">
              Let Alfima Realty Inc. guide you home. Talk to one of our licensed agents today.
            </p>
            <div className="flex gap-4 justify-center flex-wrap">
              <Link href="/properties">
                <button className="inline-flex items-center gap-2 bg-white text-red-800 font-black px-8 py-4 rounded-full hover:bg-red-50 shadow-xl hover:scale-105 hover:shadow-2xl transition-all duration-200 text-base">
                  Browse Properties <ArrowRight className="w-5 h-5" />
                </button>
              </Link>
              <Link href="/contact">
                <button className="inline-flex items-center gap-2 border-2 border-white/50 hover:border-white text-white font-bold px-8 py-4 rounded-full hover:bg-white/10 hover:scale-105 transition-all duration-200 text-base">
                  <Phone className="w-5 h-5" /> Get in Touch
                </button>
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

    </div>
  );
}