import React from 'react';
import {
  Vote,
  ShieldCheck,
  Boxes,
  BarChart3,
  LayoutDashboard,
  Info,
  CheckCircle2,
  AlertTriangle,
  UserCheck,
  LogOut,
  RotateCcw,
} from 'lucide-react';
import { Voter } from '../types';

interface NavbarProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
  currentUser: Voter | null;
  onLogout: () => void;
  isValid: boolean;
  blockCount: number;
  onResetDemo: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  setCurrentTab,
  currentUser,
  onLogout,
  isValid,
  blockCount,
  onResetDemo,
}) => {
  return (
    <header className="sticky top-0 z-50 bg-slate-900 border-b border-slate-800 text-slate-100 shadow-md">
      {/* Top Meta Bar: Official Portal Status */}
      <div className="bg-slate-950/80 border-b border-slate-800/80 px-4 py-1.5 text-xs text-slate-400">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[11px] font-semibold bg-emerald-950/90 text-emerald-400 border border-emerald-800/60">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
              Live Election
            </span>
            <span className="text-slate-300 font-medium">Student Council Election 2026</span>
            <span className="text-slate-600">•</span>
            <span className="text-slate-400">Voting Window: 20 Sep 2026 – 25 Sep 2026</span>
          </div>

          <div className="flex items-center gap-3 text-[11px] text-slate-400">
            <span>Cryptographic Engine: <span className="font-mono text-slate-300 font-medium">SHA-256</span></span>
            <span className="text-slate-700">|</span>
            <span>Consensus Ledger: <span className="text-blue-400 font-mono font-medium">{blockCount} Blocks</span></span>
          </div>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 py-3 flex flex-wrap items-center justify-between gap-4">
        {/* Brand */}
        <button
          onClick={() => setCurrentTab('home')}
          className="flex items-center gap-3 text-left group"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center text-white shadow-md shadow-blue-500/20 group-hover:scale-105 transition-transform">
            <Vote className="w-5 h-5" />
          </div>
          <div>
            <div className="font-bold text-base tracking-tight text-white flex items-center gap-2">
              Electronic Voting Portal
            </div>
            <div className="text-[11px] text-slate-400 font-medium">
              Blockchain-Based Voting System
            </div>
          </div>
        </button>

        {/* Primary Navigation Links */}
        <nav className="flex items-center gap-1 overflow-x-auto py-1">
          <button
            onClick={() => setCurrentTab('home')}
            className={`px-3 py-2 rounded-lg text-xs font-semibold transition-colors whitespace-nowrap ${
              currentTab === 'home'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-300 hover:text-white hover:bg-slate-800'
            }`}
          >
            Overview
          </button>

          <button
            onClick={() => setCurrentTab('info')}
            className={`px-3 py-2 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5 whitespace-nowrap ${
              currentTab === 'info'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-300 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Info className="w-3.5 h-3.5" />
            Election Info
          </button>

          <button
            onClick={() => setCurrentTab('vote')}
            className={`px-3 py-2 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5 whitespace-nowrap ${
              currentTab === 'vote' || currentTab === 'login' || currentTab === 'confirm'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-300 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Vote className="w-3.5 h-3.5" />
            Cast Vote
          </button>

          <button
            onClick={() => setCurrentTab('explorer')}
            className={`px-3 py-2 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5 whitespace-nowrap ${
              currentTab === 'explorer'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-300 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Boxes className="w-3.5 h-3.5" />
            Blockchain Ledger
            <span className="text-[10px] bg-slate-800 px-1.5 py-0.2 rounded font-mono text-blue-400 border border-slate-700">
              {blockCount}
            </span>
          </button>

          <button
            onClick={() => setCurrentTab('verify')}
            className={`px-3 py-2 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5 whitespace-nowrap ${
              currentTab === 'verify'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-300 hover:text-white hover:bg-slate-800'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            Verify Records
          </button>

          <button
            onClick={() => setCurrentTab('results')}
            className={`px-3 py-2 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5 whitespace-nowrap ${
              currentTab === 'results'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-300 hover:text-white hover:bg-slate-800'
            }`}
          >
            <BarChart3 className="w-3.5 h-3.5" />
            Election Results
          </button>

          <button
            onClick={() => setCurrentTab('admin')}
            className={`px-3 py-2 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5 whitespace-nowrap ${
              currentTab === 'admin'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-300 hover:text-white hover:bg-slate-800'
            }`}
          >
            <LayoutDashboard className="w-3.5 h-3.5" />
            Admin Dashboard
          </button>
        </nav>

        {/* Right Controls: Ledger Health & Session */}
        <div className="flex items-center gap-3">
          {/* Ledger Verification Status Indicator */}
          <button
            onClick={() => setCurrentTab('verify')}
            className={`text-[11px] px-2.5 py-1 rounded-full font-semibold flex items-center gap-1.5 border transition-all ${
              isValid
                ? 'bg-emerald-950/80 text-emerald-400 border-emerald-800/80 hover:bg-emerald-900/60'
                : 'bg-rose-950/90 text-rose-400 border-rose-800 animate-pulse'
            }`}
            title={isValid ? 'Blockchain cryptographic integrity is verified' : 'Integrity audit detected a mismatch'}
          >
            {isValid ? (
              <>
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>LEDGER VALID</span>
              </>
            ) : (
              <>
                <AlertTriangle className="w-3.5 h-3.5 text-rose-400" />
                <span>INTEGRITY MISMATCH</span>
              </>
            )}
          </button>

          {/* Voter Authentication State */}
          {currentUser ? (
            <div className="flex items-center gap-2 bg-slate-800/90 border border-slate-700 rounded-lg px-2.5 py-1 text-xs">
              <UserCheck className="w-3.5 h-3.5 text-blue-400" />
              <span className="font-mono font-medium text-slate-200">{currentUser.voter_id}</span>
              <button
                onClick={onLogout}
                className="text-slate-400 hover:text-rose-400 p-0.5 rounded transition-colors ml-1"
                title="Log out"
              >
                <LogOut className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <button
              onClick={() => setCurrentTab('login')}
              className="bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold px-3 py-1.5 rounded-lg shadow-sm transition-colors flex items-center gap-1.5"
            >
              <UserCheck className="w-3.5 h-3.5" />
              Voter Login
            </button>
          )}

          {/* Quick Ledger Reset for demonstration */}
          <button
            onClick={onResetDemo}
            className="text-slate-400 hover:text-slate-200 hover:bg-slate-800 p-1.5 rounded-lg transition-colors"
            title="Reset demonstration ledger"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </header>
  );
};
