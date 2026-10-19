import React, { useState } from 'react';
import {
  Vote,
  ShieldAlert,
  CheckCircle2,
  Lock,
  ArrowRight,
  User,
  AlertTriangle,
  Info,
} from 'lucide-react';
import { Candidate, ElectionConfig, Voter } from '../types';

interface VotingViewProps {
  currentUser: Voter;
  electionConfig: ElectionConfig;
  onCastVote: (candidateId: string) => Promise<void>;
  isSubmitting: boolean;
}

export const VotingView: React.FC<VotingViewProps> = ({
  currentUser,
  electionConfig,
  onCastVote,
  isSubmitting,
}) => {
  const [selectedCandidate, setSelectedCandidate] = useState<string | null>(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  const chosenObj = electionConfig.candidates.find((c) => c.id === selectedCandidate);

  const handleOpenConfirm = () => {
    if (!selectedCandidate) return;
    setShowConfirmModal(true);
  };

  const handleFinalSubmit = async () => {
    if (!selectedCandidate) return;
    setShowConfirmModal(false);
    await onCastVote(selectedCandidate);
  };

  return (
    <div className="max-w-4xl mx-auto py-2 space-y-6">
      {/* Header Banner */}
      <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 text-xs font-semibold mb-1">
            <Vote className="w-3.5 h-3.5" />
            Official Electronic Ballot
          </div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">
            {electionConfig.title}
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            {electionConfig.subtitle}
          </p>
        </div>

        {/* Authenticated Voter Badge */}
        <div className="bg-slate-50 dark:bg-slate-800/80 p-3 rounded-2xl border border-slate-200 dark:border-slate-700 text-right">
          <div className="text-[10px] uppercase font-bold text-slate-400">Authenticated Voter</div>
          <div className="text-xs font-bold text-slate-800 dark:text-slate-100 flex items-center justify-end gap-1.5 font-mono">
            <User className="w-3.5 h-3.5 text-blue-500" />
            {currentUser.name} ({currentUser.voter_id})
          </div>
          <div className="text-[10px] text-slate-500 font-mono">
            SHA-256: {currentUser.voter_hash.substring(0, 8)}...{currentUser.voter_hash.substring(currentUser.voter_hash.length - 6)}
          </div>
        </div>
      </div>

      {/* Instructions */}
      <div className="p-4 rounded-2xl bg-blue-50/80 dark:bg-blue-950/30 border border-blue-200/80 dark:border-blue-900/40 text-xs text-blue-900 dark:text-blue-300 flex items-start gap-3">
        <Info className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
        <div>
          <strong>Single-Choice Ballot Instructions:</strong> Review the candidate manifestos below. Select exactly one candidate. Once submitted, your vote is packaged into an irreversible blockchain transaction, cryptographically linked with SHA-256 to previous blocks, and permanently committed to the ledger.
        </div>
      </div>

      {/* Candidate Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {electionConfig.candidates.map((cand) => {
          const isSelected = selectedCandidate === cand.id;
          return (
            <div
              key={cand.id}
              onClick={() => setSelectedCandidate(cand.id)}
              className={`cursor-pointer rounded-3xl p-6 border-2 transition-all flex flex-col justify-between relative overflow-hidden bg-white dark:bg-slate-900 ${
                isSelected
                  ? 'border-blue-600 shadow-lg shadow-blue-500/10 scale-[1.02] ring-2 ring-blue-500/20'
                  : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 hover:shadow-md'
              }`}
            >
              {/* Radio Indicator */}
              <div className="flex items-center justify-between mb-4">
                <div className="text-4xl">{cand.symbol}</div>
                <div
                  className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${
                    isSelected
                      ? 'border-blue-600 bg-blue-600'
                      : 'border-slate-300 dark:border-slate-600'
                  }`}
                >
                  {isSelected && <div className="w-2 h-2 rounded-full bg-white" />}
                </div>
              </div>

              {/* Candidate Info */}
              <div className="space-y-2 mb-6">
                <h3 className="text-base font-bold text-slate-900 dark:text-white leading-tight">
                  {cand.name}
                </h3>
                <span className="inline-block px-2.5 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-[11px] font-semibold text-slate-700 dark:text-slate-300">
                  {cand.tagline}
                </span>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed pt-1">
                  {cand.description}
                </p>
              </div>

              {/* Select Status */}
              <div
                className={`py-2 px-3 rounded-xl text-center text-xs font-semibold transition-colors ${
                  isSelected
                    ? 'bg-blue-600 text-white'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                }`}
              >
                {isSelected ? 'Selected' : 'Click to Select'}
              </div>
            </div>
          );
        })}
      </div>

      {/* Submit Action Bar */}
      <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <div className="text-xs text-slate-500 dark:text-slate-400">
            Selected Candidate:
          </div>
          <div className="text-sm font-bold text-slate-900 dark:text-white">
            {chosenObj ? (
              <span className="text-blue-600 dark:text-blue-400 flex items-center gap-1.5">
                <span>{chosenObj.symbol}</span>
                <span>{chosenObj.name}</span>
              </span>
            ) : (
              <span className="text-slate-400 font-normal">None selected yet</span>
            )}
          </div>
        </div>

        <button
          type="button"
          disabled={!selectedCandidate || isSubmitting}
          onClick={handleOpenConfirm}
          className="w-full sm:w-auto px-8 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 disabled:opacity-40 disabled:hover:bg-blue-600 text-white font-semibold text-xs tracking-wide shadow-md shadow-blue-600/20 flex items-center justify-center gap-2 transition-all"
        >
          <Lock className="w-4 h-4" />
          <span>Confirm Vote</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {/* Confirmation Modal */}
      {showConfirmModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-150">
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl max-w-lg w-full overflow-hidden">
            {/* Modal Header */}
            <div className="bg-slate-900 text-white p-5 flex items-center gap-3 border-b border-slate-800">
              <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
                <ShieldAlert className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold">Irrevocable Ballot Confirmation</h3>
                <p className="text-[11px] text-slate-400">Cryptographic Blockchain Transaction</p>
              </div>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-4">
              <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/50 text-xs text-amber-900 dark:text-amber-300">
                <strong className="block text-sm mb-1 font-bold">
                  Are you sure you want to submit your vote? This action cannot be reversed.
                </strong>
                Once committed to the blockchain, your vote is sealed into an immutable block with a SHA-256 hash. Duplicate voting is permanently prevented.
              </div>

              {/* Transaction Specimen */}
              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-xs space-y-2">
                <div className="flex justify-between">
                  <span className="text-slate-500">Voter ID:</span>
                  <span className="font-mono font-bold text-slate-800 dark:text-slate-200">
                    {currentUser.voter_id}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Voter Hash:</span>
                  <span className="font-mono text-[10px] text-slate-500">
                    {currentUser.voter_hash.substring(0, 16)}...
                  </span>
                </div>
                <div className="flex justify-between items-center border-t border-slate-200 dark:border-slate-700 pt-2">
                  <span className="text-slate-500">Selected Candidate:</span>
                  <span className="font-bold text-blue-600 dark:text-blue-400 text-sm">
                    {chosenObj?.name}
                  </span>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 bg-slate-50 dark:bg-slate-950/60 border-t border-slate-200 dark:border-slate-800 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setShowConfirmModal(false)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors"
              >
                Go Back & Change
              </button>
              <button
                type="button"
                onClick={handleFinalSubmit}
                disabled={isSubmitting}
                className="px-6 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-md shadow-blue-600/20 flex items-center gap-1.5 transition-colors"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Yes, Submit to Blockchain</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
