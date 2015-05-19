/* jshint devel:true, browser: true*/
/* globals jQuery, $JssorSlider$ */

var yamazaki = (function(y, $, Slider){  

    'use strict';

    var f = {
        sliderInstance : {}
    };

    f.defaultOptions = {
        $AutoPlay: true,
        $SlideHeight: 0,
        $FillMode: 1,                                   //[Optional] Whether to auto play, to enable slideshow, this option must be set to true, default value is false
        $DragOrientation: 1,                                //[Optional] Orientation to drag slide, 0 no drag, 1 horizental, 2 vertical, 3 either, default value is 1 (Note that the $DragOrientation should be the same as $PlayOrientation when $DisplayPieces is greater than 1, or parking position is not 0)
        $LazyLoading: 3    
    };

    f.options = $.extend(f.defaultOptions,{});

    f.setSlidesElemHeight = function setSlidesElemHeight(height){
        $(y.GLOBALS.slideshow.slides.selector).height(height);
    };

    f.init = function init(){

        var height = y.Utils.getHeight();

        f.options = $.extend(f.options, {
            $SlideHeight: height
        });

        f.setSlidesElemHeight(height);
        $(window).resize(function(){
            console.log('resize!!');
            f.scaleToHeight();
        });

        f.sliderInstance = new Slider(y.GLOBALS.slideshow.jssorSelector, f.options);
    };

    f.setDuration = function setDuration(){

    };

    f.scaleToHeight = function scaleToHeight(){
        var height = y.Utils.getHeight();
        f.setSlidesElemHeight(height);
        f.sliderInstance.$ScaleHeight(height);
    };

    y.Slider = f;

    return y; // make all functions public

})(yamazaki || {}, jQuery, $JssorSlider$);