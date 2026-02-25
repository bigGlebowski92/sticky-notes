import { useRef, useState } from 'react';
import type { Note } from '../../entities/note';
import { NotesList } from '../notes-list';

interface NotesBoardProps {
  notes: Note[];
  onTextChange?: (id: string, text: string) => void;
  onMoveNote?: (id: string, x: number, y: number) => void;
  onResizeNote?: (id: string, width: number, height: number) => void;
  onActivateNote?: (id: string) => void;
  onDropInTrash?: (id: string) => void;
}

export function NotesBoard({
  notes,
  onTextChange,
  onMoveNote,
  onResizeNote,
  onActivateNote,
  onDropInTrash,
}: NotesBoardProps) {
  const trashRef = useRef<HTMLDivElement | null>(null);
  const [isTrashActive, setIsTrashActive] = useState(false);
  const [draggedNoteId, setDraggedNoteId] = useState<string | null>(null);

  const isPointerOverTrash = (clientX: number, clientY: number) => {
    const trashRect = trashRef.current?.getBoundingClientRect();
    if (!trashRect) return false;
    return (
      clientX >= trashRect.left &&
      clientX <= trashRect.right &&
      clientY >= trashRect.top &&
      clientY <= trashRect.bottom
    );
  };

  console.log(notes, 'notes');

  return (
    <div className="notes-board">
      <NotesList
        notes={notes}
        onTextChange={onTextChange}
        onMoveNote={onMoveNote}
        onResizeNote={onResizeNote}
        onActivateNote={onActivateNote}
        onNoteDragStart={(id: string, clientX: number, clientY: number) => {
          setDraggedNoteId(id);
          setIsTrashActive(isPointerOverTrash(clientX, clientY));
        }}
        onNoteDragMove={(_: string, clientX: number, clientY: number) => {
          setIsTrashActive(isPointerOverTrash(clientX, clientY));
        }}
        onNoteDragEnd={(id: string, clientX: number, clientY: number) => {
          const isOverTrash = isPointerOverTrash(clientX, clientY);
          if (isOverTrash) onDropInTrash?.(id);
          setDraggedNoteId(null);
          setIsTrashActive(false);
        }}
      />
      <div
        ref={trashRef}
        className={`trash-zone${isTrashActive ? ' trash-zone--active' : ''}${
          draggedNoteId ? ' trash-zone--dragging' : ''
        }`}
      >
        Drop here to delete
      </div>
    </div>
  );
}
