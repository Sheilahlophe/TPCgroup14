// Import Firebase Authentication and Realtime Database
import { auth, db } from "./firebase.js";

import {
  ref, push, set, onValue, serverTimestamp, query, orderByChild, equalTo
} from "https://www.gstatic.com/firebasejs/12.2.1/firebase-database.js";

// Import helper functions used to display data and messages
import { escapeHTML, formatDate, showMessage } from "./app.js";


// Start the support booking functionality
export function initBooking() {

  // Wait for the logged-in user's information
  document.addEventListener("userReady", ({ detail }) => {

    // Get the current logged-in learner
    const user = detail.user;

    // Create the support booking page
    document.getElementById("pageContent").innerHTML = `
      <div class="page-header">
        <div>
          <h2>Support Session Booking</h2>
          <p class="muted">Request assistance from an assessor.</p>
        </div>
      </div>

      <!-- Area used to display booking success or error messages -->
      <div id="bookingMessage" class="message hidden"></div>

      <div class="grid" style="grid-template-columns:minmax(0,1fr) minmax(0,1fr);">

        <!-- Form used by the learner to request support -->
        <section class="card">
          <h3>Request a session</h3>

          <form id="bookingForm" class="form-grid">

            <label class="full-span">Topic
              <input
                id="bookingTopic"
                maxlength="150"
                required
                placeholder="e.g. JavaScript functions">
            </label>

            <label>Date
              <input id="bookingDate" type="date" required>
            </label>

            <label>Time
              <input id="bookingTime" type="time" required>
            </label>

            <label class="full-span">What do you need help with?
              <textarea
                id="bookingDescription"
                maxlength="1000"
                required>
              </textarea>
            </label>

            <div class="actions full-span">
              <button class="btn primary" type="submit">
                Submit Request
              </button>
            </div>

          </form>
        </section>


        <!-- Section where the learner can view their submitted requests -->
        <section class="card">
          <h3>My Requests</h3>
          <div id="bookingList" class="booking-list"></div>
        </section>

      </div>
    `;


    // Handle the learner's support booking form
    document.getElementById("bookingForm").addEventListener("submit", async event => {

      // Prevent the page from refreshing when the form is submitted
      event.preventDefault();


      // Collect the information entered by the learner
      const data = {
        learnerId: user.uid,
        learnerName: detail.profile.name,
        topic: document.getElementById("bookingTopic").value.trim(),
        date: document.getElementById("bookingDate").value,
        time: document.getElementById("bookingTime").value,
        description: document.getElementById("bookingDescription").value.trim(),

        // New requests start with a Pending status
        status: "Pending",

        // Store when the booking was created and updated
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      };


      try {

        // Create a new booking entry in Firebase
        const bookingRef = push(ref(db, "bookings"));

        // Save the booking information
        await set(bookingRef, data);

        // Clear the form after successful submission
        event.target.reset();

        // Display a success message to the learner
        showMessage(
          document.getElementById("bookingMessage"),
          "Support request submitted successfully.",
          "success"
        );

      } catch (error) {

        // Display the error in the browser console
        console.error(error);

        // Display an error message to the learner
        showMessage(
          document.getElementById("bookingMessage"),
          "Could not submit your request.",
          "error"
        );
      }
    });


    // Find only the bookings belonging to the current learner
    const learnerBookings = query(
      ref(db, "bookings"),
      orderByChild("learnerId"),
      equalTo(user.uid)
    );


    // Listen for changes to the learner's bookings
    onValue(learnerBookings, snapshot => {

      // Get the booking data from Firebase
      const all = snapshot.val() || {};

      // Convert Firebase data into an array and sort newest bookings first
      const bookings = Object.entries(all)
        .map(([id, item]) => ({
          id,
          ...item
        }))
        .sort((a, b) =>
          Number(b.createdAt || 0) - Number(a.createdAt || 0)
        );


      // Display the learner's support requests
      document.getElementById("bookingList").innerHTML = bookings.length

        ? bookings.map(item => `
          <div class="item">

            <div class="item-head">

              <h3>${escapeHTML(item.topic)}</h3>

              <!-- Display a different style depending on the booking status -->
              <span class="badge ${
                item.status === "Approved"
                  ? "success"
                  : item.status === "Cancelled"
                    ? "danger"
                    : "warning"
              }">
                ${escapeHTML(item.status)}
              </span>

            </div>

            <div class="meta">
              <span>${formatDate(item.date)}</span>
              <span>${escapeHTML(item.time)}</span>
            </div>

            <p class="muted">
              ${escapeHTML(item.description || "")}
            </p>

          </div>
        `).join("")

        // Display this message when the learner has no bookings
        : `<div class="empty">No support requests submitted yet.</div>`;
    });

  });
}