angular.module('imapsNgApp')
.directive('drawTool', function () {
	return {
		templateUrl: 'directives/toolPanel/drawTool/drawTool.html',
		restrict: 'E',
		controller: function ($scope) {
			var toolbar, fill, line, marker, textSymbol, gl;
			$scope.drawText = '';
			var drawCompleted = function (e) {
				require(["esri/units", "esri/graphic", "esri/symbols/TextSymbol"], function(units, Graphic, TextSymbol)
				{
					var g = new Graphic(e.geometry);
					g.setAttributes({'GraphicsLayer': 'Drawing Graphics Layer'})
					if (e.geometry.type === 'polygon') {
						g.setSymbol(fill);
					} else if (e.geometry.type === 'polyline') {
						g.setSymbol(line);
					} else if (e.geometry.type === 'point') {
						if ($scope.drawType.name === 'Point') {
							g.setSymbol(marker);
						} else if ($scope.drawType.name === 'Text') {
							console.log($scope.drawText);
							var text = $("#drawText").val();
							textSymbol = new TextSymbol(
								{
								     "type": "esriTS",
								     "color": [255,0,0,255],
								     "backgroundColor": null,
								     "borderLineColor": null,
								     "verticalAlignment": "bottom",
								     "horizontalAlignment": "left",
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
										},
								      "haloColor": [255,255,255,255],
								      "haloSize": 1
								}
							);							
							textSymbol.setText(text);
							g.setSymbol(textSymbol);
							g.setAttributes({'GraphicsLayer': 'Drawing Graphics Layer', 'label': text})
						}
					}
					gl.add(g);
					$scope.map.reorderLayer(gl, $scope.map.layerIds.length - 1);
				});

			};
			var init = function () {
				require(["esri/toolbars/draw", "esri/layers/GraphicsLayer", "esri/symbols/SimpleMarkerSymbol", "esri/symbols/SimpleFillSymbol", "esri/symbols/SimpleLineSymbol", "esri/symbols/TextSymbol", "dojo/on"], function (Draw, GraphicsLayer, SimpleMarkerSymbol, SimpleFillSymbol, SimpleLineSymbol, TextSymbol, on) {
					gl = new GraphicsLayer({id: 'drawGraphics'});
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
					  "size": 10,
					  "angle": 0,
					  "xoffset": 0,
					  "yoffset": 0,
					  "type": "esriSMS",
					  "style": "esriSMSCircle",
					  "outline": {
					    "color": [255,255,255,255],
					    "width": 1,
					    "type": "esriSLS",
					    "style": "esriSLSSolid"
					  }
					});
					toolbar = new Draw($scope.map);
					toolbar.setFillSymbol(fill);
					toolbar.setLineSymbol(line);
					toolbar.setMarkerSymbol(marker);
					on(toolbar, 'draw-end', drawCompleted);
				});
			};

			$scope.undo = function () {
				gl.remove(gl.graphics[gl.graphics.length - 1]);
			};

			$scope.$watch('map', function (map) {
				if (map) {
					init();
				}
			});

			$scope.$watch('drawType', function (type) {
				if (type) {
					if (type.shape === 'polyline' || type.shape === 'polygon') {
						toolbar.activate((($scope.freehandDraw) ? 'freehand' : '') + type.shape);
					} else {
						toolbar.activate(type.shape);
					}
					$scope.tool.height = (type.name === 'Text') ? 250 : 165;
					//gl.clear();
				}
			});
			$scope.drawFreehand = function (type) {
				if (type.shape === 'polyline' || type.shape === 'polygon') {
					toolbar.activate((($scope.freehandDraw) ? 'freehand' : '') + type.shape);
				} else {
					toolbar.activate(type.shape);
				}		
			}

			$scope.$watch('tool', function (tool) {
				if (tool.title === 'Draw') {
					if (!toolbar) {
						toolbar = new Draw($scope.map);
					}
					if ($scope.drawType) {
						tool.height = ($scope.drawType.name === 'Text') ? 250 : 165;
					} else {
						tool.height = 165;
					}
				} else {
					if (toolbar) {
						toolbar.deactivate();
						$scope.drawType = null;
					}
				}
			});
		},
		link: function (scope, element, attrs) {

		}
	}
});
