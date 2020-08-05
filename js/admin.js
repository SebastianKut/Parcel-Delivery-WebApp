//DOM MANIPULATION AND FIRESTORE (DATABASE) SCRPITS FOR ADMIN PANEL

document.addEventListener('DOMContentLoaded', function() {

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
    const ordersRef = db.collection('orders');
    const usersRef = db.collection('users');

    //initialize firebase auth
    const auth = firebase.auth(); 

    //------------------------------------------------------------------------

    //FIREBASE DEPENDENT FUNCTIONS

    //TRACK AUTHENTICATION STATUS
    auth.onAuthStateChanged(user => {
        if (user) {
        //if admin then display page
            checkAdminRights(user);
        } else {
        //if not logged in redirect
        window.location.replace('logout.html');
        }
    });

    //CHECK IF USER IS ADMIN, DISPLAY ADMIN PAGE CONTENT AND SETUP ORDERS LIST
    function checkAdminRights(user) {
        const userId = user.uid;
        usersRef.get().then(snapshot => {
            //loop through users collection and find document that matches userID then check if user isAdmin   
            const usersCollection = snapshot.docs; 
            usersCollection.forEach(doc => {
                //if Admin show page content, setup orders list and order details
                if (doc.id == userId && doc.data().isAdmin == true) {
                    //show admin content
                    document.querySelector('#admin-content').style.display = 'flex';
                    //set up orders collection listener so page gets updated everytime db changes, without need to be refreshed
                    ordersRef.orderBy('dateCreated').onSnapshot(snapshot => {
                    const ordersCollection = snapshot.docs;
                    //setup html with orders dynamically from snapshot
                    setupAdminOrders(ordersCollection, usersCollection);
                    //trigger functionalies to manipulate orders
                    manipulateOrders();
                    })
                //if user isnt an admin redirect to user panel
                } else if (doc.id == userId && doc.data().isAdmin == false) {
                    window.location.replace('user.html');
                }
            })
        })
    }

    //SETUP ORDERS LIST AND ORDERS DETAILS
    let setupAdminOrders = function(ordersData, usersData) {

        let tableBody = document.getElementById('orders-table');
        let orderDetailsContent = document.getElementById('order-details-section');
        let tableContent = "";
        let orderContent = "";
        let i = 1;

        //itterate through every order
        ordersData.forEach(ordersDoc => {
            let orderId = ordersDoc.id;
            let order = ordersDoc.data();
            let userIdFromOrder = order.userId;
            //itterate through users collection to find user information that matches current order
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
                        <option value="oczekujace">Oczekujące</option>
                        </select></td>
                        <td><input disabled type="text" placeholder="${order.trackingNumber}" ><span style="display: none;">${order.trackingNumber}</span></td>
                        <td class="center-align"><label>
                        <input class="delete-order-check" type="checkbox" /><span></span>
                        </label></td>
                        <td><button class="indigo accent-2 btn-small order-details-button">Pokaż</button><a href="#${i}"></a></td>
                    </tr>
                    `; 
                    tableContent += tr;

                    //set up order details
                    let individualOrder =`
                    <div id="${i}" class="section container order-details z-depth-1">
                        <div class="row custom-row">
                        <div class="row valign-wrapper">
                            <h5 class="col s8 m10">Szczegóły zamówienia</h5>
                            <button class="col s4 m2 btn-small indigo accent-2 go-back-btn">WROC<i class="material-icons left">navigate_before</i> </button>
                        </div>
                        </div>
                        <div class="row center-align">
                        <h6>Nadawca</h6>
                        <p class="grey-text"><span class="blue-grey-text text-darken-2">Imię i Nazwisko:</span> ${user.firstName} ${user.lastName}<br>
                        <span class="blue-grey-text text-darken-2">Id nadawcy:</span> ${user.userId}<br>
                        <span class="blue-grey-text text-darken-2">Numer tel:</span> ${user.tel}<br>
                        <span class="blue-grey-text text-darken-2">Email:</span> ${user.email}<br>
                        <span class="blue-grey-text text-darken-2">Data złożenia:</span> ${order.dateCreated.toDate().toString().slice(0,24)} 
                        </p>
                        </div>
                        <div class="row center-align">
                        <h6>Odbiorca</h6>
                        <p class="grey-text "><span class="blue-grey-text text-darken-2">Imię i Nazwisko:</span> ${order.firstName} ${order.lastName}<br>
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
                        <span class="blue-grey-text text-darken-2">Numer do śledzenia przesyłki:</span> ${order.trackingNumber}    
                        </p>
                        </div>
                    </div>
                    `; 
                    orderContent += individualOrder;

                } else {
                    console.log ('cannot match IDs');
                }
            })
        //increment i to be used as href between order from the list and this order details    
        i++;    
        })
        //append order info to table body and order details content    
        tableBody.innerHTML = tableContent;    
        orderDetailsContent.innerHTML = orderContent;

        //After dynamically creating DOM elements innitialize Materialize dropdown menu that I am using in the
        //orders table (it will not work otherwise)
        M.FormSelect.init(document.querySelectorAll('select'), {});

        //Listen for changes like status change and delete and unable save button
        enableSaveChangesBtn();

    }


    //ORDER FORM SUBMISSION FOR ADMIN
    let orderSubmitForm = document.getElementById("submitOrderForm");
    orderSubmitForm.addEventListener('submit', formSubmission);

    function formSubmission(e){
        submitForm(e); 

        //submission of form data to Cloud Firestore
        function submitForm(event){
            event.preventDefault();
        
            // Get values from Submit Form
            let firstName = getInputVal('first-name');
            let lastName = getInputVal('last-name');
            let tel = getInputVal('tel');
            let email = getInputVal('email');
            let street = getInputVal('route');
            let streetNumber = getInputVal('street-number');
            let apartment = getInputVal('apartment');
            let postCode = getInputVal('postal-code');
            let town = getInputVal('locality');
            let region = getInputVal('administrative-area-level-1');  
            let deliveryCountry = getInputVal('deliver-to-country');
            let description = getInputVal('description');
            let weight = getInputVal('weight');
            let height =getInputVal('height');
            let depth = getInputVal('depth');           
            let length = getInputVal('length');
            let monetaryValue = getInputVal('money-value');
            let sku = getInputVal('sku-number');
            let comments = getInputVal('comments');
            let termsAccepted = getInputVal('accept-terms');
            //get user Id from the email address of the client to save the order as his    
            let senderId = getInputVal('sender-id');
            let dateCreated = firebase.firestore.FieldValue.serverTimestamp();
            
            // Save order to firestore
            saveOrder(firstName, lastName, tel, email, street, streetNumber, apartment, postCode, town, region, 
                deliveryCountry, description, weight, height, depth,length, monetaryValue, sku, comments, termsAccepted, 
                senderId, dateCreated);
        
        }
    
        // Function to get values from the form
        function getInputVal(id) {
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
            ordersRef.add({
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
            .then(docRef => {
                console.log("Document written with ID: ", docRef.id);
                // Clear form
                document.getElementById('submitOrderForm').reset();
                //Show user a message that form was send
                orderSent();
            })
            .catch(error => {
                alert(error.message);
                console.error("Error adding document: ", error);
            });
        }     
    }
    
    
    //SAVE CHANGES TO DATABASE
    let saveChangesBtn = document.getElementById('save-order-changes-admin');
    saveChangesBtn.addEventListener('click', saveChangesToDatabase);

    //change order status in the database
    function saveChangesToDatabase() {
            //create commit bacth to update firestore with various write operations
            let updateBatch = db.batch();
            //let ordersRef = db.collection('orders');

            //go through all orders and check for status change and tracking numbers
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

            });

            //check all orders and add ones ticked to be deleted to the batch 
            document.querySelectorAll('.delete-order-check').forEach(checkbox => {
                if (checkbox.checked) {
                    let orderToBeDeleted = checkbox.parentElement.parentElement.parentElement.getAttribute('id');
                    //add order delete to the batch
                    updateBatch.delete(ordersRef.doc(orderToBeDeleted));
                }
            }); 

            //commit the batch of operations
            updateBatch.commit().then(() => {
                console.log("Document(s) successfully updated!");
                saveChangesBtn.style.display = 'none';
            }); 

    }

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
    //PAGE BEHAVIOUR FUNCTIONS

    //MANIPULATE ORDERS REPORT
    function manipulateOrders(){ 

        //Show order details when order details button is clicked
        let orderDetailsBtn = document.querySelectorAll('.order-details-button');
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
        }
        
        //Hide order details when go back button is clicked
        let goBackButton = document.querySelectorAll(".go-back-btn");
        goBackButton.forEach(button =>{
            button.addEventListener('click', showAllOrders)
        })  
    }



    // LISTEN TO CHANGES IN ORDERS LIST
    function enableSaveChangesBtn() {
        document.querySelectorAll('.status-change').forEach(item => {
            item.addEventListener('change', reactToChanges);
        });
        document.querySelectorAll('.delete-order-check').forEach(item => {
            item.addEventListener('change', reactToChanges);
        });
    }    

    //REACT TO THE ABOVE CHANGES 
    function reactToChanges(event) {
        //display save changes btn
        document.getElementById('save-order-changes-admin').style.display = 'inline-block';
        //enable trackin number input field
        event.target.parentElement.parentElement.nextElementSibling.firstElementChild.disabled = false;
    };

    // CLOSE ALL ORDERS LIST
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

    //OPEN ALL ORDERS LIST
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

    //SHOW ADD NEW ORDER FORM
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

    //FILTER ORDERS WITH DROPDOWN MENU
    let sortOrderList = document.getElementById('sort-orders');
    sortOrderList.addEventListener('change', filterItems);
    function filterItems(event){
        let searchedOrder = event.target.value;
        let allOrders = document.getElementsByClassName('order-wrapper');
        console.log(allOrders[1].children[4].textContent);

        //On big screens display table row
        if (window.innerWidth > 992) {

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
            
        //On mobile screens display inline-block because of responsive table
        } else {

            //show all
            if (searchedOrder === 'all') {
                Array.from(allOrders).forEach(order => {
                    console.log(searchedOrder);
                    order.style.display = 'inline-block';
                })
            } 
            //filter by inprogress and completed
            if (searchedOrder === 'oczekujace' || searchedOrder === 'zrealizowane') {
                Array.from(allOrders).forEach(order => {
                
                    if (order.children[5].textContent.toLowerCase().includes(searchedOrder.toLowerCase())) {
                        order.style.display = 'inline-block';
                    } else {
                        order.style.display = 'none';
                    };
                
                });
            };     
        }
    }

    //FIND ORDERS BY CLIENT NAME SEARCHBOX FUNCTIONALITTY
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

    //RESET SEARCHBOX INPUT FIELD
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

});