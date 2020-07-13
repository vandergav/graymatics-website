$(document).ready(function () {
      $(".btn-select").each(function (e) {
          var value = $(this).find("ul li.selected").html();
          if (value != undefined) {
              $(this).find(".btn-select-input").val(value);
              $(this).find(".btn-select-value").html(value);
          }
      });
  });

  $(document).on('click', '.btn-select', function (e) {
      e.preventDefault();
      var ul = $(this).find("ul");
      if ($(this).hasClass("active")) {
          if (ul.find("li").is(e.target)) {
              var target = $(e.target);
              target.addClass("selected").siblings().removeClass("selected");
              var value = target.html();
              $(this).find(".btn-select-input").val(value);
              $(this).find(".btn-select-value").html(value);
          }
          ul.hide();
          $(this).removeClass("active");
      }
      else {
          $('.btn-select').not(this).each(function () {
              $(this).removeClass("active").find("ul").hide();
          });
          ul.slideDown(300);
          $(this).addClass("active");
      }
  });

  $(document).on('click', function (e) {
      var target = $(e.target).closest(".btn-select");
      if (!target.length) {
          $(".btn-select").removeClass("active").find("ul").hide();
      }
  }); 


// Menu Toggle Script
$("#menu-toggle").click(function(e) {
  e.preventDefault();
  $("#wrapper").toggleClass("toggled");
});


// add-class
$(function() {
  $(".video-show").click(function() {
    $(".all-cameras").addClass("camera-views");
    $(".big-size").addClass("show-big-video");
  });
});

// remove-class
$(function() {
  $(".zoom-out").click(function() {
    $(".big-size").removeClass("show-big-video");
    $(".all-cameras").removeClass("camera-views");
  });
});

// on-click-add-class
$('.red-notified').on('click', function(){
  $('.nav-tabs').addClass('red-border');
  $('.nav-tabs').removeClass('yellow-border');
  $('.nav-tabs').removeClass('green-border');
});
$('.yellow-notified').on('click', function(){
  $('.nav-tabs').addClass('yellow-border');
  $('.nav-tabs').removeClass('red-border');
  $('.nav-tabs').removeClass('green-border');
});
$('.green-notified').on('click', function(){
  $('.nav-tabs').addClass('green-border');
  $('.nav-tabs').removeClass('red-border');
  $('.nav-tabs').removeClass('yellow-border');
});

// onclick-change-image
$('#thumbs img').click(function(){
  $('#largeImage').attr('src',$(this).attr('src').replace('thumb','large'));
});


// search-script
$(document).ready(function(){

  $('a').click(function(e){
   e.preventDefault();
  });

  var awesomeBar = {

    dropdown1: $('.dropdown-content'),
    isOpen: false,

    toggleSearch: function(){
      $('input').blur();
      $('.awesome-container')
        .toggleClass('toggle-search')
          .find('input')
            .val(null)
    },
    
    toggleResults: function(){
      $('.awesome-results').show();
      if(!$('input').val().length >= 1){
        $('.awesome-results').hide();
      }
    },

    toggleMenu: function(event){
      awesomeBar.isOpen = true;
      awesomeBar.dropdown1.toggleClass('block');

      setTimeout(function(){
        awesomeBar.dropdown1.toggleClass('show-dropdown');
      }, 100);

      event.stopPropagation();

      if(awesomeBar.isOpen){
        $(document).click(function(e) {
          awesomeBar.closeMenu();
        });
      }
    },

    closeMenu: function(){
      awesomeBar.dropdown1.removeClass('show-dropdown block');
      awesomeBar.isOpen = false;
    },
    
    showCloseIcon: function(){
      $('.dropdown1')
        .text('close')
          .addClass('close-search')
            .removeClass('dropdown1')
              .off('click', awesomeBar.toggleMenu);
      
      $('#awesome-input').focus();
    },
    
    showStatus: function(){      
     var status = awesomeBar.dropdown1.find('li:last-child');
    },
    
    hideCloseIcon: function(){
      console.log('hey');
      $('.close-search')
        .text('more_vert')
          .addClass('dropdown1')
            .removeClass('close-search');
      $('.dropdown1').on('click', awesomeBar.toggleMenu);
      $('.search-icon').show();
      $('input').val('');
    },
    
    labelSwap: function(el){
      $('.input-field label').text(el.text());
      
      if(awesomeBar.dropdown1.last()){
        $('.search-icon').hide();
      }
    },    
  };

  $('.dropdown1').on('click', awesomeBar.toggleMenu);
  $('body').on('click', '.close-search', awesomeBar.hideCloseIcon);
  $('input').keyup(awesomeBar.toggleResults);  
  awesomeBar.showStatus();  
  // Mousetrap.bind('ctrl+space', function(e) {
  //   $('input').blur();
  //   awesomeBar.toggleSearch();
  //   $('.awesome-results').hide();
  // });
  
});
