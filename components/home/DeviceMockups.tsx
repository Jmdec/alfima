import { Home, TrendingUp } from 'lucide-react';

const MOCK_PROPS = [
  {
    img: 'https://images.unsplash.com/photo-1598228723793-52759bba239c?w=800&h=600&fit=crop&auto=format',
    title: 'Modern Penthouse',
    price: '₱2.5M',
    loc: 'Makati City',
    tag: 'For Sale',
    tagColor: '#c0392b',
  },
  {
    img: 'https://images.unsplash.com/photo-1583608205776-bfd35f0d9f83?w=200&h=120&fit=crop&auto=format&q=80',
    title: 'Suburban Estate',
    price: '₱1.8M',
    loc: 'BGC, Taguig',
    tag: 'For Sale',
    tagColor: '#c0392b',
  },
  {
    img: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=200&h=120&fit=crop&auto=format&q=80',
    title: 'Investment Condo',
    price: '₱650K',
    loc: 'Pasig City',
    tag: 'For Rent',
    tagColor: '#2471a3',
  },
];

export function DeviceMockups() {
  return (
    <div
      className="hidden lg:block"
      style={{
        position: 'relative',
        width: '100%',
        height: 620,
      }}
    >
      <style>{`
        /* ── Laptop frame ─────────────────────── */
        .dm-laptop {
          position: absolute;
          /* sit on the left, leave room for phone overlap on the right */
          left: 0;
          top: 50%;
          transform: translateY(-50%);
          width: 72%;          /* ~72% of the column = ~430–480px on typical screens */
          max-width: 480px;
          min-width: 340px;
          z-index: 3;
        }

        /* ── Phone frame ──────────────────────── */
        .dm-phone {
          position: absolute;
          right: 0;
          top: 50%;
          transform: translateY(-50%);
          width: 26%;
          max-width: 175px;
          min-width: 140px;
          z-index: 6;
        }

        /* Phone outer shell */
        .dm-phone-shell {
          position: relative;
          width: 100%;
          aspect-ratio: 9 / 19.5;   /* realistic phone ratio */
          background: linear-gradient(145deg, #2e2e50 0%, #1a1a2e 100%);
          border-radius: 28px;
          border: 2px solid rgba(255,255,255,0.15);
          box-shadow:
            0 0 0 1px rgba(0,0,0,0.5),
            0 24px 60px rgba(0,0,0,0.6),
            inset 0 1px 0 rgba(255,255,255,0.12);
          overflow: hidden;
        }

        /* Screen inset */
        .dm-phone-screen {
          position: absolute;
          inset: 6px;
          border-radius: 22px;
          overflow: hidden;
          background: #1a1a2e;
          display: flex;
          flex-direction: column;
        }

        /* ── Float cards ──────────────────────── */
        .dm-float-new {
          position: absolute;
          bottom: 60px;
          left: -10px;
          z-index: 10;
        }
        .dm-float-stats {
          position: absolute;
          top: 40px;
          left: 38%;
          z-index: 10;
        }

        @media (max-width: 1280px) {
          .dm-laptop { width: 68%; }
          .dm-phone  { width: 30%; }
        }
      `}</style>

      {/* ── LAPTOP ────────────────────────────────────────── */}
      <div className="dm-laptop">
        <div className="laptop-frame">

          {/* Chrome bar */}
          <div className="laptop-chrome">
            <div className="flex gap-1.5">
              <div className="chrome-dot-r" style={{ width: 9, height: 9, borderRadius: '50%' }} />
              <div className="chrome-dot-y" style={{ width: 9, height: 9, borderRadius: '50%' }} />
              <div className="chrome-dot-g" style={{ width: 9, height: 9, borderRadius: '50%' }} />
            </div>
            <div className="laptop-url-bar">
              <span style={{ fontSize: 9, color: '#28c840' }}>🔒</span>
              <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.55)', fontFamily: 'monospace' }}>alfimarealty.com</span>
            </div>
          </div>

          {/* Page content */}
          <div style={{ display: 'flex', flexDirection: 'column', flex: 1, overflow: 'hidden' }}>

            {/* Mini nav */}
            <div style={{
              background: '#b03020', padding: '10px 16px', flexShrink: 0,
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              borderBottom: '1px solid rgba(255,255,255,0.1)',
            }}>
              <div className="flex items-center gap-2">
                <div style={{ width: 24, height: 24, background: 'rgba(255,255,255,0.25)', borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 800, color: '#fff', fontFamily: 'serif' }}>A</div>
                <span style={{ fontSize: 13, fontWeight: 700, color: '#fff' }}>Alfima Realty</span>
              </div>
              <div className="flex gap-4">
                {['Buy', 'Rent', 'Properties', 'Agents'].map((item) => (
                  <span key={item} style={{ fontSize: 11, color: 'rgba(255,255,255,0.8)', fontWeight: 500 }}>{item}</span>
                ))}
              </div>
              <div style={{ background: '#fff', color: '#b03020', fontSize: 10, fontWeight: 800, padding: '4px 12px', borderRadius: 12 }}>List Property</div>
            </div>

            {/* Hero strip */}
            <div style={{ position: 'relative', height: 160, flexShrink: 0, overflow: 'hidden', background: '#2a1010' }}>
              <img
                src="https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&h=320&fit=crop&auto=format&q=80"
                alt=""
                style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.6 }}
              />
              <div style={{
                position: 'absolute', inset: 0,
                background: 'linear-gradient(90deg, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.2) 100%)',
                display: 'flex', alignItems: 'center', padding: '0 20px',
              }}>
                <div>
                  <div style={{ display: 'inline-flex', alignItems: 'center', gap: 4, background: 'rgba(192,57,43,0.5)', border: '1px solid rgba(230,80,60,0.6)', borderRadius: 20, padding: '3px 10px', marginBottom: 8 }}>
                    <div style={{ width: 5, height: 5, background: '#f1948a', borderRadius: '50%' }} />
                    <span style={{ fontSize: 9, fontWeight: 700, color: '#f1948a', letterSpacing: '0.1em', textTransform: 'uppercase' }}>#1 Realty PH</span>
                  </div>
                  <p style={{ fontSize: 18, fontWeight: 800, color: '#fff', lineHeight: 1.2, fontFamily: 'serif' }}>ALFIMA REALTY INC.</p>
                  <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.65)', margin: '4px 0 10px' }}>We make your dreams come true</p>
                  <div className="flex gap-2">
                    <button style={{ background: '#c0392b', color: '#fff', border: 'none', fontSize: 11, fontWeight: 700, padding: '7px 16px', borderRadius: 7, cursor: 'pointer' }}>Browse Now</button>
                    <button style={{ background: 'rgba(255,255,255,0.2)', color: '#fff', border: '1px solid rgba(255,255,255,0.3)', fontSize: 11, fontWeight: 500, padding: '7px 16px', borderRadius: 7, cursor: 'pointer' }}>Learn More</button>
                  </div>
                </div>
              </div>
            </div>

            {/* Property grid */}
            <div style={{ flex: 1, background: '#1e1e32', padding: '12px 14px', overflow: 'hidden' }}>
              <p style={{ fontSize: 10, fontWeight: 700, color: 'rgba(255,255,255,0.5)', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 10 }}>Featured Properties</p>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 8 }}>
                {MOCK_PROPS.map((p) => (
                  <div key={p.title} style={{ background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 8, overflow: 'hidden' }}>
                    <img src={p.img} alt={p.title} style={{ width: '100%', height: 58, objectFit: 'cover', display: 'block', background: '#2e2e4a' }} onError={(e) => { (e.target as HTMLImageElement).style.background = '#3a2a2a'; }} />
                    <div style={{ padding: '7px 8px' }}>
                      <div style={{ display: 'inline-block', background: p.tagColor, color: '#fff', fontSize: 8, fontWeight: 700, padding: '2px 7px', borderRadius: 10, marginBottom: 4 }}>{p.tag}</div>
                      <p style={{ fontSize: 10, fontWeight: 700, color: '#fff', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{p.title}</p>
                      <p style={{ fontSize: 11, fontWeight: 700, color: '#f1948a' }}>{p.price}</p>
                      <p style={{ fontSize: 9, color: 'rgba(255,255,255,0.5)' }}>{p.loc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
        <div className="laptop-base-bar" />
        <div className="laptop-foot-bar" />
      </div>

      {/* ── PHONE ─────────────────────────────────────────── */}
      <div className="dm-phone">
        <div className="dm-phone-shell">
          {/* Side buttons */}
          <div style={{ position: 'absolute', right: -3, top: 80, width: 3, height: 32, background: '#4a4a66', borderRadius: '0 3px 3px 0' }} />
          <div style={{ position: 'absolute', left: -3, top: 64, width: 3, height: 24, background: '#4a4a66', borderRadius: '3px 0 0 3px' }} />
          <div style={{ position: 'absolute', left: -3, top: 96, width: 3, height: 24, background: '#4a4a66', borderRadius: '3px 0 0 3px' }} />

          <div className="dm-phone-screen">
            {/* Dynamic island */}
            <div style={{ position: 'absolute', top: 8, left: '50%', transform: 'translateX(-50%)', width: 52, height: 14, background: '#0a0a12', borderRadius: 20, zIndex: 10 }} />
            <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>

              <div style={{ background: '#b03020', padding: '28px 10px 8px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0, borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                <div className="flex items-center gap-1.5">
                  <div style={{ width: 18, height: 18, background: 'rgba(255,255,255,0.25)', borderRadius: 5, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, fontWeight: 800, color: '#fff', fontFamily: 'serif' }}>A</div>
                  <span style={{ fontSize: 11, fontWeight: 700, color: '#fff' }}>Alfima Realty</span>
                </div>
                <svg style={{ width: 15, height: 15, color: 'rgba(255,255,255,0.8)' }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" /><path d="M13.73 21a2 2 0 0 1-3.46 0" />
                </svg>
              </div>

              <div style={{ position: 'relative', height: 80, flexShrink: 0, background: '#2a1010', overflow: 'hidden' }}>
                <img src="https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=400&h=200&fit=crop&auto=format&q=80" alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.55 }} />
                <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0.88) 100%)', display: 'flex', alignItems: 'flex-end', padding: '10px 12px' }}>
                  <div>
                    <p style={{ fontSize: 12, fontWeight: 800, color: '#fff', fontFamily: 'serif', lineHeight: 1.2 }}>ALFIMA REALTY INC.</p>
                    <p style={{ fontSize: 8, color: 'rgba(255,255,255,0.65)', margin: '2px 0 6px' }}>WE MAKE YOUR DREAMS COME TRUE</p>
                    <button style={{ background: '#c0392b', color: '#fff', border: 'none', fontSize: 9, fontWeight: 700, padding: '5px 12px', borderRadius: 6, cursor: 'pointer' }}>Browse Now →</button>
                  </div>
                </div>
              </div>

              <div style={{ flex: 1, background: '#1a1a2e', padding: '8px', overflow: 'hidden' }}>
                <p style={{ fontSize: 8, fontWeight: 700, color: 'rgba(255,255,255,0.5)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 6 }}>Featured</p>
                {MOCK_PROPS.map((p) => (
                  <div key={p.title} style={{ display: 'flex', gap: 7, alignItems: 'center', background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 8, padding: '6px 7px', marginBottom: 5 }}>
                    <img src={p.img.replace('w=200&h=120', 'w=100&h=100')} alt={p.title} style={{ width: 34, height: 34, borderRadius: 6, objectFit: 'cover', flexShrink: 0, background: '#2e2e4a' }} onError={(e) => { (e.target as HTMLImageElement).style.background = '#3a2a2a'; }} />
                    <div style={{ minWidth: 0 }}>
                      <p style={{ fontSize: 9, fontWeight: 700, color: '#fff', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{p.title}</p>
                      <p style={{ fontSize: 10, fontWeight: 700, color: '#f1948a' }}>{p.price}</p>
                      <p style={{ fontSize: 8, color: 'rgba(255,255,255,0.5)' }}>{p.loc}</p>
                    </div>
                  </div>
                ))}
              </div>

            </div>
          </div>
        </div>
      </div>


      {/* ── Floating: New Listing ──────────────────────────── */}
      <div className="float-card dm-float-new">
        <div style={{ width: 42, height: 42, borderRadius: 12, background: 'rgba(192,57,43,0.3)', border: '1px solid rgba(220,80,60,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          <Home size={20} color="#e74c3c" />
        </div>
        <div>
          <p style={{ fontSize: 13, fontWeight: 700, color: '#fff' }}>New Listing</p>
          <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.55)', marginTop: 2 }}>Just added today</p>
        </div>
      </div>

      {/* ── Floating: Stats ────────────────────────────────── */}
      <div className="float-card dm-float-stats">
        <div style={{ width: 42, height: 42, borderRadius: 12, background: 'rgba(39,174,96,0.2)', border: '1px solid rgba(39,174,96,0.35)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          <TrendingUp size={20} color="#2ecc71" />
        </div>
        <div>
          <p style={{ fontSize: 13, fontWeight: 700, color: '#fff' }}>500+ Listings</p>
          <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.55)', marginTop: 2 }}>Across the Philippines</p>
        </div>
      </div>

    </div>
  );
}