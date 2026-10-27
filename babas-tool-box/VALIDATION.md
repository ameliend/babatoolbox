# Validation — Baba's tool box

27 October 2026. Local website only; public deployment is blocked by workspace hosting availability.

## File and HTTP checks

- All seven unique local linked assets exist and respond with HTTP 200 on the loopback preview server.
- Each HTTP response is byte-identical to its local source file.
- Both VSIX downloads are byte-identical to the originals, have valid ZIP structures and contain the expected manifest versions: Baba Select 0.2.1 and BABA versioning 0.1.5.
- The 20 HTML IDs are unique; all fragment links resolve to existing IDs.
- JavaScript syntax passes `node --check`.
- Packaged text was checked for local user-home paths before inclusion; no such paths were found in the two VSIX packages.

## Real website interaction checks

After removing the interactive demos, the current guide was inspected through browser controls in the in-app browser on macOS:

- Both tutorial panels contain the requested updated text; neither contains an interactive demo.
- The navigation link opens the guide section.
- ArrowRight switches from Baba Select to BABA versioning, updating the visible panel, selected tab and keyboard focus.
- No JavaScript warnings or errors were reported during these checks.

The earlier selection/history demo tests apply only to the previous site revision. Both demos and their event handlers have now been removed.

## Responsive and visual checks

- Desktop and narrow-panel layouts were inspected visually in the browser.
- A complete mobile page screenshot was inspected at a 390 px viewport.
- Horizontal overflow checks passed at 320, 390 and 1440 px viewport widths after correcting the decorative hero circle on narrow screens.
- Viewport overrides were reset after testing.
- A final screenshot is supplied separately as `babas-tool-box-preview.jpg`.
- Native buttons/links, accessible tab semantics, live status messages, decorative SVG hiding, focus indicators and reduced-motion handling are implemented. This is not a full screen-reader or WCAG/RGAA conformance audit.

These checks exercise the showcase website. They do not constitute new end-to-end validation of either extension inside VS Code, or proof that Codex has received a selected component. Extension-specific limitations remain in the supplied documentation.

## Publishing limitation

The Sites connector returned `sites_access_disabled`: Sites is not enabled for this workspace. The hosting plugin directory also reported administrator-disabled hosting integrations. No public deployment exists. Public HTTP responses, hosting headers and production download behavior therefore remain unverified. The downloadable ZIP contains all static files and both installers for later deployment through an approved host.

## Requested content cleanup

Removed the two section asides, the entire FAQ section, and the four requested resource links from the showcase. Removed the link to the deleted FAQ and its JavaScript handler. After the change, the local HTTP/link checks and JavaScript syntax check passed; the updated page and footer were inspected in the browser, with no console warnings or errors reported. The updated footer screenshot is supplied separately as `babas-tool-box-cleaned.jpg`. The interactive demo checks above were performed before this text-only cleanup; the demos have since been removed in the guide revision below.

## Guide revision

Removed both interactive demos and adjusted the guide to a single readable column. Updated Baba Select’s status-bar position, added the left-sidebar clock/arrow icon and save action to the versioning instructions, and removed the two requested versioning paragraphs. Updated JavaScript syntax, local HTTP assets, fragment links and unchanged installer bytes were verified. The current guide screenshot is supplied separately as `babas-tool-box-guide.jpg`.
