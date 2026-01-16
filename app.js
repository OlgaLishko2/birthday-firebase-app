import { database, auth, app } from "./config.js";

// Firebase auth functions
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
} from "https://www.gstatic.com/firebasejs/12.7.0/firebase-auth.js";
// Firebase Real DB functions
import {
  ref,
  set,
  get,
  child,
} from "https://www.gstatic.com/firebasejs/12.7.0/firebase-database.js";

//DOM elements
const nameInput = document.getElementById("name");
const dobInput = document.getElementById("dob");

const emailSignup = document.getElementById("emailSignup");
const passwordSignup = document.getElementById("passwordSignup");

const emailLogin = document.getElementById("emailLogin");
const passwordLogin = document.getElementById("passwordLogin");

const signupForm = document.getElementById("signupForm");
const loginForm = document.getElementById("loginForm");
const toggleForm = document.getElementById("toggleForm");

const error = document.getElementById("error");
const errorLogin = document.getElementById("errorLogin");
const LogoutDiv = document.getElementById("logoutmessage");
const LoginDiv = document.getElementById("loginmessage");
const signupSuccess = document.getElementById("signupSuccess");

const signupBtn = document.getElementById("signup");
const loginBtn = document.getElementById("login");
const logoutBtn = document.getElementById("logout");

const resultDiv = document.getElementById("result");


//forms manipulations


let isSignup = true;

toggleForm.addEventListener("click", function() {
  isSignup = !isSignup;

  if (isSignup) {
    signupForm.style.display = "block";
    loginForm.style.display = "none";
    toggleForm.textContent = "Already have an account? Login";
  } else {
    signupForm.style.display = "none";
    loginForm.style.display = "block";
    toggleForm.textContent = "Don't have an account? Sign Up";
  }
});


//screens manipulations
const authScreen = document.getElementById("authScreen");
const appScreen = document.getElementById("appScreen");

function showAuthScreen() {
  authScreen.style.display = "block";
  appScreen.style.display = "none";
}

function showAppScreen() {
  authScreen.style.display = "none";
  appScreen.style.display = "block";
}

//SingUp
signupForm?.addEventListener("submit", (e) => {
  e.preventDefault();

  error.style.display = "none";
  errorLogin.style.display = "none";

  // read inputs
  const name = nameInput.value;
  const dob = dobInput.value;
  const email = emailSignup.value;
  const password = passwordSignup.value;


  const isFilled = name && dob && email && password;
  if (!isFilled) {
    error.style.display = "block";
    return;
  }
  // create user in Firebase

  createUserWithEmailAndPassword(auth, email, password)
    .then((cred) => {
      const uid = cred.user.uid;

      // save data in DB
      return set(ref(database, "users/" + uid), {
        name: name,
        dob: dob,
        email: email,
      });
    })
    .then(() => {
      signupSuccess.style.display = "block";
      setTimeout(() => {
        signupSuccess.style.display = "none";
      }, 5000);
    })
    .catch((err) => {
      console.log(err.message);
    });
});

// Login
loginForm?.addEventListener("submit", (e) => {
  e.preventDefault();
  
  error.style.display = "none";
  errorLogin.style.display = "none";

  const email = emailLogin.value;
  const password = passwordLogin.value;


  const isFilledLogin = email && password;
  if (!isFilledLogin) {
    errorLogin.style.display = "block";
    return;
  } else {
    errorLogin.style.display = "none";
  }

  signInWithEmailAndPassword(auth, email, password)
    .then((cred) => {
      const uid = cred.user.uid;

      showAppScreen();

      // get user data from DB
      return get(ref(database, "users/" + uid));
    })
    .then((snapshot) => {
      if (snapshot.exists()) {
        checkBirthday(snapshot.val());
      } else {
        console.log("No data available");
      }
      LoginDiv.textContent = "User login successfully!";
      LoginDiv.style.display = "block";
      setTimeout(() => {
        LoginDiv.style.display = "none";
      }, 5000);
    })

    .catch((error) => {
      console.log(error);
    });
});

//Logout

logoutBtn?.addEventListener("click", () => {
  signOut(auth)
    .then(() => {
      LogoutDiv.textContent = "User logged out successfully!";
      LogoutDiv.style.display = "block";

      showAuthScreen();

      setTimeout(() => {
        LogoutDiv.style.display = "none";
      }, 5000);
    })
    .catch((error) => {
      console.log(error);
    });
});

// CHeck BIRTHDAY

function checkBirthday(userData) {
  const today = new Date();
  const dob = new Date(userData.dob);

  const currentDay = today.getDate();
  const currentMonth = today.getMonth();
  const birthdayDay = dob.getDate() + 1;
  const birthdayMonth = dob.getMonth();

  // console.log(currentDay);
  // console.log(currentMonth);
  // console.log(birthdayDay);
  // console.log(birthdayMonth);

  if (currentDay === birthdayDay && currentMonth === birthdayMonth) {
    //   fetch("quotes.json")
    fetch("https://corsproxy.io/?https://type.fit/api/quotes")
      // fetch("https://type.fit/api/quotes")
      .then((response) => response.json())
      .then((quotes) => {
        const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
        resultDiv.innerHTML = `🎂 Happy Birthday 🎉 🎉 🎉, ${userData.name}!<br>"${randomQuote.text}"<br>— ${randomQuote.author}`;
        resultDiv.classList.add("show");
      })
      .catch((error) => {
        console.log(error);
      });
  } else {
    const daysLeft = daysUntilBirthday(userData.dob);
    resultDiv.innerHTML = `${daysLeft} DAYS LEFT <br> UNTIL YOUR 🍰 BIRTHDAY!`;
    resultDiv.classList.add("show");
  }
}

function daysUntilBirthday(dobStr) {
  const today = new Date();
  const [year, month, day] = dobStr.split("-").map(Number); //  "2026-01-12" > ["2026","01","12"]  > [2026,1,12]

  // BD this year
  let birthdayThisYear = new Date(today.getFullYear(), month - 1, day);

  // BD next year
  if (birthdayThisYear < today) {
    birthdayThisYear = new Date(today.getFullYear() + 1, month - 1, day);
  }

  const differenceTime = birthdayThisYear - today; //  difference in milliseconds
  const differenceDays = Math.ceil(differenceTime / (1000 * 60 * 60 * 24)); // difference in days

  return differenceDays;
}
