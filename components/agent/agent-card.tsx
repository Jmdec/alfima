'use client';

import { useState, useEffect } from 'react';
import { Agent, Tour } from '@/lib/types';
import { Star, Phone, Mail, MessageSquare, X, Send, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface AgentCardProps {
  agent: Agent;
  onReviewed?: () => void;
}

interface MessageOption {
  label: string; icon: string; href: string; bg: string;
}

// ── Message Modal ─────────────────────────────────────────────────────────────
function MessageModal({ agent, onClose }: { agent: Agent; onClose: () => void }) {
  const raw  = agent.phone?.replace(/\D/g, '') ?? '';
  const intl = raw.startsWith('0') ? `63${raw.slice(1)}` : raw;

  const options: MessageOption[] = [
    { label: 'Viber',    icon: '📱', href: `viber://chat?number=+${intl}`, bg: 'hover:bg-purple-50 border border-purple-200 text-purple-700 bg-purple-50/50' },
    { label: 'WhatsApp', icon: '💬', href: `https://wa.me/${intl}`,         bg: 'hover:bg-green-50 border border-green-200 text-green-700 bg-green-50/50'   },
    { label: 'SMS',      icon: '✉️', href: `sms:${agent.phone}`,            bg: 'hover:bg-blue-50 border border-blue-200 text-blue-700 bg-blue-50/50'      },
    { label: 'Email',    icon: '📧', href: `mailto:${agent.email}`,         bg: 'hover:bg-red-50 border border-red-200 text-red-700 bg-red-50/50'          },
  ];

  return (
    <>
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40" onClick={onClose} />
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="bg-white border border-gray-200 rounded-2xl shadow-2xl w-full max-w-sm p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <img src={agent.avatar ?? '/placeholder-avatar.png'} alt={agent.name}
                className="w-10 h-10 rounded-full object-cover border-2 border-gray-100 shadow-sm" />
              <div>
                <p className="font-black text-gray-900 text-sm">{agent.name}</p>
                <p className="text-xs text-gray-400">Choose how to reach out</p>
              </div>
            </div>
            <button onClick={onClose}
              className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors">
              <X className="w-4 h-4 text-gray-500" />
            </button>
          </div>

          <p className="text-xs text-gray-400 uppercase tracking-widest mb-3 font-black">Choose a channel</p>
          <div className="grid grid-cols-2 gap-3">
            {options.map(opt => (
              <a key={opt.label} href={opt.href} target="_blank" rel="noopener noreferrer" onClick={onClose}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 font-semibold text-sm ${opt.bg}`}>
                <span className="text-xl">{opt.icon}</span>
                <span>{opt.label}</span>
              </a>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

// ── Rate Agent Modal ──────────────────────────────────────────────────────────
function RateAgentModal({ agent, tour, onClose, onSubmitted }: {
  agent: Agent; tour: Tour; onClose: () => void; onSubmitted: () => void;
}) {
  const [rating,    setRating]    = useState(0);
  const [hovered,   setHovered]   = useState(0);
  const [comment,   setComment]   = useState('');
  const [loading,   setLoading]   = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error,     setError]     = useState<string | null>(null);

  const labels: Record<number, string> = {
    1: 'Poor', 2: 'Fair', 3: 'Good', 4: 'Very Good', 5: 'Excellent',
  };

  const handleSubmit = async () => {
    if (rating === 0) { setError('Please select a rating.'); return; }
    setLoading(true); setError(null);
    try {
      const res  = await fetch(`/api/tours/${tour.id}/review`, {
        method: 'POST', credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rating, comment }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.message ?? 'Failed to submit review.'); return; }
      setSubmitted(true);
      onSubmitted();
    } catch {
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40" onClick={onClose} />
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="bg-white border border-gray-200 rounded-2xl shadow-2xl w-full max-w-sm p-6">
          <div className="flex justify-end mb-2">
            <button onClick={onClose}
              className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors">
              <X className="w-4 h-4 text-gray-500" />
            </button>
          </div>

          {submitted ? (
            <div className="flex flex-col items-center py-6 gap-4">
              <div className="w-16 h-16 rounded-full bg-green-50 flex items-center justify-center">
                <CheckCircle className="w-9 h-9 text-green-500" />
              </div>
              <p className="text-gray-900 font-black text-lg">Thank you!</p>
              <p className="text-gray-500 text-sm text-center">Your review has been submitted.</p>
              <button
                className="mt-2 px-6 py-2.5 rounded-full text-white font-bold text-sm transition-all hover:scale-105"
                style={{ background: 'linear-gradient(135deg,#c0392b,#96281b)' }}
                onClick={onClose}>
                Done
              </button>
            </div>
          ) : (
            <>
              <div className="flex items-center gap-3 mb-6">
                <img src={agent.avatar ?? '/placeholder-avatar.png'} alt={agent.name}
                  className="w-12 h-12 rounded-full object-cover border-2 border-gray-100 shadow-sm" />
                <div>
                  <p className="font-black text-gray-900 text-sm">{agent.name}</p>
                  <p className="text-xs text-gray-400">
                    Tour on {new Date(tour.tour_date).toLocaleDateString('en-PH', { month: 'long', day: 'numeric', year: 'numeric' })}
                  </p>
                </div>
              </div>

              <p className="text-xs text-gray-400 uppercase tracking-widest mb-3 font-black">Your Rating</p>
              <div className="flex items-center gap-2 mb-2">
                {[1,2,3,4,5].map(star => (
                  <button key={star}
                    onMouseEnter={() => setHovered(star)}
                    onMouseLeave={() => setHovered(0)}
                    onClick={() => setRating(star)}
                    className="transition-transform hover:scale-110">
                    <Star className={`w-9 h-9 transition-colors ${star <= (hovered || rating) ? 'fill-yellow-400 stroke-yellow-400' : 'stroke-gray-300'}`} />
                  </button>
                ))}
              </div>
              {(hovered || rating) > 0 && (
                <p className="text-yellow-500 text-sm font-black mb-4">{labels[hovered || rating]}</p>
              )}

              <p className="text-xs text-gray-400 uppercase tracking-widest mb-2 font-black mt-2">
                Comment <span className="normal-case font-medium">(optional)</span>
              </p>
              <textarea value={comment} onChange={e => setComment(e.target.value)}
                placeholder="Share your experience with this agent..." rows={3}
                className="w-full bg-gray-50 border-2 border-gray-200 focus:border-red-400 rounded-xl px-4 py-3 text-sm text-gray-900 placeholder:text-gray-400 resize-none focus:outline-none transition-colors" />

              {error && <p className="text-red-500 text-xs mt-2 font-medium">{error}</p>}

              <button
                className="w-full mt-4 py-3 rounded-xl text-white font-black flex items-center justify-center gap-2 transition-all hover:scale-[1.02] hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                style={{ background: 'linear-gradient(135deg,#c0392b,#96281b)', boxShadow: '0 6px 20px rgba(192,57,43,0.3)' }}
                onClick={handleSubmit}
                disabled={loading}>
                {loading
                  ? <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Submitting…</>
                  : <><Send className="w-4 h-4" /> Submit Review</>
                }
              </button>
            </>
          )}
        </div>
      </div>
    </>
  );
}

// ── Agent Card ────────────────────────────────────────────────────────────────
export function AgentCard({ agent, onReviewed }: AgentCardProps) {
  const [showMessageModal, setShowMessageModal] = useState(false);
  const [showRateModal,    setShowRateModal]    = useState(false);
  const [completedTour,    setCompletedTour]    = useState<Tour | null>(null);
  const [alreadyReviewed,  setAlreadyReviewed]  = useState(false);
  const [checkingTour,     setCheckingTour]     = useState(true);

  useEffect(() => {
    const fetchCompletedTour = async () => {
      setCheckingTour(true);
      try {
        const res = await fetch(
          `/api/tours/my?agent_id=${agent.id}&status=completed`,
          { credentials: 'include' }
        );
        if (!res.ok) return;
        const data = await res.json();
        const list: Tour[] = data.data ?? data ?? [];
        if (list.length === 0) return;
        const tour = list[0];
        setCompletedTour(tour);
        if ((tour as any).rating != null) { setAlreadyReviewed(true); return; }
        try {
          const stored = localStorage.getItem('reviewed_tours');
          const ids: number[] = stored ? JSON.parse(stored) : [];
          if (ids.includes(tour.id)) setAlreadyReviewed(true);
        } catch { /* */ }
      } catch { /* silently fail */ }
      finally { setCheckingTour(false); }
    };
    fetchCompletedTour();
  }, [agent.id]);

  const handleReviewSubmitted = () => {
    if (!completedTour) return;
    try {
      const stored = localStorage.getItem('reviewed_tours');
      const ids: number[] = stored ? JSON.parse(stored) : [];
      ids.push(completedTour.id);
      localStorage.setItem('reviewed_tours', JSON.stringify(ids));
    } catch { /* */ }
    setAlreadyReviewed(true);
    setShowRateModal(false);
    onReviewed?.();
  };

  return (
    <>
      <div className="h-full bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 flex flex-col group">

        {/* ── Cover band — red gradient with subtle pattern ── */}
        <div className="h-28 flex-shrink-0 relative overflow-hidden"
          style={{ background: 'linear-gradient(135deg,#c0392b 0%,#e74c3c 50%,#a93226 100%)' }}>
          {/* dot pattern overlay */}
          <div className="absolute inset-0 opacity-20"
            style={{ backgroundImage: 'radial-gradient(circle at 1px 1px,rgba(255,255,255,0.6) 1px,transparent 0)', backgroundSize: '18px 18px' }} />
          {/* bottom fade */}
          <div className="absolute bottom-0 left-0 w-full h-8"
            style={{ background: 'linear-gradient(to bottom,transparent,rgba(0,0,0,0.15))' }} />
        </div>

        {/* ── Body ── */}
        <div className="px-6 pb-6 flex flex-col flex-1">

          {/* Avatar — overlaps the cover */}
          <div className="flex justify-center -mt-12 mb-3">
            <div className="relative">
              <img
                src={agent.avatar ?? '/placeholder-avatar.png'}
                alt={agent.name}
                className="w-20 h-20 rounded-full object-cover border-4 border-white shadow-lg group-hover:scale-105 transition-transform duration-300"
              />
              {/* online dot */}
              <span className="absolute bottom-1 right-1 w-4 h-4 rounded-full bg-green-400 border-2 border-white shadow-sm" />
            </div>
          </div>

          {/* Name */}
          <div className="text-center mb-1">
            <h3 className="font-black text-lg text-gray-900 leading-tight">{agent.name}</h3>
          </div>

          {/* Stars + review count */}
          <div className="flex items-center justify-center gap-1 mb-4">
            <div className="flex">
              {[...Array(5)].map((_,i) => (
                <Star key={i} className={`w-3.5 h-3.5 ${i < Math.round(agent.rating ?? 0) ? 'fill-yellow-400 stroke-yellow-400' : 'stroke-gray-200 fill-gray-100'}`} />
              ))}
            </div>
            <span className="text-xs text-gray-400 ml-1 font-medium">
              {Number(agent.rating ?? 0).toFixed(1)}
              <span className="text-gray-300 mx-1">·</span>
              {agent.review_count ?? 0} {(agent.review_count ?? 0) === 1 ? 'review' : 'reviews'}
            </span>
          </div>

          {/* Stats row */}
          <div className="flex justify-center gap-6 mb-4 pb-4 border-b border-gray-100">
            <div className="text-center">
              <p className="font-black text-gray-900 text-lg leading-none">{agent.listings ?? 0}</p>
              <p className="text-gray-400 text-xs mt-0.5 font-medium">Properties</p>
            </div>
            <div className="w-px bg-gray-100" />
            <div className="text-center">
              <p className="font-black text-gray-900 text-lg leading-none">{Number(agent.rating ?? 0).toFixed(1)}</p>
              <p className="text-gray-400 text-xs mt-0.5 font-medium">Rating</p>
            </div>
          </div>

          {/* Contact info */}
          <div className="space-y-2 mb-4">
            <div className="flex items-center gap-2.5 text-sm text-gray-500">
              <div className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0"
                style={{ background: '#fff0f0' }}>
                <Phone className="w-3.5 h-3.5 text-red-500" />
              </div>
              <span className="font-medium text-gray-700">{agent.phone ?? 'N/A'}</span>
            </div>
            <div className="flex items-center gap-2.5 text-sm text-gray-500">
              <div className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0"
                style={{ background: '#fff0f0' }}>
                <Mail className="w-3.5 h-3.5 text-red-500" />
              </div>
              <span className="font-medium text-gray-700 truncate">{agent.email}</span>
            </div>
          </div>

          {/* Spacer */}
          <div className="flex-1" />

          {/* Review banner — reserved slot */}
          <div className="mb-3 min-h-[36px]">
            {!checkingTour && completedTour && (
              alreadyReviewed ? (
                <div className="flex items-center justify-center gap-2 text-green-600 text-xs font-bold bg-green-50 border border-green-200 rounded-xl py-2 px-3">
                  <CheckCircle className="w-3.5 h-3.5 flex-shrink-0" />
                  You reviewed this agent
                </div>
              ) : (
                <button
                  onClick={() => setShowRateModal(true)}
                  className="w-full flex items-center justify-center gap-2 bg-yellow-50 hover:bg-yellow-100 border border-yellow-200 text-yellow-700 text-xs font-bold rounded-xl py-2 transition-colors">
                  <Star className="w-3.5 h-3.5 flex-shrink-0" />
                  Rate your experience
                </button>
              )
            )}
          </div>

          {/* CTA buttons */}
          <div className="flex gap-2">
            <a href={`tel:${agent.phone}`} className="flex-1">
              <button
                className="w-full py-2.5 rounded-xl text-white text-sm font-black flex items-center justify-center gap-1.5 transition-all hover:scale-[1.03] hover:shadow-lg"
                style={{ background: 'linear-gradient(135deg,#c0392b,#96281b)', boxShadow: '0 4px 14px rgba(192,57,43,0.3)' }}>
                <Phone className="w-4 h-4" /> Call
              </button>
            </a>
            <button
              className="flex-1 py-2.5 rounded-xl text-gray-700 text-sm font-black flex items-center justify-center gap-1.5 border-2 border-gray-200 hover:border-red-300 hover:text-red-600 hover:bg-red-50 transition-all"
              onClick={() => setShowMessageModal(true)}>
              <MessageSquare className="w-4 h-4" /> Message
            </button>
          </div>

        </div>
      </div>

      {showMessageModal && (
        <MessageModal agent={agent} onClose={() => setShowMessageModal(false)} />
      )}
      {showRateModal && completedTour && (
        <RateAgentModal
          agent={agent}
          tour={completedTour}
          onClose={() => setShowRateModal(false)}
          onSubmitted={handleReviewSubmitted}
        />
      )}
    </>
  );
}