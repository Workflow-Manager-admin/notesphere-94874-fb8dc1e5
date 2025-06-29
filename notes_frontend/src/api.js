//
// API client for notes app, handling auth and CRUD for notes.
// Uses JWT stored in localStorage. Interacts with Express backend.
//

const API_BASE = process.env.REACT_APP_API_URL || "http://localhost:3001/api";

// PUBLIC_INTERFACE
export async function register(username, password) {
  /** Register new user, returns user and token on success, throws on error. */
  const r = await fetch(`${API_BASE}/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password }),
  });
  if (!r.ok) throw new Error((await r.json()).error || "Registration failed");
  return r.json();
}

// PUBLIC_INTERFACE
export async function login(username, password) {
  /** Login user, returns user and token on success, throws on error. */
  const r = await fetch(`${API_BASE}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password }),
  });
  if (!r.ok) throw new Error((await r.json()).error || "Login failed");
  return r.json();
}

// PUBLIC_INTERFACE
export function logout() {
  /** Logout: clear local storage. */
  localStorage.removeItem("notes_token");
  localStorage.removeItem("notes_user");
}

// PUBLIC_INTERFACE
export function setToken(token, user) {
  /** Save jwt and user info to storage. */
  localStorage.setItem("notes_token", token);
  localStorage.setItem("notes_user", JSON.stringify(user));
}

// PUBLIC_INTERFACE
export function getToken() {
  return localStorage.getItem("notes_token");
}

// PUBLIC_INTERFACE
export function getCurrentUser() {
  const u = localStorage.getItem("notes_user");
  if (!u) return null;
  try {
    return JSON.parse(u);
  } catch {
    return null;
  }
}

// --- Notes API ---

function authHeaders() {
  const token = getToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
}

// PUBLIC_INTERFACE
export async function fetchNotes(query = "") {
  /** Fetch notes, with optional search query (by title/content). */
  let url = `${API_BASE}/notes`;
  if (query) url += `?q=${encodeURIComponent(query)}`;
  const r = await fetch(url, { headers: { ...authHeaders() } });
  if (!r.ok) throw new Error("Could not fetch notes.");
  return r.json();
}

// PUBLIC_INTERFACE
export async function fetchNote(id) {
  /** Fetch a single note by ID. */
  const r = await fetch(`${API_BASE}/notes/${id}`, { headers: { ...authHeaders() } });
  if (!r.ok) throw new Error("Could not fetch note.");
  return r.json();
}

// PUBLIC_INTERFACE
export async function createNote(data) {
  /** Create a new note (data: {title, content}) */
  const r = await fetch(`${API_BASE}/notes`, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...authHeaders() },
    body: JSON.stringify(data),
  });
  if (!r.ok) throw new Error("Could not create note.");
  return r.json();
}

// PUBLIC_INTERFACE
export async function updateNote(id, data) {
  /** Update note (data: {title, content}) */
  const r = await fetch(`${API_BASE}/notes/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json", ...authHeaders() },
    body: JSON.stringify(data),
  });
  if (!r.ok) throw new Error("Could not update note.");
  return r.json();
}

// PUBLIC_INTERFACE
export async function deleteNote(id) {
  /** Delete note by ID */
  const r = await fetch(`${API_BASE}/notes/${id}`, {
    method: "DELETE",
    headers: { ...authHeaders() },
  });
  if (!r.ok) throw new Error("Could not delete note.");
  return r.json();
}
