/* globals Parse */
var yamazaki = (function(y,$,Parse){

    'use strict';

    var f = {};

    f.init = function init(){
        var deferred = $.Deferred();
        Parse.initialize(y.GLOBALS.parse.key1, y.GLOBALS.parse.key2);
        $.when(f.getPictures()).done(function(){
            deferred.resolve();
        });
        return deferred;
    };

    f.getPictures = function getPictures(callback){  
        var deferred = $.Deferred(),
            UserPhoto = Parse.Object.extend('UserPhoto'),
            query = new Parse.Query(UserPhoto);

        query.find({
            success: function(results) {
                y.Pictures.setUserPhotos(results);
                deferred.resolve();
            },
            error: function(error) {
                console.log('Error: ' + error.code + ' ' + error.message);
            }
        });

        return deferred;

    };
    
    y.Parse = f;

    return y; // make all functions public

})(yamazaki || {}, jQuery, Parse);