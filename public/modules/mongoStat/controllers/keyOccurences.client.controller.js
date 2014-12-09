'use strict';

angular.module('mongostat').controller('KeyOccurrencesController', ['$scope', '$stateParams', '$location', 'Authentication', 'Mongostat',
	function($scope, $stateParams, $location, Authentication, Mongostat) {
		$scope.authentication = Authentication;

		$scope.query = function() {

			$scope.results = Mongostat.keyOccurrences(
				{
					database: $scope.database,
					collection: $scope.collection,
					host: $scope.host
				}

			);
			$scope.lastSearchTime = new Date();
			$scope.lastSearch = [$scope.host, $scope.database, $scope.collection].join('/');
		};

		$scope.collections = [];
		$scope.databases = [];
		$scope.hosts = Mongostat.query();

		$scope.$watch('database', function(newVal) {
			$scope.collections = newVal ? Mongostat.query({
				database: $scope.database,
				host: $scope.host
			}) : [];
		});

		$scope.$watch('host', function(newVal) {
			$scope.databases = newVal ? Mongostat.query({
				host: $scope.host
			}) : [];
		});


	}
]);
