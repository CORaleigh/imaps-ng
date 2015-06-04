angular.module('imapsNgApp')
.directive('drawTool', function () {
	return {
		templateUrl: 'toolPanel/drawTool/drawTool.html',
		restrict: 'E',
		controller: function ($scope) {
			var toolbar, fill, line, marker, textSymbol, gl;
			$scope.drawText = '';
			var drawCompleted = function (e) {
				require(["esri/units", "esri/graphic"], function(units, Graphic)
				{
					var g = new Graphic(e.geometry);
					if (e.geometry.type === 'polygon') {
						g.setSymbol(fill);

					} else if (e.geometry.type === 'polyline') {
						g.setSymbol(line);
					} else if (e.geometry.type === 'point') {
						if ($scope.drawType.name === 'Point') {
							g.setSymbol(marker);
						} else if ($scope.drawType.name === 'Text') {
							console.log($scope.drawText);
							textSymbol.setText($scope.drawText);
							g.setSymbol(textSymbol);
						}

					}
					//gl.clear();
					gl.add(g);
				});

			};
			var init = function () {
				require(["esri/toolbars/draw", "esri/layers/GraphicsLayer", "esri/symbols/SimpleMarkerSymbol", "esri/symbols/SimpleFillSymbol", "esri/symbols/SimpleLineSymbol", "esri/symbols/TextSymbol", "dojo/on"], function (Draw, GraphicsLayer, SimpleMarkerSymbol, SimpleFillSymbol, SimpleLineSymbol, TextSymbol, on) {
					gl = new GraphicsLayer();
					$scope.map.addLayer(gl);
					fill = new SimpleFillSymbol({
					  "type": "esriSFS",
					  "style": "esriSFSNull",
						"color": [31,117,254,40],
					    "outline": {
					     "type": "esriSLS",
					     "style": "esriSLSSolid",
							"color": [255,0,0,200],
					     "width": 3
						 }
					});
					line = new SimpleLineSymbol({
						"type": "esriSLS",
						"style": "esriSLSSolid",
						"color": [255,0,0,200],
						"width": 3
					});
					marker =  new SimpleMarkerSymbol({
					  "color": [255,0,0,200],
					  "size": 12,
					  "angle": 0,
					  "xoffset": 0,
					  "yoffset": 0,
					  "type": "esriSMS",
					  "style": "esriSMSCircle",
					  "outline": {
					    "color": [0,0,0,255],
					    "width": 1,
					    "type": "esriSLS",
					    "style": "esriSLSSolid"
					  }
					});
					textSymbol = new TextSymbol(
						{
						     "type": "esriTS",
						     "color": [255,0,0,255],
						     "backgroundColor": null,
						     "borderLineColor": null,
						     "verticalAlignment": "middle",
						     "horizontalAlignment": "center",
						     "rightToLeft": false,
						     "angle": 0,
						     "xoffset": 0,
						     "yoffset": 0,
						     "font": {
						      "family": "Arial",
						      "size": 12,
						      "style": "normal",
						      "weight": "bold",
						      "decoration": "none"
							}
						}
					);

					toolbar = new Draw($scope.map);
					toolbar.setFillSymbol(fill);
					toolbar.setLineSymbol(line);
					toolbar.setMarkerSymbol(marker);
					on(toolbar, 'draw-end', drawCompleted);
				});
			}

			$scope.$watch('map', function (map) {
				if (map) {
					init();
				}
			});

			$scope.$watch('drawType', function (type) {
				if (type) {
					toolbar.activate(type.shape);

					//gl.clear();
				}
			});

			$scope.$watch('tool', function (tool) {
				if (tool.title === 'Draw') {
					//tool.height = ($scope.geometry) ? 250 : 180;
					if (!toolbar) {
						toolbar = new Draw($scope.map);
					}
				} else {
					if (toolbar) {
						toolbar.deactivate();
						//$scope.selectType = '';
					}
				}
			});
		},
		link: function (scope, element, attrs) {

		}
	}
});
