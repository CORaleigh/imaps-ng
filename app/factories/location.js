angular.module('imapsNgApp').factory('locationFactory', ['$http', '$q', function($http, $q){

	var service = {getSubdivision:getSubdivision, getStreets:getStreets, getIntersectingStreets:getIntersectingStreets, geocodeAddress:geocodeAddress},
		baseUrl = "http://maps.raleighnc.gov/arcgis/rest/services/Parcels/MapServer/exts/PropertySOE/",
		serviceUrl = "http://maps.raleighnc.gov/arcgis/rest/services/Services/ServicesIMaps/MapServer",
		propertyLayer = "http://maps.raleighnc.gov/arcgis/rest/services/Parcels/MapServer";
	return service;
	function getSubdivision (subdivision) {
		var deferred = $q.defer();
		$http({
			method: 'GET',
			url: 'https://maps.raleighnc.gov/arcgis/rest/services/Planning/Subdivisions/MapServer/0/query',
			params: {
				where: "NAME LIKE '" + subdivision.toUpperCase() + "%'",
				orderByFields: 'NAME',
				outFields: 'NAME',
				returnGeometry: true,
				f: "json"
			}		
		}).success(deferred.resolve);
		return deferred.promise;
	};
	function getStreets (street) {
		var deferred = $q.defer();
		$http({
			method: 'GET',
			url: 'https://maps.raleighnc.gov/arcgis/rest/services/StreetsDissolved/MapServer/0/query',
			params: {
				where: "CARTONAME LIKE '" + street.toUpperCase() + "%'",
				orderByFields: 'CARTONAME',
				outFields: 'CARTONAME',
				returnGeometry: true,
				f: "json"
			}		
		}).success(deferred.resolve);
		return deferred.promise;
	};	
	function getIntersectingStreets (geom) {
		var deferred = $q.defer();
		$http({
			method: 'POST',
			url: 'https://maps.raleighnc.gov/arcgis/rest/services/StreetsDissolved/MapServer/0/query',
			data: $.param({
				geometry: JSON.stringify(geom),
				geometryType: 'esriGeometryPolyline',
				returnGeometry: false,
				outFields: 'CARTONAME',
				orderByFields: 'CARTONAME',
				f: "json"
			}),
        	headers: {'Content-Type': 'application/x-www-form-urlencoded'}
		}).success(deferred.resolve);
		return deferred.promise;
	};
	function geocodeAddress (address) {
		var deferred = $q.defer();
		$http({
			method: 'GET',
			url: 'https://maps.raleighnc.gov/arcgis/rest/services/Locators/Locator/GeocodeServer/findAddressCandidates',
			params: {
				'Single Line Input': address,
				returnGeometry: true,
				f: "json"
			}		
		}).success(deferred.resolve);
		return deferred.promise;
	};			
}]);
