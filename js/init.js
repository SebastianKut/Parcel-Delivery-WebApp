// (function($){
//   $(function(){
//     $('.carousel').carousel();
    
//   }); // end of document ready
// })(jQuery); // end of jQuery name space


document.addEventListener('DOMContentLoaded', function() {
  let sideNav = document.querySelectorAll('.sidenav');
  M.Sidenav.init(sideNav, {});

  let parallax = document.querySelectorAll('.parallax');  
  M.Parallax.init(parallax, {});

  let modal = document.querySelectorAll('.modal');
  M.Modal.init(modal, {});

  let carousel = document.querySelectorAll('.carousel');
  M.Carousel.init(carousel, {
    numVisible: 5,
    shift: 25,
    padding: 0,
    dist: -20,
    indicators: true,
  });

  let collapsible = document.querySelectorAll('.collapsible');
  M.Collapsible.init(collapsible, {});

 
  let dropdownMenu = document.querySelectorAll('select');
  M.FormSelect.init(dropdownMenu, {});
  

//Custom scripts
window.addEventListener('scroll', displayProgress);

function displayProgress(){
    let windowScroll = document.documentElement.scrollTop || document.body.scrollTop; 
    let height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    let scrolledPercentage = (windowScroll / height) * 100;
    document.getElementById('progress-bar').style.width = `${scrolledPercentage}%`;
}

let addOrderBtn = document.getElementById("add-new-order");
let addOrderLink = document.getElementById("new-order-menu-link");
addOrderBtn.addEventListener('click', displayOrderForm);
addOrderLink.addEventListener('click', displayOrderForm);

function displayOrderForm() {
document.getElementById("welcome-message").style.display = "none";
document.getElementById("order-sent").style.display = "none";
document.getElementById("send-parcel-form").style.display = "block";
}

let orderSubmitBtn = document.getElementById("order-submit-button");
orderSubmitBtn.addEventListener('click', orderSent)

function orderSent() {
document.getElementById("order-sent").style.display = "block";
document.getElementById("send-parcel-form").style.display = "none";
}

let closeForm = document.getElementById("close-form");
closeForm.addEventListener('click', closeInputForm) 

function closeInputForm(){
document.getElementById("send-parcel-form").style.display = "none";
document.getElementById("welcome-message").style.display = "block";
}


});


//Custom scripts
// window.addEventListener('scroll', displayProgress);

// function displayProgress(){
//     let windowScroll = document.documentElement.scrollTop || document.body.scrollTop; 
//     let height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
//     let scrolledPercentage = (windowScroll / height) * 100;
//     document.getElementById('progress-bar').style.width = `${scrolledPercentage}%`;
// }


