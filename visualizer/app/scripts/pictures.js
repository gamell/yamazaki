/* jshint devel:true, browser: true*/
/* globals jQuery, Parse */

var yamazaki = (function(y,Parse,$){

    'use strict';

    var f = {},
        userPhotos = [],
        htmlElems = [];

    f.generatePhotoElements = function generatePhotoElements(userPhotos){
        htmlElems = [];
        $.each(userPhotos, function(i, photo){
            htmlElems.push('<section><img height="900px" src="'+photo.get('imageFile').url()+'" /></section>');
        });
        return htmlElems;
    };

    f.getPictures = function getPictures(eventId){  
        var defer = $.Deferred(),
            UserPhoto = Parse.Object.extend('UserPhoto'),
            query = new Parse.Query(UserPhoto);
            query.equalTo("eventIdentifier", y.Config.eventId());

        query.find({
            success: function(results) {
                userPhotos = results;
                defer.resolve();
            },
            error: function(error) {
                console.log('Error: ' + error.code + ' ' + error.message);
            }
        });

        return defer;

    };

    f.render = function renderPictures(){
        var defer = $.Deferred();
        f.getPictures().then(function(){
            var htmlElements = f.generatePhotoElements(userPhotos);
            $(".slides").empty().append(htmlElements);
            defer.resolve();
        });
        return defer;
    };

    f.refresh = function refresh(data){
        if(!!data.eventId){
            f.getPictures().then(function(){
                //delete y.Slider.sliderInstance;
                y.Slider.init();
            });

        }
    };

    f.init = function init(){
        f.render().then(function(){
            y.Slider.init();
        });
    };

    y.Pictures = Object.freeze({ 
        render: f.render,
        refresh: f.refresh,
        init: f.init,
        hide: f.hide,
        show: f.show
    });

    return y;

})(yamazaki || {}, Parse, jQuery);