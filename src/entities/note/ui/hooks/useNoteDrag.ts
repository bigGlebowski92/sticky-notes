import { useCallback, useEffect, useRef } from 'react';
import type { MouseEvent as ReactMouseEvent, RefObject } from 'react';
import { clamp } from '../../../../shared';

interface DragState {
  startX: number;
  startY: number;
  initialNoteX: number;
  initialNoteY: number;
  finalX: number;
  finalY: number;
}

interface UseNoteDragParams {
  noteRef: RefObject<HTMLDivElement | null>;
  x: number;
  y: number;
  width: number;
  height: number;
  onMove?: (x: number, y: number) => void;
  onActivate?: () => void;
  onDragMove?: (clientX: number, clientY: number) => void;
  onDragEnd?: (clientX: number, clientY: number) => void;
}

interface DragCallbacks {
  onMove?: (x: number, y: number) => void;
  onActivate?: () => void;
  onDragMove?: (clientX: number, clientY: number) => void;
  onDragEnd?: (clientX: number, clientY: number) => void;
  width: number;
  height: number;
}

const BOARD_MIN_COORDINATE = 0;

export function useNoteDrag({
  noteRef,
  x,
  y,
  width,
  height,
  onMove,
  onActivate,
  onDragMove,
  onDragEnd,
}: UseNoteDragParams) {
  const dragStateRef = useRef<DragState | null>(null);
  const callbacksRef = useRef<DragCallbacks>({
    onMove,
    onActivate,
    onDragMove,
    onDragEnd,
    width,
    height,
  });

  useEffect(() => {
    callbacksRef.current = {
      onMove,
      onActivate,
      onDragMove,
      onDragEnd,
      width,
      height,
    };
  }, [onMove, onActivate, onDragMove, onDragEnd, width, height]);

  const handleDragMouseMove = useCallback(
    (event: MouseEvent) => {
      const dragState = dragStateRef.current;
      const { onDragMove: dragMoveCallback, width: noteWidth, height: noteHeight } =
        callbacksRef.current;
      if (!dragState) return;

      const { startX, startY, initialNoteX, initialNoteY } = dragState;
      const deltaX = event.clientX - startX;
      const deltaY = event.clientY - startY;
      const nextX = initialNoteX + deltaX;
      const nextY = initialNoteY + deltaY;
      const boardElement = noteRef.current?.offsetParent as HTMLElement | null;

      if (!boardElement) {
        dragState.finalX = nextX;
        dragState.finalY = nextY;
        const noteElement = noteRef.current;
        if (noteElement) {
          noteElement.style.transform = `translate3d(${nextX - dragState.initialNoteX}px, ${nextY - dragState.initialNoteY}px, 0)`;
        }
        dragMoveCallback?.(event.clientX, event.clientY);
        return;
      }

      const maxX = Math.max(BOARD_MIN_COORDINATE, boardElement.clientWidth - noteWidth);
      const maxY = Math.max(BOARD_MIN_COORDINATE, boardElement.clientHeight - noteHeight);
      const clampedX = clamp(nextX, BOARD_MIN_COORDINATE, maxX);
      const clampedY = clamp(nextY, BOARD_MIN_COORDINATE, maxY);
      dragState.finalX = clampedX;
      dragState.finalY = clampedY;
      const noteElement = noteRef.current;
      if (noteElement) {
        noteElement.style.transform = `translate3d(${clampedX - dragState.initialNoteX}px, ${clampedY - dragState.initialNoteY}px, 0)`;
      }
      dragMoveCallback?.(event.clientX, event.clientY);
    },
    [noteRef]
  );

  const handleDragMouseUp = useCallback(
    (event: MouseEvent) => {
      const dragState = dragStateRef.current;
      if (dragState) {
        const didMove =
          dragState.finalX !== dragState.initialNoteX || dragState.finalY !== dragState.initialNoteY;
        if (didMove) {
          callbacksRef.current.onMove?.(dragState.finalX, dragState.finalY);
        }
      }
      const noteElement = noteRef.current;
      if (noteElement) {
        noteElement.style.transform = '';
      }
      callbacksRef.current.onDragEnd?.(event.clientX, event.clientY);
      dragStateRef.current = null;
      window.removeEventListener('mousemove', handleDragMouseMove);
    },
    [handleDragMouseMove, noteRef]
  );

  const handleDragStart = useCallback(
    (event: ReactMouseEvent<HTMLDivElement>) => {
      event.preventDefault();
      callbacksRef.current.onActivate?.();
      dragStateRef.current = {
        startX: event.clientX,
        startY: event.clientY,
        initialNoteX: x,
        initialNoteY: y,
        finalX: x,
        finalY: y,
      };
      window.addEventListener('mousemove', handleDragMouseMove);
      window.addEventListener('mouseup', handleDragMouseUp, { once: true });
    },
    [handleDragMouseMove, handleDragMouseUp, x, y]
  );

  useEffect(() => {
    return () => {
      dragStateRef.current = null;
      window.removeEventListener('mousemove', handleDragMouseMove);
      window.removeEventListener('mouseup', handleDragMouseUp);
    };
  }, [handleDragMouseMove, handleDragMouseUp]);

  return { handleDragStart };
}
