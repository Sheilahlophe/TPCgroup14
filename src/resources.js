import { auth, db } from "./firebase.js";
import {
  ref, onValue, push, set, serverTimestamp, query, orderByChild, equalTo
} from "https://www.gstatic.com/firebasejs/12.2.1/firebase-database.js";
import { escapeHTML, showMessage } from "./app.js";

let resources = [];
let score = 0;
let questionIndex = 0;
let activeSetIndex = 0;
const questionSets = [
  [
    { q: "Which keyword declares a block-scoped variable that can be reassigned?", options: ["const", "let", "class", "return"], answer: 1 },
    { q: "Which keyword declares a variable that should not be reassigned?", options: ["const", "if", "for", "try"], answer: 0 },
    { q: "What does typeof \"hello\" return?", options: ["number", "object", "string", "boolean"], answer: 2 },
    { q: "Which operator checks equality without converting types?", options: ["=", "==", "===", "!"], answer: 2 }
  ],
  [
    { q: "Which brackets create an array?", options: ["{}", "[]", "()", "<>"], answer: 1 },
    { q: "How do you access the first item in an array named colors?", options: ["colors[1]", "colors.first", "colors[0]", "colors(0)"], answer: 2 },
    { q: "Which property gives the number of items in an array?", options: ["size", "count", "items", "length"], answer: 3 },
    { q: "Which method adds an item to the end of an array?", options: ["push()", "pop()", "shift()", "slice()"], answer: 0 }
  ],
  [
    { q: "Which keyword starts a function declaration?", options: ["func", "function", "method", "define"], answer: 1 },
    { q: "What does return do inside a function?", options: ["Repeats the function", "Names a variable", "Sends a value back", "Prints a message"], answer: 2 },
    { q: "How do you call a function named greet?", options: ["greet[]", "call greet", "greet{}", "greet()"], answer: 3 },
    { q: "In function greet(name), what is name?", options: ["A parameter", "A loop", "An operator", "A return value"], answer: 0 }
  ],
  [
    { q: "Which statement runs code when a condition is true?", options: ["for", "if", "return", "const"], answer: 1 },
    { q: "Which keyword provides an alternative when an if condition is false?", options: ["else", "then", "next", "case"], answer: 0 },
    { q: "What is the result of 5 === \"5\"?", options: ["true", "5", "undefined", "false"], answer: 3 },
    { q: "What does the && operator mean?", options: ["Either condition is true", "Both conditions must be true", "The value is not equal", "Add two values"], answer: 1 }
  ],
  [
    { q: "Which loop is commonly used when you know how many times to repeat?", options: ["for", "if", "switch", "try"], answer: 0 },
    { q: "Which loop can iterate over the values in an array?", options: ["if...else", "for...of", "try...catch", "do...if"], answer: 1 },
    { q: "What is the first index of a JavaScript array?", options: ["1", "-1", "0", "It has no index"], answer: 2 },
    { q: "Which keyword exits a loop early?", options: ["skip", "return", "stop", "break"], answer: 3 }
  ]
];

export function initResources() {
  document.addEventListener("userReady", ({ detail }) => {
    const user = detail.user;
    const content = document.getElementById("pageContent");

    content.innerHTML = `
      <div class="page-header">
        <div>
          <h2>Learning Resources & Mini-Game</h2>
          <p class="muted">Study available materials and practise your coding knowledge.</p>
        </div>
      </div>

      <section class="card">
        <h3>Learning Resources</h3>
        <div id="resourceList" class="grid resource-grid"></div>
      </section>

      <section class="card game" style="margin-top:18px;">
        <h3>JavaScript Quick Challenge</h3>
        <p id="gameStatus" class="muted">Answer the questions to record your score.</p>
        <label for="quizSet">Question set
          <select id="quizSet">
            ${questionSets.map((_, index) => `<option value="${index}">Set ${index + 1}</option>`).join("")}
          </select>
        </label>
        <div id="gameArea"></div>
      </section>

      <section class="card" style="margin-top:18px;">
        <h3>My Game Scores</h3>
        <div id="gameScoreList" class="task-list">
          <div class="empty">Loading scores...</div>
        </div>
      </section>
    `;

    onValue(ref(db, "resources"), snapshot => {
      const all = snapshot.val() || {};
      resources = Object.entries(all).map(([id, item]) => ({ id, ...item }));
      renderResources();
    });

    const learnerScores = query(
      ref(db, "gameScores"),
      orderByChild("learnerId"),
      equalTo(user.uid)
    );

    const scoreList = document.getElementById("gameScoreList");
    const scoreLoadTimeout = window.setTimeout(() => {
      if (scoreList?.querySelector(".empty")?.textContent === "Loading scores...") {
        scoreList.innerHTML = `<div class="empty">Still waiting for Firebase to load scores. Check your connection and sign-in status, then reload.</div>`;
      }
    }, 10000);

    onValue(
      learnerScores,
      snapshot => {
        window.clearTimeout(scoreLoadTimeout);
        renderGameScores(snapshot.val());
      },
      error => {
        window.clearTimeout(scoreLoadTimeout);
        console.error("Could not load learner game scores:", error);
        scoreList.innerHTML = `<div class="empty">Game scores could not be loaded${error.code ? ` (${escapeHTML(error.code)})` : ""}. Check your Firebase rules and connection.</div>`;
      }
    );

    document.getElementById("quizSet").addEventListener("change", event => {
      activeSetIndex = Number(event.target.value);
      score = 0;
      questionIndex = 0;
      document.getElementById("gameStatus").textContent = "Complete all four questions to save your score.";
      renderGame(user);
    });

    renderGame(user);
  });
}

function renderResources() {
  const list = document.getElementById("resourceList");
  if (!list) return;

  list.innerHTML = resources.length ? resources.map(item => `
    <article class="item">
      <span class="badge">${escapeHTML(item.type || "Resource")}</span>
      <h3>${escapeHTML(item.title)}</h3>
      <p class="muted">${escapeHTML(item.description || "")}</p>
      <div class="meta"><span>${escapeHTML(item.category || "General")}</span></div>
      ${item.url ? `<a class="btn secondary small" href="${escapeHTML(item.url)}" target="_blank" rel="noopener noreferrer">Open Resource</a>` : ""}
    </article>
  `).join("") : `<div class="empty" style="grid-column:1/-1;">No resources have been published yet.</div>`;
}

function renderGameScores(scoreData) {
  const list = document.getElementById("gameScoreList");
  if (!list) return;

  const scores = Object.entries(scoreData || {})
    .map(([id, item]) => ({ id, ...item }))
    .sort((a, b) => Number(b.createdAt || 0) - Number(a.createdAt || 0));

  list.innerHTML = scores.length ? scores.map(item => `
    <article class="item">
      <div class="item-head">
        <h4>${escapeHTML(item.game || "JavaScript Quick Challenge")}</h4>
        <span class="badge">${escapeHTML(String(item.score))}/4</span>
      </div>
      <div class="meta"><span>Played: ${escapeHTML(formatDate(item.createdAt))}</span></div>
    </article>
  `).join("") : `<div class="empty">Complete a quiz set to see your score here.</div>`;
}

function renderGame(user) {
  const area = document.getElementById("gameArea");
  if (!area) return;
  const questions = questionSets[activeSetIndex];

  if (questionIndex >= questions.length) {
    area.innerHTML = `
      <div class="muted">Set ${activeSetIndex + 1} of ${questionSets.length} complete</div>
      <div class="game-question">Final Score: ${score}/${questions.length}</div>
      <div class="actions">
        <button class="btn secondary" id="restartGame">Retry Set</button>
        <button class="btn primary" id="nextSet">Next Set</button>
      </div>
    `;
    saveScore(user, activeSetIndex + 1);
    document.getElementById("restartGame").addEventListener("click", () => {
      score = 0;
      questionIndex = 0;
      document.getElementById("gameStatus").textContent = "Complete all four questions to save your score.";
      renderGame(user);
    });
    document.getElementById("nextSet").addEventListener("click", () => {
      activeSetIndex = (activeSetIndex + 1) % questionSets.length;
      document.getElementById("quizSet").value = String(activeSetIndex);
      score = 0;
      questionIndex = 0;
      document.getElementById("gameStatus").textContent = "Complete all four questions to save your score.";
      renderGame(user);
    });
    return;
  }

  const current = questions[questionIndex];
  area.innerHTML = `
    <div class="muted">Set ${activeSetIndex + 1} of ${questionSets.length} | Question ${questionIndex + 1} of ${questions.length}</div>
    <div class="game-question">${escapeHTML(current.q)}</div>
    <div class="choice-grid">
      ${current.options.map((option, index) =>
        `<button class="choice" data-answer="${index}">${escapeHTML(option)}</button>`
      ).join("")}
    </div>
  `;

  area.querySelectorAll(".choice").forEach(button => {
    button.addEventListener("click", () => {
      if (Number(button.dataset.answer) === current.answer) score++;
      questionIndex++;
      renderGame(user);
    });
  });
}

async function saveScore(user, setNumber) {
  const scoreRef = push(ref(db, "gameScores"));
  try {
    await set(scoreRef, {
      learnerId: user.uid,
      score,
      game: `JavaScript Quick Challenge - Set ${setNumber}`,
      createdAt: serverTimestamp()
    });
    document.getElementById("gameStatus").textContent = "Your result has been saved.";
  } catch (error) {
    console.error(error);
    document.getElementById("gameStatus").textContent = "Game completed, but the result could not be saved.";
  }
}
