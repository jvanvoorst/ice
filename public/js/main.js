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
	// get user profile info
	$http.get('/api/profile').then(function(response) {
		if (response.data._id) {
			$scope.user = response.data;
		}
		else if (!response.data.authorized) {
			$location.url('/')
		}
	});
	// get receivers for logged in user
	$http.get('/api/userReceivers').then(function(response) {
		$scope.receivers = response.data;
	});

	// get alerts for logged in user
	$http.get('/api/userAlerts').then(function(response) {
		$scope.alerts = response.data;
	});

	// set edit and add receiver forms to hidden and define toggle function to show
	$scope.editReceiverForm = false;
	$scope.addReceiverForm = false;
	$scope.toggleAddReceiverForm = function() {
		$scope.addReceiverForm = !$scope.addReceiverForm;
	};
	$scope.toggleEditReceiverForm = function() {
		$scope.editReceiverForm = !$scope.editReceiverForm;
	};

	// add, remove and edit functions for Receivers
	$scope.addReceiver = function() {
		$scope.addReceiverForm = false;

		$scope.receiver.userID = $scope.user._id;

		$http.post('/api/addReceiver', $scope.receiver).then(function(response) {
			$scope.receivers = response.data;
		});
	};
	$scope.removeReceiver = function(index) {
		var remove = { id : $scope.receivers[index]._id };
		$http.post('/api/removeReceiver', remove).then(function(response) {
			$scope.receivers = response.data;
		});
	};
	$scope.editReceiver = function(receiver, index) {
		$scope.editReceiverForm = false;
		var edit = {
			id : $scope.receivers[index]._id,
			name  : receiver.name, 
			email : receiver.email,
			phone : receiver.phone,
		};
		$http.post('/api/editReceiver', edit).then(function(response) {
			$scope.receivers = response.data;
		})
	};

	// set edit and add alerts forms to hidden and define toggle function to show
	$scope.editAlertForm = false;
	$scope.addAlertForm = false;
	$scope.toggleAddAlertForm = function() {
		$scope.addAlertForm = !$scope.addAlertForm;
	};
	$scope.toggleEditAlertForm = function() {
		$scope.editAlertForm = !$scope.editAlertForm;
	};

	//add, remove and edit functions for Alerts
	$scope.addAlert = function() {
		$scope.addAlertForm = false;
		$scope.alert.userID = $scope.user._id;
		$http.post('/api/addAlert', $scope.alert).then(function(response) {
			$scope.alerts = response.data;
		});
	};
	$scope.removeAlert = function(index) {
		var remove = { id : $scope.alerts[index]._id };
		$http.post('/api/removeAlert', remove).then(function(response) {
			$scope.alerts = response.data;
		});
	};
	$scope.editAlert = function(alert, index) {
		$scope.editAlertForm = false;
		var edit = {
			id : $scope.alerts[index]._id,
			trailHead  : alert.trailHead, 
			route : alert.route,
			time : alert.time,
		};
		$http.post('/api/editAlert', edit).then(function(response) {
			$scope.alerts = response.data;
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
		$http.post('/api/editProfile', $scope.editUser).then(function(response) {
			$location.url('/profile.html');
		});
	};

}]);

