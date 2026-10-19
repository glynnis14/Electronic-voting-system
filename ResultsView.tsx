import React from 'react';
import {
  BarChart3,
  Trophy,
  ShieldCheck,
  AlertTriangle,
  Boxes,
  Vote,
  Info,
} from 'lucide-react';
import { Block, Candidate, ElectionConfig } from '../types';
import { calculateVoteTally } from '../blockchainEngine';

interface TallyBreakdownItem {
  candidate: string;
  candidateId: string;
  symbol: string;
  color: string;
  votes: number;
  percentage: number;
}

interface ResultsViewProps {
  chain: Block[];
  candidates: Candidate[];
  electionConfig: ElectionConfig;
  isValid: boolean;
  setCurrentTab: (tab: string) => void;
}

export const ResultsView: React.FC<ResultsViewProps> = ({
  chain,
  candidates,
  electionConfig,
  isValid,
  setCurrentTab,
}) => {
  const tally = calculateVoteTally(chain, candidates);

  // Find leading candidate
  let maxVotes = -1;
  let leader: TallyBreakdownItem | null = null;
  for (const item of tally.breakdown) {
    if (item.votes > maxVotes && item.votes > 0) {
      maxVotes = item.votes;
      leader = item;
    }
  }

  return (
    <div className="max-w-4xl mx-auto py-2 space-y-6">
      {/* Header */}
      <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 text-xs font-semibold mb-1">
            <BarChart3 className="w-3.5 h-3.5" />
            Consensus Tally
          </div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">
            Election Results & Vote Tally
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Tabulated directly from verified blockchain transaction blocks
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-slate-500">Status:</span>
          <span className="px-3 py-1 rounded-full text-xs font-semibold bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
            {electionConfig.election_status}
          </span>
        </div>
      </div>

      {/* Integrity Audit Alert */}
      <div
        className={`p-4 rounded-2xl border text-xs flex flex-wrap items-center justify-between gap-3 ${
          isValid
            ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800 text-emerald-900 dark:text-emerald-300'
            : 'bg-rose-50 dark:bg-rose-950/40 border-rose-200 dark:border-rose-800 text-rose-900 dark:text-rose-300'
        }`}
      >
        <div className="flex items-center gap-2">
          {isValid ? (
            <ShieldCheck className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
          ) : (
            <AlertTriangle className="w-5 h-5 text-rose-600 dark:text-rose-400" />
          )}
          <span>
            {isValid
              ? `Ledger Integrity Verified: All ${tally.totalVotes} cast ballots verified against immutable SHA-256 block hashes.`
              : 'Integrity Warning: Cryptographic audit indicates block tampering. Tabulation may reflect modified records!'}
          </span>
        </div>
        <button
          onClick={() => setCurrentTab('verify')}
          className="px-3 py-1.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 font-semibold text-xs shadow-xs hover:bg-slate-50"
        >
          Inspect Verification Details
        </button>
      </div>

      {/* Total Votes Summary */}
      <div className="bg-slate-900 text-white p-6 rounded-3xl border border-slate-800 shadow-md flex flex-wrap items-center justify-between gap-4">
        <div>
          <span className="text-xs text-slate-400 uppercase tracking-wider font-semibold">
            Recorded Participation
          </span>
          <div className="text-3xl font-extrabold mt-1 text-white font-mono">
            {tally.totalVotes} Valid Ballots Cast
          </div>
        </div>

        {leader && (
          <div className="bg-slate-800/90 border border-slate-700 p-3 px-4 rounded-2xl flex items-center gap-3">
            <Trophy className="w-6 h-6 text-amber-400" />
            <div>
              <span className="text-[10px] text-slate-400 uppercase font-bold block">
                Leading Candidate
              </span>
              <span className="text-xs font-bold text-amber-300">
                {leader.candidate} ({leader.votes} votes • {leader.percentage}%)
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Candidate Standings Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {tally.breakdown.map((item) => (
          <div
            key={item.candidateId}
            className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between space-y-4"
          >
            <div className="flex items-center justify-between">
              <span className="text-3xl">{item.symbol}</span>
              <span className="text-xs font-bold font-mono px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                {item.candidateId}
              </span>
            </div>

            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white leading-tight">
                {item.candidate}
              </h3>
              <div className="mt-4 flex items-baseline justify-between">
                <span className="text-3xl font-extrabold text-blue-600 dark:text-blue-400 font-mono">
                  {item.votes}
                </span>
                <span className="text-sm font-bold text-slate-500">
                  {item.percentage}%
                </span>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="space-y-1.5">
              <div className="w-full bg-slate-100 dark:bg-slate-800 h-2.5 rounded-full overflow-hidden">
                <div
                  className="bg-blue-600 h-full rounded-full transition-all duration-500"
                  style={{ width: `${item.percentage}%` }}
                />
              </div>
              <div className="text-[10px] text-slate-400 text-right">
                {item.votes} of {tally.totalVotes} total votes
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Explanation of Blockchain Tabulation */}
      <div className="p-5 rounded-3xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-400 space-y-2">
        <div className="flex items-center gap-2 font-bold text-slate-900 dark:text-slate-200">
          <Info className="w-4 h-4 text-blue-500" />
          <span>Ledger Tabulation Methodology</span>
        </div>
        <p className="leading-relaxed">
          Results are computed by scanning all sequential blocks from the genesis anchor to the chain head. Only votes sealed in blocks with validated SHA-256 digests and unbroken predecessor linkages are included in the consensus tally.
        </p>
      </div>
    </div>
  );
};
