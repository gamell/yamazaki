/* jshint devel:true, browser: true*/
/* globals jQuery */

var yamazaki = (function(y, $){

    'use strict';

    var f = {};

    y.GLOBALS = Object.freeze({
        parse: {
            key1: '9CqsDKHNK3zKxYKsOUik8n3gE4qusfIgU2NRDh5m',
            key2: 'UR2IOAd8kxtPRfSoCEeGcmfxMLiXGl16acr4lg6S'
        },
        slideshow: {
            selector: '#slideshow',
            jssorSelector: 'slideshow',
            slides: {
                selector: '#slides'
            }
        }
    });

    f.getViewportDimensions = function getViewportDimensions(){
        return {
            width: f.getWidth(),
            height: f.getHeight()
        };
    };

    f.getHeight = function getHeight(){
        return $(window).height();
    };

    f.getWidth = function getwidth(){
        return $(window).width();   
    };

    y.Utils = Object.freeze(f);

    return y;

})(yamazaki || {}, jQuery);
