# Prompt Master Button

A one-click **✨ Prompt Master** button for Claude Code. Type a rough prompt, click the button, and it rewrites your draft into a clear, specific prompt right in the prompt box. Review it, edit if you like, and send.

The rewrite follows the method of the [prompt-master skill](https://github.com/nidhinjs/prompt-master) by Nidhin Joseph Nelson, adapted for a button whose target is always Claude.

## Install

At the prompt of a Claude Code terminal session:

```
/plugin install prompt-master --marketplace jessearagon86-hub/prompt-master-button
```

Answer `y` to add the marketplace, then pick a scope (user scope puts the button in every session).

From a shell:

```
claude plugin install prompt-master --marketplace jessearagon86-hub/prompt-master-button
```

In the Claude desktop app, where `/plugin` does not run: click **+** next to the prompt box, then **Plugins**, **Add marketplace** with `jessearagon86-hub/prompt-master-button`, then **Add plugin**.

Start a new session afterwards and the button appears above the prompt box.

## How to use it

1. Type a rough prompt in the prompt box.
2. Click **✨ Prompt Master** above the box. The strip shows "Polishing your prompt…" while it works.
3. Your draft is replaced with the rewrite. Read it, edit if needed, and send. **Undo rewrite** puts your original back.

If the app does not let the button read the prompt box, clicking it shows **Armed** instead. Press Enter to send as usual: your message is held back, and the polished version appears above the box with **Send**, **Edit in box**, **Send original** and **Discard**. Messages with attachments are sent as written.

## What the rewrite does

- Extracts the task, output format, constraints, context and success criteria, using the conversation so far to name things like "that file".
- Fixes common problems: vague verbs, no definition of done, missing format or length, no file boundaries, and no "stop and ask" rule for agentic work.
- Uses a structured brief (Objective, Context, Target State, Scope, Constraints, Acceptance Criteria, Action Boundaries) for bigger jobs; quick asks stay short.
- Keeps every concrete detail you wrote, strips any keys or passwords, and never adds requirements you did not ask for.

Each click makes one extra model call, billed to your session. The headings and `**bold**` markers in a rewrite are Markdown; the prompt box shows them as plain text, and Claude reads them as structure.

## License

MIT. See [LICENSE](LICENSE), which also carries the original prompt-master skill's MIT notice.
