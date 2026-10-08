// Import Firebase Authentication and Realtime Database
import { auth, db } from "./firebase.js";

// Import Firebase functions used to create, read, update and delete tasks
import {
  ref, push, set, update, remove, onValue, serverTimestamp, query, orderByChild, equalTo
} from "https://www.gstatic.com/firebasejs/12.2.1/firebase-database.js";

// Import helper functions used to display tasks and messages
import { escapeHTML, formatDate, showMessage } from "./app.js";


// Store all tasks belonging to the current learner
let tasks = [];

// Store the ID of the task currently being edited
let editingId = null;


// Start the task management functionality
export function initTasks() {

  // Wait until the logged-in user's information is ready
  document.addEventListener("userReady", ({ detail }) => {

    // Get the current logged-in learner
    const user = detail.user;

    // Find the area where the task page will be displayed
    const content = document.getElementById("pageContent");


    // Create the task management page
    content.innerHTML = `
      <div class="page-header">
        <div>
          <h2>Learning Tasks</h2>
          <p class="muted">Create, update, complete, search and manage your tasks.</p>
        </div>

        <!-- Button used to create a new task -->
        <button class="btn primary" id="newTaskBtn">+ New Task</button>
      </div>


      <!-- Area used to display task messages -->
      <div id="taskMessage" class="message hidden"></div>


      <!-- Main task section -->
      <section class="card">

        <!-- Search and filter controls -->
        <div class="toolbar">

          <!-- Search tasks by title or description -->
          <input
            id="taskSearch"
            type="search"
            placeholder="Search title or description..."
          >

          <!-- Filter tasks by status -->
          <select id="statusFilter">
            <option value="">All statuses</option>
            <option>Pending</option>
            <option>In Progress</option>
            <option>Completed</option>
          </select>

          <!-- Filter tasks by priority -->
          <select id="priorityFilter">
            <option value="">All priorities</option>
            <option>Low</option>
            <option>Medium</option>
            <option>High</option>
          </select>

        </div>


        <!-- Tasks will be displayed here -->
        <div id="taskList" class="task-list"></div>

      </section>


      <!-- Task form modal -->
      <div id="taskModal" class="modal-backdrop hidden">

        <div class="modal">

          <!-- Modal heading and close button -->
          <div class="modal-head">
            <h3 id="modalTitle">New Task</h3>
            <button class="close" id="closeModal">&times;</button>
          </div>


          <!-- Form used to create or edit a task -->
          <form id="taskForm" class="form-grid">

            <!-- Task title -->
            <label class="full-span">
              Task title
              <input id="taskTitle" maxlength="150" required>
            </label>

            <!-- Task description -->
            <label class="full-span">
              Description
              <textarea id="taskDescription" maxlength="1000" required></textarea>
            </label>

            <!-- Task category -->
            <label>
              Category
              <input
                id="taskCategory"
                maxlength="80"
                required
                placeholder="e.g. JavaScript"
              >
            </label>

            <!-- Task priority -->
            <label>
              Priority
              <select id="taskPriority" required>
                <option>Low</option>
                <option selected>Medium</option>
                <option>High</option>
              </select>
            </label>

            <!-- Task due date -->
            <label>
              Due date
              <input id="taskDueDate" type="date" required>
            </label>

            <!-- Task status -->
            <label>
              Status
              <select id="taskStatus" required>
                <option>Pending</option>
                <option>In Progress</option>
                <option>Completed</option>
              </select>
            </label>


            <!-- Form action buttons -->
            <div class="actions full-span">

              <!-- Cancel task creation or editing -->
              <button
                class="btn secondary"
                type="button"
                id="cancelTask"
              >
                Cancel
              </button>

              <!-- Save the task -->
              <button class="btn primary" type="submit">
                Save Task
              </button>

            </div>

          </form>

        </div>
      </div>
    `;


    // Get the task modal
    const modal = document.getElementById("taskModal");


    // Open the modal for creating a new task or editing an existing task
    const openModal = (task = null) => {

      // Store the task ID when editing an existing task
      editingId = task?.id || null;

      // Change the modal title depending on whether we are creating or editing
      document.getElementById("modalTitle").textContent =
        editingId ? "Edit Task" : "New Task";

      // Fill in the existing task information when editing
      document.getElementById("taskTitle").value = task?.title || "";
      document.getElementById("taskDescription").value = task?.description || "";
      document.getElementById("taskCategory").value = task?.category || "";
      document.getElementById("taskPriority").value = task?.priority || "Medium";
      document.getElementById("taskDueDate").value = task?.dueDate || "";
      document.getElementById("taskStatus").value = task?.status || "Pending";

      // Show the modal
      modal.classList.remove("hidden");
    };


    // Close the task modal
    const closeModal = () => {

      // Hide the modal
      modal.classList.add("hidden");

      // Clear the editing task ID
      editingId = null;
    };


    // Open the modal when the New Task button is clicked
    document.getElementById("newTaskBtn")
      .addEventListener("click", () => openModal());

    // Close the modal using the X button
    document.getElementById("closeModal")
      .addEventListener("click", closeModal);

    // Close the modal using the Cancel button
    document.getElementById("cancelTask")
      .addEventListener("click", closeModal);


    // Update the task list when the learner searches
    document.getElementById("taskSearch")
      .addEventListener("input", renderTasks);

    // Update the task list when the status filter changes
    document.getElementById("statusFilter")
      .addEventListener("change", renderTasks);

    // Update the task list when the priority filter changes
    document.getElementById("priorityFilter")
      .addEventListener("change", renderTasks);


    // Handle creating or updating a task
    document.getElementById("taskForm")
      .addEventListener("submit", async event => {

        // Prevent the page from refreshing
        event.preventDefault();


        // Collect the information entered into the form
        const data = {
          title: document.getElementById("taskTitle").value.trim(),
          description: document.getElementById("taskDescription").value.trim(),
          category: document.getElementById("taskCategory").value.trim(),
          priority: document.getElementById("taskPriority").value,
          dueDate: document.getElementById("taskDueDate").value,
          status: document.getElementById("taskStatus").value
        };


        try {

          // Check if an existing task is being edited
          if (editingId) {

            // Update the existing task in Firebase
            await update(ref(db, `tasks/${editingId}`), {
              ...data,
              updatedAt: serverTimestamp()
            });

            // Tell the learner that the task was updated
            showMessage(
              document.getElementById("taskMessage"),
              "Task updated successfully.",
              "success"
            );

          } else {

            // Create a new task location in Firebase
            const taskRef = push(ref(db, "tasks"));


            // Save the new task
            await set(taskRef, {
              ...data,

              // Link the task to the logged-in learner
              userId: user.uid,

              // Store when the task was created
              createdAt: serverTimestamp(),

              // Store when the task was last updated
              updatedAt: serverTimestamp()
            });


            // Tell the learner that the task was created
            showMessage(
              document.getElementById("taskMessage"),
              "Task created successfully.",
              "success"
            );
          }


          // Close the modal after saving
          closeModal();

        } catch (error) {

          // Display the error in the browser console
          console.error(error);

          // Tell the learner that the task could not be saved
          showMessage(
            document.getElementById("taskMessage"),
            "Could not save the task. Check your Firebase rules/configuration.",
            "error"
          );
        }
      });


    // Find only the tasks belonging to the current learner
    const learnerTasks = query(
      ref(db, "tasks"),
      orderByChild("userId"),
      equalTo(user.uid)
    );


    // Listen for changes to the learner's tasks in Firebase
    onValue(learnerTasks, snapshot => {

      // Get the task data from Firebase
      const data = snapshot.val() || {};

      // Convert Firebase task data into an array
      tasks = Object.entries(data)
        .map(([id, task]) => ({ id, ...task }));

      // Display the tasks
      renderTasks();
    });


    // Handle buttons inside the task list
    document.getElementById("taskList")
      .addEventListener("click", async event => {

        // Find the button that was clicked
        const button = event.target.closest("button[data-action]");

        // Stop if the clicked element is not a task action button
        if (!button) return;


        // Get the task ID from the button
        const id = button.dataset.id;

        // Find the task using its ID
        const task = tasks.find(t => t.id === id);

        // Stop if the task cannot be found
        if (!task) return;


        // Handle editing a task
        if (button.dataset.action === "edit") {
          openModal(task);
        }


        // Handle deleting a task
        if (button.dataset.action === "delete") {

          // Ask the learner to confirm before deleting
          if (!confirm(`Delete "${task.title}"? This action cannot be undone.`)) return;

          try {

            // Remove the task from Firebase
            await remove(ref(db, `tasks/${id}`));

            // Tell the learner that the task was deleted
            showMessage(
              document.getElementById("taskMessage"),
              "Task deleted successfully.",
              "success"
            );

          } catch (error) {

            // Display the error in the browser console
            console.error(error);

            // Tell the learner that the task could not be deleted
            showMessage(
              document.getElementById("taskMessage"),
              "Task deletion failed.",
              "error"
            );
          }
        }


        // Handle completing or reopening a task
        if (button.dataset.action === "toggle") {

          try {

            // Change the task between Completed and Pending
            await update(ref(db, `tasks/${id}`), {
              status: task.status === "Completed"
                ? "Pending"
                : "Completed",

              // Store when the task was updated
              updatedAt: serverTimestamp()
            });

          } catch (error) {

            // Display the error in the browser console
            console.error(error);

            // Tell the learner that the status could not be changed
            showMessage(
              document.getElementById("taskMessage"),
              "Could not update task status.",
              "error"
            );
          }
        }
      });
  });
}


// Display the learner's tasks
function renderTasks() {

  // Find the area where tasks will be displayed
  const list = document.getElementById("taskList");

  // Stop if the task list does not exist
  if (!list) return;


  // Get the search text entered by the learner
  const search = (
    document.getElementById("taskSearch")?.value || ""
  ).toLowerCase();

  // Get the selected status filter
  const status =
    document.getElementById("statusFilter")?.value || "";

  // Get the selected priority filter
  const priority =
    document.getElementById("priorityFilter")?.value || "";


  // Filter the tasks based on search, status and priority
  const filtered = tasks.filter(task => {

    // Combine task information so it can be searched
    const haystack =
      `${task.title} ${task.description} ${task.category}`.toLowerCase();

    // Return tasks that match all selected filters
    return (!search || haystack.includes(search))
      && (!status || task.status === status)
      && (!priority || task.priority === priority);
  });


  // Display the filtered tasks
  list.innerHTML = filtered.length

    ? filtered.map(task => `
      <article class="item">

        <div class="item-head">

          <div>

            <!-- Display the task title -->
            <h3>${escapeHTML(task.title)}</h3>

            <!-- Display the task description -->
            <p class="muted">${escapeHTML(task.description)}</p>

          </div>


          <!-- Display the current task status -->
          <span class="badge ${
            task.status === "Completed"
              ? "success"
              : task.priority === "High"
                ? "danger"
                : "warning"
          }">
            ${escapeHTML(task.status)}
          </span>

        </div>


        <!-- Display task information -->
        <div class="meta">
          <span>Category: ${escapeHTML(task.category)}</span>
          <span>Priority: ${escapeHTML(task.priority)}</span>
          <span>Due: ${formatDate(task.dueDate)}</span>
        </div>


        <!-- Task action buttons -->
        <div class="actions">

          <!-- Complete or reopen the task -->
          <button
            class="btn small success"
            data-action="toggle"
            data-id="${task.id}"
          >
            ${task.status === "Completed" ? "Mark Pending" : "Complete"}
          </button>

          <!-- Edit the task -->
          <button
            class="btn small secondary"
            data-action="edit"
            data-id="${task.id}"
          >
            Edit
          </button>

          <!-- Delete the task -->
          <button
            class="btn small danger"
            data-action="delete"
            data-id="${task.id}"
          >
            Delete
          </button>

        </div>

      </article>
    `).join("")

    // Display this message when no tasks match the search or filters
    : `<div class="empty">No matching tasks found.</div>`;
}