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
	.when('/editprofile.html', {
		templateUrl : '/html/editprofile.html',
		controller  : 'editController'
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
		if (response.data._id) {
			$scope.user = response.data;
		}
		else if (!response.data.authorized) {
			console.log('not auth')
			$location.url('/')
		}
	});

	$scope.peopleForm = false;

	$scope.addPeople = function() {
		$scope.peopleForm = !$scope.peopleForm;
	};

	$scope.createReceiver = function() {
		$scope.peopleForm = false;
		$http.post('/api/addReceiver', $scope.receiver).then(function(response) {
			$scope.user = response.data;
		});
	};

	$scope.removeReceiver = function(index) {
		var remove = { remove : index };
		$http.post('/api/removeReceiver', remove).then(function(response) {
			$scope.user = response.data;
		});
	};

	$scope.toggleReceiverForm = function() {
		$scope.receiverForm = !$scope.receiverForm;
	}

	$scope.editReceiver = function(receiver, index) {
		$scope.receiverForm = false;
		var edit = {
			index : index,
			name  : receiver.name, 
			email : receiver.email,
			phone : receiver.phone,
		};
		$http.post('/api/editReceiver', edit).then(function(response) {
			console.log(response.data);
		})
	};

}]);

app.controller('editController', ['$scope', '$http', '$location', function($scope, $http, $location) {

	$http.get('/api/profile').then(function(response) {
		if (response.data._id) {
			$scope.editUser = response.data;
		}
		else if (!response.data.authorized) {
			$location.url('/')
		}
	});

	$scope.saveProfile = function() {
		$http.post('/api/saveEdit', $scope.editUser).then(function(response) {
			$location.url('/profile.html');
		});
	};

}]);

