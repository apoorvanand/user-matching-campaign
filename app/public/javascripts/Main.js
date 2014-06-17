(function() {

	var app = this.app = {};

	app.init = function() {

		this.catView = new app.CategoriesView('#categoriesView');
		this.searchView = new app.SearchView('#searchView');
		this.tweetView = new app.SearchView('#tweetView');

	};

	$(function() {
		app.init();
	});

})();