// Import Firebase Authentication and Realtime Database
import { auth, db } from "./firebase.js";

// Import Firebase functions used to check the user's login status and sign out
import {
  onAuthStateChanged,
  signOut
} from "https://www.gstatic.com/firebasejs/12.2.1/firebase-auth.js";

// Import Firebase functions used to read user profile information
import {
  ref, get
} from "https://www.gstatic.com/firebasejs/12.2.1/firebase-database.js";


// Store the profile of the currently logged-in user
let currentProfile = null;


// Return the current user's profile
export function getCurrentProfile() {
  return currentProfile;
}


// Display a message to the user
export function showMessage(target, text, type = "info") {

  // Stop if the message area does not exist
  if (!target) return;

  // Set the message text
  target.textContent = text;

  // Set the message type for styling
  target.className = `message ${type}`;
}


// Protect text before displaying it as HTML
export function escapeHTML(value = "") {
  return String(value).replace(/[&<>"']/g, char => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#039;"
  }[char]));
}


// Format a date so it is easier to read
export function formatDate(value) {

  // Show a dash when there is no date
  if (!value) return "—";

  // Create a JavaScript date
  const d = new Date(value);

  // Return the original value if the date is not valid
  if (Number.isNaN(d.getTime())) return value;

  // Return the date in the user's normal date format
  return d.toLocaleDateString();
}


// Create the common layout used by the portal pages
export function renderShell(active = "") {

  // Find the main application container
  const app = document.getElementById("app");

  // Stop if the application container does not exist
  if (!app) return;


  // List the pages that can appear in the portal navigation
  const nav = [
    ["dashboard.html", "Dashboard", "dashboard"],
    ["tasks.html", "Tasks", "tasks"],
    ["booking.html", "Support Booking", "booking"],
    ["resources.html", "Resources & Game", "resources"],
    ["assessor.html", "Assessor", "assessor"]
  ];


  // Create the main portal layout
  app.innerHTML = `
    <div class="app-layout">

      <!-- Sidebar containing the system name and navigation -->
      <aside class="sidebar">

        <!-- Name of the system -->
        <div class="sidebar-brand">Learner Support System</div>

        <!-- Display the logged-in user's role -->
        <div class="role" id="sideRole">Loading role...</div>

        <!-- Main navigation links -->
        <nav class="nav">

          <!-- Create a link for each page in the navigation -->
          ${nav.map(([href, label, key]) =>
            `<a class="${active === key ? "active" : ""}" data-role-link="${key}" href="${href}">${label}</a>`
          ).join("")}

        </nav>
      </aside>


      <!-- Main section of the portal -->
      <section class="main">

        <!-- Top section containing the page title and user information -->
        <header class="topbar">

          <!-- Main system title -->
          <h1 id="pageTitle">Learner Support System</h1>

          <!-- Logged-in user's information and sign-out button -->
          <div class="user-area">

            <!-- Display the user's email -->
            <span class="email" id="userEmail"></span>

            <!-- Sign-out button -->
            <button class="btn secondary small" id="logoutBtn">Sign out</button>

          </div>
        </header>


        <!-- Individual page content is loaded into this area -->
        <main class="content" id="pageContent"></main>

      </section>

    </div>
  `;


  // Handle the sign-out button
  document.getElementById("logoutBtn").addEventListener("click", async () => {

    // Sign the current user out of Firebase Authentication
    await signOut(auth);

    // Return the user to the login page
    window.location.href = "index.html";
  });
}


// Check whether the user is logged in and has the correct role
export function requireAuth(requiredRole = null) {

  // Listen for changes to the user's Firebase login status
  onAuthStateChanged(auth, async user => {

    // If there is no logged-in user, return to the login page
    if (!user) {
      window.location.replace("index.html");
      return;
    }


    try {

      // Get the user's profile from the Firebase Realtime Database
      const snap = await get(ref(db, `users/${user.uid}`));


      // If the user profile does not exist, sign them out
      if (!snap.exists()) {
        await signOut(auth);
        window.location.replace("index.html");
        return;
      }


      // Store the user's profile information
      currentProfile = snap.val();


      // Check whether the user has the required role
      if (requiredRole && currentProfile.role !== requiredRole) {

        // Send the user to the correct dashboard based on their role
        window.location.replace(
          currentProfile.role === "assessor" ? "assessor.html" : "dashboard.html"
        );

        return;
      }


      // Find the area where the user's email will be displayed
      const emailEl = document.getElementById("userEmail");

      // Find the area where the user's role will be displayed
      const roleEl = document.getElementById("sideRole");


      // Display the logged-in user's email
      if (emailEl) emailEl.textContent = user.email || "";

      // Display the user's role
      if (roleEl) roleEl.textContent = `Role: ${currentProfile.role}`;


      // Tell the rest of the application that the user's information is ready
      document.dispatchEvent(new CustomEvent("userReady", {
        detail: { user, profile: currentProfile }
      }));


    } catch (error) {

      // Display the error in the browser console
      console.error(error);

      // Return the user to the login page if something goes wrong
      window.location.replace("index.html");
    }
  });
}