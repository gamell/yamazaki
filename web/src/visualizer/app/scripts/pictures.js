/* jshint devel:true, browser: true*/
/* globals jQuery */

var yamazaki = (function(y, $){

    'use strict';

    var f = {},
        Parse,
        photos = [],
        lastTimestamp; // setting last picture timestamp to "really long time ago"

    f.get = function get(){

    };

    f.getNew = function getPictures(){
        console.log('getting Pictures!');
        var defer = $.Deferred(),
            UserPhoto = Parse.Object.extend('UserPhoto'),
            query = new Parse.Query(UserPhoto);

        query.equalTo('eventIdentifier', y.Config.config.eventId())
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

    f.resize = function resize(file){
        var deferred = $.Deferred();
        $.canvasResize(file, {
            width: 1000,
            height: 0,
            crop: false,
            quality: 70,
            //rotate: 90,
            callback: function(data, width, height) {
                deferred.resolve(data);
            }
        });
        return deferred.promise();
    };

    f.save = function save(file){
        var deferred = $.Deferred();
        var UserPhoto = Parse.Object.extend('UserPhoto');
        var userPhoto = new UserPhoto();
        var resizeDone = f.resize(file);

        userPhoto.set('eventIdentifier', y.Config.config.eventId());
        userPhoto.set('imageName', 'webapp picture');
        userPhoto.set('createdAt', new Date());

        $.when(resizeDone).done(function(resizedPictureFileData){
            var photoFile = new Parse.File('photo.jpg', {base64: resizedPictureFileData});
            userPhoto.set('imageFile', photoFile);
            userPhoto.save().then(function() {
                deferred.resolve();
            }, function(error) {
                deferred.reject();
                console.log('error uploading: '+JSON.stringify(error));
            });
        });

        return deferred.promise();

    };

    f.init = function init(parse){
        Parse = parse;
        // variable inits
        lastTimestamp = new Date(0);
        photos = [];
        y.Config.register('picturesChannel', f.init);
        this.get();
        return this;
    };

    y.Pictures = Object.freeze({
        init: f.init,
        get: f.get,
        getNew: f.getNew,
        save: f.save
    });

    return y;

})(yamazaki || {}, jQuery);
