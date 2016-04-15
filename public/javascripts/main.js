'use strict';
$(document).ready(function() {

    setLayout();
    $(window).resize(function() {
        setLayout();
    });
    function setLayout() {
        $('.remote').height($(window).height());
    }

    $('#hide-local-preview').click(function() {
        $('.r-b-corner').toggleClass('hidden');
    });


    document.onkeypress = function (e) {
        e = e || window.event;
        if(e.charcode === 101) {
            var local = $('.remote').get(0);
            if ($(this).get(0).requestFullscreen) {
                local.requestFullscreen();
            } else if ($(this).get(0).mozRequestFullScreen) {
                local.mozRequestFullScreen();
            } else if ($(this).get(0).webkitRequestFullscreen) {
                local.webkitRequestFullscreen();
            }
        }
    };

});
