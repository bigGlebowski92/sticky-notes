import { act, renderHook } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import {
  BASE_Z_INDEX,
  DEFAULT_NOTE_COLOR,
  DEFAULT_NOTE_HEIGHT,
  DEFAULT_NOTE_WIDTH,
  Z_INDEX_STEP,
} from './constants';
import type { Note } from './types';
import { useNotes } from './useNotes';

function createNote(id: string, zIndex = 1): Note {
  return {
    id,
    text: '',
    color: DEFAULT_NOTE_COLOR,
    x: 10,
    y: 20,
    width: DEFAULT_NOTE_WIDTH,
    height: DEFAULT_NOTE_HEIGHT,
    zIndex,
  };
}

describe('useNotes', () => {
  it('adds a note with default shape and increments z-index', () => {
    const existing = createNote('existing', 3);
    const { result } = renderHook(() => useNotes([existing]));

    act(() => {
      result.current.addNote(100, 200);
    });

    expect(result.current.notes).toHaveLength(2);
    const created = result.current.notes[1];

    expect(created).toMatchObject({
      text: '',
      color: DEFAULT_NOTE_COLOR,
      x: 100,
      y: 200,
      width: DEFAULT_NOTE_WIDTH,
      height: DEFAULT_NOTE_HEIGHT,
      zIndex: existing.zIndex + Z_INDEX_STEP,
    });
    expect(typeof created.id).toBe('string');
    expect(created.id.length).toBeGreaterThan(0);
  });

  it('starts with base z-index when adding first note', () => {
    const { result } = renderHook(() => useNotes());

    act(() => {
      result.current.addNote(0, 0);
    });

    expect(result.current.notes[0].zIndex).toBe(BASE_Z_INDEX + Z_INDEX_STEP);
  });

  it('updates and removes notes by id', () => {
    const first = createNote('first', 1);
    const second = createNote('second', 2);
    const { result } = renderHook(() => useNotes([first, second]));

    act(() => {
      result.current.updateNote('first', { text: 'Updated text', x: 77 });
    });
    act(() => {
      result.current.removeNote('second');
    });

    expect(result.current.notes).toHaveLength(1);
    expect(result.current.notes[0]).toMatchObject({
      id: 'first',
      text: 'Updated text',
      x: 77,
    });
  });

  it('brings selected note to front', () => {
    const low = createNote('low', 1);
    const high = createNote('high', 9);
    const { result } = renderHook(() => useNotes([low, high]));

    act(() => {
      result.current.bringToFront('low');
    });

    const updatedLow = result.current.notes.find((n) => n.id === 'low');
    expect(updatedLow?.zIndex).toBe(high.zIndex + Z_INDEX_STEP);
  });
});
