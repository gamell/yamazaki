/* jshint devel:true, browser: true*/
/* globals jQuery, Reveal */

var yamazaki = (function(y, $, Reveal){

    'use strict';

    var MAX_SLIDES = 50;

    var Pictures,
        pollTimeout,
        slides = [],
        allSeen;

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

    var goTo = function goTo(index){
      Reveal.slide(index);
    };

    var addPhotos = function appendSlides(newPhotos){
        if(!!Reveal && !!Reveal.add){
          var gotoSlide;
          $.each(newPhotos, function(i, photo){
            Reveal.add(createImgTag(photo));
            if(i === 0){
              gotoSlide = Reveal.getTotalSlides()-1; // we save a pointer to the first appended slide of the batch
            }
          });
          if(allSeen){
            allSeen = false;
            goTo(gotoSlide);
          }
        }
    };

    var removeSlidesUpTo = function removeSlidesUpTo(index){
        for(var i = 0; i < index; i = i+1){
          Reveal.remove(0); // we keep removing the first slide n times (~ array.pop())
        }
    };

    var setPollInterval = function setPollInterval(pollInterval){
        pollTimeout = setTimeout(function(){
            Pictures.getNew().then(addPhotos);
            setPollInterval(pollInterval);
        }, pollInterval);
    };

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

    var slideChanged = function slideChanged( event ) {
      // event.previousSlide, event.currentSlide, event.indexh, event.indexv
      if(event.indexh === 0){ // we saw all the previous pics
        allSeen = true;
        var slideCount = Reveal.getTotalSlides();
        if (slideCount > MAX_SLIDES){
          removeSlidesUpTo(slideCount-MAX_SLIDES);
        }
      }
    };

    var init = function init(pictures){
        Pictures = pictures;
        Pictures.init(Parse, 'joan-kristin');
        //resetSlidesIfNeeded();
        Pictures.getNew().then(renderHtml).then(function(){
            Reveal.initialize(getConfiguration());
            allSeen = false;
            Reveal.addEventListener( 'slidechanged', slideChanged);
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
