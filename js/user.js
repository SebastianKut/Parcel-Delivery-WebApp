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

    //Initialize Firestore and Reference orders and users collections
    const db = firebase.firestore();
    const ordersRef = db.collection('orders');
    const usersRef = db.collection('users');

    //initialize firebase auth
    const auth = firebase.auth(); 

    //------------------------------------------------------------------------

    //FIREBASE DEPENDENT FUNCTIONS

    //TRACK AUTHENTICATION STATUS
    auth.onAuthStateChanged(user => {
        //user is logged in
        if (user) {
            orderSubmissionScope(user);
            // change show-content class to visible from default hidden
            document.querySelector('#user-content').style.display = 'flex';
            //display user email address
            displayEmail(user);
            //get data snapashot of orders collection from database
            ordersRef.orderBy('dateCreated').onSnapshot(snapshot => {
                //functions that has to run when data was fetched from DB otherwise JS will throw various errors
                setupOrders(snapshot.docs, user);
                manipulateOrders();
            });
        //user is logged out   
        } else {
        //pass empty array and object to setup orders function so it executes rest of the code if no user
        setupOrders([], {});
        //redirect to logout.html
        window.location.replace('logout.html');
        }
    });

    //SETUP ORDERS LIST AND ORDERS DETAILS
    const tableBody = document.getElementById('orders-table');
    const orderDetailsContent = document.getElementById('order-details-section');

    const setupOrders = function(data, user) {
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
                <td>${order.trackingNumber}</td>
                <td><button class="indigo accent-2 btn-small order-details-button">Pokaż</button><a href="#${i}"></a></td>
            </tr>
            `; 
            tableContent += tr;

            //create order details and append to the DOM
            let individualOrder =`
            <div id="${i}" class="section container order-details z-depth-1">
                <div class="row custom-row">
                    <div class="row valign-wrapper">
                        <h5 class="col s8 m10">Szczegóły zamówienia</h5>
                        <button class="col s4 m2 btn-small indigo accent-2 go-back-btn">WRÓĆ<i class="material-icons left">navigate_before</i> </button>
                    </div>
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
                            <h6>Przesyłka</h6>
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
                            <span class="blue-grey-text text-darken-2">Numer do sledzenia przesyłki:</span> ${order.trackingNumber}    
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

    //ORDER FORM SUBMISSION
    //enclosing form submission function in the scope passing user so we can get userId to add to order
    function orderSubmissionScope(user) {
        let userId = user.uid;    
        let orderSubmitForm = document.getElementById("submitOrderForm");
        orderSubmitForm.addEventListener('submit', formSubmission)
        function formSubmission(event){
            //---------------------------------------------------
            //Call submitForm function
            submitForm(event); 
            //---------------------------------------------------
                    //Define helper functions inside OrderSubmissionScope

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
                        let dateCreated = firebase.firestore.FieldValue.serverTimestamp();
                                
                                
                        // Call saveOrder to firestore
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
                            orderSubmitForm.reset();
                            //Show user a message that form was send
                            orderSent();
                        })
                        .catch(error => {
                            alert(error.message);
                            console.error("Error adding document: ", error);
                        });
                    }     
        }
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

    //DISPLAY USER EMAIL AND UNIQUE ID
    function displayEmail(user) {

        usersRef.doc(user.uid).get().then(snapshot => {
            let userData = snapshot.data();
            let userInfo = document.getElementById('user-info');
            let userInfoModal = document.getElementById('userInfoContent');
            let userWelcomeMessage = document.getElementById('welcome-message');

            let userInfoHtml =`
            <li class="bold waves-effect"><i class="material-icons amber-text text-accent-2 medium">verified_user</i></li>
            <h5>WITAMY W GLOBAL</h5>
            <li><p class="teal-text">${user.email}</p></li>
            `;
            let userInfoModalHtml = `
            <div id="accountInfoTitle" class="row z-depth-1">
            <h4 class="center-align">Twoje dane</h4>
            </div>
            <p class="teal-text"><span class="grey-text">Imię i nazwisko: </span><br>${userData.firstName} ${userData.lastName}</p>
            <p class="teal-text"><span class="grey-text">Zalogowany jako: </span><br>${user.email}</p>
            <p class="teal-text"><span class="grey-text">Unikalny nr ID: </span><br>${user.uid}</p>
            `;
            let userWelcomeMessageHtml =`
            <h4>Witaj ${userData.firstName},</h4>
            <p class="grey-text">Kliknij w przycisk "NOWE ZLECENIE" aby wysłać paczkę, następnie wypełnij wszystkie wymagane pola. 
            <br>Uwaga! Nie realizujemy zleceń bez wczesniejszej zaplaty.
            <br>Upewnij się, że dokonałeś przelewu w ciągu 24 godzin po złożeniu zamówienia.</p>
            `;

            userInfo.innerHTML = userInfoHtml;
            userInfoModal.innerHTML = userInfoModalHtml;
            userWelcomeMessage.innerHTML = userWelcomeMessageHtml;
        });

        
    }


    //---------------------------------------------------------------------------------
    //PAGE BEHAVIOUR FUNCTIONS

    //show order form
    const addOrderBtn = document.getElementById("add-new-order");
    const addOrderLink = document.getElementById("new-order-menu-link");
    addOrderBtn.addEventListener('click', displayOrderForm);
    addOrderLink.addEventListener('click', displayOrderForm);

    function displayOrderForm() {
        document.getElementById("welcome-message").style.display = "none";
        document.getElementById("order-sent").style.display = "none";
        document.getElementById("orders-list-user").style.display = "none";
        document.getElementById("send-parcel-form").style.display = "block";
        document.querySelectorAll(".order-details").forEach(order => {
          order.style.display = "none"
        });
    }

    //close all content 
    let closeForm = document.getElementById("close-form");
    closeForm.addEventListener('click', closeAllContent) 

    function closeAllContent() {
        document.getElementById("welcome-message").style.display = "none";
        document.getElementById("order-sent").style.display = "none";
        document.getElementById("orders-list-user").style.display = "none";
        document.getElementById("send-parcel-form").style.display = "none";
        document.querySelectorAll(".order-details").forEach(order => {
          order.style.display = "none"
        });
    }

    //show list of user orders
    let showAllOrdersLink = document.getElementById("show-all-orders-user");
    showAllOrdersLink.addEventListener('click', showAllOrders);

    function showAllOrders() {
        document.getElementById("welcome-message").style.display = "none";
        document.getElementById("order-sent").style.display = "none";
        document.getElementById("orders-list-user").style.display = "block";
        document.getElementById("send-parcel-form").style.display = "none";
        document.querySelectorAll(".order-details").forEach(order => {
          order.style.display = "none"
        });
    }

    let closeAllOrdersBtn = document.getElementById("close-table-user");
    closeAllOrdersBtn.addEventListener('click', closeAllContent); 

    //filter orders 
    let sortOrderList = document.getElementById('sort-orders');
    sortOrderList.addEventListener('change', filterItems);

    function filterItems(event){
        let searchedOrder = event.target.value;
        let allOrders = document.querySelectorAll('.order-wrapper');

        //The code below ensures that table on mobile screens is formated properly when filtering orders
        //On big screen display as table-row
        if (window.innerWidth > 992) {
            if (searchedOrder === 'all') {
                allOrders.forEach(order => {
                    console.log(searchedOrder);
                    order.style.display = 'table-row';
                })
            } 
            if (searchedOrder === 'oczekujace' || searchedOrder === 'zrealizowane') {
                allOrders.forEach(order => {
                    if (order.children[4].textContent.toLowerCase().includes(searchedOrder.toLowerCase())) {
                        order.style.display = 'table-row';
                    } else {
                        order.style.display = 'none';
                    };
                });
            };   

        //On mobile screens display as inline-block
        } else {
            if (searchedOrder === 'all') {
                allOrders.forEach(order => {
                    console.log(searchedOrder);
                    order.style.display = 'inline-block';
                })
            } 
            if (searchedOrder === 'oczekujace' || searchedOrder === 'zrealizowane') {
                allOrders.forEach(order => {
                    if (order.children[4].textContent.toLowerCase().includes(searchedOrder.toLowerCase())) {
                        order.style.display = 'inline-block';
                    } else {
                        order.style.display = 'none';
                    };
                });
            };   
        }
    }

    //Show/hide order details
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
            document.getElementById('close-table-user').click();
            //remove order-details class to make order visible
            document.getElementById(event.target.nextElementSibling.getAttribute('href').substring(1)).style.display = 'block';
            }

    //Hide order details when go back button is clicked
    let goBackButton = document.querySelectorAll(".go-back-btn");
            goBackButton.forEach(button =>{
                button.addEventListener('click', showAllOrders)
            })

    }
})

