"use strict";angular.module("imapsNgApp",["ngTouch","ngAnimate","ngCookies","ngResource","ngRoute","ngSanitize","ngTouch","pageslide-directive","ui.bootstrap","vr.directives.slider","LocalStorageModule","angular-loading-bar","ui.grid","ui.grid.selection","ui.grid.exporter","smart-table","ngCsv","scrollable-table","ngReactGrid"]).config(["$routeProvider",function(a){a.when("/",{templateUrl:"views/main.html",controller:"MainCtrl"}).when("/about",{templateUrl:"views/about.html",controller:"AboutCtrl"}).when("/about",{templateUrl:"views/about.html",controller:"AboutCtrl"}).otherwise({redirectTo:"/"})}]),angular.module("imapsNgApp").controller("MainCtrl",["$rootScope","config",function(a,b){a.checked=!0,b.loadConfig("../config/config.txt").then(function(b){a.config=b})}]),angular.module("imapsNgApp").controller("AboutCtrl",["$scope",function(a){a.awesomeThings=["HTML5 Boilerplate","AngularJS","Karma"]}]),angular.module("imapsNgApp").directive("appHeader",function(){return{templateUrl:"appHeader/appHeader.html",restrict:"E",controller:["$scope","$rootScope",function(a,b){b.checked=!0,b.$watch("config",function(b){b&&(a.title=b.title)}),a.btnClick=function(){b.checked=!b.checked},a.titleClick=function(){console.log(this.$root.config),this.title=this.$root.config.title}}]}}),angular.module("imapsNgApp").directive("exportButton",function(){return{templateUrl:"exportButton/exportButton.html",restrict:"E",scope:{array:"=",filename:"@"},link:function(){}}}),angular.module("imapsNgApp").directive("mapPanel",function(){return{templateUrl:"mapPanel/mapPanel.html",restrict:"E",controller:["$scope","$rootScope","property",function(a,b,c){a.property=c,require(["esri/map","esri/arcgis/utils","esri/SpatialReference","esri/layers/GraphicsLayer","dojo/domReady!"],function(b,c,d,e){c.createMap("0757b2fd0e6f44dd8d8fefbfc09aa8eb","map").then(function(b){a.webmap=b,a.map=b.map,a.selectionMultiple=new e,a.selectionSingle=new e,a.map.addLayer(a.selectionMultiple),a.map.addLayer(a.selectionSingle),console.log(b),a.$digest()})});var d=function(b,c,d){require(["esri/graphic","esri/graphicsUtils"],function(e,f){var g=null;c.clear(),a.selectionSingle.clear(),angular.forEach(b,function(a){g=new e({geometry:a.geometry,symbol:{color:[0,0,0,0],outline:{color:d,width:3,type:"esriSLS",style:"esriSLSSolid"},type:"esriSFS",style:"esriSFSSolid"}}),c.add(g)}),a.map.setExtent(f.graphicsExtent(c.graphics))})};a.$on("accountUpdate",function(b,c){var e=[];c&&(angular.forEach(c,function(a){e.push("'"+a.pin+"'")}),a.property.getGeometryByPins("PIN_NUM in ("+e.toString()+")").then(function(b){d(b.features,a.selectionMultiple,[255,255,0])}))}),a.$on("pinUpdate",function(b,c){a.property.getGeometryByPins("PIN_NUM = '"+c+"'").then(function(b){d(b.features,a.selectionSingle,[255,0,0])})})}],link:function(){}}}),angular.module("imapsNgApp").directive("sidePanel",["$timeout",function(){return{templateUrl:"sidePanel/sidePanel.html",restrict:"E",controller:["$scope","$rootScope",function(a,b){a.checked=!0,b.$watch("checked",function(b){a.checked=b})}],link:function(){}}}]),angular.module("imapsNgApp").directive("search",function(){return{templateUrl:"sidePanel/search/search.html",restrict:"E",controller:["$scope",function(){}],link:function(a){a.searches=[{label:"For Property",value:"property"},{label:"For Location",value:"location"}],a.selectedSearch=a.searches[0]}}}),angular.module("imapsNgApp").directive("propertySearch",function(){return{templateUrl:"sidePanel/propertySearch/propertySearch.html",restrict:"E",controller:["$scope","$rootScope","$timeout","property",function(a,b,c,d){a.hiddenOverflow=!1,a.property=d;var e="https://maps.raleighnc.gov/arcgis/rest/services/Parcels/MapServer/exts/PropertySOE/AutoComplete",f=function(a){var b=[];return a.Results.length>0&&angular.forEach(a.Results,function(a){b.push({value:a})}),b};a.tabChanged=function(b){angular.forEach(a.tabs,function(a,c){c>0&&(a.disabled=b),a.highlighted=!1}),a.tab.highlighted=!0};var g=function(d,e,f){f="streetname"===f?"street name":f,a.property.getRealEstate(f,[e.value]).then(function(d){a.fields=d.Fields,console.log(d.Accounts.length),a.accounts=d.Accounts,a.accountsSrc=d.Accounts,b.$broadcast("accountUpdate",a.accounts),1===d.Accounts.length?(a.tab=a.tabs[1],a.pin=d.Accounts[0].pin,a.reid=d.Accounts[0].reid,a.account=d.Accounts[0],b.$broadcast("pinUpdate",a.pin),c(function(){a.$broadcast("accountSelected",d.Accounts[0])}),a.tabChanged(!1)):(a.tab=a.tabs[0],a.tabChanged(!0))})},h=new Bloodhound({datumTokenizer:function(a){return Bloodhound.tokenizers.whitespace(a.value)},queryTokenizer:Bloodhound.tokenizers.whitespace,remote:{url:e+"?type=address&f=json",filter:f,replace:function(a,b){b=b.replace(/\'/g,"''").toUpperCase();var c=a+"&input="+b;return c}}}),i=new Bloodhound({datumTokenizer:function(a){return Bloodhound.tokenizers.whitespace(a.value)},queryTokenizer:Bloodhound.tokenizers.whitespace,remote:{url:e+"?type=owner&f=json",filter:f,replace:function(a,b){b=b.replace(/\'/g,"''").toUpperCase();var c=a+"&input="+b;return c}}}),j=new Bloodhound({datumTokenizer:function(a){return Bloodhound.tokenizers.whitespace(a.value)},queryTokenizer:Bloodhound.tokenizers.whitespace,remote:{url:e+"?type=pin&f=json&limit=5",filter:f,replace:function(a,b){b=b.replace(/\'/g,"''").toUpperCase();var c=a+"&input="+b;return c}}}),k=new Bloodhound({datumTokenizer:function(a){return Bloodhound.tokenizers.whitespace(a.value)},queryTokenizer:Bloodhound.tokenizers.whitespace,remote:{url:e+"?type=reid&f=json&limit=5",filter:f,replace:function(a,b){b=b.replace(/\'/g,"''").toUpperCase();var c=a+"&input="+b;return c}}}),l=new Bloodhound({datumTokenizer:function(a){return Bloodhound.tokenizers.whitespace(a.value)},queryTokenizer:Bloodhound.tokenizers.whitespace,remote:{url:e+"?type=street name&f=json&limit=5",filter:f,replace:function(a,b){b=b.replace(/\'/g,"''").toUpperCase();var c=a+"&input="+b;return c}}});h.initialize(),i.initialize(),j.initialize(),k.initialize(),l.initialize(),a.autocomplete={displayKey:"value",source:h.ttAdapter()},a.searchValue=null,$("#searchInput").typeahead({hint:!0,highlight:!0,minLength:1},{name:"address",displayKey:"value",source:h.ttAdapter(),templates:{header:"<h5>Addresses</h5>"}},{name:"owner",displayKey:"value",source:i.ttAdapter(),templates:{header:"<h5>Owners</h5>"}},{name:"pin",displayKey:"value",source:j.ttAdapter(),templates:{header:"<h5>PIN</h5>"}},{name:"reid",displayKey:"value",source:k.ttAdapter(),templates:{header:"<h5>Real Estate ID</h5>"}},{name:"streetname",displayKey:"value",source:l.ttAdapter(),templates:{header:"<h5>Street</h5>"}}).on("typeahead:selected",g);var m=function(b){angular.forEach(a.tabs,function(a){a.highlighted=!1}),b.highlighted=!0},n=function(b){switch(b.title){case"Results":break;case"Info":break;case"Photos":a.property.getPhotos(a.account.reid).then(function(b){a.photos=b.Photos});break;case"Deeds":a.property.getDeeds(a.account.reid).then(function(b){a.deeds=b.Deeds,a.plats=[],angular.forEach(a.deeds,function(b){b.bomDocNum&&a.plats.push(b)})});break;case"Tax Info":break;case"Services":break;case"Addresses":a.property.getAddresses(a.account.pin,a.account.reid).then(function(b){a.addresses=b.Addresses})}};a.tabClicked=function(b){b.disabled||(a.tab=b,m(b),n(b))}}],link:function(a){a.tabs=[{icon:"list",title:"Results",highlighted:!0,disabled:!1,table:!0},{icon:"info-sign",title:"Info",highlighted:!1,disabled:!0,table:!0},{icon:"picture",title:"Photos",highlighted:!1,disabled:!0,table:!1},{icon:"file",title:"Deeds",highlighted:!1,disabled:!0,table:!1},{icon:"usd",title:"Tax Info",highlighted:!1,disabled:!0,table:!1},{icon:"flag",title:"Services",highlighted:!1,disabled:!0,table:!1},{icon:"home",title:"Addresses",highlighted:!1,disabled:!0,table:!0}],a.tab=a.tabs[0]}}}),angular.module("imapsNgApp").directive("propertyResults",function(){return{templateUrl:"sidePanel/propertySearch/propertyResults/propertyResults.html",restrict:"E",controller:["$scope","$timeout",function(a){a.accounts=[],a.resultClicked=function(b){a.account=b,a.tab=a.tabs[1],a.$broadcast("accountSelected",b)}}],link:function(){$("table").stickyTableHeaders()}}}),angular.module("imapsNgApp").directive("propertyInfo",function(){return{templateUrl:"sidePanel/propertySearch/propertyInfo/propertyInfo.html",restrict:"E",controller:["$scope","$filter",function(a,b){var c=function(c){a.accountInfo=[],a.tabChanged(!1),a.pin=c.pin,a.reid=c.reid,angular.forEach(a.fields,function(d){"currency"===d.type&&(c[d.field]=b("currency")(c[d.field],"$",0)),a.accountInfo.push({field:d.alias,value:c[d.field]})})};a.account&&!a.accountInfo&&c(a.account),a.$on("accountSelected",function(a,b){c(b)})}],link:function(){}}}),angular.module("imapsNgApp").directive("propertyPhotos",function(){return{templateUrl:"sidePanel/propertySearch/propertyPhotos/propertyPhotos.html",restrict:"E",controller:["$scope",function(){}],link:function(){}}}),angular.module("imapsNgApp").directive("propertyDeeds",function(){return{templateUrl:"sidePanel/propertySearch/propertyDeeds/propertyDeeds.html",restrict:"E",controller:["$scope",function(a){console.log(a.deeds)}],link:function(){}}}),angular.module("imapsNgApp").directive("propertyTaxes",function(){return{templateUrl:"sidePanel/propertySearch/propertyTaxes/propertyTaxes.html",restrict:"E",controller:["$scope",function(){}],link:function(){}}}),angular.module("imapsNgApp").directive("propertyServices",function(){return{templateUrl:"sidePanel/propertySearch/propertyServices/propertyServices.html",restrict:"E",controller:["$scope",function(){}],link:function(){}}}),angular.module("imapsNgApp").directive("propertyAddresses",function(){return{templateUrl:"sidePanel/propertySearch/propertyAddresses/propertyAddresses.html",restrict:"E",controller:["$scope",function(){}],link:function(){}}}),angular.module("imapsNgApp").directive("locationSearch",function(){return{templateUrl:"sidePanel/locationSearch/locationSearch.html",restrict:"E",controller:["$scope",function(){}],link:function(){}}}),angular.module("imapsNgApp").directive("layerList",["$timeout","$window","$filter","legend","localStorageService",function(a,b,c,d){return{templateUrl:"sidePanel/layerList/layerList.html",restrict:"E",controller:["$scope",function(a){a.$watch("map",function(b){b&&(b.on("load",function(){}),a.layers=a.webmap.itemInfo.itemData.operationalLayers,angular.forEach(a.layers,function(b){d.getLegend(b.url,b.id).then(function(b){var d=c("filter")(a.layers,function(a){return a.id===b.id})[0];angular.forEach(d.resourceInfo.layers,function(a,c){b.layers[c]&&(a.legend=b.layers[c].legend)})})}),console.log(a.layers))}),a.layerToggle=function(b){b.visibility=!b.visibility,a.map.getLayer(b.id).setVisibility(b.visibility)},a.subLayerToggle=function(b,c){var d=[];c.defaultVisibility=!c.defaultVisibility,d=a.map.getLayer(b.id).visibleLayers,c.defaultVisibility?d.push(c.id):d.splice(d.indexOf(c.id),1),0===d.length&&(d=[-1]),a.map.getLayer(b.id).setVisibleLayers(d)},a.opacityChanged=function(b){a.map.getLayer(b.id).setOpacity(b.opacity)}}],link:function(c,d){var e=function(){{var a=document.getElementsByClassName("panel-heading");document.getElementsByClassName("panel-body")}if(a.length>0){var e=b.innerHeight;e-=a.length*a[0].offsetHeight,c.accordionHeight={height:e-d.parent().parent().parent().position().top-30+"px",overflow:"none"}}};a(e.bind(d),0);var f=angular.element(b);c.getWindowDimensions=function(){return{h:f.height(),w:f.width()}},c.$watch(c.getWindowDimensions,function(){e()},!0),f.bind("resize",function(){c.$apply()})}}}]).factory("legend",["$http","$q",function(a,b){function c(c,d){var e=b.defer();return a({method:"GET",url:c+"/legend",params:{f:"json"}}).success(function(a){a.id=d,e.resolve(a)}),e.promise}var d={getLegend:c};return d}]),angular.module("imapsNgApp").factory("config",["$http","$q",function(a,b){function c(c){var d=b.defer();return a({method:"GET",url:c}).success(d.resolve),d.promise}var d={loadConfig:c};return d}]),angular.module("imapsNgApp").factory("property",["$http","$q",function(a,b){function c(c,d){var e=b.defer();return a({method:"GET",url:i+"RealEstateSearch",params:{type:c,values:JSON.stringify(d),f:"json"}}).success(e.resolve),e.promise}function d(c){var d=b.defer();return a({method:"GET",url:i+"PhotoSearch",params:{reid:c,f:"json"}}).success(d.resolve),d.promise}function e(c){var d=b.defer();return a({method:"GET",url:i+"DeedSearch",params:{reid:c,f:"json"}}).success(d.resolve),d.promise}function f(c,d){var e=b.defer();return a({method:"GET",url:i+"AddressSearch",params:{pin:c,reid:d,f:"json"}}).success(e.resolve),e.promise}function g(c){var d=b.defer();return a({method:"POST",url:j+"/0/query",params:{where:c,returnGeometry:!0,outSR:4326,f:"json"}}).success(d.resolve),d.promise}var h={getRealEstate:c,getPhotos:d,getDeeds:e,getAddresses:f,getGeometryByPins:g},i="https://maps.raleighnc.gov/arcgis/rest/services/Parcels/MapServer/exts/PropertySOE/",j="https://maps.raleighnc.gov/arcgis/rest/services/Parcels/MapServer";return h}]);