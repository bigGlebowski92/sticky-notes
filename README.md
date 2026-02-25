# Sticky Notes (React + TypeScript)

Single-page desktop web app for sticky notes built with React, TypeScript, and Vite.

## Run locally

```bash
npm install
npm run dev
```

Production build:

```bash
npm run build
npm run preview
```

## Implemented features

- Create notes from the top `Add note` button.
- Move notes by dragging the top handle.
- Resize notes by dragging the bottom-right corner.
- Remove notes by dragging them over the predefined trash zone.
- Edit note text.
- Bring note to front on interaction (z-index management).

## Architecture

The app uses a layered, feature-based structure: `app`, `pages`, `widgets`, `entities`, `features`, and `shared`. The `entities/note` layer contains the core note domain model (`Note` type, note defaults, and note state hook) plus the base `NoteCard` UI. This keeps business state and entity representation in one coherent module with strict static typing.

The `widgets` layer composes entity UI into larger blocks. `NotesBoard` is responsible for board-level behavior (trash zone detection and drop handling), while `NotesList` renders note cards and delegates note events. The `features` layer contains focused user interaction elements such as `add-note` (`AddNoteButton`), and `pages/home` orchestrates feature and widget wiring for the main screen.

State is managed locally in the note entity hook using immutable updates. This keeps updates predictable, avoids unnecessary complexity for the current scope, and provides a clean path for future additions like persistence (localStorage/API) without changing the UI composition.
