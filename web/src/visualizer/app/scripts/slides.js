/* jshint devel:true, browser: true*/
/* globals jQuery, Reveal */

var yamazaki = (function(y, $, Reveal){  

    'use strict';

    var init = function init(){

        Reveal.initialize(getConfiguration());
        y.Config.register('slidesChannel', configure);

    };

    var getConfiguration = function getConfiguration(){
        return {
                controls: true,
                progress: true,
                //history: true,
                //center: true,
                margin: 0,
                autoSlide: y.Config.config.slideDuration(),
                loop: y.Config.config.loop(),
                height: y.GLOBALS.slider.height,
                width: y.GLOBALS.slider.width,
                transition: y.Config.config.animation(), // none/fade/slide/convex/concave/zoom

                // Optional reveal.js plugins
                dependencies: [
                    { src: 'scripts/lib/plugin/add-remove.js', async: true } /* adds support to add and remove slides dinamically */ 
                    // { src: 'scripts/lib/classList.js', condition: function() { return !document.body.classList; } },
                    // { src: 'scripts/lib/plugin/markdown/marked.js', condition: function() { return !!document.querySelector( '[data-markdown]' ); } },
                    // { src: 'scripts/lib/plugin/markdown/markdown.js', condition: function() { return !!document.querySelector( '[data-markdown]' ); } },
                    // { src: 'scripts/lib/plugin/highlight/highlight.js', async: true, condition: function() { return !!document.querySelector( 'pre code' ); }, callback: function() { hljs.initHighlightingOnLoad(); } },
                    // { src: 'scripts/lib/plugin/zoom-js/zoom.js', async: true },
                    // { src: 'scripts/lib/plugin/notes/notes.js', async: true }
                ]
        };    
    };

    var exists = function exists(){
        return !!Reveal;    
    };

    var configure = function configure(){
        Reveal.configure( getConfiguration() );
    };

    y.Slides = { 
        init: init,
        exists: exists,
        configure: configure,
        reveal: Reveal,
    };

    return y; // make all functions public

})(yamazaki || {}, jQuery, Reveal);