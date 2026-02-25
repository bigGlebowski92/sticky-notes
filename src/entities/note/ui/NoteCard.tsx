import { useRef } from 'react';
import type { Note } from '../model';
import { useNoteDrag } from './hooks/useNoteDrag';
import { useNoteResize } from './hooks/useNoteResize';

interface NoteCardProps {
  note: Note;
  onTextChange?: (text: string) => void;
  onMove?: (x: number, y: number) => void;
  onResize?: (width: number, height: number) => void;
  onActivate?: () => void;
  onDragStart?: (clientX: number, clientY: number) => void;
  onDragMove?: (clientX: number, clientY: number) => void;
  onDragEnd?: (clientX: number, clientY: number) => void;
}

export function NoteCard({
  note,
  onTextChange,
  onMove,
  onResize,
  onActivate,
  onDragStart,
  onDragMove,
  onDragEnd,
}: NoteCardProps) {
  const noteRef = useRef<HTMLDivElement | null>(null);
  const { handleDragStart } = useNoteDrag({
    noteRef,
    x: note.x,
    y: note.y,
    width: note.width,
    height: note.height,
    onMove,
    onActivate,
    onDragStart,
    onDragMove,
    onDragEnd,
  });
  const { handleResizeStart } = useNoteResize({
    noteRef,
    x: note.x,
    y: note.y,
    onResize,
    onActivate,
  });

  return (
    <div
      ref={noteRef}
      className="note-card"
      style={{
        position: 'absolute',
        left: note.x,
        top: note.y,
        width: note.width,
        height: note.height,
        zIndex: note.zIndex,
        backgroundColor: note.color,
      }}
      onMouseDown={onActivate}
    >
      <div
        className="note-card__drag-handle"
        onMouseDown={handleDragStart}
      />
      <textarea
        value={note.text}
        onChange={(e) => onTextChange?.(e.target.value)}
        placeholder="Write a note..."
        className="note-card__text"
      />
      <div className="note-card__resize-handle" onMouseDown={handleResizeStart} />
    </div>
  );
}
