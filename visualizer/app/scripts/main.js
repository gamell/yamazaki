/* jshint devel:true, browser: true*/
/* globals jQuery, Parse */

var yamazaki = (function(y, $, Parse){

   'use strict';

   // TODO: after integrating with Browserify

   //var Pictures = require(pictures.js);
   //var Slider = require(slider.js);
   //var Config = require(config.js);

   y.Config = y.Config.init({eventId: 'test-event', slideDuration: 3000, pollInterval: 5000, animaton: 'slideshow'});

    var f = {};
    
    f.initParse = function initParse(){
        Parse.initialize(y.GLOBALS.parse.key1, y.GLOBALS.parse.key2);
    };

    f.init = function init(){
        f.initParse();
        $(document).ready(function(){
            y.Pictures.init();           
        });
    };
    
    y.init = f.init;

    return y;

})(yamazaki || {}, jQuery, Parse);

yamazaki.init();

