/* jshint devel:true, browser: true*/
/* globals jQuery, Reveal */

var yamazaki = (function(y, $, Reveal){  

    'use strict';

    var defaults = {
        slideDuration: 3000,
        animation: 'slide',
        progress: true
    }

    var init = function init(data){

        data = $.extend(data, defaults);

        Reveal.initialize({
                controls: true,
                progress: true,
                //history: true,
                //center: true,
                margin: 0,
                autoSlide: data.slideDuration,
                loop: data.loop,
                height: y.GLOBALS.slider.height,
                width: y.GLOBALS.slider.width,


                transition: data.animation, // none/fade/slide/convex/concave/zoom

                // Optional reveal.js plugins
                dependencies: [
                    { src: 'scripts/lib/plugin/add-remove.js', async: true } /* adds support to add slides dinamically */ 
                    // { src: 'scripts/lib/classList.js', condition: function() { return !document.body.classList; } },
                    // { src: 'scripts/lib/plugin/markdown/marked.js', condition: function() { return !!document.querySelector( '[data-markdown]' ); } },
                    // { src: 'scripts/lib/plugin/markdown/markdown.js', condition: function() { return !!document.querySelector( '[data-markdown]' ); } },
                    // { src: 'scripts/lib/plugin/highlight/highlight.js', async: true, condition: function() { return !!document.querySelector( 'pre code' ); }, callback: function() { hljs.initHighlightingOnLoad(); } },
                    // { src: 'scripts/lib/plugin/zoom-js/zoom.js', async: true },
                    // { src: 'scripts/lib/plugin/notes/notes.js', async: true }
                ]
        });

    };

    y.Slider = { init: init };

    return y; // make all functions public

})(yamazaki || {}, jQuery, Reveal);