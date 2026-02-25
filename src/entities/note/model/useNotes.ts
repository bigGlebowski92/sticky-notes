import { useState } from 'react';
import type { Note } from './types';
import {
  DEFAULT_NOTE_WIDTH,
  DEFAULT_NOTE_HEIGHT,
  DEFAULT_NOTE_COLOR,
  BASE_Z_INDEX,
  Z_INDEX_STEP,
} from './constants';
import { generateId } from '../../../shared';

export function useNotes(initialNotes: Note[] = []) {
  const [notes, setNotes] = useState<Note[]>(initialNotes);

  const addNote = (x: number, y: number) => {
    setNotes((prev) => {
      const maxZ = prev.length ? Math.max(...prev.map((n) => n.zIndex)) : BASE_Z_INDEX;
      return [
        ...prev,
        {
          id: generateId(),
          text: '',
          color: DEFAULT_NOTE_COLOR,
          x,
          y,
          width: DEFAULT_NOTE_WIDTH,
          height: DEFAULT_NOTE_HEIGHT,
          zIndex: maxZ + Z_INDEX_STEP,
        },
      ];
    });
  };

  const updateNote = (id: string, patch: Partial<Note>) => {
    setNotes((prev) =>
      prev.map((n) => (n.id === id ? { ...n, ...patch } : n))
    );
  };

  const removeNote = (id: string) => {
    setNotes((prev) => prev.filter((n) => n.id !== id));
  };

  const bringToFront = (id: string) => {
    setNotes((prev) => {
      const maxZ = Math.max(...prev.map((n) => n.zIndex));
      return prev.map((n) =>
        n.id === id ? { ...n, zIndex: maxZ + Z_INDEX_STEP } : n
      );
    });
  };

  return { notes, addNote, updateNote, removeNote, bringToFront };
}
