import React, { useState } from 'react';
import {
  UserCheck,
  UserPlus,
  ShieldCheck,
  AlertCircle,
  CheckCircle2,
  Lock,
  ArrowRight,
  Fingerprint,
} from 'lucide-react';
import { Voter, Block } from '../types';
import { hashVoterId } from '../crypto';
import { hasVoterVoted } from '../blockchainEngine';

interface LoginViewProps {
  voters: Voter[];
  chain: Block[];
  onLoginSuccess: (voter: Voter) => void;
  onRegisterVoter: (voter: Voter) => void;
}

export const LoginView: React.FC<LoginViewProps> = ({
  voters,
  chain,
  onLoginSuccess,
  onRegisterVoter,
}) => {
  const [activeTab, setActiveTab] = useState<'login' | 'register'>('login');
  const [voterIdInput, setVoterIdInput] = useState('');
  const [nameInput, setNameInput] = useState('');
  const [emailInput, setEmailInput] = useState('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);

    const cleanId = voterIdInput.trim().toUpperCase();
    if (!cleanId) {
      setErrorMsg('Please enter a valid Voter ID.');
      return;
    }

    const foundVoter = voters.find((v) => v.voter_id.toUpperCase() === cleanId);
    if (!foundVoter) {
      setErrorMsg(
        `Voter ID '${cleanId}' was not found in the verified roll. Please check your credentials or register a demonstration account.`
      );
      return;
    }

    // Check Duplicate Voting on Blockchain
    const vHash = await hashVoterId(cleanId);
    if (hasVoterVoted(chain, vHash)) {
      setErrorMsg('Vote Already Recorded. Each verified voter may cast only one vote.');
      return;
    }

    // Success
    setSuccessMsg('Voter identity verified. Opening official ballot...');
    setTimeout(() => {
      onLoginSuccess(foundVoter);
    }, 500);
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);

    const cleanId = voterIdInput.trim().toUpperCase();
    if (!cleanId || !nameInput.trim() || !emailInput.trim()) {
      setErrorMsg('All registration fields are required.');
      return;
    }

    if (voters.some((v) => v.voter_id.toUpperCase() === cleanId)) {
      setErrorMsg(`Voter ID '${cleanId}' is already registered in the voter roll.`);
      return;
    }

    const vHash = await hashVoterId(cleanId);
    const newVoter: Voter = {
      voter_id: cleanId,
      name: nameInput.trim(),
      email: emailInput.trim(),
      voter_hash: vHash,
      registered_at: new Date().toISOString().replace('T', ' ').substring(0, 19) + ' UTC',
    };

    onRegisterVoter(newVoter);
    setSuccessMsg(`Voter ID '${cleanId}' registered successfully. You may now log in.`);
    setActiveTab('login');
    setNameInput('');
    setEmailInput('');
  };

  const handleSelectSample = (id: string) => {
    setVoterIdInput(id);
    setErrorMsg(null);
    setSuccessMsg(null);
  };

  return (
    <div className="max-w-xl mx-auto py-6">
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-md overflow-hidden">
        {/* Header */}
        <div className="bg-slate-900 text-white p-7 text-center border-b border-slate-800">
          <div className="w-12 h-12 rounded-2xl bg-blue-600 flex items-center justify-center mx-auto mb-3 shadow-lg shadow-blue-500/20">
            <Fingerprint className="w-6 h-6 text-white" />
          </div>
          <h2 className="text-xl font-bold">Voter Authentication</h2>
          <p className="text-xs text-slate-400 mt-1">
            Secure verification against the official voter register before issuing a digital ballot
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="p-6">
          <div className="grid grid-cols-2 gap-2 p-1 bg-slate-100 dark:bg-slate-800 rounded-2xl mb-6">
            <button
              type="button"
              onClick={() => {
                setActiveTab('login');
                setErrorMsg(null);
              }}
              className={`py-2 text-xs font-semibold rounded-xl transition-all flex items-center justify-center gap-1.5 ${
                activeTab === 'login'
                  ? 'bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              <UserCheck className="w-4 h-4" />
              Authenticate Voter
            </button>
            <button
              type="button"
              onClick={() => {
                setActiveTab('register');
                setErrorMsg(null);
              }}
              className={`py-2 text-xs font-semibold rounded-xl transition-all flex items-center justify-center gap-1.5 ${
                activeTab === 'register'
                  ? 'bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              <UserPlus className="w-4 h-4" />
              Register New Voter
            </button>
          </div>

          {/* Feedback Alerts */}
          {errorMsg && (
            <div className="mb-5 p-3.5 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60 text-xs text-rose-700 dark:text-rose-300 flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 text-rose-500 mt-0.5 flex-shrink-0" />
              <div className="leading-snug">{errorMsg}</div>
            </div>
          )}

          {successMsg && (
            <div className="mb-5 p-3.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900/60 text-xs text-emerald-700 dark:text-emerald-300 flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-500 mt-0.5 flex-shrink-0" />
              <div className="leading-snug">{successMsg}</div>
            </div>
          )}

          {activeTab === 'login' ? (
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                  Official Voter ID
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={voterIdInput}
                    onChange={(e) => setVoterIdInput(e.target.value)}
                    placeholder="e.g. VOTER001"
                    className="w-full px-4 py-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-mono text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                  <div className="absolute right-3 top-3.5 text-slate-400">
                    <Lock className="w-4 h-4" />
                  </div>
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1.5 leading-normal">
                  Your Voter ID is converted to a cryptographic hash upon ballot submission to protect your privacy and ensure single-vote compliance.
                </p>
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs tracking-wide shadow-md shadow-blue-600/20 flex items-center justify-center gap-2 transition-all"
              >
                <span>Verify Credentials & Enter Voting Booth</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              {/* Sample Demonstration Accounts */}
              <div className="pt-4 border-t border-slate-200 dark:border-slate-800">
                <div className="text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-2">
                  Sample Demonstration Accounts (Click to load):
                </div>
                <div className="flex flex-wrap gap-2">
                  {['VOTER001', 'VOTER002', 'VOTER003', 'VOTER004', 'VOTER005'].map((id) => (
                    <button
                      key={id}
                      type="button"
                      onClick={() => handleSelectSample(id)}
                      className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-blue-50 dark:hover:bg-blue-950/60 border border-slate-200 dark:border-slate-700 text-[11px] font-mono font-medium text-slate-700 dark:text-slate-300 transition-colors"
                    >
                      {id}
                    </button>
                  ))}
                </div>
              </div>
            </form>
          ) : (
            <form onSubmit={handleRegister} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                  Assigned Voter Identifier
                </label>
                <input
                  type="text"
                  value={voterIdInput}
                  onChange={(e) => setVoterIdInput(e.target.value)}
                  placeholder="e.g. VOTER006"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-mono text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                  Full Legal Name
                </label>
                <input
                  type="text"
                  value={nameInput}
                  onChange={(e) => setNameInput(e.target.value)}
                  placeholder="e.g. Eleanor Vance"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                  Contact Email Address
                </label>
                <input
                  type="email"
                  value={emailInput}
                  onChange={(e) => setEmailInput(e.target.value)}
                  placeholder="e.g. e.vance@election.demo"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs tracking-wide shadow-md shadow-emerald-600/20 flex items-center justify-center gap-2 transition-all"
              >
                <UserPlus className="w-4 h-4" />
                <span>Register into Official Voter Roll</span>
              </button>
            </form>
          )}
        </div>

        {/* Security footer */}
        <div className="p-3.5 bg-slate-50 dark:bg-slate-950/60 border-t border-slate-200 dark:border-slate-800 text-center text-[11px] text-slate-500 flex items-center justify-center gap-1.5">
          <ShieldCheck className="w-4 h-4 text-blue-500" />
          <span>Cryptographic Hash Identification • Single-Vote Enforcement</span>
        </div>
      </div>
    </div>
  );
};
