var yamazaki=function(e,t){"use strict";var n={};return e.GLOBALS=Object.freeze({parse:{key1:"K5c8xoRqn6pBPcqgPNWdKgG6YdYNdvODhzYcDuC0",key2:"DtdkLxjVPE0ELK3t5ZvaKmOcGtmkJqfAVlrld1m2"},slider:{height:960,width:1600}}),n.getViewportDimensions=function(){return{width:n.getWidth(),height:n.getHeight()}},n.getHeight=function(){return t(window).height()},n.getWidth=function(){return t(window).width()},e.Utils=Object.freeze(n),e}(yamazaki||{},jQuery),yamazaki=function(e,t){"use strict";var n,i={},r={slidesChannel:[],picturesChannel:[]};return i.Config=function(e){e=e||{},this.eventId=t.prop(e.eventId||"joan-kristin"),this.pollInterval=t.prop(e.pollInterval?e.pollInterval:5e3),this.slideDuration=t.prop(e.slideDuration?e.slideDuration:3e3),this.animation=t.prop(e.animation||"slide"),this.loop=t.prop(e.loop?e.loop:!0),this.maxDisplayWindow=t.prop(e.maxDisplayWindow?e.maxDisplayWindow:5),this.showComments=t.prop(!1),this.theme=t.prop()},i.Change=function(e){this.timestamp=t.prop(new Date),this.message=t.prop(e.message)},i.Changelog=Array,i.vm=function(){var e={};return e.init=function(){e.shown=!1,e.changelog=new i.Changelog,e.updatePicturesSettings=function(){return i.notifyObservers("picturesChannel"),!1},e.updateSlidesSettings=function(){return i.notifyObservers("slidesChannel"),!1}},e}(),i.controller=function(){i.vm.init()},i.view=function(){return t("form",[t("input",{onchange:t.withAttr("value",n.eventId),value:n.eventId()}),t("input",{onchange:t.withAttr("value",n.pollInterval),value:n.pollInterval()}),t("button",{onclick:i.vm.updatePicturesSettings},"Update"),t("input",{onchange:t.withAttr("value",n.slideDuration),value:n.slideDuration()}),t("input",{onchange:t.withAttr("value",n.animation),value:n.animation()}),t("button",{onclick:i.vm.updateSlidesSettings},"Update")])},i.init=function(e){return n=new i.Config(e),document.getElementById("config-panel")&&t.mount(document.getElementById("config-panel"),{controller:i.controller,view:i.view}),i.config=n,i},i.register=function(e,t){r[e].push(t)},i.notifyObservers=function(e){r[e].forEach(function(e){e.call()})},e.Config={init:i.init,register:i.register},e}(yamazaki||{},m),yamazaki=function(e,t){"use strict";var n,i,r={},o=[];return r.get=function(){},r.getNew=function(){console.log("getting Pictures!");var r=t.Deferred(),o=n.Object.extend("UserPhoto"),a=new n.Query(o);return a.equalTo("eventIdentifier",e.Config.config.eventId()).greaterThan("createdAt",i).ascending("createdAt"),a.find({success:function(e){e&&e.length>0&&(i=e[e.length-1].createdAt,r.resolve(e)),r.reject()},error:function(e){console.log("Error: "+e.code+" "+e.message)}}),r},r.init=function(t){return n=t,i=new Date(0),o=[],e.Config.register("picturesChannel",r.init),this.get(),this},e.Pictures=Object.freeze({init:r.init,get:r.get,getNew:r.getNew}),e}(yamazaki||{},jQuery),yamazaki=function(e,t,n,i){"use strict";var r,o,a=e.Pictures,u=[],s=0;e.Config=e.Config.init({eventId:"joan-kristin",slideDuration:3e3,pollInterval:5e3,animaton:"slideshow"});var l=function(e){return{src:e.get("imageFile").url(),h:0,w:0,html:"test"}},c=function(e){var n=t.Deferred(),i=[],r=s;t.each(e,function(e,n){t("#gallery").append(f(n)),i.push(l(n)),s+=1});var o=t("#gallery").find(".square").slice(r);return n.resolve({photoSwipePics:i,newElems:o}),n.promise()},p=function(e){e.newElems.on("click",function(){var e=t(this).data("index");d(e)})},d=function(e){var t=document.querySelectorAll(".pswp")[0],n={index:e};r=new i(t,PhotoSwipeUI_Default,u,n),r.listen("gettingData",function(e,t){if(t.w<1||t.h<1){var n=new Image;n.onload=function(){t.w=this.width,t.h=this.height,r.invalidateCurrItems(),r.updateSize(!0)},n.src=t.src}}),r.init()},g=function k(e){o=setTimeout(function(){v(),k(e)},e)},f=function(e){return'<div class="lazy square" data-index="'+s+'" data-original="'+e.get("imageFile").url()+'" style="background-color:grey;"></div>'},h=function(e){e.newElems.lazyload({effect:"fadeIn"})},m=function(e){Array.prototype.push.apply(u,e.photoSwipePics),r&&Array.prototype.push.apply(r.items,e.photoSwipePics)},v=function(){return a.getNew().then(c).done(m,h,p)},w=function(){window.addEventListener("load",function(){setTimeout(function(){window.scrollTo(0,1)},0)})},y=function(t){w(),n.initialize(e.GLOBALS.parse.key1,e.GLOBALS.parse.key2),a.init(n),v(),g(e.Config.config.pollInterval())};return e.Gallery=Object.freeze({init:y}),e}(yamazaki||{},jQuery,Parse,PhotoSwipe);yamazaki.Gallery.init();