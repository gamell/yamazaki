var yamazaki=function(e,n){"use strict";var t={};return e.GLOBALS=Object.freeze({parse:{key1:"K5c8xoRqn6pBPcqgPNWdKgG6YdYNdvODhzYcDuC0",key2:"DtdkLxjVPE0ELK3t5ZvaKmOcGtmkJqfAVlrld1m2"},slider:{height:960,width:1600}}),t.getViewportDimensions=function(){return{width:t.getWidth(),height:t.getHeight()}},t.getHeight=function(){return n(window).height()},t.getWidth=function(){return n(window).width()},e.Utils=Object.freeze(t),e}(yamazaki||{},jQuery),yamazaki=function(e,n){"use strict";var t,i={},r={slidesChannel:[],picturesChannel:[]};return i.Config=function(e){e=e||{},this.eventId=n.prop(e.eventId||"joan-kristin"),this.pollInterval=n.prop(e.pollInterval?e.pollInterval:5e3),this.slideDuration=n.prop(e.slideDuration?e.slideDuration:3e3),this.animation=n.prop(e.animation||"slide"),this.loop=n.prop(e.loop?e.loop:!0),this.maxDisplayWindow=n.prop(e.maxDisplayWindow?e.maxDisplayWindow:5),this.showComments=n.prop(!1),this.theme=n.prop()},i.Change=function(e){this.timestamp=n.prop(new Date),this.message=n.prop(e.message)},i.Changelog=Array,i.vm=function(){var e={};return e.init=function(){e.shown=!1,e.changelog=new i.Changelog,e.updatePicturesSettings=function(){return i.notifyObservers("picturesChannel"),!1},e.updateSlidesSettings=function(){return i.notifyObservers("slidesChannel"),!1}},e}(),i.controller=function(){i.vm.init()},i.view=function(){return n("form",[n("input",{onchange:n.withAttr("value",t.eventId),value:t.eventId()}),n("input",{onchange:n.withAttr("value",t.pollInterval),value:t.pollInterval()}),n("button",{onclick:i.vm.updatePicturesSettings},"Update"),n("input",{onchange:n.withAttr("value",t.slideDuration),value:t.slideDuration()}),n("input",{onchange:n.withAttr("value",t.animation),value:t.animation()}),n("button",{onclick:i.vm.updateSlidesSettings},"Update")])},i.init=function(e){return t=new i.Config(e),document.getElementById("config-panel")&&n.mount(document.getElementById("config-panel"),{controller:i.controller,view:i.view}),i.config=t,i},i.register=function(e,n){r[e].push(n)},i.notifyObservers=function(e){r[e].forEach(function(e){e.call()})},e.Config={init:i.init,register:i.register},e}(yamazaki||{},m),yamazaki=function(e,n,t){"use strict";var i,r,o=[],a=function(){return{controls:!0,progress:!0,margin:0,autoSlide:e.Config.config.slideDuration(),loop:e.Config.config.loop(),height:e.GLOBALS.slider.height,width:e.GLOBALS.slider.width,transition:e.Config.config.animation(),dependencies:[{src:"scripts/lib/plugin/add-remove.js",async:!0}]}},s=function(){return!!t},u=function(){t.configure(a())},c=function(e){t&&t.add&&n.each(e,function(e,n){t.add(h(n))})},l=function m(e){r=setTimeout(function(){i.getNew().then(c),m(e)},e)},g=function(e){var t=n.Deferred(),i=f(e);return n(".slides").append(i),t.resolve(),t},f=function(e){return o=[],n.each(e,function(e,n){o.push(d(n))}),o},d=function(e){return"<section>"+h(e)+"</section>"},h=function(n){return"<img height="+(e.GLOBALS.slider.height-60)+'px" src="'+n.get("imageFile").url()+'" />'},p=function(n){i=n,i.getNew().then(g).then(function(){t.initialize(a())}),l(e.Config.config.pollInterval()),e.Config.register("slidesChannel",u)};return e.Slides=Object.freeze({init:p,exists:s,configure:u}),e}(yamazaki||{},jQuery,Reveal),yamazaki=function(e,n){"use strict";var t,i,r={},o=[];return r.get=function(){},r.getNew=function(){console.log("getting Pictures!");var r=n.Deferred(),o=t.Object.extend("UserPhoto"),a=new t.Query(o);return a.equalTo("eventIdentifier",e.Config.config.eventId()).greaterThan("createdAt",i).ascending("createdAt"),a.find({success:function(e){e&&e.length>0&&(i=e[e.length-1].createdAt,r.resolve(e)),r.reject()},error:function(e){console.log("Error: "+e.code+" "+e.message)}}),r},r.init=function(n){return t=n,i=new Date(0),o=[],e.Config.register("picturesChannel",r.init),this.get(),this},e.Pictures=Object.freeze({init:r.init,get:r.get,getNew:r.getNew}),e}(yamazaki||{},jQuery),yamazaki=function(e,n,t){"use strict";var i=e.Pictures,r=e.Slides;e.Config=e.Config.init({eventId:"joan-kristin",slideDuration:3e3,pollInterval:5e3,animaton:"slideshow"});var o={};return o.init=function(){t.initialize(e.GLOBALS.parse.key1,e.GLOBALS.parse.key2),i.init(t),n(document).ready(function(){r.init(i)})},e.init=o.init,e}(yamazaki||{},jQuery,Parse);yamazaki.init();