//FIREBASE USER AUTHENTICATION SCRIPTS LOGIN.HTML SPECIFIC

//FIREBASE CONFIG SECTION---------------------------------------------   
// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyB7KmHILZnBo-m_O-OR0P3zpcX9auRP85E",
  authDomain: "parcel-delivery-demo.firebaseapp.com",
  databaseURL: "https://parcel-delivery-demo.firebaseio.com",
  projectId: "parcel-delivery-demo",
  appId: "1:409330210051:web:882ddc11b09940612e4536",
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