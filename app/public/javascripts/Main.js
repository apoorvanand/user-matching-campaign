(function() {

	var app = this.app = {};

	app.init = function() {

		this.actionsView     = new app.ActionsView('#actionsView');
		this.catView         = new app.CategoriesView('#categoriesView');
		this.searchView      = new app.SearchView('#searchView');
		this.directTweetView = new app.TweetView('#directTweetView');
		this.matchTweetView  = new app.TweetView('#matchTweetView');

	};

	$(function() {
		app.init();
	});

})();