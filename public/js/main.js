var app = angular.module('iceApp', ['ngRoute']);

app.config(['$routeProvider', '$q', '$timeout', '$http', '$location', '$rootScope', function($routeProvider, $q, $timeout, $location, $rootScope) {

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
		resolve     : { loggedIn : checkLoggedin }
	})

	var checkLoggedin = function($q, $timeout, $http, $location, $rootScope) {
		console.log('check login')
	 	// Initialize a new promise 
	 	var deferred = $q.defer(); 
	 	// Make an AJAX call to check if the user is logged in 
	 	$http.get('/loggedIn').success(function(user) { 
	 		// Authenticated 
	 		if (user !== '0') deferred.resolve(); 
	 			// Not Authenticated 
	 		else { 
	 			$rootScope.message = 'You need to log in.'; 
	 			deferred.reject(); $location.url('/login'); 
	 		} 
	 	}); 
	 	return deferred.promise; 
	}; 

}]);

app.controller('mainController', ['$scope', '$http', '$location', function($scope, $http, $location) {

	$scope.createUser = function() {
		if ($scope.newUser.password !== $scope.newUser.passwordCheck) {
			alert('not the same');
			$scope.newUser.password = '';
			$scope.newUser.passwordCheck = '';
		}
		else {
			$http.post('/auth/register', $scope.newUser).then(function(response) {
				if (response.data.authorized) {
					$location.url('/profile.html');
				}
			});
		}
	};

}]);

app.controller('profileController', ['$scope', '$http', '$location', '$q', '$timeout', '$rootScope', function($scope, $http, $location, $q, $timeout, $rootScope) {

	$http.get('/api/profile').then(function(response) {
		$scope.user = response.data;
	})

	

}]);

