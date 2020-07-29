//DOM MANIPULATION AND FIRESTORE (DATABASE) SCRPITS FOR USER PANEL


document.addEventListener('DOMContentLoaded', function() {

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

//FIRESTORE FUNCTIONS



//TRACK AUTHENTICATION STATUS
auth.onAuthStateChanged(user => {
    if (user) {
      console.log('user logged in: ', user.uid);
        orderSubmissionScope(user);
        // change show-content class to visible from default hidden
        document.querySelector('#user-content').style.display = 'flex';
        //display user email address
        displayEmail(user);
        //get data snapashot of orders collection from database
        db.collection('orders').orderBy('dateCreated').get().then(snapshot => {
            //functions that has to run when data was fetched from DB otherwise JS will throw various errors
            setupOrders(snapshot.docs, user);
            manipulateOrders();
        });
       

    } else {
      console.log('user logged out');
      //pass empty array and object to setup orders function so it executes rest of the code if no user
      setupOrders([], {});
      //redirect to logout.html
      window.location.replace('logout.html');
    }
  });

  

//SETUP ORDERS LIST AND ORDERS DETAILS


//set up orders list within tables body
let tableBody = document.getElementById('orders-table');
let orderDetailsContent = document.getElementById('order-details-section');


let setupOrders = function(data, user) {
let userId = user.uid;
let tableContent = "";
let orderContent = "";
let i = 1;
data.forEach(doc => {
    
    let order = doc.data();
    //only if userId is the same as userId stored in the order so only users that created those orders can view them
    if (userId === order.userId) {
    //create table rows and append to table body
    let tr =`
    <tr class="order-wrapper">
        <td>${order.lastName} ${order.firstName}</td>
        <td>${order.dateCreated.toDate().toString().slice(4,15)}</td>
        <td>${order.description}</td>
        <td>${order.sku}</td>
        <td>${order.status}</td>
        <td><button class="indigo accent-2 btn-small order-details-button">Pokaz</button><a href="#${i}"></a></td>
      </tr>
    `; 
    tableContent += tr;

    //create order details and append to the DOM
    let individualOrder =`
    <div id="${i}" class="section container order-details">
        <div class="row">
        <div class="row valign-wrapper">
            <h5 class="col s8 m10">Szczegoly zamowienia</h5>
            <button class="col s4 m2 btn-small indigo accent-2 go-back-btn">POWROT<i class="material-icons left">navigate_before</i> </button>
        </div>
        </div>
        <div class="row">
        <h6>Odbiorca</h6>
        <p class="grey-text">${order.firstName} ${order.lastName}<br>
        ${order.tel}<br>
        ${order.email}<br>  
        </p>
        </div>
        <div class="row">
        <h6>Adres dostawy</h6>
        <p class="grey-text">${order.street} ${order.streetNumber} / ${order.apartment}<br>
            ${order.postCode} ${order.town}<br>
            ${order.deliveryCountry}
        </p>
        </div>
        <div class="row">
        <h6>Przesylka</h6>
        <p class="grey-text">Data zlecenia: ${order.dateCreated.toDate().toString().slice(4,15)}<br>
        Opis: ${order.description}<br>
        Numer SKU: ${order.sku}
        </p>
        </div>
        <div class="row">
        <h6>Uwagi</h6>
        <p class="grey-text">${order.comments}</p>
        </div>
        <div class="row">
        <h6>Status</h6>
        <p class="grey-text">
            ${order.status}
        </p>
        </div>
    </div>
    `; 
    orderContent += individualOrder;
//increment i for the next order
    i++;

};
});

tableBody.innerHTML = tableContent;
orderDetailsContent.innerHTML = orderContent;


}

//CUSTOM SCRIPTS
//User panel related

let addOrderBtn = document.getElementById("add-new-order");
let addOrderLink = document.getElementById("new-order-menu-link");
addOrderBtn.addEventListener('click', displayOrderForm);
addOrderLink.addEventListener('click', displayOrderForm);
//show order form
function displayOrderForm() {
document.getElementById("welcome-message").style.display = "none";
document.getElementById("order-sent").style.display = "none";
document.getElementById("orders-list-user").style.display = "none";
document.querySelectorAll(".order-details").forEach(order => {
    order.style.display = "none"});
document.getElementById("send-parcel-form").style.display = "block";
}

//ORDER FORM SUBMISSION
//enclosing form submission function in the scope passing user so we can get userId to add to order
function orderSubmissionScope(user) {
let userId = user.uid;    
let orderSubmitForm = document.getElementById("submitOrderForm");
orderSubmitForm.addEventListener('submit', formSubmission)
function formSubmission(e){
        submitForm(e); 
//submission of form data to Cloud Firestore
        function submitForm(event){
            event.preventDefault();
        
            // Get values from Submit Form
            var firstName = getInputVal('first-name');
            var lastName = getInputVal('last-name');
            var tel = getInputVal('tel');
            var email = getInputVal('email');
            var street = getInputVal('route');
            var streetNumber = getInputVal('street-number');
            var apartment = getInputVal('apartment');
            var postCode = getInputVal('postal-code');
            var town = getInputVal('locality');
            var region = getInputVal('administrative-area-level-1');  
            var deliveryCountry = getInputVal('deliver-to-country');
            var description = getInputVal('description');
            var weight = getInputVal('weight');
            var height =getInputVal('height');
            var depth = getInputVal('depth');           
            var length = getInputVal('length');
            var monetaryValue = getInputVal('money-value');
            var sku = getInputVal('sku-number');
            var comments = getInputVal('comments');
            var termsAccepted = getInputVal('accept-terms');
            var dateCreated = firebase.firestore.FieldValue.serverTimestamp();
            
            
// Save order to firestore
        saveOrder(firstName, lastName, tel, email, street, streetNumber, apartment, postCode, town, region, 
            deliveryCountry, description, weight, height, depth,length, monetaryValue, sku, comments, termsAccepted, 
            userId, dateCreated);
        
        }

// Function to get values from the form
            function getInputVal(id){
                return document.getElementById(id).value;
            }
  
//hide and show relevant DOM elements after form submission
        function orderSent() {
        document.getElementById("order-sent").style.display = "block";
        document.getElementById("send-parcel-form").style.display = "none";
        document.getElementById("orders-list-user").style.display = "none";
        document.getElementById("welcome-message").style.display = "none";
        };

// Save order to firestore Orders Collection
            function saveOrder(firstName, lastName, tel, email, street, streetNumber, apartment, postCode, town, 
                region, deliveryCountry, description, weight, height, depth,length, monetaryValue, sku, comments, 
                termsAccepted, userId, dateCreated){
                ordersReference.add({
                    firstName: firstName,
                    lastName: lastName,
                    tel: tel,
                    email: email,
                    street: street,
                    streetNumber: streetNumber,
                    apartment: apartment,
                    postCode: postCode,
                    town: town,
                    region: region,
                    deliveryCountry: deliveryCountry,
                    description: description,
                    weight: weight,
                    height: height,
                    depth: depth,
                    length: length,
                    monetaryValue: monetaryValue,
                    sku: sku,
                    comments: comments,
                    termsAccepted: termsAccepted,
                    status: 'oczekujace',
                    userId: userId,
                    dateCreated: dateCreated
                })
                .then(function(docRef) {
                    console.log("Document written with ID: ", docRef.id);
                    // Clear form
                    document.getElementById('submitOrderForm').reset();
                    //Show user a message that form was send
                    orderSent();
                })
                .catch(function(error) {
                    console.error("Error adding document: ", error);
                });
            }     


}

}

let closeForm = document.getElementById("close-form");
closeForm.addEventListener('click', closeAllContent) 
//close all content and go back to welcome screen
function closeAllContent(){
document.getElementById("order-sent").style.display = "none";
document.getElementById("orders-list-user").style.display = "none";
document.getElementById("send-parcel-form").style.display = "none";
document.getElementById("welcome-message").style.display = "none";
document.querySelectorAll(".order-details").forEach(order => {
    order.style.display = "none"});
}

let showAllOrdersLink = document.getElementById("show-all-orders-user");
showAllOrdersLink.addEventListener('click', showAllOrders);
//show all orders page
function showAllOrders() {
document.getElementById("order-sent").style.display = "none";
document.getElementById("send-parcel-form").style.display = "none";
document.getElementById("welcome-message").style.display = "none";
document.querySelectorAll(".order-details").forEach(order => {
    order.style.display = "none"});
document.getElementById("orders-list-user").style.display = "block";
}

let closeAllOrdersBtn = document.getElementById("close-table-user");
closeAllOrdersBtn.addEventListener('click', closeAllContent); 

//filter clients orders 
let sortOrderList = document.getElementById('sort-orders');
sortOrderList.addEventListener('change', filterItems);
function filterItems(event){
    let searchedOrder = event.target.value;
    let allOrders = document.getElementsByClassName('order-wrapper');

    if (searchedOrder === 'all') {
        Array.from(allOrders).forEach(order => {
            console.log(searchedOrder);
            order.style.display = 'table-row';
        })
    } 

    if (searchedOrder === 'oczekujace' || searchedOrder === 'zrealizowane') {
        Array.from(allOrders).forEach(order => {
            if (order.children[4].textContent.toLowerCase().includes(searchedOrder.toLowerCase())) {
                order.style.display = 'table-row';
            } else {
                order.style.display = 'none';
            };
        });
    };     

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

//MANIPULATE ORDERS REPORT

function manipulateOrders(){ 

//Show order details when order details button is clicked
let orderDetailsBtn = document.querySelectorAll('.order-details-button');//querry selector all allows to use array methods
orderDetailsBtn.forEach(button => {
    button.addEventListener('click', showOrderDetails)
});

        function showOrderDetails(event) {
        //click link to the order details
        event.target.nextElementSibling.click();
        //click close order details button
        document.getElementById('close-table-user').click();
        //remove order-details class to make order visible
        document.getElementById(event.target.nextElementSibling.getAttribute('href').substring(1)).style.display = 'block';
        console.log('button clicked');
        }

//Hide order details when go back button is clicked
let goBackButton = document.querySelectorAll(".go-back-btn");
        goBackButton.forEach(button =>{
            button.addEventListener('click', showAllOrders)
        })

}


//DISPLAY USER EMAIL AND UNIQUE ID
function displayEmail(user) {
    let userInfo = document.getElementById('user-info');
    let html =`
    <li class="bold waves-effect"><i class="material-icons left amber-text text-accent-2 medium">laptop_mac</i></li>
  <li><p class="teal-text">${user.email}</p></li>
  <li><p class="teal-text">UNIKALNY NR ID:</p></li>
  <li><p class="teal-text">${user.uid}</p></li>
    `;
    userInfo.innerHTML = html;
}





})

