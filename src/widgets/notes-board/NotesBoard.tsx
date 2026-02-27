import { useCallback, useRef } from 'react';
import type { Note } from '../../entities/note';
import { NotesList } from '../notes-list';
import { TrashZone, type TrashZoneHandle } from './TrashZone';

interface NotesBoardProps {
  notes: Note[];
  onUpdateNote?: (id: string, patch: Partial<Note>) => void;
  onActivateNote?: (id: string) => void;
  onDropInTrash?: (id: string) => void;
}

export function NotesBoard({
  notes,
  onUpdateNote,
  onActivateNote,
  onDropInTrash,
}: NotesBoardProps) {
  if (import.meta.env.DEV) {
    console.count('render:NotesBoard');
  }
  const trashZoneRef = useRef<TrashZoneHandle | null>(null);

  const handleNoteDragMove = useCallback(
    (_id: string, clientX: number, clientY: number) => {
      const isOverTrash =
        trashZoneRef.current?.isPointerOver(clientX, clientY) ?? false;
      trashZoneRef.current?.setActive(isOverTrash);
    },
    [],
  );

  const handleNoteDragEnd = useCallback(
    (id: string, clientX: number, clientY: number) => {
      const isOverTrash =
        trashZoneRef.current?.isPointerOver(clientX, clientY) ?? false;
      if (isOverTrash) onDropInTrash?.(id);
      trashZoneRef.current?.setActive(false);
    },
    [onDropInTrash],
  );

  return (
    <div className="notes-board">
      <NotesList
        notes={notes}
        onUpdateNote={onUpdateNote}
        onActivateNote={onActivateNote}
        onNoteDragMove={handleNoteDragMove}
        onNoteDragEnd={handleNoteDragEnd}
      />
      <TrashZone ref={trashZoneRef} />
    </div>
  );
}
