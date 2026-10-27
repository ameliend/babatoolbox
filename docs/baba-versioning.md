# BABA versioning

Previously named **Proto History**. Version 0.1.4 changes the displayed name while retaining the extension identifier `proto-history-local.proto-history`, command IDs, settings keys and storage format. Install the new VSIX as an update: existing history, settings and shortcuts remain compatible.

Local version history for designers building prototypes in Visual Studio Code. Save a complete file state, explore the history, restore a previous step, or create an independent variant. The interface is in French. Figma export remains outside the extension.

## Install

Requires desktop VS Code **1.95 or later** and one trusted, local project folder.

1. Open the Extensions view in VS Code.
2. Open the **…** menu and choose **Install from VSIX…** (`Installer à partir du VSIX…`).
3. Select `baba-versioning-0.1.5.vsix` and reload if prompted.
4. Open your prototype folder. Select **BABA versioning** in the Activity Bar.

Alternatively, if the VS Code command-line launcher is available:

```sh
code --install-extension /absolute/path/to/baba-versioning-0.1.5.vsix
```

This is a locally packaged MVP, not a Marketplace publication. VS Code may ask you to trust its local publisher (`proto-history-local`). Installation through VSIX is supported by [VS Code's official extension management workflow](https://code.visualstudio.com/docs/configure/extensions/extension-marketplace#_install-from-a-vsix).

## Use

**Check the project folder first.** BABA versioning captures the folder opened in VS Code, not every file open in an editor tab. The sidebar shows the exact folder path. If the current file is outside that folder, excluded, or not saved yet, the sidebar warns you and saving/restoring requires an explicit decision to continue on the displayed folder. The warning remains when focus moves into the sidebar. To version a standalone prototype, use **Save As…** to save it and its required assets in a dedicated folder, then **File → Open Folder…** to open that folder. Do this before creating the first version. Restore updates that same folder in place; it does not reopen an unrelated editor file. Files absent from previous snapshots cannot be recovered from those snapshots.

**First save is opt-in.** Simply opening a project or this sidebar creates no history folder. Use **Sauvegarder une version** when you want the first snapshot. Cancelling this workflow leaves the new project without history. Regular editor saves do not create snapshots, even after history has been initialized.

**Save a version.** Select **Sauvegarder une version**, enter a name and optional description, and choose whether to add a PNG, JPEG or WebP thumbnail (maximum 5 MiB). No image is required. The same action is available as **BABA versioning: Sauvegarder une version** in the Command Palette. If included project files have unsaved editor changes, the extension asks to save them before proceeding. Untitled editors must first be saved into the project.

**Browse.** Each card shows the name, local date and time, description, file count and optional image. Search matches names and descriptions. Use **Actualiser l’historique** when another VS Code window has saved a version. **Afficher les fichiers** opens that version’s named folder in Finder/Explorer. The same action is available as **BABA versioning: Afficher les fichiers d’une version** in the Command Palette.

**Restore.** Choose **Restaurer** on a card or use the palette command. Read the confirmation and select **Sauvegarder puis restaurer**. The extension saves the current project as **Avant restauration — …** before changing any project files. It then restores included files and directories, recreates deleted files and removes files added since the selected version. Excluded files remain protected. To return to the previous state, restore the corresponding **Avant restauration** card. This restoration also creates its own safety version.

**Create a variant.** Choose **Créer une variante**, select a parent directory outside the source project, then enter a new folder name. The destination must not already exist. The version's included files are copied to that new folder; the original remains intact. You can open the result in a new window. Reinstall excluded dependencies and provide local environment configuration as needed. The variant starts with its own empty history.

Pause AI edits, development servers, build watchers and other writers while saving or restoring. The extension detects many concurrent changes and refuses unstable snapshots, but it cannot lock files against external tools. There is **no integration that automatically saves before AI changes**, no background autosave and no automatic screenshot capture.

## Exclusions and scope

Search Settings for **BABA versioning** or select the settings button in the sidebar.

`protoHistory.exclude` is an array of glob patterns relative to the project. Use `/` as the separator. Examples: `**/node_modules`, `private/**`, `**/*.tmp`. Matching includes hidden files and is case-insensitive for conservative protection. An excluded directory protects its entire subtree. Negation patterns (`!`) are rejected.

The default list excludes dependency folders (`node_modules`, `vendor`, `venv`, `.venv`, `bower_components`), common caches and generated outputs (`.next`, `.nuxt`, `.cache`, `.turbo`, `.parcel-cache`, `__pycache__`, `coverage`, `dist`, `build`, `out`), temporary files and common secret paths (`.env*`, `.npmrc`, `.pypirc`, `.netrc`, `.aws`, `.ssh`, `secrets*`, `credentials*`, private key files). **Customizing the array replaces the defaults**; retain the protections you need. If your prototype relies on authored files in `dist`, `build`, `out` or `vendor`, remove the corresponding exclusion before saving.

Exclusions are based on file names and paths, not content inspection. A password embedded in a source file is copied with that file. Snapshots are local and unencrypted; they are not a substitute for an external backup.

Some protections cannot be disabled: the root-level `versions/` storage folder, `.git`, `.hg`, `.svn`, `.proto-history`, `.proto-history-*`, symbolic links and non-regular filesystem objects. BABA versioning never invokes Git, changes Git settings or updates repository metadata. Restoring working files may naturally change the existing repository's working-tree status.

During restoration, the union of the **current exclusions and the target version's exclusions** is protected. This avoids deleting files that the old version never captured and avoids restoring files that have since become excluded. If replacing a directory with a file would affect excluded contents, the entire restore is refused before mutation.

`protoHistory.maxSnapshotSizeMB` defaults to 256 MiB. Versions are also limited to 20,000 included files and directories. Exceeding a limit aborts the save; it does not silently omit files. Change the size limit or narrow the scope through exclusions.

## Storage and recovery

The implementation uses **immutable local filesystem snapshots**, not an internal repository. This keeps the application independent of Git, avoids repository collisions and makes its file semantics directly testable. Starting with 0.1.2, storage lives in a **`versions` folder directly inside the open project**. From **0.1.5**, a new project gets this folder only when its **first explicit save succeeds**. Opening a workspace, the history sidebar, recovery or browsing commands, and saving a source file in VS Code do not initialize history. Cancelling a save dialog, declining to save dirty editors, cancelling capture or a capture error leaves no new `versions` folder. Existing histories are preserved; an empty directory made by an older release is not automatically deleted. No files are sent to a server.

```text
MyPrototype/
  proto1.html
  styles.css
  images/
  versions/
    Navigation validée/
      proto1.html
      styles.css
      images/
      .proto-history/       (hidden restoration metadata and optional thumbnail)
    Navigation validée (2)/
      proto1.html
      styles.css
      images/
      .proto-history/
    .proto-history.json     (storage marker)
    snapshots/              (older format, retained only for compatibility/backups)
```

Starting with **0.1.3**, each version is a real directory named after the version, containing the original files at their original relative paths. HTML stays HTML, CSS stays CSS, and scripts, images, other included files and empty directories are preserved. Unsafe folder-name characters are replaced, long folder names are shortened, and a suffix such as `(2)` resolves name collisions (including case-equivalent names). The version title in the extension is kept as entered. Existing files or folders are never overwritten during creation.

Use **Afficher les fichiers** on a version card to find its files, or **BABA versioning: Afficher le dossier des versions** for the complete history. For a static HTML prototype, open its existing `.html` file from the named directory. The extension preserves the bytes and relative links; it does **not** flatten a multi-file project into one HTML document or convert React, Vue, TSX, Python, server-side code or other source formats into static HTML. Projects requiring a build step or a server still require that environment. Absolute URLs, backend services and resources outside the project are not made self-contained.

Each named directory is the saved version itself, not an editable export mirror. Use **Créer une variante** to edit an independent copy; avoid manually editing, renaming or deleting the saved directory or its hidden metadata. SHA-256 checks in the manifest detect changed file contents before restoration. New versions use ordinary independent file copies: no hard links, compression, deduplication, automatic retention pruning or second blob copy is created for them.

The root `versions` folder is always excluded from capture and protected during restoration, even when custom exclusions are empty. It is also omitted when creating a variant. An ordinary nested asset folder such as `assets/versions` is still included. Do not edit the storage files manually or delete `versions` unless you intend to discard that project's history. Close the project's VS Code windows before moving or copying the whole project, including `versions`; its history then travels with it and is available in other local VS Code profiles. Independent variants start with an empty history.

If a file, folder (even empty), or symbolic link named `versions` already exists and is not recognized as BABA versioning storage, the extension stops with an explanation. Its contents are left intact. Rename or move that existing item, then refresh the history. The extension also refuses to open its own storage as a project.

**Upgrade from 0.1.0 / 0.1.1.** Install 0.1.5 and reload every VS Code window that uses the project. At the first opening, the extension looks up that project's old history in [VS Code's `ExtensionContext.globalStorageUri`](https://code.visualstudio.com/api/references/vscode-api#ExtensionContext). Only when actual saved versions or a pending recovery journal exist does it copy the versions, thumbnails and any pending recovery journal into a staging folder inside the project, verifies the copied file hashes, and publishes `versions` only after the entire import succeeds. Version IDs, names, dates and descriptions are preserved. The original internal history is retained as a backup and is no longer updated; no manual move is needed. Reopening an existing local history does not import the same old versions again. Perform this upgrade before renaming or moving a project whose history is still in the old path-based storage. Only the current VS Code profile's old storage is consulted.

A failed or interrupted import does not publish a partial local history or change the prototype files. The original history remains in its previous location; retry after resolving the reported cause (for example, insufficient disk space or a damaged old version). Interrupted staging directories are cleaned at the next initialization. A pending restoration is migrated with its safety version and still requires recovery before further saves or restores. Keep all project windows on 0.1.5 after upgrading; earlier extension versions do not understand the named-folder format, and 0.1.0/0.1.1 do not protect the project-local `versions` folder.

**Upgrade from 0.1.2 / readable-folder conversion.** Existing schema-1 snapshots in `versions/snapshots` are copied into named folders at first opening. Names, dates, descriptions, IDs, file bytes, thumbnails and safety/recovery references are preserved. Conversion is published atomically per version; the original blob snapshots remain intact as compatibility backups. These retained old copies take additional disk space. A failed conversion leaves that old version listed and usable in the old format, displays an explanation, and can be retried with **Afficher les fichiers** or after reopening. Successfully converted IDs appear only once in the history. The new copies are not rewritten on subsequent openings.

A save is written to a private staging directory. Files are hashed, the source tree is checked again, and the manifest and file data are flushed before the version directory is atomically published. For a first save, the complete storage directory is published together with the successful snapshot. Cancelled or failed first saves clean their staging directory. An abrupt process termination can leave a hidden `.proto-history-init-*` directory and lock; read-only opening leaves these untouched, and the next explicit save reclaims the dead lock and cleans staging. Incomplete stages in an existing history are ignored and cleaned on the next operation. Existing versions are not rewritten. Damaged manifests are reported without hiding other versions; restore validates all target file hashes first.

A project-level operation lock prevents overlapping operations by this extension in multiple windows. A dead process's lock is reclaimed. Before restoration, a safety version and durable recovery journal are written. Files are replaced using temporary files and per-file renames. Ordinary errors trigger a rollback. If VS Code or the extension process stops abruptly, a recovery message appears when the project reopens. Choose **Récupérer l’état précédent**; the confirmation explains the action, a further **Avant récupération** version preserves any subsequent changes, and the original safety version is restored. Normal mutations remain blocked until recovery completes. Current exclusions are still respected during recovery.

The operation is **not a single atomic filesystem transaction**: an interrupted project can temporarily contain a mixed state until recovery. Keep tools that write to the project paused throughout recovery. Versions remain persistent after VS Code closes. File data and journals are flushed, but no guarantee is made against disk failure, filesystem corruption, OS power-loss behavior or uncooperative external writers.

## MVP boundaries

- One trusted local folder only. Multi-root, SSH, containers, WSL and virtual workspaces receive an explicit explanation and are not supported.
- Regular files, their bytes and executable permission bits, and included directories are captured. Symlinks are preserved in place but not versioned. File timestamps, ownership, ACLs, extended attributes and directory permission bits are not restored.
- Excluded dependencies, generated files, credentials and any resources outside the project must be supplied separately. A variant contains only the saved, included scope.
- Thumbnails are optional user-selected images. An unavailable image does not prevent restore. There is no browser capture or Figma integration.
- History is stored in the project’s `versions` folder and follows a complete project move/copy. No sync, telemetry, analytics, network request, retention UI or version deletion is implemented.
- The sidebar follows VS Code theme colors, uses native buttons, explicit accessible names, visible keyboard focus and live status messages. This is not a claim of WCAG/RGAA conformance; screen-reader and cross-platform audits remain to be performed.

## Build and test

Use Node.js 20.19+ (Node 24 was used for this delivery).

```sh
npm ci
npm test
npm run build
npm run package
```

`npm run package` creates `../baba-versioning-0.1.5.vsix` using the [official `@vscode/vsce` packaging tool](https://code.visualstudio.com/api/working-with-extensions/publishing-extension#packaging-extensions). The runtime is bundled: end users do not need Node.js, npm, Git or separate dependencies.

Press F5 from this source folder to launch an Extension Development Host. For an automated Extension Host smoke test:

```sh
npm run test:integration
```

By default, `@vscode/test-electron` downloads a compatible VS Code. To use an installed copy, set `VSCODE_EXECUTABLE_PATH` to its application executable. The test uses isolated temporary user-data and extension directories. See `TESTING.md` for the exact validation performed for this delivery.

The sidebar uses the official [`WebviewViewProvider` API](https://code.visualstudio.com/api/references/vscode-api#WebviewViewProvider), a restrictive content security policy, external local scripts, text-only DOM insertion for user labels and scoped local resources, following the [official Webview security guidance](https://code.visualstudio.com/api/extension-guides/webview#security).
