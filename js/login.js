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
const ordersReference = db.collection('orders');
const usersReference = db.collection('users');
//initialize firebase auth
const auth = firebase.auth(); 

//------------------------------------------------------------------------

//TRACK AUTHENTICATION STATUS
auth.onAuthStateChanged(function(user) {

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


    auth.signInWithEmailAndPassword(email, password)
    .then(function(cred) {
      // close the signup modal & reset form
      loginForm.reset();
      //direct to user or admin page - not safe, shouldnt be executed on the client
    //but node.js functions for firebase require billing account 
      directToPage(cred.user);
    })
    .catch(function (error) {
      alert(error.message);
      console.log("Error trying to log in: ", error.message);
    });

};


//function to redirect depending if user isAdmin
function directToPage(user) {
  const userId = user.uid;
  db.collection('users').get().then(function(snapshot) {
      //loop through users collection and find document that matches userID then check if 
      //user isAdmin    
      snapshot.docs.forEach(function(doc) {
        if(doc.id == userId && doc.data().isAdmin == true) {
          window.location.replace('admin.html');
        } 
        else if(doc.id == userId && doc.data().isAdmin == false) {
          window.location.replace('user.html');
        }
      })
  })
}