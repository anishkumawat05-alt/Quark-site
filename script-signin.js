const container = document.getElementById("container");
const registerBtn = document.getElementById("register");
const loginBtn = document.getElementById("login");

registerBtn.addEventListener('click', () => {
  container.classList.add('active');
});

loginBtn.addEventListener('click', () => {
  container.classList.remove('active');
});

// ---- Redirect to home page on Sign in / Sign up (email/password) ----
const signInBtn = document.getElementById("signInBtn");
const signUpBtn = document.getElementById("signUpBtn");

signInBtn.addEventListener('click', () => {
  window.location.href = "index.html"; // apna home page ka sahi naam yahan daalo
});

signUpBtn.addEventListener('click', () => {
  window.location.href = "index.html"; // apna home page ka sahi naam yahan daalo
});


/* =====================================================================
   GOOGLE SIGN-IN (real, using Google Identity Services)
   =====================================================================
   STEPS YOU MUST DO before this works:
   1. Go to https://console.cloud.google.com/ → create a project.
   2. APIs & Services → Credentials → Create OAuth client ID → Web app.
   3. Add your site's domain under "Authorized JavaScript origins"
      (e.g. https://yoursite.com, and http://localhost:xxxx for testing).
   4. Copy the Client ID it gives you and paste it below in GOOGLE_CLIENT_ID.
   5. The button below opens the REAL Google account chooser — it will
      show whichever Google account(s) are already signed in on that
      browser/device and let the user pick one with a single tap.
   6. Google sends back an ID token (JWT) in handleGoogleCredential().
      That token proves who the user is, but a static HTML page can't
      safely "log them into your site" on its own — you need to send
      this token to YOUR backend, verify it there (Google's official
      libraries do this in one line), and then create a session/cookie
      for that user. The commented-out fetch() below shows where that
      call goes.
   ===================================================================== */

const GOOGLE_CLIENT_ID = "YOUR_GOOGLE_CLIENT_ID.apps.googleusercontent.com";

function handleGoogleCredential(response) {
  // response.credential = the signed JWT from Google, containing the
  // user's verified email/name/picture. Decode it only for display;
  // never trust a client-side decode for real authentication.
  console.log("Google credential received:", response.credential);

  // Send it to your backend to verify + create a session, e.g.:
  // fetch("/api/auth/google", {
  //   method: "POST",
  //   headers: { "Content-Type": "application/json" },
  //   body: JSON.stringify({ credential: response.credential })
  // })
  //   .then(res => res.json())
  //   .then(() => { window.location.href = "index.html"; });

  // Placeholder behaviour until the backend exists:
  window.location.href = "index.html";
}

window.addEventListener('load', () => {
  if (window.google && google.accounts && google.accounts.id) {
    google.accounts.id.initialize({
      client_id: GOOGLE_CLIENT_ID,
      callback: handleGoogleCredential
    });
  }
});

// Selecting by class instead of ID because both the Sign in AND
// Sign up forms now have their own Google/Apple buttons — an ID
// lookup would only ever catch the first one in the page.
document.querySelectorAll(".google-btn").forEach(btn => {
  btn.addEventListener('click', () => {
    if (window.google && google.accounts && google.accounts.id) {
      // Opens Google's real account picker for whatever account(s)
      // are currently signed into the browser
      google.accounts.id.prompt();
    } else {
      alert("Google sign-in script hasn't loaded yet — check your internet connection or GOOGLE_CLIENT_ID setup.");
    }
  });
});


/* =====================================================================
   APPLE SIGN-IN (real, using "Sign in with Apple JS")
   =====================================================================
   STEPS YOU MUST DO before this works:
   1. You need a paid Apple Developer account (developer.apple.com).
   2. Certificates, Identifiers & Profiles → create a "Services ID" —
      this is your APPLE_CLIENT_ID below (NOT your app's bundle ID).
   3. Configure that Services ID with your domain and a redirect URI
      (a real backend endpoint that will receive Apple's response).
   4. Apple Sign-In always redirects back to your server (it doesn't
      hand you a token directly in the browser the way Google can) —
      so REDIRECT_URI below must point to a real backend route you
      control, which then verifies the response and logs the user in.
   ===================================================================== */

const APPLE_CLIENT_ID = "com.yourcompany.yourapp.web"; // your Services ID
const APPLE_REDIRECT_URI = "https://yoursite.com/api/auth/apple/callback";

window.addEventListener('load', () => {
  if (window.AppleID) {
    AppleID.auth.init({
      clientId: APPLE_CLIENT_ID,
      scope: "name email",
      redirectURI: APPLE_REDIRECT_URI,
      usePopup: true
    });
  }
});

document.querySelectorAll(".apple-btn").forEach(btn => {
  btn.addEventListener('click', async () => {
    if (!window.AppleID) {
      alert("Apple sign-in script hasn't loaded yet.");
      return;
    }
    try {
      const data = await AppleID.auth.signIn();
      // data.authorization.id_token / code — send this to YOUR backend
      // to verify and create a session, same idea as the Google flow.
      console.log("Apple sign-in response:", data);

      // Placeholder behaviour until the backend exists:
      window.location.href = "index.html";
    } catch (err) {
      console.error("Apple sign-in failed or was cancelled:", err);
    }
  });
});