//FIREBASE USER AUTHENTICATION SCRIPTS 


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
auth.onAuthStateChanged(user => {
  if (user) {
    console.log('user logged in');
  } else {
    console.log('user logged out');
  }
})


//SIGN UP USER

const signUpForm = document.getElementById('signup-form');
signUpForm.addEventListener('submit', signUpUser);

function signUpUser(event) {
    event.preventDefault();

    //get user info
    const email = signUpForm['email'].value;
    const password = signUpForm['password'].value;
    console.log(email, password);

    //create user account

    auth.createUserWithEmailAndPassword(email, password).then(function(cred) {
        console.log(cred.user);
        // open confirmation message and reset register form
        signUpForm.reset();
        document.getElementById('register-confirmation').style.display = "block";
        document.getElementById('register-container').style.display = "none";
      })
      .catch(function(error){
      alert(`Error trying to signup: ${error.code}`);

      });

};

