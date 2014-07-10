(function() {

	app.TweetView = function (id) {
	  this.el = $(id);

	  this.saveTemplateBtn = this.el.find('#saveTemplateBtn');
	  this.templateInput   = this.el.find('#tweet-template');

	  this.init();
	};

	app.TweetView.prototype.init = function () {
		var that = this;

		this.saveTemplateBtn.click(function () {
			that.saveTemplate();
		});
	};

	app.TweetView.prototype.saveTemplate = function () {
		var that = this;

		var data = {
			template: this.templateInput.val()
		};

	    $.ajax({
			url: '/settings/template',
			type: 'POST',
			data: data,
			dataType: 'json',
			success: function(data) {
				that.onUpdateTemplateComplete(data);
			},
			error: function(data) {
				that.onUpdateTemplateComplete(data);
			}
		});
	};

	app.TweetView.prototype.onUpdateTemplateComplete = function (res) {
		var n = noty({
            text        : res.responseText,
            type        : 'success',
            dismissQueue: true,
            timeout: 2000,
            layout      : 'bottomLeft',
            theme       : 'defaultTheme'
        });
	};

})();