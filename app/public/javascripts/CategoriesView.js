(function() {

	var labelHtml = '<span class="label label-info">{{category}}</span>';

	app.CategoriesView = function (id) {
	  this.el = $(id);
	  this.labelContainer = this.el.find('.label-container');
	  this.reloadBtn = this.el.find('.btn-success');
    this.button_classify = this.el.find('.btn-classify');
    this.button_match    = this.el.find('.btn-match');

	  this.init();
	};

	app.CategoriesView.prototype.init = function () {
		var that = this;

		this.reloadBtn.click(function () {
			that.load();
		});

    this.button_classify.click(function () {
      that.startClassify();
    });

    this.button_match.click(function () {
      that.startMatch();
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
	

  app.CategoriesView.prototype.startClassify = function () {
    var that = this;

      $.ajax({
      url: '/classify',
      type: 'GET',
      success: function(data) {
        that.onClassifyComplete(data);
      }
    });
  };

  app.CategoriesView.prototype.onClassifyComplete = function (res) {
    // do something
    console.log(res);
  };

  app.CategoriesView.prototype.startMatch = function () {
    var that = this;

      $.ajax({
      url: '/match',
      type: 'GET',
      success: function(data) {
        that.onMatchComplete(data);
      }
    });
  };

  app.CategoriesView.prototype.onMatchComplete = function (res) {
    // do something
    console.log(res);
  };


})();