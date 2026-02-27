import { forwardRef, memo, useImperativeHandle, useRef, useState } from 'react';

export interface TrashZoneHandle {
  isPointerOver: (clientX: number, clientY: number) => boolean;
  setActive: (isActive: boolean) => void;
}

const TrashZoneComponent = forwardRef<TrashZoneHandle>(
  function TrashZone(_, ref) {
    if (import.meta.env.DEV) {
      console.count('render:TrashZone');
    }
    const elementRef = useRef<HTMLDivElement | null>(null);
    const [isActive, setIsActive] = useState(false);

    useImperativeHandle(
      ref,
      () => ({
        isPointerOver: (clientX: number, clientY: number) => {
          const rect = elementRef.current?.getBoundingClientRect();
          if (!rect) return false;
          return (
            clientX >= rect.left &&
            clientX <= rect.right &&
            clientY >= rect.top &&
            clientY <= rect.bottom
          );
        },
        setActive: (active: boolean) => setIsActive(active),
      }),
      [],
    );

    return (
      <div
        ref={elementRef}
        className={`trash-zone${isActive ? ' trash-zone--active' : ''}`}
      >
        Drop here to delete
      </div>
    );
  },
);

export const TrashZone = memo(TrashZoneComponent);
