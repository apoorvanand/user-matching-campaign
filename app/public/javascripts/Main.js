(function() {

	var app = this.app = {};

	app.init = function() {

		this.actionsView = new app.ActionsView('#actionsView');
		this.catView = new app.CategoriesView('#categoriesView');
		this.searchView = new app.SearchView('#searchView');
		this.tweetView = new app.TweetView('#tweetView');

	};

	$(function() {
		app.init();
	});

})();