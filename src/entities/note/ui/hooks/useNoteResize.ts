import { useCallback, useEffect, useRef } from 'react';
import type { MouseEvent as ReactMouseEvent, RefObject } from 'react';
import { MIN_NOTE_HEIGHT, MIN_NOTE_WIDTH } from '../../model';
import { clamp } from '../../../../shared';

interface ResizeState {
  startX: number;
  startY: number;
  initialWidth: number;
  initialHeight: number;
  finalWidth: number;
  finalHeight: number;
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

  useEffect(() => {
    callbacksRef.current = {
      onResize,
      onActivate,
      x,
      y,
    };
  }, [onResize, onActivate, x, y]);

  const handleResizeMouseMove = useCallback(
    (event: MouseEvent) => {
      const resizeState = resizeStateRef.current;
      const { x: noteX, y: noteY } = callbacksRef.current;
      if (!resizeState) return;

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

      const nextWidth = clamp(initialWidth + deltaX, MIN_NOTE_WIDTH, maxWidth);
      const nextHeight = clamp(initialHeight + deltaY, MIN_NOTE_HEIGHT, maxHeight);
      resizeState.finalWidth = nextWidth;
      resizeState.finalHeight = nextHeight;
      const noteElement = noteRef.current;
      if (noteElement) {
        noteElement.style.width = `${nextWidth}px`;
        noteElement.style.height = `${nextHeight}px`;
      }
    },
    [noteRef]
  );

  const handleResizeMouseUp = useCallback(() => {
    const resizeState = resizeStateRef.current;
    if (resizeState) {
      const didResize =
        resizeState.finalWidth !== resizeState.initialWidth ||
        resizeState.finalHeight !== resizeState.initialHeight;
      if (didResize) {
        callbacksRef.current.onResize?.(resizeState.finalWidth, resizeState.finalHeight);
      }
    }
    resizeStateRef.current = null;
    window.removeEventListener('mousemove', handleResizeMouseMove);
  }, [handleResizeMouseMove]);

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
        finalWidth: noteElement.offsetWidth,
        finalHeight: noteElement.offsetHeight,
      };
      window.addEventListener('mousemove', handleResizeMouseMove);
      window.addEventListener('mouseup', handleResizeMouseUp, { once: true });
    },
    [handleResizeMouseMove, handleResizeMouseUp, noteRef]
  );

  useEffect(() => {
    return () => {
      resizeStateRef.current = null;
      window.removeEventListener('mousemove', handleResizeMouseMove);
      window.removeEventListener('mouseup', handleResizeMouseUp);
    };
  }, [handleResizeMouseMove, handleResizeMouseUp]);

  return { handleResizeStart };
}
