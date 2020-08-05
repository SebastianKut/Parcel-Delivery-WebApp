//INDEX.HTML SPECIFIC FUNCTIONS


//FIREBASE CONFIG SECTION---------------------------------------------   
//Firebase configuration
var firebaseConfig = {
    apiKey: "AIzaSyDIJQcRxb84MOyNIKVf7huKfabj5U_rlzQ",
    authDomain: "global-trending-aefeb.firebaseapp.com",
    databaseURL: "https://global-trending-aefeb.firebaseio.com",
    projectId: "global-trending-aefeb",
    appId: "1:745521956381:web:5bab28159b00bd9bb9a8f4",
  };

//Initialize Firebase
firebase.initializeApp(firebaseConfig);

//Initialize Firestore (database on Firebase)
const db = firebase.firestore();

//Initialize firebase auth
const auth = firebase.auth(); 

//------------------------------------------------------------------------

//TRACK AUTHENTICATION STATUS
auth.onAuthStateChanged(user => {
   
   if (user) {
        //setup relevant Nav and SideNav links
        setupUI(user);
        //change what send parcel button does (directs to user panel and doesnt check if user isAdmin, because admins will not use this button)
        disableLoginModal(user);
    } else {
      //invoke setupUI without parameter
      setupUI();
       //change what send parcel button does (triggers modal to log in)
      disableLoginModal();
    }
});

//LOGIN USER (VIA POPUP MODAL)
const loginForm = document.getElementById('login-form');
loginForm.addEventListener('submit', loginUser);

function loginUser(event) {
    event.preventDefault();
    //get user info
    const email = loginForm['email'].value;
    const password = loginForm['password'].value;
    //sign in user (promise)
    auth.signInWithEmailAndPassword(email, password).then(cred => {
      //reset login form
      loginForm.reset();
      // direct to page depending on isAdmin value
      directToPage(cred.user);
    })
    .catch(error => {
      alert(error.message);
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

//REDIRECT TO CORRECT PAGE AFTER LOGIN DEPENDING IF CUSTOMER OR ADMIN
function directToPage(user) {
  const userId = user.uid;
  db.collection('users').get().then(snapshot => {
      //loop through users collection and find document that matches userID then check if 
      //user isAdmin    
      snapshot.docs.forEach(doc => {
        if(doc.id == userId && doc.data().isAdmin == true) {
          window.location.replace('admin.html');
        } 
        else if(doc.id == userId && doc.data().isAdmin == false) {
          window.location.replace('user.html');
        }
      });
  });
}

//SETUP NAVIGATION LINKS BASED ON LOGIN STATUS
function setupUI(user) {
  if (user) {
  document.querySelectorAll(".logged-in").forEach(item => {item.style.display = 'block'});
  document.querySelectorAll(".logged-out").forEach(item => {item.style.display = 'none'});
  setupHrefToDashboard(user);
  } else {
    document.querySelectorAll(".logged-in").forEach(item => {item.style.display = 'none'});
    document.querySelectorAll(".logged-out").forEach(item => {item.style.display = 'block'});
    };
}

//DIRECT TO CORRECT PAGE WHEN USER PANEL CLICKED IN THE NAV BAR - EITHER ADMIN PANEL OR CLIENT(USER) PANEL
function setupHrefToDashboard(user){
  const dashboardLink = document.getElementById('dashboard');
  const mobileMenuDashboardLink = document.getElementById('dashboard-mobile');
  //check if user admin without calling firestore to save READS - check specific ADMIN ID
  //this is for DEMO only and isnt safe to do on the frontEnd
  if (user.uid === 'iSgSsg8TatUsKPEVen8nBZK55hv1') {
    dashboardLink.setAttribute('href', 'admin.html');
    mobileMenuDashboardLink.setAttribute('href', 'admin.html');
  } else {
    dashboardLink.setAttribute('href', 'user.html');
    mobileMenuDashboardLink.setAttribute('href', 'user.html');
  }
};

//DISABLE LOGIN MODAL AND GO STRAIGHT TO USERS PANEL WHEN USER IS LOGGED IN
function disableLoginModal(user) {
  const sendBtn =  document.getElementById('send-parcel-button');
  if (user) {
    sendBtn.setAttribute('href', 'user.html');
  } else {
    sendBtn.setAttribute('href', '#modal-login');
  }
}