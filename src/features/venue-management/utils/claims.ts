/**
 * Persistent helper for tracking pending venue claims locally in addition to the backend claims API.
 */
const PENDING_CLAIMS_KEY = "barhuddle_pending_claims";

export function addPendingClaimId(venueId: string | number) {
  if (typeof window === "undefined" || !venueId) return;
  try {
    const idStr = String(venueId).trim();
    if (!idStr) return;
    const raw = localStorage.getItem(PENDING_CLAIMS_KEY) || "[]";
    const ids: string[] = JSON.parse(raw);
    if (!ids.includes(idStr)) {
      ids.push(idStr);
      localStorage.setItem(PENDING_CLAIMS_KEY, JSON.stringify(ids));
    }
    // Dispatch event so all components in current window react immediately
    window.dispatchEvent(new CustomEvent("barhuddle_claim_submitted", { detail: { venueId: idStr } }));
  } catch (err) {
    console.error("Failed to save pending claim to localStorage:", err);
  }
}

export function recordVenueClaimed(venue: any) {
  if (!venue) return;
  if (venue.id) addPendingClaimId(venue.id);
  if (venue._id) addPendingClaimId(venue._id);
  if (venue.placeId) addPendingClaimId(venue.placeId);
  const name = venue.name || venue.title;
  if (name && typeof name === "string" && name.trim()) {
    addPendingClaimId(`name:${name.trim().toLowerCase()}`);
  }
}

export function getPendingClaimIds(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(PENDING_CLAIMS_KEY) || "[]";
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed.map(String) : [];
  } catch {
    return [];
  }
}

export function isVenuePending(
  venueId?: string | number,
  additionalPendingIds?: Set<string> | string[]
): boolean {
  if (!venueId) return false;
  const idStr = String(venueId).trim();
  if (!idStr) return false;

  if (additionalPendingIds) {
    if (additionalPendingIds instanceof Set) {
      if (additionalPendingIds.has(idStr)) return true;
    } else if (Array.isArray(additionalPendingIds)) {
      if (additionalPendingIds.includes(idStr)) return true;
    }
  }

  const localIds = getPendingClaimIds();
  return localIds.includes(idStr);
}

