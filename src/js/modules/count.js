import $ from 'jquery';

export default function count() {
  $(function () {
    console.log('確認するぜ');
    var $count = $('.js-get-count');

    $($count).on('keyup', function () {
      var $countShow = $('.js-count-show');
      var num = $count.val().length;
      $countShow.html(num);
    });

  });
}
