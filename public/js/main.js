var app = angular.module('iceApp', ['ngRoute']);

app.config(['$routeProvider', function($routeProvider) {

	$routeProvider.when('/', {
		templateUrl : '/html/welcome.html',
		controller  : 'mainController'
	})
	$routeProvider.when('/register.html', {
		templateUrl : '/html/register.html',
		controller  : 'mainController'
	})
	$routeProvider.when('/login.html', {
		templateUrl : '/html/login.html',
		controller  : 'mainController'
	})

}]);

app.controller('mainController', ['$scope', '$http', function($scope, $http) {

	$scope.createUser = function() {
		if ($scope.newUser.password !== $scope.newUser.passwordCheck) {
			alert('not the same');
			$scope.newUser.password = '';
			$scope.newUser.passwordCheck = '';
		}
		else {

		}
	};

}]);

