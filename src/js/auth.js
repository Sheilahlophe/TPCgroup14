import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, updateProfile } from "https://www.gstatic.com/firebasejs/12.2.1/firebase-auth.js";
import { get, ref, set } from "https://www.gstatic.com/firebasejs/12.2.1/firebase-database.js";
import { auth, db, firebaseConfigured } from "./firebase.js";

const message = document.getElementById("message");
const loginForm = document.getElementById("loginForm");
const registerForm = document.getElementById("registerForm");
const setupMessage = "Firebase is not configured. Add your Firebase Web App settings to js/firebase.js, then reload this page.";

// Show sign-in and setup feedback in the message area.
function showMessage(text, type = "error") {
  message.textContent = text;
  message.className = `message ${type}`;
}

// Prevent repeat submissions while Firebase is working.
function setFormBusy(form, busy) {
  form.querySelector('button[type="submit"]').disabled = busy;
}

// Replace common Firebase errors with messages users can understand.
function friendlyAuthError(error) {
  const messages = {
    "auth/invalid-email": "Enter a valid email address.",
    "auth/invalid-credential": "Email or password is incorrect.",
    "auth/user-not-found": "No account exists for this email. Register first.",
    "auth/wrong-password": "Email or password is incorrect.",
    "auth/email-already-in-use": "An account already exists for this email. Sign in instead.",
    "auth/weak-password": "Choose a password with at least 6 characters.",
    "auth/too-many-requests": "Too many attempts. Wait a moment and try again.",
    "auth/network-request-failed": "Could not reach Firebase. Check your internet connection.",
    "auth/operation-not-allowed": "Email/password sign-in is not enabled for this Firebase project.",
    "auth/unauthorized-domain": "This website domain is not authorized in Firebase Authentication."
  };

  return messages[error.code] || `Authentication failed (${error.code || "unknown error"}). Check your Firebase configuration and try again.`;
}

// Send each account type to its own home page.
function routeForRole(role) {
  window.location.assign(role === "assessor" ? "assessor.html" : "dashboard.html");
}

// Switch between the sign-in and registration forms.
document.querySelectorAll(".tab").forEach(tab => {
  tab.addEventListener("click", () => {
    const registering = tab.dataset.tab === "register";
    document.querySelectorAll(".tab").forEach(item => item.classList.toggle("active", item === tab));
    loginForm.classList.toggle("hidden", registering);
    registerForm.classList.toggle("hidden", !registering);
    if (firebaseConfigured) {
      message.classList.add("hidden");
    } else {
      showMessage(setupMessage);
    }
  });
});

// Explain the missing project settings before the user submits a form.
if (!firebaseConfigured) {
  showMessage(setupMessage);
}

// Sign in, check that the account has a profile, then open its home page.
loginForm.addEventListener("submit", async event => {
  event.preventDefault();
  if (!firebaseConfigured) return;

  setFormBusy(loginForm, true);
  message.classList.add("hidden");

  let signedIn = false;
  try {
    const email = document.getElementById("loginEmail").value.trim().toLowerCase();
    const password = document.getElementById("loginPassword").value;
    const credential = await signInWithEmailAndPassword(auth, email, password);
    signedIn = true;
    const profileSnapshot = await get(ref(db, `users/${credential.user.uid}`));

    if (!profileSnapshot.exists()) {
      await signOut(auth);
      signedIn = false;
      showMessage("This account has no learner profile. Register a learner account or contact an administrator.");
      return;
    }

    routeForRole(profileSnapshot.val().role);
  } catch (error) {
    if (!signedIn) {
      showMessage(friendlyAuthError(error));
      return;
    }

    let text = `You signed in, but your account profile could not be loaded (${error.code || "unknown error"}). Check the Realtime Database URL and rules.`;
    try {
      await signOut(auth);
    } catch (signOutError) {
      text += ` Sign-out also failed (${signOutError.code || "unknown error"}).`;
    }
    showMessage(text);
  } finally {
    setFormBusy(loginForm, false);
  }
});

// Create a Firebase account and save its learner profile.
registerForm.addEventListener("submit", async event => {
  event.preventDefault();
  if (!firebaseConfigured) return;

  const name = document.getElementById("registerName").value.trim();
  const email = document.getElementById("registerEmail").value.trim().toLowerCase();
  const password = document.getElementById("registerPassword").value;
  const confirmation = document.getElementById("registerConfirm").value;

  if (password !== confirmation) {
    showMessage("The passwords do not match.");
    return;
  }

  setFormBusy(registerForm, true);
  message.classList.add("hidden");

  let accountCreated = false;
  try {
    const credential = await createUserWithEmailAndPassword(auth, email, password);
    accountCreated = true;
    await updateProfile(credential.user, { displayName: name });
    await set(ref(db, `users/${credential.user.uid}`), {
      name,
      email,
      role: "learner"
    });
    routeForRole("learner");
  } catch (error) {
    let text = friendlyAuthError(error);
    if (accountCreated) {
      text = `Your account was created, but setup could not be completed (${error.code || "unknown error"}). Check the Realtime Database URL and rules, then contact an administrator.`;
      try {
        await signOut(auth);
      } catch (signOutError) {
        text += ` Sign-out also failed (${signOutError.code || "unknown error"}).`;
      }
    }
    showMessage(text);
  } finally {
    setFormBusy(registerForm, false);
  }
});
