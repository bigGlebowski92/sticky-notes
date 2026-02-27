import { useCallback } from 'react';
import type { Note } from '../../entities/note';
import { NoteCard } from '../../entities/note';

interface NotesListProps {
  notes: Note[];
  onUpdateNote?: (id: string, patch: Partial<Note>) => void;
  onActivateNote?: (id: string) => void;
  onNoteDragMove?: (id: string, clientX: number, clientY: number) => void;
  onNoteDragEnd?: (id: string, clientX: number, clientY: number) => void;
}

export function NotesList({
  notes,
  onUpdateNote,
  onActivateNote,
  onNoteDragMove,
  onNoteDragEnd,
}: NotesListProps) {
  if (import.meta.env.DEV) {
    console.count('render:NotesList');
  }
  const handleTextChange = useCallback(
    (id: string, text: string) => {
      onUpdateNote?.(id, { text });
    },
    [onUpdateNote],
  );
  const handleMoveNote = useCallback(
    (id: string, x: number, y: number) => {
      onUpdateNote?.(id, { x, y });
    },
    [onUpdateNote],
  );
  const handleResizeNote = useCallback(
    (id: string, width: number, height: number) => {
      onUpdateNote?.(id, { width, height });
    },
    [onUpdateNote],
  );

  return (
    <>
      {notes.map((note) => (
        <NoteCard
          key={note.id}
          note={note}
          onTextChange={handleTextChange}
          onMove={handleMoveNote}
          onResize={handleResizeNote}
          onActivate={onActivateNote}
          onDragMove={onNoteDragMove}
          onDragEnd={onNoteDragEnd}
        />
      ))}
    </>
  );
}
