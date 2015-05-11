angular.module('imapsNgApp')
.directive('propertySearch', function () {
	return {
		templateUrl: 'sidePanel/propertySearch/propertySearch.html',
		restrict: 'E',
		controller: function ($scope, $rootScope, $timeout, property) {

			$scope.property = property;
			var url = "https://maps.raleighnc.gov/arcgis/rest/services/Parcels/MapServer/exts/PropertySOE/AutoComplete";
				
			var autocompleteFilter = function (response) {
				var data = [];
				if (response.Results.length > 0) {
					angular.forEach(response.Results, function (r) {
						data.push({value: r});
					});
				}
				return data;
			};

			var searchByValue = function () {

			}

			$scope.tabChanged = function (disable) {
				angular.forEach($scope.tabs, function (t, i) {
					if (i > 0) {
						t.disabled = disable;						
					}
					t.highlighted = false;
				});		
				$scope.tab.highlighted = true;

			}

			var valueSelected = function (a, b, c) {
				c = ((c === 'streetname') ? 'street name':c);
				$scope.property.getRealEstate(c, [b.value]).then(function (accounts) {
					$scope.fields = accounts.Fields;
					console.log(accounts.Accounts.length);
					$scope.accounts = accounts.Accounts;
					$rootScope.$broadcast('accountUpdate', $scope.accounts);
					if (accounts.Accounts.length === 1) {
						$scope.tab = $scope.tabs[1];
						$scope.pin = accounts.Accounts[0].pin;
						$scope.reid = accounts.Accounts[0].reid;
						$scope.account = accounts.Accounts[0];
						$rootScope.$broadcast('pinUpdate', $scope.pin);
				        $timeout(function () {
				        	$scope.$broadcast('accountSelected', accounts.Accounts[0]);
				    	});							
						$scope.tabChanged(false);
						
					} else {
						$scope.tab = $scope.tabs[0];
						$scope.tabChanged(true);
					}

				});
			}	

			var address = new Bloodhound({
				datumTokenizer: function (datum) {
			        return Bloodhound.tokenizers.whitespace(datum.value);
			    },
			    queryTokenizer: Bloodhound.tokenizers.whitespace,
				remote: {
					url: url + "?type=address&f=json",
					filter: autocompleteFilter,
					replace: function(url, uriEncodedQuery) {
						  uriEncodedQuery = uriEncodedQuery.replace(/\'/g, "''").toUpperCase();
					      var newUrl = url + '&input=' + uriEncodedQuery;
					      return newUrl;
					}
				}
			});
			var owner = new Bloodhound({
				datumTokenizer: function (datum) {
			        return Bloodhound.tokenizers.whitespace(datum.value);
			    },
			    queryTokenizer: Bloodhound.tokenizers.whitespace,
				remote: {
					url: url + "?type=owner&f=json",
					filter: autocompleteFilter,
					replace: function(url, uriEncodedQuery) {
						  uriEncodedQuery = uriEncodedQuery.replace(/\'/g, "''").toUpperCase();
					      var newUrl = url + '&input=' + uriEncodedQuery;
					      return newUrl;
					}
				}
			});
			var pin = new Bloodhound({
				datumTokenizer: function (datum) {
			        return Bloodhound.tokenizers.whitespace(datum.value);
			    },
			    queryTokenizer: Bloodhound.tokenizers.whitespace,
				remote: {
					url: url + "?type=pin&f=json&limit=5",
					filter: autocompleteFilter,
					replace: function(url, uriEncodedQuery) {
						  uriEncodedQuery = uriEncodedQuery.replace(/\'/g, "''").toUpperCase();
					      var newUrl = url + '&input=' + uriEncodedQuery;
					      return newUrl;
					}
				}
			});
			var reid = new Bloodhound({
				datumTokenizer: function (datum) {
			        return Bloodhound.tokenizers.whitespace(datum.value);
			    },
			    queryTokenizer: Bloodhound.tokenizers.whitespace,
				remote: {
					url: url + "?type=reid&f=json&limit=5",
					filter: autocompleteFilter,
					replace: function(url, uriEncodedQuery) {
						  uriEncodedQuery = uriEncodedQuery.replace(/\'/g, "''").toUpperCase();
					      var newUrl = url + '&input=' + uriEncodedQuery;
					      return newUrl;
					}
				}
			});
			var street = new Bloodhound({
				datumTokenizer: function (datum) {
			        return Bloodhound.tokenizers.whitespace(datum.value);
			    },
			    queryTokenizer: Bloodhound.tokenizers.whitespace,
				remote: {
					url: url + "?type=street name&f=json&limit=5",
					filter: autocompleteFilter,
					replace: function(url, uriEncodedQuery) {
						  uriEncodedQuery = uriEncodedQuery.replace(/\'/g, "''").toUpperCase();
					      var newUrl = url + '&input=' + uriEncodedQuery;
					      return newUrl;
					}
				}
			});
			address.initialize();
			owner.initialize();
			pin.initialize();
			reid.initialize();
			street.initialize();
/*			$scope.autocomplete = [
				{
					name: 'address',
					source: address.ttAdapter(),
					displayKey: 'value'
				}
			];*/
			$scope.autocomplete = {
				displayKey: 'value', 
				source: address.ttAdapter()
			};
			$scope.searchValue = null;
			$("#searchInput").typeahead({hint: true, highlight: true, minLength: 1}, 
				{name:'address', 
				displayKey:'value', 
				source:address.ttAdapter(),
				templates: {
					header: "<h5>Addresses</h5>"
				}},
				{name:'owner', 
				displayKey:'value', 
				source:owner.ttAdapter(),
				templates: {
					header: "<h5>Owners</h5>"
				}},
				{name:'pin', 
				displayKey:'value', 
				source:pin.ttAdapter(),
				templates: {
					header: "<h5>PIN</h5>"
				}},
				{name:'reid', 
				displayKey:'value', 
				source:reid.ttAdapter(),
				templates: {
					header: "<h5>Real Estate ID</h5>"
				}},
				{name:'streetname', 
				displayKey:'value', 
				source:street.ttAdapter(),
				templates: {
					header: "<h5>Street</h5>"
				}}).on("typeahead:selected", valueSelected);

				var highlightTab = function (tab) {
					angular.forEach($scope.tabs, function (t) {
						t.highlighted = false;
					});
					tab.highlighted = true;
				}

				var tabAction = function (tab) {
					switch (tab.title) {
						case "Results":
						break;
						case "Info":
						break;
						case "Photos":
							$scope.property.getPhotos($scope.account.reid).then(function (photos) {
								$scope.photos = photos.Photos;
							});							
						break;
						case "Deeds":
							$scope.property.getDeeds($scope.account.reid).then(function (deeds) {
								$scope.deeds = deeds.Deeds;
								$scope.plats = [];
								angular.forEach($scope.deeds, function (deed) {
									if (deed.bomDocNum) {
										$scope.plats.push(deed);
									}
								});								
							});							
						break;
						case "Tax Info":
						break;
						case "Services":
						break;
						case "Addresses":
							$scope.property.getAddresses($scope.account.pin, $scope.account.reid).then(function (addresses) {
								$scope.addresses = addresses.Addresses;
							});								
						break;
					}
				}

				$scope.tabClicked = function (tab) {
					if (!tab.disabled) {
							$scope.tab = tab;					
							highlightTab(tab);
							tabAction(tab);								

					
					}
				};


		},
		link: function (scope, element, attrs) {
			scope.tabs = [
				{icon: 'list', title:'Results', highlighted: true, disabled: false},
				{icon: 'info-sign', title:'Info', highlighted: false, disabled: true},
				{icon: 'picture', title:'Photos', highlighted: false, disabled: true},
				{icon: 'file', title:'Deeds', highlighted: false, disabled: true},
				{icon: 'usd', title:'Tax Info', highlighted: false, disabled: true},		
				{icon: 'flag', title:'Services', highlighted: false, disabled: true},		
				{icon: 'home', title:'Addresses', highlighted: false, disabled: true}		
			];
			scope.tab = scope.tabs[0];
		}
	}
});