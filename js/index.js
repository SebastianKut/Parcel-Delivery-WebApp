//FIREBASE USER AUTHENTICATION SCRIPTS INDEX.HTML SPECIFIC


//FIREBASE CONFIG SECTION---------------------------------------------   
// Your web app's Firebase configuration
var firebaseConfig = {
    apiKey: "AIzaSyDIJQcRxb84MOyNIKVf7huKfabj5U_rlzQ",
    authDomain: "global-trending-aefeb.firebaseapp.com",
    databaseURL: "https://global-trending-aefeb.firebaseio.com",
    projectId: "global-trending-aefeb",
    appId: "1:745521956381:web:5bab28159b00bd9bb9a8f4",
  };
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);

  //Initialize Firestore and Reference orders collection
const db = firebase.firestore();
let ordersReference = db.collection('orders');

//initialize firebase auth
const auth = firebase.auth(); 

//------------------------------------------------------------------------

//TRACK AUTHENTICATION STATUS
auth.onAuthStateChanged(function(user) {
   

    //Figure out how not to redirect when user is logged in on index.html
   if (user) {
        console.log('user logged in');
        //setup relevant Nav and SideNav links
        setupUI(user);

    } else {
    console.log('user logged out');
      //invoke setupUI without parameter
      setupUI();
    }
});



//LOGIN USER

const loginForm = document.getElementById('login-form');
loginForm.addEventListener('submit', loginUser);

function loginUser(event) {
    event.preventDefault();

    //get user info
    const email = loginForm['email'].value;
    const password = loginForm['password'].value;
    console.log(email, password);


    auth.signInWithEmailAndPassword(email, password).then(function(cred) {
      console.log(cred.user);
      // close the signup modal & reset form
      loginForm.reset();
      window.location.replace('user.html');
    })
    .catch(function (error) {
      alert('Nieprawidlowe haslo lub email');
      console.error("Error trying to log in: ", error);
    });

};


//LOG OUT FROM FIREBASE

const logoutNav = document.getElementById('logout-navbar');
const logoutSidenav = document.getElementById('logout-sidenav');

logoutNav.addEventListener('click', logOutUser); 
logoutSidenav.addEventListener('click', logOutUser);

function logOutUser(event) {
    event.preventDefault();
    auth.signOut().then(() => {
        //navigate to logout page without ability to use browser back button
        window.location.replace('logout.html');
      });
};

//SETUP NAV LINKS

function setupUI(user) {
if (user) {
document.querySelectorAll(".logged-in").forEach(item => {item.style.display = 'block'});
document.querySelectorAll(".logged-out").forEach(item => {item.style.display = 'none'});
} else {
  document.querySelectorAll(".logged-in").forEach(item => {item.style.display = 'none'});
  document.querySelectorAll(".logged-out").forEach(item => {item.style.display = 'block'});
}

}