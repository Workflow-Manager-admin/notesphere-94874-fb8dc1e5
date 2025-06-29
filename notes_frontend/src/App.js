import React, { useState, useEffect } from "react";
import "./App.css";
import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";
import NoteCard from "./components/NoteCard";
import AuthForm from "./components/AuthForm";
import {
  login,
  register,
  logout,
  setToken,
  getCurrentUser,
  fetchNotes,
  fetchNote,
  createNote,
  updateNote,
  deleteNote,
} from "./api";

// Color palette from requirements
const COLORS = {
  primary: "#1976d2",
  secondary: "#424242",
  accent: "#ffb300",
};

// PUBLIC_INTERFACE
function App() {
  // App-level state
  const [theme, setTheme] = useState("light");
  const [authUser, setAuthUser] = useState(getCurrentUser());
  const [authErr, setAuthErr] = useState("");
  const [authLoading, setAuthLoading] = useState(false);

  const [notes, setNotes] = useState([]);
  const [notesLoading, setNotesLoading] = useState(false);
  const [notesQuery, setNotesQuery] = useState("");
  const [selectedNote, setSelectedNote] = useState(null);

  const [mainSaving, setMainSaving] = useState(false);
  const [mainError, setMainError] = useState("");

  // Load theme on mount
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    document.documentElement.style.setProperty("--primary-color", COLORS.primary);
    document.documentElement.style.setProperty("--secondary-color", COLORS.secondary);
    document.documentElement.style.setProperty("--accent-color", COLORS.accent);
    // navbar
    document.documentElement.style.setProperty("--navbar-height", "60px");
  }, [theme]);

  // Load notes on user/login
  useEffect(() => {
    if (authUser) loadNotes(notesQuery || "");
    // eslint-disable-next-line
  }, [authUser]);

  // Check login on initial load
  useEffect(() => {
    setAuthUser(getCurrentUser());
  }, []);

  // PUBLIC_INTERFACE
  function handleLogin(username, password) {
    setAuthLoading(true);
    setAuthErr("");
    login(username, password)
      .then(({ user, token }) => {
        setToken(token, user);
        setAuthUser(user);
        setAuthErr("");
      })
      .catch((e) => setAuthErr(e.message))
      .finally(() => setAuthLoading(false));
  }

  // PUBLIC_INTERFACE
  function handleRegister(username, password) {
    setAuthLoading(true);
    setAuthErr("");
    register(username, password)
      .then(({ user, token }) => {
        setToken(token, user);
        setAuthUser(user);
        setAuthErr("");
      })
      .catch((e) => setAuthErr(e.message))
      .finally(() => setAuthLoading(false));
  }

  // PUBLIC_INTERFACE
  function handleLogout() {
    logout();
    setAuthUser(null);
    setNotes([]);
    setSelectedNote(null);
  }

  // PUBLIC_INTERFACE
  function loadNotes(q) {
    setNotesLoading(true);
    fetchNotes(q)
      .then((notes) => {
        setNotes(notes);
        // reselect previously selected if exists
        if (selectedNote) {
          const found = notes.find((n) => n.id === selectedNote.id);
          setSelectedNote(found || null);
        }
      })
      .catch(() => setNotes([]))
      .finally(() => setNotesLoading(false));
  }

  // PUBLIC_INTERFACE
  function handleSelectNote(note) {
    setMainError("");
    fetchNote(note.id)
      .then(setSelectedNote)
      .catch(() => setMainError("Could not load note"));
  }

  // PUBLIC_INTERFACE
  function handleCreateNote() {
    setMainError("");
    setMainSaving(true);
    createNote({ title: "Untitled", content: "" })
      .then((newNote) => {
        loadNotes(notesQuery);
        setSelectedNote(newNote);
      })
      .catch(() => setMainError("Failed to create note"))
      .finally(() => setMainSaving(false));
  }

  // PUBLIC_INTERFACE
  function handleSearch(q) {
    setNotesQuery(q);
    loadNotes(q);
  }

  // PUBLIC_INTERFACE
  function handleSaveNote(data) {
    setMainSaving(true);
    setMainError("");
    // determine create or update by id
    const fn = data.id ? updateNote : createNote;
    fn(data.id, data)
      .then((saved) => {
        loadNotes(notesQuery);
        setSelectedNote(saved);
      })
      .catch(() => setMainError("Failed to save note"))
      .finally(() => setMainSaving(false));
  }

  // PUBLIC_INTERFACE
  function handleDeleteNote(data) {
    setMainSaving(true);
    setMainError("");
    deleteNote(data.id)
      .then(() => {
        loadNotes(notesQuery);
        setSelectedNote(null);
      })
      .catch(() => setMainError("Could not delete note"))
      .finally(() => setMainSaving(false));
  }

  // Render
  if (!authUser) {
    return (
      <div className="App noauth">
        <main className="auth-area">
          <AuthForm
            onLogin={handleLogin}
            onRegister={handleRegister}
            error={authErr}
            loading={authLoading}
          />
        </main>
      </div>
    );
  }

  return (
    <div className="App main-ui">
      <Navbar user={authUser} onLogout={handleLogout} />
      <div className="topbar">
        <button
          className="theme-toggle"
          onClick={() => setTheme((t) => (t === "light" ? "dark" : "light"))}
          aria-label={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
        >
          {theme === "light" ? "🌙 Dark" : "☀️ Light"}
        </button>
      </div>
      <div className="main-layout">
        <Sidebar
          notes={notes}
          selectedId={selectedNote?.id}
          onSelect={handleSelectNote}
          onCreate={handleCreateNote}
          onSearch={handleSearch}
          loading={notesLoading}
        />
        <main className="main-content">
          <NoteCard
            note={selectedNote}
            onSave={handleSaveNote}
            onDelete={handleDeleteNote}
            error={mainError}
            saving={mainSaving}
          />
        </main>
      </div>
    </div>
  );
}

export default App;
