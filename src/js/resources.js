// Import Firebase Authentication and Realtime Database
import { auth, db } from "./firebase.js";

// Import Firebase functions used to read and save data
import {
  ref, onValue, push, set, serverTimestamp
} from "https://www.gstatic.com/firebasejs/12.2.1/firebase-database.js";

// Import helper functions used to safely display text and messages
import { escapeHTML, showMessage } from "./app.js";


// Store the learning resources loaded from Firebase
let resources = [];

// Store the learner's current game score
let score = 0;

// Keep track of which question the learner is answering
let questionIndex = 0;

// Keep track of the selected question set
let activeSetIndex = 0;


// Question sets used for the JavaScript Quick Challenge
const questionSets = [

  // Question Set 1: JavaScript basics
  [
    { q: "Which keyword declares a block-scoped variable that can be reassigned?", options: ["const", "let", "class", "return"], answer: 1 },
    { q: "Which keyword declares a variable that should not be reassigned?", options: ["const", "if", "for", "try"], answer: 0 },
    { q: "What does typeof \"hello\" return?", options: ["number", "object", "string", "boolean"], answer: 2 },
    { q: "Which operator checks equality without converting types?", options: ["=", "==", "===", "!"], answer: 2 }
  ],

  // Question Set 2: JavaScript arrays
  [
    { q: "Which brackets create an array?", options: ["{}", "[]", "()", "<>"], answer: 1 },
    { q: "How do you access the first item in an array named colors?", options: ["colors[1]", "colors.first", "colors[0]", "colors(0)"], answer: 2 },
    { q: "Which property gives the number of items in an array?", options: ["size", "count", "items", "length"], answer: 3 },
    { q: "Which method adds an item to the end of an array?", options: ["push()", "pop()", "shift()", "slice()"], answer: 0 }
  ],

  // Question Set 3: JavaScript functions
  [
    { q: "Which keyword starts a function declaration?", options: ["func", "function", "method", "define"], answer: 1 },
    { q: "What does return do inside a function?", options: ["Repeats the function", "Names a variable", "Sends a value back", "Prints a message"], answer: 2 },
    { q: "How do you call a function named greet?", options: ["greet[]", "call greet", "greet{}", "greet()"], answer: 3 },
    { q: "In function greet(name), what is name?", options: ["A parameter", "A loop", "An operator", "A return value"], answer: 0 }
  ],

  // Question Set 4: Conditions and operators
  [
    { q: "Which statement runs code when a condition is true?", options: ["for", "if", "return", "const"], answer: 1 },
    { q: "Which keyword provides an alternative when an if condition is false?", options: ["else", "then", "next", "case"], answer: 0 },
    { q: "What is the result of 5 === \"5\"?", options: ["true", "5", "undefined", "false"], answer: 3 },
    { q: "What does the && operator mean?", options: ["Either condition is true", "Both conditions must be true", "The value is not equal", "Add two values"], answer: 1 }
  ],

  // Question Set 5: JavaScript loops and arrays
  [
    { q: "Which loop is commonly used when you know how many times to repeat?", options: ["for", "if", "switch", "try"], answer: 0 },
    { q: "Which loop can iterate over the values in an array?", options: ["if...else", "for...of", "try...catch", "do...if"], answer: 1 },
    { q: "What is the first index of a JavaScript array?", options: ["1", "-1", "0", "It has no index"], answer: 2 },
    { q: "Which keyword exits a loop early?", options: ["skip", "return", "stop", "break"], answer: 3 }
  ]
];


// Start the resources page
export function initResources() {

  // Wait for the logged-in user's information to be ready
  document.addEventListener("userReady", ({ detail }) => {

    // Get the current logged-in user
    const user = detail.user;

    // Find the area where the resources page will be displayed
    const content = document.getElementById("pageContent");


    // Create the resources and mini-game page
    content.innerHTML = `
      <div class="page-header">
        <div>
          <h2>Learning Resources & Mini-Game</h2>
          <p class="muted">Study available materials and practise your coding knowledge.</p>
        </div>
      </div>


      <!-- Section for learning resources -->
      <section class="card">
        <h3>Learning Resources</h3>

        <!-- Resources from Firebase will be displayed here -->
        <div id="resourceList" class="grid resource-grid"></div>
      </section>


      <!-- JavaScript Quick Challenge section -->
      <section class="card game" style="margin-top:18px;">
        <h3>JavaScript Quick Challenge</h3>

        <!-- Display the current game status -->
        <p id="gameStatus" class="muted">
          Answer the questions to record your score.
        </p>

        <!-- Allow the learner to choose a question set -->
        <label for="quizSet">
          Question set

          <select id="quizSet">
            ${questionSets.map((_, index) =>
              `<option value="${index}">Set ${index + 1}</option>`
            ).join("")}
          </select>
        </label>

        <!-- Questions will be displayed in this area -->
        <div id="gameArea"></div>

      </section>
    `;


    // Listen for learning resources stored in Firebase
    onValue(ref(db, "resources"), snapshot => {

      // Get the resource data from Firebase
      const all = snapshot.val() || {};

      // Convert the Firebase data into an array
      resources = Object.entries(all)
        .map(([id, item]) => ({ id, ...item }));

      // Display the resources on the page
      renderResources();
    });


    // Handle changing the selected question set
    document.getElementById("quizSet").addEventListener("change", event => {

      // Store the selected question set
      activeSetIndex = Number(event.target.value);

      // Reset the score
      score = 0;

      // Start again from the first question
      questionIndex = 0;

      // Update the game instructions
      document.getElementById("gameStatus").textContent =
        "Complete all four questions to save your score.";

      // Display the selected question set
      renderGame(user);
    });


    // Display the first question when the page loads
    renderGame(user);
  });
}


// Display the available learning resources
function renderResources() {

  // Find the area where resources will be displayed
  const list = document.getElementById("resourceList");

  // Stop if the resource list does not exist
  if (!list) return;


  // Display the resources if there are any
  list.innerHTML = resources.length

    ? resources.map(item => `
      <article class="item">

        <!-- Show the resource type -->
        <span class="badge">
          ${escapeHTML(item.type || "Resource")}
        </span>

        <!-- Show the resource title -->
        <h3>${escapeHTML(item.title)}</h3>

        <!-- Show the resource description -->
        <p class="muted">
          ${escapeHTML(item.description || "")}
        </p>

        <!-- Show the resource category -->
        <div class="meta">
          <span>${escapeHTML(item.category || "General")}</span>
        </div>

        <!-- Show a button to open the resource when a URL exists -->
        ${item.url
          ? `<a class="btn secondary small"
                href="${escapeHTML(item.url)}"
                target="_blank"
                rel="noopener noreferrer">
                Open Resource
             </a>`
          : ""}

      </article>
    `).join("")

    // Display this message when there are no resources
    : `<div class="empty" style="grid-column:1/-1;">
        No resources have been published yet.
      </div>`;
}


// Display the current question in the game
function renderGame(user) {

  // Find the area where the game will be displayed
  const area = document.getElementById("gameArea");

  // Stop if the game area does not exist
  if (!area) return;


  // Get the currently selected question set
  const questions = questionSets[activeSetIndex];


  // Check if all questions in the current set have been answered
  if (questionIndex >= questions.length) {

    // Display the final score and game controls
    area.innerHTML = `
      <div class="muted">
        Set ${activeSetIndex + 1} of ${questionSets.length} complete
      </div>

      <div class="game-question">
        Final Score: ${score}/${questions.length}
      </div>

      <div class="actions">

        <!-- Button to restart the current question set -->
        <button class="btn secondary" id="restartGame">
          Retry Set
        </button>

        <!-- Button to move to the next question set -->
        <button class="btn primary" id="nextSet">
          Next Set
        </button>

      </div>
    `;


    // Save the learner's score to Firebase
    saveScore(user, activeSetIndex + 1);


    // Handle restarting the current question set
    document.getElementById("restartGame").addEventListener("click", () => {

      // Reset the score
      score = 0;

      // Return to the first question
      questionIndex = 0;

      // Update the game status
      document.getElementById("gameStatus").textContent =
        "Complete all four questions to save your score.";

      // Start the game again
      renderGame(user);
    });


    // Handle moving to the next question set
    document.getElementById("nextSet").addEventListener("click", () => {

      // Move to the next set and return to Set 1 after the last set
      activeSetIndex = (activeSetIndex + 1) % questionSets.length;

      // Update the question set dropdown
      document.getElementById("quizSet").value = String(activeSetIndex);

      // Reset the score
      score = 0;

      // Return to the first question
      questionIndex = 0;

      // Update the game status
      document.getElementById("gameStatus").textContent =
        "Complete all four questions to save your score.";

      // Display the next question set
      renderGame(user);
    });

    return;
  }


  // Get the current question
  const current = questions[questionIndex];


  // Display the current question and its answer choices
  area.innerHTML = `
    <div class="muted">
      Set ${activeSetIndex + 1} of ${questionSets.length}
      | Question ${questionIndex + 1} of ${questions.length}
    </div>

    <!-- Display the question -->
    <div class="game-question">
      ${escapeHTML(current.q)}
    </div>

    <!-- Display the answer choices -->
    <div class="choice-grid">

      ${current.options.map((option, index) =>
        `<button class="choice" data-answer="${index}">
          ${escapeHTML(option)}
        </button>`
      ).join("")}

    </div>
  `;


  // Add a click event to each answer button
  area.querySelectorAll(".choice").forEach(button => {

    button.addEventListener("click", () => {

      // Check whether the selected answer is correct
      if (Number(button.dataset.answer) === current.answer) {
        score++;
      }

      // Move to the next question
      questionIndex++;

      // Display the next question
      renderGame(user);
    });
  });
}


// Save the learner's game score to Firebase
async function saveScore(user, setNumber) {

  // Create a new location for the score in Firebase
  const scoreRef = push(ref(db, "gameScores"));


  try {

    // Save the learner's score and game information
    await set(scoreRef, {

      // Store the ID of the learner who completed the game
      learnerId: user.uid,

      // Store the final score
      score,

      // Store the name of the game and question set
      game: `JavaScript Quick Challenge - Set ${setNumber}`,

      // Store when the score was created
      createdAt: serverTimestamp()
    });


    // Tell the learner that their result was saved
    document.getElementById("gameStatus").textContent =
      "Your result has been saved.";

  } catch (error) {

    // Display the error in the browser console
    console.error(error);

    // Tell the learner that the game finished but the score was not saved
    document.getElementById("gameStatus").textContent =
      "Game completed, but the result could not be saved.";
  }
}