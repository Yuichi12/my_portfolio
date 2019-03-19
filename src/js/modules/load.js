import $ from 'jquery';

function load() {
  $(function(){
    $(window).on('load', function(){
      $('.js-load-bg').hide();
      $('.js-hero-anime').addClass('animated rollIn');
      $('.js-show-header').addClass('animated fadeIn delay-1s');
    });
  });
}

export default load;