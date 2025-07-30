import React from "react";
import PropTypes from "prop-types";
import "./NoteDetail.css";

/**
 * PUBLIC_INTERFACE
 * Displays detail of the selected note, or an empty state.
 */
function NoteDetail({ note, onEditNote, onDeleteNote }) {
  if (!note) {
    return (
      <div className="note-detail-empty">
        <p>Select a note to view its content.</p>
      </div>
    );
  }
  return (
    <div className="note-detail">
      <div className="note-detail-header">
        <h2>{note.title || <span className="untitled">(Untitled)</span>}</h2>
        <div className="note-detail-actions">
          <button
            className="icon-btn edit-btn"
            title="Edit"
            onClick={() => onEditNote(note)}
          >
            ✏️
          </button>
          <button
            className="icon-btn delete-btn"
            title="Delete"
            onClick={() => onDeleteNote(note)}
          >
            🗑️
          </button>
        </div>
      </div>
      <div className="note-detail-content">
        {note.content ? (
          <pre>{note.content}</pre>
        ) : (
          <span className="empty">(No content)</span>
        )}
      </div>
    </div>
  );
}

NoteDetail.propTypes = {
  note: PropTypes.object,
  onEditNote: PropTypes.func.isRequired,
  onDeleteNote: PropTypes.func.isRequired,
};

export default NoteDetail;
