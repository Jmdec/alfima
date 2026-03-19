'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import {
  Home, Users, FileText, Settings, BarChart3,
  Plus, ArrowRight, TrendingUp, TrendingDown,
  Eye, Calendar, MessageSquare, Activity,
} from 'lucide-react';

interface StatCard {
  label: string;
  value: string;
  change: string;
  up: boolean;
  icon: React.ElementType;
  color: string;
}

const STAT_CARDS: StatCard[] = [
  { label: 'Total Properties', value: '50,234', change: '+12%',  up: true,  icon: Home,        color: 'bg-blue-500/10 text-blue-500' },
  { label: 'Active Agents',    value: '523',    change: '+4%',   up: true,  icon: Users,       color: 'bg-emerald-500/10 text-emerald-500' },
  { label: 'Total Users',      value: '12,456', change: '+8%',   up: true,  icon: Eye,         color: 'bg-purple-500/10 text-purple-500' },
  { label: 'Blog Posts',       value: '248',    change: '-2%',   up: false, icon: FileText,    color: 'bg-orange-500/10 text-orange-500' },
];

const QUICK_LINKS = [
  { label: 'Properties',  sub: 'Manage listings',        href: '/admin/properties', icon: Home,           color: 'from-blue-600 to-blue-700' },
  { label: 'Agents',      sub: 'Verify & manage agents', href: '/admin/agents',     icon: Users,          color: 'from-emerald-600 to-emerald-700' },
  { label: 'Users',       sub: 'Manage accounts',        href: '/admin/users',      icon: Users,          color: 'from-purple-600 to-purple-700' },
  { label: 'Blog',        sub: 'Content & posts',        href: '/admin/blog',       icon: FileText,       color: 'from-orange-600 to-orange-700' },
  { label: 'Inquiries',   sub: 'Buyer messages',         href: '/admin/inquiries',  icon: MessageSquare,  color: 'from-pink-600 to-pink-700' },
  { label: 'Tours',       sub: 'Scheduled viewings',     href: '/admin/tours',      icon: Calendar,       color: 'from-teal-600 to-teal-700' },
];

const RECENT_ACTIVITY = [
  { type: 'property', title: 'New property submitted',   sub: 'Modern Downtown Penthouse — pending approval', time: '2 hours ago',  dot: 'bg-blue-500' },
  { type: 'agent',    title: 'New agent registration',   sub: 'Juan Dela Cruz — PRC license verified',        time: '5 hours ago',  dot: 'bg-emerald-500' },
  { type: 'report',   title: 'User reported a property', sub: 'Flagged for inappropriate listing details',    time: '1 day ago',    dot: 'bg-red-500' },
  { type: 'inquiry',  title: 'New inquiry received',     sub: '3BR Condo BGC — from buyer@email.com',         time: '2 days ago',   dot: 'bg-purple-500' },
];

export default function AdminDashboard() {
  return (
    <div className="p-8 max-w-7xl mx-auto">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-800 tracking-tight">Dashboard</h1>
        <p className="text-slate-400 text-sm mt-0.5">Welcome back — here's what's happening today.</p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5 mb-8">
        {STAT_CARDS.map((s) => {
          const Icon = s.icon;
          return (
            <div key={s.label} className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${s.color}`}>
                  <Icon className="w-5 h-5" />
                </div>
                <div className={`flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded-full ${s.up ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-500'}`}>
                  {s.up ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                  {s.change}
                </div>
              </div>
              <p className="text-2xl font-bold text-slate-800 mb-0.5">{s.value}</p>
              <p className="text-sm text-slate-400">{s.label}</p>
            </div>
          );
        })}
      </div>

      {/* Quick Links */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-bold text-slate-700">Quick Access</h2>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-3">
          {QUICK_LINKS.map((q) => {
            const Icon = q.icon;
            return (
              <Link key={q.href} href={q.href}
                className="group bg-white rounded-2xl border border-slate-100 p-4 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 shadow-sm">
                <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${q.color} flex items-center justify-center mb-3 shadow-sm group-hover:scale-105 transition-transform`}>
                  <Icon className="w-5 h-5 text-white" />
                </div>
                <p className="text-slate-700 font-bold text-sm">{q.label}</p>
                <p className="text-slate-400 text-xs mt-0.5 leading-tight">{q.sub}</p>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">

        {/* Recent Activity */}
        <div className="xl:col-span-2 bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-base font-bold text-slate-700 flex items-center gap-2">
              <Activity className="w-4 h-4 text-slate-400" />
              Recent Activity
            </h2>
            <span className="text-xs text-slate-400 font-medium">Last 7 days</span>
          </div>
          <div className="space-y-4">
            {RECENT_ACTIVITY.map((a, i) => (
              <div key={i} className={`flex items-start gap-3 ${i < RECENT_ACTIVITY.length - 1 ? 'pb-4 border-b border-slate-50' : ''}`}>
                <div className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${a.dot}`} />
                <div className="flex-1 min-w-0">
                  <p className="text-slate-700 font-semibold text-sm">{a.title}</p>
                  <p className="text-slate-400 text-xs mt-0.5 truncate">{a.sub}</p>
                </div>
                <span className="text-xs text-slate-300 flex-shrink-0 font-medium">{a.time}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Management shortcuts */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
          <h2 className="text-base font-bold text-slate-700 flex items-center gap-2 mb-5">
            <Settings className="w-4 h-4 text-slate-400" />
            Management
          </h2>
          <div className="space-y-2">
            {[
              { label: 'Add New Property', href: '/admin/properties',  icon: Home,      color: 'text-blue-500' },
              { label: 'Add New Agent',    href: '/admin/agents',      icon: Users,     color: 'text-emerald-500' },
              { label: 'Create Blog Post', href: '/admin/blog/new',    icon: FileText,  color: 'text-orange-500' },
              { label: 'Amenities',        href: '/admin/amenities',   icon: Settings,  color: 'text-purple-500' },
              { label: 'Locations',        href: '/admin/locations',   icon: BarChart3, color: 'text-teal-500' },
              { label: 'Site Settings',    href: '/admin/settings',    icon: Settings,  color: 'text-slate-500' },
            ].map(({ label, href, icon: Icon, color }) => (
              <Link key={href} href={href}
                className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-slate-50 transition-colors group">
                <Icon className={`w-4 h-4 flex-shrink-0 ${color}`} />
                <span className="text-slate-600 text-sm font-medium flex-1">{label}</span>
                <ArrowRight className="w-3.5 h-3.5 text-slate-300 group-hover:text-slate-500 group-hover:translate-x-0.5 transition-all" />
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}