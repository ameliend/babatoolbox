# Baba Select

Select a component in an **already-open VS Code Integrated Browser** and attach its context file to the current **Codex** composer. No prompt is sent. No second preview or chat is created. UI labels are French.

## Requirements

- Desktop VS Code **1.143 or later** (developed against 1.143.1).
- Built-in JavaScript Debugger (`ms-vscode.js-debug`; tested environment: 1.140.0).
- Official Codex (`openai.chatgpt`; tested environment: 26.1021.22027), exposing `chatgpt.addFileToThread`.
- A trusted, local workspace and an already-open Integrated Browser tab using `file://`, `localhost`, `127.0.0.1` or `::1`.
- Simple HTML/CSS/JavaScript prototypes. Other preview extensions, remote workspaces and framework source maps are not supported.

These are the verified development versions, not a guarantee for every later release. Check VALIDATION.md for actual test results.

## Install and use

1. In VS Code, run **Extensions: Install from VSIX…**, then select `baba-select-0.2.1.vsix`.
2. Keep your existing preview and Codex conversation open. Focus the intended Codex conversation first if you have several panels.
3. Click **Baba Select** in the status bar, or run **Baba Select : sélectionner un élément**. If the debugger asks for a target, choose the **existing preview tab**. Do not choose “Open new…”.
4. Hover (yellow dashed border), then click (blue solid border). The click creates/updates `baba-select-context.md` in VS Code's extension storage and invokes Codex's official file-context command.
5. Use **Parent ↑** repeatedly to move from a nested text span to its button, card, then section. Intermediate wrappers are real DOM parents.
6. Press **Escape** or **Terminer** to restore normal navigation. Confirm the file chip is visible in Codex, then write your request in the same composer and send it yourself.

Keyboard: Tab to the selection area; Up moves to the parent, Down to the first child, Left/Right to siblings. Enter/Space attaches the focused candidate. Tab also reaches the toolbar buttons, with a visible focus outline. Escape exits selection mode.

## Edit the original file in place

The context now requests **one existing file only**: the verified HTML source of the selected preview, identified by its exact path. It asks Codex to preserve unrelated changes and forbids copies, variants, backups, new files, renaming or moving the source. The context Markdown and linked CSS paths are not additional edit targets.

If the source cannot be verified, there are unsaved changes, or another file such as an external stylesheet is needed, the context tells Codex to ask before editing. It also forbids moving code or inlining external CSS/JavaScript as a workaround. An explicit subsequent user request can authorize a wider scope.

“Source” means the verified file serving the selected preview, not an arbitrary last-focused code tab. Baba Select never guesses that an unrelated open editor belongs to the preview.

This is an instruction in the attached context, **not a filesystem write restriction**: Codex's public add-file command does not provide a per-attachment write allowlist. No AI request is sent and no existing chat history or draft is rewritten. After upgrading, reload extensions and re-select a component to attach the new instruction. Existing sent attachments remain historical context.

## Automatic preview refresh

Starting Baba Select also connects automatic refresh to the same local `file://` preview. After Codex saves a linked CSS or JavaScript file inside the trusted workspace, Baba Select waits 800 ms to group edits and reloads that tab. It neither saves buffers nor edits the prototype. Escape/Terminer removes the picker while keeping the debugger connection for refresh; the status bar then reads **Baba Select · actualisation auto**.

HTML refresh uses VS Code's native `workbench.browser.autoReloadOnFileChange` setting (enabled by default in the tested version). Its watcher tracks the page file, not separate CSS/JavaScript files; Baba Select supplies the latter. A full reload resets transient page state. Re-select a component after an edit if you want fresh context.

Run **Baba Select : arrêter la sélection et l’actualisation automatique** to disconnect. To disable this behavior persistently, turn off `babaSelect.autoReload` in Settings. The extension does not write any project or user settings.

Refresh is restricted to observed stylesheet/script resource URLs inside the workspace. CSS imports and modules are included when exposed through CSSOM or browser Resource Timing. Unrelated files, dirty editor buffers, remote URLs and symlink escapes do not trigger a reload. File deletions, unobserved dynamic resources, images and framework build pipelines are outside this feature. For `http://localhost` previews, use the existing development server's live reload; Baba Select does not infer file-to-route mapping or launch another server. Refresh starts when you connect Baba Select; reconnect after VS Code restarts. Navigation to a different page stops the watcher at its next attempted refresh.

## Replace and remove

A new selection updates the **same workspace context file**, then invokes the official add-file command again. The currently selected component is the only target in that file. Codex controls attachment deduplication and file consumption; check the chip and use **Baba Select : consulter le fichier de contexte** before sending if needed.

**Retirer** clears the target from the context file. For complete removal, remove the `baba-select-context.md` chip using Codex's own remove control. There is **no documented Codex API for removing an attachment or reading back the active composer state**. Baba Select does not automate Codex UI to work around this limitation. It cannot retract context already sent in an earlier message, nor modify an already-running request.

## Context and reliability

The file records the selected DOM instance, HTML (up to 24,000 characters), its parent, unique selector and observed match count, useful identifiers/classes, matching CSSOM rules, stylesheet URLs and computed values. Source lines are emitted only after an exact normalized subtree comparison at the same structural DOM path in a saved local HTML file. Dirty editors, dynamic changes and HTTP routing do not receive invented locations.

CSS URLs are observed in the browser; local CSS file paths are included only if their real path is inside the workspace. CSS source lines and cascade winners are not guessed. Media/support/container/layer conditions are retained as context, not claimed to be active. Cross-origin stylesheets can be unavailable. Shared classes do not imply that every matching element should change.

## Limitations and safety

- Selection is limited to the top document. Iframes can be selected as containers, but their contents are not inspected. Shadow DOM internals, pseudo-elements, canvas objects and React/Vue component boundaries are outside the MVP.
- Re-select after navigation, reload, DOM changes or source edits. The context is a snapshot. No claim is made about the historical origin of an identical dynamically generated node.
- Runtime instrumentation is inserted only in memory via the official debugger/DAP. Source files, settings and `launch.json` are not modified. Exiting selection/disconnecting removes the overlay; a watchdog removes it if the extension stops polling for ten seconds.
- A transparent selection surface intercepts pointer events and blocks underlying controls. Pre-existing global capture listeners can observe events; complex application event systems are not comprehensively supported.
- Debugging can interact with existing breakpoints and may display VS Code's debug toolbar. Do not use this MVP in parallel with another debugger attached to the same tab.
- Page messages have a per-session nonce, size/type/URL checks and monotonic revisions. File reads use realpath containment and size/extension limits. Page text is treated as untrusted data. Trusted page code can still interfere with its own runtime; this is not isolation from malicious trusted code.
- Context is stored locally, contains HTML/CSS excerpts, and remains in VS Code workspace storage until removed by the user or VS Code. No remote service, telemetry or paid API is added. Codex's own data handling applies when you send your request.
- Automatic context removal and end-to-end receipt by the AI cannot be inferred from successful command execution. The extension reports transmission to the Codex command, not a verified AI response.

## Build

Use Node.js 22+ and npm:

```sh
npm ci
npm run check
npm test
npm run package
```

The VSIX bundles runtime dependencies; no npm installation is needed to use it.

## Official integration references

- [Codex extension commands](https://learn.chatgpt.com/docs/developer-commands?surface=ide#extension-commands): `chatgpt.addFileToThread` adds a file to the current chat.
- [VS Code Integrated Browser debugging and native file refresh](https://code.visualstudio.com/docs/debugtest/integrated-browser)
- [VS Code debug API](https://code.visualstudio.com/api/references/vscode-api#debug)
- [JavaScript debugger launch/attach options](https://github.com/microsoft/vscode-js-debug/blob/main/OPTIONS.md)
- [DAP evaluate request](https://microsoft.github.io/debug-adapter-protocol/specification#Requests_Evaluate)

Only stable VS Code APIs and the documented Codex command are used. The built-in debugger owns the connection to the browser; Baba Select does not use VS Code's proposed browser-tab API.
