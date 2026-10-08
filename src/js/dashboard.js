// Import Firebase Authentication and Realtime Database
import { auth, db } from "./firebase.js";

// Import Firebase functions used to read learner tasks
import {
  ref, onValue, query, orderByChild, equalTo
} from "https://www.gstatic.com/firebasejs/12.2.1/firebase-database.js";

// Import helper functions used to safely display text and format dates
import { escapeHTML, formatDate } from "./app.js";


// Start the learner dashboard
export function initDashboard() {

  // Wait for the logged-in user's information to be ready
  document.addEventListener("userReady", ({ detail }) => {

    // Get the current user and their profile information
    const { user, profile } = detail;

    // Find the area where the dashboard will be displayed
    const content = document.getElementById("pageContent");


    // Create the learner dashboard content
    content.innerHTML = `
      <div class="page-header">
        <div>
          <h2>Welcome, ${escapeHTML(profile.name)}</h2>
          <p class="muted">Here is an overview of your learning activity.</p>
        </div>

        <!-- Button used to print the learner's progress -->
        <button class="btn secondary no-print" id="printProgress">Print Progress</button>
      </div>


      <!-- Display the learner's task statistics -->
      <div class="grid stats">

        <!-- Show the total number of tasks -->
        <div class="card">
          <div class="stat-label">Total Tasks</div>
          <div class="stat-value" id="totalTasks">0</div>
        </div>

        <!-- Show the number of completed tasks -->
        <div class="card">
          <div class="stat-label">Completed</div>
          <div class="stat-value" id="completedTasks">0</div>
        </div>

        <!-- Show the number of outstanding tasks -->
        <div class="card">
          <div class="stat-label">Outstanding</div>
          <div class="stat-value" id="outstandingTasks">0</div>
        </div>

        <!-- Show the number of overdue tasks -->
        <div class="card">
          <div class="stat-label">Overdue</div>
          <div class="stat-value" id="overdueTasks">0</div>
        </div>

      </div>


      <!-- Display overall progress and recent tasks -->
      <div class="grid" style="margin-top:18px;">

        <!-- Overall progress section -->
        <section class="card">
          <div class="page-header">
            <div>
              <h3>Overall Progress</h3>
              <p class="muted">Calculated from your actual task data.</p>
            </div>

            <!-- Display the progress percentage -->
            <strong id="progressPercent">0%</strong>
          </div>

          <!-- Progress bar -->
          <div class="progress-track">
            <div class="progress-fill" id="progressFill" style="width:0%"></div>
          </div>
        </section>


        <!-- Recent tasks section -->
        <section class="card">
          <h3>Recent Tasks</h3>

          <!-- Recent tasks will be displayed here -->
          <div id="recentTasks" class="task-list"></div>
        </section>

      </div>
    `;


    // Allow the learner to print their progress
    document.getElementById("printProgress").addEventListener("click", () => window.print());


    // Find only the tasks that belong to the logged-in learner
    const learnerTasks = query(
      ref(db, "tasks"),
      orderByChild("userId"),
      equalTo(user.uid)
    );


    // Listen for changes to the learner's tasks in Firebase
    onValue(learnerTasks, snapshot => {

      // Get all task data from Firebase
      const all = snapshot.val() || {};

      // Convert the Firebase task data into an array
      const tasks = Object.entries(all)
        .map(([id, task]) => ({ id, ...task }));


      // Get today's date
      const today = new Date();

      // Set the time to midnight so only the date is compared
      today.setHours(0, 0, 0, 0);


      // Count the tasks that have been completed
      const completed = tasks.filter(t => t.status === "Completed").length;

      // Calculate the number of tasks that are still outstanding
      const outstanding = tasks.length - completed;


      // Count tasks that have passed their due date
      const overdue = tasks.filter(t => {

        // Completed tasks and tasks without a due date are not overdue
        if (t.status === "Completed" || !t.dueDate) return false;

        // Create a date using the task's due date
        const d = new Date(`${t.dueDate}T23:59:59`);

        // Check if the due date has already passed
        return d < today;

      }).length;


      // Calculate the learner's overall progress percentage
      const progress = tasks.length
        ? Math.round((completed / tasks.length) * 100)
        : 0;


      // Update the task statistics on the dashboard
      document.getElementById("totalTasks").textContent = tasks.length;
      document.getElementById("completedTasks").textContent = completed;
      document.getElementById("outstandingTasks").textContent = outstanding;
      document.getElementById("overdueTasks").textContent = overdue;


      // Update the progress percentage
      document.getElementById("progressPercent").textContent = `${progress}%`;

      // Update the width of the progress bar
      document.getElementById("progressFill").style.width = `${progress}%`;


      // Get the five most recently created tasks
      const recent = tasks
        .sort((a, b) => Number(b.createdAt || 0) - Number(a.createdAt || 0))
        .slice(0, 5);


      // Display the recent tasks on the dashboard
      document.getElementById("recentTasks").innerHTML = recent.length

        ? recent.map(task => `
          <div class="item">

            <div class="item-head">

              <!-- Display the task title -->
              <h3>${escapeHTML(task.title)}</h3>

              <!-- Display the current task status -->
              <span class="badge ${task.status === "Completed" ? "success" : ""}">
                ${escapeHTML(task.status)}
              </span>

            </div>

            <!-- Display task information -->
            <div class="meta">
              <span>${escapeHTML(task.category)}</span>
              <span>Priority: ${escapeHTML(task.priority)}</span>
              <span>Due: ${formatDate(task.dueDate)}</span>
            </div>

          </div>
        `).join("")

        // Display this message when the learner has no tasks
        : `<div class="empty">No tasks yet. Create your first learning task.</div>`;
    });
  });
}