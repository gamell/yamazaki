/* jshint devel:true, browser: true*/
/* globals jQuery, Parse */

var yamazaki = (function(y, $, Parse){

   'use strict';

   // TODO: after integrating with Browserify

   //var Pictures = require(pictures.js);
   //var Slider = require(slider.js);

   var Pictures = y.Pictures,
       Slides = y.Slides;

    var f = {};

    f.init = function init(){
        Parse.initialize(y.GLOBALS.parse.key1, y.GLOBALS.parse.key2);
        Pictures.init(Parse);
        $(document).ready(function(){
            Slides.init(Pictures);
        });
    };

    y.init = f.init;

    return y;

})(yamazaki || {}, jQuery, Parse);

yamazaki.init();
