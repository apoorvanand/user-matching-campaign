(function() {

	var labelHtml = '<span class="label label-info">{{category}}</span>';

	app.CategoriesView = function (id) {
	  this.el = $(id);
	  this.labelContainer = this.el.find('.label-container');
	  this.reloadBtn = this.el.find('.btn-success');

	  this.init();
	};

	app.CategoriesView.prototype.init = function () {
		var that = this;

		this.reloadBtn.click(function () {
			that.load();
		});

		that.load();
	};

	app.CategoriesView.prototype.load = function () {
		var that = this;

	    $.ajax({
			url: '/classifier.json',
			type: 'GET',
			dataType: 'json',
			success: function(data) {
				that.onLoad(data);
			}
		});
	};

	app.CategoriesView.prototype.onLoad = function (data) {
		var that = this;
	  	
	  	this.labelContainer.html('');

	  	$.each(data.classifier.classTotals, function (cat) {
	  		that.labelContainer.append(labelHtml.replace('{{category}}', cat));
	  	});
	}

})();