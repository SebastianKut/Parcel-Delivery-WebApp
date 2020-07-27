//FIREBASE USER AUTHENTICATION SCRIPTS LOGIN.HTML SPECIFIC


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
    } else {
    console.log('user logged out');
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
      alert(error.message);
      console.log("Error trying to log in: ", error.message);
    });

};