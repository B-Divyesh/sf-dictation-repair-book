/**
 * Native sample work is deliberately memory-only. Keeping this policy in one
 * small module makes every destructive boundary explicit and testable.
 */
export function mayTouchRealNativeData(nativeSampleMode: boolean): boolean {
  return !nativeSampleMode;
}
