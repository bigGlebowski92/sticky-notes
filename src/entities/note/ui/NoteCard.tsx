import { memo, useCallback, useRef } from 'react';
import type { Note } from '../model';
import { useNoteDrag } from './hooks/useNoteDrag';
import { useNoteResize } from './hooks/useNoteResize';

interface NoteCardProps {
  note: Note;
  onTextChange?: (id: string, text: string) => void;
  onMove?: (id: string, x: number, y: number) => void;
  onResize?: (id: string, width: number, height: number) => void;
  onActivate?: (id: string) => void;
  onDragMove?: (id: string, clientX: number, clientY: number) => void;
  onDragEnd?: (id: string, clientX: number, clientY: number) => void;
}

function NoteCardComponent({
  note,
  onTextChange,
  onMove,
  onResize,
  onActivate,
  onDragMove,
  onDragEnd,
}: NoteCardProps) {
  if (import.meta.env.DEV) {
    console.count(`render:NoteCard:${note.id}`);
  }
  const noteRef = useRef<HTMLDivElement | null>(null);
  const textAreaRef = useRef<HTMLTextAreaElement | null>(null);
  const noteId = note.id;

  const handleTextBlur = useCallback(() => {
    const nextText = textAreaRef.current?.value ?? '';
    if (nextText !== note.text) {
      onTextChange?.(noteId, nextText);
    }
  }, [note.text, noteId, onTextChange]);
  const { handleDragStart: handleDragMouseDown } = useNoteDrag({
    noteRef,
    x: note.x,
    y: note.y,
    width: note.width,
    height: note.height,
    onMove: (x: number, y: number) => onMove?.(noteId, x, y),
    onActivate: () => onActivate?.(noteId),
    onDragMove: (clientX: number, clientY: number) => onDragMove?.(noteId, clientX, clientY),
    onDragEnd: (clientX: number, clientY: number) => onDragEnd?.(noteId, clientX, clientY),
  });
  const { handleResizeStart } = useNoteResize({
    noteRef,
    x: note.x,
    y: note.y,
    onResize: (width: number, height: number) => onResize?.(noteId, width, height),
    onActivate: () => onActivate?.(noteId),
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
      onMouseDown={() => onActivate?.(noteId)}
    >
      <div
        className="note-card__drag-handle"
        onMouseDown={handleDragMouseDown}
      />
      <textarea
        ref={textAreaRef}
        defaultValue={note.text}
        onBlur={handleTextBlur}
        placeholder="Write a note..."
        className="note-card__text"
      />
      <div className="note-card__resize-handle" onMouseDown={handleResizeStart} />
    </div>
  );
}

export const NoteCard = memo(NoteCardComponent);
