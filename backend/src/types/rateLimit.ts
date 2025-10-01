export interface RateLimitOptions {
  /** Maximum number of requests allowed within the window */
  limit?: number;
  /** Time window in seconds */
  window?: number;
  /** Redis key prefix for rate limit storage */
  prefix?: string;
  /** Header key to extract machine ID from */
  headerKey?: string;
  /** Whether to require machine ID or allow fallback to IP */
  requireMachineId?: boolean;
  /** Skip rate limiting entirely */
  bypass?: boolean;
  /** Fail closed (reject) or fail open (allow) on Redis errors */
  failClosed?: boolean;
}
