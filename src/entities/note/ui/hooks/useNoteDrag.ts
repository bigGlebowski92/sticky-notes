import { useCallback, useEffect, useRef } from 'react';
import type { MouseEvent as ReactMouseEvent, RefObject } from 'react';
import { clamp } from '../../../../shared';

interface DragState {
  startX: number;
  startY: number;
  initialNoteX: number;
  initialNoteY: number;
}

interface UseNoteDragParams {
  noteRef: RefObject<HTMLDivElement | null>;
  x: number;
  y: number;
  width: number;
  height: number;
  onMove?: (x: number, y: number) => void;
  onActivate?: () => void;
  onDragStart?: (clientX: number, clientY: number) => void;
  onDragMove?: (clientX: number, clientY: number) => void;
  onDragEnd?: (clientX: number, clientY: number) => void;
}

interface DragCallbacks {
  onMove?: (x: number, y: number) => void;
  onActivate?: () => void;
  onDragStart?: (clientX: number, clientY: number) => void;
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
  onDragStart,
  onDragMove,
  onDragEnd,
}: UseNoteDragParams) {
  const dragStateRef = useRef<DragState | null>(null);
  const callbacksRef = useRef<DragCallbacks>({
    onMove,
    onActivate,
    onDragStart,
    onDragMove,
    onDragEnd,
    width,
    height,
  });

  callbacksRef.current = {
    onMove,
    onActivate,
    onDragStart,
    onDragMove,
    onDragEnd,
    width,
    height,
  };

  const stopDragging = useCallback(() => {
    dragStateRef.current = null;
    window.removeEventListener('mousemove', handleDragMouseMove);
    window.removeEventListener('mouseup', handleDragMouseUp);
  }, []);

  const handleDragMouseMove = useCallback(
    (event: MouseEvent) => {
      const dragState = dragStateRef.current;
      const { onMove: moveCallback, onDragMove: dragMoveCallback, width: noteWidth, height: noteHeight } =
        callbacksRef.current;
      if (!dragState || !moveCallback) return;

      const { startX, startY, initialNoteX, initialNoteY } = dragState;
      const deltaX = event.clientX - startX;
      const deltaY = event.clientY - startY;
      const nextX = initialNoteX + deltaX;
      const nextY = initialNoteY + deltaY;
      const boardElement = noteRef.current?.offsetParent as HTMLElement | null;

      if (!boardElement) {
        moveCallback(nextX, nextY);
        dragMoveCallback?.(event.clientX, event.clientY);
        return;
      }

      const maxX = Math.max(BOARD_MIN_COORDINATE, boardElement.clientWidth - noteWidth);
      const maxY = Math.max(BOARD_MIN_COORDINATE, boardElement.clientHeight - noteHeight);
      moveCallback(
        clamp(nextX, BOARD_MIN_COORDINATE, maxX),
        clamp(nextY, BOARD_MIN_COORDINATE, maxY)
      );
      dragMoveCallback?.(event.clientX, event.clientY);
    },
    [noteRef]
  );

  const handleDragMouseUp = useCallback(
    (event: MouseEvent) => {
      callbacksRef.current.onDragEnd?.(event.clientX, event.clientY);
      stopDragging();
    },
    [stopDragging]
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
      };
      callbacksRef.current.onDragStart?.(event.clientX, event.clientY);
      window.addEventListener('mousemove', handleDragMouseMove);
      window.addEventListener('mouseup', handleDragMouseUp);
    },
    [handleDragMouseMove, handleDragMouseUp, x, y]
  );

  useEffect(() => {
    return () => {
      stopDragging();
    };
  }, [stopDragging]);

  return { handleDragStart };
}
