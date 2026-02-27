import type { Note } from './types';

export const NOTES_STORAGE_KEY = 'sticky-notes:v1';

function isValidNote(value: unknown): value is Note {
  if (!value || typeof value !== 'object') return false;
  const candidate = value as Partial<Note>;
  return (
    typeof candidate.id === 'string' &&
    typeof candidate.text === 'string' &&
    typeof candidate.color === 'string' &&
    typeof candidate.x === 'number' &&
    Number.isFinite(candidate.x) &&
    typeof candidate.y === 'number' &&
    Number.isFinite(candidate.y) &&
    typeof candidate.width === 'number' &&
    Number.isFinite(candidate.width) &&
    typeof candidate.height === 'number' &&
    Number.isFinite(candidate.height) &&
    typeof candidate.zIndex === 'number' &&
    Number.isFinite(candidate.zIndex)
  );
}

export function loadNotesFromStorage(fallback: Note[]): Note[] {
  if (typeof window === 'undefined') return fallback;
  try {
    const storage = window.localStorage;
    if (typeof storage.getItem !== 'function') return fallback;
    const raw = storage.getItem(NOTES_STORAGE_KEY);
    if (!raw) return fallback;

    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return fallback;

    const validNotes = parsed.filter(isValidNote);
    if (validNotes.length === parsed.length) return validNotes;
    return validNotes.length > 0 ? validNotes : fallback;
  } catch {
    return fallback;
  }
}

export function saveNotesToStorage(notes: Note[]): void {
  if (typeof window === 'undefined') return;
  try {
    const storage = window.localStorage;
    if (typeof storage.setItem !== 'function') return;
    storage.setItem(NOTES_STORAGE_KEY, JSON.stringify(notes));
  } catch {
    // Ignore persistence failures (private mode, quota exceeded, etc.).
  }
}
