import { useCallback } from 'react';
import { useNotes } from '../../entities/note';
import { AddNoteButton } from '../../features/add-note';
import { NotesBoard } from '../../widgets/notes-board';
const NEW_NOTE_BASE_COORDINATE = 40;
const NEW_NOTE_OFFSET = 24;

export function HomePage() {
  if (import.meta.env.DEV) {
    console.count('render:HomePage');
  }
  const { notes, addNote, updateNote, removeNote, bringToFront } = useNotes();

  const handleAddNote = useCallback(() => {
    const x = NEW_NOTE_BASE_COORDINATE + notes.length * NEW_NOTE_OFFSET;
    const y = NEW_NOTE_BASE_COORDINATE + notes.length * NEW_NOTE_OFFSET;
    addNote(x, y);
  }, [addNote, notes.length]);

  return (
    <>
      <header className="home-header">
        <h1 className="home-header__title">Sticky Notes</h1>
        <AddNoteButton
          className="home-header__add-btn"
          onClick={handleAddNote}
        />
      </header>
      <NotesBoard
        notes={notes}
        onUpdateNote={updateNote}
        onActivateNote={bringToFront}
        onDropInTrash={removeNote}
      />
    </>
  );
}
