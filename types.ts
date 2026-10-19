export interface BlockData {
  type: 'GENESIS' | 'VOTE_TRANSACTION';
  message?: string;
  candidate?: string;
  voter_hash?: string;
  voter_masked?: string;
  election_id?: string;
  timestamp?: string;
  _tamper_flag?: boolean;
}

export interface Block {
  index: number;
  timestamp: string;
  data: BlockData;
  previous_hash: string;
  hash: string;
}

export interface Voter {
  voter_id: string;
  name: string;
  email: string;
  voter_hash: string;
  registered_at: string;
}

export interface Candidate {
  id: string;
  name: string;
  symbol: string;
  color: string;
  tagline: string;
  description: string;
}

export interface ElectionConfig {
  title: string;
  subtitle: string;
  election_id: string;
  election_status: string;
  voting_period: string;
  candidates: Candidate[];
}

export interface VerificationResult {
  isValid: boolean;
  message: string;
  failingBlockIndex: number | null;
  timestamp: string;
}

export interface TamperDetails {
  blockIndex: number;
  originalCandidate: string;
  fraudulentCandidate: string;
  storedHash: string;
  recalculatedHash: string;
}

export interface VoteReceipt {
  blockIndex: number;
  timestamp: string;
  candidate: string;
  voterId: string;
  voterHash: string;
  previousHash: string;
  currentHash: string;
}
