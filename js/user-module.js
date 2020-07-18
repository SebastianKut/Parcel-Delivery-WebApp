
document.addEventListener('DOMContentLoaded', function() {
//CUSTOM SCRIPTS
//User panel related

let addOrderBtn = document.getElementById("add-new-order");
let addOrderLink = document.getElementById("new-order-menu-link");
addOrderBtn.addEventListener('click', displayOrderForm);
addOrderLink.addEventListener('click', displayOrderForm);

function displayOrderForm() {
document.getElementById("welcome-message").style.display = "none";
document.getElementById("order-sent").style.display = "none";
document.getElementById("orders-list-user").style.display = "none";
document.getElementById("send-parcel-form").style.display = "block";
}

let orderSubmitBtn = document.getElementById("order-submit-button");
orderSubmitBtn.addEventListener('submit', orderSent)

function orderSent() {
document.getElementById("order-sent").style.display = "block";
document.getElementById("send-parcel-form").style.display = "none";
document.getElementById("orders-list-user").style.display = "none";
document.getElementById("welcome-message").style.display = "none";
}

let closeForm = document.getElementById("close-form");
closeForm.addEventListener('click', closeAllContent) 

function closeAllContent(){
document.getElementById("order-sent").style.display = "none";
document.getElementById("orders-list-user").style.display = "none";
document.getElementById("send-parcel-form").style.display = "none";
document.getElementById("welcome-message").style.display = "block";
}

let showAllOrdersLink = document.getElementById("show-all-orders-user");
showAllOrdersLink.addEventListener('click', showAllOrders);

function showAllOrders() {
document.getElementById("order-sent").style.display = "none";
document.getElementById("send-parcel-form").style.display = "none";
document.getElementById("welcome-message").style.display = "none";
document.getElementById("orders-list-user").style.display = "block";
}

let closeAllOrdersBtn = document.getElementById("close-table-user");
closeAllOrdersBtn.addEventListener('click', closeAllContent); 


});
