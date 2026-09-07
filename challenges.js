/* ============================================================ */
/* CHALLENGE 1: DOM interaction + dynamic typing                 */
/* ============================================================ */
const input = document.getElementById('userInput');
const button = document.getElementById('analyzeBtn');
const output = document.getElementById('output');
// TODO 1: Attach a click event listener to `button` that runs an `analyze` function.
function analyze() {
  // TODO 2: Read the current value from `input`.
  //         (Remember: everything coming out of the DOM is ALWAYS one specific type — which one?)
  const raw = null; // <-- replace null
  // TODO 3: Try to convert `raw` into a Number.
  const converted = null; // <-- replace null, e.g. using Number(...)
  // TODO 4: Log to the console:
  //   - the raw value and its type (typeof)
  //   - the converted value and its type (typeof)
  // TODO 5: Decide whether the conversion produced a valid number (hint: isNaN).
  //         If valid, add the CSS class "valid-number" to #output.
  //         If not valid, add the CSS class "not-number" to #output instead.
  //         (Tip: output.classList.add(...) / output.classList.remove(...))
  // TODO 6: Update output.textContent to show both the raw value+type
  //         and the converted value+type, e.g.:
  //         "Raw: 'abc' (string) fi Converted: NaN (number)"
}
// TODO 7 (record your engine): log navigator.userAgent to the console
// and copy the browser/engine info into your annotation notes on the page.
/* ============================================================ */
/* CHALLENGE 2: dynamic typing / coercion (console)              */
/* ============================================================ */
// STEP 1: Before reloading, fill in your PREDICTION for each expression (same index = same pair).
const expressions =  ["'5' + 3", "'5' - 3", "true + true", "[] + []", "'10' == 10", "'10' === 10"];
const predictions =  ["???",     "???",     "???",         "???",     "???",        "???"];
console.log("--- Challenge 2: Type Coercion Quiz ---");
// TODO 1: Loop over `expressions` by index. For each index:
//   - evaluate expressions[i] to get the REAL result
//     (hint: eval(expressions[i]) works here, since these are trusted, hard-coded strings)
//   - log: the expression, your prediction (predictions[i]), the real result, and typeof the real result
//   - flag with "n" if your prediction matches the real result (as a string), else "n"
// TODO 2: After the loop, log how many predictions you got right out of the total.
// TODO 3: Record your runtime/engine version: console.log(navigator.userAgent);
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
// TODO 2: In a comment here, explain in your own words WHY:
//   (a) sayHello() worked even though it's called before its declaration
//   (b) `mood` was undefined inside sayHello() rather than "curious"
//   (c) accessing `greeting` threw an error instead of printing undefined
//   (d) "4" printed before "5" even though setTimeout has a 0ms delay
// TODO 3: Record your runtime/engine version: console.log(navigator.userAgent)