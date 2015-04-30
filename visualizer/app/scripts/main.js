/* jshint devel:true, browser: true*/
/* globals Parse, jQuery */

(function($){

   'use strict';

    var FINAL = Object.freeze({
            slideshowSelector: '#slideshow'
        });

    var initParse = function initParse(){
        Parse.initialize('9CqsDKHNK3zKxYKsOUik8n3gE4qusfIgU2NRDh5m', 'UR2IOAd8kxtPRfSoCEeGcmfxMLiXGl16acr4lg6S');
    };

    var generatePhotoElements = function generatePhotoElements(userPhotos){
        var photoElements = [];
        $.each(userPhotos, function(i, photo){
            photoElements.push('<img src="'+photo.get('imageFile').url()+'" />');
        });
        return photoElements;
    };

    var refreshPhotos = function renderPhotos(userPhotos){
        var photoElements = generatePhotoElements(userPhotos);
        $(FINAL.slideshowSelector).empty().append(photoElements);
    };

    var getPictures = function getPictures(){  
        var UserPhoto = Parse.Object.extend('UserPhoto');
        var query = new Parse.Query(UserPhoto);
        query.find({
            success: function(results) {
                refreshPhotos(results);
            },
            error: function(error) {
                console.log('Error: ' + error.code + ' ' + error.message);
            }
        });
    };

    var init = function init(){
        initParse();    
        getPictures();     
    };

    init();

})(jQuery);

