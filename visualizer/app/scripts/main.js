/* jshint devel:true, browser: true*/
/* globals jQuery */

var yamazaki = (function(y, $){

   'use strict';

    var f = {};
    
    f.init = function init(){
        var initParse = y.Parse.init(),
            documentReady = $(document).ready();

        $.when(documentReady, initParse).done(function(){
            y.Pictures.render();
            y.Slider.init();
        });
    };
    
    y.init = f.init;

    return y;

})(yamazaki || {}, jQuery);

yamazaki.init();

