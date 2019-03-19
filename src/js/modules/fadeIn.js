import $ from 'jquery';

function fadein() {
  $(function(){
    $(window).scroll(function(){
      var windowHeight = $(window).height(),
          topWindow = $(window).scrollTop();
      $('.js-fadein').each(function(){
       var targetPosition = $(this).offset().top;
       if(topWindow > targetPosition - windowHeight + 100){
        $(this).addClass("fadeIn");
       }
      });
     });
  });
}

export default fadein;