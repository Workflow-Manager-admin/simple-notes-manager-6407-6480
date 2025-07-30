import React, { useEffect, useRef, useState } from "react";
import PropTypes from "prop-types";
import "./NoteModal.css";

/**
 * PUBLIC_INTERFACE
 * Modal dialog for creating or editing a note.
 * Fields: title, content
 */
function NoteModal({ open, onClose, onSave, note }) {
  const [title, setTitle] = useState(note?.title || "");
  const [content, setContent] = useState(note?.content || "");
  const [submitting, setSubmitting] = useState(false);

  const firstInputRef = useRef(null);

  useEffect(() => {
    setTitle(note?.title || "");
    setContent(note?.content || "");
    setSubmitting(false);
    if (open && firstInputRef.current) {
      setTimeout(() => firstInputRef.current?.focus(), 50);
    }
  }, [note, open]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    await onSave({ title, content });
    setSubmitting(false);
  };

  if (!open) return null;
  return (
    <div className="modal-backdrop" role="dialog" aria-modal="true">
      <div className="modal" role="document">
        <h3>{note ? "Edit Note" : "New Note"}</h3>
        <form onSubmit={handleSubmit}>
          <label>
            Title
            <input
              ref={firstInputRef}
              type="text"
              value={title}
              maxLength={60}
              onChange={e => setTitle(e.target.value)}
              placeholder="Note title"
              autoFocus
              required
              disabled={submitting}
            />
          </label>
          <label>
            Content
            <textarea
              value={content}
              onChange={e => setContent(e.target.value)}
              placeholder="Write your note here..."
              rows={7}
              maxLength={5000}
              disabled={submitting}
            />
          </label>
          <div className="modal-actions">
            <button type="button" className="secondary-btn" onClick={onClose} disabled={submitting}>
              Cancel
            </button>
            <button type="submit" className="primary-btn" disabled={submitting}>
              {submitting ? "Saving..." : (note ? "Save Changes" : "Create Note")}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

NoteModal.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired,
  note: PropTypes.object,
};

export default NoteModal;
