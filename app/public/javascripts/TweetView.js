(function() {

	app.TweetView = function (id) {
		this.el = $(id);

		this.saveDirectTemplateBtn = this.el.find('#saveDirectTemplateBtn');
		this.saveMatchTemplateBtn = this.el.find('#saveMatchTemplateBtn');
		this.directTemplateInput   = this.el.find('#tweet-direct-template');
		this.matchTemplateInput   = this.el.find('#tweet-match-template');
		this.direct_button_send     = this.el.find('.btn-direct-send');
		this.match_button_send     = this.el.find('.btn-match-send');

		this.init();
	};

	app.TweetView.prototype.init = function () {
		var that = this;

		this.saveDirectTemplateBtn.click(function () {
			that.saveDirectTemplate();
		});

		this.saveMatchTemplateBtn.click(function () {
			that.saveMatchTemplate();
		});
		
		this.direct_button_send.click(function () {
			that.startDirectSend();
		});

		this.match_button_send.click(function () {
			that.startMatchSend();
		});

	};

	app.TweetView.prototype.saveDirectTemplate = function () {
		var that = this;

		var data = {
			template: this.directTemplateInput.val()
		};

		$.ajax({
			url: '/settings/template_direct',
			type: 'POST',
			data: data,
			dataType: 'json',
			success: function(data) {
				that.onUpdateDirectTemplateComplete(data);
			},
			error: function(data) {
				that.onUpdateDirectTemplateComplete(data);
			}
		});
	};

	app.TweetView.prototype.onUpdateDirectTemplateComplete = function (res) {
		var n = noty({
			text        : res.responseText,
			type        : 'success',
			dismissQueue: true,
			timeout: 2000,
			layout      : 'bottomLeft',
			theme       : 'defaultTheme'
		});
	};

	app.TweetView.prototype.saveMatchTemplate = function () {
		var that = this;

		var data = {
			template: this.matchTemplateInput.val()
		};

		$.ajax({
			url: '/settings/template_matches',
			type: 'POST',
			data: data,
			dataType: 'json',
			success: function(data) {
				that.onUpdateMatchTemplateComplete(data);
			},
			error: function(data) {
				that.onUpdateMatchTemplateComplete(data);
			}
		});
	};

	app.TweetView.prototype.onUpdateMatchTemplateComplete = function (res) {
		var n = noty({
			text        : res.responseText,
			type        : 'success',
			dismissQueue: true,
			timeout: 2000,
			layout      : 'bottomLeft',
			theme       : 'defaultTheme'
		});
	};
	

	app.TweetView.prototype.startDirectSend = function () {
		var that = this;

		$.ajax({
			url: '/sendDirect',
			type: 'GET',
			success: function(data) {
				that.onSendComplete(data);
			}
		});
	};

	app.TweetView.prototype.startMatchSend = function () {
		var that = this;

		$.ajax({
			url: '/send',
			type: 'GET',
			success: function(data) {
				that.onSendComplete(data);
			}
		});
	};

	app.TweetView.prototype.onSendComplete = function (res) {
	// do something
	console.log(res);
};

})();