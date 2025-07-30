import React from "react";
import PropTypes from "prop-types";
import "./NotesList.css";

/**
 * PUBLIC_INTERFACE
 * List all notes, highlight selected, show edit/delete icons
 */
function NotesList({
  notes,
  selectedNoteId,
  onSelectNote,
  onEditNote,
  onDeleteNote,
}) {
  return (
    <div className="notes-list">
      <div className="notes-list-header">All Notes</div>
      {notes?.length === 0 && (
        <div className="notes-list-empty">No notes. Create the first one!</div>
      )}
      <ul>
        {notes.map((note) => (
          <li
            key={note.id}
            className={note.id === selectedNoteId ? "selected" : ""}
            onClick={() => onSelectNote(note.id)}
            tabIndex={0}
            aria-label={`${note.title || "Untitled"} - select`}
          >
            <div className="list-title">{note.title || <span className="untitled">(Untitled)</span>}</div>
            <div className="list-actions" onClick={e => e.stopPropagation()}>
              <button
                className="icon-btn edit-btn"
                onClick={() => onEditNote(note)}
                aria-label="Edit note"
                tabIndex={-1}
              >
                ✏️
              </button>
              <button
                className="icon-btn delete-btn"
                onClick={() => onDeleteNote(note)}
                aria-label="Delete note"
                tabIndex={-1}
              >
                🗑️
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

NotesList.propTypes = {
  notes: PropTypes.array.isRequired,
  selectedNoteId: PropTypes.any,
  onSelectNote: PropTypes.func.isRequired,
  onEditNote: PropTypes.func.isRequired,
  onDeleteNote: PropTypes.func.isRequired,
};

export default NotesList;
