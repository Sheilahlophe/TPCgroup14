import { onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/12.2.1/firebase-auth.js";
import { get, ref } from "https://www.gstatic.com/firebasejs/12.2.1/firebase-database.js";
import { auth, db, firebaseConfigured } from "./firebase.js";

// Escape text before placing it inside generated HTML.
export function escapeHTML(value) {
  return String(value ?? "").replace(/[&<>"']/g, character => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;"
  })[character]);
}

// Turn a date value into a readable date, or show a safe fallback.
export function formatDate(value) {
  if (!value) return "Not set";
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? "Not set" : date.toLocaleDateString();
}

// Display a styled status message on the page.
export function showMessage(element, text, type = "info") {
  if (!element) return;
  element.textContent = text;
  element.className = `message ${type}`;
}

const loadingState = `
  <div class="loading-state" role="status" aria-live="polite">
    <span class="loading-spinner" aria-hidden="true"></span>
    <span>Loading page...</span>
  </div>
`;

// Tell the user why app pages cannot load without Firebase settings.
function showSetupMessage() {
  const app = document.getElementById("app");
  if (app) {
    app.innerHTML = `<main class="content"><div class="message error">Firebase is not configured. Add your Firebase Web App settings to js/firebase.js, then reload this page.</div></main>`;
  }
}

// Build the navigation, page heading, and signed-in user controls.
export function renderShell(activePage) {
  if (!firebaseConfigured) {
    showSetupMessage();
    return;
  }

  const labels = {
    dashboard: "Dashboard",
    tasks: "Learning Tasks",
    booking: "Support Booking",
    resources: "Resources",
    assessor: "Assessor Dashboard"
  };
  const app = document.getElementById("app");

  app.innerHTML = `
    <div class="app-layout">
      <aside class="sidebar">
        <div class="sidebar-brand">Learner Support</div>
        <nav class="nav" aria-label="Main navigation">
          <a href="dashboard.html" data-role="learner">Dashboard</a>
          <a href="tasks.html" data-role="learner">Learning Tasks</a>
          <a href="booking.html" data-role="learner">Support Booking</a>
          <a href="resources.html">Resources and Game</a>
          <a href="assessor.html" data-role="assessor">Assessor Dashboard</a>
        </nav>
      </aside>
      <main class="main">
        <header class="topbar">
          <h1>${escapeHTML(labels[activePage] || "Learner Support System")}</h1>
          <div class="user-area">
            <span id="profileName"></span>
            <span class="email" id="profileEmail"></span>
            <button class="btn secondary" id="signOutButton" type="button">Sign Out</button>
          </div>
        </header>
        <section class="content" id="pageContent">${loadingState}</section>
      </main>
    </div>
  `;

  document.querySelectorAll(".nav a").forEach(link => {
    if (link.getAttribute("href") === `${activePage}.html`) link.classList.add("active");
  });

  document.getElementById("signOutButton").addEventListener("click", async () => {
    try {
      await signOut(auth);
      window.location.assign("index.html");
    } catch (error) {
      showMessage(document.getElementById("pageContent"), `Could not sign out (${error.code || "unknown error"}).`);
    }
  });
}

// Check the signed-in user and profile before showing protected content.
export function requireAuth(requiredRole) {
  if (!firebaseConfigured) {
    showSetupMessage();
    return;
  }

  onAuthStateChanged(auth, async user => {
    if (!user) {
      window.location.replace("index.html");
      return;
    }

    try {
      const profileSnapshot = await get(ref(db, `users/${user.uid}`));
      if (!profileSnapshot.exists()) {
        showMessage(document.getElementById("pageContent"), "Your account profile could not be found. Sign in again or contact an administrator.", "error");
        await signOut(auth);
        return;
      }

      const profile = profileSnapshot.val();
      if (requiredRole && profile.role !== requiredRole) {
        window.location.replace(profile.role === "assessor" ? "assessor.html" : "dashboard.html");
        return;
      }

      document.getElementById("profileName").textContent = profile.name || user.displayName || "";
      document.getElementById("profileEmail").textContent = user.email || "";
      document.querySelectorAll(".nav a[data-role]").forEach(link => {
        link.classList.toggle("hidden", link.dataset.role !== profile.role);
      });
      document.dispatchEvent(new CustomEvent("userReady", { detail: { user, profile } }));
    } catch (error) {
      showMessage(document.getElementById("pageContent"), `Could not load your account profile (${error.code || "unknown error"}).`, "error");
    }
  });
}
