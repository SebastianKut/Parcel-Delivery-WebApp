//Admin panel related
document.addEventListener('DOMContentLoaded', function() {

// enable save button when status of the order changes
Array.from(document.getElementsByClassName('status-change')).forEach(item => {
    item.addEventListener('change', function() {
        document.getElementById('save-order-changes-admin').style.display = 'inline-block';
    })
});

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

});