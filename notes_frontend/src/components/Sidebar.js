import React, { useState } from "react";

// PUBLIC_INTERFACE
function Sidebar({
  notes,
  selectedId,
  onSelect,
  onCreate,
  onSearch,
  loading,
}) {
  /** Sidebar: search bar, notes list, create note. */
  const [search, setSearch] = useState("");

  function handleSubmit(e) {
    e.preventDefault();
    onSearch?.(search);
  }

  return (
    <aside className="sidebar">
      <form className="sidebar-search" onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Search notes"
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        <button type="submit" className="btn btn-icon" title="Search">
          🔍
        </button>
      </form>
      <button className="btn btn-primary btn-block" onClick={onCreate}>
        + New Note
      </button>
      <ul className="notes-list">
        {loading
          ? <li className="notes-loading">Loading...</li>
          : notes.length === 0
          ? <li className="notes-empty">No notes</li>
          : notes.map(note => (
            <li
              key={note.id}
              className={
                "notes-list-item" +
                (note.id === selectedId ? " selected" : "")
              }
              onClick={() => onSelect(note)}
              tabIndex={0}
              aria-label={`Select ${note.title}`}
            >
              <div className="note-title">{note.title || <em>(Untitled)</em>}</div>
            </li>
          ))}
      </ul>
    </aside>
  );
}
export default Sidebar;
