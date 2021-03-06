'use strict';

// Init the application configuration module for AngularJS application
var ApplicationConfiguration = (function() {
	// Init module configuration options
	var applicationModuleName = 'mean';
	var applicationModuleVendorDependencies = ['ngResource', 'ngAnimate', 'ui.router', 'ui.bootstrap', 'ui.utils', 'datatables'];

	// Add a new vertical module
	var registerModule = function(moduleName, dependencies) {
		// Create angular module
		angular.module(moduleName, dependencies || []);

		// Add the module to the AngularJS configuration file
		angular.module(applicationModuleName).requires.push(moduleName);
	};

	return {
		applicationModuleName: applicationModuleName,
		applicationModuleVendorDependencies: applicationModuleVendorDependencies,
		registerModule: registerModule
	};
})();
'use strict';

//Start by defining the main module and adding the module dependencies
angular.module(ApplicationConfiguration.applicationModuleName, ApplicationConfiguration.applicationModuleVendorDependencies);

// Setting HTML5 Location Mode
angular.module(ApplicationConfiguration.applicationModuleName).config(['$locationProvider',
	function($locationProvider) {
		$locationProvider.hashPrefix('!');
	}
]);

//Then define the init function for starting up the application
angular.element(document).ready(function() {
	//Fixing facebook bug with redirect
	if (window.location.hash === '#_=_') window.location.hash = '#!';

	//Then init the app
	angular.bootstrap(document, [ApplicationConfiguration.applicationModuleName]);
});
'use strict';

// Use Applicaion configuration module to register a new module
ApplicationConfiguration.registerModule('activemq');

'use strict';

// Use Applicaion configuration module to register a new module
ApplicationConfiguration.registerModule('core');
'use strict';

// Use Applicaion configuration module to register a new module
ApplicationConfiguration.registerModule('dashboard');

'use strict';

// Use Applicaion configuration module to register a new module
ApplicationConfiguration.registerModule('mongostat');

'use strict';

// Use Applicaion configuration module to register a new module
ApplicationConfiguration.registerModule('users');
'use strict';

// Configuring the Mongostat module
angular.module('activemq').run(['Menus',
	function(Menus) {
		// Set top bar menu items
		Menus.addMenuItem('topbar', 'ActiveMQ', 'activemq', 'dropdown');
		Menus.addSubMenuItem('topbar', 'activemq', 'Queue Browser', 'activemq/browse');
	}
]);

'use strict';

// Setting up route
angular.module('activemq').config(['$stateProvider',
	function($stateProvider) {
		// state routing
		$stateProvider
		.state('browseQueues', {
			url: '/activemq/browse/:host/:queue',		
			views: {
				'' : {
					templateUrl: 'modules/activemq/views/browse.client.view.html'
				},
				'filter@' : {
					templateUrl: 'modules/activemq/views/filter.client.view.html'
				},
				'results@' : {
					templateUrl: 'modules/activemq/views/results.client.view.html'				
				}
				
			}
		})
		.state('selectQueues', {
			url: '/activemq/browse',
			templateUrl: 'modules/activemq/views/browse.client.view.html'
		})
		;
	}
]);

'use strict';

angular.module('activemq').controller('ActiveMQController', ['$scope', '$state', '$stateParams', '$location', 'Authentication', 'ActiveMQ',
	function($scope, $state, $stateParams, $location, Authentication, ActiveMQ) {
		$scope.authentication = Authentication;

		$scope.hosts = ActiveMQ.rest.hosts();

		$scope.parseQueueName = ActiveMQ.parseQueueName;

		$scope.$watch('host', function(newVal) {
			console.log(newVal);
			$scope.queues = newVal ? ActiveMQ.rest.query({
				host: $scope.host
			}) : [];
		});

		$scope.query = function() {
			$state.go('browseQueues', {
				host: $scope.host,
				queue: $scope.queue
			});
		};
		
		$scope.host = $stateParams.host ? $stateParams.host : '';
		$scope.queue = $stateParams.queue ? $stateParams.queue : '';
		
		if ($stateParams.host && $stateParams.queue) {
			$scope.results = ActiveMQ.rest.query({
				host: $scope.host,
				queue: $scope.queue
			});

			$scope.lastSearchTime = new Date();
			$scope.lastSearch = [$scope.host, ActiveMQ.parseQueueName($scope.queue)].join('/');
		}
		

	}
]);

'use strict';

//Articles service used for communicating with the articles REST endpoints
angular.module('activemq').factory('ActiveMQ', ['$resource',
	function($resource) {
		return {
			parseQueueName: function(queueName) {
				return queueName.match(/destinationName=([^,]*)/)[1];
			},
			rest: $resource('activemq/:host/queues/:queue', {}, {
				primaryQueueCount: {
					url: 'activemq/primary/counts',
					method: 'GET',
					isArray: true
				}, 
				hosts: {
					url: 'activemq/:host',
					method: 'GET',
					isArray: true			
				}
			})
		};
	}
]);

'use strict';

// Setting up route
/*
angular.module('core').config(['$stateProvider', '$urlRouterProvider',
	function($stateProvider, $urlRouterProvider) {
		// Redirect to home view when route not found
		$urlRouterProvider.otherwise('/');

		// Home state routing
		$stateProvider.
		state('home', {
			url: '/',
			templateUrl: 'modules/core/views/home.client.view.html'
		});
	}
]);
*/

'use strict';

angular.module('core').controller('HeaderController', ['$scope', 'Authentication', 'Menus',
	function($scope, Authentication, Menus) {
		$scope.authentication = Authentication;
		$scope.isCollapsed = false;
		$scope.menu = Menus.getMenu('topbar');

		$scope.toggleCollapsibleMenu = function() {
			$scope.isCollapsed = !$scope.isCollapsed;
		};

		// Collapsing the menu after navigation
		$scope.$on('$stateChangeSuccess', function() {
			$scope.isCollapsed = false;
		});
	}
]);
'use strict';


angular.module('core').controller('HomeController', ['$scope', 'Authentication',
	function($scope, Authentication) {
		// This provides Authentication context.
		$scope.authentication = Authentication;
	}
]);
'use strict';

//Menu service used for managing  menus
angular.module('core').service('Menus', [

	function() {
		// Define a set of default roles
		this.defaultRoles = ['*'];

		// Define the menus object
		this.menus = {};

		// A private function for rendering decision 
		var shouldRender = function(user) {
			if (user) {
				if (!!~this.roles.indexOf('*')) {
					return true;
				} else {
					for (var userRoleIndex in user.roles) {
						for (var roleIndex in this.roles) {
							if (this.roles[roleIndex] === user.roles[userRoleIndex]) {
								return true;
							}
						}
					}
				}
			} else {
				return this.isPublic;
			}

			return false;
		};

		// Validate menu existance
		this.validateMenuExistance = function(menuId) {
			if (menuId && menuId.length) {
				if (this.menus[menuId]) {
					return true;
				} else {
					throw new Error('Menu does not exists');
				}
			} else {
				throw new Error('MenuId was not provided');
			}

			return false;
		};

		// Get the menu object by menu id
		this.getMenu = function(menuId) {
			// Validate that the menu exists
			this.validateMenuExistance(menuId);

			// Return the menu object
			return this.menus[menuId];
		};

		// Add new menu object by menu id
		this.addMenu = function(menuId, isPublic, roles) {
			// Create the new menu
			this.menus[menuId] = {
				isPublic: isPublic || false,
				roles: roles || this.defaultRoles,
				items: [],
				shouldRender: shouldRender
			};

			// Return the menu object
			return this.menus[menuId];
		};

		// Remove existing menu object by menu id
		this.removeMenu = function(menuId) {
			// Validate that the menu exists
			this.validateMenuExistance(menuId);

			// Return the menu object
			delete this.menus[menuId];
		};

		// Add menu item object
		this.addMenuItem = function(menuId, menuItemTitle, menuItemURL, menuItemType, menuItemUIRoute, isPublic, roles, position) {
			// Validate that the menu exists
			this.validateMenuExistance(menuId);

			// Push new menu item
			this.menus[menuId].items.push({
				title: menuItemTitle,
				link: menuItemURL,
				menuItemType: menuItemType || 'item',
				menuItemClass: menuItemType,
				uiRoute: menuItemUIRoute || ('/' + menuItemURL),
				isPublic: ((isPublic === null || typeof isPublic === 'undefined') ? this.menus[menuId].isPublic : isPublic),
				roles: ((roles === null || typeof roles === 'undefined') ? this.menus[menuId].roles : roles),
				position: position || 0,
				items: [],
				shouldRender: shouldRender
			});

			// Return the menu object
			return this.menus[menuId];
		};

		// Add submenu item object
		this.addSubMenuItem = function(menuId, rootMenuItemURL, menuItemTitle, menuItemURL, menuItemUIRoute, isPublic, roles, position) {
			// Validate that the menu exists
			this.validateMenuExistance(menuId);

			// Search for menu item
			for (var itemIndex in this.menus[menuId].items) {
				if (this.menus[menuId].items[itemIndex].link === rootMenuItemURL) {
					// Push new submenu item
					this.menus[menuId].items[itemIndex].items.push({
						title: menuItemTitle,
						link: menuItemURL,
						uiRoute: menuItemUIRoute || ('/' + menuItemURL),
						isPublic: ((isPublic === null || typeof isPublic === 'undefined') ? this.menus[menuId].items[itemIndex].isPublic : isPublic),
						roles: ((roles === null || typeof roles === 'undefined') ? this.menus[menuId].items[itemIndex].roles : roles),
						position: position || 0,
						shouldRender: shouldRender
					});
				}
			}

			// Return the menu object
			return this.menus[menuId];
		};

		// Remove existing menu object by menu id
		this.removeMenuItem = function(menuId, menuItemURL) {
			// Validate that the menu exists
			this.validateMenuExistance(menuId);

			// Search for menu item to remove
			for (var itemIndex in this.menus[menuId].items) {
				if (this.menus[menuId].items[itemIndex].link === menuItemURL) {
					this.menus[menuId].items.splice(itemIndex, 1);
				}
			}

			// Return the menu object
			return this.menus[menuId];
		};

		// Remove existing menu object by menu id
		this.removeSubMenuItem = function(menuId, submenuItemURL) {
			// Validate that the menu exists
			this.validateMenuExistance(menuId);

			// Search for menu item to remove
			for (var itemIndex in this.menus[menuId].items) {
				for (var subitemIndex in this.menus[menuId].items[itemIndex].items) {
					if (this.menus[menuId].items[itemIndex].items[subitemIndex].link === submenuItemURL) {
						this.menus[menuId].items[itemIndex].items.splice(subitemIndex, 1);
					}
				}
			}

			// Return the menu object
			return this.menus[menuId];
		};

		//Adding the topbar menu
		this.addMenu('topbar');
	}
]);
'use strict';

// Configuring the Dashboard module
/*
angular.module('dashboard').run(['Menus',
	function(Menus) {
		// Set top bar menu items
		Menus.addMenuItem('topbar', 'ActiveMQ', 'activemq', 'dropdown');
		Menus.addSubMenuItem('topbar', 'activemq', 'Display Queues', 'activemq/display');
	}
]);
*/

'use strict';

// Setting up route
angular.module('dashboard').config(['$stateProvider', '$urlRouterProvider',
	function($stateProvider, $urlRouterProvider) {

		// Redirect to home view when route not found
		$urlRouterProvider.otherwise('/');

		// Home state routing
		$stateProvider
			.state('dashboard', {
				url: '/',
				views: {
					'': {
						templateUrl: 'modules/dashboard/views/dashboard.client.view.html'
					},
					'dailyCounts': {
						templateUrl: 'modules/dashboard/views/dailyCounts.client.view.html'
					},
					'activemq': {
						templateUrl: 'modules/dashboard/views/activemq/summary.client.view.html'
					},
					'activemqDetail': {
						templateUrl: 'modules/dashboard/views/activemq/detail.client.view.html'
					},					
					'mongo': {
						templateUrl: 'modules/dashboard/views/mongo/summary.client.view.html'
					},
					'mongoDetail': {
						templateUrl: 'modules/dashboard/views/mongo/detail.client.view.html'
					}
				}

			})
			;
	}
]);

'use strict';

angular.module('dashboard').controller('DashboardController', ['$scope', '$stateParams', '$location', 'Dashboard', 'ActiveMQ',
	function($scope, $stateParams, $location, Dashboard, ActiveMQ) {

		$scope.activemqHosts = Dashboard.activemq();
		$scope.mongoHosts = Dashboard.mongo();
		$scope.mongoTC = Dashboard.mongoTC();
		
		$scope.queues = ActiveMQ.rest.primaryQueueCount();

		$scope.parseQueueName = ActiveMQ.parseQueueName;		
		
	}
]);

'use strict';

//Articles service used for communicating with the articles REST endpoints
angular.module('dashboard').factory('Dashboard', ['$resource',
	function($resource) {
		return $resource('dashboard', {}, {

			activemq: {
				url: 'dashboard/activemq',
				method: 'GET',
				isArray: true
			},
			mongo: {
				url: 'dashboard/mongo',
				method: 'GET',
				isArray: true
			},
			mongoTC: {
				url: 'dashboard/mongo/tc',
				method: 'GET'
			}

		});
	}
]);

'use strict';

// Configuring the Mongostat module
angular.module('mongostat').run(['Menus',
	function(Menus) {
		// Set top bar menu items
		Menus.addMenuItem('topbar', 'Mongo', 'mongostat', 'dropdown');
		Menus.addSubMenuItem('topbar', 'mongostat', 'Key Occurrences', 'mongostat/keyOccurrences');
	}
]);

'use strict';

// Setting up route
angular.module('mongostat').config(['$stateProvider',
	function($stateProvider) {
		// Articles state routing
		$stateProvider.
		state('inputQuery', {
			url: '/mongostat/keyOccurrences',
			templateUrl: 'modules/mongoStat/views/keyOccurrences.client.view.html'
		});
	}
]);

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

'use strict';

//Articles service used for communicating with the articles REST endpoints
angular.module('mongostat').factory('Mongostat', ['$resource',
	function($resource) {
		return $resource('mongostat/:host/:database/:collection', {}, {
			keyOccurrences: {
				url: 'mongostat/:host/:database/:collection/keyOccurrences',
				isArray: true
			}
		});
	}
]);

'use strict';

// Config HTTP Error Handling
angular.module('users').config(['$httpProvider',
	function($httpProvider) {
		// Set the httpProvider "not authorized" interceptor
		$httpProvider.interceptors.push(['$q', '$location', 'Authentication',
			function($q, $location, Authentication) {
				return {
					responseError: function(rejection) {
						switch (rejection.status) {
							case 401:
								// Deauthenticate the global user
								Authentication.user = null;

								// Redirect to signin page
								$location.path('signin');
								break;
							case 403:
								// Add unauthorized behaviour 
								break;
						}

						return $q.reject(rejection);
					}
				};
			}
		]);
	}
]);
'use strict';

// Setting up route
angular.module('users').config(['$stateProvider',
	function($stateProvider) {
		// Users state routing
		$stateProvider.
		state('profile', {
			url: '/settings/profile',
			templateUrl: 'modules/users/views/settings/edit-profile.client.view.html'
		}).
		state('password', {
			url: '/settings/password',
			templateUrl: 'modules/users/views/settings/change-password.client.view.html'
		}).
		state('accounts', {
			url: '/settings/accounts',
			templateUrl: 'modules/users/views/settings/social-accounts.client.view.html'
		}).
		state('signup', {
			url: '/signup',
			templateUrl: 'modules/users/views/authentication/signup.client.view.html'
		}).
		state('signin', {
			url: '/signin',
			templateUrl: 'modules/users/views/authentication/signin.client.view.html'
		}).
		state('forgot', {
			url: '/password/forgot',
			templateUrl: 'modules/users/views/password/forgot-password.client.view.html'
		}).
		state('reset-invalid', {
			url: '/password/reset/invalid',
			templateUrl: 'modules/users/views/password/reset-password-invalid.client.view.html'
		}).
		state('reset-success', {
			url: '/password/reset/success',
			templateUrl: 'modules/users/views/password/reset-password-success.client.view.html'
		}).
		state('reset', {
			url: '/password/reset/:token',
			templateUrl: 'modules/users/views/password/reset-password.client.view.html'
		});
	}
]);

'use strict';

angular.module('users').controller('AuthenticationController', ['$scope', '$http', '$location', 'Authentication',
	function($scope, $http, $location, Authentication) {
		$scope.authentication = Authentication;

		// If user is signed in then redirect back home
		if ($scope.authentication.user) $location.path('/');

		$scope.signup = function() {
			$http.post('/auth/signup', $scope.credentials).success(function(response) {
				// If successful we assign the response to the global user model
				$scope.authentication.user = response;

				// And redirect to the index page
				$location.path('/');
			}).error(function(response) {
				$scope.error = response.message;
			});
		};

		$scope.signin = function() {
			$http.post('/auth/signin', $scope.credentials).success(function(response) {
				// If successful we assign the response to the global user model
				$scope.authentication.user = response;

				// And redirect to the index page
				$location.path('/');
			}).error(function(response) {
				$scope.error = response.message;
			});
		};
	}
]);

'use strict';

angular.module('users').controller('PasswordController', ['$scope', '$stateParams', '$http', '$location', 'Authentication',
	function($scope, $stateParams, $http, $location, Authentication) {
		$scope.authentication = Authentication;

		//If user is signed in then redirect back home
		if ($scope.authentication.user) $location.path('/');

		// Submit forgotten password account id
		$scope.askForPasswordReset = function() {
			$scope.success = $scope.error = null;

			$http.post('/auth/forgot', $scope.credentials).success(function(response) {
				// Show user success message and clear form
				$scope.credentials = null;
				$scope.success = response.message;

			}).error(function(response) {
				// Show user error message and clear form
				$scope.credentials = null;
				$scope.error = response.message;
			});
		};

		// Change user password
		$scope.resetUserPassword = function() {
			$scope.success = $scope.error = null;

			$http.post('/auth/reset/' + $stateParams.token, $scope.passwordDetails).success(function(response) {
				// If successful show success message and clear form
				$scope.passwordDetails = null;

				// Attach user profile
				Authentication.user = response;

				// And redirect to the index page
				$location.path('/password/reset/success');
			}).error(function(response) {
				$scope.error = response.message;
			});
		};
	}
]);
'use strict';

angular.module('users').controller('SettingsController', ['$scope', '$http', '$location', 'Users', 'Authentication',
	function($scope, $http, $location, Users, Authentication) {
		$scope.user = Authentication.user;

		// If user is not signed in then redirect back home
		if (!$scope.user) $location.path('/');

		// Check if there are additional accounts 
		$scope.hasConnectedAdditionalSocialAccounts = function(provider) {
			for (var i in $scope.user.additionalProvidersData) {
				return true;
			}

			return false;
		};

		// Check if provider is already in use with current user
		$scope.isConnectedSocialAccount = function(provider) {
			return $scope.user.provider === provider || ($scope.user.additionalProvidersData && $scope.user.additionalProvidersData[provider]);
		};

		// Remove a user social account
		$scope.removeUserSocialAccount = function(provider) {
			$scope.success = $scope.error = null;

			$http.delete('/users/accounts', {
				params: {
					provider: provider
				}
			}).success(function(response) {
				// If successful show success message and clear form
				$scope.success = true;
				$scope.user = Authentication.user = response;
			}).error(function(response) {
				$scope.error = response.message;
			});
		};

		// Update a user profile
		$scope.updateUserProfile = function(isValid) {
			if (isValid) {
				$scope.success = $scope.error = null;
				var user = new Users($scope.user);

				user.$update(function(response) {
					$scope.success = true;
					Authentication.user = response;
				}, function(response) {
					$scope.error = response.data.message;
				});
			} else {
				$scope.submitted = true;
			}
		};

		// Change user password
		$scope.changeUserPassword = function() {
			$scope.success = $scope.error = null;

			$http.post('/users/password', $scope.passwordDetails).success(function(response) {
				// If successful show success message and clear form
				$scope.success = true;
				$scope.passwordDetails = null;
			}).error(function(response) {
				$scope.error = response.message;
			});
		};
	}
]);
'use strict';

// Authentication service for user variables
angular.module('users').factory('Authentication', [
	function() {
		var _this = this;

		_this._data = {
			user: window.user
		};

		return _this._data;
	}
]);
'use strict';

// Users service used for communicating with the users REST endpoint
angular.module('users').factory('Users', ['$resource',
	function($resource) {
		return $resource('users', {}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);