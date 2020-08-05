//FIREBASE USER REGISTRATION SCRIPTS 

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

//SIGN UP USER
const signUpForm = document.getElementById('signup-form');
signUpForm.addEventListener('submit', signUpUser);

function signUpUser(event) {
    event.preventDefault();

    //get user info
    //neccesary for email and pswd authorisation function
    const email = signUpForm['email'].value;
    const password = signUpForm['password'].value;

    //other user info that will be stored in users collection in firestore users collection
    const firstName = signUpForm['first_name'].value;
    const lastName = signUpForm['last_name'].value;
    const tel = signUpForm['tel'].value;
    
    //create user account
    auth.createUserWithEmailAndPassword(email, password).then(cred => {
        //add user info to users collection
        return usersRef.doc(cred.user.uid).set({
          firstName: firstName,
          lastName: lastName,
          tel: tel,
          isAdmin: false, //this will be how I will setup user roles (not safe for production but server side functions require billing account)
          userId: cred.user.uid,
          email: cred.user.email
        });
      })
      .then (() => {
        // open confirmation message and reset register form
        signUpForm.reset();
        document.getElementById('register-confirmation').style.display = "block";
        document.getElementById('register-container').style.display = "none";
        //redirect to user panel after 5 seconds
        setTimeout(() => {window.location.replace('user.html')}, 5000);
        })
      .catch(error => {
         alert(error.message);
      });

};

