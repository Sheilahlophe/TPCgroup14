/* ============================================================ */
/* CHALLENGE 1: DOM interaction + dynamic typing                 */
/* ============================================================ */
const input = document.getElementById('userInput');
const button = document.getElementById('analyzeBtn');
const output = document.getElementById('output');

// TODO 1: Attach a click event listener to `button` that runs an `analyze` function.
button.addEventListener('click', analyze);

function analyze() {
  // TODO 2: Read the current value from `input`.
  //         (Remember: everything coming out of the DOM is ALWAYS one specific type — which one?)
  // Everything coming from the DOM input is a string.
  const raw = input.value; // <-- replace null

  // TODO 3: Try to convert `raw` into a Number.
  const converted = Number(raw); // <-- replace null, e.g. using Number(...)
  
  // TODO 4: Log to the console:
  //   - the raw value and its type (typeof)
  //   - the converted value and its type (typeof)
  console.log("Raw:", raw, "(string)");
  console.log("Converted:", converted, "(number)");

  // TODO 5: Decide whether the conversion produced a valid number (hint: isNaN).
  //         If valid, add the CSS class "valid-number" to #output.
  //         If not valid, add the CSS class "not-number" to #output instead.
  //         (Tip: output.classList.add(...) / output.classList.remove(...))
  output.classList.remove("valid-number", "not-number");

  if (!isNaN(converted)) {
    output.classList.add("valid-number");
  } else {
    output.classList.add("not-number");
  }

  // TODO 6: Update output.textContent to show both the raw value+type
  //         and the converted value+type, e.g.:
  //         "Raw: 'abc' (string) fi Converted: NaN (number)"
  output.textContent = `Raw: '${raw}' (${typeof raw}) | Converted: ${converted} (${typeof converted})`;
}
// TODO 7 (record your engine): log navigator.userAgent to the console
// and copy the browser/engine info into your annotation notes on the page.
/* ============================================================ */
/* CHALLENGE 2: dynamic typing / coercion (console)              */
/* ============================================================ */
// STEP 1: Before reloading, fill in your PREDICTION for each expression (same index = same pair).
const expressions =  ["'5' + 3", "'5' - 3", "true + true", "[] + []", "'10' == 10", "'10' === 10"];
const predictions =  ["53",     "2",     "2",         "[][]",     "true",        "false"];
console.log("--- Challenge 2: Type Coercion Quiz ---");
// TODO 1: Loop over `expressions` by index. For each index:
//   - evaluate expressions[i] to get the REAL result
//     (hint: eval(expressions[i]) works here, since these are trusted, hard-coded strings)
//   - log: the expression, your prediction (predictions[i]), the real result, and typeof the real result
//   - flag with "n" if your prediction matches the real result (as a string), else "n"
let correct = 0;

for (let i = 0; i < expressions.length; i++) {

  // Evaluate expression
  const realResult = eval(expressions[i]);
 // console.log("Real result:", realResult, "| Type:", typeof realResult);

  // Convert the real result to a string for comparison
  const realResultString = String(realResult);

  // Check prediction
  const isCorrect = predictions[i] === realResultString;

  if (isCorrect) {
    correct++;
  }

  console.log(
    "Expression:", expressions[i],"| Prediction:", predictions[i], "| Real result:", realResult,"| Type:", typeof realResult,
    "|", isCorrect ? "Correct" : "Wrong"
  );
}

// TODO 2: After the loop, log how many predictions you got right out of the total.
console.log(`You got ${correct} out of ${expressions.length} predictions right.`);

// TODO 3: Record your runtime/engine version: console.log(navigator.userAgent);
console.log("Runtime / Engine:", navigator.userAgent);

/* ============================================================ */
/* CHALLENGE 3: interpreted execution / hoisting (console)       */
/* ============================================================ */
console.log("--- Challenge 3: Execution Order Puzzle ---");
console.log("1: top of script");
sayHello(); // calling this BEFORE its declaration below
var mood = "curious";
function sayHello() {
  console.log("2: inside sayHello, mood is currently:", mood);
}
console.log("3: mood after sayHello ran:", mood);
setTimeout(() => {
  console.log("5: inside setTimeout callback");
}, 0);
console.log("4: end of synchronous code (setTimeout already scheduled above)");
// Now watch what happens accessing a `let` variable before its declaration.
// This line is expected to throw — that's the point. It runs LAST on purpose
// so it doesn't stop anything above it from executing.
console.log(greeting); // TODO: predict what happens here — value? error?
let greeting = "hi";
// TODO 1: Reload the page. Compare the ACTUAL console order to your prediction above.
/*
1: top of script
2: inside sayHello, mood is currently: undefined
3: mood after sayHello ran: curious
4: end of synchronous code (setTimeout already scheduled above)
5: inside setTimeout callback
Error: Cannot use 'greeting' before declaration
 */

// TODO 2: In a comment here, explain in your own words WHY:
//   (a) sayHello() worked even though it's called before its declaration
/* Javascript processes functions before code run*/

//   (b) `mood` was undefined inside sayHello() rather than "curious"
/*  var declared variable mood existed as undefined without its assignment, which came after the function call */

//   (c) accessing `greeting` threw an error instead of printing undefined
/* declaration with key word let makes the variable not available until execution reaches the declaration line. */

//   (d) "4" printed before "5" even though setTimeout has a 0ms delay
/* Beacuse 0 seconds in checkout does not mean immediately but, it means immediately after the currently running code. */

// TODO 3: Record your runtime/engine version: console.log(navigator.userAgent)
console.log("Runtime / Engine:", navigator.userAgent);
