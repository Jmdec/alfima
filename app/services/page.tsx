'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  FileText, Scale, Building2, TrendingUp, Landmark, Paintbrush, HardHat,
  ArrowRight, Phone, Mail, CheckCircle2, ChevronDown,
} from 'lucide-react';

// ── Service definitions ───────────────────────────────────────────────────────
const SERVICES = [
  {
    id: 'leasing',
    icon: <FileText className="w-7 h-7" />,
    label: 'Leasing',
    tagline: 'Short & long-term lease solutions',
    description:
      'We handle the full leasing lifecycle — tenant screening, contract drafting, move-in coordination, and renewal negotiations — so landlords earn without the hassle.',
    highlights: [
      'Tenant background & credit checks',
      'Market-rate rent analysis',
      'Lease drafting & review',
      'Move-in / move-out inspection',
    ],
    accent: '#e8a8a0',
  },
  {
    id: 'legal-transfer',
    icon: <Scale className="w-7 h-7" />,
    label: 'Legal Transfer',
    tagline: 'Secure title & ownership transfers',
    description:
      'Our in-house legal team manages every document, bureau filing, and registry step required to transfer clean title with zero surprises.',
    highlights: [
      'Deed of Absolute Sale preparation',
      'BIR / Register of Deeds filing',
      'Tax clearance assistance',
      'Title consolidation & annotation',
    ],
    accent: '#d4a5a0',
  },
  {
    id: 'property-management',
    icon: <Building2 className="w-7 h-7" />,
    label: 'Property Management',
    tagline: 'Your property, expertly managed',
    description:
      'From maintenance scheduling to monthly reporting, we act as your on-the-ground property manager — protecting your asset and keeping tenants happy.',
    highlights: [
      'Monthly financial reporting',
      'Vendor & maintenance coordination',
      'Rent collection & arrears follow-up',
      '24/7 tenant support line',
    ],
    accent: '#e8a8a0',
  },
  {
    id: 'investment-services',
    icon: <TrendingUp className="w-7 h-7" />,
    label: 'Investment Services',
    tagline: 'Build wealth through real estate',
    description:
      'We identify high-yield opportunities, model returns, and guide investors through acquisition to exit — whether residential, commercial, or pre-selling.',
    highlights: [
      'Market & ROI analysis',
      'Portfolio diversification advice',
      'Pre-selling & RFO sourcing',
      'Joint venture facilitation',
    ],
    accent: '#d4a5a0',
  },
  {
    id: 'housing-loan',
    icon: <Landmark className="w-7 h-7" />,
    label: 'Housing Loan Application',
    tagline: 'Finance your dream home',
    description:
      'We partner with leading banks and Pag-IBIG to help buyers find the most favorable loan terms and shepherd them through every stage of the application.',
    highlights: [
      'Bank & Pag-IBIG loan assistance',
      'Loan eligibility pre-assessment',
      'Document checklist & preparation',
      'Approval follow-up & coordination',
    ],
    accent: '#e8a8a0',
  },
  {
    id: 'designs',
    icon: <Paintbrush className="w-7 h-7" />,
    label: 'Designs',
    tagline: 'Spaces that tell your story',
    description:
      'Our design team crafts floor plans, 3D renders, and interior concepts that balance beauty, function, and budget — from condo fit-outs to full-home renovations.',
    highlights: [
      'Architectural floor planning',
      'Photorealistic 3D rendering',
      'Interior design & mood boards',
      'Space planning consultation',
    ],
    accent: '#d4a5a0',
  },
  {
    id: 'construction',
    icon: <HardHat className="w-7 h-7" />,
    label: 'Construction',
    tagline: 'Built right. Built to last.',
    description:
      'From groundbreaking to turnover, our licensed contractors deliver residential and light-commercial builds on time, on budget, and to code.',
    highlights: [
      'New build & structural works',
      'Renovation & fit-out',
      'Bill-of-quantities costing',
      'Project management & inspections',
    ],
    accent: '#e8a8a0',
  },
];

// ── Stat ticker ───────────────────────────────────────────────────────────────
function StatTicker() {
  const items = [
    '7 Core Services',
    'Alfima Realty Inc.',
    'Licensed & Trusted',
  ];
  return (
    <div
      className="overflow-hidden whitespace-nowrap border-y py-2.5"
      style={{ background: 'rgba(0,0,0,0.2)', borderColor: 'rgba(232,168,160,0.2)' }}
    >
      <div className="inline-flex animate-marquee gap-16 text-xs font-bold tracking-[0.2em] uppercase" style={{ color: 'rgba(232,168,160,0.5)' }}>
        {[...Array(6)].map((_, i) => (
          <span key={i} className="flex items-center gap-8">
            {items.map((item, j) => (
              <span key={j} className="flex items-center gap-8">
                <span>{item}</span>
                {j < items.length - 1 && <span style={{ color: 'rgba(160,140,135,0.4)' }}>◆</span>}
              </span>
            ))}
          </span>
        ))}
      </div>
      <style>{`
        @keyframes marquee { from { transform: translateX(0) } to { transform: translateX(-50%) } }
        .animate-marquee { animation: marquee 30s linear infinite; }
      `}</style>
    </div>
  );
}

// ── Hero right panel ──────────────────────────────────────────────────────────
function HeroPanel() {
  const services = [
    {
      id: 'leasing', num: '01', label: 'Leasing', tag: '',
      photo: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=300&q=80',
      span: 1,
    },
    {
      id: 'legal', num: '02', label: 'Legal Transfer', tag: '',
      photo: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=300&q=80',
      span: 1,
    },
    {
      id: 'propman', num: '03', label: 'Property Mgmt', tag: '',
      photo: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=300&q=80',
      span: 1,
    },
    {
      id: 'invest', num: '04', label: 'Investment', tag: '',
      photo: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=300&q=80',
      span: 1,
    },
    {
      id: 'loan', num: '05', label: 'Housing Loan', tag: 'Bank & Pag-IBIG assistance',
      photo: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=500&q=80',
      span: 2,
    },
    {
      id: 'designs', num: '06', label: 'Designs', tag: '3D renders & floor plans',
      photo: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=500&q=80',
      span: 2,
    },
    {
      id: 'construction', num: '07', label: 'Construction', tag: 'New builds · Renovation · Project management · Fit-out',
      photo: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=800&q=80',
      span: 4,
    },
  ];

  return (
    <div className="relative flex flex-col gap-3 select-none">
      <p className="text-[10px] font-bold tracking-[0.35em] uppercase" style={{ fontFamily: 'monospace', color: 'rgba(232,168,160,0.5)' }}>
        Our 7 services
      </p>

      <div className="grid grid-cols-4 gap-2">
        {services.map(svc => (
          <div
            key={svc.id}
            className={`relative rounded-2xl overflow-hidden border transition-all duration-200 group ${
              svc.span === 4 ? 'col-span-4 h-[90px]' :
              svc.span === 2 ? 'col-span-2 h-[100px]' :
              'col-span-1 aspect-square'
            }`}
            style={{ borderColor: 'rgba(232,168,160,0.2)' }}
          >
            <img
              src={svc.photo}
              alt={svc.label}
              className="w-full h-full object-cover"
            />
            {/* Overlay */}
            <div
              className={`absolute inset-0 flex ${svc.span > 1 ? 'flex-row items-center gap-3 px-4' : 'flex-col justify-end p-2.5'}`}
              style={{
                background: svc.span > 1
                  ? 'linear-gradient(to right, rgba(90,61,71,0.88) 0%, rgba(70,45,55,0.55) 60%, rgba(0,0,0,0.1) 100%)'
                  : 'linear-gradient(to top, rgba(90,61,71,0.88) 0%, rgba(70,45,55,0.45) 55%, transparent 100%)',
              }}
            >
              {svc.span === 4 && (
                <div className="w-2 h-2 rounded-full shrink-0" style={{ background: 'rgba(232,168,160,0.7)' }} />
              )}
              <div>
                <p className="text-[9px] tracking-[0.2em] mb-0.5" style={{ fontFamily: 'monospace', color: 'rgba(232,168,160,0.5)' }}>
                  {svc.num}
                </p>
                <p className="text-[11px] font-bold text-white/92 leading-tight" style={{ fontFamily: 'monospace' }}>
                  {svc.label}
                </p>
                {svc.tag && (
                  <p className="text-[9px] mt-0.5 leading-tight" style={{ fontFamily: 'monospace', color: 'rgba(232,168,160,0.4)' }}>
                    {svc.tag}
                  </p>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="flex items-center gap-3">
        <div className="h-px flex-1" style={{ background: 'rgba(232,168,160,0.15)' }} />
        <span className="text-white/25 text-[9px] tracking-widest uppercase" style={{ fontFamily: 'monospace' }}>Trusted · Proven · Local</span>
        <div className="h-px flex-1" style={{ background: 'rgba(232,168,160,0.15)' }} />
      </div>

      <div className="flex flex-wrap gap-1.5">
        {['Metro Manila', 'Cebu', 'Davao', 'Cavite', 'Laguna', 'Batangas'].map(city => (
          <span key={city} className="px-2.5 py-1 rounded-full text-[9px] font-bold border text-white/50" style={{ background: 'rgba(0,0,0,0.2)', borderColor: 'rgba(232,168,160,0.15)', fontFamily: 'monospace' }}>
            {city}
          </span>
        ))}
      </div>
    </div>
  );
}

// ── Service card ──────────────────────────────────────────────────────────────
function ServiceCard({ svc, idx }: { svc: typeof SERVICES[0]; idx: number }) {
  const [open, setOpen] = useState(false);

  return (
    <div
      className="rounded-2xl border overflow-hidden transition-all duration-300 group"
      style={{
        background: 'linear-gradient(135deg, rgba(120,80,90,0.65) 0%, rgba(90,60,70,0.65) 100%)',
        boxShadow: open ? '0 0 40px rgba(232,168,160,0.15)' : 'none',
        borderColor: 'rgba(232,168,160,0.2)',
      }}
    >
      {/* Card header */}
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full text-left px-6 pt-6 pb-5 flex items-start gap-4"
      >
        {/* Icon badge */}
        <div
          className="shrink-0 w-14 h-14 rounded-xl flex items-center justify-center border transition-colors group-hover:border-opacity-80"
          style={{ background: 'rgba(0,0,0,0.3)', borderColor: 'rgba(232,168,160,0.3)' }}
        >
          <span style={{ color: 'rgba(232,168,160,0.8)' }}>{svc.icon}</span>
        </div>

        <div className="flex-1 min-w-0">
          <p
            className="text-[10px] font-bold tracking-[0.3em] uppercase mb-1"
            style={{ fontFamily: 'monospace', color: 'rgba(232,168,160,0.5)' }}
          >
            Service {String(idx + 1).padStart(2, '0')}
          </p>
          <h3
            className="text-white font-black text-xl leading-tight"
            style={{ fontFamily: 'Georgia, serif' }}
          >
            {svc.label}
          </h3>
          <p className="text-white/60 text-xs mt-1" style={{ fontFamily: 'monospace' }}>
            {svc.tagline}
          </p>
        </div>

        <ChevronDown
          className={`w-4 h-4 mt-2 shrink-0 transition-transform duration-300 ${open ? 'rotate-180' : ''}`}
          style={{ color: open ? 'rgba(232,168,160,0.8)' : 'rgba(255,255,255,0.3)' }}
        />
      </button>

      {/* Divider */}
      <div className="mx-6 h-px" style={{ background: 'rgba(255,255,255,0.08)' }} />

      {/* Expandable body */}
      <div
        className="overflow-hidden transition-all duration-300"
        style={{ maxHeight: open ? '400px' : '0px' }}
      >
        <div className="px-6 pt-5 pb-6 flex flex-col gap-4">
          <p className="text-white/75 text-sm leading-relaxed">{svc.description}</p>

          <ul className="flex flex-col gap-2">
            {svc.highlights.map(h => (
              <li key={h} className="flex items-center gap-2.5 text-sm text-white/85">
                <CheckCircle2 className="w-4 h-4 shrink-0" style={{ color: 'rgba(232,168,160,0.7)' }} />
                {h}
              </li>
            ))}
          </ul>

          <Link
            href="/contact"
            className="inline-flex items-center gap-2 text-white font-bold text-sm px-5 py-2.5 rounded-full self-start border transition-all"
            style={{ background: 'linear-gradient(135deg, #d4a5a0, #c49890)', borderColor: 'rgba(232,168,160,0.4)' }}
          >
            Inquire Now <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}

// ── Contact strip ─────────────────────────────────────────────────────────────
function ContactStrip() {
  return (
    <div
     
    >
      

     
    </div>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────
export default function ServicesPage() {
  const QUICK_LINKS = SERVICES.map(s => ({ label: s.label, value: s.id }));
  const [activeQuick, setActiveQuick] = useState('');

  const visibleServices = activeQuick
    ? SERVICES.filter(s => s.id === activeQuick)
    : SERVICES;

  return (
    <div className="w-full min-h-screen" style={{ background: 'linear-gradient(145deg,#3d1818 0%,#4a1f1f 50%,#2d1212 100%)', fontFamily: "'Georgia', serif" }}>

      {/* ── Hero ── */}
      <section
        className="relative pt-28 overflow-hidden"
        style={{ background: 'linear-gradient(145deg,#3d1818 0%,#4a1f1f 50%,#2d1212 100%)' }}
      >
        {/* Grid overlay */}
        <div className="absolute inset-0 opacity-[0.04]" style={{
          backgroundImage: 'repeating-linear-gradient(45deg, #fff 0px, #fff 1px, transparent 1px, transparent 12px)',
        }} />
        {/* Glow */}
        <div
          className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] opacity-20"
          style={{ background: 'radial-gradient(ellipse, #e8a8a0 0%, transparent 70%)' }}
        />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

          {/* Eyebrow */}
          <div className="flex items-center gap-3 mb-5">
            <div className="h-px flex-1 max-w-[40px]" style={{ background: 'rgba(232,168,160,0.4)' }} />
            <span
              className="text-[10px] font-bold tracking-[0.35em] uppercase"
              style={{ fontFamily: 'monospace', color: 'rgba(232,168,160,0.6)' }}
            >
              Alfima Realty Inc. · What We Offer
            </span>
          </div>

          {/* Two-column */}
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_420px] gap-8 items-start">

            {/* LEFT */}
            <div>
              <h1
                className="font-black leading-none mb-6 text-white"
                style={{
                  fontSize: 'clamp(3.5rem, 8vw, 7rem)',
                  letterSpacing: '-0.03em',
                  lineHeight: 0.9,
                }}
              >
                <span className="block">Our</span>
                <span
                  className="block"
                  style={{
                    WebkitTextStroke: '2px rgba(231,76,60,0.8)',
                    WebkitTextFillColor: 'transparent',
                  }}
                >
                  Services.
                </span>
              </h1>

              <p className="text-white/65 text-base mb-8 max-w-lg leading-relaxed" style={{ fontFamily: 'monospace' }}>
                End-to-end real estate solutions — from finding and financing your property to designing, building, and managing it.
              </p>

              {/* Quick-filter pills */}
              <div className="flex items-center gap-2 flex-wrap pb-8">
                <button
                  onClick={() => setActiveQuick('')}
                  className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold tracking-wide border transition-all duration-200 ${
                    activeQuick === ''
                      ? 'text-white'
                      : 'text-white/70 hover:text-white'
                  }`}
                  style={activeQuick === '' 
                    ? { background: 'linear-gradient(135deg, #d4a5a0, #c49890)', borderColor: 'rgba(232,168,160,0.5)', boxShadow: '0 0 20px rgba(232,168,160,0.3)' } 
                    : { background: 'rgba(255,255,255,0.06)', borderColor: 'rgba(255,255,255,0.15)' }}
                >
                  All Services
                </button>
                {QUICK_LINKS.map(f => (
                  <button
                    key={f.value}
                    onClick={() => setActiveQuick(v => v === f.value ? '' : f.value)}
                    className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold tracking-wide border transition-all duration-200 ${
                      activeQuick === f.value
                        ? 'text-white'
                        : 'text-white/70 hover:text-white'
                    }`}
                    style={
                      activeQuick === f.value
                        ? { background: 'linear-gradient(135deg, #d4a5a0, #c49890)', borderColor: 'rgba(232,168,160,0.5)', boxShadow: '0 0 20px rgba(232,168,160,0.3)' }
                        : { background: 'rgba(255,255,255,0.06)', borderColor: 'rgba(255,255,255,0.15)' }
                    }
                  >
                    {f.label}
                  </button>
                ))}
              </div>
            </div>

            {/* RIGHT */}
            <div className="hidden lg:block pb-0">
              <HeroPanel />
            </div>
          </div>
        </div>

        {/* Wave */}
        <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-none">
          <svg viewBox="0 0 1440 48" preserveAspectRatio="none" className="w-full h-12" fill="#6a4d57">
            <path d="M0,48 C480,0 960,48 1440,16 L1440,48 Z" />
          </svg>
        </div>
      </section>

      {/* ── Ticker ── */}
      <StatTicker />

      {/* ── Services grid ── */}
      <section className="py-10" style={{ background: 'linear-gradient(145deg,#3d1818 0%,#4a1f1f 50%,#2d1212 100%)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          {/* Toolbar */}
          <div className="flex items-center justify-between mb-8 flex-wrap gap-3">
            <div className="flex items-center gap-3">
              <div
                className="w-1 h-6 rounded-full"
                style={{ background: 'linear-gradient(to bottom, #e8a8a0, #d4a5a0)' }}
              />
              <p className="text-white/60 text-sm font-medium" style={{ fontFamily: 'monospace' }}>
                <span
                  className="text-white font-bold"
                  style={{ color: 'rgba(232,168,160,0.8)' }}
                >
                  {visibleServices.length}
                </span>
                {' '}Service{visibleServices.length !== 1 ? 's' : ''}
              </p>
            </div>
          </div>

          {/* Services */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {visibleServices.map((svc, idx) => (
              <ServiceCard key={svc.id} svc={svc} idx={idx} />
            ))}
          </div>
        </div>
      </section>

      {/* ── Contact ── */}
      <section className="py-16" style={{ background: 'linear-gradient(145deg,#3d1818 0%,#4a1f1f 50%,#2d1212 100%)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ContactStrip />
        </div>
      </section>
    </div>
  );
}
