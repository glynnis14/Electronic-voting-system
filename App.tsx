import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { HomeView } from './components/HomeView';
import { InfoView } from './components/InfoView';
import { LoginView } from './components/LoginView';
import { VotingView } from './components/VotingView';
import { SuccessView } from './components/SuccessView';
import { ExplorerView } from './components/ExplorerView';
import { VerifyView } from './components/VerifyView';
import { AdminView } from './components/AdminView';
import { ResultsView } from './components/ResultsView';
import {
  DEFAULT_ELECTION_CONFIG,
  loadOrCreateChain,
  loadVoters,
  saveChain,
  saveSnapshot,
  loadSnapshot,
  saveVoters,
  mineVoteBlock,
  verifyBlockchain,
  createGenesisBlock,
  DEFAULT_VOTERS,
} from './blockchainEngine';
import { Block, TamperDetails, VerificationResult, VoteReceipt, Voter } from './types';
import { calculateBlockHash } from './crypto';

export default function App() {
  const [currentTab, setCurrentTab] = useState<string>('home');
  const [chain, setChain] = useState<Block[]>([]);
  const [voters, setVoters] = useState<Voter[]>([]);
  const [currentUser, setCurrentUser] = useState<Voter | null>(null);
  const [receipt, setReceipt] = useState<VoteReceipt | null>(null);
  const [tamperDetails, setTamperDetails] = useState<TamperDetails | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [verificationResult, setVerificationResult] = useState<VerificationResult>({
    isValid: true,
    message: 'Blockchain Status: VALID - All block hashes and cryptographic linkages verified successfully.',
    failingBlockIndex: null,
    timestamp: new Date().toLocaleTimeString(),
  });

  // Initial Load
  useEffect(() => {
    async function init() {
      const loadedChain = await loadOrCreateChain();
      setChain(loadedChain);
      const loadedVoters = loadVoters();
      setVoters(loadedVoters);
      const initialAudit = await verifyBlockchain(loadedChain);
      setVerificationResult(initialAudit);
    }
    init();
  }, []);

  // Run audit helper
  const runAudit = async (currentChain: Block[]) => {
    const audit = await verifyBlockchain(currentChain);
    setVerificationResult(audit);
    return audit;
  };

  // Handle Vote Submission
  const handleCastVote = async (candidateId: string) => {
    if (!currentUser) {
      setCurrentTab('login');
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await mineVoteBlock(chain, currentUser.voter_id, candidateId);
      if (res.success && res.newBlock && res.updatedChain) {
        setChain(res.updatedChain);
        setTamperDetails(null);
        await runAudit(res.updatedChain);

        // Build Receipt
        const voteReceipt: VoteReceipt = {
          blockIndex: res.newBlock.index,
          timestamp: res.newBlock.timestamp,
          candidate: candidateId,
          voterId: currentUser.voter_id,
          voterHash: currentUser.voter_hash,
          previousHash: res.newBlock.previous_hash,
          currentHash: res.newBlock.hash,
        };
        setReceipt(voteReceipt);
        setCurrentTab('success');
      } else {
        alert(res.message);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  // Simulate Tampering
  const handleSimulateTamper = async (blockIndex: number, fraudulentCandidate: string) => {
    if (blockIndex <= 0 || blockIndex >= chain.length) return;

    const targetBlock = chain[blockIndex];
    const originalCandidate = targetBlock.data.candidate || 'N/A';

    // Shallow clone chain & block to alter data without changing hash
    const clonedChain = chain.map((b) => ({
      ...b,
      data: { ...b.data },
    }));

    clonedChain[blockIndex].data.candidate = fraudulentCandidate;
    clonedChain[blockIndex].data._tamper_flag = true;

    // Recalculate what the hash would be
    const recalculated = await calculateBlockHash(
      clonedChain[blockIndex].index,
      clonedChain[blockIndex].timestamp,
      clonedChain[blockIndex].data,
      clonedChain[blockIndex].previous_hash
    );

    setChain(clonedChain);

    const details: TamperDetails = {
      blockIndex,
      originalCandidate,
      fraudulentCandidate,
      storedHash: targetBlock.hash,
      recalculatedHash: recalculated,
    };
    setTamperDetails(details);

    await runAudit(clonedChain);
  };

  // Restore Chain from Untampered Snapshot
  const handleRestoreChain = async () => {
    const snapshot = loadSnapshot();
    if (snapshot && snapshot.length > 0) {
      setChain(snapshot);
      saveChain(snapshot);
      setTamperDetails(null);
      await runAudit(snapshot);
    }
  };

  // Reset Everything to Clean Initial State
  const handleResetDemo = async () => {
    if (
      window.confirm(
        'Reset the entire voting ledger back to the Genesis Block and default authorized voter roll?'
      )
    ) {
      const genesis = await createGenesisBlock();
      const freshChain = [genesis];
      saveChain(freshChain);
      saveSnapshot(freshChain);
      setChain(freshChain);

      saveVoters(DEFAULT_VOTERS);
      setVoters(DEFAULT_VOTERS);

      setTamperDetails(null);
      setReceipt(null);
      setCurrentUser(null);

      const audit = await verifyBlockchain(freshChain);
      setVerificationResult(audit);
      setCurrentTab('home');
    }
  };

  const handleLoginSuccess = (voter: Voter) => {
    setCurrentUser(voter);
    setCurrentTab('vote');
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setCurrentTab('home');
  };

  const handleRegisterVoter = (newVoter: Voter) => {
    const updated = [...voters, newVoter];
    setVoters(updated);
    saveVoters(updated);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col font-sans selection:bg-blue-600 selection:text-white">
      {/* Navigation Header */}
      <Navbar
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
        currentUser={currentUser}
        onLogout={handleLogout}
        isValid={verificationResult.isValid}
        blockCount={chain.length}
        onResetDemo={handleResetDemo}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6">
        {currentTab === 'home' && (
          <HomeView
            setCurrentTab={setCurrentTab}
            electionConfig={DEFAULT_ELECTION_CONFIG}
            totalBlocks={chain.length}
            votesCast={Math.max(0, chain.length - 1)}
            totalVoters={voters.length}
            isValid={verificationResult.isValid}
            statusMessage={verificationResult.message}
          />
        )}

        {currentTab === 'info' && (
          <InfoView
            electionConfig={DEFAULT_ELECTION_CONFIG}
            setCurrentTab={setCurrentTab}
          />
        )}

        {currentTab === 'login' && (
          <LoginView
            voters={voters}
            chain={chain}
            onLoginSuccess={handleLoginSuccess}
            onRegisterVoter={handleRegisterVoter}
          />
        )}

        {currentTab === 'vote' && (
          currentUser ? (
            <VotingView
              currentUser={currentUser}
              electionConfig={DEFAULT_ELECTION_CONFIG}
              onCastVote={handleCastVote}
              isSubmitting={isSubmitting}
            />
          ) : (
            <LoginView
              voters={voters}
              chain={chain}
              onLoginSuccess={handleLoginSuccess}
              onRegisterVoter={handleRegisterVoter}
            />
          )
        )}

        {currentTab === 'success' && receipt && (
          <SuccessView receipt={receipt} setCurrentTab={setCurrentTab} />
        )}

        {currentTab === 'explorer' && (
          <ExplorerView
            chain={chain}
            isValid={verificationResult.isValid}
            tamperDetails={tamperDetails}
            setCurrentTab={setCurrentTab}
          />
        )}

        {currentTab === 'verify' && (
          <VerifyView
            chain={chain}
            verificationResult={verificationResult}
            tamperDetails={tamperDetails}
            onRunVerification={() => runAudit(chain)}
            onSimulateTamper={handleSimulateTamper}
            onRestoreChain={handleRestoreChain}
          />
        )}

        {currentTab === 'admin' && (
          <AdminView
            voters={voters}
            chain={chain}
            candidates={DEFAULT_ELECTION_CONFIG.candidates}
            onResetDemo={handleResetDemo}
            setCurrentTab={setCurrentTab}
          />
        )}

        {currentTab === 'results' && (
          <ResultsView
            chain={chain}
            candidates={DEFAULT_ELECTION_CONFIG.candidates}
            electionConfig={DEFAULT_ELECTION_CONFIG}
            isValid={verificationResult.isValid}
            setCurrentTab={setCurrentTab}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="bg-slate-900 border-t border-slate-800 text-slate-400 py-6 text-xs">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
          <div>
            <span className="text-slate-200 font-bold">Electronic Voting Portal</span> • Blockchain-Based Electronic Voting System
            <div className="text-[11px] text-slate-500 mt-0.5">
              Secure Ledger • Cryptographic SHA-256 Linkages • Independent Verification
            </div>
          </div>
          <div className="flex items-center gap-3 text-[11px] text-slate-400">
            <span>Consensus Ledger Engine: SHA-256</span>
            <span className="text-slate-700">|</span>
            <span>Single-Vote Enforcement Active</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
