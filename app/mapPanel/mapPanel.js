angular.module('imapsNgApp')
.directive('mapPanel', function () {
	return {
		templateUrl: 'mapPanel/mapPanel.html',
		restrict: 'E',
		controller: function ($scope, $rootScope, property) {
			$scope.property = property;
			require(["esri/map", "esri/arcgis/utils","esri/SpatialReference", "esri/layers/GraphicsLayer", "dojo/domReady!"], function(Map, arcgisUtils,SpatialReference, GraphicsLayer) { 
			    arcgisUtils.createMap("0757b2fd0e6f44dd8d8fefbfc09aa8eb","map").then(function(response){
			    	$scope.webmap = response;
			    	$scope.map = response.map;
			    	$scope.selectionMultiple = new GraphicsLayer();
			    	$scope.selectionSingle = new GraphicsLayer();
			    	$scope.map.addLayer($scope.selectionMultiple);
			    	$scope.map.addLayer($scope.selectionSingle);
			    	console.log(response);
			    	$scope.$digest();
			    });
			});	

			var addGeometriesToMap = function (features, gl, color) {
				require(["esri/graphic", "esri/graphicsUtils"], function (Graphic, graphicsUtils) {
					var g = null;
					gl.clear();
					$scope.selectionSingle.clear();
					angular.forEach(features, function (f) {
						g = new Graphic({geometry: f.geometry,
						    symbol:{color:[0,0,0,0],outline:{color:color,
						    width:3,type:"esriSLS",style:"esriSLSSolid"},
						    type:"esriSFS",style:"esriSFSSolid"}});

						gl.add(g);
					});
					$scope.map.setExtent(graphicsUtils.graphicsExtent(gl.graphics));
				});
			}

			$scope.$on('accountUpdate', function (e, accounts) {
				var pins = [];
				if (accounts) {
					angular.forEach(accounts, function (a) {
						pins.push("'" + a.pin + "'");
					});
					$scope.property.getGeometryByPins("PIN_NUM in (" + pins.toString() + ")" ).then(function (data) {
						addGeometriesToMap(data.features, $scope.selectionMultiple, [255,255,0]);
					});
				}
			});
			$scope.$on('pinUpdate', function (e, pin) {
				$scope.property.getGeometryByPins("PIN_NUM = '" + pin + "'" ).then(function (data) {
					addGeometriesToMap(data.features, $scope.selectionSingle, [255,0,0]);
				});				
			});
		},
		link: function (scope, element, attrs) {
		
		}
	}
});