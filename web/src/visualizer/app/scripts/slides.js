/* jshint devel:true, browser: true*/
/* globals jQuery, Reveal */

var yamazaki = (function(y, $, Reveal){

    'use strict';

    var Pictures,
        pollTimeout,
        slides = [];

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

    var addPhotos = function appendSlides(newPhotos){
        if(!!Reveal && !!Reveal.add){
            $.each(newPhotos, function(i, photo){
                Reveal.add(createImgTag(photo));
            });
        }
    };

    var setPollInterval = function setPollInterval(pollInterval){
        pollTimeout = setTimeout(function(){
            Pictures.getNew().then(addPhotos);
            setPollInterval(pollInterval);
        }, pollInterval);
    };

    // var resetSlidesIfNeeded = function resetSlidesIfNeeded(){
    //
    //     var i = Reveal.getTotalSlides();
    //     while(i>0){
    //         Reveal.remove();
    //         i = i-1;
    //     }
    // };

    var renderHtml = function render(newPhotos){
        var defer = $.Deferred();
        var htmlSlides = generateHtmlPhotoElements(newPhotos);
        $('.slides').append(htmlSlides);
        defer.resolve();
        return defer;
    };

    var generateHtmlPhotoElements = function generatePhotoElements(userPhotos){
        slides = [];
        $.each(userPhotos, function(i, photo){
            slides.push(createHtmlPhotoSlide(photo));
        });
        return slides;
    };

    var createHtmlPhotoSlide = function createPhotoSlide(photo){
        return '<section>'+createImgTag(photo)+'</section>';
    };

    var createImgTag = function createImgTag(photo){
        return '<img height='+(y.GLOBALS.slider.height-60)+'px" src="'+photo.get('imageFile').url()+'" />';
    };

    var init = function init(pictures){
        Pictures = pictures;
        //resetSlidesIfNeeded();
        Pictures.getNew().then(renderHtml).then(function(){
            Reveal.initialize(getConfiguration());
        });
        setPollInterval(y.Config.config.pollInterval());
        y.Config.register('slidesChannel', configure);
    };

    y.Slides = Object.freeze({
        init: init,
        exists: exists,
        configure: configure
    });

    return y; // make all functions public

})(yamazaki || {}, jQuery, Reveal);
