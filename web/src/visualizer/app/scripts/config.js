/* jshint devel:true, browser: true*/
/* globals m */

var yamazaki = (function(y,m){

    'use strict';

    var f = {},
        config,
        observers = {
            slidesChannel: [],
            picturesChannel: []
        };

    // mitrhil model

    f.Config = function(data){
        data = data || {};
        this.eventId = m.prop(data.eventId || 'joan-kristin');
        this.pollInterval = m.prop(!!data.pollInterval ? data.pollInterval : 5000);
        this.slideDuration = m.prop(!!data.slideDuration ? data.slideDuration : 3000);
        this.animation = m.prop(data.animation || 'slide');
        this.loop = m.prop(!!data.loop ? data.loop : true);
        this.maxDisplayWindow = m.prop(!!data.maxDisplayWindow ? data.maxDisplayWindow : 5); // 0 - unlimited, any other number is the maximum number of pictures looping at any given time. FIFO mechanism to select the pictures to show
        this.showComments = m.prop(false);
        this.theme = m.prop();
    };

    f.Change = function(data){
        this.timestamp = m.prop(new Date());
        this.message = m.prop(data.message);
    };

    f.Changelog = Array;

    // mitrhil view-model

    f.vm = (function() {
        var vm = {};
        vm.init = function() {
            vm.shown = false;
            vm.changelog = new f.Changelog();

            vm.updatePicturesSettings = function(){
                //y.Pictures.refresh({eventId: config.eventId()});
                //vm.changelog.push(new Change({message: 'Configuration changed!'}));
                //debugger;
                f.notifyObservers('picturesChannel');
                return false;
            };

            vm.updateSlidesSettings = function(){
                f.notifyObservers('slidesChannel');
                return false;
            };

        };

        return vm;

    }());

    f.notifyObservers = function notifyObservers(channel){
        observers[channel].forEach(function(element){
            element.call();
        });
    };

    // Mithril controller

    f.controller = function(){
        f.vm.init();
    };

    // Mithril view

    f.view = function() {
        return m('form', [
            m('input', {onchange: m.withAttr('value', config.eventId), value: config.eventId()}),
            m('input', {onchange: m.withAttr('value', config.pollInterval), value: config.pollInterval()}),
            m('button', {onclick: f.vm.updatePicturesSettings}, 'Update'),

            m('input', {onchange: m.withAttr('value', config.slideDuration), value: config.slideDuration()}),
            m('input', {onchange: m.withAttr('value', config.animation), value: config.animation()}),
            m('button', {onclick: f.vm.updateSlidesSettings}, 'Update'),
        ]);
    };

    f.init = function(data){
        config = new f.Config(data);
        //initialize the application
        m.mount(document.getElementById('config-panel'), {controller: f.controller, view: f.view});
        f.config = config;
        return f;
    };

    f.register = function register(channel, callback){
        observers[channel].push(callback);
    };

    y.Config = {
        init: f.init,
        register: f.register
    };

    return y; // make all functions public

})(yamazaki || {}, m);
