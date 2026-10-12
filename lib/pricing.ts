/** Internal pricing model. Per-activity prices are NEVER shown to guests —
 *  the builder only ever displays the single recalculated total. */

export type TierId = "silver" | "gold" | "platinum";

/** Base USD per day for 2 guests, per tier. */
export const TIER_DAY_RATES: Record<TierId, number> = {
  silver: 170,
  gold: 280,
  platinum: 460,
};

export function estimateTotal(
  tier: TierId,
  days: number,
  destinationCount: number,
  activityCount: number
): number {
  const base = TIER_DAY_RATES[tier] * Math.max(days, 1);
  // Internal weighting only — never exposed per item.
  const internal = destinationCount * 14 + activityCount * 9;
  const total = base + internal;
  return Math.round(total / 10) * 10;
}

export function estimateFrom(tier: TierId, days = 7): number {
  return estimateTotal(tier, days, 5, 10);
}
