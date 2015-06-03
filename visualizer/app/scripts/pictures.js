/* jshint devel:true, browser: true*/
/* globals jQuery, Parse */

var yamazaki = (function(y, Parse, $){

    'use strict';

    var f = {},
        slides = [];

    var defaults = {
        pollInterval: 5000
    }

    var pollInterval,
        lastTimestamp = new Date(0); // setting last picture timestamp to "really long time ago"

    f.generateHtmlPhotoElements = function generatePhotoElements(userPhotos){
        slides = [];
        $.each(userPhotos, function(i, photo){
            slides.push(f.createHtmlPhotoSlide(photo));
        });
        return slides;
    };

    f.createHtmlPhotoSlide = function createPhotoSlide(photo){
        return '<section>'+f.createImgTag(photo)+'</section>';    
    }

    f.createImgTag = function createImgTag(photo){
        return '<img height='+(y.GLOBALS.slider.height-60)+'px" src="'+photo.get('imageFile').url()+'" />';
    }

    f.getPictures = function getPictures(eventId){ 
        console.log("getting Pictures!"); 
        var defer = $.Deferred(),
            UserPhoto = Parse.Object.extend('UserPhoto'),
            query = new Parse.Query(UserPhoto);
        
        query.equalTo("eventIdentifier", y.Config.eventId())
            .greaterThan("createdAt", lastTimestamp)
            .ascending("createdAt");
        query.find({
            success: function(results) {
                // we save the last picture timestamp for the next query
                if(!!results && results.length > 0){
                    lastTimestamp = results[results.length-1].createdAt;
                    defer.resolve(results);
                }
                defer.reject();
            },
            error: function(error) {
                console.log('Error: ' + error.code + ' ' + error.message);
            }
        });

        return defer;

    };

    f.addPhotos = function appendSlides(newPhotos){
        if(!!Reveal && !!Reveal.add){
            $.each(newPhotos, function(i, photo){
                Reveal.add(f.createImgTag(photo));
            });
        } else {
            var htmlSlides = f.generateHtmlPhotoElements(newPhotos);
            $(".slides").append(htmlSlides);
        }
    }


    f.render = function render(){
        var defer = $.Deferred();
        f.getPictures().then(function(newPhotos){
            f.addPhotos(newPhotos);
            defer.resolve();
        });
        return defer;
    };

    f.setPollInterval = function setPollInterval(pollInterval){
        setTimeout(function(){
            f.render();
            setPollInterval(pollInterval);    
        }, pollInterval);
    }

    f.initialize = function initialize(data){
        data = $.extend(data, defaults);
        pollInterval = data.pollInterval;
        f.setPollInterval(pollInterval);
        return f;
    };

    f.init = function init(data){
        f.initialize(data).render().then(function(){
            y.Slider.init(data);
        });
    };

    y.Pictures = Object.freeze({ 
        render: f.render,
        init: f.init,
        hide: f.hide,
        show: f.show
    });

    return y;

})(yamazaki || {}, Parse, jQuery);