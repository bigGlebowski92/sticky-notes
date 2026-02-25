import { useCallback, useEffect, useRef } from 'react';
import type { MouseEvent as ReactMouseEvent, RefObject } from 'react';
import { MIN_NOTE_HEIGHT, MIN_NOTE_WIDTH } from '../../model';
import { clamp } from '../../../../shared';

interface ResizeState {
  startX: number;
  startY: number;
  initialWidth: number;
  initialHeight: number;
}

interface UseNoteResizeParams {
  noteRef: RefObject<HTMLDivElement | null>;
  x: number;
  y: number;
  onResize?: (width: number, height: number) => void;
  onActivate?: () => void;
}

interface ResizeCallbacks {
  onResize?: (width: number, height: number) => void;
  onActivate?: () => void;
  x: number;
  y: number;
}

export function useNoteResize({
  noteRef,
  x,
  y,
  onResize,
  onActivate,
}: UseNoteResizeParams) {
  const resizeStateRef = useRef<ResizeState | null>(null);
  const callbacksRef = useRef<ResizeCallbacks>({
    onResize,
    onActivate,
    x,
    y,
  });

  callbacksRef.current = {
    onResize,
    onActivate,
    x,
    y,
  };

  const stopResizing = useCallback(() => {
    resizeStateRef.current = null;
    window.removeEventListener('mousemove', handleResizeMouseMove);
    window.removeEventListener('mouseup', handleResizeMouseUp);
  }, []);

  const handleResizeMouseMove = useCallback(
    (event: MouseEvent) => {
      const resizeState = resizeStateRef.current;
      const { onResize: resizeCallback, x: noteX, y: noteY } = callbacksRef.current;
      if (!resizeState || !resizeCallback) return;

      const { startX, startY, initialWidth, initialHeight } = resizeState;
      const deltaX = event.clientX - startX;
      const deltaY = event.clientY - startY;
      const boardElement = noteRef.current?.offsetParent as HTMLElement | null;
      const maxWidth = boardElement
        ? Math.max(MIN_NOTE_WIDTH, boardElement.clientWidth - noteX)
        : Infinity;
      const maxHeight = boardElement
        ? Math.max(MIN_NOTE_HEIGHT, boardElement.clientHeight - noteY)
        : Infinity;

      resizeCallback(
        clamp(initialWidth + deltaX, MIN_NOTE_WIDTH, maxWidth),
        clamp(initialHeight + deltaY, MIN_NOTE_HEIGHT, maxHeight)
      );
    },
    [noteRef]
  );

  const handleResizeMouseUp = useCallback(() => {
    stopResizing();
  }, [stopResizing]);

  const handleResizeStart = useCallback(
    (event: ReactMouseEvent<HTMLDivElement>) => {
      event.preventDefault();
      event.stopPropagation();
      callbacksRef.current.onActivate?.();
      const noteElement = noteRef.current;
      if (!noteElement) return;

      resizeStateRef.current = {
        startX: event.clientX,
        startY: event.clientY,
        initialWidth: noteElement.offsetWidth,
        initialHeight: noteElement.offsetHeight,
      };
      window.addEventListener('mousemove', handleResizeMouseMove);
      window.addEventListener('mouseup', handleResizeMouseUp);
    },
    [handleResizeMouseMove, handleResizeMouseUp, noteRef]
  );

  useEffect(() => {
    return () => {
      stopResizing();
    };
  }, [stopResizing]);

  return { handleResizeStart };
}
