import Link from 'next/link';
import { ArrowRight, Shield, Award, Star } from 'lucide-react';
import { DeviceMockups } from './DeviceMockups';
import { HeroSearch } from './HeroSearch';

interface HeroSectionProps {
  onSearch: (filters: any) => void;
}

export function HeroSection({ onSearch }: HeroSectionProps) {
  return (
    <section className="hero-section">
      <style>{`
        .hero-content-grid {
          position: relative;
          z-index: 1;
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 48px;
          padding: 80px 64px 40px;
          max-width: 1320px;
          margin: 0 auto;
          width: 100%;
          box-sizing: border-box;
          align-items: center;
        }

        .hero-device-col {
          display: flex;
          justify-content: center;
          align-items: center;
        }

        .hero-headline {
          font-family: 'Playfair Display', serif;
          font-size: clamp(40px, 4.5vw, 74px);
          font-weight: 900;
          line-height: 1.0;
          color: #fff;
          margin-bottom: 4px;
          letter-spacing: -0.02em;
        }

        .hero-headline-sub {
          display: block;
          font-family: 'DM Sans', sans-serif;
          font-size: clamp(18px, 2.2vw, 30px);
          font-weight: 300;
          color: rgba(255,255,255,0.55);
          margin-top: 6px;
        }

        .hero-description {
          color: rgba(255,255,255,0.6);
          font-size: 15px;
          line-height: 1.75;
          margin: 22px 0 28px;
          max-width: 430px;
        }

        .hero-trust-badges {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
          margin-bottom: 32px;
        }

        .hero-ctas {
          display: flex;
          gap: 12px;
          flex-wrap: wrap;
          margin-bottom: 48px;
        }

        .hero-stats {
          display: flex;
          gap: 40px;
          padding-top: 24px;
          border-top: 1px solid rgba(255,255,255,0.1);
        }

        .hero-stat-item {
          display: flex;
          align-items: flex-start;
          gap: 40px;
        }

        .hero-stat-value {
          font-family: 'Playfair Display', serif;
          font-size: 28px;
          font-weight: 700;
          color: #fff;
        }

        .hero-stat-label {
          font-size: 12px;
          color: rgba(255,255,255,0.4);
          margin-top: 2px;
        }

        /* ── Tablet: 768px–1024px ─────────────────────────── */
        @media (max-width: 1024px) {
          .hero-content-grid {
            grid-template-columns: 1fr;
            gap: 32px;
            padding: 60px 32px 32px;
          }

          .hero-device-col {
            display: none;
          }

          .hero-description {
            max-width: 100%;
          }
        }

        /* ── Mobile: ≤768px ───────────────────────────────── */
        @media (max-width: 768px) {
          .hero-content-grid {
            padding: 48px 20px 24px;
            gap: 24px;
          }

          .hero-description {
            font-size: 14px;
            margin: 16px 0 20px;
          }

          .hero-trust-badges {
            gap: 6px;
            margin-bottom: 24px;
          }

          .hero-ctas {
            gap: 10px;
            margin-bottom: 32px;
          }

          .hero-stats {
            gap: 20px;
            flex-wrap: wrap;
          }

          .hero-stat-item {
            gap: 20px;
          }

          .hero-stat-value {
            font-size: 22px;
          }

          .hero-stat-label {
            font-size: 11px;
          }
        }

        /* ── Small mobile: ≤480px ─────────────────────────── */
        @media (max-width: 480px) {
          .hero-content-grid {
            padding: 40px 16px 20px;
          }

          .hero-stats {
            gap: 16px;
          }
        }
      `}</style>

      {/* ── Video Background ─────────────────────────────────── */}
      <div className="hero-bg">
        <video
          className="hero-bg-video"
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          poster="https://assets.mixkit.co/videos/44690/44690-thumb-720-0.jpg"
        >
          <source
            src="https://assets.mixkit.co/videos/44690/44690-1080.mp4"
            type="video/mp4"
          />
          <img
            src="https://images.unsplash.com/photo-1582407947304-fd86f028f716?w=1800&h=1000&fit=crop&auto=format&q=85"
            alt=""
          />
        </video>
        <div className="hero-bg-overlay" />
        <div className="hero-vignette" />
      </div>

      {/* ── Content grid ─────────────────────────────────────── */}
      <div className="hero-content-grid">
        {/* LEFT: Copy */}
        <div>
          {/* Badge */}
          <div
            className="inline-flex items-center gap-2"
            style={{
              background: 'rgba(192,57,43,0.2)',
              border: '1px solid rgba(220,80,60,0.45)',
              borderRadius: 100,
              padding: '6px 16px',
              marginBottom: 32,
            }}
          >
            <div
              className="badge-dot-anim"
              style={{ width: 7, height: 7, background: '#e74c3c', borderRadius: '50%' }}
            />
            <span style={{
              fontSize: 11,
              fontWeight: 700,
              color: '#f1948a',
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
            }}>
              #1 Realty in the Philippines
            </span>
          </div>

          {/* Headline */}
          <h1 className="hero-headline">
            Find Your
            <span style={{
              display: 'block',
              background: 'linear-gradient(135deg, #e74c3c 0%, #ff7043 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}>
              Dream Home
            </span>
            <span className="hero-headline-sub">
              with Alfima Realty
            </span>
          </h1>

          <p className="hero-description">
            We make your dreams come true. Discover thousands of premium properties across the
            Philippines — backed by licensed brokers and trusted by thousands of Filipino families.
          </p>

          {/* Trust badges */}
          <div className="hero-trust-badges">
            {[
              { icon: <Shield size={13} />, label: 'Licensed Brokers' },
              { icon: <Award size={13} />, label: 'Award-Winning' },
              { icon: <Star size={13} />, label: '4.9★ Rated' },
            ].map((b) => (
              <div
                key={b.label}
                className="flex items-center gap-1.5"
                style={{
                  background: 'rgba(255,255,255,0.09)',
                  border: '1px solid rgba(255,255,255,0.16)',
                  borderRadius: 100,
                  padding: '7px 16px',
                }}
              >
                <span style={{ color: '#e74c3c' }}>{b.icon}</span>
                <span style={{ fontSize: 12, fontWeight: 500, color: 'rgba(255,255,255,0.85)' }}>
                  {b.label}
                </span>
              </div>
            ))}
          </div>

          {/* CTAs */}
          <div className="hero-ctas">
            <Link href="/properties">
              <button className="hero-btn-primary">
                Browse Properties <ArrowRight size={16} />
              </button>
            </Link>
            <Link href="/about">
              <button className="hero-btn-secondary">Learn More</button>
            </Link>
          </div>

          {/* Stats */}
          <div className="hero-stats">
            {[
              { value: '500+', label: 'Listings' },
              { value: '90+', label: 'Expert Agents' },
              { value: '10K+', label: 'Happy Clients' },
            ].map((s, i) => (
              <div key={s.label} className="hero-stat-item">
                {i > 0 && (
                  <div style={{ width: 1, background: 'rgba(255,255,255,0.1)', alignSelf: 'stretch' }} />
                )}
                <div>
                  <p className="hero-stat-value">{s.value}</p>
                  <p className="hero-stat-label">{s.label}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* RIGHT: Devices (hidden on mobile/tablet) */}
        <div className="hero-device-col">
          <DeviceMockups />
        </div>
      </div>

      {/* ── Search Bar ───────────────────────────────────────── */}
      <HeroSearch onSearch={onSearch} />

    </section>
  );
}