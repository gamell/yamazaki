/* jshint devel:true, browser: true*/
/* globals jQuery */

var yamazaki = (function(y,$){

    'use strict';

    var f = {},
        userPhotos = [],
        htmlElems = [];

    f.generatePhotoElements = function generatePhotoElements(userPhotos){
        htmlElems = [];
        $.each(userPhotos, function(i, photo){
            htmlElems.push('<div><img u="image" src="'+photo.get('imageFile').url()+'" /></div>');
        });
        return htmlElems;
    };

    f.render = function renderPictures(){
        var htmlElements = f.generatePhotoElements(userPhotos);
        $('#slides').empty().append(htmlElements);
    };

    y.Pictures = Object.freeze({ 
        getUserPhotos: function(){ return userPhotos; },
        setUserPhotos: function(up){ userPhotos = up; },
        getHtmlElems: function(){ return htmlElems; },
        render: f.render 
    });

    return y;

})(yamazaki || {}, jQuery);