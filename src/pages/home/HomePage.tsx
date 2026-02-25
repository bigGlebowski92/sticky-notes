import { useNotes } from '../../entities/note';
import { AddNoteButton } from '../../features/add-note';
import { NotesBoard } from '../../widgets/notes-board';

const NEW_NOTE_BASE_COORDINATE = 40;
const NEW_NOTE_OFFSET = 24;

export function HomePage() {
  const { notes, addNote, updateNote, removeNote, bringToFront } = useNotes();

  const handleAddNote = () => {
    const x = NEW_NOTE_BASE_COORDINATE + notes.length * NEW_NOTE_OFFSET;
    const y = NEW_NOTE_BASE_COORDINATE + notes.length * NEW_NOTE_OFFSET;
    addNote(x, y);
  };

  return (
    <>
      <header className="home-header">
        <h1 className="home-header__title">Sticky Notes</h1>
        <AddNoteButton className="home-header__add-btn" onClick={handleAddNote} />
      </header>
      <NotesBoard
        notes={notes}
        onTextChange={(id: string, text: string) => updateNote(id, { text })}
        onMoveNote={(id: string, x: number, y: number) => updateNote(id, { x, y })}
        onResizeNote={(id: string, width: number, height: number) =>
          updateNote(id, { width, height })
        }
        onActivateNote={(id: string) => bringToFront(id)}
        onDropInTrash={(id: string) => removeNote(id)}
      />
    </>
  );
}
