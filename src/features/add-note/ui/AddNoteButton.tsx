import type { ButtonHTMLAttributes } from 'react';
import { Button } from '../../../shared';

type AddNoteButtonProps = ButtonHTMLAttributes<HTMLButtonElement>;

export function AddNoteButton(props: AddNoteButtonProps) {
  return <Button {...props}>Add note</Button>;
}
