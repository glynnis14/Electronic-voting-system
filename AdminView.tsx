import React from 'react';
import {
  LayoutDashboard,
  Users,
  Vote,
  TrendingUp,
  RotateCcw,
  CheckCircle2,
  Clock,
  EyeOff,
  ShieldCheck,
} from 'lucide-react';
import { Block, Candidate, Voter } from '../types';
import { hasVoterVoted } from '../blockchainEngine';

interface AdminViewProps {
  voters: Voter[];
  chain: Block[];
  candidates: Candidate[];
  onResetDemo: () => void;
  setCurrentTab: (tab: string) => void;
}

export const AdminView: React.FC<AdminViewProps> = ({
  voters,
  chain,
  candidates,
  onResetDemo,
  setCurrentTab,
}) => {
  const totalRegistered = voters.length;
  const votesCast = chain.length - 1; // Exclude Genesis Block
  const turnoutPercent =
    totalRegistered > 0 ? ((votesCast / totalRegistered) * 100).toFixed(1) : '0.0';

  return (
    <div className="max-w-5xl mx-auto py-2 space-y-6">
      {/* Header Banner */}
      <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 text-xs font-semibold mb-1">
            <LayoutDashboard className="w-3.5 h-3.5" />
            Election Administration
          </div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">
            Administrative Console & Participation Roll
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Real-time voter turnout monitoring with strict ballot secrecy enforcement
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setCurrentTab('results')}
            className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-sm transition-colors"
          >
            Consensus Results
          </button>
          <button
            onClick={onResetDemo}
            className="px-3.5 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-semibold flex items-center gap-1.5 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Reset Ledger
          </button>
        </div>
      </div>

      {/* Ballot Secrecy Notice */}
      <div className="p-4 rounded-2xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900/60 text-xs text-blue-900 dark:text-blue-200 flex items-start gap-3">
        <EyeOff className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
        <div>
          <strong className="font-semibold">Ballot Confidentiality Protocol:</strong> The administrative console displays participation status (whether a registered voter has cast their ballot or not) but <strong>cannot reveal candidate selections</strong>. Voter choices remain securely sealed inside pseudonymized SHA-256 block payloads.
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-slate-900 p-5 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-blue-50 dark:bg-blue-950/60 flex items-center justify-center text-blue-600 dark:text-blue-400">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-bold text-slate-900 dark:text-white font-mono">{totalRegistered}</div>
            <div className="text-xs text-slate-500">Registered in Voter Roll</div>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-5 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
            <Vote className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-bold text-slate-900 dark:text-white font-mono">{votesCast}</div>
            <div className="text-xs text-slate-500">Verified Ballots Cast</div>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-5 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-amber-50 dark:bg-amber-950/60 flex items-center justify-center text-amber-600 dark:text-amber-400">
            <TrendingUp className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-bold text-slate-900 dark:text-white font-mono">{turnoutPercent}%</div>
            <div className="text-xs text-slate-500">Voter Participation Rate</div>
          </div>
        </div>
      </div>

      {/* Registered Voters Roll Table */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
            <Users className="w-4 h-4 text-blue-500" />
            <span>Voter Register & Participation Status</span>
          </h3>
          <span className="text-xs text-slate-400 font-mono">
            {voters.length} registered accounts
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-800/80 text-slate-500 uppercase text-[10px] font-bold tracking-wider border-b border-slate-200 dark:border-slate-800">
              <tr>
                <th className="px-5 py-3">Voter ID</th>
                <th className="px-5 py-3">Account Name</th>
                <th className="px-5 py-3">Contact Email</th>
                <th className="px-5 py-3">Participation Status</th>
                <th className="px-5 py-3">Ballot Secrecy</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {voters.map((voter) => {
                const hasVoted = hasVoterVoted(chain, voter.voter_hash);
                return (
                  <tr key={voter.voter_id} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition-colors">
                    <td className="px-5 py-3.5 font-mono font-bold text-slate-800 dark:text-slate-200">
                      {voter.voter_id}
                    </td>
                    <td className="px-5 py-3.5 text-slate-700 dark:text-slate-300 font-medium">
                      {voter.name}
                    </td>
                    <td className="px-5 py-3.5 text-slate-500 font-mono text-[11px]">
                      {voter.email}
                    </td>
                    <td className="px-5 py-3.5">
                      {hasVoted ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
                          <CheckCircle2 className="w-3 h-3" />
                          Ballot Cast (On Chain)
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-slate-100 dark:bg-slate-800 text-slate-500 border border-slate-200 dark:border-slate-700">
                          <Clock className="w-3 h-3" />
                          Eligible (Pending)
                        </span>
                      )}
                    </td>
                    <td className="px-5 py-3.5">
                      <span className="text-slate-400 text-[11px] flex items-center gap-1">
                        <EyeOff className="w-3.5 h-3.5" />
                        <span>Protected (Secret Ballot)</span>
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
