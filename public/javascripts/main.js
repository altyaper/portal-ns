'use strict';

$(document).ready(function() {

    setLayout();
    $(document).resize(function() {
        setLayout();
    });
    function setLayout() {
        $('.remote').height($(window).height());
    }

    $('#hide-local-preview').click(function() {
        $('.r-b-corner').toggleClass('hidden');
    });

});
