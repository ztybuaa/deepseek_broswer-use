import type { Context } from '@deepseek-ai/cordis'
import z from '@deepseek-ai/schemastery'
import { BrowserSessionManager } from './session.ts'

/** Cordis plugin name used by loader diagnostics. */
export const name = 'browser-use'

/** The tool registry the plugin registers into. */
export const inject = ['tools']

/** Plugin configuration. Invalid values fail plugin load. */
export interface Config {
  /** Launch browsers headless when true; default is a visible window. */
  headless: boolean
  /** Path to a system browser executable. Omit to use Playwright's bundled chromium. */
  executablePath?: string
  /** Navigation timeout in milliseconds. */
  timeoutMs: number
}

/** Schemastery schema validating {@link Config}; deployment-varying fields default here. */
export const Config: z<Config> = z.object({
  headless: z.boolean().default(false),
  executablePath: z.string(),
  timeoutMs: z.number().default(30000),
})

/**
 * Mount the browser-use plugin: create the per-agent session manager and make
 * sure its live browser processes never outlive the plugin. Tools arrive in
 * later tickets (T3-T6).
 */
export function apply(ctx: Context, config: Config): void {
  const manager = new BrowserSessionManager({
    headless: config.headless,
    timeoutMs: config.timeoutMs,
    ...(config.executablePath !== undefined ? { executablePath: config.executablePath } : {}),
  })
  // Teardown is fire-and-forget so plugin unload never blocks on browser shutdown.
  ctx.effect(() => {
    return () => {
      void manager.dispose()
    }
  })
}
