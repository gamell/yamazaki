var yamazaki = (function(y, Slider){  

    'use strict';

    var f = {};

    f.init = function init(){
        var options = {
            $AutoPlay: true,                                   //[Optional] Whether to auto play, to enable slideshow, this option must be set to true, default value is false
            $DragOrientation: 1                                //[Optional] Orientation to drag slide, 0 no drag, 1 horizental, 2 vertical, 3 either, default value is 1 (Note that the $DragOrientation should be the same as $PlayOrientation when $DisplayPieces is greater than 1, or parking position is not 0)
        };
        f.slider = new Slider(y.GLOBALS.slideshow.jssorSelector, options);
    };

    y.Slider = f;

    return y; // make all functions public

})(yamazaki || {}, $JssorSlider$);