/* jshint devel:true, browser: true*/
/* globals jQuery, Parse, PhotoSwipe */

var yamazaki = (function(y, $, Parse, PhotoSwipe){

    'use strict';

    // TODO: after integrating with Browserify

    //var Pictures = require(pictures.js);
    //var Slider = require(slider.js);
    //var Config = require(config.js);

    var Pictures = y.Pictures,
        photoSwipe,
        psItems = [],
        photoIndex = 0,
        pollTimeout;

    y.Config = y.Config.init({eventId: 'joan-kristin', slideDuration: 3000, pollInterval: 5000, animaton: 'slideshow'});

    var buildPhotoSwipePic = function buildPhotoSwipePic(userPhoto){
        return {
            src: userPhoto.get('imageFile').url(),
            h: 0,
            w: 0,
            html: 'test'
        };
    };

    var addPhotos = function appendSlides(newPhotos){
      var deferred = $.Deferred();
      var photoSwipePics = [];
      var initialIndex = photoIndex;
      // TODO: make async
      $.each(newPhotos, function(i, photo){
        $('#gallery').append(createHtmlPic(photo));
        photoSwipePics.push(buildPhotoSwipePic(photo));
        photoIndex = photoIndex+1;
      });
      var newElems = $('#gallery').find('.square').slice(initialIndex); // get the sub-array of the newly added elements
      deferred.resolve({photoSwipePics: photoSwipePics, newElems: newElems});
      return deferred.promise();
    };

    var bindClick = function bindClick(args){
      args.newElems.on('click', function(){
        var index = $(this).data('index');
        showPhotoSwipe(index);
      });
    };

    var showPhotoSwipe = function showPhotoSwipe(index){
      var pswpElement = document.querySelectorAll('.pswp')[0];
      var options = {
          // optionName: 'option value'
          // for example:
          index: index // start at first slide
      };
      photoSwipe = new PhotoSwipe(pswpElement, PhotoSwipeUI_Default, psItems, options);

      photoSwipe.listen('gettingData', function calculateItemWidthAndHeight(index, item) {
        if (item.w < 1 || item.h < 1) { // unknown size
          var img = new Image();
          img.onload = function() { // will get size after load
            item.w = this.width; // set image width
            item.h = this.height; // set image height
            photoSwipe.invalidateCurrItems(); // reinit Items
            photoSwipe.updateSize(true); // reinit Items
          };
          img.src = item.src; // let's download image
        }
    });

    photoSwipe.init();

    };

    var setPollInterval = function setPollInterval(pollInterval){
      pollTimeout = setTimeout(function(){
        getAndRenderNewPictures();
        setPollInterval(pollInterval);
      }, pollInterval);
    };

    var createHtmlPic = function createImgTag(photo){
        return '<div class="lazy square" data-index="'+photoIndex+'" data-original="'+photo.get('imageFile').url()+'" style="background-color:grey;"></div>';
    };

    var lazyLoad = function lazyLoad(args){
        args.newElems.lazyload({
          effect : 'fadeIn'
        });
    };

    var updatePhotoSwipe = function(args){
      Array.prototype.push.apply(psItems, args.photoSwipePics); // add new elements to the permanent array
      if(!!photoSwipe){ // photoSwipe is already initialized
        Array.prototype.push.apply(photoSwipe.items, args.photoSwipePics);
      }
    };

    var getAndRenderNewPictures  = function getAndRenderNewPictures(){
      return Pictures.getNew().then(addPhotos).done(updatePhotoSwipe,lazyLoad,bindClick);
    };

    var hideAddressBar = function hideAddressBar(){
        // When ready...
        window.addEventListener('load',function() {
        	// Set a timeout...
        	setTimeout(function(){
        		// Hide the address bar!
        		window.scrollTo(0, 1);
        	}, 0);
        });
    };

    var init = function init(pictures){
        hideAddressBar();
        Parse.initialize(y.GLOBALS.parse.key1, y.GLOBALS.parse.key2);
        Pictures.init(Parse);
        getAndRenderNewPictures();
        setPollInterval(y.Config.config.pollInterval());
        //y.Config.register('slidesChannel', configure);
    };

    y.Gallery = Object.freeze({
        init: init
    });

    return y; // make all functions public

})(yamazaki || {}, jQuery, Parse, PhotoSwipe);

yamazaki.Gallery.init();
