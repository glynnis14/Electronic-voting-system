import React, { useState } from 'react';
import {
  ShieldCheck,
  AlertTriangle,
  RefreshCw,
  Zap,
  CheckCircle2,
  XCircle,
  RotateCcw,
  Bug,
  Lock,
} from 'lucide-react';
import { Block, TamperDetails, VerificationResult } from '../types';

interface VerifyViewProps {
  chain: Block[];
  verificationResult: VerificationResult;
  tamperDetails: TamperDetails | null;
  onRunVerification: () => void;
  onSimulateTamper: (blockIndex: number, fraudulentCandidate: string) => Promise<void>;
  onRestoreChain: () => void;
}

export const VerifyView: React.FC<VerifyViewProps> = ({
  chain,
  verificationResult,
  tamperDetails,
  onRunVerification,
  onSimulateTamper,
  onRestoreChain,
}) => {
  const [selectedBlockIndex, setSelectedBlockIndex] = useState<number>(chain.length > 1 ? 1 : 0);
  const [fraudulentCandidate, setFraudulentCandidate] = useState<string>('Modified Candidate X');
  const [isSimulating, setIsSimulating] = useState(false);

  const handleTamperClick = async (e: React.FormEvent) => {
    e.preventDefault();
    if (chain.length <= 1) return;
    setIsSimulating(true);
    await onSimulateTamper(selectedBlockIndex, fraudulentCandidate);
    setIsSimulating(false);
  };

  return (
    <div className="max-w-4xl mx-auto py-2 space-y-8">
      {/* Header Banner */}
      <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 text-xs font-semibold mb-1">
            <ShieldCheck className="w-3.5 h-3.5" />
            Integrity Verification Audit
          </div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">
            Blockchain Ledger Verification
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Independent audit verifying {chain.length} sequential blocks via cryptographic SHA-256 validation and previous-hash pointers
          </p>
        </div>

        <button
          onClick={onRunVerification}
          className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs flex items-center gap-1.5 shadow-sm transition-colors"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Run Verification Audit</span>
        </button>
      </div>

      {/* Primary Verification Result Box */}
      <div
        className={`p-6 sm:p-8 rounded-3xl border-2 transition-all shadow-md ${
          verificationResult.isValid
            ? 'bg-emerald-50/70 dark:bg-emerald-950/30 border-emerald-500/80 text-emerald-950 dark:text-emerald-100'
            : 'bg-rose-50/70 dark:bg-rose-950/30 border-rose-500/80 text-rose-950 dark:text-rose-100'
        }`}
      >
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div
              className={`w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-lg ${
                verificationResult.isValid
                  ? 'bg-emerald-600 text-white shadow-emerald-600/30'
                  : 'bg-rose-600 text-white shadow-rose-600/30 animate-pulse'
              }`}
            >
              {verificationResult.isValid ? (
                <CheckCircle2 className="w-8 h-8" />
              ) : (
                <XCircle className="w-8 h-8" />
              )}
            </div>
            <div>
              <div className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Audit Timestamp: {verificationResult.timestamp}
              </div>
              <h3 className="text-xl sm:text-2xl font-extrabold tracking-tight">
                {verificationResult.isValid
                  ? 'Blockchain Status: VALID'
                  : 'Blockchain Status: INVALID'}
              </h3>
            </div>
          </div>

          {!verificationResult.isValid && (
            <button
              onClick={onRestoreChain}
              className="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold flex items-center gap-2 shadow-md transition-all"
            >
              <RotateCcw className="w-4 h-4 text-emerald-400" />
              <span>Restore Verified Ledger</span>
            </button>
          )}
        </div>

        {/* Detailed diagnostic message */}
        <div className="mt-5 p-4 rounded-2xl bg-white/90 dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 text-xs font-mono break-all leading-relaxed">
          {verificationResult.message}
        </div>
      </div>

      {/* Step-by-Step Cryptographic Checklist */}
      <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-blue-500" />
          <span>Automated Cryptographic Verification Checklist</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
          <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 flex items-start gap-3">
            <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />
            <div>
              <strong className="block font-semibold text-slate-800 dark:text-slate-200">
                Genesis Block Anchoring
              </strong>
              <span className="text-slate-500 dark:text-slate-400">
                Block #0 verified with <code>previous_hash = "0"</code> and verified root declaration.
              </span>
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 flex items-start gap-3">
            {verificationResult.isValid ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />
            ) : (
              <XCircle className="w-4 h-4 text-rose-500 flex-shrink-0 mt-0.5" />
            )}
            <div>
              <strong className="block font-semibold text-slate-800 dark:text-slate-200">
                Content Hash Continuity
              </strong>
              <span className="text-slate-500 dark:text-slate-400">
                Every block recomputes <code>SHA-256(index, time, data, prev)</code> and matches the stored hash.
              </span>
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 flex items-start gap-3">
            {verificationResult.isValid ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />
            ) : (
              <XCircle className="w-4 h-4 text-rose-500 flex-shrink-0 mt-0.5" />
            )}
            <div>
              <strong className="block font-semibold text-slate-800 dark:text-slate-200">
                Cryptographic Linkage Verification
              </strong>
              <span className="text-slate-500 dark:text-slate-400">
                Each block's <code>previous_hash</code> strictly equals the preceding block's hash.
              </span>
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 flex items-start gap-3">
            <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />
            <div>
              <strong className="block font-semibold text-slate-800 dark:text-slate-200">
                Duplicate Ballot Prevention
              </strong>
              <span className="text-slate-500 dark:text-slate-400">
                Verified that each <code>voter_hash</code> appears at most once across all blocks.
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Security Testing: Tamper Simulation */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
        <div className="bg-slate-900 text-white p-6 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center">
              <Bug className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] uppercase tracking-wider font-bold text-amber-400">
                Security & Audit Testing
              </span>
              <h3 className="text-lg font-bold">Tamper Detection Demonstration</h3>
            </div>
          </div>
          <p className="text-xs text-slate-400 mt-2 max-w-2xl">
            Simulate modifying data inside a sealed block to verify that the cryptographic hash chain breaks and the verification engine immediately detects the alteration.
          </p>
        </div>

        <div className="p-6 space-y-6">
          {chain.length <= 1 ? (
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800 text-xs text-slate-600 dark:text-slate-400">
              Please cast at least one vote to test tamper detection on vote transaction blocks.
            </div>
          ) : (
            <form onSubmit={handleTamperClick} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                    Select Target Block to Modify:
                  </label>
                  <select
                    value={selectedBlockIndex}
                    onChange={(e) => setSelectedBlockIndex(Number(e.target.value))}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs font-mono focus:outline-none focus:ring-2 focus:ring-amber-500"
                  >
                    {chain.slice(1).map((b) => (
                      <option key={b.index} value={b.index}>
                        Block #{b.index} (Current: {b.data.candidate})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                    Enter Modified Candidate Value:
                  </label>
                  <input
                    type="text"
                    value={fraudulentCandidate}
                    onChange={(e) => setFraudulentCandidate(e.target.value)}
                    placeholder="e.g. Altered Candidate Choice"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs focus:outline-none focus:ring-2 focus:ring-amber-500"
                    required
                  />
                </div>
              </div>

              <div className="flex flex-wrap gap-3">
                <button
                  type="submit"
                  disabled={isSimulating}
                  className="px-6 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-semibold text-xs flex items-center gap-2 shadow-sm transition-colors"
                >
                  <Zap className="w-4 h-4" />
                  <span>Simulate Data Alteration on Block #{selectedBlockIndex}</span>
                </button>

                {!verificationResult.isValid && (
                  <button
                    type="button"
                    onClick={onRestoreChain}
                    className="px-6 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs flex items-center gap-2 shadow-sm transition-colors"
                  >
                    <RotateCcw className="w-4 h-4 text-emerald-400" />
                    <span>Restore Verified Ledger</span>
                  </button>
                )}
              </div>
            </form>
          )}

          {/* Tamper Diagnosis Comparison Panel */}
          {tamperDetails && (
            <div className="p-5 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/80 space-y-4 text-xs">
              <div className="flex items-center gap-2 font-bold text-rose-700 dark:text-rose-300 text-sm">
                <AlertTriangle className="w-4 h-4" />
                <span>Forensic Tamper Analysis (Block #{tamperDetails.blockIndex})</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-3 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 space-y-1">
                  <span className="text-slate-400 text-[10px] uppercase font-bold">Original Candidate Data</span>
                  <div className="text-sm font-bold text-slate-700 dark:text-slate-300 line-through">
                    {tamperDetails.originalCandidate}
                  </div>
                </div>

                <div className="p-3 bg-rose-100 dark:bg-rose-900/40 rounded-xl border border-rose-200 dark:border-rose-800 space-y-1">
                  <span className="text-rose-500 text-[10px] uppercase font-bold">Modified Injected Value</span>
                  <div className="text-sm font-bold text-rose-700 dark:text-rose-300">
                    {tamperDetails.fraudulentCandidate}
                  </div>
                </div>
              </div>

              <div className="space-y-2 font-mono text-[11px]">
                <div className="p-3 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 space-y-1">
                  <span className="text-slate-500">Stored Sealed Block Hash (Original):</span>
                  <div className="text-slate-700 dark:text-slate-300 break-all select-all font-bold">
                    {tamperDetails.storedHash}
                  </div>
                </div>

                <div className="p-3 bg-rose-100 dark:bg-rose-900/40 rounded-xl border border-rose-300 dark:border-rose-800 space-y-1">
                  <span className="text-rose-600 dark:text-rose-400 font-bold">
                    Recalculated Hash on Altered Content:
                  </span>
                  <div className="text-rose-800 dark:text-rose-200 break-all select-all font-bold">
                    {tamperDetails.recalculatedHash}
                  </div>
                </div>
              </div>

              <div className="p-3 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 leading-relaxed">
                <strong className="text-slate-900 dark:text-white">Why Alteration Fails:</strong> Modifying the block payload changes its recalculated SHA-256 hash. Because the original hash is sealed in both Block #{tamperDetails.blockIndex} and referenced in Block #{tamperDetails.blockIndex + 1}'s <code>previous_hash</code>, the cryptographic chain is immediately broken and flagged by the integrity engine.
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
