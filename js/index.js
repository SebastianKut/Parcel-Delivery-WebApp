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
        //change what send parcel button does (directs to user panel and doesnt check if user isAdmin, because admins will not use this button)
        disableLoginModal(user);

    } else {
    console.log('user logged out');
      //invoke setupUI without parameter
      setupUI();
       //change what send parcel button does (triggers modal to log in)
      disableLoginModal();
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
      // direct to page depending on isAdmin value
      directToPage(cred.user);
    })
    .catch(function (error) {
      alert('Nieprawidlowe haslo lub email');
      console.error("Error trying to log in: ", error);
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
setupHrefForDashboard(user);
} else {
  document.querySelectorAll(".logged-in").forEach(item => {item.style.display = 'none'});
  document.querySelectorAll(".logged-out").forEach(item => {item.style.display = 'block'});
};
// if (checkIfAdmin(user)) {
//   document.querySelectorAll(".admin").forEach(item => {item.style.display = 'block'});
// } else {
//   document.querySelectorAll(".admin").forEach(item => {item.style.display = 'none'});
// }

}

// //CHECK IF USER IS ADMIN
// function checkIfAdmin(user) {
//   let userIsAdmin;
//   const userId = user.uid;
//   db.collection('users').get().then(function(snapshot) {
//       //loop through users collection and find document that matches userID then check if 
//       //user isAdmin    
//       snapshot.docs.forEach(function(doc) {
//         if(doc.id == userId && doc.data().isAdmin == true) {
//           userIsAdmin = true;
//         } 
//         else if(doc.id == userId && doc.data().isAdmin == false) {
//           userIsAdmin = false;
//         }
//       }).then(function(userIsAdmin){
//         return userIsAdmin;
//       })
//   })
// }

//DIRECT TO CORRECT PAGE WHEN USER PANEL CLICKED IN THE NAV BAR
function setupHrefForDashboard(user){
let dashboardLink = document.getElementById('dashboard');
//check if user admin without calling firestore to save READS - check specific ADMIN ID
//this is for DEMO only and isnt safe to do on the frontEnd
if (user.uid === 'iSgSsg8TatUsKPEVen8nBZK55hv1') {
  dashboardLink.setAttribute('href', 'admin.html');
} else {
  dashboardLink.setAttribute('href', 'user.html');
}

};




//DISABLE LOGIN MODAL AND GO STRAIGHT TO USERS PANEL WHEN USER IS LOGGED IN

function disableLoginModal(user) {
  let sendBtn =  document.getElementById('send-parcel-button');
  if (user) {
    sendBtn.setAttribute('href', 'user.html');
  } else {
    sendBtn.setAttribute('href', '#modal-login');
  }
}