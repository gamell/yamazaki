/* jshint devel:true, browser: true*/
/* globals jQuery */

var yamazaki = (function(y, $){

    'use strict';

    var f = {};

    y.GLOBALS = Object.freeze({
        parse: {
            key1: 'K5c8xoRqn6pBPcqgPNWdKgG6YdYNdvODhzYcDuC0',
            key2: 'DtdkLxjVPE0ELK3t5ZvaKmOcGtmkJqfAVlrld1m2'
        },
        slider: {
            height: 960,
            width: 1600
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
