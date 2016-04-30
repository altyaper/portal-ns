(function(exports) {
  "use strict";

  function PortalAnimation() {}

  exports.PortalAnimation = PortalAnimation;

  PortalAnimation.prototype = {
    animation   : null,
    canvas      : document.getElementById('canvas'),
    localVideo  : document.getElementById('localvideo'),
    remoteVideo : document.getElementById('remotevideo'),
    portalparam : window.location.search.split('=')[1],
    colors  : {
        yellow : {
          r : 255,
          g : 130,
          b : 0
        },
        blue : {
          r : 1,
          g : 80,
          b : 255
        },
        darkblue : {
          r : 3,
          g : 40,
          b : 155
        },
        defaultcolor: {
          r : 50,
          g : 50,
          b : 55
        }
    },
    init: function() {

      var palette;
      var paletteoffset = 0;
      var canvas = document.getElementById('canvas');
      var ctx = this.canvas.getContext('2d');
      ctx.canvas.width = window.innerWidth;
      ctx.canvas.height = window.innerHeight;
      var height = canvas.height;
      var width = canvas.width;
      // plasma source width and height
      var pwidth = 200, pheight = pwidth * (height /width);
      // scale the plasma source to the canvas width/height
      var vpx = width /pwidth, vpy = height /pheight;
      var time = Date.now() / 20;

      // initialisation
      if (typeof palette === 'undefined') {
          palette = [];
          for (var i =0,r,g,b; i <256; i++) {
              r = ~~(this.getPortalColor().r + 0.2 * Math.sin(Math.PI * i / 32));
              g = ~~(this.getPortalColor().g + 10 * Math.sin(Math.PI * i / 64));
              b = ~~(this.getPortalColor().b + 10 * Math.sin(Math.PI * i / 128));
              palette[i] = 'rgb(' + ~~r + ',' + ~~g + ',' + ~~b + ')';
          }
      }

      var dist = function (a, b, c, d) {
          return Math.sqrt((a - c) * (a - c) + (b - d) * (b - d));
      };



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

    },
    getPortalColor  : function(){
      if(this.portalparam){
        return this.colors[this.portalparam];
      }else{
        return this.colors.defaultcolor;
      }
    },
    comunication: function(enable){

      this.canvas.style.display = (enable)? 'none' : 'inline';
      if (enable) {
          this.stopAnimate();
      }else {
          this.animate();
      }
      this.remoteVideo.style.display = (enable)? 'inline' : 'none';
      this.localVideo.style.display = (enable)? 'inline' : 'none';

    },
    animate: function(){

      var self = this;
      this.animation = setInterval(function() {
          self.init();
      }, 0);
      return this.animation;

    },
    stopAnimate: function(){

      if (this.animation !== undefined) {
          clearInterval(this.animation);
          this.animation = undefined;
      }

    }
  };
})(this);
