var yamazaki=function(e,t){"use strict";var i={};return e.GLOBALS=Object.freeze({parse:{key1:"K5c8xoRqn6pBPcqgPNWdKgG6YdYNdvODhzYcDuC0",key2:"DtdkLxjVPE0ELK3t5ZvaKmOcGtmkJqfAVlrld1m2"},slider:{height:960,width:1600}}),i.getViewportDimensions=function(){return{width:i.getWidth(),height:i.getHeight()}},i.getHeight=function(){return t(window).height()},i.getWidth=function(){return t(window).width()},e.Utils=Object.freeze(i),e}(yamazaki||{},jQuery),yamazaki=function(e,t){"use strict";var i,n={},r={slidesChannel:[],picturesChannel:[]};return n.Config=function(e){e=e||{},this.eventId=t.prop(e.eventId||"joan-kristin"),this.pollInterval=t.prop(e.pollInterval?e.pollInterval:5e3),this.slideDuration=t.prop(e.slideDuration?e.slideDuration:3e3),this.animation=t.prop(e.animation||"slide"),this.loop=t.prop(e.loop?e.loop:!0),this.maxDisplayWindow=t.prop(e.maxDisplayWindow?e.maxDisplayWindow:5),this.showComments=t.prop(!1),this.theme=t.prop()},n.Change=function(e){this.timestamp=t.prop(new Date),this.message=t.prop(e.message)},n.Changelog=Array,n.vm=function(){var e={};return e.init=function(){e.shown=!1,e.changelog=new n.Changelog,e.updatePicturesSettings=function(){return n.notifyObservers("picturesChannel"),!1},e.updateSlidesSettings=function(){return n.notifyObservers("slidesChannel"),!1}},e}(),n.controller=function(){n.vm.init()},n.view=function(){return t("form",[t("input",{onchange:t.withAttr("value",i.eventId),value:i.eventId()}),t("input",{onchange:t.withAttr("value",i.pollInterval),value:i.pollInterval()}),t("button",{onclick:n.vm.updatePicturesSettings},"Update"),t("input",{onchange:t.withAttr("value",i.slideDuration),value:i.slideDuration()}),t("input",{onchange:t.withAttr("value",i.animation),value:i.animation()}),t("button",{onclick:n.vm.updateSlidesSettings},"Update")])},n.init=function(e){return i=new n.Config(e),document.getElementById("config-panel")&&t.mount(document.getElementById("config-panel"),{controller:n.controller,view:n.view}),n.config=i,n},n.register=function(e,t){r[e].push(t)},n.notifyObservers=function(e){r[e].forEach(function(e){e.call()})},e.Config={init:n.init,register:n.register},e}(yamazaki||{},m),yamazaki=function(e,t,i){"use strict";var n,r,o,a=50,s=[],u=function(){return{controls:!0,progress:!0,margin:0,autoSlide:e.Config.config.slideDuration(),loop:e.Config.config.loop(),height:e.GLOBALS.slider.height,width:e.GLOBALS.slider.width,transition:e.Config.config.animation(),dependencies:[]}},l=function(){return!!i},c=function(){i.configure(u())},d=function(e){i.slide(e)},h=function(e){if(i&&i.add){var n;t.each(e,function(e,t){i.add(w(t)),0===e&&(n=i.getTotalSlides()-1)}),o&&(o=!1,d(n))}},g=function(e){for(var t=0;e>t;t+=1)i.remove(0)},f=function k(e){r=setTimeout(function(){n.getNew().then(h),k(e)},e)},p=function(e){var i=t.Deferred(),n=v(e);return t(".slides").append(n),i.resolve(),i},v=function(e){return s=[],t.each(e,function(e,t){s.push(m(t))}),s},m=function(e){return"<section>"+w(e)+"</section>"},w=function(t){return"<img height="+(e.GLOBALS.slider.height-60)+'px" src="'+t.get("imageFile").url()+'" />'},y=function(e){if(0===e.indexh){o=!0;var t=i.getTotalSlides();t>a&&g(t-a)}},b=function(t){n=t,n.init(Parse,"joan-kristin"),n.getNew().then(p).then(function(){i.initialize(u()),o=!1,i.addEventListener("slidechanged",y)}),f(e.Config.config.pollInterval()),e.Config.register("slidesChannel",c)};return e.Slides=Object.freeze({init:b,exists:l,configure:c}),e}(yamazaki||{},jQuery,Reveal),yamazaki=function(e,t){"use strict";var i,n,r={},o=[],a="joan-kristin";return r.getNew=function(){console.log("getting Pictures!");var e=t.Deferred(),r=i.Object.extend("UserPhoto"),o=new i.Query(r);return o.equalTo("eventIdentifier",a).greaterThan("createdAt",n).ascending("createdAt"),o.find({success:function(t){t&&t.length>0&&(n=t[t.length-1].createdAt,e.resolve(t)),e.reject()},error:function(t){e.reject(),console.log("Error: "+t.code+" "+t.message)}}),e.promise()},r.buildFullSize=function(e){var i=t.Deferred();return t.canvasResize(e,{width:960,height:0,crop:!1,quality:60,callback:function(e,t,n){i.resolve({data:e,width:t,height:n})}}),i.promise()},r.buildThumbnail=function(e){var i=t.Deferred();return t.canvasResize(e,{width:260,height:0,crop:!1,quality:50,callback:function(e,t,n){i.resolve({data:e,width:t,height:n})}}),i.promise()},r.save=function(e,n){var o,s=t.Deferred(),u=i.Object.extend("UserPhoto"),l=new u,c=r.buildFullSize(e);return o=n?r.buildThumbnail(e):t.Deferred().resolve(),l.set("eventIdentifier",a),l.set("imageName","webapp picture"),l.set("createdAt",new Date),t.when(c,o).done(function(e,t){var n=new i.File("photo.jpg",{base64:e.data});if(l.set("imageFile",n),l.set("imageFileWidth",e.width),l.set("imageFileHeight",e.height),t){var r=new i.File("photo.jpg",{base64:t.data});l.set("thumbnailFile",r),l.set("thumbnailFileWidth",t.width),l.set("thumbnailFileHeight",t.height)}l.save().then(function(){s.resolve()},function(e){s.reject(),console.log("error uploading: "+JSON.stringify(e))})}),s.promise()},r.init=function(e,t){return a=t,i=e,n=new Date(0),o=[],this},e.Pictures=Object.freeze({init:r.init,getNew:r.getNew,save:r.save}),e}(yamazaki||{},jQuery),yamazaki=function(e,t,i){"use strict";var n=e.Pictures,r=e.Slides;e.Config=e.Config.init({eventId:"joan-kristin",slideDuration:3e3,pollInterval:5e3,animaton:"slideshow"});var o={};return o.init=function(){i.initialize(e.GLOBALS.parse.key1,e.GLOBALS.parse.key2),n.init(i),t(document).ready(function(){r.init(n)})},e.init=o.init,e}(yamazaki||{},jQuery,Parse);yamazaki.init();