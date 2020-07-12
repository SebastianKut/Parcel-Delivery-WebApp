// (function($){
//   $(function(){
//     $('.carousel').carousel();
    
//   }); // end of document ready
// })(jQuery); // end of jQuery name space


document.addEventListener('DOMContentLoaded', function() {
  var sideNav = document.querySelectorAll('.sidenav');
  M.Sidenav.init(sideNav, {});

  var parallax = document.querySelectorAll('.parallax');  
  M.Parallax.init(parallax, {});

  var modal = document.querySelectorAll('.modal');
  M.Modal.init(modal, {});

  var carousel = document.querySelectorAll('.carousel');
  M.Carousel.init(carousel, {
    numVisible: 5,
    shift: 25,
    padding: 0,
    dist: -20,
    indicators: true,
  });

});