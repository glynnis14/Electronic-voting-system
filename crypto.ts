/**
 * Cryptographic utilities implementing standard SHA-256
 * Computes deterministic SHA-256 matching Python's hashlib.sha256
 */

/**
 * Deterministically sorts object keys to match Python's json.dumps(data, sort_keys=True)
 */
export function stringifySorted(obj: unknown): string {
  if (obj === null || typeof obj !== 'object') {
    return JSON.stringify(obj);
  }
  if (Array.isArray(obj)) {
    return '[' + obj.map(stringifySorted).join(',') + ']';
  }
  const keys = Object.keys(obj as Record<string, unknown>).sort();
  const pairs = keys.map(
    (key) => JSON.stringify(key) + ':' + stringifySorted((obj as Record<string, unknown>)[key])
  );
  return '{' + pairs.join(',') + '}';
}

/**
 * Computes the SHA-256 hex string using the browser Web Crypto API
 */
export async function sha256(message: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(message);
  const hashBuffer = await window.crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
}

/**
 * Computes the SHA-256 hash of a block structure:
 * SHA256(index + timestamp + stringifySorted(data) + previous_hash)
 */
export async function calculateBlockHash(
  index: number,
  timestamp: string,
  data: unknown,
  previousHash: string
): Promise<string> {
  const dataString = stringifySorted(data);
  const blockString = `${index}${timestamp}${dataString}${previousHash}`;
  return sha256(blockString);
}

/**
 * Computes the SHA-256 hash of a voter identifier
 * SHA256(voter_id.trim().toUpperCase())
 */
export async function hashVoterId(voterId: string): Promise<string> {
  const clean = voterId.trim().toUpperCase();
  return sha256(clean);
}
