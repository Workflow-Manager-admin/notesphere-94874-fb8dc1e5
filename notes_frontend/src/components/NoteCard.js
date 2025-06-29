import React, { useState, useEffect } from "react";

// PUBLIC_INTERFACE
function NoteCard({ note, onSave, onDelete, saving, error }) {
  /** Card for view + edit note (in main area). */
  const [title, setTitle] = useState(note?.title || "");
  const [content, setContent] = useState(note?.content || "");

  // On note change, update local state
  useEffect(() => {
    setTitle(note?.title || "");
    setContent(note?.content || "");
  }, [note?.id]);

  function handleSave(e) {
    e.preventDefault();
    if (onSave) onSave({ ...note, title, content });
  }
  function handleDelete() {
    if (window.confirm("Delete this note?")) {
      onDelete(note);
    }
  }

  if (!note) {
    return (
      <div className="note-card note-card-empty">
        <div>Select a note, or create one.</div>
      </div>
    );
  }

  return (
    <form className="note-card" onSubmit={handleSave}>
      <input
        className="note-title-input"
        value={title}
        placeholder="Title"
        onChange={e => setTitle(e.target.value)}
      />
      <textarea
        className="note-content-input"
        value={content}
        placeholder="Write your note here..."
        onChange={e => setContent(e.target.value)}
        rows={12}
        spellCheck={true}
      />
      {error ? <div className="form-error">{error}</div> : null}
      <div className="note-actions">
        <button className="btn btn-primary" disabled={saving}>
          {saving ? "Saving..." : "Save"}
        </button>
        <button
          type="button"
          className="btn btn-danger"
          onClick={handleDelete}
          disabled={saving}
        >
          Delete
        </button>
      </div>
    </form>
  );
}

export default NoteCard;
