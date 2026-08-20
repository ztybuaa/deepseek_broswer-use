import type { Context } from '@deepseek-ai/cordis'

/** Cordis plugin name used by loader diagnostics. */
export const name = 'browser-use'

/** The tool registry the plugin registers into. */
export const inject = ['tools']

/**
 * Mount the browser-use plugin. T1 registers no tools yet; the contract here
 * is only that the plugin mounts into a live context and tears down cleanly.
 */
export function apply(ctx: Context): void {
  // Tools arrive in later tickets (T3-T6).
}
