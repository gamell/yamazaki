/* jshint devel:true, browser: true*/
/* globals jQuery, Parse, PhotoSwipe */

var yamazaki = (function(y, $, Parse, PhotoSwipe){

    'use strict';

    // TODO: after integrating with Browserify

    //var Pictures = require(pictures.js);
    //var Slider = require(slider.js);
    //var Config = require(config.js);

    var Pictures = y.Pictures,
        photoSwipe = undefined,
        pollTimeout;

    y.Config = y.Config.init({eventId: 'joan-kristin', slideDuration: 3000, pollInterval: 5000, animaton: 'slideshow'});

    var buildPhotoSwipePic = function buildPhotoSwipePic(userPhoto){
        console.log(JSON.stringify(userPhoto));
        return {
            src: userPhoto.get('imageFile').url(),
            h: 0,
            w: 0,
            html: 'test'
        };
    };

    var addPhotos = function appendSlides(newPhotos){
      var defer = $.Deferred();
      var photoSwipePics = [];
      $.each(newPhotos, function(i, photo){
        $('#gallery').append(createHtmlPic(photo));
        photoSwipePics.push(buildPhotoSwipePic(photo));
      });
      defer.resolve(photoSwipePics);
      return defer.promise();
    };

    var initPhotoSwipe = function initPhotoSwipe(items){
      var pswpElement = document.querySelectorAll('.pswp')[0];
      // define options (if needed)
      var options = {
          // optionName: 'option value'
          // for example:
          index: 0 // start at first slide
      };
      photoSwipe = new PhotoSwipe(pswpElement, PhotoSwipeUI_Default, items, options);

      photoSwipe.listen('gettingData', function(index, item) {
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
        return '<div class="lazy square" data-original="'+photo.get('imageFile').url()+'" style="background-color:grey;"></div>';
    };

    var lazyLoad = function initLazyLoader(){
      $(function() {
        $('div.lazy').lazyload({
          effect : 'fadeIn'
        });
      });
    };

    var updatePhotoSwipe = function(newPhotoSwipePics){
      if(!!photoSwipe){ // photoSwipe is already initialized
        Array.prototype.push.apply(photoSwipe, newPhotoSwipePics); // Add all items from second array into the first
      } else {
        initPhotoSwipe(newPhotoSwipePics);
      }
    };

    var getAndRenderNewPictures  = function getAndRenderNewPictures(){
      return Pictures.getNew().then(addPhotos).then(updatePhotoSwipe).then(lazyLoad);
    };

    var init = function init(pictures){
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
