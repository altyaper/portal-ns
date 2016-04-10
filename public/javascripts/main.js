'use strict';

$(document).ready(function() {
  $(".remote").height($(window).height());
  $(document).resize(function() {
    $(".remote").height($(window).height());
  });
});
