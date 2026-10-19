import React from 'react';
import {
  Info,
  Calendar,
  ShieldCheck,
  Lock,
  Vote,
  Users,
  CheckCircle2,
  FileText,
  AlertTriangle,
} from 'lucide-react';
import { ElectionConfig } from '../types';

interface InfoViewProps {
  electionConfig: ElectionConfig;
  setCurrentTab: (tab: string) => void;
}

export const InfoView: React.FC<InfoViewProps> = ({
  electionConfig,
  setCurrentTab,
}) => {
  return (
    <div className="max-w-4xl mx-auto py-2 space-y-6">
      {/* Header Banner */}
      <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-400 text-xs font-semibold">
          <Info className="w-3.5 h-3.5" />
          <span>Election Guidelines & System Specifications</span>
        </div>

        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white tracking-tight">
          {electionConfig.title}
        </h1>
        <p className="text-sm text-slate-600 dark:text-slate-300">
          Official guidelines, candidate descriptions, and voting procedures for the electronic voting portal.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-slate-100 dark:border-slate-800 text-xs">
          <div className="flex items-center gap-2.5">
            <Calendar className="w-4 h-4 text-blue-500" />
            <div>
              <span className="text-slate-400 block text-[10px] font-semibold uppercase">Voting Window</span>
              <span className="font-semibold text-slate-800 dark:text-slate-200">{electionConfig.voting_period}</span>
            </div>
          </div>
          <div className="flex items-center gap-2.5">
            <ShieldCheck className="w-4 h-4 text-emerald-500" />
            <div>
              <span className="text-slate-400 block text-[10px] font-semibold uppercase">Security Protocol</span>
              <span className="font-semibold text-slate-800 dark:text-slate-200">SHA-256 Ledger Sealing</span>
            </div>
          </div>
          <div className="flex items-center gap-2.5">
            <Lock className="w-4 h-4 text-indigo-500" />
            <div>
              <span className="text-slate-400 block text-[10px] font-semibold uppercase">Ballot Format</span>
              <span className="font-semibold text-slate-800 dark:text-slate-200">Single-Choice Secret Ballot</span>
            </div>
          </div>
        </div>
      </div>

      {/* Official Candidates */}
      <div className="space-y-4">
        <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Users className="w-5 h-5 text-blue-500" />
          <span>Official Candidates</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {electionConfig.candidates.map((candidate) => (
            <div
              key={candidate.id}
              className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between space-y-4"
            >
              <div>
                <div className="text-3xl mb-3">{candidate.symbol}</div>
                <h3 className="font-bold text-base text-slate-900 dark:text-white">
                  {candidate.name}
                </h3>
                <span className="inline-block mt-1 px-2.5 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-[11px] font-semibold text-slate-700 dark:text-slate-300">
                  {candidate.tagline}
                </span>
                <p className="text-xs text-slate-600 dark:text-slate-400 mt-3 leading-relaxed">
                  {candidate.description}
                </p>
              </div>

              <button
                onClick={() => setCurrentTab('vote')}
                className="w-full py-2 px-3 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-blue-50 dark:hover:bg-blue-950 text-blue-600 dark:text-blue-400 text-xs font-semibold transition-colors flex items-center justify-center gap-1.5"
              >
                <Vote className="w-3.5 h-3.5" />
                <span>Select on Ballot</span>
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Voting Rules & Instructions */}
      <div className="bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <FileText className="w-5 h-5 text-emerald-500" />
          <span>Voting Procedures and Rules</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-slate-600 dark:text-slate-300">
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-1.5">
            <div className="font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              <span>1. One-Person-One-Vote Rule</span>
            </div>
            <p className="leading-relaxed">
              Every voter is authorized to cast exactly one ballot. When a ballot is confirmed, the voter identifier is permanently stored on the ledger to prevent subsequent votes.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-1.5">
            <div className="font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              <span>2. Irrevocable Submission</span>
            </div>
            <p className="leading-relaxed">
              Once submitted, a ballot is cryptographically sealed into a block. Ballots cannot be retracted, edited, or deleted under any circumstances.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-1.5">
            <div className="font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              <span>3. Cryptographic Verification</span>
            </div>
            <p className="leading-relaxed">
              Voters receive a digital receipt containing block height and transaction hashes. The verification audit tool can be used at any time to verify that the ledger has not been altered.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-1.5">
            <div className="font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              <span>4. Confidential Ballots</span>
            </div>
            <p className="leading-relaxed">
              Voter identifiers are converted to irreversible SHA-256 digests. Neither administrators nor public observers can link an individual voter to their chosen candidate.
            </p>
          </div>
        </div>
      </div>

      {/* System Disclaimer */}
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
