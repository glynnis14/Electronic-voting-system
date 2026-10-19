import React from 'react';
import {
  Vote,
  ShieldCheck,
  Boxes,
  BarChart3,
  CheckCircle2,
  Lock,
  ArrowRight,
  Fingerprint,
  FileText,
  Clock,
  Users,
  ShieldAlert,
  AlertTriangle,
} from 'lucide-react';
import { ElectionConfig } from '../types';

interface HomeViewProps {
  setCurrentTab: (tab: string) => void;
  electionConfig: ElectionConfig;
  totalBlocks: number;
  votesCast: number;
  totalVoters: number;
  isValid: boolean;
  statusMessage: string;
}

export const HomeView: React.FC<HomeViewProps> = ({
  setCurrentTab,
  electionConfig,
  totalBlocks,
  votesCast,
  totalVoters,
  isValid,
  statusMessage,
}) => {
  return (
    <div className="space-y-8 py-2">
      {/* Hero Section */}
      <div className="bg-white dark:bg-slate-900 p-8 sm:p-10 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        <div className="lg:col-span-7 space-y-5">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-400 text-xs font-semibold">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>Official Election Portal • Status: {electionConfig.election_status}</span>
          </div>

          <div className="space-y-2">
            <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-tight">
              Electronic Voting Portal
            </h1>
            <p className="text-lg font-medium text-slate-600 dark:text-slate-300">
              Blockchain-Based Voting System
            </p>
          </div>

          <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
            Votes are recorded as tamper-evident blockchain transactions, allowing election records to be independently verified while maintaining voter confidentiality.
          </p>

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-3 pt-2">
            <button
              onClick={() => setCurrentTab('vote')}
              className="px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-sm shadow-md shadow-blue-600/20 flex items-center gap-2 transition-all hover:scale-[1.02]"
            >
              <Vote className="w-4 h-4" />
              Voter Login & Cast Vote
            </button>
            <button
              onClick={() => setCurrentTab('verify')}
              className="px-5 py-3 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-semibold text-sm transition-all flex items-center gap-2 border border-slate-300/80 dark:border-slate-700"
            >
              <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              Verify Records
            </button>
            <button
              onClick={() => setCurrentTab('results')}
              className="px-5 py-3 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-semibold text-sm transition-all flex items-center gap-2 border border-slate-300/80 dark:border-slate-700"
            >
              <BarChart3 className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              View Results
            </button>
          </div>

          {/* Key Information Strip */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-3 border-t border-slate-100 dark:border-slate-800 text-xs">
            <div>
              <span className="text-slate-400 block text-[11px] font-semibold">Active Election</span>
              <span className="font-semibold text-slate-800 dark:text-slate-200">{electionConfig.title}</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[11px] font-semibold">Voting Period</span>
              <span className="font-semibold text-slate-800 dark:text-slate-200">{electionConfig.voting_period}</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[11px] font-semibold">Candidates Registered</span>
              <span className="font-semibold text-slate-800 dark:text-slate-200">{electionConfig.candidates.length} Official Candidates</span>
            </div>
          </div>
        </div>

        {/* Live Telemetry Panel */}
        <div className="lg:col-span-5">
          <div className="bg-slate-950 text-white rounded-3xl p-6 sm:p-7 border border-slate-800 shadow-xl space-y-6">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-xs font-bold tracking-wider uppercase text-slate-300">
                  System Status & Telemetry
                </span>
              </div>
              <span
                className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full border ${
                  isValid
                    ? 'bg-emerald-950/90 text-emerald-400 border-emerald-800'
                    : 'bg-rose-950/90 text-rose-400 border-rose-800'
                }`}
              >
                {isValid ? 'BLOCKCHAIN VALID' : 'INTEGRITY MISMATCH'}
              </span>
            </div>

            {/* Metrics */}
            <div className="grid grid-cols-3 gap-3 text-center">
              <div className="bg-slate-900/80 p-3.5 rounded-2xl border border-slate-800">
                <div className="text-2xl font-bold text-blue-400 font-mono">{totalBlocks}</div>
                <div className="text-[11px] text-slate-400 mt-1">Total Blocks</div>
              </div>
              <div className="bg-slate-900/80 p-3.5 rounded-2xl border border-slate-800">
                <div className="text-2xl font-bold text-emerald-400 font-mono">{votesCast}</div>
                <div className="text-[11px] text-slate-400 mt-1">Votes Cast</div>
              </div>
              <div className="bg-slate-900/80 p-3.5 rounded-2xl border border-slate-800">
                <div className="text-2xl font-bold text-slate-200 font-mono">{totalVoters}</div>
                <div className="text-[11px] text-slate-400 mt-1">Registered Voters</div>
              </div>
            </div>

            {/* Blockchain Status Box */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs text-slate-400 font-semibold">
                <span>Cryptographic Ledger Status</span>
                <span className="text-[10px] font-mono text-slate-500">SHA-256</span>
              </div>
              <div
                className={`p-3.5 rounded-xl text-xs font-mono border ${
                  isValid
                    ? 'bg-emerald-950/40 text-emerald-300 border-emerald-900/60'
                    : 'bg-rose-950/50 text-rose-300 border-rose-900/80'
                }`}
              >
                {statusMessage}
              </div>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => setCurrentTab('explorer')}
                className="flex-1 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 text-xs font-semibold flex items-center justify-center gap-1.5 border border-slate-700 transition-colors"
              >
                <Boxes className="w-3.5 h-3.5 text-blue-400" />
                <span>Browse Ledger</span>
              </button>
              <button
                onClick={() => setCurrentTab('results')}
                className="flex-1 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
              >
                <span>Live Results</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Core Architectural Highlights */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
          <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center">
            <Lock className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-base text-slate-900 dark:text-white">
            Tamper-Evident Blockchain Records
          </h3>
          <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
            Every submitted ballot is packaged into a sequential block sealed with SHA-256 cryptographic hashes and cryptographically linked to the preceding block.
          </p>
        </div>

        <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
            <Fingerprint className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-base text-slate-900 dark:text-white">
            Duplicate Vote Prevention
          </h3>
          <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
            Voter identifiers are converted into one-way cryptographic digests. The ledger enforces strict single-vote rules: any duplicate submission is automatically rejected.
          </p>
        </div>

        <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
          <div className="w-10 h-10 rounded-xl bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 flex items-center justify-center">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-base text-slate-900 dark:text-white">
            Transparent Ledger Verification
          </h3>
          <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
            Auditors and voters can independently verify the cryptographic continuity of all blocks from the Genesis anchor to the latest vote transaction.
          </p>
        </div>
      </div>

      {/* How It Works: Realistic Process Flow */}
      <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
            System Architecture & Flow
          </span>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white mt-1">
            How Votes Are Recorded and Verified
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            A transparent end-to-end process from voter authentication through cryptographic block minting.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-700/80 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300">
                Step 1
              </span>
              <Fingerprint className="w-4 h-4 text-blue-600" />
            </div>
            <h4 className="font-bold text-sm text-slate-900 dark:text-white">Voter Verification</h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Voter enters authorized credentials. The system verifies eligibility against the voter roll and confirms single-vote status.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-700/80 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300">
                Step 2
              </span>
              <Vote className="w-4 h-4 text-indigo-600" />
            </div>
            <h4 className="font-bold text-sm text-slate-900 dark:text-white">Ballot Selection</h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Voter chooses exactly one candidate on the electronic ballot and reviews the non-reversible submission confirmation.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-700/80 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300">
                Step 3
              </span>
              <Boxes className="w-4 h-4 text-emerald-600" />
            </div>
            <h4 className="font-bold text-sm text-slate-900 dark:text-white">Block Creation</h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              A new block is minted with the predecessor block hash, vote payload, timestamp, and calculated SHA-256 block hash.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-700/80 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300">
                Step 4
              </span>
              <ShieldCheck className="w-4 h-4 text-teal-600" />
            </div>
            <h4 className="font-bold text-sm text-slate-900 dark:text-white">Ledger Verification</h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              The blockchain ledger is updated. Any participant or auditor can verify full chain continuity and mathematical consistency.
            </p>
          </div>
        </div>
      </div>

      {/* Realistic System Disclaimer */}
      <div className="p-4 rounded-2xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-400 flex items-start gap-3">
        <AlertTriangle className="w-5 h-5 text-slate-500 flex-shrink-0 mt-0.5" />
        <div>
          <strong className="font-semibold text-slate-800 dark:text-slate-200">System Information: </strong>
          Demonstration system. Production election platforms require comprehensive identity verification, privacy protections, security audits, legal compliance, accessibility measures and independent testing.
        </div>
      </div>
    </div>
  );
};
