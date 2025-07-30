import React, { useEffect, useMemo, useState } from "react";
import Sidebar from "./components/Sidebar";
import NotesList from "./components/NotesList";
import NoteDetail from "./components/NoteDetail";
import NoteModal from "./components/NoteModal";
import ConfirmModal from "./components/ConfirmModal";
import "./App.css";

/**
 * PUBLIC_INTERFACE
 * Main App Component for the Notes application.
 * Features:
 *  - Sidebar navigation
 *  - Notes list and detail view
 *  - Modals for create/edit/delete
 *  - Light theme with minimal, modern UI
 */
function App() {
  // Notes state
  const [notes, setNotes] = useState([]);
  const [selectedNoteId, setSelectedNoteId] = useState(null);

  // Modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [editingNote, setEditingNote] = useState(null);
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);

  // Theme toggle (persistent in localStorage)
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem("theme") || "light";
  });

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  // Fetch notes from backend API on mount
  useEffect(() => {
    fetchNotes();
    // eslint-disable-next-line
  }, []);

  // PUBLIC_INTERFACE
  async function fetchNotes() {
    try {
      const baseUrl = process.env.REACT_APP_NOTES_API_URL || "/api";
      const resp = await fetch(`${baseUrl}/notes/`);
      if (!resp.ok) {
        throw new Error("Failed to load notes");
      }
      const data = await resp.json();
      setNotes(Array.isArray(data) ? data : []);
    } catch (err) {
      setNotes([]);
    }
  }

  // PUBLIC_INTERFACE
  function handleSelectNote(id) {
    setSelectedNoteId(id);
  }

  // PUBLIC_INTERFACE
  function handleCreateNote() {
    setEditingNote(null);
    setModalOpen(true);
  }

  // PUBLIC_INTERFACE
  function handleEditNote(note) {
    setEditingNote(note);
    setModalOpen(true);
  }

  // PUBLIC_INTERFACE
  function handleDeleteNote(note) {
    setEditingNote(note);
    setConfirmDeleteOpen(true);
  }

  // PUBLIC_INTERFACE
  async function handleSaveNote(noteData) {
    const baseUrl = process.env.REACT_APP_NOTES_API_URL || "/api";
    let updated = null;
    try {
      if (editingNote) {
        // Update
        const resp = await fetch(`${baseUrl}/notes/${editingNote.id}/`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(noteData),
        });
        if (!resp.ok) throw new Error("Update failed");
        updated = await resp.json();
      } else {
        // Create
        const resp = await fetch(`${baseUrl}/notes/`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(noteData),
        });
        if (!resp.ok) throw new Error("Create failed");
        updated = await resp.json();
      }
      setModalOpen(false);
      setEditingNote(null);
      await fetchNotes();
      if (updated?.id) {
        setSelectedNoteId(updated.id);
      }
    } catch (err) {
      // show error or notification
      alert("Failed to save note.");
    }
  }

  // PUBLIC_INTERFACE
  async function handleConfirmDelete() {
    // Delete note
    const baseUrl = process.env.REACT_APP_NOTES_API_URL || "/api";
    try {
      if (editingNote?.id) {
        const resp = await fetch(`${baseUrl}/notes/${editingNote.id}/`, {
          method: "DELETE",
        });
        if (!resp.ok) throw new Error("Delete failed");
        setConfirmDeleteOpen(false);
        setEditingNote(null);
        setSelectedNoteId((prev) =>
          prev === editingNote.id ? null : prev
        );
        await fetchNotes();
      }
    } catch (err) {
      alert("Failed to delete note.");
    }
  }

  function handleModalClose() {
    setModalOpen(false);
    setEditingNote(null);
  }

  function handleDeleteModalClose() {
    setConfirmDeleteOpen(false);
    setEditingNote(null);
  }

  // Ensure selectedNote is in notes
  const selectedNote = useMemo(
    () => notes.find((n) => n.id === selectedNoteId) || null,
    [notes, selectedNoteId]
  );

  // PUBLIC_INTERFACE
  function toggleTheme() {
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
  }

  return (
    <div className="notes-app-root" data-theme={theme}>
      <Sidebar
        onCreate={handleCreateNote}
        theme={theme}
        onToggleTheme={toggleTheme}
      />
      <main className="main-panel">
        <div className="main-content">
          <div className="notes-list-section">
            <NotesList
              notes={notes}
              selectedNoteId={selectedNoteId}
              onSelectNote={handleSelectNote}
              onEditNote={handleEditNote}
              onDeleteNote={handleDeleteNote}
            />
            <button
              className="primary-btn floating-btn"
              title="Add note"
              onClick={handleCreateNote}
            >
              ＋
            </button>
          </div>
          <div className="note-detail-section">
            <NoteDetail
              note={selectedNote}
              onEditNote={handleEditNote}
              onDeleteNote={handleDeleteNote}
            />
          </div>
        </div>
      </main>
      <NoteModal
        open={modalOpen}
        onClose={handleModalClose}
        onSave={handleSaveNote}
        note={editingNote}
      />
      <ConfirmModal
        open={confirmDeleteOpen}
        onClose={handleDeleteModalClose}
        onConfirm={handleConfirmDelete}
        title="Delete Note"
        message={
          editingNote
            ? `Are you sure you want to delete "${editingNote.title}"?`
            : ""
        }
      />
    </div>
  );
}

export default App;
