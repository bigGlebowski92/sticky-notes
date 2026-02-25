import type { Note } from '../../entities/note';
import { NoteCard } from '../../entities/note';

interface NotesListProps {
  notes: Note[];
  onTextChange?: (id: string, text: string) => void;
  onMoveNote?: (id: string, x: number, y: number) => void;
  onResizeNote?: (id: string, width: number, height: number) => void;
  onActivateNote?: (id: string) => void;
  onNoteDragStart?: (id: string, clientX: number, clientY: number) => void;
  onNoteDragMove?: (id: string, clientX: number, clientY: number) => void;
  onNoteDragEnd?: (id: string, clientX: number, clientY: number) => void;
}

export function NotesList({
  notes,
  onTextChange,
  onMoveNote,
  onResizeNote,
  onActivateNote,
  onNoteDragStart,
  onNoteDragMove,
  onNoteDragEnd,
}: NotesListProps) {
  return (
    <>
      {notes.map((note) => (
        <NoteCard
          key={note.id}
          note={note}
          onTextChange={(text: string) => onTextChange?.(note.id, text)}
          onMove={(x: number, y: number) => onMoveNote?.(note.id, x, y)}
          onResize={(width: number, height: number) => onResizeNote?.(note.id, width, height)}
          onActivate={() => onActivateNote?.(note.id)}
          onDragStart={(clientX: number, clientY: number) =>
            onNoteDragStart?.(note.id, clientX, clientY)
          }
          onDragMove={(clientX: number, clientY: number) =>
            onNoteDragMove?.(note.id, clientX, clientY)
          }
          onDragEnd={(clientX: number, clientY: number) =>
            onNoteDragEnd?.(note.id, clientX, clientY)
          }
        />
      ))}
    </>
  );
}
