var app = angular.module('iceApp', ['ngRoute']);

app.config(['$routeProvider', function($routeProvider) {

	$routeProvider.when('/', {
		templateUrl : '/html/welcome.html',
		controller  : 'mainController'
	})
	.when('/register.html', {
		templateUrl : '/html/register.html',
		controller  : 'mainController'
	})
	.when('/login.html', {
		templateUrl : '/html/login.html',
		controller  : 'mainController'
	})
	.when('/profile.html', {
		templateUrl : '/html/profile.html',
		controller 	: 'profileController',
	})

}]);

app.controller('mainController', ['$scope', '$http', '$location', function($scope, $http, $location) {

	$scope.createUser = function() {
		if ($scope.newUser.password !== $scope.newUser.passwordCheck) {
			alert('Passwords do not match, please try again');
			$scope.newUser.password = '';
			$scope.newUser.passwordCheck = '';
		}
		else {
			$http.post('/auth/register', $scope.newUser).then(function(response) {
				console.log(response.data)
				if (response.data.authorized) {
					$location.url('/profile.html');
				}
			});
		}
	};

	$scope.loginUser = function() {
		$http.post('auth/login', $scope.login).then(function(response) {
			if (response.data.error) {
				alert(response.data.error)
			}
			else if (response.data.authorized) {
				$location.url('/profile.html');
			}
		});
	};

	$scope.logout = function() {
		console.log('logging out')
		$http.post('auth/logout', $scope.user).then(function(response) {
			console.log(response.data);
			$location.url('/');
		});
	};

}]);

app.controller('profileController', ['$scope', '$http', '$location', function($scope, $http, $location) {

	$http.get('/api/profile').then(function(response) {
		console.log(response.data);
		if (response.data._id) {
			$scope.user = response.data;
		}
		else if (!response.data.authorized) {
			console.log('not auth')
			$location.url('/')
		}
	})

}]);

