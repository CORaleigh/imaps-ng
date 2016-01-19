//>>built
define("esri/tasks/GenerateRendererTask","require dojo/_base/declare dojo/_base/lang dojo/_base/array dojo/number dojo/_base/json dojo/_base/Deferred dojo/has ../kernel ../request ../deferredUtils ../urlUtils ../renderers/jsonUtils ./StatisticDefinition ./Task ./QueryTask ./query dojo/has!extend-esri?./GenerateRendererParameters dojo/has!extend-esri?./ClassificationDefinition dojo/has!extend-esri?./ClassBreaksDefinition dojo/has!extend-esri?./UniqueValueDefinition dojo/has!extend-esri?./ColorRamp dojo/has!extend-esri?./AlgorithmicColorRamp dojo/has!extend-esri?./MultipartColorRamp".split(" "),
function(t,m,l,q,n,u,r,v,w,x,y,z,A,s,B,C,D){m=m(B,{declaredClass:"esri.tasks.GenerateRendererTask",_eventMap:{complete:["renderer"]},constructor:function(a,d){l.isObject(a)&&("esri.layers.FeatureLayer"===a.declaredClass||"esri.layers.CSVLayer"===a.declaredClass)?a.url&&l.isString(a.url)&&"esri.layers.CSVLayer"!==a.declaredClass?(this.url=a.url,this._url=z.urlToObject(this.url),this._url.path+="/generateRenderer"):this._features=a.graphics:(this.url=a,this._url.path+="/generateRenderer");this._handler=
l.hitch(this,this._handler);this.source=d&&d.source;this.gdbVersion=d&&d.gdbVersion;this.checkValueRange=d&&d.checkValueRange;this.registerConnectEvents()},_handler:function(a,d,h,e,f){try{var c;"esri.renderer.ClassBreaksRenderer"===a.declaredClass||"esri.renderer.UniqueValueRenderer"===a.declaredClass?c=a:(c=A.fromJson(a),"classBreaks"===a.type&&c.setMaxInclusive(!0));if(this.checkValueRange){var k=new C(this.url),b=new D,g=new s;g.statisticType="min";g.onStatisticField=this._field;var p=new s;p.statisticType=
"max";p.onStatisticField=this._field;b.outStatistics=[g,p];k.execute(b).then(l.hitch(this,function(a){a=a.features[0].attributes;for(var b in a)if(0===b.toLowerCase().indexOf("min"))var d=a[b];else var e=a[b];c=this._processRenderer(c,this._prefix,this._unitLabel,this._formatLabel,this._precision,d,e);this._successHandler([c],"onComplete",h,f)}))}else c=this._processRenderer(c,this._prefix,this._unitLabel,this._formatLabel,this._precision),this._successHandler([c],"onComplete",h,f)}catch(E){this._errorHandler(E,
e,f)}},_processRenderer:function(a,d,h,e,f,c,k){"esri.renderer.ClassBreaksRenderer"===a.declaredClass?q.forEach(a.infos,function(b,g){0===g&&(void 0!==c&&null!==c)&&(b.minValue=c);g===a.infos.length-1&&(void 0!==k&&null!==k)&&(b.classMaxValue=b.maxValue=k);f&&(b.classMaxValue=b.maxValue=Math.round(b.maxValue/f)*f,b.minValue=Math.round(b.minValue/f)*f);e&&(b.label=n.format(b.minValue)+" - "+n.format(b.maxValue));d&&(b.label=d+" "+b.label);h&&(b.label=b.label+" "+h)}):q.forEach(a.infos,function(b,f){0===
f&&(void 0!==c&&null!==c)&&(b.value=c);f===a.infos.length-1&&(void 0!==k&&null!==k)&&(b.value=k);e&&(b.label=n.format(b.value));d&&(b.label=d+" "+b.label);h&&(b.label=b.label+" "+h)});return a},execute:function(a,d,h){var e,f=this._handler,c=this._errorHandler;this._precision=a.precision;this._prefix=a.prefix;this._unitLabel=a.unitLabel;this._formatLabel=a.formatLabel;if(this._features=a.features||this._features){e=new r;var k=this._features;t(["./generateRenderer"],function(b){var g;"esri.tasks.ClassBreaksDefinition"===
a.classificationDefinition.declaredClass?g=b.createClassBreaksRenderer({features:k,definition:a.classificationDefinition}):"esri.tasks.UniqueValueDefinition"===a.classificationDefinition.declaredClass&&(g=b.createUniqueValueRenderer({features:k,definition:a.classificationDefinition}));g?f(g,null,d,h,e):c(null,h,e)})}else{var b=l.mixin(a.toJson(),{f:"json"});this._field="esri.tasks.ClassBreaksDefinition"===a.classificationDefinition.declaredClass?a.classificationDefinition.classificationField:a.classificationDefinition.attributeField;
if(this.source){var g={source:this.source.toJson()};b.layer=u.toJson(g)}this.gdbVersion&&(b.gdbVersion=this.gdbVersion);e=new r(y._dfdCanceller);e._pendingDfd=x({url:this._url.path,content:b,callbackParamName:"callback",load:function(a,b){f(a,b,d,h,e)},error:function(a){c(a,h,e)}})}return e},onComplete:function(){}});v("extend-esri")&&l.setObject("tasks.GenerateRendererTask",m,w);return m});