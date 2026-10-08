// Connect to the Firebase Realtime Database
import { db } from "./firebase.js";

import {
  ref, onValue, update, push, set, remove, serverTimestamp, query, orderByChild, equalTo
} from "https://www.gstatic.com/firebasejs/12.2.1/firebase-database.js";

// Import helper functions used to display data and messages
import { escapeHTML, formatDate, showMessage } from "./app.js";


// Start the assessor dashboard
export function initAssessor() {

  // Wait until the logged-in user's information is ready
  document.addEventListener("userReady", ({ detail }) => {

    // Get the area where the assessor dashboard will be displayed
    const content = document.getElementById("pageContent");

    // Create the assessor dashboard and its sections
    content.innerHTML = `
      <div class="page-header">
        <div>
          <h2>Assessor Dashboard</h2>
          <p class="muted">Manage learner support requests and learning resources.</p>
        </div>
      </div>

      <!-- Area used to display success and error messages -->
      <div id="assessorMessage" class="message hidden"></div>

      <!-- Dashboard statistics -->
      <div class="grid stats">
        <div class="card"><div class="stat-label">Pending Bookings</div><div class="stat-value" id="pendingCount">0</div></div>
        <div class="card"><div class="stat-label">Total Bookings</div><div class="stat-value" id="bookingCount">0</div></div>
        <div class="card"><div class="stat-label">Resources</div><div class="stat-value" id="resourceCount">0</div></div>
        <div class="card"><div class="stat-label">Learners</div><div class="stat-value" id="learnerCount">0</div></div>
      </div>

      <!-- Display learner support bookings -->
      <section class="card" style="margin-top:18px;">
        <div class="page-header">
          <div>
            <h3>Support Bookings</h3>
            <p class="muted">Update the status of learner requests.</p>
          </div>
        </div>

        <div class="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Learner</th>
                <th>Topic</th>
                <th>Date</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody id="bookingTable"></tbody>
          </table>
        </div>
      </section>

      <!-- Section for managing learning resources -->
      <section class="card" style="margin-top:18px;">
        <div class="page-header">
          <div>
            <h3>Manage Learning Resources</h3>
            <p class="muted">Only authorised assessors can add or delete resources.</p>
          </div>

          <button class="btn primary" id="newResourceBtn">+ Add Resource</button>
        </div>

        <div id="resourceAdminList" class="resource-list"></div>
      </section>

      <!-- Form used to add a new learning resource -->
      <div id="resourceModal" class="modal-backdrop hidden">
        <div class="modal">
          <div class="modal-head">
            <h3>Add Learning Resource</h3>
            <button class="close" id="closeResource">&times;</button>
          </div>

          <form id="resourceForm" class="form-grid">

            <label class="full-span">Title
              <input id="resourceTitle" maxlength="150" required>
            </label>

            <label>Type
              <select id="resourceType" required>
                <option>Document</option>
                <option>Link</option>
                <option>Guide</option>
                <option>Video</option>
              </select>
            </label>

            <label>Category
              <input id="resourceCategory" maxlength="80" required placeholder="e.g. JavaScript">
            </label>

            <label class="full-span">Description
              <textarea id="resourceDescription" maxlength="1000" required></textarea>
            </label>

            <label class="full-span">Resource URL
              <input id="resourceUrl" type="url" placeholder="https://example.com/resource">
            </label>

            <div class="actions full-span">
              <button class="btn secondary" type="button" id="cancelResource">Cancel</button>
              <button class="btn primary" type="submit">Save Resource</button>
            </div>

          </form>
        </div>
      </div>
    `;


    // Get the resource form modal
    const modal = document.getElementById("resourceModal");

    // Open the resource form
    document.getElementById("newResourceBtn").addEventListener("click", () => {
      modal.classList.remove("hidden");
    });

    // Close the resource form
    document.getElementById("closeResource").addEventListener("click", () => {
      modal.classList.add("hidden");
    });

    // Cancel adding a resource
    document.getElementById("cancelResource").addEventListener("click", () => {
      modal.classList.add("hidden");
    });


    // Save a new learning resource to Firebase
    document.getElementById("resourceForm").addEventListener("submit", async event => {

      event.preventDefault();

      try {

        // Create a new resource entry in the database
        const resourceRef = push(ref(db, "resources"));

        // Save the resource information
        await set(resourceRef, {
          title: document.getElementById("resourceTitle").value.trim(),
          type: document.getElementById("resourceType").value,
          description: document.getElementById("resourceDescription").value.trim(),
          category: document.getElementById("resourceCategory").value.trim(),
          url: document.getElementById("resourceUrl").value.trim(),

          // Store the ID of the assessor who created the resource
          createdBy: detail.user.uid,

          // Store the time the resource was created
          createdAt: serverTimestamp()
        });

        // Clear the form after saving
        event.target.reset();

        // Close the modal
        modal.classList.add("hidden");

        // Tell the assessor that the resource was added
        showMessage(
          document.getElementById("assessorMessage"),
          "Resource added successfully.",
          "success"
        );

      } catch (error) {

        // Display the error in the browser console
        console.error(error);

        // Show an error message to the assessor
        showMessage(
          document.getElementById("assessorMessage"),
          "Could not add resource.",
          "error"
        );
      }
    });


    // Listen for changes to support bookings in Firebase
    onValue(ref(db, "bookings"), snapshot => {

      // Get all bookings from Firebase
      const all = snapshot.val() || {};

      // Convert the Firebase data into an array
      const bookings = Object.entries(all).map(([id, item]) => ({
        id,
        ...item
      }));

      // Update the total number of bookings
      document.getElementById("bookingCount").textContent = bookings.length;

      // Count bookings that are still pending
      document.getElementById("pendingCount").textContent =
        bookings.filter(b => b.status === "Pending").length;


      // Display the bookings in the table
      document.getElementById("bookingTable").innerHTML = bookings.length

        ? bookings
            // Show the newest bookings first
            .sort((a, b) =>
              Number(b.createdAt || 0) - Number(a.createdAt || 0)
            )

            .map(item => `
              <tr>
                <td>${escapeHTML(item.learnerName || item.learnerId)}</td>
                <td>${escapeHTML(item.topic)}</td>
                <td>${formatDate(item.date)} ${escapeHTML(item.time || "")}</td>
                <td>
                  <span class="badge">
                    ${escapeHTML(item.status)}
                  </span>
                </td>

                <td>
                  <select class="booking-status" data-id="${item.id}">
                    ${["Pending","Approved","Completed","Cancelled"]
                      .map(s =>
                        `<option ${item.status === s ? "selected" : ""}>${s}</option>`
                      )
                      .join("")}
                  </select>
                </td>
              </tr>
            `)
            .join("")

        : `<tr>
             <td colspan="5" class="empty">
               No support bookings found.
             </td>
           </tr>`;
    });


    // Listen for changes to a booking's status
    document.getElementById("bookingTable").addEventListener("change", async event => {

      // Only continue when the booking status dropdown is changed
      if (!event.target.classList.contains("booking-status")) return;

      try {

        // Update the booking status in Firebase
        await update(
          ref(db, `bookings/${event.target.dataset.id}`),
          {
            status: event.target.value,
            updatedAt: serverTimestamp()
          }
        );

        // Tell the assessor that the update was successful
        showMessage(
          document.getElementById("assessorMessage"),
          "Booking status updated.",
          "success"
        );

      } catch (error) {

        // Display the error in the console
        console.error(error);

        // Show an error message to the assessor
        showMessage(
          document.getElementById("assessorMessage"),
          "Could not update booking status.",
          "error"
        );
      }
    });


    // Listen for learning resources stored in Firebase
    onValue(ref(db, "resources"), snapshot => {

      // Get all resources from Firebase
      const all = snapshot.val() || {};

      // Convert the Firebase data into an array
      const resources = Object.entries(all).map(([id, item]) => ({
        id,
        ...item
      }));

      // Update the number of resources shown on the dashboard
      document.getElementById("resourceCount").textContent = resources.length;


      // Display the resources
      document.getElementById("resourceAdminList").innerHTML = resources.length

        ? resources.map(item => `
            <div class="item">

              <div class="item-head">
                <div>
                  <h3>${escapeHTML(item.title)}</h3>

                  <div class="meta">
                    <span>${escapeHTML(item.type)}</span>
                    <span>${escapeHTML(item.category)}</span>
                  </div>
                </div>

                <!-- Button used to delete a resource -->
                <button
                  class="btn danger small delete-resource"
                  data-id="${item.id}">
                  Delete
                </button>
              </div>

              <p class="muted">
                ${escapeHTML(item.description || "")}
              </p>

            </div>
          `).join("")

        : `<div class="empty">No resources yet.</div>`;
    });


    // Handle deleting a learning resource
    document.getElementById("resourceAdminList").addEventListener("click", async event => {

      // Find the delete button that was clicked
      const button = event.target.closest(".delete-resource");

      if (!button) return;

      // Ask the assessor to confirm before deleting
      if (!confirm("Delete this learning resource?")) return;

      try {

        // Remove the selected resource from Firebase
        await remove(
          ref(db, `resources/${button.dataset.id}`)
        );

        // Show a success message
        showMessage(
          document.getElementById("assessorMessage"),
          "Resource deleted.",
          "success"
        );

      } catch (error) {

        // Display the error in the console
        console.error(error);

        // Show an error message
        showMessage(
          document.getElementById("assessorMessage"),
          "Could not delete resource.",
          "error"
        );
      }
    });


    // Find all users whose role is learner
    const learnersQuery = query(
      ref(db, "users"),
      orderByChild("role"),
      equalTo("learner")
    );


    // Update the learner count when the user data changes
    onValue(learnersQuery, snapshot => {

      document.getElementById("learnerCount").textContent =
        snapshot.size;

    });

  });
}