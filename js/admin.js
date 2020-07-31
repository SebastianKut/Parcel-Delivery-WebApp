//DOM MANIPULATION AND FIRESTORE (DATABASE) SCRPITS FOR ADMIN PANEL


//Admin panel related
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
const ordersReference = db.collection('orders');

//initialize firebase auth
const auth = firebase.auth(); 

//------------------------------------------------------------------------

//TRACK AUTHENTICATION STATUS
auth.onAuthStateChanged(user => {
    if (user) {
      console.log('user logged in: ', user.uid);
      //if admin then display page if not redirect
        checkAdminRights(user);
        

    } else {
      console.log('user logged out');
      //if not logged in redirect
      window.location.replace('logout.html');
    }
  });

 //-----------------------------------------------------------------------------------

//CHECK IF USER IS ADMIN, DISPLAY ADMIN PAGE CONTENT AND SETUP ORDERS LIST
function checkAdminRights(user) {
    const userId = user.uid;
    db.collection('users').get().then(function(snapshot) {
        //loop through users collection and find document that matches userID then check if 
        //user isAdmin   
        const usersCollection = snapshot.docs; 
        usersCollection.forEach(function(doc) {
            //if Admin show page content, setup orders list and order details
          if(doc.id == userId && doc.data().isAdmin == true) {
              //show admin content
            document.querySelector('#admin-content').style.display = 'flex';
            //get snapshot of a database
            //then setup orders list and order details 
            db.collection('orders').orderBy('dateCreated').get().then(function(snapshot) {
               const ordersCollection = snapshot.docs;
               //setup html with orders dynamically from snapshot
              setupAdminOrders(ordersCollection, usersCollection);
               //trigger functionalies to manipulate orders
              manipulateOrders();
              
            })
          } 
          else if(doc.id == userId && doc.data().isAdmin == false) {
              //redirect to user panel
            window.location.replace('user.html');
          }
        })
    })
  }

  //----------------------------------------------------------------------------------
//SETUP ORDERS LIST AND ORDERS DETAILS
//set up orders list within tables body
let tableBody = document.getElementById('orders-table');
let orderDetailsContent = document.getElementById('order-details-section');


let setupAdminOrders = function(ordersData, usersData) {

    let tableContent = "";
    let orderContent = "";
    let i = 1;
    ordersData.forEach(ordersDoc => {
        
        let orderId = ordersDoc.id;
        let order = ordersDoc.data();
        let userIdFromOrder = order.userId;
        //with every iteration through orders collection itterate through users collection to find matching user id
        usersData.forEach(usersDoc => {
            let user = usersDoc.data();
            let userIdFromUser = usersDoc.id;
            //when userId matches set up table row with correct sender and reciver etc
            if (userIdFromOrder === userIdFromUser) {
                //setup table row with order
                let tr =`
                <tr id="${orderId}" class="order-wrapper">
                    <td>${user.firstName} ${user.lastName}</td>
                    <td>${order.sku}</td>
                    <td>${order.dateCreated.toDate().toString().slice(4,15)}</td>
                    <td class="truncate custom-td-width">ul.${order.street} ${order.streetNumber} / ${order.apartment}</td>
                    <td>${order.firstName} ${order.lastName}</td>
                    <td>${order.status}</td>
                    <td class="custom-td"><select class="status-change">
                    <option value=${order.status} disabled selected>Wybierz</option>
                    <option value="zrealizowane">Zrealizowane</option>
                    <option value="oczekujace">Oczekujace</option>
                    </select></td>
                    <td><input disabled type="text" placeholder="${order.trackingNumber}" ><span style="display: none;">${order.trackingNumber}</span></td>
                    <td class="center-align"><label>
                    <input class="delete-order-check" type="checkbox" /><span></span>
                    </label></td>
                    <td><button class="indigo accent-2 btn-small order-details-button">Pokaz</button><a href="#${i}"></a></td>
              </tr>
                `; 
                tableContent += tr;

                //set up order details
                let individualOrder =`
                <div id="${i}" class="section container order-details ">
                    <div class="row">
                    <div class="row valign-wrapper">
                        <h5 class="col s8 m10">Szczegoly zamowienia</h5>
                        <button class="col s4 m2 btn-small indigo accent-2 go-back-btn">POWROT<i class="material-icons left">navigate_before</i> </button>
                    </div>
                    </div>
                    <div class="row center-align">
                    <h6>Nadawca</h6>
                    <p class="grey-text"><span class="blue-grey-text text-darken-2">Imie i Nazwisko:</span> ${user.firstName} ${user.lastName}<br>
                    <span class="blue-grey-text text-darken-2">Numer Id:</span> ${user.userId}<br>
                    <span class="blue-grey-text text-darken-2">Numer tel:</span> ${user.tel}<br>
                    <span class="blue-grey-text text-darken-2">Email:</span> ${user.email}<br>
                    <span class="blue-grey-text text-darken-2">Data zlozenia:</span> ${order.dateCreated.toDate().toString().slice(0,24)} 
                    </p>
                    </div>
                    <div class="row center-align">
                    <h6>Odbiorca</h6>
                    <p class="grey-text "><span class="blue-grey-text text-darken-2">Imie i Nazwisko:</span> ${order.firstName} ${order.lastName}<br>
                    <span class="blue-grey-text text-darken-2">Numer tel:</span> ${order.tel}<br>
                    <span class="blue-grey-text text-darken-2">Email:</span> ${order.email}<br>  
                    </p>
                    </div>
                    <div class="row center-align">
                    <h6>Adres dostawy</h6>
                    <p class="grey-text "><span class="blue-grey-text text-darken-2">Ulica:</span> ${order.street} ${order.streetNumber} / ${order.apartment}<br>
                    <span class="blue-grey-text text-darken-2">Kod pocztowy:</span> ${order.postCode}<br> 
                    <span class="blue-grey-text text-darken-2">Miasto:</span> ${order.town}<br>
                    <span class="blue-grey-text text-darken-2">Kraj dostarczenia:</span> ${order.deliveryCountry}
                    </p>
                    </div>
                    <div class="row center-align">
                    <h6>Przesylka</h6>
                    <p class="grey-text "><span class="blue-grey-text text-darken-2">Opis:</span> ${order.description}<br>
                    <span class="blue-grey-text text-darken-2">Numer zlecenia:</span> <br>
                    <span class="blue-grey-text text-darken-2">Numer SKU:</span> ${order.sku}<br>
                    </p>
                    </div>
                    <div class="row center-align">
                    <h6>Uwagi</h6>
                    <p class="grey-text">${order.comments}</p>
                    </div>
                    <div class="row center-align">
                    <h6>Zlecenie</h6>
                    <p class="grey-text">
                    <span class="blue-grey-text text-darken-2">Status:</span> ${order.status}<br>
                    <span class="blue-grey-text text-darken-2">Numer do sledzenia przesylki:</span> ${order.trackingNumber}    
                    </p>
                    </div>
                </div>
                `; 
                orderContent += individualOrder;



            }
        })
    //increment i to be used as href between order from the list and this order details    
    i++;    
    })    
tableBody.innerHTML = tableContent;    
orderDetailsContent.innerHTML = orderContent;

//After dynamically creating DOM elements innitialize Materialize dropdown menu that I am using in the
//orders table (it will not work otherwise)
M.FormSelect.init(document.querySelectorAll('select'), {});

//Listen for changes like status change and delete and unable save button
enableSaveChangesBtn();

}



//---------------------------------------------------------------------------------

//ORDER FORM SUBMISSION FOR ADMIN

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
                //get user Id from the email address of the client to save the order as his    
                var senderId = getInputVal('sender-id');
                var dateCreated = firebase.firestore.FieldValue.serverTimestamp();
                
    // Save order to firestore
            saveOrder(firstName, lastName, tel, email, street, streetNumber, apartment, postCode, town, region, 
                deliveryCountry, description, weight, height, depth,length, monetaryValue, sku, comments, termsAccepted, 
                senderId, dateCreated);
            
            }
    
    // Function to get values from the form
                function getInputVal(id){
                    return document.getElementById(id).value;
                }
      
    //hide and show relevant DOM elements after form submission
            function orderSent() {
            document.getElementById("order-sent").style.display = "block";
            document.getElementById("send-parcel-form").style.display = "none";
            document.getElementById("orders-list-admin").style.display = "none";
            document.getElementById("welcome-message").style.display = "none";
            };
    
    // Save order to firestore Orders Collection
                function saveOrder(firstName, lastName, tel, email, street, streetNumber, apartment, postCode, town, region, 
                    deliveryCountry, description, weight, height, depth,length, monetaryValue, sku, comments, termsAccepted, 
                    userId, dateCreated){
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
                        dateCreated: dateCreated,
                        trackingNumber: ''
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
    
//---------------------------------------------------------------------------------
//SAVE CHANGES TO DATABASE
let saveChangesBtn = document.getElementById('save-order-changes-admin');
saveChangesBtn.addEventListener('click', saveChangesToDatabase);


//change order status in the database
function saveChangesToDatabase() {
    //create seperate batches of operations to be commited to database
    //so we do not try to add update and delete operation on the same order
    let deleteBatch = db.batch();
    let updateBatch = db.batch();
    let ordersRef = db.collection('orders');

    //check all checkboxes for orders to be seleted and add delete operations to deleteBatch
    document.querySelectorAll('.delete-order-check').forEach(checkbox => {
        if (checkbox.checked) {
            let orderToBeDeleted = checkbox.parentElement.parentElement.parentElement.getAttribute('id');
            //add order delete to the batch
            deleteBatch.delete(ordersRef.doc(orderToBeDeleted));
        }
    }); 

    //FIRST Commit delete batch to firestore database
    deleteBatch.commit().then(function() {
        console.log("Document(s) successfully deleted!");
        //Because we have onSnapshot function changing DOM structure everytime theres a change to database
        //theres no need for getting snapshot again to make sure deleted DOM elements are no longer checked for status change.
        //Next check all orders statuses and add update operation to commit batch
        document.querySelectorAll('.status-change').forEach(selectElement => {
            //get value of each order status from select element
            let status = selectElement.options[selectElement.selectedIndex].value;
            //get tracking number of an order that admin added
            let trackingNumber = selectElement.parentElement.parentElement.nextElementSibling.firstElementChild;
            //get id of an order to be updated that is stored as tabe row id for that order
            let orderToBeUpdated = selectElement.parentElement.parentElement.parentElement.getAttribute('id');
            //update order status
            updateBatch.update(ordersRef.doc(orderToBeUpdated), {'status': status});

            //if status value is "oczekujace" tracking number has to be updated to empty string in the database
            if (status === 'oczekujace') {
                updateBatch.update(ordersRef.doc(orderToBeUpdated), {'trackingNumber': ''});
            }

            
            //only if tracking number is empty string update tracking number so that we do not overwrite existing numbers
            if(trackingNumber.nextElementSibling.innerHTML =='') {
                updateBatch.update(ordersRef.doc(orderToBeUpdated), {'trackingNumber': trackingNumber.value}); 
            }

        })

        //SECOND Commit update batch to firestore
        updateBatch.commit().then(function() {
            console.log("Document(s) successfully updated!");
            saveChangesBtn.style.display = 'none';
            if (confirm("Zmiany zapisane pomyslnie. Wcisnij \"OK\" aby odswiezyc okno przegladarki")){
                window.location.reload();
            }
        })
       
    });   
}

//---------------------------------------------------------------------------------

//LOG OUT FROM FIREBASE

const logoutSidenav = document.getElementById('logout-sidenav');
logoutSidenav.addEventListener('click', logOutUser);

function logOutUser(event) {
    event.preventDefault();
    auth.signOut().then(() => {
        //navigate to logout page without ability to use browser back button
        window.location.replace('logout.html');
      });
};



//-------------------------------------------------------------------------------------------
//ADMIN PANEL FUNCTIONALITY AND BEHAVIOUR

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
            document.getElementById('close-table-admin').click();
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





// add event listener to enable save button when status of the order changes or delete checkbox checked
function enableSaveChangesBtn() {
    Array.from(document.getElementsByClassName('status-change')).forEach(item => {
        item.addEventListener('change', reactToChanges);
    });
    Array.from(document.getElementsByClassName('delete-order-check')).forEach(item => {
        item.addEventListener('change', reactToChanges);
    });
}    
//react to changes admin triggered in orders list  
function reactToChanges(event) {
    //display save changes btn
    document.getElementById('save-order-changes-admin').style.display = 'inline-block';
    //enable trackin number input field
    event.target.parentElement.parentElement.nextElementSibling.firstElementChild.disabled = false;
};


// close orders window
let closeAllOrdersBtn = document.getElementById("close-table-admin");
closeAllOrdersBtn.addEventListener('click', closeAllContent); 
function closeAllContent(){
    document.getElementById("order-sent").style.display = "none";
    document.getElementById("orders-list-admin").style.display = "none";
    document.getElementById("send-parcel-form").style.display = "none";
    document.getElementById('save-order-changes-admin').style.display = "none";
    document.getElementById("welcome-message").style.display = "none";
    document.querySelectorAll(".order-details").forEach(order => {
        order.style.display = "none"});
    }

//open all orders report on show-all-orders btn click 
let showOrdersBtn = document.getElementById('show-all-orders');
let showAllOrdersLink = document.getElementById('show-all-orders-admin');
showOrdersBtn.addEventListener('click', showAllOrders);
showAllOrdersLink.addEventListener('click', showAllOrders);
function showAllOrders(){
    document.getElementById("order-sent").style.display = "none";
    document.getElementById("orders-list-admin").style.display = "block";
    document.getElementById("send-parcel-form").style.display = "none";
    document.getElementById('save-order-changes-admin').style.display = "none";
    document.getElementById("welcome-message").style.display = "none";
    document.querySelectorAll(".order-details").forEach(order => {
        order.style.display = "none"});
}
//display new order from menu and close it
let addOrderLink = document.getElementById("new-order-menu-link");
addOrderLink.addEventListener('click', displayOrderForm);
let closeForm = document.getElementById("close-form");
closeForm.addEventListener('click', closeAllContent); 
function displayOrderForm() {
    document.getElementById("order-sent").style.display = "none";
    document.getElementById("orders-list-admin").style.display = "none";
    document.getElementById("send-parcel-form").style.display = "block";
    document.getElementById('save-order-changes-admin').style.display = "none";
    document.getElementById("welcome-message").style.display = "none";
    document.querySelectorAll(".order-details").forEach(order => {
        order.style.display = "none"});
    }

//sort orders according to option selected
let sortOrderList = document.getElementById('sort-orders');
sortOrderList.addEventListener('change', filterItems);
function filterItems(event){
    let searchedOrder = event.target.value;
    let allOrders = document.getElementsByClassName('order-wrapper');
    console.log(allOrders[1].children[4].textContent);

    // helper function to compare senders 
    // function compareSenders(a, b) {
    //     if (a.firstElementChild.firstElementChild.textContent > b.firstElementChild.firstElementChild.textContent) return 1;
    //     if (b.firstElementChild.firstElementChild.textContent > a.firstElementChild.firstElementChild.textContent) return -1;
    //     return 0;
    //   } 
    // // helper function to compare receivers
    // function compareReceivers(a, b) {
    //     if (a.children[4].textContent > b.children[4].textContent) return 1;
    //     if (b.children[4].textContent > a.children[4].textContent) return -1;
    //     return 0;
    // } 

        //show all
        if (searchedOrder === 'all') {
            Array.from(allOrders).forEach(order => {
                console.log(searchedOrder);
                order.style.display = 'table-row';
            })
        } 
        //filter by inprogress and completed
        if (searchedOrder === 'oczekujace' || searchedOrder === 'zrealizowane') {
            Array.from(allOrders).forEach(order => {
                if (order.children[5].textContent.toLowerCase().includes(searchedOrder.toLowerCase())) {
                    order.style.display = 'table-row';
                } else {
                    order.style.display = 'none';
                };
            });
        };     

}

//find orders by clients name
let searchBox = document.getElementById('search-box');
searchBox.addEventListener('keyup', fliterByName);
function fliterByName(event) {
    let searchedName = event.target.value;
    let allOrders = document.getElementsByClassName('order-wrapper');
    console.log(allOrders[1].children[4].textContent);
    Array.from(allOrders).forEach(order => {
        if (order.firstElementChild.textContent.toLowerCase().includes(searchedName.toLowerCase())){
            order.style.display = 'table-row';
        } else {
            order.style.display = 'none';
        }
    })

}

//reset search box input field
let resetSearchboxBtn = document.getElementById('reset-search-box');
resetSearchboxBtn.addEventListener('click', clearSearchBox);
function clearSearchBox() {
    //reset input btn
    searchBox.reset();
    //display all orders again
    document.querySelectorAll('.order-wrapper').forEach(order => {
        order.style.display = 'table-row';
    })
}
//-------------------------------------------------------------------------------------------

});