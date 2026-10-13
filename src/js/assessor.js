import { db } from "./firebase.js";
import {
  ref, onValue, update, push, set, remove, serverTimestamp, query, orderByChild, equalTo
} from "https://www.gstatic.com/firebasejs/12.2.1/firebase-database.js";
import { escapeHTML, formatDate, showMessage } from "./app.js";

// Build the assessor tools after the app confirms the user's role.
export function initAssessor() {
  let allTasks = [];
  let learnerProfiles = {};

  document.addEventListener("userReady", ({ detail }) => {
    const content = document.getElementById("pageContent");

    // Add booking controls, summary counts, task overview, and resource management.
    content.innerHTML = `
      <div class="page-header">
        <div>
          <h2>Assessor Dashboard</h2>
          <p class="muted">Manage learner support requests, tasks, and learning resources.</p>
        </div>
      </div>

      <div id="assessorMessage" class="message hidden"></div>

      <div class="grid stats">
        <div class="card"><div class="stat-label">Pending Bookings</div><div class="stat-value" id="pendingCount">0</div></div>
        <div class="card"><div class="stat-label">Total Bookings</div><div class="stat-value" id="bookingCount">0</div></div>
        <div class="card"><div class="stat-label">Resources</div><div class="stat-value" id="resourceCount">0</div></div>
        <div class="card"><div class="stat-label">Learners</div><div class="stat-value" id="learnerCount">0</div></div>
      </div>

      <section class="card" style="margin-top:18px;">
        <div class="page-header">
          <div>
            <h3>All Learner Tasks</h3>
            <p class="muted">Review every learner's current task list.</p>
          </div>
        </div>
        <div class="table-wrap">
          <table>
            <thead><tr><th>Learner</th><th>Task</th><th>Category</th><th>Priority</th><th>Due</th><th>Status</th></tr></thead>
            <tbody id="learnerTaskTable"></tbody>
          </table>
        </div>
      </section>

      <section class="card" style="margin-top:18px;">
        <div class="page-header">
          <div>
            <h3>Support Bookings</h3>
            <p class="muted">Update the status of learner requests.</p>
          </div>
        </div>
        <div class="table-wrap">
          <table>
            <thead><tr><th>Learner</th><th>Topic</th><th>Date</th><th>Status</th><th>Action</th></tr></thead>
            <tbody id="bookingTable"></tbody>
          </table>
        </div>
      </section>

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
                <option>Document</option><option>Link</option><option>Guide</option><option>Video</option>
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

    // Open and close the form used to add learning resources.
    const modal = document.getElementById("resourceModal");
    document.getElementById("newResourceBtn").addEventListener("click", () => modal.classList.remove("hidden"));
    document.getElementById("closeResource").addEventListener("click", () => modal.classList.add("hidden"));
    document.getElementById("cancelResource").addEventListener("click", () => modal.classList.add("hidden"));

    // Save a new learning resource created by this assessor.
    document.getElementById("resourceForm").addEventListener("submit", async event => {
      event.preventDefault();

      try {
        const resourceRef = push(ref(db, "resources"));
        await set(resourceRef, {
          title: document.getElementById("resourceTitle").value.trim(),
          type: document.getElementById("resourceType").value,
          description: document.getElementById("resourceDescription").value.trim(),
          category: document.getElementById("resourceCategory").value.trim(),
          url: document.getElementById("resourceUrl").value.trim(),
          createdBy: detail.user.uid,
          createdAt: serverTimestamp()
        });

        event.target.reset();
        modal.classList.add("hidden");
        showMessage(document.getElementById("assessorMessage"), "Resource added successfully.", "success");
      } catch (error) {
        console.error(error);
        showMessage(document.getElementById("assessorMessage"), "Could not add resource.", "error");
      }
    });

    const renderLearnerTasks = () => {
      const table = document.getElementById("learnerTaskTable");
      if (!table) return;

      const rows = allTasks
        .slice()
        .sort((a, b) => Number(b.createdAt || 0) - Number(a.createdAt || 0))
        .map(task => {
          const learner = learnerProfiles[task.userId] || {};
          const learnerName = learner.name || learner.email || "Unknown learner";
          const statusClass = task.status === "Completed" ? "success" : task.status === "In Progress" ? "warning" : "";

          return `
            <tr>
              <td>${escapeHTML(learnerName)}</td>
              <td>${escapeHTML(task.title || "Untitled task")}</td>
              <td>${escapeHTML(task.category || "General")}</td>
              <td>${escapeHTML(task.priority || "Medium")}</td>
              <td>${formatDate(task.dueDate)}</td>
              <td><span class="badge ${statusClass}">${escapeHTML(task.status || "Pending")}</span></td>
            </tr>
          `;
        })
        .join("");

      table.innerHTML = rows || `<tr><td colspan="6" class="empty">No learner tasks found.</td></tr>`;
    };

    onValue(ref(db, "tasks"), snapshot => {
      const stored = snapshot.val() || {};
      allTasks = Object.entries(stored)
        .map(([id, task]) => ({ id, ...task }))
        .filter(task => task && task.userId);
      renderLearnerTasks();
    });

    // Keep booking counts and the assessor's booking table up to date.
    onValue(ref(db, "bookings"), snapshot => {
      const all = snapshot.val() || {};
      const bookings = Object.entries(all).map(([id, item]) => ({ id, ...item }));
      document.getElementById("bookingCount").textContent = bookings.length;
      document.getElementById("pendingCount").textContent = bookings.filter(b => b.status === "Pending").length;

      document.getElementById("bookingTable").innerHTML = bookings.length
        ? bookings.sort((a,b) => Number(b.createdAt || 0) - Number(a.createdAt || 0)).map(item => `
          <tr>
            <td>${escapeHTML(item.learnerName || item.learnerId)}</td>
            <td>${escapeHTML(item.topic)}</td>
            <td>${formatDate(item.date)} ${escapeHTML(item.time || "")}</td>
            <td><span class="badge">${escapeHTML(item.status)}</span></td>
            <td>
              <select class="booking-status" data-id="${item.id}">
                ${["Pending","Approved","Completed","Cancelled"].map(s => `<option ${item.status === s ? "selected" : ""}>${s}</option>`).join("")}
              </select>
            </td>
          </tr>
        `).join("")
        : `<tr><td colspan="5" class="empty">No support bookings found.</td></tr>`;
    });

    // Save a new status when the assessor changes a booking.
    document.getElementById("bookingTable").addEventListener("change", async event => {
      if (!event.target.classList.contains("booking-status")) return;

      try {
        await update(ref(db, `bookings/${event.target.dataset.id}`), {
          status: event.target.value,
          updatedAt: serverTimestamp()
        });
        showMessage(document.getElementById("assessorMessage"), "Booking status updated.", "success");
      } catch (error) {
        console.error(error);
        showMessage(document.getElementById("assessorMessage"), "Could not update booking status.", "error");
      }
    });

    // Keep the resource list and resource count current.
    onValue(ref(db, "resources"), snapshot => {
      const all = snapshot.val() || {};
      const resources = Object.entries(all).map(([id, item]) => ({ id, ...item }));
      document.getElementById("resourceCount").textContent = resources.length;

      document.getElementById("resourceAdminList").innerHTML = resources.length
        ? resources.map(item => `
          <div class="item">
            <div class="item-head">
              <div>
                <h3>${escapeHTML(item.title)}</h3>
                <div class="meta"><span>${escapeHTML(item.type)}</span><span>${escapeHTML(item.category)}</span></div>
              </div>
              <button class="btn danger small delete-resource" data-id="${item.id}">Delete</button>
            </div>
            <p class="muted">${escapeHTML(item.description || "")}</p>
          </div>
        `).join("")
        : `<div class="empty">No resources yet.</div>`;
    });

    // Ask before removing a resource from the database.
    document.getElementById("resourceAdminList").addEventListener("click", async event => {
      const button = event.target.closest(".delete-resource");
      if (!button) return;

      if (!confirm("Delete this learning resource?")) return;

      try {
        await remove(ref(db, `resources/${button.dataset.id}`));
        showMessage(document.getElementById("assessorMessage"), "Resource deleted.", "success");
      } catch (error) {
        console.error(error);
        showMessage(document.getElementById("assessorMessage"), "Could not delete resource.", "error");
      }
    });

    // Count learner accounts for the assessor summary.
    const learnersQuery = query(
      ref(db, "users"),
      orderByChild("role"),
      equalTo("learner")
    );

    onValue(learnersQuery, snapshot => {
      learnerProfiles = snapshot.val() || {};
      document.getElementById("learnerCount").textContent = Object.keys(learnerProfiles).length;
      renderLearnerTasks();
    });
  });
}
