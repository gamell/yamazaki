/* jshint devel:true, browser: true*/
/* globals m */

var yamazaki = (function(y,m){

    'use strict';

    var config,
        Pictures = y.Pictures,
        Slider = y.Slider

    // mitrhil model

    var Config = function(data){
        data = data || {};
        this.eventId = m.prop(data.eventId);
        this.pollInterval = m.prop(data.pollInterval);
        this.slideDuration = m.prop(data.slideDuration);
        this.animation = m.prop(data.animation);
        this.showComments = m.prop(false);
        this.theme = m.prop();
    };

    var Change = function(data){
        this.timestamp = m.prop(new Date());
        this.message = m.prop(data.message);
    };

    var Changelog = Array;

    // mitrhil view-model

    var vm = (function() {
        var vm = {};
        vm.init = function() {
            vm.shown = false;
            vm.changelog = new Changelog();
            
            vm.update = function(eventId){
                y.Pictures.refresh({eventId: config.eventId()});
                vm.changelog.push(new Change({message: 'Configuration changed!'}));
                return false;
            };



        };

        return vm;
    
    }());

    // Mithril controller

    var controller = function(){
        vm.init();
    };

    // Mithril view

    var view = function() {
        return m('form', [
            m('input', {onchange: m.withAttr('value', config.eventId), value: config.eventId()}),
            m('button', {onclick: vm.update}, 'Update'),
            m('table', [
                vm.changelog.map(function(change, index) {
                    return m('tr', [
                        m('td', change.timestamp()), 
                        m('td', change.message()+': '+config.eventId())
                    ]);
                })
            ])
        ]);
    };

    var init = function(data){
        config = new Config(data);
        //initialize the application
        m.mount(document.getElementById('config-panel'), {controller: controller, view: view});
        return config;
    };

    y.Config = {init: init};

    return y; // make all functions public

})(yamazaki || {}, m);