angular.module('imapsNgApp')
.directive('printTool', function (cfpLoadingBar) {
	return {
		templateUrl: 'directives/toolPanel/printTool/printTool.html',
		restrict: 'E',
		controller: function ($scope, $rootScope, $filter, $http, $analytics) {
			
			$scope.printing = false;
			$scope.printAtts = false;
			$scope.printTitle = "";
			$scope.printFormats = [
				{value: 'PDF', label: 'PDF'},
				{value: 'JPG', label: 'Image'}
			];
			$scope.printFormat = $scope.printFormats[0];
			$scope.printSizes = [
				{value: '85x11', label:'8.5"x11"', dpi: 200},
				{value: '11x17', label:'11"x17"', dpi: 200},
				{value: '24x36', label:'24"x36"', dpi: 96}/*,
				{value: '36x48', label:'36"x48"'}*/
			];
			$scope.printSize = $scope.printSizes[0];
			$scope.printOrients = [
				{value: 'landscape', label:'Landscape'},
				{value: 'portrait', label:'Portrait'}
			];
			$scope.printOrient = $scope.printOrients[0];
			$scope.printScales = [
				{label: 'Current Scale', value: 0, current: true},
				{label: '1" = ' + "50'" , value: 600},
				{label: '1" = ' + "100'" , value: 1200},
				{label: '1" = ' + "200'" , value: 2400},
				{label: '1" = ' + "400'" , value: 4800},
				{label: '1" = ' + "800'" , value: 9600},
				{label: '1" = ' + "1,600'" , value: 17200},
				{label: '1" = ' + "3,200'" , value: 38400},
				{label: '1" = ' + "6,400'" , value: 76800},
				{label: '1" = ' + "12,800'" , value: 153600},
				{label: '1" = ' + "25,600'" , value: 307200},
				{label: 'Custom', value: undefined, custom: true}
			];
			$scope.printScale = $scope.printScales[0];

/*			var getGraphics = function (params) {
				var gl = $scope.map.getLayer('drawGraphics'),
					ptCnt = 0,
					lnCnt = 0,
					pyCnt = 0,
					lbCnt = 0,
					points = {geometryType: 'esriGeometryPoint', features: []},
					lines = {geometryType: 'esriGeometryPolyline', features: []},
					polygons = {geometryType: 'esriGeometryPolygon', features: []},
					labels = {geometryType: 'esriGeometryPoint', features: []};
				if (gl) {
					angular.forEach(gl.graphics, function (g) {
						switch (g.symbol.type) {
							case 'simplemarkersymbol':
								points.features.push({geometry: g.geometry, attributes: g.attributes});
								ptCnt += 1;
							break;
							case 'simplelinesymbol':
								lines.features.push({geometry: g.geometry, attributes: g.attributes});
								lnCnt += 1;
							break;
							case 'simplefillsymbol':
								polygons.features.push({geometry: g.geometry, attributes: g.attributes});
								pyCnt += 1;
							break;
							case 'textsymbol':
								labels.features.push({geometry: g.geometry, attributes: g.attributes});
								lbCnt += 1;
							break;
						}
					});
				}
				params['Graphic_Points'] = stringify(points);
				params['Graphic_Lines'] = stringify(lines);
				params['Graphic_Polygons'] = stringify(polygons);
				params['Graphic_Labels'] = stringify(labels);
				params['Graphics_Count'] = ptCnt + ';' + lnCnt + ';' + pyCnt + ';' + lbCnt + ';';
				return params;
			};*/

			var getAttributes = function () {
				var atts = "";
				if ($scope.$parent.accountInfo && $scope.printAtts) {
					angular.forEach($scope.$parent.accountInfo, function (info) {
						if (info.field != 'Crime' && info.field != 'Septic Permit' && info.field != 'Well Samples') {
							atts += info.field + ': ' + info.value + '\r\n';
						}
					});
				}

				return atts;
			};
			var getPins = function () {
				var pins = "";
				if ($scope.$parent.account) {
					pins += $scope.$parent.account.pin + ";";
				}
				if ($scope.accounts) {
					angular.forEach($scope.accounts, function (a, i) {
						if (i < $scope.accounts.length - 1) {
							pins += a.pin + ",";
						} else {
							pins += a.pin;
						}
					});
				}
				return pins;
			};

			var getScale = function (scaleUtils) {
				var scale = $scope.printScale.value;
				if ($scope.printScale.current) {
					scale = parseInt(scaleUtils.getScale($scope.map));
				} else if ($scope.printScale.custom) {
					scale = scale * 12;
				}
				return scale;
			};

			$scope.exportMap = function (map) {
				require(["esri/tasks/PrintTask", "esri/tasks/PrintParameters", "esri/tasks/PrintTemplate"], function(PrintTask, PrintParameters, PrintTemplate) {
					var printTask = new PrintTask($scope.config.tools.export.url);
					var template = new PrintTemplate();
					template.format = 'JPG';
					template.layout = 'MAP_ONLY';
					  template.exportOptions = {
					    width: map.width,
					    height: map.height,
					    dpi: 96
					  };					
					var params = new PrintParameters();
					params.map = map;
					params.template = template;
					cfpLoadingBar.start();
					$scope.printing = true;
					$scope.printMessage = "Generating Image...";
 					$analytics.eventTrack('Export Image');									
					printTask.execute(params, function (result) {
						window.open(result.url);
						cfpLoadingBar.complete();
						$scope.printing = false;
					}, function (error) {
						cfpLoadingBar.complete();
						$scope.printing = false;
					});
				});			
			};

			$scope.printPDF = function (map) {
				require(["esri/tasks/PrintTask", "esri/tasks/PrintParameters", "esri/tasks/PrintTemplate", "esri/geometry/scaleUtils"], function (PrintTask, PrintParameters, PrintTemplate, scaleUtils) {
					var printTask = new PrintTask("http://maps.raleighnc.gov/arcgis/rest/services/Geoprocessing/ExportWebMap/GPServer/Export%20Web%20Map", {async: true});
					var params = new PrintParameters();
					var attributes = getAttributes();
					params.map = map;
					var template = new PrintTemplate();
					template.format = "PDF";
					template.layout = $scope.printSize.value + "_" + $scope.printOrient.value + (($scope.$parent.accountInfo && $scope.printAtts) ? '_attributes': '' );
					template.layoutOptions = {
						titleText : $scope.printTitle,
						scalebarUnit: 'Feet',
						customTextElements: [
							{"title": $scope.printTitle},
							{"Fields": attributes}
						]
					};
					template.exportOptions = {
						dpi: $scope.printSize.dpi
					};		
					template.preserveScale = true;			
					template.outScale = getScale(scaleUtils);
					console.log(template.outScale);
					params.template = template;
					cfpLoadingBar.start();
					$scope.printing = true;
					$scope.printMessage = "Generating PDF...";
 					$analytics.eventTrack('Export PDF', {category: 'size', label: $scope.printSize.value});
 					$analytics.eventTrack('Export PDF', {category: 'layout', label: $scope.printOrient.value});
 					$analytics.eventTrack('Export PDF', {category: 'attributes', label: attributes != ""});						
					printTask.execute(params, function (result) {
						window.open(result.url);
						cfpLoadingBar.complete();
						$scope.printing = false;
					}, function (error) {
						cfpLoadingBar.complete();
						$scope.printing = false;
						console.log(error);
					});					
				});
			};

			$scope.printFormatChanged = function (format) {
				if (format === 'PDF') {
					$scope.tool.height = 325;
				} else if (format === 'Image') {
					$scope.tool.height = 150;
				}
			};


// 			$scope.printPDF = function (map, layers) {
// 				//$('#printBtn').button('loading');
// 				cfpLoadingBar.start();
// 				var layers = "";
// 				var sublayers = "";
// 				var opacities = "";
// 				var layerTypes = "";
// 				var defExps = "";
// 				angular.forEach($scope.webmap.itemInfo.itemData.baseMap.baseMapLayers, function (l) {
// 					var arr = l.url.split("/");
// 					var id = arr[arr.length - 2];
// 					console.log(id);
// 					layers += id +";";
// 					sublayers += ";";
// 					opacities += "1;";
// 					layerTypes += "tiled;";
// 					defExps += ";";
// 				});
// 				var visibleLyrs = $filter('filter')($scope.webmap.itemInfo.itemData.operationalLayers, function (l) {
// 					return l.visibility === true && l.resourceInfo.type != 'Feature Layer';
// 				});
// 				console.log(visibleLyrs);
// 				angular.forEach(visibleLyrs, function (l) {
// 					layers += l.id.split("_")[0] +";";
// 					opacities += 100 - (l.opacity*100) + ";";
// 					layerTypes += "dynamic;";
// 					defExps += ";";
// 					var visibleSubLyrs = $filter('filter')(l.resourceInfo.layers, function (sl) {
// 						return sl.defaultVisibility === true;
// 					});
// 					for (var i = 0; i < visibleSubLyrs.length; i++) {
// 						if (i === visibleSubLyrs.length - 1) {
// 							sublayers += visibleSubLyrs[i].id +";";
// 						} else {
// 							sublayers += visibleSubLyrs[i].id +",";
// 						}
// 					}
// 					if (visibleSubLyrs.length === 0) {
// 						sublayers += ";";
// 					}
// 				});
// 				require(["esri/geometry/scaleUtils", "esri/tasks/Geoprocessor"], function(scaleUtils, Geoprocessor) {
// 					var gp = new Geoprocessor($scope.config.tools.print.url);
// 					var attributes = getAttributes();
// 					var params = {
// 						Title: $scope.printTitle,
// 						Size: $scope.printSize.value,
// 						Orientation: $scope.printOrient.value,
// 						Services: layers,
// 						Types: layerTypes,
// 						"Visible_Layers": sublayers,
// 						"Definition_Expressions": defExps,
// 						"Transparency_Values": opacities,
// 						"Extent": $scope.map.extent.xmin +";" + $scope.map.extent.ymin +";" + $scope.map.extent.xmax +";" + $scope.map.extent.ymax +";",
// 						Scale: getScale(scaleUtils),
// 						PIN: getPins(),
// 						Attributes: attributes
// 					};

// 					params = getGraphics(params);
// 					$analytics.eventTrack('Export PDF', {category: 'size', label: $scope.printSize.value});
// 					$analytics.eventTrack('Export PDF', {category: 'layout', label: $scope.printOrient.value});
// 					$analytics.eventTrack('Export PDF', {category: 'graphics count', label: params['Graphics_Count']});	
// 					$analytics.eventTrack('Export PDF', {category: 'attributes', label: attributes != ""});						
// 					console.log(params);
// 					$scope.printing = true;
// 					gp.submitJob(params, function (info) {
						
// 						console.log(info);
// 						$scope.printing = false;
// 						cfpLoadingBar.complete();
// 						gp.getResultData(info.jobId, 'Output_URL', function (data) {
// 							window.open(data.value);
// /*							$http({
// 								method: 'GET',
// 								url: "scripts/downloadPdf.php",
// 								params: {
// 									url: data.value
// 								}
// 							});*/
// 						})
// 					}, function (info) {
// 						if (info.messages.length > 0) {
// 							$scope.printMessage = info.messages[info.messages.length - 1].description;
// 						}
						
// 					}, function (error) {
// 						$scope.printing = false;
// 					});
// 				});
// 			};

		},
		link: function (scope, element, attrs) {

		}
	}
});
