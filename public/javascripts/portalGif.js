window.onload = init;

var portalColor = window.location.search.split('=')[1];
var r1, g1, b1;

if (portalColor === '1') {
    r1 =255;
    g1 =130;
    b1 =0;
}else {
    r1 =1;
    g1 =80;
    b1 =255;
}

function init() {

    var palette;
    var paletteoffset = 0;

    var cv = document.getElementById('canvas');
    var ctx = cv.getContext('2d');
    ctx.canvas.width = window.innerWidth;
    ctx.canvas.height = window.innerHeight;
    var height = cv.height;
    var width = cv.width;
    // initialisation
    if (typeof palette === 'undefined') {
        palette = [];
        for (var i =0,r,g,b; i <256; i++) {
            r = ~~(r1 + 0.2 * Math.sin(Math.PI * i / 32));
            g = ~~(g1 + 10 * Math.sin(Math.PI * i / 64));
            b = ~~(b1 + 10 * Math.sin(Math.PI * i / 128));
            palette[i] = 'rgb(' + ~~r + ',' + ~~g + ',' + ~~b + ')';
        }
    }

    var dist = function dist (a, b, c, d) {
        return Math.sqrt((a - c) * (a - c) + (b - d) * (b - d));
    };

    // plasma source width and height
    var pwidth = 200, pheight = pwidth * (height /width);
    // scale the plasma source to the canvas width/height
    var vpx = width /pwidth, vpy = height /pheight;
    var time = Date.now() / 20;

    var colour = function(x, y) {
        // plasma function
        return (128 + (128 * Math.sin(x * 0.0625)) +
                128 + (128 * Math.sin(y * 0.03125)) +
                128 + (128 * Math.sin(dist(x + time, y - time, width, height) * 0.125)) +
                128 + (128 * Math.sin(Math.sqrt(x * x + y * y) * 0.125)) ) * 0.25;
    };

    // render plasma effect
    for (var y =0,x; y <pheight; y++) {
        for (x =0; x <pwidth; x++) {
            // map plasma pixels to canvas pixels using the virtual pixel size
            ctx.fillStyle = palette[~~(colour(x, y) + paletteoffset) % 256];
            ctx.fillRect(Math.floor(x * vpx), Math.floor(y * vpy), Math.ceil(vpx), Math.ceil(vpy));
        }
    }

    // palette cycle speed
    paletteoffset++;
    setTimeout(function() {
      init();
  }, 0);
}
