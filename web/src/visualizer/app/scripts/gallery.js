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

    var buildPhotoSwipePic = function buildPhotoSwipePic(src, width, height){
        return {
            src: src,
            h: height,
            w: width,
            html: 'test'
        };
    };

    var addPhotos = function appendSlides(newPhotos){
      var deferred = $.Deferred();
      var photoSwipePics = [];
      var initialIndex = photoIndex;
      // TODO: make async
      $.each(newPhotos, function(i, photo){
        loadImage(photoIndex, photo).then(addPhotoSwipeItem);
        $('#gallery').append(createHtmlPic(photo));
        photoIndex = photoIndex+1;
      });
      var newElems = $('#gallery').find('.square').slice(initialIndex); // get the sub-array of the newly added elements
      deferred.resolve({photoSwipePics: photoSwipePics, newElems: newElems});
      return deferred.promise();
    };

    var addPhotoSwipeItem = function addPhotoSwipeItem(params){
        psItems[params.index] = params.psItem;
    };

    var loadImage = function loadImage(index, userPhoto){
        var deferred = $.Deferred();
        var img = new Image();
        var src = userPhoto.get('imageFile').url();
        img.onload = function() { // will get size after load
            deferred.resolve({index: index, psItem: buildPhotoSwipePic(src, this.width, this.height)});
        };
        img.src = src; // let's download image
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

    var setPollInterval = function setPollInterval(){
      pollTimeout = setTimeout(function(){
        getAndRenderNewPictures();
        setPollInterval();
      }, y.Config.config.pollInterval());
    };

    var createHtmlPic = function createImgTag(photo){
        return '<div class="square" data-index="'+photoIndex+'" style="background-image:url(\''+photo.get('imageFile').url()+'\')"></div>';
        //return '<div class="lazy square" data-index="'+photoIndex+'" data-original="'+photo.get('imageFile').url()+'" style="background-color:grey;"></div>';
    };

    var lazyLoad = function lazyLoad(args){

        //callback when the image is actually loaded
        args.newElems.load(function(){

        });

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

    var forceRefresh = function forceRefresh(){
        clearTimeout(pollTimeout);
        return getAndRenderNewPictures().done(setPollInterval);
    };

    var getAndRenderNewPictures  = function getAndRenderNewPictures(){
      return Pictures.getNew().then(addPhotos).done(updatePhotoSwipe,lazyLoad,bindClick);
    };

    var showInterstitial = function showInterstitial(){
        $('.spinner').css('display', 'block');
    };

    var hideInterstitial = function hideInterstitial(){
        $('.spinner').css('display', 'none');
    };

    var bindUpload = function bindUpload(){
        $('.trigger-upload').on('click', function(){
            $('input.upload').click();
        });

        $('input.upload').on('change', function(){
            showInterstitial();
            var fileUploadControl = $(this)[0];
            if (fileUploadControl.files.length > 0) {
                var file = fileUploadControl.files[0];
                Pictures.save(file).then(forceRefresh).done(hideInterstitial);
            }
        });

    };

    var init = function init(pictures){
        bindUpload();
        Parse.initialize(y.GLOBALS.parse.key1, y.GLOBALS.parse.key2);
        Pictures.init(Parse);
        getAndRenderNewPictures();
        setPollInterval();
        //y.Config.register('slidesChannel', configure);
    };

    y.Gallery = Object.freeze({
        init: init
    });

    return y; // make all functions public

})(yamazaki || {}, jQuery, Parse, PhotoSwipe);

yamazaki.Gallery.init();
