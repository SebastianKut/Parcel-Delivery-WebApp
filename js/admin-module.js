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
let ordersReference = db.collection('orders');

//initialize firebase auth
const auth = firebase.auth(); 

//------------------------------------------------------------------------



// enable save button when status of the order changes or delete checkbox checked
Array.from(document.getElementsByClassName('status-change')).forEach(item => {
    item.addEventListener('change', displaySaveBtn);
});
Array.from(document.getElementsByClassName('delete-order-check')).forEach(item => {
    item.addEventListener('change', displaySaveBtn);
});
    
//display save changes button    
function displaySaveBtn() {
    document.getElementById('save-order-changes-admin').style.display = 'inline-block';
};


// close orders window
let closeAllOrdersBtn = document.getElementById("close-table-admin");
closeAllOrdersBtn.addEventListener('click', closeAllContent); 
function closeAllContent(){
    document.getElementById("order-sent").style.display = "none";
    document.getElementById("orders-list-admin").style.display = "none";
    document.getElementById("send-parcel-form").style.display = "none";
    document.getElementById("order-details").style.display = "none";
    document.getElementById('save-order-changes-admin').style.display = "none";
    document.getElementById("welcome-message").style.display = "block";
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
    document.getElementById("order-details").style.display = "none";
    document.getElementById('save-order-changes-admin').style.display = "none";
    document.getElementById("welcome-message").style.display = "none";
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
    document.getElementById("order-details").style.display = "none";
    document.getElementById('save-order-changes-admin').style.display = "none";
    document.getElementById("welcome-message").style.display = "none";
    }

//sort orders according to option selected
let sortOrderList = document.getElementById('sort-orders');
sortOrderList.addEventListener('change', filterItems);
function filterItems(event){
    let searchedOrder = event.target.value;
    let allOrders = document.getElementsByClassName('order-wrapper');
    console.log(allOrders[1].children[4].textContent);

    // helper function to compare senders 
    function compareSenders(a, b) {
        if (a.firstElementChild.firstElementChild.textContent > b.firstElementChild.firstElementChild.textContent) return 1;
        if (b.firstElementChild.firstElementChild.textContent > a.firstElementChild.firstElementChild.textContent) return -1;
        return 0;
      } 
    // helper function to compare receivers
    function compareReceivers(a, b) {
        if (a.children[4].textContent > b.children[4].textContent) return 1;
        if (b.children[4].textContent > a.children[4].textContent) return -1;
        return 0;
    } 

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

        //sort by sender name
        if (searchedOrder === 'sender') {
            //may have to first display none otherwise they will display as they are even when the array is sorted
            //it doesnt work atm because the list is hardcoded in html, should work when created dynamically
            // Array.from(allOrders).forEach(order =>{
            //     order.style.display = 'none';    
            // });
           let sortedByName = Array.from(allOrders).sort(compareSenders);
           sortedByName.forEach(order => {
            order.style.display = 'table-row';
           })
        }

        //sort by receiver name
        if (searchedOrder === 'receiver') {
            //may have to first display none otherwise they will display as they are even when the array is sorted
            //it doesnt work atm because the list is hardcoded in html, should work when created dynamically
            // Array.from(allOrders).forEach(order =>{
            //     order.style.display = 'none';    
            // });
           let sortedByName = Array.from(allOrders).sort(compareReceivers);
           sortedByName.forEach(order => {
            order.style.display = 'table-row';
           })
        }


}

//find orders by clients name
let searchBox = document.getElementById('search-box');
searchBox.addEventListener('keyup', fliterByName);
function fliterByName(event) {
    let searchedName = event.target.value;
    let allOrders = document.getElementsByClassName('order-wrapper');
    console.log(allOrders[1].children[4].textContent);
    Array.from(allOrders).forEach(order => {
        if (order.firstElementChild.firstElementChild.textContent.toLowerCase().includes(searchedName.toLowerCase())){
            order.style.display = 'table-row';
        } else {
            order.style.display = 'none';
        }
    })

}


});