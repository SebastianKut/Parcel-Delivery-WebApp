//COMMON JS CODE FOR ALL PAGES (MATERIALIZE UI ELEMENTS AND CUSTOM UI FUNCTIONS)
 
document.addEventListener('DOMContentLoaded', function() {

  //MATERIALIZE MODULES INITIALIZATION
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

  //CUSTOM UI RELATED FUNCTIONS 
  window.addEventListener('scroll', displayProgressBar);

  function displayProgressBar(){
    //show horizontal progress bar
      let windowScroll = document.documentElement.scrollTop || document.body.scrollTop; 
      let height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      let scrolledPercentage = (windowScroll / height) * 100;
      document.getElementById('progress-bar').style.width = `${scrolledPercentage}%`;
  }

});


