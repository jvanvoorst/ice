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
	.when('/receivers.html', {
		templateUrl : '/html/receivers.html',
		controller : 'receiversController'
	})
	.when('/alerts.html', {
		templateUrl : '/html/alerts.html',
		controller : 'alertsController'
	})

}]);

//=============================Login - Register========================================================
app.controller('mainController', ['$scope', '$http', '$location', '$rootScope', function($scope, $http, $location, $rootScope) {

	$rootScope.usr = false;
	$scope.createUser = function() {
		if ($scope.newUser.password !== $scope.newUser.passwordCheck) {
			alert('Passwords do not match, please try again');
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
		$http.post('auth/logout', $scope.user).then(function(response) {
			$location.url('/');
		});
	};

}]);

//=============================Profile====================================================================
app.controller('profileController', ['$scope', '$http', '$location', '$rootScope', function($scope, $http, $location, $rootScope) {
	
	$rootScope.usr = true;
	// get user profile info
	$http.get('/api/profile').then(function(response) {
		if (response.data._id) {
			$scope.user = response.data;
		}
		else if (!response.data.authorized) {
			$location.url('/')
		}
	});

	$scope.toggleEditProfileForm = function() {
		$scope.editProfileForm = !$scope.editProfileForm;
		$http.get('/api/profile').then(function(response) {
			$scope.user = response.data;
		});
	};

	$scope.editProfile = function() {
		$scope.editProfileForm = !$scope.editProfileForm;
	};

	$scope.saveProfile = function() {
		$http.post('/api/editProfile', $scope.user).then(function(response) {
			$scope.toggleEditProfileForm();
			$scope.user = response.data;
		});
	};

}]);

//=============================Receivers====================================================================
app.controller('receiversController', ['$scope', '$http', '$location', '$rootScope', function($scope, $http, $location, $rootScope) {

	$rootScope.usr = true;
	// get receivers for logged in user
	$http.get('/api/userReceivers').then(function(response) {
		if (response.data.authorized === false) {
			$location.url('/')
		}
		else {
			$scope.receivers = response.data;
		}
	});

	$http.get('/api/profile').then(function(response) {
		$scope.user = response.data;
	});

	// set edit and add receiver forms to hidden and define toggle function to show
	$scope.editReceiverForm = false;
	$scope.addReceiverForm = false;
	$scope.toggleAddReceiverForm = function() {
		$scope.addReceiverForm = !$scope.addReceiverForm;
		$scope.receiver = {};
	};
	$scope.toggleEditReceiverForm = function() {
		$scope.editReceiverForm = !$scope.editReceiverForm;
		$http.get('/api/userReceivers').then(function(response) {
			$scope.receivers = response.data;
		});	
	};

	// add, remove and edit functions for Receivers
	$scope.addReceiver = function() {
		$scope.addReceiverForm = false;

		$scope.receiver.userID = $scope.user._id;

		$http.post('/api/addReceiver', $scope.receiver).then(function(response) {
			$scope.receivers = response.data;
			$scope.receiver = {};
		});
	};
	$scope.removeReceiver = function(index) {
		var remove = { id : $scope.receivers[index]._id };
		$http.post('/api/removeReceiver', remove).then(function(response) {
			$scope.receivers = response.data;
		});
	};

	$scope.editReceiver = function(receiver) {
		$scope.editReceiverForm = true;
		$scope.receiverEdit = receiver;
	};

	$scope.saveEditReceiver = function() {
		$scope.editReceiverForm = false;
		$http.post('/api/editReceiver', $scope.receiverEdit).then(function(response) {
			$scope.receivers = response.data;
		})
	}

}]);

//=============================Alerts====================================================================
app.controller('alertsController', ['$scope', '$http', '$location', '$rootScope', function($scope, $http, $location, $rootScope) {

	$rootScope.usr = true;
	// get alerts for logged in user
	$http.get('/api/userAlerts').then(function(response) {
		if (response.data.authorized === false) {
			$location.url('/');
		}
		else {
			$scope.alerts = response.data.map(function(entry) {
				entry.time = new Date(entry.time);
				return entry;
			});
		}
	});

	// get receivers for logged in user
	$http.get('/api/userReceivers').then(function(response) {
		$scope.receivers = response.data;
	});

	$http.get('/api/profile').then(function(response) {
		$scope.user = response.data;
	});

	// set edit and add alerts forms to hidden and define toggle function to show
	$scope.editAlertForm = false;
	$scope.addAlertForm = false;
	$scope.toggleAddAlertForm = function() {
		$scope.addAlertForm = !$scope.addAlertForm;
		$scope.alert = {};
		$scope.alert.active = true;
	};
	$scope.toggleEditAlertForm = function() {
		$scope.editAlertForm = !$scope.editAlertForm;
		$http.get('/api/userAlerts').then(function(response) {
			$scope.alerts = response.data.map(function(entry) {
				entry.time = new Date(entry.time);
				return entry;
			});
		});
	};

 	$scope.alertReceivers = [];

	//add, remove and edit functions for Alerts
	$scope.addAlert = function() {
		console.log('add alert')
		$scope.addAlertForm = false;
		$scope.alert.receivers = $scope.alertReceivers;
		$scope.alert.userID = $scope.user._id;
		$scope.alert.time = $scope.alert.time.getTime();
		$http.post('/api/addAlert', $scope.alert).then(function(response) {
			$scope.alerts = response.data.map(function(entry) {
				entry.time = new Date(entry.time);
				return entry
			});
		});
	};

	$scope.removeAlert = function(index) {
		var remove = { id : $scope.alerts[index]._id };
		$http.post('/api/removeAlert', remove).then(function(response) {
			$scope.alerts = response.data;
		});
	};
	$scope.editAlert = function(alert) {
		$scope.editAlertForm = true;
		$scope.alertEdit = alert;
	};

	$scope.saveEditAlert = function() {
		$scope.editAlertForm = false;
		$scope.alertEdit.time = $scope.alertEdit.time.getTime();
		$http.post('/api/editAlert', $scope.alertEdit).then(function(response) {
			$scope.alerts = response.data.map(function(entry) {
				entry.time = new Date(entry.time);
				return entry;	
			});
		});
	};

}]);

app.directive('checkList', function() {
	return {
	scope: {
  		list: '=checkList',
  		value: '@'
	},
	link: function(scope, elem, attrs) {
  		var handler = function(setup) {
    		var checked = elem.prop('checked');
    		var index = scope.list.indexOf(scope.value);

    		if (checked && index == -1) {
      			if (setup) elem.prop('checked', false);
     	 		else scope.list.push(scope.value);
    		} else if (!checked && index != -1) {
      			if (setup) elem.prop('checked', true);
     	 		else scope.list.splice(index, 1);
        	}
     	};
      
      	var setupHandler = handler.bind(null, true);
      	var changeHandler = handler.bind(null, false);
            
      	elem.on('change', function() {
        	scope.$apply(changeHandler);
      	});
	    	scope.$watch('list', setupHandler, true);
		}
	};
});
