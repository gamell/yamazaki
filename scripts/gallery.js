var yamazaki=function(e,t){"use strict";var n={};return e.GLOBALS=Object.freeze({parse:{key1:"K5c8xoRqn6pBPcqgPNWdKgG6YdYNdvODhzYcDuC0",key2:"DtdkLxjVPE0ELK3t5ZvaKmOcGtmkJqfAVlrld1m2"},slider:{height:960,width:1600}}),n.getViewportDimensions=function(){return{width:n.getWidth(),height:n.getHeight()}},n.getHeight=function(){return t(window).height()},n.getWidth=function(){return t(window).width()},e.Utils=Object.freeze(n),e}(yamazaki||{},jQuery),yamazaki=function(e,t){"use strict";var n,i={},r={slidesChannel:[],picturesChannel:[]};return i.Config=function(e){e=e||{},this.eventId=t.prop(e.eventId||"joan-kristin"),this.pollInterval=t.prop(e.pollInterval?e.pollInterval:5e3),this.slideDuration=t.prop(e.slideDuration?e.slideDuration:3e3),this.animation=t.prop(e.animation||"slide"),this.loop=t.prop(e.loop?e.loop:!0),this.maxDisplayWindow=t.prop(e.maxDisplayWindow?e.maxDisplayWindow:5),this.showComments=t.prop(!1),this.theme=t.prop()},i.Change=function(e){this.timestamp=t.prop(new Date),this.message=t.prop(e.message)},i.Changelog=Array,i.vm=function(){var e={};return e.init=function(){e.shown=!1,e.changelog=new i.Changelog,e.updatePicturesSettings=function(){return i.notifyObservers("picturesChannel"),!1},e.updateSlidesSettings=function(){return i.notifyObservers("slidesChannel"),!1}},e}(),i.controller=function(){i.vm.init()},i.view=function(){return t("form",[t("input",{onchange:t.withAttr("value",n.eventId),value:n.eventId()}),t("input",{onchange:t.withAttr("value",n.pollInterval),value:n.pollInterval()}),t("button",{onclick:i.vm.updatePicturesSettings},"Update"),t("input",{onchange:t.withAttr("value",n.slideDuration),value:n.slideDuration()}),t("input",{onchange:t.withAttr("value",n.animation),value:n.animation()}),t("button",{onclick:i.vm.updateSlidesSettings},"Update")])},i.init=function(e){return n=new i.Config(e),document.getElementById("config-panel")&&t.mount(document.getElementById("config-panel"),{controller:i.controller,view:i.view}),i.config=n,i},i.register=function(e,t){r[e].push(t)},i.notifyObservers=function(e){r[e].forEach(function(e){e.call()})},e.Config={init:i.init,register:i.register},e}(yamazaki||{},m),yamazaki=function(e,t){"use strict";var n,i,r={},o=[];return r.get=function(){},r.getNew=function(){console.log("getting Pictures!");var r=t.Deferred(),o=n.Object.extend("UserPhoto"),a=new n.Query(o);return a.equalTo("eventIdentifier",e.Config.config.eventId()).greaterThan("createdAt",i).ascending("createdAt"),a.find({success:function(e){e&&e.length>0&&(i=e[e.length-1].createdAt,r.resolve(e)),r.reject()},error:function(e){r.reject(),console.log("Error: "+e.code+" "+e.message)}}),r.promise()},r.resize=function(e){var n=t.Deferred();return t.canvasResize(e,{width:1e3,height:0,crop:!1,quality:70,callback:function(e,t,i){n.resolve(e)}}),n.promise()},r.save=function(i){var o=t.Deferred(),a=n.Object.extend("UserPhoto"),s=new a,u=r.resize(i);return s.set("eventIdentifier",e.Config.config.eventId()),s.set("imageName","webapp picture"),s.set("createdAt",new Date),t.when(u).done(function(e){var t=new n.File("photo.jpg",{base64:e});s.set("imageFile",t),s.save().then(function(){o.resolve()},function(e){o.reject(),console.log("error uploading: "+JSON.stringify(e))})}),o.promise()},r.init=function(t){return n=t,i=new Date(0),o=[],e.Config.register("picturesChannel",r.init),this.get(),this},e.Pictures=Object.freeze({init:r.init,get:r.get,getNew:r.getNew,save:r.save}),e}(yamazaki||{},jQuery),yamazaki=function(e,t,n,i){"use strict";var r,o,a=e.Pictures,s=[],u=0;e.Config=e.Config.init({eventId:"joan-kristin",slideDuration:3e3,pollInterval:5e3,animaton:"slideshow"});var c=function(e,t,n){return{src:e,h:n,w:t,html:"test"}},l=function(e){var n=t.Deferred(),i=[],r=u;t.each(e,function(e,n){f(u,n).then(p),t("#gallery").append(v(n)),u+=1});var o=t("#gallery").find(".square").slice(r);return n.resolve({photoSwipePics:i,newElems:o}),n.promise()},p=function(e){s[e.index]=e.psItem},f=function(e,n){var i=t.Deferred(),r=new Image,o=n.get("imageFile").url();return r.onload=function(){i.resolve({index:e,psItem:c(o,this.width,this.height)})},r.src=o,i.promise()},g=function(e){e.newElems.on("click",function(){var e=t(this).data("index");d(e)})},d=function(e){var t=document.querySelectorAll(".pswp")[0],n={index:e};r=new i(t,PhotoSwipeUI_Default,s,n),r.listen("gettingData",function(e,t){if(t.w<1||t.h<1){var n=new Image;n.onload=function(){t.w=this.width,t.h=this.height,r.invalidateCurrItems(),r.updateSize(!0)},n.src=t.src}}),r.init()},h=function S(){o=setTimeout(function(){k(),S()},e.Config.config.pollInterval())},v=function(e){return'<div class="square" data-index="'+u+'" style="background-image:url(\''+e.get("imageFile").url()+"')\"></div>"},m=function(e){},w=function(e){Array.prototype.push.apply(s,e.photoSwipePics),r&&Array.prototype.push.apply(r.items,e.photoSwipePics)},y=function(){return clearTimeout(o),k().done(h)},k=function(){return a.getNew().then(l).done(w,m,g)},I=function(){t(".spinner").css("display","block")},D=function(){t(".spinner").css("display","none")},C=function(){t(".trigger-upload").on("click",function(){t("input.upload").click()}),t("input.upload").on("change",function(){I();var e=t(this)[0];if(e.files.length>0){var n=e.files[0];a.save(n).then(y).done(D)}})},z=function(t){C(),n.initialize(e.GLOBALS.parse.key1,e.GLOBALS.parse.key2),a.init(n),k(),h()};return e.Gallery=Object.freeze({init:z}),e}(yamazaki||{},jQuery,Parse,PhotoSwipe);yamazaki.Gallery.init();