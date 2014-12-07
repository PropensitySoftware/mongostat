'use strict';

// Configuring the Mongostat module
angular.module('mongostat').run(['Menus',
	function(Menus) {
		// Set top bar menu items
		Menus.addMenuItem('topbar', 'MongoStat', 'mongostat', 'dropdown');
		Menus.addSubMenuItem('topbar', 'mongostat', 'Key Occurrences', 'mongostat/keyOccurrences');
	}
]);
