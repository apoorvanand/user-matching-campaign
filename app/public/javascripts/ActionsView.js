(function() {

	app.ActionsView = function (id) {
	  this.el = $(id);
	  //this.startBtn = this.el.find('.btn-success');
	  this.button_search   = this.el.find('.btn-search');
	  this.button_export   = this.el.find('.btn-export');
	  this.button_classify = this.el.find('.btn-classify');
	  this.button_match    = this.el.find('.btn-match');
	  this.button_send     = this.el.find('.btn-send');

	  this.init();
	};

	app.ActionsView.prototype.init = function () {
		var that = this;

		this.button_search.click(function () {
			that.startSearch();
		});

		this.button_export.click(function () {
			that.startExport();
		});		

		this.button_classify.click(function () {
			that.startClassify();
		});

		this.button_match.click(function () {
			that.startMatch();
		});

		this.button_send.click(function () {
			that.startSend();
		});
	};

	app.ActionsView.prototype.startSearch = function () {
		var that = this;

	    $.ajax({
			url: '/search',
			type: 'GET',
			success: function(data) {
				that.onSearchComplete(data);
			}
		});
	};

	app.ActionsView.prototype.onSearchComplete = function (res) {
		// do something
		console.log(res);
	};

	app.ActionsView.prototype.startExport = function () {
		var that = this;

		window.location.href = './export';
	};

	app.ActionsView.prototype.onExportComplete = function (res) {
		// do something
		console.log(res);
	};

	app.ActionsView.prototype.startClassify = function () {
		var that = this;

	    $.ajax({
			url: '/classify',
			type: 'GET',
			success: function(data) {
				that.onClassifyComplete(data);
			}
		});
	};

	app.ActionsView.prototype.onClassifyComplete = function (res) {
		// do something
		console.log(res);
	};

	app.ActionsView.prototype.startMatch = function () {
		var that = this;

	    $.ajax({
			url: '/match',
			type: 'GET',
			success: function(data) {
				that.onMatchComplete(data);
			}
		});
	};

	app.ActionsView.prototype.onMatchComplete = function (res) {
		// do something
		console.log(res);
	};

	app.ActionsView.prototype.startSend = function () {
		var that = this;

	    $.ajax({
			url: '/send',
			type: 'GET',
			success: function(data) {
				that.onSendComplete(data);
			}
		});
	};

	app.ActionsView.prototype.onSendComplete = function (res) {
		// do something
		console.log(res);
	};

})();
