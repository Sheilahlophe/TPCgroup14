/**
 * Students Portal — Firebase Realtime Database helpers (REST API).
 * Project: student-s-portal-f5d1d
 * Collections: users, tasks, bookings, resources, gameScores, preferences
 */
import { firebaseConfig } from "./firebase-config.js";

const baseUrl = () => {
  const url = firebaseConfig.databaseURL?.replace(/\/$/, "");
  if (!url) {
    throw new Error("Missing databaseURL in src/js/firebase-config.js");
  }
  return url;
};

function authQuery(idToken) {
  return idToken ? `?auth=${encodeURIComponent(idToken)}` : "";
}

async function request(path, { method = "GET", body, idToken } = {}) {
  const response = await fetch(`${baseUrl()}${path}.json${authQuery(idToken)}`, {
    method,
    headers: body ? { "Content-Type": "application/json" } : undefined,
    body: body ? JSON.stringify(body) : undefined,
  });

  if (!response.ok) {
    const detail = await response.text();
    throw new Error(`Firebase ${method} ${path} failed (${response.status}): ${detail}`);
  }

  return response.json();
}

function nowIso() {
  return new Date().toISOString();
}

// --- Users ---

export async function saveUserProfile(uid, profile, idToken) {
  return request(`/users/${uid}`, {
    method: "PUT",
    body: {
      email: profile.email,
      displayName: profile.displayName,
      role: profile.role || "learner",
      createdAt: profile.createdAt || nowIso(),
    },
    idToken,
  });
}

export async function getUserProfile(uid, idToken) {
  return request(`/users/${uid}`, { idToken });
}

// --- Tasks ---

export async function createTask(task, idToken) {
  const payload = {
    userId: task.userId,
    title: task.title,
    category: task.category,
    dueDate: task.dueDate,
    priority: task.priority || "medium",
    status: task.status || "todo",
    createdAt: nowIso(),
    updatedAt: nowIso(),
  };
  return request("/tasks", { method: "POST", body: payload, idToken });
}

export async function getAllTasks(idToken) {
  return request("/tasks", { idToken });
}

export async function getTask(taskId, idToken) {
  return request(`/tasks/${taskId}`, { idToken });
}

export async function updateTask(taskId, updates, idToken) {
  return request(`/tasks/${taskId}`, {
    method: "PATCH",
    body: { ...updates, updatedAt: nowIso() },
    idToken,
  });
}

export async function deleteTask(taskId, idToken) {
  return request(`/tasks/${taskId}`, { method: "DELETE", idToken });
}

export function calculateProgress(tasksMap) {
  const tasks = Object.values(tasksMap || {});
  const total = tasks.length;
  const completed = tasks.filter((t) => t.status === "done").length;
  const outstanding = total - completed;
  const percentage = total === 0 ? 0 : Math.round((completed / total) * 100);

  return { total, completed, outstanding, percentage };
}

// --- Bookings ---

export async function createBooking(booking, idToken) {
  const payload = {
    learnerId: booking.learnerId,
    assessorId: booking.assessorId || null,
    topic: booking.topic,
    preferredDate: booking.preferredDate,
    status: booking.status || "pending",
    notes: booking.notes || "",
    createdAt: nowIso(),
  };
  return request("/bookings", { method: "POST", body: payload, idToken });
}

export async function getAllBookings(idToken) {
  return request("/bookings", { idToken });
}

export async function updateBooking(bookingId, updates, idToken) {
  return request(`/bookings/${bookingId}`, {
    method: "PATCH",
    body: updates,
    idToken,
  });
}

// --- Resources ---

export async function getAllResources(idToken) {
  return request("/resources", { idToken });
}

export async function createResource(resource, idToken) {
  return request("/resources", { method: "POST", body: resource, idToken });
}

// --- Game scores ---

export async function saveGameScore(scoreRecord, idToken) {
  const payload = {
    userId: scoreRecord.userId,
    score: scoreRecord.score,
    level: scoreRecord.level || 1,
    playedAt: nowIso(),
  };
  return request("/gameScores", { method: "POST", body: payload, idToken });
}

export async function getAllGameScores(idToken) {
  return request("/gameScores", { idToken });
}

// --- Preferences ---

export async function savePreferences(uid, preferences, idToken) {
  return request(`/preferences/${uid}`, {
    method: "PUT",
    body: {
      theme: preferences.theme || "light",
      taskFilter: preferences.taskFilter || "all",
    },
    idToken,
  });
}

export async function getPreferences(uid, idToken) {
  return request(`/preferences/${uid}`, { idToken });
}
