import { expect, mock, test } from 'claude-code/testing'

const BAND = {
  plugin: 'prompt-master',
  component: 'AbovePrompt',
  requestId: 'above-prompt',
  props: {
    hasSurvey: false,
    isCollapsed: false,
    isWorking: false,
    maxRows: 12,
    bodyColumns: 80,
    scroll: { offset: 0, bodyRows: 12 },
    view: {},
  },
} as const

const USAGE = {
  input_tokens: 0,
  output_tokens: 0,
  cache_read_input_tokens: 0,
  cache_creation_input_tokens: 0,
}

test('the button rewrites the draft in the box, then offers Undo', async ($, on) => {
  const clock = mock.clock(on)
  let box = 'fix teh login bug in that file'
  const filled: string[] = []

  on('prompt.read', () => ({ value: { text: box, cursor: box.length } }))
  on('prompt.fill', (_, e) => {
    filled.push(e.text)
    box = e.text
    return { isFilled: true }
  })
  on('model.fork', () => ({
    value: {
      isAnswered: true,
      text: '<prompt>Fix the login bug in src/auth/login.ts.</prompt>',
      usage: USAGE,
    },
  }))
  on('ui.toast', () => ({ value: undefined }))

  for (const surface of ['terminal', 'desktop'] as const) {
    box = 'fix teh login bug in that file'
    filled.length = 0

    const ui = await $.ui.mount({ ...BAND, surface })
    expect((await ui.find({ key: 'pm-run' }))?.type).toBe('Button')

    await ui.press({ key: 'pm-run' })
    await clock.advance(5)
    expect(filled).toEqual(['Fix the login bug in src/auth/login.ts.'])
    expect(await ui.find({ key: 'pm-undo' })).toBeDefined()

    await ui.press({ key: 'pm-undo' })
    expect(box).toBe('fix teh login bug in that file')
    expect(await ui.find({ key: 'pm-undo' })).toBeUndefined()
    await ui.unmount()
  }
})

test('with no readable draft it arms; Cancel disarms; a plugin prompt passes untouched', async ($, on) => {
  const clock = mock.clock(on)
  const sent: string[] = []

  on('prompt.read', () => ({ value: { text: '', cursor: 0 } }))
  on('ui.toast', () => ({ value: undefined }))
  on('prompt.submit', (_, e) => {
    sent.push(e.text)
    return { text: e.text }
  })

  for (const surface of ['terminal', 'desktop'] as const) {
    sent.length = 0
    const ui = await $.ui.mount({ ...BAND, surface })

    await ui.press({ key: 'pm-run' })
    await clock.advance(5)
    expect(await ui.find({ key: 'pm-disarm' })).toBeDefined()

    // Only a person's own send is held; a prompt another plugin sends goes through.
    await $.prompt.submit({ text: 'from another plugin' })
    expect(sent).toEqual(['from another plugin'])

    await ui.press({ key: 'pm-disarm' })
    expect(await ui.find({ key: 'pm-run' })).toBeDefined()
    await ui.unmount()
  }
})

test('a failed rewrite leaves the draft alone', async ($, on) => {
  const clock = mock.clock(on)
  const filled: string[] = []

  on('prompt.read', () => ({ value: { text: 'draft', cursor: 5 } }))
  on('prompt.fill', (_, e) => {
    filled.push(e.text)
    return { isFilled: true }
  })
  on('model.fork', () => ({ value: { isAnswered: false, reason: 'nothing-to-fork', usage: USAGE } }))
  on('model.complete', () => ({
    value: { isAnswered: false, reason: 'api-error', status: 529, error: 'overloaded_error', usage: USAGE },
  }))
  on('ui.toast', () => ({ value: undefined }))

  const ui = await $.ui.mount({ ...BAND, surface: 'desktop' })
  await ui.press({ key: 'pm-run' })
  await clock.advance(5)
  expect(filled).toEqual([])
  expect(await ui.find({ key: 'pm-run' })).toBeDefined()
  await ui.unmount()
})
