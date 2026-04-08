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

function FloatingParticles() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {[...Array(10)].map((_, i) => (
        <div key={i} className="absolute rounded-full" style={{
          width: `${3 + (i % 4) * 2}px`, height: `${3 + (i % 4) * 2}px`,
          left: `${(i * 10.3) % 100}%`, top: `${(i * 13.7) % 100}%`,
          background: i % 2 === 0 ? 'rgba(232,168,160,0.4)' : 'rgba(255,255,255,0.15)',
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

  const trustBadges = [
    { icon: <Shield   className="w-3 h-3" />, text: 'PRC Licensed' },
    { icon: <Star     className="w-3 h-3" />, text: '4.9★ Rated' },
    { icon: <CheckCircle className="w-3 h-3" />, text: 'HLURB Accredited' },
    { icon: <Award    className="w-3 h-3" />, text: 'Award-Winning' },
  ];

  const quickInfo = [
    { icon: <Building2 className="w-3.5 h-3.5" />, text: '10+ Years in Business' },
    { icon: <MapPin    className="w-3.5 h-3.5" />, text: '20+ Cities' },
    { icon: <Zap       className="w-3.5 h-3.5" />, text: 'Philippines-Wide' },
  ];

  return (
    <div className="w-full min-h-screen" style={{ background: 'linear-gradient(145deg,#3d1818 0%,#4a1f1f 50%,#2d1212 100%)' }}>
      <style>{`
        @keyframes float-p0{0%,100%{transform:translateY(0)}50%{transform:translateY(-18px)}}
        @keyframes float-p1{0%,100%{transform:translateY(0)}50%{transform:translateY(-12px)}}
        @keyframes float-p2{0%,100%{transform:translateY(0)}50%{transform:translateY(-22px)}}
        @keyframes shimmer{0%{left:-100%}100%{left:200%}}
      `}</style>

      {/* ══════════════════════════════
           HERO — rich burgundy/maroon
         ══════════════════════════════ */}
      <section className="relative pt-32 pb-28 overflow-hidden"
        style={{ background: 'linear-gradient(145deg,#3d1818 0%,#4a1f1f 50%,#2d1212 100%)' }}>

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
                  <div className="h-px w-10" style={{background:'linear-gradient(90deg,#e8a8a0,#d4a5a0)'}} />
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
                  <Link href="/">
                    <button className="inline-flex items-center gap-2 bg-white text-red-800 font-black px-7 py-3.5 rounded-full hover:bg-red-50 shadow-xl hover:scale-105 hover:shadow-2xl transition-all duration-200">
                      Browse Services <ArrowRight className="w-4 h-4" />
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

            {/* RIGHT — hero image */}
            <div style={{ opacity: heroIn ? 1 : 0, transform: heroIn ? 'none' : 'translateX(50px)', transition: 'opacity .8s ease 400ms, transform .8s ease 400ms' }}>
              <img 
                src="/hero-background.jpg" 
                alt="Alfima Realty Stats" 
                className="w-full h-auto rounded-2xl shadow-2xl hover:scale-105 transition-transform duration-300"
              />
            </div>

          </div>
        </div>

        {/* Wave to burgundy/tan */}
         <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-none">
          <svg viewBox="0 0 1440 48" preserveAspectRatio="none" className="w-full h-12" fill="#6a4d57">
            <path d="M0,48 C480,0 960,48 1440,16 L1440,48 Z" />
          </svg>
        </div>
      </section>

      {/* ══════════════════════════════
           WHO WE ARE — light bg
         ══════════════════════════════ */}
      <section className="py-24" style={{ background: 'linear-gradient(145deg,#3d1818 0%,#4a1f1f 50%,#2d1212 100%)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <Reveal dir="left">
              <div className="relative">
                <div className="rounded-3xl p-10 border-2 border-red-400/40 hover:border-red-400/60 transition-all duration-500 shadow-lg hover:shadow-xl"
                  style={{ background: 'rgba(61,24,24,0.5)', backdropFilter: 'blur(12px)' }}>
                  <div className="h-1 w-20 rounded-full mb-8" style={{ background: 'linear-gradient(90deg,#e74c3c,#ff8080)' }} />
                  <div className="w-16 h-16 rounded-2xl overflow-hidden mb-6 shadow-xl ring-2 ring-red-400/60 hover:scale-110 transition-transform duration-300">
                    <img src="/alfima.png" alt="Alfima" className="w-full h-full object-cover" />
                  </div>
                  <h3 className="text-2xl font-black text-white mb-4">Alfima Realty Inc.</h3>
                  <p className="text-white/70 leading-relaxed mb-6">A licensed and accredited real estate brokerage firm operating across the Philippines, specializing in residential, commercial, and investment properties.</p>
                  <div className="flex flex-wrap gap-2">
                    {['PRC Licensed', 'HLURB Accredited', 'Trusted Since Day One'].map(t => (
                      <span key={t} className="px-3 py-1.5 rounded-full text-xs font-bold border"
                        style={{ background: 'rgba(231,76,60,0.3)', color: '#ff8080', borderColor: 'rgba(231,76,60,0.5)' }}>{t}</span>
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
                <h2 className="text-4xl font-black text-white mb-6 leading-tight">Your Trusted Partner<br />in Real Estate</h2>
                <div className="space-y-4 text-white/70 text-base leading-relaxed">
                  <p>At Alfima Realty Inc., we understand that a property is more than just a structure — it&apos;s a home, a milestone, and a legacy. We go beyond transactions to build lasting relationships.</p>
                  <p>Our licensed brokers bring deep local knowledge to guide you through every step — buying, selling, or leasing.</p>
                  <p>First-time buyer, seasoned investor, or business owner — Alfima has the network to get it done right.</p>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════
           VALUES — dark maroon band
         ══════════════════════════════ */}
      <section className="py-24 relative overflow-hidden"
        style={{ background: 'linear-gradient(145deg,#3d1818 0%,#4a1f1f 50%,#2d1212 100%)' }}>
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
      <section className="py-24" style={{ background: 'linear-gradient(145deg,#3d1818 0%,#4a1f1f 50%,#2d1212 100%)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Reveal>
            <div className="text-center mb-14">
              <div className="inline-flex items-center gap-3 mb-4 justify-center">
                <div className="h-px w-10 bg-red-500" />
                <span className="text-red-500 text-xs font-black tracking-[0.2em] uppercase">Why Alfima</span>
                <div className="h-px w-10 bg-red-500" />
              </div>
              <h2 className="text-4xl font-black text-white">Why Choose Us</h2>
            </div>
          </Reveal>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
            {[
              { number: '01', title: 'Local Expertise',    desc: 'Deep knowledge of Philippine real estate markets, from Metro Manila to provincial hotspots.', icon: <MapPin      className="w-6 h-6" />, bg: '#c0392b' },
              { number: '02', title: 'Verified Listings',  desc: 'Every property is verified by our team to ensure accuracy, legality, and fair pricing.',     icon: <CheckCircle className="w-6 h-6" />, bg: '#e74c3c' },
              { number: '03', title: 'End-to-End Support', desc: 'From property search to title transfer, we guide you through every step of the process.',     icon: <Home        className="w-6 h-6" />, bg: '#a93226' },
            ].map(({ number, title, desc, icon, bg }, i) => (
              <Reveal key={number} delay={i * 150} dir={i === 0 ? 'left' : i === 2 ? 'right' : 'up'}>
                <div className="group rounded-2xl p-8 hover:-translate-y-3 hover:shadow-2xl transition-all duration-300 cursor-default border border-white/25 hover:border-white/50 h-full flex flex-col"
                  style={{ background: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(12px)' }}>
                  <div className="text-red-200/60 text-sm font-black mb-4">{number}</div>
                  <h3 className="text-white font-black text-lg mb-3">{title}</h3>
                  <p className="text-white/85 text-sm leading-relaxed mb-6 flex-grow">{desc}</p>
                  <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ background: bg + '40', color: bg }}>
                    {icon}
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════
           CTA — final call-to-action
         ══════════════════════════════ */}
      <section className="py-24 relative overflow-hidden"
        style={{ background: 'linear-gradient(145deg,#7a1818 0%,#a02020 35%,#7a1818 65%,#4a0e0e 100%)' }}>
        <div className="absolute inset-0 opacity-10"
          style={{ backgroundImage: 'radial-gradient(circle at 1px 1px,rgba(255,255,255,0.5) 1px,transparent 0)', backgroundSize: '30px 30px' }} />
        <FloatingParticles />

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <Reveal>
            <h2 className="text-4xl sm:text-5xl font-black text-white mb-6">Ready to Find Your Dream Property?</h2>
          </Reveal>
          <Reveal delay={150}>
            <p className="text-white/80 text-lg mb-10 max-w-2xl mx-auto">Let our team of licensed professionals guide you through the journey. Whether you&apos;re buying, selling, or investing, we&apos;re here to help.</p>
          </Reveal>
          <Reveal delay={300}>
            <div className="flex gap-4 justify-center flex-wrap">
              <Link href="/">
                <button className="inline-flex items-center gap-2 bg-white text-red-800 font-black px-8 py-4 rounded-full hover:bg-red-50 shadow-xl hover:scale-105 hover:shadow-2xl transition-all duration-200">
                  Explore Services <ArrowRight className="w-4 h-4" />
                </button>
              </Link>
              <Link href="/contact">
                <button className="inline-flex items-center gap-2 border-2 border-white/50 hover:border-white text-white font-bold px-8 py-4 rounded-full hover:bg-white/10 hover:scale-105 transition-all duration-200">
                  Get in Touch
                </button>
              </Link>
            </div>
          </Reveal>
        </div>
      </section>
    </div>
  );
}
