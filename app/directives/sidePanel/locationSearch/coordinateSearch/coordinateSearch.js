angular.module('imapsNgApp')
.directive('coordinateSearch', function () {
	return {
		templateUrl: 'directives/sidePanel/locationSearch/coordinateSearch/coordinateSearch.html',
		restrict: 'EA',
		controller: function ($scope, $rootScope) {

		},
		link: function (scope, element, attrs) {
			// scope.searches = [{label: 'For Property', value: 'property'}, {label: 'For Location', value: 'location'}];
			// scope.selectedSearch = scope.searches[0];
		}
	}
});
