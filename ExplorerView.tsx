import React from 'react';
import {
  Boxes,
  ArrowDown,
  Clock,
  Key,
  ShieldCheck,
  AlertTriangle,
  FileText,
  Lock,
} from 'lucide-react';
import { Block, TamperDetails } from '../types';

interface ExplorerViewProps {
  chain: Block[];
  isValid: boolean;
  tamperDetails: TamperDetails | null;
  setCurrentTab: (tab: string) => void;
}

export const ExplorerView: React.FC<ExplorerViewProps> = ({
  chain,
  isValid,
  tamperDetails,
  setCurrentTab,
}) => {
  return (
    <div className="max-w-4xl mx-auto py-2 space-y-6">
      {/* Explorer Header */}
      <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 text-xs font-semibold mb-1">
            <Boxes className="w-3.5 h-3.5" />
            Blockchain Ledger
          </div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">
            Blockchain Ledger Explorer
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Viewing {chain.length} sequential blocks sealed with SHA-256 cryptographic linkage
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div
            className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 border ${
              isValid
                ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800'
                : 'bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 border-rose-200 dark:border-rose-800 animate-pulse'
            }`}
          >
            {isValid ? (
              <>
                <ShieldCheck className="w-4 h-4 text-emerald-500" />
                <span>LEDGER VALID</span>
              </>
            ) : (
              <>
                <AlertTriangle className="w-4 h-4 text-rose-500" />
                <span>INTEGRITY MISMATCH</span>
              </>
            )}
          </div>

          <button
            onClick={() => setCurrentTab('verify')}
            className="px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold transition-colors"
          >
            Audit Ledger
          </button>
        </div>
      </div>

      {/* Tamper Alert if Active */}
      {!isValid && tamperDetails && (
        <div className="p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-300 dark:border-rose-900 text-xs text-rose-900 dark:text-rose-200 flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-rose-600 flex-shrink-0 mt-0.5" />
          <div className="space-y-1">
            <strong className="block text-sm font-bold">
              Simulated Data Alteration Detected on Block #{tamperDetails.blockIndex}
            </strong>
            <p className="text-slate-600 dark:text-slate-400">
              The candidate was modified to <strong>"{tamperDetails.fraudulentCandidate}"</strong>. Block #{tamperDetails.blockIndex} stored hash does not equal its newly recalculated hash, breaking downstream verification.
            </p>
          </div>
        </div>
      )}

      {/* Visual Chain Summary */}
      <div className="bg-slate-50 dark:bg-slate-900/60 p-3 rounded-2xl border border-slate-200 dark:border-slate-800 text-xs text-slate-500 dark:text-slate-400 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="font-bold text-slate-700 dark:text-slate-300">Block Sequence:</span>
          <span className="font-mono text-blue-600 dark:text-blue-400 font-semibold">
            Genesis (Block #0) {chain.slice(1).map((b) => `→ Block #${b.index}`).join(' ')}
          </span>
        </div>
        <div className="font-mono text-[11px] text-slate-400">
          Cryptographic Hash: SHA-256
        </div>
      </div>

      {/* Block Chain Cards List */}
      <div className="space-y-4">
        {chain.map((block, idx) => {
          const isGenesis = block.index === 0;
          const isTamperedBlock = !isValid && tamperDetails?.blockIndex === block.index;

          return (
            <div key={block.index} className="relative">
              <div
                className={`bg-white dark:bg-slate-900 rounded-3xl border-2 transition-all shadow-sm overflow-hidden ${
                  isTamperedBlock
                    ? 'border-rose-500 ring-2 ring-rose-500/20 shadow-rose-500/10'
                    : isGenesis
                    ? 'border-slate-800 dark:border-slate-700'
                    : 'border-slate-200 dark:border-slate-800 hover:border-slate-300'
                }`}
              >
                {/* Block Header */}
                <div
                  className={`p-4 sm:px-6 flex flex-wrap items-center justify-between gap-2 border-b ${
                    isTamperedBlock
                      ? 'bg-rose-600 text-white border-rose-700'
                      : isGenesis
                      ? 'bg-slate-900 text-white border-slate-800'
                      : 'bg-slate-800 text-white border-slate-700'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="px-2.5 py-0.5 rounded-lg bg-white/20 text-white font-mono font-bold text-xs">
                      #{block.index}
                    </span>
                    <h3 className="font-bold text-sm tracking-wide">
                      {isGenesis ? 'Genesis Block (Anchor Node)' : `Vote Transaction Block #${block.index}`}
                    </h3>
                    {isGenesis ? (
                      <span className="text-[10px] bg-blue-500/30 text-blue-200 px-2 py-0.5 rounded-full font-semibold">
                        Genesis Anchor
                      </span>
                    ) : (
                      <span className="text-[10px] bg-emerald-500/30 text-emerald-200 px-2 py-0.5 rounded-full font-semibold">
                        Sealed Transaction
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-1 text-[11px] text-slate-300 font-mono">
                    <Clock className="w-3.5 h-3.5" />
                    <span>{block.timestamp}</span>
                  </div>
                </div>

                {/* Block Body */}
                <div className="p-6 grid grid-cols-1 md:grid-cols-12 gap-6 text-xs">
                  {/* Left Data Payload */}
                  <div className="md:col-span-6 space-y-3">
                    <div className="flex items-center gap-1.5 font-bold text-slate-800 dark:text-slate-200 text-xs uppercase tracking-wider">
                      <FileText className="w-4 h-4 text-blue-500" />
                      <span>Block Payload (Data)</span>
                    </div>

                    <div className="bg-slate-50 dark:bg-slate-800/80 p-4 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-2.5">
                      {isGenesis ? (
                        <>
                          <div className="flex justify-between">
                            <span className="text-slate-500">Payload Type:</span>
                            <span className="font-mono font-semibold text-slate-700 dark:text-slate-300">
                              GENESIS_ROOT
                            </span>
                          </div>
                          <div>
                            <span className="text-slate-500 block">Description:</span>
                            <span className="font-semibold text-slate-800 dark:text-slate-200">
                              {block.data.message}
                            </span>
                          </div>
                          <div className="text-[11px] text-slate-400">
                            Election ID: {block.data.election_id || 'STUDENT_COUNCIL_2026'}
                          </div>
                        </>
                      ) : (
                        <>
                          <div className="flex justify-between items-center pb-2 border-b border-slate-200 dark:border-slate-700">
                            <span className="text-slate-500">Candidate Choice:</span>
                            <span className="font-bold text-sm text-blue-600 dark:text-blue-400">
                              {block.data.candidate}
                            </span>
                          </div>
                          <div>
                            <span className="text-slate-500 block mb-1">Voter Identifier Hash (SHA-256):</span>
                            <div className="font-mono text-[10px] bg-white dark:bg-slate-900 p-2 rounded-lg border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 break-all select-all">
                              {block.data.voter_hash}
                            </div>
                          </div>
                          <div className="flex justify-between text-[11px] text-slate-400 pt-1">
                            <span>Election ID:</span>
                            <span className="font-mono">{block.data.election_id}</span>
                          </div>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Right Cryptographic Linkages */}
                  <div className="md:col-span-6 space-y-3">
                    <div className="flex items-center gap-1.5 font-bold text-slate-800 dark:text-slate-200 text-xs uppercase tracking-wider">
                      <Key className="w-4 h-4 text-emerald-500" />
                      <span>Cryptographic Hashes</span>
                    </div>

                    <div className="space-y-2.5">
                      {/* Previous Hash */}
                      <div className="space-y-1">
                        <div className="flex items-center justify-between text-[11px] text-slate-500">
                          <span>Previous Block Hash (Linkage):</span>
                          {isGenesis && <span className="text-slate-400 font-mono">Root (0)</span>}
                        </div>
                        <div className="font-mono text-[10px] bg-slate-50 dark:bg-slate-800/80 p-2 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 break-all select-all">
                          {block.previous_hash}
                        </div>
                      </div>

                      {/* Current Hash */}
                      <div className="space-y-1">
                        <div className="flex items-center justify-between text-[11px] text-slate-500">
                          <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                            Current Block Hash:
                          </span>
                          <span className="font-mono text-[10px] text-slate-400">SHA-256</span>
                        </div>
                        <div
                          className={`font-mono text-[10px] p-2 rounded-xl border break-all select-all font-bold ${
                            isTamperedBlock
                              ? 'bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 border-rose-300 dark:border-rose-800'
                              : 'bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800'
                          }`}
                        >
                          {block.hash}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Block Footer */}
                <div className="px-6 py-2.5 bg-slate-50 dark:bg-slate-950/60 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-[11px] text-slate-500">
                  <span className="flex items-center gap-1">
                    <Lock className="w-3.5 h-3.5 text-slate-400" />
                    <span>Cryptographically Linked to Block #{block.index === 0 ? 0 : block.index - 1}</span>
                  </span>
                  <span className="font-mono text-slate-400">
                    {isGenesis ? 'Genesis Anchor Block' : 'Verified Transaction Block'}
                  </span>
                </div>
              </div>

              {/* Connecting Arrow */}
              {idx < chain.length - 1 && (
                <div className="flex flex-col items-center justify-center my-2">
                  <div className="w-0.5 h-4 bg-slate-300 dark:bg-slate-700" />
                  <div className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center shadow-md">
                    <ArrowDown className="w-3.5 h-3.5" />
                  </div>
                  <div className="w-0.5 h-4 bg-slate-300 dark:bg-slate-700" />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
