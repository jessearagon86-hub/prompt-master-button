/** What the band above the prompt shows. */
export type PromptMasterMode = 'idle' | 'working' | 'armed' | 'preview'

/** A rewrite waiting for the person's say-so. */
export type PromptMasterPreview = {
  /** The rough prompt as the person wrote it. */
  original: string
  /** The rewritten prompt. */
  improved: string
  /** True when the mod held back a sent prompt; false when the draft is still in the box. */
  isHeld: boolean
  /** Why the rewrite failed; `improved` then holds the original. */
  failure?: string
}

declare module 'claude-code' {
  interface PluginState {
    'prompt-master': {
      mode: PromptMasterMode
      undo: string | null
      preview: PromptMasterPreview | null
    }
  }
}
