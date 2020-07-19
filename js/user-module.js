
document.addEventListener('DOMContentLoaded', function() {
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
document.getElementById("send-parcel-form").style.display = "block";
}

let orderSubmitBtn = document.getElementById("order-submit-button");
orderSubmitBtn.addEventListener('submit', orderSent)
//show order sent confirmation
function orderSent() {
document.getElementById("order-sent").style.display = "block";
document.getElementById("send-parcel-form").style.display = "none";
document.getElementById("orders-list-user").style.display = "none";
document.getElementById("welcome-message").style.display = "none";
}

let closeForm = document.getElementById("close-form");
closeForm.addEventListener('click', closeAllContent) 
//close all content and go back to welcome screen
function closeAllContent(){
document.getElementById("order-sent").style.display = "none";
document.getElementById("orders-list-user").style.display = "none";
document.getElementById("send-parcel-form").style.display = "none";
document.getElementById("welcome-message").style.display = "block";
}

let showAllOrdersLink = document.getElementById("show-all-orders-user");
showAllOrdersLink.addEventListener('click', showAllOrders);
//show all orders page
function showAllOrders() {
document.getElementById("order-sent").style.display = "none";
document.getElementById("send-parcel-form").style.display = "none";
document.getElementById("welcome-message").style.display = "none";
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
            if (order.children[3].textContent.toLowerCase().includes(searchedOrder.toLowerCase())) {
                order.style.display = 'table-row';
            } else {
                order.style.display = 'none';
            };
        });
    };     

}


});
