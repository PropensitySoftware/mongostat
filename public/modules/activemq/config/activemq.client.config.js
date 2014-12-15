'use strict';

// Configuring the Mongostat module
angular.module('activemq').run(['Menus',
	function(Menus) {
		// Set top bar menu items
		Menus.addMenuItem('topbar', 'ActiveMQ', 'activemq', 'dropdown');
		Menus.addSubMenuItem('topbar', 'activemq', 'Queue Browser', 'browseQueues');
	}
]);
