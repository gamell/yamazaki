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
                console.log('Error: ' + error.code + ' ' + error.message);
            }
        });

        return defer;

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
        getNew: f.getNew
    });

    return y;

})(yamazaki || {}, jQuery);
