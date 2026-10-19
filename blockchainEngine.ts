import { calculateBlockHash, hashVoterId } from './crypto';
import { Block, BlockData, Candidate, ElectionConfig, TamperDetails, VerificationResult, Voter } from './types';

export const DEFAULT_ELECTION_CONFIG: ElectionConfig = {
  title: 'Student Council Election 2026',
  subtitle: 'Electronic Voting Portal with Tamper-Evident Blockchain Ledger',
  election_id: 'STUDENT_COUNCIL_2026',
  election_status: 'Voting Open',
  voting_period: '20 September 2026 – 25 September 2026',
  candidates: [
    {
      id: 'Candidate A',
      name: 'Candidate A',
      symbol: '⚡',
      color: 'blue',
      tagline: 'Student Welfare & Campus Digital Infrastructure',
      description: 'Prioritizing student campus services, study facilities expansion, and transparent student representation.',
    },
    {
      id: 'Candidate B',
      name: 'Candidate B',
      symbol: '🌱',
      color: 'emerald',
      tagline: 'Academic Support & Community Initiatives',
      description: 'Advancing peer tutoring networks, student research opportunities, and inter-departmental collaborative programs.',
    },
    {
      id: 'Candidate C',
      name: 'Candidate C',
      symbol: '🚀',
      color: 'amber',
      tagline: 'Career Development & Industry Partnerships',
      description: 'Strengthening internship initiatives, professional networking workshops, and skill accelerator labs.',
    },
  ],
};

export const DEFAULT_VOTERS: Voter[] = [
  {
    voter_id: 'VOTER001',
    name: 'Demonstration Account 01',
    email: 'voter001@election.demo',
    voter_hash: '96cae35ce8a9b0244178bf28e4966c2ce1b8385723a96a6b838858cdd6ca0a1e',
    registered_at: '2026-09-15 10:00:00 UTC',
  },
  {
    voter_id: 'VOTER002',
    name: 'Demonstration Account 02',
    email: 'voter002@election.demo',
    voter_hash: '4223f668ef83a31c5b8b9cb030a5e82b7d52a781bcf7bbfe29f604ec95d852a3',
    registered_at: '2026-09-15 10:05:00 UTC',
  },
  {
    voter_id: 'VOTER003',
    name: 'Demonstration Account 03',
    email: 'voter003@election.demo',
    voter_hash: '6a42a0b16f383e204b1ecda924d557f3c4db52f0857321e25d2c206cfd3897b2',
    registered_at: '2026-09-15 10:10:00 UTC',
  },
  {
    voter_id: 'VOTER004',
    name: 'Demonstration Account 04',
    email: 'voter004@election.demo',
    voter_hash: '57dbb69c5e3d7a81dfdf2b2b1cf59b20755ee72d42171ec26d36e8b417c8a462',
    registered_at: '2026-09-15 10:15:00 UTC',
  },
  {
    voter_id: 'VOTER005',
    name: 'Demonstration Account 05',
    email: 'voter005@election.demo',
    voter_hash: '6d1203a9870020d0f28e2030f25e7a912bb0e4cbb463138b2512fb7b6939b7bf',
    registered_at: '2026-09-15 10:20:00 UTC',
  },
];

const STORAGE_KEYS = {
  CHAIN: 'evote_blockchain_chain',
  SNAPSHOT: 'evote_blockchain_snapshot',
  VOTERS: 'evote_blockchain_voters',
};

/**
 * Creates the Genesis Block (Block #0)
 */
export async function createGenesisBlock(): Promise<Block> {
  const timestamp = '2026-09-20 00:00:00 UTC';
  const data: BlockData = {
    type: 'GENESIS',
    message: 'Genesis Block - Electronic Voting Ledger Initialization',
    candidate: 'N/A',
    voter_hash: 'GENESIS_ROOT_NO_VOTE',
    election_id: 'STUDENT_COUNCIL_2026',
  };
  const previousHash = '0';
  const hash = await calculateBlockHash(0, timestamp, data, previousHash);

  return {
    index: 0,
    timestamp,
    data,
    previous_hash: previousHash,
    hash,
  };
}

/**
 * Loads chain from storage or bootstraps Genesis
 */
export async function loadOrCreateChain(): Promise<Block[]> {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.CHAIN);
    if (raw) {
      const parsed: Block[] = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch {
    // ignore parse error and fallback
  }

  const genesis = await createGenesisBlock();
  const initialChain = [genesis];
  saveChain(initialChain);
  saveSnapshot(initialChain);
  return initialChain;
}

export function saveChain(chain: Block[]): void {
  localStorage.setItem(STORAGE_KEYS.CHAIN, JSON.stringify(chain));
}

export function saveSnapshot(chain: Block[]): void {
  localStorage.setItem(STORAGE_KEYS.SNAPSHOT, JSON.stringify(chain));
}

export function loadSnapshot(): Block[] | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.SNAPSHOT);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch {
    // fallback
  }
  return null;
}

export function loadVoters(): Voter[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.VOTERS);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch {
    // fallback
  }
  localStorage.setItem(STORAGE_KEYS.VOTERS, JSON.stringify(DEFAULT_VOTERS));
  return DEFAULT_VOTERS;
}

export function saveVoters(voters: Voter[]): void {
  localStorage.setItem(STORAGE_KEYS.VOTERS, JSON.stringify(voters));
}

/**
 * Checks if a voter with the specified voter_hash has already voted on the chain
 */
export function hasVoterVoted(chain: Block[], voterHash: string): boolean {
  for (let i = 1; i < chain.length; i++) {
    if (chain[i].data.voter_hash === voterHash) {
      return true;
    }
  }
  return false;
}

/**
 * Mines a new vote block and appends to the chain
 */
export async function mineVoteBlock(
  currentChain: Block[],
  voterId: string,
  candidate: string
): Promise<{ success: boolean; message: string; newBlock?: Block; updatedChain?: Block[] }> {
  const voterHash = await hashVoterId(voterId);

  // Duplicate Vote Prevention Check
  if (hasVoterVoted(currentChain, voterHash)) {
    return {
      success: false,
      message: 'Vote Already Recorded. Each verified voter may cast only one vote.',
    };
  }

  const latestBlock = currentChain[currentChain.length - 1];
  const nextIndex = latestBlock.index + 1;
  const now = new Date();
  const timestamp = now.toISOString().replace('T', ' ').substring(0, 19) + ' UTC';

  const voteData: BlockData = {
    type: 'VOTE_TRANSACTION',
    voter_hash: voterHash,
    voter_masked: `${voterHash.substring(0, 8)}...${voterHash.substring(voterHash.length - 6)}`,
    candidate,
    election_id: 'STUDENT_COUNCIL_2026',
    timestamp,
  };

  const currentHash = await calculateBlockHash(nextIndex, timestamp, voteData, latestBlock.hash);

  const newBlock: Block = {
    index: nextIndex,
    timestamp,
    data: voteData,
    previous_hash: latestBlock.hash,
    hash: currentHash,
  };

  const updatedChain = [...currentChain, newBlock];
  saveChain(updatedChain);
  saveSnapshot(updatedChain);

  return {
    success: true,
    message: 'Vote successfully recorded on the blockchain ledger.',
    newBlock,
    updatedChain,
  };
}

/**
 * Validates the entire blockchain cryptographic linkage
 */
export async function verifyBlockchain(chain: Block[]): Promise<VerificationResult> {
  const timestamp = new Date().toLocaleTimeString();

  if (!chain || chain.length === 0) {
    return {
      isValid: false,
      message: 'Blockchain Status: INVALID - Ledger contains no blocks.',
      failingBlockIndex: null,
      timestamp,
    };
  }

  // Verify Genesis block
  const genesis = chain[0];
  if (genesis.index !== 0 || genesis.previous_hash !== '0') {
    return {
      isValid: false,
      message: 'Blockchain Status: INVALID - Genesis block index or previous hash relationship is invalid.',
      failingBlockIndex: 0,
      timestamp,
    };
  }

  const genesisRecalculated = await calculateBlockHash(
    genesis.index,
    genesis.timestamp,
    genesis.data,
    genesis.previous_hash
  );

  if (genesis.hash !== genesisRecalculated) {
    return {
      isValid: false,
      message: `Blockchain Status: INVALID - Genesis block hash mismatch. Stored: ${genesis.hash.substring(0, 12)}... Calculated: ${genesisRecalculated.substring(0, 12)}...`,
      failingBlockIndex: 0,
      timestamp,
    };
  }

  // Verify subsequent blocks
  for (let i = 1; i < chain.length; i++) {
    const current = chain[i];
    const previous = chain[i - 1];

    // Check 1: Content integrity via hash recalculation
    const recalculated = await calculateBlockHash(
      current.index,
      current.timestamp,
      current.data,
      current.previous_hash
    );

    if (current.hash !== recalculated) {
      return {
        isValid: false,
        message: `Blockchain Status: INVALID - Block #${current.index} data was altered! Stored hash '${current.hash.substring(0, 16)}...' does not match calculated hash '${recalculated.substring(0, 16)}...'. Record modification changed the block hash and broke the chain integrity.`,
        failingBlockIndex: current.index,
        timestamp,
      };
    }

    // Check 2: Cryptographic previous_hash linkage
    if (current.previous_hash !== previous.hash) {
      return {
        isValid: false,
        message: `Blockchain Status: INVALID - Broken chain linkage at Block #${current.index}! previous_hash '${current.previous_hash.substring(0, 16)}...' does not match predecessor Block #${previous.index} hash '${previous.hash.substring(0, 16)}...'.`,
        failingBlockIndex: current.index,
        timestamp,
      };
    }
  }

  return {
    isValid: true,
    message: 'Blockchain Status: VALID - All block hashes and cryptographic linkages verified successfully.',
    failingBlockIndex: null,
    timestamp,
  };
}

/**
 * Calculates election vote tally from valid blocks
 */
export function calculateVoteTally(chain: Block[], candidates: Candidate[]) {
  const counts: Record<string, number> = {};
  candidates.forEach((c) => {
    counts[c.id] = 0;
  });

  let totalVotes = 0;
  for (let i = 1; i < chain.length; i++) {
    const cand = chain[i].data.candidate;
    if (cand && counts[cand] !== undefined) {
      counts[cand]++;
      totalVotes++;
    } else if (cand) {
      counts[cand] = (counts[cand] || 0) + 1;
      totalVotes++;
    }
  }

  const breakdown = candidates.map((c) => {
    const votes = counts[c.id] || 0;
    const percentage = totalVotes > 0 ? Number(((votes / totalVotes) * 100).toFixed(1)) : 0;
    return {
      candidate: c.name,
      candidateId: c.id,
      symbol: c.symbol,
      color: c.color,
      votes,
      percentage,
    };
  });

  return {
    totalVotes,
    breakdown,
    counts,
  };
}
