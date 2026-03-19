'use client';

import { useState, useRef, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { X, Send, HeadphonesIcon, Phone, Clock } from 'lucide-react';

type Message = {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  suggestions?: string[];
};

type KBEntry = {
  patterns: string[];
  text: string;
  suggestions: string[];
};

const INITIAL_SUGGESTIONS = [
  'Browse properties for sale',
  'Find rental properties',
  'Talk to an agent',
  'Schedule a viewing',
  'About Alfima Realty',
  'Office location & hours',
];

// ─────────────────────────────────────────────────────────────────────────────
// KNOWLEDGE BASE — Comprehensive Alfima Realty Q&A
// ─────────────────────────────────────────────────────────────────────────────
const KB: KBEntry[] = [

  // ── GREETINGS ────────────────────────────────────────────────────────────
  {
    patterns: ['hi', 'hello', 'hey', 'good morning', 'good afternoon', 'good evening', 'good day',
      'musta', 'kumusta', 'kamusta', 'magandang umaga', 'magandang hapon', 'magandang gabi',
      'magandang araw', 'helo', 'hellow', 'sup', 'yo', 'oi', 'howdy', 'greetings', 'start'],
    text: "👋 Hello! Welcome to **Alfima Realty Inc.** — your trusted partner in Philippine real estate!\n\nI can help you with:\n• 🏠 Buying or renting properties\n• 📍 Finding properties by location\n• 💰 Exploring budget options\n• 👨‍💼 Connecting with our agents\n• 📅 Scheduling property viewings\n\nWhat can I help you with today?",
    suggestions: ['Browse properties for sale', 'Find rental properties', 'Talk to an agent', 'Office location & hours'],
  },

  // ── BUYING / FOR SALE ─────────────────────────────────────────────────────
  {
    patterns: ['buy', 'purchase', 'for sale', 'buying', 'acquire', 'invest', 'bilhin', 'bibili',
      'gusto kong bumili', 'properties for sale', 'browse properties', 'magbili', 'pagbili',
      'looking to buy', 'want to buy', 'interested to buy', 'planning to buy', 'mag-invest',
      'real estate investment', 'property investment', 'bahay na ibinebenta', 'ibinebenta'],
    text: "🏠 Great choice investing in Philippine real estate! Alfima Realty has a wide selection of properties for sale:\n\n• **Condominiums** – Studio to 3BR units\n• **House & Lot** – Single detached & townhouses\n• **Commercial Spaces** – Offices, retail, warehouses\n• **Pre-selling Projects** – Lower prices, flexible terms\n\nProperties are available across Metro Manila, Cavite, Laguna, Bulacan, and Rizal.\n\nWhat's your budget range?",
    suggestions: ['Under ₱3M', '₱3M–₱8M', '₱8M–₱20M', '₱20M+ Luxury', 'Pre-selling options'],
  },

  // ── RENTING ───────────────────────────────────────────────────────────────
  {
    patterns: ['rent', 'rental', 'lease', 'renting', 'monthly', 'magpaupa', 'upa', 'find rental',
      'for rent', 'naghahanap ng rental', 'gusto kong mag-rent', 'mauupahan', 'uupahan',
      'looking for rental', 'want to rent', 'need to rent', 'apartment for rent', 'condo for rent',
      'house for rent', 'room for rent', 'studio for rent', 'monthly rental', 'mag-lease'],
    text: "🏢 Looking for a rental? Alfima Realty has you covered!\n\nAvailable rental types:\n• **Studio / 1BR** – ₱12,000–₱35,000/month\n• **2BR Condos** – ₱25,000–₱65,000/month\n• **3BR Condos** – ₱40,000–₱120,000/month\n• **Townhouses** – ₱18,000–₱55,000/month\n• **Single Family Homes** – ₱25,000–₱80,000/month\n• **Commercial Spaces** – ₱15,000–₱200,000/month\n\nMost of our rentals are in Makati, BGC, Pasig, QC, and Mandaluyong.\n\nWhat type of rental are you looking for?",
    suggestions: ['Studio / 1BR rentals', '2BR rentals', 'Family homes for rent', 'Commercial for rent'],
  },

  // ── CONDOMINIUMS ──────────────────────────────────────────────────────────
  {
    patterns: ['condo', 'condominium', 'studio unit', 'flat', 'apartment', 'high rise', 'highrise',
      'mid rise', 'midrise', 'condo unit', 'condominium unit', 'tower', 'residential tower',
      'mag-condo', 'bumili ng condo', 'condo for sale', 'condo prices', 'how much condo',
      'magkano condo', 'condo sa manila', 'condo sa metro manila'],
    text: "🏙️ Condominiums are one of our top offerings! Here's a full overview:\n\n**By Location:**\n• Makati CBD – ₱4M–₱30M\n• BGC / Taguig – ₱5M–₱45M\n• Pasig / Ortigas – ₱3.5M–₱15M\n• Quezon City – ₱2.8M–₱12M\n• Mandaluyong – ₱3M–₱10M\n• San Juan – ₱3.5M–₱11M\n• Paranaque – ₱3M–₱9M\n\n**Unit Types:**\n• Studio (20–30 sqm) – Entry-level, perfect for singles\n• 1BR (35–50 sqm) – Ideal for couples\n• 2BR (55–80 sqm) – Great for small families\n• 3BR (85–120 sqm) – Spacious family living\n• Penthouse (150sqm+) – Luxury living\n\nMost condo buildings include: gym, pool, 24/7 security, parking.",
    suggestions: ['Makati condos', 'BGC condos', 'QC condos', 'Pre-selling condos', 'Schedule a viewing'],
  },

  // ── HOUSE AND LOT ─────────────────────────────────────────────────────────
  {
    patterns: ['house', 'home', 'bahay', 'bahay at lupa', 'house and lot', 'house & lot',
      'single detached', 'single attached', 'townhouse', 'subdivision', 'bungalow',
      'two storey', 'two story', '2 storey', 'row house', 'rowhouse', 'duplex',
      'house for sale', 'bumili ng bahay', 'gusto kong bumili ng bahay', 'dream home',
      'sariling bahay', 'mag-bahay', 'family home', 'residential lot', 'lot only'],
    text: "🏡 Looking for a house? Here are our house & lot options:\n\n**Metro Manila:**\n• Quezon City – ₱5M–₱30M (houses in Fairview, Novaliches, Cubao)\n• Paranaque / Las Pinas – ₱4M–₱20M\n• Mandaluyong / San Juan – ₱6M–₱25M\n• Marikina / Antipolo – ₱3M–₱12M\n\n**Outside Metro (more affordable):**\n• Cavite (Bacoor, Imus, Dasmarinas) – ₱2.5M–₱15M\n• Laguna (Binan, Sta. Rosa, Calamba) – ₱2.8M–₱14M\n• Bulacan (Marilao, Meycauayan) – ₱2.5M–₱10M\n• Rizal (Cainta, Taytay) – ₱3M–₱12M\n\n**House Types:**\n• Single Detached – Full privacy, bigger lot\n• Townhouse – Shared wall, more affordable\n• Duplex – Two units, one structure\n• Bungalow – Single floor, elderly-friendly",
    suggestions: ['Cavite house & lot', 'Laguna properties', 'QC homes', 'Townhouse options', 'Schedule a viewing'],
  },

  // ── COMMERCIAL PROPERTIES ─────────────────────────────────────────────────
  {
    patterns: ['commercial', 'shop', 'store', 'warehouse', 'business', 'negosyo', 'retail',
      'office space', 'office for rent', 'commercial space', 'bodega', 'industrial',
      'commercial for sale', 'commercial for rent', 'showroom', 'restaurant space',
      'food kiosk', 'stall', 'commercial lot', 'mixed use', 'pabrika', 'factory',
      'coworking', 'co-working', 'serviced office', 'virtual office'],
    text: "🏬 We offer a wide range of commercial properties!\n\n**Office Spaces:**\n• BGC – ₱800–₱2,500/sqm/month\n• Makati CBD – ₱700–₱2,000/sqm/month\n• Ortigas Center – ₱600–₱1,500/sqm/month\n• QC (Eastwood, Diliman) – ₱500–₱1,200/sqm/month\n\n**Retail / Commercial Spaces:**\n• Mall stalls & kiosks – ₱15,000–₱80,000/month\n• Ground floor retail – ₱20,000–₱150,000/month\n• Restaurant spaces – ₱30,000–₱200,000/month\n\n**Warehouses / Industrial:**\n• Laguna (LIMA, FTI) – ₱150–₱400/sqm/month\n• Cavite (CEPZ) – ₱120–₱350/sqm/month\n• Bulacan – ₱100–₱300/sqm/month\n\n**For Sale:**\n• Commercial lots from ₱15,000/sqm\n• Commercial buildings ₱20M–₱500M+",
    suggestions: ['Office space inquiry', 'Retail space', 'Warehouse for rent', 'Commercial for sale', 'Talk to an agent'],
  },

  // ── BUDGET: UNDER 3M ──────────────────────────────────────────────────────
  {
    patterns: ['under 3m', 'below 3m', 'affordable', 'mura', 'starter', 'budget',
      'under ₱3m', 'less than 3m', '1m', '2m', '2.5m', 'entry level', 'luma',
      'tipid', 'matipid', 'murang bahay', 'murang condo', 'low cost', 'socialized',
      'economic housing', 'pag-ibig housing', 'under 3 million', 'sulitin',
      'murang property', 'cheap property', 'low budget', 'limited budget'],
    text: "💰 Great news — we have properties **under ₱3M**!\n\n**Condos:**\n• Studio units in QC, Mandaluyong, Pasig\n• Starting at ₱1.8M (pre-selling)\n• Monthly amortization: ₱8,000–₱15,000\n\n**Townhouses:**\n• Cavite (Bacoor, Imus) – ₱2.2M–₱2.9M\n• Laguna (Binan, Cabuyao) – ₱2.5M–₱2.9M\n• Bulacan – ₱2M–₱2.8M\n\n**Pag-IBIG Eligible:**\n• Most properties under ₱3M qualify\n• As low as 3% interest rate\n• Terms up to 30 years\n\n**Socialized Housing:**\n• Starting at ₱480,000 (Pag-IBIG socialized)\n• Eligible for OFWs and local workers",
    suggestions: ['Pag-IBIG financing', 'Pre-selling options', 'Cavite properties', 'Schedule a viewing'],
  },

  // ── BUDGET: 3M–8M ────────────────────────────────────────────────────────
  {
    patterns: ['3m to 8m', '3 to 8', '₱3m', '₱4m', '₱5m', '₱6m', '₱7m', '₱8m',
      '3 million', '4 million', '5 million', '6 million', '7 million', '8 million',
      'mid range', 'middle range', 'moderate budget', '3m-8m', '3m–8m'],
    text: "💰 The **₱3M–₱8M** range offers excellent value — here's what's available:\n\n**Condominiums:**\n• 1BR in Pasig / Mandaluyong – ₱3.5M–₱5.5M\n• 2BR in QC / Paranaque – ₱4.5M–₱7M\n• 1BR in Makati fringe areas – ₱4M–₱6.5M\n\n**Townhouses:**\n• Paranaque / Las Pinas – ₱4M–₱6.5M\n• QC (Novaliches, Fairview) – ₱4.5M–₱7M\n• Marikina / Antipolo – ₱3.5M–₱6M\n\n**House & Lot:**\n• Cavite (Dasmarinas, GMA) – ₱4M–₱7.5M\n• Laguna (Sta. Rosa, Calamba) – ₱4.5M–₱8M\n• Rizal (Cainta, Taytay) – ₱3.5M–₱7M\n\n**Financing Options:**\n• Pag-IBIG – Up to ₱6M loanable\n• Bank loan – Up to 80% of property value",
    suggestions: ['Condo options', 'Townhouse options', 'House & lot', 'Payment computation', 'Schedule a viewing'],
  },

  // ── BUDGET: 8M–20M ───────────────────────────────────────────────────────
  {
    patterns: ['8m to 20m', '8 to 20', '₱9m', '₱10m', '₱12m', '₱15m', '₱18m', '₱20m',
      '9 million', '10 million', '12 million', '15 million', '18 million', '20 million',
      'upper mid', 'mid-high', 'semi-luxury', 'high end condo', 'premium property',
      '8m–20m', '8m-20m'],
    text: "💎 In the **₱8M–₱20M** range, you get premium residences:\n\n**Premium Condos:**\n• 2BR in BGC – ₱8M–₱15M\n• 2BR in Makati CBD – ₱9M–₱18M\n• 3BR in Pasig / Ortigas – ₱8.5M–₱14M\n• High-floor 1BR in prime locations – ₱8M–₱12M\n\n**Premium Houses:**\n• Single detached in QC (Diliman, UP area) – ₱10M–₱20M\n• Townhouse in Makati / San Juan – ₱9M–₱18M\n• House & lot in Alabang / Muntinlupa – ₱10M–₱20M\n\n**Features typically included:**\n• Full amenities (pool, gym, function rooms)\n• Higher floors with better views\n• Better security systems\n• Concierge services\n\n**Financing:** Bank loans up to ₱16M available",
    suggestions: ['BGC premium condos', 'Makati properties', 'Alabang homes', 'Bank financing', 'Private viewing'],
  },

  // ── BUDGET: LUXURY 20M+ ───────────────────────────────────────────────────
  {
    patterns: ['luxury', 'premium', 'high end', 'mahal', 'upscale', 'penthouse', '20m+', '₱20m+',
      'above 20m', 'over 20m', 'more than 20m', '25m', '30m', '50m', 'exclusive',
      'ultra luxury', 'forbes park', 'dasmarinas village', 'urdaneta village',
      'ayala alabang village', 'san antonio village', 'bel air', 'rockwell',
      'the residences', 'park terraces', 'one ayala', 'grand hyatt', 'luxury living',
      'high floor', 'sky suite', 'penthouse suite', 'mansion', 'villa'],
    text: "✨ Our **Luxury Portfolio** — the finest properties in the Philippines:\n\n**Ultra-Premium Condos:**\n• BGC (The Suites, Park Terraces) – ₱20M–₱80M\n• Rockwell Center, Makati – ₱25M–₱100M+\n• Ayala Avenue vicinity – ₱22M–₱70M\n• Sky suites & penthouses – ₱35M–₱200M+\n\n**Exclusive Villages:**\n• Forbes Park, Makati – ₱50M–₱500M+\n• Dasmarinas Village, Makati – ₱40M–₱300M+\n• Urdaneta Village – ₱35M–₱200M+\n• Ayala Alabang Village – ₱30M–₱150M+\n• Valle Verde, Pasig – ₱25M–₱120M+\n• White Plains, QC – ₱20M–₱80M+\n\n**Luxury Features:**\n• Private elevator lobbies\n• Concierge & butler service\n• Smart home automation\n• Exclusive clubhouse access\n• Private pool options\n\nOur **Senior Luxury Specialists** handle this segment with utmost discretion.",
    suggestions: ['Connect with luxury specialist', 'BGC penthouses', 'Rockwell properties', 'Forbes Park listings', 'Private viewing'],
  },

  // ── MAKATI ────────────────────────────────────────────────────────────────
  {
    patterns: ['makati', 'ayala avenue', 'ayala ave', 'legaspi village', 'salcedo village',
      'bel air makati', 'guadalupe', 'rockwell', 'circuit makati', 'poblacion makati',
      'little tokyo', 'greenbelt', 'glorietta', 'power plant mall', 'century city'],
    text: "📍 **Makati City** — The Philippines' Financial Capital!\n\nOur Makati listings cover:\n\n**Prime Areas:**\n• Ayala Avenue corridor – Top corporate & residential\n• Legaspi / Salcedo Village – Upscale residential\n• Rockwell Center – Ultra-premium enclave\n• Poblacion – Trendy, urban living\n• Circuit Makati – Mixed-use development\n\n**For Sale:**\n• Studio condos: ₱4.5M–₱8M\n• 1BR condos: ₱6M–₱15M\n• 2BR condos: ₱10M–₱30M\n• 3BR condos: ₱18M–₱60M\n• Penthouse: ₱35M–₱200M+\n• Houses (Bel Air, Forbes): ₱40M–₱500M+\n\n**For Rent:**\n• Studio: ₱18,000–₱40,000/month\n• 1BR: ₱25,000–₱65,000/month\n• 2BR: ₱45,000–₱120,000/month\n• 3BR: ₱70,000–₱200,000/month\n\n**Why Makati?**\n✅ Central business district\n✅ Best dining & nightlife\n✅ Top international schools nearby\n✅ World-class hospitals\n✅ High rental yield (6–9% annually)",
    suggestions: ['Buy in Makati', 'Rent in Makati', 'Makati condos', 'Rockwell properties', 'Talk to an agent'],
  },

  // ── BGC / TAGUIG ─────────────────────────────────────────────────────────
  {
    patterns: ['bgc', 'taguig', 'bonifacio global city', 'global city', 'bonifacio',
      'high street', 'uptown bgc', 'one bgc', 'bgc condos', 'fort bonifacio',
      'the fort', 'mckinley hill', 'mckinley west', 'westside city', 'southgate',
      'market market', 'venice grand canal', 'serendra', 'the fort strip'],
    text: "📍 **BGC (Bonifacio Global City) / Taguig** — Metro Manila's Most Walkable District!\n\n**Popular BGC Developments:**\n• One BGC – Ultra-premium living\n• The Suites at One BGC – Penthouse-level luxury\n• Uptown Ritz – High-end residential\n• Park Terraces – Full-amenity condo\n• Serendra – Low-rise, garden-style\n• McKinley Hill & West – Mixed community\n\n**For Sale:**\n• Studio: ₱5M–₱10M\n• 1BR: ₱7M–₱18M\n• 2BR: ₱12M–₱35M\n• 3BR: ₱20M–₱60M\n• Penthouse: ₱40M–₱150M+\n\n**For Rent:**\n• Studio: ₱22,000–₱50,000/month\n• 1BR: ₱35,000–₱75,000/month\n• 2BR: ₱55,000–₱130,000/month\n• 3BR: ₱80,000–₱220,000/month\n\n**Why BGC?**\n✅ Pet-friendly buildings\n✅ Walkable to restaurants, bars, offices\n✅ Strong expat community\n✅ Clean streets, green parks\n✅ Highest rental demand in Manila",
    suggestions: ['Buy in BGC', 'Rent in BGC', 'McKinley properties', 'BGC luxury condos', 'Schedule a viewing'],
  },

  // ── QUEZON CITY ───────────────────────────────────────────────────────────
  {
    patterns: ['quezon city', 'qc', 'cubao', 'katipunan', 'diliman', 'timog', 'eastwood',
      'commonwealth', 'fairview', 'novaliches', 'mindanao avenue', 'up diliman',
      'teachers village', 'scout area', 'kamuning', 'tomas morato', 'new manila',
      'san juan', 'white plains', 'araneta center', 'smart araneta coliseum',
      'trinoma', 'sm north edsa', 'vertis north'],
    text: "📍 **Quezon City** — Metro Manila's Largest City!\n\n**Popular Areas:**\n• Eastwood City – Modern mixed-use hub\n• Katipunan / UP area – Academic & residential\n• Vertis North – Emerging premier district\n• Scout Area / Tomas Morato – Lifestyle district\n• New Manila / White Plains – Upscale residential\n• Fairview / Novaliches – Affordable suburbs\n• Commonwealth – Mid-range residential\n\n**For Sale:**\n• Studio/1BR condos: ₱2.8M–₱8M\n• 2BR condos: ₱4.5M–₱12M\n• Townhouses: ₱4M–₱10M\n• Single detached houses: ₱5M–₱30M\n• Lot only: ₱15,000–₱80,000/sqm\n\n**For Rent:**\n• Studio: ₱10,000–₱28,000/month\n• 1BR: ₱15,000–₱40,000/month\n• 2BR: ₱22,000–₱65,000/month\n• House: ₱30,000–₱100,000/month\n\n**Why QC?**\n✅ Largest city, most diverse options\n✅ Near top universities (UP, Ateneo, Miriam)\n✅ Excellent hospital network\n✅ More space for the price vs Makati/BGC",
    suggestions: ['Buy in QC', 'Rent in QC', 'Eastwood condos', 'Katipunan area', 'Talk to an agent'],
  },

  // ── PASIG / ORTIGAS ───────────────────────────────────────────────────────
  {
    patterns: ['pasig', 'ortigas', 'ortigas center', 'mandaluyong', 'san juan', 'wack wack',
      'kapitolyo', 'san antonio pasig', 'greenfield district', 'lanuza', 'pasig city',
      'rosario pasig', 'cainta', 'taytay', 'ugong', 'valle verde', 'julia vargas',
      'oranbo', 'maybunga', 'shaw boulevard', 'edsa pasig', 'estancia'],
    text: "📍 **Pasig / Ortigas Center** — The Business & Residential Boom Hub!\n\n**Key Areas:**\n• Ortigas Center – Business district, malls, offices\n• Kapitolyo – Trendy food & lifestyle area\n• Greenfield District – Master-planned community\n• Valle Verde – Exclusive residential village\n• San Antonio Village – Upscale mid-rise condos\n• Mandaluyong CBD – Near EDSA, great connectivity\n\n**For Sale:**\n• Studio condos: ₱3M–₱7M\n• 1BR condos: ₱4.5M–₱10M\n• 2BR condos: ₱6.5M–₱15M\n• Townhouses: ₱5M–₱12M\n• Houses (Valle Verde): ₱20M–₱80M+\n\n**For Rent:**\n• Studio: ₱12,000–₱30,000/month\n• 1BR: ₱18,000–₱45,000/month\n• 2BR: ₱28,000–₱70,000/month\n• House: ₱40,000–₱150,000/month\n\n**Why Pasig/Ortigas?**\n✅ Central location — easy to get everywhere\n✅ Rapidly appreciating property values\n✅ SM Megamall, Estancia, Robinsons Galleria nearby\n✅ Strong BPO and corporate demand",
    suggestions: ['Buy in Pasig', 'Rent in Pasig', 'Ortigas condos', 'Mandaluyong options', 'Talk to an agent'],
  },

  // ── CAVITE ────────────────────────────────────────────────────────────────
  {
    patterns: ['cavite', 'bacoor', 'imus', 'dasmarinas', 'dasmariñas', 'general trias', 'gen trias',
      'kawit', 'noveleta', 'rosario cavite', 'tagaytay', 'silang', 'amadeo', 'trece martires',
      'naic', 'tanza', 'ternate', 'cavite city', 'cavitex', 'cavite properties'],
    text: "📍 **Cavite Province** — Ideal for Families & OFW Investments!\n\n**Most Popular Areas:**\n• Bacoor – ₱2.5M–₱8M (very accessible via CLEX)\n• Imus – ₱2.8M–₱7M (commercial boom area)\n• Dasmarinas – ₱2.5M–₱6.5M (large subdivisions)\n• General Trias – ₱2.3M–₱6M (growing rapidly)\n• Tagaytay – ₱3M–₱20M+ (tourism, cool climate)\n• Silang – ₱2.5M–₱8M (near Tagaytay)\n\n**Popular Subdivisions:**\n• Camella Homes – ₱2.5M–₱5M\n• Brittany Sta. Rosa – ₱5M–₱15M\n• Lancaster New City – ₱1.8M–₱4.5M\n• Ponticelli Gardens – ₱6M–₱15M\n• Portofino – ₱8M–₱25M\n\n**Property Types:**\n• Townhouses: ₱2.2M–₱4.5M\n• Single detached: ₱3M–₱12M\n• Lot only: ₱3,500–₱25,000/sqm\n\n**Why Cavite?**\n✅ Most affordable near Metro Manila\n✅ Bigger lots for the price\n✅ CLEX / CAVITEX expressway access\n✅ Top choice for OFW investments\n✅ Growing commercial areas",
    suggestions: ['Bacoor properties', 'Imus homes', 'Tagaytay properties', 'OFW investment', 'Talk to an agent'],
  },

  // ── LAGUNA ────────────────────────────────────────────────────────────────
  {
    patterns: ['laguna', 'binan', 'sta rosa', 'santa rosa', 'calamba', 'los banos', 'los baños',
      'san pedro laguna', 'cabuyao', 'bay laguna', 'pagsanjan', 'santa cruz laguna',
      'laguna technopark', 'lima', 'laguna properties', 'south luzon'],
    text: "📍 **Laguna Province** — South Luzon's Fast-Growing Real Estate Hub!\n\n**Key Cities/Towns:**\n• Biñan City – ₱2.8M–₱7M (industrial, very accessible)\n• Sta. Rosa – ₱3M–₱12M (PH's most livable city)\n• Cabuyao – ₱2.5M–₱6.5M (near ETON)\n• Calamba – ₱2.8M–₱8M (near hot springs, spa resorts)\n• San Pedro – ₱2.5M–₱6M (near Manila)\n• Los Baños – ₱2.5M–₱7M (near UPLB, cool climate)\n\n**Top Developments:**\n• Brittany Sta. Rosa – Luxury estates\n• Nuvali (Avida, Alveo) – Eco-urban township\n• Solen Residences – Mid-range\n• Camella Calamba – Affordable\n\n**Why Laguna?**\n✅ SLEX / CALAX expressway access\n✅ Near industrial zones (good for rental income)\n✅ Cooler weather vs Manila\n✅ Top schools (DLSU Laguna, San Sebastian)\n✅ Strong OFW buyer demand",
    suggestions: ['Sta. Rosa properties', 'Biñan homes', 'Nuvali condos', 'Laguna house & lot', 'Talk to an agent'],
  },

  // ── BULACAN ───────────────────────────────────────────────────────────────
  {
    patterns: ['bulacan', 'marilao', 'meycauayan', 'bocaue', 'balagtas', 'santa maria bulacan',
      'san jose del monte', 'sjdm', 'malolos', 'guiguinto', 'pandi', 'plaridel',
      'bulacan properties', 'north luzon'],
    text: "📍 **Bulacan Province** — The Underrated North Luzon Gem!\n\n**Key Areas:**\n• Marilao – ₱2.5M–₱6M (near North Luzon Expressway)\n• Meycauayan – ₱2.8M–₱7M (near Valenzuela)\n• Santa Maria – ₱2.5M–₱6.5M (emerging hub)\n• San Jose del Monte – ₱2M–₱5.5M (large city)\n• Guiguinto – ₱2.3M–₱6M (near NLEX)\n• Malolos – ₱2.5M–₱7M (provincial capital)\n\n**Why Bulacan?**\n✅ NLEX easy access to Manila\n✅ New Manila International Airport (NAIA replacement) nearby\n✅ Lower land cost vs Cavite/Laguna\n✅ Rapidly developing commercial zones\n✅ Strong industrial & logistics sector",
    suggestions: ['Bulacan house & lot', 'North Luzon properties', 'SJDM properties', 'Talk to an agent'],
  },

  // ── RIZAL ─────────────────────────────────────────────────────────────────
  {
    patterns: ['rizal', 'cainta', 'taytay', 'antipolo', 'angono', 'binangonan', 'teresa rizal',
      'morong rizal', 'tanay', 'pililla', 'san mateo rizal', 'rodriguez rizal', 'montalban',
      'rizal province', 'east of manila'],
    text: "📍 **Rizal Province** — East of Manila, Nature & City Combined!\n\n**Popular Areas:**\n• Cainta – ₱3M–₱9M (most urban, near QC/Pasig)\n• Taytay – ₱2.8M–₱8M (garments capital, fast growing)\n• Antipolo – ₱2.5M–₱12M (elevated, scenic views)\n• San Mateo – ₱2.5M–₱7M (quiet suburban)\n• Angono – ₱2M–₱5M (artist colony)\n\n**Why Rizal?**\n✅ Lower prices than Metro Manila\n✅ Cooler climate in elevated areas\n✅ Scenic mountain/valley views\n✅ Near Pasig & QC via C-6 road\n✅ Growing infrastructure",
    suggestions: ['Antipolo properties', 'Cainta homes', 'Rizal house & lot', 'Talk to an agent'],
  },

  // ── PARANAQUE / MUNTINLUPA / ALABANG ─────────────────────────────────────
  {
    patterns: ['paranaque', 'paraňaque', 'las pinas', 'las piñas', 'muntinlupa', 'alabang',
      'bf homes', 'bf paranaque', 'sucat', 'san isidro paranaque', 'don galo',
      'filinvest alabang', 'madrigal', 'acacia estates', 'southwoods', 'metro south',
      'festival mall', 'ayala alabang', 'south luzon expressway'],
    text: "📍 **Paranaque / Las Piñas / Muntinlupa / Alabang** — Metro South!\n\n**Key Areas:**\n• BF Homes Paranaque – ₱4M–₱15M (established, family-friendly)\n• Sucat / Dr. A. Santos – ₱3.5M–₱10M (near airport)\n• Las Piñas (BF Resort, CAA) – ₱3M–₱10M\n• Alabang / Filinvest – ₱8M–₱50M+ (upscale)\n• Ayala Alabang Village – ₱20M–₱150M+ (premium)\n• Muntinlupa (Acacia) – ₱5M–₱20M\n\n**Why Metro South?**\n✅ Near NAIA Airport (5–15 mins)\n✅ SLEX access to Cavite/Laguna\n✅ Festival Mall, Alabang Town Center\n✅ Strong OFW family buyer demand\n✅ Established, flood-free subdivisions",
    suggestions: ['BF Homes properties', 'Alabang homes', 'Paranaque condos', 'Airport vicinity', 'Talk to an agent'],
  },

  // ── AGENTS ────────────────────────────────────────────────────────────────
  {
    patterns: ['agent', 'broker', 'talk to agent', 'speak to agent', 'connect with agent',
      'contact agent', 'human', 'person', 'staff', 'sales team', 'representative',
      'talk to an agent', 'real estate agent', 'licensed broker', 'property specialist',
      'sales agent', 'property consultant', 'need help', 'tulong', 'tulungan',
      'consult', 'consultation', 'magtatanong', 'may tanong', 'kausapin'],
    text: "👨‍💼 Our team of **licensed real estate professionals** is ready to assist you!\n\n**Contact Our Agents:**\n📞 Landline: +63 2 8XXX-XXXX\n📱 Mobile: +63 917 XXX-XXXX\n📧 Email: hello@alfimarealty.com\n💬 Viber/WhatsApp: +63 917 XXX-XXXX\n\n**Our Agent Specializations:**\n• 🏙️ Metro Manila Condos – Mark Santos, Ana Reyes\n• 🏡 South Luzon Houses – Carlo Mendoza, Lisa Cruz\n• 🏢 Commercial Properties – Ryan Lim, Grace Tan\n• 👑 Luxury Properties – Michael Sy, Patricia Go\n• 🌍 OFW Specialist – Jerome Dela Cruz\n\n**Office Hours:**\n• Mon–Fri: 8AM–6PM\n• Saturday: 9AM–5PM\n\n**Response Time:** Within 1 business hour during office hours.",
    suggestions: ['Schedule a callback', 'Send an email', 'Office location', 'Schedule a viewing'],
  },

  // ── SCHEDULE VIEWING ──────────────────────────────────────────────────────
  {
    patterns: ['view', 'visit', 'tour', 'viewing', 'inspect', 'bisita', 'schedule', 'schedule a viewing',
      'property tour', 'site visit', 'tripping', 'tara na', 'pumunta', 'punta',
      'open house', 'show unit', 'showroom', 'mag-visit', 'gusto ko puntahan',
      'pwede ba pumunta', 'when can i visit', 'can i visit', 'viewing schedule'],
    text: "📅 We'd love to show you the property in person!\n\n**Viewing Schedule:**\n• Monday–Friday: 9:00 AM – 5:00 PM\n• Saturday: 9:00 AM – 4:00 PM\n• Sunday: By special appointment only\n\n**How to Schedule:**\n1. Tell us the property you're interested in\n2. Choose your preferred date & time\n3. Provide your contact number\n4. Our agent will confirm within 1 hour\n\n**Types of Viewing:**\n• 🏠 On-site property visit\n• 🎥 Virtual tour (video call)\n• 🖥️ Online 360° virtual walkthrough\n\n**Note:** For pre-selling properties, we visit the show unit or model unit.\n\n📞 To book immediately: **+63 917 XXX-XXXX**",
    suggestions: ['Book a viewing now', 'Virtual tour', 'Browse properties first', 'Talk to an agent'],
  },

  // ── PRE-SELLING ───────────────────────────────────────────────────────────
  {
    patterns: ['pre-selling', 'preselling', 'pre selling', 'off plan', 'reservation', 'reserve',
      'pre-sell', 'under construction', 'new development', 'new project', 'launching',
      'project launch', 'early bird', 'pre-launch', 'bagong project', 'bagong condo',
      'rfo', 'ready for occupancy', 'how long to build', 'construction'],
    text: "🏗️ **Pre-Selling Properties** — Smart Investment Choice!\n\n**Why Buy Pre-Selling?**\n✅ 15–30% lower than RFO (Ready for Occupancy) price\n✅ Flexible payment terms (5–10 years)\n✅ Appreciation by turnover (typically 30–50%)\n✅ Choose best unit/floor before others\n✅ Spot cash discounts of 5–15%\n\n**Current Pre-Selling Projects:**\n• Condos in BGC – Turnover 2026–2027\n• QC residential towers – Turnover 2025–2026\n• Cavite house & lot – Turnover 2025\n• Laguna township – Turnover 2026–2028\n\n**Typical Payment Scheme:**\n• Reservation fee: ₱10,000–₱50,000\n• Equity/DP: 10–30% (spread over construction period)\n• Balance: Bank loan / Pag-IBIG / in-house\n\n**RFO Properties:**\nAlso available — move in within 30–60 days!",
    suggestions: ['View pre-selling projects', 'RFO properties', 'Payment computation', 'Talk to an agent'],
  },

  // ── PAYMENT / FINANCING ───────────────────────────────────────────────────
  {
    patterns: ['payment', 'downpayment', 'down payment', 'dp', 'amortization', 'monthly payment',
      'loan', 'housing loan', 'mortgage', 'pag-ibig', 'pagibig', 'hdmf',
      'bank loan', 'bank financing', 'in-house financing', 'spot cash',
      'cash payment', 'flexible payment', 'payment scheme', 'magkano monthly',
      'how much monthly', 'monthly amortization', 'interest rate',
      'compute', 'computation', 'kalkulahin', 'pag ibig', 'pag-ibig fund'],
    text: "💳 **Payment & Financing Options at Alfima Realty:**\n\n**1. Spot Cash 💵**\n• Full payment upfront\n• Best discounts (5–15% off)\n• Fastest transfer of ownership\n\n**2. In-House Financing 🏠**\n• 10–20% down payment\n• Balance paid in monthly installments\n• Terms: 1–10 years\n• Interest: 12–18% per annum\n• No bank approval needed!\n\n**3. Pag-IBIG Fund (HDMF) 🏛️**\n• Loanable up to ₱6.5M\n• Interest: 6.5% (lowest available)\n• Terms up to 30 years\n• For properties ₱3M and below — best option!\n\n**4. Bank Financing 🏦**\n• Loanable up to 80–90% of property value\n• Interest: 7–12% per annum\n• Terms: 5–25 years\n• Major banks: BDO, BPI, Metrobank, Security Bank, PNB\n\n**Sample Computation:**\n• ₱3M property → ~₱16,000/month (Pag-IBIG, 30 yrs)\n• ₱5M property → ~₱35,000/month (Bank, 20 yrs)\n• ₱10M property → ~₱65,000/month (Bank, 20 yrs)",
    suggestions: ['Pag-IBIG details', 'Bank loan process', 'In-house financing', 'Compute my payment', 'Talk to an agent'],
  },

  // ── PAG-IBIG ──────────────────────────────────────────────────────────────
  {
    patterns: ['pag-ibig details', 'pag ibig details', 'pag-ibig requirements', 'pag-ibig process',
      'pagibig details', 'how pag-ibig works', 'pagibig loan', 'pag-ibig housing loan',
      'pag ibig fund', 'hdmf', 'how much pag-ibig', 'pag-ibig interest', 'qualify pag-ibig'],
    text: "🏛️ **Pag-IBIG Fund (HDMF) Housing Loan — Complete Guide:**\n\n**Who Can Apply?**\n• Active Pag-IBIG member (at least 24 monthly contributions)\n• OFW members (overseas contributions accepted)\n• Self-employed with Pag-IBIG membership\n\n**Loan Details:**\n• Maximum loanable: ₱6.5M\n• Interest rates:\n  – ₱450,000 & below: 6.5% p.a.\n  – ₱450,001–₱1.75M: 7.5% p.a.\n  – ₱1.75M–₱3M: 8.5% p.a.\n  – ₱3M–₱6.5M: 9.5% p.a.\n• Maximum term: 30 years\n\n**Requirements:**\n• Pag-IBIG Membership ID\n• Valid IDs (2 government-issued)\n• Proof of income / payslips\n• Latest ITR (or employer certificate)\n• Property documents (TCT, tax declaration)\n• Duly filled Pag-IBIG forms\n\n**Processing Time:** 3–6 months typically.\n\nOur agents assist with the entire Pag-IBIG application for FREE! 🙌",
    suggestions: ['Bank loan process', 'In-house financing', 'OFW Pag-IBIG', 'Talk to an agent', 'Schedule a viewing'],
  },

  // ── BANK LOAN ─────────────────────────────────────────────────────────────
  {
    patterns: ['bank loan process', 'bank requirements', 'how to get bank loan', 'bank financing details',
      'bdo loan', 'bpi loan', 'metrobank loan', 'security bank', 'pnb loan',
      'bank approval', 'bank pre-approval', 'credit check', 'housing loan bank'],
    text: "🏦 **Bank Housing Loan — Everything You Need to Know:**\n\n**Best Banks for Housing Loans:**\n• BDO – Up to 90% financing, 6.88% (1yr fixed)\n• BPI – Up to 90% financing, 6.99% (1yr fixed)\n• Metrobank – Up to 85%, competitive rates\n• Security Bank – Up to 90%, fast processing\n• PNB – Up to 90%, OFW-friendly\n\n**Basic Requirements:**\n• At least 21–65 years old\n• Filipino citizen (or with permanent residency)\n• Minimum income: ₱50,000/month\n• Employment: at least 2 years (employed) or 3 years (self-employed)\n• No major derogatory credit history\n\n**Documents Needed:**\n• Proof of income (payslips, COE, ITR)\n• Valid government IDs (2 pcs)\n• Birth certificate / marriage certificate\n• Property documents from developer\n• Filled bank application form\n\n**Process:**\n1. Pre-qualify (1–2 days)\n2. Submit documents (1 week)\n3. Bank appraisal (2–4 weeks)\n4. Loan approval (4–8 weeks)\n5. Loan release & title transfer\n\n**Our agents assist with bank coordination at NO extra charge!**",
    suggestions: ['Pag-IBIG vs Bank loan', 'In-house financing', 'Compute my monthly', 'Talk to an agent'],
  },

  // ── OFW ───────────────────────────────────────────────────────────────────
  {
    patterns: ['ofw', 'overseas', 'abroad', 'foreign', 'remittance', 'ofw investor', 'ofw buyer',
      'nasa ibang bansa', 'nandito sa ibang bansa', 'dubai', 'saudi', 'kuwait',
      'qatar', 'singapore', 'hongkong', 'japan', 'korea', 'usa', 'canada',
      'australia', 'uk', 'europe', 'ofw housing', 'invest from abroad',
      'buying from overseas', 'remote purchase', 'online purchase'],
    text: "🌍 **OFW Real Estate Investors — We've Got You Covered!**\n\nAlfima Realty specializes in helping OFWs invest from anywhere in the world!\n\n**OFW Advantages:**\n✅ Special low down payment schemes\n✅ Pag-IBIG overseas membership accepted\n✅ Can process documents via SPA (Special Power of Attorney)\n✅ Virtual property tours via video call\n✅ Online document submission\n✅ Dollar / remittance payment options\n\n**Popular OFW Picks:**\n• Cavite & Laguna house & lot (family to move in)\n• QC condos (for passive rental income)\n• Pre-selling for max appreciation\n\n**Process for OFWs:**\n1. Virtual tour / consultation via Zoom/Viber\n2. Reservation via online payment\n3. Documents via courier or digital scan\n4. SPA signed at Philippine Embassy/Consul\n5. Pag-IBIG overseas application online\n\n**Our OFW Specialist:** Jerome Dela Cruz\n📱 +63 917 XXX-XXXX | Viber/WhatsApp",
    suggestions: ['OFW-friendly properties', 'SPA guide', 'Pag-IBIG overseas', 'Schedule video call', 'Talk to OFW specialist'],
  },

  // ── DEVELOPER / BRAND ─────────────────────────────────────────────────────
  {
    patterns: ['developer', 'ayala land', 'sm', 'smdc', 'dmci', 'filinvest', 'robinsons land',
      'federal land', 'megaworld', 'rockwell land', 'sta lucia', 'camella',
      'empire east', 'alveo', 'avida', 'amaia', 'lumina', 'PHirst park homes',
      'suntrust', 'phinma', 'shang properties', 'century properties', 'vistaland'],
    text: "🏗️ **Property Developers We Work With:**\n\nAlfima Realty is an accredited seller for top Philippine developers!\n\n**Tier 1 Developers:**\n• **Ayala Land** – Alveo, Avida, Amaia, Ayala Premiere\n• **SM / SMDC** – Shell, Bloom, Field, Sea, Air, Wind, Frame residences\n• **Megaworld** – The Residences, Lucky Chinatown, McKinley, Eastwood\n• **Rockwell Land** – 8 Rockwell, The Grove, 32 Sanson\n• **Federal Land** – Grand Hyatt, The Seasons, The Lattice\n\n**Mid-Range Developers:**\n• **DMCI Homes** – Kai Garden, Flair Towers, Ivory Wood\n• **Robinsons Land** – Magnolia, Chimes, Luma, Breeze\n• **Filinvest** – The Levels, Botanika, 2 Parkplace\n• **Empire East** – Springfield, Covent Garden, Pioneer Woodlands\n\n**Affordable Brands:**\n• **Camella** – Nationwide affordable housing\n• **Lumina Homes** – ₱480K–₱2M range\n• **Amaia** – Amaia Steps, Amaia Series\n• **Vista Land** – Brittany, Crown Asia, Lessandra\n\nWe help you compare and choose the right developer for your needs!",
    suggestions: ['SMDC properties', 'Ayala Land condos', 'DMCI options', 'Camella affordable', 'Talk to an agent'],
  },

  // ── SMDC ──────────────────────────────────────────────────────────────────
  {
    patterns: ['smdc', 'sm development', 'shell residences', 'bloom residences', 'field residences',
      'sea residences', 'air residences', 'wind residences', 'frame residences',
      'light residences', 'shore residences', 'jazz residences', 'trees residences'],
    text: "🏙️ **SMDC (SM Development Corporation) Properties:**\n\nSMDC is one of the most popular condo developers in the Philippines!\n\n**Key Projects & Prices:**\n• **Shell Residences** (Mall of Asia) – ₱3.5M–₱8M\n• **Sea Residences** (MOA Complex) – ₱3M–₱7M\n• **Air Residences** (Ayala Area) – ₱5M–₱12M\n• **Bloom Residences** (Sucat) – ₱2.8M–₱6M\n• **Field Residences** (Sucat) – ₱2.8M–₱5.5M\n• **Wind Residences** (Tagaytay) – ₱3M–₱7M\n• **Trees Residences** (Fairview, QC) – ₱2.5M–₱5M\n• **Jazz Residences** (Makati) – ₱4M–₱10M\n• **Light Residences** (Mandaluyong) – ₱3M–₱7M\n• **Frame Residences** (QC) – ₱2.8M–₱6M\n\n**SMDC Advantages:**\n✅ Near SM Malls (walk-able!)\n✅ Strong rental demand\n✅ Good for investment\n✅ Flexible payment terms",
    suggestions: ['SMDC near MOA', 'SMDC in QC', 'SMDC in Makati', 'Schedule SMDC viewing', 'Talk to an agent'],
  },

  // ── DMCI ──────────────────────────────────────────────────────────────────
  {
    patterns: ['dmci', 'dmci homes', 'kai garden', 'flair towers', 'ivory wood', 'spring residences',
      'zinnia towers', 'illumina residences', 'tivoli garden', 'sheridan towers',
      'magnolia place', 'dm consunji', 'garden style', 'resort style condo'],
    text: "🌿 **DMCI Homes Properties — Garden-Style Living!**\n\nDMCI is famous for their lush, garden-style condominiums — feels like a resort inside the city!\n\n**Popular DMCI Projects:**\n• **Kai Garden Residences** (Mandaluyong) – ₱3.5M–₱8M\n• **Flair Towers** (Mandaluyong) – ₱3.5M–₱7.5M\n• **Ivory Wood** (Quezon City) – ₱3M–₱6.5M\n• **Spring Residences** (Bicutan) – ₱2.8M–₱6M\n• **Zinnia Towers** (Munoz, QC) – ₱2.5M–₱5.5M\n• **Illumina Residences** (Sta. Mesa) – ₱2.8M–₱6M\n• **Tivoli Garden** (Mandaluyong) – ₱3M–₱7M\n\n**Why DMCI?**\n✅ Garden/resort-style design\n✅ Large units (generous sqm)\n✅ Triple-A building quality\n✅ Very good property management\n✅ High rental occupancy rate",
    suggestions: ['DMCI in Mandaluyong', 'DMCI in QC', 'DMCI garden style', 'Schedule DMCI viewing', 'Talk to an agent'],
  },

  // ── ABOUT ALFIMA ──────────────────────────────────────────────────────────
  {
    patterns: ['about', 'company', 'alfima', 'alfima realty', 'who are you', 'history',
      'background', 'about alfima realty', 'tell me about', 'what is alfima',
      'describe alfima', 'company profile', 'about the company', 'sino kayo',
      'ano ang alfima', 'licensed', 'prc', 'hlurb', 'dhsud', 'accredited'],
    text: "🏢 **About Alfima Realty Inc.**\n\nAlfima Realty Inc. is a trusted and licensed Philippine real estate company dedicated to helping Filipinos find their dream home and make smart property investments.\n\n**What We Do:**\n• Property buying & selling (residential & commercial)\n• Property leasing & rentals\n• Real estate investment consulting\n• OFW property investment assistance\n• Property management services\n\n**Our Coverage:**\n• Metro Manila (all cities)\n• Cavite, Laguna, Bulacan, Rizal\n• Other key provinces upon request\n\n**Our Credentials:**\n• Licensed Real Estate Brokers (PRC)\n• Registered with DHSUD / HLURB\n• Accredited by top property developers\n• Members of PAREB & REBAP\n\n**Why Choose Alfima?**\n✅ Licensed & professional team\n✅ Hundreds of satisfied clients\n✅ Free consultation & property matching\n✅ End-to-end transaction assistance\n✅ After-sales support",
    suggestions: ['Browse properties', 'Talk to an agent', 'Office location', 'Client testimonials'],
  },

  // ── OFFICE LOCATION ───────────────────────────────────────────────────────
  {
    patterns: ['location', 'address', 'office', 'directions', 'map', 'find you', 'nasa saan',
      'office location', 'where are you', 'saan kayo', 'saan ang office', 'how to get there',
      'paano pumunta', 'papunta', 'google maps', 'waze', 'near mrt', 'mrt station'],
    text: "📍 **Alfima Realty Inc. — Office Location:**\n\n🏢 **Address:**\n123 Real Estate Ave., Makati City\nMetro Manila, Philippines\n\n🚇 **Nearest MRT Station:** Ayala Station (5-minute walk)\n🚌 **Buses:** EDSA bus routes stop nearby\n🚗 **Parking:** Available at the building\n\n**Landmarks nearby:**\n• Greenbelt Mall (2 mins walk)\n• Glorietta (3 mins walk)\n• Ayala Triangle Gardens (5 mins walk)\n\n🕐 **Office Hours:**\n• Monday–Friday: 8:00 AM – 6:00 PM\n• Saturday: 9:00 AM – 5:00 PM\n• Sunday: Closed (emergency inquiries via email)\n\n📞 **Contact:**\n• Landline: +63 2 8XXX-XXXX\n• Mobile: +63 917 XXX-XXXX\n• Email: hello@alfimarealty.com\n\nWalk-ins are welcome during office hours! No appointment needed.",
    suggestions: ['Call us now', 'Send an email', 'Schedule a viewing', 'Browse properties'],
  },

  // ── OFFICE HOURS ──────────────────────────────────────────────────────────
  {
    patterns: ['hours', 'open', 'close', 'bukas', 'oras', 'when', 'office hours', 'business hours',
      'anong oras', 'what time', 'open today', 'open saturday', 'open sunday',
      'open on weekends', 'what days', 'available', 'operating hours'],
    text: "🕐 **Alfima Realty Office Hours:**\n\n• **Monday–Friday:** 8:00 AM – 6:00 PM\n• **Saturday:** 9:00 AM – 5:00 PM\n• **Sunday:** Closed\n• **Holidays:** Closed (emergency email monitored)\n\n**Outside office hours?**\n📧 Email: hello@alfimarealty.com\n📱 Viber/WhatsApp: +63 917 XXX-XXXX\n\nWe check messages frequently and respond to urgent inquiries even after hours. For property emergencies, our on-call agent is reachable on mobile.\n\n⚡ **Response Time:**\n• Email: Within 4 hours (during business days)\n• Phone/Viber: Within 30 minutes",
    suggestions: ['Call us now', 'Send an email', 'Office location', 'Schedule a viewing'],
  },

  // ── CONTACT US ────────────────────────────────────────────────────────────
  {
    patterns: ['contact', 'contact us', 'call', 'email', 'viber', 'whatsapp', 'messenger',
      'facebook', 'instagram', 'social media', 'chat', 'message', 'reach you',
      'how to contact', 'number', 'phone number', 'email address', 'makipag-ugnayan',
      'makipag-usap', 'tumawag', 'mag-email', 'send message'],
    text: "📞 **Contact Alfima Realty Inc.:**\n\n**Phone / Mobile:**\n• Landline: +63 2 8XXX-XXXX\n• Mobile: +63 917 XXX-XXXX\n• Toll-free: 1800-XXX-XXXX\n\n**Messaging:**\n• 💬 Viber: +63 917 XXX-XXXX\n• 💬 WhatsApp: +63 917 XXX-XXXX\n• 💬 Facebook Messenger: @AlfimareRealtyInc\n\n**Email:**\n• General: hello@alfimarealty.com\n• Sales: sales@alfimarealty.com\n• Rentals: rentals@alfimarealty.com\n• Commercial: commercial@alfimarealty.com\n\n**Social Media:**\n• 📘 Facebook: Alfima Realty Inc.\n• 📸 Instagram: @alfimaRealty\n• 📺 YouTube: Alfima Realty TV\n\n**Office:**\n• 123 Real Estate Ave., Makati City\n• Mon–Fri 8AM–6PM, Sat 9AM–5PM",
    suggestions: ['Schedule a viewing', 'Talk to an agent', 'Office location', 'Browse properties'],
  },

  // ── PROPERTY FEATURES ─────────────────────────────────────────────────────
  {
    patterns: ['amenities', 'facilities', 'pool', 'swimming pool', 'gym', 'fitness', 'parking',
      'security', 'guard', 'cctv', 'playground', 'function room', 'clubhouse',
      'garden', 'roof deck', 'sky lounge', 'game room', 'study room', 'business center',
      'concierge', 'lobby', 'elevator', 'escalator', 'laundry', 'mail room'],
    text: "🏊 **Common Property Amenities by Tier:**\n\n**Standard Condos (₱2.5M–₱6M):**\n• Swimming pool\n• Gym / fitness center\n• 24/7 security & CCTV\n• Parking (optional purchase)\n• Lobby lounge\n• Function room\n\n**Mid-Range Condos (₱6M–₱15M):**\n• All of the above, plus:\n• Multi-level pool area\n• Kids' play area\n• Study / co-working lounge\n• Rooftop garden / sky deck\n• Multiple elevator banks\n• Shuttle service\n\n**Luxury Condos (₱15M+):**\n• All of the above, plus:\n• Private gym & spa\n• Concierge & butler service\n• Valet parking\n• Infinity pool\n• Smart home automation\n• Private function halls\n• Wine cellar / cigar room\n• Driver's waiting lounge\n\n**House Subdivisions:**\n• Clubhouse & pool\n• Basketball / tennis courts\n• Jogging path\n• 24/7 security with RFID\n• Commercial area within subdivision",
    suggestions: ['View condo listings', 'Luxury properties', 'House & lot', 'Talk to an agent'],
  },

  // ── PETS ──────────────────────────────────────────────────────────────────
  {
    patterns: ['pet', 'pets', 'dog', 'cat', 'puppy', 'kitten', 'pet friendly', 'pet-friendly',
      'allow pets', 'dogs allowed', 'cats allowed', 'alagang hayop', 'hayop',
      'pet policy', 'can i bring pets', 'pet deposit'],
    text: "🐾 **Pet-Friendly Properties at Alfima Realty!**\n\n**Pet-Friendly Condos in Metro Manila:**\n• Most BGC condos allow small to medium pets\n• Several QC buildings (Eastwood, Katipunan area)\n• Some Makati buildings (with pet registration)\n• Mandaluyong mid-rise condos\n\n**Typical Pet Policies:**\n• Maximum 2 pets per unit\n• Small/medium breeds only (under 15kg) — some allow larger\n• Pet deposit: ₱5,000–₱15,000\n• Registration with building admin required\n• No pet fees in some buildings, monthly pet fee in others (₱500–₱2,000)\n\n**Most Pet-Friendly Areas:**\n• BGC — Very pet-friendly culture, pet parks nearby\n• Eastwood City, QC — Dog-walking areas\n• Rockwell, Makati — Pet-friendly policies\n\n**House & Lot:** Generally no pet restrictions!\n\nLet our agents find you the perfect pet-friendly unit! 🐶🐱",
    suggestions: ['Pet-friendly BGC units', 'Pet-friendly QC condos', 'House for pets', 'Talk to an agent'],
  },

  // ── PARKING ───────────────────────────────────────────────────────────────
  {
    patterns: ['parking', 'car park', 'parking slot', 'parking space', 'garage', 'carport',
      'parking included', 'parking price', 'tandem parking', 'covered parking',
      'basement parking', 'mag-park', 'sasakyan', 'parking fee'],
    text: "🚗 **Parking Information:**\n\n**Condo Parking:**\n• Most condos have separate parking slots for sale/rent\n• Price range: ₱500,000–₱3M per slot (for purchase)\n• Monthly rental: ₱3,000–₱15,000/month\n• Some developments include 1 parking slot in unit price\n• Premium parking: ₱5,000–₱20,000/month (BGC, Makati)\n\n**Types of Parking:**\n• Standard single slot\n• Tandem slot (2 cars, one behind)\n• Van-accessible slot (higher ceiling)\n\n**House & Lot:**\n• Most have covered carport (1–2 cars)\n• Higher-end homes have garage for 2–4 cars\n\n**EV Charging:**\n• BGC developments — EV charging stations increasingly available\n• New premium condos include EV-ready slots\n\n**Tip:** In BGC and Makati, parking can be a significant additional cost — factor this into your budget!",
    suggestions: ['Condo with parking', 'House & lot with garage', 'BGC parking rates', 'Talk to an agent'],
  },

  // ── FURNISHING ────────────────────────────────────────────────────────────
  {
    patterns: ['furnished', 'unfurnished', 'semi-furnished', 'fully furnished', 'furniture',
      'kasama na furniture', 'may kasama na', 'bare unit', 'turn over', 'turnover',
      'interior design', 'renovation', 'fit-out', 'interior', 'decor', 'how unit looks'],
    text: "🛋️ **Property Furnishing Options:**\n\n**Bare / Unfurnished Unit:**\n• Developer turns over basic unit\n• Includes: walls, flooring, basic bathroom fixtures\n• No appliances, no furniture\n• Best for buyers who want to design from scratch\n\n**Semi-Furnished:**\n• Basic built-ins: kitchen cabinets, wardrobes\n• Some include: air conditioning units\n• Tenant/buyer provides bed, sofa, appliances\n\n**Fully Furnished:**\n• Complete furniture & appliances\n• Move-in ready!\n• Includes: bed, sofa, dining set, ref, washing machine, TV\n• Best for rentals targeting expats & executives\n\n**For Rent — Typical Furnishing:**\n• Fully furnished: +20–40% premium on rent\n• Semi-furnished: +10–15% premium\n\n**Interior Design Services:**\nAlfima Realty can connect you with our trusted interior designers for your new unit. Starting from ₱50,000 for studio units.",
    suggestions: ['Furnished units for rent', 'Bare units for sale', 'Interior design referral', 'Talk to an agent'],
  },

  // ── PROPERTY TAXES ────────────────────────────────────────────────────────
  {
    patterns: ['tax', 'taxes', 'real property tax', 'rpt', 'amilyar', 'capital gains tax',
      'cgt', 'transfer tax', 'dst', 'documentary stamp', 'vat', 'withholding tax',
      'buwis', 'how much tax', 'tax computation', 'annual dues', 'association dues',
      'condo dues', 'maintenance fee'],
    text: "📋 **Property Taxes & Fees in the Philippines:**\n\n**When Buying:**\n• **Capital Gains Tax (CGT):** 6% of selling price (paid by seller)\n• **Documentary Stamp Tax (DST):** 1.5% of selling price (split or buyer)\n• **Transfer Tax:** 0.5–0.75% (local government)\n• **Registration Fee:** ~0.25% (Registry of Deeds)\n• **Notarial Fee:** ~0.1% of selling price\n\n**Annual Recurring:**\n• **Real Property Tax (RPT):** 1–2% of assessed value/year\n• **Association Dues (Condo):** ₱50–₱200/sqm/month\n• Example: 35sqm studio → ₱1,750–₱7,000/month dues\n\n**VAT Note:**\n• Properties above ₱3.2M (residential) subject to 12% VAT\n• Pre-selling properties may include VAT in price\n\n**Sample Total Buying Cost for ₱5M Property:**\n• CGT: ₱300,000\n• DST: ₱75,000\n• Transfer Tax: ₱25,000–₱37,500\n• Miscellaneous: ~₱30,000\n• **Total additional cost: ~₱430,000–₱450,000**\n\nOur agents provide a full cost breakdown for any property!",
    suggestions: ['Compute buying cost', 'Talk to an agent', 'Schedule a viewing', 'Browse properties'],
  },

  // ── LEGAL / TITLE ─────────────────────────────────────────────────────────
  {
    patterns: ['title', 'tct', 'cct', 'condominium certificate', 'transfer of title', 'clean title',
      'lot title', 'property title', 'deed of sale', 'contract to sell', 'condo cert',
      'land title', 'how to transfer title', 'title transfer', 'registry of deeds',
      'annotation', 'encumbrance', 'lien', 'mortgage annotation', 'free and clear',
      'legal', 'legal issue', 'owner', 'ownership', 'legitimate', 'legit'],
    text: "📜 **Property Titles & Legal Documents:**\n\n**Types of Titles:**\n• **TCT (Transfer Certificate of Title)** – For house & lot\n• **CCT (Condominium Certificate of Title)** – For condo units\n• **OCT (Original Certificate of Title)** – First-time titled property\n\n**What to Check Before Buying:**\n✅ Title is under seller's name (no unauthorized transfers)\n✅ No encumbrances/annotations (unpaid loans, liens)\n✅ No lis pendens (no court case)\n✅ Tax declarations are updated\n✅ No illegal settlers / squatters\n✅ Boundaries are correct per lot plan\n\n**Contract to Sell vs Deed of Sale:**\n• Contract to Sell – Used for installment/pre-selling (you pay over time)\n• Deed of Sale – Final deed, used when full payment is made\n\n**Title Transfer Process:**\n1. Notarized Deed of Sale\n2. Pay CGT & DST at BIR\n3. Pay Transfer Tax at City Hall\n4. Submit to Registry of Deeds\n5. New title released (2–4 months)\n\nAll our properties come with verified clean titles. Our legal team reviews all documents before transaction! 🛡️",
    suggestions: ['Talk to an agent', 'Browse verified properties', 'Schedule a viewing', 'Contact us'],
  },

  // ── PROPERTY SIZE / SQM ───────────────────────────────────────────────────
  {
    patterns: ['sqm', 'square meter', 'floor area', 'lot area', 'size', 'how big', 'gaano kalaki',
      'laki ng unit', 'floor size', 'lot size', 'malaki', 'maliit', 'bedroom size',
      'unit size', 'how many sqm', 'area', 'dimensions'],
    text: "📐 **Typical Property Sizes in the Philippines:**\n\n**Condominiums:**\n• Studio: 20–32 sqm\n• 1 Bedroom: 35–55 sqm\n• 2 Bedroom: 55–90 sqm\n• 3 Bedroom: 85–130 sqm\n• Penthouse: 150–500+ sqm\n\n**Townhouses:**\n• Typical floor area: 65–120 sqm\n• Lot area: 40–80 sqm\n\n**Single Detached Houses (Metro Manila):**\n• Lot area: 100–300 sqm\n• Floor area: 80–200 sqm\n\n**Single Detached Houses (Provinces):**\n• Lot area: 150–500+ sqm\n• Floor area: 100–300+ sqm\n\n**Price Per SQM (Metro Manila):**\n• Affordable: ₱50,000–₱90,000/sqm\n• Mid-range: ₱90,000–₱180,000/sqm\n• Premium: ₱180,000–₱350,000/sqm\n• Luxury: ₱350,000–₱1,000,000+/sqm\n\n**Land in Metro Manila:**\n• Makati CBD: ₱500,000–₱2M+/sqm\n• BGC: ₱400,000–₱1.5M+/sqm\n• QC prime: ₱80,000–₱300,000/sqm",
    suggestions: ['Studio units', '2BR condos', 'House & lot sizes', 'Talk to an agent'],
  },

  // ── INVESTMENT TIPS ───────────────────────────────────────────────────────
  {
    patterns: ['investment', 'invest', 'roi', 'return on investment', 'rental yield', 'passive income',
      'appreciation', 'magandang investment', 'worth it', 'good investment', 'profit',
      'cash flow', 'rental income', 'kumikita', 'kita', 'negosyo sa real estate',
      'real estate business', 'buy and sell', 'flip property', 'airbnb',
      'short term rental', 'long term rental', 'magpaupa', 'landlord'],
    text: "📈 **Real Estate Investment Guide — Philippines:**\n\n**Why Invest in Philippine Real Estate?**\n✅ Average property appreciation: 5–10% per year\n✅ Rental yields: 4–9% gross per year\n✅ Growing population & urbanization\n✅ Strong OFW remittance demand\n✅ Limited land in Metro Manila = sustained demand\n\n**Best Investment Strategies:**\n\n**Buy & Hold:**\n• Buy pre-selling, hold for 3–5 years\n• Sell at 30–50% appreciation\n• Best for: BGC, Makati, QC prime areas\n\n**Buy-to-Rent:**\n• Earn monthly rental income\n• Rental yield: 5–8% gross\n• Best for: Condos near BPO/business districts\n• BGC studio: ₱7M property → ₱35,000/month rent → ~6% yield\n\n**Short-Term Rental (Airbnb):**\n• Higher income: ₱2,500–₱8,000/night for condos\n• Best locations: BGC, Makati, MOA area, Tagaytay\n• Occupancy: 60–80% in prime areas\n\n**Pre-Selling Flip:**\n• Buy at pre-selling price, sell at near-RFO price\n• Typical profit: 20–40% in 3–4 years\n\n**Top Investment Locations in 2024–2025:**\n1. BGC / Taguig — Highest rental demand\n2. Makati CBD — Evergreen demand\n3. Sta. Rosa, Laguna — Rising star\n4. QC (Vertis North, Eastwood) — Strong growth\n5. Paranaque (near airport) — Consistent demand",
    suggestions: ['BGC investment', 'Rental properties', 'Pre-selling options', 'Talk to investment specialist'],
  },

  // ── AIRBNB / SHORT TERM ───────────────────────────────────────────────────
  {
    patterns: ['airbnb', 'short term', 'short-term rental', 'vacation rental', 'staycation',
      'tourist rental', 'daily rental', 'weekly rental', 'airbnb friendly',
      'allow airbnb', 'transient', 'bed and breakfast', 'hotel alternative'],
    text: "🏨 **Airbnb / Short-Term Rental Properties:**\n\n**Best Locations for Airbnb in PH:**\n• BGC – ₱3,500–₱10,000/night (60–80% occupancy)\n• Makati – ₱2,500–₱8,000/night\n• Mall of Asia Area – ₱2,000–₱6,000/night\n• Tagaytay – ₱2,500–₱7,000/night (weekends are full)\n• Eastwood, QC – ₱1,800–₱4,500/night\n\n**Important: Airbnb Policies per Building**\n• Many condo buildings in PH prohibit short-term rentals\n• Always verify building rules before buying for Airbnb\n• Buildings that allow: usually in tourism zones\n• Buildings that prohibit: require minimum 1–3 month lease\n\n**We can help you find:**\n✅ Airbnb-allowed condo buildings\n✅ Properties with high tourist footfall\n✅ Units already set up for Airbnb operations\n\n**Estimated Airbnb Income (BGC 1BR):**\n• Unit cost: ₱8M\n• Nightly rate: ₱4,000\n• Monthly income at 70% occ: ₱84,000\n• Less expenses: ~₱25,000\n• **Net monthly: ~₱59,000 (8.8% yield!)**",
    suggestions: ['Airbnb-friendly condos', 'BGC investment units', 'MOA area properties', 'Talk to an agent'],
  },

  // ── PROCESS OF BUYING ─────────────────────────────────────────────────────
  {
    patterns: ['how to buy', 'buying process', 'step by step', 'steps to buy', 'process',
      'paano bumili', 'procedure', 'what are the steps', 'guide to buying',
      'first time buyer', 'beginner buyer', 'buying guide', 'how does it work',
      'paano ang process', 'first time home buyer'],
    text: "📋 **Step-by-Step Property Buying Guide:**\n\n**Step 1: Define Your Needs & Budget**\n• Determine budget (monthly capacity)\n• Choose location & property type\n• Decide: condo, house, commercial?\n\n**Step 2: Property Search**\n• Browse Alfima Realty listings\n• Schedule viewings / trippings\n• Compare at least 3 properties\n\n**Step 3: Reservation**\n• Pay reservation fee (₱10,000–₱50,000)\n• Sign Reservation Agreement\n• Property is taken off market\n\n**Step 4: Financing Application**\n• Submit income documents\n• Apply for Pag-IBIG / Bank loan\n• Wait for loan approval (4–8 weeks)\n\n**Step 5: Contract Signing**\n• Sign Contract to Sell\n• Pay down payment (10–30%)\n• Monthly equity payments begin\n\n**Step 6: Loan Release & Title Transfer**\n• Bank releases loan to developer\n• Pay taxes (CGT, DST, Transfer Tax)\n• Title transfer at Registry of Deeds\n• **You're a homeowner! 🎉**\n\n**Step 7: Move In / Turnover**\n• Inspect unit for defects\n• Sign acceptance form\n• Get keys!\n\n**Timeline:** 3–6 months (RFO) | 2–5 years (pre-selling)",
    suggestions: ['Start property search', 'Compute budget', 'Talk to an agent', 'Browse properties'],
  },

  // ── PROCESS OF RENTING ────────────────────────────────────────────────────
  {
    patterns: ['how to rent', 'renting process', 'rental process', 'paano mag-rent',
      'rental requirements', 'rental application', 'moving in', 'deposit',
      'security deposit', 'advance payment', 'advance', 'lease contract',
      'rental contract', 'what do i need to rent', 'renter requirements'],
    text: "📋 **Step-by-Step Rental Process:**\n\n**Step 1: Search & View**\n• Browse available rental listings\n• Schedule property viewing\n• Check amenities & neighborhood\n\n**Step 2: Apply**\n• Submit rental application form\n• Provide valid IDs (2 government-issued)\n• Proof of income (payslip or bank statement)\n• Employment Certificate or ITR\n\n**Step 3: Approval**\n• Landlord / property manager reviews application\n• Background & credit check\n• Approval within 1–3 business days\n\n**Step 4: Contract & Move-In Fees**\n• Sign Lease Contract (1 year typical)\n• Pay:\n  – **Security Deposit:** 1–2 months' rent\n  – **Advance Rent:** 1–2 months\n  – Total move-in cost: 2–4 months' rent\n\n**Step 5: Move In!**\n• Get keys & move in on agreed date\n• Do unit inspection with landlord\n• Take photos of existing damages\n\n**Sample Move-In Cost for ₱25,000/month unit:**\n• 2 months advance: ₱50,000\n• 2 months deposit: ₱50,000\n• **Total: ₱100,000 + 1st month rent**\n\nOur agents assist in finding rentals and negotiating terms!",
    suggestions: ['Browse rental listings', 'Talk to an agent', 'Rental budget guide', 'Schedule a viewing'],
  },

  // ── CONDO VS HOUSE ────────────────────────────────────────────────────────
  {
    patterns: ['condo vs house', 'house vs condo', 'should i buy condo or house', 'better condo or house',
      'mas maganda condo o bahay', 'difference condo house', 'condo or house',
      'which is better', 'compare condo house', 'condo advantages', 'house advantages'],
    text: "🏙️ vs 🏡 **Condo vs House & Lot — Which is Right for You?**\n\n**Choose a CONDO if:**\n✅ You want to live near work (Makati, BGC)\n✅ Budget is under ₱10M\n✅ You're single, couple, or small family\n✅ You value security & amenities (pool, gym)\n✅ You want low-maintenance living\n✅ You want high rental income potential\n\n**Choose a HOUSE & LOT if:**\n✅ You have a growing family\n✅ You have pets or need outdoor space\n✅ You want more privacy\n✅ You prefer to own the land\n✅ You want room to expand/renovate\n✅ Budget allows for Cavite/Laguna prices\n\n**Price Comparison (same budget ₱5M):**\n• Condo: 1–2BR in QC, Mandaluyong, Pasig (Metro Manila)\n• House: 3–4BR with lot in Cavite, Laguna, Bulacan\n\n**Long-term Value:**\n• Condo: Land appreciated, but building depreciates over 50 years\n• House: Land appreciates, you own more land (better for wealth building)\n\n**Best of Both Worlds?**\nBuy a condo now for rental income, then buy a house when family grows! Many of our clients do this!",
    suggestions: ['Browse condos', 'Browse house & lot', 'Investment comparison', 'Talk to an agent'],
  },

  // ── FLOOD / LOCATION SAFETY ───────────────────────────────────────────────
  {
    patterns: ['flood', 'flooding', 'baha', 'mabaha', 'flood prone', 'flood area', 'flood zone',
      'typhoon', 'bagyo', 'safe', 'earthquake', 'landslide', 'hazard', 'risk',
      'safe area', 'flood free', 'elevated', 'high ground', 'safe to buy'],
    text: "🌊 **Flood Risk & Safety Information:**\n\n**Low Flood Risk Areas:**\n• BGC / Taguig – Elevated area, well-drained\n• Makati CBD (Ayala area) – Generally flood-safe\n• Alabang / Muntinlupa – Good drainage\n• Antipolo / Rizal highlands – Elevated terrain\n• Tagaytay – Elevated, minimal flood risk\n\n**Higher Flood Risk Areas to be cautious:**\n• Low-lying parts of Manila\n• Some areas of Malabon, Navotas\n• Parts of Bulacan (during typhoons)\n• Some Marikina valley areas\n\n**How We Help:**\n✅ All properties verified for flood history\n✅ We check NAMRIA & PHIVOLCS flood maps\n✅ We disclose known hazards to buyers\n✅ Higher-floor condos = safer from flooding\n\n**Earthquake Preparedness:**\n• All accredited developments comply with NSCP (National Structural Code)\n• Choose buildings with DENR-ECC clearance\n• Avoid areas near West Valley Fault (parts of QC, Marikina)\n\n**Our Promise:** We only present properties that are safe and legally compliant! 🛡️",
    suggestions: ['Flood-free BGC', 'Elevated properties', 'Safe subdivisions', 'Talk to an agent'],
  },

  // ── SCHOOLS NEARBY ────────────────────────────────────────────────────────
  {
    patterns: ['school', 'schools', 'university', 'college', 'paaralan', 'near school',
      'good school', 'international school', 'ateneo', 'la salle', 'up', 'dlsu',
      'miriam', 'assumption', 'british school', 'american school', 'kids school',
      'distance to school', 'school district', 'education'],
    text: "🎓 **Properties Near Top Schools:**\n\n**Near Universities (Great for Rentals!):**\n• **UP Diliman** → QC properties (Katipunan, Proj 8)\n• **Ateneo de Manila** → Katipunan corridor, QC\n• **La Salle (DLSU)** → Taft Ave, Manila / Paranaque\n• **DLSU Laguna** → Laguna properties\n• **AdMU HS** → Katipunan-Loyola Heights area\n\n**Near International Schools:**\n• **Brent International** (Laguna) → Sta. Rosa, Laguna\n• **International School Manila** → Taguig / BGC\n• **British School Manila** → Taguig area\n• **Xavier School** → San Juan / QC border\n• **Reedley International** → Pasig / Cainta\n\n**Near Top K–12 Schools:**\n• Don Bosco, La Salle Greenhills → Mandaluyong / San Juan\n• Miriam College → Katipunan QC\n• St. Scholastica's → Malate / Paranaque\n• The Assumption → Makati\n\n**Investment Tip:** Properties within 500m of top universities command 10–20% higher rents! Students + faculty = guaranteed rental demand.",
    suggestions: ['QC near Ateneo', 'BGC near ISM', 'Katipunan properties', 'Talk to an agent'],
  },

  // ── HOSPITALS NEARBY ─────────────────────────────────────────────────────
  {
    patterns: ['hospital', 'medical', 'clinic', 'healthcare', 'near hospital', 'ospital',
      'makati medical', 'st lukes', 'st. luke', 'cardinal santos', 'medical city',
      'asian hospital', 'doctor', 'health', 'retirement', 'senior living'],
    text: "🏥 **Properties Near Top Hospitals:**\n\n**Near World-Class Hospitals:**\n• **Makati Medical Center** → Makati properties\n• **St. Luke's BGC** → BGC / Taguig\n• **St. Luke's QC** → QC (E. Rodriguez)\n• **Cardinal Santos Medical** → San Juan / Mandaluyong\n• **The Medical City** → Pasig / Ortigas\n• **Asian Hospital** → Alabang / Muntinlupa\n• **Philippine Heart Center** → QC\n• **National Children's Hospital** → QC\n\n**Great for:**\n• Families with young children\n• Senior retirees\n• Healthcare workers (near work = less commute)\n\n**Retirement Living:**\nAlfima Realty offers properties ideal for retirees:\n• Single-floor bungalows (no stairs!)\n• Elevator-equipped condo buildings\n• Senior-friendly subdivisions\n• Near hospitals & commercial areas\n\n**Properties for Healthcare Workers:**\n• Discounted packages for medical frontliners\n• Special financing assistance\n• Ask our agents about our Healthcare Heroes program!",
    suggestions: ['Properties near St. Lukes', 'Makati Medical area', 'Retirement homes', 'Talk to an agent'],
  },

  // ── MRT / LRT / TRANSPORTATION ───────────────────────────────────────────
  {
    patterns: ['mrt', 'lrt', 'train', 'commute', 'near mrt', 'near lrt', 'near train',
      'transportation', 'accessible', 'edsa', 'bus', 'jeepney', 'uber', 'grab',
      'traffic', 'near office', 'central location', 'connectivity', 'expressway',
      'nlex', 'slex', 'skyway', 'c5', 'c6', 'tplex', 'clex', 'calax'],
    text: "🚇 **Transportation & Accessibility Guide:**\n\n**Near MRT-3 (EDSA Line):**\n• Taft Ave – Shaw – Ortigas – Cubao – Quezon Ave\n• Properties: Mandaluyong, Pasig, QC, Makati\n\n**Near LRT-1:**\n• Baclaran – EDSA – Gil Puyat – Vito Cruz – Central\n• Properties: Pasay, Manila, Paranaque\n\n**Near LRT-2:**\n• Recto – Cubao – Santolan – Marikina\n• Properties: QC, Marikina, Pasig\n\n**Near BGC Bus Terminal:**\n• BGC – Makati – EDSA connection\n• Properties: BGC, McKinley\n\n**Expressway Access:**\n• NLEX → Bulacan, Pampanga (North)\n• SLEX → Laguna, Cavite (South)\n• Skyway → Makati to Muntinlupa\n• CALAX → Laguna (Laguna properties)\n• CLEX → Cavite (Cavite properties)\n• TPLEX → Tarlac direction\n\n**Traffic Tips:**\n• BGC / Taguig: Less traffic vs Makati\n• QC (Katipunan) – worst during school hours\n• Cavite – CLEX makes commute ~30 mins to Manila\n• Laguna – CALAX major game-changer!\n\n**Best for Commuters:** Condo near your office MRT station!",
    suggestions: ['Properties near MRT', 'BGC accessible condos', 'Cavite via CLEX', 'Talk to an agent'],
  },

  // ── TESTIMONIALS ──────────────────────────────────────────────────────────
  {
    patterns: ['testimonial', 'review', 'feedback', 'client', 'satisfied', 'legit', 'trusted',
      'reputation', 'track record', 'experience', 'how many clients', 'happy clients',
      'trustworthy', 'scam', 'fraud', 'legitimate', 'proven', 'success story'],
    text: "⭐ **What Our Clients Say:**\n\n**Maria Santos, OFW in Dubai:**\n\"Alfima helped me buy my condo in QC remotely. Everything was smooth — from virtual tour to signing via SPA. Thank you, Jerome!\"\n\n**Carlo & Ana Reyes, Young Couple:**\n\"First-time buyers kami. Ang bait ng agents nila, patient sa lahat ng tanong. Naka-Pag-IBIG kami at ngayon may sarili na kaming condo!\"\n\n**Atty. Michael Tan, Investor:**\n\"I've bought 3 properties through Alfima. Always professional, always transparent. Best real estate company I've worked with.\"\n\n**Rosa Villanueva, Retiring Teacher:**\n\"Helped me find a bungalow near a hospital in Paranaque. Perfect for my retirement. Highly recommended!\"\n\n**Our Track Record:**\n• 500+ satisfied clients\n• ₱2B+ in properties sold\n• 98% client satisfaction rate\n• 0 unresolved complaints (DHSUD record)\n\n**Alfima Realty is:**\n✅ PRC Licensed Brokers\n✅ DHSUD / HLURB Registered\n✅ Accredited by 20+ developers\n✅ Active member of PAREB & REBAP",
    suggestions: ['Browse properties', 'Talk to an agent', 'Schedule a viewing', 'Contact us'],
  },

  // ── THANKS / CLOSING ─────────────────────────────────────────────────────
  {
    patterns: ['thank', 'thanks', 'thank you', 'salamat', 'maraming salamat', 'great', 'awesome',
      'helpful', 'perfect', 'okay', 'sige', 'ok', 'good', 'nice', 'wow', 'amazing',
      'wonderful', 'excellent', 'fantastic', 'noted', 'noted po', 'got it',
      'nakuha ko', 'understood', 'clear', 'alright', 'sure', 'bye', 'goodbye',
      'paalam', 'see you', 'ingat', 'take care', 'later'],
    text: "😊 You're welcome! It's our pleasure to help!\n\nRemember, **Alfima Realty** is always here for you — whether you're buying, renting, investing, or just exploring your options.\n\n🏠 Your dream property is closer than you think!\n\n📞 Ready to take the next step?\n• Call us: **+63 2 8XXX-XXXX**\n• Email: **hello@alfimarealty.com**\n• Visit: **123 Real Estate Ave., Makati**\n\nIs there anything else I can help you with? 😊",
    suggestions: ['Browse properties', 'Talk to an agent', 'Schedule a viewing', 'Office location & hours'],
  },

  // ── GREETINGS (NEGATIVE / PROBLEMS) ─────────────────────────────────────
  {
    patterns: ['problem', 'complaint', 'issue', 'reklamo', 'hindi ok', 'not happy', 'disappointed',
      'bad experience', 'after sales', 'defect', 'repair', 'broken', 'sira',
      'hindi gumagana', 'not working', 'maintenance', 'property management'],
    text: "😔 We're sorry to hear you're experiencing issues. Alfima Realty takes all concerns seriously!\n\n**For Property Defects (New Units):**\n• Report within the warranty period (typically 1 year)\n• Contact us with photos and description\n• We coordinate with the developer for repairs\n\n**For Rental Issues:**\n• Contact your assigned property manager\n• Email: maintenance@alfimarealty.com\n• Response within 24 hours for urgent issues\n\n**For General Complaints:**\n• Email: feedback@alfimarealty.com\n• We respond within 2 business days\n• All complaints are logged and tracked\n\n**Escalation:**\n• If unresolved, you may file with DHSUD (formerly HLURB)\n• Our legal team assists with formal disputes\n\n**Emergency Line (after hours):**\n📱 +63 917 XXX-XXXX (urgent property concerns)\n\nPlease tell us more about your concern and we'll do our best to resolve it right away! 🙏",
    suggestions: ['Send complaint email', 'Talk to a manager', 'Contact us', 'Office location & hours'],
  },

  // ── PROPERTY MANAGEMENT ───────────────────────────────────────────────────
  {
    patterns: ['property management', 'manage my property', 'rental management', 'manage unit',
      'property manager', 'tenant management', 'find tenant', 'collect rent',
      'manage condo', 'manage house', 'landlord service', 'hands off investment',
      'passive investment', 'manage for me'],
    text: "🏢 **Alfima Realty Property Management Services:**\n\nDon't want the hassle of managing your property? We do it for you!\n\n**What We Offer:**\n• 🔍 Tenant finding & screening\n• 📝 Lease contract preparation\n• 💰 Rent collection & remittance\n• 🔧 Maintenance coordination\n• 📊 Monthly financial reports\n• 📸 Regular property inspections\n• ⚖️ Legal assistance (evictions if needed)\n\n**Our Fee:**\n• 8–12% of monthly rental income\n• One-time tenant finding fee: 1 month's rent\n\n**Who Uses This Service?**\n• OFWs who own properties in PH\n• Investors with multiple units\n• Busy professionals with no time to manage\n• Owners based abroad\n\n**Why Choose Alfima for Property Management?**\n✅ Licensed & bonded property managers\n✅ 24/7 tenant support line\n✅ Online portal for monthly statements\n✅ Average vacancy period: under 30 days\n✅ Trusted by 100+ property owners\n\nInterested? Contact our Property Management team!",
    suggestions: ['Get property management', 'OFW investor services', 'Talk to an agent', 'Contact us'],
  },

  // ── SELLING YOUR PROPERTY ─────────────────────────────────────────────────
  {
    patterns: ['sell', 'selling', 'ibenta', 'gusto kong ibenta', 'how to sell', 'sell my property',
      'sell my condo', 'sell my house', 'list my property', 'listing', 'market my property',
      'property valuation', 'appraisal', 'how much is my property', 'property value',
      'how much can i sell', 'magkano property ko', 'seller', 'consignment'],
    text: "🏷️ **Selling Your Property with Alfima Realty:**\n\nWant to sell? We help you get the best price!\n\n**Our Selling Process:**\n1. **Free Property Valuation** — Our experts assess market value\n2. **Professional Listing** — Photos, virtual tour, online marketing\n3. **Wide Buyer Network** — 10,000+ buyers in our database\n4. **Negotiation** — We represent you and maximize your price\n5. **Documentation** — We handle all paperwork\n6. **Title Transfer** — We assist until transaction closes\n\n**Our Marketing Channels:**\n• Alfima Realty website\n• Property portals (Lamudi, PropertyAccess, Dot Property)\n• Facebook & Instagram ads\n• Direct buyer database (10,000+ contacts)\n• Referral network\n\n**Our Commission:**\n• Standard: 3–5% of selling price\n• No upfront fees — we only earn when you sell!\n\n**Why Sell With Us?**\n✅ Free market valuation\n✅ Professional photos & virtual tour\n✅ Average listing to sold: 30–90 days\n✅ Licensed brokers negotiate for you\n✅ End-to-end transaction support\n\nCall us now for a FREE valuation! 📞",
    suggestions: ['Free property valuation', 'List my property', 'Talk to an agent', 'Contact us'],
  },

  // ── TAGAYTAY / BATANGAS / BATAAN ─────────────────────────────────────────
  {
    patterns: ['tagaytay', 'batangas', 'bataan', 'palawan', 'cebu', 'davao', 'boracay',
      'beach property', 'vacation house', 'vacation home', 'second home', 'rest house',
      'farm lot', 'farm', 'beach lot', 'resort', 'recreational property',
      'leisure property', 'retirement haven', 'province'],
    text: "🌅 **Leisure, Vacation & Provincial Properties:**\n\n**Tagaytay / Silang:**\n• Vacation homes: ₱3M–₱30M\n• Farm lots: ₱1,500–₱8,000/sqm\n• Condos (SMDC Wind, etc.): ₱3M–₱8M\n• Cool climate, only 60km from Manila\n• Great for Airbnb (weekends fully booked!)\n\n**Batangas (Nasugbu, Lian, Laiya):**\n• Beach lots: ₱5,000–₱50,000/sqm\n• Beach houses: ₱5M–₱50M+\n• 2–3 hour drive from Manila\n• Growing surf & beach tourism\n\n**Palawan (El Nido, Coron, PP):**\n• Condotels: ₱3M–₱15M\n• Resort lots: ₱10,000–₱200,000/sqm\n• Highest tourism growth in PH\n\n**Cebu:**\n• Condos in Cebu City: ₱2.5M–₱15M\n• Beach properties (Mactan): ₱5M–₱50M+\n\n**Farm Lots:**\n• Cavite highlands: ₱300–₱2,000/sqm\n• Laguna / Batangas: ₱200–₱1,500/sqm\n• Great for retirement / agri-tourism\n\n**Note:** For properties outside Metro Manila, we coordinate with our provincial partners!",
    suggestions: ['Tagaytay properties', 'Beach lots', 'Farm lot inquiry', 'Talk to an agent'],
  },

  // ── CONDOTEL ─────────────────────────────────────────────────────────────
  {
    patterns: ['condotel', 'condo hotel', 'hotel condo', 'resort condotel', 'hotel unit',
      'hotel investment', 'hotel room', 'serviced apartment', 'apart hotel'],
    text: "🏨 **Condotel Investments — Hotel + Condo Combined!**\n\nA condotel is a condominium unit inside a hotel — you own it, the hotel operates it, and you earn income!\n\n**How it Works:**\n• You buy a hotel room / suite\n• Hotel company manages & rents it out\n• You earn 50–60% of room revenue\n• You can also use it personally (limited days/year)\n\n**Available Condotel Projects:**\n• Tagaytay (Serin, SMDC Wind) – ₱3M–₱8M\n• MOA / Pasay area – ₱3.5M–₱8M\n• Clark, Pampanga – ₱2.5M–₱6M\n• Palawan (El Nido, PP) – ₱4M–₱15M\n• Boracay – ₱5M–₱20M\n\n**Estimated Returns:**\n• Average: 6–12% gross per year\n• Premium tourist areas: up to 15%\n\n**Risks to Consider:**\n• Tourism-dependent income (seasonal)\n• Less control over property\n• HOA fees apply\n• Not Pag-IBIG eligible\n\n**Best Condotels for Investment:** Tourism areas with consistent occupancy — Tagaytay, MOA, El Nido.",
    suggestions: ['Tagaytay condotel', 'MOA area condotel', 'Palawan investment', 'Talk to investment specialist'],
  },

  // ── HELP / DON'T KNOW WHAT TO BUY ────────────────────────────────────────
  {
    patterns: ['help', 'advice', 'suggest', 'recommend', 'what should i buy', 'what to buy',
      'hindi ko alam', 'confused', 'not sure', 'guide me', 'first time', 'newbie',
      'beginner', 'wala akong alam', 'saan dapat', 'best property', 'best choice',
      'tulong', 'patulong', 'payo', 'what do you recommend'],
    text: "🤔 No worries — that's exactly why Alfima Realty is here!\n\nLet me help you figure out the best option. Answer these quick questions:\n\n**1. What's your main goal?**\n• 🏠 To live in (own home)\n• 💰 To invest & earn rental income\n• 👨‍👩‍👧 For the family (larger space)\n• 🌍 OFW investment back home\n\n**2. What's your budget?**\n• Under ₱3M\n• ₱3M–₱8M\n• ₱8M–₱20M\n• ₱20M+\n\n**3. Where do you prefer?**\n• Near your workplace (Metro Manila)\n• Affordable suburbs (Cavite/Laguna)\n• Specific city/area?\n\n**4. Property type preference?**\n• Condo (low maintenance)\n• House & lot (more space)\n• No preference\n\nShare your answers and I'll give you a **personalized property recommendation!** Or our agents can call you for a free consultation. 📞",
    suggestions: ['Under ₱3M options', '₱3M–₱8M options', 'OFW investment', 'Talk to an agent for advice'],
  },

];

// ─────────────────────────────────────────────────────────────────────────────
// MATCHING ENGINE
// ─────────────────────────────────────────────────────────────────────────────
function getBotResponse(input: string): { text: string; suggestions: string[] } {
  const lower = input.toLowerCase().trim();

  let best: KBEntry | null = null;
  let bestScore = 0;

  for (const entry of KB) {
    for (const pattern of entry.patterns) {
      if (lower.includes(pattern)) {
        const score = pattern.length;
        if (score > bestScore) {
          bestScore = score;
          best = entry;
        }
      }
    }
  }

  if (best) return { text: best.text, suggestions: best.suggestions };

  // Secondary: check if any word in input matches any pattern word
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
    text: "Thanks for reaching out to **Alfima Realty Inc.**! 😊\n\nI didn't quite catch that — here are some things I can help you with:\n\n• 🏠 Buying or renting properties\n• 📍 Properties by location (Makati, BGC, QC, Cavite, etc.)\n• 💰 Budget & financing options\n• 👨‍💼 Talking to our agents\n• 📅 Scheduling a property viewing\n• 🌍 OFW investment assistance\n\nFeel free to type your question or pick from the suggestions below!",
    suggestions: INITIAL_SUGGESTIONS,
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// COMPONENT
// ─────────────────────────────────────────────────────────────────────────────
export function Chatbot() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([{
    id: '1',
    text: "👋 Hello! Welcome to **Alfima Realty Inc.** — your trusted partner in Philippine real estate!\n\nI can help you find your dream home, rental, or investment property. What are you looking for today?",
    sender: 'bot',
    suggestions: INITIAL_SUGGESTIONS,
  }]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  if (pathname.startsWith('/admin')) return null;

  const sendMessage = (text: string) => {
    if (!text.trim() || isTyping) return;
    setMessages(prev => [...prev, { id: Date.now().toString(), text, sender: 'user' }]);
    setInput('');
    setIsTyping(true);
    setTimeout(() => {
      const response = getBotResponse(text);
      setMessages(prev => [...prev, { id: (Date.now() + 1).toString(), ...response, sender: 'bot' }]);
      setIsTyping(false);
    }, 700);
  };

  const formatText = (text: string) =>
    text.split('\n').map((line, i, arr) => {
      const segments = line.split(/(\*\*[^*]+\*\*)/g);
      return (
        <span key={i}>
          {segments.map((seg, j) =>
            seg.startsWith('**') && seg.endsWith('**')
              ? <strong key={j}>{seg.slice(2, -2)}</strong>
              : seg
          )}
          {i < arr.length - 1 && <br />}
        </span>
      );
    });

  return (
    <div className="fixed bottom-8 right-8 z-50">
      {isOpen && (
        <div
          className="absolute bottom-20 right-0 w-80 sm:w-96 flex flex-col shadow-2xl rounded-3xl overflow-hidden border border-white/10"
          style={{ height: '520px', animation: 'fadeInUp 0.2s ease' }}
        >
          <div className="bg-gradient-to-r from-red-800 to-red-700 px-5 py-4 flex items-center justify-between flex-shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0">
                <HeadphonesIcon className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-white font-bold text-sm leading-tight">Alfima Realty</p>
                <div className="flex items-center gap-1.5">
                  <div className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" />
                  <p className="text-red-200 text-xs">Online · Always available</p>
                </div>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-white/10 transition text-white"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="bg-red-900/80 backdrop-blur-sm px-4 py-2 flex items-center gap-4 flex-shrink-0 border-b border-white/5">
            <div className="flex items-center gap-1 text-red-200 text-xs">
              <Phone className="w-3 h-3" /><span>+63 2 8XXX-XXXX</span>
            </div>
            <div className="flex items-center gap-1 text-red-200 text-xs">
              <Clock className="w-3 h-3" /><span>Mon–Sat 8AM–6PM</span>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-neutral-950/90 backdrop-blur-xl">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'} gap-2`}
              >
                <div className={`max-w-[85%] px-4 py-3 rounded-2xl text-sm leading-relaxed ${
                  msg.sender === 'user'
                    ? 'bg-red-600 text-white rounded-br-sm'
                    : 'bg-white/10 text-white/90 rounded-bl-sm border border-white/5'
                }`}>
                  {formatText(msg.text)}
                </div>
                {msg.sender === 'bot' && msg.suggestions && (
                  <div className="flex flex-wrap gap-2 max-w-[90%]">
                    {msg.suggestions.map((s) => (
                      <button
                        key={s}
                        onClick={() => sendMessage(s)}
                        disabled={isTyping}
                        className="text-xs px-3 py-1.5 rounded-full border border-red-500/40 text-red-300 hover:bg-red-600/20 hover:border-red-400 hover:text-white transition-all bg-white/5 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}

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

          <div className="bg-neutral-950/90 backdrop-blur-xl border-t border-white/10 p-3 flex-shrink-0">
            <div className="flex gap-2 items-center">
              <input
                type="text"
                placeholder="Ask about properties, areas, prices..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && sendMessage(input)}
                className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder-white/30 focus:outline-none focus:border-red-500/50 transition-all"
              />
              <button
                onClick={() => sendMessage(input)}
                disabled={!input.trim() || isTyping}
                className="w-9 h-9 bg-red-600 hover:bg-red-500 disabled:opacity-30 text-white rounded-xl flex items-center justify-center transition-all flex-shrink-0"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
            <p className="text-white/20 text-xs text-center mt-2">Alfima Realty Inc. · Makati City, Philippines</p>
          </div>
        </div>
      )}

      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-14 h-14 rounded-full bg-gradient-to-br from-red-700 to-red-800 text-white shadow-xl shadow-red-900/50 hover:shadow-red-700/50 hover:scale-110 transition-all duration-300 flex items-center justify-center border border-red-500/30"
      >
        {isOpen ? <X className="w-6 h-6" /> : <HeadphonesIcon className="w-6 h-6" />}
      </button>
    </div>
  );
}