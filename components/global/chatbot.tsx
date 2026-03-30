'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { usePathname } from 'next/navigation';
import { X, Send, HeadphonesIcon, Phone, Clock, User, MessageSquare } from 'lucide-react';
import { useAuth } from '@/lib/store';

// ─── Types ────────────────────────────────────────────────────────────────────
type SenderType = 'user' | 'admin' | 'bot';

type Message = {
  id: string;
  text: string;
  sender: SenderType;
  suggestions?: string[];
};

type ChatPhase = 'ask-name' | 'bot' | 'human' | 'loading';

// ─── All API calls go through Next.js routes — ZERO CORS issues ───────────────
// Browser → /api/chat/* (Next.js) → Laravel (server-to-server, no CORS)
const CHAT_API = '/api/chat';
const POLL_MS  = 4000;

// ─── Session storage ──────────────────────────────────────────────────────────
const TOKEN_KEY = 'alfima_chat_token';
const SID_KEY   = 'alfima_chat_session_id';

function getToken(): string | null {
  if (typeof window === 'undefined') return null;
  return sessionStorage.getItem(TOKEN_KEY);
}
function saveToken(token: string, sid: number) {
  sessionStorage.setItem(TOKEN_KEY, token);
  sessionStorage.setItem(SID_KEY, String(sid));
}

// ─── Headers forwarded to Next.js proxy (which forwards to Laravel) ───────────
function buildHeaders(token?: string | null): Record<string, string> {
  const h: Record<string, string> = {
    'Content-Type': 'application/json',
    Accept:         'application/json',
  };
  const t = token ?? getToken();
  if (t) h['X-Chat-Token'] = t;
  const auth = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null;
  if (auth) h['Authorization'] = `Bearer ${auth}`;
  return h;
}

// ─── Suggestions ──────────────────────────────────────────────────────────────
const INITIAL_SUGGESTIONS = [
  'Browse properties for sale',
  'Find rental properties',
  'Talk to an agent',
  'Schedule a viewing',
  'About Alfima Realty',
  'Office location & hours',
];

// ─── Knowledge base ───────────────────────────────────────────────────────────
type KBEntry = { patterns: string[]; text: string; suggestions: string[] };

const KB: KBEntry[] = [
  {
    patterns: ['hi', 'hello', 'hey', 'good morning', 'good afternoon', 'good evening',
      'musta', 'kumusta', 'magandang', 'helo', 'start', 'greetings'],
    text: "👋 Hello! Welcome to **Alfima Realty Inc.** — your trusted partner in Philippine real estate!\n\nI can help you with:\n• 🏠 Buying or renting properties\n• 📍 Finding properties by location\n• 💰 Budget & financing options\n• 👨‍💼 Connecting with our agents\n• 📅 Scheduling property viewings\n\nWhat can I help you with today?",
    suggestions: ['Browse properties for sale', 'Find rental properties', 'Talk to an agent', 'Office location & hours'],
  },
  {
    patterns: ['buy', 'purchase', 'for sale', 'buying', 'invest', 'bilhin', 'properties for sale', 'browse properties'],
    text: "🏠 Great choice! Alfima Realty has a wide selection:\n\n• **Condominiums** – Studio to 3BR units\n• **House & Lot** – Single detached & townhouses\n• **Commercial Spaces** – Offices, retail, warehouses\n• **Pre-selling Projects** – Lower prices, flexible terms\n\nProperties across Metro Manila, Cavite, Laguna, Bulacan, and Rizal.\n\nWhat's your budget range?",
    suggestions: ['Under ₱3M', '₱3M–₱8M', '₱8M–₱20M', '₱20M+ Luxury', 'Pre-selling options'],
  },
  {
    patterns: ['rent', 'rental', 'lease', 'renting', 'for rent', 'upa', 'mag-rent', 'monthly'],
    text: "🏢 Looking for a rental? Here's what we have:\n\n• **Studio / 1BR** – ₱12,000–₱35,000/month\n• **2BR Condos** – ₱25,000–₱65,000/month\n• **3BR Condos** – ₱40,000–₱120,000/month\n• **Townhouses** – ₱18,000–₱55,000/month\n• **Commercial** – ₱15,000–₱200,000/month",
    suggestions: ['Studio / 1BR rentals', '2BR rentals', 'Family homes for rent', 'Commercial for rent'],
  },
  {
    patterns: ['condo', 'condominium', 'studio', 'flat', 'apartment', 'high rise', 'tower'],
    text: "🏙️ Our condo listings:\n\n• **Makati CBD** – ₱4M–₱30M\n• **BGC / Taguig** – ₱5M–₱45M\n• **Pasig / Ortigas** – ₱3.5M–₱15M\n• **Quezon City** – ₱2.8M–₱12M\n\nUnit types: Studio → Penthouse. Most include pool, gym, 24/7 security.",
    suggestions: ['Makati condos', 'BGC condos', 'QC condos', 'Schedule a viewing'],
  },
  {
    patterns: ['house', 'bahay', 'house and lot', 'townhouse', 'single detached', 'subdivision', 'bungalow'],
    text: "🏡 House & lot options:\n\n**Metro Manila:** QC, Paranaque, Las Pinas – ₱4M–₱30M\n\n**Affordable Suburbs:**\n• Cavite – ₱2.5M–₱15M · Laguna – ₱2.8M–₱14M\n• Bulacan – ₱2.5M–₱10M · Rizal – ₱3M–₱12M",
    suggestions: ['Cavite house & lot', 'Laguna properties', 'QC homes', 'Schedule a viewing'],
  },
  {
    patterns: ['agent', 'broker', 'talk to agent', 'speak to agent', 'human', 'person', 'staff', 'tulong', 'kausapin'],
    text: "👨‍💼 I'll connect you with one of our live agents!\n\nYou can also reach us directly:\n📞 **+63 2 8XXX-XXXX**\n📱 **+63 917 XXX-XXXX** (Viber/WhatsApp)\n📧 **hello@alfimarealty.com**\n\n**Office Hours:** Mon–Fri 8AM–6PM, Sat 9AM–5PM",
    suggestions: ['Schedule a callback', 'Office location', 'Schedule a viewing'],
  },
  {
    patterns: ['view', 'visit', 'tour', 'viewing', 'schedule', 'schedule a viewing', 'tripping', 'mag-visit'],
    text: "📅 We'd love to show you the property!\n\n**Viewing Hours:**\n• Mon–Fri: 9AM–5PM · Saturday: 9AM–4PM\n• Sunday: By appointment\n\nTell us which property and your preferred date!",
    suggestions: ['Book a viewing now', 'Virtual tour', 'Talk to an agent'],
  },
  {
    patterns: ['payment', 'downpayment', 'dp', 'loan', 'pag-ibig', 'pagibig', 'bank loan', 'amortization', 'financing'],
    text: "💳 **Financing Options:**\n\n**Spot Cash** – Best discounts (5–15% off)\n**In-House Financing** – 10–20% DP, no bank approval needed\n**Pag-IBIG** – Up to ₱6.5M, as low as 6.5% interest, 30-year term\n**Bank Loan** – Up to 90% of value, 7–12% p.a.\n\n**Sample:** ₱3M → ~₱16,000/month via Pag-IBIG",
    suggestions: ['Pag-IBIG details', 'Bank loan process', 'Talk to an agent'],
  },
  {
    patterns: ['makati', 'ayala', 'rockwell', 'legaspi', 'salcedo'],
    text: "📍 **Makati City** — The Philippines' Financial Capital!\n\n**For Sale:** Studio ₱4.5M–₱8M · 1BR ₱6M–₱15M · 2BR ₱10M–₱30M\n**For Rent:** Studio ₱18K–₱40K/mo · 1BR ₱25K–₱65K/mo\n\n✅ CBD · Best dining · Top schools nearby",
    suggestions: ['Buy in Makati', 'Rent in Makati', 'Talk to an agent'],
  },
  {
    patterns: ['bgc', 'taguig', 'bonifacio', 'global city', 'mckinley'],
    text: "📍 **BGC (Bonifacio Global City)** — Most Walkable!\n\n**For Sale:** Studio ₱5M–₱10M · 1BR ₱7M–₱18M · 2BR ₱12M–₱35M\n**For Rent:** Studio ₱22K–₱50K/mo · 1BR ₱35K–₱75K/mo\n\n✅ Pet-friendly · Clean streets · Expat community",
    suggestions: ['Buy in BGC', 'Rent in BGC', 'Talk to an agent'],
  },
  {
    patterns: ['quezon city', 'qc', 'cubao', 'katipunan', 'diliman', 'eastwood', 'fairview'],
    text: "📍 **Quezon City** — Metro Manila's Largest City!\n\n**For Sale:** Condos ₱2.8M–₱12M · Houses ₱5M–₱30M\n**For Rent:** Studio ₱10K–₱28K/mo · 1BR ₱15K–₱40K/mo\n\n✅ Near top universities · More space for the price",
    suggestions: ['Buy in QC', 'Rent in QC', 'Talk to an agent'],
  },
  {
    patterns: ['cavite', 'bacoor', 'imus', 'dasmarinas', 'tagaytay', 'general trias'],
    text: "📍 **Cavite Province** — Ideal for Families & OFW Investments!\n\n• Bacoor ₱2.5M–₱8M · Imus ₱2.8M–₱7M\n• Dasmarinas ₱2.5M–₱6.5M · Tagaytay ₱3M–₱20M+\n\n✅ Most affordable near Metro · CLEX access",
    suggestions: ['Cavite properties', 'Tagaytay homes', 'Talk to an agent'],
  },
  {
    patterns: ['laguna', 'sta rosa', 'binan', 'calamba', 'nuvali'],
    text: "📍 **Laguna Province** — Fast-Growing South Luzon Hub!\n\n• Biñan ₱2.8M–₱7M · Sta. Rosa ₱3M–₱12M\n• Calamba ₱2.8M–₱8M · San Pedro ₱2.5M–₱6M\n\n✅ SLEX/CALAX access · Near industrial zones",
    suggestions: ['Sta. Rosa properties', 'Nuvali condos', 'Talk to an agent'],
  },
  {
    patterns: ['ofw', 'overseas', 'abroad', 'dubai', 'saudi', 'singapore', 'remittance'],
    text: "🌍 **OFW Real Estate Investors — We've Got You!**\n\n✅ Virtual tours via Zoom/Viber\n✅ Online document submission\n✅ SPA assistance · Pag-IBIG overseas accepted\n✅ Dollar / remittance payment options\n\n**OFW Specialist:** Jerome Dela Cruz\n📱 +63 917 XXX-XXXX (Viber/WhatsApp)",
    suggestions: ['OFW-friendly properties', 'Pag-IBIG overseas', 'Talk to OFW specialist'],
  },
  {
    patterns: ['about', 'alfima', 'company', 'who are you', 'licensed', 'legit'],
    text: "🏢 **Alfima Realty Inc.**\n\n✅ PRC Licensed Brokers\n✅ DHSUD / HLURB Registered\n✅ Accredited by 20+ developers\n✅ 500+ satisfied clients · ₱2B+ in properties sold\n✅ Members of PAREB & REBAP",
    suggestions: ['Browse properties', 'Talk to an agent', 'Office location'],
  },
  {
    patterns: ['location', 'address', 'office', 'saan', 'where are you', 'map', 'directions'],
    text: "📍 **Alfima Realty Inc.**\n123 Real Estate Ave., Makati City\nMetro Manila, Philippines\n\n🚇 MRT: Ayala Station (5 min walk)\n\n🕐 Mon–Fri: 8AM–6PM · Saturday: 9AM–5PM\nSunday: Closed",
    suggestions: ['Call us now', 'Send an email', 'Schedule a viewing'],
  },
  {
    patterns: ['thank', 'thanks', 'salamat', 'okay', 'ok', 'sige', 'noted', 'bye', 'goodbye'],
    text: "😊 You're welcome! Alfima Realty is always here for you.\n\n📞 **+63 2 8XXX-XXXX**\n📧 **hello@alfimarealty.com**\n\nAnything else I can help you with?",
    suggestions: ['Browse properties', 'Talk to an agent', 'Schedule a viewing'],
  },
  {
    patterns: ['under 3m', 'below 3m', 'affordable', 'mura', 'budget', 'low cost', 'murang'],
    text: "💰 **Properties under ₱3M:**\n\n• Studio condos from ₱1.8M (pre-selling)\n• Cavite townhouses ₱2.2M–₱2.9M\n• Laguna townhouses ₱2.5M–₱2.9M\n• Bulacan homes ₱2M–₱2.8M\n\n**Pag-IBIG eligible** — 3% interest, 30-year terms!",
    suggestions: ['Pag-IBIG financing', 'Pre-selling options', 'Cavite properties', 'Talk to an agent'],
  },
  {
    patterns: ['invest', 'investment', 'roi', 'rental yield', 'passive income', 'airbnb'],
    text: "📈 **Real Estate Investment Guide:**\n\n✅ Appreciation: 5–10%/year\n✅ Rental yields: 4–9% gross/year\n\n• **Buy & Hold** – Pre-selling → 30–50% gain\n• **Buy-to-Rent** – BGC studio ~6% yield\n• **Airbnb** – BGC 1BR ~8.8% yield\n\n**Top Areas:** BGC, Makati, Sta. Rosa, QC Vertis North",
    suggestions: ['BGC investment', 'Pre-selling options', 'Rental properties', 'Talk to an agent'],
  },
];

function getBotResponse(input: string): { text: string; suggestions: string[] } {
  const lower = input.toLowerCase().trim();
  let best: KBEntry | null = null;
  let bestScore = 0;

  for (const entry of KB) {
    for (const pattern of entry.patterns) {
      if (lower.includes(pattern) && pattern.length > bestScore) {
        bestScore = pattern.length;
        best = entry;
      }
    }
  }
  if (best) return { text: best.text, suggestions: best.suggestions };

  const words = lower.split(/\s+/);
  for (const entry of KB) {
    for (const pattern of entry.patterns) {
      for (const word of words) {
        if (word.length > 3 && pattern.includes(word)) {
          return { text: entry.text, suggestions: entry.suggestions };
        }
      }
    }
  }

  return {
    text: "Thanks for reaching out! 😊 I didn't quite catch that.\n\nHere's what I can help with:\n• 🏠 Buying or renting properties\n• 📍 Properties by location\n• 💰 Budget & financing\n• 👨‍💼 Talk to our agents\n• 📅 Schedule a viewing",
    suggestions: INITIAL_SUGGESTIONS,
  };
}

function FormatText({ text }: { text: string }) {
  return (
    <>
      {text.split('\n').map((line, i, arr) => (
        <span key={i}>
          {line.split(/(\*\*[^*]+\*\*)/g).map((seg, j) =>
            seg.startsWith('**') && seg.endsWith('**')
              ? <strong key={j}>{seg.slice(2, -2)}</strong>
              : seg
          )}
          {i < arr.length - 1 && <br />}
        </span>
      ))}
    </>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────
export function Chatbot() {
  const pathname = usePathname();
  const { user } = useAuth();

  const [isOpen,       setIsOpen]       = useState(false);
  const [phase,        setPhase]        = useState<ChatPhase>('loading');
  const [messages,     setMessages]     = useState<Message[]>([]);
  const [input,        setInput]        = useState('');
  const [isTyping,     setIsTyping]     = useState(false);
  const [guestName,    setGuestName]    = useState('');
  const [nameInput,    setNameInput]    = useState('');
  const [sessionToken, setSessionToken] = useState<string | null>(null);
  const [unreadCount,  setUnreadCount]  = useState(0);

  const messagesEndRef  = useRef<HTMLDivElement>(null);
  const inputRef        = useRef<HTMLInputElement>(null);
  const pollIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const lastMsgIdRef    = useRef<number>(0);
  const isPollingRef    = useRef(false);
  const isOpenRef       = useRef(false);

  // Keep isOpenRef in sync so polling closure sees current value
  useEffect(() => { isOpenRef.current = isOpen; }, [isOpen]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
      setUnreadCount(0);
    }
  }, [isOpen]);

  useEffect(() => {
    initSession();
    return () => stopPolling();
  }, [user?.id]); // eslint-disable-line react-hooks/exhaustive-deps

  // ── Polling via Next.js route ─────────────────────────────────────────────────
  const startPolling = useCallback((token: string) => {
    stopPolling();
    pollIntervalRef.current = setInterval(async () => {
      if (isPollingRef.current) return;
      isPollingRef.current = true;
      try {
        // Calls /api/chat/messages (Next.js) → Laravel — no CORS
        const res  = await fetch(
          `${CHAT_API}/messages?after=${lastMsgIdRef.current}`,
          { headers: buildHeaders(token) }
        );
        if (!res.ok) return;

        const data     = await res.json();
        const msgs: any[] = data.messages ?? [];
        if (msgs.length === 0) return;

        const maxId = Math.max(...msgs.map((m: any) => m.id));
        if (maxId > lastMsgIdRef.current) lastMsgIdRef.current = maxId;

        const adminMsgs = msgs.filter((m: any) => m.sender_type === 'admin');
        if (adminMsgs.length > 0) {
          setMessages(prev => {
            const existingIds = new Set(prev.map(m => m.id));
            const fresh = adminMsgs
              .filter((m: any) => !existingIds.has(String(m.id)))
              .map((m: any) => ({ id: String(m.id), text: m.message, sender: 'admin' as SenderType }));
            return fresh.length > 0 ? [...prev, ...fresh] : prev;
          });
          setPhase('human');
          if (!isOpenRef.current) setUnreadCount(c => c + adminMsgs.length);
        }
      } catch { /* ignore */ } finally {
        isPollingRef.current = false;
      }
    }, POLL_MS);
  }, []);

  function stopPolling() {
    if (pollIntervalRef.current) {
      clearInterval(pollIntervalRef.current);
      pollIntervalRef.current = null;
    }
  }

  // ── Init session via Next.js route ────────────────────────────────────────────
  const initSession = useCallback(async () => {
    setPhase('loading');
    try {
      const existingToken = getToken();

      // POST /api/chat/session (Next.js proxy)
      const sessRes  = await fetch(`${CHAT_API}/session`, {
        method:  'POST',
        headers: buildHeaders(existingToken),
        body:    JSON.stringify({}),
      });
      const sessData = await sessRes.json();

      saveToken(sessData.session_token, sessData.session_id);
      setSessionToken(sessData.session_token);

      // GET /api/chat/messages (Next.js proxy)
      const msgRes  = await fetch(`${CHAT_API}/messages`, {
        headers: buildHeaders(sessData.session_token),
      });
      const msgData = await msgRes.json();
      const history: any[] = msgData.messages ?? [];

      if (history.length > 0) {
        lastMsgIdRef.current = Math.max(...history.map((m: any) => m.id));
        setMessages(history.map((m: any) => ({
          id:     String(m.id),
          text:   m.message,
          sender: m.sender_type as SenderType,
        })));
        setPhase(history.some((m: any) => m.sender_type === 'admin') ? 'human' : 'bot');
      } else {
        if (!user && !sessData.guest_name) {
          setPhase('ask-name');
          addLocalBotMsg(
            "👋 Welcome to **Alfima Realty Inc.**!\n\nBefore we start, what's your name? This helps our agents assist you better. 😊",
            [],
            false,
            sessData.session_token
          );
        } else {
          const name = user?.name ?? sessData.guest_name ?? '';
          if (sessData.guest_name) setGuestName(sessData.guest_name);
          setPhase('bot');
          addLocalBotMsg(
            `👋 Hello${name ? ', **' + name + '**' : ''}! Welcome to **Alfima Realty Inc.**!\n\nI can help you find your dream property. What are you looking for today?`,
            INITIAL_SUGGESTIONS,
            true,
            sessData.session_token
          );
        }
      }

      if (sessData.guest_name) setGuestName(sessData.guest_name);
      startPolling(sessData.session_token);
    } catch (err) {
      console.error('Chat init error:', err);
      setPhase('bot');
      addLocalBotMsg("👋 Welcome to **Alfima Realty Inc.**! How can I help you today?", INITIAL_SUGGESTIONS, false, null);
    }
  }, [user, startPolling]);

  function addLocalBotMsg(text: string, suggestions: string[], save: boolean, token: string | null) {
    setMessages(prev => [...prev, { id: `bot-${Date.now()}`, text, sender: 'bot', suggestions }]);
    if (save) {
      const t = token ?? getToken();
      if (!t) return;
      // POST /api/chat/bot-message (Next.js proxy)
      fetch(`${CHAT_API}/bot-message`, {
        method:  'POST',
        headers: buildHeaders(t),
        body:    JSON.stringify({ message: text }),
      }).catch(() => {});
    }
  }

  const handleNameSubmit = async () => {
    const name = nameInput.trim();
    if (!name) return;
    setNameInput('');
    setGuestName(name);
    // POST /api/chat/session (Next.js proxy)
    fetch(`${CHAT_API}/session`, {
      method:  'POST',
      headers: buildHeaders(),
      body:    JSON.stringify({ guest_name: name }),
    }).catch(() => {});
    setMessages(prev => [...prev, { id: `user-name-${Date.now()}`, text: name, sender: 'user' }]);
    setPhase('bot');
    setTimeout(() => {
      addLocalBotMsg(
        `Nice to meet you, **${name}**! 😊\n\nWelcome to **Alfima Realty Inc.**! What are you looking for today?`,
        INITIAL_SUGGESTIONS, true, null
      );
    }, 600);
  };

  const sendMessage = async (text: string) => {
    if (!text.trim() || isTyping || phase === 'ask-name') return;
    setInput('');
    setMessages(prev => [...prev, { id: `user-${Date.now()}`, text, sender: 'user' }]);

    const token = sessionToken ?? getToken();
    if (token) {
      // POST /api/chat/message (Next.js proxy)
      fetch(`${CHAT_API}/message`, {
        method:  'POST',
        headers: buildHeaders(token),
        body:    JSON.stringify({ message: text }),
      }).catch(() => {});
    }

    if (phase === 'bot') {
      setIsTyping(true);
      setTimeout(() => {
        const response = getBotResponse(text);
        addLocalBotMsg(response.text, response.suggestions, true, token);
        setIsTyping(false);
        const wantsHuman = ['agent', 'human', 'talk to agent', 'speak to agent', 'kausapin', 'person', 'staff']
          .some(p => text.toLowerCase().includes(p));
        if (wantsHuman) {
          setTimeout(() => {
            addLocalBotMsg(
              "🔔 I've notified our agents. Someone will join this chat shortly!\n\nFeel free to share more details about what you're looking for.",
              [], true, token
            );
          }, 800);
        }
      }, 700);
    }
  };

  if (pathname.startsWith('/admin')) return null;

  const displayName = user?.name ?? guestName;

  return (
    <div className="fixed bottom-8 right-8 z-50">
      {isOpen && (
        <div
          className="absolute bottom-20 right-0 w-80 sm:w-96 flex flex-col shadow-2xl rounded-3xl overflow-hidden border border-white/10"
          style={{ height: '540px', animation: 'chatFadeUp 0.2s ease' }}
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-red-800 to-red-700 px-5 py-4 flex items-center justify-between flex-shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0">
                <HeadphonesIcon className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-white font-bold text-sm leading-tight">Alfima Realty</p>
                <div className="flex items-center gap-1.5">
                  <div className={`w-1.5 h-1.5 rounded-full ${phase === 'human' ? 'bg-green-400 animate-pulse' : 'bg-yellow-400'}`} />
                  <p className="text-red-200 text-xs">{phase === 'human' ? 'Live Agent Connected' : 'AI Assistant'}</p>
                </div>
              </div>
            </div>
            <button onClick={() => setIsOpen(false)} className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-white/10 transition text-white">
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Sub-header */}
          <div className="bg-red-900/80 px-4 py-2 flex items-center gap-4 flex-shrink-0 border-b border-white/5">
            <div className="flex items-center gap-1 text-red-200 text-xs"><Phone className="w-3 h-3" /><span>+63 2 8XXX-XXXX</span></div>
            <div className="flex items-center gap-1 text-red-200 text-xs"><Clock className="w-3 h-3" /><span>Mon–Sat 8AM–6PM</span></div>
            {displayName && (
              <div className="flex items-center gap-1 text-red-200 text-xs ml-auto">
                <User className="w-3 h-3" /><span className="max-w-[80px] truncate">{displayName}</span>
              </div>
            )}
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-neutral-950/90">
            {phase === 'loading' && messages.length === 0 ? (
              <div className="flex items-center justify-center h-full">
                <div className="w-7 h-7 border-2 border-red-500 border-t-transparent rounded-full animate-spin" />
              </div>
            ) : (
              messages.map(msg => (
                <div key={msg.id} className={`flex flex-col gap-2 ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}>
                  {msg.sender === 'admin' && <span className="text-[10px] text-red-400/70 px-1">Alfima Agent</span>}
                  <div className={`max-w-[85%] px-4 py-3 rounded-2xl text-sm leading-relaxed ${
                    msg.sender === 'user'
                      ? 'bg-red-600 text-white rounded-br-sm'
                      : msg.sender === 'admin'
                      ? 'bg-red-900/60 text-white rounded-bl-sm border border-red-500/30'
                      : 'bg-white/10 text-white/90 rounded-bl-sm border border-white/5'
                  }`}>
                    <FormatText text={msg.text} />
                  </div>
                  {msg.sender !== 'user' && msg.suggestions && msg.suggestions.length > 0 && (
                    <div className="flex flex-wrap gap-2 max-w-[90%]">
                      {msg.suggestions.map(s => (
                        <button key={s} onClick={() => sendMessage(s)}
                          disabled={isTyping || phase === 'ask-name' || phase === 'loading'}
                          className="text-xs px-3 py-1.5 rounded-full border border-red-500/40 text-red-300 hover:bg-red-600/20 hover:border-red-400 hover:text-white transition-all bg-white/5 disabled:opacity-40 disabled:cursor-not-allowed">
                          {s}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              ))
            )}
            {isTyping && (
              <div className="flex items-start">
                <div className="bg-white/10 border border-white/5 rounded-2xl rounded-bl-sm px-4 py-3">
                  <div className="flex gap-1">
                    {[0, 150, 300].map(d => (
                      <div key={d} className="w-2 h-2 bg-white/40 rounded-full animate-bounce" style={{ animationDelay: `${d}ms` }} />
                    ))}
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="bg-neutral-950/90 border-t border-white/10 p-3 flex-shrink-0">
            {phase === 'ask-name' ? (
              <div className="flex gap-2 items-center">
                <div className="flex items-center gap-2 flex-1 bg-white/5 border border-white/10 rounded-xl px-3 py-2.5">
                  <User className="w-4 h-4 text-white/30 flex-shrink-0" />
                  <input ref={inputRef} type="text" placeholder="Enter your name…"
                    value={nameInput} onChange={e => setNameInput(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && handleNameSubmit()}
                    className="flex-1 bg-transparent text-sm text-white placeholder-white/30 focus:outline-none"
                    maxLength={60} />
                </div>
                <button onClick={handleNameSubmit} disabled={!nameInput.trim()}
                  className="w-9 h-9 bg-red-600 hover:bg-red-500 disabled:opacity-30 text-white rounded-xl flex items-center justify-center transition-all">
                  <Send className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex gap-2 items-center">
                <input ref={inputRef} type="text"
                  placeholder={phase === 'human' ? 'Reply to your agent…' : 'Ask about properties, areas, prices…'}
                  value={input} onChange={e => setInput(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && sendMessage(input)}
                  className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder-white/30 focus:outline-none focus:border-red-500/50 transition-all" />
                <button onClick={() => sendMessage(input)} disabled={!input.trim() || isTyping}
                  className="w-9 h-9 bg-red-600 hover:bg-red-500 disabled:opacity-30 text-white rounded-xl flex items-center justify-center transition-all flex-shrink-0">
                  <Send className="w-4 h-4" />
                </button>
              </div>
            )}
            <p className="text-white/20 text-xs text-center mt-2">
              {phase === 'human' ? "💬 You're chatting with a live agent" : 'Alfima Realty Inc. · Makati City, Philippines'}
            </p>
          </div>
        </div>
      )}

      {/* FAB */}
      <button onClick={() => setIsOpen(o => !o)}
        className="relative w-14 h-14 rounded-full bg-gradient-to-br from-red-700 to-red-800 text-white shadow-xl shadow-red-900/50 hover:shadow-red-700/50 hover:scale-110 transition-all duration-300 flex items-center justify-center border border-red-500/30">
        {isOpen ? <X className="w-6 h-6" /> : <MessageSquare className="w-6 h-6" />}
        {!isOpen && unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 w-5 h-5 bg-green-500 rounded-full text-white text-[10px] font-bold flex items-center justify-center border-2 border-neutral-950">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      <style>{`
        @keyframes chatFadeUp {
          from { opacity: 0; transform: translateY(16px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}