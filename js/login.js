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
const usersRef = db.collection('users');
//initialize firebase auth
const auth = firebase.auth(); 

//------------------------------------------------------------------------


//LOGIN USER
const loginForm = document.getElementById('login-form');
loginForm.addEventListener('submit', loginUser);

function loginUser(event) {
    event.preventDefault();

    //get user info
    const email = loginForm['email'].value;
    const password = loginForm['password'].value;

    auth.signInWithEmailAndPassword(email, password)
    .then(cred => {
      //direct to user or admin page 
      directToPage(cred.user);
      //reset form
      loginForm.reset();
    })
    .catch(error => {
      alert(error.message);
      console.log("Error trying to log in: ", error);
    });
};


//function to redirect depending if user isAdmin - not safe, shouldnt be executed on the client
//but node.js functions for firebase require billing account 
function directToPage(user) {
  const userId = user.uid;
  usersRef.get().then(snapshot => {
      //loop through users collection and find document that matches userID then check if 
      //user isAdmin    
      snapshot.docs.forEach(doc => {
        if (doc.id == userId && doc.data().isAdmin == true) {
          window.location.replace('admin.html');
        } 
        if (doc.id == userId && doc.data().isAdmin == false) {
          window.location.replace('user.html');
        }
      });
  });
};