import React, { useState } from 'react';
import {
  CheckCircle2,
  Boxes,
  ShieldCheck,
  BarChart3,
  Copy,
  Check,
  Lock,
  ArrowRight,
} from 'lucide-react';
import { VoteReceipt } from '../types';

interface SuccessViewProps {
  receipt: VoteReceipt;
  setCurrentTab: (tab: string) => void;
}

export const SuccessView: React.FC<SuccessViewProps> = ({ receipt, setCurrentTab }) => {
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  return (
    <div className="max-w-2xl mx-auto py-4 space-y-6">
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-md overflow-hidden">
        {/* Success Header */}
        <div className="bg-emerald-600 text-white p-8 text-center">
          <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center mx-auto mb-3 backdrop-blur-sm">
            <CheckCircle2 className="w-10 h-10 text-white" />
          </div>
          <h2 className="text-2xl font-extrabold tracking-tight">Vote Successfully Recorded!</h2>
          <p className="text-xs text-emerald-100 mt-1 max-w-md mx-auto">
            Your ballot has been cryptographically signed and permanently committed into Block #{receipt.blockIndex} of the blockchain.
          </p>
        </div>

        {/* Cryptographic Receipt Body */}
        <div className="p-6 sm:p-8 space-y-5">
          <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <span className="bg-blue-600 text-white text-[10px] font-bold px-2 py-0.5 rounded uppercase font-mono">
                Receipt
              </span>
              <h3 className="font-bold text-sm text-slate-800 dark:text-slate-200">
                Block #{receipt.blockIndex} Details
              </h3>
            </div>
            <span className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1">
              <Lock className="w-3.5 h-3.5" /> Immutable
            </span>
          </div>

          <div className="grid grid-cols-1 gap-4 text-xs">
            <div className="flex flex-col sm:flex-row justify-between py-1 border-b border-slate-100 dark:border-slate-800">
              <span className="text-slate-500">Candidate Selected:</span>
              <span className="font-bold text-blue-600 dark:text-blue-400 text-sm">
                {receipt.candidate}
              </span>
            </div>

            <div className="flex flex-col sm:flex-row justify-between py-1 border-b border-slate-100 dark:border-slate-800">
              <span className="text-slate-500">Timestamp (UTC):</span>
              <span className="font-mono text-slate-700 dark:text-slate-300">
                {receipt.timestamp}
              </span>
            </div>

            {/* Voter Hash */}
            <div className="space-y-1 py-1 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Voter ID SHA-256 Hash:</span>
                <button
                  onClick={() => copyToClipboard(receipt.voterHash, 'voterHash')}
                  className="text-slate-400 hover:text-slate-600 flex items-center gap-1 text-[11px]"
                >
                  {copiedKey === 'voterHash' ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedKey === 'voterHash' ? 'Copied' : 'Copy'}</span>
                </button>
              </div>
              <div className="font-mono text-[11px] bg-slate-50 dark:bg-slate-800 p-2.5 rounded-xl text-slate-600 dark:text-slate-400 break-all select-all">
                {receipt.voterHash}
              </div>
              <p className="text-[10px] text-slate-400">
                Irreversible hash ensuring one-person-one-vote while guarding your privacy.
              </p>
            </div>

            {/* Previous Hash */}
            <div className="space-y-1 py-1 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Previous Block Hash (Linkage):</span>
                <button
                  onClick={() => copyToClipboard(receipt.previousHash, 'prevHash')}
                  className="text-slate-400 hover:text-slate-600 flex items-center gap-1 text-[11px]"
                >
                  {copiedKey === 'prevHash' ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedKey === 'prevHash' ? 'Copied' : 'Copy'}</span>
                </button>
              </div>
              <div className="font-mono text-[11px] bg-slate-50 dark:bg-slate-800 p-2.5 rounded-xl text-slate-600 dark:text-slate-400 break-all select-all">
                {receipt.previousHash}
              </div>
            </div>

            {/* Current Block Hash */}
            <div className="space-y-1 py-1">
              <div className="flex items-center justify-between">
                <span className="text-slate-500 font-semibold text-emerald-600 dark:text-emerald-400">
                  Current Block Hash (SHA-256):
                </span>
                <button
                  onClick={() => copyToClipboard(receipt.currentHash, 'currHash')}
                  className="text-slate-400 hover:text-slate-600 flex items-center gap-1 text-[11px]"
                >
                  {copiedKey === 'currHash' ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedKey === 'currHash' ? 'Copied' : 'Copy'}</span>
                </button>
              </div>
              <div className="font-mono text-[11px] bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 p-2.5 rounded-xl text-emerald-800 dark:text-emerald-300 font-bold break-all select-all">
                {receipt.currentHash}
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="pt-4 flex flex-wrap gap-3">
            <button
              onClick={() => setCurrentTab('explorer')}
              className="flex-1 py-2.5 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold flex items-center justify-center gap-2 transition-colors shadow-sm"
            >
              <Boxes className="w-4 h-4" />
              <span>Inspect in Explorer</span>
            </button>
            <button
              onClick={() => setCurrentTab('verify')}
              className="flex-1 py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold flex items-center justify-center gap-2 transition-colors shadow-sm"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>Verify Integrity</span>
            </button>
            <button
              onClick={() => setCurrentTab('results')}
              className="flex-1 py-2.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold flex items-center justify-center gap-2 transition-colors shadow-sm"
            >
              <BarChart3 className="w-4 h-4" />
              <span>View Results</span>
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 dark:bg-slate-950/60 border-t border-slate-200 dark:border-slate-800 text-center text-[11px] text-slate-500">
          Save this receipt to independently audit that your ballot is counted in the final consensus tally.
        </div>
      </div>
    </div>
  );
};
