/* jshint devel:true, browser: true*/
/* globals jQuery */

var yamazaki = (function(y, $){

    'use strict';

    var f = {},
        Parse,
        photos = [],
        eventId = 'joan-kristin',
        lastTimestamp; // setting last picture timestamp to "really long time ago"

    f.getNew = function getPictures(){
        console.log('getting Pictures!');
        var defer = $.Deferred(),
            UserPhoto = Parse.Object.extend('UserPhoto'),
            query = new Parse.Query(UserPhoto);

        query.equalTo('eventId', eventId)
            .greaterThan('createdAt', lastTimestamp)
            .ascending('createdAt');
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
                defer.reject();
                console.log('Error: ' + error.code + ' ' + error.message);
            }
        });

        return defer.promise();

    };

    f.buildFullSize = function resize(file){
        var deferred = $.Deferred();
        $.canvasResize(file, {
            width: 960,
            height: 0,
            crop: false,
            quality: 60,
            //rotate: 90,
            callback: function(data, width, height) {
              deferred.resolve({data: data, width: width, height:height});
            }
        });
        return deferred.promise();
    };

    f.buildThumbnail = function resize(file){
        var deferred = $.Deferred();
        $.canvasResize(file, {
            width: 260,
            height: 0,
            crop: false, // TODO: maybe crop to 1:1
            quality: 50,
            //rotate: 90,
            callback: function(data, width, height) {
              deferred.resolve({data: data, width: width, height:height});
            }
        });
        return deferred.promise();
    };

    f.save = function save(file, generateThumbnail){
        var deferred = $.Deferred();
        var UserPhoto = Parse.Object.extend('UserPhoto');
        var userPhoto = new UserPhoto();
        var fullSizeDone = f.buildFullSize(file);
        var thumbnailDone;

        if(generateThumbnail){
          thumbnailDone = f.buildThumbnail(file);
        } else {
          thumbnailDone = $.Deferred().resolve();
        }

        userPhoto.set('eventIdentifier', eventId);
        userPhoto.set('imageName', 'webapp picture');
        userPhoto.set('createdAt', new Date());

        $.when(fullSizeDone, thumbnailDone).done(function(fullSizePicture, thumbnailPicture){
            var fullSizeFile = new Parse.File('photo.jpg', {base64: fullSizePicture.data});
            userPhoto.set('imageFile', fullSizeFile);
            userPhoto.set('imageFileWidth', fullSizePicture.width);
            userPhoto.set('imageFileHeight', fullSizePicture.height);

            if(!!thumbnailPicture){
              var thumbnailFile = new Parse.File('photo.jpg', {base64: thumbnailPicture.data});
              userPhoto.set('thumbnailFile', thumbnailFile);
              userPhoto.set('thumbnailFileWidth', thumbnailPicture.width);
              userPhoto.set('thumbnailFileHeight', thumbnailPicture.height);
            }

            userPhoto.save().then(function() {
                deferred.resolve();
            }, function(error) {
                deferred.reject();
                console.log('error uploading: '+JSON.stringify(error));
            });
        });

        return deferred.promise();

    };

    f.init = function init(parse, eventIdParam){
        eventId = eventIdParam;
        Parse = parse;
        // variable inits
        lastTimestamp = new Date(0);
        photos = [];
        return this;
    };

    y.Pictures = Object.freeze({
        init: f.init,
        getNew: f.getNew,
        save: f.save
    });

    return y;

})(yamazaki || {}, jQuery);
